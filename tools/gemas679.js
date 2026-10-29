/* v679 (Ian, 29/10/2026): GEMAS DE MANA E DE VIDA — adendo 12 do Roteiro (versão final 2).
   3 engastes de gema. A gema é gasta ANTES da barra. Gema de mana: enche com a essência de cada criatura que você
   abate (a mana do núcleo dela; magos o dobro) e com a sobra da regeneração. Gema de vida: enche com a mesma essência
   e com a cura que passaria do máximo; paga os golpes que custam vida (campo vida679 da habilidade) e o golpe
   nunca mata quem usa. Tudo em números inteiros. window.Gemas679. */
(function () {
  'use strict';
  const RAR = ['Comum', 'Raro', 'Épico', 'Lendário', 'Mítico', 'Divino', 'Primordial', 'Primeva'];
  const RBASE = [20, 30, 45, 70, 100, 150, 220, 320];
  const FR = [1, 2, 4, 7, 12, 20, 35, 60, 90, 140];
  const MULT = 3, SLOTS = 3, PER_FRAME = 3;
  const TN = { mana: 'mana', vida: 'vida' };
  const R = () => (typeof run !== 'undefined') ? run : null;
  const gid = (n) => (typeof GR !== 'undefined' && GR[n]) ? GR[n].id : ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SS+', '★'][n];
  const prank = () => { try { return Math.max(0, Math.min(9, rankOf() | 0)); } catch (_) { return 0; } };

  function capOf(g) { return g ? RBASE[g.rar] * FR[g.r] * MULT : 0; }
  function st() {
    const r = R(); if (!r) return null;
    let s = r.gem679;
    if (!s) {
      s = r.gem679 = { s: [null, null, null], hpAcc: 0 };
      s.s[0] = { t: 'mana', rar: 0, r: prank(), m: 0 };
      try { setTimeout(() => toast('<b>[GEMAS]</b> Você ganhou uma Gema de Mana. Ela é gasta antes da sua barra e enche com a essência de cada criatura que você abate. Dorian vende gemas de mana e de vida.', 9000), 4000); } catch (_) { }
    }
    if (!Array.isArray(s.s)) s.s = [null, null, null];
    while (s.s.length < SLOTS) s.s.push(null);
    for (const g of s.s) if (g) g.m = Math.max(0, Math.min(capOf(g), Math.floor(+g.m || 0)));
    return s;
  }
  function gems(t) { const s = st(); return s ? s.s.filter(g => g && g.t === t) : []; }
  function total(t) { return gems(t).reduce((a, g) => a + (g.m | 0), 0); }
  function room(t) { return gems(t).reduce((a, g) => a + capOf(g) - (g.m | 0), 0); }
  // enche a gema mais vazia primeiro; devolve quanto coube
  function put(t, n) {
    n = Math.floor(n); let left = n;
    for (const g of gems(t).sort((a, b) => (a.m / capOf(a)) - (b.m / capOf(b)))) { if (left <= 0) break; const f = Math.min(capOf(g) - (g.m | 0), left); if (f > 0) { g.m += f; left -= f; } }
    return n - left;
  }
  // gasta da gema mais cheia primeiro; devolve quanto saiu
  function pull(t, n) {
    n = Math.ceil(n); let got = 0;
    for (const g of gems(t).sort((a, b) => b.m - a.m)) { if (got >= n) break; const f = Math.min(g.m | 0, n - got); g.m -= f; got += f; }
    return got;
  }

  // ---------- custo em vida (golpes de sangue) ----------
  function lifeCost(s) { let c = 0; const parts = s && s.combo261 ? s.parts261 : [s]; for (const p of parts || []) if (p && !p.empty) c += Math.max(0, Math.floor(+p.vida679 || 0)); return c; }
  function lifeAvail() { const P = player; return total('vida') + Math.max(0, Math.ceil(P.hp) - 1); }
  // paga n de vida: primeiro a gema, depois o corpo; nunca deixa você abaixo de 1 de vida
  function payLife(n) {
    n = Math.max(0, Math.floor(n)); if (!n) return true;
    if (lifeAvail() < n) return false;
    const fromGem = pull('vida', n), rest = n - fromGem;
    if (rest > 0) player.hp = Math.max(1, player.hp - rest);
    return true;
  }

  // ---------- coleta ----------
  function absorb(e) {
    const s = st(); if (!s || !e) return;
    let m = 5; try { m = Mana642.drop(e).m; } catch (_) { }
    m = Math.max(1, Math.floor(m));
    let mage = false; try { mage = Mana642.isMage(); } catch (_) { }
    const a = put('mana', mage ? m * 2 : m), b = put('vida', m);
    if (a + b > 0) try { floater(e.x, e.z, (a ? '+' + a + ' mana' : '') + (a && b ? ' · ' : '') + (b ? '+' + b + ' vida' : '') + ' na gema', a ? '#8fb8ff' : '#ff6b6b'); } catch (_) { }
  }
  function tick(dt) {
    const s = st(), P = (typeof player !== 'undefined') ? player : null; if (!s || !P || P.dead) return;
    // gema primeiro: a barra de mana é reposta pela gema (até 3 por quadro)
    const need = Math.floor(P.maxmp - P.mp);
    if (need > 0 && total('mana') > 0) P.mp += pull('mana', Math.min(need, PER_FRAME));
    // cura que passaria do máximo vai para a gema de vida
    if (P.hp >= P.maxhp - 0.01 && gems('vida').length && room('vida') > 0) {
      let h = 0; try { const nc = nearestCity(P.x, P.z), safe = L.mode === 'world' && nc.d < Math.max(36 * CITYK, cityBig533(nc.c)) && !cityFallen(nc.c); h = naturalRegen(P, safe).hp; } catch (_) { try { h = naturalRegen(P).hp; } catch (__) { } }
      s.hpAcc = (s.hpAcc || 0) + h * dt;
      if (s.hpAcc >= 1) { const n = Math.floor(s.hpAcc); s.hpAcc -= n; put('vida', n); }
    } else s.hpAcc = 0;
  }

  // ---------- telas ----------
  function name(g) { return 'Gema de ' + (g.t === 'mana' ? 'Mana' : 'Vida') + ' ' + RAR[g.rar] + ' ' + gid(g.r); }
  function price(t, q, r_) { return RBASE[q] * FR[r_] * MULT * 4; }
  function bagHtml() {
    const s = st(); if (!s) return '';
    let h = '<div class="sec">GEMAS (' + total('mana') + ' de mana · ' + total('vida') + ' de vida)</div>';
    h += '<div class="sysline" style="font-size:12px">A gema é gasta antes da barra. Cada criatura que você abate enche as gemas com a essência dela (a mana do núcleo dela; magos recebem o dobro de mana). A gema de vida também guarda a cura que passaria do máximo e paga os golpes que custam vida.</div>';
    s.s.forEach((g, i) => {
      h += row('Engaste ' + (i + 1), g ? name(g) + ' · ' + (g.m | 0) + '/' + capOf(g) + ' de ' + TN[g.t] : 'Vazio', g ? btn('Vender · ' + fmt(price(g.t, g.rar, g.r) / 2), 'g679sell', i, !!inCity0()) : '');
    });
    return h;
  }
  function inCity0() { try { return !!inCity(player.x, player.z); } catch (_) { return true; } }
  function shopHtml() {
    const s = st(), r = R(), pr = prank(); if (!s) return '';
    let h = '<div class="sec">DORIAN · GEMAS</div><div class="sysline" style="font-size:12px">Gemas do seu rank. Vão para um engaste vazio ou trocam a gema menor do mesmo tipo.</div>';
    for (const t of ['mana', 'vida']) {
      let b = '';
      for (let q = 0; q < 3; q++) { const p = price(t, q, pr); b += btn(RAR[q] + ' · ' + fmt(p), 'g679buy', t + ':' + q, r.gold >= p && !!slotFor(t, RBASE[q] * FR[pr] * MULT)); }
      h += row('Gema de ' + (t === 'mana' ? 'Mana' : 'Vida') + ' ' + gid(pr), 'Guarda ' + RBASE[0] * FR[pr] * MULT + ', ' + RBASE[1] * FR[pr] * MULT + ' ou ' + RBASE[2] * FR[pr] * MULT + ' de ' + TN[t] + '.', b);
    }
    return h;
  }
  function slotFor(t, cap) { // engaste vazio, ou a gema menor do mesmo tipo se a nova guarda mais
    const s = st(); const e = s.s.indexOf(null); if (e >= 0) return { i: e };
    let bi = -1; s.s.forEach((g, i) => { if (g.t === t && (bi < 0 || capOf(g) < capOf(s.s[bi]))) bi = i; });
    return bi >= 0 && capOf(s.s[bi]) < cap ? { i: bi } : null;
  }
  function action(a, v) {
    const r = R(), s = st(); if (!r || !s) return 'close0';
    if (a === 'g679buy') {
      const [t, q] = String(v).split(':'), qi = +q, pr = prank();
      if (!TN[t] || !(qi >= 0 && qi < 3)) return 'close0';
      const cap = RBASE[qi] * FR[pr] * MULT, p = price(t, qi, pr), sl = slotFor(t, cap);
      if (r.gold < p || !sl) return 'close0';
      const old = s.s[sl.i]; r.gold -= p;
      s.s[sl.i] = { t, rar: qi, r: pr, m: old && old.t === t ? Math.min(old.m | 0, cap) : 0 };
      toast('<b>[MERCADO]</b> Você comprou ' + name(s.s[sl.i]) + ' (guarda ' + cap + ' de ' + TN[t] + ').');
      try { saveRun(); mktView(); } catch (_) { } return 'close0';
    }
    if (a === 'g679sell') {
      const i = +v, g = s.s[i]; if (!g || !inCity0()) return 'close0';
      const p = Math.floor(price(g.t, g.rar, g.r) / 2); r.gold += p; s.s[i] = null;
      toast('<b>[GEMAS]</b> Você vendeu ' + name(g) + ' por ' + fmt(p) + ' de ouro.');
      try { saveRun(); bagView(); } catch (_) { } return 'close0';
    }
  }

  function install() {
    if (typeof resourcePay260 !== 'function' || typeof killEnemy !== 'function') return;
    const re = resourceError260;
    resourceError260 = function (s, mp) {
      const base = mp === undefined ? player.mp : mp;
      const e = re.call(this, s, base + total('mana')); if (e) return e;
      const c = lifeCost(s); if (c && lifeAvail() < c) return 'SEM VIDA';
      return '';
    };
    const rp = resourcePay260;
    resourcePay260 = function (s, returning) {
      let pulled = 0;
      if (!returning && s && !s.empty) {
        if (resourceError260(s)) { try { floater(player.x, player.z, resourceError260(s), '#ffca80'); } catch (_) { } return null; }
        const q = resourceQuote261(s); if (q.mana > 0) { pulled = pull('mana', q.mana); player.mp += pulled; }
      }
      const out = rp.apply(this, arguments);
      if (!out) { if (pulled) { player.mp -= pulled; put('mana', pulled); } return out; }
      player.mp = Math.min(player.maxmp, player.mp);
      if (!returning) { const c = lifeCost(s); if (c) { payLife(c); out.vida = c; } }
      return out;
    };
    const rt = resourceText260;
    resourceText260 = function (s, level) { const x = rt.apply(this, arguments), c = lifeCost(s); return c ? (x === 'Sem custo' ? '' : x + ' + ') + c + ' vida' : x; };
    const ke = killEnemy;
    killEnemy = function (e) { const was = !!(e && e.dead); const x = ke.apply(this, arguments); try { if (!was && e && e.dead && !e.ally && !e.statue && !e.noExpLoot) absorb(e); } catch (er) { console.error('Gemas679', er); } return x; };
    const tk = resourceTick260;
    resourceTick260 = function (dt) { tk(dt); try { if (!(typeof paused !== 'undefined' && paused)) tick(dt); } catch (e) { console.error('Gemas679', e); } };
    const hd = hud;
    hud = function () {
      const x = hd.apply(this, arguments);
      try { const m = total('mana'), v = total('vida'); if (m || gems('mana').length) $('mpt').textContent += ' · gema ' + m; if (gems('vida').length) $('hpt').textContent += ' · gema ' + v; } catch (_) { }
      return x;
    };
    const oa = extraActions;
    extraActions = function (a, v) { if (typeof a === 'string' && a.startsWith('g679')) return action(a, v); return oa.apply(this, arguments); };
    const bv = bagView;
    bagView = function (tab) { const x = bv.apply(this, arguments); try { if ((tab || 'itens') === 'itens') $('mb').insertAdjacentHTML('beforeend', bagHtml()); } catch (e) { console.error(e); } return x; };
    const mv = mktView;
    mktView = function () { const x = mv.apply(this, arguments); try { $('mb').insertAdjacentHTML('beforeend', shopHtml()); } catch (e) { console.error(e); } return x; };
  }
  window.Gemas679 = { st, total, room, put, pull, payLife, lifeCost, lifeAvail, absorb, tick, capOf, install, RBASE, FR };
  install();
})();
