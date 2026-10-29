/* Missão fixa #17 «A Terceira Âncora: A Fossa Abissal de Thalor e a Traição de Logos» (v686). Ato IX, depois da Segunda Âncora (#16).
   No armazém do cais da neblina, Dorian lança cristais corrompidos nas correntes e revela ser Logos, o Arauto da Ruptura. Escolha no confronto:
   ferir Logos (arranca um fragmento do manto: Estilhaço Dourado, para a forja de nível Estrela) ou destruir o lote de cristais (E) antes que caiam no mar.
   Logos foge nos dois casos. Depois, o mergulho: o Leviatã das Correntes e a pressão abissal junto da Pedra-Âncora. A pressão tira 2% da vida por segundo;
   com os cristais destruídos, 1%. Estado em profile.fixas545.q017.
   Simplificações: o mergulho acontece no cais de Thalor (a Fossa Submersa e o bolsão de ar não existem); o Braço Esquerdo do Arquiteto não é um segundo chefe;
   o Estilhaço Dourado é uma marca no perfil (s.estilhaco) e uma entrada no Diário, sem item na forja ainda. */
(function () {
  'use strict';
  let world = null, worldT = 0, logos = null, dorian = null, crystals = null, crysInter = null, levi = null, busy = false, lastSave = 0, pressT = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q017 = profile.fixas545.q017 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const city = () => { try { const n = nearestCity(-3850, 0); if (n && n.c && n.c.name === 'Thalor') return n.c; } catch (_) {} return { x: -3840, z: 0, name: 'Thalor', id: 'thalor' }; };
  const q16 = () => profile && profile.fixas545 && profile.fixas545.q016;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q017; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dC = () => { const c = city(); return Math.hypot(player.x - c.x, player.z - c.z); };
  const spot = () => { const c = city(); return { x: c.x - 16, z: c.z + 12 }; };
  if (typeof LORE !== 'undefined') {
    LORE.q017_logos = ['Dorian era Logos', 'No armazém do cais da neblina, Dorian lançava cristais corrompidos nas correntes e se revelou Logos, o Arauto da Ruptura. Você o feriu e arrancou um fragmento do manto dele: o Estilhaço Dourado, para a forja de nível Estrela. Os cristais caíram no mar e a pressão abissal foi plena no mergulho.'];
    LORE.q017_cristais = ['O lote de cristais destruído', 'Dorian era Logos, o Arauto da Ruptura. Você destruiu o lote de cristais corrompidos antes que caísse no mar, e Logos fugiu. A pressão abissal ficou pela metade no mergulho contra o Leviatã.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> A Terceira Âncora: siga até o Porto de Thalor (-3850, 0) e procure o armazém do cais da neblina.', 9000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; /* cityRaider341: a cidade segura (390-ia) não empurra o monstro para fora das muralhas */
    e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function buildCrystals() {
    const p = spot(), g = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(.45 + (i % 3) * .18, 0), new THREE.MeshStandardMaterial({ color: 0x7a2a9a, emissive: 0x9a30d0, emissiveIntensity: .9, roughness: .3 }));
      m.position.set(p.x - 3 + (i % 3) * 1.4, terrH(p.x, p.z) + .6 + (i % 2) * .5, p.z + 2 + (i >> 1) * .8); m.scale.y = 1.7; m.rotation.y = i; g.add(m);
    }
    g.userData.terrainAbsolute245 = true; scene.add(g); crystals = g;
  }
  function dropCrystals() { if (crystals) { try { scene.remove(crystals); crystals.traverse(o => { o.geometry && o.geometry.dispose && o.geometry.dispose(); }); } catch (_) {} } crystals = null; rmInter(crysInter); crysInter = null; }
  function startArmazem() {
    const s = S(), p = spot(); s.phase = 'armazem'; save();
    for (const e of [logos]) if (e && !e.dead) { e.gone = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    dropCrystals(); buildCrystals();
    crysInter = addInter('E · DESTRUIR O LOTE DE CRISTAIS CORROMPIDOS', p.x - 2, p.z + 2.5, smash);
    try {
      logos = foe('rogue', 'Dorian, o mercador', p.x, p.z); logos.hp = logos.maxhp = Math.round(logos.maxhp * 2); logos.aggro = false; logos.logos686 = true; logos.hpIni686 = logos.hp;
    } catch (_) { logos = null; }
    try { toast('<b>[THALOR]</b> No armazém do cais da neblina, Dorian lança cristais corrompidos nas correntes. Fira-o para arrancar um fragmento do manto, ou destrua o lote de cristais [E] antes que caia no mar.', 11000); } catch (_) {}
  }
  function logosFlee(why) {
    if (logos) { logos.gone = true; try { const ix = enemies.indexOf(logos); if (ix >= 0) enemies.splice(ix, 1); scene.remove(logos.m.root); } catch (_) {} }
    try { toast('<b>[LOGOS]</b> «Eu sou Logos, o Arauto da Ruptura. A Âncora de Thalor será minha.» Ele foge pelo cais. ' + why, 10000); } catch (_) {}
  }
  function smash() {
    const s = S(); if (s.phase !== 'armazem' || s.escolha) return;
    s.escolha = 'cristais'; s.cristais = true; dropCrystals(); try { unlockLore('q017_cristais'); } catch (_) {}
    logosFlee('Os cristais foram destruídos: a pressão abissal será de 1% da vida por segundo.'); startDive();
  }
  function wound() {
    const s = S(); if (s.phase !== 'armazem' || s.escolha) return;
    s.escolha = 'logos'; s.estilhaco = true; try { unlockLore('q017_logos'); } catch (_) {}
    dropCrystals(); /* o lote cai no mar sem você */
    logosFlee('Você arrancou o Estilhaço Dourado do manto dele. Os cristais caíram no mar: a pressão abissal será de 2% da vida por segundo.'); startDive();
  }
  function startDive() {
    const s = S(), c = city(); s.phase = 'mergulho'; save();
    try { levi = foe(KINDS.lula_f ? 'lula_f' : 'lula', 'Leviatã das Correntes', c.x + 8, c.z + 14); levi.hp = levi.maxhp = Math.round(levi.maxhp * 3.5); levi.isBoss = true; levi.aggro = true; levi.levi686 = true; } catch (_) { levi = null; }
    try { toast('<b>[THALOR]</b> O Leviatã das Correntes sobe da Fossa junto da Pedra-Âncora. A pressão abissal pesa sobre você: derrube o Leviatã.', 9000); } catch (_) {}
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); dropCrystals();
    try { toast('<b>[THALOR]</b> O Leviatã cai e a Terceira Âncora se estabiliza' + (s.estilhaco ? '. O Estilhaço Dourado fica com você.' : ' com a pressão pela metade.'), 10000); } catch (_) {}
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const c = city(); let text, target = { x: c.x, z: c.z };
    if (ph === 'rota') text = 'Siga até o Porto de Thalor e procure o armazém do cais da neblina';
    else if (ph === 'armazem') { text = 'Fira Dorian ou destrua o lote de cristais [E]'; target = spot(); }
    else { text = 'Derrote o Leviatã das Correntes · pressão abissal ' + (S().cristais ? '1' : '2') + '% da vida por segundo'; if (levi && !levi.dead) target = { x: levi.x, z: levi.z }; }
    return { actTitle: 'A TERCEIRA ÂNCORA: A FOSSA ABISSAL DE THALOR E A TRAIÇÃO DE LOGOS', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); logos = levi = null; crystals = crysInter = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q16() && q16().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dC() < 90) startArmazem();
    if (s.phase === 'armazem') {
      if (!logos && free && dC() < 120) startArmazem();
      else if (logos && !logos.dead && !logos.gone) {
        logos.aggro = false; if (logos.hp < logos.hpIni686) wound();
      } else if (logos && logos.dead && !s.escolha) wound();
      else if (logos && logos.gone && !s.escolha && free) { logos = null; startArmazem(); }
      if (crysInter && !L.inter.includes(crysInter)) { const p = spot(); crysInter = addInter('E · DESTRUIR O LOTE DE CRISTAIS CORROMPIDOS', p.x - 2, p.z + 2.5, smash); }
    }
    if (s.phase === 'mergulho') {
      const c = city();
      if (!levi && free && dC() < 120) startDive();
      if (levi && !levi.dead && !levi.gone) {
        levi.aggro = true;
        if (Math.hypot(levi.x - c.x, levi.z - c.z) > 45) { levi.x = c.x + 8; levi.z = c.z + 14; if (levi.m && levi.m.root) { levi.m.root.position.x = levi.x; levi.m.root.position.z = levi.z; } }
        if (free && dC() < 70) { pressT -= dt; if (pressT <= 0) { pressT = 1; const d = Math.max(1, Math.round(player.maxhp * (s.cristais ? .01 : .02))); player.hp = Math.max(1, player.hp - d); } }
      } else if (levi && levi.gone && !levi.dead && free) levi = null;
      if (levi && levi.dead) finish();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q017) Fixas545.LIVE.primeva_q017 = 'v686'; } catch (e) { console.warn('Thalor686', e); } };
  window.Thalor686 = { state: S, active, objective, begin, smash, get logos() { return logos; }, get levi() { return levi; } };
})();
