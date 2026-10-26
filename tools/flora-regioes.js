/* v619 (Ian: árvores não nascem mais aleatórias, cada tipo nasce na sua região)
   Catálogo de espécies por região + bosques e clareiras fixos + espalhamento por animais (versão 1).
   Para colocar uma espécie nova: copie os GLB para models/flora/, acrescente uma linha em ESPECIES (e o id em
   TREEIDS / NAT422 em src/core/680-bloco-journey113-cont.js, em survival437.js, 270-masmorra e ecossistema550.js). */
(function () {
  'use strict';
  const T = THREE;

  /* ---------- catálogo ----------
     id        = id do modelo adulto no cenário (TripoEnvironment153.files)
     bio       = biomas onde nasce; regiao = capital/área (texto);
     estagios  = GLB por estágio (models/flora/…): broto, jovem, adulta, morta, toco; sem isso a espécie só muda de escala
     altura    = altura adulta em metros (referência para broto/jovem/morta); toco = largura do toco em metros
     espalha   = se os animais podem plantar (precisa dos GLB de broto/jovem) */
  const ESPECIES = {
    abeto:   { nome: 'Abeto de geada', bio: ['neve'], regiao: 'Ymiria · neve e tundra', altura: 14, toco: 1.9, espalha: true,
      estagios: { broto: 'abeto_geada_broto', jovem: 'abeto_geada_jovem', adulta: 'abeto_geada_adulta', morta: 'abeto_geada_morta', toco: 'abeto_geada_toco' } },
    betula:  { nome: 'Bétula gélida', bio: ['neve'], regiao: 'Ymiria · neve e tundra', altura: 11, toco: 1.5, espalha: true,
      estagios: { broto: 'betula_gelida_broto', jovem: 'betula_gelida_jovem', adulta: 'betula_gelida_adulta', morta: 'betula_gelida_morta', toco: 'betula_gelida_toco' } },
    brasa:   { nome: 'Árvore brasa', bio: ['vulcao'], regiao: 'Urdan · vulcão e minas', altura: 9, toco: 1.7, espalha: true,
      estagios: { broto: 'arvore_brasa_broto', jovem: 'arvore_brasa_jovem', adulta: 'arvore_brasa_adulta', morta: 'arvore_brasa_morta', toco: 'arvore_brasa_toco' } },
    pinheiro_cinza: { nome: 'Pinheiro cinza', bio: ['vulcao'], regiao: 'Urdan · vulcão e minas', falta: 'modelo (só há imagens de referência)' },
    willow:  { nome: 'Salgueiro', bio: ['pantano'], regiao: 'Thalor · docas e pântano', espalha: false },
    fir:     { nome: 'Conífera', bio: ['cristal'], regiao: 'cristal', espalha: false },
    cacto:   { nome: 'Cacto', bio: ['deserto'], regiao: 'Zahar · deserto', espalha: false, nota: 'colocado pelo cenário (cacto1/cacto2), não por aqui' },
    oak:     { nome: 'Carvalho', bio: ['campos', 'floresta', 'flores'], regiao: 'padrão (Verden, Aster e os outros biomas até haver espécies próprias)', espalha: false }
  };

  /* ---------- bosques e clareiras ----------
     thr = quanto o ruído de bosque precisa passar (menor = floresta mais cheia); manchas fixas por região e semente do mundo */
  const THR = { floresta: .40, campos: .62, flores: .60, pantano: .50, neve: .55, cristal: .58, vulcao: .56 };
  const hash = (x, z) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
  const noise = (x, z) => (typeof WN === 'function' ? WN(x, z) : .5);
  function grove(x, z) { return .6 * noise(x * .010 + 31, z * .010 + 17) + .4 * noise(x * .027 + 5, z * .027 + 91); }

  function especie(bio, x, z, key) {
    if (bio === 'deserto') return null;
    if (bio === 'vulcao') return 'brasa'; /* pinheiro cinza entra aqui quando houver modelo */
    if (bio === 'neve') return noise(x * .02 + 400, z * .02 + 200) > .5 ? 'betula' : 'abeto'; /* manchas fixas de cada espécie */
    if (bio === 'cristal') return 'fir';
    if (bio === 'pantano') return 'willow';
    return 'oak';
  }

  /* devolve o id do modelo (ou null = não nasce aqui); undefined deixa o jogo decidir */
  function pick(x, z, bio, key) {
    if (typeof key === 'string' && key.includes('dead') && bio !== 'vulcao') return null;
    const sp = especie(bio, x, z, key);
    if (!sp) return null;
    const thr = THR[bio]; if (thr === undefined) return sp;
    const g = grove(x, z), r = hash(x, z);
    if (g > thr) {
      if (noise(x * .06 + 200, z * .06 + 9) < .30) return null; /* clareira dentro do bosque */
      return r < Math.min(1, (g - thr) / .06 + .35) ? sp : null;
    }
    return bio === 'campos' && r < .008 ? sp : null; /* árvore solitária rara */
  }

  /* ---------- modelos por estágio (carregados sob demanda) ---------- */
  const protos = new Map(), loading = new Map();
  function load(file) {
    if (protos.has(file)) return Promise.resolve(protos.get(file));
    if (loading.has(file)) return loading.get(file);
    const p = new Promise(res => {
      const loader = new T.GLTFLoader(); if (window.MeshoptDecoder) loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load('models/flora/' + file + '.glb', g => {
        const root = g.scene; root.updateMatrixWorld(true);
        const box = new T.Box3().setFromObject(root), size = box.getSize(new T.Vector3());
        const wrap = new T.Group();
        root.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
        root.traverse(o => { if (o.isMesh) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => { m.side = T.DoubleSide; m.roughness = Math.max(.75, m.roughness || 0); m.metalness = 0; if (m.map) m.map.encoding = T.sRGBEncoding; }); } });
        wrap.add(root); wrap.userData.h = size.y || 1; wrap.userData.w = Math.max(size.x, size.z) || 1;
        protos.set(file, wrap); res(wrap);
      }, undefined, () => res(null));
    });
    loading.set(file, p); return p;
  }

  /* cópia do modelo de um estágio, com altura (ou largura, no toco) em metros; entra no grupo `parent` */
  function overlay(id, stage, metros, cb) {
    const sp = ESPECIES[id]; if (!sp || !sp.estagios || !sp.estagios[stage]) { cb && cb(null); return; }
    load(sp.estagios[stage]).then(proto => {
      if (!proto) { cb && cb(null); return; }
      const m = proto.clone(true), k = stage === 'toco' ? metros / proto.userData.w : metros / proto.userData.h;
      m.scale.setScalar(k); m.rotation.y = hash(metros * 7.1, proto.userData.h) * Math.PI * 2; cb && cb(m);
    });
  }

  /* toco do lenhador no lugar da árvore (survival437): devolve true se a espécie tem modelo de toco */
  function toco(x, z, group) {
    const bio = typeof biomeAt === 'function' ? biomeAt(x, z) : null, id = pick(x, z, bio, 'tree_oak');
    const sp = ESPECIES[id]; if (!sp || !sp.estagios) return false;
    overlay(id, 'toco', sp.toco || 1.6, m => { if (m && group) { group.add(m); if (group.userData.cil) group.remove(group.userData.cil); } });
    return true;
  }

  /* ---------- espalhamento por animais (versão 1) ----------
     Herbívoros e pássaros que o jogo já tem, quando passam perto de árvore adulta, às vezes deixam semente; ela só vira
     broto em célula fértil do MESMO bioma, e só das espécies com modelo de estágios. Expansão lenta, sem salvar no arquivo. */
  const DISPERSORES = new Set(['passaro', 'coelho', 'alpaca', 'alpacaimp']);
  const plantadas = [];
  let acc = 0;
  function dispersar(dt) {
    acc += dt; if (acc < 5) return; acc = 0;
    if (!window.EcoGrid || !EcoGrid.addTree || typeof enemies === 'undefined' || !player || plantadas.length >= 60) return;
    for (const e of enemies) {
      if (!e || e.dead || e.gone || !DISPERSORES.has(e.kind)) continue;
      if (Math.hypot(e.x - player.x, e.z - player.z) > 70 || Math.random() > .12) continue;
      const par = EcoGrid.nearestAdult(e.x, e.z, 9);
      if (!par || !ESPECIES[par.species] || !ESPECIES[par.species].espalha) continue;
      const bio = biomeAt(e.x, e.z);
      if (!ESPECIES[par.species].bio.includes(bio) || pick(e.x, e.z, bio, 'tree_oak') !== par.species) continue; /* mesma região e espécie */
      const c = EcoGrid.getCellAt(e.x, e.z);
      if (!c || c.fertilidade < 55 || c.pisoteio > 40 || c.biomassa > 130) continue; /* neve/vulcão têm solo pobre: o limite é o de um solo vivo, não o de floresta */
      if (EcoGrid.nearestAny(e.x, e.z, 2.6)) continue;
      if (EcoGrid.addTree(e.x, e.z, par.species, 125)) plantadas.push({ x: e.x, z: e.z, species: par.species });
    }
  }
  setInterval(() => { try { if (typeof started !== 'undefined' && started && typeof paused !== 'undefined' && !paused) dispersar(1); } catch (_) {} }, 1000);

  window.Flora = { ESPECIES, pick, especie, grove, overlay, load, toco, plantadas, staged: id => !!(ESPECIES[id] && ESPECIES[id].estagios), altura: id => (ESPECIES[id] && ESPECIES[id].altura) || 12, DISPERSORES };
})();
