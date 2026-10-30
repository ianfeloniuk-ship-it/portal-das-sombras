/* Missão fixa #27 «A Ronda das Três Tochas» (v730). Facção Vanguarda da Muralha, Aster. Gatilho: concluir a #26.
   O Guarda de Ronda Varek avisa que os braseiros externos do anel norte (a ~100 m da muralha, fora do alcance das sentinelas) foram apagados por Lobos Sombrios.
   Escolha (pelo que você faz): reacender os 4 braseiros [E] antes de caçar a matilha, ou emboscar o lobo líder no escuro.
   Reacender os 4 antes de a matilha cair: as sentinelas passam a dar apoio automático com flechas de fogo à noite (marca arqueirosFogo727).
   Caçar a matilha com algum braseiro ainda apagado: a matilha cai, mas as sentinelas não ganham o apoio.
   Estado em profile.fixas545.q027.
   Simplificações: sem exigir noite nem os itens Feixe de Lenha, Resina e Lampião de Viagem (a ação é só E nos braseiros); a matilha é de lobos comuns (líder com 2× vida);
   o apoio de flechas de fogo é só a marca (as sentinelas já atiram em inimigos perto da muralha). */
(function () {
  'use strict';
  let world = null, worldT = 0, braz = [], wolves = [], busy = false, lastSave = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q027 = profile.fixas545.q027 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const POS = [[-30, -100], [-10, -104], [10, -104], [30, -100]];
  const CEN = { x: 0, z: -100 };
  const q26 = () => profile && profile.fixas545 && profile.fixas545.q026;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q027; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dC = () => Math.hypot(player.x - CEN.x, player.z - CEN.z);
  if (typeof LORE !== 'undefined') {
    LORE.q027_braseiros = ['A Ronda das Três Tochas', 'Você reacendeu os quatro braseiros externos de Aster antes de caçar a matilha de Lobos Sombrios. Desde então, as sentinelas da muralha dão apoio com flechas de fogo à noite.'];
    LORE.q027_emboscada = ['A emboscada no escuro', 'Você foi direto à matilha de Lobos Sombrios com os braseiros ainda apagados. A matilha caiu, mas as sentinelas seguem sem o apoio das flechas de fogo.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> A Ronda das Três Tochas: o Guarda de Ronda Varek avisa que os braseiros externos do anel norte de Aster foram apagados por Lobos Sombrios. Vá até lá.', 10000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3.5, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function mkBraz() {
    for (const b of braz) { rmInter(b.inter); try { scene.remove(b.m); } catch (_) {} }
    braz = POS.map(([x, z]) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(.5, .35, 1.1, 8), new THREE.MeshStandardMaterial({ color: 0x2a2826, emissive: 0, roughness: .9 }));
      m.position.set(x, terrH(x, z) + .55, z); m.userData.terrainAbsolute245 = true; scene.add(m);
      const b = { x, z, m, lit: false, inter: null }; b.inter = addInter('E · REACENDER O BRASEIRO', x, z, () => light(b)); return b;
    });
  }
  function light(b) {
    const s = S(); if (b.lit || s.phase !== 'ronda') return; b.lit = true; rmInter(b.inter); b.inter = null;
    try { b.m.material.emissive.setHex(0xff7a20); b.m.material.emissiveIntensity = 1.2; } catch (_) {}
    s.acesos = braz.filter(k => k.lit).length; save();
    try { toast('Braseiro reacendido (' + s.acesos + ' de 4).', 3500); } catch (_) {}
  }
  function spawnWolves() {
    wolves = [];
    for (let i = 0; i < 3; i++) { try { const e = foe(KINDS.lobo ? 'lobo' : 'goblin', i === 0 ? 'Lobo Sombrio Líder' : 'Lobo Sombrio', CEN.x - 6 + i * 6, CEN.z - 20); if (i === 0) { e.hp = e.maxhp = Math.round(e.maxhp * 2); } e.aggro = false; e.lobo727 = true; wolves.push(e); } catch (_) {} }
  }
  function startRonda() {
    const s = S(); s.phase = 'ronda'; save(); mkBraz(); spawnWolves();
    try { toast('<b>[ANEL NORTE]</b> Os 4 braseiros estão apagados e há Lobos Sombrios na escuridão. Reacenda os braseiros [E] antes de caçar a matilha, ou embosque o lobo líder.', 11000); } catch (_) {}
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); const n = braz.filter(b => b.lit).length; s.acesos = n;
    for (const b of braz) rmInter(b.inter);
    if (n === 4) { s.escolha = 'braseiros'; s.arqueirosFogo727 = true; profile.arqueirosFogo727 = true; try { unlockLore('q027_braseiros'); } catch (_) {} try { toast('<b>[VAREK]</b> Os 4 braseiros acesos e a matilha caída. Desde esta noite as sentinelas dão apoio com flechas de fogo.', 11000); } catch (_) {} }
    else { s.escolha = 'emboscada'; try { unlockLore('q027_emboscada'); } catch (_) {} try { toast('<b>[VAREK]</b> A matilha caiu, mas os braseiros seguem apagados: sem apoio de flechas de fogo nas sentinelas.', 10000); } catch (_) {} }
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; let text, target = CEN; const s = S();
    if (ph === 'rota') text = 'Vá ao anel norte de Aster, onde os braseiros foram apagados';
    else { const w = wolves.find(e => !e.dead); text = 'Reacenda os braseiros [E] (' + braz.filter(b => b.lit).length + ' de 4) e cace a matilha de Lobos Sombrios'; if (w) target = { x: w.x, z: w.z }; }
    return { actTitle: 'A RONDA DAS TRÊS TOCHAS', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); wolves = []; braz = []; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q26() && q26().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dC() < 50) startRonda();
    if (s.phase === 'ronda') {
      if (!braz.length && free) mkBraz();
      if (!wolves.length && free && dC() < 55) spawnWolves();
      for (const e of wolves) if (!e.dead && !e.gone && !e.aggro && (e.hp < e.maxhp || Math.hypot(e.x - player.x, e.z - player.z) < 12)) e.aggro = true;
      if (wolves.length && wolves.some(e => e.gone && !e.dead) && free) wolves = [];
      if (wolves.length && wolves.every(e => e.dead)) finish();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q027) Fixas545.LIVE.primeva_q027 = 'v730'; } catch (e) { console.warn('Ronda730', e); } };
  window.Ronda727 = { state: S, active, objective, begin, get wolves() { return wolves; }, get braz() { return braz; } };
})();
