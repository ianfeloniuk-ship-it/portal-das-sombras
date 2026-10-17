const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

// Verify no new .glb placeholders were introduced (Zero Tripo Credits rule)
const glbRefs = new Set();
for (const f of ['tools/survival437.js', 'tools/build437.js', 'tools/cart437.js', 'tools/ecology410.js', 'tools/campaign327.js']) {
  const txt = fs.readFileSync(path.join(root, f), 'utf8');
  const matches = txt.match(/models\/[a-zA-Z0-9_./-]+\.glb/g) || [];
  for (const m of matches) glbRefs.add(m);
}
for (const rel of glbRefs) {
  assert(fs.existsSync(path.join(root, rel)), 'Missing existing GLB model on disk: ' + rel);
}
console.log('1. Zero Tripo Credits check passed: all referenced .glb files exist on disk (' + glbRefs.size + ' files).');

// Set up browser/Three.js mock sandbox to test the full expedition cycle
const toasts = [];
const floaters = [];
const sysMsgs = [];
const bigTexts = [];

function makeMockThree() {
  class Vec3 {
    constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
    set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
    setScalar(s) { this.x = s; this.y = s; this.z = s; return this; }
    copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
    multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
    fromBufferAttribute() { return this; }
  }
  class Color {
    constructor(c = 0) { this.hex = typeof c === 'number' ? c : 0xffffff; this.r = 0.5; this.g = 0.5; this.b = 0.5; }
    getHex() { return this.hex; }
    setHex(h) { this.hex = h; return this; }
    clone() { return new Color(this.hex); }
    lerp() { return this; }
  }
  class Obj3D {
    constructor() {
      this.children = [];
      this.position = new Vec3();
      this.rotation = new Vec3();
      this.scale = new Vec3(1, 1, 1);
      this.userData = {};
      this.visible = true;
    }
    add(...kids) { for (const k of kids) if (k) { k.parent = this; this.children.push(k); } return this; }
    remove(k) { this.children = this.children.filter(c => c !== k); }
    traverse(fn) { fn(this); for (const c of this.children) if (c.traverse) c.traverse(fn); }
    clone() { return new Obj3D(); }
  }
  class Geo {
    constructor() {
      this.attributes = { position: { count: 4, array: new Float32Array(12), setXYZ() {} } };
    }
    setAttribute() {}
    setIndex() {}
    computeVertexNormals() {}
    translate() { return this; }
    scale() { return this; }
    rotateX() { return this; }
    rotateY() { return this; }
    toNonIndexed() { return this; }
    dispose() {}
  }
  class Mat {
    constructor(opts = {}) { Object.assign(this, opts); this.userData = {}; }
    clone() { return new Mat(this); }
    dispose() {}
  }
  return {
    Vector2: class { constructor(x=0,y=0){this.x=x;this.y=y;} set(x,y){this.x=x;this.y=y;return this;} },
    Vector3: Vec3,
    Vector4: class { constructor(x=0,y=0,z=0,w=0){this.x=x;this.y=y;this.z=z;this.w=w;} set(x,y,z,w){this.x=x;this.y=y;this.z=z;this.w=w;return this;} },
    Matrix4: class { compose(){return this;} decompose(){return this;} },
    Quaternion: class { setFromEuler(){return this;} },
    Box3: class { constructor(){this.min=new Vec3();this.max=new Vec3(1,1,1);} setFromObject(){return this;} getSize(v){return v||new Vec3(1,1,1);} },
    Sphere: class { constructor(){this.center=new Vec3();this.radius=1;} copy(){return this;} applyMatrix4(){return this;} },
    Frustum: Object.assign(function(){}, { prototype: { intersectsObject:()=>true, intersectsSprite:()=>true, intersectsSphere:()=>true } }),
    ShaderChunk: { common: '', project_vertex: '', worldpos_vertex: '', defaultnormal_vertex: '' },
    UniformsLib: { common: {} },
    Material: Mat,
    Color,
    Group: Obj3D,
    Object3D: Obj3D,
    Mesh: class extends Obj3D { constructor(g, m) { super(); this.geometry = g || new Geo(); this.material = m || new Mat(); } },
    PointLight: class extends Obj3D { constructor(c, i, d) { super(); this.color = new Color(c); this.intensity = i; this.distance = d; } },
    BufferGeometry: Geo,
    Float32BufferAttribute: class {},
    BoxGeometry: Geo,
    CylinderGeometry: Geo,
    SphereGeometry: Geo,
    ConeGeometry: Geo,
    PlaneGeometry: Geo,
    RingGeometry: Geo,
    TorusGeometry: Geo,
    OctahedronGeometry: Geo,
    DodecahedronGeometry: Geo,
    IcosahedronGeometry: Geo,
    CircleGeometry: Geo,
    BufferAttribute: class {},
    Points: class extends Obj3D { constructor(g, m) { super(); this.geometry = g; this.material = m; } },
    PointsMaterial: Mat,
    MeshStandardMaterial: Mat,
    MeshBasicMaterial: Mat,
    FogExp2: class { constructor(c, d) { this.color = new Color(c); this.density = d; } },
    BackSide: 1,
    DoubleSide: 2,
    GLTFLoader: class { load(u, ok) {} }
  };
}

const THREE = makeMockThree();
const storeData = {};
const sandbox = {
  console,
  Math,
  Date,
  setTimeout: (fn) => { try { fn(); } catch (_) {} return 1; },
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  addEventListener: () => {},
  requestAnimationFrame: () => 1,
  performance: { now: () => 1000 },
  THREE,
  TAU: Math.PI * 2,
  WSEED: 12345,
  time: 100,
  dayT: 300,
  modalOpen: false,
  curGate: null,
  gates: [],
  enemies: [],
  allies: [],
  drops: [],
  chests: [],
  npcs: [],
  prof: {},
  profile: { rank: 3, best: 3, anchorShut221: {} },
  run: { days: 1, gold: 500, clears: 0, bags: [], res: { cry: [0,0,0,0,0,0,0,0,0,0] } },
  player: { x: 20, z: 20, y: 0, hp: 180, mhp: 200, mp: 80, mmp: 80, face: 0, lv: 10, rk: 2, skills: [] },
  cam: { x: 20, z: 20 },
  scene: { background: new THREE.Color(0x000000), fog: new THREE.FogExp2(0x000000, 0.01), add() {}, remove() {} },
  sun: { color: new THREE.Color(0xffffff) },
  hemi: { color: new THREE.Color(0xffffff) },
  L: { mode: 'world', group: new THREE.Group(), inter: [], exits: [], rooms: [] },
  RANKS: [{id:'F',c:'#ccc'},{id:'E',c:'#ccc'},{id:'D',c:'#ccc'},{id:'C',c:'#ccc'},{id:'B',c:'#ccc'},{id:'A',c:'#ccc'},{id:'S',c:'#ccc'},{id:'SS',c:'#ccc'},{id:'SSS',c:'#ccc'},{id:'X',c:'#ccc'}],
  GR: [{id:'F',th:{n:'Fenda'}},{id:'E',th:{n:'Fenda'}},{id:'D',th:{n:'Fenda'}},{id:'C',th:{n:'Fenda'}},{id:'B',th:{n:'Fenda'}},{id:'A',th:{n:'Fenda'}},{id:'S',th:{n:'Fenda'}},{id:'SS',th:{n:'Fenda'}},{id:'SSS',th:{n:'Fenda'}},{id:'X',th:{n:'Fenda'}}],
  KINDS: {
    lobo: { n: 'Lobo', hp: 100, dmg: 15, spd: 4, rk: 0 },
    sapo: { n: 'Sapo Rei', hp: 200, dmg: 20, spd: 3, rk: 1 },
    olhoerrante: { n: 'Olho Errante', hp: 120, dmg: 18, spd: 3.5, rk: 2 },
    arraia: { n: 'Arraia', hp: 140, dmg: 20, spd: 4, rk: 2 },
    arauto: { n: 'Arauto', hp: 220, dmg: 28, spd: 3.5, rk: 4 },
    semente: { n: 'Semente', hp: 160, dmg: 22, spd: 3, rk: 3 }
  },
  BOSSES: [{ n: 'Chefe', hp: 500, dmg: 40 }],
  BOSSES_HIGH: [{ n: 'Chefe Alto', hp: 1000, dmg: 60 }],
  SOVEREIGNS: [{ n: 'Soberano', hp: 2000, dmg: 90 }],
  CITIES: [
    { id: 'aster', n: 'Aster', x: 0, z: 0 },
    { id: 'solaria', n: 'Solaria', x: 1000, z: 0 },
    { id: 'ymiria', n: 'Ymiria', x: 0, z: -1000 },
    { id: 'zahar', n: 'Zahar', x: 0, z: 1000 }
  ],
  store: {
    get: (k) => storeData[k] || null,
    set: (k, v) => { storeData[k] = v; }
  },
  localStorage: {
    getItem: (k) => storeData[k] ? JSON.stringify(storeData[k]) : null,
    setItem: (k, v) => { try { storeData[k] = JSON.parse(v); } catch (_) { storeData[k] = v; } }
  },
  toast: (m) => toasts.push(m),
  floater: (x, z, m) => floaters.push(m),
  showSys: (m) => sysMsgs.push(m),
  bigText: (m) => bigTexts.push(m),
  logNews: () => {},
  sfx: () => {},
  shake: () => {},
  fxBurst: () => {},
  fxRing: () => {},
  saveRun: () => {},
  closeModal: () => { sandbox.modalOpen = false; },
  openModal: (title, html) => { sandbox.modalOpen = true; sandbox.lastModalTitle = title; sandbox.lastModalHtml = html; },
  bagView: () => {},
  terrH: () => 0,
  biomeAt: (x, z) => {
    if (z < -500) return 'neve';
    if (z > 500) return 'deserto';
    return 'floresta';
  },
  inAnyCity: (x, z) => Math.hypot(x, z) < 40,
  nearestCity: (x, z) => ({ c: { id: 'aster', name: 'Aster', n: 'Aster', x: 0, z: 0 }, d: Math.hypot(x, z) }),
  worldFree: () => true,
  freeAt: () => true,
  rnd: (a, b) => (a + b) * 0.5,
  rndi: (a, b) => a,
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  mulberry32: (a) => () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  },
  geo: (k, fn) => fn ? fn() : new THREE.BufferGeometry(),
  toonS: (c) => new THREE.MeshStandardMaterial({ color: c }),
  glowS: (c) => new THREE.MeshStandardMaterial({ color: c }),
  mesh: (g, m) => new THREE.Mesh(g, m),
  envOwn: (g, m) => { if (g && m) g.add(m); return m; },
  HurtPlayer: () => {},
  hurtPlayer: () => {},
  addXP: () => {},
  profLv: () => 1,
  profXp: () => {},
  hasT: () => false,
  storyEv: () => {},
  npcEv: () => {},
  qev: () => {},
  checkTitles: () => {},
  unlockLore: () => {},
  narratorEnter105: () => {},
  narratorPortal105: () => {},
  rollRareGate155: () => {},
  rareOnPortal103: () => {},
  expAbandon: () => {},
  SETS153: {},
  document: {
    getElementById: () => ({ style: {}, classList: { add(){}, remove(){} }, appendChild(){}, querySelector(){ return null; }, querySelectorAll(){ return []; } }),
    createElement: () => ({ style: {}, classList: { add(){}, remove(){} }, appendChild(){}, remove(){}, setAttribute(){} }),
    head: { appendChild(){} },
    body: { appendChild(){}, classList: { contains: () => true } },
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// Load modules into sandbox
for (const mod of [
  'tools/terrain245.js',
  'tools/terra444.js',
  'tools/clear445.js',
  'tools/survival437.js',
  'tools/cart437.js',
  'tools/build437.js'
]) {
  vm.runInContext(fs.readFileSync(path.join(root, mod), 'utf8'), sandbox, { filename: mod });
}

// Verify Requirement 1: Terrain deformation disabled & Portable Expedition Camp
assert.strictEqual(sandbox.Terra444.add(), false, 'Terra444.add should be disabled');
assert.strictEqual(sandbox.Terra444.toggle(), false, 'Terra444.toggle should be disabled');
assert.strictEqual(sandbox.Terra444.open(), false, 'Terra444.open should be disabled');
assert.strictEqual(sandbox.Terra444.active(), false, 'Terra444.active should be disabled');
assert.strictEqual(sandbox.TER245.TFN.value, 0, 'TER245.TFN.value should be 0 (no terrain deformation)');

const buildIds = Object.keys(sandbox.Build437.STRUCTS);
assert(!buildIds.includes('cabana'), 'Permanent cabana must be removed from Build437');
assert(!buildIds.includes('palicada'), 'Permanent palicada must be removed from Build437');
assert(buildIds.includes('fogueira') && buildIds.includes('abrigo') && buildIds.includes('varal') && buildIds.includes('bancada'), 'Portable camp items must exist in Build437');
console.log('2. Requirement 1 (Terrain Protection & Portable Camp Blueprints) verified.');

// Verify Requirement 2: Food Freshness (4 stages), Preparation Durations, Preservation Bags, Canteens
const Surv = sandbox.Surv437;
const S = Surv.S();

// Give materials to craft preservation bags, dried meat, expedition rations, and canteens
Surv.give('galho', 40);
Surv.give('pedra', 40);
Surv.give('fibra', 40);
Surv.give('corda', 30);
Surv.give('couro', 35);
Surv.give('resina', 30);
Surv.give('tora', 35);
Surv.give('lenha', 35);
Surv.give('tabua', 20);
Surv.give('minerio', 25);
Surv.give('cristal_frio', 10);
Surv.give('carne', 6);
Surv.give('peixe_cru', 4);
Surv.give('fruta', 10);
Surv.give('erva', 10);

// Place Portable Camp outside city (x=60, z=60)
sandbox.player.x = 60;
sandbox.player.z = 60;
assert(sandbox.Build437.build('fogueira'), 'Should place portable campfire');
assert(sandbox.Build437.build('abrigo'), 'Should place portable tent/shelter');
assert(sandbox.Build437.build('varal'), 'Should place portable drying rack');
assert(sandbox.Build437.build('bancada'), 'Should place portable field workbench');

// Craft preservation bags & canteens at workbench
assert(Surv.craft('alforje_sal'), 'Should craft Alforje de Couro Curado no Sal');
assert(Surv.craft('mochila_termica'), 'Should craft Mochila Térmica de Cristal Frio');
assert(Surv.craft('involucro_resina'), 'Should craft Invólucro de Resina e Fibra');
assert(Surv.craft('cantil_ferro'), 'Should craft Cantil de Ferro');
assert(Surv.craft('cantil_termico'), 'Should craft Cantil Térmico Isolado');
assert.strictEqual(Surv.canteenTier(), 3, 'Canteen progression should reach Tier 3 (Cantil Térmico Isolado)');

// Roast meat on campfire & craft Ração de Expedição
assert(Surv.craft('assada'), 'Should roast Carne Assada on campfire');
Surv.give('defumada', 2); // cured on Varal Portátil
assert(Surv.craft('racao_expedicao'), 'Should craft Ração de Expedição');

// Check preparation durations (spoilDays)
assert(Surv.ITEMS.carne.spoilDays <= 2, 'Raw meat spoils in 1-2 days');
assert(Surv.ITEMS.assada.spoilDays >= 3 && Surv.ITEMS.assada.spoilDays <= 4.5, 'Roasted meat lasts 3-4 days');
assert(Surv.ITEMS.defumada.spoilDays >= 10 && Surv.ITEMS.defumada.spoilDays <= 14.5, 'Dried meat lasts 10-14 days');
assert(Surv.ITEMS.racao_expedicao.spoilDays >= 20, 'Expedition ration lasts 20+ days');

// Test Bundling Wrap (Invólucro de Resina -> Pacote Lacrado with 0% decay)
assert(Surv.sealBundle(), 'Should seal up to 4 meals in Pacote Lacrado');
assert(Surv.count('pacote_lacrado') >= 1, 'Should have pacote_lacrado in inventory');

// Test 4 Freshness Stages & automatic conversion to Isca de Carniça at 0%
assert.strictEqual(Surv.freshStage(85).id, 'fresca', '85% is Fresca (Green)');
assert.strictEqual(Surv.freshStage(40).id, 'amanhecida', '40% is Amanhecida/Passada (Yellow)');
assert.strictEqual(Surv.freshStage(15).id, 'estragada', '15% is Estragada/Rançosa (Red)');
assert.strictEqual(Surv.freshStage(0).id, 'podre', '0% is Podre (Gray)');

// Pack up the portable camp before traveling to the Rift
const packedOk = sandbox.Build437.packAllCamp456();
assert.strictEqual(packedOk, true, 'Should pack up portable camp structures back into inventory');
console.log('3. Requirement 2 (4 Freshness Stages, Dried Meat, Rations, Preservation Bags, Canteens & Camp Pack-Up) verified.');

// Verify Requirement 3: Cargo Cart Brine Box, Parking at Rift, Otherworld Multi-Zone Boss Hunt & 14-Day Temporal Impact
vm.runInContext(fs.readFileSync(path.join(root, 'src/core/270-masmorra-procedural.js'), 'utf8'), sandbox, { filename: '270-masmorra-procedural.js' });
vm.runInContext(fs.readFileSync(path.join(root, 'src/core/290-bloco-crystals125-cont.js'), 'utf8'), sandbox, { filename: '290-bloco-crystals125-cont.js' });

// Place Cargo Cart and store food in its Brine Box (-75% decay)
assert(sandbox.Build437.build('carrinho'), 'Should build Cargo Cart');
const cartSt = sandbox.Cart437.st();
assert(cartSt.built, 'Cart should be built');
Surv.give('defumada', 2);
sandbox.Cart437.put('defumada', 1);
assert(cartSt.inv.defumada >= 1, 'Caixa de Salmoura in Cargo Cart holds food');

// Pull cart to Rift Gate and park outside on enterGate
sandbox.Cart437.togglePull();
assert.strictEqual(cartSt.pulling, true, 'Cart should be pulled');
const gate = { id: 42, x: 180, z: 180, rank: 3, seed: 777, biome124: 'floresta', family124: 'wolves' };
sandbox.player.x = gate.x;
sandbox.player.z = gate.z;
sandbox.Cart437.parkAtGate456(gate);
assert.strictEqual(cartSt.pulling, false, 'Cart should be unhooked and parked outside the Rift gate');
assert.strictEqual(cartSt.parkedGateId, 42, 'Cart should have parkedGateId marker for minimap');

// Set up Otherworld inside dungeon
sandbox.makeSign = () => new THREE.Group();
sandbox.gainXp = () => {};
sandbox.L = {
  mode: 'dungeon',
  gate,
  G: { rank: 3, xp: 10, th: { n: 'Covil da Matilha', floor: 0x334433, wall: 0x223322, trim: 0x88aa66, fog: 0x112211, light: 0xaacc99 } },
  group: new THREE.Group(),
  inter: [],
  exits: [],
  seen: new Set(),
  rooms: [
    { i: 0, wx: 0, wz: 0, x: 0, y: 0, w: 6, h: 6 },
    { i: 1, wx: 20, wz: 0, x: 10, y: 0, w: 6, h: 6 },
    { i: 2, wx: 40, wz: 0, x: 20, y: 0, w: 6, h: 6 },
    { i: 3, wx: 60, wz: 0, x: 30, y: 0, w: 6, h: 6 },
    { i: 4, wx: 80, wz: 0, x: 40, y: 0, w: 8, h: 8 }
  ],
  bossRoom: 4
};
const mul = sandbox.mulberry32(999);
sandbox.setupOtherworld456(gate, sandbox.L.rooms, 4, [1, 2, 3], mul, r => ({ x: r.wx, z: r.wz }));
assert(sandbox.L.otherworld456, 'Otherworld dimension config must be initialized on L.otherworld456');
assert.strictEqual(sandbox.L.riftSignalsMax456, 3, 'Must require 3 Energy Signal Trail nodes across zones before Boss Citadel is located');

// Verify Miasma 2x spoilage inside Rift when thermal bag is removed
const savedThermal = S.inv.mochila_termica;
S.inv.mochila_termica = 0;
S.inv.alforje_sal = 0;
assert.strictEqual(Surv.spoilMult(false), 2.0, 'Rift Miasma must double spoilage rate (2.0x) outside thermal bags');
S.inv.mochila_termica = savedThermal;
assert(Surv.spoilMult(false) <= 0.25, 'Mochila Térmica shields food inside the Rift');
assert.strictEqual(Surv.spoilMult(true), 0.25, 'Caixa de Salmoura in Cargo Cart reduces spoilage by 75% (0.25x)');

// Open sealed ration bundle inside the dungeon
assert(Surv.unsealBundle(), 'Should unwrap Pacote Lacrado inside the dungeon with 100% freshness');

// Camp inside the Rift (place campfire & tent inside dungeon)
sandbox.player.x = 20;
sandbox.player.z = 0;
assert(sandbox.Build437.build('fogueira'), 'Should place campfire inside Otherworld Rift');
assert(sandbox.Build437.build('abrigo'), 'Should place tent inside Otherworld Rift');
const shelterInside = sandbox.Build437.st().find(s => s.kind === 'abrigo' && s.inDun);
assert(shelterInside, 'Tent inside dungeon should be tagged inDun');

// Gather exotic Otherworld resources (Lenha Abissal, Fungos Astrais, Fenda Abissal)
const resNodes = sandbox.L.inter.filter(it => it.type === 'riftRes456');
assert.strictEqual(resNodes.length, 3, '3 exotic Otherworld resource nodes must be spawned');
for (const rn of resNodes) {
  assert(sandbox.gatherOtherworldRes456(rn), 'Should gather exotic resource inside Otherworld');
}

// Track all 3 Energy Signal Trail nodes to locate the Boss Citadel
const sigs = sandbox.L.inter.filter(it => it.type === 'riftSignal456');
assert.strictEqual(sigs.length, 3, '3 Energy Signal Trail interactive nodes must be spawned in the Otherworld');
for (const sig of sigs) {
  sandbox.trackRiftSignal456(sig);
}
assert.strictEqual(sandbox.L.riftSignals456, 3, 'All 3 signals tracked');
assert(sandbox.L.seen.has(4), 'Tracking all 3 signals must reveal the Boss Citadel on the map');
assert(sandbox.L.riftDays456 >= 9, 'Tracking signals across zones advances expedition days inside the Otherworld');

// Defeat Boss and leave the Rift -> verify 14+ days temporal impact in Primeva
sandbox.L.bossDead = true;
sandbox.buildWorld = () => { sandbox.L.mode = 'world'; sandbox.L.group = new THREE.Group(); sandbox.L.inter = []; };
const daysBefore = sandbox.run.days;
sandbox.leaveDungeon(false);
const daysAfter = sandbox.run.days;
assert(daysAfter - daysBefore >= 14, 'Leaving cleared Rift must advance Primeva calendar by at least 14 days (actual: ' + (daysAfter - daysBefore) + ')');
assert(Array.isArray(sandbox.run.capitalStatus456) && sandbox.run.capitalStatus456.length >= 5, 'Capital statuses must be updated after weeks in the Rift');
assert(bigTexts.some(t => t.includes('DIAS SE PASSARAM EM PRIMEVA')), 'Dramatic time-passage banner must be shown');
assert(sysMsgs.some(t => t.includes('dias se passaram em Primeva desde que você entrou na Fenda')), 'Dramatic time-passage system message must be shown');
console.log('4. Requirement 3 (Otherworld Multi-Zone Expedition, Miasma, Camp in Rift, Signal Tracking & 14-Day Temporal Impact) verified.');
console.log('ALL_V456_INTEGRATION_TESTS_PASSED');
