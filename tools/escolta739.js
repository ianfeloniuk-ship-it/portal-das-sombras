/* Missão fixa #31 «Escolta de Guerra para Solaria» (v739). Facção Vanguarda da Muralha. Gatilho: concluir a #30.
   Uma carroça blindada com aço temperado de Kael parte da Estrada Real (leste de Aster, x = 200) e atravessa três Nós de Encontro (x = 270, 340, 410) com 2 Orcs Fendidos cada, até x = 440 (Solaria, simplificado).
   A carroça tem 100% de integridade. Ela anda a 2,5 m/s quando você está a menos de 4 m dela (viajando na traseira: ela anda mesmo com orcs vivos, e os orcs que a alcançam a menos de 6 m tiram 3% por segundo cada)
   ou, se você está à frente, só quando não há orc vivo a menos de 30 m dela (marchando à frente: ela espera você limpar a barricada).
   Entregar com 100% de integridade: a Escassez de Solaria vai a zero e as armaduras douradas entram na loja local (marcas escassezSolaria730 = 0 e armadurasDouradas731). Com menos: a carga chega, sem esses efeitos.
   Estado em profile.fixas545.q031.
   Simplificações: Solaria não existe no mundo (a carga é entregue em x = 440, na estrada); Teren e Aurelius só no aviso; a loja dourada e a Escassez são marcas no perfil; os orcs são orcs comuns. */
(function () {
  'use strict';
  let world = null, worldT = 0, cart = null, orcs = [], nodes = [], busy = false, lastSave = 0, integ = 100, tIdx = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q031 = profile.fixas545.q031 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const START = { x: 200, z: 0 }, NODES = [270, 340, 410], END = 440;
  const q30 = () => profile && profile.fixas545 && profile.fixas545.q030;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q031; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dS = () => Math.hypot(player.x - START.x, player.z - START.z);
  if (typeof LORE !== 'undefined') {
    LORE.q031_integra = ['Escolta de Guerra para Solaria', 'A carroça blindada chegou a Solaria com 100% de integridade. A Escassez de Solaria caiu a zero e as armaduras douradas chegaram à loja local.'];
    LORE.q031_parcial = ['Escolta de Guerra para Solaria', 'A carroça blindada chegou a Solaria, mas avariada. A carga foi entregue, sem baixar a Escassez nem liberar as armaduras douradas.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> Escolta de Guerra para Solaria: a carroça blindada de Teren, com aço temperado de Kael, espera na Estrada Real a leste de Aster. O Grão-Mestre Aurelius conta com ela.', 10000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function mkCart() {
    if (cart) return; const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.6, 4.4), new THREE.MeshStandardMaterial({ color: 0x5a5e66, metalness: .5, roughness: .6 })); b.position.y = 1.2; g.add(b);
    for (const dx of [-1.5, 1.5]) for (const dz of [-1.6, 1.6]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .3, 10), new THREE.MeshStandardMaterial({ color: 0x3a2c1c })); w.rotation.z = Math.PI / 2; w.position.set(dx, .55, dz); g.add(w); }
    cart = { x: START.x, z: START.z, g }; g.position.set(cart.x, terrH(cart.x, cart.z), cart.z); g.rotation.y = Math.PI / 2; g.userData.terrainAbsolute245 = true; scene.add(g);
  }
  function dropCart() { if (cart) { try { scene.remove(cart.g); } catch (_) {} } cart = null; }
  function startEscolta() {
    const s = S(); s.phase = 'estrada'; integ = 100; tIdx = 0; s.integ = 100; save(); mkCart(); orcs = []; nodes = NODES.map(x => ({ x, spawned: false }));
    try { toast('<b>[ESTRADA REAL]</b> A carroça blindada parte para Solaria. Há três Nós de Encontro infestados de Orcs Fendidos. Viaje na traseira (perto dela) ou marche à frente limpando as barricadas.', 12000); } catch (_) {}
  }
  function spawnOrcs(n) {
    for (let i = 0; i < 2; i++) { try { const e = foe(KINDS.orc ? 'orc' : 'goblin', 'Orc Fendido', n.x + 4, i * 5 - 3); e.aggro = false; e.orc731 = true; e.node731 = n; orcs.push(e); } catch (_) {} }
    n.spawned = true;
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); s.integ = Math.round(integ);
    if (integ >= 99.5) { s.escolha = 'integra'; profile.escassezSolaria730 = 0; profile.armadurasDouradas731 = true; try { unlockLore('q031_integra'); } catch (_) {} try { toast('<b>[SOLARIA]</b> Carga entregue com 100% de integridade: a Escassez de Solaria cai a zero e as armaduras douradas chegam à loja local.', 12000); } catch (_) {} }
    else { s.escolha = 'parcial'; try { unlockLore('q031_parcial'); } catch (_) {} try { toast('<b>[SOLARIA]</b> Carga entregue com ' + Math.round(integ) + '% de integridade: sem baixar a Escassez nem liberar as armaduras douradas.', 12000); } catch (_) {} }
    dropCart(); save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; let text, target = START;
    if (ph === 'rota') text = 'Vá à carroça blindada, na Estrada Real a leste de Aster';
    else { text = 'Escolte a carroça até Solaria (integridade ' + Math.round(integ) + '%)'; if (cart) target = { x: Math.min(END, cart.x + 25), z: 0 }; }
    return { actTitle: 'ESCOLTA DE GUERRA PARA SOLARIA', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); cart = null; orcs = []; nodes = []; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q30() && q30().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dS() < 50) startEscolta();
    if (s.phase === 'estrada') {
      if (!cart) mkCart();
      for (const n of nodes) if (!n.spawned && cart.x > n.x - 40 && free) spawnOrcs(n);
      for (const e of orcs) if (!e.dead && !e.gone && !e.aggro && (Math.hypot(e.x - player.x, e.z - player.z) < 16 || Math.hypot(e.x - cart.x, e.z - cart.z) < 16)) e.aggro = true;
      orcs = orcs.filter(e => !(e.gone && !e.dead));
      const vivos = orcs.filter(e => !e.dead && !e.gone);
      const pd = Math.hypot(player.x - cart.x, player.z - cart.z);
      const perto = vivos.filter(e => Math.hypot(e.x - cart.x, e.z - cart.z) < 30).length;
      const monta = pd < 4;
      if (free && cart.x < END && (monta || (perto === 0 && pd < 30))) {
        if (monta && perto > 0) s.montado = true;
        cart.x = Math.min(END, cart.x + 2.5 * dt); cart.g.position.set(cart.x, terrH(cart.x, 0), 0);
      }
      for (const e of vivos) if (Math.hypot(e.x - cart.x, e.z - cart.z) < 6) integ = Math.max(0, integ - 3 * dt);
      for (const e of vivos) if (e.aggro && Math.hypot(e.x - cart.x, e.z - cart.z) > 3 && pd > 10) { const dx = cart.x - e.x, dz = cart.z - e.z, d = Math.hypot(dx, dz) || 1; try { moveEnt(e, dx / d * (e.speed || 2) * dt, dz / d * (e.speed || 2) * dt); } catch (_) {} }
      if (cart.x >= END && vivos.length === 0) finish();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); s.integ = Math.round(integ); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q031) Fixas545.LIVE.primeva_q031 = 'v739'; } catch (e) { console.warn('Escolta739', e); } };
  window.Escolta731 = { state: S, active, objective, begin, get cart() { return cart; }, get orcs() { return orcs; }, get integ() { return integ; } };
})();
