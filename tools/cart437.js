/* v437 (Ian): Carrinho de mão puxado pelo personagem.
   F · PUXAR / SOLTAR CARRINHO; carga grande (400 kg) empilhada à vista (toras, feixes, tábuas, caixas);
   carga pesada deixa mais lento e gasta estamina em subida (terrH); atacar solta o carrinho na hora;
   largado, monstros perto estragam o carrinho (conserta com Tábuas). Feito no Manual de Sobrevivência (tools/build437.js).
   Raiz do modelo em y=0: o relevo (terrain245) sobe o carrinho pela raiz. */
(function () {
  'use strict';
  const T = THREE, CAP = 400, D = 1.75; // distância do centro do carrinho às mãos
  const U = () => window.Surv437;
  const st = () => run && run.cart437;
  let view = null; // {g, bed, it, col, key}
  const kg = k => (U()?.IT[k]?.kg) || 1;
  function loadKg() { const c = st(); if (!c) return 0; let w = 0; for (const k in c.load) w += kg(k) * c.load[k]; return w; }
  const pulling = () => !!(st() && st().pull && view);

  function create(x, z, ry) { run.cart437 = { x, z, ry: ry || 0, hp: 100, load: {}, pull: false }; U().save(); spawn(); }
  function spawn() {
    const c = st(); if (!c || view) return;
    const g = new T.Group(), body = new T.Group(), bed = new T.Group(); g.add(body); body.add(bed);
    U().glb('carrinho').then(t => {
      if (!t || view?.g !== g) return;
      // modelo de 2 rodas (Tripo Studio): caixa no +x e varais no −x; gira para os varais apontarem para +z (o jogador)
      const m = U().fit(t, 1.25, 2.9); m.rotation.y = Math.PI / 2; body.add(m); view.h = m.userData.h;
      bed.position.y = m.userData.h * .42; stack();
    });
    g.position.set(c.x, 0, c.z); g.rotation.y = c.ry; scene.add(g);
    const it = { type: 'cart437', x: c.x, z: c.z, r: 2.4, label: 'F · CARRINHO', use: () => menu() };
    L.inter.push(it);
    view = { g, body, bed, it, col: null, key: '' };
    collider(!c.pull);
  }
  function despawn() { if (!view) return; scene.remove(view.g); const i = L.inter.indexOf(view.it); if (i >= 0) L.inter.splice(i, 1); collider(false); view = null; }
  function collider(on) {
    if (!view) return;
    if (view.col) { try { hrem(view.col); } catch (_) {} view.col = null; }
    if (on) { const c = st(); view.col = { x: c.x, z: c.z, r: 1.05 }; try { hadd(HASH, view.col); } catch (_) {} }
  }
  // carga à vista: toras deitadas no fundo, feixes e tábuas por cima, o resto em caixas
  function stack() {
    if (!view) return; const c = st(), key = JSON.stringify(c.load); if (key === view.key) return; view.key = key;
    view.bed.clear();
    const put = (name, n, w, h, y0, cols, dy) => {
      U().glb(name).then(t => { if (!t || !view) return; for (let i = 0; i < n; i++) { const p = U().fit(t, h, w), col = i % cols, row = (i / cols) | 0; p.position.set((col - (cols - 1) / 2) * (w * .55), y0 + row * dy, 0); view.bed.add(p); } });
    };
    const n = k => c.load[k] || 0;
    const tor = Math.min(6, n('tora')), lay = Math.ceil(tor / 3);
    if (tor) put('tora', tor, 1.0, .32, 0, 3, .28); // 3 por camada, comprimento ao longo do carrinho
    const top = lay * .28;
    if (n('lenha')) put('feixe-lenha', Math.min(4, Math.ceil(n('lenha') / 3)), .5, .45, top, 2, .4);
    if (n('tabua')) put('tabuas', Math.min(3, Math.ceil(n('tabua') / 4)), .45, .35, top + (n('lenha') ? .42 : 0), 2, .33);
    const rest = Object.keys(c.load).filter(k => !['tora', 'lenha', 'tabua'].includes(k)).reduce((a, k) => a + kg(k) * c.load[k], 0);
    if (rest > 0) put('bau', Math.min(2, Math.ceil(rest / 40)), .55, .38, top, 2, .38);
  }
  function load(k, n) {
    const c = st(); if (!c) return 0; if (loadKg() + kg(k) * n > CAP + 1e-6) { toast('<b>[CARRINHO]</b> Cheio (' + Math.round(loadKg()) + ' de ' + CAP + ' kg).'); return 0; }
    c.load[k] = (c.load[k] || 0) + n; U().save(); stack(); try { sfx('pickup'); } catch (_) {} return n;
  }
  function take(k, n) { const c = st(); if (!c || (c.load[k] || 0) < n) return false; c.load[k] -= n; if (!c.load[k]) delete c.load[k]; U().save(); stack(); return true; }
  const has = (k, n = 1) => (st()?.load[k] || 0) >= n;
  const near = (x, z, r) => !!(st() && view && Math.hypot(st().x - x, st().z - z) < r);

  function setPull(on) {
    const c = st(); if (!c) return;
    if (on && c.hp <= 0) { toast('<b>[CARRINHO]</b> Quebrado: conserte com 2 Tábuas antes de puxar.'); return; }
    if (on && U().S().carry) { toast('Largue a tora do ombro antes (ou ponha no carrinho).'); return; }
    c.pull = !!on; collider(!on); view.it.label = on ? 'F · SOLTAR CARRINHO' : 'F · CARRINHO';
    if (on) toast('<b>[CARRINHO]</b> Puxando: ' + Math.round(loadKg()) + ' kg. Atacar solta na hora. F perto dele solta.', 3500);
    U().save();
  }
  function menu() {
    const c = st(); if (c.pull) { setPull(false); return; }
    const S = U().S(), IT = U().IT, rows = Object.keys(c.load);
    let h = '<p>Carga: <b>' + Math.round(loadKg()) + ' de ' + CAP + ' kg</b> · Estado: <b style="color:' + (c.hp > 50 ? '#9fe39a' : c.hp > 0 ? '#ffd36b' : '#ff7b6b') + '">' + Math.round(c.hp) + '%</b></p>';
    h += '<table style="width:100%;border-collapse:collapse">';
    for (const k of rows) h += '<tr style="border-bottom:1px solid #b9974f33"><td style="padding:4px"><b>' + (IT[k]?.n || k) + '</b> ×' + c.load[k] + '</td><td style="text-align:right">' + (k === 'tora' ? '<button class="btn" data-out="tora">LARGAR 1 NO CHÃO</button>' : '<button class="btn" data-get="' + k + '">PEGAR 1</button> <button class="btn" data-all="' + k + '">TUDO</button>') + '</td></tr>';
    if (!rows.length) h += '<tr><td style="opacity:.6;padding:6px">Vazio.</td></tr>';
    h += '</table><p style="margin:8px 0 4px">Pôr da bolsa no carrinho:</p><div style="display:flex;gap:6px;flex-wrap:wrap">';
    for (const k in S.bag) if (k !== 'machado' && k !== 'cantil') h += '<button class="btn" data-put="' + k + '">' + IT[k].n + ' ×' + S.bag[k] + '</button>';
    h += '</div><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn" id="c437p"' + (c.hp <= 0 ? ' disabled' : '') + '>PUXAR CARRINHO</button>' + (c.hp < 100 ? '<button class="btn" id="c437r">CONSERTAR (2 Tábuas)</button>' : '') + '</div>';
    openModal('CARRINHO DE MÃO', h);
    const box = document.getElementById('modal') || document, re = () => menu();
    box.querySelectorAll('[data-get]').forEach(e => e.onclick = () => { const k = e.dataset.get; if (U().add(k, 1, true) && take(k, 1)) re(); else toast('Bolsa cheia.'); });
    box.querySelectorAll('[data-all]').forEach(e => e.onclick = () => { const k = e.dataset.all; const n = U().add(k, c.load[k], true); if (n) take(k, n); re(); });
    box.querySelectorAll('[data-put]').forEach(e => e.onclick = () => { const k = e.dataset.put, n = S.bag[k]; if (load(k, n)) U().take(k, n); re(); });
    box.querySelectorAll('[data-out]').forEach(e => e.onclick = () => { if (take('tora', 1)) U().addLog({ id: 'L' + Date.now().toString(36), x: c.x + Math.sin(c.ry + 1.6) * 1.8, z: c.z + Math.cos(c.ry + 1.6) * 1.8, ry: c.ry }); re(); });
    const p = document.getElementById('c437p'); if (p) p.onclick = () => { closeModal(); setPull(true); };
    const r = document.getElementById('c437r'); if (r) r.onclick = () => { const src = U().has('tabua', 2) ? 'bag' : has('tabua', 2) ? 'cart' : null; if (!src) { toast('Precisa de 2 Tábuas (na bolsa ou no carrinho).'); return; } src === 'bag' ? U().take('tabua', 2) : take('tabua', 2); c.hp = 100; U().save(); toast('<b>[CARRINHO]</b> Consertado.'); re(); };
  }

  // velocidade: carrinho vazio -10%; cheio -45%; sem estamina numa subida, mais devagar ainda
  let tiredUp = 0;
  if (typeof movementSpeed === 'function') { const ms0 = movementSpeed; movementSpeed = function (raw) { if (pulling()) { const f = loadKg() / CAP * (U().S().fed > 0 ? .77 : 1); raw *= (.9 - .35 * f) * (tiredUp > 0 ? .6 : 1); } return ms0(raw); }; }
  if (typeof attack === 'function') { const at0 = attack; attack = function () { try { if (pulling()) setPull(false); } catch (_) {} return at0.apply(this, arguments); }; }

  let lastH = null, hurtT = 0;
  function follow(dt) {
    const c = st();
    const dx = player.x - c.x, dz = player.z - c.z, d = Math.hypot(dx, dz) || 1;
    if (d > 6) { c.x = player.x - Math.sin(player.face || 0) * D; c.z = player.z - Math.cos(player.face || 0) * D; } // teleporte/queda: volta para trás do jogador
    else if (d > D) { const k = (d - D) / d; c.x += dx * k; c.z += dz * k; }
    c.ry = Math.atan2(player.x - c.x, player.z - c.z);
    // subida: gasta estamina proporcional à altura vencida e ao peso
    const h = typeof terrH === 'function' ? terrH(c.x, c.z) : 0;
    if (lastH != null && h > lastH) { const cost = (h - lastH) * (3 + loadKg() / 40); /* morro de 6 m com 200 kg ≈ metade da estamina */ try { const r = martialState260(); r.vigor = Math.max(0, r.vigor - cost); r.vigorWait = Math.max(r.vigorWait || 0, .6); tiredUp = r.vigor <= 1 ? .5 : Math.max(0, tiredUp - dt); } catch (_) {} }
    else tiredUp = Math.max(0, tiredUp - dt);
    lastH = h;
    // inclinação no morro (o relevo só sobe pela raiz)
    if (typeof terrH === 'function') { const fx = Math.sin(c.ry), fz = Math.cos(c.ry), hf = terrH(c.x + fx * 1.1, c.z + fz * 1.1), hb = terrH(c.x - fx * 1.1, c.z - fz * 1.1); view.body.rotation.x = -Math.atan2(hf - hb, 2.2) * .9 + .12; }
  }
  function damageTick(dt) { // largado: monstro com aggro encostado estraga o carrinho
    const c = st(); if (c.pull || c.hp <= 0) return;
    hurtT -= dt; if (hurtT > 0) return; hurtT = 1;
    const foes = enemies.filter(e => !e.dead && e.aggro && Math.hypot(e.x - c.x, e.z - c.z) < 2.6);
    if (!foes.length) return;
    c.hp = Math.max(0, c.hp - 5 * foes.length);
    try { floater(c.x, c.z, 'CARRINHO ' + Math.round(c.hp) + '%', '#ffb36b'); } catch (_) {}
    if (c.hp <= 0) { // quebrou: parte da carga cai e se perde
      const lost = []; for (const k in c.load) { const q = Math.ceil(c.load[k] * .3); c.load[k] -= q; if (c.load[k] <= 0) delete c.load[k]; lost.push(q + ' ' + (U().IT[k]?.n || k)); }
      stack(); toast('<b>[CARRINHO]</b> Quebrado pelos monstros!' + (lost.length ? ' Perdeu ' + lost.join(', ') + '.' : '') + ' Conserte com 2 Tábuas.', 6000);
    }
    U().save();
  }

  let last = performance.now();
  function loop() {
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
    try {
      const ok = U() && U().ready() && st();
      if (!ok || !U().world()) { if (view) { if (st()?.pull) { st().pull = false; } despawn(); } }
      else if (!paused && !player.dead) {
        const c = st(), d = Math.hypot(c.x - player.x, c.z - player.z);
        if (!view && (c.pull || d < 140)) spawn();
        if (view && !c.pull && d > 170) despawn();
        if (view) {
          if (c.pull) { if (run.mounted || window.Water391?.swimming) setPull(false); else follow(dt); }
          else damageTick(dt);
          view.g.position.set(c.x, 0, c.z); view.g.rotation.y = c.ry; view.it.x = c.x; view.it.z = c.z;
        }
      }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('cart437', e); } }
    setTimeout(loop, 16);
  }
  loop();
  window.Cart437 = { create, pulling, loadKg, near, load, take, has, setPull, menu, CAP, state: st, view: () => view };
})();
