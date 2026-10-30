/* ============================================================================
 * PRIMEVA v663 — FLECHAS COMO MUNIÇÃO (Ian, 28/10/2026)
 * «o arco não pode mais soltar ataques infinitos, ele tem que soltar pela quantidade de flecha que tu tem,
 *  tu pode fabricar a flecha ou comprar e o tipo de flecha dá o dano junto com o tipo de arco»
 *
 *  - Todo tiro básico de flecha (arco na mão, ou ataque básico de arco da classe sem arma) gasta 1 flecha.
 *    Sem flecha, o arco não atira (nem puxa a corda na 1ª pessoa).
 *  - Dano do tiro = ataque do arco + ataque da flecha (com os mesmos bônus do ataque físico).
 *    Lasca +1; Ferro … Primeva = metade do ataque base de uma arma do mesmo rank (tools/survival437.js).
 *  - Flechas ficam no inventário de sobrevivência (têm peso). Fabricar: Bancada Rústica de Campo
 *    (lasca: galho, lasca e pena; metal: galho, pena e 1 minério do rank). Comprar: Mercado (Dorian), pacote de 20.
 *  - Bolsa → FLECHAS: escolher qual flecha usar. Se a escolhida acabar, passa para a mais forte que você tiver.
 *  - Habilidades de arco seguem com o custo delas (mana/Estamina); só o tiro básico gasta flecha.
 * ============================================================================ */
(function(global){
  'use strict';
  if(typeof attack !== 'function' || typeof run === 'undefined') return;
  const SV = () => global.Surv437;
  const F = global.Flechas663 = { shots: 0, blocked: 0 };
  const IDS = ['flecha'].concat(Array.from({ length: 10 }, (_, t) => 'flecha_' + t));
  const tierOf = id => id === 'flecha' ? -1 : +id.slice(7);
  const atkOf663 = id => { try { return SV().arrowAtk663(tierOf(id)); } catch(_) { return 0; } };
  const name = id => { try { return SV().ITEMS[id].n; } catch(_) { return id; } };
  const cnt = id => { try { return SV().count(id); } catch(_) { return 0; } };
  F.atk = atkOf663; F.count = cnt; F.ids = IDS;
  /* flecha em uso: a escolhida; se acabou, a mais forte que houver */
  function current(){
    if(run.arrow663 && cnt(run.arrow663) > 0) return run.arrow663;
    let best = null;
    for(const id of IDS) if(cnt(id) > 0 && (!best || atkOf663(id) > atkOf663(best))) best = id;
    if(best && run.arrow663 && run.arrow663 !== best){ try { toast('Acabaram as ' + name(run.arrow663).replace('Flecha', 'flechas') + '. Usando ' + name(best) + '.', 2200); } catch(_) {} }
    if(best) run.arrow663 = best;
    return best;
  }
  F.current = current;
  F.total = () => IDS.reduce((a, id) => a + cnt(id), 0);
  /* o ataque básico vai soltar uma flecha? (arco na mão, ou classe de arco sem arma e sem magia) */
  function arrowShot(){
    try {
      const w = run.equip.w, k = w ? weaponKind272(w) : null;
      if(k === 'bow') return true;
      return false; /* v695 (Ian): sem arco na mão não há flecha; a classe dá soco */
    } catch(_) { return false; }
  }
  F.arrowShot = arrowShot;
  let warnT = 0;
  function noArrows(){
    F.blocked++;
    try { floater(player.x, player.z, 'SEM FLECHAS', '#ffb36b'); } catch(_) {}
    const now = performance.now();
    if(now - warnT > 3000){ warnT = now; try { toast('Sem flechas. Compre no Mercado (Dorian) ou fabrique na Bancada Rústica de Campo.', 2600); } catch(_) {} }
  }
  /* tiro: dano do arco + da flecha; gasta 1 */
  (function wrapAttack(){
    const A0 = attack;
    attack = function(){
      if(!arrowShot() || !player || player.dead || paused || player.atkCd > 0 || player.dodgeT > 0) return A0.apply(this, arguments);
      try { if(global.Guard472 && Guard472.blocking && Guard472.blocking()) return A0.apply(this, arguments); } catch(_) {}
      const id = current();
      if(!id){ noArrows(); return; }
      const base = Math.max(1, atkOf('phy')), d0 = player.dmg, cd = player.atkCd;
      player.dmg = d0 * (base + atkOf663(id)) / base;
      let r;
      try { r = A0.apply(this, arguments); } finally { player.dmg = d0; }
      if(player.atkCd > cd){
        SV().take(id, 1); F.shots++;
        const left = cnt(id);
        if(left > 0 && left <= 5){ try { floater(player.x, player.z, left + (left === 1 ? ' flecha' : ' flechas'), '#e8d8a8'); } catch(_) {} }
      }
      return r;
    };
  })();
  /* sem flecha o arco não puxa a corda (antes do Skyrim588, que começa a puxar no mousedown) */
  const C = document.getElementById('c');
  addEventListener('mousedown', e => {
    if(e.button !== 0 || e.target !== C) return;
    try { if(!started || paused || modalOpen || !player || player.dead) return; } catch(_) { return; }
    try { if(global.Maos662 && Maos662.rightKind() === 'spell') return; } catch(_) {}
    if(arrowShot() && !current()){ e.stopImmediatePropagation(); e.preventDefault(); try { mouseHeld = false; } catch(_) {} noArrows(); }
  }, true);

  /* quem já usava arco ganha um começo de aljava uma vez (antes as flechas eram infinitas) */
  setInterval(() => {
    try {
      if(!started || !run || run.arrow663start || !SV() || !arrowShot()) return;
      run.arrow663start = 1;
      if(F.total() === 0){ SV().add('flecha_0', 30, true); run.arrow663 = 'flecha_0'; toast('<b>[NARRADOR]</b> Agora o arco gasta flechas. Você recebeu 30 Flechas de Ferro. Compre mais no Mercado ou fabrique na Bancada.', 5200); }
      try { saveRun(); } catch(_) {}
    } catch(_) {}
  }, 1500);

  /* ---------------- Mercado (Dorian): pacotes de 20 ---------------- */
  const PACK = 20;
  function price(id){
    const t = tierOf(id);
    if(t < 0) return 20;
    /* 20 flechas ≈ 2,5 minérios do rank (fabricar com 1 minério dá 10: comprar sai mais caro) */
    try { return Math.max(30, Math.round(crystalPurchasePriceBalance(t) * 0.25)); } catch(_) { return 60 * (t + 1); }
  }
  F.price = price;
  const B = (txt, a, v, en) => '<button class="btn" data-a="' + a + '" data-v="' + v + '"' + (en === false ? ' disabled' : '') + '>' + txt + '</button>';
  function shopHtml(){
    let h = '<div class="sec">FLECHAS (PACOTE DE ' + PACK + ')</div><div class="sysline" style="font-size:12px">Cada tiro de arco gasta 1 flecha. O dano soma o ataque do arco e o da flecha. Só até o seu rank.</div>';
    const rk = (() => { try { return rankOf(); } catch(_) { return 0; } })();
    for(const id of IDS){
      const t = tierOf(id); if(t > rk) continue;
      const p = price(id);
      h += row(name(id) + ' × ' + PACK, '+' + atkOf663(id) + ' de ataque · você tem ' + cnt(id), B(fmt(p) + ' ouro', 'arrow663buy', id, run.gold >= p));
    }
    return h;
  }
  (function wrapMarket(){
    if(typeof mktView !== 'function'){ setTimeout(wrapMarket, 300); return; }
    const M0 = mktView;
    mktView = function(){
      const r = M0.apply(this, arguments);
      try { const mb = document.getElementById('mb'); const sec = mb && [...mb.querySelectorAll('.sec')].find(e => /^MONTARIA/.test(e.textContent));
        if(sec && !mb.querySelector('[data-arrows663]')){ const d = document.createElement('div'); d.setAttribute('data-arrows663', '1'); d.innerHTML = shopHtml(); sec.parentNode.insertBefore(d, sec); } } catch(e){ console.warn('flechas663 mkt', e); }
      return r;
    };
  })();

  /* ---------------- Bolsa → FLECHAS ---------------- */
  function bagHtml(){
    const cur = current(), have = IDS.filter(id => cnt(id) > 0);
    let h = '<div class="sec">FLECHAS</div><div class="sysline">Cada tiro de arco gasta 1 flecha; o dano soma o ataque do arco e o da flecha. Fabrique na Bancada Rústica de Campo ou compre no Mercado (Dorian).</div>';
    if(!have.length) h += row('Nenhuma flecha', 'Sem flechas o arco não atira.', '');
    for(const id of have) h += row((id === cur ? '<b>▸ ' : '<b>') + name(id) + '</b> × ' + cnt(id), '+' + atkOf663(id) + ' de ataque', id === cur ? '<b>Em uso</b>' : B('Usar', 'arrow663use', id));
    return h;
  }
  F.bagHtml = bagHtml;
  (function wrapBag(){
    if(typeof bagView !== 'function'){ setTimeout(wrapBag, 300); return; }
    const BV = bagView;
    bagView = function(){
      const r = BV.apply(this, arguments);
      try { const mb = document.getElementById('mb'); const sec = mb && [...mb.querySelectorAll('.sec')].find(e => /^RECURSOS/.test(e.textContent));
        if(sec && !mb.querySelector('[data-arrowbag663]')){ const d = document.createElement('div'); d.setAttribute('data-arrowbag663', '1'); d.innerHTML = bagHtml(); sec.parentNode.insertBefore(d, sec); } } catch(e){ console.warn('flechas663 bag', e); }
      return r;
    };
  })();
  (function bindActs(){
    const mb = document.getElementById('mb'); if(!mb){ setTimeout(bindActs, 300); return; }
    mb.addEventListener('click', e => {
      const b = e.target.closest('[data-a]'); if(!b || b.disabled) return;
      const a = b.dataset.a, v = b.dataset.v;
      if(a !== 'arrow663buy' && a !== 'arrow663use') return;
      e.stopImmediatePropagation();
      if(!IDS.includes(v)) return;
      if(a === 'arrow663use'){ run.arrow663 = v; try { toast('Usando ' + name(v) + '.', 1400); } catch(_) {} }
      else {
        const p = price(v);
        if(run.gold < p) return;
        run.gold -= p; SV().add(v, PACK, true); run.arrow663 = run.arrow663 || v;
        try { sfx('coin'); } catch(_) {}
        try { toast('<b>[MERCADO]</b> ' + PACK + ' ' + name(v).replace('Flecha', 'flechas') + ' por ' + fmt(p) + ' ouro.', 2000); } catch(_) {}
      }
      try { saveRun(); } catch(_) {}
      try { if(typeof view === 'function') view(); } catch(_) {}
    }, true);
  })();
})(window);
