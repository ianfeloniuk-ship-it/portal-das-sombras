const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const root = require('path').resolve(__dirname, '..');
const {loadThree}=require('./test-three405.cjs');
async function main(){const three=await loadThree();
const scene = new three.Scene();
const camera = new three.PerspectiveCamera();
const player = { x: 0, z: 0, face: 0, m: { root: new three.Group() } };
const timers = [];
const context = {
  THREE: three, window: {}, scene, camera, player,
  enemies: [], allies: [], run: { equip: {} }, profile: { cls: 0 },
  performance: { now: () => 0 }, console, Math,
  setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
  requestAnimationFrame: () => 0,
  Shaders312: { energy: () => new three.MeshBasicMaterial(), fire: () => new three.MeshBasicMaterial(), fireball: () => new three.MeshBasicMaterial(), shield: () => new three.MeshBasicMaterial(), magic: () => new three.MeshBasicMaterial(), slash: () => new three.MeshBasicMaterial(), electric: () => new three.MeshBasicMaterial(), lava: () => new three.MeshBasicMaterial(), smoke: () => new three.MeshBasicMaterial(), water: () => new three.MeshBasicMaterial() },
  skillGroundPoint: () => ({ x: 1, z: 1 }), shake: () => {}, fxRing: () => {}, waveFwd: () => {}, useSkill: () => {},
  projModel: () => new three.Mesh(new three.BoxGeometry(1, 1, 1), new three.MeshBasicMaterial()),
  geo: (n, f) => f(), mesh: (g, m) => new three.Mesh(g, m), gl: () => new three.MeshBasicMaterial(), toonS: () => new three.MeshBasicMaterial(), glowS: () => new three.MeshBasicMaterial(),
  Firearms372: { bullet: () => new three.Mesh(new three.BoxGeometry(1, 1, 1), new three.MeshBasicMaterial()) },
  Cactoro372: { projectile: () => new three.Mesh(new three.BoxGeometry(1, 1, 1), new three.MeshBasicMaterial()) },
  Spiky350: { projectile: () => new three.Mesh(new three.BoxGeometry(1, 1, 1), new three.MeshBasicMaterial()) },
  Warrior127: {},
};
context.window = context;
vm.createContext(context);
for (const file of ['tools/vfx302.js', 'tools/vfx328.js']) vm.runInContext(fs.readFileSync(require('path').join(root, file), 'utf8'), context, { filename: file });
assert(context.VFX302 && typeof context.VFX302.createPreview === 'function');
assert(context.VFX328 && typeof context.VFX328.createPreview === 'function');

const scheduled = [];
const isolatedScene = new three.Scene();
const isolatedPlayer = { x: 2, z: 3, face: 0 };
const preview = context.VFX302.createPreview({
  scene: isolatedScene, camera, player: isolatedPlayer,
  defer(fn, ms) { scheduled.push({ fn, ms }); }, point: () => ({ x: 2, z: 3 })
});
assert(preview && preview.size === 0);
preview.dust(2, 3, 0xffffff, 2);
assert.strictEqual(preview.size, 1);
assert.strictEqual(scene.children.length, 0, 'preview must not mutate live scene');
assert.strictEqual(isolatedScene.children.length, 1);
preview.update(2);
assert.strictEqual(preview.size, 0, 'preview clear/update must release finished effects');
assert.strictEqual(isolatedScene.children.length, 0);

const v328 = context.VFX328.createPreview({
  scene: isolatedScene, camera, player: isolatedPlayer, enemies: [], vfx302: preview,
  defer(fn, ms) { scheduled.push({ fn, ms }); }, point: () => ({ x: 2, z: 3 }),
  kitPoint: () => ({ x: 2, z: 3 }), kitRadius: () => 2, kitTarget: () => null, kitTargets: () => [], projectile: () => null
});
assert(v328 && typeof v328.X === 'object');
assert.strictEqual(scene.children.length, 0, 'factory creation must preserve live scene');
preview.dispose();

// Baseline parity smoke: the same deterministic helper calls must create the
// same primitive count and object names in the pre-factory live module.
const cp = require('child_process');
function loadBaseline(file, targetScene) {
  const c = { ...context, scene: targetScene, window: null, Math: Object.create(Math) };
  c.window = c; c.Math.random = () => 0.25;
  vm.createContext(c);
  vm.runInContext(cp.execFileSync('git', ['show', `HEAD:${file}`], { cwd: root, encoding: 'utf8' }), c, { filename: file + '@HEAD' });
  return c;
}
const oldScene = new three.Scene();
const old = loadBaseline('tools/vfx302.js', oldScene);
const nowScene = new three.Scene();
const now = { ...context, scene: nowScene, window: null, Math: Object.create(Math) };
now.window = now; now.Math.random = () => 0.25;
vm.createContext(now);
vm.runInContext(fs.readFileSync(require('path').join(root, 'tools/vfx302.js'), 'utf8'), now, { filename: 'tools/vfx302.js@worktree' });
const calls = ['dust', 'fissure', 'spikes', 'shockwave', 'slash', 'heal'];
for (const name of calls) { old.VFX302[name](0, 0, 0xffffff); now.VFX302[name](0, 0, 0xffffff); }
const shape = s => s.children.map(o => ({ name: o.name, type: o.type, children: o.children.length })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
assert.deepStrictEqual(shape(nowScene), shape(oldScene), 'representative live VFX shape diverged from HEAD');
console.log(`vfx-factories405: baseline parity ok (${calls.length} helpers)`);
console.log('vfx-factories405: ok (factory shape, isolated scene, update/release)');
}
main().catch(e=>{console.error(e);process.exitCode=1});
