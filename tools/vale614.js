/* Missão fixa #14 «A Chave Sem Porta no Vale da Fundição» (v652). Rota Oeste e Vale da Fundição Velha. Ato VIII, depois do Mapa Astral (#13).
   Saqueadores com estandartes falsos do Clã Ferrugem bloqueiam o desfiladeiro com rochas e tocos. Mais adiante, Torvo protege refugiados famintos
   com o próprio corpo enquanto um ladrão foge com uma relíquia da Ordem.
   Ficar: acender a fogueira e entregar água fervida ou comida assada aos refugiados sela o Pacto do Clã Ferrugem (goblins aliados guardam a sua
   carroça nas rotas e afastam quem chega perto). Perseguir o ladrão: recupera 1 item Épico, mas o Clã Ferrugem passa a desconfiar de Aster.
   Estado em profile.fixas545.q014. Simplificação: as «6 Rotas Reais» viram a escolta da sua carroça (Carrinho de Carga) por 2 goblins aliados. */
(function () {
  'use strict';
  const DAY = 86400000;
  let world = null, props = null, looters = [], torvo = null, torvoInter = null, refugees = [], thief = null, pit = null, pitInter = null, giveInter = null, flameG = null;
  let busy = false, lastSave = 0, worldT = 0, guards = [], guardT = 0, thiefT = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q014 = profile.fixas545.q014 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function aster() { return typeof regionCity === 'function' ? regionCity(0, 0) : { x: 0, z: 0, name: 'Aster' }; }
  const dAster = () => Math.hypot(player.x - aster().x, player.z - aster().z);
  const q13 = () => profile && profile.fixas545 && profile.fixas545.q013;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q014; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  if (typeof LORE !== 'undefined') {
    LORE.q014_pacto = ['O Pacto do Clã Ferrugem', 'Você acendeu a fogueira e deu água fervida e comida aos refugiados de Torvo. O Clã Ferrugem selou o pacto: goblins aliados passam a guardar a sua carroça nas rotas. A relíquia da Ordem ficou com os ladrões.'];
    LORE.q014_reliquia = ['A relíquia da Ordem recuperada', 'Você deixou os refugiados de Torvo e caçou o ladrão. A relíquia da Ordem voltou, mas o Clã Ferrugem passou a desconfiar de Aster.'];
  }

  /* ---------- ponto do Vale: a oeste de Aster, plano, longe de portões; fixado a 90 m ---------- */
  function spot(fresh) {
    const s = S(); if (s && s.spot && (s.lock || !fresh)) return s.spot;
    const c = aster(); let best = null, bestR = 1e9;
    for (const R of [150, 170, 190]) for (const da of [0, .25, -.25, .5, -.5]) {
      const ang = Math.PI + da, x = c.x + Math.cos(ang) * R, z = c.z + Math.sin(ang) * R;
      const ok = typeof gates === 'undefined' || !gates.some(g => Math.hypot(g.x - x, g.z - z) < 40 || Math.hypot(g.x - (x - 42), g.z - z) < 40);
      const hs = [[0, 0], [8, 0], [-8, 0], [0, 8], [0, -8], [-45, 0]].map(([p, q]) => terrH(x + p, z + q)), r = Math.max(...hs) - Math.min(...hs);
      if (ok && Math.min(...hs) > .5 && r < bestR) { best = { x, z }; bestR = r; }
    }
    best = best || { x: c.x - 170, z: c.z };
    if (s) { s.spot = best; if (fresh) s.lock = true; save(); }
    return best;
  }
  const camp = () => { const p = spot(); return { x: p.x - 42, z: p.z }; };

  /* ---------- atores e cenário ---------- */
  function mk(id, name, x, z, down) {
    const m = NPC456.create(id), f = NPC456.figure(id, { m, name, down: !!down, x, z, t: 0 }); if (down) m.wounded401 = true;
    m.root.userData.terrainAbsolute245 = true; m.root.position.set(x, terrH(x, z), z); scene.add(m.root); return f;
  }
  function addInter(label, x, z, fn, r) { const i = { x, z, r: r || 4, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function mat(c) { return new THREE.MeshStandardMaterial({ color: c, roughness: .95 }); }
  function buildProps() {
    const p = spot(), g = new THREE.Group();
    for (let i = 0; i < 9; i++) { /* rochas e tocos atravessados no desfiladeiro */
      const z = p.z - 8 + i * 2; const m = i % 3 === 0 ? new THREE.Mesh(new THREE.CylinderGeometry(.6, .7, 1.1, 8), mat(0x5a3c22)) : new THREE.Mesh(new THREE.DodecahedronGeometry(.9 + (i % 2) * .4, 0), mat(0x6a6a70));
      m.position.set(p.x + (i % 2) * 1.2, terrH(p.x, z) + .5, z); m.rotation.set(i, i * 2, 0); g.add(m);
    }
    for (const dz of [-6, 6]) { /* estandartes falsos: vermelho vivo, não o vermelho do Clã Ferrugem */
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 3.2, 6), mat(0x3a2a1a)); pole.position.set(p.x - 1.5, terrH(p.x, p.z + dz) + 1.6, p.z + dz); g.add(pole);
      const cl = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .8), new THREE.MeshBasicMaterial({ color: 0xff2030, side: THREE.DoubleSide })); cl.position.set(p.x - 2.1, terrH(p.x, p.z + dz) + 2.8, p.z + dz); g.add(cl);
    }
    g.userData.terrainAbsolute245 = true; scene.add(g); props = g;
  }
  function dropProps() { if (props) { try { scene.remove(props); props.traverse(o => { o.geometry && o.geometry.dispose && o.geometry.dispose(); o.material && o.material.dispose && o.material.dispose(); }); } catch (_) {} } props = null; }
  function foeAt(name, x, z, kind) {
    const lvl = run.level || 1;
    try {
      const e = spawnKind(kind || 'goblin', x, z, 0, { wild: true }); e.name = e.short = name;
      e.hp = e.maxhp = Math.min(e.maxhp, 40 + 12 * lvl); e.dmg = Math.min(e.dmg || 4, 4 + lvl); e.aggro = true; e.vale614 = true; return e;
    } catch (_) { return null; }
  }
  function buildCamp() {
    const c = camp();
    try {
      const e = spawnKind(KINDS.gobShield118 ? 'gobShield118' : 'goblin', c.x + 2.2, c.z, 0, { wild: true });
      const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1);
      FRIENDS217.push(e); e.friendly217 = true; e.hp = e.maxhp = 1e9; e.name = 'Torvo, caçador do Clã Ferrugem'; e.short = 'Torvo'; e.noExpLoot = true; torvo = e;
    } catch (_) { torvo = null; }
    const S0 = S();
    const dn = !S0.fed;
    refugees = [mk('homem', 'Refugiado', c.x - 2, c.z + 3, dn), mk('mulher', 'Refugiada', c.x - 3.5, c.z - 2.5, dn), mk('homem', 'Refugiado', c.x - 5, c.z + 1, dn), mk('mulher', 'Refugiada', c.x - 1, c.z - 4.5, dn)];
    if (dn) for (const f of refugees) { f.m.root.rotation.z = Math.PI / 2 * .85; f.m.root.position.y = terrH(f.x, f.z) + .1; }
    pit = { x: c.x - 2.5, z: c.z - 0.2 };
  }
  function dropCamp() {
    for (const f of refugees) { try { scene.remove(f.m.root); } catch (_) {} } refugees = [];
    if (torvo) { torvo.gone = true; try { scene.remove(torvo.m.root); } catch (_) {} const ix = FRIENDS217.indexOf(torvo); if (ix >= 0) FRIENDS217.splice(ix, 1); torvo = null; }
    if (thief) { try { scene.remove(thief.m.root); } catch (_) {} thief = null; }
    rmInter(torvoInter); rmInter(pitInter); rmInter(giveInter); torvoInter = pitInter = giveInter = null;
    if (flameG) { try { scene.remove(flameG); } catch (_) {} flameG = null; }
  }
  function drop() { dropProps(); dropCamp(); looters.forEach(e => { e.gone = true; }); looters = []; }
  function flame() {
    if (flameG || !pit) return;
    const g = new THREE.Group();
    for (let i = 0; i < 6; i++) { const h = .8 + Math.random() * .9, m = new THREE.Mesh(new THREE.ConeGeometry(.22, h, 6), new THREE.MeshBasicMaterial({ color: [0xb02000, 0xe84a08, 0xff8a20][i % 3], transparent: true, opacity: .85, depthWrite: false })); m.position.set((Math.random() - .5) * 1.1, h / 2, (Math.random() - .5) * 1.1); m.userData.ph = Math.random() * 6; g.add(m); }
    g.position.set(pit.x, terrH(pit.x, pit.z), pit.z); g.userData.terrainAbsolute245 = true; scene.add(g); flameG = g;
  }

  /* ---------- 1. a rota ---------- */
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> A Chave Sem Porta: saqueadores com estandartes falsos do Clã Ferrugem bloqueiam o desfiladeiro da Rota Oeste. Siga a Rota Oeste até o Vale da Fundição Velha.', 9000); } catch (_) {}
  }
  function startBarrier() {
    const s = S(); s.phase = 'barreira'; save();
    buildProps();
    const p = spot(); looters = [];
    for (let i = 0; i < 5; i++) { const a = Math.random() * 6.283, d = 9 + Math.random() * 6; const e = foeAt('Saqueador Falso', p.x + 6 + Math.cos(a) * d, p.z + Math.sin(a) * d, i === 0 ? 'orc' : 'goblin'); if (e) looters.push(e); }
    try { toast('<b>[VALE]</b> Rochas e tocos fecham o desfiladeiro. Os saqueadores usam estandartes de um vermelho vivo demais: não é o do Clã Ferrugem.', 8000); } catch (_) {}
  }
  function cleared() {
    const s = S(); s.phase = 'vale'; save(); dropProps();
    try { toast('<b>[VALE]</b> Os saqueadores caíram e o desfiladeiro está livre. Avance ao Vale da Fundição Velha e fale com Torvo.', 7500); } catch (_) {}
  }
  function atCamp() {
    buildCamp(); const s = S();
    if (s.phase === 'vale') torvoInter = torvo ? addInter('E · FALAR COM TORVO', torvo.x, torvo.z, talk, 4) : null;
    if (s.phase === 'ajuda') arrangeHelp();
    if (s.phase === 'cacada' && !s.ladraoMorto) spawnThief(true);
  }
  function spawnThief(already) {
    const c = camp(), e = foeAt('Ladrão da Relíquia', c.x - 18, c.z + 6, 'rogue'); if (!e) return;
    e.hp = e.maxhp = Math.round(e.maxhp * 1.4); e.aggro = false; e.relic614 = true; thief = { e, spd: 4.2, t: already ? 14 : 0 };
  }

  /* ---------- 2. Torvo e a escolha ---------- */
  function talk() {
    const s = S();
    if (s.phase === 'ajuda') return;
    if (s.phase !== 'vale') return;
    Dialogo520.custom({ name: 'Torvo', title: 'Clã Ferrugem', type: 'torvo614' }, torvo, () => ({
      raiz: { t: 'Fique longe dos estandartes: aquilo não é nosso. Olhe: estes humanos não comem há dias, e eu não saio de cima deles. Mas veja o ladrão correndo: ele levou uma relíquia da Ordem. Não consigo estar nos dois lugares.', o: [
        { l: 'Ficar no Vale: acender uma fogueira e dar água fervida e comida aos refugiados', fn: () => { choose('ajudar'); return 'fim'; } },
        { l: 'Abandonar os feridos e caçar o ladrão para recuperar a relíquia', fn: () => { choose('cacar'); return 'fim'; } }] }
    }));
  }
  function choose(c) {
    const s = S(); if (s.phase !== 'vale') return;
    s.escolha = c; s.t = Date.now(); rmInter(torvoInter); torvoInter = null;
    if (c === 'ajudar') {
      s.phase = 'ajuda'; save(); arrangeHelp();
      try { toast('<b>[ESCOLHA]</b> Você fica. Acenda a fogueira junto dos refugiados e entregue água fervida (cantil) ou comida assada.', 9000); } catch (_) {}
    } else {
      s.phase = 'cacada'; s.ladraoMorto = false; save(); spawnThief(false);
      try { toast('<b>[ESCOLHA]</b> Você deixa os feridos com Torvo e corre atrás do ladrão da relíquia. Ele corre para o oeste.', 8000); } catch (_) {}
    }
  }
  function arrangeHelp() {
    const s = S(); if (!pit) return;
    if (s.fogo) flame(); else if (!pitInter) pitInter = addInter('E · ACENDER A FOGUEIRA', pit.x, pit.z, light, 3.5);
    if (s.fogo && !s.fed && !giveInter) giveInter = addInter('E · DAR ÁGUA FERVIDA OU COMIDA AOS REFUGIADOS', pit.x + 1.5, pit.z, give, 5);
  }
  function light() {
    const s = S(); if (s.phase !== 'ajuda' || s.fogo) return;
    s.fogo = true; rmInter(pitInter); pitInter = null; flame(); save();
    try { toast('<b>[VALE]</b> A fogueira acende. Agora entregue água fervida (cantil com água limpa ou chá) ou comida assada aos refugiados.', 7000); } catch (_) {}
    arrangeHelp();
  }
  function give() {
    const s = S(); if (s.phase !== 'ajuda' || !s.fogo || s.fed) return;
    const ctn = run && run.surv437 && run.surv437.canteen;
    const water = ctn && (ctn.kind === 'limpa' || ctn.kind === 'cha') && (ctn.sips || 0) > 0 ? ctn : null;
    const food = ['assada', 'peixe_assado', 'defumada', 'cogu_assado', 'racao_expedicao'].find(k => window.Surv437 && Surv437.count && Surv437.count(k) > 0);
    if (!water && !food) { try { toast('<b>[VALE]</b> Os refugiados precisam de água fervida (encha o cantil com água limpa) ou de comida assada na fogueira. Traga um deles.', 7000); } catch (_) {} return; }
    if (food) { try { Surv437.take(food, 1); } catch (_) {} } else { water.sips = Math.max(0, (water.sips || 1) - 1); if (!water.sips) water.kind = null; }
    s.fed = true; rmInter(giveInter); giveInter = null;
    for (const f of refugees) { f.down = false; f.m.wounded401 = false; f.m.root.rotation.z = 0; f.m.root.position.y = terrH(f.x, f.z); }
    finish('ajudar');
  }
  function killThief() {
    const s = S(); if (s.phase !== 'cacada') return;
    s.ladraoMorto = true;
    try { const it = rollItem(rankOf(), true, 0, 2); if (it) addItem(it); } catch (_) {}
    finish('cacar');
  }
  function finish(c) {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); s.escolha = c;
    if (c === 'ajudar') { s.pacto = true; try { unlockLore('q014_pacto'); } catch (_) {} try { toast('<b>[TORVO]</b> Os refugiados comem e dormem. O Clã Ferrugem sela o Pacto: goblins aliados passam a guardar a sua carroça nas rotas.', 10000); } catch (_) {} }
    else { s.desconfia = true; try { unlockLore('q014_reliquia'); } catch (_) {} try { toast('<b>[TORVO]</b> Você recupera a relíquia da Ordem (item Épico na bolsa), mas o Clã Ferrugem passa a desconfiar de Aster.', 10000); } catch (_) {} }
    save();
  }

  /* ---------- objetivo ---------- */
  function objective() {
    const ph = phase(); if (!ph) return null; const s = S(); let text, target = null, step = 2;
    if (ph === 'rota') { text = 'Siga a Rota Oeste até o Vale da Fundição Velha'; target = spot(); }
    else if (ph === 'barreira') { const n = looters.filter(e => !e.dead).length; text = 'Derrote os saqueadores falsos do desfiladeiro · restam ' + n; const e = looters.find(e => !e.dead); target = e ? { x: e.x, z: e.z } : spot(); }
    else if (ph === 'vale') { text = 'Fale com Torvo no Vale da Fundição [E]'; target = camp(); step = 3; }
    else if (ph === 'ajuda') { text = s.fogo ? 'Dê água fervida ou comida assada aos refugiados [E]' : 'Acenda a fogueira junto dos refugiados [E]'; target = pit || camp(); step = 3; }
    else if (ph === 'cacada') { text = 'Alcance e derrote o ladrão da relíquia'; target = thief && !thief.e.dead ? { x: thief.e.x, z: thief.e.z } : camp(); step = 3; }
    return { actTitle: 'A CHAVE SEM PORTA NO VALE DA FUNDIÇÃO', step, totalSteps: 4, text, target };
  }

  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile) return;
    if (L.mode !== 'world') return;
    if (world !== L) { drop(); world = L; worldT = performance.now(); }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s) return;
    pactTick(dt);
    if (s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof inConversation === 'function' && inConversation()) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q13() && q13().done && free && dAster() < 130) begin(); return; }
    let sp = spot();
    if (!s.lock && Math.hypot(player.x - sp.x, player.z - sp.z) < 90 && terrH(sp.x, sp.z) !== 0) sp = spot(true);
    const dS = Math.hypot(player.x - sp.x, player.z - sp.z);
    if (s.lock && s.phase === 'rota' && dS < 70 && free) startBarrier();
    if (s.phase === 'barreira') {
      if (!props && s.lock) buildProps();
      looters = looters.filter(e => !e.gone); const left = looters.filter(e => !e.dead);
      if (!left.length && looters.length) { looters = []; cleared(); }
      else if (!looters.length && free && dS < 120) { startBarrier(); }
    }
    const cp = camp(), dC = Math.hypot(player.x - cp.x, player.z - cp.z);
    if (s.lock && ['vale', 'ajuda', 'cacada'].includes(s.phase)) {
      if (dC < 110 && !torvo && !refugees.length) atCamp(); else if (dC > 170 && (torvo || refugees.length)) dropCamp();
      if (torvoInter && torvo) { torvoInter.x = torvo.x; torvoInter.z = torvo.z; }
    }
    if (flameG) { const t = performance.now() / 1000; flameG.children.forEach(m => { const k = .75 + Math.sin(t * 9 + m.userData.ph) * .25; m.scale.set(k, .8 + k * .4, k); }); }
    if (thief && free) {
      const e = thief.e;
      if (e.dead) { if (s.phase === 'cacada' && !s.ladraoMorto) killThief(); thief = null; }
      else {
        thief.t += dt; const dx = e.x - player.x, dz = e.z - player.z, d = Math.hypot(dx, dz) || 1;
        if (thief.t < 16 && d < 30 && s.phase === 'cacada') { e.aggro = false; const k = Math.min(thief.spd * dt, 99); e.x += dx / d * k; e.z += dz / d * k; if (e.m && e.m.root) { e.m.root.position.x = e.x; e.m.root.position.z = e.z; } }
        else if (s.phase === 'cacada') e.aggro = true;
        else if (s.phase === 'ajuda' && thief.t > 20) { e.gone = true; e.dead = true; thief = null; }
      }
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  /* Pacto: 2 goblins aliados escoltam a carroça e afastam quem chega perto (10% da vida por segundo, só inimigos comuns) */
  function pactTick(dt) {
    const s = S(); if (!s || !s.pacto) { if (guards.length) { guards.forEach(g => { g.gone = true; }); guards = []; } return; }
    const cs = run && run.cart437; if (!cs || !cs.built) return;
    const near = Math.hypot(player.x - cs.x, player.z - cs.z) < 120;
    guards = guards.filter(g => !g.gone);
    if (near && guards.length < 2) { guardT -= dt; if (guardT <= 0) { guardT = 3; try {
      const e = spawnKind('goblin', cs.x + (guards.length ? -3 : 3), cs.z + 2, 0, { wild: true });
      const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1);
      FRIENDS217.push(e); e.friendly217 = true; e.hp = e.maxhp = 1e9; e.name = 'Guarda do Clã Ferrugem'; e.short = 'Guarda do Clã'; e.noExpLoot = true; e.pact614 = true; guards.push(e);
    } catch (_) {} } }
    if (!near && guards.length) { guards.forEach(g => { g.gone = true; try { scene.remove(g.m.root); } catch (_) {} const ix = FRIENDS217.indexOf(g); if (ix >= 0) FRIENDS217.splice(ix, 1); }); guards = []; return; }
    for (const g of guards) {
      const dx = cs.x - g.x, dz = cs.z - g.z, d = Math.hypot(dx, dz); if (d > 4) { const k = Math.min(5 * dt, d - 4) / d; g.x += dx * k; g.z += dz * k; }
      for (const e of enemies) if (!e.dead && !e.isBoss && !e.friendly217 && Math.hypot(e.x - g.x, e.z - g.z) < 9) { e.hp -= e.maxhp * .1 * dt; if (e.hp <= 0) { try { killEnemy(e); } catch (_) {} } }
    }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q014) Fixas545.LIVE.primeva_q014 = 'v652'; } catch (e) { console.warn('Vale614', e); } };
  window.Vale614 = { state: S, active, objective, begin, choose, spot, camp, light, give, get looters() { return looters; }, get thief() { return thief; }, get guards() { return guards; }, get torvo() { return torvo; } };
})();
