/* Missão fixa #29 «Sangue na Neve do Desfiladeiro» (v732). Facção Vanguarda da Muralha. Gatilho (simplificado): concluir a #28 (Rank D na Vanguarda).
   Rota Norte, no Desfiladeiro (60, -240), a ~240 m de Aster: o rastro de sangue azul leva a Torben Halvorsen cercado por 3 Yetis Corrompidos.
   Torben tem 100 de vida na missão: cada yeti vivo o fere 1 por segundo se você está longe dele e 1 a cada 2 segundos se você luta a menos de 8 m dele (ombro a ombro).
   Escolha: lutar ombro a ombro na garganta ou escalar a crista [E] e derrubar as estalactites [E] (derrubam 2 yetis de uma vez e atordoam o terceiro).
   Se Torben terminar de pé, vira aliado: marca aliadoTorben, e o figurante fica na rota norte (aparece junto à fogueira da rota enquanto você está nela).
   Estado em profile.fixas545.q029.
   Simplificações: Torben é um figurante (não luta; a vida dele é a conta acima); «dividir fogueira» é só o figurante parado na rota; a crista é um ponto a 16 m (subir = ser levado até lá); sem animações de escalada. */
(function () {
  'use strict';
  let world = null, worldT = 0, yetis = [], torben = null, grp = null, inters = [], busy = false, lastSave = 0, tHp = 100, crestOn = false;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q029 = profile.fixas545.q029 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const SPOT = { x: 60, z: -240 }, CREST = { x: 76, z: -246 };
  const q28 = () => profile && profile.fixas545 && profile.fixas545.q028;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q029; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dS = () => Math.hypot(player.x - SPOT.x, player.z - SPOT.z);
  if (typeof LORE !== 'undefined') {
    LORE.q029_aliado = ['Sangue na Neve do Desfiladeiro', 'Você salvou o caçador Torben Halvorsen dos Yetis Corrompidos do Desfiladeiro das Lágrimas, sem que ele caísse. Ele agora patrulha a rota norte e divide fogueira com você.'];
    LORE.q029_caiu = ['Sangue na Neve do Desfiladeiro', 'Os Yetis Corrompidos do Desfiladeiro caíram, mas Torben Halvorsen caiu antes. A patrulha de Ymiria segue desaparecida.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> Sangue na Neve do Desfiladeiro: uma patrulha de Ymiria sumiu. Siga o rastro de sangue azul pela Rota Norte, no Desfiladeiro.', 10000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3.5, label, use: fn }; L.inter.push(i); inters.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); inters = inters.filter(k => k !== i); }
  function mkTorben() {
    if (torben || !window.NPC456) return;
    try { const m = NPC456.create('homem'); torben = NPC456.figure('homem', { m, name: 'Torben Halvorsen', down: false, x: SPOT.x, z: SPOT.z, t: 0 }); m.root.userData.terrainAbsolute245 = true; scene.add(m.root); m.root.position.set(SPOT.x, terrH(SPOT.x, SPOT.z), SPOT.z); } catch (_) { torben = null; }
  }
  function dropTorben() { if (torben) { try { scene.remove(torben.m.root); } catch (_) {} } torben = null; }
  function spawnYetis() {
    yetis = [];
    for (let i = 0; i < 3; i++) { try { const e = foe(KINDS.yeticorrompido ? 'yeticorrompido' : 'yeti', 'Yeti Corrompido', SPOT.x - 6 + i * 6, SPOT.z - 8); e.aggro = true; e.yeti729 = true; yetis.push(e); } catch (_) {} }
  }
  function startGarganta() {
    const s = S(); s.phase = 'garganta'; tHp = 100; crestOn = false; save(); mkTorben(); spawnYetis();
    rmAll(); addInter('E · ESCALAR A CRISTA ROCHOSA', SPOT.x + 10, SPOT.z - 4, climb);
    try { toast('<b>[DESFILADEIRO]</b> Torben está cercado por Yetis Corrompidos. Lute ombro a ombro com ele na garganta, ou escale a crista [E] e derrube as estalactites sobre as feras.', 12000); } catch (_) {}
  }
  function rmAll() { for (const i of inters.slice()) rmInter(i); }
  function climb() {
    const s = S(); if (s.phase !== 'garganta' || crestOn) return; crestOn = true; s.crista = true;
    player.x = CREST.x; player.z = CREST.z; try { player.y = terrH(CREST.x, CREST.z); } catch (_) {}
    rmAll(); addInter('E · DERRUBAR AS ESTALACTITES', CREST.x, CREST.z, drop); save();
    try { toast('Você escala a crista rochosa. As estalactites pendem sobre a garganta. Derrube-as [E].', 6000); } catch (_) {}
  }
  function drop() {
    const s = S(); if (s.phase !== 'garganta' || s.derrubou) return; s.derrubou = true; rmAll();
    let n = 0; for (const e of yetis) if (!e.dead && n < 2) { n++; try { fxBurst(e.x, 1, e.z, 0xbfe8ff, 18, 4); } catch (_) {} e.hp = 0; try { hurtEnemy(e, e.maxhp, e.x, e.z, { kb: 0, stun: 0, pierce: true }); } catch (_) {} }
    for (const e of yetis) if (!e.dead) e.stun = 4;
    try { toast('As estalactites desabam sobre a garganta: dois yetis caem e o terceiro fica atordoado.', 6000); } catch (_) {}
    save();
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); rmAll(); s.torbenVida = Math.round(tHp); s.escolha = s.derrubou ? 'crista' : 'ombro';
    if (tHp > 0) { s.aliadoTorben = true; profile.aliadoTorben729 = true; try { unlockLore('q029_aliado'); } catch (_) {} try { toast('<b>[TORBEN]</b> Torben se mantém de pé: aliado. Ele passa a patrulhar a rota norte e dividir fogueira com você.', 11000); } catch (_) {} }
    else { s.torbenCaiu = true; dropTorben(); try { unlockLore('q029_caiu'); } catch (_) {} try { toast('<b>[DESFILADEIRO]</b> Os yetis caem, mas Torben caiu antes. A patrulha de Ymiria segue desaparecida.', 10000); } catch (_) {} }
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; let text, target = SPOT;
    if (ph === 'rota') text = 'Siga o rastro de sangue azul pela Rota Norte, no Desfiladeiro';
    else { text = 'Salve Torben dos Yetis Corrompidos (vida dele: ' + Math.max(0, Math.round(tHp)) + ')'; const y = yetis.find(e => !e.dead); if (y) target = { x: y.x, z: y.z }; }
    return { actTitle: 'SANGUE NA NEVE DO DESFILADEIRO', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); yetis = []; torben = null; inters = []; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (s.aliadoTorben && s.done && free && dS() < 70) mkTorben();
    if (s.done) return;
    if (!s.phase) { if (q28() && q28().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dS() < 50) startGarganta();
    if (s.phase === 'garganta') {
      if (!torben && free) mkTorben();
      if (!yetis.length && free && dS() < 55) spawnYetis();
      if (yetis.length && yetis.some(e => e.gone && !e.dead) && free) yetis = [];
      const vivos = yetis.filter(e => !e.dead && !e.gone && !(e.stun > 0));
      for (const e of yetis) if (!e.dead && !e.gone) e.aggro = true;
      if (vivos.length && tHp > 0) { const near = Math.hypot(player.x - SPOT.x, player.z - SPOT.z) < 8; tHp -= vivos.length * (near ? .5 : 1) * dt; if (tHp < 0) tHp = 0; }
      if (yetis.length && yetis.every(e => e.dead)) finish();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q029) Fixas545.LIVE.primeva_q029 = 'v732'; } catch (e) { console.warn('Torben732', e); } };
  window.Torben729 = { state: S, active, objective, begin, get yetis() { return yetis; }, get tHp() { return tHp; } };
})();
