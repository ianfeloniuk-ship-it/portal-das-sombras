/* ============================================================================
 * PRIMEVA v550 — PRIMEIRA PESSOA IGUAL SKYRIM (1ª PESSOA 3D REAL)
 * Arquivo: tools/fp550.js
 * Direção e Criação: Ian Feloniuk
 * Revisão Estúdio Visual: 5 Especialistas (Skyrim × Primeva)
 *
 * 1. Câmera nos olhos do Viajante (1,86 m de altura, normalizado 2,02 m, avanço 0,10 m).
 * 2. Viewmodel 3D em Three.js com manoplas de ferro forjado e couro nórdico
 *    empunhando a arma real (espada, machado, maça, adaga, cajado, arco) e escudo em 3D.
 * 3. Balanço orgânico de respiração (idle), passada física (walk/run bobbing),
 *    arco inercial de corte (attack swing), guarda/bloqueio elevado e escudada.
 * 4. Mira central minimalista Skyrim (< · >) perfeitamente alinhada ao aimPoint().
 * 5. Alternância fluida com tecla V, scroll do mouse e Pointer Lock no canvas.
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

  /* ---------- Viewmodel 3D em Three.js ---------- */
  function buildViewmodel(){
    if(typeof THREE === 'undefined' || typeof camera === 'undefined' || !camera) return null;
    const T = THREE;

    const group = new T.Group();
    group.name = 'viewmodel_firstperson_550';
    group.renderOrder = 999;

    // Materiais PBR nórdicos recomendados pelos Especialistas
    const matIron = new T.MeshStandardMaterial({ color: 0x4a4947, roughness: 0.38, metalness: 0.65 });
    const matLeather = new T.MeshStandardMaterial({ color: 0x382417, roughness: 0.75, metalness: 0.05 });
    const matSteel = new T.MeshStandardMaterial({ color: 0xc2c6cc, roughness: 0.22, metalness: 0.88 });
    const matWood = new T.MeshStandardMaterial({ color: 0x442e1d, roughness: 0.82, metalness: 0.04 });
    const matBrass = new T.MeshStandardMaterial({ color: 0xc89832, roughness: 0.35, metalness: 0.80 });

    for(const m of [matIron, matLeather, matSteel, matWood, matBrass]){
      m.depthTest = true;
      m.depthWrite = true;
    }

    // Função construtora de manopla e antebraço facetado rústico
    function createArm(isRight){
      const arm = new T.Group();
      arm.name = isRight ? 'fp_arm_r' : 'fp_arm_l';

      // Antebraço chanfrado assimétrico (7 faces, quebrando cilindro puro)
      const foreGeom = new T.CylinderGeometry(0.042, 0.052, 0.26, 7);
      foreGeom.rotateX(Math.PI / 2);
      const forearm = new T.Mesh(foreGeom, matLeather);
      forearm.position.set(0, 0, 0.12);
      arm.add(forearm);

      // Placa dorsal de ferro forjado reforçada
      const plateGeom = new T.BoxGeometry(0.058, 0.024, 0.18);
      const plate = new T.Mesh(plateGeom, matIron);
      plate.position.set(0, 0.038, 0.12);
      arm.add(plate);

      // Correias e rebites de latão
      const strapGeom = new T.CylinderGeometry(0.048, 0.050, 0.03, 8);
      strapGeom.rotateX(Math.PI / 2);
      const strap1 = new T.Mesh(strapGeom, matBrass);
      strap1.position.set(0, 0, 0.06);
      arm.add(strap1);

      // Punho / Manopla articulada
      const fistGeom = new T.BoxGeometry(0.065, 0.056, 0.075);
      const fist = new T.Mesh(fistGeom, matIron);
      fist.position.set(0, 0.005, -0.015);
      arm.add(fist);

      return arm;
    }

    const armR = createArm(true);
    armR.position.set(0.24, -0.22, -0.42);
    armR.rotation.set(0.12, -0.18, 0.08);
    group.add(armR);

    const armL = createArm(false);
    armL.position.set(-0.24, -0.22, -0.42);
    armL.rotation.set(0.12, 0.18, -0.08);
    group.add(armL);

    // Soquete da arma na mão direita
    const wepHolder = new T.Group();
    wepHolder.name = 'fp_weapon_holder';
    wepHolder.position.set(0, 0.01, -0.04);
    armR.add(wepHolder);

    // Soquete do escudo na mão esquerda
    const shHolder = new T.Group();
    shHolder.name = 'fp_shield_holder';
    shHolder.position.set(-0.02, 0.02, -0.02);
    armL.add(shHolder);

    // Efeito mágico na mão esquerda
    const magHolder = new T.Group();
    magHolder.name = 'fp_magic_holder';
    magHolder.position.set(0, 0.02, -0.05);
    armL.add(magHolder);

    camera.add(group);
    group.visible = false;

    FP.viewmodel = group;
    FP.armR = armR;
    FP.armL = armL;
    FP.weaponHolder = wepHolder;
    FP.shieldHolder = shHolder;
    FP.magicHolder = magHolder;
    FP.materials = { matIron, matLeather, matSteel, matWood, matBrass };

    return group;
  }

  /* ---------- Visual das Armas 3D em Primeiro Plano ---------- */
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
      const shaft = new T.Mesh(new T.CylinderGeometry(0.018, 0.020, 0.65, 6), mats.matWood);
      shaft.position.set(0, 0.16, -0.15);
      shaft.rotation.x = Math.PI / 2.3;
      g.add(shaft);

      const head = new T.Mesh(new T.BoxGeometry(0.024, 0.22, 0.16), mats.matIron);
      head.position.set(0, 0.36, -0.36);
      head.rotation.x = Math.PI / 2.3;
      g.add(head);

      const edge = new T.Mesh(new T.BoxGeometry(0.008, 0.24, 0.04), mats.matSteel);
      edge.position.set(0, 0.38, -0.44);
      edge.rotation.x = Math.PI / 2.3;
      g.add(edge);
    } else if(kind === 'mace' || kind === 'hammer'){
      // Maça de Flanges
      const shaft = new T.Mesh(new T.CylinderGeometry(0.018, 0.020, 0.60, 6), mats.matIron);
      shaft.position.set(0, 0.16, -0.15);
      shaft.rotation.x = Math.PI / 2.3;
      g.add(shaft);

      const head = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.16, 6), mats.matSteel);
      head.position.set(0, 0.38, -0.38);
      head.rotation.x = Math.PI / 2.3;
      g.add(head);
    } else if(kind === 'staff' || kind === 'wand'){
      // Cajado Arcano
      const shaft = new T.Mesh(new T.CylinderGeometry(0.020, 0.024, 0.95, 6), mats.matWood);
      shaft.position.set(0, 0.22, -0.22);
      shaft.rotation.x = Math.PI / 2.3;
      g.add(shaft);

      const headMat = new T.MeshStandardMaterial({ color: 0x64b4ff, emissive: 0x2266dd, emissiveIntensity: 1.5, roughness: 0.15, metalness: 0.2 });
      const crystal = new T.Mesh(new T.OctahedronGeometry(0.065), headMat);
      crystal.position.set(0, 0.58, -0.58);
      g.add(crystal);

      const pl = new T.PointLight(0x60b0ff, 0.85, 3.5);
      pl.position.set(0, 0.58, -0.58);
      g.add(pl);
    } else if(kind === 'dagger'){
      // Adaga Furtiva
      const blade = new T.Mesh(new T.BoxGeometry(0.038, 0.010, 0.42), mats.matSteel);
      blade.position.set(0, 0.12, -0.22);
      blade.rotation.x = Math.PI / 2.3;
      g.add(blade);

      const guard = new T.Mesh(new T.BoxGeometry(0.10, 0.022, 0.024), mats.matIron);
      guard.position.set(0, 0.02, -0.04);
      guard.rotation.x = Math.PI / 2.3;
      g.add(guard);
    } else if(kind === 'bow'){
      // Arco Recurvo
      const limb = new T.Mesh(new T.TorusGeometry(0.38, 0.016, 6, 16, Math.PI * 0.7), mats.matWood);
      limb.position.set(0, 0.10, -0.25);
      limb.rotation.y = Math.PI / 2;
      limb.rotation.z = Math.PI / 1.4;
      g.add(limb);
    } else {
      // Espada Nórdica Clássica (Default)
      const grip = new T.Mesh(new T.CylinderGeometry(0.016, 0.018, 0.12, 6), mats.matLeather);
      grip.position.set(0, 0.02, -0.02);
      grip.rotation.x = Math.PI / 2.3;
      g.add(grip);

      const guard = new T.Mesh(new T.BoxGeometry(0.14, 0.024, 0.032), mats.matIron);
      guard.position.set(0, 0.06, -0.07);
      guard.rotation.x = Math.PI / 2.3;
      g.add(guard);

      const blade = new T.Mesh(new T.BoxGeometry(0.048, 0.012, 0.75), mats.matSteel);
      blade.position.set(0, 0.36, -0.38);
      blade.rotation.x = Math.PI / 2.3;
      g.add(blade);

      const fuller = new T.Mesh(new T.BoxGeometry(0.014, 0.014, 0.55), mats.matIron);
      fuller.position.set(0, 0.30, -0.32);
      fuller.rotation.x = Math.PI / 2.3;
      g.add(fuller);

      const pommel = new T.Mesh(new T.DodecahedronGeometry(0.024), mats.matIron);
      pommel.position.set(0, -0.04, 0.04);
      g.add(pommel);
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
      // Corpo do escudo redondo nórdico de madeira
      const body = new T.Mesh(new T.CylinderGeometry(0.24, 0.24, 0.032, 16), mats.matWood);
      body.rotation.x = Math.PI / 2;
      g.add(body);

      // Borda de ferro batido rebitada
      const rim = new T.Mesh(new T.TorusGeometry(0.24, 0.015, 6, 20), mats.matIron);
      g.add(rim);

      // Umbo central cônico/hemisférico
      const boss = new T.Mesh(new T.SphereGeometry(0.065, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), mats.matIron);
      boss.rotation.x = -Math.PI / 2;
      boss.position.z = 0.02;
      g.add(boss);

      g.scale.set(0.9, 0.9, 0.9);
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

    if(FP.viewmodel) FP.viewmodel.visible = FP.active;

    const P = global.player;
    if(P && P.m && P.m.bones && P.m.bones.head){
      if(FP.active){
        P.m.bones.head.scale.set(0.001, 0.001, 0.001);
      } else {
        P.m.bones.head.scale.set(0.88, 0.88, 0.88);
      }
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
      FP.swayX += e.movementX * 0.0006;
      FP.swayY += e.movementY * 0.0006;
    });

    // Zoom da rodinha do mouse: rolar para trás sai para 3ª pessoa, rolar para frente entra
    c.addEventListener('wheel', e => {
      if(!global.started || global.paused || global.modalOpen) return;
      if(FP.active && e.deltaY > 50){
        // Rolar para trás em 1ª pessoa volta para 3ª pessoa
        e.preventDefault();
        FP.set(false);
      } else if(!FP.active && (e.altKey || (global.pcCam && global.pcCam.distance <= 1.2)) && e.deltaY < -50){
        // Rolar para frente próximo do jogador entra em 1ª pessoa
        e.preventDefault();
        FP.set(true);
      }
    }, { passive: false });
  }

  /* ---------- Animações e Tick a Cada Frame ---------- */
  FP.tick = function(dt){
    const P = global.player;
    if(!P || P.dead || !FP.active || global.run?.mounted){
      if(FP.viewmodel && FP.viewmodel.visible) FP.viewmodel.visible = false;
      FP.bobY = 0;
      return;
    }

    if(!FP.viewmodel) buildViewmodel();
    if(FP.viewmodel && !FP.viewmodel.visible) FP.viewmodel.visible = true;

    updateWeaponVisual();
    updateShieldVisual();

    const t = (typeof time === 'number' ? time : performance.now() * 0.001);
    const isMoving = Math.hypot(P.vx || 0, P.vz || 0) > 0.15;
    const isSprinting = Math.hypot(P.vx || 0, P.vz || 0) > 4.5;
    const isBlocking = !!(global.Guard472 && typeof global.Guard472.blocking === 'function' && global.Guard472.blocking());
    const isAttacking = (P.atkCd || 0) > 0.02;

    // 1. Passada física e respiração
    if(isMoving){
      FP.bobPhase += dt * (isSprinting ? 12.0 : 7.5);
    } else {
      FP.bobPhase += dt * 2.0;
    }

    const breatheY = Math.sin(t * 1.6) * 0.004;
    const breatheX = Math.cos(t * 0.8) * 0.003;
    const walkBobX = isMoving ? Math.sin(FP.bobPhase) * 0.015 : 0;
    const walkBobY = isMoving ? Math.abs(Math.cos(FP.bobPhase)) * 0.020 : 0;
    FP.bobY = isMoving ? Math.sin(FP.bobPhase) * 0.012 : 0;

    // 2. Amortecimento do mouse sway
    FP.swayX += (0 - FP.swayX) * (1 - Math.exp(-12 * dt));
    FP.swayY += (0 - FP.swayY) * (1 - Math.exp(-12 * dt));
    const sx = Math.max(-0.06, Math.min(0.06, FP.swayX));
    const sy = Math.max(-0.06, Math.min(0.06, FP.swayY));

    // 3. Golpe de ataque (swing inercial 3D)
    let swingRotX = 0, swingRotY = 0, swingPosZ = 0;
    if(isAttacking){
      FP.swingTimer = Math.min(1, FP.swingTimer + dt * 10);
      const s = Math.sin(FP.swingTimer * Math.PI);
      swingRotX = -s * 0.75;
      swingRotY = -s * 0.45;
      swingPosZ = -s * 0.16;
    } else {
      FP.swingTimer = 0;
    }

    // 4. Bloqueio e guarda
    const wantBlock = isBlocking ? 1 : 0;
    FP.blockWeight += (wantBlock - FP.blockWeight) * (1 - Math.exp(-14 * dt));

    // Posicionamento final do Braço Direito (Arma)
    if(FP.armR){
      FP.armR.position.set(
        0.24 + breatheX + walkBobX + sx,
        -0.22 + breatheY - walkBobY + sy,
        -0.42 + swingPosZ
      );
      FP.armR.rotation.set(
        0.12 + swingRotX,
        -0.18 + swingRotY,
        0.08 - (isMoving ? Math.sin(FP.bobPhase) * 0.02 : 0)
      );
    }

    // Posicionamento final do Braço Esquerdo (Escudo / Mão Secundária)
    if(FP.armL){
      const blockLiftX = FP.blockWeight * 0.16;
      const blockLiftY = FP.blockWeight * 0.14;
      const blockLiftZ = -FP.blockWeight * 0.08;

      FP.armL.position.set(
        -0.24 - breatheX - walkBobX + sx + blockLiftX,
        -0.22 + breatheY - walkBobY + sy + blockLiftY,
        -0.42 + blockLiftZ
      );
      FP.armL.rotation.set(
        0.12 + (FP.blockWeight * 0.25),
        0.18 + (FP.blockWeight * 0.35),
        -0.08 - (FP.blockWeight * 0.15)
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

    // Restaura preferência salva (padrão 3ª pessoa na primeira vez, respeita save)
    try {
      const saved = localStorage.getItem('pds_pov');
      if(saved === 'fp') FP.set(true);
    } catch(_) {}

    // Desativa wrappers antigos conflitantes
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
