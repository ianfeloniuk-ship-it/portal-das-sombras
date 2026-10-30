/* Missão fixa #20 «O Duelo com Logos e a Porta de Casa» (v723). Ato X final, depois das cinco Âncoras (#15 a #19).
   Fenda de Alta Concentração na Fronteira Central (50 m a leste do ponto da carroça do Ato I, ao sul de Aster).
   Você derrota Logos (Arauto da Ruptura). Na saída, a Projeção do Arquiteto rasga uma fresta com a porta iluminada da sua casa e promete devolvê-lo se você abandonar uma Âncora.
   Escolha (conversa, E na fresta): recusar («Se pode abrir a rota, não precisa da morte de ninguém para mostrá-la»): +3 de Vontade e a Confiança de Lyra no máximo (marca);
   ou tocar a fresta: Cicatriz da Saudade (−5% de regeneração de mana por 3 dias do jogo; +10% de dano contra projeções do Arquiteto fica como marca).
   Estado em profile.fixas545.q020.
   Simplificações: a «câmara de linhas móveis» é um anel de linhas luminosas fixo; Logos é um mercenário grande (sem golpes novos); a Confiança de Lyra é uma marca no perfil (confiancaLyra:'max');
   a Cicatriz reduz a regeneração de mana (não o máximo) e o +10% contra projeções é só marca (ainda não há projeções para atacar). */
(function () {
  'use strict';
  let world = null, worldT = 0, logos = null, grp = null, fresta = null, busy = false, lastSave = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q020 = profile.fixas545.q020 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const FZ = 334;
  const arena = () => { let x = 0; try { x = Fronteira551.cx(FZ); } catch (_) {} return { x: x + 50, z: FZ }; };
  const done = n => { const q = profile && profile.fixas545 && profile.fixas545['q0' + n]; return !!(q && q.done); };
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q020; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dA = () => { const a = arena(); return Math.hypot(player.x - a.x, player.z - a.z); };
  const day = () => { try { return typeof gameDay198 === 'function' ? gameDay198() : Math.floor(Date.now() / 864e5); } catch (_) { return 0; } };
  if (typeof LORE !== 'undefined') {
    LORE.q020_recusa = ['A porta que ficou fechada', 'Depois de vencer Logos, a Projeção do Arquiteto abriu uma fresta com a porta da sua casa e ofereceu devolvê-lo se você abandonasse uma Âncora. Você deu um passo para trás: «Se pode abrir a rota, não precisa da morte de ninguém para mostrá-la.» Sua Vontade cresceu e Lyra confia em você por inteiro.'];
    LORE.q020_toque = ['A Cicatriz da Saudade', 'Você hesitou e tocou a fresta para ver quem esperava do outro lado. A porta se fechou e deixou a Cicatriz da Saudade: menos mana por três dias, e mais dano contra as projeções do Arquiteto.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> O Duelo com Logos: as cinco Âncoras estão firmes. Siga até a Fenda de Alta Concentração na Fronteira Central, ao sul de Aster.', 9000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true;
    e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3.5, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function mkRing() {
    if (grp) return; const a = arena(); grp = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const an = i / 12 * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.BoxGeometry(.18, 3 + (i % 3), .18), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x8aa0ff : 0xffd070 }));
      m.position.set(a.x + Math.cos(an) * 11, 0, a.z + Math.sin(an) * 11); m.position.y = terrH(m.position.x, m.position.z) + 2; grp.add(m);
    }
    grp.userData.terrainAbsolute245 = true; scene.add(grp);
  }
  function dropRing() { if (grp) { try { scene.remove(grp); grp.traverse(o => { o.geometry && o.geometry.dispose && o.geometry.dispose(); }); } catch (_) {} } grp = null; }
  function spawnLogos() {
    const a = arena();
    try { logos = foe('rogue', 'Logos, o Arauto da Ruptura', a.x, a.z); logos.hp = logos.maxhp = Math.round(logos.maxhp * 4); logos.aggro = false; logos.logos723 = true; logos.hpIni723 = logos.hp; } catch (_) { logos = null; }
  }
  function startDuelo() {
    const s = S(); s.phase = 'duelo'; save(); mkRing(); spawnLogos();
    try { toast('<b>[FENDA]</b> Logos espera na câmara de linhas móveis. Derrote o Arauto da Ruptura.', 9000); } catch (_) {}
  }
  function mkFresta() {
    if (fresta) return; const a = arena(), g = new THREE.Group();
    const fr = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, .14), new THREE.MeshStandardMaterial({ color: 0x2a2018, emissive: 0xffb060, emissiveIntensity: .8 }));
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.3), new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, opacity: .9, side: THREE.DoubleSide }));
    gl.position.z = .09; fr.position.y = 1.5; gl.position.y = 1.5; g.add(fr); g.add(gl);
    g.position.set(a.x, terrH(a.x, a.z), a.z + 3); g.userData.terrainAbsolute245 = true; scene.add(g); fresta = { g, inter: addInter('E · A FRESTA DO ARQUITETO', a.x, a.z + 3, oferta) };
  }
  function dropFresta() { if (fresta) { try { scene.remove(fresta.g); } catch (_) {} rmInter(fresta.inter); } fresta = null; }
  function afterLogos() {
    const s = S(); s.phase = 'oferta'; s.logos = true; save(); mkFresta();
    try { toast('<b>[LOGOS]</b> Logos cai e se desfaz em linhas. No ar se abre uma fresta: a porta iluminada da sua casa. A Projeção do Arquiteto promete devolvê-lo se você abandonar uma única Pedra-Âncora.', 11000); } catch (_) {}
  }
  function oferta() {
    const s = S(); if (s.done || busy || s.phase !== 'oferta') return;
    const npc = { x: arena().x, z: arena().z + 3, name: 'Projeção do Arquiteto' };
    Dialogo520.custom({ name: 'Projeção do Arquiteto', title: 'Fenda da Fronteira Central', type: 'logos723' }, npc, () => ({
      raiz: { t: 'Aí está a sua porta, Viajante. Eu a abro agora. Basta abandonar uma única Pedra-Âncora, uma só, e você volta para casa.', o: [
        { l: 'Dar um passo para trás: «Se pode abrir a rota, não precisa da morte de ninguém para mostrá-la.»', fn: () => { choose('recusa'); return 'fim'; } },
        { l: 'Hesitar e tocar a fresta para ver quem está do outro lado', fn: () => { choose('toque'); return 'fim'; } }] }
    }));
  }
  function choose(c) {
    const s = S(); if (s.done) return;
    s.escolha = c; s.done = true; s.phase = 'fim'; s.t = Date.now();
    dropFresta(); dropRing();
    if (c === 'recusa') {
      s.confiancaLyra = 'max';
      if (!s.von) { s.von = true; try { run.stats.von = (run.stats.von || 0) + 3; } catch (_) {} try { if (typeof refreshStats === 'function') refreshStats(); } catch (_) {} }
      try { unlockLore('q020_recusa'); } catch (_) {}
      try { toast('<b>[ESCOLHA]</b> Você recusa. A fresta se fecha. <b>+3 de Vontade</b> e a Confiança de Lyra chega ao máximo.', 10000); } catch (_) {}
    } else {
      s.cicatriz = true; s.cicatrizDia = day(); s.danoProjecao = true;
      try { unlockLore('q020_toque'); } catch (_) {}
      try { toast('<b>[ESCOLHA]</b> Você toca a fresta. A porta se fecha e deixa a <b>Cicatriz da Saudade</b>: −5% de mana por 3 dias, +10% de dano contra projeções do Arquiteto.', 10000); } catch (_) {}
    }
    try { if (typeof bigText === 'function') bigText('A PORTA DE CASA', 1600); } catch (_) {}
    save();
  }
  const cicatriz = () => { const s = profile && profile.fixas545 && profile.fixas545.q020; return !!(s && s.cicatriz && day() - (s.cicatrizDia || 0) < 3); };
  if (typeof pManaRegen281 === 'function') { const m0 = pManaRegen281; pManaRegen281 = function () { const r = m0.apply(this, arguments); return cicatriz() ? (1 + r) * .95 - 1 : r; }; }
  function objective() {
    const ph = phase(); if (!ph) return null; const a = arena(); let text, target = a;
    if (ph === 'rota') text = 'Siga até a Fenda de Alta Concentração, ao sul de Aster';
    else if (ph === 'duelo') { text = 'Derrote Logos, o Arauto da Ruptura'; if (logos && !logos.dead) target = { x: logos.x, z: logos.z }; }
    else { text = 'Responda à Projeção do Arquiteto [E na fresta]'; target = { x: a.x, z: a.z + 3 }; }
    return { actTitle: 'O DUELO COM LOGOS E A PORTA DE CASA', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); logos = null; grp = null; fresta = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if ([15, 16, 17, 18, 19].every(n => done(n)) && free) begin(); return; }
    if (s.phase === 'rota' && free && dA() < 90) startDuelo();
    if (s.phase === 'duelo') {
      if (!grp && free) mkRing();
      if (!logos && free && dA() < 120) spawnLogos();
      else if (logos && !logos.dead && !logos.gone) { if (!logos.aggro && (logos.hp < logos.hpIni723 || Math.hypot(logos.x - player.x, logos.z - player.z) < 12)) logos.aggro = true; }
      else if (logos && logos.dead) afterLogos();
      else if (logos && logos.gone && free) logos = null;
    }
    if (s.phase === 'oferta' && !fresta && free) mkFresta();
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q020) Fixas545.LIVE.primeva_q020 = 'v723'; } catch (e) { console.warn('Logos723', e); } };
  window.Logos723 = { state: S, active, objective, begin, get logos() { return logos; }, get fresta() { return fresta; } };
})();
