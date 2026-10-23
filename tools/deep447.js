/* v447 (Ian, pacote Sobrevivência parte 4 — o fundo do mar): o que faltava depois da v439–v443 e da v441.
   PRESSÃO: mergulhando além do limite (8 m) a pressão sobe e machuca; o limite cresce com o Elmo de Mergulho (bancada),
   o Chá de Algas (fogueira: algas + cantil de água limpa) e a Poção de Pressão da Mira (Loja de Poções). O chá também
   estica o Fôlego. No fundo, perto do chão: ALGAS (no raso), OSTRAS GIGANTES com pérola (recife e alto-mar) e VEIOS DE
   MINÉRIO no recife das fossas (cristal Tripo do jogo). MONSTROS DE FUNDO aparecem nas fossas. CORRENTES ABISSAIS
   (a Fenda do jogo) nas fossas levam a outros pontos do mar (travessia entre mares).
   Tudo no mar de tools/sea439.js; mergulho e fôlego em tools/mechanics434.js; itens na bolsa de tools/survival437.js. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const U = () => window.Surv437, W = () => window.Mech423 && Mech423.Water;
  const SE = () => window.TER245 && TER245.SEA439;
  const ready = () => U() && typeof U().ready === 'function' && U().ready() && U().world();
  const S = () => (run.deep447 = run.deep447 || { picked: {}, buffs: {} });
  const depthAt = (x, z) => window.Sea439 ? Sea439.depth(x, z) : 0;

  /* ---------- itens e receitas ---------- */
  function addItems() {
    if (!U() || !window.Build437) { setTimeout(addItems, 300); return; }
    Object.assign(U().ITEMS, {
      algas: { n: 'Algas', kg: .3, d: 'Do fundo raso do mar. Com água limpa na fogueira viram Chá de Algas.' },
      cha_algas: { n: 'Chá de Algas', kg: .4, d: 'Beber: +50% de Fôlego e +10 m de limite de pressão por 5 min.' },
      perola: { n: 'Pérola', kg: .05, d: 'Das ostras gigantes do recife. Vende bem na cidade (bolsa → VENDER PÉROLAS perto de uma cidade).' },
      pocao_pressao: { n: 'Poção de Pressão', kg: .3, d: 'Da Mira. Beber: +15 m de limite de pressão por 5 min.' },
      elmo_mergulho: { n: 'Elmo de Mergulho', kg: 4, d: 'Na bolsa: +12 m de limite de pressão e +8 s de fôlego.' }
    });
  }
  addItems();
  const has = (k, n = 1) => U().has(k, n);
  const buff = k => (S().buffs[k] || 0) > (U().S().clock || 0);
  function pressLimit() { return 8 + (has('elmo_mergulho') ? 12 : 0) + (buff('cha') ? 10 : 0) + (buff('pocao') ? 15 : 0); }
  function drinkBuff(k, item, msg) { if (!U().take(item, 1)) return; S().buffs[k] = (U().S().clock || 0) + 300; toast(msg, 4500); U().save(); }
  // fôlego: o chá estica 50%, o elmo +8 s (mechanics434 Water.max)
  (function hookBreath() { const w = W(); if (!w) { setTimeout(hookBreath, 400); return; } const m0 = w.max; w.max = () => (m0() + (has('elmo_mergulho') ? 8 : 0)) * (buff('cha') ? 1.5 : 1); })();
  // bolsa: beber chá/poção e vender pérola — botões extras injetados quando a janela da bolsa abre
  function injectBag(box) {
    if (box.querySelector('#bag447')) return;
    const row = document.createElement('div'); row.id = 'bag447'; row.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px';
    const reopen = () => { const b = document.getElementById('bSurv437'); if (b) b.click(); };
    const btn = (t, fn) => { const e = document.createElement('button'); e.className = 'btn'; e.textContent = t; e.onclick = () => { fn(); reopen(); }; row.appendChild(e); };
    if (has('cha_algas')) btn('BEBER CHÁ DE ALGAS', () => drinkBuff('cha', 'cha_algas', '<b>Chá de Algas</b>: fôlego +50% e pressão +10 m por 5 min.'));
    if (has('pocao_pressao')) btn('BEBER POÇÃO DE PRESSÃO', () => drinkBuff('pocao', 'pocao_pressao', '<b>Poção de Pressão</b>: +15 m de limite por 5 min.'));
    const near = typeof nearestCity === 'function' && nearestCity(player.x, player.z).d < 90 * (typeof CITYK !== 'undefined' ? CITYK : 1);
    if (has('perola')) btn(near ? 'VENDER PÉROLAS' : 'VENDER PÉROLAS (só na cidade)', () => { if (!near) { toast('Leve as pérolas a uma cidade.'); return; } const n = U().S().bag.perola, each = Math.round(60 * ((typeof GR !== 'undefined' && GR[Math.min(9, rankOf())]) ? GR[Math.min(9, rankOf())].gold : 1)); U().take('perola', n); run.gold += n * each; toast('Vendeu ' + n + ' pérola(s) por ' + (typeof fmt === 'function' ? fmt(n * each) : n * each) + ' ouro.', 4000); });
    if (row.children.length) { const t = box.querySelector('table'); if (t) t.after(row); else box.appendChild(row); }
  }
  // Mira vende a Poção de Pressão
  if (typeof openShop === 'function') {
    const os0 = openShop;
    openShop = function (id) {
      const r = os0.apply(this, arguments);
      try {
        if (id === 'pot' && ready()) {
          const box = document.getElementById('modal'), price = Math.round(90 * ((typeof GR !== 'undefined' && GR[Math.min(9, rankOf())]) ? GR[Math.min(9, rankOf())].gold : 1));
          if (box && !box.querySelector('#mira447')) { const d = document.createElement('div'); d.id = 'mira447'; d.style.cssText = 'margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap'; d.innerHTML = '<span><b>Poção de Pressão</b> · mergulho fundo (+15 m por 5 min)</span><button class="btn">COMPRAR · ' + (typeof fmt === 'function' ? fmt(price) : price) + '</button>'; d.querySelector('button').onclick = () => { if (run.gold < price) { toast('Ouro insuficiente.'); return; } if (!U().add('pocao_pressao', 1, true)) return; run.gold -= price; toast('<b>Mira:</b> — Beba antes de descer nas fossas.', 3500); U().save(); }; box.appendChild(d); }
        }
      } catch (_) {}
      return r;
    };
  }
  // Chá de Algas (fogueira) e Elmo de Mergulho (bancada): injetados no Manual de Sobrevivência
  function injectManual(box) {
    if (box.querySelector('#man447')) return;
    const bench = (run.build437 || []).some(q => q.t === 'bancada' && q.stage >= 2 && Math.hypot(q.x - player.x, q.z - player.z) < 6);
    const fire = (run.build437 || []).some(q => q.t === 'fogueira' && q.fuel > 0 && Math.hypot(q.x - player.x, q.z - player.z) < 5);
    const c = U().S().canteen;
    const d = document.createElement('div'); d.id = 'man447'; d.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin:6px 0';
    const mk = (t, ok, fn) => { const e = document.createElement('button'); e.className = 'btn'; e.textContent = t; e.disabled = !ok; e.onclick = () => { fn(); e.disabled = true; }; d.appendChild(e); };
    mk('Chá de Algas · 2 Algas + 1 gole de água limpa (perto de fogueira acesa)', fire && has('algas', 2) && c && c.sips > 0 && (c.kind === 'limpa' || c.kind === 'cha'), () => { U().take('algas', 2); c.sips--; U().add('cha_algas', 1, true); toast('<b>Chá de Algas</b> pronto (bolsa → BEBER).'); U().save(); });
    mk('Elmo de Mergulho · 4 Minério + 2 Couro + 2 Resina (perto da bancada)', bench && has('minerio', 4) && has('couro', 2) && has('resina', 2) && !has('elmo_mergulho'), () => { U().take('minerio', 4); U().take('couro', 2); U().take('resina', 2); U().add('elmo_mergulho', 1, true); toast('<b>Elmo de Mergulho</b> pronto: fica na bolsa e já vale.'); });
    const sec = document.createElement('div'); sec.className = 'sec'; sec.textContent = 'MAR';
    const tbl = box.querySelector('table'); if (tbl) tbl.before(sec, d); else box.append(sec, d);
  }
  (function watch() {
    const m = document.getElementById('modal'); if (!m) { setTimeout(watch, 500); return; }
    new MutationObserver(() => { try { if (!ready() || m.hidden) return; const tx = m.textContent || ''; if (/BOLSA DE SOBREVIV/.test(tx)) injectBag(m); if (/MANUAL DE SOBREVIV/.test(tx)) injectManual(m); } catch (_) {} }).observe(m, { childList: true, subtree: true });
  })();
  /* ---------- pressão ---------- */
  const st = { press: 0, hurt: 0, warned: false };
  const bar = document.createElement('div');
  bar.style.cssText = 'display:none;margin-top:3px;font:600 10px system-ui;color:#e9dfc0';
  bar.innerHTML = '<div class="lbl"><span>PRESSÃO</span><span id="pr447t"></span></div><div class="bar" style="height:5px"><i id="pr447" style="width:0%;background:#7fd0ff"></i></div>';
  function pressureTick(dt) {
    const w = W(), stt = document.getElementById('stat');
    if (stt && bar.parentElement !== stt) stt.appendChild(bar);
    const sw = window.Water391?.swimming, dive = sw && w ? w.dive : 0, lim = pressLimit();
    if (dive > lim) st.press = Math.min(1, st.press + dt * (dive - lim) / 12); else st.press = Math.max(0, st.press - dt * .35);
    bar.style.display = sw && dive > 1.5 ? 'block' : 'none';
    if (bar.style.display !== 'none') { const pct = Math.min(100, dive / lim * 100); document.getElementById('pr447').style.width = pct.toFixed(0) + '%'; document.getElementById('pr447').style.background = dive > lim ? '#ff6b5a' : '#7fd0ff'; document.getElementById('pr447t').textContent = dive.toFixed(0) + ' / ' + lim + ' m'; }
    if (st.press > .25) { st.hurt -= dt; if (st.hurt <= 0) { st.hurt = 1; try { hurtPlayer(Math.max(1, Math.round(player.maxhp * .05 * st.press)), false); floater(player.x, player.z, 'PRESSÃO', '#7fd0ff'); } catch (_) {} if (!st.warned) { st.warned = true; toast('<b>[PRESSÃO]</b> Fundo demais! Suba (Espaço) ou use Elmo de Mergulho, Chá de Algas ou a Poção de Pressão da Mira.', 6000); } } }
    else st.warned = false;
  }

  /* ---------- fundo: algas, ostras, minério, correntes ---------- */
  const CELL = 34, nodes = new Map();
  const rnd = s => { s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0; s = Math.imul(s ^ (s >>> 13), 3266489909) >>> 0; return ((s ^ (s >>> 16)) >>> 0) / 4294967296; };
  function cellNodes(cx, cz) {
    const out = [], s0 = SE(); if (!s0) return out;
    for (let i = 0; i < 4; i++) {
      const sd = (cx * 92821 ^ cz * 68917 ^ i * 31337) >>> 0; if (rnd(sd) < .3) continue;
      const x = cx * CELL + rnd(sd + 1) * CELL, z = cz * CELL + rnd(sd + 2) * CELL, d = s0.d(x, z), dp = depthAt(x, z);
      if (d < 40 || dp < 2) continue;
      let kind = null;
      if (dp < 7) kind = rnd(sd + 3) < .7 ? 'algas' : 'ostra';
      else if (dp < 20) kind = rnd(sd + 3) < .55 ? 'ostra' : rnd(sd + 4) < .5 ? 'algas' : 'veio';
      else kind = rnd(sd + 3) < .5 ? 'veio' : 'ostra';
      out.push({ id: cx + ',' + cz + ':' + i, kind, x, z, dp, ry: rnd(sd + 5) * TAU, s: .8 + rnd(sd + 6) * .5 });
    }
    // corrente abissal: rara, só nas fossas
    const sd = (cx * 7919 ^ cz * 104729) >>> 0, x = cx * CELL + CELL / 2, z = cz * CELL + CELL / 2;
    if (rnd(sd) < .06 && depthAt(x, z) > 26) out.push({ id: cx + ',' + cz + ':c', kind: 'corrente', x, z, dp: depthAt(x, z), ry: 0, s: 1 });
    return out;
  }
  const LBL = { algas: 'F · COLHER ALGAS', ostra: 'F · ABRIR OSTRA GIGANTE', veio: 'F · MINERAR VEIO DO RECIFE', corrente: 'F · CORRENTE ABISSAL (travessia)' };
  function model(n, g) {
    const put = (name, h, w, tint) => U().glb(name).then(t => { if (!t || !nodes.has(n.id)) return; const m = U().fit(t, h, w); if (tint) m.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.emissive = new T.Color(tint); o.material.emissiveIntensity = .6; } }); g.add(m); });
    if (n.kind === 'algas') put('m440/algas', 2.4 * n.s, 1.6 * n.s).catch(() => {});
    if (n.kind === 'ostra') put('m440/ostra', .9 * n.s, 1.3 * n.s);
    if (n.kind === 'veio') { if (window.Mech423 && typeof crystalCluster230 === 'function') g.add(crystalCluster230(Math.min(9, (n.dp / 8) | 0), 1.4 * n.s, false)); }
    if (n.kind === 'corrente' && window.Rift131) { const r = Rift131.create({ seed: 447, legacyLinearOutput: true }); r.scale.setScalar(.6); g.add(r); n.rift = r; }
  }
  function spawn(n) {
    const g = new T.Group(); g.position.set(n.x, 0, n.z); g.rotation.y = n.ry; scene.add(g); n.g = g; nodes.set(n.id, n); model(n, g);
    n.it = { type: 'deep447', x: n.x, z: n.z, r: n.kind === 'corrente' ? 4 : 2.6, label: LBL[n.kind], use: () => use(n) }; L.inter.push(n.it);
  }
  function drop(n) { scene.remove(n.g); if (n.rift && window.Rift131) Rift131.dispose(n.rift); const i = L.inter.indexOf(n.it); if (i >= 0) L.inter.splice(i, 1); nodes.delete(n.id); }
  const nearBottom = n => { const w = W(); return window.Water391?.swimming && w && w.dive >= n.dp - 3.2; };
  function use(n) {
    if (n.kind === 'corrente') { travel(n); return; }
    if (!nearBottom(n)) { toast('Mergulhe até perto do fundo (Ctrl) para alcançar.'); return; }
    const s = S(); if (s.picked[n.id] > (U().S().clock || 0)) return;
    let got = [];
    if (n.kind === 'algas') { const q = U().add('algas', 2 + (Math.random() * 3 | 0), true); if (q) got.push(q + ' Algas'); }
    if (n.kind === 'ostra') { if (Math.random() < .55) { const q = U().add('perola', 1, true); if (q) got.push('1 Pérola'); } else got.push('sem pérola desta vez'); const q2 = U().add('carne', 1, true); if (q2) got.push('1 Carne Crua'); }
    if (n.kind === 'veio') { const q = U().add('minerio', 2 + (Math.random() * 2 | 0), true); if (q) got.push(q + ' Minério'); try { run.res.cry = (run.res.cry || 0) + 1; got.push('+1 Cristal'); } catch (_) {} }
    floater(n.x, n.z, got.join(' · ') || 'BOLSA CHEIA', '#cfe8ff', true);
    try { Anim303?.play('palma', 1.2); } catch (_) {}
    s.picked[n.id] = (U().S().clock || 0) + 1440; drop(n); U().save();
  }
  const SEAS = [['Mar de Thalor — Norte', 0, -2400], ['Mar de Thalor — Sul', 0, 2400], ['Arquipélago das Ilhas-Cidade', -400, 900]];
  function travel(n) {
    const s0 = SE(); let h = '<p>A corrente abissal puxa para longe. Para onde?</p><div style="display:flex;gap:8px;flex-wrap:wrap">';
    SEAS.forEach((q, i) => { h += '<button class="btn" data-i="' + i + '">' + q[0] + '</button>'; });
    openModal('CORRENTE ABISSAL', h + '</div>');
    document.querySelectorAll('#modal [data-i]').forEach(b => b.onclick = () => {
      const q = SEAS[+b.dataset.i]; closeModal();
      let x = n.x + q[1], z = Math.max(-4600, Math.min(4600, n.z + q[2])); // procura água funda no destino
      for (let k = 0; k < 40 && depthAt(x, z) < 4; k++) x -= 40;
      try { fxRing(player.x, player.z, 0x40e0ff, 2, .8); } catch (_) {}
      player.x = x; player.z = z; if (W()) W().dive = 0;
      toast('<b>[CORRENTE]</b> Você sai em ' + q[0] + '.', 4500);
    });
  }
  // monstros de fundo nas fossas
  const foes = []; let foeT = 0;
  function foesTick(dt) {
    for (let i = foes.length - 1; i >= 0; i--) { const e = foes[i]; if (e.dead || Math.hypot(e.x - player.x, e.z - player.z) > 90) { if (!e.dead) { e.dead = true; const j = enemies.indexOf(e); if (j >= 0) enemies.splice(j, 1); scene.remove(e.m?.root); } foes.splice(i, 1); } }
    const w = W(); if (!(window.Water391?.swimming && w && w.dive > 9 && depthAt(player.x, player.z) > 18)) return;
    foeT -= dt; if (foeT > 0 || foes.length >= 3) return; foeT = 18;
    const kinds = ['lula', 'arraia', 'homempeixe'].filter(k => typeof KINDS !== 'undefined' && KINDS[k]); if (!kinds.length) return;
    const a = Math.random() * TAU, x = player.x + Math.cos(a) * 10, z = player.z + Math.sin(a) * 10;
    try { const e = spawnKind(kinds[(Math.random() * kinds.length) | 0], x, z, Math.min(9, rankOf() + 1), { wild: true }); if (e) { e.aggro = true; foes.push(e); toast('<b>[FUNDO]</b> Algo grande se mexe nas fossas.', 3000); } } catch (_) {}
  }

  let key = '', last = performance.now(), slow = 0;
  function loop() {
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
    try {
      if (ready() && !paused) {
        pressureTick(dt); foesTick(dt);
        for (const n of nodes.values()) if (n.rift) Rift131.update(n.rift, dt);
        slow -= dt; if (slow <= 0) { slow = 1;
          const s0 = SE(), near = s0 && s0.d(player.x, player.z) > -200;
          if (!near) { for (const n of [...nodes.values()]) drop(n); key = ''; }
          else { const cx = Math.floor(player.x / CELL), cz = Math.floor(player.z / CELL), k = cx + ',' + cz;
            if (k !== key) { key = k; const want = new Set(), s = S(), clock = U().S().clock || 0;
              for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) for (const n of cellNodes(cx + i, cz + j)) { want.add(n.id); if (!nodes.has(n.id) && !(s.picked[n.id] > clock)) spawn(n); }
              for (const n of [...nodes.values()]) if (!want.has(n.id)) drop(n); } }
          for (const n of nodes.values()) n.it.label = LBL[n.kind] + (n.kind !== 'corrente' && !nearBottom(n) ? ' (mergulhe até o fundo)' : '');
        }
      } else if (typeof L !== 'undefined' && L.mode !== 'world') { for (const n of [...nodes.values()]) drop(n); key = ''; bar.style.display = 'none'; }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('deep447', e); } }
    setTimeout(loop, 33);
  }
  loop();
  window.Deep447 = { pressLimit, nodes, travel, st };
})();
