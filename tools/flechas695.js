/* ============================================================================
 * PRIMEVA v695 — FLECHAS QUE VOCÊ VÊ E RECOLHE (Ian, 29/10/2026)
 * «eu tenho que poder recolher as flechas que caíram… matei o bagulho… tem que me mostrar onde
 *  estão as flechas… não quero que o jogo vire um tutorial… tu vai aprendendo conforme as coisas acontecem»
 *
 *  - Flecha que acerta um monstro fica no corpo; quando ele morre, elas caem no chão ali (380-acoes.js guarda
 *    e.arrows695). Flecha que erra fica cravada no chão ou na pedra (stuck690) até você pegar.
 *  - Cada flecha no chão tem um brilho fraco acima dela (até 70 m). Passar por cima recolhe.
 *  - Canto da tela: a flecha em uso, quantas você tem e quantas estão no chão por perto.
 *  - O Narrador explica cada coisa UMA vez, quando ela acontece (profile.dicas695). Nada de tutorial.
 * ============================================================================ */
(function(global){
  'use strict';
  if(typeof killEnemy !== 'function' || typeof stuck690 === 'undefined' || typeof scene === 'undefined') return;
  const F = global.Flechas695 = { dropped: 0, pickedN: 0 };
  const SEE = 70;
  const FL = () => global.Flechas663, SV = () => global.Surv437;
  const name = id => { try { return SV().ITEMS[id].n; } catch(_) { return 'Flecha'; } };
  const plural = (n, id) => n === 1 ? name(id) : name(id).replace(/^Flecha/, 'Flechas');

  /* ---------- explicações, uma vez cada ---------- */
  function dica(k, html, ms){
    try {
      const d = profile.dicas695 || (profile.dicas695 = {});
      if(d[k]) return; d[k] = 1;
      store.set('pds2_profile', profile);
      toast('<b>[NARRADOR]</b> ' + html, ms || 8000);
    } catch(_) {}
  }
  F.dica = dica;

  /* ---------- monstro morto solta as flechas que estavam no corpo ---------- */
  function drop(e){
    const ar = e.arrows695; if(!ar) return; delete e.arrows695;
    let n = 0;
    for(const id in ar){
      for(let i = 0; i < ar[id]; i++){
        try {
          const x = e.x + (Math.random() - .5) * 1.4, z = e.z + (Math.random() - .5) * 1.4, y = terrH(x, z) + .3;
          const m = projModel('arrow', 0xc6ac78, 1); m.userData.terrainAbsolute245 = true;
          m.position.set(x, y, z); m.rotation.set(.9 + Math.random() * .5, Math.random() * 6.28, 0, 'YXZ'); scene.add(m);
          stuck690.push({ m, t: Infinity, id, x, y, z }); n++;
        } catch(_) {}
      }
    }
    if(n){ F.dropped += n;
      dica('corpo', 'As flechas que acertaram ficaram no corpo e caíram no chão quando ele morreu. Passe por cima delas para recolher.');
    }
  }
  const K0 = killEnemy;
  killEnemy = function(e){
    const had = e && !e.dead && e.arrows695;
    const r = K0.apply(this, arguments);
    if(had && e.dead) drop(e);
    return r;
  };

  /* ---------- recolhidas: um aviso só por punhado ---------- */
  let bag = {}, bagT = 0;
  F.picked = id => { F.pickedN++; bag[id] = (bag[id] || 0) + 1; bagT = performance.now(); };
  function flushBag(){
    if(!bagT || performance.now() - bagT < 900) return;
    const parts = Object.keys(bag).map(id => bag[id] + ' ' + plural(bag[id], id));
    bag = {}; bagT = 0;
    if(parts.length) try { toast('Recolheu ' + parts.join(' e ') + '.', 2200); } catch(_) {}
  }

  /* ---------- brilho acima de cada flecha no chão ---------- */
  const tex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 2, 32, 32, 30); g.addColorStop(0, 'rgba(255,240,190,1)'); g.addColorStop(.35, 'rgba(255,214,120,.55)'); g.addColorStop(1, 'rgba(255,200,90,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    x.fillStyle = 'rgba(255,248,220,.95)'; x.beginPath(); x.moveTo(32, 46); x.lineTo(24, 30); x.lineTo(40, 30); x.closePath(); x.fill();
    return new THREE.CanvasTexture(c);
  })();
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false });
  const marks = new Map();
  function marksStep(t){
    const live = new Set();
    for(const st of stuck690){
      if(!st.id) continue; live.add(st);
      let mk = marks.get(st);
      if(!mk){ mk = new THREE.Sprite(mat); mk.renderOrder = 999; mk.userData.terrainAbsolute245 = true; scene.add(mk); marks.set(st, mk); }
      const d = player ? Math.hypot(st.x - player.x, st.z - player.z) : 1e9;
      mk.visible = d < SEE;
      if(mk.visible){ const s = .35 + Math.min(d, 40) * .012; mk.scale.set(s, s, s); mk.position.set(st.x, (st.y ?? terrH(st.x, st.z)) + .9 + Math.sin(t * 3 + st.x) * .08, st.z); }
    }
    for(const [st, mk] of marks) if(!live.has(st)){ scene.remove(mk); marks.delete(st); }
  }

  /* ---------- canto da tela: aljava e flechas no chão ---------- */
  const hud = document.createElement('div');
  hud.id = 'quiver695';
  hud.style.cssText = 'position:fixed;right:18px;bottom:150px;z-index:30;pointer-events:none;font:600 13px/1.35 Georgia,serif;color:#f1e6c8;text-shadow:0 1px 3px #000,0 0 6px #000;text-align:right;display:none';
  document.body.appendChild(hud);
  function hudStep(){
    let usingBow = false, cur = null, total = 0;
    try { usingBow = !!(started && FL() && FL().arrowShot()); cur = FL() && FL().current(); total = FL() ? FL().total() : 0; } catch(_) {}
    let near = 0, best = 1e9;
    for(const st of stuck690){ if(!st.id || !player) continue; const d = Math.hypot(st.x - player.x, st.z - player.z); if(d < SEE){ near++; if(d < best) best = d; } }
    if(!usingBow && !near){ hud.style.display = 'none'; return; }
    let h = '';
    if(usingBow) h += cur ? '<span style="opacity:.75">Aljava</span> · ' + name(cur) + ' × ' + (FL().count(cur)) + (total > FL().count(cur) ? '<br><span style="opacity:.7;font-size:12px">' + total + ' flechas no total</span>' : '') : '<span style="color:#ffb36b">Aljava vazia</span>';
    if(near) h += (h ? '<br>' : '') + '<span style="color:#ffe3a0">' + near + (near === 1 ? ' flecha' : ' flechas') + ' no chão · a mais perto a ' + Math.max(1, Math.round(best)) + ' m</span>';
    hud.innerHTML = h; hud.style.display = '';
  }

  /* ---------- momentos em que o Narrador explica ---------- */
  function dicasStep(){
    try {
      if(!started || !FL()) return;
      const bow = FL().arrowShot(), total = FL().total();
      if(bow && total > 0) dica('arco', 'Cada tiro do arco gasta uma flecha. Segure o botão para puxar a corda: quanto mais puxa, mais longe e mais forte ela vai. De longe a flecha cai, então mire um pouco acima do alvo.', 9000);
      if(bow && total > 0 && total <= 5) dica('poucas', 'Restam poucas flechas. Dorian vende pacotes no Mercado de Aster, e na Bancada Rústica de Campo você faz as suas com galho, pena e uma lasca ou minério. As flechas que você atira também podem ser recolhidas do chão.', 9000);
      if(stuck690.some(st => st.id)) dica('chao', 'A flecha que errou ficou cravada onde caiu, marcada por um brilho. Passe por cima dela para pegá-la de volta.');
    } catch(_) {}
  }

  setInterval(() => { try { marksStep(performance.now() / 1000); hudStep(); flushBag(); dicasStep(); } catch(e){ console.warn('flechas695', e); } }, 100);
})(window);
