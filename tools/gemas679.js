/* v681 (Ian, 29/10/2026): GEMAS pelo Sistema de Mana v4 (aprovado). A v679 tinha números que não estavam no PDF
   (3 engastes à parte, gema enchendo ao abater, dobro para o mago, gema de mana gasta antes da barra) — saíram.
   Agora: as gemas ficam nos 3 engastes da coroa (Mana642, run.acc642.g0..g2), capacidade = base da raridade × fator
   do rank. Gema de mana segue o v4 (Mana642). Gema de VIDA (ideia de Ian, adendo 12): mesmo engaste e mesma
   capacidade; enche com a cura que passaria do máximo; paga os golpes que custam vida (campo vida679 da habilidade)
   ANTES do corpo; o golpe nunca deixa você abaixo de 1 de vida. window.Gemas679. */
(function () {
  'use strict';
  const GEMS = ['g0', 'g1', 'g2'];
  const RAR = ['Comum', 'Raro', 'Épico'];
  const RBASE = [20, 30, 45];
  const FR = [1, 2, 4, 7, 12, 20, 35, 60, 90, 140];
  const R = () => (typeof run !== 'undefined') ? run : null;
  const gid = (n) => (typeof GR !== 'undefined' && GR[n]) ? GR[n].id : ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SS+', '★'][n];
  const prank = () => { try { return Math.max(0, Math.min(9, rankOf() | 0)); } catch (_) { return 0; } };
  const acc = () => { const r = R(); if (!r) return null; r.acc642 = r.acc642 || {}; return r.acc642; };
  let hpAcc = 0;

  function capOf(g) { return g ? RBASE[g.rar] * FR[g.r | 0] : 0; }
  function lifeGems() { const a = acc(); return a && a.c ? GEMS.map(k => a[k]).filter(g => g && g.t === 'vida') : []; }
  function total() { return lifeGems().reduce((s, g) => s + (g.m | 0), 0); }
  function room() { return lifeGems().reduce((s, g) => s + capOf(g) - (g.m | 0), 0); }
  function put(n) { n = Math.floor(n); let left = n; for (const g of lifeGems().sort((a, b) => capOf(a) - capOf(b))) { if (left <= 0) break; const f = Math.min(capOf(g) - (g.m | 0), left); if (f > 0) { g.m = (g.m | 0) + f; left -= f; } } return n - left; }
  function pull(n) { n = Math.ceil(n); let got = 0; for (const g of lifeGems().sort((a, b) => capOf(a) - capOf(b))) { if (got >= n) break; const f = Math.min(g.m | 0, n - got); g.m -= f; got += f; } return got; }

  // v679 → v681: os engastes à parte saem; a mana guardada vai para a barra e os acessórios, o ouro das gemas compradas volta
  function migrate() {
    const r = R(); if (!r || !r.gem679 || r.gem679.v681) return;
    const old = r.gem679; let mana = 0, gold = 0;
    (old.s || []).forEach((g, i) => { if (!g) return; if (g.t === 'mana') mana += g.m | 0; const cap = [20, 30, 45, 70, 100, 150, 220, 320][g.rar] * FR[g.r | 0] * 3; if (!(i === 0 && g.t === 'mana' && g.rar === 0)) gold += cap * 4; });
    let put_ = 0; try { put_ = Mana642.addMana(mana); } catch (_) { }
    r.gold = (r.gold || 0) + gold; r.gem679 = { v681: 1 };
    try { setTimeout(() => toast('<b>[GEMAS]</b> As gemas agora seguem o Sistema de Mana: ficam nos 3 engastes da coroa. ' + (put_ ? put_ + ' de mana guardada voltou para você. ' : '') + (gold ? fmt(gold) + ' de ouro das gemas compradas foi devolvido.' : ''), 9000), 3000); } catch (_) { }
    try { saveRun(); } catch (_) { }
  }

  // ---------- custo em vida (golpes de sangue) ----------
  function lifeCost(s) { let c = 0; const parts = s && s.combo261 ? s.parts261 : [s]; for (const p of parts || []) if (p && !p.empty) c += Math.max(0, Math.floor(+p.vida679 || 0)); return c; }
  function lifeAvail() { return total() + Math.max(0, Math.ceil(player.hp) - 1); }
  function payLife(n) {
    n = Math.max(0, Math.floor(n)); if (!n) return true;
    if (lifeAvail() < n) return false;
    const rest = n - pull(n);
    if (rest > 0) player.hp = Math.max(1, player.hp - rest);
    return true;
  }

  // a cura que passaria do máximo vai para a gema de vida
  function tick(dt) {
    const P = (typeof player !== 'undefined') ? player : null; if (!R() || !P || P.dead) return;
    migrate();
    if (P.hp >= P.maxhp - 0.01 && room() > 0) {
      let h = 0; try { const nc = nearestCity(P.x, P.z), safe = L.mode === 'world' && nc.d < Math.max(36 * CITYK, cityBig533(nc.c)) && !cityFallen(nc.c); h = naturalRegen(P, safe).hp; } catch (_) { try { h = naturalRegen(P).hp; } catch (__) { } }
      hpAcc += h * dt;
      if (hpAcc >= 1) { const n = Math.floor(hpAcc); hpAcc -= n; put(n); }
    } else hpAcc = 0;
  }

  // ---------- Dorian: gemas de vida para a coroa ----------
  function shopHtml() {
    const r = R(), a = acc(), pr = prank(); if (!r || !a) return '';
    let h = '<div class="sec">DORIAN · GEMAS DE VIDA</div><div class="sysline" style="font-size:12px">' + (a.c ? 'Vão num engaste da coroa, no lugar de uma gema de mana. Guardam vida para os golpes que custam vida e enchem com a cura que passaria do máximo.' : 'Gemas ficam nos engastes da coroa. Compre uma coroa primeiro.') + '</div>';
    if (!a.c) return h;
    GEMS.forEach((k, i) => {
      const g = a[k], cur = g && g.t === 'vida' ? capOf(g) : 0; let b = '';
      for (let q = 0; q < 3; q++) { const cap = RBASE[q] * FR[pr], p = cap * 4; b += btn(RAR[q] + ' · ' + fmt(p), 'g679buy', k + ':' + q, r.gold >= p && cap > cur); }
      h += row('Gema ' + (i + 1), g ? (g.t === 'vida' ? 'Gema de vida ' : 'Gema de mana ') + RAR[g.rar] + ' ' + gid(g.r) + ' · ' + (g.m | 0) + '/' + (g.t === 'vida' ? capOf(g) + ' de vida' : Mana642.gemCap(k) + ' de mana') : 'Vazio', b);
    });
    return h;
  }
  function action(a, v) {
    const r = R(), A = acc(); if (!r || !A) return 'close0';
    if (a === 'g679buy') {
      const [k, q] = String(v).split(':'), qi = +q, pr = prank();
      if (!GEMS.includes(k) || !(qi >= 0 && qi < 3) || !A.c) return 'close0';
      const cap = RBASE[qi] * FR[pr], p = cap * 4, old = A[k];
      if (r.gold < p || (old && old.t === 'vida' && capOf(old) >= cap)) return 'close0';
      r.gold -= p;
      if (old && old.t !== 'vida' && (old.m | 0) > 0) { const m = old.m | 0; A[k] = null; try { Mana642.addMana(m); } catch (_) { } }
      A[k] = { t: 'vida', r: pr, rar: qi, m: old && old.t === 'vida' ? Math.min(old.m | 0, cap) : 0 };
      toast('<b>[MERCADO]</b> Você comprou uma gema de vida ' + RAR[qi] + ' (guarda ' + cap + ' de vida).');
      try { saveRun(); mktView(); } catch (_) { } return 'close0';
    }
  }

  function install() {
    if (typeof resourcePay260 !== 'function') return;
    const re = resourceError260;
    resourceError260 = function (s, mp) { const e = re.apply(this, arguments); if (e) return e; const c = lifeCost(s); return c && lifeAvail() < c ? 'SEM VIDA' : ''; };
    const rp = resourcePay260;
    resourcePay260 = function (s, returning) {
      if (!returning && s && !s.empty && lifeCost(s) && lifeAvail() < lifeCost(s)) { try { floater(player.x, player.z, 'SEM VIDA', '#ffca80'); } catch (_) { } return null; }
      const out = rp.apply(this, arguments);
      if (out && !returning) { const c = lifeCost(s); if (c) { payLife(c); out.vida = c; } }
      return out;
    };
    const rt = resourceText260;
    resourceText260 = function (s, level) { const x = rt.apply(this, arguments), c = lifeCost(s); return c ? (x === 'Sem custo' ? '' : x + ' + ') + c + ' vida' : x; };
    const tk = resourceTick260;
    resourceTick260 = function (dt) { tk(dt); try { if (!(typeof paused !== 'undefined' && paused)) tick(dt); } catch (e) { console.error('Gemas679', e); } };
    const hd = hud;
    hud = function () { const x = hd.apply(this, arguments); try { if (lifeGems().length) $('hpt').textContent += ' · gema ' + total(); } catch (_) { } return x; };
    const oa = extraActions;
    extraActions = function (a, v) { if (typeof a === 'string' && a.startsWith('g679')) return action(a, v); return oa.apply(this, arguments); };
    const mv = mktView;
    mktView = function () { const x = mv.apply(this, arguments); try { $('mb').insertAdjacentHTML('beforeend', shopHtml()); } catch (e) { console.error(e); } return x; };
  }
  window.Gemas679 = { total, room, put, pull, payLife, lifeCost, lifeAvail, lifeGems, capOf, tick, migrate, install };
  install();
})();
