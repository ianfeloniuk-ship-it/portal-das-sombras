/* v642 (Ian, 27/10/2026): SISTEMA DE MANA — PDF "Primeva — Sistema de Mana (proposta) v4".
   Regeneração lenta por hora do JOGO, núcleos com mana (tipo × rank × ameaça), extração em 9 graus,
   16 acessórios que guardam mana. Tudo em números inteiros. window.Mana642. */
(function () {
  'use strict';
  const HOUR = 150;                                   // 1 h do jogo = 2 min 30 s reais (DAYLEN 3600 / 24)
  const BASE = { comum: 5, elite: 20, chefe: 50, fenda: 120, dragao: 300 };
  const KIND_N = { comum: 'comum', elite: 'elite', chefe: 'chefe elite', fenda: 'chefe de Fenda', dragao: 'dragão' };
  const FR = [1, 2, 4, 7, 12, 20, 35, 60, 90, 140];  // fator do rank F..Estrela
  const THR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 12]; // índice THREAT184 (10 = Inefável, 11 = Supremo)
  const GRAU = [ // nome, rank máx., nível mín., treino p/ próximo, porção, aproveitamento, segundos, ouro p/ chegar
    ['Aprendiz', 0, 1, 10, 20, 30, 60, 0], ['Iniciado', 1, 8, 15, 40, 40, 55, 300],
    ['Praticante', 2, 20, 20, 80, 50, 50, 1200], ['Oficial', 3, 35, 30, 160, 60, 45, 4500],
    ['Adepto', 4, 55, 40, 320, 70, 40, 15000], ['Perito', 5, 80, 60, 640, 80, 35, 48000],
    ['Mestre', 6, 120, 80, 1280, 90, 30, 150000], ['Alto Mestre', 7, 180, 100, 2560, 95, 25, 450000],
    ['Grão-Mestre', 8, 220, 0, 5120, 100, 20, 1400000]];
  const RAR = ['Comum', 'Raro', 'Épico', 'Lendário', 'Mítico', 'Divino', 'Primordial', 'Primeva'];
  const RBASE = [20, 30, 45, 70, 100, 150, 220, 320];
  const SLOTS = []; // [chave, nome, peso]
  for (let i = 0; i < 10; i++) SLOTS.push(['a' + i, 'Anel ' + (i + 1), 1]);
  SLOTS.push(['e0', 'Brinco 1', 1], ['e1', 'Brinco 2', 1], ['b0', 'Bracelete 1', 2], ['b1', 'Bracelete 2', 2], ['n', 'Colar', 3], ['c', 'Coroa', 5]);
  const GEMS = ['g0', 'g1', 'g2'];
  const gid = (n) => (typeof GR !== 'undefined' && GR[n]) ? GR[n].id : ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SS+', '★'][n];
  const R = () => (typeof run !== 'undefined') ? run : null;
  let hold = null, bar = null, lastMp = null, lastHp = null, restOld = null;

  function coreMana(kind, rank, threat) { return (BASE[kind] || 5) * (FR[rank] || 1) * (THR[threat] || 1); }

  function ensure() {
    const r = R(); if (!r) return null;
    let m = r.mana642;
    if (!m) {
      m = r.mana642 = { v: 1, g: 1, t: 0, hh: 0, last: -99, acc: 0, up: 0 };
      // migração: o anel de mana (+10% de regeneração) vira anel comum de reserva
      r.acc642 = r.acc642 || {};
      if (r.manaRing372) { r.acc642.a0 = { r: 0, rar: 0, m: 0 }; r.manaRing372 = null; }
    }
    r.acc642 = r.acc642 || {}; r.nuc642 = r.nuc642 || [];
    r.res = r.res || {}; r.res.core = r.res.core || []; r.res.cry = r.res.cry || [];
    for (let i = 0; i < 10; i++) { r.res.core[i] = Math.max(0, Math.floor(+r.res.core[i] || 0)); r.res.cry[i] = Math.max(0, Math.floor(+r.res.cry[i] || 0)); }
    sync();
    if (!m.gift) { m.gift = 1; if (!r.nuc642.length) { r.res.core[0]++; r.nuc642.push(mk(0, 'chefe', 0)); } try { setTimeout(() => toast('<b>[MANA]</b> A mana volta devagar, 1 por hora do jogo. Núcleos dão mana, mas extrair é difícil e o grau sobe com o uso. Acessórios guardam a sobra. Veja na ficha (Status).', 9000), 2500); } catch (_) { } }
    return m;
  }
  function mk(rank, kind, threat) { const M = coreMana(kind, rank, threat); return { r: rank, k: kind, th: threat, m: M, M, c: 0 }; }
  // res.core[rank] é a contagem usada por Domo/forja/venda; nuc642 guarda a mana de cada núcleo.
  function sync() {
    const r = R(); if (!r) return;
    for (let k = 0; k < 10; k++) {
      let n = 0; for (const c of r.nuc642) if (c.r === k) n++;
      const want = r.res.core[k];
      while (n > want) { let bi = -1; r.nuc642.forEach((c, i) => { if (c.r === k && (bi < 0 || c.m < r.nuc642[bi].m)) bi = i; }); r.nuc642.splice(bi, 1); n--; }
      while (n < want) { r.nuc642.push(mk(k, 'comum', 0)); n++; }
    }
  }
  function got(x) { // chamado ao pegar um saque de núcleo
    const r = R(); if (!r) return; r.nuc642 = r.nuc642 || [];
    const n = Math.max(1, x.n | 0);
    for (let i = 0; i < n; i++) r.nuc642.push({ r: x.rank, k: x.k || 'comum', th: x.th || 0, m: x.m != null ? x.m : coreMana(x.k || 'comum', x.rank, x.th || 0), M: x.m != null ? x.m : coreMana(x.k || 'comum', x.rank, x.th || 0), c: 0 });
    // res.core já foi somado por quem chamou
  }
  function drop(e) { // tipo, chance e mana do núcleo de uma criatura
    const L_ = (typeof L !== 'undefined') ? L : {};
    const s = String((e.mon || '') + ' ' + (e.kind || '') + ' ' + (e.n || '')).toLowerCase();
    let kind = 'comum', ch = .1;
    if (/drac|drag/.test(s)) { kind = 'dragao'; ch = 1; }
    else if (e.isBoss) { kind = (L_.mode && L_.mode !== 'world') ? 'fenda' : 'chefe'; ch = 1; }
    else if (e.elite) { kind = 'elite'; ch = 1 / 3; }
    const gr = Math.max(0, Math.min(9, e.gr ?? 0)), th = e.threat184 || 0;
    return { kind, ch, n: 1, m: coreMana(kind, gr, th), th };
  }

  // ---------- regeneração ----------
  function nearFire() { // fogueira acesa a até 6 m (Build437)
    try { return Build437.st().some(b => b.kind === 'fogueira' && b.fuel > 0 && Math.hypot(b.x - player.x, b.z - player.z) < 6); } catch (_) { return false; }
  }
  function slept(n) { addMana(n); }
  function perHour() {
    const r = R(), P = player; if (!r) return 0;
    let h = (P.resourceRest258 || nearFire()) ? 2 : 1;
    h += Math.min(7, Math.floor((r.level || 1) / 100));
    try { h += Math.floor(cons('res') / 25); } catch (_) { }
    return h;
  }
  function accCap(k) { const a = R().acc642[k]; if (!a) return 0; const s = SLOTS.find(s => s[0] === k); return RBASE[a.rar] * FR[a.r] * (s ? s[2] : 1); }
  function gemCap(k) { const a = R().acc642[k]; return a ? RBASE[a.rar] : 0; }
  function capOf(k) { return k[0] === 'g' ? gemCap(k) : accCap(k); }
  function allKeys() { return SLOTS.map(s => s[0]).concat(R().acc642.c ? GEMS : []); }
  function accTotals() { let s = 0, c = 0; for (const k of allKeys()) { const a = R().acc642[k]; if (a) { s += a.m | 0; c += capOf(k); } } return { s, c }; }
  function accFree() { const t = accTotals(); return t.c - t.s; }
  function accPut(n) { // enche acessórios (menor capacidade primeiro); devolve o que coube
    let left = n; const ks = allKeys().filter(k => R().acc642[k]).sort((a, b) => capOf(a) - capOf(b));
    for (const k of ks) { if (left <= 0) break; const a = R().acc642[k], f = capOf(k) - (a.m | 0), t = Math.min(f, left); if (t > 0) { a.m = (a.m | 0) + t; left -= t; } }
    return n - left;
  }
  function accPull(n) { // tira da peça de menor capacidade para a de maior
    let got_ = 0; const ks = allKeys().filter(k => R().acc642[k] && R().acc642[k].m > 0).sort((a, b) => capOf(a) - capOf(b));
    for (const k of ks) { if (got_ >= n) break; const a = R().acc642[k], t = Math.min(a.m | 0, n - got_); a.m -= t; got_ += t; }
    return got_;
  }
  function topUp(need) { // chamado antes de gastar mana: com a barra baixa, puxa dos acessórios
    const r = R(), P = player; if (!r || !P || !r.mana642) return;
    if (P.mp >= need) return;
    const pulled = accPull(Math.ceil(Math.min(P.maxmp, Math.max(need, 1)) - P.mp));
    if (pulled > 0) P.mp = Math.min(P.maxmp, P.mp + pulled);
  }
  function addMana(n) { // mana nova: barra primeiro, depois acessórios; devolve quanto coube
    const P = player, inBar = Math.max(0, Math.min(n, Math.floor(P.maxmp - P.mp)));
    P.mp += inBar; return inBar + accPut(n - inBar);
  }
  function tick(dt) {
    const r = R(), P = typeof player !== 'undefined' ? player : null; if (!r || !P || P.dead || typeof paused !== 'undefined' && paused) return;
    const m = ensure(); if (!m) return;
    m.hh += dt / HOUR;
    // sono: pousada/casa deram mana de uma vez; aqui vale 32 por noite (8 h × 4)
    if (lastMp != null && r.rested && r.rested.t >= 595 && P.mp - lastMp > 3 && restOld !== r.rested) { P.mp = Math.min(P.maxmp, lastMp + 32); restOld = r.rested; toast('<b>[MANA]</b> Dormir devolveu 32 de mana.'); }
    if (!r.rested) restOld = null;
    m.acc += dt / HOUR * perHour();
    if (m.acc >= 1) { const n = Math.floor(m.acc); m.acc -= n; addMana(n); }
    if (P.mp < 1) topUp(1);
    lastMp = P.mp;
    if (hold) holdTick(dt, P);
  }

  // ---------- extração ----------
  function grau() { return GRAU[Math.max(0, Math.min(8, (ensure().g | 0) - 1))]; }
  function errChance(c) {
    const g = grau(), d = g[1] - c.r; let e = d <= 0 ? 30 : d === 1 ? 18 : d === 2 ? 10 : 4;
    e += 10 * (c.c | 0);
        return Math.max(1, Math.min(90, e));
  }
  function yieldPct() { let y = grau()[5]; try { y += Math.min(10, Math.floor(cons('alq') / 5)); } catch (_) { } return Math.min(100, y); }
  function canExtract(i) {
    const r = R(), c = r.nuc642[i], g = grau(), m = ensure(); if (!c) return 'Núcleo inexistente.';
    if (c.r > g[1]) return 'Seu grau só extrai núcleos até o rank ' + gid(g[1]) + '.';
    if (m.hh - m.last < 1) return 'Fadiga: espere ' + Math.ceil((1 - (m.hh - m.last)) * HOUR) + ' s (1 hora do jogo).';
    if (c.m <= 0) return 'Núcleo vazio.';
    if (Math.floor(player.maxmp - player.mp) + accFree() <= 0) return 'Sem espaço: barra de mana e acessórios cheios.';
    if (typeof enemies !== 'undefined' && enemies.some(e => !e.dead && !e.ally && !e.statue && e.aggro && Math.hypot(e.x - player.x, e.z - player.z) < 25)) return 'Não dá para extrair em combate.';
    if (hold) return 'Você já está extraindo.';
    return '';
  }
  function startExtract(i) {
    const why = canExtract(i); if (why) { toast('<b>[EXTRAÇÃO]</b> ' + why); return false; }
    const g = grau(); hold = { i, t: 0, T: g[6], hp: player.hp, core: R().nuc642[i] };
    ensureBar(); toast('<b>[EXTRAÇÃO]</b> Extraindo por ' + g[6] + ' s. Qualquer dano cancela.'); return true;
  }
  function ensureBar() {
    if (bar) return; bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;left:50%;top:56%;width:220px;height:6px;margin-left:-110px;background:#0007;border:1px solid #fff4;border-radius:3px;z-index:30;display:none;pointer-events:none';
    bar.innerHTML = '<div style="height:100%;width:0;background:#6fa8ff;border-radius:3px"></div>'; document.body.appendChild(bar);
  }
  function holdTick(dt, P) {
    if (P.hp < hold.hp - 0.01) { cancel('Dano recebido: a extração foi cancelada e o núcleo não foi gasto.'); return; }
    hold.hp = P.hp;
    if (hold.t === 0 || true) { hold.t += dt; }
    bar.style.display = 'block'; bar.firstChild.style.width = Math.min(100, hold.t / hold.T * 100) + '%';
    if (hold.t >= hold.T) finish();
  }
  function cancel(msg) { hold = null; if (bar) bar.style.display = 'none'; if (msg) toast('<b>[EXTRAÇÃO]</b> ' + msg); }
  function finish(forceRoll) {
    const r = R(), m = ensure(), c = hold ? hold.core : null; cancel();
    if (!c || r.nuc642.indexOf(c) < 0) return;
    m.last = m.hh;
    const err = errChance(c), roll = forceRoll != null ? forceRoll : Math.random() * 100;
    if (roll < err) { // quebrou
      r.nuc642.splice(r.nuc642.indexOf(c), 1); r.res.core[c.r] = Math.max(0, r.res.core[c.r] - 1);
      toast('<b>[EXTRAÇÃO]</b> O núcleo ' + gid(c.r) + ' quebrou (' + err + ' de chance de erro). Nada foi extraído.', 6000); try { sfx('block'); } catch (_) { }
      try { saveRun(); } catch (_) { } return { ok: false, err };
    }
    const g = grau(), y = yieldPct();
    let take = Math.min(g[4], c.m), gain = Math.floor(take * y / 100);
    const room = Math.floor(player.maxmp - player.mp) + accFree();
    if (gain > room) { gain = room; take = Math.min(take, Math.ceil(gain * 100 / y)); }
    const put = addMana(gain); c.m -= take; c.c = (c.c | 0) + 1;
    let msg = '<b>[EXTRAÇÃO]</b> Saíram ' + take + ' de mana do núcleo e entraram ' + put + '.';
    if (c.m <= 0) { r.nuc642.splice(r.nuc642.indexOf(c), 1); r.res.core[c.r] = Math.max(0, r.res.core[c.r] - 1); msg += ' O núcleo esvaziou.'; }
    if (c.r >= g[1] - 1 && g[3] > 0) { m.t = Math.min(g[3], (m.t | 0) + 1); msg += ' Treino ' + m.t + '/' + g[3] + '.'; }
    toast(msg, 6000); try { sfx('coin'); } catch (_) { }
    try { saveRun(); } catch (_) { }
    return { ok: true, take, put, err };
  }
  function inCityNow() { try { return !!inCity(player.x, player.z) && L.mode === 'world'; } catch (_) { return false; } }
  function levelUp() {
    const r = R(), m = ensure(), g = grau(), nx = GRAU[m.g]; if (!nx) return 'Você já é Grão-Mestre.';
    if (!inCityNow()) return 'Procure o Mestre de Extração em uma cidade.';
    if (m.t < g[3]) return 'Falta Treino: ' + m.t + '/' + g[3] + '.';
    if ((r.level || 1) < nx[2]) return 'Exige nível ' + nx[2] + '.';
    if (r.gold < nx[7]) return 'Exige ' + fmt(nx[7]) + ' de ouro.';
    r.gold -= nx[7]; m.g++; m.t = 0;
    toast('<b>[EXTRAÇÃO]</b> O Mestre de Extração ensinou o grau ' + nx[0] + ' (núcleos até ' + gid(nx[1]) + ').', 7000); try { saveRun(); } catch (_) { } return '';
  }

  // ---------- telas ----------
  function coreRows() {
    const r = R(), m = ensure(); let h = '';
    r.nuc642.map((c, i) => [c, i]).sort((a, b) => b[0].r - a[0].r || b[0].m - a[0].m).slice(0, 14).forEach(([c, i]) => {
      const ok = !canExtract(i);
      h += row('Núcleo ' + gid(c.r) + ' · ' + KIND_N[c.k] + (c.th ? ' (' + THREAT184[c.th].n + ')' : ''), 'Mana no núcleo: ' + c.m + (c.M !== c.m ? ' de ' + c.M : '') + ' · Erro: ' + errChance(c) + '%' + (c.r > grau()[1] ? ' · rank acima do seu grau' : ''), btn('Extrair', 'm642x', i, ok));
    });
    return h || '<div class="sysline" style="font-size:12px">Você não tem núcleos. Criaturas deixam núcleos ao cair.</div>';
  }
  function fichaHtml() {
    const r = R(), m = ensure(), g = grau(), nx = GRAU[m.g], t = accTotals(), fat = Math.max(0, Math.ceil((1 - (m.hh - m.last)) * HOUR));
    let h = '<div class="sec">MANA E EXTRAÇÃO</div>';
    h += tipRow('Regeneração de mana', perHour() + ' por hora do jogo', 'A mana volta devagar: 1 por hora do jogo (1 hora = 2 min 30 s). Parado ou perto da fogueira: 2. Dormir na pousada: 32 por noite. Dentro das Fendas conta o relógio normal. +1 a cada 100 níveis e +1 a cada 25 pontos de Restauração.', '');
    h += tipRow('Extração: grau ' + m.g + ' · ' + g[0], 'Núcleos até ' + gid(g[1]) + ' · porção ' + g[4] + ' · aproveitamento ' + yieldPct() + '% · ' + g[6] + ' s' + (g[3] ? ' · Treino ' + m.t + '/' + g[3] : ''), 'Cada extração tira até ' + g[4] + ' de mana do núcleo; ' + yieldPct() + '% entram em você. Erro quebra o núcleo e cada extração do mesmo núcleo soma 10 de erro. Entre uma extração e outra passa 1 hora do jogo' + (fat ? ' (faltam ' + fat + ' s)' : '') + '. Qualquer dano cancela. O Treino sobe só com núcleos do rank do seu grau ou de 1 abaixo.', '');
    if (nx) h += row('Mestre de Extração (cidades)', 'Grau ' + nx[0] + ': Treino cheio, nível ' + nx[2] + ', ' + fmt(nx[7]) + ' de ouro.', btn('Subir de grau', 'm642up', 0, true));
    h += tipRow('Acessórios', t.s + ' de ' + t.c + ' de mana guardada', 'Anéis, brincos, braceletes, colar e coroa guardam mana. Com a barra cheia a mana nova vai para eles; com a barra vazia o jogo puxa deles ao lançar.', '');
    h += coreRows();
    return h;
  }
  function accHtml(shop) {
    const r = R(), m = ensure(); let h = '<div class="sec">ACESSÓRIOS DE MANA (' + accTotals().s + '/' + accTotals().c + ')</div>';
    const pr = Math.min(9, (typeof rankOf === 'function') ? rankOf() : 0);
    const keys = SLOTS.map(s => s[0]).concat(r.acc642.c ? GEMS : []);
    for (const k of keys) {
      const a = r.acc642[k], s = SLOTS.find(s => s[0] === k), nm = s ? s[1] : 'Gema ' + (+k[1] + 1);
      const desc = a ? RAR[a.rar] + ' ' + gid(a.r) + ' · ' + (a.m | 0) + '/' + capOf(k) + ' de mana' : 'Vazio';
      let b = '';
      if (shop) for (let q = 0; q < 3; q++) {
        const cap = k[0] === 'g' ? RBASE[q] : RBASE[q] * FR[pr] * s[2], price = cap * 4, cur = a ? capOf(k) : 0;
        b += btn(RAR[q] + ' · ' + fmt(price), 'm642buy', k + ':' + q, r.gold >= price && cap > cur);
      }
      h += row(nm, desc, b);
    }
    return h;
  }
  function action(a, v) {
    const r = R(); if (!r) return;
    if (a === 'm642x') { if (startExtract(+v)) { try { closeModal(); } catch (_) { } return 'close'; } return 'close0'; }
    if (a === 'm642up') { const e = levelUp(); if (e) toast('<b>[EXTRAÇÃO]</b> ' + e); try { statusView(); } catch (_) { } return 'close0'; }
    if (a === 'm642buy') {
      const [k, q] = String(v).split(':'), qi = +q, s = SLOTS.find(s => s[0] === k), pr = Math.min(9, rankOf());
      if (!(s || GEMS.includes(k)) || !(qi >= 0 && qi < 3)) return 'close0';
      if (k[0] === 'g' && !r.acc642.c) return 'close0';
      const cap = k[0] === 'g' ? RBASE[qi] : RBASE[qi] * FR[pr] * s[2], price = cap * 4, old = r.acc642[k];
      if (r.gold < price || cap <= (old ? capOf(k) : 0)) return 'close0';
      r.gold -= price; r.acc642[k] = { r: k[0] === 'g' ? 0 : pr, rar: qi, m: old ? Math.min(old.m | 0, cap) : 0 };
      toast('<b>[MERCADO]</b> Você comprou ' + (s ? s[1] : 'uma gema') + ' ' + RAR[qi] + ' (guarda ' + cap + ' de mana).'); try { saveRun(); mktView(); } catch (_) { } return 'close0';
    }
  }
  function install() {
    if (typeof naturalRegen !== 'function') return;
    const nr = naturalRegen; naturalRegen = function () { const x = nr.apply(this, arguments); x.mp = 0; return x; };
    const rt = resourceTick260; resourceTick260 = function (dt) { rt(dt); try { tick(dt); } catch (e) { console.error('Mana642', e); } };
    const re = resourceError260; resourceError260 = function (s, mp) { try { const q = resourceQuote261(s); if (q.mana > 0) topUp(q.mana); } catch (_) { } return re.call(this, s, mp === undefined ? player.mp : (mp === player.mp ? player.mp : mp)); };
    const oa = extraActions; extraActions = function (a, v) { if (typeof a === 'string' && a.startsWith('m642')) return action(a, v); return oa.apply(this, arguments); };
    const sv = statusView; statusView = function () { const x = sv.apply(this, arguments); try { ensure(); $('mb').insertAdjacentHTML('beforeend', fichaHtml()); } catch (e) { console.error(e); } return x; };
    const bv = bagView; bagView = function (tab) { const x = bv.apply(this, arguments); try { if ((tab || 'itens') === 'itens') { ensure(); $('mb').insertAdjacentHTML('beforeend', accHtml(false)); } } catch (e) { console.error(e); } return x; };
    const mv = mktView; mktView = function () { const x = mv.apply(this, arguments); try { ensure(); $('mb').insertAdjacentHTML('beforeend', '<div class="sec">DORIAN · ACESSÓRIOS DE MANA</div><div class="sysline" style="font-size:12px">Peças do seu rank. Cada uma guarda mana. A coroa aceita 3 gemas.</div>' + accHtml(true)); } catch (e) { console.error(e); } return x; };
  }
  window.Mana642 = { slept, nearFire, install, ensure, sync, got, drop, coreMana, tick, topUp, addMana, startExtract, finish, canExtract, levelUp, errChance, perHour, accTotals, GRAU, FR, THR, BASE, HOUR, state: () => ({ hold, mana: R()?.mana642 }) , _hold: () => hold, _setHold: (h) => { hold = h; } };
  install();
})();
