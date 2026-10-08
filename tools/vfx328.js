/* v334 (Ian): shaders próprios e projéteis reais nas habilidades (chama, fumaça, raio, água; flechas, adagas, lanças de verdade).
   v328 (Ian): efeito visual próprio para TODAS as habilidades das 24 classes, não só as 3 primeiras.
   Antes, 126 das 200 habilidades do catálogo e 28 das classes novas caíam num anel/cúpula genérico.
   Aqui cada habilidade tem uma receita escolhida pelo nome, montada com as peças do vfx302 e peças novas
   (punhos, estocada de luz, sangue, relógio, fenda, corrente, espíritos, ossos, totem, selos, grito, faísca de aparo).
   Habilidades fora da tabela (chefes, roubadas) continuam no vfx302. */
(function () {
  'use strict';
  const V = window.VFX302; if (!V) return;
  const T = THREE, R = (a, b) => a + Math.random() * (b - a), TAU = Math.PI * 2;
  const E = (col, op = 1) => V.add2(0, col, op);
  const add = V.add, fade = V.fade;

  /* ---------- alvos ---------- */
  function foes(range, fromX, fromZ) {
    const P = player, x = fromX ?? P.x, z = fromZ ?? P.z;
    return (enemies || []).filter(e => e && !e.dead && !e.ally && !e.friendly217 && Math.hypot(e.x - x, e.z - z) <= range)
      .sort((a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z));
  }
  function front(range = 10) {
    const P = player, a = P.face || 0, fx = Math.sin(a), fz = Math.cos(a);
    const list = foes(range).filter(e => ((e.x - P.x) * fx + (e.z - P.z) * fz) > -1);
    return list[0] || null;
  }

  /* ---------- peças novas ---------- */
  function fists(ang, col, n = 7, len = 5) {
    const P = player;
    for (let i = 0; i < n; i++) setTimeout(() => {
      const a = ang + R(-.45, .45), g = new T.Group(); g.position.set(P.x + Math.sin(a) * .6, 1.1 + R(-.25, .3), P.z + Math.cos(a) * .6); g.rotation.y = a;
      const fist = new T.Mesh(new T.SphereGeometry(.24, 10, 8), E(col, .6)); fist.scale.set(1, .85, 1.25); g.add(fist);
      const trail = new T.Mesh(new T.ConeGeometry(.2, 1.4, 10, 1, true), E(col, .18)); trail.rotation.x = -Math.PI / 2; trail.position.z = -.8; g.add(trail);
      add(g, .32, k => { g.position.x += Math.sin(a) * len * .05; g.position.z += Math.cos(a) * len * .05; fade(g, 1 - k * k); });
      if (i % 2 === 0) star(P.x + Math.sin(a) * len * .8, P.z + Math.cos(a) * len * .8, col, .7);
    }, i * 55);
  }
  function thrust(x, z, ang, len, col, w = .35) {
    const g = new T.Group(); g.position.set(x, 1.15, z); g.rotation.y = ang;
    const shaft = new T.Mesh(new T.CylinderGeometry(w * .25, w * .25, len, 10, 1, true), E(col, .9)); shaft.rotation.x = Math.PI / 2; shaft.position.z = len / 2; g.add(shaft);
    const tip = new T.Mesh(new T.ConeGeometry(w, w * 4, 4), E(0xffffff, .95)); tip.rotation.x = Math.PI / 2; tip.position.z = len; g.add(tip);
    const halo = new T.Mesh(new T.ConeGeometry(w * 2.4, len, 16, 1, true), E(col, .22)); halo.rotation.x = -Math.PI / 2; halo.position.z = len / 2; g.add(halo);
    const lines = []; for (let i = 0; i < 8; i++) { const l = new T.Mesh(new T.BoxGeometry(.03, .03, R(1, 2.5)), E(col, .9)); l.position.set(R(-.6, .6), R(-.5, .5), R(0, len)); g.add(l); lines.push(l); }
    g.scale.z = .05;
    add(g, .45, k => { g.scale.z = Math.min(1, k * 5); for (const l of lines) l.position.z += .3; fade(g, k < .5 ? 1 : (1 - k) * 2); });
    star(x + Math.sin(ang) * len, z + Math.cos(ang) * len, col, 1.1);
  }
  function star(x, z, col, s = 1, y = 1.1) {
    const g = new T.Group(); g.position.set(x, y, z);
    for (let i = 0; i < 4; i++) { const p = new T.Mesh(new T.PlaneGeometry(.18 * s, 2.2 * s), E(i % 2 ? col : 0xffffff, .95)); p.rotation.z = i * Math.PI / 4; g.add(p); }
    g.userData.spin = R(-4, 4);
    add(g, .3, k => { g.lookAt(camera.position); g.rotation.z += g.userData.spin * .016; g.scale.setScalar(.4 + k * 1.2); fade(g, 1 - k); });
  }
  function beam(x1, z1, x2, z2, col, w = .18, dur = .5, y = 1.1) {
    const d = Math.hypot(x2 - x1, z2 - z1); if (d < .2) return;
    const g = new T.Group(); g.position.set(x1, y, z1); g.rotation.y = Math.atan2(x2 - x1, z2 - z1);
    const core = new T.Mesh(new T.BoxGeometry(w * .4, w * .4, d), E(0xffffff, .95)); core.position.z = d / 2; g.add(core);
    const glow = new T.Mesh(new T.CylinderGeometry(w, w, d, 10, 1, true), E(col, .5)); glow.rotation.x = Math.PI / 2; glow.position.z = d / 2; g.add(glow);
    add(g, dur, (k, t) => { glow.scale.set(1 + .3 * Math.sin(t * 40), 1, 1 + .3 * Math.sin(t * 40)); fade(g, 1 - k); });
    star(x2, z2, col, .8);
  }
  function chain(pts, col, dur = .9) {
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]], d = Math.hypot(b.x - a.x, b.z - a.z), n = Math.max(2, Math.floor(d / .45));
      const g = new T.Group(); g.position.set(a.x, 1.1, a.z); g.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
      for (let j = 0; j < n; j++) { const l = new T.Mesh(new T.TorusGeometry(.17, .045, 6, 12), E(col, .95)); l.position.z = (j + .5) * d / n; l.rotation.y = j % 2 ? Math.PI / 2 : 0; g.add(l); }
      add(g, dur, (k, t) => { g.position.y = 1.1 + Math.sin(t * 9) * .05; fade(g, k < .7 ? 1 : (1 - k) / .3); });
    }
  }
  function rift(x, z, ang, col, h = 3.2, dur = 1.1) {
    const g = new T.Group(); g.position.set(x, h / 2 + .2, z); g.rotation.y = ang + Math.PI / 2;
    const shape = new T.Mesh(new T.PlaneGeometry(1.3, h, 1, 8), E(col, .85));
    const pos = shape.geometry.attributes.position; for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); pos.setX(i, pos.getX(i) * (1 - Math.abs(y) / (h / 2)) + Math.sin(y * 3) * .15); } pos.needsUpdate = true; g.add(shape);
    const edge = new T.Mesh(shape.geometry, E(0xffffff, .6)); edge.scale.set(.35, 1, 1); g.add(edge);
    const sp = []; for (let i = 0; i < 14; i++) { const s = new T.Mesh(new T.OctahedronGeometry(.06), E(col, 1)); s.position.set(R(-.4, .4), R(-h / 2, h / 2), R(-.3, .3)); s.userData.v = R(.5, 1.6); g.add(s); sp.push(s); }
    g.scale.x = .01;
    /* v331: a fenda sempre vira de frente para a câmera (de lado ela sumia) */
    add(g, dur, k => { g.rotation.y = Math.atan2(camera.position.x - g.position.x, camera.position.z - g.position.z); g.scale.x = k < .2 ? k * 5 : k > .8 ? (1 - k) * 5 : 1; for (const s of sp) { s.position.x += s.userData.v * .02 * (s.position.x > 0 ? 1 : -1); } fade(g, k > .8 ? (1 - k) * 5 : 1); });
  }
  function orb(x, z, col, r = 1.4, implode = false, dark = false, dur = .8) {
    const g = new T.Group(); g.position.set(x, 1.2, z); const SHD = window.Shaders312, fiery = col === 0xff6a1e || col === 0xff3a00;
    const core = new T.Mesh(new T.IcosahedronGeometry(r, 3), dark ? SHD.voidm(col, 1) : SHD.fireball(fiery ? null : col, 1)); g.add(core);
    const ring = new T.Mesh(new T.TorusGeometry(r * 1.25, .05, 6, 40), E(col, .9)); ring.rotation.x = Math.PI / 2.4; g.add(ring);
    add(g, dur, (k, t) => { const s = implode ? 1.4 - k * 1.3 : .3 + k * 1.1; g.scale.setScalar(s); ring.rotation.z = t * 6; fade(g, implode ? 1 - k * .6 : 1 - k * k); });
  }
  function blood(x, z, n = 14, col = 0xc0182a) {
    const g = new T.Group(); g.position.set(x, 1, z); const ds = [];
    for (let i = 0; i < n; i++) { const d = new T.Mesh(new T.SphereGeometry(R(.06, .14), 6, 5), E(col, .95)); d.scale.y = 1.6; d.userData.v = [R(-3, 3), R(2, 5), R(-3, 3)]; g.add(d); ds.push(d); }
    const pool = new T.Mesh(new T.CircleGeometry(1.2, 20), E(col, .35)); pool.rotation.x = -Math.PI / 2; pool.position.y = -.95; g.add(pool);
    add(g, .9, k => { for (const d of ds) { const v = d.userData.v; d.position.x += v[0] * .016; d.position.y = Math.max(-.95, d.position.y + v[1] * .016); v[1] -= 12 * .016; d.position.z += v[2] * .016; } pool.scale.setScalar(.3 + k * 1.2); fade(g, 1 - k); });
  }
  function wisps(x, z, col, n = 10, h = 3, dur = 1.3) {
    const g = new T.Group(); g.position.set(x, .2, z); const ws = [];
    for (let i = 0; i < n; i++) { const w = new T.Mesh(new T.SphereGeometry(R(.1, .18), 8, 6), E(col, 1)); const tl = new T.Mesh(new T.ConeGeometry(.08, .7, 6, 1, true), E(col, .45)); tl.position.y = -.4; tl.rotation.x = Math.PI; w.add(tl); w.userData = { a: R(0, TAU), r: R(.3, 1.4), v: R(1.5, 3), s: R(2, 5) }; g.add(w); ws.push(w); }
    add(g, dur, (k, t) => { for (const w of ws) { const u = w.userData; w.position.set(Math.cos(u.a + t * u.s) * u.r * (1 - k * .5), Math.min(h, t * u.v), Math.sin(u.a + t * u.s) * u.r * (1 - k * .5)); } fade(g, 1 - k * k); });
  }
  function bones(x, z, n = 8, r = 2.2) {
    const g = new T.Group(); g.position.set(x, 0, z); const bs = [];
    const mat = new T.MeshToonMaterial({ color: 0xece2c8, emissive: 0x2a2018, transparent: true });
    for (let i = 0; i < n; i++) { const a = i / n * TAU, h = R(1.4, 2.4), b = new T.Mesh(new T.ConeGeometry(.16, h, 5), mat); b.position.set(Math.cos(a) * r, -h, Math.sin(a) * r); b.rotation.z = Math.cos(a) * -.35; b.rotation.x = Math.sin(a) * .35; b.userData.h = h; g.add(b); bs.push(b); }
    const glow = new T.Mesh(new T.RingGeometry(r * .8, r * 1.1, 32), E(0x9b6bff, .6)); glow.rotation.x = -Math.PI / 2; glow.position.y = .05; g.add(glow);
    add(g, 2, k => { for (const b of bs) b.position.y = k < .15 ? -b.userData.h * (1 - k / .15) + b.userData.h * .45 * (k / .15) : b.userData.h * .45; fade(g, k > .75 ? (1 - k) * 4 : 1); });
  }
  function totem(x, z, col, h = 2.2, dur = 1.6) {
    const g = new T.Group(); g.position.set(x, 0, z);
    const stone = new T.Mesh(new T.CylinderGeometry(.28, .4, h, 6), window.Shaders312 ? Shaders312.metal(0x6a6a7a) : new T.MeshToonMaterial({ color: 0x6a6a7a })); stone.position.y = h / 2; g.add(stone);
    const rings = []; for (let i = 0; i < 3; i++) { const r = new T.Mesh(new T.TorusGeometry(.55 + i * .12, .04, 6, 32), E(col, .9)); r.position.y = h * (.35 + i * .25); r.rotation.x = Math.PI / 2; g.add(r); rings.push(r); }
    const gem = new T.Mesh(new T.OctahedronGeometry(.28), window.Crystal310 ? Crystal310.mat(col, .95) : E(col, 1)); gem.position.y = h + .45; g.add(gem);
    g.position.y = -h;
    add(g, dur, (k, t) => { g.position.y = Math.min(0, -h + k * 8 * h); rings.forEach((r, i) => { r.rotation.z = t * (2 + i); r.position.y = h * (.35 + i * .25) + Math.sin(t * 4 + i) * .08; }); gem.rotation.y = t * 3; if (k > .8) fade(g, (1 - k) * 5); });
    V.runeCircle(x, z, col, 1.4);
  }
  function glyph(x, z, col, r = 1.6, kind = 'sigil', dur = 1.4, y = .06) {
    const g = new T.Group(); g.position.set(x, y, z); const M = E(col, .95); const parts = [];
    const ring = new T.Mesh(new T.RingGeometry(r * .93, r, 56), M); ring.rotation.x = -Math.PI / 2; g.add(ring);
    if (kind === 'clock') {
      for (let i = 0; i < 12; i++) { const t = new T.Mesh(new T.PlaneGeometry(.06, i % 3 ? .18 : .34), M); t.rotation.x = -Math.PI / 2; const a = i / 12 * TAU; t.position.set(Math.sin(a) * r * .82, .01, Math.cos(a) * r * .82); t.rotation.z = -a; g.add(t); }
      for (const [L, w, s] of [[r * .75, .07, 4], [r * .5, .1, .6]]) { const h = new T.Group(); const p = new T.Mesh(new T.PlaneGeometry(w, L), M); p.rotation.x = -Math.PI / 2; p.position.z = L / 2; h.add(p); h.userData.s = s; h.position.y = .02; g.add(h); parts.push(h); }
      const gear = new T.Mesh(new T.TorusGeometry(r * 1.2, .05, 4, 24), E(col, .5)); gear.rotation.x = Math.PI / 2; gear.userData.s = -1; g.add(gear); parts.push(gear);
    } else if (kind === 'palm') {
      const palm = new T.Mesh(new T.CircleGeometry(r * .35, 20), E(col, .7)); palm.rotation.x = -Math.PI / 2; g.add(palm);
      for (let i = 0; i < 5; i++) { const a = -.9 + i * .45, f = new T.Mesh(new T.CircleGeometry(r * .13, 10), M); f.scale.y = 2; f.rotation.x = -Math.PI / 2; f.rotation.z = -a; f.position.set(Math.sin(a) * r * .58, .01, Math.cos(a) * r * .58); g.add(f); }
    } else if (kind === 'seal5' || kind === 'sigil') {
      const pts = kind === 'seal5' ? 5 : 6, step = kind === 'seal5' ? 2 : 1;
      for (let i = 0; i < pts; i++) { const a1 = i / pts * TAU, a2 = (i + step) / pts * TAU, x1 = Math.sin(a1) * r * .9, z1 = Math.cos(a1) * r * .9, x2 = Math.sin(a2) * r * .9, z2 = Math.cos(a2) * r * .9, d = Math.hypot(x2 - x1, z2 - z1);
        const l = new T.Mesh(new T.PlaneGeometry(.07, d), M); l.rotation.x = -Math.PI / 2; l.rotation.z = -Math.atan2(x2 - x1, z2 - z1); l.position.set((x1 + x2) / 2, .01, (z1 + z2) / 2); g.add(l);
        const dot = new T.Mesh(new T.CircleGeometry(.14, 10), E(0xffffff, .95)); dot.rotation.x = -Math.PI / 2; dot.position.set(x1, .02, z1); g.add(dot); }
      g.userData.spin = .8;
    } else if (kind === 'eight') {
      for (let i = 0; i < 40; i++) { const t = i / 40 * TAU, d = new T.Mesh(new T.CircleGeometry(.09, 8), M); d.rotation.x = -Math.PI / 2; d.position.set(Math.sin(t) * r, .01, Math.sin(t) * Math.cos(t) * r); g.add(d); }
    }
    add(g, dur, (k, t) => { for (const p of parts) p.rotation.y = -t * p.userData.s; if (g.userData.spin) g.rotation.y = t * g.userData.spin; g.scale.setScalar(k < .15 ? k / .15 : 1); fade(g, k > .7 ? (1 - k) / .3 : 1); });
  }
  function shout(x, z, ang, col, n = 3, spread = 1.2) {
    for (let i = 0; i < n; i++) setTimeout(() => {
      const g = new T.Group(); g.position.set(x, 1.3, z); g.rotation.y = ang;
      const arc = new T.Mesh(new T.RingGeometry(.9, 1.05, 32, 1, -spread / 2 - Math.PI / 2, spread), E(col, .9)); arc.rotation.x = -Math.PI / 2; g.add(arc);
      add(g, .5, k => { g.scale.setScalar(1 + k * 5); fade(g, 1 - k); });
    }, i * 110);
  }
  function mark(e, col, kind = 'sigil') { if (!e) return; glyph(e.x, e.z, col, 1, kind, 1.6, 2.6); star(e.x, e.z, col, .9, 1.4); }
  function ground(x, z, col, r, dur = 2) { const g = new T.Group(); g.position.set(x, .06, z); const d = new T.Mesh(new T.CircleGeometry(r, 48), window.Shaders312.magic(col, 1, 6)); d.rotation.x = -Math.PI / 2; g.add(d); add(g, dur, k => { g.scale.setScalar(k < .12 ? k / .12 : 1); fade(g, k > .75 ? (1 - k) * 4 : 1); }); }
  function cage(x, z, col, r = 1.2) { const g = new T.Group(); g.position.set(x, 0, z); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, b = new T.Mesh(new T.CylinderGeometry(.06, .06, 2.4, 6), E(col, .9)); b.position.set(Math.cos(a) * r, 1.2, Math.sin(a) * r); g.add(b); } const top = new T.Mesh(new T.TorusGeometry(r, .06, 6, 24), E(col, .9)); top.rotation.x = Math.PI / 2; top.position.y = 2.4; g.add(top); g.scale.y = .01; add(g, 1.6, k => { g.scale.y = Math.min(1, k * 8); fade(g, k > .75 ? (1 - k) * 4 : 1); }); }
  function afterimages(col, n = 3) { const P = player; if (!P || !P.m) return; for (let i = 0; i < n; i++) setTimeout(() => { if (!player) return; const g = new T.Group(); g.position.set(player.x, 0, player.z); /* v331: o teste da geometria quebrava (não existe cápsula nesta versão do three) e a imagem residual nunca aparecia */const b = new T.Mesh(T.CapsuleGeometry ? new T.CapsuleGeometry(.4, 1, 4, 8) : new T.CylinderGeometry(.32, .4, 1.7, 10), E(col, .4)); b.position.y = 1; g.add(b); add(g, .45, k => fade(g, 1 - k)); }, i * 70); }

  /* ---------- v334 (Ian): projéteis de verdade dentro dos efeitos (os mesmos modelos que o jogo já usa) e peças com shader ---------- */
  const S = () => window.Shaders312;
  function pmodel(type, col, sc, cls) { try { const m = projModel(type, col, sc, cls); if (!m) return null; m.traverse(o => { if (o.geometry) (o.geometry.userData || (o.geometry.userData = {})).shared = true; }); if (/arrow|tspear|tdagger/.test(type)) { /* bainha de luz: de noite o modelo virava silhueta preta */ const L = type === 'tspear' ? 1.9 : type === 'tdagger' ? .7 : 1.1, h = new T.Mesh(new T.CylinderGeometry(.022, .022, L, 5, 1, true), E(col, .6)); h.rotation.x = Math.PI / 2; const w = new T.Group(); w.add(m); const hh = new T.Group(); hh.scale.setScalar(sc || 1); hh.add(h); w.add(hh); return w; } return m; } catch (_) { return null; } }
  /* voa em linha reta; não usa fade (o material do modelo é compartilhado com os projéteis reais) */
  function fly(type, o = {}) {
    const x = o.x ?? player.x, z = o.z ?? player.z, ang = o.ang ?? (player.face || 0), dist = o.dist ?? 12, speed = (o.speed ?? 32) * .62, col = o.col ?? 0xffffff, sc = o.sc ?? 1.5, y = o.y ?? 1.15;
    const go = () => {
      const ex = x + Math.sin(ang) * dist, ez = z + Math.cos(ang) * dist, m = pmodel(type, col, sc, o.cls ?? null);
      if (!m) { V.streak(x, z, ang, dist, col); o.onHit && o.onHit(ex, ez); return; }
      const g = new T.Group(); g.add(m); g.position.set(x, y, z); g.rotation.y = ang;
      const tr = new T.Mesh(new T.CylinderGeometry(.13, .02, 1, 6, 1, true), E(col, .65)); tr.rotation.x = Math.PI / 2; g.add(tr);
      add(g, Math.max(.08, dist / speed), k => { const d = dist * k; g.position.set(x + Math.sin(ang) * d, y, z + Math.cos(ang) * d); if (o.spin) m.rotation.x += o.spin; const L = Math.min(d, 2.6); tr.scale.y = Math.max(.01, L); tr.position.z = -L / 2 - .35; if (k >= 1 && o.onHit) o.onHit(ex, ez); });
    };
    o.delay ? setTimeout(go, o.delay) : go();
  }
  /* chuva de flechas: flechas de verdade caem do céu e ficam cravadas no chão */
  function rainArrows(x, z, r = 3.6, n = 22, col = 0xd8f0ff) {
    for (let i = 0; i < n; i++) setTimeout(() => {
      const a = R(0, TAU), d = Math.sqrt(Math.random()) * r, px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d, m = pmodel('sarrow', col, 3, 4);
      if (!m) { V.bolt(px, pz, col); return; }
      const g = new T.Group(); g.add(m); const sx = px + R(-.8, .8) - 2.2, sz = pz + 3.2, sy = 13; g.position.set(sx, sy, sz); g.lookAt(px, 0, pz);
      const tr = new T.Mesh(new T.CylinderGeometry(.12, .02, 4, 6, 1, true), E(col, .7)); tr.rotation.x = Math.PI / 2; tr.position.z = -2.6; g.add(tr); let hit = false;
      add(g, 1.5, k => { const f = Math.min(1, k / .15); g.position.set(sx + (px - sx) * f, sy * (1 - f) + .55 * f, sz + (pz - sz) * f); if (f >= 1 && !hit) { hit = true; tr.visible = false; V.dust(px, pz, 0xb8a888, 2); star(px, pz, col, .7, .4); } if (k > .8) g.scale.setScalar(Math.max(.01, (1 - k) / .2)); });
    }, i * 55);
  }
  /* estocada com a lança de verdade dentro do rastro de luz */
  function jab(x, z, ang, len, col, w = .35) { thrust(x, z, ang, len, col, w); fly('tspear', { x, z, ang, dist: Math.max(1, len - 1), speed: 30, sc: 1, col }); }
  /* onda de água: parede curva com espuma na crista avançando */
  function wave(x, z, ang, col = 0x3aa0ff, len = 8, w = 6) {
    const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ang; const geo = new T.PlaneGeometry(w, 2.6, 20, 8), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const px = p.getX(i), h = (p.getY(i) + 1.3) / 2.6, env = .35 + .65 * Math.cos(px / w * Math.PI); p.setY(i, h * 2.6 * env - 1.3); p.setZ(i, -(px * px) * .16 + h * h * 1.4 * env); } p.needsUpdate = true; geo.computeVertexNormals();
    const m = new T.Mesh(geo, S().water(col, 1)); g.add(m); const dr = [];
    for (let i = 0; i < 16; i++) { const q = new T.Mesh(new T.SphereGeometry(R(.05, .11), 6, 5), E(0xe8f6ff, .95)); q.userData = { x: R(-w / 2, w / 2), v: R(2, 5), t: R(0, 1) }; g.add(q); dr.push(q); }
    add(g, .95, (k, t) => { const d = 1 + k * len, sy = k < .2 ? k / .2 : k > .7 ? (1 - k) / .3 : 1; m.position.set(0, 1.3 * sy, d); m.scale.y = Math.max(.01, sy); for (const q of dr) { const u = (q.userData.t + t * 1.6) % 1; q.position.set(q.userData.x, 2.4 * sy + q.userData.v * u - 6 * u * u, d + .8 + u); } });
  }
  /* explosão de fogo: bola que cresce + fogueira + anel de chamas */
  function blast(x, z, r = 2, col = null) { const b = new T.Mesh(new T.IcosahedronGeometry(r * .6, 3), S().fireball(col, 1)); b.position.set(x, 1, z); add(b, .5, k => { b.scale.setScalar(.4 + k * 1.3); b.material.opacity = 1 - k * k; }); V.flames(x, z, { n: 6, r: r * .5, h: r * 1.1, dur: .9, col }); V.fireRing(x, z, r * 1.4, col == null ? 0xff6a1e : col); }

  /* ---------- paletas por classe ---------- */
  const C = { war: 0xffb84a, ass: 0x9a7bff, tank: 0x8fc8ff, arch: 0xd8f0ff, pal: 0xffe9a0, inv: 0x7fe8c8, necro: 0x9b6bff, fire: 0xff6a1e, ice: 0xbfe8ff, earth: 0xc8a060,
    bolt: 0xfff36b, time: 0x7fd8ff, rift: 0xd36bff, bond: 0x8affc2, beast: 0xffa24a, rune: 0x6fd8ff, spec: 0x6fa8ff, storm: 0x8ab8ff, orac: 0xf0d080, void: 0x7a3cff, monk: 0xffd27a, arc: 0xa050ff, lance: 0x8fc4ff, blood: 0xd0202a };

  /* ---------- receitas (uma por habilidade) ---------- */
  const X = {};
  const def = (names, fn) => names.split('|').forEach(n => { X[n] = fn; });
  /* Guerreiro */
  def('Corte Giratório', c => { V.whirl(C.war, 3.4); V.dust(c.P.x, c.P.z, 0x9a8a70, 8); });
  def('Investida', c => { V.dashTrail(C.war); setTimeout(() => V.shockwave(player.x, player.z, C.war, 2.5), 160); });
  def('Grito de Guerra', c => { shout(c.P.x, c.P.z, c.ang, 0xff5a2a, 3, TAU); V.aura(0xff7a2a); });
  def('Lâmina Rúnica', c => { thrust(c.P.x, c.P.z, c.ang, 8, C.rune, .45); glyph(c.P.x + Math.sin(c.ang) * 8, c.P.z + Math.cos(c.ang) * 8, C.rune, 1.2, 'sigil', 1); });
  def('Golpe Pesado', c => { const p = c.at(2.2); V.fissure(p.x, p.z, c.ang, 3.5, 0xffa040); star(p.x, p.z, C.war, 1.4, .8); });
  def('Provocação|Provocar|Desafio', c => { shout(c.P.x, c.P.z, c.ang, 0xff3a2a, 4, TAU); glyph(c.P.x, c.P.z, 0xff3a2a, 2.2, 'sigil', 1); });
  def('Varredura', c => { V.slash(c.P.x, c.P.z, c.ang, C.war, 3.6, 3); V.wind(c.P.x, c.P.z, c.ang, 0xffe0a0); });
  def('Fôlego', c => { V.heal(c.P.x, c.P.z, 0x9fffb0); V.aura(0x9fffb0); });
  def('Corte Crescente', c => { V.slash(c.P.x, c.P.z, c.ang, C.war, 3, 2.2); setTimeout(() => V.slash(player.x, player.z, c.ang, 0xffffff, 4.5, 2.6), 120); });
  def('Quebra-Passo', c => { const p = c.at(3); V.fissure(c.P.x, c.P.z, c.ang, 5, 0xc8a060); ground(p.x, p.z, 0x8a7a60, 2.5, 2); });
  /* Assassino */
  def('Passo Sombrio', c => { V.smoke(c.P.x, c.P.z, 0x3a2a5a, 1.6); afterimages(C.ass, 4); setTimeout(() => V.smoke(player.x, player.z, 0x3a2a5a, 1.4), 160); });
  def('Furtividade', c => { V.smoke(c.P.x, c.P.z, 0x2a2a3a, 2.4); wisps(c.P.x, c.P.z, C.ass, 8, 2); });
  def('Lâmina Envenenada', c => { V.slash(c.P.x, c.P.z, c.ang, 0x8de06a, 2.4, 1.8); const e = c.t(); V.poison(e ? e.x : c.tx, e ? e.z : c.tz, 0x8de06a, 1.6); });
  def('Mil Cortes', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; for (let i = 0; i < 9; i++) setTimeout(() => V.slash(x - Math.sin(c.ang) * 1.5, z - Math.cos(c.ang) * 1.5, R(0, TAU), i % 2 ? C.ass : 0xffffff, 2, 1.4), i * 70); });
  def('Execução', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; afterimages(C.ass, 2); V.slash(x, z, c.ang + Math.PI / 4, 0xff2a4a, 2.4, 1.2); setTimeout(() => V.slash(x, z, c.ang - Math.PI / 4, 0xff2a4a, 2.4, 1.2), 90); blood(x, z, 12); });
  def('Cortina de Fumaça', c => { V.smoke(c.P.x, c.P.z, 0x5a5a6a, 3.4); V.smoke(c.tx, c.tz, 0x5a5a6a, 2.4); });
  def('Adaga', c => { fly('tdagger', { ang: c.ang, dist: 12, speed: 34, sc: 2, col: C.ass, spin: .5, onHit: (x, z) => star(x, z, C.ass, .9) }); });
  def('Evasão|Corpo Etéreo', c => { afterimages(c.col, 4); V.wind(c.P.x, c.P.z, c.ang + Math.PI, 0xd8d0ff, 3); });
  def('Ferida Profunda', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; V.slash(x, z, c.ang, 0xff2a4a, 2.2, 1.6); blood(x, z, 16); });
  def('Faca de Interrupção', c => { fly('tdagger', { ang: c.ang, dist: 10, speed: 40, sc: 2, col: 0xffe070, spin: .5, onHit: (x, z) => { star(x, z, 0xffe070, 1.3); glyph(x, z, 0xffe070, .9, 'sigil', .8, 2.6); } }); });
  /* Tanque */
  def('Golpe de Escudo', c => { V.slash(c.P.x, c.P.z, c.ang, C.tank, 2.6, 1.8); V.shockwave(c.P.x + Math.sin(c.ang) * 2, c.P.z + Math.cos(c.ang) * 2, C.tank, 2); });
  def('Impacto', c => { V.quakeRing(c.P.x, c.P.z, 3.5, C.tank); V.shockwave(c.P.x, c.P.z, C.tank, 4); });
  def('Muralha', c => { V.dome(c.P.x, c.P.z, C.tank, 2.4, true); glyph(c.P.x, c.P.z, C.tank, 2.4, 'sigil', 2); });
  def('Fortaleza Viva', c => { V.dome(c.P.x, c.P.z, 0xd8e8ff, 2.8, true); V.pillar(c.P.x, c.P.z, C.tank, 1.6); });
  /* v331: o aparo quase não aparecia; ganhou arco de guarda e onda curta na frente */
  def('Aparo|Aparo Espectral', c => { const p = c.at(.9); star(p.x, p.z, c.col, 2); V.slash(c.P.x, c.P.z, c.ang, c.col, 2, 1.8); shout(c.P.x, c.P.z, c.ang, 0xffffff, 2, 1.6); V.shockwave(p.x, p.z, c.col, 1.4); });
  def('Passo Pesado', c => { V.dashTrail(C.tank); setTimeout(() => V.quakeRing(player.x, player.z, 2.5, 0x8a7a60), 160); });
  def('Abalo', c => { V.quakeRing(c.P.x, c.P.z, 5, 0xc8a060); });
  def('Reserva de Guarda', c => { V.dome(c.P.x, c.P.z, C.tank, 2, true); V.aura(C.tank); });
  def('Rompante', c => { V.dashTrail(C.tank); V.spikeLine(c.P.x, c.P.z, c.ang, 7, 0x8a7a60, 'rock'); });
  /* magos (Bola de Fogo, Nova de Gelo e Corrente de Raios são compartilhadas) */
  def('Bola de Fogo', c => { if (c.real) { const p = c.at(9); blast(p.x, p.z, 1.6); } else fly('fire', { ang: c.ang, dist: 9, speed: 22, sc: 2, col: C.fire, cls: 8, onHit: (x, z) => blast(x, z, 1.6) }); });
  def('Nova de Gelo', c => { V.spikes(c.P.x, c.P.z, C.ice, 14, 4.2, 'ice'); V.shockwave(c.P.x, c.P.z, C.ice, 4.5); });
  def('Corrente de Raios|Descarga', c => { const L = foes(10).slice(0, 4); const pts = [{ x: c.P.x, z: c.P.z }, ...L.map(e => ({ x: e.x, z: e.z }))]; if (pts.length < 2) pts.push(c.at(8)); for (let i = 0; i < pts.length - 1; i++) setTimeout(() => { V.zap(pts[i].x, pts[i].z, pts[i + 1].x, pts[i + 1].z, c.col === 0xffffff ? C.bolt : c.col, .4, 1.8); star(pts[i + 1].x, pts[i + 1].z, C.bolt, 1); }, i * 90); });
  /* Arqueiro */
  def('Chuva de Flechas', c => { ground(c.tx, c.tz, C.arch, 3.8, 1.8); rainArrows(c.tx, c.tz, 3.6, 22, C.arch); });
  def('Salto Evasivo', c => { V.dashTrail(C.arch); V.wind(c.P.x, c.P.z, c.ang + Math.PI, C.arch, 3); });
  def('Flecha Perfurante', c => { thrust(c.P.x, c.P.z, c.ang, 14, C.arch, .2); if (!c.real) fly('sarrow', { ang: c.ang, dist: 15, speed: 48, sc: 2.2, col: C.arch }); });
  def('Flecha Estelar', c => { for (const d of [-.3, 0, .3]) { if (c.real) V.streak(c.P.x, c.P.z, c.ang + d, 13, 0xfff0a0); else fly('sarrow', { ang: c.ang + d, dist: 13, speed: 40, sc: 2, col: 0xfff0a0, onHit: (x, z) => star(x, z, 0xfff0a0, 1.3) }); } star(c.at(12).x, c.at(12).z, 0xfff0a0, 1.6); });
  def('Tiro Preciso', c => { const e = c.t(16), d = e ? Math.hypot(e.x - c.P.x, e.z - c.P.z) : 14; if (e) glyph(e.x, e.z, 0xff4a4a, 1, 'sigil', .6, 1.4); fly('sarrow', { ang: c.ang, dist: d, speed: 60, sc: 2, col: 0xffffff, delay: 120, onHit: (x, z) => star(x, z, 0xffffff, 1.8) }); });
  def('Flecha Enredante', c => { fly('sarrow', { ang: c.ang, dist: 10, speed: 36, sc: 1.9, col: 0x8de06a, onHit: (x, z) => { cage(x, z, 0x6ac04a, 1.3); V.poison(x, z, 0x6ac04a, 1.2); } }); });
  def('Armadilha', c => { glyph(c.tx, c.tz, 0xffb84a, 1.3, 'sigil', 2.2); V.spikes(c.tx, c.tz, 0x8a7a60, 6, 1.2, 'rock'); });
  def('Disparo Rápido', c => { for (let i = 0; i < 3; i++) fly('sarrow', { ang: c.ang + R(-.05, .05), dist: 12, speed: 44, sc: 1.8, col: C.arch, delay: i * 80, onHit: (x, z) => star(x, z, C.arch, .7) }); });
  def('Leque de Flechas', c => { for (const d of [-.5, -.25, 0, .25, .5]) fly('sarrow', { ang: c.ang + d, dist: 11, speed: 40, sc: 1.8, col: C.arch }); });
  def('Olho de Caçador', c => { glyph(c.P.x, c.P.z, 0xffd070, 6, 'sigil', 1.4); V.aura(0xffd070); });
  /* Paladino */
  def('Luz Curativa', c => { V.pillar(c.P.x, c.P.z, C.pal, 1.2); V.heal(c.P.x, c.P.z, 0xfff2b0); });
  def('Julgamento', c => { V.pillar(c.tx, c.tz, C.pal, 2.4); glyph(c.tx, c.tz, C.pal, 3, 'sigil', 1.4); setTimeout(() => V.shockwave(c.tx, c.tz, C.pal, 5), 250); });
  def('Bênção', c => { V.aura(C.pal); wisps(c.P.x, c.P.z, C.pal, 12, 3.2); });
  def('Purificação|Círculo de Amparo|Muda de Pele', c => { glyph(c.P.x, c.P.z, c.col, 2.4, 'sigil', 1.2); V.heal(c.P.x, c.P.z, 0xffffff); wisps(c.P.x, c.P.z, 0xffffff, 8, 2.4); });
  def('Égide Sagrada', c => { V.dome(c.P.x, c.P.z, C.pal, 2.4, true); glyph(c.P.x, c.P.z, C.pal, 2.4, 'sigil', 2); });
  def('Sol Nascente', c => { ground(c.tx, c.tz, C.pal, 4, 2.4); V.pillar(c.tx, c.tz, 0xffd070, 3.4); wisps(c.tx, c.tz, C.pal, 16, 4); });
  def('Passo da Luz', c => { V.pillar(c.P.x, c.P.z, C.pal, .8); V.dashTrail(C.pal); setTimeout(() => V.pillar(player.x, player.z, C.pal, .8), 160); });
  def('Correntes Sagradas', c => { const L = foes(9).slice(0, 4); chain([{ x: c.P.x, z: c.P.z }, ...(L.length ? L : [c.at(7)])], C.pal); L.forEach(e => glyph(e.x, e.z, C.pal, .9, 'sigil', 1.4)); });
  def('Censura', c => { const e = c.t(); if (e) { V.pillar(e.x, e.z, 0xffe070, .9); mark(e, 0xffe070); } else V.pillar(c.tx, c.tz, 0xffe070, .9); });
  def('Lança Solar', c => { thrust(c.P.x, c.P.z, c.ang, 11, 0xffd070, .55); fly('tspear', { ang: c.ang, dist: 10, speed: 40, sc: 1.2, col: 0xffd070, onHit: (x, z) => V.pillar(x, z, 0xffd070, 1) }); });
  /* Invocador */
  def('Lobo Espiritual|Sentinela', c => { const p = c.at(2); glyph(p.x, p.z, C.inv, 1.6, 'sigil', 1.4); wisps(p.x, p.z, C.inv, 14, 2); });
  def('Matilha Espiritual', c => { for (let i = 0; i < 3; i++) { const a = c.ang + (i - 1) * .9, x = c.P.x + Math.sin(a) * 2.5, z = c.P.z + Math.cos(a) * 2.5; glyph(x, z, C.inv, 1.1, 'sigil', 1.4); wisps(x, z, C.inv, 8, 2); } });
  def('Elo Arcano|Ordem Fúnebre|Sinal', c => { const A = /* v331: só aliados por perto (o raio ia até um aliado do outro lado do mapa) */(typeof allies !== 'undefined' ? allies : []).filter(a => a && !a.dead && Math.hypot(a.x - c.P.x, a.z - c.P.z) < 16).slice(0, 4); if (A.length) A.forEach(a => beam(c.P.x, c.P.z, a.x, a.z, c.col, .12, .6)); else shout(c.P.x, c.P.z, c.ang, c.col, 2, 1.4); V.aura(c.col); });
  def('Pacto|Pacto dos Mortos|Alívio Compartilhado|Regenerar', c => { V.heal(c.P.x, c.P.z, c.col); wisps(c.P.x, c.P.z, c.col, 10, 2.6); });
  def('Recolher|Reunir', c => { V.vortex(c.P.x, c.P.z, c.col, 3); wisps(c.P.x, c.P.z, c.col, 10, 1.6); });
  def('Frenesi|Pacto Sombrio', c => { V.aura(c.col); shout(c.P.x, c.P.z, c.ang, c.col, 2, TAU); });
  def('Abrigo', c => { V.dome(c.P.x, c.P.z, C.inv, 3, true); });
  def('Uivo Espiritual', c => { shout(c.P.x, c.P.z, c.ang, C.inv, 4, 1.4); wisps(c.P.x + Math.sin(c.ang) * 2, c.P.z + Math.cos(c.ang) * 2, C.inv, 8, 2); });
  def('Instinto de Matilha', c => { V.aura(C.inv); glyph(c.P.x, c.P.z, C.inv, 2.2, 'sigil', 1.6); });
  /* Necromante */
  def('Soldado Esquelético', c => { const p = c.at(2); bones(p.x, p.z, 6, 1); wisps(p.x, p.z, C.necro, 10, 2); });
  def('Praga', c => { V.poison(c.tx, c.tz, 0x6ac04a, 3.2); wisps(c.tx, c.tz, 0x6ac04a, 12, 2.4); });
  def('Erguer Eco', c => { const p = c.at(3); glyph(p.x, p.z, C.necro, 1.8, 'seal5', 1.6); wisps(p.x, p.z, C.necro, 16, 3); });
  def('Domínio dos Ecos', c => { ground(c.tx, c.tz, C.necro, 4.5, 2.4); bones(c.tx, c.tz, 10, 3.4); });
  def('Mortalha', c => { V.dome(c.P.x, c.P.z, 0x3a1a5a, 2.3, true); wisps(c.P.x, c.P.z, C.necro, 10, 2.4); });
  def('Jaula de Ossos', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; bones(x, z, 9, 1.3); });
  def('Maldição da Fraqueza|Fome Silenciosa|Enfraquecer|Desarmar', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; glyph(x, z, c.col, 1.3, 'seal5', 1.6); wisps(x, z, c.col, 8, 2.2); });
  /* Mago de Fogo */
  def('Chuva de Meteoros', c => { ground(c.tx, c.tz, C.fire, 4, 2.4); for (let i = 0; i < 8; i++) V.meteor(c.tx + R(-3.5, 3.5), c.tz + R(-3.5, 3.5), i * 200); });
  def('Explosão Ígnea', c => { blast(c.tx, c.tz, 3); });
  def('Sol Negro', c => { orb(c.tx, c.tz, 0xff3a00, 2.6, true, true, 1.6); V.flames(c.tx, c.tz, { n: 8, r: 2.6, h: 1.4, dur: 1.5 }); setTimeout(() => { blast(c.tx, c.tz, 3.6); V.shockwave(c.tx, c.tz, 0xff3a00, 5.5); }, 1100); });
  def('Combustão', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; V.flames(x, z, { n: 6, r: .6, h: 2.6, dur: 1.4 }); });
  def('Jato de Chamas', c => { for (let i = 0; i < 7; i++) setTimeout(() => { const d = 1.2 + i * 1.1; V.flames(player.x + Math.sin(c.ang) * d, player.z + Math.cos(c.ang) * d, { n: 3, r: .35 + i * .06, h: 1.2 + i * .22, dur: .7 }); }, i * 45); });
  def('Passo de Cinzas', c => { V.flames(c.P.x, c.P.z, { n: 5, r: .7, h: 1.8, dur: 1 }); V.dashTrail(C.fire); setTimeout(() => V.flames(player.x, player.z, { n: 5, r: .7, h: 1.8, dur: 1 }), 160); });
  def('Muralha de Fogo', c => { const a = c.ang + Math.PI / 2; for (let i = -4; i <= 4; i++) V.flames(c.tx + Math.sin(a) * i * .85, c.tz + Math.cos(a) * i * .85, { n: 3, r: .3, h: 2.6, dur: 2.6 }); });
  def('Brasa Latente', c => { ground(c.tx, c.tz, C.fire, 2, 2.2); V.flames(c.tx, c.tz, { n: 3, r: .5, h: .6, dur: 1.2 }); setTimeout(() => blast(c.tx, c.tz, 2.2), 1100); });
  def('Manto de Cinzas', c => { V.dome(c.P.x, c.P.z, C.fire, 2.2, true); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; V.flames(c.P.x + Math.cos(a) * 2.2, c.P.z + Math.sin(a) * 2.2, { n: 2, r: .2, h: 1.3, dur: 1.4 }); } });
  /* Mago de Gelo */
  def('Lança de Gelo', c => { V.spikeLine(c.P.x, c.P.z, c.ang, 9, C.ice, 'ice'); fly('ice', { ang: c.ang, dist: 9, speed: 30, sc: 2.4, col: C.ice, cls: 9, onHit: (x, z) => { V.spikes(x, z, C.ice, 8, 1.4, 'ice'); star(x, z, C.ice, 1.4); } }); });
  def('Maremoto', c => { wave(c.P.x, c.P.z, c.ang, 0x3aa8ff, 8, 6); V.wind(c.P.x, c.P.z, c.ang, 0xbfe8ff, 8); });
  def('Era do Gelo', c => { ground(c.tx, c.tz, C.ice, 4.5, 2.6); for (let i = 0; i < 4; i++) setTimeout(() => V.spikes(c.tx + R(-2, 2), c.tz + R(-2, 2), C.ice, 8, 2.4, 'ice'), i * 300); });
  def('Prisão Glacial', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; V.spikes(x, z, C.ice, 10, 1.2, 'ice'); cage(x, z, C.ice, 1.2); });
  def('Armadura de Gelo', c => { V.dome(c.P.x, c.P.z, C.ice, 2.2, true); V.spikes(c.P.x, c.P.z, C.ice, 6, 1.6, 'ice'); });
  def('Estilhaço', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; V.spikes(x, z, C.ice, 8, 1.6, 'ice'); star(x, z, C.ice, 1.4); });
  def('Deslizar', c => { V.dashTrail(C.ice); V.spikeLine(c.P.x, c.P.z, c.ang, 5, C.ice, 'ice'); });
  def('Fratura Glacial', c => { V.fissure(c.P.x, c.P.z, c.ang, 7, 0x8ad8ff); V.spikeLine(c.P.x, c.P.z, c.ang, 7, C.ice, 'ice'); });
  def('Névoa Fria', c => { V.smoke(c.P.x, c.P.z, 0xd8f0ff, 3.4); });
  /* Mago da Terra */
  /* v331: as estacas sumiam no chão de pedra; ganharam rachadura acesa */
  def('Estaca de Pedra', c => { V.fissure(c.P.x, c.P.z, c.ang, 9, 0xe0a050); V.spikeLine(c.P.x, c.P.z, c.ang, 9, 0xa08a66, 'rock'); });
  def('Tremor Sísmico', c => { V.quakeRing(c.tx, c.tz, 5.5, C.earth); });
  def('Pele de Pedra', c => { V.dome(c.P.x, c.P.z, 0xa08a60, 2.2, true); V.spikes(c.P.x, c.P.z, 0x8a7a60, 6, 1.6, 'rock'); });
  def('Colosso de Pedra', c => { const p = c.at(2.5); V.spikes(p.x, p.z, 0x8a7a60, 12, 1.6, 'rock'); V.quakeRing(p.x, p.z, 2.5); });
  def('Muralha de Rocha', c => { const a = c.ang + Math.PI / 2, sx = Math.sin(a), sz = Math.cos(a); beam(c.tx - sx * 3.6, c.tz - sz * 3.6, c.tx + sx * 3.6, c.tz + sz * 3.6, C.earth, .25, 1.2, .15); for (let i = -3; i <= 3; i++) V.spikes(c.tx + sx * i * 1.1, c.tz + sz * i * 1.1, 0xa08a66, 3, .5, 'rock'); });
  def('Areia Movediça', c => { ground(c.tx, c.tz, 0xd8b870, 3.5, 2.6); V.vortex(c.tx, c.tz, 0xd8b870, 3.2); });
  def('Arremesso de Rocha', c => { fly('orb', { ang: c.ang, dist: 8, speed: 20, sc: 2.6, col: 0xc8a060, cls: 10, spin: .25, onHit: (x, z) => { V.dust(x, z, 0x9a8a70, 12); V.spikes(x, z, 0xa08a66, 5, 1.2, 'rock'); V.shockwave(x, z, C.earth, 2); } }); });
  def('Erupção', c => { V.fissure(c.P.x, c.P.z, c.ang, 7, 0xff7a2a); for (let i = 1; i <= 4; i++) setTimeout(() => V.flames(player.x + Math.sin(c.ang) * i * 1.6, player.z + Math.cos(c.ang) * i * 1.6, { n: 4, r: .5, h: 2.4, dur: .9 }), i * 90); });
  def('Pedra Suspensa', c => { ground(c.tx, c.tz, C.earth, 3.4, 1.8); for (let i = 0; i < 5; i++) V.meteor(c.tx + R(-3, 3), c.tz + R(-3, 3), i * 250, 0x8a7a60, true); });
  def('Casca de Cristal', c => { V.dome(c.P.x, c.P.z, 0xbfa0ff, 2.3, true); V.spikes(c.P.x, c.P.z, 0xbfa0ff, 8, 1.8, 'ice'); });
  /* Mago do Raio e Condutor */
  def('Rajada de Vento', c => { V.wind(c.P.x, c.P.z, c.ang, 0xd8f4ff, 8); shout(c.P.x, c.P.z, c.ang, 0xd8f4ff, 3, 1.2); });
  def('Tempestade de Raios', c => { ground(c.tx, c.tz, C.bolt, 4, 2.4); V.storm(c.tx, c.tz, 4, C.bolt, 9); });
  def('Fúria dos Céus', c => { V.storm(c.tx, c.tz, 5, 0xffffff, 12); V.pillar(c.tx, c.tz, C.bolt, 1.2); });
  def('Paralisia', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; V.bolt(x, z, C.bolt); cage(x, z, C.bolt, 1); });
  def('Passo Relâmpago|Correnteza Elétrica', c => { V.bolt(c.P.x, c.P.z, C.bolt); V.dashTrail(C.bolt); setTimeout(() => V.bolt(player.x, player.z, C.bolt), 160); });
  def('Aceleração|Corpo de Tempestade', c => { V.aura(c.col); afterimages(c.col, 3); V.storm(c.P.x, c.P.z, 1.4, c.col, 2); });
  def('Campo Estático', c => { ground(c.tx, c.tz, C.bolt, 3.6, 2.6); V.storm(c.tx, c.tz, 3, C.bolt, 4); });
  def('Agulha Elétrica|Arco Voltaico', c => { const e = c.t(12), p = e || c.at(10); V.zap(c.P.x, c.P.z, p.x, p.z, C.bolt, .3, 1); fly('orb', { ang: Math.atan2(p.x - c.P.x, p.z - c.P.z), dist: Math.hypot(p.x - c.P.x, p.z - c.P.z), speed: 60, sc: 1.6, col: C.bolt, cls: c.sk.sourceClass === 18 ? 18 : 11, onHit: (x, z) => star(x, z, C.bolt, 1.4) }); });
  /* v337: o clarão durava tão pouco que quase não se via */
  def('Clarão', c => { orb(c.P.x, c.P.z, 0xfff6b0, 3, false, false, .7); star(c.P.x, c.P.z, 0xffffff, 3, 1.4); V.shockwave(c.P.x, c.P.z, C.bolt, 5); V.zap(c.P.x - 3, c.P.z, c.P.x + 3, c.P.z, C.bolt, .5, 2); });
  def('Campo de Repulsão|Repulsão', c => { V.shockwave(c.P.x, c.P.z, c.col, 5); V.dome(c.P.x, c.P.z, c.col, 2, false); });
  def('Pulso Estático', c => { V.shockwave(c.P.x, c.P.z, C.storm, 4); V.storm(c.P.x, c.P.z, 3, C.storm, 4); });
  def('Barreira Elétrica', c => { V.dome(c.P.x, c.P.z, C.storm, 2.4, true); V.storm(c.P.x, c.P.z, 2, C.storm, 3); });
  def('Trovoada', c => { V.storm(c.tx, c.tz, 4, C.storm, 8); V.shockwave(c.tx, c.tz, C.storm, 4); });
  def('Raio Retardado', c => { ground(c.tx, c.tz, C.storm, 2, 1.6); setTimeout(() => { V.bolt(c.tx, c.tz, 0xdff0ff); V.pillar(c.tx, c.tz, C.storm, 1); }, 1200); });
  def('Olho da Tempestade', c => { V.vortex(c.P.x, c.P.z, C.storm, 3.4); V.dome(c.P.x, c.P.z, C.storm, 2.6, true); });
  /* Mago do Tempo */
  def('Âncora Temporal', c => { glyph(c.P.x, c.P.z, C.time, 2, 'clock', 2.4); });
  def('Dilatação|Segundo Perdido', c => { glyph(c.tx, c.tz, C.time, 3.2, 'clock', 2.6); ground(c.tx, c.tz, C.time, 3.2, 2.6); });
  def('Reprise', c => { glyph(c.P.x, c.P.z, C.time, 1.6, 'clock', 1.2); afterimages(C.time, 4); });
  def('Recompor', c => { glyph(c.P.x, c.P.z, C.time, 1.8, 'clock', 1.6); V.heal(c.P.x, c.P.z, C.time); });
  def('Acelerar', c => { glyph(c.P.x, c.P.z, C.time, 1.4, 'clock', 1); V.aura(C.time); afterimages(C.time, 3); });
  def('Suspender', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; glyph(x, z, C.time, 1.2, 'clock', 1.8, 1.4); cage(x, z, C.time, 1); });
  def('Salto Temporal', c => { glyph(c.P.x, c.P.z, C.time, 1.4, 'clock', .8); V.dashTrail(C.time); setTimeout(() => glyph(player.x, player.z, C.time, 1.4, 'clock', .8), 160); });
  def('Pulso Temporal', c => { glyph(c.tx, c.tz, C.time, 3, 'clock', 1.2); V.shockwave(c.tx, c.tz, C.time, 4.5); });
  def('Impacto Adiado', c => { glyph(c.tx, c.tz, C.time, 2.4, 'clock', 1.8); setTimeout(() => { V.shockwave(c.tx, c.tz, 0xffffff, 4.5); star(c.tx, c.tz, C.time, 2); }, 1400); });
  /* Tecelão de Fendas */
  def('Passagem Vinculada|Ascensão de Fenda', c => { rift(c.P.x, c.P.z, c.ang, C.rift); rift(c.tx, c.tz, c.ang, C.rift); });
  def('Corte Espacial', c => { rift(c.at(4).x, c.at(4).z, c.ang + Math.PI / 2, C.rift, 2.2, .7); V.slash(c.P.x, c.P.z, c.ang, C.rift, 4.5, 1.8); });
  def('Convergência|Sucção', c => { V.vortex(c.tx, c.tz, c.col, 4.5); orb(c.tx, c.tz, c.col, 1.6, true, c.col === C.void); });
  def('Ruptura', c => { rift(c.tx, c.tz, R(0, TAU), C.rift, 3.4, .9); V.shockwave(c.tx, c.tz, C.rift, 4.5); });
  def('Dobra|Passo Vazio', c => { rift(c.P.x, c.P.z, c.ang, c.col, 2.4, .5); V.dashTrail(c.col); setTimeout(() => rift(player.x, player.z, c.ang, c.col, 2.4, .5), 160); });
  def('Fronteira', c => { const a = c.ang + Math.PI / 2; for (let i = -2; i <= 2; i++) rift(c.tx + Math.sin(a) * i * 1.3, c.tz + Math.cos(a) * i * 1.3, c.ang, C.rift, 2.6, 2); });
  def('Exílio Breve', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; rift(x, z, c.ang, C.rift, 3, .9); orb(x, z, C.rift, 1.2, true); });
  def('Agulha de Fenda', c => { thrust(c.P.x, c.P.z, c.ang, 10, C.rift, .25); rift(c.at(10).x, c.at(10).z, c.ang, C.rift, 1.6, .5); });
  def('Colapso Local', c => { orb(c.tx, c.tz, C.rift, 2.6, true, true, 1.2); setTimeout(() => V.shockwave(c.tx, c.tz, C.rift, 5), 900); });
  /* Guardião dos Vínculos */
  def('Elo Protetor', c => { const A = (typeof allies !== 'undefined' ? allies : []).filter(a => a && !a.dead && Math.hypot(a.x - c.P.x, a.z - c.P.z) < 16).slice(0, 3); if (A.length) chain([{ x: c.P.x, z: c.P.z }, A[0]], C.bond); V.aura(C.bond); glyph(c.P.x, c.P.z, C.bond, 1.6, 'sigil', 1.2); });
  def('Interposição', c => { V.dashTrail(C.bond); setTimeout(() => V.dome(player.x, player.z, C.bond, 2, true), 160); });
  def('Juramento', c => { V.pillar(c.P.x, c.P.z, C.bond, 1); glyph(c.P.x, c.P.z, C.bond, 2, 'seal5', 1.6); });
  def('Âncora Protetora', c => { totem(c.tx, c.tz, C.bond, 2); ground(c.tx, c.tz, C.bond, 3, 2); });
  def('Escudo do Vínculo', c => { V.dome(c.P.x, c.P.z, C.bond, 2.3, true); });
  /* Metamorfo */
  def('Forma Feral', c => { V.aura(0xffa24a); shout(c.P.x, c.P.z, c.ang, 0xffa24a, 2, TAU); wisps(c.P.x, c.P.z, 0xffa24a, 10, 2); });
  def('Forma Alada', c => { V.wind(c.P.x, c.P.z, c.ang, 0xd8f4ff, 4); wisps(c.P.x, c.P.z, 0xffffff, 14, 3); });
  def('Forma Blindada', c => { V.dome(c.P.x, c.P.z, 0x8a7a60, 2, true); V.spikes(c.P.x, c.P.z, 0x8a7a60, 6, 1.6, 'rock'); });
  def('Forma Ágil', c => { afterimages(0x8affc2, 4); V.aura(0x8affc2); });
  def('Salto Bestial', c => { V.dashTrail(C.beast); setTimeout(() => { V.quakeRing(player.x, player.z, 2.6); V.slash(player.x, player.z, c.ang, C.beast, 2.4, 2); }, 170); });
  def('Rugido', c => { shout(c.P.x, c.P.z, c.ang, C.beast, 4, 2); V.wind(c.P.x, c.P.z, c.ang, C.beast, 5); });
  def('Adaptação', c => { V.dome(c.P.x, c.P.z, C.beast, 2, true); V.aura(C.beast); });
  def('Garras em Arco', c => { for (let i = 0; i < 3; i++) setTimeout(() => V.slash(player.x, player.z, c.ang + (i - 1) * .25, C.beast, 3, 1.4), i * 60); });
  /* Artífice Rúnico */
  def('Sentinela Rúnica|Emissor', c => totem(c.tx, c.tz, C.rune, 2.2));
  def('Armadilha Rúnica', c => { glyph(c.tx, c.tz, C.rune, 1.4, 'sigil', 2.4); });
  def('Reparar', c => { V.heal(c.P.x, c.P.z, C.rune); glyph(c.P.x, c.P.z, C.rune, 1.6, 'sigil', 1.2); });
  def('Desmontar', c => { V.dust(c.tx, c.tz, 0x9aa0b0, 12); glyph(c.tx, c.tz, C.rune, 1.4, 'sigil', .8); });
  def('Sobrecarga', c => { orb(c.tx, c.tz, C.rune, 2.2); V.storm(c.tx, c.tz, 2.4, C.rune, 4); ground(c.tx, c.tz, C.rune, 2.6, 1.2); });
  def('Projetar', c => { ground(c.P.x, c.P.z, C.rune, 1.2, .8); ground(c.tx, c.tz, C.rune, 1.2, 1); V.zap(c.P.x, c.P.z, c.tx, c.tz, C.rune, .45, 1, .5); });
  def('Pulso Rúnico', c => { glyph(c.tx, c.tz, C.rune, 3, 'sigil', .9); V.shockwave(c.tx, c.tz, C.rune, 4.5); });
  def('Lança Rúnica', c => { thrust(c.P.x, c.P.z, c.ang, 10, C.rune, .3); fly('orb', { ang: c.ang, dist: 10, speed: 38, sc: 2, col: C.rune, cls: 16, onHit: (x, z) => glyph(x, z, C.rune, 1.2, 'sigil', .8) }); });
  def('Placas de Emergência', c => { V.dome(c.P.x, c.P.z, C.rune, 2.2, true); glyph(c.P.x, c.P.z, C.rune, 2.2, 'sigil', 1.6); });
  /* Duelista Espectral */
  /* v331: quase não aparecia; ganhou vento do deslocamento */
  def('Passo de Flanco|Recuar', c => { afterimages(C.spec, 4); V.dashTrail(C.spec); V.wind(c.P.x, c.P.z, c.ang + Math.PI, C.spec, 3); });
  def('Resposta Fantasma', c => { star(c.P.x + Math.sin(c.ang), c.P.z + Math.cos(c.ang), C.spec, 1.6); afterimages(C.spec, 2); setTimeout(() => V.slash(player.x, player.z, c.ang, C.spec, 2.6, 1.6), 120); });
  def('Estocada', c => { thrust(c.P.x, c.P.z, c.ang, 4.5, C.spec, .3); afterimages(C.spec, 2); });
  def('Corte Espectral', c => { V.slash(c.P.x, c.P.z, c.ang, C.spec, 5, 1.2); thrust(c.P.x, c.P.z, c.ang, 7, C.spec, .3); });
  def('Desafio Espectral', c => { shout(c.P.x, c.P.z, c.ang, C.spec, 3, TAU); glyph(c.P.x, c.P.z, C.spec, 2.4, 'sigil', 1.2); });
  def('Meia-Lua Espectral', c => { V.whirl(C.spec, 3.2); afterimages(C.spec, 2); });
  /* Oráculo */
  def('Presságio|Vislumbre|Revelação', c => { glyph(c.P.x, c.P.z, C.orac, 3.6, 'sigil', 1.8); wisps(c.P.x, c.P.z, C.orac, 10, 3); });
  def('Selo Preventivo', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; glyph(x, z, C.orac, 1.4, 'seal5', 2, 1.4); });
  def('Desvio do Destino', c => { afterimages(C.orac, 3); glyph(c.P.x, c.P.z, C.orac, 1.4, 'sigil', .8); V.dashTrail(C.orac); });
  def('Ruína Anunciada', c => { glyph(c.tx, c.tz, C.orac, 3, 'seal5', 1.8); setTimeout(() => { V.pillar(c.tx, c.tz, C.orac, 2); V.shockwave(c.tx, c.tz, C.orac, 4.5); }, 1300); });
  def('Instante Fatal', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; glyph(x, z, 0xff4a4a, 1, 'sigil', .5, 1.4); setTimeout(() => { thrust(player.x, player.z, c.ang, Math.max(2, Math.hypot(x - player.x, z - player.z)), C.orac, .3); star(x, z, 0xffffff, 1.8); }, 200); });
  def('Futuro Resguardado', c => { V.dome(c.P.x, c.P.z, C.orac, 2.3, true); glyph(c.P.x, c.P.z, C.orac, 2.3, 'clock', 1.6); });
  /* Devorador do Vazio */
  def('Boca do Vazio|Consumir', c => { const e = c.t(); const x = e ? e.x : c.tx, z = e ? e.z : c.tz; orb(x, z, C.void, 1.6, true, true, 1); V.vortex(x, z, C.void, 2.4); });
  def('Devolver', c => { fly('orb', { ang: c.ang, dist: 9, speed: 26, sc: 2, col: C.void, cls: 20, onHit: (x, z) => { orb(x, z, C.void, 1.4, false, true, .6); V.shockwave(x, z, C.void, 2.5); } }); });
  def('Carapaça Vazia', c => { V.dome(c.P.x, c.P.z, 0x2a0a4a, 2.3, true); wisps(c.P.x, c.P.z, C.void, 8, 2.2); });
  def('Rasgo', c => { V.slash(c.P.x, c.P.z, c.ang, C.void, 3.4, 2); rift(c.at(2.5).x, c.at(2.5).z, c.ang + Math.PI / 2, C.void, 2, .5); });
  def('Silêncio', c => { orb(c.P.x, c.P.z, C.void, 3.2, false, true, .5); V.shockwave(c.P.x, c.P.z, C.void, 4); });
  def('Estrela Oca', c => { orb(c.tx, c.tz, C.void, 2, true, true, 1.6); for (let i = 0; i < 3; i++) setTimeout(() => V.shockwave(c.tx, c.tz, C.void, 3 + i), 400 + i * 350); });
  /* Monge */
  def('Rajada de Punhos', c => fists(c.ang, C.monk, 9, 5));
  def('Chute Giratório', c => { V.whirl(C.monk, 2.8); V.shockwave(c.P.x, c.P.z, C.monk, 3); });
  def('Postura da Montanha', c => { V.dome(c.P.x, c.P.z, 0xc8a060, 2.2, true); V.quakeRing(c.P.x, c.P.z, 2.4, 0xc8a060); });
  def('Palma dos Ecos', c => { const e = c.t(6); const x = e ? e.x : c.at(2).x, z = e ? e.z : c.at(2).z; fists(c.ang, C.monk, 1, 3); glyph(x, z, C.monk, 1.2, 'palm', 2.2, 1.6); });
  def('Passo em Oito', c => { glyph(c.P.x, c.P.z, C.monk, 2, 'eight', .9); V.dashTrail(C.monk); setTimeout(() => V.slash(player.x, player.z, c.ang, C.monk, 2.4, 1.6), 150); });
  def('Respiração Inversa', c => { wisps(c.P.x, c.P.z, 0x8affc2, 12, 2.2); setTimeout(() => V.aura(0xff5a2a), 300); glyph(c.P.x, c.P.z, C.monk, 1.6, 'sigil', 1.2); });
  def('Quebra de Cadência', c => { const e = c.t(6); const x = e ? e.x : c.at(2).x, z = e ? e.z : c.at(2).z; fists(c.ang, 0xffffff, 2, 3); star(x, z, C.monk, 1.8, 1.3); V.shockwave(x, z, C.monk, 1.8); });
  def('Balança dos Punhos', c => { const L = foes(6).slice(0, 2); fists(c.ang - .5, C.monk, 2, 4); fists(c.ang + .5, C.monk, 2, 4); if (L.length === 2) beam(L[0].x, L[0].z, L[1].x, L[1].z, C.monk, .08, .5); L.forEach(e => star(e.x, e.z, C.monk, 1.2)); });
  def('Selo dos Cinco Pontos', c => { const e = c.t(6); const x = e ? e.x : c.at(2).x, z = e ? e.z : c.at(2).z; glyph(x, z, C.monk, 1.2, 'seal5', 2.4, 1.6); fists(c.ang, C.monk, 1, 3); });
  def('Roda dos Meridianos', c => { const L = foes(6).slice(0, 5); glyph(c.P.x, c.P.z, C.monk, 2.2, 'sigil', 1); (L.length ? L : [c.at(3)]).forEach((e, i) => setTimeout(() => { beam(player.x, player.z, e.x, e.z, C.monk, .1, .25); star(e.x, e.z, C.monk, 1.1); }, i * 110)); });
  /* Lâmina Arcana */
  def('Corte Arcano', c => { V.slash(c.P.x, c.P.z, c.ang, C.arc, 3.2, 2); glyph(c.at(2).x, c.at(2).z, C.arc, 1, 'sigil', .7, 1.2); });
  def('Lâmina Flamejante', c => { V.flames(c.P.x, c.P.z, { n: 6, r: .8, h: 2.2, dur: 1.4 }); V.aura(C.fire); });
  def('Salto Rúnico', c => { glyph(c.P.x, c.P.z, C.arc, 1.2, 'sigil', .8); V.dashTrail(C.arc); setTimeout(() => { V.shockwave(player.x, player.z, C.arc, 3); glyph(player.x, player.z, C.arc, 2, 'sigil', .8); }, 170); });
  def('Inscrição Alternada', c => { const e = c.t(8); if (e) { glyph(e.x, e.z, C.arc, 1, 'sigil', 2.2, 1.6); glyph(e.x, e.z, 0xffb84a, .7, 'sigil', 2.2, 1.65); } V.slash(c.P.x, c.P.z, c.ang, C.arc, 2.4, 1.6); });
  def('Reserva Incandescente', c => { V.aura(C.arc); orb(c.P.x, c.P.z, C.arc, .9, true, false, 1); wisps(c.P.x, c.P.z, C.arc, 10, 1.8); });
  def('Costura Astral', c => { const L = foes(10); const a = L[0], b = L[L.length - 1]; if (a && b && a !== b) { beam(a.x, a.z, b.x, b.z, C.arc, .22, .8); star(a.x, a.z, C.arc, 1.2); star(b.x, b.z, C.arc, 1.2); } else thrust(c.P.x, c.P.z, c.ang, 10, C.arc, .3); });
  def('Dízimo Rúnico', c => { const e = c.t(8); if (e) { glyph(e.x, e.z, 0x6fb8ff, 1, 'sigil', 2, 1.6); beam(e.x, e.z, c.P.x, c.P.z, 0x6fb8ff, .06, .6); } V.aura(0x6fb8ff); });
  def('Corte do Reservatório', c => { orb(c.P.x, c.P.z, C.arc, 1, true, false, .4); setTimeout(() => { V.slash(player.x, player.z, c.ang, C.arc, 3.4, 1.6); thrust(player.x, player.z, c.ang, 5, 0xffffff, .5); }, 200); });
  def('Díade Arcana', c => { const L = foes(10).slice(0, 2); if (L.length === 2) { beam(L[0].x, L[0].z, L[1].x, L[1].z, C.arc, .14, .6); L.forEach(e => glyph(e.x, e.z, C.arc, .9, 'sigil', 1, 1.4)); } else V.slash(c.P.x, c.P.z, c.ang, C.arc, 3, 2); });
  def('Órbita Reversa', c => { glyph(c.P.x, c.P.z, C.arc, 8, 'sigil', .9); glyph(c.P.x, c.P.z, C.arc, 3, 'sigil', .9); V.shockwave(c.P.x, c.P.z, C.arc, 8); });
  /* Lanceiro */
  def('Estocada Longa', c => jab(c.P.x, c.P.z, c.ang, 6.5, C.lance, .4));
  def('Varredura de Lança', c => { V.whirl(C.lance, 4); V.slash(c.P.x, c.P.z, c.ang, 0xffffff, 4.2, TAU * .9); });
  def('Salto do Dragão', c => { V.dashTrail(0xffb84a); setTimeout(() => { V.pillar(player.x, player.z, 0xffb84a, .9); V.quakeRing(player.x, player.z, 3, 0xffb84a); }, 180); });
  /* v331: só a faixa de 4 a 8 m, como na descrição */
  def('Ponta Absoluta', c => { const p = c.at(4); jab(p.x, p.z, c.ang, 4, C.lance, .6); ground(c.at(6).x, c.at(6).z, C.lance, .9, .6); star(c.at(8).x, c.at(8).z, C.lance, 2.2); });
  def('Recuo de Caça', c => { V.wind(c.P.x, c.P.z, c.ang + Math.PI, C.lance, 3); afterimages(C.lance, 3); jab(c.P.x, c.P.z, c.ang, 4, C.lance, .3); });
  /* v331: X de dois cortes diagonais à frente (antes era um +) */
  def('Cruz de Hastes', c => { const p = c.at(3.5); [Math.PI / 4, -Math.PI / 4].forEach((d, i) => setTimeout(() => { const a = c.ang + d; jab(p.x - Math.sin(a) * 3, p.z - Math.cos(a) * 3, a, 6, C.lance, .35); }, i * 120)); setTimeout(() => star(p.x, p.z, 0xffffff, 1.6), 140); });
  def('Cravo de Muralha', c => { jab(c.P.x, c.P.z, c.ang, 5, C.lance, .4); V.spikeLine(c.at(4).x, c.at(4).z, c.ang, 3, 0xa08a66, 'rock'); });
  def('Fio da Fileira', c => { jab(c.P.x, c.P.z, c.ang, 10, C.lance, .3); foes(10).filter(e => Math.abs(Math.atan2(e.x - c.P.x, e.z - c.P.z) - c.ang) < .25).forEach(e => star(e.x, e.z, C.lance, 1)); });
  /* v331: só os flancos esquerdo e direito, de 2 a 6 m (frente e trás ficam de fora) */
  def('Bússola Partida', c => { [1, -1].forEach((sd, i) => setTimeout(() => { for (const d of [-.3, 0, .3]) { const a = c.ang + sd * Math.PI / 2 + d; jab(player.x + Math.sin(a) * 2, player.z + Math.cos(a) * 2, a, 4, C.lance, .3); } }, i * 90)); });
  def('Medida do Caçador', c => { const e = c.t(12); if (e) { glyph(e.x, e.z, C.lance, 1.2, 'sigil', 1.6, 1.4); beam(c.P.x, c.P.z, e.x, e.z, C.lance, .04, 1, .2); } });
  /* Berserker */
  def('Golpe Brutal', c => { const p = c.at(2); V.slash(c.P.x, c.P.z, c.ang, C.blood, 3, 2); V.fissure(p.x, p.z, c.ang, 3, 0xff3a2a); blood(p.x, p.z, 10); });
  def('Redemoinho de Aço', c => { V.whirl(0xd8d8e8, 3.6); setTimeout(() => V.whirl(C.blood, 3.2), 150); });
  def('Sede de Sangue', c => { V.aura(C.blood); blood(c.P.x, c.P.z, 10); });
  def('Dízimo de Sangue|Penhor Carmesim', c => { blood(c.P.x, c.P.z, 14); glyph(c.P.x, c.P.z, C.blood, 1.6, 'seal5', 1.4); V.aura(C.blood); });
  def('Juramento da Cicatriz', c => { V.slash(c.P.x, c.P.z, c.ang + Math.PI / 2, C.blood, 1.6, 1.2); V.pillar(c.P.x, c.P.z, C.blood, .8); });
  def('Partilha Brutal|Corrente de Sacrifícios', c => { const L = foes(8).slice(0, 4); if (L.length) chain([{ x: c.P.x, z: c.P.z }, ...L], C.blood, 1); L.forEach(e => blood(e.x, e.z, 6)); });
  def('Desafio do Maior', c => { const L = foes(12).sort((a, b) => (b.maxhp || 0) - (a.maxhp || 0)); const e = L[0]; shout(c.P.x, c.P.z, c.ang, C.blood, 3, 1.4); if (e) mark(e, C.blood, 'seal5'); });
  def('Estilhaço da Égide', c => { V.dome(c.P.x, c.P.z, C.blood, 2.2, false); setTimeout(() => { V.spikes(player.x, player.z, C.blood, 10, 3, 'ice'); V.shockwave(player.x, player.z, C.blood, 4); }, 250); });

  /* ---------- liga ao lançamento ---------- */
  const old = V.play;
  V.play = function (sk) {
    const fn = sk && X[sk.n];
    if (!fn || !player) return old(sk);
    const P = player, ang = P.face || 0;
    let tx = P.x + Math.sin(ang) * 6, tz = P.z + Math.cos(ang) * 6;
    try { const t = sk.t === 'kit111' ? sk.effect : (sk.effect || sk.t); if (/area|pulses|rain|slowzone|healzone|trap|device|barrier|gate|passage|relocate|anchorward/.test(t)) { const g = skillGroundPoint(); if (g) { tx = g.x; tz = g.z; } } } catch (_) {}
    const c = { P, ang, tx, tz, sk, real: sk.t === 'bolt', col: sk.col || 0xffffff, at: d => ({ x: P.x + Math.sin(ang) * d, z: P.z + Math.cos(ang) * d }), t: (r = 9) => front(r) };
    try { fn(c); } catch (e) { console.warn('vfx328', sk.n, e); try { old(sk); } catch (_) {} }
  };
  window.VFX328 = { X, fly, rainArrows, jab, wave, blast, fists, thrust, star, beam, chain, rift, orb, blood, wisps, bones, totem, glyph, shout, cage, afterimages, ground };
})();
