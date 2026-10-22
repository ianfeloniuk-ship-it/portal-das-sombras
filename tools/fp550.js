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

    if(!FP.viewmodel && FP.active) buildViewmodel();
    if(FP.viewmodel) FP.viewmodel.visible = FP.active;

    const P = global.player;
    if(P && P.m){
      // 1ª Pessoa: modelo de 3ª pessoa 100% oculto (sem clipar no viewport e sem deformação)
      // 3ª Pessoa: modelo de 3ª pessoa 100% visível
      if(P.m.root) P.m.root.visible = !FP.active;

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
      if(FP.viewmodel && FP.viewmodel.visible) FP.viewmodel.visible = false;
      FP.bobY = 0;
      return;
    }

    if(!FP.viewmodel) buildViewmodel();
    if(FP.viewmodel && !FP.viewmodel.visible) FP.viewmodel.visible = true;

    updateArmVisual();
    updateWeaponVisual();
    updateShieldVisual();

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
