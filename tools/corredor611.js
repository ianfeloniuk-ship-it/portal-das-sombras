/* Missão fixa #11 «O Corredor da Escolha: O Comandante ou os Prisioneiros» (v649). Fenda Vermelha da Câmara de Seleção.
   Depois do relato de Aldric (Ato V concluído e Aldric entregue à enfermaria), uma Fenda Vermelha se abre perto de Aster. Lá dentro, que desmorona,
   o Comandante Marcado foge com os pergaminhos de rota enquanto 3 soldados de Aster batem na porta trancada da câmara lateral. O Narrador insiste na perseguição.
   Salvar os soldados (arrombar a porta, o comandante escapa): 3 guardas veteranos passam a patrulhar o portão de Aster (+15 de confiança em Aster, respeito de Aldric).
   Abater o comandante: Tomo do Comandante (+1 ponto de habilidade), mas 3 camas vazias e luto em Aster. Estado em profile.fixas545.q011. */
(function () {
  'use strict';
  const LIMIT = 150, HITS = 3;
  let world = null, portal = null, portalInter = null, boss = null, door = null, doorInter = null, soldiers = [], flee = null, busy = false, lastSave = 0;
  let vets = [], beds = null, bedsL = null;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q011 = profile.fixas545.q011 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function aster() { return typeof regionCity === 'function' ? regionCity(0, 0) : { x: 0, z: 0, name: 'Aster' }; }
  const dAster = () => Math.hypot(player.x - aster().x, player.z - aster().z);
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q011; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  if (typeof LORE !== 'undefined') {
    LORE.q011_salvos = ['O Corredor da Escolha: os prisioneiros', 'Você arrombou a porta da câmara lateral e tirou os 3 soldados antes de a Fenda desmoronar. O Comandante Marcado fugiu com os pergaminhos de rota. Três guardas veteranos agora patrulham o portão de Aster.'];
    LORE.q011_comandante = ['O Corredor da Escolha: o comandante', 'Você perseguiu e abateu o Comandante Marcado e ficou com o Tomo do Comandante. Os 3 soldados atrás da porta não saíram da Fenda. Aster tem 3 camas vazias e está de luto.'];
  }

  /* ---------- Fenda Vermelha no mundo ---------- */
  function spot(fresh) {
    const s = S(); if (s && s.spot && (s.lock || !fresh)) return s.spot;
    const c = aster(); let best = null, bestR = 1e9;
    for (const R of [150, 170, 130]) for (let a = 0; a < 12; a++) {
      const ang = a / 12 * Math.PI * 2 + 0.4, x = c.x + Math.cos(ang) * R, z = c.z + Math.sin(ang) * R;
      const ok = typeof gates === 'undefined' || !gates.some(g => Math.hypot(g.x - x, g.z - z) < 30);
      const hs = [[0, 0], [6, 0], [-6, 0], [0, 6], [0, -6]].map(([p, q]) => terrH(x + p, z + q)), r = Math.max(...hs) - Math.min(...hs);
      if (ok && hs[0] > 0.5 && r < bestR) { best = { x, z }; bestR = r; }
    }
    best = best || { x: c.x - 150, z: c.z };
    if (s) { s.spot = best; if (fresh) s.lock = true; save(); }
    return best;
  }
  function buildPortal() {
    const p = spot(), y = terrH(p.x, p.z), g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, .3, 10, 36), new THREE.MeshBasicMaterial({ color: 0xd01a2a }));
    ring.position.y = 3; g.add(ring);
    const core = new THREE.Mesh(new THREE.CircleGeometry(2.4, 28), new THREE.MeshBasicMaterial({ color: 0x8a0a1a, transparent: true, opacity: .75, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    core.position.y = 3; core.userData.pulse = 1; g.add(core);
    const light = new THREE.PointLight(0xff2a3a, 2, 20); light.position.y = 3; g.add(light);
    g.position.set(p.x, y, p.z); g.userData.terrainAbsolute245 = true; scene.add(g); portal = g;
    portalInter = { x: p.x, z: p.z, r: 4.4, label: 'F · ENTRAR NA FENDA VERMELHA', use: enter };
    L.inter.push(portalInter);
  }
  function dropPortal() {
    if (portal) { try { scene.remove(portal); portal.traverse(o => { o.geometry && o.geometry.dispose && o.geometry.dispose(); o.material && o.material.dispose && o.material.dispose(); }); } catch (_) {} }
    portal = null; if (portalInter && L.inter) L.inter = L.inter.filter(i => i !== portalInter); portalInter = null;
  }
  function enter() {
    const s = S(); if (phase() !== 'fenda' || L.mode !== 'world') return;
    s.entradas = (s.entradas || 0) + 1; s.escolha = null; save(); dropPortal(); boss = null; door = null; doorInter = null; soldiers = []; flee = null;
    buildSpecial('corredor', null);
  }

  /* ---------- Sala do Corredor (kind 'corredor') ---------- */
  const ss = specialSetup2;
  specialSetup2 = function (kind, S0, arg) {
    ss.apply(this, arguments);
    if (kind !== 'corredor') return;
    S0.corredor = true; S0.spawned = false; S0.hits = 0; boss = null; door = null; doorInter = null; soldiers = []; flee = null;
  };
  function buildRoom(sp) {
    const b = spawnBoss(8, -14, sp.gr, typeof BOSSES !== 'undefined' ? BOSSES[Math.floor(Math.random() * BOSSES.length)] : undefined);
    dunScale(b, sp.gr, Math.max(1, run.level || 1));
    b.name = b.short = 'Comandante Marcado'; b.corredor611 = true; b.frozen = true; b.aggro = false; boss = b;
    flee = { t: 0, wp: [[14, -18], [-14, -18], [-15, 8], [15, 8]], i: 0, engaged: false };
    // porta trancada da câmara lateral (parede oeste) e os 3 soldados atrás dela
    const g = new THREE.Group();
    const slab = new THREE.Mesh(new THREE.BoxGeometry(.7, 3.4, 4.2), new THREE.MeshStandardMaterial({ color: 0x4a3a2c, roughness: .9 })); slab.position.y = 1.7; g.add(slab);
    for (const y of [.9, 2.5]) { const bar = new THREE.Mesh(new THREE.BoxGeometry(.8, .22, 4.4), new THREE.MeshStandardMaterial({ color: 0x2a2a30, metalness: .7, roughness: .5 })); bar.position.y = y; g.add(bar); }
    g.position.set(-21, 0, 0); L.group.add(g); door = g;
    const lamp = new THREE.PointLight(0xffa070, 1.8, 20); lamp.position.set(-16, 3.2, 0); L.group.add(lamp);
    doorInter = { x: -18.5, z: 0, r: 3.6, label: 'F · ARROMBAR A PORTA (0/' + HITS + ')', use: hitDoor };
    L.inter.push(doorInter);
    if (window.NPC456) for (let i = 0; i < 3; i++) {
      try { const f = NPC456.figure('homem', { m: NPC456.create('homem'), name: 'Soldado de Aster', down: false, x: -23.4, z: -1.8 + i * 1.8, t: 0 }); f.m.root.userData.terrainAbsolute245 = false; f.m.root.rotation.y = Math.PI / 2; L.group.add(f.m.root); f.m.root.position.set(-23.4, 0, -1.8 + i * 1.8); soldiers.push(f); } catch (_) {}
    }
    try { toast('<b>[FENDA]</b> A Fenda Vermelha está desmoronando (' + LIMIT + ' s). O Comandante Marcado foge com os pergaminhos de rota; 3 soldados de Aster batem na porta da câmara lateral.', 9000); } catch (_) {}
    try { narratorSayTop('Persiga o comandante. Os pergaminhos valem mais que três soldados.', 9000); } catch (_) {}
  }
  function hitDoor() {
    const s = S(), sp = L.special; if (s.escolha || !sp || sp.kind !== 'corredor') return;
    sp.hits = (sp.hits || 0) + 1;
    try { fxBurst(-19, 1.6, 0, 0xd8a050, 12, 3); sfx('boom'); shake(.45); } catch (_) {}
    if (doorInter) doorInter.label = 'F · ARROMBAR A PORTA (' + sp.hits + '/' + HITS + ')';
    if (sp.hits >= HITS) rescue();
    else try { toast('Do outro lado: — Mais um! A porta está cedendo!', 2200); } catch (_) {}
  }
  function rescue() {
    const s = S(); if (s.escolha) return; s.escolha = 'salvar'; s.guardas = 3; s.t = Date.now();
    if (door) { door.rotation.y = -1.4; door.position.x = -22.2; door.position.z = 1.8; }
    if (doorInter) { L.inter = L.inter.filter(i => i !== doorInter); doorInter = null; }
    for (const f of soldiers) { f.m.root.position.x += 3.2; }
    if (boss && !boss.dead) { try { fxBurst(boss.x, 1.4, boss.z, 0x303040, 18, 4); } catch (_) {} boss.dead = true; boss.gone = true; try { scene.remove(boss.m.root); } catch (_) {} if (bossE === boss) { bossE = null; try { $('boss').hidden = true; } catch (_) {} } }
    try { regionEvent116(aster(), 15, 0, 'Você arrombou a porta da câmara lateral na Fenda Vermelha e salvou 3 soldados de Aster. O comandante escapou.'); } catch (_) {}
    try { profile.aff = profile.aff || {}; profile.aff.Aldric = Math.min(10, (profile.aff.Aldric || 0) + 1); } catch (_) {}
    try { unlockLore('q011_salvos'); } catch (_) {}
    L.bossDead = true; try { beginDungeonEscape(); } catch (_) {}
    s.phase = 'volta'; save();
    try { bigText('SOLDADOS SALVOS', 1800); sfx('level'); } catch (_) {}
    try { toast('<b>[NARRADOR]</b> — Você desobedeceu. O comandante escapou com os pergaminhos. <b>3 soldados vivos, +15 de confiança em Aster, respeito de Aldric.</b> Três guardas veteranos vão patrulhar o portão.', 10000); } catch (_) {}
  }
  const obd = onBossDeath;
  onBossDeath = function (b) {
    obd.apply(this, arguments);
    try {
      if (!(L.special && L.special.kind === 'corredor')) return;
      const s = S(); if (s.escolha) return; s.escolha = 'abater'; s.camas = 3; s.t = Date.now();
      if (doorInter) { L.inter = L.inter.filter(i => i !== doorInter); doorInter = null; }
      try { run.spts = (run.spts || 0) + 1; floater(b.x, b.z, '+1 PONTO DE HABILIDADE (Tomo do Comandante)', '#b18cff', true, 4); } catch (_) {}
      try { unlockLore('q011_comandante'); } catch (_) {}
      s.phase = 'volta'; save();
      try { toast('<b>[NARRADOR]</b> — Bom. Os pergaminhos de rota são nossos. <b>Tomo do Comandante: +1 ponto de habilidade.</b> As batidas na porta pararam. Aster terá 3 camas vazias e luto.', 10000); } catch (_) {}
    } catch (e) { console.warn('Corredor611', e); }
  };
  function roomTick(dt) {
    const sp = L.special, s = S(); if (!sp || sp.kind !== 'corredor') return;
    if (!sp.spawned && sp.t > 1.5) { sp.spawned = true; buildRoom(sp); }
    if (!boss) return;
    const left = Math.max(0, LIMIT - sp.t);
    sp.msg = s.escolha ? 'Fenda Vermelha · saia antes de desmoronar' : 'Fenda Vermelha desmoronando · ' + Math.ceil(left) + ' s';
    if (!s.escolha && !boss.dead && flee) {
      flee.t += dt;
      if (!flee.engaged) {
        const dP = Math.hypot(player.x - boss.x, player.z - boss.z), w = flee.wp[flee.i], dx = w[0] - boss.x, dz = w[1] - boss.z, d = Math.hypot(dx, dz);
        if (d < 1.6) flee.i = (flee.i + 1) % flee.wp.length;
        else { const st = Math.min(3.4 * dt, d); boss.x += dx / d * st; boss.z += dz / d * st; boss.face = Math.atan2(dx, dz); try { boss.m.root.position.set(boss.x, 0, boss.z); boss.m.root.rotation.y = boss.face; } catch (_) {} }
        if (flee.t > 14 || dP < 2.4) { flee.engaged = true; boss.frozen = false; boss.aggro = true; try { bossAggro(boss); } catch (_) {} try { toast('<b>[COMANDANTE]</b> — Cercado! Então venha!', 3000); } catch (_) {} }
      }
    }
    if (!s.escolha && left <= 0 && !sp.collapsed) {
      sp.collapsed = true;
      try { toast('<b>[FENDA]</b> A Fenda desmoronou antes de você decidir. O portal reabre: tente de novo.', 6000); } catch (_) {}
      try { leaveDungeon(false); } catch (_) {}
    }
  }

  /* ---------- guardas veteranos e camas vazias ---------- */
  function gatePos() { const c = aster(); return { x: c.x, z: c.z + 72 }; }
  function patrolTick(dt) {
    const s = S(); if (!(s.escolha === 'salvar') || !window.NPC456) return;
    const g = gatePos(), near = Math.hypot(player.x - g.x, player.z - g.z) < 170;
    if (near && !vets.length) {
      vets = [-1, 0, 1].map((k, i) => { const f = NPC456.figure(i === 1 ? 'mulher' : 'homem', { m: NPC456.create(i === 1 ? 'mulher' : 'homem'), name: 'Guarda Veterano', down: false, x: g.x + k * 6, z: g.z + 6, t: 0 }); f.m.root.userData.terrainAbsolute245 = true; scene.add(f.m.root); f.k611 = k; return f; });
    } else if (!near && vets.length) { for (const f of vets) try { scene.remove(f.m.root); } catch (_) {} vets = []; }
    const t = performance.now() / 1000;
    for (const f of vets) { const nx = g.x + f.k611 * 6 + Math.sin(t * .25 + f.k611) * 3.2; f.m.root.rotation.y = Math.cos(t * .25 + f.k611) > 0 ? Math.PI / 2 : -Math.PI / 2; f.x = nx; f.z = g.z + 6; f.m.root.position.set(nx, terrH(nx, f.z), f.z); }
  }
  function bedsTick() {
    const s = S(); if (!(s.escolha === 'abater')) return;
    const m = typeof npcs !== 'undefined' ? npcs.filter(n => !n.gone && (n.short === 'Mira' || n.name === 'Mira'))[0] : null, base = m ? { x: m.x + 9, z: m.z + 3 } : { x: aster().x + 26, z: aster().z - 20 };
    const near = Math.hypot(player.x - base.x, player.z - base.z) < 160;
    if (near && (!beds || bedsL !== L)) {
      beds = new THREE.Group(); bedsL = L;
      for (let i = 0; i < 3; i++) {
        const bed = new THREE.Mesh(new THREE.BoxGeometry(1.1, .5, 2.2), new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: .95 })); bed.position.set(i * 1.8, .45, 0); beds.add(bed);
        const band = new THREE.Mesh(new THREE.BoxGeometry(1.15, .06, .5), new THREE.MeshStandardMaterial({ color: 0x111114 })); band.position.set(i * 1.8, .74, .2); beds.add(band);
      }
      beds.position.set(base.x, terrH(base.x, base.z), base.z); beds.userData.terrainAbsolute245 = true; scene.add(beds);
    } else if (!near && beds) { try { scene.remove(beds); } catch (_) {} beds = null; }
  }

  /* ---------- objetivo ---------- */
  function objective() {
    const ph = phase(); if (!ph) return null;
    if (L.special && L.special.kind === 'corredor') {
      const s = S(), left = Math.max(0, Math.ceil(LIMIT - (L.special.t || 0)));
      return { actTitle: 'O CORREDOR DA ESCOLHA', step: 2, totalSteps: 3, text: s.escolha ? 'Saia da Fenda antes de desmoronar' : 'A Fenda desmorona em ' + left + ' s: persiga o Comandante ou arrombe a porta dos soldados [E]', target: null };
    }
    if (ph === 'fenda') return { actTitle: 'O CORREDOR DA ESCOLHA', step: 2, totalSteps: 3, text: 'Entre na Fenda Vermelha da Câmara de Seleção [E]', target: spot() };
    return null;
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile) return;
    if (L.special && L.special.kind === 'corredor') { roomTick(dt); return; }
    if (L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); portal = null; portalInter = null; vets = []; beds = null; bedsL = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s) return;
    patrolTick(dt); bedsTick();
    if (s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof inConversation === 'function' && inConversation()) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) {
      const a5 = window.Campaign327 && Campaign327.state('a5'), q10 = profile.fixas545 && profile.fixas545.q010;
      if (a5 && a5.done && q10 && q10.done && free && dAster() < 130) { s.phase = 'fenda'; save(); try { toast('<b>[MISSÃO]</b> O Corredor da Escolha: com o relato de Aldric, a Ordem localizou a Fenda Vermelha da Câmara de Seleção perto de Aster. Entre antes que ela desmorone.', 9000); } catch (_) {} }
      return;
    }
    if (s.phase === 'fenda') {
      const s0 = S(); let sp0 = spot();
      if (!s0.lock && Math.hypot(player.x - sp0.x, player.z - sp0.z) < 90 && terrH(sp0.x, sp0.z) !== 0) sp0 = spot(true);
      const near = s0.lock && Math.hypot(player.x - sp0.x, player.z - sp0.z) < 170;
      if (near && !portal) buildPortal(); else if (!near && portal) dropPortal();
      if (portal) portal.traverse(o => { if (o.userData && o.userData.pulse) o.material.opacity = .6 + Math.sin(performance.now() / 240) * .2; });
    } else if (portal) dropPortal();
    if (s.phase === 'volta') { s.done = true; s.phase = 'fim'; save(); }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  let worldT = 0;
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q011) Fixas545.LIVE.primeva_q011 = 'v649'; } catch (e) { console.warn('Corredor611', e); } };
  window.Corredor611 = { state: S, active, objective, enter, hitDoor, spot, get boss() { return boss; }, get vets() { return vets; } };
})();
