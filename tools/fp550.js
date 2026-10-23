/* ============================================================================
 * PRIMEVA v550 — PRIMEIRA PESSOA IGUAL SKYRIM (1ª PESSOA 3D REAL)
 * Arquivo: tools/fp550.js
 * Direção e Criação: Ian Feloniuk
 * Revisão Estúdio Visual: 5 Especialistas (Skyrim × Primeva)
 *
 * 1. Câmera nos olhos do Viajante (1,86 m de altura, normalizado 2,02 m, avanço 0,10 m).
 * 2. Viewmodel 3D calibrado para FOV 48: mãos, manoplas nórdicas e armas SEMPRE
 *    visíveis em idle com balanço orgânico de respiração (nunca somem da tela).
 * 3. Suporte completo para Espada, Machado, Maça, Cajado/Lança de Gelo, Adaga, Arco e Escudo.
 * 4. Passada física (walk/run bobbing), corte fluido em arco inercial (slash) que
 *    retorna suavemente à postura de guarda, e bloqueio elevado com escudo/parada.
 * 5. Mira central minimalista Skyrim (< · >) alinhada ao retículo.
 * 6. Alternância fluida com tecla V (toque único sem conflito com inventário) e rodinha do mouse.
 * ============================================================================ */
(function(global){
  'use strict';

  const FP = global.FP550 = {
    version: 550,
    active: false,
    viewmodel: null,
    armR: null,
    armL: null,
    weaponHolder: null,
    shieldHolder: null,
    magicHolder: null,
    currentWeaponKey: '',
    currentShieldKey: '',
    bobY: 0,
    bobPhase: 0,
    swayX: 0,
    swayY: 0,
    swingTimer: 0,
    bashTimer: 0,
    blockWeight: 0,
    pointerLocked: false,
    initialized: false
  };

  /* ---------- Retículo e Banner Skyrim ---------- */
  function setupDOM(){
    if(typeof document === 'undefined') return;
    if(document.getElementById('skyrim-fp-style-550')) return;

    const style = document.createElement('style');
    style.id = 'skyrim-fp-style-550';
    style.textContent = `
      #skyrim-crosshair-550 {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        align-items: center;
        justify-content: center;
        gap: 5px;
        pointer-events: none;
        z-index: 42;
        user-select: none;
        color: rgba(225, 230, 240, 0.72);
        font-family: 'Cinzel', serif, sans-serif;
        font-size: 14px;
        line-height: 1;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.85));
        transition: transform .12s cubic-bezier(.2,.8,.3,1), color .15s ease, opacity .15s ease;
      }
      #skyrim-crosshair-550.active {
        color: #ffd070;
        transform: translate(-50%, -50%) scale(0.85);
        filter: drop-shadow(0 0 6px rgba(255, 208, 112, 0.6));
      }
      #skyrim-crosshair-550 .sky-ch-bracket {
        font-size: 15px;
        opacity: 0.65;
        font-weight: 300;
        letter-spacing: -1px;
      }
      #skyrim-crosshair-550 .sky-ch-dot {
        font-size: 11px;
        opacity: 0.9;
      }
      #skyrim-pov-banner-550 {
        position: fixed;
        top: 48px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        padding: 5px 18px;
        background: linear-gradient(180deg, rgba(20,26,38,0.92), rgba(12,16,24,0.96));
        border: 1px solid rgba(255, 208, 112, 0.45);
        border-radius: 3px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.65), 0 0 10px rgba(255, 208, 112, 0.25);
        color: #f8fafc;
        font-family: 'Cinzel', serif, sans-serif;
        font-size: 13px;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity .25s ease, transform .25s ease;
      }
    `;
    document.head.appendChild(style);

    const ch = document.createElement('div');
    ch.id = 'skyrim-crosshair-550';
    ch.innerHTML = '<span class="sky-ch-bracket">‹</span><span class="sky-ch-dot">•</span><span class="sky-ch-bracket">›</span>';
    document.body.appendChild(ch);

    const banner = document.createElement('div');
    banner.id = 'skyrim-pov-banner-550';
    document.body.appendChild(banner);
  }

  let bannerTimer = null;
  function showBanner(text){
    setupDOM();
    const b = document.getElementById('skyrim-pov-banner-550');
    if(!b) return;
    b.textContent = text;
    b.style.display = 'block';
    requestAnimationFrame(() => {
      b.style.opacity = '1';
      b.style.transform = 'translateX(-50%) translateY(0)';
    });
    if(bannerTimer) clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => {
      b.style.opacity = '0';
      b.style.transform = 'translateX(-50%) translateY(-6px)';
      setTimeout(() => { b.style.display = 'none'; }, 250);
    }, 1200);
  }

  /* ---------- Viewmodel 3D em Three.js (Calibrado para FOV 48) ---------- */
  function buildViewmodel(){
    if(typeof THREE === 'undefined' || typeof camera === 'undefined' || !camera) return null;
    if(global.scene && camera.parent !== global.scene){
      global.scene.add(camera);
    }
    const T = THREE;

    const group = new T.Group();
    group.name = 'viewmodel_firstperson_550';
    group.renderOrder = 999;

    // Materiais PBR nórdicos
    const matIron = new T.MeshStandardMaterial({ color: 0x4a4947, roughness: 0.35, metalness: 0.70 });
    const matLeather = new T.MeshStandardMaterial({ color: 0x3a2518, roughness: 0.75, metalness: 0.05 });
    const matSteel = new T.MeshStandardMaterial({ color: 0xd8dde6, roughness: 0.18, metalness: 0.90 });
    const matWood = new T.MeshStandardMaterial({ color: 0x442e1d, roughness: 0.85, metalness: 0.04 });
    const matBrass = new T.MeshStandardMaterial({ color: 0xc89832, roughness: 0.35, metalness: 0.80 });
    const matCrystal = new T.MeshStandardMaterial({
      color: 0x70c0ff,
      emissive: 0x2277ee,
      emissiveIntensity: 2.2,
      roughness: 0.15,
      metalness: 0.2
    });

    for(const m of [matIron, matLeather, matSteel, matWood, matBrass, matCrystal]){
      m.depthTest = true;
      m.depthWrite = true;
    }

    // Função construtora de manopla e antebraço facetado rústico
    function createArm(isRight){
      const arm = new T.Group();
      arm.name = isRight ? 'fp_arm_r' : 'fp_arm_l';

      // Antebraço chanfrado (entra a partir da borda inferior)
      const foreGeom = new T.CylinderGeometry(0.038, 0.048, 0.22, 7);
      foreGeom.rotateX(Math.PI / 2);
      const forearm = new T.Mesh(foreGeom, matLeather);
      forearm.position.set(0, -0.015, 0.10);
      arm.add(forearm);

      // Placa dorsal de ferro forjado reforçada na manopla
      const plateGeom = new T.BoxGeometry(0.052, 0.020, 0.15);
      const plate = new T.Mesh(plateGeom, matIron);
      plate.position.set(0, 0.022, 0.10);
      arm.add(plate);

      // Correias e rebites de latão
      const strapGeom = new T.CylinderGeometry(0.042, 0.044, 0.024, 8);
      strapGeom.rotateX(Math.PI / 2);
      const strap = new T.Mesh(strapGeom, matBrass);
      strap.position.set(0, -0.015, 0.05);
      arm.add(strap);

      // Punho / Manopla articulada (nórdica de ferro forjado)
      const fistGeom = new T.BoxGeometry(0.058, 0.052, 0.070);
      const fist = new T.Mesh(fistGeom, matIron);
      fist.position.set(0, 0.0, 0.0);
      arm.add(fist);

      // Dedos encurvados segurando a empunhadura
      const fingersGeom = new T.BoxGeometry(0.054, 0.042, 0.046);
      const fingers = new T.Mesh(fingersGeom, matLeather);
      fingers.position.set(isRight ? -0.015 : 0.015, -0.01, -0.015);
      arm.add(fingers);

      return arm;
    }

    // Posições base calibradas para FOV 48 (Z = -0.32, Y = -0.095: visíveis no terço inferior sem sumir)
    const armR = createArm(true);
    armR.position.set(0.14, -0.095, -0.32);
    armR.rotation.set(0.18, -0.16, 0.10);
    group.add(armR);

    const armL = createArm(false);
    armL.position.set(-0.14, -0.095, -0.32);
    armL.rotation.set(0.18, 0.16, -0.10);
    group.add(armL);

    // Soquete da arma na mão direita
    const wepHolder = new T.Group();
    wepHolder.name = 'fp_weapon_holder';
    wepHolder.position.set(0, 0.01, -0.01);
    armR.add(wepHolder);

    // Soquete do escudo na mão esquerda
    const shHolder = new T.Group();
    shHolder.name = 'fp_shield_holder';
    shHolder.position.set(-0.02, 0.01, -0.01);
    armL.add(shHolder);

    // Efeito mágico na mão esquerda
    const magHolder = new T.Group();
    magHolder.name = 'fp_magic_holder';
    magHolder.position.set(0, 0.02, -0.03);
    armL.add(magHolder);

    // Luz de preenchimento própria do viewmodel para iluminação nítida das armas e mãos
    const fpLight = new T.PointLight(0xffeedd, 0.55, 3.0);
    fpLight.position.set(0, 0.12, -0.15);
    group.add(fpLight);

    camera.add(group);
    group.visible = false;

    FP.viewmodel = group;
    FP.armR = armR;
    FP.armL = armL;
    FP.weaponHolder = wepHolder;
    FP.shieldHolder = shHolder;
    FP.magicHolder = magHolder;
    FP.materials = { matIron, matLeather, matSteel, matWood, matBrass, matCrystal };

    return group;
  }

  /* ---------- Visual das Manoplas e Braços (Reativo ao Equipamento) ---------- */
  function updateArmVisual(){
    if(!FP.materials) return;
    const b = global.run?.equip?.b;
    const name = (b?.name || '').toLowerCase();
    if(name.includes('mithril')){
      FP.materials.matIron.color.setHex(0x9ec5e8);
      FP.materials.matLeather.color.setHex(0x1e293b);
    } else if(name.includes('estrela') || name.includes('primeva')){
      FP.materials.matIron.color.setHex(0xeab308);
      FP.materials.matLeather.color.setHex(0x451a03);
    } else if(name.includes('aço') || name.includes('aco') || name.includes('ferro')){
      FP.materials.matIron.color.setHex(0x525866);
      FP.materials.matLeather.color.setHex(0x27272a);
    } else {
      FP.materials.matIron.color.setHex(0x4a4947);
      FP.materials.matLeather.color.setHex(0x3a2518);
    }
  }

  /* ---------- Visual das Armas 3D em Primeiro Plano (Skyrim Style) ---------- */
  function updateWeaponVisual(){
    if(!FP.weaponHolder || typeof THREE === 'undefined') return;
    const T = THREE, mats = FP.materials;
    const w = (global.run && global.run.equip && global.run.equip.w) || null;
    let kind = 'sword';
    try { kind = typeof weaponKind272 === 'function' ? (weaponKind272(w) || 'sword') : (w?.kind155 || 'sword'); } catch(_) {}

    const key = (w ? (w.uid || w.name || kind) : 'fist') + ':' + kind;
    if(key === FP.currentWeaponKey) return;
    FP.currentWeaponKey = key;

    // Limpa filhos anteriores
    while(FP.weaponHolder.children.length > 0){
      const c = FP.weaponHolder.children[0];
      FP.weaponHolder.remove(c);
      if(c.geometry) c.geometry.dispose();
    }

    const g = new T.Group();

    if(kind === 'axe'){
      // Machado de Batalha Nórdico
      const shaft = new T.Mesh(new T.CylinderGeometry(0.016, 0.018, 0.55, 6), mats.matWood);
      shaft.position.set(0, 0.16, 0);
      g.add(shaft);

      const head = new T.Mesh(new T.BoxGeometry(0.022, 0.18, 0.13), mats.matIron);
      head.position.set(0, 0.35, -0.06);
      g.add(head);

      const edge = new T.Mesh(new T.BoxGeometry(0.007, 0.20, 0.035), mats.matSteel);
      edge.position.set(0, 0.35, -0.12);
      g.add(edge);

      // Angulação Skyrim: erguido diagonalmente para cima e à frente
      g.rotation.set(-0.45, -0.22, 0.12);
    } else if(kind === 'mace' || kind === 'hammer'){
      // Maça de Flanges Nórdica
      const shaft = new T.Mesh(new T.CylinderGeometry(0.016, 0.018, 0.52, 6), mats.matIron);
      shaft.position.set(0, 0.16, 0);
      g.add(shaft);

      const head = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.14, 6), mats.matSteel);
      head.position.set(0, 0.35, 0);
      g.add(head);

      g.rotation.set(-0.42, -0.20, 0.10);
    } else if(kind === 'staff' || kind === 'wand'){
      // Cajado Arcano / Lança de Gelo (Ian: Lança de Gelo como na imagem)
      const shaft = new T.Mesh(new T.CylinderGeometry(0.018, 0.022, 0.78, 6), mats.matWood);
      shaft.position.set(0, 0.20, 0);
      g.add(shaft);

      // Engaste de bronze no topo
      const collar = new T.Mesh(new T.CylinderGeometry(0.026, 0.020, 0.06, 6), mats.matBrass);
      collar.position.set(0, 0.52, 0);
      g.add(collar);

      // Cristal Arcano de Gelo no topo (gira e brilha)
      const crystal = new T.Mesh(new T.OctahedronGeometry(0.055), mats.matCrystal);
      crystal.position.set(0, 0.58, 0);
      g.add(crystal);

      // Luz pontual sutil do cajado
      const pl = new T.PointLight(0x70c0ff, 0.75, 2.5);
      pl.position.set(0, 0.58, 0);
      g.add(pl);

      // Cajado projetado suavemente à frente no quadrante superior direito
      g.rotation.set(-0.48, -0.24, 0.12);
    } else if(kind === 'dagger'){
      // Adaga Furtiva
      const blade = new T.Mesh(new T.BoxGeometry(0.032, 0.36, 0.009), mats.matSteel);
      blade.position.set(0, 0.20, 0);
      g.add(blade);

      const guard = new T.Mesh(new T.BoxGeometry(0.09, 0.018, 0.022), mats.matIron);
      guard.position.set(0, 0.03, 0);
      g.add(guard);

      g.rotation.set(-0.35, -0.15, 0.08);
    } else if(kind === 'bow'){
      // Arco Recurvo Nórdico
      const limb = new T.Mesh(new T.TorusGeometry(0.32, 0.014, 6, 16, Math.PI * 0.7), mats.matWood);
      limb.position.set(-0.05, 0.12, -0.10);
      limb.rotation.set(0, Math.PI / 2, Math.PI / 1.3);
      g.add(limb);

      g.rotation.set(-0.30, 0.10, 0.0);
    } else if(kind === 'fist'){
      // Desarmado / Mãos Vazias (nenhum modelo adicional no soquete)
    } else {
      // Espada Nórdica Clássica (Default)
      const grip = new T.Mesh(new T.CylinderGeometry(0.015, 0.017, 0.12, 6), mats.matLeather);
      grip.position.set(0, 0.0, 0);
      g.add(grip);

      const pommel = new T.Mesh(new T.DodecahedronGeometry(0.022), mats.matIron);
      pommel.position.set(0, -0.065, 0);
      g.add(pommel);

      const guard = new T.Mesh(new T.BoxGeometry(0.13, 0.020, 0.028), mats.matIron);
      guard.position.set(0, 0.055, 0);
      g.add(guard);

      const blade = new T.Mesh(new T.BoxGeometry(0.044, 0.54, 0.011), mats.matSteel);
      blade.position.set(0, 0.32, 0);
      g.add(blade);

      const fuller = new T.Mesh(new T.BoxGeometry(0.012, 0.42, 0.013), mats.matIron);
      fuller.position.set(0, 0.28, 0);
      g.add(fuller);

      // Postura nobre de guarda Skyrim: lâmina apontando diagonalmente para cima e centro
      g.rotation.set(-0.45, -0.22, 0.12);
    }

    FP.weaponHolder.add(g);
  }

  /* ---------- Visual do Escudo 3D em Primeiro Plano ---------- */
  function updateShieldVisual(){
    if(!FP.shieldHolder || typeof THREE === 'undefined') return;
    const T = THREE, mats = FP.materials;
    const hasShield = (global.Guard472 && typeof global.Guard472.hasShield === 'function' ? global.Guard472.hasShield() : false) || !!(global.run && global.run.equip && global.run.equip.sh);
    const key = hasShield ? 'shield_round' : 'none';
    if(key === FP.currentShieldKey) return;
    FP.currentShieldKey = key;

    while(FP.shieldHolder.children.length > 0){
      const c = FP.shieldHolder.children[0];
      FP.shieldHolder.remove(c);
      if(c.geometry) c.geometry.dispose();
    }

    if(hasShield){
      const g = new T.Group();
      // Corpo do escudo redondo nórdico de tábuas de madeira
      const body = new T.Mesh(new T.CylinderGeometry(0.18, 0.18, 0.024, 16), mats.matWood);
      body.rotation.x = Math.PI / 2;
      g.add(body);

      // Borda de ferro batido rebitada
      const rim = new T.Mesh(new T.TorusGeometry(0.18, 0.012, 6, 20), mats.matIron);
      g.add(rim);

      // Umbo central cônico de ferro
      const boss = new T.Mesh(new T.SphereGeometry(0.050, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), mats.matIron);
      boss.rotation.x = -Math.PI / 2;
      boss.position.z = 0.018;
      g.add(boss);

      g.position.set(0, 0.02, 0);
      g.rotation.set(-0.25, 0.32, -0.10);
      FP.shieldHolder.add(g);
      FP.shieldHolder.visible = true;
    } else {
      FP.shieldHolder.visible = false;
    }
  }


  /* ---------- v563: braços e mãos do próprio Viajante (mesma malha e ossos da 3ª pessoa) ---------- */
  const ARM_RX = /^(upperarm|forearm|hand)_[lr]$/;
  /* ---------- v570: ossos nos dedos da MÃO NORMAL do Viajante (peças 7 = direita, 8 = esquerda) ----------
     A malha da mão é uma luva única; aqui ganha 3 ossos por dedo (indicador, médio, anelar, mindinho), com pesos por faixa
     e por articulação, e um ponto de empunhadura na palma. Só vale na 1ª pessoa (geometria própria); a 3ª pessoa não muda. */
  const HAND = { grip: { r: 0, l: 0 }, rig: {} };
  const LANES = ['idx', 'mid', 'rng', 'pky'];
  const LANE_Z = [[0.044, 9], [0.025, 0.044], [0.006, 0.025], [-9, 0.006]];   /* faixas em z (glTF) */
  const JOINT_U = [0.052, 0.082, 0.102];                                       /* distância do punho (m do modelo) */
  const WRIST = { r: [-0.3662, 0.7118, 0.0106], l: [0.3662, 0.7118, 0.0106] };
  const HAND_PART = { r: 'tripo_part_7', l: 'tripo_part_8' };
  const smooth = (e0, e1, x) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

  function rigHand(side, m){
    if(HAND.rig[side] && HAND.rig[side].m === m) return HAND.rig[side];
    HAND.rig[side] = null; /* o modelo foi refeito (troca de equipamento): monta de novo */
    const T = THREE, hb = m.bones['hand_' + side];
    let part = null;
    m.model.traverse(o => { if(!part && o.isSkinnedMesh && o.name === HAND_PART[side]) part = o; });
    if(!hb || !part) return null;
    const sk = part.skeleton, hi = sk.bones.indexOf(hb);
    if(hi < 0) return null;
    const bindH = sk.boneInverses[hi].clone().invert();            /* hand bone no espaço do modelo, na amarração */
    const hq = new T.Quaternion(); bindH.decompose(new T.Vector3(), hq, new T.Vector3());
    const wrist = new T.Vector3(...WRIST[side]), dirX = side === 'r' ? -1 : 1;
    const bones = [], inverses = [], map = {};
    const addBone = (name, parent, parentBindInv, pos) => {
      const b = new T.Bone(); b.name = 'fp_' + side + '_' + name;
      const bind = new T.Matrix4().makeTranslation(pos.x, pos.y, pos.z);
      const local = parentBindInv.clone().multiply(bind);
      local.decompose(b.position, b.quaternion, b.scale);
      b.userData.rest = b.quaternion.clone();
      parent.add(b);
      const inv = bind.clone().invert();
      bones.push(b); inverses.push(inv); map[name] = bones.length - 1;
      return { bone: b, bindInv: inv };
    };
    const zc = [0.054, 0.034, 0.015, -0.003];
    LANES.forEach((ln, li) => {
      let parent = hb, pInv = sk.boneInverses[hi];
      JOINT_U.forEach((u, ji) => {
        const pos = new T.Vector3(wrist.x + dirX * u, wrist.y - 0.004, zc[li]);
        const r = addBone(ln + (ji + 1), parent, pInv, pos);
        parent = r.bone; pInv = r.bindInv;
      });
    });
    const nb = sk.bones.length, newBones = sk.bones.concat(bones), newInv = sk.boneInverses.concat(inverses);
    const skel = new T.Skeleton(newBones, newInv);
    /* geometria própria da 1ª pessoa: corta nada, só troca os pesos da mão */
    const g = part.geometry.clone(), PA = g.attributes.position, SIA = g.attributes.skinIndex, SWA = g.attributes.skinWeight;
    const n = PA.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
    const osi = new Uint16Array(n * 4), osw = new Float32Array(n * 4);
    for(let v = 0; v < n; v++){ osi[v*4] = SIA.getX(v); osi[v*4+1] = SIA.getY(v); osi[v*4+2] = SIA.getZ(v); osi[v*4+3] = SIA.getW(v); osw[v*4] = SWA.getX(v); osw[v*4+1] = SWA.getY(v); osw[v*4+2] = SWA.getZ(v); osw[v*4+3] = SWA.getW(v); }
    for(let v = 0; v < n; v++){
      const x = PA.getX(v), z = PA.getZ(v), u = (x - wrist.x) * dirX;
      const cand = [];
      /* pesos originais mantidos fora da mão; dentro da mão, repartidos entre o osso da mão e os dedos */
      let handShare = 0, others = [];
      for(let k = 0; k < 4; k++){ const bi = osi[v*4+k], w = osw[v*4+k]; if(bi === hi) handShare += w; else if(w > 0) others.push([bi, w]); }
      if(handShare > 0.001 && u > 0.04){
        /* faixa: pesos suaves entre faixas vizinhas */
        const lw = LANES.map((_, li) => { const [z0, z1] = LANE_Z[li]; return smooth(z0 - 0.014, z0 + 0.014, z) * (1 - smooth(z1 - 0.014, z1 + 0.014, z)); });
        const ls = lw.reduce((a, b) => a + b, 0) || 1;
        const fingerW = smooth(0.038, 0.068, u);                   /* quanto da mão vira dedo */
        const parts = [];
        LANES.forEach((ln, li) => {
          const wl = lw[li] / ls * fingerW * handShare; if(wl < 0.004) return;
          const b1 = 1 - smooth(0.068, 0.094, u), b3 = smooth(0.090, 0.114, u);
          const w1 = b1, w3 = b3, w2 = Math.max(0, 1 - w1 - w3);
          [[1, w1], [2, w2], [3, w3]].forEach(([ji, wj]) => { if(wj > 0.01) parts.push([nb + li * 3 + (ji - 1), wl * wj]); });
        });
        parts.push([hi, handShare * (1 - fingerW) + handShare * fingerW * 0]);
        for(const o of others) parts.push(o);
        parts.sort((a, b) => b[1] - a[1]);
        const top = parts.slice(0, 4), tot = top.reduce((a, b) => a + b[1], 0) || 1;
        top.forEach(([bi, w], k) => { si[v*4+k] = bi; sw[v*4+k] = w / tot; });
      } else {
        for(let k = 0; k < 4; k++){ si[v*4+k] = osi[v*4+k]; sw[v*4+k] = osw[v*4+k]; }
      }
    }
    g.setAttribute('skinIndex', new T.BufferAttribute(si, 4));
    g.setAttribute('skinWeight', new T.BufferAttribute(sw, 4));
    /* ponto de empunhadura: palma fechada, no eixo do modelo */
    const anchor = new T.Object3D(); anchor.name = 'fp_grip_' + side;
    const aPos = new T.Vector3(wrist.x + dirX * 0.05, wrist.y - 0.03, 0.034);
    const aLocal = sk.boneInverses[hi].clone().multiply(new T.Matrix4().makeTranslation(aPos.x, aPos.y, aPos.z));
    aLocal.decompose(anchor.position, anchor.quaternion, anchor.scale);
    hb.add(anchor);
    const R = { m, part, geo: g, skel, oldSkel: part.skeleton, anchor, bones, hq, side, dirX, ready: true };
    HAND.rig[side] = R;
    return R;
  }
  const CURL = [0.95, 1.15, 0.95];
  function curlHand(R, g){
    const q = new THREE.Quaternion(), ax = new THREE.Vector3(0, 0, 1), ang = (R.side === 'r' ? 1 : -1) * 1;
    R.bones.forEach((b, i) => {
      const ji = i % 3;
      q.setFromAxisAngle(ax, ang * CURL[ji] * g * (0.9 + 0.1 * (i / 3 | 0) / 3));
      b.quaternion.copy(b.userData.rest).multiply(q);
    });
  }
  /* liga/desliga a geometria com ossos nos dedos (só na 1ª pessoa) */
  function showHands(on, m){
    for(const side of ['r', 'l']){
      const R = on ? rigHand(side, m) : HAND.rig[side];
      if(!R) continue;
      if(on && !R.on){ R.part.userData.fpFull = R.part.userData.fpFull || R.part.geometry; R.part.geometry = R.geo; R.part.bind(R.skel, R.part.bindMatrix); R.on = true; }
      else if(!on && R.on){ R.part.geometry = R.part.userData.fpFull; R.part.userData.fpFull = null; R.part.bind(R.oldSkel, R.part.bindMatrix); R.on = false; }
    }
  }
  /* devolve a arma ao socket original ao sair da 1ª pessoa */
  function releaseGrips(m){
    for(const side of ['r', 'l']){
      const R = HAND.rig[side]; if(!R) continue;
      for(const c of R.anchor.children.slice()){
        const u = c.userData.fpOrig;
        if(u && u.parent){ u.parent.add(c); c.position.copy(u.pos); c.quaternion.copy(u.quat); if(u.scale) c.scale.copy(u.scale); c.userData.fpOrig = null; }
      }
    }
  }

  /* O Viajante é feito de peças soltas (tripo_part_N) na pose em T: braço/mão = peça longe do tronco e acima da cintura */
  const ARM_PARTS = /^tripo_part_(1|2|7|8)$/;
  function isArmPiece(o){ return ARM_PARTS.test(o.name); }
  function fpKeep(o){
    if(o.userData.fpKeep === undefined) o.userData.fpKeep = isArmPiece(o);
    return o.userData.fpKeep;
  }
  FP.body = function(on){
    const P = global.player;
    if(!P || !P.m || !P.m.model) return;
    const m = P.m;
    if(m.root) m.root.visible = true;
    if(!on && !m.fp563) return;
    m.fp563 = !!on;
    showHands(!!on, m);
    if(!on) releaseGrips(m);
    if(!on && m.bowHolder155 && m.bowHolder155.userData.fpPos0){ m.bowHolder155.position.copy(m.bowHolder155.userData.fpPos0); m.bowHolder155.quaternion.copy(m.bowHolder155.userData.fpQ0); }
    if(!on && m.socket && m.socket.userData.fpPos0) m.socket.position.copy(m.socket.userData.fpPos0);
    if(!on && m.socket && m.socket.children[0] && m.socket.children[0].userData.fpQ0) m.socket.children[0].quaternion.copy(m.socket.children[0].userData.fpQ0);
    m.model.traverse(o => {
      if(o.userData.fpHand) return;
      if(on && o.isMesh){
        /* o jogo reabilita as peças ao trocar equipamento: reforça a cada quadro */
        if(o.isSkinnedMesh){ if(!fpKeep(o)) o.visible = false; }
        else { let k = false, p = o.parent; while(p && p !== m.model){ if(p.isBone && ARM_RX.test(p.name)){ k = true; break; } p = p.parent; } if(!k) o.visible = false; }
      }
      if(!!o.userData.fpOn === !!on) return;
      if(o.isMesh) o.userData.fpOn = !!on;
      if(o.isSkinnedMesh){
        if(on){ o.userData.fpHid = o.visible; o.visible = fpKeep(o) && o.visible; o.frustumCulled = false; }
        else { if(o.userData.fpFull){ o.geometry = o.userData.fpFull; o.userData.fpFull = null; }
          if(o.userData.fpHid !== undefined){ o.visible = ARM_PARTS.test(o.name) || o.userData.fpHid || /^tripo_part_/.test(o.name); o.userData.fpHid = undefined; } o.frustumCulled = true; }
      } else if(o.isMesh){
        let keep = false, p = o.parent;
        while(p && p !== m.model){ if(p.isBone && ARM_RX.test(p.name)){ keep = true; break; } p = p.parent; }
        if(!keep){
          if(on){ o.userData.fpVis = o.visible; o.visible = false; }
          else if(o.userData.fpVis !== undefined){ o.visible = o.userData.fpVis; o.userData.fpVis = undefined; }
        }
      }
    });
  };
  /* pose de 1ª pessoa: os dois braços reais vão para a frente da câmera (IK de 2 ossos), somando o balanço da animação */
  const V = {};
  function aim(bone, child, dirW){
    const T = THREE;
    bone.updateWorldMatrix(true, false); child.updateWorldMatrix(true, false);
    const bp = bone.getWorldPosition(V.a), cp = child.getWorldPosition(V.b);
    const cur = V.c.copy(cp).sub(bp).normalize();
    V.q.setFromUnitVectors(cur, dirW);
    const wq = bone.getWorldQuaternion(V.w).premultiply(V.q);
    const pq = bone.parent.getWorldQuaternion(V.p).invert();
    bone.quaternion.copy(pq.multiply(wq));
    bone.updateMatrixWorld(true);
  }
  /* arma na mão direita: mantém o cabo no punho (socket do jogo) e só gira a arma para a direção de guarda de 1ª pessoa */
  const GUARD = { sword:[-0.14,0.46,-0.88], axe:[-0.14,0.46,-0.88], mace:[-0.14,0.46,-0.88], hammer:[-0.14,0.46,-0.88], dagger:[0.12,0.5,-0.86], staff:[0.06,0.86,-0.5], wand:[0.06,0.86,-0.5], spear:[0.04,0.32,-0.95] };
  /* golpe de 1ª pessoa: o braço da arma faz preparo, corte e recuperação a cada ataque (gatilho: tempo de recarga do jogador) */
  const SWK = [[0,[0,0,0],0],[0.28,[0.07,0.1,0.06],1],[0.68,[-0.14,-0.1,-0.14],2],[1,[0,0,0],0]];
  const SWD = [null, [0.32,0.95,-0.12], [-0.55,0.35,-0.75]]; /* v586: golpe menos lateral (antes cruzava a tela) */
  FP.sw = { t: 1, last: 0, pa: 0 };
  FP.swingNow = function(P, base){
    const now = performance.now(), dt = Math.min(0.05, Math.max(0, (now - (FP.sw.last || now)) / 1000)); FP.sw.last = now;
    const atk = P.atkCd || 0;
    if(atk > FP.sw.pa + 0.001) FP.sw.t = 0;
    FP.sw.pa = atk;
    if(FP.sw.t < 1) FP.sw.t = Math.min(1, FP.sw.t + dt / 0.34);
    const t = FP.sw.t;
    let off = [0,0,0], dir = base;
    if(t < 1){
      for(let i = 0; i < SWK.length - 1; i++){
        const a = SWK[i], b = SWK[i+1];
        if(t >= a[0] && t <= b[0]){
          const u = (t - a[0]) / (b[0] - a[0]), e = u * u * (3 - 2 * u);
          off = a[1].map((v, k) => v + (b[1][k] - v) * e);
          const da = a[2] === 0 ? base : SWD[a[2]], db = b[2] === 0 ? base : SWD[b[2]];
          dir = da.map((v, k) => v + (db[k] - v) * e);
          break;
        }
      }
    }
    FP._off = off; FP._dir = dir;
  };

  function m_hasSock(m){ return !!(m.socket && m.socket.children[0]); }
  FP.palm = 0.1; FP.hilt = -0.12;
  /* gira o PUNHO (não a arma): o cabo continua dentro do punho fechado do jogo (socket + fist162) e a lâmina aponta para a direção de guarda */
  function turnHand(m, hd, cur, want){
    const q = V.q.setFromUnitVectors(cur, want);
    const wq = hd.getWorldQuaternion(V.p).premultiply(q);
    const pq = hd.parent.getWorldQuaternion(V.w).invert();
    hd.quaternion.copy(pq.multiply(wq));
    hd.updateMatrixWorld(true);
  }
  function axisOf(obj, key){
    const T = THREE;
    if(!obj.userData[key]){
      obj.updateWorldMatrix(true, true);
      const box = new T.Box3().setFromObject(obj), c = box.getCenter(new T.Vector3()), sz = box.getSize(new T.Vector3());
      const o = new T.Vector3().setFromMatrixPosition(obj.matrixWorld);
      let d = c.sub(o);
      if(d.lengthSq() < 1e-6) d = sz.x >= sz.y && sz.x >= sz.z ? new T.Vector3(1,0,0) : sz.y >= sz.z ? new T.Vector3(0,1,0) : new T.Vector3(0,0,1);
      obj.userData[key] = d.normalize().transformDirection(obj.matrixWorld.clone().invert());
    }
    return obj.userData[key];
  }
  /* arma na mão: o cabo vai para a palma fechada (âncora da mão nova); o punho gira para a lâmina apontar à guarda */
  function holdIn(m, side, obj, centered){
    const R = HAND.rig[side]; if(!R || !obj) return null;
    const anchor = R.anchor;
    if(obj.parent !== anchor){
      obj.userData.fpOrig = { parent: obj.parent, pos: obj.position.clone(), quat: obj.quaternion.clone(), scale: obj.scale.clone() };
      obj.userData.fpBaseScale = obj.scale.clone();
      obj.updateWorldMatrix(true, true);
      obj.userData.fpWS = obj.parent.getWorldScale(new THREE.Vector3()).x;
      const T = THREE, box = new T.Box3().setFromObject(obj), c = box.getCenter(new T.Vector3()), o = new T.Vector3().setFromMatrixPosition(obj.matrixWorld);
      const inv = obj.matrixWorld.clone().invert();
      obj.userData.fpAx = c.clone().sub(o).normalize().transformDirection(inv);
      obj.userData.fpCenter = c.applyMatrix4(inv);
      anchor.add(obj);
    }
    const so = obj.userData.fpOrig && obj.userData.fpOrig.parent;
    if(!R.scaled && obj.userData.fpWS){ anchor.updateWorldMatrix(true, false); const cur = anchor.getWorldScale(V.t).x; if(cur > 1e-6) anchor.scale.multiplyScalar(obj.userData.fpWS / cur); R.scaled = true; }
    /* eixo da arma → +z do modelo (lado do polegar), no referencial do modelo (a âncora é alinhada ao modelo pelo osso) */
    const toModel = V.q.copy(R.hq).invert();
    if(centered && obj.userData.fpBaseScale) obj.scale.copy(obj.userData.fpBaseScale).multiplyScalar(0.36); /* arco menor na 1ª pessoa */
    obj.quaternion.setFromUnitVectors(obj.userData.fpAx, V.t.set(0, 0, 1)).premultiply(toModel.clone().invert());
    if(centered) obj.position.copy(obj.userData.fpCenter).multiply(obj.scale).applyQuaternion(obj.quaternion).negate();
    else obj.position.set(0, 0, 0.075);
    obj.updateMatrixWorld(true);
    return R;
  }
  FP.grip = function(m){
    const W = m.socket && m.socket.children[0] || (HAND.rig.r && HAND.rig.r.anchor.children[0]);
    const R = holdIn(m, 'r', W, false);
    if(!R) return;
    const g = FP._dir || GUARD[m.kind195] || GUARD.sword;
    /* +z do modelo (polegar/lâmina) em coordenadas do mundo */
    R.anchor.updateWorldMatrix(true, false);
    const mz = V.c.set(0, 0, 1).applyQuaternion(R.hq).transformDirection(R.anchor.parent.matrixWorld);
    const want = V.d.set(g[0], g[1], g[2]).transformDirection(camera.matrixWorld);
    turnHand(m, m.bones.hand_r, mz, want);
  };
  FP.gripBow = function(m){
    const H = m.bowHolder155 || (HAND.rig.l && HAND.rig.l.anchor.children[0]);
    const R = holdIn(m, 'l', H, true);
    if(!R) return;
    R.anchor.updateWorldMatrix(true, false);
    const mz = V.c.set(0, 0, 1).applyQuaternion(R.hq).transformDirection(R.anchor.parent.matrixWorld);
    const want = V.d.set(0.05, 1, -0.2).transformDirection(camera.matrixWorld);
    turnHand(m, m.bones.hand_l, mz, want);
  };

  FP.pose = function(){
    const P = global.player;
    if(!P || !P.m || !P.m.bones || !global.THREE || typeof camera === 'undefined' || !camera) return;
    const T = THREE, b = P.m.bones;
    if(!V.a){ for(const k of ['a','b','c','d','e','f','g','h','sh','el','hd','t']) V[k] = new T.Vector3(); V.q = new T.Quaternion(); V.w = new T.Quaternion(); V.p = new T.Quaternion(); }
    P.m.root.updateMatrixWorld(true); camera.updateMatrixWorld(true);
    FP.swingNow(P, GUARD[P.m.kind195] || GUARD.sword);
    for(const s of ['r','l']){
      const ua = b['upperarm_'+s], fa = b['forearm_'+s], hd = b['hand_'+s];
      if(!ua || !fa || !hd) continue;
      const sh = ua.getWorldPosition(V.sh), el = fa.getWorldPosition(V.el), ha = hd.getWorldPosition(V.hd);
      const Lu = el.distanceTo(sh), Lf = ha.distanceTo(el);
      // desvio da animação (ataque/respiração) em relação à mão pendurada
      const delta = V.d.copy(ha).sub(sh); delta.y += (Lu + Lf) * 0.97;
      const side = s === 'r' ? 1 : -1;
      const so3 = s === 'r' ? FP._off : [0,0,0];
      const bowL = s === 'l' && P.m.bowHolder155;
      const tgt = bowL ? V.t.set(-0.04, -0.1, -0.72) : (s === 'r' ? V.t.set(0.07 + so3[0], -0.07 + so3[1], -0.76 + so3[2]) : ((P.m.bowHolder155 || (HAND.rig.l && HAND.rig.l.anchor.children[0])) ? V.t.set(-0.17, -0.1, -0.85) : V.t.set(-0.15, -0.15, -0.64))); camera.localToWorld(tgt);
      tgt.y -= (typeof terrH === 'function' ? terrH(P.x, P.z) : 0); /* o relevo é aplicado pelo shader: o modelo fica em y=0 */
      delta.y *= 0.5; if(delta.length() > 0.4) delta.setLength(0.4);
      tgt.addScaledVector(delta, 0.8);
      // 2 ossos: cotovelo no plano do alvo, curvando para baixo e para fora
      const dir = V.e.copy(tgt).sub(sh), dist = Math.min(dir.length(), (Lu + Lf) * 0.995); dir.normalize();
      const a = (Lu*Lu - Lf*Lf + dist*dist) / (2 * dist), hh = Math.sqrt(Math.max(0, Lu*Lu - a*a));
      const pole = V.f.set(side * 0.5, -1, 0.15).transformDirection(camera.matrixWorld.clone().setPosition(0,0,0));
      pole.addScaledVector(dir, -pole.dot(dir)).normalize();
      const elbow = V.g.copy(sh).addScaledVector(dir, a).addScaledVector(pole, hh);
      aim(ua, fa, V.h.copy(elbow).sub(sh).normalize());
      aim(fa, hd, V.h.copy(sh).addScaledVector(dir, dist).sub(elbow).normalize());
      if(s === 'r' && HAND.rig.r && (m_hasSock(P.m) || HAND.rig.r.anchor.children[0])) FP.grip(P.m);
      if(s === 'l' && HAND.rig.l && (P.m.bowHolder155 || HAND.rig.l.anchor.children[0])) FP.gripBow(P.m);
    }
    const hasW = !!(P.m.socket && P.m.socket.children[0]) || !!(HAND.rig.r && HAND.rig.r.anchor.children[0]);
    const hasB = !!P.m.bowHolder155 || !!(HAND.rig.l && HAND.rig.l.anchor.children[0]);
    HAND.grip.r += ((hasW ? 1 : 0.25) - HAND.grip.r) * 0.25; HAND.grip.l += ((hasB ? 1 : 0.25) - HAND.grip.l) * 0.25;
    for(const side of ['r', 'l']){ const R = HAND.rig[side]; if(R && R.on) curlHand(R, HAND.grip[side]); }
    P.m.root.updateMatrixWorld(true);
  };

  /* ---------- Alternância 1ª / 3ª Pessoa ---------- */
  FP.set = function(enable){
    const was = FP.active;
    FP.active = !!enable;

    if(global.pcCam) global.pcCam.firstPerson = FP.active;
    try { localStorage.setItem('pds_pov', FP.active ? 'fp' : 'tp'); } catch(_) {}

    setupDOM();
    const ch = document.getElementById('skyrim-crosshair-550');
    if(ch) ch.style.display = FP.active ? 'flex' : 'none';

    // Garante que a câmera seja nó da cena para que o viewmodel 3D renderize
    if(global.scene && global.camera && global.camera.parent !== global.scene){
      global.scene.add(global.camera);
    }

    if(FP.viewmodel) FP.viewmodel.visible = false;
    FP.body(FP.active);

    const P = global.player;
    if(P && P.m){
      // 1ª Pessoa: modelo de 3ª pessoa 100% oculto (sem clipar no viewport e sem deformação)
      // 3ª Pessoa: modelo de 3ª pessoa 100% visível
      if(P.m.root) P.m.root.visible = true;

      // Preserva integridade anatômica: restaura escala do osso da cabeça se alterada
      if(P.m.bones && P.m.bones.head && P.m.bones.head.scale.x < 0.1){
        P.m.bones.head.scale.set(0.88, 0.88, 0.88);
      }
    }

    // Ao sair para 3ª pessoa, mantém pitch em limites confortáveis
    if(!FP.active && global.pcCam){
      global.pcCam.pitch = Math.max(-0.85, Math.min(1.10, global.pcCam.pitch));
    }

    if(FP.active !== was){
      showBanner(FP.active ? '1ª PESSOA' : '3ª PESSOA');
      try { if(typeof beep === 'function') beep(FP.active ? 660 : 440, .05, .03, 'sine'); } catch(_) {}
    }

    return FP.active;
  };

  FP.toggle = function(){
    if(global.run?.mounted){
      try { if(typeof toast === 'function') toast('Desmonte antes de entrar em primeira pessoa.', 1800); } catch(_) {}
      return false;
    }
    return FP.set(!FP.active);
  };

  /* ---------- Pointer Lock no Canvas ---------- */
  function setupPointerLock(){
    const c = document.getElementById('c');
    if(!c) return;

    c.addEventListener('click', e => {
      if(!FP.active || !global.started || global.paused || global.modalOpen || (global.keys && global.keys.Escape)) return;
      if(document.pointerLockElement !== c){
        try { c.requestPointerLock(); } catch(_) {}
      }
    });

    document.addEventListener('pointerlockchange', () => {
      FP.pointerLocked = (document.pointerLockElement === c);
    });

    document.addEventListener('mousemove', e => {
      if(!FP.active || !FP.pointerLocked || global.paused || global.modalOpen) return;
      if(typeof cameraLook373 === 'function'){
        cameraLook373(e.movementX, e.movementY);
      }
      FP.swayX += e.movementX * 0.0004;
      FP.swayY += e.movementY * 0.0004;
    });

    // Zoom da rodinha do mouse: rolar para trás sai para 3ª pessoa, rolar para frente entra
    c.addEventListener('wheel', e => {
      if(!global.started || global.paused || global.modalOpen) return;
      if(FP.active && e.deltaY > 50){
        e.preventDefault();
        FP.set(false);
      } else if(!FP.active && (e.altKey || (global.pcCam && global.pcCam.distance <= 1.2)) && e.deltaY < -50){
        e.preventDefault();
        FP.set(true);
      }
    }, { passive: false });
  }

  /* ---------- Animações e Tick a Cada Frame (Skyrim Style) ---------- */
  FP.tick = function(dt){
    const P = global.player;
    if(!P || P.dead || !FP.active || global.run?.mounted){
      if(P && P.m && P.m.fp563) FP.body(false);
      if(FP.viewmodel && FP.viewmodel.visible) FP.viewmodel.visible = false;
      FP.bobY = 0;
      return;
    }

    FP.body(true);
    return;

    const t = (typeof time === 'number' ? time : performance.now() * 0.001);
    const speed = Math.hypot(P.vx || 0, P.vz || 0);
    const isMoving = speed > 0.15;
    const isSprinting = speed > 4.5;
    const isBlocking = !!(global.Guard472 && typeof global.Guard472.blocking === 'function' && global.Guard472.blocking());
    const isAttacking = (P.atkCd || 0) > 0.02;

    // 1. Respiração contínua e passada rítmica
    if(isMoving){
      FP.bobPhase += dt * (isSprinting ? 11.5 : 7.2);
    } else {
      FP.bobPhase += dt * 1.8;
    }

    const breatheY = Math.sin(t * 1.5) * 0.003;
    const breatheX = Math.cos(t * 0.75) * 0.002;
    const walkBobX = isMoving ? Math.sin(FP.bobPhase) * 0.008 : 0;
    const walkBobY = isMoving ? Math.abs(Math.cos(FP.bobPhase)) * 0.010 : 0;
    FP.bobY = isMoving ? Math.sin(FP.bobPhase) * 0.007 : 0;

    // 2. Mouse sway orgânico
    FP.swayX += (0 - FP.swayX) * (1 - Math.exp(-12 * dt));
    FP.swayY += (0 - FP.swayY) * (1 - Math.exp(-12 * dt));
    const sx = Math.max(-0.04, Math.min(0.04, FP.swayX));
    const sy = Math.max(-0.04, Math.min(0.04, FP.swayY));

    // 3. Golpe de ataque Skyrim: arco dinâmico que corta e retorna à guarda
    let swingPosX = 0, swingPosY = 0, swingPosZ = 0;
    let swingRotX = 0, swingRotY = 0, swingRotZ = 0;

    if(isAttacking){
      FP.swingTimer = Math.min(1.0, FP.swingTimer + dt * 4.5);
      const p = FP.swingTimer;
      if(p < 0.25){
        // Preparação (Windup): puxa levemente para trás e ergue
        const w = p / 0.25;
        swingPosY = 0.025 * w;
        swingPosZ = 0.035 * w;
        swingRotX = 0.22 * w;
        swingRotY = -0.15 * w;
      } else if(p < 0.70){
        // Corte (Slash): golpe diagonal rápido cortando o ar à frente
        const s = (p - 0.25) / 0.45;
        const curve = Math.sin(s * Math.PI);
        swingPosX = -0.06 * curve;
        swingPosY = 0.025 - 0.045 * s;
        swingPosZ = 0.035 - 0.055 * curve;
        swingRotX = 0.22 - 0.65 * s;
        swingRotY = -0.15 + 0.35 * curve;
        swingRotZ = -0.28 * curve;
      } else {
        // Recuperação (Recovery): retorna suavemente à postura de guarda
        const r = (p - 0.70) / 0.30;
        const ease = 1 - r;
        swingPosX = -0.01 * ease;
        swingPosY = -0.02 * ease;
        swingRotX = -0.43 * ease;
        swingRotZ = -0.10 * ease;
      }
    } else {
      FP.swingTimer = 0;
    }

    // 4. Bloqueio e guarda com escudo/parada
    const wantBlock = isBlocking ? 1 : 0;
    FP.blockWeight += (wantBlock - FP.blockWeight) * (1 - Math.exp(-14 * dt));

    // Posicionamento do Braço Direito (Arma Principal):
    // Base Y calibrada em -0.095: SEMPRE visível em idle no terço inferior direito!
    if(FP.armR){
      const blockTiltX = FP.blockWeight * -0.25;
      const blockTiltY = FP.blockWeight * 0.30;
      const blockRaiseY = FP.blockWeight * 0.04;
      const blockPushX = FP.blockWeight * -0.05;

      FP.armR.position.set(
        0.14 + breatheX + walkBobX + sx + swingPosX + blockPushX,
        -0.095 + breatheY - walkBobY + sy + swingPosY + blockRaiseY,
        -0.32 + swingPosZ
      );
      FP.armR.rotation.set(
        0.18 + swingRotX + blockTiltX,
        -0.16 + swingRotY + blockTiltY,
        0.10 + swingRotZ - (isMoving ? Math.sin(FP.bobPhase) * 0.015 : 0)
      );
    }

    // Posicionamento do Braço Esquerdo (Escudo ou Mão Secundária):
    if(FP.armL){
      const hasShield = (global.Guard472 && typeof global.Guard472.hasShield === 'function' ? global.Guard472.hasShield() : false) || !!(global.run && global.run.equip && global.run.equip.sh);
      const isStaff = FP.currentWeaponKey.includes(':staff') || FP.currentWeaponKey.includes(':wand');

      let baseLX = -0.14, baseLY = -0.095, baseLZ = -0.32;
      let baseRotX = 0.18, baseRotY = 0.16, baseRotZ = -0.10;

      if(isStaff && !hasShield){
        // Com cajado/lança sem escudo: mão esquerda apoia a haste em postura bimanual
        baseLX = 0.04;
        baseLY = -0.11;
        baseLZ = -0.28;
        baseRotX = 0.25;
        baseRotY = -0.15;
        baseRotZ = 0.10;
      }

      const blockLiftX = FP.blockWeight * 0.08;
      const blockLiftY = FP.blockWeight * 0.06;
      const blockLiftZ = -FP.blockWeight * 0.04;

      FP.armL.position.set(
        baseLX - breatheX - walkBobX + sx + blockLiftX,
        baseLY + breatheY - walkBobY + sy + blockLiftY,
        baseLZ + blockLiftZ
      );
      FP.armL.rotation.set(
        baseRotX + (FP.blockWeight * 0.20),
        baseRotY + (FP.blockWeight * 0.25),
        baseRotZ - (FP.blockWeight * 0.10)
      );
    }

    // 5. Retículo Skyrim reativo
    const ch = document.getElementById('skyrim-crosshair-550');
    if(ch && ch.style.display !== 'none'){
      if(isAttacking || isBlocking){
        ch.classList.add('active');
      } else {
        ch.classList.remove('active');
      }
    }
  };

  /* ---------- Inicialização Automática ---------- */
  function init(){
    if(FP.initialized) return;
    FP.initialized = true;

    setupDOM();
    setupPointerLock();

    /* a animação roda depois da câmera: a pose de 1ª pessoa entra logo depois dela, no próprio Viajante */
    const W = global.Warrior127;
    if(W && typeof W.animate === 'function' && !W.animate._fp563){
      const orig = W.animate;
      W.animate = function(m){
        const r = orig.apply(this, arguments);
        try { if(FP.active && global.player && m === global.player.m && m.fp563) FP.pose(); } catch(_) {}
        return r;
      };
      W.animate._fp563 = true;
    }

    try {
      const saved = localStorage.getItem('pds_pov');
      if(saved === 'fp') FP.set(true);
    } catch(_) {}

    if(global.SkyrimOverhaul538){
      global.SkyrimOverhaul538.toggleFirstPerson = () => FP.toggle();
      Object.defineProperty(global.SkyrimOverhaul538, 'firstPerson', {
        get: () => FP.active,
        set: (v) => FP.set(v)
      });
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);
