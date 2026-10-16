/* v445 (Ian): limpar o terreno para construir — cactos, arbustos, pedras, pedregulhos e tocos do cenário.
   O cenário pequeno (modelos do jogo: cactus_*, plant_bush*, rock_*, stone_*, stump_*, log*) é juntado num lote por pedaço
   do mapa (EnvBatch); aqui cada lote guarda a lista do que tem (userData.items445) e, ao remover, os vértices daquele
   objeto colapsam no ponto de apoio (some sem refazer o lote). Pedras grandes do cenário Tripo (rochedo, pedras, rocha
   com musgo) são instâncias: zera a instância, como as árvores derrubadas. Árvore derrubada deixa um toco (stump do jogo).
   Tudo o que foi removido fica em run.clear445 e é reaplicado quando o pedaço do mapa volta. */
(function () {
  'use strict';
  const T = THREE;
  const U = () => window.Surv437;
  const ready = () => U() && U().ready() && U().world();
  const S = () => (run.clear445 = run.clear445 || []);
  const KIND = k => !k ? null : /cactus/.test(k) ? 'cacto' : /bush/.test(k) ? 'arbusto' : /stump|^log$|log_large/.test(k) ? 'toco' : /^(rock|stone)|rock137/.test(k) ? (/large|tall/.test(k) ? 'rocha' : 'pedra') : null;
  const INFO = {
    cacto: { n: 'CORTAR CACTO PELA RAIZ', hits: 2, tools: ['machado', 'pa', 'picareta', null] },
    arbusto: { n: 'ARRANCAR ARBUSTO', hits: 1, tools: [null] },
    pedra: { n: 'QUEBRAR PEDRA', hits: 2, tools: [null] },
    rocha: { n: 'QUEBRAR PEDREGULHO', hits: 5, tools: ['picareta'] },
    toco: { n: 'ARRANCAR TOCO', hits: 3, tools: ['machado', 'picareta', 'pa'] }
  };
  const TN = { machado: 'Machado', pa: 'Pá de Terraplenagem', picareta: 'Picareta' };
  function addItems() {
    if (!U()) { setTimeout(addItems, 300); return; }
    U().IT.espinhos = U().IT.espinhos || { n: 'Espinhos', kg: .2, d: 'Do cacto. Vão na Armadilha de espinhos.' };
    if (U().IT.fibra_espinhosa) U().IT.fibra_espinhosa.n = 'Fibra Árida';
    const B = window.Build437 && Build437.B; if (!B) { setTimeout(addItems, 300); return; }
    if (B.espinho) B.espinho.st = [{ n: 'Estacas e espinhos', need: { lenha: 2, espinhos: 3, fibra: 2 } }]; // v445: espinhos do cacto
  }
  addItems();

  /* ---------- registro dos lotes ---------- */
  const REG = new Set(), REV = new Map();
  function rev(m) { if (!REV.size && typeof ENV !== 'undefined') for (const k in ENV.m) REV.set(ENV.m[k], k); return REV.get(m); }
  if (typeof EnvBatch === 'function') {
    const m0 = EnvBatch.prototype.mesh;
    EnvBatch.prototype.mesh = function (mat) {
      let items = null;
      try { items = this.l.map(e => ({ k: rev(e.m), x: e.x, y: e.y, z: e.z })).filter(it => KIND(it.k)); } catch (_) {}
      const r = m0.apply(this, arguments);
      try {
        const base = r && (r.isMesh ? r : r.children && r.children.find(c => c.isMesh && c.userData.own && c.geometry?.attributes?.terrainAnchor245));
        if (base && items && items.length) { base.userData.items445 = items; REG.add(base); base.userData.cleared445 = -1; }
      } catch (_) {}
      return r;
    };
  }
  const inScene = o => { while (o) { if (o === scene) return true; o = o.parent; } return false; };
  function collapse(mesh, x, z) { // some com um objeto do lote
    const g = mesh.geometry, P = g.attributes.position, A = g.attributes.terrainAnchor245; if (!P || !A) return false;
    const p = P.array, a = A.array; let hit = false, y = 0; const it = mesh.userData.items445.find(q => Math.abs(q.x - x) < .02 && Math.abs(q.z - z) < .02); if (it) y = it.y || 0;
    for (let v = 0; v < A.count; v++) if (Math.abs(a[v * 2] - x) < .01 && Math.abs(a[v * 2 + 1] - z) < .01) { p[v * 3] = x; p[v * 3 + 1] = y - 50; p[v * 3 + 2] = z; hit = true; }
    if (hit) P.needsUpdate = true; return hit;
  }
  function uncol(x, z) { try { const rem = []; hnear(HASH, x, z, c => { if (Math.hypot(c.x - x, c.z - z) < .9 && c.r < 3.5) rem.push(c); }); rem.forEach(c => hrem(c)); } catch (_) {} }
  /* pedras grandes Tripo (instâncias, como as árvores) */
  const TRIPO_ROCK = new Set(['boulder', 'stones', 'mossrock']);
  function tripoRocks() { const out = []; if (!window.CULL180) return out; for (const m of CULL180) if (m.parent && TRIPO_ROCK.has(m.userData.tripo153)) out.push(m); return out; }
  function baseOf(m) { const u = m.userData; if (!u.base423) { u.base423 = m.instanceMatrix.array.slice(); u.n423 = m.instanceMatrix.count; u.col423 = m.instanceColor ? m.instanceColor.array.slice() : null; } return u.base423; }
  const alive = (B, i) => B[i * 16] !== 0 || B[i * 16 + 2] !== 0;
  function hideRockAt(x, z) {
    for (const m of tripoRocks()) {
      const B = baseOf(m), n = m.userData.n423, direct = !m.userData.lite180, Ar = m.instanceMatrix.array;
      for (let i = 0; i < n; i++) if (alive(B, i) && Math.abs(B[i * 16 + 12] - x) < .25 && Math.abs(B[i * 16 + 14] - z) < .25) { for (let k = 0; k < 12; k++) { B[i * 16 + k] = 0; if (direct) Ar[i * 16 + k] = 0; } if (direct) m.instanceMatrix.needsUpdate = true; }
      m.userData.key423 = null;
    }
  }

  /* ---------- tocos das árvores derrubadas ---------- */
  const stumps = new Map(); // "x,z" → mesh
  function stumpTick() {
    const F = U().S().felled || [], cl = new Set(S().map(q => q[0] + ',' + q[1]));
    const want = new Set();
    for (const [x, z] of F) {
      if (Math.abs(x - player.x) > 160 || Math.abs(z - player.z) > 160) continue;
      const key = x + ',' + z; if (cl.has(key)) continue; want.add(key);
      if (!stumps.has(key)) { // toco = pedaço curto da Tora Bruta (Tripo) em pé: anéis em cima, casca dos lados
        const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = (x * 7 + z * 3) % 6.28; scene.add(g); stumps.set(key, g);
        U().glb('tora').then(t => { if (stumps.get(key) !== g || !t) return; const m = U().fit(t, .9, 2.6); const w = new T.Group(); if (t.userData.sx > t.userData.sz) m.rotation.z = Math.PI / 2; else m.rotation.x = -Math.PI / 2; w.add(m); w.updateMatrixWorld(true); const bb = new T.Box3().setFromObject(w); m.position.y -= bb.min.y; m.position.x -= (bb.min.x + bb.max.x) / 2; m.position.z -= (bb.min.z + bb.max.z) / 2; w.scale.set(1, .32, 1); g.add(w); });
      }
    }
    for (const [key, m] of stumps) if (!want.has(key)) { scene.remove(m); stumps.delete(key); }
  }

  /* ---------- reaplicar o que já foi limpo ---------- */
  let verC = -1;
  function reapply() {
    const L0 = S(); if (!L0.length) return;
    const near = L0.filter(q => Math.abs(q[0] - player.x) < 400 && Math.abs(q[1] - player.z) < 400);
    for (const m of REG) {
      if (!inScene(m)) { if (!m.parent) REG.delete(m); continue; }
      if (m.userData.cleared445 === L0.length) continue; m.userData.cleared445 = L0.length;
      for (const [x, z] of near) if (m.userData.items445.some(q => Math.abs(q.x - x) < .02 && Math.abs(q.z - z) < .02)) { collapse(m, x, z); uncol(x, z); }
    }
    let n = 0; for (const m of tripoRocks()) n += m.id; const ver = L0.length * 7919 + n;
    if (ver !== verC) { verC = ver; for (const [x, z, k] of near) if (k === 'rocha3') { hideRockAt(x, z); uncol(x, z); } }
  }

  /* ---------- achar o mais perto e o F ---------- */
  function nearest() {
    let best = null, bd = 2.4; const px = player.x, pz = player.z, cl = S();
    for (const m of REG) {
      if (!m.parent) { REG.delete(m); continue; }
      const bs = m.geometry.boundingSphere; if (bs && Math.hypot(bs.center.x - px, bs.center.z - pz) > bs.radius + 3) continue; // lote longe
      for (const it of m.userData.items445) { const d = Math.hypot(it.x - px, it.z - pz); if (d < bd && !cl.some(q => Math.abs(q[0] - it.x) < .02 && Math.abs(q[1] - it.z) < .02)) { bd = d; best = { kind: KIND(it.k), x: it.x, z: it.z, mesh: m, src: 'lote' }; } }
    }
    for (const [key, m] of stumps) { const [x, z] = key.split(',').map(Number), d = Math.hypot(x - px, z - pz); if (d < bd) { bd = d; best = { kind: 'toco', x, z, mesh: m, src: 'toco' }; } }
    for (const m of tripoRocks()) { const B = baseOf(m), n = m.userData.n423; for (let i = 0; i < n; i++) { if (!alive(B, i)) continue; const x = B[i * 16 + 12], z = B[i * 16 + 14], d = Math.hypot(x - px, z - pz) - 1; if (d < bd) { bd = d; best = { kind: 'rocha', x, z, src: 'tripo' }; } } }
    return best;
  }
  const it = { type: 'clear445', x: 0, z: 0, r: 2.6, label: '', hidden: true, use: () => hit() };
  let prog = null;
  const toolOk = kind => INFO[kind].tools.find(t => t === null ? true : U().has(t) || (t === 'machado' && U().hasAxe && U().hasAxe()));
  function hit() {
    const t = it.t; if (!t) return; const I = INFO[t.kind];
    const tool = toolOk(t.kind);
    if (tool === undefined) { toast('Para ' + I.n.toLowerCase() + ' você precisa de: ' + I.tools.filter(Boolean).map(k => TN[k]).join(' ou ') + '.', 4500); return; }
    try { const r = martialState260(); const c = t.kind === 'rocha' ? 10 : 5; if (r.vigor < c) { toast('Sem fôlego. Espere a estamina voltar.'); return; } r.vigor -= c; r.vigorWait = .7; } catch (_) {}
    if (!prog || prog.x !== t.x || prog.z !== t.z) prog = { x: t.x, z: t.z, n: 0 };
    prog.n++; player.face = Math.atan2(t.x - player.x, t.z - player.z);
    try { Anim303?.play(t.kind === 'arbusto' ? 'ajoelhar' : t.kind === 'cacto' ? 'corte' : 'esmagar', 1.1); sfx('hit'); } catch (_) {}
    if (prog.n < I.hits) { floater(t.x, t.z, prog.n + '/' + I.hits, '#f0d9a0'); return; }
    prog = null; remove(t);
  }
  function loot(kind) {
    const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), o = [];
    if (kind === 'cacto') o.push([U().IT.polpa_cacto ? 'polpa_cacto' : 'fruta', R(1, 2)], [U().IT.fibra_espinhosa ? 'fibra_espinhosa' : 'fibra', R(1, 2)], ['espinhos', R(2, 3)]);
    if (kind === 'arbusto') { o.push(['fibra', R(1, 3)]); if (Math.random() < .5) o.push(['cipo', 1]); if (Math.random() < .35) o.push(['fruta', R(1, 2)]); }
    if (kind === 'pedra') o.push(['pedra', R(1, 2)]);
    if (kind === 'rocha') { o.push(['pedra', R(4, 6)]); if (Math.random() < .5) o.push(['minerio', R(1, 2)]); }
    if (kind === 'toco') { o.push(['lenha', 1], ['fibra', 1]); if (Math.random() < .5) o.push(['resina', 1]); }
    return o;
  }
  function remove(t) {
    const x = Math.round(t.x * 100) / 100, z = Math.round(t.z * 100) / 100;
    if (t.src === 'lote') { collapse(t.mesh, t.x, t.z); S().push([t.x, t.z, t.kind]); }
    else if (t.src === 'toco') { scene.remove(t.mesh); stumps.delete(t.x + ',' + t.z); S().push([t.x, t.z, 'toco']); }
    else { hideRockAt(t.x, t.z); S().push([t.x, t.z, 'rocha3']); verC = -1; }
    uncol(t.x, t.z);
    const got = []; for (const [k, q] of loot(t.kind)) { const n = U().add(k, q, true); if (n) got.push(n + ' ' + U().IT[k].n); }
    floater(t.x, t.z, got.length ? got.join(' · ') : 'BOLSA CHEIA', '#cfe8a0', true);
    try { fxRing(t.x, t.z, 0xc9a46a, 1.2, .4); } catch (_) {}
    for (const m of REG) m.userData.cleared445 = S().length; // já colapsado
    U().save();
  }

  let slow = 0, last = performance.now(), lastRun = null;
  function loop() {
    const now = performance.now(), dt = Math.min(.25, (now - last) / 1000); last = now;
    try {
      if (ready() && !paused) {
        if (run !== lastRun) { lastRun = run; for (const m of REG) m.userData.cleared445 = -1; verC = -1; }
        slow -= dt; if (slow <= 0) { slow = .3;
          stumpTick(); reapply();
          const t = nearest(); it.t = t; it.hidden = !t;
          if (t) { it.x = t.x; it.z = t.z; it.label = 'F · ' + INFO[t.kind].n + (toolOk(t.kind) === undefined ? ' (falta ' + INFO[t.kind].tools.filter(Boolean).map(k => TN[k]).join('/') + ')' : '') + (prog && prog.x === t.x && prog.z === t.z ? ' (' + prog.n + '/' + INFO[t.kind].hits + ')' : ''); }
          const i = L.inter.indexOf(it); if (!it.hidden && i < 0) L.inter.push(it); else if (it.hidden && i >= 0) L.inter.splice(i, 1);
        }
      } else if (typeof L !== 'undefined' && L.mode !== 'world') { for (const [, m] of stumps) scene.remove(m); stumps.clear(); }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('clear445', e); } }
    setTimeout(loop, 50);
  }
  loop();
  window.Clear445 = { S, nearest, remove, REG, stumps, KIND };
})();
