/* v551 (Ian, 22/10/2026): Forja da Ordem + Laboratório de Alquimia.
   - FORJA · ORDEM DOS ARTÍFICES: reúne criar (núcleos+minérios por rank da Fenda, regra 'forge' já existente) e refinar
     (+8% por nível, regra de aprimoramento já existente) — agora também para peças que estão na bolsa.
   - ALQUIMIA · LABORATÓRIO: misture 2 a 4 ingredientes (plantas, sais minerais, essências de cristal da Fenda).
     O resultado vem das propriedades dos ingredientes; cada receita nova fica no Diário e pode ser repetida.
     Essência de cristal + mistura de bebida = Elixir Eterno (bônus permanente, com teto por atributo).
   Salvo em profile.fa551 = { disc:{chave:{out,n}}, perm:{hp,atk,mana,spd,shield}, tried:n }. */
(function () {
  'use strict';
  const PERM_CAP = 0.12;
  const PERM_STAT = {
    hp:     { n: 'Vida',      ico: '♥' },
    atk:    { n: 'Ataque',    ico: '⚔' },
    mana:   { n: 'Mana',      ico: '✦' },
    spd:    { n: 'Velocidade', ico: '➤' },
    shield: { n: 'Escudo',    ico: '◈' }
  };
  const PERM_BY_OUT = { pocao_cura_forte: 'hp', pocao_regeneracao: 'hp', pocao_vitalidade: 'hp', pocao_vigor: 'spd', pocao_luz: 'mana', pocao_resistencia: 'shield', frasco_fogo: 'atk' };

  /* propriedades de cada ingrediente */
  const PROPS = {
    erva_cura: { vida: 2 }, raiz_sangue: { vida: 1, vigor: 1 }, flor_serena: { vida: 1, calma: 1 },
    erva_vigor: { vigor: 2 }, cogu_venenoso: { veneno: 2 }, liquen_acido: { acido: 2 },
    flor_brasa: { fogo: 2 }, musgo_glacial: { gelo: 2 }, fungo_luz: { luz: 3, choque: 2 }, folha_sombra: { sombra: 2 },
    pedra: { fixa: 1 }, lasca: { acido: 1 }, resina: { fogo: 1, fixa: 1 }, cristal_frio: { gelo: 1 }
  };
  const SALTS = ['pedra', 'lasca', 'resina', 'cristal_frio'];
  const PLANTS = ['erva_cura', 'raiz_sangue', 'flor_serena', 'erva_vigor', 'cogu_venenoso', 'liquen_acido', 'flor_brasa', 'musgo_glacial', 'fungo_luz', 'folha_sombra'];
  const SMELL = { vida: 'seiva verde e doce', vigor: 'tronco jovem e suor', veneno: 'mofo azedo', acido: 'metal queimado', fogo: 'brasa seca', gelo: 'neve esmagada', luz: 'brilho frio', choque: 'ar antes da tempestade', sombra: 'poeira de tumba', calma: 'flores de orvalho', fixa: 'sal limpo' };

  const S = () => window.Surv437;
  const P = () => { profile.fa551 = profile.fa551 || {}; const f = profile.fa551; f.disc = f.disc || {}; f.perm = f.perm || {}; f.tried = f.tried || 0; return f; };
  const persist = () => { try { store.set('pds2_profile', profile); } catch (_) {} try { saveRun(); } catch (_) {} try { S()?.save(); } catch (_) {} };
  const rk = r => (typeof GR !== 'undefined' && GR[r]) ? GR[r].id : String(r);
  const itemName = id => (S()?.ITEMS?.[id]?.n) || id;
  const esc = s => (typeof safeText === 'function' ? safeText(s) : String(s));

  /* ---------- elixires eternos: um item por atributo × rank ---------- */
  function permPct(r) { return 0.004 * (r + 1); }
  function registerPerm() {
    const IT = S()?.ITEMS; if (!IT) return;
    for (const st of Object.keys(PERM_STAT)) for (let r = 0; r < 10; r++) {
      const id = 'elx_' + st + '_' + r;
      if (!IT[id]) IT[id] = { n: 'Elixir Eterno de ' + PERM_STAT[st].n + ' · ' + rk(r), w: 0.4, cat: 'food', alchemy: true, perm: { stat: st, pct: permPct(r), rank: r },
        d: '+' + (permPct(r) * 100).toFixed(1).replace('.0', '') + '% de ' + PERM_STAT[st].n + ' para sempre (teto de ' + Math.round(PERM_CAP * 100) + '% por atributo). Destilado com essência de cristal rank ' + rk(r) + '.' };
    }
  }
  function permBonus(st) { return Math.min(PERM_CAP, P().perm[st] || 0); }

  /* ---------- resolver a mistura ---------- */
  function normalize(list) { return list.slice().sort(); }
  function keyOf(list) { return normalize(list).join('+'); }
  function sumProps(list) {
    const t = {};
    for (const k of list) {
      if (/^ess\d$/.test(k)) continue;
      for (const [p, v] of Object.entries(PROPS[k] || {})) t[p] = (t[p] || 0) + v;
    }
    return t;
  }
  function resolve(list) {
    const ess = list.filter(k => /^ess\d$/.test(k)), mats = list.filter(k => !/^ess\d$/.test(k));
    const t = sumProps(list);
    const g = p => t[p] || 0;
    let out = null;
    if (g('gelo') >= 1 && g('fogo') >= 1) out = 'pocao_resistencia';
    else if (g('choque') >= 2 && g('luz') >= 1 && g('sombra') >= 1) out = 'frasco_paralisia';
    else if (g('vida') >= 2 && g('calma') >= 1) out = 'pocao_vitalidade';
    else if (g('vida') >= 2 && g('vigor') >= 1) out = 'pocao_regeneracao';
    else {
      const main = ['vida', 'vigor', 'veneno', 'acido', 'fogo', 'gelo', 'luz', 'sombra'].map(p => [p, g(p)]).sort((a, b) => b[1] - a[1]);
      if (main[0][1] > 0 && main[0][1] > main[1][1]) out = { vida: 'pocao_cura_forte', vigor: 'pocao_vigor', veneno: 'frasco_veneno', acido: 'frasco_acido', fogo: 'frasco_fogo', gelo: 'pocao_resistencia', luz: 'pocao_luz', sombra: 'frasco_fumaca' }[main[0][0]];
    }
    const r = { out, qty: g('fixa') >= 1 ? 2 : 1, perm: null, ess: ess.length ? +ess[0].slice(3) : null, props: t, mats, note: '' };
    if (ess.length > 1) { r.out = null; r.note = 'Duas essências brigam dentro do frasco: use no máximo uma.'; return r; }
    if (ess.length) {
      const st = PERM_BY_OUT[out];
      if (!st) { r.out = null; r.note = out ? 'A essência não se liga a esta mistura. Ela só funde com bebidas de vida, vigor, luz, resistência ou o fogo líquido.' : 'A essência se dissolve sem forma.'; return r; }
      r.perm = { stat: st, id: 'elx_' + st + '_' + r.ess }; r.qty = 1;
    }
    if (!out && !r.note) r.note = 'As propriedades se anulam e a mistura vira borra inerte.';
    return r;
  }
  function smellText(t) {
    const top = Object.entries(t).filter(([p]) => p !== 'fixa').sort((a, b) => b[1] - a[1]).slice(0, 2).map(([p]) => SMELL[p]).filter(Boolean);
    return top.length ? 'Cheiro: ' + top.join(' e ') + '.' : '';
  }

  /* ---------- estado do laboratório ---------- */
  const lab = { sel: [], msg: '', tab: 'mix' };
  function haveOf(k) { if (/^ess\d$/.test(k)) return run.res.cry[+k.slice(3)] || 0; return S()?.count(k) || 0; }
  function selCount(k) { return lab.sel.filter(x => x === k).length; }
  function nameOf(k) { return /^ess\d$/.test(k) ? 'Essência ' + rk(+k.slice(3)) : itemName(k); }

  function brew() {
    const sel = lab.sel.slice();
    if (sel.length < 2) { lab.msg = 'Misture ao menos 2 ingredientes.'; return false; }
    if (sel.length > 4) { lab.msg = 'O caldeirão aguenta até 4 ingredientes.'; return false; }
    if (!sel.some(k => PLANTS.includes(k))) { lab.msg = 'Falta uma planta: sal e essência sozinhos não reagem.'; return false; }
    const need = {}; sel.forEach(k => need[k] = (need[k] || 0) + 1); need.frasco_vazio = 1;
    for (const [k, n] of Object.entries(need)) if (haveOf(k) < n) { lab.msg = 'Falta ' + nameOf(k) + '.'; return false; }
    const r = resolve(sel);
    if (!r.out) { lab.msg = r.note; return false; }
    if (r.perm && permBonus(r.perm.stat) >= PERM_CAP) { lab.msg = 'Seu corpo já chegou ao teto de ' + PERM_STAT[r.perm.stat].n + ' (' + Math.round(PERM_CAP * 100) + '%). Nada foi gasto.'; return false; }
    /* consumo atômico: tudo ou nada */
    for (const [k, n] of Object.entries(need)) if (!/^ess\d$/.test(k) && !S().take(k, n)) { lab.msg = 'Falha ao separar ' + nameOf(k) + '.'; return false; }
    if (r.ess != null) run.res.cry[r.ess]--;
    const outId = r.perm ? r.perm.id : r.out;
    S().add(outId, r.qty, true, 0);
    const f = P(), key = keyOf(sel); f.tried++;
    const first = !f.disc[key];
    if (first) f.disc[key] = { out: outId, n: 1 }; else f.disc[key].n++;
    lab.msg = (first ? 'DESCOBERTA! ' : '') + 'Você destilou ' + (r.qty > 1 ? r.qty + '× ' : '') + itemName(outId) + '.';
    try { sfx(first ? 'level' : 'coin'); fxRing(player.x, player.z, first ? 0xb48cff : 0x7ef5a5, 2.6, 0.6); if (first) bigText('RECEITA DESCOBERTA · ' + itemName(outId).toUpperCase(), 1800); } catch (_) {}
    toast('<b>[ALQUIMIA]</b> ' + esc(lab.msg));
    lab.sel = [];
    persist();
    return true;
  }

  function labView() {
    view = () => labView();
    const f = P(), have = k => haveOf(k);
    let h = '<div class="tabs">' + btn('Misturar', 'fa551tab', 'mix', true, lab.tab === 'mix' ? 'on' : '') + btn('Diário (' + Object.keys(f.disc).length + ')', 'fa551tab', 'diary', true, lab.tab === 'diary' ? 'on' : '') + btn('Corpo', 'fa551tab', 'body', true, lab.tab === 'body' ? 'on' : '') + '</div>';
    h += '<div class="sysline">Mira: «Cada planta tem um humor. Descubra quais combinam.» · Ouro: <b class="gold">' + fmt(run.gold) + '</b></div>';
    if (lab.tab === 'diary') {
      const ents = Object.entries(f.disc);
      if (!ents.length) h += '<div class="sysline">Nenhuma receita ainda. Misture ingredientes e anote o que acontece.</div>';
      ents.forEach(([key, d]) => {
        const list = key.split('+'), can = list.every(k => have(k) >= list.filter(x => x === k).length) && have('frasco_vazio') >= 1;
        h += row(esc(itemName(d.out)), esc(list.map(nameOf).join(' + ')) + ' · feita ' + d.n + '×', btn('Repetir', 'fa551redo', key, can));
      });
    } else if (lab.tab === 'body') {
      h += '<div class="sec">ELIXIRES ETERNOS</div><div class="sysline" style="font-size:12px">Misture uma bebida com uma Essência de cristal da Fenda. O bônus fica para sempre, até ' + Math.round(PERM_CAP * 100) + '% por atributo. Rank maior, bônus maior (F ' + (permPct(0) * 100).toFixed(1) + '% … ★ ' + (permPct(9) * 100).toFixed(1) + '%).</div>';
      for (const [st, d] of Object.entries(PERM_STAT)) h += row(d.ico + ' ' + d.n, 'Bônus atual: +' + (permBonus(st) * 100).toFixed(1) + '% de ' + Math.round(PERM_CAP * 100) + '%', '');
      h += '<div class="sec">ELIXIRES NA MOCHILA</div>';
      let any = false;
      for (const id of Object.keys(S().ITEMS).filter(i => /^elx_/.test(i))) { const n = S().count(id); if (n > 0) { any = true; h += row(esc(itemName(id)) + ' ×' + n, esc(S().ITEMS[id].d), btn('Beber', 'fa551drink', id, true, 'hot')); } }
      if (!any) h += '<div class="sysline">Nenhum elixir eterno ainda.</div>';
    } else {
      const sel = lab.sel, r = sel.length >= 2 ? resolve(sel) : null;
      h += '<div class="sec">CALDEIRÃO · ' + sel.length + '/4 · gasta 1 Frasco de Vidro (' + have('frasco_vazio') + ')</div>';
      h += '<div class="sysline">' + (sel.length ? esc(sel.map(nameOf).join(' + ')) : 'Escolha os ingredientes abaixo.') + (r ? '<br>' + esc(smellText(r.props)) : '') + (lab.msg ? '<br><b>' + esc(lab.msg) + '</b>' : '') + '</div>';
      h += row('Misturar', 'Gasta os ingredientes escolhidos. O resultado depende só das propriedades deles.', btn('Destilar', 'fa551brew', 0, sel.length >= 2, 'hot') + btn('Limpar', 'fa551clear', 0, sel.length > 0));
      const rowIng = (k, pre) => { const n = have(k); return n > 0 ? row(pre + esc(nameOf(k)) + ' ×' + n, esc(PROPS[k] ? Object.keys(PROPS[k]).filter(p => p !== 'fixa').map(p => SMELL[p]).join(', ') || 'sal estabilizador' : 'Cristal moído da Fenda: dá poder eterno à bebida.'), btn(selCount(k) ? 'Tirar' : 'Pôr', selCount(k) ? 'fa551rm' : 'fa551add', k, selCount(k) ? true : sel.length < 4 && selCount(k) < n) + (selCount(k) ? btn('+1', 'fa551add', k, sel.length < 4 && selCount(k) < n) : '')) : ''; };
      h += '<div class="sec">PLANTAS</div>' + (PLANTS.map(k => rowIng(k, '')).join('') || '');
      if (!PLANTS.some(k => have(k) > 0)) h += '<div class="sysline">Você não tem plantas. Colha nos biomas e nas Fendas.</div>';
      h += '<div class="sec">SAIS MINERAIS</div>' + SALTS.map(k => rowIng(k, '')).join('');
      h += '<div class="sec">ESSÊNCIAS DA FENDA</div>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(r2 => rowIng('ess' + r2, '')).join('');
    }
    h += btn('Sair', 'fa551close', 0);
    openModal('ALQUIMIA · LABORATÓRIO', h);
  }

  /* ---------- forja ---------- */
  const fz = { mode: 'make', slot: 'w' };
  function gearList() {
    const out = [];
    for (const sl of EQUIP_SLOTS) if (run.equip[sl]) out.push({ it: run.equip[sl], ref: 'e|' + sl, eq: true });
    run.items.forEach((it, i) => { if (it && EQUIP_SLOTS.includes(it.slot)) out.push({ it, ref: 'b|' + (it.uid || i), eq: false }); });
    return out;
  }
  function findRef(ref) {
    const [k, v] = ref.split('|');
    if (k === 'e') return run.equip[v] || null;
    return run.items.find((it, i) => (it.uid || String(i)) === v) || null;
  }
  function refine(ref) {
    const it = findRef(ref); if (!it) return false;
    const q = equipmentUpgradeCost(it);
    if (run.gold < q.gold) { toast('Ouro insuficiente.'); return false; }
    if (cryUp(it.tier) < q.cry) { toast('Faltam minérios ' + rk(it.tier) + ' ou superiores.'); return false; }
    if (!spendService265(q.gold)) return false;
    spendCry(it.tier, q.cry);
    const ok = finishEquipmentUpgrade(it);
    try { if (ok) { sfx('boom'); fxRing(player.x, player.z, 0xffd070, 3, 0.6); } } catch (_) {}
    try { saveRun(); } catch (_) {}
    return true;
  }
  function forjaView() {
    view = () => forjaView();
    let h = '<div class="tabs">' + btn('Criar', 'fa551fz', 'make', true, fz.mode === 'make' ? 'on' : '') + btn('Refinar', 'fa551fz', 'refine', true, fz.mode === 'refine' ? 'on' : '') + '</div>';
    h += '<div class="sysline">Ordem dos Artífices: «Cada Fenda deixa um metal. De F ao ★ Logos, o aço lembra de onde veio.» · Ouro: <b class="gold">' + fmt(run.gold) + '</b></div>';
    if (fz.mode === 'make') {
      h += '<div class="tabs">' + EQUIP_SLOTS.map(k => btn(EQUIP_LABEL[k], 'fa551slot', k, true, fz.slot === k ? 'on' : '')).join('') + '</div>';
      const maxT = (typeof secretRankKnown292 === 'function' && secretRankKnown292()) ? 9 : 8;
      for (let t = 0; t <= maxT; t++) {
        const gc = forgePrice265(fz.slot, t), cc = run.res.cry[t], ok = cc >= 10 && run.gold >= gc && run.items.length < bagCapacity353();
        h += row('Forjar ' + EQUIP_LABEL[fz.slot].toLowerCase() + ' <span class="rl" style="color:' + RANKS[t].c + '">' + rk(t) + '</span>', '10 minérios ' + rk(t) + ' + ' + fmt(gc) + ' ouro · você tem ' + cc + ' · ' + GR[t].th.n, btn('Forjar', 'forge', fz.slot + t, ok));
      }
    } else {
      const g = gearList();
      if (!g.length) h += '<div class="sysline">Você não tem equipamento para refinar.</div>';
      g.sort((a, b) => (b.eq - a.eq) || (b.it.tier - a.it.tier)).slice(0, 40).forEach(({ it, ref, eq }) => {
        const up = it.up || 0, q = equipmentUpgradeCost(it), risk = up >= 10 ? ' · falha ' + Math.round(Math.min(.6, .2 + (up - 10) * .04) * 100) + '% (materiais perdidos, peça preservada)' : ' · sucesso garantido';
        const val = it.slot === 'w' ? 'ataque ' + itemAtk(it) : 'escudo ' + itemSh(it);
        h += row('<b style="color:' + RAR[it.rar].c + '">' + esc(it.name) + '</b>' + (eq ? ' (equipada)' : ''), esc(val) + ' → +8% · ' + fmt(q.gold) + ' ouro · ' + q.cry + ' minérios ' + rk(it.tier) + '+ (você tem ' + cryUp(it.tier) + ')' + risk, btn('Refinar', 'fa551ref', ref, run.gold >= q.gold && cryUp(it.tier) >= q.cry));
      });
    }
    h += btn('Sair', 'fa551close', 0);
    openModal('FORJA · ORDEM DOS ARTÍFICES', h);
  }

  /* ---------- ações ---------- */
  const ea0 = extraActions;
  extraActions = function (a, v) {
    if (typeof a === 'string' && a.indexOf('fa551') === 0) {
      switch (a) {
        case 'fa551tab': lab.tab = v; lab.msg = ''; labView(); return 'close0';
        case 'fa551add': if (lab.sel.length < 4 && selCount(v) < haveOf(v)) lab.sel.push(v); lab.msg = ''; labView(); return 'close0';
        case 'fa551rm': { const i = lab.sel.lastIndexOf(v); if (i >= 0) lab.sel.splice(i, 1); lab.msg = ''; labView(); return 'close0'; }
        case 'fa551clear': lab.sel = []; lab.msg = ''; labView(); return 'close0';
        case 'fa551brew': brew(); labView(); return 'close0';
        case 'fa551redo': lab.sel = String(v).split('+'); brew(); labView(); return 'close0';
        case 'fa551drink': if (window.Alchemy470) Alchemy470.drinkPotion(v); labView(); return 'close0';
        case 'fa551close': closeModal(); return 'close0';
        case 'fa551fz': fz.mode = v; forjaView(); return 'close0';
        case 'fa551slot': fz.slot = v; forjaView(); return 'close0';
        case 'fa551ref': refine(String(v)); forjaView(); return 'close0';
      }
    }
    if (a === 'forge' && fz && document.getElementById('mt')?.textContent === 'FORJA · ORDEM DOS ARTÍFICES') {
      const r = ea0.apply(this, arguments); setTimeout(forjaView, 0); return r === true ? 'close0' : r;
    }
    return ea0.apply(this, arguments);
  };

  /* beber elixir eterno: teto por atributo, nada consumido se já no teto */
  function hookDrink() {
    const A = window.Alchemy470; if (!A || A.__fa551) return;
    const d0 = A.drinkPotion; A.__fa551 = 1;
    A.drinkPotion = function (id) {
      const it = S()?.ITEMS?.[id];
      if (it && it.perm) {
        if (!S().count(id)) return false;
        const f = P(), st = it.perm.stat;
        if ((f.perm[st] || 0) >= PERM_CAP) { toast('<b>[ALQUIMIA]</b> Seu corpo já chegou ao teto de ' + PERM_STAT[st].n + '.'); return false; }
        if (!S().take(id, 1)) return false;
        f.perm[st] = Math.min(PERM_CAP, (f.perm[st] || 0) + it.perm.pct);
        try { refreshStats(); sfx('level'); fxRing(player.x, player.z, 0xb48cff, 3, 0.8); floater(player.x, player.z, '+' + (it.perm.pct * 100).toFixed(1).replace('.0', '') + '% ' + PERM_STAT[st].n + ' ETERNO', '#d9c2ff', true); } catch (_) {}
        toast('<b>[ALQUIMIA]</b> ' + esc(it.n) + ': ' + PERM_STAT[st].n + ' eterno em +' + (f.perm[st] * 100).toFixed(1) + '%.');
        persist();
        return true;
      }
      return d0.apply(this, arguments);
    };
  }

  /* bônus permanente entra nos atributos */
  const sf0 = statsFor;
  statsFor = function () {
    const s = sf0.apply(this, arguments);
    try {
      const f = profile && profile.fa551 && profile.fa551.perm; if (!f) return s;
      const b = k => Math.min(PERM_CAP, f[k] || 0);
      s.maxhp = Math.max(1, Math.round(s.maxhp * (1 + b('hp'))));
      s.maxmp = Math.max(0, Math.round(s.maxmp * (1 + b('mana'))));
      s.maxsh = Math.max(0, Math.round(s.maxsh * (1 + b('shield'))));
      s.dmg = s.dmg * (1 + b('atk'));
      s.spd = s.spd * (1 + b('spd'));
    } catch (_) {}
    return s;
  };

  /* portas de entrada: lojas de Kael/Brann (forja) e de Mira (alquimia) */
  const om0 = openModal;
  openModal = function (title, html, route) {
    try {
      const wep = SHOPS.find(s => s.id === 'wep'), arm = SHOPS.find(s => s.id === 'arm'), pot = SHOPS.find(s => s.id === 'pot');
      if (title === wep.n || title === arm.n) html += row('Forja da Ordem', 'Criar e refinar equipamento com núcleos e minérios da Fenda.', btn('Abrir', 'fa551open', 'forja'));
      else if (title === pot.n) html += row('Laboratório de Alquimia', 'Misture plantas, sais e essências. Descubra receitas e elixires eternos.', btn('Abrir', 'fa551open', 'lab'));
    } catch (_) {}
    return om0.call(this, title, html, route);
  };
  const ea1 = extraActions;
  extraActions = function (a, v) {
    if (a === 'fa551open') { if (v === 'forja') forjaView(); else labView(); return 'close0'; }
    return ea1.apply(this, arguments);
  };

  registerPerm(); hookDrink();
  window.Forja551 = { openForja: forjaView, openLab: labView, resolve, keyOf, brew: (list) => { lab.sel = list.slice(); return brew(); }, refine, lab, permBonus, PERM_CAP, PROPS, PLANTS, SALTS };
})();
