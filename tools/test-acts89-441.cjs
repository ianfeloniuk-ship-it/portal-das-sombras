const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const noop = () => {};

function element(tag, doc) {
  return {
    tag, style: {}, dataset: {}, children: [], classList: { add: noop, remove: noop }, userData: {},
    setAttribute: noop, insertAdjacentHTML: noop,
    appendChild(e) { e.parent = this; this.children.push(e); return e; },
    append(...nodes) { nodes.forEach(e => this.appendChild(e)); },
    after: noop, focus() { doc.activeElement = this; },
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(x => x !== this); },
    querySelectorAll() { return []; },
    get firstChild() { return this.children[0] || { style: {} }; }
  };
}

(async () => {
  const THREE = await require('./test-three405.cjs').loadThree();
  const document = { activeElement: null, hidden: false };
  document.createElement = tag => {
    if (tag === 'canvas') return { width: 64, height: 64, getContext: () => ({ createRadialGradient: () => ({ addColorStop: noop }), fillRect: noop, beginPath: noop, ellipse: noop, fill: noop, arc: noop, moveTo: noop, lineTo: noop, stroke: noop }) };
    return element(tag, document);
  };
  document.body = element('body', document);
  document.head = element('head', document);
  document.getElementById = id => {
    if (!document._ids) document._ids = {};
    if (!document._ids[id]) document._ids[id] = element('div', document);
    return document._ids[id];
  };

  const CITIES = {
    '0,0': { id: 'c_aster', name: 'Aster', x: 0, z: 0 },
    '-5,0': { id: 'c_thalor', name: 'Thalor', x: -5000, z: 0 },
    '5,0': { id: 'c_zahar', name: 'Zahar', x: 5000, z: 0 },
    '0,-5': { id: 'c_ymiria', name: 'Ymiria', x: 0, z: -5000 }
  };

  const ctx = {
    THREE, console, Map, Set, WeakMap, Promise, Math, Date, Float32Array, Uint8Array, performance: { now: () => 1000 },
    document, setInterval: noop, clearInterval: noop, setTimeout: noop, clearTimeout: noop, addEventListener: noop, requestAnimationFrame: noop,
    KEYACT: [], keyOf: () => 'ControlLeft',
    profile: { rank: 8, name: 'Viajante', lore: ['act8', 'act9'], visited217: {}, camp327: { m: { a1: { done: true, s: 4 } } } },
    run: { level: 35, gold: 1000, equip: {}, items: [], stats: { vit: 10, res: 10, str: 10, agi: 10 } },
    player: { x: 0, z: 0, hp: 500, maxhp: 500, mp: 100, maxmp: 100, r: 0.5, m: { root: new THREE.Group(), wep: new THREE.Group() } },
    cam: { x: 0, z: 0 }, pcCam: { yaw: 0, pitch: 0 },
    L: { mode: 'world', inter: [], group: new THREE.Group() },
    scene: new THREE.Scene(),
    hemi: { color: { setHex: noop }, intensity: 1 },
    sun: { color: { setHex: noop }, intensity: 1 },
    pLight: { color: { setHex: noop }, intensity: 1 },
    LORE: {}, RANKS: Array.from({ length: 10 }, (_, i) => ({ id: 'R' + i, c: 0xffffff })),
    GR: Array.from({ length: 10 }, () => ({})),
    store: { set: noop, get: () => null },
    regionCity: (rx, rz) => CITIES[rx + ',' + rz] || CITIES['0,0'],
    nearestCity: (x, z) => {
      let best = CITIES['0,0'], bd = 1e9;
      for (const k in CITIES) { const c = CITIES[k], d = Math.hypot(x - c.x, z - c.z); if (d < bd) { bd = d; best = c; } }
      return { c: best, d: bd };
    },
    biomeAt: (x, z) => 'campos',
    CITYK: 1, cityL: () => 0, cityPalisadeR: () => 80,
    toast: noop, sfx: noop, storyEv: noop, openShop: noop, journeyView: noop, npcRows: () => '', extraActions2: noop,
    journeyObjectives: () => [], missionPanelText: () => '', rankTab: () => '',
    started: true, paused: false, modalOpen: false, GATES341: [], npcs: [], FRIENDS217: [],
    logNews: noop, popNews194: noop, RpgBalance: { questReward: () => ({ xp: 100 }) }, gainXp: () => 100,
    questGold283: () => 100, rankOf: () => 8, addOrderRep: noop, unlockLore: k => { if (!ctx.profile.lore.includes(k)) ctx.profile.lore.push(k); },
    bigText: noop, xpNumber: String, fmt: String, saveRun: noop, addFloat: noop, floater: noop,
    terrH: (x, z) => 0, pick: a => a[0], rnd: (a, b) => (a + b) / 2, TAU: Math.PI * 2, freeAt: () => true,
    MODELS: { list: { Barbarian: true }, ready: Promise.resolve(true) },
    makeActor: () => ({ root: new THREE.Group(), mats: [], model: true }), animChibi: noop, speech153: noop,
    enemies: [],
    KINDS: { goblin: {}, gobShield118: {}, homempeixe_a: {}, lula_a: {}, arraia_a: {}, escaravelho_f: {}, cactogig_f: {}, invasor_f: {}, yeti_f: {}, yeti: {}, yetinho: {} },
    GOB: ['goblin'], kindsFor: () => [{ k: 'goblin', w: 1 }], wpick: () => ({ k: 'goblin' }),
    makeElite: e => { e.elite = true; return e; }, fxRing: noop,
    spawnKind: (kind, x, z) => { const e = { kind, x, z, hp: 100, maxhp: 100, m: { root: new THREE.Group() }, dead: false }; ctx.enemies.push(e); return e; },
    killEnemy: e => { e.dead = true; },
    hurtEnemy: (e, amt) => { e.hp -= amt; if (e.hp <= 0) e.dead = true; },
    hurtPlayer: amt => { ctx.player.hp -= amt; },
    movementSpeed: v => v, rollStaminaCost: () => 10, playerHitDamage: v => v, critChance: () => 0.05,
    pManaRegen281: () => 0.1, pVigorRegen281: () => 0.1, mktView: noop, extraActions: noop,
    row: () => '', btn: () => '', hasAff: () => false, ADT: 0.016, time: 10,
    moveEnt: noop, los: () => true,
    clearLevel: () => { ctx.enemies.length = 0; ctx.L.inter = []; },
    leaveDungeon: () => { ctx.L = { mode: 'world', inter: [], group: new THREE.Group() }; },
    renderGrid: noop, mulberry32: () => () => 0.5, placeAllies: noop, updChunks: noop,
    pieceMesh250: () => new THREE.Group(),
    Rift131: { create: () => new THREE.Group(), update: noop, close: noop, dispose: noop },
    Water391: { swimming: false, depthAt: () => 12, waterAt: () => null, body: 1.25 },
    W377: { releaseAll: noop }, Wagon369: { ready: Promise.resolve(false) },
    Solid429: { prop: noop, figure: f => f },
    openModal: noop, closeModal: noop, showG: noop, refreshStats: noop
  };
  ctx.window = ctx;
  vm.createContext(ctx);

  vm.runInContext(fs.readFileSync('historia-campanha.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('tools/scenes406.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('tools/biomes295.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('tools/survival437.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('tools/build437.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('tools/ecology410.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('tools/campaign327.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('tools/mechanics434.js', 'utf8'), ctx);

  // 1. Validate Act VIII (O Clã Ferrugem e Torvo)
  const C = ctx.Campaign327, a8 = C.ACTS.find(a => a.id === 'a8');
  assert.equal(a8.steps.length, 5, 'Act VIII has 5 steps following Chapter 8');
  C.begin(a8); C.tick();
  const s8 = C.state('a8');
  assert.ok(s8.pos[0] < 0, 'Act VIII Step 0 is positioned on the western route');
  ctx.player.x = s8.pos[0]; ctx.player.z = s8.pos[1];
  C.tick();
  let w8 = C.W.get('a8');
  assert.ok(w8.gorge441, 'Act VIII Step 0 builds 3D gorge blockade with rocks/stumps and false banner');
  assert.equal(w8.foes.length, 7, '6 false looters + 1 elite spawned in gorge');
  w8.foes.forEach(e => e.dead = true); C.tick();
  assert.equal(s8.fightDone, true, 'Defeating false looters unlocks gorge clearing');
  w8.inters[0].use();
  assert.equal(s8.gorgeCleared441, true, 'Gorge cleared with Pá/Enxada');
  assert.ok((ctx.run.surv437.leveled || []).length >= 1, 'Pá/Enxada leveled terrain in run.surv437.leveled');
  assert.equal(s8.s, 1, 'Advanced to Step 1 (old foundry valley with Torvo & surrounded refugees)');

  C.tick();
  ctx.player.x = s8.pos[0]; ctx.player.z = s8.pos[1];
  C.tick(); w8 = C.W.get('a8');
  assert.ok(s8.pos[0] < -100, 'Step 1 is further west in the old foundry valley');
  w8.foes.forEach(e => e.dead = true); C.tick();
  w8.inters[0].use();
  assert.equal(s8.s, 2, 'Advanced to Step 2 (healing refugees Fome/Sede/Cansaço)');

  C.tick(); w8 = C.W.get('a8');
  // Without fire/water/food, it should not advance
  w8.inters[0].use();
  assert.equal(s8.s, 2, 'Refugees require campfire, boiled water, or roasted food');
  ctx.Surv437.give('assada', 1);
  w8.inters[0].use();
  assert.equal(s8.refugeeHealed441, true, 'Refugees healed with roasted food / boiled water / campfire');
  assert.equal(s8.s, 3, 'Advanced to Step 3 (collect Torvo testimony)');

  C.tick(); w8 = C.W.get('a8');
  w8.inters[0].use();
  assert.equal(s8.s, 4, 'Advanced to Step 4 (register testimony with Lyra)');

  // 2. Validate Act IX Part 1: Thalor (-5, 0) & Abyssal Dungeon
  const thalor = ctx.regionCity(-5, 0);
  ctx.Mech423.enterAbyssalDungeon441(thalor);
  assert.equal(ctx.L.mode, 'dungeon', 'Entered Abyssal Dungeon');
  assert.equal(ctx.L.special.kind, 'abyssal441', 'Special dungeon kind is abyssal441');
  assert.equal(ctx.L.special.foes.length, 3, '3 Abyssal Elites spawned guarding chains');
  assert.ok(ctx.L.special.arm, 'Left Arm of Architect (arquiteto246.glb) chained in center');
  ctx.L.special.foes.forEach(e => e.dead = true);
  ctx.L.bossDead = true;
  ctx.L.special.elevIt.use();
  assert.equal(ctx.L.mode, 'world', 'Aquatic Elevator returned player to world');
  assert.ok(Math.hypot(ctx.player.x - thalor.x, ctx.player.z - thalor.z) < 20, 'Player emerged in floating city of Thalor');

  // 3. Validate Act IX Part 2: Zahar (5, 0) & Ymiria (0, -5)
  const zahar = ctx.regionCity(5, 0), ymiria = ctx.regionCity(0, -5);
  assert.equal(ctx.biomeAt(zahar.x, zahar.z), 'deserto', 'Zahar (5,0) biome is deserto');
  assert.equal(ctx.biomeAt(ymiria.x, ymiria.z), 'neve', 'Ymiria (0,-5) biome is neve');

  ctx.Surv437.give('polpa_cacto', 2);
  ctx.Surv437.give('fibra_espinhosa', 2);
  ctx.Surv437.give('tocha', 1);
  assert.ok(ctx.Surv437.has('polpa_cacto', 2), 'Polpa/Água de Cacto available');
  assert.ok(ctx.Surv437.has('fibra_espinhosa', 2), 'Fibras Espinhosas available');
  assert.ok(ctx.Surv437.has('tocha', 1), 'Tocha com Resina available');

  // Zahar Anchor defense & Right Arm seal
  ctx.Mech423.attune(zahar);
  const zElites = ctx.enemies.filter(e => !e.dead && e.elite);
  assert.equal(zElites.length, 3, 'Zahar Anchor spawns 3 Desert Elites');
  zElites.forEach(e => e.dead = true);
  ctx.Mech423.attune(zahar);
  assert.equal(ctx.profile.m423.anchors.Zahar.sealed441, true, 'Zahar Anchor stabilized and Right Arm sealed');

  // Ymiria neutral yetinho (#013) & corrupted Alpha Yeti defense
  ctx.Eco410.toggleSheath(true);
  assert.equal(ctx.player.sheathed441, true, 'Weapon sheathed (X) for peaceful yetinho (#013) interaction');
  ctx.Mech423.attune(ymiria);
  const alpha = ctx.enemies.find(e => !e.dead && e.yetiAlpha441);
  const pack = ctx.enemies.filter(e => !e.dead && e.yetiPack441);
  assert.ok(alpha, 'Corrupted Alpha Yeti spawned at Ymiria Anchor');
  assert.equal(pack.length, 2, 'Smaller yetis spawned with Alpha');
  alpha.hp = 0;
  ctx.killEnemy(alpha);
  assert.ok(pack.every(p => (p.eco410?.flee || 0) > 0), 'Smaller yetis flee in panic when corrupted Alpha Yeti falls');
  ctx.Mech423.attune(ymiria);
  assert.equal(ctx.profile.m423.anchors.Ymiria.sealed441, true, 'Ymiria Anchor stabilized');

  console.log('ALL_V441_TESTS_PASSED');
})();
