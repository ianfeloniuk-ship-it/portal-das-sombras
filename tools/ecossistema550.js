/* ============================================================================
 * PRIMEVA v550 — SOLO VIVO, ECOGRID & TRILHAS POR PISOTEIO (DESIRE PATHS)
 * Arquivo: tools/ecossistema550.js
 * Direção e Criação: Ian Feloniuk
 * Revisão Estúdio Visual: 5 Especialistas (Skyrim × Primeva)
 *
 * REGRAS ARQUITETURAIS:
 * 1. EcoGrid por Chunk: Grade celular de 2.0m × 2.0m (32×32 células por chunk de 64m).
 *    Armazenamento em Uint8Array(32 * 32 * 4) = 4 KB por chunk.
 *    Canal 0 = Umidade (0–255)
 *    Canal 1 = Fertilidade (0–255)
 *    Canal 2 = Pisoteio (0–255)
 *    Canal 3 = Biomassa (0–255)
 * 2. Lei do Fator Limitante (Liebig) em Background Tick assíncrono (1–2 chunks/s, nunca a 60 Hz).
 *    fatorCrescimento = min(umidade, fertilidade) * (1.0 - pisoteio / 255.0).
 *    Pisoteio > 180: capim morre e abre trilha de terra batida / lama.
 *    Pisoteio < 80 & fatorCrescimento > 60: crescimento gradual até o teto do bioma.
 * 3. Shaders 3D:
 *    - Terreno: smoothstep(0.45, 0.75, pisoteio) misturando grama com terra batida / lama,
 *      escurecendo o solo com fertilidade e umidade.
 *    - Grama (InstancedMesh): altura Y multiplicada por clamp((biomassa / 100.0) * (1.0 - pisoteio * 0.85), 0.0, 1.4)
 *      com inclinação lateral ao passar.
 * 4. Crescimento de Árvores e Arbustos em 4 Estágios Reais + Toco (biomassa = 50):
 *    - Estágio 1 (Muda/Brote, biomassa 120–150): scale 0.25 a 0.50.
 *    - Estágio 2 (Árvore Jovem, biomassa 151–200): scale 0.55 a 0.85.
 *    - Estágio 3 (Árvore Adulta, biomassa 201–240): scale 0.90 a 1.15, gera serrapilheira (+2 fertilidade em 6m),
 *      fornece Toras de Madeira e Lenha.
 *    - Estágio 4 (Árvore Anciã, biomassa 241–255): scale 1.20 a 1.45, várzea/altíssima fertilidade intocada,
 *      madeira extra, sombra densa e resinas raras.
 * 5. IA de NPCs/Animais e Fendas:
 *    - Bônus de custo menor (-35%) para células vizinhas com pisoteio > 120 fora da estrada principal.
 *    - Fendas ativas degradam fertilidade e biomassa; fendas seladas recuperam a floresta nas chuvas.
 * ============================================================================ */
(function (global) {
  'use strict';

  const T = global.THREE;
  if (!T) return;

  const GRID_SIZE = 32;       // 32 x 32 células
  const CELL_SIZE = 2.0;      // 2.0m x 2.0m por célula
  const CHUNK_SIZE = 64.0;    // 64m chunk (CH)
  const TOTAL_CELLS = GRID_SIZE * GRID_SIZE; // 1024 células
  const BUFFER_SIZE = TOTAL_CELLS * 4;       // 4096 bytes (4 KB)

  // Precipitação e Fertilidade Base por Bioma
  const BIOME_ECO_CONFIG = {
    pantano:  { rain: 235, fert: 140, maxB: 210, name: 'Pântano' },
    floresta: { rain: 185, fert: 195, maxB: 255, name: 'Floresta' },
    flores:   { rain: 160, fert: 180, maxB: 245, name: 'Campos Floridos' },
    campos:   { rain: 135, fert: 150, maxB: 220, name: 'Campos' },
    cristal:  { rain: 100, fert: 65,  maxB: 140, name: 'Cristal' },
    neve:     { rain: 85,  fert: 75,  maxB: 130, name: 'Neve' },
    deserto:  { rain: 25,  fert: 30,  maxB: 70,  name: 'Deserto' },
    vulcao:   { rain: 15,  fert: 20,  maxB: 40,  name: 'Vulcão' }
  };

  // v566: gates, WX, npcs, run e WN são let/const do jogo (não existem em window): ler pelo escopo global de scripts
  function gv(n) {
    try {
      switch (n) {
        case 'gates': return gates;
        case 'WX': return WX;
        case 'npcs': return npcs;
        case 'run': return run;
        case 'WN': return WN;
        case 'scene': return scene;
      }
    } catch (_) {}
    return undefined;
  }

  const EcoGrid = global.EcoGrid = {
    version: 550,
    GRID_SIZE,
    CELL_SIZE,
    CHUNK_SIZE,
    chunks: new Map(),        // key -> { cx, cz, grid, texture, trees, dirty, lastTick }
    sealedZones: [],          // [{ x, z, r, targetFert, day }]
    activeRifts: [],
    queue: [],
    queueIdx: 0,
    lastTickTime: performance.now(),
    lastStampPos: { x: 0, z: 0 },
    initialized: false
  };

  /* ============================================================================
   * 1. INICIALIZAÇÃO DE ECOGRID POR CHUNK (Uint8Array 4 KB + DataTexture 32×32)
   * ============================================================================ */

  // Calcula umidade inicial baseada em lakeAt239, rios, mar e inclinação de terrH
  function computeInitialHumidity(wx, wz, bioKey) {
    const cfg = BIOME_ECO_CONFIG[bioKey] || BIOME_ECO_CONFIG.campos;
    let base = cfg.rain;

    // 1. Proximidade de Lagos (lakeAt239)
    let waterBonus = 0;
    try {
      if (typeof global.lakeAt239 === 'function') {
        const cx = Math.round(wx / CHUNK_SIZE), cz = Math.round(wz / CHUNK_SIZE);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dz = -1; dz <= 1; dz++) {
            const lk = global.lakeAt239(cx + dx, cz + dz);
            if (lk) {
              const d = Math.hypot(wx - lk.x, wz - lk.z);
              if (d <= lk.r + 2.0) {
                waterBonus = Math.max(waterBonus, 255);
              } else if (d < lk.r + 28.0) {
                const ratio = 1.0 - (d - lk.r) / 28.0;
                waterBonus = Math.max(waterBonus, Math.round(ratio * 210));
              }
            }
          }
        }
      }
    } catch (_) {}

    // 2. Rios e Costa do Mar
    try {
      if (global.TER245?.SEA439 && typeof global.TER245.SEA439.d === 'function') {
        const sd = global.TER245.SEA439.d(wx, wz);
        if (sd > -12.0) {
          const ratio = Math.max(0, Math.min(1, (sd + 12.0) / 40.0));
          waterBonus = Math.max(waterBonus, Math.round(180 + ratio * 75));
        }
      }
      if (typeof global.inWater244 === 'function' && global.inWater244(wx, wz)) {
        waterBonus = Math.max(waterBonus, 255);
      }
    } catch (_) {}

    // 3. Inclinação da normal de terrH(wx, wz)
    let slopeFactor = 1.0;
    try {
      if (typeof global.terrH === 'function') {
        const h0 = global.terrH(wx, wz);
        const hx = global.terrH(wx + 1.2, wz);
        const hz = global.terrH(wx, wz + 1.2);
        const slope = Math.hypot(hx - h0, hz - h0) / 1.2;
        // Encostas íngremes drenam a água (fator menor); vales planos retêm umidade
        if (slope > 0.6) {
          slopeFactor = Math.max(0.28, 1.0 - (slope - 0.6) * 0.75);
        } else if (slope < 0.15) {
          slopeFactor = 1.15; // vale/várzea plana
        }
      }
    } catch (_) {}

    const hum = Math.round(Math.max(base * 0.6, waterBonus > 0 ? waterBonus : base) * slopeFactor);
    return Math.max(5, Math.min(255, hum));
  }

  // Inicializa a fertilidade inicial da célula
  function computeInitialFertility(wx, wz, bioKey, humidity, hasTree) {
    const cfg = BIOME_ECO_CONFIG[bioKey] || BIOME_ECO_CONFIG.campos;
    let fert = cfg.fert;

    // Várzea / margem de água: solo aluvial fértil
    if (humidity > 180) fert += 35;
    // Presença de árvore adulta: matéria orgânica e serrapilheira
    if (hasTree) fert += 30;

    return Math.max(10, Math.min(255, fert));
  }

  EcoGrid.initChunk = function (ch) {
    if (!ch || ch.ecoGrid) return ch?.ecoGrid;
    const key = ch.key || (ch.cx + ',' + ch.cz);
    const x0 = ch.cx * CHUNK_SIZE;
    const z0 = ch.cz * CHUNK_SIZE;
    const minX = x0 - CHUNK_SIZE / 2;
    const minZ = z0 - CHUNK_SIZE / 2;

    const grid = new Uint8Array(BUFFER_SIZE);
    const trees = [];

    // Detectar bioma do centro do chunk
    const bioKey = typeof global.biomeAt === 'function' ? global.biomeAt(x0, z0) : 'campos';
    const cfg = BIOME_ECO_CONFIG[bioKey] || BIOME_ECO_CONFIG.campos;

    // Verificar se há árvores instanciadas neste chunk (v566: mesmos nomes que o survival437 usa; guarda as instâncias reais de cada árvore)
    const treePositions = [];
    const treeIdx = new Map();
    if (ch.group) {
      ch.group.traverse(o => {
        if (o.isInstancedMesh && TREE_KINDS.includes(o.userData?.tripo153)) {
          const m4 = new T.Matrix4(), pos = new T.Vector3(), scl = new T.Vector3();
          const full = o.userData.count415 ?? o.count;
          for (let i = 0; i < full; i++) {
            o.getMatrixAt(i, m4);
            pos.setFromMatrixPosition(m4);
            scl.setFromMatrixScale(m4);
            if (scl.y <= 0.1) continue;
            const k = Math.round(pos.x / 1.5) + ':' + Math.round(pos.z / 1.5);
            let tp = treeIdx.get(k);
            if (!tp) { tp = { x: pos.x, z: pos.z, refs: [], species: o.userData.tripo153 }; treeIdx.set(k, tp); treePositions.push(tp); }
            tp.refs.push({ o, i, m: m4.clone() });
          }
        }
      });
    }

    // Inicialização célula a célula
    for (let iz = 0; iz < GRID_SIZE; iz++) {
      for (let ix = 0; ix < GRID_SIZE; ix++) {
        const cellIdx = (iz * GRID_SIZE + ix) * 4;
        const wx = minX + (ix + 0.5) * CELL_SIZE;
        const wz = minZ + (iz + 0.5) * CELL_SIZE;

        const hasTree = treePositions.some(tp => Math.hypot(tp.x - wx, tp.z - wz) < 3.2);

        // canal 0: umidade
        const humidity = computeInitialHumidity(wx, wz, bioKey);
        grid[cellIdx + 0] = humidity;

        // canal 1: fertilidade
        const fertility = computeInitialFertility(wx, wz, bioKey, humidity, hasTree);
        grid[cellIdx + 1] = fertility;

        // canal 2: pisoteio (estradas começam pré-compactadas)
        let trample = 0;
        try {
          if (typeof global.roadSegs === 'function' && typeof global.onRoad === 'function') {
            const segs = global.roadSegs(wx, wz, 1);
            if (global.onRoad(segs, wx, wz, 3.2)) trample = 210;
          }
        } catch (_) {}
        grid[cellIdx + 2] = trample;

        // canal 3: biomassa
        let biomass = 0;
        if (hasTree) {
          biomass = 215; // Árvore Adulta inicial (Estágio 3)
        } else if (trample > 150) {
          biomass = 15;  // Estrada de terra batida (quase sem vegetação)
        } else {
          // Grama / mato natural baseado em fertilidade e ruído
          const n = typeof gv('WN') === 'function' ? gv('WN')(wx * 0.05, wz * 0.05) : 0.5;
          biomass = Math.max(30, Math.min(cfg.maxB, Math.round(fertility * 0.55 + n * 35)));
        }
        grid[cellIdx + 3] = biomass;
      }
    }

    // Criação da DataTexture WebGL 32×32 RGBA
    const texture = new T.DataTexture(grid, GRID_SIZE, GRID_SIZE, T.RGBAFormat, T.UnsignedByteType);
    texture.minFilter = T.LinearFilter;
    texture.magFilter = T.LinearFilter;
    texture.wrapS = T.ClampToEdgeWrapping;
    texture.wrapT = T.ClampToEdgeWrapping;
    texture.needsUpdate = true;

    ch.ecoGrid = grid;
    ch.ecoTexture = texture;
    ch.ecoDirty = false;
    ch.ecoTrees = trees;
    ch.ecoMinX = minX;
    ch.ecoMinZ = minZ;

    EcoGrid.chunks.set(key, ch);
    EcoGrid.queue.push(key);

    // Configurar árvores interativas com suporte aos 4 estágios + toco
    EcoGrid.setupChunkTrees(ch, treePositions);

    return grid;
  };

  EcoGrid.unloadChunk = function (ch) {
    if (!ch) return;
    const key = ch.key || (ch.cx + ',' + ch.cz);
    if (ch.ecoTexture) {
      try { ch.ecoTexture.dispose(); } catch (_) {}
      ch.ecoTexture = null;
    }
    if (ch.ecoTreeGroup) {
      if (ch.ecoTreeGroup.parent) ch.ecoTreeGroup.parent.remove(ch.ecoTreeGroup);
      ch.ecoTreeGroup = null;
    }
    ch.ecoTrees = [];
    ch.ecoGrid = null;
    EcoGrid.chunks.delete(key);
    const qIdx = EcoGrid.queue.indexOf(key);
    if (qIdx >= 0) EcoGrid.queue.splice(qIdx, 1);
  };

  /* ============================================================================
   * 2. SHADER DO TERRENO: DATA TEXTURE, PISOTEIO, FERTILIDADE E UMIDADE
   * ============================================================================ */

  // Injeção de GLSL no fragment shader do terreno
  const ECO_TERRAIN_FN = `
uniform sampler2D uEcoTex;
uniform vec2 uEcoOrigin;
`;

  const ECO_TERRAIN_COLOR = `
{
  vec2 ecoUV = clamp((terrainWorld128.xz - uEcoOrigin) / 64.0, 0.0, 1.0);
  vec4 ecoSample = texture2D(uEcoTex, ecoUV);
  float ecoHumidity = ecoSample.r;
  float ecoFertility = ecoSample.g;
  float ecoTrample = ecoSample.b;
  float ecoBiomass = ecoSample.a;

  // Trilhas por Pisoteio (Desire Paths):
  // Mistura suavemente textura de grama com terra batida / lama
  float pathK = smoothstep(0.45, 0.75, ecoTrample);
  if (pathK > 0.001) {
    vec3 dirtColor = vec3(0.42, 0.31, 0.18) * mix(0.75, 1.22, noise128(terrainWorld128.xz * 1.75));
    // Lama úmida escurece o solo da trilha
    dirtColor *= (1.0 - ecoHumidity * 0.28);
    diffuseColor.rgb = mix(diffuseColor.rgb, dirtColor, pathK * 0.94);
  }

  // Escurecimento orgânico do solo conforme fertilidade (matéria orgânica) e umidade
  float soilDarken = 1.0 - (ecoFertility * 0.16 + ecoHumidity * 0.20);
  diffuseColor.rgb *= soilDarken;
}
`;

  EcoGrid.createGroundMaterial = function (baseMaterial, ch) {
    if (!baseMaterial) return baseMaterial;
    const m = baseMaterial.clone();
    m.uniforms = T.UniformsUtils.clone(baseMaterial.uniforms || {});
    m.uniforms.uEcoTex = { value: ch.ecoTexture };
    m.uniforms.uEcoOrigin = { value: new T.Vector2(ch.ecoMinX, ch.ecoMinZ) };

    const origOnBeforeCompile = baseMaterial.onBeforeCompile; // v566: clone() não copia onBeforeCompile (perdia o shader de bioma)
    const baseKey = typeof m.customProgramCacheKey === 'function' ? m.customProgramCacheKey() : 'groundMat';

    m.onBeforeCompile = function (shader, renderer) {
      if (typeof origOnBeforeCompile === 'function') origOnBeforeCompile.call(this, shader, renderer);
      shader.uniforms.uEcoTex = m.uniforms.uEcoTex;
      shader.uniforms.uEcoOrigin = m.uniforms.uEcoOrigin;

      if (!shader.fragmentShader.includes('uEcoTex')) {
        shader.fragmentShader = ECO_TERRAIN_FN + shader.fragmentShader;
      }
      if (shader.fragmentShader.includes('#include <roughnessmap_fragment>') && !shader.fragmentShader.includes('ecoTrample')) {
        shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', ECO_TERRAIN_COLOR + '#include <roughnessmap_fragment>');
      }
    };
    m.customProgramCacheKey = () => baseKey + '-ecoGrid550';
    m.needsUpdate = true;
    return m;
  };

  /* ============================================================================
   * 3. SHADER DA GRAMA (InstancedMesh em grass446.js): ALTURA E INCLINAÇÃO
   * ============================================================================ */

  // v566: a grama (grass446.js) consulta EcoGrid.grassMul no próprio rebuild; o hook antigo mexia numa cópia que o loop nem chama
  EcoGrid.rev = 0;
  let lastRev = 0;
  EcoGrid.markGrass = function () {
    const now = performance.now();
    if (now - lastRev > 2000) { lastRev = now; EcoGrid.rev++; }
  };
  // multiplicador da altura do capim: biomassa/100 suprimido por pisoteio (limite 1.4)
  EcoGrid.grassMul = function (x, z) {
    const c = EcoGrid.getCellAt(x, z);
    if (!c) return 1;
    return Math.max(0, Math.min(1.4, (c.biomassa / 100) * (1 - c.pisoteio / 255 * 0.85) * (c.pisoteio > 150 ? 0.4 : 1)));
  };
  EcoGrid.hookGrass = function () {};

  /* ============================================================================
   * 4. CAMADA DE ÁRVORES E ARBUSTOS: CRESCIMENTO PROGRESSIVO EM 4 ESTÁGIOS + TOCO
   * ============================================================================ */

  // Geometrias e materiais compartilhados dos estágios
  const ZERO_M = new T.Matrix4().makeScale(0, 0, 0);
  const TREE_KINDS = ['oak', 'willow', 'fir', 'palm', 'dead', 'cherry', 'abeto', 'betula', 'brasa'];
  let GEO_STUMP = null;
  let GEO_SPROUT_STEM = null, GEO_SPROUT_LEAF = null;
  let GEO_YOUNG_TRUNK = null, GEO_YOUNG_CONE1 = null, GEO_YOUNG_CONE2 = null;
  let GEO_ADULT_TRUNK = null, GEO_ADULT_CROWN1 = null, GEO_ADULT_CROWN2 = null;
  let GEO_ANCIENT_TRUNK = null, GEO_ANCIENT_CROWN1 = null, GEO_ANCIENT_CROWN2 = null, GEO_ANCIENT_CROWN3 = null;
  let MAT_BARK = null, MAT_LEAVES = null, MAT_ANCIENT_LEAF = null;

  function ensureTreeGeometries() {
    if (GEO_STUMP) return;
    GEO_STUMP = new T.CylinderGeometry(0.38, 0.48, 0.42, 8);
    GEO_STUMP.translate(0, 0.21, 0);

    GEO_SPROUT_STEM = new T.CylinderGeometry(0.06, 0.10, 1.1, 6);
    GEO_SPROUT_LEAF = new T.ConeGeometry(0.55, 1.1, 6);

    GEO_YOUNG_TRUNK = new T.CylinderGeometry(0.18, 0.28, 3.8, 7);
    GEO_YOUNG_CONE1 = new T.ConeGeometry(1.6, 2.6, 7);
    GEO_YOUNG_CONE2 = new T.ConeGeometry(1.1, 2.0, 7);

    GEO_ADULT_TRUNK = new T.CylinderGeometry(0.42, 0.62, 5.6, 8);
    GEO_ADULT_CROWN1 = new T.ConeGeometry(2.8, 3.8, 8);
    GEO_ADULT_CROWN2 = new T.ConeGeometry(2.0, 3.0, 8);

    GEO_ANCIENT_TRUNK = new T.CylinderGeometry(0.85, 1.35, 7.5, 9);
    GEO_ANCIENT_CROWN1 = new T.DodecahedronGeometry(4.2, 1);
    GEO_ANCIENT_CROWN2 = new T.DodecahedronGeometry(3.2, 1);
    GEO_ANCIENT_CROWN3 = new T.DodecahedronGeometry(3.0, 1);

    MAT_BARK = new T.MeshStandardMaterial({ color: 0x543c26, roughness: 0.92, metalness: 0 });
    MAT_LEAVES = new T.MeshStandardMaterial({ color: 0x367a3b, roughness: 0.82, metalness: 0 });
    MAT_ANCIENT_LEAF = new T.MeshStandardMaterial({ color: 0x1d4a22, roughness: 0.78, metalness: 0 });
  }

  function makeSproutMesh() {
    const spr = new T.Group();
    const stem = new T.Mesh(GEO_SPROUT_STEM, MAT_BARK);
    stem.position.y = 0.55;
    const leaf = new T.Mesh(GEO_SPROUT_LEAF, MAT_LEAVES);
    leaf.position.y = 1.35;
    spr.add(stem, leaf);
    return spr;
  }

  function makeYoungMesh() {
    const yng = new T.Group();
    const yTrunk = new T.Mesh(GEO_YOUNG_TRUNK, MAT_BARK);
    yTrunk.position.y = 1.9;
    const yCone1 = new T.Mesh(GEO_YOUNG_CONE1, MAT_LEAVES);
    yCone1.position.y = 4.2;
    const yCone2 = new T.Mesh(GEO_YOUNG_CONE2, MAT_LEAVES);
    yCone2.position.y = 5.6;
    yng.add(yTrunk, yCone1, yCone2);
    return yng;
  }

  function makeAdultMesh() {
    const adl = new T.Group();
    const aTrunk = new T.Mesh(GEO_ADULT_TRUNK, MAT_BARK);
    aTrunk.position.y = 2.8;
    const aCrown1 = new T.Mesh(GEO_ADULT_CROWN1, MAT_LEAVES);
    aCrown1.position.y = 5.8;
    const aCrown2 = new T.Mesh(GEO_ADULT_CROWN2, MAT_LEAVES);
    aCrown2.position.y = 7.4;
    adl.add(aTrunk, aCrown1, aCrown2);
    return adl;
  }

  function makeAncientMesh() {
    const anc = new T.Group();
    const aTrunk = new T.Mesh(GEO_ANCIENT_TRUNK, MAT_BARK);
    aTrunk.position.y = 3.75;
    const aCrown1 = new T.Mesh(GEO_ANCIENT_CROWN1, MAT_ANCIENT_LEAF);
    aCrown1.position.y = 8.5;
    const aCrown2 = new T.Mesh(GEO_ANCIENT_CROWN2, MAT_ANCIENT_LEAF);
    aCrown2.position.set(1.5, 9.8, -0.8);
    const aCrown3 = new T.Mesh(GEO_ANCIENT_CROWN3, MAT_ANCIENT_LEAF);
    aCrown3.position.set(-1.4, 9.6, 1.1);
    anc.add(aCrown1, aCrown2, aCrown3); // v566: o tronco é o da árvore real (a copa extra só engrossa a sombra)
    return anc;
  }

  EcoGrid.setupChunkTrees = function (ch, treePositions) {
    ensureTreeGeometries();
    if (!treePositions || !treePositions.length || !ch.group) return;

    const H = (x, z) => typeof global.terrH === 'function' ? global.terrH(x, z) : 0;
    const treeGroup = new T.Group();
    treeGroup.name = 'EcoTrees_' + ch.key;
    treeGroup.userData.terrainAbsolute245 = true;
    // v566: fora do grupo do chunk, em coordenadas absolutas (o relevo só levanta sozinho os materiais do cenário; estes Mesh ficavam debaixo da terra)
    const sc = gv('scene');
    if (sc) sc.add(treeGroup); else ch.group.add(treeGroup);
    ch.ecoTreeGroup = treeGroup;

    for (const tp of treePositions) {
      const cell = EcoGrid.getCellAt(tp.x, tp.z);
      if (!cell) continue;

      const g = new T.Group();
      g.position.set(tp.x, H(tp.x, tp.z), tp.z);
      g.userData.treeX = tp.x;
      g.userData.treeZ = tp.z;
      treeGroup.add(g);

      const treeObj = {
        x: tp.x,
        z: tp.z,
        key: Math.round(tp.x) + ':' + Math.round(tp.z),
        group: g,
        chunkKey: ch.key,
        currentStage: 3, // Adulta por padrão (a árvore real do jogo)
        currentScale: 1.0,
        currentVisual: null,
        refs: tp.refs || [],
        species: tp.species,
        hidden: false,
        felled: false
      };
      ch.ecoTrees.push(treeObj);
      EcoGrid.updateTreeVisual(treeObj, cell.biomassa, cell.fertilidade);
    }
  };

  /* escala/esconde as instâncias reais da árvore (refs); k=1 restaura */
  function scaleRefs(treeObj, k) {
    if (treeObj.appliedK === k) return;
    if (!treeObj.scanned && k !== 1 && !treeObj.dynamic) {
      const refs = [], m4 = new T.Matrix4(), p3 = new T.Vector3(), s3 = new T.Vector3();
      const sc = gv('scene') || null;
      if (sc) sc.traverse(o => {
        if (!o.isInstancedMesh || !TREE_KINDS.includes(o.userData?.tripo153)) return;
        const full = Math.max(o.count, o.userData.count415 || 0);
        for (let n = 0; n < full; n++) {
          o.getMatrixAt(n, m4); p3.setFromMatrixPosition(m4); s3.setFromMatrixScale(m4);
          if (s3.y < 0.05 || Math.hypot(p3.x - treeObj.x, p3.z - treeObj.z) > 1.6) continue;
          refs.push({ o, i: n, m: m4.clone() });
        }
      });
      treeObj.refs = refs; treeObj.scanned = refs.length > 0;
    }
    const q4 = new T.Quaternion(), p4 = new T.Vector3(), s4 = new T.Vector3(), mk = new T.Matrix4();
    for (const r of treeObj.refs) {
      if (k === 1) r.o.setMatrixAt(r.i, r.m);
      else { r.m.decompose(p4, q4, s4); mk.compose(p4, q4, s4.multiplyScalar(Math.max(k, 0.001))); r.o.setMatrixAt(r.i, mk); }
      r.o.instanceMatrix.needsUpdate = true;
    }
    treeObj.appliedK = k;
  }

  /* estágio com modelo próprio: broto/jovem/morta (a árvore real some), adulta = a real (ou o modelo, se nasceu de semente), anciã = real um pouco maior */
  function applyStaged(treeObj, stage, biomass) {
    if (stage === 0 && treeObj.felled) return; /* o toco do lenhador é do survival437 */
    scaleRefs(treeObj, stage <= 2 ? 0 : stage === 4 ? 1.2 : 1);
    const H = Flora.altura(treeObj.species) * (0.85 + 0.3 * (Math.abs(Math.sin(treeObj.x * 7.31 + treeObj.z * 3.17)) % 1));
    let want = null, metros = H;
    if (stage === 0) { want = 'toco'; metros = (Flora.ESPECIES[treeObj.species] && Flora.ESPECIES[treeObj.species].toco) || 1.6; } /* v619: o modelo 'morta' do TRELLIS veio com placas brancas; árvore morta vira toco */
    else if (stage === 1) { want = 'broto'; metros = H * (0.1 + 0.08 * Math.max(0, Math.min(1, (biomass - 61) / 89))); }
    else if (stage === 2) { want = 'jovem'; metros = H * (0.38 + 0.22 * Math.max(0, Math.min(1, (biomass - 151) / 49))); }
    else if (treeObj.dynamic) { want = 'adulta'; metros = H * (stage === 4 ? 1.15 : 1); }
    const sig = want ? want + ':' + metros.toFixed(1) : '';
    treeObj.currentStage = stage;
    if (sig === treeObj.overlaySig) return;
    treeObj.overlaySig = sig;
    if (treeObj.overlay) { treeObj.group.remove(treeObj.overlay); treeObj.overlay = null; }
    if (typeof global.terrH === 'function') treeObj.group.position.y = global.terrH(treeObj.x, treeObj.z);
    if (want) Flora.overlay(treeObj.species, want, metros, m => { if (m && treeObj.overlaySig === sig) { treeObj.group.add(m); treeObj.overlay = m; } });
  }

  /* árvore nova (semente levada por animal): sem instância real, só o modelo do estágio */
  EcoGrid.addTree = function (x, z, species, biomass) {
    const ch = EcoGrid.getChunkAt(x, z); if (!ch || !ch.ecoGrid) return null;
    const cell = EcoGrid.getCellAt(x, z); if (!cell) return null;
    const sc = gv('scene'); if (!sc) return null;
    if (!ch.ecoTreeGroup) { const tg = new T.Group(); tg.userData.terrainAbsolute245 = true; sc.add(tg); ch.ecoTreeGroup = tg; ch.ecoTrees = ch.ecoTrees || []; }
    const g = new T.Group(); g.position.set(x, typeof global.terrH === 'function' ? global.terrH(x, z) : 0, z); ch.ecoTreeGroup.add(g);
    const t = { x, z, key: Math.round(x) + ':' + Math.round(z), group: g, chunkKey: ch.key, currentStage: 1, currentScale: 1, currentVisual: null, refs: [], species, hidden: false, felled: false, dynamic: true };
    cell.grid[cell.idx + 3] = biomass; ch.ecoTrees.push(t);
    EcoGrid.updateTreeVisual(t, biomass, cell.grid[cell.idx + 1]);
    return t;
  };
  EcoGrid.nearestAdult = function (x, z, r) {
    const ch = EcoGrid.getChunkAt(x, z); if (!ch || !ch.ecoTrees) return null;
    for (const t of ch.ecoTrees) if (t.currentStage >= 3 && !t.felled && Math.hypot(t.x - x, t.z - z) < r) return t;
    return null;
  };
  EcoGrid.nearestAny = function (x, z, r) {
    const ch = EcoGrid.getChunkAt(x, z); if (!ch || !ch.ecoTrees) return null;
    for (const t of ch.ecoTrees) if (Math.hypot(t.x - x, t.z - z) < r) return t;
    return null;
  };

  EcoGrid.updateTreeVisual = function (treeObj, biomass, fertility) {
    if (!treeObj || !treeObj.group) return;
    ensureTreeGeometries();

    let stage = 3;
    let targetScale = 1.0;
    let createVisual = null;

    if (biomass <= 60) {
      // Toco (após corte ou desmatamento intenso)
      stage = 0;
      targetScale = 1.0;
      createVisual = () => new T.Mesh(GEO_STUMP, MAT_BARK);
    } else if (biomass <= 150) {
      // Estágio 1: Brote / Muda (biomassa 120–150)
      stage = 1;
      const progress = Math.max(0, Math.min(1, (biomass - 120) / 30.0));
      targetScale = 0.15 + progress * 0.15; // 0.15 a 0.30 (v566: modelo real, pequeno)
      createVisual = makeSproutMesh;
    } else if (biomass <= 200) {
      // Estágio 2: Árvore Jovem (biomassa 151–200)
      stage = 2;
      const progress = Math.max(0, Math.min(1, (biomass - 151) / 49.0));
      targetScale = 0.35 + progress * 0.30; // 0.35 a 0.65 (v566)
      createVisual = makeYoungMesh;
    } else if (biomass <= 240 || fertility < 205) {
      // Estágio 3: Árvore Adulta (biomassa 201–240)
      stage = 3;
      const progress = Math.max(0, Math.min(1, (biomass - 201) / 39.0));
      targetScale = 0.90 + progress * 0.25; // 0.90 a 1.15
      createVisual = makeAdultMesh;
    } else {
      // Estágio 4: Árvore Anciã de Copa Densa (biomassa 241–255, solo intocado/alta fertilidade)
      stage = 4;
      const progress = Math.max(0, Math.min(1, (biomass - 241) / 14.0));
      targetScale = 1.20 + progress * 0.25; // 1.20 a 1.45
      createVisual = makeAncientMesh;
    }

    // v566 (Ian: sem formas geométricas): todos os estágios usam o modelo REAL da árvore do jogo, só muda a escala.
    // Muda/Jovem = árvore real pequena; Adulta = tamanho normal; Anciã = um pouco maior; Toco = some (o survival437 desenha o toco do lenhador).
    /* v619: espécies com modelo por estágio (tools/flora-regioes.js) trocam de modelo; as demais só mudam de escala */
    const staged = !!(treeObj.species && window.Flora && Flora.staged(treeObj.species));
    if (staged) { applyStaged(treeObj, stage, biomass); return; }
    const k = stage === 0 ? 0 : stage === 3 ? 1 : stage === 4 ? Math.min(1.2, targetScale) : targetScale;
    if (!(stage === 0 && treeObj.felled) && Math.abs(k - (treeObj.appliedK ?? 1)) > 0.02) {
      if (!treeObj.scanned && k !== 1) {
        // as instâncias mudam de malha (versão leve/perto): procura na cena, como o survival437 faz ao cortar
        const refs = [], m4 = new T.Matrix4(), p3 = new T.Vector3(), s3 = new T.Vector3();
        const sc = gv('scene') || null;
        if (sc) sc.traverse(o => {
          if (!o.isInstancedMesh || !TREE_KINDS.includes(o.userData?.tripo153)) return;
          const full = Math.max(o.count, o.userData.count415 || 0); // a malha 'perto' só conta as instâncias próximas
          for (let n = 0; n < full; n++) {
            o.getMatrixAt(n, m4); p3.setFromMatrixPosition(m4); s3.setFromMatrixScale(m4);
            if (s3.y < 0.05 || Math.hypot(p3.x - treeObj.x, p3.z - treeObj.z) > 1.6) continue;
            refs.push({ o, i: n, m: m4.clone() });
          }
        });
        treeObj.refs = refs;
        treeObj.scanned = refs.length > 0;
      }
      const q4 = new T.Quaternion(), p4 = new T.Vector3(), s4 = new T.Vector3(), mk = new T.Matrix4();
      for (const r of treeObj.refs) {
        if (k === 1) r.o.setMatrixAt(r.i, r.m);
        else {
          r.m.decompose(p4, q4, s4);
          // a escala encolhe em torno da base da árvore (y do tronco fica no chão)
          mk.compose(p4, q4, s4.multiplyScalar(Math.max(k, 0.001)));
          r.o.setMatrixAt(r.i, mk);
        }
        r.o.instanceMatrix.needsUpdate = true;
      }
      treeObj.appliedK = k;
    }
    if (stage >= 3) treeObj.felled = false;
    treeObj.currentStage = stage;
    treeObj.currentScale = k;
  };

  /* ============================================================================
   * 5. CORTE DE ÁRVORES COM MACHADO: TRANSIÇÃO PARA TOCO E LOOT POR ESTÁGIO
   * ============================================================================ */

  EcoGrid.onTreeChopped = function (wx, wz) {
    const ch = EcoGrid.getChunkAt(wx, wz);
    if (!ch) return null;

    const cell = EcoGrid.getCellAt(wx, wz);
    if (!cell) return null;

    const treeObj = (ch.ecoTrees || []).find(t => Math.hypot(t.x - wx, t.z - wz) < 4.0);
    const prevStage = treeObj ? treeObj.currentStage : (cell.biomassa > 240 ? 4 : 3);

    // Transição do estado para Toco (biomassa = 50)
    cell.biomassa = 50;
    cell.grid[cell.idx + 3] = 50;
    // Solo exposto perde fertilidade
    cell.fertilidade = Math.max(0, cell.fertilidade - 15);
    cell.grid[cell.idx + 1] = cell.fertilidade;
    ch.ecoDirty = true;
    ch.ecoTexture.needsUpdate = true;

    if (treeObj) {
      treeObj.felled = true; // o survival437 já escondeu a árvore e desenhou o toco
      EcoGrid.updateTreeVisual(treeObj, 50, cell.fertilidade);
    }

    return { stage: prevStage, x: wx, z: wz };
  };

  // Integração direta com survival437.js
  EcoGrid.hookSurvival = function () {
    const S437 = global.Surv437;
    if (!S437 || S437._ecoHooked) return;
    S437._ecoHooked = true;

    // Sobrescrever a regeneração de tocos para usar a biomassa real da EcoGrid
    if (typeof global.findNearestTree === 'function') {
      const origFind = global.findNearestTree;
      global.findNearestTree = function () {
        const best = origFind.apply(this, arguments);
        if (best) {
          const cell = EcoGrid.getCellAt(best.x, best.z);
          if (cell) {
            best.ecoBiomass = cell.biomassa;
            best.ecoStage = cell.biomassa <= 60 ? 0 : cell.biomassa <= 150 ? 1 : cell.biomassa <= 200 ? 2 : cell.biomassa <= 240 ? 3 : 4;
          }
        }
        return best;
      };
    }
  };

  /* ============================================================================
   * 6. BACKGROUND TICK ASSÍNCRONO (LEI DE LIEBIG, NÃO A 60 HZ)
   * ============================================================================ */

  EcoGrid.ecoTick = function () {
    // v566: descarrega chunks que o jogo já removeu por outro caminho (teleporte/continuar save)
    const gc = gameChunks();
    if (gc) for (const [k, c] of [...EcoGrid.chunks]) if (gc.get(k) !== c) EcoGrid.unloadChunk(c);
    if (!EcoGrid.queue.length) return;

    // Processa apenas 1 ou 2 chunks por ciclo (cravando 60 FPS no loop principal)
    const chunksToProcess = Math.min(2, EcoGrid.queue.length);

    for (let c = 0; c < chunksToProcess; c++) {
      EcoGrid.queueIdx = (EcoGrid.queueIdx + 1) % EcoGrid.queue.length;
      const key = EcoGrid.queue[EcoGrid.queueIdx];
      const ch = EcoGrid.chunks.get(key);
      if (!ch || !ch.ecoGrid) continue;

      const grid = ch.ecoGrid;
      const minX = ch.ecoMinX;
      const minZ = ch.ecoMinZ;
      const bioKey = typeof global.biomeAt === 'function' ? global.biomeAt(ch.cx * CHUNK_SIZE, ch.cz * CHUNK_SIZE) : 'campos';
      const cfg = BIOME_ECO_CONFIG[bioKey] || BIOME_ECO_CONFIG.campos;
      const isRaining = gv('WX')?.type === 'rain';

      // Posição de fendas ativas
      const activeRifts = (gv('gates') || []).filter(g => !g.dead && !g.cleared && !g.closed372);

      let gridChanged = false;
      // v620: células com broto plantado por animal crescem mesmo em solo pobre (neve, vulcão), mais devagar
      const seedCells = new Set();
      for (const t of ch.ecoTrees || []) if (t.dynamic && t.currentStage < 3) { const q = EcoGrid.getCellAt(t.x, t.z); if (q) seedCells.add(q.idx / 4); }

      // Simulação rápida em Uint8Array (1024 iterações = ~0.04 ms em JS moderno)
      for (let i = 0; i < TOTAL_CELLS; i++) {
        const idx = i * 4;
        let u = grid[idx + 0];
        let f = grid[idx + 1];
        let p = grid[idx + 2];
        let b = grid[idx + 3];

        const cx = i % GRID_SIZE;
        const cz = Math.floor(i / GRID_SIZE);
        const wx = minX + (cx + 0.5) * CELL_SIZE;
        const wz = minZ + (cz + 0.5) * CELL_SIZE;

        // Influência de Fendas Ativas (Miasma corruptor)
        let inRift = false;
        for (const g of activeRifts) {
          const rd = Math.hypot(wx - g.x, wz - g.z);
          const rRadius = 28 + (g.rank || 1) * 6;
          if (rd < rRadius) {
            inRift = true;
            // Queda acelerada de fertilidade e biomassa sob fenda ativa
            f = Math.max(0, f - 4);
            b = Math.max(10, b - 5);
            break;
          }
        }

        // Restauração de Fendas Seladas com as chuvas
        if (!inRift && EcoGrid.sealedZones.length > 0) {
          for (const sz of EcoGrid.sealedZones) {
            if (Math.hypot(wx - sz.x, wz - sz.z) < sz.r) {
              const boost = isRaining ? 6 : 2;
              f = Math.min(sz.targetFert, f + boost);
              b = Math.min(180, b + boost);
            }
          }
        }

        // 1. Serrapilheira & Várzea: sobe +2 por tick se houver árvore adulta num raio de 6m ou margem de rio
        const hasNearbyAdultTree = (ch.ecoTrees || []).some(t => t.currentStage >= 3 && Math.hypot(t.x - wx, t.z - wz) <= 6.0);
        const isVarzea = u > 180;

        if (hasNearbyAdultTree || isVarzea) {
          f = Math.min(255, f + 2);
        } else if (b < 40 || inRift) {
          // Solo desmatado/exposto cai -3 por tick
          f = Math.max(0, f - 3);
        }

        // 2. Desgaste / Recuperação do Pisoteio: sem tráfego, o solo descompacta devagar (-1 por tick)
        if (p > 0) {
          p = Math.max(0, p - 1);
        }

        // 3. Lei do Mínimo de Liebig: Fator Limitante do Crescimento
        const fatorCrescimento = Math.min(u, f) * (1.0 - p / 255.0);

        // Trilha batida intensa (pisoteio > 180): o capim morre rapidamente abrindo a trilha de terra
        if (seedCells.has(i)) {
          if (b < 240 && p < 80) b = Math.min(240, b + 2);
        } else if (p > 180) {
          b = Math.max(10, b - 14);
        } else if (p < 80 && fatorCrescimento > 60) {
          // Solo fértil e pouco pisoteado: vegetação se desenvolve até o teto do bioma e da fertilidade
          const maxAllowed = Math.min(cfg.maxB, Math.floor(f * 1.15));
          if (b < maxAllowed) {
            const growthStep = Math.max(1, Math.min(4, Math.floor(fatorCrescimento / 55.0)));
            b = Math.min(maxAllowed, b + growthStep);
          }
        }

        // Germinação natural de novas mudas próximas a árvores adultas (biomassa > 120)
        if (hasNearbyAdultTree && b >= 115 && b < 125 && p < 40 && f > 140) {
          b = 125; // Transição para Brote / Muda (Estágio 1)
        }

        grid[idx + 0] = u;
        grid[idx + 1] = f;
        grid[idx + 2] = p;
        grid[idx + 3] = b;
        gridChanged = true;
      }

      if (gridChanged) {
        ch.ecoTexture.needsUpdate = true;
        EcoGrid.markGrass();
      }

      // Atualizar o crescimento das árvores deste chunk
      if (ch.ecoTrees && ch.ecoTrees.length) {
        for (const tr of ch.ecoTrees) {
          const cell = EcoGrid.getCellAt(tr.x, tr.z);
          if (cell) {
            EcoGrid.updateTreeVisual(tr, cell.biomassa, cell.fertilidade);
          }
        }
      }
    }
  };

  /* ============================================================================
   * 7. PISOTEIO (DESIRE PATHS): COMPACTAÇÃO POR JOGADOR, CARRO, NPCS E ANIMAIS
   * ============================================================================ */

  EcoGrid.stamp = function (wx, wz, weight) {
    const ch = EcoGrid.getChunkAt(wx, wz);
    if (!ch || !ch.ecoGrid) return;

    const u = (wx - ch.ecoMinX) / CHUNK_SIZE;
    const v = (wz - ch.ecoMinZ) / CHUNK_SIZE;
    const cx = Math.floor(u * GRID_SIZE);
    const cz = Math.floor(v * GRID_SIZE);

    if (cx < 0 || cx >= GRID_SIZE || cz < 0 || cz >= GRID_SIZE) return;

    const idx = (cz * GRID_SIZE + cx) * 4;
    ch.ecoGrid[idx + 2] = Math.min(255, ch.ecoGrid[idx + 2] + weight);

    // Dispersão suave para células vizinhas (largura natural de trilha ~2m a 3m)
    const sideWeight = Math.round(weight * 0.35);
    if (sideWeight > 0) {
      for (const [dx, dz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nx = cx + dx, nz = cz + dz;
        if (nx >= 0 && nx < GRID_SIZE && nz >= 0 && nz < GRID_SIZE) {
          const sIdx = (nz * GRID_SIZE + nx) * 4;
          ch.ecoGrid[sIdx + 2] = Math.min(255, ch.ecoGrid[sIdx + 2] + sideWeight);
        }
      }
    }

    ch.ecoDirty = true;
  };

  // Loop leve de pisoteio para entidades ativas (executado a ~10 Hz)
  let lastStampUpdate = performance.now();
  EcoGrid.updateTrample = function () {
    const now = performance.now();
    if (now - lastStampUpdate < 100) return; // 10 Hz
    lastStampUpdate = now;

    if (typeof global.player === 'undefined' || !global.player || global.player.dead) return;

    // 1. Viajante (Jogador): +6 a pé, +10 correndo/sprint
    const P = global.player;
    const moved = Math.hypot(P.x - EcoGrid.lastStampPos.x, P.z - EcoGrid.lastStampPos.z);
    if (moved > 0.45) {
      EcoGrid.lastStampPos.x = P.x;
      EcoGrid.lastStampPos.z = P.z;
      const weight = P.sprint ? 10 : 6;
      EcoGrid.stamp(P.x, P.z, weight);
    }

    // 2. Carrinho de Carga (cart437): +12
    const cart = gv('run')?.cart437;
    if (cart && cart.built && cart.pulling) {
      EcoGrid.stamp(cart.x, cart.z, 12);
    }

    // 3. Carroças Comerciais (wagon369 / Civic343): +18
    if (global.Civic343?.wagons) {
      for (const w of global.Civic343.wagons) {
        if (!w.gone && !w.wreck && w.detailed369) {
          EcoGrid.stamp(w.x, w.z, 18);
        }
      }
    }

    // 4. Montarias e Manadas (Living372 / Cactoro372): +14
    if (global.Living372 && typeof global.Living372.riding === 'function' && global.Living372.riding()) {
      EcoGrid.stamp(P.x, P.z, 14);
    }

    // 5. Moradores e Guardas (vida523, npc482): +4
    const npcList = gv('npcs');
    if (Array.isArray(npcList)) {
      for (const n of npcList) {
        if (!n.gone && n.m && (n.vida523 || n.role482) && Math.hypot(n.x - P.x, n.z - P.z) < 65) {
          EcoGrid.stamp(n.x, n.z, 4);
        }
      }
    }

    // Upload das texturas modificadas para a GPU
    for (const ch of EcoGrid.chunks.values()) {
      if (ch.ecoDirty && ch.ecoTexture) {
        ch.ecoTexture.needsUpdate = true;
        ch.ecoDirty = false;
        EcoGrid.markGrass();
      }
    }
  };

  /* ============================================================================
   * 8. IA DE NPCS / ANIMAIS: NAVEGAÇÃO COM PREFERÊNCIA POR TRILHAS (DESIRE PATHS)
   * ============================================================================ */

  EcoGrid.findDesirePathHeading = function (startX, startZ, baseAngle, targetX, targetZ) {
    // Se já estiver na estrada pavimentada principal, segue reto
    try {
      if (typeof global.roadSegs === 'function' && typeof global.onRoad === 'function') {
        const segs = global.roadSegs(startX, startZ, 1);
        if (global.onRoad(segs, startX, startZ, 4.0)) return null;
      }
    } catch (_) {}

    const lookAhead = 2.4;
    let bestHeading = null;
    let bestCost = 1e9;
    const baseDist = Math.hypot(targetX - startX, targetZ - startZ);

    // Testar 5 ângulos em leque ao redor do rumo do alvo (-40°, -20°, 0°, +20°, +40°)
    for (const off of [-0.7, -0.35, 0.0, 0.35, 0.7]) {
      const ang = baseAngle + off;
      const testX = startX + Math.sin(ang) * lookAhead;
      const testZ = startZ + Math.cos(ang) * lookAhead;

      const cell = EcoGrid.getCellAt(testX, testZ);
      if (!cell) continue;

      const candDist = Math.hypot(targetX - testX, targetZ - testZ);
      // Não segue se estiver andando para trás
      if (candDist > baseDist + 0.5) continue;

      let cost = candDist;
      // Bônus de custo menor (-35%) para células vizinhas com pisoteio > 120 (trilha batida)
      if (cell.pisoteio > 120) {
        cost *= 0.65; // preferência clara por trilhas de pisoteio!
      }

      if (cost < bestCost) {
        bestCost = cost;
        bestHeading = ang;
      }
    }

    return bestHeading;
  };

  // Integração com steerNpc490
  EcoGrid.hookNpcSteering = function () {
    if (typeof global.steerNpc490 !== 'function' || global.steerNpc490._ecoHooked) return;
    const origSteer = global.steerNpc490;
    global.steerNpc490 = function (n, ux, uz, dt) {
      const res = origSteer.apply(this, arguments);
      if (res == null || !n || n.panic348) return res;

      // Se o NPC estiver fora da estrada, buscar preferência por trilha
      const desireAng = EcoGrid.findDesirePathHeading(n.x, n.z, res, n.tx, n.tz);
      return desireAng != null ? desireAng : res;
    };
    global.steerNpc490._ecoHooked = true;
  };

  /* ============================================================================
   * 9. REGISTRO E RESTAURAÇÃO DE FENDAS (RIFTS)
   * ============================================================================ */

  EcoGrid.onRiftSealed = function (gx, gz, rank) {
    const radius = 30 + (rank || 1) * 6;
    const bioKey = typeof global.biomeAt === 'function' ? global.biomeAt(gx, gz) : 'campos';
    const cfg = BIOME_ECO_CONFIG[bioKey] || BIOME_ECO_CONFIG.campos;
    EcoGrid.sealedZones.push({
      x: gx,
      z: gz,
      r: radius,
      targetFert: Math.max(195, cfg.fert + 20),
      day: typeof global.gameDay198 === 'function' ? global.gameDay198() : 1
    });

    if (typeof global.toast === 'function') {
      global.toast('<b>[ECOSSISTEMA]</b> A Fenda foi selada! As chuvas restaurarão o solo e a floresta renascerá.', 6000);
    }
  };

  /* ============================================================================
   * 10. UTILITÁRIOS DE CONSULTA ESPACIAL
   * ============================================================================ */

  EcoGrid.getChunkAt = function (wx, wz) {
    const cx = Math.round(wx / CHUNK_SIZE);
    const cz = Math.round(wz / CHUNK_SIZE);
    return EcoGrid.chunks.get(cx + ',' + cz);
  };

  EcoGrid.getCellAt = function (wx, wz) {
    const ch = EcoGrid.getChunkAt(wx, wz);
    if (!ch || !ch.ecoGrid) return null;

    const u = (wx - ch.ecoMinX) / CHUNK_SIZE;
    const v = (wz - ch.ecoMinZ) / CHUNK_SIZE;
    const cx = Math.floor(u * GRID_SIZE);
    const cz = Math.floor(v * GRID_SIZE);

    if (cx < 0 || cx >= GRID_SIZE || cz < 0 || cz >= GRID_SIZE) return null;

    const idx = (cz * GRID_SIZE + cx) * 4;
    return {
      grid: ch.ecoGrid,
      idx,
      umidade: ch.ecoGrid[idx + 0],
      fertilidade: ch.ecoGrid[idx + 1],
      pisoteio: ch.ecoGrid[idx + 2],
      biomassa: ch.ecoGrid[idx + 3]
    };
  };

  EcoGrid.getAt = function (wx, wz) {
    return EcoGrid.getCellAt(wx, wz);
  };

  EcoGrid.getTrampleAt = function (wx, wz) {
    const c = EcoGrid.getCellAt(wx, wz);
    return c ? c.pisoteio : 0;
  };

  /* ============================================================================
   * 11. WRAPPERS DE INTEGRAÇÃO COM MUNDO INFINITO (loadChunk / unloadChunk)
   * ============================================================================ */

  // v566: `chunks` do jogo é let (não existe em window): ler pelo escopo global de scripts
  function gameChunks() { try { return typeof chunks !== 'undefined' ? chunks : null; } catch (_) { return null; } }

  EcoGrid.attachChunk = function (ch) {
    if (!ch || ch.ecoGrid) return;
    EcoGrid.initChunk(ch);
    if (!ch.group) return;
    const groundMesh = ch.group.children.find(o => o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.width === CHUNK_SIZE) || ch.group.children[0];
    if (groundMesh && groundMesh.isMesh && groundMesh.material) {
      groundMesh.material = EcoGrid.createGroundMaterial(groundMesh.material, ch);
    }
  };

  EcoGrid.hookWorld = function () {
    if (typeof global.loadChunk === 'function' && !global.loadChunk._ecoHooked) {
      const origLoadChunk = global.loadChunk;
      global.loadChunk = function (cx, cz) {
        origLoadChunk.apply(this, arguments);
        EcoGrid.attachChunk(gameChunks()?.get(cx + ',' + cz));
      };
      global.loadChunk._ecoHooked = true;
    }

    if (typeof global.unloadChunk === 'function' && !global.unloadChunk._ecoHooked) {
      const origUnloadChunk = global.unloadChunk;
      global.unloadChunk = function (ch) {
        EcoGrid.unloadChunk(ch);
        return origUnloadChunk.apply(this, arguments);
      };
      global.unloadChunk._ecoHooked = true;
    }
  };

  /* ============================================================================
   * 12. CICLO DE VIDA DO ECOSSISTEMA
   * ============================================================================ */

  EcoGrid.init = function () {
    if (EcoGrid.initialized) return;
    EcoGrid.initialized = true;

    EcoGrid.hookWorld();
    { const gc = gameChunks(); if (gc) for (const ch of gc.values()) EcoGrid.attachChunk(ch); }
    EcoGrid.hookGrass();
    EcoGrid.hookSurvival();
    EcoGrid.hookNpcSteering();

    // Loop assíncrono de simulação ecológica (1–2 chunks/segundo = a cada 500 ms)
    setInterval(() => {
      try {
        EcoGrid.ecoTick();
      } catch (e) {
        console.warn('[EcoGrid] erro no ecoTick:', e);
      }
    }, 500);

    // Loop rápido de pisoteio (10 Hz = a cada 100 ms)
    setInterval(() => {
      try {
        EcoGrid.updateTrample();
      } catch (_) {}
    }, 100);

    // Observar fechamento de fendas em Civic343
    if (global.Civic343 && typeof global.Civic343.riftClosed === 'function') {
      const origClosed = global.Civic343.riftClosed;
      global.Civic343.riftClosed = function (g) {
        origClosed.apply(this, arguments);
        if (g) EcoGrid.onRiftSealed(g.x, g.z, g.rank);
      };
    }
  };

  // Inicializar quando os sistemas globais estiverem prontos
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => EcoGrid.init());
    } else {
      setTimeout(() => EcoGrid.init(), 100);
    }
  }

})(typeof window !== 'undefined' ? window : globalThis);
