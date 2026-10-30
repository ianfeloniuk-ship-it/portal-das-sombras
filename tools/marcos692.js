/* v702 (Ian, 29/10/2026): «quero meu mapa com geometria própria… as montanhas, os lugares onde tem cada coisa, um morro com uma
   estátua gigante… não achei nada disso». Marcos grandes, um por reino, cada um no alto do seu morro (relevo PK692 em
   tools/terrain245.js), com nome no mapa. Como a névoa e a câmera não deixam ver longe, cada marco tem uma cópia de longe:
   desenhada perto da câmera, na direção e no tamanho certos (perspectiva igual), sem névoa — assim aparece no horizonte.
   Picos com nome também vão para o mapa (tools/mapa501.js chama Marcos692.map). */
(function () {
  'use strict';
  const T = window.THREE; if (!T) return;
  const MARKS = [
    { id: 'veu', name: 'Observatório do Véu', reino: 'Ymiria', x: -1700, z: -4300, glb: 'tripo-torre-defesa154', h: 64, stone: 0xb9bfcc, glow: 0xb48cff,
      lore: 'Uma torre de vigia dos tempos antes das capitais, no alto do Pico do Véu. Dizem que dali os Primevos olhavam o Véu de perto. Um fragmento de luz violeta ainda gira sobre as ruínas e nunca cai.' },
    { id: 'colosso', name: 'Colosso do Primevo', reino: 'Zahar', x: 4500, z: -1900, glb: 'm_guardiao', h: 60, stone: 0xc9a878,
      lore: 'Uma estátua de sessenta metros no alto do Morro do Primevo, de frente para o deserto. Ninguém em Zahar sabe quem a ergueu. Os lobisomens não caçam à sombra dela.' },
    { id: 'farol', name: 'Farol dos Afogados', reino: 'Thalor', x: -5000, z: 2900, glb: 'tripo-torre-defesa154', h: 50, sy: 1.6, stone: 0x8f9c9a, glow: 0x5fffd8,
      lore: 'Uma torre sozinha no Cabo do Farol. A luz verde-água no topo é a mesma magia antiga que faz Thalor flutuar. Ela acende sozinha toda noite.' },
    { id: 'forja', name: 'Forja Partida do Arquiteto', reino: 'Urdan', x: -1900, z: 4300, glb: 'tripo-forja154', h: 30, stone: 0x6d625a, glow: 0xff6a1e,
      extras: [{ glb: 'm_guardiao', h: 24, dx: -30, dz: 14, ry: .4 }, { glb: 'm_guardiao', h: 24, dx: 30, dz: 14, ry: -.4 }],
      lore: 'Os anões de Urdan dizem que aqui o Arquiteto forjou as primeiras peças do mundo e partiu a bigorna ao terminar. Dois guardiões de pedra ainda vigiam a brasa que não apaga.' },
    { id: 'guardioes', name: 'Guardiões da Pedra-Âncora', reino: 'Verden', x: 4000, z: 3900, glb: 'm_guardiao', h: 50, stone: 0x9aa58c,
      lore: 'Um guardião de pedra de cinquenta metros na Colina dos Guardiões. Os elfos de Verden dizem que ele vigia a Pedra-Âncora do reino e que vira o rosto para quem a ameaça.' }
  ];
  const ASTER = { id: 'colina', name: 'Colosso da Colina', reino: 'Aster', x: 210, z: 360 }; // já existe (tools/marcos526.js)
  const PEAKS = ['Pico do Véu', 'Dente de Ymiria', 'Coroa Partida', 'Espinha de Zahar', 'Monte Bigorna', 'Sentinela Afogada'];
  const NEAR = 200, FAR_AT = 180;

  const cache = new Map();
  function load(name) {
    if (cache.has(name)) return cache.get(name);
    const p = new Promise(res => {
      if (!T.GLTFLoader) { res(null); return; }
      const l = new T.GLTFLoader(); if (window.MeshoptDecoder) l.setMeshoptDecoder(MeshoptDecoder);
      l.load('models/' + name + '.glb', g => res(g), undefined, () => res(null));
    });
    cache.set(name, p); return p;
  }
  let stoneTex = null;
  function tex() {
    if (stoneTex) return stoneTex;
    const c = document.createElement('canvas'); c.width = c.height = 256; const a = c.getContext('2d');
    a.fillStyle = '#9a9a9a'; a.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 9000; i++) { const x = (i * 97) % 256, y = (i * 61 + (i >> 8) * 23) % 256, v = 110 + ((i * 37) % 90); a.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',.35)'; a.fillRect(x, y, 1 + (i % 3), 1 + (i % 2)); }
    for (let i = 0; i < 40; i++) { a.strokeStyle = 'rgba(40,40,40,.35)'; a.beginPath(); const x = (i * 53) % 256, y = (i * 89) % 256; a.moveTo(x, y); a.lineTo(x + 20 - (i % 40), y + 30); a.stroke(); }
    stoneTex = new T.CanvasTexture(c); stoneTex.wrapS = stoneTex.wrapT = T.RepeatWrapping; return stoneTex;
  }
  // um modelo (cena do GLB) vira pedra, escalado pela altura pedida
  function stoneModel(gltf, h, color, far, sy) {
    const root = gltf.scene.clone(true);
    root.traverse(o => {
      if (!o.isMesh) return;
      o.material = new T.MeshStandardMaterial({ map: tex(), bumpMap: tex(), bumpScale: .08, color, roughness: .95, metalness: 0, fog: !far });
      o.castShadow = !far; o.receiveShadow = !far; o.frustumCulled = false; o.userData.terrainAbsolute245 = true;
    });
    root.updateMatrixWorld(true);
    const b = new T.Box3().setFromObject(root), s = b.getSize(new T.Vector3()), k = h / Math.max(.01, s.y);
    const w = new T.Group(); root.position.set(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2);
    w.add(root); w.scale.set(k, k * (sy || 1), k); w.userData.terrainAbsolute245 = true; return w;
  }
  async function build(m, far) {
    const g = new T.Group(); g.userData.terrainAbsolute245 = true; g.name = 'Marco692_' + m.id + (far ? '_longe' : '');
    const main = await load(m.glb); if (main) g.add(stoneModel(main, m.h, m.stone, far, m.sy));
    for (const e of m.extras || []) { const q = await load(e.glb); if (!q) continue; const o = stoneModel(q, e.h, m.stone, far); o.position.set(e.dx, 0, e.dz); o.rotation.y = e.ry || 0; g.add(o); }
    if (m.glow) {
      const top = m.h * (m.sy || 1) + 6;
      const gem = new T.Mesh(new T.OctahedronGeometry(m.id === 'forja' ? 5 : 3.2, 0), new T.MeshBasicMaterial({ color: m.glow, fog: false }));
      gem.position.y = m.id === 'forja' ? 6 : top; gem.userData.terrainAbsolute245 = true; gem.userData.spin692 = 1; g.add(gem);
      const halo = new T.Mesh(new T.SphereGeometry(m.id === 'forja' ? 11 : 8, 16, 12), new T.MeshBasicMaterial({ color: m.glow, transparent: true, opacity: .12, depthWrite: false, fog: false }));
      halo.position.copy(gem.position); halo.userData.terrainAbsolute245 = true; g.add(halo);
    }
    return g;
  }

  const live = []; let mounted = false, busy = false;
  const inWorld = () => typeof L !== 'undefined' && L && L.mode === 'world' && !L.special && !(window.TER245 && TER245.OW.value.x > .5);
  async function mount() {
    if (mounted || busy || typeof scene === 'undefined' || typeof terrH !== 'function') return; busy = true;
    try {
      for (const m of MARKS) {
        const near = await build(m, false), far = await build(m, true);
        const y = terrH(m.x, m.z) - 1; near.position.set(m.x, y, m.z); near.rotation.y = Math.atan2(-m.x, -m.z); // de frente para o centro do mundo
        far.rotation.y = near.rotation.y; far.renderOrder = -1; scene.add(near, far);
        live.push({ m, near, far, y });
      }
      mounted = true;
    } finally { busy = false; }
  }
  const tmp = new T.Vector3();
  function update(cam) {
    const on = inWorld(), t = performance.now() / 1000;
    for (const o of live) {
      if (!on) { o.near.visible = o.far.visible = false; continue; }
      if (!(o.t692 > t - 2)) { o.t692 = t; const y = terrH(o.m.x, o.m.z) - 1; if (Number.isFinite(y)) { o.y = y; o.near.position.y = y; } } // o relevo pode ligar depois de montar
      tmp.set(o.m.x, o.y, o.m.z); const d = cam.position.distanceTo(tmp);
      o.near.visible = d < NEAR + 60;
      o.far.visible = d >= NEAR && d < 16000;
      if (o.far.visible) { const s = FAR_AT / d; o.far.position.copy(cam.position).addScaledVector(tmp.sub(cam.position), s); o.far.scale.setScalar(s); }
      for (const g of [o.near, o.far]) g.traverse(c => { if (c.userData.spin692) c.rotation.y = t * .6; });
    }
  }
  function hook() {
    if (typeof renderer === 'undefined' || !renderer || renderer.render.wrapped692) return false;
    const r0 = renderer.render.bind(renderer);
    renderer.render = function (sc, cam) { try { if (cam && cam.isCamera) update(cam); } catch (_) { } return r0(sc, cam); };
    renderer.render.wrapped692 = true; return true;
  }

  // descoberta: chegar perto registra o marco no Diário
  let lastCheck = 0;
  function discover() {
    if (!inWorld() || typeof player === 'undefined' || !player || typeof profile === 'undefined' || !profile) return;
    const seen = profile.marcos692 = profile.marcos692 || {};
    for (const m of MARKS) {
      if (seen[m.id] || Math.hypot(player.x - m.x, player.z - m.z) > 70) continue;
      seen[m.id] = 1;
      try { if (typeof LORE !== 'undefined') LORE['marco692_' + m.id] = [m.name, m.lore]; } catch (_) { }
      try { toast('<b>[MARCO DESCOBERTO]</b> ' + m.name + ' — reino de ' + m.reino + '.<br>' + m.lore, 9000); } catch (_) { }
      try { store.set('pds2_profile', profile); } catch (_) { }
    }
  }
  setInterval(() => {
    try {
      hook();
      if (typeof started !== 'undefined' && started) { mount(); const n = performance.now(); if (n - lastCheck > 1000) { lastCheck = n; discover(); } }
    } catch (_) { }
  }, 500);

  // mapa grande: picos com nome e marcos
  function map(ctx, tx, tz) {
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const label = (t, x, y, font, col) => { ctx.font = font; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(20,12,4,.9)'; ctx.strokeText(t, x, y); ctx.fillStyle = col; ctx.fillText(t, x, y); };
    const PK = window.TER245 && TER245.PK692 || [];
    PEAKS.forEach((n, i) => { const k = PK[i]; if (!k) return; const X = tx(k[0]), Z = tz(k[1]);
      ctx.fillStyle = '#e9e2d4'; ctx.strokeStyle = '#2a1a0a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X, Z - 7); ctx.lineTo(X + 6, Z + 4); ctx.lineTo(X - 6, Z + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      label(n, X, Z + 13, 'italic 600 10px "Chakra Petch",sans-serif', '#f3ead6'); });
    const seen = (typeof profile !== 'undefined' && profile && profile.marcos692) || {};
    for (const m of MARKS.concat([ASTER])) { const X = tx(m.x), Z = tz(m.z), got = m === ASTER || seen[m.id];
      ctx.fillStyle = got ? '#ffd070' : '#c9b48a'; ctx.strokeStyle = '#2a1a0a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(X, Z - 9); ctx.lineTo(X + 7, Z); ctx.lineTo(X, Z + 9); ctx.lineTo(X - 7, Z); ctx.closePath(); ctx.fill(); ctx.stroke();
      label(m.name, X, Z - 16, '700 11px "Russo One",sans-serif', got ? '#ffe6a8' : '#e8dcc0'); }
    ctx.restore();
  }
  window.Marcos692 = { MARKS, PEAKS, map, mount, live };
})();
