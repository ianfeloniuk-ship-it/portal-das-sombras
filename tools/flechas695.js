/* ============================================================================
 * PRIMEVA v695/v699 — FLECHAS QUE FICAM NO MUNDO (Ian, 29/10/2026)
 * v695: «eu tenho que poder recolher as flechas que caíram… matei o bagulho…»
 * v699: «não passar por cima e coletar… não me dá tudo de mão beijada… não quero que avise onde estão
 *        as flechas nem mostre… quero que seja intuitivo, o cara vai lá e sabe que tá lá»
 *
 *  - Flecha que acerta um monstro fica no corpo; quando ele morre, elas caem no chão ali (380-acoes.js guarda
 *    e.arrows695). Flecha que erra fica cravada no chão ou na pedra (stuck690) até você pegar.
 *  - Pegar: chegue perto, olhe para a flecha e aperte a tecla de usar (E). Pega as que estão juntas ali.
 *    Sem brilho, sem marcador, sem contador na tela: a flecha é só a flecha, no lugar onde caiu.
 *  - O Narrador explica o arco UMA vez, quando você o usa, e onde conseguir flechas quando estão acabando.
 * ============================================================================ */
(function(global){
  'use strict';
  if(typeof killEnemy !== 'function' || typeof stuck690 === 'undefined' || typeof scene === 'undefined') return;
  const F = global.Flechas695 = { dropped: 0, pickedN: 0 };
  const REACH = 2.2, FRONT = 1.1, GROUP = 1.0;
  const FL = () => global.Flechas663, SV = () => global.Surv437;
  const name = id => { try { return SV().ITEMS[id].n; } catch(_) { return 'Flecha'; } };
  const plural = (n, id) => n === 1 ? name(id) : name(id).replace(/^Flecha/, 'Flechas');

  /* ---------- explicação do arco, uma vez cada ---------- */
  function dica(k, html, ms){
    try {
      const d = profile.dicas695 || (profile.dicas695 = {});
      if(d[k]) return; d[k] = 1;
      store.set('pds2_profile', profile);
      toast('<b>[NARRADOR]</b> ' + html, ms || 8000);
    } catch(_) {}
  }

  /* ---------- monstro morto solta as flechas que estavam no corpo ---------- */
  function drop(e){
    const ar = e.arrows695; if(!ar) return; delete e.arrows695;
    for(const id in ar){
      for(let i = 0; i < ar[id]; i++){
        try {
          const x = e.x + (Math.random() - .5) * 1.2, z = e.z + (Math.random() - .5) * 1.2, y = terrH(x, z) + .3;
          const m = projModel('arrow', 0xc6ac78, 1); m.userData.terrainAbsolute245 = true;
          m.position.set(x, y, z); m.rotation.set(.9 + Math.random() * .5, Math.random() * 6.28, 0, 'YXZ'); scene.add(m);
          stuck690.push({ m, t: Infinity, id, x, y, z }); F.dropped++;
        } catch(_) {}
      }
    }
  }
  const K0 = killEnemy;
  killEnemy = function(e){
    const had = e && !e.dead && e.arrows695;
    const r = K0.apply(this, arguments);
    if(had && e.dead) drop(e);
    return r;
  };

  /* ---------- pegar com a tecla de usar ---------- */
  function lookedAt(){
    if(!player || player.dead) return null;
    let best = null, bs = 1e9;
    for(const st of stuck690){
      if(!st.id) continue;
      const dx = st.x - player.x, dz = st.z - player.z, d = Math.hypot(dx, dz);
      if(d > REACH) continue;
      let da = Math.atan2(dx, dz) - player.face; da = Math.abs(Math.atan2(Math.sin(da), Math.cos(da)));
      if(d > .6 && da > FRONT) continue;            /* tem que estar olhando para ela */
      const score = d + da * 1.5; if(score < bs){ bs = score; best = st; }
    }
    return best;
  }
  function groupOf(st){ return stuck690.filter(s => s.id && Math.hypot(s.x - st.x, s.z - st.z) <= GROUP); }
  function collect(st){
    const g = groupOf(st); if(!g.length) return;
    const got = {};
    for(const s of g){
      try { SV().add(s.id, 1, true); } catch(_) { continue; }
      got[s.id] = (got[s.id] || 0) + 1; F.pickedN++;
      scene.remove(s.m); const i = stuck690.indexOf(s); if(i >= 0) stuck690.splice(i, 1);
    }
    const n = Object.values(got).reduce((a, b) => a + b, 0);
    const parts = Object.keys(got).map(id => got[id] + ' ' + plural(got[id], id));
    if(parts.length){ try { toast(parts.join(' e ') + (n === 1 ? ' adicionada.' : ' adicionadas.'), 1600); } catch(_) {} try { sfx('pickup'); } catch(_) {} }
  }
  F.collect = collect; F.lookedAt = lookedAt;
  (function wrapCtx(){
    if(typeof ctxTarget !== 'function'){ setTimeout(wrapCtx, 300); return; }
    const c0 = ctxTarget;
    ctxTarget = function(){
      const b = c0.apply(this, arguments);
      if(b) return b;
      try {
        const st = lookedAt(); if(!st) return b;
        const n = groupOf(st).length;
        return { label: 'F · PEGAR ' + (n > 1 ? n + ' ' + plural(n, st.id) : name(st.id)).toUpperCase(), use: () => collect(st) };
      } catch(_) { return b; }
    };
  })();

  /* ---------- o arco explicado na hora em que você o usa ---------- */
  setInterval(() => {
    try {
      if(!started || !FL()) return;
      const bow = FL().arrowShot(), total = FL().total();
      if(bow && total > 0) dica('arco', 'Cada tiro do arco gasta uma flecha. Segure o botão para puxar a corda: quanto mais puxa, mais longe e mais forte ela vai. De longe a flecha cai, então mire um pouco acima do alvo.', 9000);
      if(bow && total > 0 && total <= 5) dica('poucas', 'Restam poucas flechas. Dorian vende pacotes no Mercado de Aster, e na Bancada Rústica de Campo você faz as suas com galho, pena e uma lasca ou minério.', 9000);
    } catch(_) {}
  }, 500);
})(window);
