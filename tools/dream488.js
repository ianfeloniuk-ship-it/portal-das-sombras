/* v488: Cena de sonho em 1ª pessoa com a Mão do Arquiteto e despertar estilo Skyrim */
(() => {
  'use strict';

  const D = window.Dream488 = {
    active: false,
    t: 0,
    duration: 9.35,
    onAwaken: null
  };

  const css = document.createElement('style');
  css.id = 'pds_dream_styles';
  css.textContent = `
    #pds_dream_overlay {
      position: fixed;
      inset: 0;
      z-index: 99998;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 11vh;
      box-sizing: border-box;
      user-select: none;
    }
    #pds_dream_subtitle {
      max-width: 880px;
      margin: 0 24px;
      font: 500 24px / 1.6 Georgia, "Cinzel", serif;
      color: #ffffff;
      text-align: center;
      text-shadow: 0 0 12px #c084fc, 0 0 24px #9333ea, 0 2px 8px #000, 0 4px 16px #000;
      letter-spacing: 0.6px;
      opacity: 0;
      transform: translateY(10px) scale(0.98);
      transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.3, 1), transform 0.5s cubic-bezier(0.2, 0.8, 0.3, 1);
    }
    #pds_dream_subtitle.show {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    #pds_dream_skip {
      position: fixed;
      top: 24px;
      right: 28px;
      z-index: 99999;
      background: rgba(15, 7, 24, 0.72);
      border: 1px solid rgba(168, 85, 247, 0.5);
      color: #e9d5ff;
      padding: 8px 18px;
      border-radius: 4px;
      font: 600 12px / 1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      letter-spacing: 1.8px;
      cursor: pointer;
      pointer-events: auto;
      transition: all 0.25s ease;
      text-transform: uppercase;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    }
    #pds_dream_skip:hover {
      background: rgba(147, 51, 234, 0.5);
      border-color: #c084fc;
      color: #fff;
      transform: translateY(-1px);
    }
    #pds_skyrim_wake {
      position: fixed;
      inset: 0;
      z-index: 99999;
      pointer-events: none;
      overflow: hidden;
      background: transparent;
    }
    .skyrim-eyelid-top {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 52%;
      background: #000;
      transform-origin: top;
      transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 10px 30px #000;
    }
    .skyrim-eyelid-bottom {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 52%;
      background: #000;
      transform-origin: bottom;
      transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 -10px 30px #000;
    }
    .skyrim-blur {
      position: absolute;
      inset: 0;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      transition: backdrop-filter 0.8s ease, -webkit-backdrop-filter 0.8s ease;
    }
    @media(max-width: 640px) {
      #pds_dream_subtitle {
        font-size: 18px;
        line-height: 1.5;
        padding: 0 10px;
      }
      #pds_dream_skip {
        top: 14px;
        right: 14px;
        padding: 6px 12px;
        font-size: 11px;
      }
    }
  `;
  document.head.appendChild(css);

  const LINES = [
    { text: "— Sim... é você. Eu finalmente o encontrei.", start: 0.8, end: 3.4 },
    { text: "— Você vai ser aquele que vai me erguer ou me destruir.", start: 3.6, end: 6.5 },
    { text: "— Acorde. Vamos juntos destruir o que resta deste mundo.", start: 6.7, end: 9.1 }
  ];

  const clamp01 = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp01(x); return x * x * (3 - 2 * x); };

  // Rig and articulation fallback for hand fingers
  function handRig(mesh) {
    if (!mesh?.geometry?.attributes?.position) return;
    const a = mesh.geometry.attributes.position, n = mesh.geometry.attributes.normal;
    mesh.userData.grip404 = { base: new Float32Array(a.array), norm: new Float32Array(n.array), last: NaN };
    mesh.frustumCulled = false;
  }

  function poseHand(hand, grip) {
    for (const mesh of hand.children || []) {
      const rig = mesh.userData.grip404;
      if (!rig || Math.abs(rig.last - grip) < 0.0005) continue;
      rig.last = grip;
      const p = mesh.geometry.attributes.position, n = mesh.geometry.attributes.normal, b = rig.base, ns = rig.norm;
      for (let i = 0; i < p.count; i++) {
        const k = i * 3, x = b[k], y = b[k + 1], z = b[k + 2];
        let X = x, Y = y, Z = z, NX = ns[k], NY = ns[k + 1], NZ = ns[k + 2];
        const finger = Math.max(0, Math.min(3, Math.floor((x + 0.33) / 0.14))), phase = [0, 0.07, 0.12, 0.18][finger];
        const close = ease((grip - phase) / (1 - phase)), weight = ease((0.025 - y) / 0.20) * (1 - ease((x - 0.19) / 0.13));
        const angle = (-0.42 + close * [0.84, 0.96, 1.02, 0.90][finger]) * weight;
        if (weight > 0) {
          const c = Math.cos(angle), sn = Math.sin(angle), py = y - 0.025, pz = z + 0.035;
          Y = 0.025 + py * c - pz * sn;
          Z = -0.035 + py * sn + pz * c;
          NY = ns[k + 1] * c - ns[k + 2] * sn;
          NZ = ns[k + 1] * sn + ns[k + 2] * c;
        }
        const thumb = ease((x - 0.16) / 0.16) * ease((0.34 - y) / 0.16) * (1 - ease((-0.12 - y) / 0.12));
        const ta = (0.22 - 0.78 * ease((grip - 0.12) / 0.88)) * thumb;
        if (thumb > 0) {
          const c = Math.cos(ta), sn = Math.sin(ta), px = X - 0.17, py = Y - 0.22;
          X = 0.17 + px * c - py * sn;
          Y = 0.22 + px * sn + py * c;
          const nx = NX;
          NX = nx * c - NY * sn;
          NY = nx * sn + NY * c;
        }
        p.setXYZ(i, X, Y, Z);
        n.setXYZ(i, NX, NY, NZ);
      }
      p.needsUpdate = n.needsUpdate = true;
    }
  }

  function extractHandFallback(source) {
    if (!source) return [];
    source.updateMatrixWorld(true);
    const parts = [];
    source.traverse(sm => {
      if (!sm.isSkinnedMesh) return;
      const g = sm.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, idx = g.index;
      const want = sm.skeleton.bones.findIndex(b => b.name === 'hand_R');
      if (want < 0) return;
      const pos = [], norm = [], uv = [];
      const v = new THREE.Vector3(), n = new THREE.Vector3(), nm = new THREE.Matrix3().getNormalMatrix(sm.matrixWorld);
      const main = i => {
        let best = -1, weight = -1;
        for (let k = 0; k < 4; k++) {
          const w = sw.array[i * 4 + k];
          if (w > weight) { weight = w; best = si.array[i * 4 + k]; }
        }
        return best;
      };
      for (let q = 0; q < (idx ? idx.count : g.attributes.position.count); q += 3) {
        const ids = [0, 1, 2].map(k => idx ? idx.getX(q + k) : q + k);
        if (!ids.every(i => main(i) === want)) continue;
        for (const i of ids) {
          v.fromBufferAttribute(g.attributes.position, i).applyMatrix4(sm.matrixWorld);
          pos.push(v.x, v.y, v.z);
          n.fromBufferAttribute(g.attributes.normal, i).applyMatrix3(nm).normalize();
          norm.push(n.x, n.y, n.z);
          uv.push(g.attributes.uv.getX(i), g.attributes.uv.getY(i));
        }
      }
      if (!pos.length) return;
      const hg = new THREE.BufferGeometry();
      hg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      hg.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
      hg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      hg.computeBoundingBox();
      const b = hg.boundingBox, c = b.getCenter(new THREE.Vector3()), sz = b.getSize(new THREE.Vector3()), factor = 1.2 / Math.max(sz.x, sz.y, sz.z);
      hg.translate(-c.x, -c.y, -c.z);
      hg.scale(factor, factor, factor);
      const hm = typeof archMat247 === 'function' ? archMat247(sm.material, false) : sm.material.clone();
      hm.transparent = true;
      parts.push({ geometry: hg, material: hm });
    });
    return parts;
  }

  // Audio cues
  function dreamTone(freq, duration, opts = {}) {
    try {
      if (typeof tone === 'function') tone(freq, anow(), duration, opts);
    } catch (_) {}
  }
  function dreamNoise(duration, opts = {}) {
    try {
      if (typeof noiz === 'function') noiz(anow(), duration, opts);
    } catch (_) {}
  }

  // 3D Scene Components
  let dreamGroup = null;
  let handGroup = null;
  let voidSphere = null;
  let purpleLight = null;
  let particles = [];
  let camPos = new THREE.Vector3();
  let uiOverlay = null;
  let subtitleEl = null;
  let skipBtn = null;
  let keyHandler = null;
  let currentLineIndex = -1;

  async function buildDreamScene(origin) {
    dreamGroup = new THREE.Group();
    dreamGroup.position.copy(origin);
    dreamGroup.userData.dream488 = true;

    // Void Sphere (inward-facing dark violet void)
    const sphereGeo = new THREE.SphereGeometry(45, 24, 18);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x07020e, side: THREE.BackSide });
    voidSphere = new THREE.Mesh(sphereGeo, sphereMat);
    dreamGroup.add(voidSphere);

    // Subtle violet ambient hemi light
    const hemi = new THREE.HemisphereLight(0x4c1d95, 0x090212, 0.7);
    dreamGroup.add(hemi);

    // Pulsating purple point light + rim light for dramatic silhouette
    purpleLight = new THREE.PointLight(0xb055ff, 3.2, 14, 1.3);
    purpleLight.position.set(0, 0.35, -1.1);
    dreamGroup.add(purpleLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 1.4);
    rimLight.position.set(0, 2.5, -3.5);
    dreamGroup.add(rimLight);

    // Floating purple motes / embers
    particles = [];
    const moteMat = new THREE.MeshBasicMaterial({ color: 0xc4b5fd, transparent: true, opacity: 0.65 });
    for (let i = 0; i < 28; i++) {
      const g = new THREE.OctahedronGeometry(0.04 + (i % 3) * 0.02);
      const m = new THREE.Mesh(g, moteMat);
      const ang = (i / 28) * Math.PI * 2;
      const rad = 1.2 + (i % 4) * 0.7;
      const y = -1.0 + ((i * 13) % 24) * 0.12;
      m.position.set(Math.cos(ang) * rad, y, -1.5 + Math.sin(ang) * rad);
      m.userData = { ang, rad, y, spd: 0.25 + (i % 5) * 0.08 };
      dreamGroup.add(m);
      particles.push(m);
    }

    // Extract Hand from arquiteto246.glb
    handGroup = new THREE.Group();
    handGroup.scale.setScalar(2.0);
    dreamGroup.add(handGroup);

    let parts = [];
    if (window.Reclaim372 && typeof window.Reclaim372.cachedHand === 'function') {
      try { parts = window.Reclaim372.cachedHand(); } catch (_) {}
    }
    if ((!parts || !parts.length) && typeof ARCH242 !== 'undefined' && ARCH242.g?.scene) {
      try { parts = extractHandFallback(ARCH242.g.scene); } catch (_) {}
    }

    for (const p of parts) {
      const g = p.geometry.clone();
      const m = p.material.clone();
      m.transparent = true;
      const mesh = new THREE.Mesh(g, m);
      mesh.userData.tripoSource = 'models/arquiteto246.glb#hand_R';
      if (window.Reclaim372?.handRig404) window.Reclaim372.handRig404(mesh);
      else handRig(mesh);
      handGroup.add(mesh);
    }

    // Initial hand position in deep void
    handGroup.position.set(0, 4.2, -3.8);
    handGroup.rotation.set(0.25, Math.PI - 0.15, -0.15);
    if (window.Reclaim372?.poseHand404) window.Reclaim372.poseHand404(handGroup, 0.05);
    else poseHand(handGroup, 0.05);

    scene.add(dreamGroup);
  }

  function cleanDreamScene() {
    if (!dreamGroup) return;
    scene.remove(dreamGroup);
    dreamGroup.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
        else o.material.dispose();
      }
    });
    dreamGroup = null;
    handGroup = null;
    voidSphere = null;
    purpleLight = null;
    particles = [];
  }

  function updateDream(dt) {
    if (!D.active) return;
    D.t += dt;
    const t = D.t;

    // Pulse light
    if (purpleLight) {
      const pulse = Math.sin(t * 3.8) * 1.1;
      const lungeBoost = t > 8.7 ? (t - 8.7) * 9 : 0;
      purpleLight.intensity = Math.max(0.8, 2.5 + pulse + lungeBoost);
    }

    // Orbit particles
    particles.forEach(p => {
      p.userData.ang += dt * p.userData.spd;
      p.position.x = Math.cos(p.userData.ang) * p.userData.rad;
      p.position.z = -1.5 + Math.sin(p.userData.ang) * p.userData.rad;
      p.position.y = p.userData.y + Math.sin(t * 2 + p.userData.ang) * 0.12;
    });

    // Animate Hand
    if (handGroup) {
      if (t < 2.9) {
        // Descend slowly from void
        const k = ease(t / 2.9);
        handGroup.position.set(
          0,
          4.2 + (0.12 - 4.2) * k,
          -3.8 + (-1.35 - (-3.8)) * k
        );
        const grip = 0.05 + 0.17 * k;
        if (window.Reclaim372?.poseHand404) window.Reclaim372.poseHand404(handGroup, grip);
        else poseHand(handGroup, grip);
      } else if (t < 8.7) {
        // Hover very close to player's face
        const hoverX = Math.sin(t * 1.1) * 0.035;
        const hoverY = 0.12 + Math.cos(t * 1.4) * 0.025;
        const hoverZ = -1.35 + Math.sin(t * 1.6) * 0.02;
        handGroup.position.set(hoverX, hoverY, hoverZ);
        const grip = 0.22 + Math.sin(t * 2.2) * 0.035;
        if (window.Reclaim372?.poseHand404) window.Reclaim372.poseHand404(handGroup, grip);
        else poseHand(handGroup, grip);
      } else {
        // Lunge forward to touch player head / camera
        const k = ease((t - 8.7) / 0.55);
        handGroup.position.set(
          0,
          0.12 + (0.02 - 0.12) * k,
          -1.35 + (-0.22 - (-1.35)) * k
        );
        const grip = 0.22 + 0.48 * k;
        if (window.Reclaim372?.poseHand404) window.Reclaim372.poseHand404(handGroup, grip);
        else poseHand(handGroup, grip);
      }
    }

    // Subtitle synchronization
    let lineIdx = -1;
    for (let i = 0; i < LINES.length; i++) {
      if (t >= LINES[i].start && t <= LINES[i].end) {
        lineIdx = i;
        break;
      }
    }

    if (lineIdx !== currentLineIndex) {
      currentLineIndex = lineIdx;
      if (subtitleEl) {
        if (lineIdx >= 0) {
          subtitleEl.textContent = LINES[lineIdx].text;
          subtitleEl.classList.add('show');
          // Sound cue on speech
          dreamTone(72, 0.45, { type: 'sine', v: 0.18, slide: 55 });
        } else {
          subtitleEl.classList.remove('show');
        }
      }
    }

    // Hand strike sound near the end
    if (t >= 8.75 && !D.struck) {
      D.struck = true;
      dreamTone(58, 0.6, { type: 'sawtooth', v: 0.28, filt: 220, slide: 28 });
      dreamNoise(0.5, { type: 'lowpass', v: 0.3, f: 380, sweep: 50 });
    }

    // Finish cutscene
    if (t >= D.duration) {
      finishDream();
    }
  }

  D.updateCamera = function(dt) {
    updateDream(dt);
    if (!D.active) return;
    const t = D.t;
    // 1st person subjective camera tremor
    const shakeAmp = 0.007 + Math.sin(t * 3.2) * 0.002 + (t > 8.7 ? (t - 8.7) * 0.08 : 0);
    camera.position.set(
      camPos.x + (Math.random() - 0.5) * shakeAmp,
      camPos.y + (Math.random() - 0.5) * shakeAmp,
      camPos.z + (Math.random() - 0.5) * shakeAmp
    );
    camera.lookAt(
      camPos.x + (Math.random() - 0.5) * shakeAmp * 0.4,
      camPos.y + (Math.random() - 0.5) * shakeAmp * 0.4,
      camPos.z - 5
    );
  };

  function finishDream() {
    if (!D.active) return;
    D.active = false;
    cleanDreamScene();
    if (uiOverlay && uiOverlay.parentNode) uiOverlay.parentNode.removeChild(uiOverlay);
    if (keyHandler) {
      removeEventListener('keydown', keyHandler, true);
      keyHandler = null;
    }
    skyrimAwaken();
  }

  D.skip = function() {
    if (!D.active) return;
    finishDream();
  };

  function skyrimAwaken() {
    // Efeito de piscar os olhos (Skyrim opening transition): fade-in da visão turva para nítida
    const wrap = document.createElement('div');
    wrap.id = 'pds_skyrim_wake';
    wrap.innerHTML = `
      <div class="skyrim-blur" id="pds_wake_blur"></div>
      <div class="skyrim-eyelid-top" id="pds_wake_top"></div>
      <div class="skyrim-eyelid-bottom" id="pds_wake_bot"></div>
    `;
    document.body.appendChild(wrap);

    const top = wrap.querySelector('#pds_wake_top');
    const bot = wrap.querySelector('#pds_wake_bot');
    const blur = wrap.querySelector('#pds_wake_blur');

    // Ensure player model is visible on Estrada Sul
    if (typeof player !== 'undefined' && player?.m?.root) {
      player.m.root.visible = true;
    }
    try { if (typeof updChunks === 'function') updChunks(true); } catch (_) {}

    // Initial eyes closed
    top.style.transform = 'translateY(0%)';
    bot.style.transform = 'translateY(0%)';
    blur.style.backdropFilter = 'blur(16px)';
    blur.style.webkitBackdropFilter = 'blur(16px)';

    // Eye flutter timeline (Skyrim awakening)
    // 1st blink: open 35% with heavy blur
    setTimeout(() => {
      top.style.transform = 'translateY(-35%)';
      bot.style.transform = 'translateY(35%)';
      blur.style.backdropFilter = 'blur(12px)';
      blur.style.webkitBackdropFilter = 'blur(12px)';
    }, 280);

    // Eyelids blink shut
    setTimeout(() => {
      top.style.transform = 'translateY(0%)';
      bot.style.transform = 'translateY(0%)';
    }, 720);

    // 2nd blink: open 75% with softer blur
    setTimeout(() => {
      top.style.transform = 'translateY(-75%)';
      bot.style.transform = 'translateY(75%)';
      blur.style.backdropFilter = 'blur(5px)';
      blur.style.webkitBackdropFilter = 'blur(5px)';
      try { if (typeof sfx === 'function') sfx('arise'); } catch (_) {}
    }, 1050);

    // Flutter down slightly
    setTimeout(() => {
      top.style.transform = 'translateY(-62%)';
      bot.style.transform = 'translateY(62%)';
    }, 1450);

    // Eyes open completely
    setTimeout(() => {
      top.style.transform = 'translateY(-105%)';
      bot.style.transform = 'translateY(105%)';
      blur.style.backdropFilter = 'blur(0px)';
      blur.style.webkitBackdropFilter = 'blur(0px)';
      document.body.classList.remove('story401');
    }, 1680);

    // Remove overlay & finish
    setTimeout(() => {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      if (typeof D.onAwaken === 'function') {
        const cb = D.onAwaken;
        D.onAwaken = null;
        cb();
      }
    }, 2550);
  }

  D.play = async function(opts = {}) {
    if (D.active) return;
    D.active = true;
    D.t = 0;
    D.struck = false;
    currentLineIndex = -1;
    D.onAwaken = opts.onAwaken || null;

    document.body.classList.add('story401');
    if (typeof W377 !== 'undefined' && W377.releaseAll) W377.releaseAll();
    if (typeof player !== 'undefined' && player?.m?.root) {
      player.m.root.visible = false;
    }

    // Wait for ARCH242 if needed
    if (typeof ARCH242 !== 'undefined' && !ARCH242.g && ARCH242.ready) {
      try {
        await Promise.race([
          ARCH242.ready,
          new Promise(r => setTimeout(r, 2200))
        ]);
      } catch (_) {}
    }

    // Camera origin in void high above the world
    const px = typeof player !== 'undefined' && player ? player.x : 0;
    const pz = typeof player !== 'undefined' && player ? player.z : 0;
    camPos.set(px, 850, pz);

    await buildDreamScene(camPos);

    // Create UI overlay for subtitles and skip button
    uiOverlay = document.createElement('section');
    uiOverlay.id = 'pds_dream_overlay';
    uiOverlay.innerHTML = `
      <button id="pds_dream_skip">Pular [ESC]</button>
      <div id="pds_dream_subtitle"></div>
    `;
    document.body.appendChild(uiOverlay);
    subtitleEl = uiOverlay.querySelector('#pds_dream_subtitle');
    skipBtn = uiOverlay.querySelector('#pds_dream_skip');

    skipBtn.onclick = () => D.skip();

    keyHandler = e => {
      if (!D.active) return;
      if (['Escape', 'Space', 'Enter'].includes(e.code)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        D.skip();
      } else {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    addEventListener('keydown', keyHandler, true);

    // Ambient dream hum
    dreamTone(55, 3.8, { type: 'sawtooth', v: 0.14, filt: 160, rev: 0.8 });
  };

  // Hook camUpdate
  (function hookCamera() {
    if (typeof camUpdate !== 'function') {
      setTimeout(hookCamera, 200);
      return;
    }
    const prev = camUpdate;
    camUpdate = function(dt) {
      if (D.active) {
        D.updateCamera(dt || 0.016);
        return;
      }
      return prev.apply(this, arguments);
    };
  })();
})();
