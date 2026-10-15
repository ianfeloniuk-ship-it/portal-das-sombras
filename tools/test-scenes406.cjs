const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
let THREE;
const noop = () => {};
function element(tag, doc) {
  return { tag, children: [], classList: { add: noop, remove: noop }, userData: {}, setAttribute: noop,
    appendChild(e) { e.parent = this; this.children.push(e); return e; }, append(...nodes) { nodes.forEach(e => this.appendChild(e)); },
    focus() { doc.activeElement = this; }, remove() { if(this.parent) this.parent.children = this.parent.children.filter(x => x !== this); },
    querySelectorAll(selector) { return this.children.flatMap(e => [...((selector === 'button' && e.tag === 'button') || (selector === '[tabindex],button' && (e.tag === 'button' || e.tabIndex != null)) ? [e] : []), ...e.querySelectorAll(selector)]); }
  };
}
function context(profile) {
  const document = { activeElement: null }; document.createElement = tag => element(tag, document); document.body = element('body', document);
  const ctx = { THREE, console, Map, Set, WeakMap, Promise, Math, document, setInterval: noop, setTimeout: f => f(), addEventListener: noop,
    profile: profile || { rank: 3, name: 'Teste', towerBest: 12, camp327: { m: { a1: { done: true, s: 4 } } } },
    run: { level: 4, gold: 0, equip: {}, items: [] }, player: { x: 100, z: 100 }, L: { mode: 'world', inter: [] }, scene: new THREE.Scene(),
    LORE: {}, store: { set: noop }, nearestCity: () => ({ c: { name: 'Aster', x: 0, z: 0 }, d: 0 }), CITYK: 1, cityL: () => 0, cityPalisadeR: () => 80,
    toast: noop, sfx: noop, storyEv: noop, openShop: noop, journeyView: noop, npcRows: () => '', extraActions2: noop, journeyObjectives: () => [], missionPanelText: () => '', rankTab: () => '',
    started: true, paused: false, modalOpen: false, GATES341: [], npcs: [], logNews: noop, popNews194: noop, RpgBalance: { questReward: () => ({ xp: 10 }) }, gainXp: () => 10,
    questGold283: () => 10, rankOf: () => 1, addOrderRep: noop, unlockLore: noop, bigText: noop, xpNumber: String, fmt: String, saveRun: noop,
    terrH: (x, z) => x * .01 + z * .02, pick: a => a[0], rnd: (a, b) => (a + b) / 2, TAU: Math.PI * 2, freeAt: () => true,
    MODELS: { list: { Barbarian: true } }, makeActor: () => ({ root: new THREE.Group(), mats: [], model: true }), animChibi: noop, speech153: noop,
    enemies: [], KINDS: { goblin: {} }, kindsFor: () => [], wpick: () => ({ k: 'goblin' }), makeElite: e => e.elite = true, fxRing: noop,
    spawnKind: (kind, x, z) => { const e = { kind, x, z, m: { root: new THREE.Group() }, dead: false }; ctx.enemies.push(e); return e; },
    W377: { releaseAll: noop }, Wagon369: { ready: Promise.resolve(false) }
  };
  ctx.window = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('historia-campanha.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('tools/scenes406.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('tools/campaign327.js', 'utf8'), ctx);
  return ctx;
}
function reader(c) { return c.document.body.children.find(e => e.id === 'reader406'); }
function buttons(c) { return reader(c).querySelectorAll('button'); }
function use(c, id, idx = 0) { c.Campaign327.W.get(id).inters.find(i => i.idx === idx).use(); }
function defeat(c, id) { c.Campaign327.W.get(id).foes.forEach(e => e.dead = true); c.Campaign327.tick(); }
(async () => {
  THREE = process.argv[2] ? require(require('path').resolve(process.argv[2])) : await require('./test-three405.cjs').loadThree();
  const c = context(), C = c.Campaign327, a2 = C.ACTS[1]; C.begin(a2); C.advance(a2); C.state('a2').pos = [100, 100]; C.tick();
  let s = C.state('a2'), w = C.W.get('a2');
  assert.equal(C.ACTS[1].steps.length, 4); assert.equal(C.ACTS[2].steps.length, 3);
  assert.equal(w.foes.length, 6); assert.equal(w.foes.filter(e => e.elite).length, 1);
  assert.equal(w.figs.filter(f => f?.hidden406).length, 2); assert.equal(w.book406.visible, false);
  assert.equal(w.scene406.userData.terrainAbsolute245, true, 'CPU elevation must not be lifted again by the world shader');
  const people = w.figs.filter(f => f?.hidden406).map(f => [f.x, f.z]);
  use(c, 'a2'); assert.equal(reader(c), undefined); assert.equal(s.s, 1);
  defeat(c, 'a2'); assert.equal(s.killed, 6); assert.equal(w.book406.visible, true); assert.ok(w.glow406.emissive.getHex() > 0, 'journal glow needs an actual emissive color');
  const readyReload = context(JSON.parse(JSON.stringify(c.profile))); readyReload.Campaign327.tick(); assert.equal(readyReload.Campaign327.W.get('a2').book406.visible, true, 'secured journal remains visible after reload');
  use(c, 'a2'); assert.equal(c.paused, true); assert.equal(c.modalOpen, true); assert.equal(s.s, 1, 'reading alone does not collect');
  const text = reader(c).children[0].children[2].children.map(p => p.textContent).join(' ');
  assert.match(text, /Comecei estas páginas/); assert.match(text, /Devolvam estes registros à Ordem/); assert.doesNotMatch(text, /Mira recebeu|encontrou sobreviventes|Lyra separou/);
  buttons(c)[0].onclick(); assert.equal(s.s, 1); assert.equal(c.paused, false); assert.equal(c.modalOpen, false);
  use(c, 'a2'); buttons(c)[1].onclick(); assert.equal(s.s, 2); C.tick(); w = C.W.get('a2');
  assert.deepEqual(w.figs.filter(Boolean).map(f => [f.x, f.z]), people, 'the same people remain in place after collecting the book');
  assert.equal(w.scene406.name, 'AldricWreck406'); assert.equal(w.inters.length, 2);
  use(c, 'a2', 0); assert.equal(s.s, 2); assert.equal(s.hit.length, 1);
  const reloaded = context(JSON.parse(JSON.stringify(c.profile))); reloaded.Campaign327.tick();
  assert.equal(reloaded.Campaign327.W.get('a2').inters.length, 1, 'partial rescue survives reload without respawning the rescued person');
  use(c, 'a2', 1); assert.equal(s.s, 3); c.openShop('guild'); assert.equal(s.done, true);
  C.tick(); s = C.state('a3'); assert.equal(s.base, 17); c.profile.towerBest = 16; C.tick(); assert.equal(s.s, 0);
  c.profile.towerBest = 17; C.tick(); assert.equal(s.s, 1); s.pos = [100, 100]; C.tick(); w = C.W.get('a3');
  assert.equal(w.foes.length, 4); assert.equal(w.monolith406.children.length, 34, 'slab, arch, five marks, separate center, erased layer'); assert.ok(w.glow406.emissiveIntensity > .05, 'monolith responds to approach even before victory');
  use(c, 'a3'); assert.equal(reader(c), undefined); defeat(c, 'a3');
  const near = w.glow406.emissiveIntensity; c.player.x += 100; c.Scenes406.update(C.ACTS[2], s, w, 1); assert.ok(near > w.glow406.emissiveIntensity);
  use(c, 'a3'); assert.equal(s.s, 1);
  const copy = reader(c).children[0].children[2].children.map(p => p.textContent).join(' ');
  assert.match(copy, /cinco pequenas marcas/); assert.match(copy, /parcialmente apagada/); assert.doesNotMatch(copy, /contenção|Arquiteto|Vocês/);
  let disposed = 0; w.monolith406.children[0].geometry.addEventListener('dispose', () => disposed++);
  buttons(c)[1].onclick(); assert.equal(s.s, 2); assert.equal(disposed, 1); assert.equal(reader(c), undefined);
  // A reader belonging to an unloaded world must cancel rather than advance a stale step.
  const d = context(), D = d.Campaign327; D.begin(D.ACTS[1]); D.advance(D.ACTS[1]); D.state('a2').pos = [100, 100]; D.tick(); defeat(d, 'a2'); use(d, 'a2');
  const old = D.W.get('a2'); d.Scenes406.dispose(old); assert.equal(reader(d), undefined); assert.equal(D.state('a2').s, 1); assert.equal(d.paused, false);
  // Delayed loading must not attach a wagon after scene cleanup.
  let resolve, created = 0; const e = context(); e.Wagon369 = { ready: new Promise(r => resolve = r), create: () => { created++; return null; } };
  const E = e.Campaign327; E.begin(E.ACTS[1]); E.advance(E.ACTS[1]); E.state('a2').pos = [100, 100]; E.tick(); e.Scenes406.dispose(E.W.get('a2')); resolve(true); await Promise.resolve(); assert.equal(created, 0);
  const f = context(); f.Wagon369 = { ready: Promise.resolve(true), create: () => {
    const g = new THREE.Group(), body = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 3), new THREE.MeshStandardMaterial({color: 0xaa8844})); body.position.y = 1; g.add(body);
    const ox = body.clone(), driver = body.clone(); ox.position.y = -20; driver.position.y = -30; g.add(ox, driver);
    return {g, ox, driver:{root:driver}, mixer:{stopAllAction:noop}};
  }};
  const F=f.Campaign327;F.begin(F.ACTS[1]);F.advance(F.ACTS[1]);F.state('a2').pos=[100,100];F.tick();await Promise.resolve();
  const wagon=F.W.get('a2').wagon406; assert.equal(wagon.ox.parent,null);assert.equal(wagon.driver.root.parent,null);
  wagon.g.updateWorldMatrix(true,true); const bottom=new THREE.Box3().setFromObject(wagon.g).min.y;
  assert.ok(Math.abs(bottom-f.terrH(95.5,98.2))<1e-6,'wagon grounding excludes removed hidden figures');
  console.log('PASS: 6 enemies + elite, blocked evidence, paused/cancelled/confirmed reading, two stable survivors + reload, relative five-floor gate, 4 enemies, monolith/copy, disposal and late asset load');
})().catch(e => { console.error(e); process.exitCode = 1; });
