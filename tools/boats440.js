/* v440 (Ian, pacote Sobrevivência parte 4): barcos feitos com Tábuas.
   Canoa (rápida, 1 pessoa), Veleiro de pesca e carga (leva o carrinho de mão e a carga dele; mais pesado = mais lento)
   e Navio de expedição (base no alto-mar: cama para dormir/salvar e baú). Montados peça por peça no Manual de
   Sobrevivência (tools/build437.js, molde na água funda); prontos, viram barcos em run.boats440.
   A bordo: anda só na água funda, F abre o menu (desembarcar na margem, pular na água para mergulhar, dormir, baú,
   carga). Nadando perto do barco, F embarca de novo. O barco fica com y absoluto na superfície (não no fundo). */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const U = () => window.Surv437, BU = () => window.Build437;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // m: modelo; h/w: tamanho; sp: velocidade; deck: altura do convés acima da água; draft: fundo mínimo; rot: giro do modelo (proa para +z)
  const K = {
    canoa: { n: 'Canoa', m: 'canoa', h: 1, w: 3.8, sp: 1.3, deck: .3, sink: .3, draft: .6, rot: 0 },
    veleiro: { n: 'Veleiro de pesca e carga', m: 'veleiro', h: 6, w: 7, sp: 1.65, deck: .85, sink: .7, draft: 1.1, rot: 0, cargo: true },
    navio: { n: 'Navio de expedição', m: 'm440/navio', h: 11, w: 13, sp: 1.4, deck: 1.15, sink: .5, draft: 2, rot: 0, base: true }
  };
  const water = (x, z) => window.Water391 && Water391.waterAt(x, z);
  const deep = (x, z) => { const w = water(x, z); return w && !w.frozen ? w.top - terrH(x, z) : 0; };
  const boats = () => (run.boats440 = run.boats440 || []);
  const aboard = () => run && run.aboard440 ? boats().find(b => b.id === run.aboard440) : null;

  /* ---------- catálogo do Manual ---------- */
  function addRecipes() {
    const B = BU() && BU().B; if (!B) { setTimeout(addRecipes, 300); return; }
    Object.assign(B, {
      canoa: { n: 'Canoa', m: 'canoa', h: 1, w: 3.8, r: 0, water: true, draft: .6, boat: 'canoa', d: 'Barco leve e rápido para rios, lagos e costa. Molde na água funda.', st: [{ n: 'Casco', need: { tora: 1, tabua: 4 } }, { n: 'Remo e vedação', need: { tabua: 2, resina: 2 } }] },
      veleiro: { n: 'Veleiro de pesca e carga', m: 'veleiro', h: 6, w: 7, r: 0, water: true, draft: 1.1, boat: 'veleiro', d: 'Leva o carrinho de mão e a carga dele pelo mar. Quanto mais pesado, mais lento.', st: [{ n: 'Casco', need: { tora: 3, tabua: 10 } }, { n: 'Mastro', need: { tora: 1, cipo: 4 } }, { n: 'Vela', need: { couro: 4, fibra: 10 } }, { n: 'Vedação', need: { resina: 4 } }] },
      navio: { n: 'Navio de expedição', m: 'm440/navio', h: 11, w: 13, r: 0, water: true, draft: 2, boat: 'navio', d: 'Base no alto-mar: cama (dormir e salvar), baú de 300 kg e lugar para mergulhar nas fossas.', st: [{ n: 'Quilha', need: { tora: 6 } }, { n: 'Casco', need: { tabua: 24 } }, { n: 'Mastros', need: { tora: 2, cipo: 8 } }, { n: 'Velas', need: { couro: 8, fibra: 20 } }, { n: 'Cabine', need: { tabua: 8, minerio: 4 } }, { n: 'Vedação', need: { resina: 8 } }] }
    });
  }
  addRecipes();

  /* ---------- barcos no mapa ---------- */
  const live = new Map(); // id → {b, g, m, it}
  function launch(site) {
    const b = { id: 'N' + Date.now().toString(36), t: site.boat || BU().B[site.t].boat, x: site.x, z: site.z, ry: site.ry, store: {} };
    boats().push(b); U().save(); spawn(b);
    toast('<b>[ESTALEIRO]</b> ' + K[b.t].n + ' na água! Chegue perto e aperte F para embarcar.', 5000);
  }
  function spawn(b) {
    if (live.has(b.id)) return;
    const k = K[b.t], g = new T.Group(); g.userData.terrainAbsolute245 = true; scene.add(g);
    const o = { b, g, m: null, it: null, t: Math.random() * 10 };
    U().glb(k.m).then(t => { if (live.get(b.id) !== o || !t) return; const m = U().fit(t, k.h, k.w); if (m.userData.w && t.userData.sx > t.userData.sz) m.rotation.y = Math.PI / 2; m.rotation.y += k.rot; m.position.y = -k.sink; /* casco na linha d'água */ o.m = m; g.add(m); });
    o.it = { type: 'boat440', x: b.x, z: b.z, r: Math.max(2.6, k.w * .45), label: 'F · EMBARCAR: ' + k.n.toUpperCase(), use: () => board(b) };
    L.inter.push(o.it); live.set(b.id, o); place(o);
  }
  function drop(id) { const o = live.get(id); if (!o) return; scene.remove(o.g); const i = L.inter.indexOf(o.it); if (i >= 0) L.inter.splice(i, 1); live.delete(id); }
  function place(o) {
    const b = o.b, w = water(b.x, b.z), y = (w ? w.top : (TER245.SEA439?.Y || 0)) + Math.sin(o.t * 1.3) * .05;
    o.g.position.set(b.x, y, b.z); o.g.rotation.set(Math.sin(o.t * .9) * .015, b.ry, Math.sin(o.t * 1.1) * .02);
    o.it.x = b.x; o.it.z = b.z; o.it.hidden = !!run.aboard440 && run.aboard440 === b.id;
  }

  function cartOnDeck(o) { // carrinho no convés do veleiro (o carrinho de verdade some do chão enquanto isso)
    const c = run.cart437, on = !!(c && c.onBoat440 === o.b.id);
    if (on && !o.cartG) { const g = new T.Group(); o.cartG = g; g.position.set(0, K[o.b.t].deck, -K[o.b.t].w * .12); o.g.add(g); U().glb('carrinho').then(t => { if (o.cartG === g && t) { const m = U().fit(t, 1.1, 2.4); m.rotation.y = Math.PI / 2; g.add(m); } }); }
    if (!on && o.cartG) { o.g.remove(o.cartG); o.cartG = null; }
  }
  /* ---------- embarcar / desembarcar ---------- */
  function board(b) {
    if (run.aboard440) return;
    if (U().S().carry) { toast('Largue a tora do ombro antes de embarcar.'); return; }
    if (window.Cart437?.pulling()) Cart437.setPull(false);
    run.aboard440 = b.id;
    // o veleiro leva o carrinho que estiver perto
    const c = run.cart437;
    if (K[b.t].cargo && c && !c.onBoat440 && Math.hypot(c.x - b.x, c.z - b.z) < 14) { c.onBoat440 = b.id; toast('O <b>carrinho</b> e a carga dele foram para o convés do veleiro.', 4000); }
    player.x = b.x; player.z = b.z;
    try { Anim303?.play('firme', 1); } catch (_) {}
    toast('<b>[' + K[b.t].n.toUpperCase() + ']</b> A bordo. Ande para navegar; F abre o menu do barco.', 4500);
    U().save();
  }
  function landSpot(b) { // margem seca a até 9 m
    for (let r = 2; r <= 9; r += 1) for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, x = b.x + Math.sin(a) * r, z = b.z + Math.cos(a) * r; if (!water(x, z) && (typeof freeAt !== 'function' || freeAt(x, z, .6))) return [x, z]; }
    return null;
  }
  function leave(mode) {
    const b = aboard(); if (!b) return;
    if (mode === 'land') {
      const p = landSpot(b); if (!p) { toast('Nenhuma margem seca perto. Chegue mais perto da praia (ou pule na água).'); return; }
      run.aboard440 = null; player.x = p[0]; player.z = p[1];
      const c = run.cart437; if (c && c.onBoat440 === b.id) { const q = landSpot({ x: p[0], z: p[1] }) || p; c.x = q[0] + .8; c.z = q[1] + .8; c.onBoat440 = null; c.pull = false; toast('O carrinho desceu na margem.', 3000); }
    } else { // pular na água
      run.aboard440 = null; player.x = b.x + Math.sin(b.ry + 1.57) * (K[b.t].w * .35 + 1.2); player.z = b.z + Math.cos(b.ry + 1.57) * (K[b.t].w * .35 + 1.2);
      toast('Você pulou na água. Ctrl afunda, Espaço sobe. Nadando perto do barco, F embarca.', 4500);
    }
    U().save();
  }
  function menu() {
    const b = aboard(); if (!b) return; const k = K[b.t];
    const btn = (id, t, on = true) => '<button class="btn" id="' + id + '"' + (on ? '' : ' disabled') + '>' + t + '</button>';
    const c = run.cart437, cartHere = c && c.onBoat440 === b.id;
    let h = '<p>' + esc(k.n) + (cartHere ? ' · carrinho no convés (' + Math.round(Cart437.loadKg()) + ' kg)' : '') + '. Fundo aqui: ' + deep(b.x, b.z).toFixed(1).replace('.', ',') + ' m.</p><div style="display:flex;gap:8px;flex-wrap:wrap">';
    h += btn('b440l', 'DESEMBARCAR NA MARGEM', !!landSpot(b)) + btn('b440j', 'PULAR NA ÁGUA (mergulhar)');
    if (k.base) h += btn('b440s', 'DORMIR NA CABINE') + btn('b440v', 'SALVAR') + btn('b440c', 'BAÚ DO NAVIO');
    if (cartHere) h += btn('b440k', 'CARGA DO CARRINHO');
    openModal(k.n.toUpperCase(), h + '</div>');
    const on = (id, fn) => { const e = document.getElementById(id); if (e) e.onclick = fn; };
    on('b440l', () => { closeModal(); leave('land'); });
    on('b440j', () => { closeModal(); leave('jump'); });
    on('b440s', () => BU().sleep(3));
    on('b440v', () => { try { saveRun(); } catch (_) {} closeModal(); toast('Jogo salvo.'); });
    on('b440c', () => BU().storeView({ b }, 'BAÚ DO NAVIO', k2 => k2 !== 'machado' && k2 !== 'cantil', 300));
    on('b440k', () => Cart437.menu());
  }
  const helm = { type: 'helm440', x: 0, z: 0, r: 1.5, label: 'F · MENU DO BARCO', hidden: true, use: () => menu() };

  /* ---------- navegar ---------- */
  if (typeof moveEnt === 'function') {
    const mv0 = moveEnt;
    moveEnt = function (e, dx, dz) {
      try {
        if (e === player && run?.aboard440) { const b = aboard(); if (b && deep(e.x + dx * 3, e.z + dz * 3) < K[b.t].draft) return; } // encalha: não sai da água funda
      } catch (_) {}
      return mv0.call(this, e, dx, dz);
    };
  }
  if (typeof movementSpeed === 'function') {
    const ms0 = movementSpeed;
    movementSpeed = function (raw) {
      try { const b = aboard(); if (b) { let k = K[b.t].sp; const c = run.cart437; if (c && c.onBoat440 === b.id) k *= 1 - .45 * Math.min(1, (Cart437.loadKg() + 120) / 520); raw *= k; } } catch (_) {}
      return ms0(raw);
    };
  }
  if (typeof floor344 === 'function') { // a bordo o chão é o convés
    const f0 = floor344;
    floor344 = function (x, z) { try { const b = aboard(); if (b && Math.hypot(x - player.x, z - player.z) < .01) { const w = water(x, z); if (w) return w.top + K[b.t].deck - terrH(x, z); } } catch (_) {} return f0.apply(this, arguments); };
  }

  let last = performance.now(), slow = 0;
  function loop() {
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
    try {
      const ok = U() && U().ready();
      if (!ok || !U().world()) { for (const id of [...live.keys()]) drop(id); if (ok && run.aboard440 && L.mode !== 'world') run.aboard440 = null; }
      else if (!paused) {
        const b = aboard();
        if (b) { // o barco segue o jogador e aponta para onde ele vai
          const dx = player.x - b.x, dz = player.z - b.z; if (Math.hypot(dx, dz) > .02) { const a = Math.atan2(dx, dz); let d = a - b.ry; d = Math.atan2(Math.sin(d), Math.cos(d)); b.ry += d * Math.min(1, dt * 3); }
          b.x = player.x; b.z = player.z;
          const c = run.cart437; if (c && c.onBoat440 === b.id) { c.x = b.x; c.z = b.z; }
          if (window.Water391?.swimming) run.aboard440 = null;
        }
        helm.hidden = !b; helm.x = player.x; helm.z = player.z; const hi = L.inter.indexOf(helm); if (!helm.hidden && hi < 0) L.inter.push(helm); else if (helm.hidden && hi >= 0) L.inter.splice(hi, 1);
        for (const o of live.values()) { o.t += dt; place(o); cartOnDeck(o); }
        slow -= dt; if (slow <= 0) { slow = 1;
          for (const bb of boats()) { const d = Math.hypot(bb.x - player.x, bb.z - player.z); if (d < 260 && !live.has(bb.id)) spawn(bb); }
          for (const [id, o] of live) if (Math.hypot(o.b.x - player.x, o.b.z - player.z) > 320) drop(id);
        }
      }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('boats440', e); } }
    setTimeout(loop, 16);
  }
  loop();
  window.Boats440 = { K, launch, board, leave, menu, boats, aboard, live };
})();
