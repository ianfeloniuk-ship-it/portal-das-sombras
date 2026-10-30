/* ============================================================================
 * PRIMEVA v718 — RODINHA E TROCA DE MÃOS SEM PAINEL (Ian, 30/10/2026)
 * «não gosto de quando aperto Q fica um painel… queria só apertar o botão e soltar algo… rodar a bolinha trocar a arma»
 *  - Rodinha: troca a mão direita entre armas, magias e mão vazia.
 *  - Botão direito segurado + rodinha: troca a mão esquerda (armas de uma mão, magias e mão vazia).
 *  - Q: inverte as duas mãos, sem painel. Arco e lança usam as duas mãos e não invertem.
 * ============================================================================ */
(function(global){
  'use strict';
  const H = () => global.Maos662, L = () => global.Lote541;
  const C = document.getElementById('c');
  if(!C) return;
  let rightHeld = false, acc = 0, accT = 0;
  addEventListener('pointerdown', e => { if(e.button === 2 || (e.buttons & 2)) rightHeld = true; }, true);
  addEventListener('pointerup', e => { if(!(e.buttons & 2)) rightHeld = false; }, true);
  addEventListener('pointermove', e => { rightHeld = !!(e.buttons & 2); }, true);
  addEventListener('blur', () => { rightHeld = false; });
  const show = t => { try { floater(player.x, player.z, t, '#f3e3c0'); sfx('swing'); } catch(_) {} };
  const keyS = s => s.skillId || s.n;
  function entries(side){
    const m = H(), out = [];
    if(side === 'l' && run.equip.wl) out.push({ t: 'w', it: run.equip.wl });
    for(const it of L().list()) if(side === 'r' || (!m.isTwo(it) && it !== run.equip.w)) out.push({ t: 'w', it });
    for(const s of m.spells()) out.push({ t: 's', k: keyS(s), n: s.n });
    out.push({ t: 'e' });
    return out;
  }
  function currentIndex(side, list){
    const h = run.hands662 || {}, sp = h[side], w = side === 'r' ? run.equip.w : run.equip.wl;
    return list.findIndex(x => x.t === 's' ? !!sp && x.k === sp : x.t === 'w' ? !sp && !!w && x.it.uid === w.uid : !sp && !w);
  }
  function step(side, d){
    const m = H(), list = entries(side); if(list.length < 2) return false;
    const at = Math.max(0, currentIndex(side, list)), x = list[(at + d + list.length) % list.length];
    if(x.t === 's') m.spellTo(side, x.k);
    else if(x.t === 'e') m.clear(side);
    else if(side === 'l') m.equipLeft(x.it.uid);
    else { const h = run.hands662; if(h) h.r = null; if(run.equip.w?.uid !== x.it.uid) L().select(L().list().indexOf(x.it)); }
    show((side === 'l' ? 'Esquerda: ' : 'Direita: ') + (x.t === 's' ? x.n : x.t === 'e' ? 'mão vazia' : x.it.name));
    return true;
  }
  function swap(){
    const m = H(); if(!m || !run || !player || player.dead) return false;
    if(m.isTwo(run.equip.w)){ show('Esta arma usa as duas mãos'); return false; }
    if(run.equip.sh){ show('Tire o escudo para trocar'); return false; }
    const h = run.hands662 || (run.hands662 = { r: null, l: null });
    [h.r, h.l] = [h.l, h.r]; [run.equip.w, run.equip.wl] = [run.equip.wl || null, run.equip.w || null];
    try { refreshStats(); saveRun(); } catch(_) {}
    show('Mãos trocadas'); return true;
  }
  global.Rodinha718 = { step, swap, entries };
  C.addEventListener('wheel', e => {
    if((typeof touch !== 'undefined' && touch) || !H() || !L() || !H().playing()) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if(performance.now() - accT > 400) acc = 0;
    accT = performance.now(); acc += e.deltaY;
    if(Math.abs(acc) < 60) return;
    step(rightHeld || (e.buttons & 2) ? 'l' : 'r', acc > 0 ? 1 : -1); acc = 0;
  }, { passive: false, capture: true });
})(window);
