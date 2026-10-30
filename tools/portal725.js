/* Missão fixa #22 «A Mão no Portal Primordial» (v725). Ato XI, depois da #21 (volta de Érebo).
   Portal Primordial (a 140 m ao sul da clareira de Érebo): Aldric, mantido na retaguarda, e a Projeção da Mão do Arquiteto, translúcida, sobre os registros da Primeira Ruptura.
   Escolha: recolher os dois documentos antigos com Aldric [E] e depois romper o elo de mana da Mão [E] (a projeção se desfaz; Aldric sai vivo com os documentos)
   ou avançar e destruir a projeção na força (Aldric foge sem os documentos).
   Romper o elo: revela que o Arquiteto recebia ordens de uma autoridade superior (entrada no Diário) e o Narrador confessa seu passado (marca; a conversa da #23 usa isso).
   Estado em profile.fixas545.q022.
   Simplificações: o Portal Primordial é uma clareira com um anel de pedra (não a Abóbada Subterrânea); a projeção é um colosso de vida alta (os «dedos» não existem separados);
   Aldric é um figurante parado (não luta); Lyra não aparece. */
(function () {
  'use strict';
  let world = null, worldT = 0, proj = null, aldric = null, grp = null, docs = [], elo = null, busy = false, lastSave = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q022 = profile.fixas545.q022 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const FZ = 334 + 280;
  const arena = () => { let x = 0; try { x = Fronteira551.cx(334); } catch (_) {} return { x: x + 50, z: FZ }; };
  const q21 = () => profile && profile.fixas545 && profile.fixas545.q021;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q022; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dA = () => { const a = arena(); return Math.hypot(player.x - a.x, player.z - a.z); };
  if (typeof LORE !== 'undefined') {
    LORE.q022_autoridade = ['Uma ordem acima do Arquiteto', 'No Portal Primordial você recolheu os dois documentos antigos e rompeu o elo de mana da Mão do Arquiteto, enquanto Aldric saía vivo. Os registros mostram que o Arquiteto recebia ordens de uma autoridade superior desconhecida, e o Narrador, pressionado, prometeu confessar o próprio passado.'];
    LORE.q022_forca = ['A Mão destruída à força', 'Você avançou e destruiu a projeção da Mão do Arquiteto no Portal Primordial. Aldric fugiu sem os documentos, que se desfizeram com ela. A autoridade acima do Arquiteto continua desconhecida.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> A Mão no Portal Primordial: desça com Aldric até o Portal, ao sul da clareira de Érebo. Mira o manteve na retaguarda.', 9000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3.5, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function mkScene() {
    if (grp) return; const a = arena(); grp = new THREE.Group();
    for (let i = 0; i < 10; i++) {
      const an = i / 10 * Math.PI * 2, x = a.x + Math.cos(an) * 9, z = a.z + Math.sin(an) * 9;
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 1.2), new THREE.MeshStandardMaterial({ color: 0x4a4660, emissive: 0x2a50a0, emissiveIntensity: .5 }));
      m.position.set(x, terrH(x, z) + 1.6, z); grp.add(m);
    }
    grp.userData.terrainAbsolute245 = true; scene.add(grp);
  }
  function mkAldric() {
    if (aldric || !window.NPC456) return; const a = arena(), x = a.x - 6, z = a.z + 6;
    try { const m = NPC456.create('homem'); aldric = NPC456.figure('homem', { m, name: 'Aldric', down: false, x, z, t: 0 }); m.root.userData.terrainAbsolute245 = true; scene.add(m.root); m.root.position.set(x, terrH(x, z), z); } catch (_) { aldric = null; }
  }
  function dropAll() {
    if (grp) { try { scene.remove(grp); grp.traverse(o => { o.geometry && o.geometry.dispose && o.geometry.dispose(); }); } catch (_) {} } grp = null;
    if (aldric) { try { scene.remove(aldric.m.root); } catch (_) {} } aldric = null;
    for (const d of docs) rmInter(d.inter); docs = []; rmInter(elo); elo = null;
  }
  function startPortal() {
    const s = S(); s.phase = 'portal'; s.docs = 0; save(); mkScene(); mkAldric(); const a = arena();
    docs = [0, 1].map(i => ({ got: false, inter: addInter('E · RECOLHER O DOCUMENTO ANTIGO', a.x - 8 + i * 2.5, a.z + 4, () => takeDoc(i)) }));
    spawnProj();
    try { toast('<b>[PORTAL]</b> Uma projeção translúcida da Mão do Arquiteto ataca o grupo sobre os registros da Primeira Ruptura. Recolha os dois documentos antigos com Aldric [E] e rompa o elo de mana da Mão, ou avance e destrua a projeção.', 12000); } catch (_) {}
  }
  function spawnProj() {
    const a = arena();
    try { proj = foe(KINDS.colosso ? 'colosso' : 'gigante', 'Projeção da Mão do Arquiteto', a.x, a.z - 4); proj.hp = proj.maxhp = Math.round(proj.maxhp * 2); proj.isBoss = true; proj.aggro = false; proj.hpIni725 = proj.hp; } catch (_) { proj = null; }
  }
  function takeDoc(i) {
    const s = S(), d = docs[i]; if (!d || d.got || s.phase !== 'portal') return;
    d.got = true; rmInter(d.inter); d.inter = null; s.docs = (s.docs || 0) + 1; save();
    if (s.docs >= 2) {
      const a = arena(); elo = addInter('E · ROMPER O ELO DE MANA DA MÃO', a.x, a.z - 4, rompe);
      try { toast('<b>[ALDRIC]</b> Os dois documentos estão com Aldric, que recua com eles. Agora rompa o elo de mana da Mão [E].', 9000); } catch (_) {}
    } else try { toast('Documento antigo recolhido (1 de 2).', 4000); } catch (_) {}
  }
  function rompe() {
    const s = S(); if (s.phase !== 'portal' || s.docs < 2) return;
    s.escolha = 'elo'; s.aldricVivo = true; s.autoridade = true; s.narradorConfessa = true;
    rmInter(elo); elo = null;
    if (proj && !proj.dead) { try { fxBurst(proj.x, 1, proj.z, 0x9a60ff, 24, 5); } catch (_) {} proj.noExpLoot = true; try { killEnemy(proj); proj.m.root.userData.reclaimed372 = true; } catch (_) {} }
    try { unlockLore('q022_autoridade'); } catch (_) {}
    finish();
    try { toast('<b>[PORTAL]</b> O elo se rompe e a projeção se desfaz. Aldric sai vivo com os documentos: o Arquiteto recebia ordens de uma autoridade superior desconhecida. O Narrador, pressionado, promete confessar o próprio passado.', 12000); } catch (_) {}
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); if (!s.escolha) s.escolha = 'forca'; dropAll(); save();
  }
  function forca() {
    const s = S(); if (s.escolha) return; s.escolha = 'forca'; try { unlockLore('q022_forca'); } catch (_) {}
    try { toast('<b>[PORTAL]</b> A projeção se desfaz sob seus golpes. Aldric fugiu sem os documentos, que sumiram com ela. A ordem acima do Arquiteto segue desconhecida.', 10000); } catch (_) {}
    finish();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const a = arena(); const s = S(); let text, target = a;
    if (ph === 'rota') text = 'Desça até o Portal Primordial, ao sul da clareira de Érebo';
    else if (s.docs >= 2) { text = 'Rompa o elo de mana da Mão [E]'; target = { x: a.x, z: a.z - 4 }; }
    else { text = 'Recolha os dois documentos antigos [E] (' + (s.docs || 0) + ' de 2) ou destrua a projeção'; target = { x: a.x - 7, z: a.z + 4 }; }
    return { actTitle: 'A MÃO NO PORTAL PRIMORDIAL', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); proj = null; aldric = null; grp = null; docs = []; elo = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q21() && q21().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dA() < 50) startPortal();
    if (s.phase === 'portal') {
      if (!grp && free) { mkScene(); mkAldric(); }
      if (proj && !proj.dead && !proj.gone) { if (!proj.aggro && (proj.hp < proj.hpIni725 || Math.hypot(proj.x - player.x, proj.z - player.z) < 14)) proj.aggro = true; }
      else if (proj && proj.dead) forca();
      else if ((!proj || proj.gone) && free && dA() < 55) { if (!(s.escolha)) spawnProj(); }
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q022) Fixas545.LIVE.primeva_q022 = 'v725'; } catch (e) { console.warn('Portal725', e); } };
  window.Portal725 = { state: S, active, objective, begin, get proj() { return proj; }, get docs() { return docs; }, get elo() { return elo; } };
})();
