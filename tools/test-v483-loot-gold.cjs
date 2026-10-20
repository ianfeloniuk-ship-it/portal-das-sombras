const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

// Create sandbox simulating Primeva runtime
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  setInterval: () => {},
  clearInterval: () => {},
  performance: { now: () => Date.now() },
  Math,
  Number,
  Object,
  Array,
  String,
  Map,
  Set,
  crypto: { randomUUID: () => 'uuid-' + Math.random().toString(36).substr(2, 9) },
  window: {},
  document: {
    head: { appendChild: () => {} },
    createElement: () => ({ style: {}, appendChild: () => {} }),
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: () => {}
  },
  addEventListener: () => {},
  THREE: {
    Group: class { add() {} position = { set: () => {} }; userData = {}; },
    Mesh: class { add() {} position = { set: () => {} }; remove() {}; },
    OctahedronGeometry: class {},
    Vector3: class { set() {} },
    Matrix4: class {},
    Quaternion: class {}
  },
  geo: () => ({}),
  glowS: () => ({}),
  scene: { add: () => {}, remove: () => {} },
  makeChibi: () => ({ root: new sandbox.THREE.Group() }),
  animChibi: () => {},
  los: () => true,
  buildSteal: () => {},
  requestAnimationFrame: (cb) => cb(),
  ResizeObserver: class { observe() {} },
  $: (id) => ({ textContent: '', style: {}, children: [], getBoundingClientRect: () => ({ top: 0 }) }),
  sfx: (name) => { sandbox.lastSfx = name; },
  floater: (x, z, txt, col) => { sandbox.lastFloater = { x, z, txt, col }; },
  toast: (txt) => { sandbox.lastToast = txt; },
  fmt: (n) => String(n),
  safeText: (s) => s,
  row: (...args) => args.join(' '),
  btn: (...args) => args.join(' '),
  openModal: (t, h) => {},
  closeModal: () => {},
  mktView: () => {},
  saveRun: () => {},
  gainXp: () => {},
  storyEv: () => {},
  dprog: () => {},
  shadowXp: () => {},
  weaponXp: () => {},
  bestKill: () => {},
  qev: () => {},
  demandKill: () => {},
  hazard: () => {},
  dropLoot: () => {},
  dropDungeonEquipment: () => {},
  rememberVestige103: () => {},
  canArise: () => false,
  guildBonus: () => 0,
  titleB: () => ({ gold: 0 }),
  eLvl: () => 1,
  settleEnemyRewardBalance: () => {},
  trainingXpBalance: () => 10,
  THREAT184: { 0: { h: 1 } },
  KINDS: {
    lobo: { n: 'Lobo Cinzento', hp: 30, dmg: 5 },
    orc: { n: 'Orc Guerreiro', hp: 50, dmg: 8 }
  },
  GR: Array.from({ length: 12 }, () => ({ id: 'F', lvl: 1, gold: 1 })),
  RAR: Array.from({ length: 10 }, () => ({ n: 'Comum' })),
  run: {
    gold: 100,
    kills: 0,
    items: [],
    res: { core: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    surv437: {
      hunger: 100, thirst: 100, temp: 50,
      inv: {},
      spoil: {}, dur: {},
      canteen: { sips: 2, max: 4, kind: 'limpa', tier: 1 },
      clock: 0
    },
    worldLoot353: []
  },
  player: { x: 0, z: 0, dead: false },
  L: { mode: 'world', inter: [] },
  enemies: [],
  profile: { bagTier353: 0 }
};
sandbox.window = sandbox;

// Load loot353.js
vm.runInNewContext(fs.readFileSync('tools/loot353.js', 'utf8'), sandbox, { filename: 'loot353.js' });
assert.ok(sandbox.Loot353, 'Loot353 loaded');

// Load survival437.js
vm.runInNewContext(fs.readFileSync('tools/survival437.js', 'utf8'), sandbox, { filename: 'survival437.js' });
assert.ok(sandbox.Surv437, 'Surv437 loaded');
assert.strictEqual(sandbox.Survival437, sandbox.Surv437, 'Survival437 alias matches Surv437');

// Mock killEnemy matching src/core/370-v281.js
const killEnemyCore = function(e) {
  if (e.dead) return;
  e.dead = true;
  e.deadT = 0;
  e.act = null;
  // Automatic gold collection (v483)
  const g = Math.round((e.gold || 0) * (1 + sandbox.guildBonus() + (sandbox.titleB().gold || 0)));
  if (g > 0 && sandbox.run) {
    sandbox.run.gold = (sandbox.run.gold || 0) + g;
    if (typeof sandbox.floater === 'function') sandbox.floater(e.x, e.z, '+' + sandbox.fmt(g) + ' ouro', '#ffd54f', true);
    if (typeof sandbox.sfx === 'function') sandbox.sfx('coin');
  }
  sandbox.finishCorpse353(e);
};
sandbox.killEnemy = killEnemyCore;

// Re-wrap with survival437 handler (simulating browser loading sequence)
const origKill = sandbox.killEnemy;
sandbox.killEnemy = function(e) {
  const wasAlive = e && !e.dead;
  if (wasAlive && !e.ally && !e.statue) {
    // Call survival drops
    const k = (e.kind || '').replace(/_[fa]$/, '');
    if (['coelho', 'alpaca', 'alpacaimp', 'lobo', 'orc', 'orcinho', 'yeti', 'yetinho', 'dino', 'raptor', 'sapo', 'escaravelho'].includes(k)) {
      const meatCount = ['dino', 'yeti', 'alpaca', 'alpacaimp'].includes(k) ? 2 : 1;
      sandbox.corpseDrop353(e, { type: 'surv', itemKey: 'carne', name: 'Carne Crua', n: meatCount });
      sandbox.corpseDrop353(e, { type: 'surv', itemKey: 'couro', name: 'Couro Cru', n: 1 });
    }
  }
  const r = origKill.apply(this, arguments);
  if (wasAlive && e.dead && !e.corpse353 && e.loot353?.length && typeof sandbox.finishCorpse353 === 'function') {
    sandbox.finishCorpse353(e);
  }
  return r;
};

// TEST 1: Kill an animal (lobo) with gold = 25
const initialGold = sandbox.run.gold;
const initialMeatCount = sandbox.Surv437.count('carne');
const initialWeight = sandbox.Surv437.totalW();

const wolf = { kind: 'lobo', name: 'Lobo Selvagem', x: 2, z: 2, gold: 25, dead: false };
sandbox.killEnemy(wolf);

// 1. Gold must be collected AUTOMATICALLY
assert.strictEqual(sandbox.run.gold, initialGold + 25, 'Gold awarded automatically to run.gold');
assert.strictEqual(sandbox.lastSfx, 'coin', 'Coin sound played on automatic gold pickup');
assert.ok(sandbox.lastFloater && sandbox.lastFloater.txt.includes('+25 ouro'), 'Floating text shown for gold');

// 2. Meat must NOT be in player's inventory automatically
assert.strictEqual(sandbox.Surv437.count('carne'), initialMeatCount, 'Raw meat NOT added automatically to inventory');
assert.strictEqual(sandbox.Surv437.count('couro'), 0, 'Leather NOT added automatically to inventory');
assert.strictEqual(sandbox.Surv437.totalW(), initialWeight, 'Player weight NOT increased on kill');

// 3. Meat and leather must be on the wolf corpse for optional manual pickup
assert.ok(wolf.corpse353, 'Corpse record created for wolf');
const records = sandbox.Loot353.records();
const wolfRecord = records.find(r => r.id === wolf.corpse353);
assert.ok(wolfRecord, 'Corpse record found in Loot353');
assert.ok(wolfRecord.entries.some(x => x.itemKey === 'carne'), 'Meat is present in corpse entries');
assert.ok(wolfRecord.entries.some(x => x.itemKey === 'couro'), 'Leather is present in corpse entries');
assert.ok(!wolfRecord.entries.some(x => x.type === 'gold'), 'Gold is NOT in corpse entries (already auto-collected)');

// 4. Player chooses to loot the meat manually
const meatEntry = wolfRecord.entries.find(x => x.itemKey === 'carne');
sandbox.los = () => true;
const lootSuccess = sandbox.Loot353.take(wolfRecord.id, meatEntry.id);
assert.ok(lootSuccess, 'Manual meat looting succeeds');
assert.strictEqual(sandbox.Surv437.count('carne'), initialMeatCount + 1, 'Meat added to survival inventory upon manual pickup');
assert.ok(sandbox.Surv437.totalW() > initialWeight, 'Weight increases only after manual looting');

// 5. Test Largar Tudo
sandbox.Surv437.add('carne', 5, true);
assert.strictEqual(sandbox.Surv437.count('carne'), 6, 'Has 6 meats now');
const curMeat = sandbox.Surv437.count('carne');
sandbox.Surv437.take('carne', curMeat);
assert.strictEqual(sandbox.Surv437.count('carne'), 0, 'Largar Tudo discarded all meat');

console.log('--- ALL V483 TESTS PASSED SUCCESSFULLY ---');
