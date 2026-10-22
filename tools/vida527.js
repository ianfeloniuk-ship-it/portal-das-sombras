/* v527 (Ian, 21/10/2026): mundo vivo, parte 3 — crianças que brincam na praça e brigas entre moradores.
   Crianças (modelo Low Poly Kid, CC BY 4.0, ver models/criancas527): 2 por cidade de dia, correm entre pontos da praça; à noite vão dormir (somem). Falam pelo menu de tools/dialogo520.js.
   Brigas: de tempos em tempos (no máximo uma a cada 150 s, perto do jogador, de dia) dois moradores de tools/vida523.js
   discutem no meio da rua. O jogador pode separar (+3 de reputação), tomar partido ou deixar; se ninguém resolver em 25 s,
   o guarda mais próximo vai até lá e separa. As notícias que os NPCs contam mudam com o que o jogador fez (Dialogo520.fama). */
(function (global) {
  'use strict';
  const KN = ['Pipo', 'Lila', 'Tico', 'Nina', 'Duda', 'Beto'];
  const KLINES = ['Pega eu!', 'Você não me pega!', 'Minha mãe disse que tem monstros lá fora!', 'Quero ser guarda quando crescer!'];
  const BLINES = ['Você me deve!', 'Mentiroso!', 'Isso é meu!', 'Saia da minha frente!', 'Vou chamar a guarda!'];
  const rnd = (a, b) => a + Math.random() * (b - a);
  let lastBrawl = 0;

  const ready = () => typeof L !== 'undefined' && L && L.mode === 'world' && typeof player !== 'undefined' && player && !player.dead
    && typeof npcs !== 'undefined' && typeof makeChibi === 'function' && typeof scene !== 'undefined' && typeof chunks !== 'undefined';
  const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const dlen = () => (typeof DAYLEN !== 'undefined' ? DAYLEN : 3600);
  const phase = () => ((typeof dayT !== 'undefined' ? dayT : 0) % dlen()) / dlen();
  const night = () => typeof isNight === 'function' && isNight();
  const drop = n => { n.gone = true; try { scene.remove(n.m.root); if (n.kid527) scene.remove(n.kid527.root); } catch (_) {} };

  /* Crianças: modelo "Low Poly Kid" (malekith97 / Nitin Chowdary, CC BY 4.0, OpenGameArt), models/criancas527/crianca.glb.
     O boneco de chibi fica escondido só para o motor de NPCs (updNpc) continuar andando; o modelo da criança acompanha ele. */
  const KID_SCALE = .55;
  const SKINS = [0xf1c9a5, 0xd9a47c, 0xb97e57, 0x8d5a3b], HAIRS = [0x2a1a10, 0x6b3a1e, 0xc9a24a, 0x151515], SHIRTS = [0xd8453a, 0x3a7bd8, 0x4aa85a, 0xe0b63a, 0x9a5ad8], SHORTS = [0x3a4a6a, 0x5a4a3a, 0x2f5a4a, 0x6a3a4a];
  const pendKids = new Set();
  let lastF = 0;

  function paintKid(geo0, pal, T) {
    const geo = geo0.index ? geo0.toNonIndexed() : geo0; // cor por triângulo: bordas nítidas entre camisa, bermuda e pele
    const pos = geo.attributes.position, n = pos.count, col = new Float32Array(n * 3);
    const lc = hex => new T.Color(hex).convertSRGBToLinear();
    const cs = { skin: lc(pal.skin), hair: lc(pal.hair), shirt: lc(pal.shirt), shorts: lc(pal.shorts), shoe: lc(0x3a2a1a) };
    for (let i = 0; i + 2 < n; i += 3) {
      const ax = (Math.abs(pos.getX(i)) + Math.abs(pos.getX(i + 1)) + Math.abs(pos.getX(i + 2))) / 3, h = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
      let c = cs.skin;
      if (h > 1.74 || (h > 1.62 && ax > .17)) c = cs.hair;
      else if (h > 1.47) c = cs.skin;
      else if (h >= .78 && ax < .38) c = cs.shirt;
      else if (h >= .48 && h < .78 && ax < .3) c = cs.shorts;
      else if (h < .15) c = cs.shoe;
      for (let k = 0; k < 3; k++) { col[(i + k) * 3] = c.r; col[(i + k) * 3 + 1] = c.g; col[(i + k) * 3 + 2] = c.b; }
    }
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    return geo;
  }
  function addEyes(root, T) { // dois olhinhos pretos presos no osso da cabeça (rosto vira para +Z)
    let head = null; root.traverse(o => { if (o.isBone && /head/i.test(o.name) && /DEF/i.test(o.name)) head = o; });
    if (!head) root.traverse(o => { if (!head && o.isBone && /head/i.test(o.name)) head = o; });
    if (!head || !T.SphereGeometry || !T.MeshBasicMaterial) return;
    root.updateMatrixWorld(true);
    const geo = new T.SphereGeometry(.028, 8, 6), mat = new T.MeshBasicMaterial({ color: 0x14100c });
    for (const sx of [-1, 1]) {
      const e = new T.Mesh(geo, mat), w = root.localToWorld(new T.Vector3(sx * .085, 1.64, .135));
      head.add(e); e.position.copy(head.worldToLocal(w));
    }
  }
  function loadKidModel(cb) {
    const T = global.THREE; if (!T || !T.GLTFLoader) return;
    new T.GLTFLoader().load('models/criancas527/crianca.glb?v=534', g => { try { cb(g, T); } catch (e) { console.warn('Crianças', e); } }, undefined, () => {});
  }
  function spawnKid(c) {
    if (pendKids.has(c) || typeof makeChibi !== 'function') return;
    pendKids.add(c);
    loadKidModel((g, T) => {
      pendKids.delete(c);
      if (typeof npcs === 'undefined' || (typeof L !== 'undefined' && L && L.mode !== 'world')) return;
      const R = a => a[Math.floor(Math.random() * a.length)];
      const used = new Set(npcs.filter(x => x.vida527 && !x.gone).map(x => x.name)), free = KN.filter(x => !used.has(x)), nm = free[0] || KN[0];
      const a = rnd(0, 6.28), x = c.x + Math.cos(a) * 6, z = c.z + Math.sin(a) * 6;
      const dummy = makeChibi({ body: 0x888888, hair: 0x888888, wep: 'none', gk: 'Rogue', tint: 0xffffff, scale: .6 });
      dummy.root.position.set(x, 0, z); dummy.root.visible = false; scene.add(dummy.root);
      const root = g.scene; root.scale.setScalar(KID_SCALE); root.position.set(x, 0, z); scene.add(root);
      const pal = { skin: R(SKINS), hair: R(HAIRS), shirt: R(SHIRTS), shorts: R(SHORTS) };
      root.traverse(o => { if (o.isMesh) { o.frustumCulled = false; o.geometry = paintKid(o.geometry, pal, T); o.material = new T.MeshLambertMaterial({ vertexColors: true, skinning: !!o.isSkinnedMesh }); } });
      try { addEyes(root, T); } catch (_) {}
      const src = g.animations[0], mixer = new T.AnimationMixer(root), mk = (name, f0, f1) => mixer.clipAction(T.AnimationUtils.subclip(src, name, f0, f1, 24));
      const acts = { idle: mk('idle', 0, 67), walk: mk('walk', 89, 111), run: mk('run', 72, 83) };
      acts.idle.play();
      const n = { kind: 'morador', vida527: true, role523: 'crianca', job523: 'Criança', act523: 'brincar', home: c, m: dummy, x, z, face: rnd(0, 6.28), r: .35, t: Math.random() * 9, tx: x, tz: z, wait: 0, path: [], name: nm, short: nm, col: '#ffe08a', seed523: Math.floor(rnd(0, 360)), label: 'F · FALAR COM ' + nm.toUpperCase(), kid527: { root, mixer, acts, cur: 'idle', px: x, pz: z, v: 0 } };
      n.use = () => { if (global.Dialogo520) Dialogo520.vida(n); };
      npcs.push(n);
    });
  }
  function kidSync(n, dt) {
    const k = n.kid527; if (!k) return;
    if (n.gone) { try { scene.remove(k.root); } catch (_) {} n.kid527 = null; return; }
    k.root.visible = n.kind !== 'deco';
    k.root.position.set(n.x, 0, n.z); k.root.rotation.y = n.face || 0;
    const v = dt > 0 ? Math.hypot(n.x - k.px, n.z - k.pz) / dt : 0; k.px = n.x; k.pz = n.z; k.v += (v - k.v) * Math.min(1, dt * 6);
    const want = k.v > 3.6 ? 'run' : k.v > .3 ? 'walk' : 'idle';
    if (want !== k.cur) { k.acts[want].reset().play(); k.acts[want].crossFadeFrom(k.acts[k.cur], .2, false); k.cur = want; }
    if (want === 'walk') k.acts.walk.timeScale = Math.max(.6, Math.min(1.8, k.v / 1.6));
    k.mixer.update(dt);
  }
  function frame() {
    requestAnimationFrame(frame);
    const now = performance.now(), dt = Math.min(.1, Math.max(0, (now - lastF) / 1000)); lastF = now;
    if (typeof paused !== 'undefined' && paused) return;
    if (typeof npcs === 'undefined') return;
    for (const n of npcs) if (n.kid527) { try { kidSync(n, dt); } catch (_) {} }
  }
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(frame);
  function kidTick(n, p, nn) {
    if (nn || p > .6) { // vai dormir
      if (n.kind !== 'deco') n.kind = 'deco';
      return;
    }
    if (n.kind === 'deco') n.kind = 'morador';
    n.goGate = null;
    const d = Math.hypot((n.pt || { x: n.x, z: n.z }).x - n.x, (n.pt || { x: n.x, z: n.z }).z - n.z);
    if (!n.pt || d < 1.5 || (n.ptT = (n.ptT || 0) + 1) > 20) {
      const a = rnd(0, 6.28), r = rnd(2, 10); n.pt = { x: n.home.x + Math.cos(a) * r, z: n.home.z + Math.sin(a) * r }; n.ptT = 0;
      if (Math.random() < .25 && typeof speech153 === 'function' && dist(n, player) < 12) speech153(n, KLINES[Math.floor(Math.random() * KLINES.length)], '');
    }
    n.tx = n.pt.x; n.tz = n.pt.z; n.path = []; n.wait = 0;
  }

  function startBrawl(c, now) {
    const pool = npcs.filter(n => n.vida523 && !n.gone && n.home === c && n.kind === 'morador' && (n.role523 === 'morador' || n.role523 === 'bebado') && !n.brigaT523);
    if (pool.length < 2) return false;
    const a = pool[0], b = pool[1], mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
    a.briga523 = b; b.briga523 = a; a.brigaT523 = b.brigaT523 = performance.now() + 25000;
    a.brigaPt523 = { x: mid.x - .7, z: mid.z }; b.brigaPt523 = { x: mid.x + .7, z: mid.z };
    a.act523 = b.act523 = 'briga'; a.brigaSay = b.brigaSay = 0; a.brigaStart = b.brigaStart = performance.now();
    if (dist(player, mid) < 60 && typeof toast === 'function') toast('<b>[CIDADE]</b> ' + a.short + ' e ' + b.short + ' estão brigando no meio da rua!');
    lastBrawl = now; return true;
  }
  function brawlTick(n, now) {
    if (!n.brigaT523) return;
    const o = n.briga523;
    if (now > n.brigaT523 || !o || o.gone) { n.brigaT523 = 0; if (n.act523 === 'briga') n.act523 = 'trabalho'; return; }
    if (typeof speech153 === 'function' && now - (n.brigaSay || 0) > 5000 && dist(n, player) < 14) { n.brigaSay = now + rnd(0, 2000); speech153(n, BLINES[Math.floor(Math.random() * BLINES.length)], ''); }
    // depois de 10 s o guarda mais próximo vem separar
    if (now - n.brigaStart > 10000) {
      const g = npcs.filter(x => x.role523 === 'guarda' && !x.gone && x.home === n.home).sort((a, b) => dist(a, n) - dist(b, n))[0];
      if (g) { g.chase523 = { x: n.x, z: n.z, gone: false }; if (dist(g, n) < 3) { n.brigaT523 = 0; o.brigaT523 = 0; g.chase523 = null; } }
    }
  }

  function tick() {
    try {
      if (!ready()) return;
      const p = phase(), nn = night(), now = performance.now();
      for (const n of npcs.filter(x => x.vida527 && !x.gone)) {
        if (!n.home || dist(player, n.home) > 220) { drop(n); continue; }
        kidTick(n, p, nn);
      }
      for (const n of npcs) if (n.brigaT523 && !n.gone) brawlTick(n, now);
      for (const ch of chunks.values()) {
        const c = ch.city; if (!c || (typeof cityFallen === 'function' && cityFallen(c)) || dist(player, c) > 120) continue;
        const kids = npcs.filter(x => x.vida527 && !x.gone && x.home === c).length;
        if (kids < 2 && !nn) { spawnKid(c); break; }
        if (!nn && p > .05 && p < .6 && dist(player, c) < 60 && now - lastBrawl > 150000 && Math.random() < .08) { if (startBrawl(c, now)) break; }
      }
    } catch (_) {}
  }
  setInterval(tick, 1000);
  global.Vida527 = { tick };
})(typeof window !== 'undefined' ? window : globalThis);
