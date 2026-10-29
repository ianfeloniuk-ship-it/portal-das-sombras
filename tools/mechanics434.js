/* v434 (Ian): mecânicas inéditas, com o visual do próprio jogo (Ian: "não bate com o jogo" — nada de formas soltas).
   1) Passo Silencioso (Ctrl alterna): -35% de velocidade, sem vibração/som; criaturas cegas/sensoriais (gosmas, slimes)
      não percebem; as outras só de muito perto. Primeiro golpe furtivo num alvo que não te viu: dano x2.
      Rastros no chão (pegadas, sangue azul da Fenda, brasas e coluna de fumaça) no Ato II (carroça) e Ato V (Aldric).
   2) Atos IV–VII: círculo de runas (shader da campanha) e runas flutuando nos guardiões + comparação das Marcas;
      Aldric ferido contra a rocha Tripo e escolta até Mira; veios de cristal reais (addVein) e brecha no muro Tripo
      com a Fenda esculpida (Rift131) e o Brann Tripo; Mapa Astral do Topo para relatar a Lyra.
   3) As 5 capitais: Pedra-Âncora (base Tripo própria de cada capital + cristal da Fenda do jogo flutuando), clima local
      e janela das Âncoras.
   4) Mergulho: Ctrl afunda, Espaço sobe, Fôlego (Vitalidade/Resistência), visão subaquática, corais e ruínas Tripo,
      criaturas marinhas e Portais Aquáticos (Fenda esculpida) — mais na região de Thalor.
   Altura: o relevo (terrain245) levanta no shader cada objeto pela altura do chão na raiz. Raiz em y=0 = no chão.
   Só o que espalha por muitos metros (rastros, clima) usa altura absoluta com userData.terrainAbsolute245. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const H = (x, z) => typeof terrH === 'function' ? terrH(x, z) : 0;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ready = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && run && profile && !profile.creationPending91;
  const P423 = () => { profile.m423 = profile.m423 || { anchors: {}, marks: [], astral: false }; return profile.m423; };
  const KEY = 'sneak423';
  try { if (!KEYACT.find(k => k[0] === KEY)) KEYACT.push([KEY, 'Passo silencioso / afundar na água', 'ControlLeft']); } catch (_) {}
  const sneakKey = () => { try { return keyOf(KEY); } catch (_) { return 'ControlLeft'; } };
  const API = window.Mech423 = { sneaking: false };
  const absolute = g => { g.userData.terrainAbsolute245 = true; return g; };

  /* ================= peças do jogo ================= */
  // Material igual ao do cenário Tripo (TripoEnvironment153): textura sRGB, sem brilho metálico, leve luz própria.
  function sceneryMat(m) {
    const mat = m.clone(); mat.side = T.DoubleSide;
    if (mat.map) { mat.map.encoding = T.sRGBEncoding; mat.map.anisotropy = 4; mat.color.setScalar(1.3); mat.emissiveMap = mat.map; mat.emissive.setRGB(.2, .19, .18); }
    mat.roughness = Math.max(.72, mat.roughness || 0); mat.metalness = 0; return mat;
  }
  const glbCache = new Map();
  function glb(name) { // modelos novos desta versão (gerados no Tripo): models/m434/<nome>.glb
    if (glbCache.has(name)) return glbCache.get(name);
    const p = new Promise(res => {
      if (!T.GLTFLoader) { res(null); return; }
      const l = new T.GLTFLoader(); if (window.MeshoptDecoder) l.setMeshoptDecoder(MeshoptDecoder);
      l.load('models/m434/' + name + '.glb', g => {
        const root = g.scene; root.updateMatrixWorld(true);
        root.traverse(o => { if (o.isMesh) { o.material = Array.isArray(o.material) ? o.material.map(sceneryMat) : sceneryMat(o.material); o.castShadow = true; o.receiveShadow = true; o.geometry.userData.shared = true; } });
        const b = new T.Box3().setFromObject(root), s = b.getSize(new T.Vector3()), wrap = new T.Group();
        root.position.x -= (b.min.x + b.max.x) / 2; root.position.y -= b.min.y; root.position.z -= (b.min.z + b.max.z) / 2;
        wrap.add(root); wrap.userData.h = s.y || 1; wrap.userData.w = Math.max(s.x, s.z) || 1; res(wrap);
      }, undefined, () => res(null));
    });
    glbCache.set(name, p); return p;
  }
  const fit = (tpl, h, w = Infinity) => { const g = tpl.clone(true), k = Math.min(h / tpl.userData.h, w / tpl.userData.w); g.scale.setScalar(k); g.userData.h = tpl.userData.h * k; return g; }; // h = altura máx., w = largura máx.
  function tripo(id, h, len) { // cenário Tripo já carregado pelo jogo (rochedo, pedras, rocha com musgo, muro, paliçada)
    if (typeof TripoEnvironment153 === 'undefined') return null;
    const m = TripoEnvironment153.models[id]; if (!m) return null;
    // O material do cenário Tripo é feito para cópias instanciadas (cor de base escura + cor por instância);
    // fora disso a peça saía preta. Aqui usa uma cópia simples com a mesma textura e o mesmo ajuste do cenário.
    const mats = tripoMats[id] || (tripoMats[id] = m.parts.map(p => Array.isArray(p.material) ? p.material.map(plainMat) : plainMat(p.material)));
    const g = new T.Group();
    m.parts.forEach((p, i) => { const mesh = new T.Mesh(p.geometry, mats[i]); mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); });
    if (len) g.scale.set(len / m.sx, h / m.h, len / m.sx); else g.scale.setScalar(h / m.h);
    return g;
  }
  const tripoMats = {};
  function plainMat(src) {
    const mat = new T.MeshStandardMaterial({ map: src.map || null, normalMap: src.normalMap || null, side: T.DoubleSide, roughness: .8, metalness: 0 });
    if (mat.map) { mat.color.setScalar(1.3); mat.emissiveMap = mat.map; mat.emissive.setRGB(.2, .19, .18); } else mat.color.copy(src.color);
    return mat;
  }
  const tripoReady = () => typeof TripoEnvironment153 !== 'undefined' ? TripoEnvironment153.ready : Promise.resolve();
  // Mesmo círculo de runas dos marcadores da campanha (campaign327 ringMat).
  function runeDisc(col, radius, k = 1) { // k: força (de dia num piso claro o aditivo estoura para branco)
    const mat = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
      uniforms: { t: { value: 0 }, c: { value: new T.Color(col).multiplyScalar(k) } },
      vertexShader: 'varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float t;uniform vec3 c;varying vec2 vP;void main(){float r=length(vP);float a=atan(vP.y,vP.x);float rune=step(.55,fract(a*4.77+t*.4))*smoothstep(1.45,1.3,r)*smoothstep(1.05,1.2,r);float ring=smoothstep(.06,0.,abs(r-1.6+.05*sin(t*2.)))+smoothstep(.05,0.,abs(r-.9));float glow=smoothstep(1.8,0.,r)*.18*(.6+.4*sin(t*3.));gl_FragColor=vec4(c*1.4,clamp(rune*.8+ring+glow,0.,1.));}' });
    const m = new T.Mesh(new T.CircleGeometry(1.8, 64), mat); m.rotation.x = -Math.PI / 2; m.position.y = .06; m.scale.setScalar(radius / 1.8); m.renderOrder = 6; m.userData.rune = mat; return m;
  }
  const discs = new Set(); // atualiza o tempo dos círculos
  function tex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t; }
  const TEX = {};
  function soft(key, stops) { return TEX[key] || (TEX[key] = tex(64, 64, (g, w) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); stops.forEach(([o, c]) => r.addColorStop(o, c)); g.fillStyle = r; g.fillRect(0, 0, w, w); })); }
  const TX = {
    foot: () => TEX.foot || (TEX.foot = tex(64, 128, g => { g.fillStyle = 'rgba(48,34,22,.85)'; g.beginPath(); g.ellipse(32, 44, 17, 30, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(32, 102, 13, 17, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(30,20,12,.55)'; for (let i = 0; i < 5; i++) { g.fillRect(19, 22 + i * 10, 26, 3); } })),
    blood: () => TEX.blood || (TEX.blood = tex(128, 128, g => { g.fillStyle = 'rgba(60,120,255,.85)'; g.beginPath(); g.arc(64, 64, 26, 0, TAU); g.fill(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + Math.sin(i) * .3, r = 30 + (i * 37 % 26); g.beginPath(); g.arc(64 + Math.cos(a) * r, 64 + Math.sin(a) * r, 4 + (i * 13 % 7), 0, TAU); g.fill(); } g.fillStyle = 'rgba(150,200,255,.7)'; g.beginPath(); g.arc(58, 58, 9, 0, TAU); g.fill(); })),
    glyph: i => TEX['g' + i] || (TEX['g' + i] = tex(64, 64, g => { g.strokeStyle = '#bff8ff'; g.lineWidth = 5; g.shadowColor = '#4fe8ff'; g.shadowBlur = 10; g.lineCap = 'round'; const P = [[[16, 12], [32, 52], [48, 12]], [[14, 32], [50, 32], [32, 10], [32, 54]], [[18, 14], [18, 50], [46, 50]], [[16, 50], [32, 12], [48, 50], [22, 34]], [[32, 10], [12, 32], [32, 54], [52, 32], [32, 10]]][i % 5]; g.beginPath(); P.forEach((p, k) => k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); }))
  };
  const flat = (w, d, map, color = 0xffffff, add = false) => { const m = new T.Mesh(new T.PlaneGeometry(w, d), new T.MeshBasicMaterial({ map, color, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, blending: add ? T.AdditiveBlending : T.NormalBlending })); m.rotation.x = -Math.PI / 2; return m; };
  function freeSpot(x0, z0, r0, r1, rad) {
    for (let r = r0; r <= r1; r += 2) for (let i = 0; i < 24; i++) {
      const a = i / 24 * TAU + r * .37, x = x0 + Math.cos(a) * r, z = z0 + Math.sin(a) * r;
      if (typeof freeAt === 'function' && freeAt(x, z, rad) && freeAt(x + rad, z, 1) && freeAt(x - rad, z, 1) && freeAt(x, z + rad, 1) && freeAt(x, z - rad, 1) && !(L.inter || []).some(it => !it.hidden && Math.hypot(it.x - x, it.z - z) < rad + 3)) return [x, z];
    }
    return null;
  }
  function addCol(x, z, r) { const c = { x, z, r }; try { hadd(HASH, c); } catch (_) {} return c; }
  function delCol(c) { try { if (c) hrem(c); } catch (_) {} }

  /* ---------- HUD ---------- */
  const hud = document.createElement('div');
  hud.id = 'hud423';
  // v440 (Ian: tampava o aviso do F e as barras): dentro do painel de Vida (#stat), só quando o passo silencioso está ativo ou mergulhando
  hud.style.cssText = 'display:none;gap:8px;align-items:center;margin-top:3px;font:600 10px system-ui;color:#e9dfc0';
  hud.innerHTML = '<button id="sneak423" style="pointer-events:auto;background:#122019d9;border:1px solid #b9974f;color:#e9dfc0;border-radius:6px;padding:2px 8px;font:600 10px system-ui;cursor:pointer;letter-spacing:.3px" title="Passo silencioso (Ctrl): -35% de velocidade, não faz vibração nem som. Criaturas cegas não te percebem; o primeiro golpe furtivo causa dano dobrado.">Passo silencioso</button>' +
    '<div id="breath423" hidden style="flex:1;min-width:80px;height:8px;border:1px solid #b9974f;border-radius:5px;background:#0b1a16;overflow:hidden" title="Fôlego"><div style="height:100%;width:100%;background:linear-gradient(90deg,#4fb7e8,#c8f2ff)"></div></div>';
  document.body.appendChild(hud); // vai para dentro do #stat no hudShow
  const under = document.createElement('div');
  under.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:5;background:radial-gradient(ellipse at center,rgba(30,110,140,.18),rgba(4,36,60,.66));opacity:0;transition:opacity .4s';
  document.body.appendChild(under);
  function hudShow() {
    const st = document.getElementById('stat'); if (st && hud.parentElement !== st) st.appendChild(hud);
    const br = document.getElementById('breath423'), sn = document.getElementById('sneak423');
    sn.style.display = API.sneaking ? '' : 'none';
    hud.style.display = st && ready() && (API.sneaking || (br && !br.hidden)) ? 'flex' : 'none';
  }

  /* ================= 1) PASSO SILENCIOSO ================= */
  function setSneak(on) {
    API.sneaking = !!on && !run?.mounted;
    const b = document.getElementById('sneak423');
    if (b) { b.style.background = API.sneaking ? '#5a4514ee' : '#122019d9'; b.textContent = API.sneaking ? 'Passo silencioso: ativo' : 'Passo silencioso'; }
  }
  document.getElementById('sneak423').onclick = () => { if (ready()) setSneak(!API.sneaking); };
  const BLIND = /gosma|slime|cogu|glub/i;
  /* A IA só liga o aggro com pickTarget achando o jogador E linha de visão (los). Embrulhar pickTarget entra em
     laço com o witcher377 (ele re-embrulha a cada quadro), então o filtro fica no los. */
  const los0 = los;
  los = function (x1, z1, x2, z2) {
    try {
      if (API.sneaking && x2 === player.x && z2 === player.z && !Water.swim()) {
        const e = enemies.find(q => q.x === x1 && q.z === z1);
        if (e && !e.aggro) { const d = Math.hypot(x2 - x1, z2 - z1), blind = BLIND.test(e.kind || '') || e.blind423; if (blind ? d > .9 : d > 3.2) return false; }
      }
    } catch (_) {}
    return los0.apply(this, arguments);
  };
  const he0 = hurtEnemy;
  hurtEnemy = function (e, amt, sx, sz, o = {}) {
    try {
      if (o && o.fromPlayer && e && !e.dead && !e.aggro && API.sneaking && !e.sneak423) { e.sneak423 = true; amt *= 2; floater(e.x, e.z, 'FURTIVO x2', '#ffd36b', true); }
    } catch (_) {}
    return he0.call(this, e, amt, sx, sz, o);
  };
  const mv0 = moveEnt;
  moveEnt = function (e, dx, dz) {
    try {
      if (e === player) {
        if (API.sneaking && !Water.swim()) { dx *= .65; dz *= .65; }
      }
    } catch (_) {}
    return mv0.call(this, e, dx, dz);
  };
  function sneakPose() { // agachado: tronco à frente, joelhos dobrados no plano sagital (sem abrir as pernas)
    if (!API.sneaking || !player?.m?.bones || !player?.m?.root || Water.swim()) return;
    const m = player.m, b = m.bones, root = m.root;
    try {
      root.updateMatrixWorld(true);
      const charQ = root.getWorldQuaternion(new THREE.Quaternion()), D = Math.PI / 180;
      const rotBone = (bone, degX, degY = 0, degZ = 0) => {
        if (!bone || !bone.parent) return;
        const e = new THREE.Euler(degX * D, degY * D, degZ * D, 'XYZ');
        const dLocal = new THREE.Quaternion().setFromEuler(e);
        const dWorld = charQ.clone().multiply(dLocal).multiply(charQ.clone().invert());
        const bw = bone.getWorldQuaternion(new THREE.Quaternion()), pw = bone.parent.getWorldQuaternion(new THREE.Quaternion());
        bone.quaternion.copy(pw.invert().multiply(dWorld.multiply(bw)));
      };
      rotBone(b.spine, 16);
      rotBone(b.thigh_l, -22);
      rotBone(b.thigh_r, -22);
      rotBone(b.shin_l, 32);
      rotBone(b.shin_r, 32);
      root.position.y -= .12;
      root.updateMatrixWorld(true);
    } catch (_) {}
  }
  if (window.Anim303) { const p0 = Anim303.post; Anim303.post = function (P) { const r = p0.apply(this, arguments); try { if (P === player) { sneakPose(); Water.frame(); } } catch (_) {} return r; }; }

  /* ---------- rastros (Ato II e Ato V) ---------- */
  const Tracks = { g: null, key: '', smoke: [], embers: null };
  function clearTracks() { if (Tracks.g) { scene.remove(Tracks.g); Tracks.g.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); } Tracks.g = null; Tracks.key = ''; Tracks.smoke = []; Tracks.embers = null; }
  function trackTarget() {
    const C = window.Campaign327; if (!C || L.mode !== 'world') return null;
    for (const id of ['a2', 'a5']) { const s = C.state(id); if (!s || s.done) continue; const ok = id === 'a2' ? s.s === 1 : s.s === 0; if (ok && s.pos) return { id, x: s.pos[0], z: s.pos[1] }; }
    return null;
  }
  function buildTracks(t) {
    clearTracks();
    const c = nearestCity(t.x, t.z).c, g = absolute(new T.Group()); g.name = 'Tracks433';
    const dx = t.x - c.x, dz = t.z - c.z, D = Math.hypot(dx, dz) || 1, ux = dx / D, uz = dz / D;
    const start = Math.min(D - 12, 40 * (typeof CITYK !== 'undefined' ? CITYK : 1)), n = Math.max(1, Math.floor((D - start - 5) / 1.45));
    const footMat = new T.MeshBasicMaterial({ map: TX.foot(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    const foot = new T.InstancedMesh(new T.PlaneGeometry(.2, .4).rotateX(-Math.PI / 2), footMat, n);
    const bloodMat = new T.MeshBasicMaterial({ map: TX.blood(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    const blood = new T.InstancedMesh(new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), bloodMat, Math.max(1, Math.ceil(n / 6)));
    const M = new T.Matrix4(), q = new T.Quaternion(), up = new T.Vector3(0, 1, 0);
    let bi = 0;
    for (let i = 0; i < n; i++) {
      const d = start + i * 1.45, side = i % 2 ? .17 : -.17, wob = Math.sin(i * .37) * 1.1 + Math.sin(i * .11) * 1.8;
      const x = c.x + ux * d - uz * (side + wob), z = c.z + uz * d + ux * (side + wob);
      q.setFromAxisAngle(up, Math.atan2(ux, uz) + Math.sin(i * .37) * .25);
      M.compose(new T.Vector3(x, H(x, z) + .03, z), q, new T.Vector3(1, 1, 1)); foot.setMatrixAt(i, M);
      if (i % 6 === 3 && bi < blood.count) { const s = .5 + (i % 3) * .25; q.setFromAxisAngle(up, i); M.compose(new T.Vector3(x + .35, H(x + .35, z) + .035, z), q, new T.Vector3(s, 1, s)); blood.setMatrixAt(bi++, M); }
    }
    blood.count = bi; g.add(foot, blood);
    // brasas: pontos brilhando em volta do local
    const ep = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) { const a = Math.random() * TAU, r = 1.2 + Math.random() * 7, x = t.x + Math.cos(a) * r, z = t.z + Math.sin(a) * r; ep.set([x, H(x, z) + .08 + Math.random() * .1, z], i * 3); }
    const eg = new T.BufferGeometry(); eg.setAttribute('position', new T.BufferAttribute(ep, 3));
    const embers = new T.Points(eg, new T.PointsMaterial({ map: soft('ember', [[0, 'rgba(255,230,160,1)'], [.35, 'rgba(255,120,30,.9)'], [1, 'rgba(255,60,0,0)']]), size: .45, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    embers.frustumCulled = false; g.add(embers); Tracks.embers = embers;
    // coluna de fumaça preta no horizonte
    const sm = new T.SpriteMaterial({ map: soft('smoke', [[0, 'rgba(40,38,36,.9)'], [.55, 'rgba(30,28,28,.55)'], [1, 'rgba(20,20,20,0)']]), transparent: true, depthWrite: false });
    for (let i = 0; i < 26; i++) { const p = new T.Sprite(sm.clone()); p.userData.k = i / 26; p.userData.s = Math.random() * 6; g.add(p); Tracks.smoke.push(p); }
    Tracks.base = { x: t.x - 2.5, z: t.z - 2, y: H(t.x - 2.5, t.z - 2) };
    scene.add(g); Tracks.g = g; Tracks.key = t.id + ':' + Math.round(t.x) + ':' + Math.round(t.z);
  }
  function tickTracks(dt, now) {
    const t = trackTarget();
    if (!t) { if (Tracks.g) clearTracks(); return; }
    const k = t.id + ':' + Math.round(t.x) + ':' + Math.round(t.z);
    if (k !== Tracks.key) buildTracks(t);
    if (Tracks.embers) Tracks.embers.material.opacity = .65 + Math.sin(now * .013) * .3;
    const b = Tracks.base;
    for (const p of Tracks.smoke) { const u = p.userData; u.k = (u.k + dt * .045) % 1; const k2 = u.k; p.position.set(b.x + Math.sin(k2 * 6 + u.s) * 2 * k2 + k2 * 9, b.y + .6 + k2 * 48, b.z + Math.cos(k2 * 5 + u.s) * 1.5 * k2); p.scale.setScalar(1.6 + k2 * 11); p.material.opacity = .85 * Math.min(1, k2 * 6) * (1 - k2); p.material.rotation = u.s + k2 * 2; }
  }

  /* ================= 2) ATOS IV–VII ================= */
  const C = () => window.Campaign327;
  const at = (id, step) => { const s = C()?.state(id); return s && !s.done && s.s === step ? s : null; };
  /* Ato IV: runas nos guardiões */
  const auras = new Map();
  function runeAura(e) {
    const g = new T.Group(), r = Math.max(1.6, (e.r || 1) * 2.2), h = Math.max(1.6, (e.h || e.ht || 2) * .7);
    const disc = runeDisc(0x6ff0ff, r); g.add(disc); discs.add(disc);
    const sp = [];
    for (let i = 0; i < 5; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: TX.glyph(i), color: 0xbff8ff, transparent: true, depthWrite: false, blending: T.AdditiveBlending })); s.scale.setScalar(.75); g.add(s); sp.push(s); }
    g.position.set(e.x, 0, e.z); scene.add(g); auras.set(e, { g, sp, r, h, disc });
  }
  function dropAura(e) { const a = auras.get(e); if (!a) return; scene.remove(a.g); discs.delete(a.disc); a.g.traverse(o => { if (o.material) o.material.dispose(); if (o.geometry && !o.isSprite) o.geometry.dispose(); }); auras.delete(e); }
  function tickAct4(now) {
    const on = !!at('a4', 0) && L.mode === 'world';
    if (on) for (const e of enemies) if (e.isBoss && !e.dead && !auras.has(e) && e.m?.root) runeAura(e);
    for (const [e, a] of auras) {
      if (!on || e.dead || !enemies.includes(e)) { if (e.dead && on) continue; dropAura(e); continue; }
      a.g.position.set(e.x, 0, e.z);
      a.sp.forEach((s, i) => { const ang = now * .0011 + i / 5 * TAU; s.position.set(Math.cos(ang) * (a.r * .75), a.h + Math.sin(now * .002 + i) * .25, Math.sin(ang) * (a.r * .75)); s.material.opacity = .75 + Math.sin(now * .004 + i) * .25; });
    }
  }
  const ke0 = killEnemy;
  killEnemy = function (e) {
    const had = e && !e.dead && auras.has(e);
    const r = ke0.apply(this, arguments);
    try { if (had && e.dead) { const a = auras.get(e); a.sp.forEach(s => s.material.color.set(0xffd36b)); setTimeout(() => dropAura(e), 2500); const S = P423(); S.marks.push({ n: e.name || e.short || 'Guardião', seed: (Math.random() * 1e9) | 0 }); S.marks = S.marks.slice(-2); save423(); setTimeout(() => marksView(), 1100); } } catch (_) {}
    return r;
  };
  function glyph(seed, common) {
    let s = seed >>> 0; const R = () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0) % 1000) / 1000;
    let out = '<svg viewBox="-50 -50 100 100" width="150" height="150" style="background:radial-gradient(#183028,#0b1612);border:1px solid #b9974f;border-radius:8px">';
    out += '<circle r="38" fill="none" stroke="#3f6a5e" stroke-width="1.5"/><circle r="30" fill="none" stroke="#2b4a42" stroke-width="1"/>';
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; out += '<circle cx="' + (Math.cos(a) * 38).toFixed(1) + '" cy="' + (Math.sin(a) * 38).toFixed(1) + '" r="3.5" fill="#e0c068"/>'; }
    for (let i = 0; i < 4; i++) { const a = R() * TAU, b = R() * TAU; out += '<line x1="' + (Math.cos(a) * 28).toFixed(1) + '" y1="' + (Math.sin(a) * 28).toFixed(1) + '" x2="' + (Math.cos(b) * 28).toFixed(1) + '" y2="' + (Math.sin(b) * 28).toFixed(1) + '" stroke="#7fe8f0" stroke-width="2.2" stroke-linecap="round"/>'; }
    out += '<path d="M0 -14 L12 8 L-12 8 Z" fill="none" stroke="' + (common ? '#ff7b6b' : '#e0c068') + '" stroke-width="3" stroke-linejoin="round"/><circle r="3" fill="' + (common ? '#ff7b6b' : '#e0c068') + '"/></svg>';
    return out;
  }
  function marksView() {
    if (typeof openModal !== 'function') return;
    const M = P423().marks || [];
    let h = '<div style="line-height:1.6;font-size:14px;color:#e8e0cc">';
    h += '<p style="margin-top:0">As <b>Marcas do Arquiteto</b> são glifos rúnicos gravados nas fendas e nos guardiões das Fendas Antigas (a partir do <b>Ato IV</b>). Cada guardião derrotado concede uma runa flutuante para comparação geométrica.</p>';
    if (!M.length) {
      h += '<div style="background:rgba(255,255,255,0.05);border:1px dashed rgba(224,192,104,0.35);border-radius:8px;padding:22px;text-align:center;margin:18px 0">';
      h += '<div style="font-size:32px;margin-bottom:8px">🏛️ ⬡ ⚔️</div>';
      h += '<b style="color:#e0c068;font-size:15px">NENHUMA MARCA REGISTRADA AINDA</b>';
      h += '<p style="opacity:0.8;font-size:13px;max-width:440px;margin:8px auto 0">Derrote os Guardiões das Fendas (como no <i>Ato IV · O Chamado do Arquiteto</i> e nas Fendas Maiores) para coletar seus fragmentos de marcas e compará-los aqui com Lyra.</p>';
      h += '</div>';
      h += '<p style="opacity:0.65;font-size:12px;text-align:center">Quando duas ou mais marcas forem registradas, o sinal comum em vermelho revelará a geometria central do Arquiteto.</p>';
    } else {
      h += '<p>As runas dos guardiões têm traços diferentes, mas o mesmo sinal central — um triângulo com um ponto, cercado por cinco marcas. É a <b>Marca do Arquiteto</b>:</p>';
      h += '<div style="display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin:16px 0">';
      M.forEach(m => { h += '<div style="text-align:center;background:rgba(0,0,0,0.25);border:1px solid #444;border-radius:6px;padding:10px 14px">' + glyph(m.seed, M.length > 1) + '<br><b style="color:#e0c068">' + esc(m.n) + '</b></div>'; });
      if (M.length < 2) h += '<div style="text-align:center;opacity:.65;width:150px;padding-top:40px;border:1px dashed #555;border-radius:6px;padding:20px 10px">Derrote mais um guardião para comparar os sinais comuns.</div>';
      h += '</div>';
      h += (M.length > 1 ? '<p style="color:#ff9b8b;font-weight:bold;text-align:center">Em vermelho: o sinal que se repete nos dois. Leve a comparação a Lyra.</p>' : '');
    }
    h += '</div>';
    openModal('MARCAS DO ARQUITETO', h);
  }
  /* Ato V e Ato VI (brecha): cenas montadas junto com as do scenes406 */
  let escort = null;
  if (window.Scenes406) {
    const b0 = Scenes406.build;
    Scenes406.build = function (m, s, w, pts) {
      const r = b0.apply(this, arguments);
      try { actScene(m, s, w, pts); } catch (err) { console.warn('m434 build', err); }
      return r;
    };
  }
  function actScene(m, s, w, pts) {
    if (m.id === 'a5' && s.s === 0 && pts[0]) {
      const f = w.figs[0], x = f ? f.x : pts[0][0], z = f ? f.z : pts[0][1];
      tripoReady().then(() => {
        if (C()?.W?.get('a5') !== w) return;
        const g = new T.Group(); g.position.set(x - .95, 0, z - .15);
        const rk = tripo('mossrock', 1.5) || tripo('boulder', 1.5); if (rk) { rk.rotation.y = 1.2; g.add(rk); }
        const bl = flat(1.3, 1.3, TX.blood()); bl.position.set(1.4, .04, .4); g.add(bl);
        scene.add(g); w.grps.push(g);
      });
      if (f?.m?.root) { f.m.root.rotation.y = Math.PI / 2; f.m.wounded401 = true; f.down = true; }
    }
    if (m.id === 'a6' && s.s === 4 && pts[0]) {
      const x = pts[0][0], z = pts[0][1];
      tripoReady().then(() => {
        if (C()?.W?.get('a6') !== w) return;
        const make = (dx, rot, len) => { const p = tripo('wall', 4.2, len); if (!p) return; const g = new T.Group(); g.position.set(x + dx, 0, z); g.rotation.y = rot; g.add(p); scene.add(g); w.grps.push(g); };
        make(-5.6, 0, 6.6); make(5.6, 0, 6.6);
        for (const [dx, dz, h, r] of [[-1.6, 1.6, .9, .3], [1.3, 1.9, .7, 1.9], [.2, 2.6, .55, 3]]) { const p = tripo('stones', h); if (!p) continue; const g = new T.Group(); g.position.set(x + dx, 0, z + dz); g.rotation.y = r; g.add(p); scene.add(g); w.grps.push(g); }
        if (window.Rift131) { const rift = Rift131.create({ seed: 428, legacyLinearOutput: true }); rift.scale.setScalar(.82); const g = new T.Group(); g.position.set(x, 0, z); g.add(rift); scene.add(g); w.grps.push(g); w.breach428 = rift; }
      });
      if (window.Citizens133) Citizens133.load('Brann').then(ok => {
        if (!ok || C()?.W?.get('a6') !== w) return;
        const br = Citizens133.create('Brann'); if (!br) return;
        br.root.position.set(x + 3.6, 0, z + 3.2); br.root.rotation.y = Math.atan2(-3.6, -3.2); scene.add(br.root); w.grps.push(br.root); w.brann428 = br;
      });
    }
  }
  function tickAct5(dt) {
    const s1 = at('a5', 1);
    if (!s1 || L.mode !== 'world') { if (escort) { scene.remove(escort.root); escort = null; } return; }
    if (!escort) {
      try {
        const a = makeActor({ body: 0x4a3a2a, hair: 0xe8e8ff, wep: 'sword', gk: 'Knight', tint: 0xffe0c0, scale: 1 }); // mesmo visual do Aldric da campanha
        escort = { root: a.root, m: a, x: player.x - 1.5, z: player.z - 1.5, t: 0 }; a.root.position.set(escort.x, 0, escort.z); scene.add(a.root);
        toast('<b>Aldric</b> se apoia no seu ombro. Leve-o até a Mira, na Loja de Poções.', 6000);
      } catch (_) { return; }
    }
    const dx = player.x - escort.x, dz = player.z - escort.z, d = Math.hypot(dx, dz);
    if (d > 40) { escort.x = player.x - 1.5; escort.z = player.z - 1.5; }
    else if (d > 1.6) { const sp = Math.min(d - 1.6, dt * Math.min(4.2, d)); escort.x += dx / d * sp; escort.z += dz / d * sp; escort.t += dt; }
    escort.root.position.set(escort.x, Math.abs(Math.sin(escort.t * 4)) * .04, escort.z); escort.root.rotation.y = Math.atan2(dx, dz); escort.root.rotation.z = Math.sin(escort.t * 4) * .07;
    try { animChibi(escort.m, { move: d > 1.7 ? .5 : 0, atk: 0, dead: 0, wind: 0 }, escort.t * 2); } catch (_) {}
  }
  /* Ato VI: veios de cristal de verdade (addVein do jogo: modelo, picareta, som e storyEv('mine')) */
  let veins = [];
  function clearVeins() { for (const it of veins) { it.hidden = true; if (it.g?.parent) it.g.parent.remove(it.g); const i = L.inter.indexOf(it); if (i >= 0) L.inter.splice(i, 1); } veins = []; }
  function tickAct6() {
    const s = at('a6', 2);
    if (!s || L.mode !== 'world') { if (veins.length) clearVeins(); return; }
    if (veins.length || typeof addVein !== 'function') return;
    const c = nearestCity(player.x, player.z).c, R = 60 * (typeof CITYK !== 'undefined' ? CITYK : 1) + 26;
    for (let i = 0; i < 6; i++) {
      const p = freeSpot(c.x + Math.cos(i / 6 * TAU + .4) * R, c.z + Math.sin(i / 6 * TAU + .4) * R, 0, 14, 1.6); if (!p) continue;
      const it = addVein(p[0], p[1], Math.min(9, typeof rankOf === 'function' ? rankOf() : 0), 4); if (!it) continue;
      it.label = 'F · MINERAR CRISTAL DA FENDA'; it.m428 = true; veins.push(it);
    }
    if (veins.length) toast('<b>[HISTÓRIA]</b> Veios de Cristal da Fenda brotaram em volta da cidade. Use F para minerar.', 6000);
  }
  function tickBreach(dt) {
    const w = C()?.W?.get('a6'); if (!w?.breach428 || !window.Rift131) return;
    Rift131.update(w.breach428, dt);
    const s = C().state('a6');
    if (s && s.fightDone && !w.closed428) { w.closed428 = true; Rift131.close(w.breach428, false); }
    if (w.brann428) { try { Citizens133.animate(w.brann428, null, performance.now() / 1000); } catch (_) {} }
  }
  /* Ato VII: Mapa Astral */
  function astralView(onDone) {
    const frags = [['Mundo de Aster', 30, 40], ['Ilhas de Vidro', 72, 24], ['Mar sem Fundo', 84, 64], ['Coroa de Ossos', 54, 82], ['Planície Partida', 17, 72], ['Torre Inversa', 46, 15], ['Mundo do Viajante', 62, 48]];
    const stars = Array.from({ length: 70 }, (_, i) => 'radial-gradient(1px 1px at ' + ((i * 37) % 100) + '% ' + ((i * 61) % 100) + '%,#fff' + (i % 3 ? '8' : 'f') + ',transparent)').join(',');
    let h = '<p>No Andar 100, a pedra do topo mostra mundos inteiros em pedaços. Toque cada fragmento para cartografá-lo.</p><div id="astral423" style="position:relative;height:310px;background:' + stars + ',radial-gradient(ellipse at 50% 45%,#2a2358,#0b0920 70%);border:1px solid #b9974f;border-radius:10px;overflow:hidden">';
    frags.forEach((f, i) => { h += '<button data-i="' + i + '" aria-label="Fragmento ' + (i + 1) + '" style="position:absolute;left:' + f[1] + '%;top:' + f[2] + '%;transform:translate(-50%,-50%) rotate(45deg);background:#3a2f7a;border:1px solid #c9b8ff;width:20px;height:20px;cursor:pointer;box-shadow:0 0 12px #8f7bff"></button>'; });
    h += '<svg id="astralL423" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"></svg></div><p id="astralT423">0 de ' + frags.length + ' fragmentos.</p><button class="btn" id="astralOk423" disabled>RELATAR A LYRA</button>';
    openModal('MAPA ASTRAL — CARTOGRAFIA DO TOPO', h);
    const got = []; const box = document.getElementById('astral423');
    box.querySelectorAll('button').forEach(b => b.onclick = () => {
      const i = +b.dataset.i; if (got.includes(i)) return; got.push(i); const f = frags[i];
      b.style.background = i === 6 ? '#c9a03a' : '#6fb6ff'; b.style.boxShadow = '0 0 18px ' + (i === 6 ? '#ffd36b' : '#9fd8ff');
      b.insertAdjacentHTML('afterend', '<div style="position:absolute;left:' + f[1] + '%;top:calc(' + f[2] + '% + 16px);transform:translateX(-50%);font-size:11px;color:#e9dfc0;text-shadow:0 0 4px #000;white-space:nowrap">' + esc(f[0]) + '</div>');
      if (got.length > 1) { const a = frags[got[got.length - 2]]; document.getElementById('astralL423').insertAdjacentHTML('beforeend', '<line x1="' + a[1] + '%" y1="' + a[2] + '%" x2="' + f[1] + '%" y2="' + f[2] + '%" stroke="#b9a8ff" stroke-opacity=".7" stroke-dasharray="4 4"/>'); }
      document.getElementById('astralT423').textContent = got.length + ' de ' + frags.length + ' fragmentos.' + (i === 6 ? ' Um deles parece o seu mundo de origem.' : '');
      if (got.length === frags.length) document.getElementById('astralOk423').disabled = false;
    });
    document.getElementById('astralOk423').onclick = () => { P423().astral = true; save423(); closeModal(); onDone && onDone(); };
  }
  /* Bloqueios de conversa: Aldric precisa chegar à Mira; Lyra pede o mapa */
  if (typeof openShop === 'function') {
    const os0 = openShop;
    openShop = function (id) {
      try {
        const npc = { guild: 'Lyra', pot: 'Mira' }[id]; // mesmo mapa do campaign327 (SHOP_NPC é local lá)
        if (npc === 'Mira' && at('a5', 1) && (!escort || Math.hypot(escort.x - player.x, escort.z - player.z) > 8)) { toast('<b>Mira:</b> — Cadê o Aldric? Traga-o até aqui, ele não aguenta sozinho.', 5000); return; }
        if (npc === 'Lyra' && at('a7', 1) && !P423().astral) { astralView(() => openShop(id)); return; }
      } catch (_) {}
      return os0.apply(this, arguments);
    };
  }

  /* ================= 3) CAPITAIS E PEDRAS-ÂNCORA ================= */
  // A Pedra-Âncora fica no lugar do selo do centro (a "fonte" com a esfera presa): src/core/260 chama Anchor434.seal().
  // Cada capital: base Tripo + cristal Tripo próprio da cor da capital flutuando e girando (o de Verden saía torto e foi tirado da base).
  const CAPS = {
    Ymiria: { el: 'Neve', col: 0x8fe0ff, w: 'snow', cry: 'cristal-ancora-gelo', base: 'anchor-ymiria-base', pieceIdx: 2, pieceName: 'Pernas do Arquiteto' }, // v438 (Ian): o cristal de gelo foi tirado da base no Blender e agora flutua como nas outras
    Zahar: { el: 'Deserto', col: 0xffb347, w: 'sand', cry: 'cristal-ancora-ambar', pieceIdx: 1, pieceName: 'Braço Direito do Arquiteto' },
    Thalor: { el: 'Águas e rocha flutuante', col: 0x3fe0c8, w: 'mist', cry: 'cristal-ancora-turquesa', pieceIdx: 0, pieceName: 'Braço Esquerdo do Arquiteto' },
    Urdan: { el: 'Caverna de cristal', col: 0xc77dff, w: 'motes', cry: 'cristal-ancora-violeta', pieceIdx: 3, pieceName: 'Tronco do Arquiteto' },
    Verden: { el: 'Pântano', col: 0x8fe35a, w: 'swamp', cry: 'cristal-ancora-verde', pieceIdx: 4, pieceName: 'Cabeça do Arquiteto' }
  };
  const anchors = new Set(); let wx = null;
  function makeSealedArm441(pieceIdx, col, yPos = 2.1, sc = .72) {
    const wrap = new T.Group(); wrap.position.y = yPos;
    const build = () => {
      if (typeof pieceMesh250 !== 'function') return false;
      const pm = pieceMesh250(pieceIdx); if (!pm) return false;
      pm.scale.setScalar(sc); wrap.add(pm);
      const chainMat = new T.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .45, metalness: .7, roughness: .25 });
      for (let i = 0; i < 4; i++) {
        const a = i / 4 * TAU + .4, ch = new T.Mesh(new T.CylinderGeometry(.07, .07, 4.4, 8), chainMat);
        ch.position.set(Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4);
        ch.rotation.z = Math.cos(a) * .55; ch.rotation.x = Math.sin(a) * .55;
        wrap.add(ch);
      }
      return true;
    };
    if (!build()) setTimeout(build, 1500);
    return wrap;
  }
  window.Anchor434 = {
    crystal(name) { const D = CAPS[name]; if (!D || !D.cry) return Promise.resolve(null); return glb(D.cry).then(w => w ? { m: w.clone(), col: D.col, h: w.userData.h } : null); }, // v450 (Ian): cutscene da âncora rompendo usa a pedra da própria capital
    seal(c, addColFn) {
      const D = CAPS[c && c.name]; if (!D) return null;
      const g = new T.Group(); g.name = 'Anchor434_' + c.name; g.userData.c = c;
      try { if (addColFn) addColFn({ x: c.x, z: c.z, r: 3.7 }); } catch (_) {} // base com até 7,2 m de largura
      g.userData.it = { type: 'anchor423', x: c.x, z: c.z, r: 6, label: 'F · SINTONIZAR A PEDRA-ÂNCORA DE ' + c.name.toUpperCase(), use: () => attune(c, g) };
      Promise.all([glb(D.base || 'anchor-' + c.name.toLowerCase()), D.cry ? glb(D.cry) : null, tripoReady()]).then(([base, cry]) => {
        let top = 2.6;
        if (base) { const b = fit(base, D.own ? 5.6 : 3.4, 7.2); top = b.userData.h; g.add(b); }
        if (cry) { const cr = fit(cry, 4.2, 4); cr.position.y = top - .6; cr.userData.y0 = cr.position.y; g.add(cr); g.userData.cr = cr; }
        const disc = runeDisc(D.col, 7, .45); g.add(disc); g.userData.disc = disc; discs.add(disc);
        const halo = new T.Sprite(new T.SpriteMaterial({ map: soft('halo', [[0, 'rgba(255,255,255,.9)'], [.3, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]), color: D.col, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
        halo.scale.setScalar(6); halo.position.y = D.own ? top * .8 : top + 2.6; g.add(halo); g.userData.halo = halo;
        if (P423().anchors[c.name]?.sealed441 && D.pieceIdx != null) {
          const arm = makeSealedArm441(D.pieceIdx, D.col, top + 1.8, .68);
          g.add(arm); g.userData.sealedArm441 = arm;
        }
      });
      // Thalor (rocha flutuante): ilhotas de pedra pairando em volta da pedra.
      if (c.name === 'Thalor') glb('rocha-flutuante').then(t => { if (!t) return; for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .3, r = 8.5 + (i % 2) * 1.5, p = fit(t, 1.6 + (i % 3) * .5, 2.6 + (i % 3)); const h = new T.Group(); h.position.set(Math.cos(a) * r, 6 + (i % 3) * 1.8, Math.sin(a) * r); h.rotation.y = a * 2.3; h.userData.float = i; h.add(p); g.add(h); } });
      anchors.add(g); return g;
    }
  };
  const inScene = o => { while (o) { if (o === scene) return true; o = o.parent; } return false; };
  const capDefense441 = new Map();
  function markCapitalVisited441(c) {
    try {
      profile.visited217 = profile.visited217 || {};
      profile.visited217[c.id || c.name] = { n: c.name, cap: true, t: Date.now() };
      if (!profile.lore.includes('act9')) unlockLore('act9');
      store.set('pds2_profile', profile);
    } catch (_) {}
  }
  function attune(c, anchorGrp) {
    const S = P423(), D = CAPS[c.name] || CAPS.Thalor;
    markCapitalVisited441(c);
    const activeDef = capDefense441.get(c.name);
    if (activeDef && activeDef.foes.some(e => !e.dead && enemies.includes(e))) {
      toast('<b>[PEDRA-ÂNCORA]</b> Derrote os Elites que pressionam a Âncora de <b>' + c.name + '</b> primeiro!', 4500);
      return;
    }
    if (!S.anchors[c.name]?.sealed441 && (c.name === 'Zahar' || c.name === 'Ymiria' || c.name === 'Urdan' || c.name === 'Verden') && !activeDef) {
      const gr = Math.min(9, rankOf()), foes = [];
      if (c.name === 'Zahar') {
        const kinds = ['escaravelho_f', 'cactogig_f', 'invasor_f', 'escaravelho'].filter(k => KINDS[k]);
        for (let i = 0; i < 3; i++) {
          const a = i / 3 * TAU + .4, x = c.x + Math.cos(a) * 11, z = c.z + Math.sin(a) * 11;
          try { const e = spawnKind(kinds[i % kinds.length] || 'goblin', x, z, gr, { wild: true }); makeElite(e); e.aggro = true; foes.push(e); fxRing(x, z, D.col, 1.8); } catch (_) {}
        }
        toast('<b>[PEDRA-ÂNCORA DE ZAHAR]</b> Elites do Deserto atacam o selo do <b>Braço Direito do Arquiteto</b>! Derrote-os para estabilizar a Âncora.', 6500);
      } else if (c.name === 'Ymiria') {
        const alphaK = KINDS.yeti_f ? 'yeti_f' : 'yeti';
        try {
          const alpha = spawnKind(alphaK, c.x + 10, c.z + 6, gr, { wild: true });
          makeElite(alpha); alpha.yetiAlpha441 = true; alpha.name = '[Elite] Yeti Alfa Corrompido'; alpha.short = 'Yeti Alfa Corrompido'; alpha.aggro = true; foes.push(alpha);
          for (let i = 0; i < 2; i++) {
            const a = i * Math.PI + .6, x = c.x + Math.cos(a) * 12, z = c.z + Math.sin(a) * 12;
            const y = spawnKind(KINDS.yetinho ? 'yetinho' : 'yeti', x, z, gr, { wild: true });
            y.yetiPack441 = true; y.aggro = false;
          }
          fxRing(c.x + 10, c.z + 6, D.col, 2.2);
        } catch (_) {}
        toast('<b>[PEDRA-ÂNCORA DE YMIRIA]</b> O <b>Yeti Alfa Corrompido</b> avança sobre a Âncora! Derrote o Alfa para que os menores fujam e estabilize o selo.', 6500);
      } else if (c.name === 'Urdan') {
        const kinds = ['golcristal_f', 'obsidiana', 'golcristal', 'espectro_f'].filter(k => KINDS[k]);
        for (let i = 0; i < 3; i++) {
          const a = i / 3 * TAU + .3, x = c.x + Math.cos(a) * 11, z = c.z + Math.sin(a) * 11;
          try { const e = spawnKind(kinds[i % kinds.length] || 'goblin', x, z, gr, { wild: true }); makeElite(e); e.aggro = true; foes.push(e); fxRing(x, z, D.col, 1.8); } catch (_) {}
        }
        toast('<b>[PEDRA-ÂNCORA DE URDAN]</b> Golens de Cristal e Espectros da Fenda cercam o selo do <b>Tronco do Arquiteto</b>! Derrote-os para estabilizar a Âncora.', 6500);
      } else if (c.name === 'Verden') {
        const kingK = KINDS.saporei ? 'saporei' : (KINDS.sapogig ? 'sapogig' : 'sapo');
        try {
          const king = spawnKind(kingK, c.x + 10, c.z + 6, gr, { wild: true });
          makeElite(king); king.honor456 = true; king.saporeiVerden456 = true; king.name = '[Rei do Brejo #020] Sapo Rei de Verden'; king.short = 'Sapo Rei #020'; king.aggro = true; foes.push(king);
          for (let i = 0; i < 2; i++) {
            const a = i * Math.PI + .5, x = c.x + Math.cos(a) * 12, z = c.z + Math.sin(a) * 12;
            const sp = spawnKind(KINDS.sapo ? 'sapo' : 'slime', x, z, gr, { wild: true });
            sp.aggro = true;
          }
          fxRing(c.x + 10, c.z + 6, D.col, 2.2);
        } catch (_) {}
        toast('<b>[PEDRA-ÂNCORA DE VERDEN]</b> O <b>Sapo Rei do Brejo (#020)</b> desafia você diante do selo da <b>Cabeça do Arquiteto</b>! Reduza a vida dele até ele se render e pressione <b>F · ACEITAR RENDIÇÃO</b>.', 7000);
      }
      if (foes.length) { capDefense441.set(c.name, { c, foes, g: anchorGrp }); return; }
    }
    completeAnchorAttune441(c, anchorGrp);
  }
  function completeAnchorAttune441(c, anchorGrp) {
    const S = P423(), D = CAPS[c.name] || CAPS.Thalor, first = !S.anchors[c.name];
    S.anchors[c.name] = { t: Date.now(), stab: 100, sealed441: true, piece: D.pieceName }; save423();
    markCapitalVisited441(c);
    const g = anchorGrp || [...anchors].find(a => a.userData?.c?.name === c.name);
    if (g && !g.userData.sealedArm441 && D.pieceIdx != null) {
      const arm = makeSealedArm441(D.pieceIdx, D.col, 4.4, .68);
      g.add(arm); g.userData.sealedArm441 = arm;
    }
    try { fxRing(c.x, c.z, D.col, 7, .9); sfx('arise'); } catch (_) {}
    toast('<b>[PEDRA-ÂNCORA]</b> ' + c.name + (first ? ' sintonizada e estabilizada!' : ' sintonizada de novo!') + ' Selo revelado: <b>' + (D.pieceName || 'Selo Primordial') + '</b>. Veja em MENU → PEDRAS-ÂNCORA.', 6500);
  }
  function anchorsView() {
    const S = P423(); let h = '<p>As cinco Pedras-Âncora seguram o mundo contra a Fenda e prendem as partes seladas do Arquiteto. Visite cada capital e use F na pedra do centro da cidade ou na câmara abissal.</p><table style="width:100%;border-collapse:collapse">';
    for (const n in CAPS) { const a = S.anchors[n], hex = '#' + CAPS[n].col.toString(16).padStart(6, '0'); h += '<tr style="border-bottom:1px solid #b9974f44"><td style="padding:7px"><b style="color:' + hex + '">◆ ' + n + '</b><br><small style="opacity:.75">' + CAPS[n].el + ' · ' + (CAPS[n].pieceName || '') + '</small></td><td style="width:55%">' + (a ? 'Estabilidade ' + a.stab + '% ' + (a.sealed441 ? '<b style="color:#7ef5a5">(Selado)</b>' : '') + '<div style="height:6px;background:#0b1612;border:1px solid #b9974f55;border-radius:3px"><div style="height:100%;width:' + a.stab + '%;background:' + hex + ';border-radius:3px"></div></div>' : '<span style="opacity:.5">Não sintonizada</span>') + '</td></tr>'; }
    openModal('PEDRAS-ÂNCORA', h + '</table>');
  }
  function weather(kind, on) {
    if (!on) { if (wx) { scene.remove(wx.p); wx.p.geometry.dispose(); wx.p.material.dispose(); wx = null; } return; }
    if (wx && wx.kind === kind) return; weather(null, false);
    const n = kind === 'mist' || kind === 'swamp' ? 140 : 700, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) pos.set([(Math.random() - .5) * 60, Math.random() * 24 - 4, (Math.random() - .5) * 60], i * 3);
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    const S = { snow: ['#ffffff', .28, T.NormalBlending], sand: ['#e8c48a', .16, T.NormalBlending], mist: ['#d8f2f4', 3.5, T.NormalBlending], motes: ['#d9a8ff', .3, T.AdditiveBlending], swamp: ['#d8ff8a', .22, T.AdditiveBlending] }[kind];
    const map = soft('w_' + kind, [[0, S[0]], [.4, S[0] + (kind === 'mist' ? '55' : 'cc')], [1, S[0] + '00']]);
    const p = absolute(new T.Points(geo, new T.PointsMaterial({ map, size: S[1], transparent: true, opacity: kind === 'mist' ? .35 : .9, depthWrite: false, blending: S[2] })));
    p.frustumCulled = false; scene.add(p); wx = { p, kind };
  }
  let capStagingKey441 = '';
  const capProps441 = [];
  function clearCapStaging441() {
    while (capProps441.length) {
      const o = capProps441.pop();
      if (o.g) scene.remove(o.g);
      if (o.it) { const i = L.inter.indexOf(o.it); if (i >= 0) L.inter.splice(i, 1); }
    }
    capStagingKey441 = '';
  }
  function stageCapitals441(c) {
    if (!c || !['Thalor', 'Zahar', 'Ymiria', 'Urdan', 'Verden'].includes(c.name)) { if (capStagingKey441) clearCapStaging441(); return; }
    markCapitalVisited441(c);
    if (capStagingKey441 === c.name) return;
    clearCapStaging441(); capStagingKey441 = c.name;
    if (c.name === 'Thalor') {
      // Veleiro Costeiro de Carga ancorado na costa oeste de Thalor (integrado ao peso do Carrinho)
      const bx = c.x - 84, bz = c.z;
      if (window.Boats440 && !(run?.boats440 || []).some(b => Math.hypot(b.x - bx, b.z - bz) < 120)) {
        run.boats440 = run.boats440 || [];
        run.boats440.push({ uid: 'thalor_veleiro441', id: 'veleiro', x: bx, z: bz, rot: -Math.PI / 2, hp: 520 });
      }
      // Zona de mergulho vertical sob a rocha flutuante de Thalor (-5, 0): corais bioluminescentes, naufrágio, caverna com bolsão de ar e Portal Aquático (Fenda Submersa)
      const dx = c.x - 132, dz = c.z;
      const dg = absolute(new T.Group()); dg.position.set(dx, H(dx, dz), dz); scene.add(dg);
      const bioLight = new T.PointLight(0x3fe0c8, 1.8, 22); bioLight.position.set(0, 2.5, 0); dg.add(bioLight);
      glb('coral-reef').then(tpl => {
        if (!tpl || !dg.parent) return;
        for (let i = 0; i < 8; i++) {
          const a = i / 8 * TAU, r = 4.5 + (i % 2) * 2.5, cr = fit(tpl, 1.4 + (i % 3) * .4);
          cr.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); cr.rotation.y = a; dg.add(cr);
        }
      });
      if (window.Surv437?.glb) {
        Surv437.glb('naufragio').then(tpl => {
          if (!tpl || !dg.parent) return;
          const sh = tpl.clone(true); sh.scale.setScalar(5.5 / (tpl.userData.w || 1)); sh.position.set(-7, 0, -5); sh.rotation.set(.12, .8, -.18); dg.add(sh);
        });
        Surv437.glb('m440/caverna').then(tpl => {
          if (!tpl || !dg.parent) return;
          const cv = tpl.clone(true); cv.scale.setScalar(4.8 / (tpl.userData.w || 1)); cv.position.set(6.5, 0, -4.5); dg.add(cv);
        });
      }
      Water.airPocket441 = { x: dx + 6.5, z: dz - 4.5, r: 5.5 };
      if (window.Rift131) {
        const rift = Rift131.create({ seed: 441, legacyLinearOutput: true }); rift.scale.setScalar(.72);
        const rg = new T.Group(); rg.position.set(0, .2, 0); rg.add(rift); dg.add(rg);
        const it = { type: 'aqua423', x: dx, z: dz, r: 5, label: 'F · ENTRAR NO PORTAL AQUÁTICO (DUNGEON ABISSAL DE THALOR)', use: () => enterAbyssalDungeon441(c) };
        L.inter.push(it); capProps441.push({ g: dg, it, rift });
      } else capProps441.push({ g: dg });
    } else if (c.name === 'Zahar') {
      // Marcos naturais de caravana na rota de Zahar (sem deformar o relevo natural)
      const wall = 36 * (typeof CITYK !== 'undefined' ? CITYK : 1);
      const dx = c.x - (wall + 22), dz = c.z - 4;
      const dg = absolute(new T.Group()); dg.position.set(dx, H(dx, dz), dz);
      tripoReady().then(() => {
        if (!dg.parent) return;
        const rk = tripo('stones', 1.2); if (rk) dg.add(rk);
      });
      scene.add(dg);
      const it = {
        type: 'oasis456', x: dx, z: dz, r: 4.5,
        label: 'F · REABASTECER ÁGUA FRESCA NO MARCO DO OÁSIS DE ZAHAR',
        use: () => {
          if (run?.surv437?.canteen) {
            run.surv437.canteen.kind = 'limpa';
            run.surv437.canteen.sips = run.surv437.canteen.max || 3;
            run.surv437.canteen.frozen = false;
          }
          toast('<b>[OÁSIS DE ZAHAR]</b> Cantil reabastecido com água fresca do oásis subterrâneo.', 4500);
        }
      };
      L.inter.push(it); capProps441.push({ g: dg, it });
    } else if (c.name === 'Ymiria') {
      // Povo do Manto Branco: Filhotes de Yeti (#013) neutros se o jogador mantiver a arma guardada (X)
      const wall = 36 * (typeof CITYK !== 'undefined' ? CITYK : 1);
      for (let i = 0; i < 2; i++) {
        const yx = c.x + (i ? 14 : -14), yz = c.z + wall + 14;
        if (!enemies.some(e => !e.dead && e.kind === 'yetinho' && Math.hypot(e.x - yx, e.z - yz) < 25)) {
          try {
            const y = spawnKind(KINDS.yetinho ? 'yetinho' : 'yeti', yx, yz, Math.min(9, rankOf()), { wild: true });
            y.yetiPack441 = true; y.aggro = false;
          } catch (_) {}
        }
      }
    } else if (c.name === 'Urdan') {
      // Cristais ressonantes na entrada de Urdan
      const wall = 36 * (typeof CITYK !== 'undefined' ? CITYK : 1);
      const ux = c.x, uz = c.z + wall + 18;
      const ug = absolute(new T.Group()); ug.position.set(ux, H(ux, uz), uz);
      glb('cristal-veio').then(tpl => {
        if (!tpl || !ug.parent) return;
        for (let i = 0; i < 3; i++) {
          const a = i / 3 * TAU, cr = fit(tpl, 1.8 + (i % 2) * .5);
          cr.position.set(Math.cos(a) * 3.5, 0, Math.sin(a) * 3.5); cr.rotation.y = a; ug.add(cr);
        }
      });
      scene.add(ug); capProps441.push({ g: ug });
    } else if (c.name === 'Verden') {
      // Brejo Real de Verden: território do Sapo Rei (#020)
      const wall = 36 * (typeof CITYK !== 'undefined' ? CITYK : 1);
      const vx = c.x + 12, vz = c.z + wall + 16;
      const vg = absolute(new T.Group()); vg.position.set(vx, H(vx, vz), vz);
      const glow = new T.PointLight(0x8fe35a, 1.4, 16); glow.position.set(0, 2, 0); vg.add(glow);
      scene.add(vg); capProps441.push({ g: vg });
    }
  }
  function enterAbyssalDungeon441(thalorCity) {
    const tc = thalorCity || (typeof regionCity === 'function' ? regionCity(-2, 0) : nearestCity(player.x, player.z).c);
    const ret = { x: tc.x, z: tc.z + 8 };
    const gr = Math.min(9, rankOf());
    clearCapStaging441();
    clearLevel();
    const N = 22, Wd = N + 4, Hd = N + 4, CS = 2, ox = -Wd * CS / 2, oz = -Hd * CS / 2, cells = new Uint8Array(Wd * Hd);
    for (let y = 2; y < N + 2; y++) for (let x = 2; x < N + 2; x++) {
      const a = Math.min(x - 2, N + 1 - x), b = Math.min(y - 2, N + 1 - y);
      if (a + b >= 4) cells[y * Wd + x] = 1;
    }
    const th = { n: 'Dungeon Abissal de Thalor', floor: 0x0b2633, wall: 0x133e4e, trim: 0x3fe0c8, fog: 0x041520, light: 0x6ff5e5 };
    const R = mulberry32(4410);
    L = {
      mode: 'dungeon', group: new T.Group(), inter: [], grid: { cells, W: Wd, H: Hd, CS, ox, oz },
      rooms: [{ x: 2, y: 2, w: N, h: N }], visited: new Uint8Array(Wd * Hd), seen: new Set([0]), bossRoom: -1,
      gate: { id: -1, rank: gr, red: false, seed: 441, x: ret.x, z: ret.z, ref: null }, G: GR[gr], bossDead: false, markT: 0, exits: [],
      special: { kind: 'abyssal441', name: th.n, stage: 0, t: 0, gr, msg: 'Derrote os Elites Abissais para estabilizar o Braço Esquerdo do Arquiteto', thalor: tc, foes: [] }
    };
    scene.add(L.group);
    scene.background = new T.Color(th.fog); scene.fog = new T.FogExp2(th.fog, .025);
    hemi.color.setHex(th.light); hemi.intensity = .65; sun.color.setHex(th.light); sun.intensity = .45; pLight.color.setHex(th.light); pLight.intensity = 1.4;
    renderGrid(cells, Wd, Hd, CS, ox, oz, th, R, true);
    // Base da Pedra-Âncora de Thalor suspensa + Braço Esquerdo do Arquiteto (arquiteto246.glb) acorrentado no centro
    const centerGrp = new T.Group(); centerGrp.position.set(0, 0, -2); L.group.add(centerGrp);
    const disc = runeDisc(0x3fe0c8, 7.5, .65); centerGrp.add(disc); discs.add(disc);
    Promise.all([glb('anchor-thalor'), glb('cristal-ancora-turquesa'), glb('coral-reef')]).then(([base, cry, coral]) => {
      if (L.special?.kind !== 'abyssal441') return;
      if (base) { const b = fit(base, 4.4, 8.2); b.position.y = 6.2; b.rotation.x = Math.PI; centerGrp.add(b); }
      if (cry) { const cr = fit(cry, 3.6, 3.6); cr.position.y = 4.2; centerGrp.add(cr); L.special.cry = cr; }
      if (coral) {
        for (let i = 0; i < 8; i++) {
          const a = i / 8 * TAU, cMesh = fit(coral, 1.5 + (i % 3) * .4);
          cMesh.position.set(Math.cos(a) * 11, 0, Math.sin(a) * 11 - 2); cMesh.rotation.y = a; L.group.add(cMesh);
        }
      }
    });
    const arm = makeSealedArm441(0, 0x3fe0c8, 2.3, .85);
    centerGrp.add(arm); L.special.arm = arm;
    // Elites Abissais guardando as correntes
    const abKinds = ['homempeixe_a', 'lula_a', 'arraia_a', 'homempeixe_f', 'lula'].filter(k => KINDS[k]);
    for (let i = 0; i < 3; i++) {
      const a = i / 3 * TAU + .5, ex = Math.cos(a) * 7.5, ez = -2 + Math.sin(a) * 7.5;
      try {
        const e = spawnKind(abKinds[i % abKinds.length] || 'goblin', ex, ez, gr, {});
        makeElite(e); e.aggro = true; L.special.foes.push(e); fxRing(ex, ez, 0x3fe0c8, 1.8);
      } catch (_) {}
    }
    // Elevador Aquático (coluna de água/luz para subir direto à cidade flutuante de Thalor)
    const elevGrp = new T.Group(); elevGrp.position.set(0, 0, 9); L.group.add(elevGrp);
    const colMat = new T.MeshBasicMaterial({ color: 0x3fe0c8, transparent: true, opacity: .28, side: T.DoubleSide, depthWrite: false, blending: T.AdditiveBlending });
    const colMesh = new T.Mesh(new T.CylinderGeometry(2.2, 2.2, 18, 24, 1, true), colMat); colMesh.position.y = 9; elevGrp.add(colMesh);
    const elevIt = {
      type: 'elevator441', x: 0, z: 9, r: 3.6,
      label: 'F · SUBIR PELO ELEVADOR AQUÁTICO ATÉ A CIDADE FLUTUANTE DE THALOR',
      use: () => {
        if (!L.bossDead) { toast('<b>[DUNGEON ABISSAL]</b> Derrote os Elites Abissais e estabilize as correntes do Braço Esquerdo primeiro!', 4000); return; }
        leaveDungeon(true);
        player.x = tc.x; player.z = tc.z + 7; cam.x = player.x; cam.z = player.z;
        player.m.root.position.set(player.x, H(player.x, player.z), player.z);
        try { updChunks(true); fxRing(player.x, player.z, 0x3fe0c8, 6, .9); sfx('portal'); } catch (_) {}
        bigText('THALOR — ROCHA FLUTUANTE', 2000);
        toast('<b>[ELEVADOR AQUÁTICO]</b> Você emergiu no coração da capital flutuante de <b>Thalor</b>!', 5500);
      }
    };
    L.inter.push(elevIt); L.special.elevIt = elevIt; L.special.colMat = colMat;
    player.x = 0; player.z = 14; player.face = Math.PI; cam.x = player.x; cam.z = player.z;
    placeAllies(); sfx('portal');
    bigText('DUNGEON ABISSAL DE THALOR', 2200);
    toast('<b>[DUNGEON ABISSAL]</b> O <b>Braço Esquerdo do Arquiteto</b> está acorrentado sob a Pedra-Âncora de Thalor! Derrote os 3 Elites Abissais para estabilizar as correntes.', 7000);
  }
  function tickAbyssal441(dt, now) {
    const S = L.special; if (!S || S.kind !== 'abyssal441') return;
    if (S.arm) { S.arm.rotation.y = now * .0006; S.arm.position.y = 2.3 + Math.sin(now * .0018) * .22; }
    if (S.cry) { S.cry.rotation.y = -now * .0008; }
    const alive = (S.foes || []).filter(e => !e.dead && enemies.includes(e)).length;
    if (!L.bossDead && alive === 0) {
      L.bossDead = true; L.closeT = 120;
      if (S.colMat) S.colMat.opacity = .62;
      completeAnchorAttune441(S.thalor);
      try { storyEv('clear', 1); } catch (_) {}
      bigText('CORRENTES ESTABILIZADAS', 2200);
      toast('<b>[DUNGEON ABISSAL]</b> As correntes do <b>Braço Esquerdo do Arquiteto</b> foram estabilizadas! Use o <b>Elevador Aquático</b> ao sul da câmara para subir até Thalor.', 7500);
    }
    S.msg = L.bossDead ? 'Correntes estabilizadas · Use o Elevador Aquático (F) para subir a Thalor' : 'Dungeon Abissal · Elites Abissais restantes: ' + alive;
  }
  function tickCaps() { // a cada meio segundo: o F da pedra entra/sai junto com o pedaço da cidade; clima perto da capital
    const world = L.mode === 'world';
    for (const g of anchors) {
      const it = g.userData.it, on = world && inScene(g), i = L.inter.indexOf(it);
      if (on && i < 0) L.inter.push(it); else if (!on && i >= 0) L.inter.splice(i, 1);
      if (!on && !g.parent) { anchors.delete(g); if (g.userData.disc) discs.delete(g.userData.disc); }
    }
    for (const [name, def] of capDefense441) {
      if (!world) { capDefense441.delete(name); continue; }
      if (def.foes.every(e => e.dead || !enemies.includes(e))) {
        capDefense441.delete(name);
        completeAnchorAttune441(def.c, def.g);
      }
    }
    if (!world) { weather(null, false); return; }
    const n = nearestCity(player.x, player.z), D = CAPS[n.c?.name];
    weather(D?.w, !!(D && n.d < 260));
    if (D && n.d < 220) stageCapitals441(n.c); else if (capStagingKey441) clearCapStaging441();
  }
  function tickAnchors(now) { // animação leve do cristal, do halo e das rochas flutuantes de Thalor
    for (const g of anchors) {
      const cr = g.userData.cr; if (cr) { cr.rotation.y = now * .0004; cr.position.y = cr.userData.y0 + Math.sin(now * .0011) * .25; }
      if (g.userData.sealedArm441) g.userData.sealedArm441.rotation.y = now * .0005;
      if (g.userData.halo) g.userData.halo.material.opacity = .5 + Math.sin(now * .0016) * .2;
      if (g.name === 'Anchor434_Thalor') g.traverse(o => { if (o.userData.float != null) o.position.y += Math.sin(now * .0009 + o.userData.float) * .004; });
    }
  }
  function tickWeather(dt) {
    if (!wx) return;
    const a = wx.p.geometry.attributes.position, fall = { snow: 2.4, sand: .5, mist: .05, motes: -.35, swamp: -.08 }[wx.kind], side = wx.kind === 'sand' ? 7 : wx.kind === 'snow' ? .6 : 0;
    for (let i = 0; i < a.count; i++) { let y = a.getY(i) - fall * dt, x = a.getX(i) + side * dt; if (y < -4) y += 28; if (y > 24) y -= 28; if (x > 30) x -= 60; a.setY(i, y); a.setX(i, x); }
    a.needsUpdate = true; wx.p.position.set(player.x, H(player.x, player.z), player.z);
  }

  /* ---------- cristais novos (Tripo) no lugar do cristal antigo (Ian, 16/10: "não é mais para ser usado") ----------
     O jogo monta todo cristal (veios de mineração, masmorras, núcleo da defesa) por crystalCluster230(rank, tamanho, quebrado).
     Aqui ele devolve o cristal Tripo tingido pela cor do rank; o modelo carrega uma vez e os grupos são preenchidos quando chega. */
  const cryTint = new Map();
  function tintMat(src, rank, broken) {
    const key = src.uuid + ':' + rank + ':' + (broken ? 1 : 0); if (cryTint.has(key)) return cryTint.get(key);
    const c = new T.Color(RANKS[Math.max(0, Math.min(RANKS.length - 1, rank | 0))].c), m = src.clone();
    // Só o cristal (parte clara da textura) pega a cor do rank; a rocha escura da base fica com a cor dela.
    const tint = { value: c.clone().multiplyScalar(broken ? .6 : 1.5) };
    m.color.setScalar(broken ? .7 : 1.15); m.emissive.copy(c).multiplyScalar(broken ? .05 : .3); m.emissiveMap = m.map; m.roughness = .35;
    m.onBeforeCompile = sh => { sh.uniforms.uTint433 = tint; sh.fragmentShader = 'uniform vec3 uTint433;\n' + sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n{float l433=dot(diffuseColor.rgb,vec3(.3,.59,.11));diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*uTint433,smoothstep(.3,.65,l433));}'); };
    m.customProgramCacheKey = () => 'cristal433';
    m.userData.shared = true; cryTint.set(key, m); return m;
  }
  const veinTpl = [glb('cristal-veio'), glb('cristal-veio-2')];
  if (typeof crystalCluster230 === 'function') {
    crystalCluster230 = function (rank, size, broken) {
      const g = new T.Group(), k = (rank * 7 + Math.round(size * 10)) % 2;
      Promise.all(veinTpl).then(t => {
        const tpl = t[k] || t[1 - k];
        if (!tpl) return; // v687: sem o modelo novo (erro de rede) não volta ao cristal antigo proibido
        const m = fit(tpl, size * 1.05); m.rotation.y = (rank * 1.7 + size) % TAU;
        m.traverse(o => { if (o.isMesh) o.material = Array.isArray(o.material) ? o.material.map(x => tintMat(x, rank, broken)) : tintMat(o.material, rank, broken); });
        g.add(m);
      });
      return g;
    };
  }

  /* ================= 4) MERGULHO / BIOMA MARINHO ================= */
  const Water = { dive: 0, breath: 1, hurtT: 0, deco: [], decoKey: '', portal: null, keysDown: {}, airPocket441: null };
  Water.swim = () => !!(window.Water391 && Water391.swimming);
  Water.max = () => window.Attr462 ? 12 + Attr462.surv().breath + Attr462.surv().pressure : 12 + .25 * ((run?.stats?.vit) || 0) + .15 * ((run?.stats?.res) || 0); // v462: com os marcos de 25 pontos
  Water.frame = function () {
    if (!window.Water391) return;
    const W = Water391;
    if (!W.swimming) { Water.dive = 0; return; }
    const depth = W.depthAt(player.x, player.z), maxDive = Math.max(0, depth - 1.6);
    const dn = Water.keysDown[sneakKey()] || Water.keysDown.ControlRight, up = Water.keysDown.Space;
    const dt = Math.min(.1, (typeof ADT !== 'undefined' && ADT) || .016);
    if (dn) Water.dive = Math.min(maxDive, Water.dive + dt * 2.2); else if (up) Water.dive = Math.max(0, Water.dive - dt * 3); else Water.dive = Math.max(0, Math.min(maxDive, Water.dive) - dt * .25);
    W.body = 1.25 + Water.dive;
  };
  addEventListener('keydown', e => {
    Water.keysDown[e.code] = true;
    if (e.repeat || !ready()) return;
    const t = e.target; if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
    if (e.code === sneakKey() && !Water.swim() && !(typeof modalOpen !== 'undefined' && modalOpen)) { e.preventDefault(); setSneak(!API.sneaking); }
  }, true);
  addEventListener('keyup', e => { Water.keysDown[e.code] = false; }, true);
  addEventListener('blur', () => { Water.keysDown = {}; });
  function clearDeco() { for (const d of Water.deco) scene.remove(d); Water.deco = []; }
  function marineDeco() {
    const x = Math.round(player.x / 24) * 24, z = Math.round(player.z / 24) * 24, key = x + ',' + z;
    if (Water.decoKey === key) return; Water.decoKey = key;
    const nearC = nearestCity(player.x, player.z).c, thal = nearC?.name === 'Thalor';
    Promise.all([glb('coral-reef'), glb('ruina-submersa'), window.Surv437?.glb ? Surv437.glb('naufragio') : null, window.Surv437?.glb ? Surv437.glb('m440/caverna') : null]).then(([coral, ruin, wreck, cave]) => {
      if (Water.decoKey !== key) return; clearDeco();
      const put = (tpl, h, px, pz) => { if (!tpl) return; const g = new T.Group(); g.position.set(px, 0, pz); g.rotation.y = (px * 7 + pz * 3) % TAU; g.add(fit(tpl, h)); scene.add(g); Water.deco.push(g); };
      let seed = (x * 73856093 ^ z * 19349663) >>> 0; const R = () => ((seed = Math.imul(seed ^ (seed >>> 13), 1274126177) >>> 0) % 10000) / 10000;
      for (let i = 0; i < (thal ? 14 : 7); i++) { const px = x + (R() - .5) * 44, pz = z + (R() - .5) * 44, d = Water391.depthAt(px, pz); if (d > 2) put(coral, .8 + R() * 1.1, px, pz); }
      for (let i = 0; i < (thal ? 2 : 1); i++) { const px = x + (R() - .5) * 36, pz = z + (R() - .5) * 36, d = Water391.depthAt(px, pz); if (d > 3 && (thal || R() < .4)) put(ruin, Math.min(d - .6, 3.6), px, pz); }
      if (wreck) { const px = x + 6, pz = z - 5; if (Water391.depthAt(px, pz) > 2.2) { const w = wreck.clone(true); w.scale.setScalar(4.5 / (wreck.userData.w || 1)); w.position.set(px, 0, pz); scene.add(w); Water.deco.push(w); } }
      if (cave) { const px = x - 6, pz = z + 5; if (Water391.depthAt(px, pz) > 2.2) { const cv = cave.clone(true); cv.scale.setScalar(4.2 / (cave.userData.w || 1)); cv.position.set(px, 0, pz); scene.add(cv); Water.deco.push(cv); Water.airPocket441 = { x: px, z: pz, r: 5 }; } }
    });
    if (!Water.portal && Math.random() < (thal ? .85 : .35) && window.Rift131) {
      let px = 0, pz = 0, bd = 0;
      for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = 6 + (i % 3) * 3, qx = player.x + Math.sin(a) * r, qz = player.z + Math.cos(a) * r, d = Water391.depthAt(qx, qz); if (d > bd) { bd = d; px = qx; pz = qz; } }
      if (bd > 1.8) {
        const rift = Rift131.create({ seed: 391, legacyLinearOutput: true }); rift.scale.setScalar(.55);
        const g = new T.Group(); g.position.set(px, 0, pz); g.rotation.y = Math.atan2(player.x - px, player.z - pz); g.add(rift); scene.add(g);
        const it = { type: 'aqua423', x: px, z: pz, r: 4, label: 'F · ENTRAR NO PORTAL AQUÁTICO (DUNGEON ABISSAL)', use: () => aquaPortal(it) };
        L.inter.push(it); Water.portal = { g, rift, it, foes: [] };
      }
    }
  }
  function aquaPortal(it) {
    const nearC = nearestCity(player.x, player.z).c;
    if (nearC?.name === 'Thalor' || !Water.portal?.open) {
      enterAbyssalDungeon441(nearC?.name === 'Thalor' ? nearC : (typeof regionCity === 'function' ? regionCity(-2, 0) : nearC));
      return;
    }
  }
  function dropPortal() { const P = Water.portal; if (!P) return; const i = L.inter.indexOf(P.it); if (i >= 0) L.inter.splice(i, 1); Water.portal = null; return P; }
  function killPortal() { const P = dropPortal(); if (P) { scene.remove(P.g); Rift131.dispose(P.rift); } }
  function tickWater(dt) {
    const sw = Water.swim(), bar = document.getElementById('breath423');
    if (L.mode !== 'world') { // masmorra/instância: nada do mar fica na cena nem no F
      if (Water.deco.length) { clearDeco(); Water.decoKey = ''; } killPortal();
      under.style.opacity = L.special?.kind === 'abyssal441' ? '.45' : '0'; bar.hidden = true; Water.breath = 1; Water.dive = 0; return;
    }
    const sub = sw && Water.dive > .55;
    under.style.opacity = sub ? '1' : '0';
    const inAirPocket = sub && Water.airPocket441 && Math.hypot(player.x - Water.airPocket441.x, player.z - Water.airPocket441.z) <= (Water.airPocket441.r || 5);
    if (inAirPocket) {
      if (Water.breath < .95) try { floater(player.x, player.z, 'BOLSÃO DE AR DA CAVERNA', '#7ef5e5'); } catch (_) {}
      Water.breath = Math.min(1, Water.breath + dt * .85);
    } else if (sub) { Water.breath -= dt / Water.max(); marineDeco(); }
    else Water.breath = Math.min(1, Water.breath + dt * .5);
    if (Water.breath <= 0) { Water.breath = 0; Water.hurtT -= dt; if (Water.hurtT <= 0) { Water.hurtT = 1; try { hurtPlayer(Math.max(1, Math.round(player.maxhp * .08)), false); floater(player.x, player.z, 'SEM FÔLEGO', '#9fd8ff'); } catch (_) {} } }
    bar.hidden = !(sw && (sub || Water.breath < 1)); bar.firstChild.style.width = (Water.breath * 100).toFixed(0) + '%';
    if (Water.deco.length && !sw && Math.hypot(player.x - Water.deco[0].position.x, player.z - Water.deco[0].position.z) > 120) { clearDeco(); Water.decoKey = ''; }
    const P = Water.portal; if (!P) return;
    Rift131.update(P.rift, dt);
    if (P.open && P.foes.length && P.foes.every(e => e.dead)) { dropPortal(); Rift131.close(P.rift, false); setTimeout(() => { scene.remove(P.g); Rift131.dispose(P.rift); }, 3200); try { toast('<b>[FENDA]</b> Portal Aquático fechado.', 4000); } catch (_) {} }
    else if (Math.hypot(P.it.x - player.x, P.it.z - player.z) > (P.open ? 180 : 120)) killPortal();
  }

  /* ---------- menu ---------- */
  (function menu() {
    const ref = document.getElementById('bDiary'); if (!ref) { setTimeout(menu, 500); return; }
    if (document.getElementById('bAnchor423')) return;
    const a = document.createElement('button'); a.className = 'mini'; a.id = 'bAnchor423'; a.textContent = 'PEDRAS-ÂNCORA'; a.onclick = anchorsView;
    const m = document.createElement('button'); m.className = 'mini'; m.id = 'bMarks423'; m.textContent = 'MARCAS DO ARQUITETO'; m.onclick = marksView;
    ref.after(a, m);
  })();
  function save423() { try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }

  /* ---------- laço ---------- */
  let last = performance.now(), slow = 0;
  function loop() {
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
    try {
      hudShow();
      if (ready() && !paused) {
        for (const d of discs) d.userData.rune.uniforms.t.value = now / 1000;
        tickTracks(dt, now); tickAct4(now); tickAct5(dt); tickBreach(dt); tickWater(dt); tickWeather(dt);
        tickAnchors(now); tickAbyssal441(dt, now);
        slow -= dt; if (slow <= 0) { slow = .5; tickCaps(); tickAct6(); }
        if (run?.mounted && API.sneaking) setSneak(false);
      }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('mech434', e); } }
    setTimeout(loop, 33);
  }
  loop();
  Object.assign(API, { setSneak, anchorsView, marksView, astralView, Water, Tracks, anchors, auras, enterAbyssalDungeon441, attune });
})();
