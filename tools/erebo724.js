/* Missão fixa #21 «Quatorze Dias no Outro Mundo» (v724). Ato XI, depois da #20.
   Boca da Garganta das Cinzas (a 140 m ao sul da Fenda da Fronteira Central): você atravessa o portal de Érebo, sob dois sóis partidos em eclipse.
   O Miasma apodrece a comida que você leva. Uma matilha de Devoradores de Cinza guarda o caminho até o Soberano da Cinza.
   Escolha: pegar a carne podre [E] e lançá-la como Isca de Carniça [G] longe da matilha (ela vai comer e deixa você passar; a refeição lacrada fica no Invólucro de Resina)
   ou abrir caminho à força. Com a isca: ao vencer o Soberano, +20% de Vida máxima por 10 minutos. Nos dois casos, ao sair, 14 dias se passaram em Primeva.
   Estado em profile.fixas545.q021.
   Simplificações: o «Outro Mundo» é uma clareira nesta mesma região (o planeta infinito de otherworld460.js não é usado); o eclipse é um escurecimento do céu;
   o Invólucro de Resina é uma marca (sem item); a Vida e a Estamina do bônus: só a Vida máxima; os 14 dias avançam o relógio do jogo (sem simular cercos). */
(function () {
  'use strict';
  let world = null, worldT = 0, pack = [], boss = null, grp = null, pile = null, busy = false, lastSave = 0, baitT = 0, baitAt = null, buffEnd = 0, buffAdd = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q021 = profile.fixas545.q021 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const FZ = 334 + 140;
  const arena = () => { let x = 0; try { x = Fronteira551.cx(334); } catch (_) {} return { x: x + 50, z: FZ }; };
  const q20 = () => profile && profile.fixas545 && profile.fixas545.q020;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q021; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dA = () => { const a = arena(); return Math.hypot(player.x - a.x, player.z - a.z); };
  if (typeof LORE !== 'undefined') {
    LORE.q021_isca = ['Quatorze dias em Érebo', 'Sob dois sóis partidos, você lançou a carne podre como Isca de Carniça e deixou a matilha de Devoradores de Cinza comer longe do caminho. Sua refeição ficou lacrada no Invólucro de Resina até a véspera do Soberano da Cinza, e a força dela foi sua contra ele. Ao sair, quatorze dias tinham passado em Primeva.'];
    LORE.q021_forca = ['Quatorze dias em Érebo', 'Você abriu caminho à força pela matilha de Devoradores de Cinza e derrubou o Soberano da Cinza, mas a comida apodreceu no Miasma. Ao sair, quatorze dias tinham passado em Primeva.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> Quatorze Dias no Outro Mundo: siga até a boca da Garganta das Cinzas, ao sul da Fenda da Fronteira Central, e atravesse o portal.', 9000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function mkScene() {
    if (grp) return; const a = arena(); grp = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const sun = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 12), new THREE.MeshBasicMaterial({ color: i ? 0xc07030 : 0x403048 }));
      sun.position.set(a.x - 40 + i * 14, 70 + i * 6, a.z - 120); grp.add(sun);
    }
    const por = new THREE.Mesh(new THREE.TorusGeometry(2.4, .2, 8, 28), new THREE.MeshBasicMaterial({ color: 0x9a60ff }));
    por.position.set(a.x, terrH(a.x, a.z) + 2.6, a.z - 50); grp.add(por);
    grp.userData.terrainAbsolute245 = true; scene.add(grp);
  }
  function dropScene() { if (grp) { try { scene.remove(grp); grp.traverse(o => { o.geometry && o.geometry.dispose && o.geometry.dispose(); }); } catch (_) {} } grp = null; }
  function startFenda() {
    const s = S(); s.phase = 'fenda'; save(); boss = null; pack = []; mkScene(); const a = arena();
    pile = addInter('E · PEGAR A CARNE PODRE', a.x - 12, a.z - 10, takeMeat);
    spawnPack();
    try { toast('<b>[ÉREBO]</b> Você atravessa o portal, que some às suas costas. Dois sóis partidos em eclipse; o Miasma apodrece a comida. Uma matilha de Devoradores de Cinza guarda o caminho. Pegue a carne podre [E] para usar como isca [G], ou abra caminho à força.', 12000); } catch (_) {}
  }
  function spawnPack() {
    const a = arena(); pack = [];
    for (let i = 0; i < 3; i++) { try { const e = foe(KINDS.lobo ? 'lobo' : 'lobofendido', 'Devorador de Cinza', a.x + 8 + i * 3, a.z + 18 + i * 2); e.aggro = false; e.dev724 = true; pack.push(e); } catch (_) {} }
  }
  function takeMeat() {
    const s = S(); if (s.carne || s.phase !== 'fenda') return; s.carne = true; rmInter(pile); pile = null; save();
    try { toast('Você pega a carne podre. Aperte <b>G</b> para lançá-la como Isca de Carniça longe da matilha.', 8000); } catch (_) {}
  }
  function throwBait() {
    const s = S(); if (!s || s.phase !== 'fenda' || !s.carne || s.isca) return;
    s.isca = true; s.involuc = true; save();
    const a = arena(); baitAt = { x: a.x + 30, z: a.z + 30 }; baitT = 25;
    try { fxBurst(baitAt.x, 1, baitAt.z, 0x70a040, 14, 3); } catch (_) {}
    for (const e of pack) if (!e.dead) { e.aggro = false; e.dist724 = true; }
    try { toast('A carne cai longe e a matilha corre atrás dela. Sua refeição fica lacrada no Invólucro de Resina.', 8000); } catch (_) {}
  }
  window.addEventListener('keydown', ev => { if (ev.code === 'KeyG' && active()) throwBait(); });
  function spawnBoss() {
    const a = arena();
    try { boss = foe(KINDS.colosso ? 'colosso' : 'gigante', 'Soberano da Cinza', a.x, a.z + 36); boss.hp = boss.maxhp = Math.round(boss.maxhp * 1.5); boss.isBoss = true; boss.aggro = false; boss.hpIni724 = boss.hp; } catch (_) { boss = null; }
  }
  function endBuff() { if (buffAdd) { try { player.maxhp -= buffAdd; player.hp = Math.min(player.hp, player.maxhp); } catch (_) {} buffAdd = 0; } buffEnd = 0; }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); dropScene(); rmInter(pile); pile = null;
    s.dias = 14; try { dayT += 14 * DAYLEN; } catch (_) {}
    if (s.isca) { try { buffAdd = Math.round(player.maxhp * .2); player.maxhp += buffAdd; player.hp = Math.min(player.maxhp, player.hp + buffAdd); buffEnd = performance.now() + 600000; } catch (_) {} s.bonus = true; try { unlockLore('q021_isca'); } catch (_) {} }
    else try { unlockLore('q021_forca'); } catch (_) {}
    try { toast('<b>[ÉREBO]</b> O Soberano da Cinza cai e a Fenda de volta se abre. Ao sair, <b>14 dias</b> se passaram em Primeva.' + (s.isca ? ' O banquete lacrado dá +20% de Vida máxima por 10 minutos.' : ''), 11000); } catch (_) {}
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const a = arena(); const s = S(); let text, target = a;
    if (ph === 'rota') text = 'Siga até a boca da Garganta das Cinzas e atravesse o portal';
    else if (boss && !boss.dead) { text = 'Derrote o Soberano da Cinza'; target = { x: boss.x, z: boss.z }; }
    else { text = s.isca ? 'A matilha come longe: siga até o Soberano da Cinza' : s.carne ? 'Lance a carne podre como isca [G] ou abra caminho à força' : 'Pegue a carne podre [E] para a isca, ou abra caminho à força'; }
    return { actTitle: 'QUATORZE DIAS NO OUTRO MUNDO', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (buffEnd && performance.now() > buffEnd) endBuff();
    if (world !== L) { world = L; worldT = performance.now(); pack = []; boss = null; grp = null; pile = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q20() && q20().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dA() < 50) startFenda();
    if (s.phase === 'fenda') {
      if (!grp && free) mkScene();
      if (!pile && !s.carne && free) { const a = arena(); pile = addInter('E · PEGAR A CARNE PODRE', a.x - 12, a.z - 10, takeMeat); }
      if (!s.packDone && free) pack.forEach((e, i) => { if (e.gone && !e.dead && (e.try724 || 0) < 4) { const a = arena(); try { const n = foe(KINDS.lobo ? 'lobo' : 'lobofendido', 'Devorador de Cinza', a.x + 8 + i * 6, a.z + 18 + i * 3); n.aggro = false; n.dev724 = true; n.try724 = (e.try724 || 0) + 1; pack[i] = n; } catch (_) {} } });
      if (!pack.length && !boss && free && dA() < 55 && !s.packDone) spawnPack();
      if (baitT > 0) { baitT -= dt; for (const e of pack) if (!e.dead && e.dist724) { e.aggro = false; const dx = baitAt.x - e.x, dz = baitAt.z - e.z, d = Math.hypot(dx, dz); if (d > 2) { try { moveEnt(e, dx / d * 4 * dt, dz / d * 4 * dt); } catch (_) {} } } if (baitT <= 0) for (const e of pack) { e.dist724 = false; } }
      for (const e of pack) if (!e.dead && !e.gone && !e.dist724 && !e.aggro && Math.hypot(e.x - player.x, e.z - player.z) < 14) e.aggro = true;
      if (!boss && !s.packDone && (pack.length && pack.every(e => e.dead) || (s.isca && baitT <= 0 && dA() < 45))) { s.packDone = true; spawnBoss(); }
      if (boss && !boss.dead && !boss.gone) { if (!boss.aggro && (boss.hp < boss.hpIni724 || Math.hypot(boss.x - player.x, boss.z - player.z) < 14)) boss.aggro = true; }
      else if (boss && boss.dead) finish();
      else if (boss && boss.gone && free) boss = null;
      if (!boss && s.packDone && free && dA() < 55 && !s.done) spawnBoss();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q021) Fixas545.LIVE.primeva_q021 = 'v724'; } catch (e) { console.warn('Erebo724', e); } };
  window.Erebo724 = { state: S, active, objective, begin, throwBait, get boss() { return boss; }, get pack() { return pack; } };
})();
