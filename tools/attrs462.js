/* v462 (Ian): os 9 atributos (run.stats, sistema v281) sobem por TREINO PRÁTICO, com marcos a cada 25 pontos e bônus
   de sobrevivência/exploração. Combate intacto: nada aqui muda dano, defesa, crítico ou velocidade de luta (v281–v283).
   Um ponto ganho no treino é igual a um ponto distribuído: entra em run.stats e vale para as fórmulas de combate de sempre.
   Marcos de 25 (25, 50, 75…): cada ponto acima do marco rende +20% nos bônus de sobrevivência (patamar 1 = ×1,2, 2 = ×1,4…).
   Também: Fome/Sede na ficha (saíram do canto da tela), ← Voltar nas subpáginas e atalho Backspace. */
(function () {
  'use strict';
  const KEYS = ['for', 'des', 'agi', 'per', 'int', 'vit', 'res', 'esp', 'von'];
  const NAME = { for: 'Força', des: 'Destreza', agi: 'Agilidade', per: 'Percepção', int: 'Inteligência', vit: 'Vitalidade', res: 'Resistência', esp: 'Espírito', von: 'Vontade' };
  const GOALS = [10, 20, 30, 50, 75, 100, 150, 200];
  const goal = l => l < GOALS.length ? GOALS[l] : 200 + 50 * (l - GOALS.length + 1);
  const ready = () => typeof started !== 'undefined' && started && typeof run !== 'undefined' && run && run.stats && typeof player !== 'undefined' && player && !(typeof profile !== 'undefined' && profile && profile.creationPending91);
  const pct = x => Math.round(x * 100) + '%';
  const num = x => String(Math.round(x)); // v485: sem número quebrado

  /* ---------- pontos, marcos e patamares ---------- */
  const pts = k => Math.max(0, Math.floor(+((run && run.stats || {})[k]) || 0));
  const tier = k => Math.floor(pts(k) / 25);
  const tierMul = k => 1 + .2 * tier(k);
  // pontos efetivos: os 25 primeiros valem 1, do 26º ao 50º valem 1,2, do 51º ao 75º valem 1,4…
  function eff(k) { const p = pts(k), t = Math.floor(p / 25), r = p - 25 * t; return 25 * (t + .1 * t * (t - 1)) + r * (1 + .2 * t); }
  const red = (k, K, max) => { const e = eff(k); return e > 0 ? Math.round(max * e / (e + K) * 100) / 100 : 0; }; // v485: % inteiro

  function surv() {
    return {
      carryKg: Math.round(.8 * eff('for')), cartRelief: red('for', 60, .8), toolSave: red('for', 50, .6), chopExtra: red('for', 60, .6),
      fishZone: Math.round(12 * eff('des') / (eff('des') + 40)), craftExtra: red('des', 80, .5),
      swim: red('agi', 50, .6), quiet: red('agi', 50, .6),
      gatherExtra: red('per', 50, .7), gatherRare: red('per', 80, .25), reveal: Math.round(6 * eff('per') / (eff('per') + 40)),
      fresh: red('int', 50, .5), tea: red('int', 50, 1),
      breath: Math.floor(eff('vit') / 4), hungerSlow: red('vit', 60, .4), sleep: red('vit', 40, 1),
      climate: red('res', 50, .6), pressure: Math.floor(.15 * eff('res')), fatigue: red('res', 60, .5),
      miasma: red('esp', 40, .8), fuel: red('esp', 50, .6),
      starve: red('von', 50, .6), intox: red('von', 50, .6)
    };
  }
  const S = () => { try { return surv(); } catch (_) { return {}; } };

  /* Texto do bônus de sobrevivência de cada atributo (tooltip da ficha). */
  function survText(k) {
    const s = S();
    return ({
      for: 'Carga máxima +' + num(s.carryKg) + ' kg; carrinho na subida pesa ' + pct(s.cartRelief) + ' menos; ' + pct(s.toolSave) + ' de chance de o machado/picareta não gastar; ' + pct(s.chopExtra) + ' de chance de lenha extra por golpe.',
      des: 'Pesca: zona de fisgada +' + num(s.fishZone) + ' pontos; fabricação (à mão e na Bancada) com ' + pct(s.craftExtra) + ' de chance de render 1 a mais.',
      agi: 'Nado e mergulho ' + pct(s.swim) + ' mais rápidos; no Passo Silencioso as feras só percebem ' + pct(s.quiet) + ' mais de perto.',
      per: pct(s.gatherExtra) + ' de chance de coleta extra e ' + pct(s.gatherRare) + ' de achado raro (ervas, resina, cristal frio); nas Fendas o mapa revela +' + s.reveal + ' casas em volta.',
      int: 'Comida apodrece ' + pct(s.fresh) + ' mais devagar; Chá Térmico e Antídoto duram ' + pct(s.tea) + ' a mais.',
      vit: 'Fôlego debaixo d\'água +' + num(s.breath) + ' s; a Fome cai ' + pct(s.hungerSlow) + ' mais devagar; dormir na Tenda deixa o descanso ' + pct(s.sleep) + ' mais longo.',
      res: 'Frio de Ymiria e calor de Zahar afetam ' + pct(s.climate) + ' menos; fôlego/pressão no fundo +' + num(s.pressure) + ' s; o Cansaço acumula ' + pct(s.fatigue) + ' mais devagar.',
      esp: 'Miasma da Fenda ' + pct(s.miasma) + ' mais fraco (comida apodrece menos lá dentro); lenha da fogueira e tocha rendem ' + pct(s.fuel) + ' mais tempo.',
      von: 'Dano da Fome zerada ' + pct(s.starve) + ' menor; Parasitas e Intoxicação passam ' + pct(s.intox) + ' mais rápido.'
    })[k] || '';
  }
  const TRAIN_TXT = {
    for: 'golpes corpo a corpo, cortar lenha e minerar',
    des: 'ataques à distância, pescar e fabricar',
    agi: 'esquivar, nadar e passo silencioso',
    per: 'golpes críticos e colher recursos',
    int: 'magias, cozinhar e preparar chás',
    vit: 'gastar/recuperar vida e estamina',
    res: 'bloquear dano e puxar carrinho',
    esp: 'gastar mana e explorar fendas',
    von: 'resistir a efeitos e lutar com vida baixa'
  };

  /* ---------- treino ---------- */
  function T() {
    const t = run.train462 || (run.train462 = { c: {}, l: {}, g: {} });
    for (const k of KEYS) { t.c[k] = +t.c[k] || 0; t.l[k] = +t.l[k] || 0; t.g[k] = Math.max(0, +t.g[k] || 0); }
    return t;
  }
  let saveAt = 0;
  function train(k, n = 1) {
    if (!ready() || !KEYS.includes(k) || player.dead || !(n > 0)) return;
    const t = T();
    t.c[k] += n * (1 + .1 * ((typeof profile !== 'undefined' && profile && profile.rebirths) || 0)); /* v465: cada reencarnação deixa o treino 10% mais rápido */
    let up = false;
    while (t.c[k] >= goal(t.l[k])) {
      t.c[k] -= goal(t.l[k]); t.l[k]++;
      run.stats[k] = pts(k) + 1; t.g[k]++; up = true;
      const p = pts(k);
      try { floater(player.x, player.z, '+1 ' + NAME[k].toUpperCase(), '#ffd76a', true, 3); sfx('coin'); } catch (_) {}
      if (p % 25 === 0) {
        try { bigText('MARCO ' + p + ' · ' + NAME[k].toUpperCase(), 1600); } catch (_) {}
        toast('<b>[MARCO ' + p + ' DE ' + NAME[k].toUpperCase() + ']</b> Patamar ' + (p / 25) + ': cada ponto de ' + NAME[k] + ' agora rende +' + Math.round(20 * p / 25) + '% nos bônus de sobrevivência e exploração.', 7000);
      } else {
        toast('<b>[TREINO]</b> ' + NAME[k] + ' subiu para <b>' + p + '</b> com a prática. Próxima meta: 0/' + goal(t.l[k]) + '.', 3500);
      }
    }
    if (up) { try { refreshStats(); } catch (_) {} try { if (typeof hud === 'function') hud(); } catch (_) {} }
    const now = performance.now();
    if (up || now > saveAt) { saveAt = now + 8000; try { saveRun(); } catch (_) {} }
  }

  /* ---------- ganchos de combate (só contam; não mudam números) ---------- */
  let lowHpT = 0, hitTimes = [];
  if (typeof applyPassive === 'function') {
    const ap0 = applyPassive;
    applyPassive = function (e, amt, crit, o) {
      const r = ap0.apply(this, arguments);
      try {
        if (o && o.fromPlayer && !o.pet && !o.passive && amt > 0) {
          const ranged = o.originX != null || o.ptype300 != null || o.longshot != null;
          const mag = o.dtype281 === 'mag' || (typeof curDType281 !== 'undefined' && curDType281 === 'mag' && !o.skillHit);
          if (!o.skillHit) { if (mag) train('int', .5); else if (ranged) train('des'); else train('for'); }
          if (crit) train('per');
          if (player.hp < player.maxhp * .35 && time > lowHpT) { lowHpT = time + 1; train('von'); }
        }
      } catch (_) {}
      return r;
    };
  }
  if (typeof hurtPlayer === 'function') {
    const hp0 = hurtPlayer;
    hurtPlayer = function () {
      const before = player ? player.hp : 0, sh = player ? player.shield || 0 : 0, guard = player && player.guard > 0;
      const r = hp0.apply(this, arguments);
      try {
        if (player && !player.dead && (player.hp < before || (player.shield || 0) < sh || guard)) {
          const phy = typeof inDType281 === 'undefined' || inDType281 !== 'mag';
          if (phy || guard) train('res');
          const now = performance.now(); hitTimes = hitTimes.filter(x => now - x < 5000); hitTimes.push(now);
          if (hitTimes.length >= 3) { hitTimes = []; train('von'); }
        }
      } catch (_) {}
      return r;
    };
  }
  if (typeof dodge === 'function') {
    const dg0 = dodge;
    dodge = function () {
      const cd = player ? player.dodgeCd || 0 : 0;
      const r = dg0.apply(this, arguments);
      try { if (player && (player.dodgeCd || 0) > cd) train('agi'); } catch (_) {}
      return r;
    };
  }
  if (typeof runSkill === 'function') {
    const rs0 = runSkill;
    const MAG = typeof MAGIC_PT281 !== 'undefined' ? MAGIC_PT281 : /^(orb|fire|ice|stone|spark|soul|holy|big|meteor|arcane|rift|time)$/;
    runSkill = function (sk) {
      const r = rs0.apply(this, arguments);
      try {
        const el = sk && (sk.elem300 || sk.elem || sk.el);
        if (sk && (el || MAG.test(sk.t || '') || MAG.test(sk.effect || '') || /fogo|gelo|raio|trov|chama|água|terra|vento|luz|sombra|arcano|magia|feiti/i.test((sk.n || '') + ' ' + (sk.d || '')))) train('int');
      } catch (_) {}
      return r;
    };
  }

  /* ---------- ganchos de movimento: nado mais rápido e passo mais silencioso ---------- */
  if (typeof moveEnt === 'function') {
    const mv0 = moveEnt;
    moveEnt = function (e, dx, dz) {
      try { if (e === player && window.Water391 && Water391.swimming) { const k = 1 + S().swim; dx *= k; dz *= k; } } catch (_) {}
      return mv0.call(this, e, dx, dz);
    };
  }
  if (typeof los === 'function') {
    const los0 = los;
    los = function (x1, z1, x2, z2) {
      try {
        if (window.Mech423 && Mech423.sneaking && player && x2 === player.x && z2 === player.z && !(window.Water391 && Water391.swimming)) {
          const q = S().quiet;
          if (q > 0) {
            const e = enemies.find(o => o.x === x1 && o.z === z1);
            if (e && !e.aggro) { const d = Math.hypot(x2 - x1, z2 - z1), blind = /gosma|slime|cogu|glub/i.test(e.kind || '') || e.blind423, base = blind ? .9 : 3.2; if (d > base * (1 - q)) return false; }
          }
        }
      } catch (_) {}
      return los0.apply(this, arguments);
    };
  }

  /* ---------- redistribuir não devolve ponto de treino ---------- */
  if (typeof redistributeAttributes === 'function') {
    const rd0 = redistributeAttributes;
    redistributeAttributes = function () {
      if (!run || !run.stats) return rd0.apply(this, arguments);
      const g = T().g;
      for (const k of KEYS) run.stats[k] = Math.max(0, pts(k) - Math.min(g[k], pts(k)));
      const r = rd0.apply(this, arguments);
      for (const k of KEYS) run.stats[k] = pts(k) + g[k];
      try { refreshStats(); saveRun(); } catch (_) {}
      return r;
    };
  }

  /* ---------- descrição dos atributos: combate (como era) + sobrevivência + treino ---------- */
  if (typeof statDesc === 'function') {
    const sd0 = statDesc;
    statDesc = function () {
      const d = sd0.apply(this, arguments);
      try {
        if (run && run.stats) for (const k of KEYS) if (d[k]) d[k] = [d[k][0], d[k][1] + ' Treino: ' + TRAIN_TXT[k] + '.'];
      } catch (_) {}
      return d;
    };
  }

  /* ---------- Fome e Sede (e carga/temperatura) na ficha ---------- */
  const SV = () => window.Surv437 && Surv437.S && Surv437.S();
  const col = (v, ok) => v < 25 ? '#ff5d5d' : v < 55 ? '#ffd54f' : ok;
  function meters() {
    const s = SV(); if (!s) return '';
    const w = Surv437.totalW(), mw = Surv437.maxW();
    const bar = (lbl, v, c, tip) => '<div class="a462-meter" data-tip154="' + tip + '" style="cursor:help"><div class="a462-l"><span>' + lbl + '</span><b style="color:' + c + '">' + Math.round(v) + '%</b></div><div class="a462-b"><i style="width:' + Math.max(0, Math.min(100, v)) + '%;background:' + c + '"></i></div></div>';
    const temp = s.temp < 25 ? 'Frio' : s.temp > 75 ? 'Calor' : 'Normal';
    return '<section class="a462-surv"><div class="sec">SOBREVIVÊNCIA</div><div class="a462-grid" style="grid-template-columns:1fr">' +
      bar('Fome', s.hunger, col(s.hunger, '#7ef5a5'), 'Cai com o tempo (mais devagar dentro da cidade). Coma pela mochila [I]. Vitalidade desacelera a queda.') +
      '</div><div class="a462-info"><span>Temperatura: <b>' + temp + '</b> (' + Math.round(s.temp) + '°)</span><span>Carga: <b style="color:' + (w > mw ? '#ff5d5d' : w > mw * .85 ? '#ffd54f' : 'inherit') + '">' + w.toFixed(1) + ' / ' + Math.round(mw) + ' kg</b></span>' +
      (s.intoxT > 0 ? '<span style="color:#ff8fa3">Intoxicado</span>' : '') + (s.sickT > 0 ? '<span style="color:#ff8fa3">Parasitas</span>' : '') +
      '<button class="btn mini" data-a462-surv>Mochila e sobrevivência [I]</button></div></section>';
  }
  function trainLine(k) {
    const t = T(), c = t.c[k], g = goal(t.l[k]);
    return '<span class="a462-train"><span class="a462-tb"><i style="width:' + Math.min(100, c / g * 100).toFixed(0) + '%"></i></span>Treino ' + Math.floor(c) + '/' + g + '</span>';
  }
    function decorateStatus() {
    const mb = document.getElementById('mb'); if (!mb || !run) return;
    if (!mb.querySelector('.a462-surv')) {
      const anchor = mb.querySelector('.c405-points') || mb.querySelector('.guide93');
      if (anchor) anchor.insertAdjacentHTML('afterend', meters());
    }
    for (const k of KEYS) {
      const b = mb.querySelector('[data-stat465="' + k + '"]') || mb.querySelector('button[data-a="stat"][data-v="' + k + '"]');
      const row = b && b.closest('.it'), small = row && row.querySelector('.d small');
      if (small && !row.querySelector('.a462-train')) small.insertAdjacentHTML('afterend', trainLine(k));
    }
  }
  if (typeof statusView === 'function') {
    const sv0 = statusView;
    statusView = function () { const r = sv0.apply(this, arguments); try { decorateStatus(); } catch (e) { console.warn('attrs462', e); } return r; };
  }
  // a ficha da Build ("FICHA DO PERSONAGEM") também mostra Fome e Sede
  if (typeof charSheet === 'function') {
    const cs0 = charSheet;
    charSheet = function () {
      const h = cs0.apply(this, arguments);
      try { const s = SV(); if (s) return h + row('Fome', Math.round(s.hunger) + '%', ''); } catch (_) {}
      return h;
    };
  }
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-a462-surv]'); if (b && window.Surv437) Surv437.open('inv'); });

  /* barras no painel "Ficha" do canto (mesmo estilo de Vida/Estamina) */
  function hudBars() {
    const xp = document.getElementById('xpbar'); const s = SV();
    if (!xp || !s) return;
    let box = document.getElementById('a462hud');
    if (!box || box.nextElementSibling !== xp) {
      if (box) box.remove();
      // v463 (Ian): mesmo bloco do Status (caixinha, nome à esquerda, % colorido à direita, barra embaixo)
      xp.insertAdjacentHTML('beforebegin', '<div id="a462hud" class="a462-grid" title="Fome · clique para abrir a mochila [I]" style="cursor:pointer;pointer-events:auto;grid-template-columns:1fr">' +
        '<div class="a462-meter"><div class="a462-l"><span>Fome</span><b id="a462hFv"></b></div><div class="a462-b"><i id="a462hF"></i></div></div>' +
        '</div>');
      document.getElementById('a462hud').onclick = () => { try { Surv437.open('inv'); } catch (_) {} };
      box = document.getElementById('a462hud');
    }
    const set = (id, v, c) => { const i = document.getElementById(id); if (i) { i.style.width = Math.max(0, Math.min(100, v)).toFixed(0) + '%'; i.style.background = c; } const t = document.getElementById(id + 'v'); if (t) { t.textContent = Math.round(v) + '%'; t.style.color = c; } };
    set('a462hF', s.hunger, col(s.hunger, '#7ef5a5'));
  }
  const css = document.createElement('style');
  css.textContent = '.a462-surv{margin:10px 0 4px}.a462-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.a462-meter{background:rgba(255,255,255,.03);border:1px solid rgba(201,164,92,.25);border-radius:6px;padding:7px 10px}.a462-l{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px}.a462-b{height:6px;background:rgba(0,0,0,.5);border-radius:3px;overflow:hidden}.a462-b i{display:block;height:100%}.a462-info{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;font-size:12px;opacity:.9;margin-top:7px}.a462-info .btn{margin-left:auto}.a462-train{display:flex;align-items:center;gap:6px;font-size:11px;opacity:.85;margin-top:3px;flex-wrap:wrap}.a462-tb{width:54px;height:4px;background:rgba(0,0,0,.5);border-radius:2px;overflow:hidden;display:inline-block}.a462-tb i{display:block;height:100%;background:#d6b468}#a462hud{margin:6px 0 4px;gap:6px}#a462hud .a462-meter{padding:5px 8px}#a462hud .a462-l{font-size:11px;margin-bottom:4px}#a462hud .a462-b{height:5px}@media (max-width:520px){.a462-grid{grid-template-columns:1fr}}';
  document.head.appendChild(css);

  /* ---------- ← Voltar sempre que houver página anterior, e Backspace ---------- */
  window.addEventListener('keydown', e => {
    if (e.key !== 'Backspace' || typeof modalOpen === 'undefined' || !modalOpen) return;
    const t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    e.preventDefault(); e.stopPropagation();
    const mb = document.getElementById('mb'), close = mb && mb.querySelector('[data-c405-close]');
    if (close) { close.click(); return; }
    const back = document.getElementById('mback118');
    if (back && !back.hidden) { try { modalBack118(); } catch (_) {} }
  }, true);

  /* ---------- treino por sobrevivência e ritmo (a cada 0,25 s) ---------- */
  const acc = { hp: 0, st: 0, mp: 0, rift: 0, clim: 0, swim: 0, dive: 0, sneak: 0, cart: 0, seen: 0 };
  let last = null, lastSeen = null, lastT = performance.now();
  setInterval(() => {
    const now = performance.now(), dt = Math.min(.5, (now - lastT) / 1000); lastT = now;
    try {
      if (!ready() || player.dead) { last = null; return; }
      const t = T();
      for (const k of KEYS) if (t.g[k] > pts(k)) t.g[k] = pts(k); // reencarnação/troca de classe zeram atributos
      if (typeof paused !== 'undefined' && paused) { last = null; hudBars(); return; }
      const P = player, cur = { hp: P.hp, st: +P.stamina372 || 0, mp: P.mp || 0, slow: +P.slowT || 0, stun: +P.stun || 0, bleed: +P.bleedT || 0, x: P.x, z: P.z };
      const s = SV();
      if (last) {
        acc.hp += Math.abs(cur.hp - last.hp) / Math.max(1, P.maxhp);
        if (cur.st < last.st) acc.st += (last.st - cur.st) / 100;
        acc.mp += Math.abs(cur.mp - last.mp) / Math.max(1, P.maxmp || 1);
        if (acc.hp >= .25) { acc.hp -= .25; train('vit'); }
        if (acc.st >= .5) { acc.st -= .5; train('vit'); }
        if (acc.mp >= .4) { acc.mp -= .4; train('esp'); }
        if ((cur.slow > last.slow + .2) || (cur.stun > last.stun + .1) || (cur.bleed > last.bleed + .2)) train('von');
        const moved = Math.hypot(cur.x - last.x, cur.z - last.z);
        const swim = window.Water391 && Water391.swimming, W = window.Mech423 && Mech423.Water;
        if (swim && moved > .01) { acc.swim += dt; if (acc.swim >= 4) { acc.swim = 0; train('agi'); } }
        if (swim && W && W.dive > .2) { acc.dive += dt; if (acc.dive >= 3) { acc.dive = 0; train('vit'); } }
        if (window.Mech423 && Mech423.sneaking && !swim && moved > .01) { acc.sneak += dt; if (acc.sneak >= 5) { acc.sneak = 0; train('agi'); } }
        const cart = window.Cart437 && Cart437.st && Cart437.st();
        if (cart && cart.pulling) { acc.cart += moved; if (acc.cart >= 25) { acc.cart = 0; train('res'); } }
      }
      if (typeof L !== 'undefined' && L && L.mode === 'dungeon') {
        acc.rift += dt; if (acc.rift >= 30) { acc.rift = 0; train('esp'); }
        const seen = L.seen ? L.seen.size : 0;
        if (lastSeen != null && seen > lastSeen) train('per', seen - lastSeen);
        lastSeen = seen;
      } else lastSeen = null;
      if (s) {
        if (s.temp < 25 || s.temp > 75) { acc.clim += dt; if (acc.clim >= 20) { acc.clim = 0; train('res'); } }
        if ((s.intoxT > 0 && !(last && last.intox > 0)) || (s.sickT > 0 && !(last && last.sick > 0))) train('von');
        cur.intox = s.intoxT; cur.sick = s.sickT;
        // Resistência: o Cansaço (v287) acumula mais devagar
        const f = S().fatigue; if (f > 0 && run.awake287 > 0) run.awake287 = Math.max(0, run.awake287 - dt * f);
      }
      last = cur;
      hudBars();
    } catch (err) { console.warn('attrs462', err); }
  }, 250);

  window.Attr462 = { KEYS, GOALS, goal, pts, tier, tierMul, eff, surv: S, survText, train, T, meters, decorateStatus };
})();
