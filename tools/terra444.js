/* v444 (Ian): terraplenagem suave, sem blocos (estilo Valheim / Planet Crafter).
   Cada uso da ferramenta vira um "carimbo" salvo em run.terra444.st ({x,z,r,t,v}); o relevo (tools/terrain245.js:
   terra444 no shader e terra444cpu no CPU) aplica os 48 mais perto do jogador por último, com borda suave, e as normais
   do chão saem do próprio relevo. Tipos: 0 cavar/aterrar (soma v metros), 1 nivelar (puxa até a altura v),
   2 trilha de terra batida e 3 calçamento de pedra (nivelam e pintam o chão com o visual de estrada).
   Ferramentas (Manual de Sobrevivência): Pá de Terraplenagem (cavar/aterrar/nivelar), Enxada Pesada (nivelar e trilha),
   Picareta (cavar rocha e calçamento). Tecla 9 (tela de teclas) abre/fecha o modo; F aplica no círculo do chão. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const U = () => window.Surv437;
  const TER = () => window.TER245;
  const ready = () => U() && U().ready() && U().world();
  const S = () => { const s = run.terra444 || (run.terra444 = {}); s.st = s.st || []; return s; };
  const MODES = [
    { id: 'nivelar', n: 'NIVELAR', tip: 'Deixa o círculo na altura exata dos seus pés (chão reto para fundações).', tools: ['pa', 'enxada'] },
    { id: 'cavar', n: 'CAVAR', tip: 'Rebaixa o chão e dá Terra, Areia, Argila ou Pedra.', tools: ['pa', 'picareta'] },
    { id: 'aterrar', n: 'ATERRAR', tip: 'Eleva o chão usando Terra, Areia, Argila ou Pedra da bolsa (rampas, aterros).', tools: ['pa'] },
    { id: 'trilha', n: 'TRILHA', tip: 'Terra batida: chão plano e firme; o carrinho não gasta estamina subindo nela.', tools: ['enxada', 'pa'] },
    { id: 'calcar', n: 'CALÇAMENTO', tip: 'Calçamento de pedra (2 Pedra Lascada): igual à trilha, mais bonito e o carrinho anda mais rápido.', tools: ['picareta'] }
  ];
  const TOOLN = { pa: 'Pá de Terraplenagem', enxada: 'Enxada Pesada', picareta: 'Picareta' };
  const st = { on: false, mode: 0, r: 3 };

  /* ---------- itens e receitas ---------- */
  function addItems() {
    if (!U() || !window.Build437) { setTimeout(addItems, 300); return; }
    Object.assign(U().IT, {
      terra: { n: 'Terra', kg: 3, d: 'Sai ao cavar. Serve para aterrar e fazer rampas.' },
      areia: { n: 'Areia', kg: 3, d: 'Sai ao cavar no deserto e na praia. Aterra como a Terra.' },
      argila: { n: 'Argila', kg: 3, d: 'Sai ao cavar perto da água e no pântano. Aterra como a Terra.' },
      enxada: { n: 'Enxada Pesada', kg: 3, d: 'Nivela o chão e abre trilha de terra batida (modo terraplenagem: tecla 9).' },
      picareta: { n: 'Picareta', kg: 3, d: 'Cava rocha (dá Pedra Lascada) e faz calçamento de pedra.' }
    });
    if (U().IT.pa) U().IT.pa.n = 'Pá de Terraplenagem';
  }
  addItems();
  const has = k => U().has(k) || (k === 'picareta' && typeof weaponKind272 === 'function' && /pick/.test(weaponKind272(run.equip?.w) || ''));
  const toolFor = m => MODES[m].tools.find(has);

  /* ---------- enviar os carimbos ao relevo ---------- */
  let sent = '';
  function upload(force) {
    const t = TER(); if (!t) return;
    const s = S(), px = player.x, pz = player.z, key = Math.round(px / 16) + ',' + Math.round(pz / 16) + ',' + s.st.length + ',' + (s.ver || 0);
    if (!force && key === sent) return; sent = key;
    let near = []; s.st.forEach((q, i) => { const d = Math.hypot(q.x - px, q.z - pz); if (d < 320) near.push([d, i]); });
    if (near.length > 48) near = near.sort((a, b) => a[0] - b[0]).slice(0, 48);
    near.sort((a, b) => a[1] - b[1]); // mesma ordem em que foram feitos
    const A = t.TF.value; near.forEach(([, i], k) => { const q = s.st[i]; A[k].set(q.x, q.z, q.r + 100 * q.t, q.v); });
    for (let k = near.length; k < 48; k++) A[k].set(0, 0, 0, 0);
    t.TFN.value = near.length; t.lx = null;
  }
  function stamp(x, z, r, t, v) {
    const s = S(), last = s.st[s.st.length - 1];
    if (last && last.t === t && Math.abs(last.r - r) < .01 && Math.hypot(last.x - x, last.z - z) < .6) { if (t === 0) last.v = Math.max(-8, Math.min(8, last.v + v)); else last.v = v; s.ver = (s.ver || 0) + 1; }
    else s.st.push({ x: Math.round(x * 100) / 100, z: Math.round(z * 100) / 100, r, t, v: Math.round(v * 1000) / 1000 });
    if (s.st.length > 3000) s.st.splice(0, s.st.length - 3000);
    upload(true); U().save();
  }
  const H = (x, z) => typeof terrH === 'function' ? terrH(x, z) : 0;

  /* ---------- círculo no chão ---------- */
  const SEG = 56, ringGeo = new T.BufferGeometry(), ringPos = new Float32Array((SEG + 1) * 2 * 3), idx = [];
  for (let i = 0; i < SEG; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, b, c, b, d, c); }
  ringGeo.setAttribute('position', new T.BufferAttribute(ringPos, 3)); ringGeo.setIndex(idx);
  const ringMat = new T.MeshBasicMaterial({ color: 0xff9a1f, transparent: true, opacity: .85, depthWrite: false, side: T.DoubleSide });
  const ring = new T.Mesh(ringGeo, ringMat); ring.userData.terrainAbsolute245 = true; ring.frustumCulled = false; ring.renderOrder = 7; ring.visible = false; scene.add(ring);
  const target = () => { const f = player.face || 0, d = st.r + 1.2; return [player.x + Math.sin(f) * d, player.z + Math.cos(f) * d]; };
  function ringTick() {
    ring.visible = st.on && ready(); if (!ring.visible) return;
    const [x, z] = target(), r = st.r;
    for (let i = 0; i <= SEG; i++) {
      const a = i / SEG * TAU, c = Math.cos(a), s = Math.sin(a);
      for (const [k, rr] of [[0, r - .22], [1, r + .22]]) { const px = x + c * rr, pz = z + s * rr, o = (i * 2 + k) * 3; ringPos[o] = px; ringPos[o + 1] = H(px, pz) + .08; ringPos[o + 2] = pz; }
    }
    ringGeo.attributes.position.needsUpdate = true; ringGeo.computeBoundingSphere();
    ringMat.color.set(toolFor(st.mode) ? 0xff9a1f : 0xff7b6b);
  }

  /* ---------- aplicar ---------- */
  function vig(cost) { try { const r = martialState260(); if (r.vigor < cost) { toast('Sem fôlego para cavar. Espere a estamina voltar.'); return false; } r.vigor -= cost; r.vigorWait = .8; } catch (_) {} return true; }
  function soilAt(x, z, deep) {
    const b = typeof biomeAt === 'function' ? biomeAt(x, z) : '';
    if (deep || (TER()?.mt383 && TER().mt383(x, z) > 2)) return 'pedra';
    if (b === 'deserto' || (window.Sea439 && TER()?.SEA439 && TER().SEA439.d(x, z) > -80)) return 'areia';
    if (b === 'pantano' || (window.Water391 && [[3, 0], [-3, 0], [0, 3], [0, -3]].some(([a, c]) => Water391.waterAt(x + a, z + c)))) return 'argila';
    return 'terra';
  }
  function apply() {
    if (!ready()) return;
    const m = MODES[st.mode], tool = toolFor(st.mode);
    if (!tool) { toast('Para <b>' + m.n + '</b> você precisa de: ' + m.tools.map(k => TOOLN[k]).join(' ou ') + ' (Manual de Sobrevivência).', 5000); return; }
    const [x, z] = target(), r = st.r;
    if (typeof nearestCity === 'function' && nearestCity(x, z).d < 60 * (typeof CITYK !== 'undefined' ? CITYK : 1)) { toast('Dentro da cidade o chão é calçado: não dá para cavar aqui.'); return; }
    const foot = H(player.x, player.z), here = H(x, z), s = S();
    try { Anim303?.play(m.id === 'cavar' || m.id === 'calcar' ? 'esmagar' : 'varrer', 1.1); sfx('hit'); } catch (_) {}
    if (m.id === 'nivelar') { if (!vig(6)) return; stamp(x, z, r, 1, foot); floater(x, z, 'NIVELADO', '#e9dfc0'); }
    else if (m.id === 'cavar') {
      const base = (s.orig = s.orig || {}), k = Math.round(x) + ',' + Math.round(z); if (base[k] == null) base[k] = here;
      const deep = base[k] - here > 2.2, soil = soilAt(x, z, deep);
      if (soil === 'pedra' && tool !== 'picareta') { toast('Aqui é rocha: precisa da <b>Picareta</b>.'); return; }
      if (!vig(soil === 'pedra' ? 12 : 8)) return;
      stamp(x, z, r, 0, -.35); const got = U().add(soil, soil === 'pedra' ? 2 : 1, true);
      floater(x, z, got ? '+' + got + ' ' + U().IT[soil].n : 'BOLSA CHEIA', '#cfe8a0');
    }
    else if (m.id === 'aterrar') {
      const mat = ['terra', 'areia', 'argila', 'pedra'].find(k => U().has(k)); if (!mat) { toast('Para aterrar, traga <b>Terra</b>, Areia, Argila ou Pedra na bolsa (cave em outro lugar).'); return; }
      if (!vig(7)) return; U().take(mat, 1); stamp(x, z, r, 0, .35); floater(x, z, '−1 ' + U().IT[mat].n, '#e9dfc0');
    }
    else if (m.id === 'trilha') { if (!vig(4)) return; stamp(x, z, Math.max(2, r), 2, here * .5 + foot * .5); floater(x, z, 'TERRA BATIDA', '#d8c08a'); }
    else if (m.id === 'calcar') { if (!U().has('pedra', 2)) { toast('Calçamento: 2 Pedra Lascada por passo.'); return; } if (!vig(6)) return; U().take('pedra', 2); stamp(x, z, Math.max(2, r), 3, here * .5 + foot * .5); floater(x, z, 'CALÇAMENTO', '#e0e0e0'); }
    try { fxRing(x, z, 0xe3b86a, r * .5, .45); } catch (_) {}
  }

  /* ---------- modo, barra e F ---------- */
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:150px;z-index:44;display:none;gap:6px;align-items:center;background:#122019e6;border:1px solid #b9974f;border-radius:8px;padding:5px 8px;font:600 11px system-ui;color:#e9dfc0';
  document.body.appendChild(bar);
  function drawBar() {
    bar.innerHTML = '<b style="margin-right:4px">TERRAPLENAGEM</b>' + MODES.map((m, i) => '<button class="btn" data-m="' + i + '" title="' + m.tip + ' Ferramenta: ' + m.tools.map(k => TOOLN[k]).join(' ou ') + '." style="padding:3px 8px;font-size:11px;' + (i === st.mode ? 'background:#5a4514;border-color:#ffd36b' : '') + (toolFor(i) ? '' : ';opacity:.55') + '">' + m.n + '</button>').join('') +
      '<button class="btn" data-r="-1" style="padding:3px 7px;font-size:11px" title="Círculo menor">−</button><span>' + st.r + ' m</span><button class="btn" data-r="1" style="padding:3px 7px;font-size:11px" title="Círculo maior">+</button><button class="btn" data-x="1" style="padding:3px 8px;font-size:11px" title="Sair (tecla 9)">✕</button>';
    bar.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { st.mode = +b.dataset.m; drawBar(); });
    bar.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { st.r = Math.max(2, Math.min(6, st.r + +b.dataset.r)); drawBar(); });
    bar.querySelector('[data-x]').onclick = () => setOn(false);
  }
  function placeBar() { const bot = ['stat', 'quest401'].map(i => document.getElementById(i)).filter(e => e && e.offsetParent).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 60); bar.style.top = Math.round(bot + 8) + 'px'; }
  function setOn(on) {
    if (on && !['pa', 'enxada', 'picareta'].some(has)) { toast('Faça uma <b>Pá de Terraplenagem</b>, <b>Enxada Pesada</b> ou <b>Picareta</b> no Manual de Sobrevivência.', 5000); return; }
    st.on = !!on; bar.style.display = st.on ? 'flex' : 'none'; if (st.on) { drawBar(); placeBar(); toast('<b>[TERRAPLENAGEM]</b> F aplica no círculo amarelo à sua frente. 9 fecha.', 4000); }
  }
  const fIt = { type: 'terra444', x: 0, z: 0, r: 1.3, label: '', hidden: true, use: () => apply() };
  const KEY = 'terra444';
  try { if (!KEYACT.find(k => k[0] === KEY)) KEYACT.push([KEY, 'Terraplenagem (modo)', 'Digit9']); } catch (_) {}
  addEventListener('keydown', e => {
    if (e.repeat || !ready()) return; const t = e.target; if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
    let k = 'Digit9'; try { k = keyOf(KEY); } catch (_) {}
    if (e.code === k && !(typeof modalOpen !== 'undefined' && modalOpen)) { e.preventDefault(); setOn(!st.on); }
  }, true);
  (function menu() { const ref = document.getElementById('bSurv437'); if (!ref) { setTimeout(menu, 600); return; } if (document.getElementById('bTerra444')) return; const a = document.createElement('button'); a.className = 'mini'; a.id = 'bTerra444'; a.textContent = 'TERRAPLENAGEM'; a.onclick = () => { if (ready()) setOn(!st.on); }; ref.after(a); })();

  /* ---------- carrinho na trilha: sem custo de subida e mais rápido ---------- */
  const pathAt = (x, z) => TER()?.path444 ? TER().path444(x, z) : 0;
  if (typeof movementSpeed === 'function') { const ms0 = movementSpeed; movementSpeed = function (raw) { try { if (window.Cart437?.pulling()) { const p = pathAt(player.x, player.z); if (p > .3) raw *= 1 + .12 * p + (p > .9 ? .08 : 0); } } catch (_) {} return ms0(raw); }; }

  let last = performance.now(), lastRun = null;
  function loop() {
    const now = performance.now(); last = now;
    try {
      if (ready()) {
        if (run !== lastRun) { lastRun = run; sent = ''; }
        upload(false); ringTick();
        fIt.hidden = !st.on; fIt.x = player.x; fIt.z = player.z; fIt.label = 'F · ' + MODES[st.mode].n + (toolFor(st.mode) ? '' : ' (falta ferramenta)');
        const i = L.inter.indexOf(fIt); if (!fIt.hidden && i < 0) L.inter.push(fIt); else if (fIt.hidden && i >= 0) L.inter.splice(i, 1);
      } else { ring.visible = false; if (st.on && typeof L !== 'undefined' && L.mode !== 'world') setOn(false); if (TER() && typeof L !== 'undefined' && L.mode !== 'world') { TER().TFN.value = 0; sent = ''; } }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('terra444', e); } }
    setTimeout(loop, 33);
  }
  loop();
  window.Terra444 = { MODES, st, setOn, apply, stamp, upload, pathAt, S };
})();
