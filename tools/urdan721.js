/* Missão fixa #18 «A Quarta Âncora: O Fogo Basáltico de Urdan» (v721). Ato X, depois da #17 (Thalor).
   Você desce pelas gargantas de basalto até as Galerias de Urdan (0, +3400). Três comportas antigas seguram o magma; o Colosso Rachado guarda a ponte de obsidiana.
   Fechar as três comportas (E) antes de chegar ao Colosso: a galeria esfria, os Mestres Mineiros presos são salvos, surge um veio permanente de Mithril (E, rende minério de novo
   a cada 90 s) e o 3º Relato Ancestral entra no Diário. Ir direto ao Colosso: as comportas travam e nada disso acontece.
   O calor da galeria é o que o bioma Vulcão já faz (perde vida sem Unguento). Estado em profile.fixas545.q018.
   Simplificações: «com a Força» = só a tecla E (sem teste de atributo); os mineiros são uma marca no perfil e um aviso, sem figuras na cena;
   o Mithril rende minério de grau 2 (run.res.cry[2]). */
(function () {
  'use strict';
  let world = null, worldT = 0, colosso = null, gates = [], vein = null, veinT = 0, busy = false, lastSave = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q018 = profile.fixas545.q018 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const city = () => { try { const n = nearestCity(0, 3400); if (n && n.c && n.c.name === 'Urdan') return n.c; } catch (_) {} return { x: 0, z: 3392, name: 'Urdan', id: 'urdan' }; };
  const q17 = () => profile && profile.fixas545 && profile.fixas545.q017;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q018; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dC = () => { const c = city(); return Math.hypot(player.x - c.x, player.z - c.z); };
  const gatePos = i => { const c = city(); return { x: c.x - 22 + i * 22, z: c.z - 14 - (i === 1 ? 6 : 0) }; };
  const bridge = () => { const c = city(); return { x: c.x, z: c.z + 26 }; };
  if (typeof LORE !== 'undefined') {
    LORE.q018_comportas = ['O 3º Relato Ancestral', 'Você fechou as três comportas antigas de Urdan antes de enfrentar o Colosso Rachado. A galeria central esfriou, os Mestres Mineiros presos saíram vivos e, sob a rocha fria, apareceu um veio de Mithril que não se esgota. Nas paredes do veio estava gravado o 3º Relato Ancestral.'];
    LORE.q018_direto = ['O Colosso sobre a ponte', 'Você foi direto ao Colosso Rachado, sobre a ponte de obsidiana, com o magma solto nas galerias. O guardião caiu, mas as comportas travaram: os mineiros presos e o veio de Mithril ficaram para trás.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> A Quarta Âncora: siga o mapa de Logos até as Galerias de Urdan (0, +3400). O calor drena a vida: leve Unguento.', 9000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true;
    e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function gateInter(o, i) { const p = gatePos(i); o.inter = addInter('E · FECHAR A COMPORTA ANTIGA', p.x, p.z + 2, () => closeGate(o)); }
  function mkGate(i) {
    const p = gatePos(i), g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, .5), new THREE.MeshStandardMaterial({ color: 0x2a2220, emissive: 0xff5a10, emissiveIntensity: .9, roughness: .8 }));
    m.position.y = 1.3; g.add(m); g.position.set(p.x, terrH(p.x, p.z), p.z); g.userData.terrainAbsolute245 = true; scene.add(g);
    const o = { g, m, closed: false, inter: null }; gateInter(o, i);
    return o;
  }
  function closeGate(o) {
    const s = S(); if (s.phase !== 'galeria' || o.closed || s.travado) return;
    o.closed = true; rmInter(o.inter); o.inter = null;
    try { o.m.material.emissiveIntensity = .05; o.m.material.color.setHex(0x4a4a52); o.m.scale.y = .4; o.m.position.y = .5; } catch (_) {}
    s.comportas = (s.comportas || 0) + 1; save();
    if (s.comportas >= 3) cool();
    else try { toast('<b>[URDAN]</b> Comporta fechada (' + s.comportas + ' de 3). O magma recua um pouco.', 5000); } catch (_) {}
  }
  function mkVein() {
    if (vein) return; const c = city();
    vein = addInter('E · MINERAR O VEIO DE MITHRIL', c.x + 14, c.z - 4, () => {
      if (veinT > performance.now()) { try { toast('O veio ainda está soltando lascas. Espere um pouco.', 3000); } catch (_) {} return; }
      veinT = performance.now() + 90000;
      try { run.res.cry[2] = (run.res.cry[2] || 0) + 3; } catch (_) {}
      try { toast('Você extrai <b>3 Minérios de Mithril</b> do veio.', 4000); } catch (_) {}
    });
  }
  function cool() {
    const s = S(); s.cooled = true; s.escolha = 'comportas'; s.mineiros = true; s.veio = true; s.relato3 = true;
    try { unlockLore('q018_comportas'); } catch (_) {}
    mkVein(); save();
    try { toast('<b>[URDAN]</b> As três comportas fecham e a galeria central esfria. Os Mestres Mineiros presos saem vivos, um veio de Mithril aparece na rocha e o 3º Relato Ancestral entra no Diário. Falta o Colosso Rachado na ponte.', 11000); } catch (_) {}
  }
  function startGaleria() {
    const s = S(); s.phase = 'galeria'; save();
    for (const o of gates) rmInter(o.inter); gates = [0, 1, 2].map(mkGate);
    spawnColosso();
    try { toast('<b>[URDAN]</b> Três comportas antigas seguram o magma. Feche as três [E] antes do duelo, ou enfrente o Colosso Rachado direto sobre a ponte de obsidiana.', 11000); } catch (_) {}
  }
  function spawnColosso() {
    const b = bridge();
    try { colosso = foe('colosso', 'Colosso Rachado', b.x, b.z); colosso.hp = colosso.maxhp = Math.round(colosso.maxhp * 2); colosso.isBoss = true; colosso.aggro = false; colosso.colosso721 = true; colosso.hpIni721 = colosso.hp; } catch (_) { colosso = null; }
  }
  function lock() {
    const s = S(); if (s.travado || s.comportas >= 3) return;
    s.travado = true; s.escolha = 'direto'; for (const o of gates) { rmInter(o.inter); o.inter = null; } save();
    try { toast('<b>[URDAN]</b> O Colosso despertou. As comportas travaram: o magma segue solto nas galerias.', 7000); } catch (_) {}
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); if (!s.escolha) s.escolha = 'direto';
    if (s.escolha === 'direto') { try { unlockLore('q018_direto'); } catch (_) {} }
    for (const o of gates) rmInter(o.inter);
    try { toast('<b>[URDAN]</b> O Colosso Rachado cai e a Quarta Âncora se purifica' + (s.cooled ? '. O veio de Mithril fica aberto.' : '.'), 10000); } catch (_) {}
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const c = city(); let text, target = { x: c.x, z: c.z }; const s = S();
    if (ph === 'rota') text = 'Siga o mapa de Logos até as Galerias de Urdan';
    else if (!s.cooled && !s.travado) { const o = gates.find(g => !g.closed); text = 'Feche as comportas antigas [E] (' + (s.comportas || 0) + ' de 3) ou enfrente o Colosso Rachado na ponte'; if (o) target = gatePos(gates.indexOf(o)); }
    else { text = 'Derrote o Colosso Rachado na ponte de obsidiana'; if (colosso && !colosso.dead) target = { x: colosso.x, z: colosso.z }; else target = bridge(); }
    return { actTitle: 'A QUARTA ÂNCORA: O FOGO BASÁLTICO DE URDAN', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); colosso = null; gates = []; vein = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (s.veio && !vein && free && dC() < 150) mkVein();
    if (s.done) return;
    if (!s.phase) { if (q17() && q17().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dC() < 90) startGaleria();
    if (s.phase === 'galeria') {
      if (gates.length === 0 && free && dC() < 120) startGaleria();
      else if (!colosso && free && dC() < 120) spawnColosso();
      if (colosso && !colosso.dead && !colosso.gone) {
        const pd = Math.hypot(colosso.x - player.x, colosso.z - player.z);
        if (!colosso.aggro && (colosso.hp < colosso.hpIni721 || pd < 9)) { colosso.aggro = true; lock(); }
      } else if (colosso && colosso.dead) { lock(); finish(); }
      else if (colosso && colosso.gone && free) colosso = null;
      if (!s.travado) gates.forEach((o, i) => { if (!o.closed && (!o.inter || !L.inter.includes(o.inter))) gateInter(o, i); });
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q018) Fixas545.LIVE.primeva_q018 = 'v721'; } catch (e) { console.warn('Urdan721', e); } };
  window.Urdan721 = { state: S, active, objective, begin, get colosso() { return colosso; }, get gates() { return gates; } };
})();
