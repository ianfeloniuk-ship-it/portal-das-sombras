/* Missão fixa #32 «Alvo Notório: Orelha-Rubra» (v740). Facção Vanguarda da Muralha. Gatilho (simplificado): concluir a #31 (contrato de Alvo Notório Rank C).
   Orelha-Rubra (coelho elite com 8× vida e esquiva) nos Campos Floridos a sudoeste de Aster (-160, 60): parece um coelho comum até você chegar a 12 m. Ao ser acertado, 50% das vezes ele esquiva (devolve o dano).
   Escolha: armar um dos 2 laços [E] na trilha (se ele passa a 4 m, fica preso 8 s: atordoado e sem esquivar) ou vencê-lo no reflexo com Contra-Fluxo (cada aparo perfeito, botão do meio, o atordoa 3 s e tira a esquiva por 4 s).
   Nos dois casos: título «Caçador do Orelha-Rubra» (profile.titulo732, marca de +4% de ouro de monstros) e +270 de Reputação da Ordem.
   Estado em profile.fixas545.q032.
   Simplificações: a caveira a 60 m no minimapa não existe; o laço é só E (sem Armadilha de Laço nem Flecha Enredante no inventário); o ouro +4% é marca (profile.bonusOuro732);
   Contra-Fluxo = o aparo perfeito de tools/guard472.js (Guard472.stats.parries); o ramo registrado é laco (se algum laço o prendeu), reflexo (2 ou mais aparos) ou campo (nenhum dos dois). */
(function () {
  'use strict';
  let world = null, worldT = 0, rabbit = null, traps = [], busy = false, lastSave = 0, prevHp = 0, noDodge = 0, p0 = 0, lastPar = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q032 = profile.fixas545.q032 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const SPOT = { x: -160, z: 60 }, TR = [[-148, 60], [-141, 61]];
  const q31 = () => profile && profile.fixas545 && profile.fixas545.q031;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q032; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dS = () => Math.hypot(player.x - SPOT.x, player.z - SPOT.z);
  const par = () => (window.Guard472 && Guard472.stats) ? Guard472.stats.parries : 0;
  if (typeof LORE !== 'undefined') {
    LORE.q032_laco = ['Orelha-Rubra', 'Você armou um laço na trilha dos Campos Floridos e prendeu o Orelha-Rubra para travar a esquiva dele. Título: Caçador do Orelha-Rubra (+4% de ouro de monstros) e +270 de Reputação da Ordem.'];
    LORE.q032_reflexo = ['Orelha-Rubra', 'Você venceu o Orelha-Rubra no reflexo, apando os saltos dele com Contra-Fluxo. Título: Caçador do Orelha-Rubra (+4% de ouro de monstros) e +270 de Reputação da Ordem.'];
    LORE.q032_campo = ['Orelha-Rubra', 'Você derrubou o Orelha-Rubra nos Campos Floridos, apesar da esquiva. Título: Caçador do Orelha-Rubra (+4% de ouro de monstros) e +270 de Reputação da Ordem.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> Alvo Notório, Orelha-Rubra: um coelho branco entre as flores salta na garganta de caçadores novatos. Vá aos Campos Floridos, a sudoeste de Aster.', 10000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3.5, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function mkTraps() {
    for (const t of traps) { rmInter(t.inter); try { scene.remove(t.m); } catch (_) {} }
    traps = TR.map(([x, z]) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(.9, .06, 6, 16), new THREE.MeshStandardMaterial({ color: 0x7a5a30 })); m.rotation.x = Math.PI / 2; m.position.set(x, terrH(x, z) + .1, z); m.userData.terrainAbsolute245 = true; scene.add(m);
      const t = { x, z, m, set: false, used: false, inter: null }; t.inter = addInter('E · ARMAR LAÇO NA TRILHA', x, z, () => arm(t)); return t;
    });
  }
  function arm(t) {
    const s = S(); if (t.set || s.phase !== 'campos') return; t.set = true; rmInter(t.inter); t.inter = null;
    try { t.m.material.color.setHex(0xffd060); } catch (_) {} try { toast('Laço armado na trilha.', 3000); } catch (_) {}
  }
  function spawnRabbit() {
    try { rabbit = foe('coelho', 'Orelha-Rubra', SPOT.x, SPOT.z); rabbit.hp = rabbit.maxhp = Math.round(rabbit.maxhp * 8); rabbit.aggro = false; rabbit.orelha732 = true; rabbit.hpIni732 = rabbit.hp; prevHp = rabbit.hp; try { rabbit.m.root.scale.multiplyScalar(1.3); } catch (_) {} } catch (_) { rabbit = null; }
  }
  function startCampos() {
    const s = S(); s.phase = 'campos'; p0 = par(); lastPar = p0; save(); mkTraps(); spawnRabbit();
    try { toast('<b>[CAMPOS FLORIDOS]</b> Um coelho branco entre as flores... é o Orelha-Rubra. Arme um laço [E] para travar a esquiva dele, ou vença-o no reflexo com Contra-Fluxo (aparo perfeito, botão do meio).', 12000); } catch (_) {}
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); for (const t of traps) rmInter(t.inter);
    const ap = par() - p0; s.aparos = ap;
    s.escolha = s.laco ? 'laco' : (ap >= 2 ? 'reflexo' : 'campo');
    profile.titulo732 = 'Caçador do Orelha-Rubra'; profile.bonusOuro732 = .04;
    try { addOrderRep(270, 'Orelha-Rubra'); } catch (_) {}
    try { unlockLore('q032_' + s.escolha); } catch (_) {}
    try { toast('<b>[TÍTULO]</b> Caçador do Orelha-Rubra (+4% de ouro de monstros) e <b>+270 de Reputação da Ordem</b>.', 11000); } catch (_) {}
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; let text, target = SPOT;
    if (ph === 'rota') text = 'Vá aos Campos Floridos, a sudoeste de Aster, e procure o coelho branco';
    else { text = 'Derrube o Orelha-Rubra: prenda-o em um laço [E] ou vença-o no reflexo (aparo perfeito)'; if (rabbit && !rabbit.dead) target = { x: rabbit.x, z: rabbit.z }; }
    return { actTitle: 'ALVO NOTÓRIO: ORELHA-RUBRA', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); rabbit = null; traps = []; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q31() && q31().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dS() < 50) startCampos();
    if (s.phase === 'campos') {
      if (!traps.length && free) mkTraps();
      if (rabbit && !rabbit.dead && !rabbit.gone) {
        const pd = Math.hypot(rabbit.x - player.x, rabbit.z - player.z);
        if (!rabbit.eng732 && (rabbit.hp < rabbit.hpIni732 || pd < 12)) rabbit.eng732 = true;
        if (rabbit.eng732) rabbit.aggro = true; /* a ecologia do coelho (tímido) apagaria a agressão */
        noDodge = Math.max(0, noDodge - dt);
        if (rabbit.eng732 && pd > 3 && !(rabbit.stun > 0)) { /* salto: avança direto para você (a IA do coelho não persegue de longe) */ try { moveEnt(rabbit, (player.x - rabbit.x) / pd * (rabbit.speed || 3) * 1.6 * dt, (player.z - rabbit.z) / pd * (rabbit.speed || 3) * 1.6 * dt); } catch (_) {} }
        for (const t of traps) if (t.set && !t.used && Math.hypot(rabbit.x - t.x, rabbit.z - t.z) < 4) { t.used = true; s.laco = true; rabbit.stun = 8; noDodge = 8; try { floater(rabbit.x, rabbit.z, 'PRESO NO LAÇO', '#ffd76a', true, 2.4); } catch (_) {} try { t.m.material.color.setHex(0x404040); } catch (_) {} save(); }
        if (par() > lastPar) { lastPar = par(); rabbit.stun = Math.max(rabbit.stun || 0, 3); noDodge = Math.max(noDodge, 4); try { floater(rabbit.x, rabbit.z, 'CONTRA-FLUXO', '#8ad0ff', true, 2.2); } catch (_) {} }
        if (rabbit.hp < prevHp) { const d = prevHp - rabbit.hp; if (noDodge <= 0 && Math.random() < .5) { rabbit.hp = prevHp; try { floater(rabbit.x, rabbit.z, 'ESQUIVA', '#ffffff', true, 1.8); } catch (_) {} } else prevHp = rabbit.hp; }
        else prevHp = rabbit.hp;
      } else if (rabbit && rabbit.dead) finish();
      else if (rabbit && rabbit.gone && free) rabbit = null;
      if (!rabbit && free && dS() < 55 && s.phase === 'campos') spawnRabbit();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q032) Fixas545.LIVE.primeva_q032 = 'v740'; } catch (e) { console.warn('Orelha740', e); } };
  window.Orelha732 = { state: S, active, objective, begin, get rabbit() { return rabbit; }, get traps() { return traps; } };
})();
