const assert = require('node:assert/strict');

// Small executable model of the patched constructor and transition guards.
// It deliberately uses a real geometry cache keyed by direction and level.
const cache = new Map();
function geo(key, make) { if (!cache.has(key)) cache.set(key, make()); return cache.get(key); }
function makeStair(r, to, landing, forward) {
  const steps = [];
  for (let i = 0; i < 5; i++) {
    const level = forward ? 5 - i : i + 1;
    const geometry = geo(`step103_${forward ? 'down' : 'up'}_${level}`, () => ({ height: .3 * level }));
    steps.push({ geometry, y: .15 * level, z: i * .7 - 1.4 });
  }
  return {
    x: r.x, z: r.z, r: 3, room: r.i, to, landing, forward, steps,
    label: `F · ${forward ? 'DESCER' : 'SUBIR'} PARA O ${to + 1}º ANDAR`,
  };
}

const stairs = [
  makeStair({x: 0, z: 0, i: 0}, 1, {x: 10, z: 42}, true),
  makeStair({x: 10, z: 42, i: 4}, 0, {x: 0, z: 2}, false),
  makeStair({x: 20, z: 80, i: 8}, 2, {x: 30, z: 122}, true),
  makeStair({x: 30, z: 122, i: 12}, 1, {x: 20, z: 82}, false),
];

assert.equal(stairs[0].label, 'F · DESCER PARA O 2º ANDAR');
assert.equal(stairs[1].label, 'F · SUBIR PARA O 1º ANDAR');
assert.equal(stairs[2].label, 'F · DESCER PARA O 3º ANDAR');
assert.equal(stairs[3].label, 'F · SUBIR PARA O 2º ANDAR');
const eventId = stair => stair.forward ? 'stairs_up' : 'stairs_down';
assert.equal(eventId(stairs[0]), 'stairs_up', 'forward transition keeps the historical advance event ID');
assert.equal(eventId(stairs[1]), 'stairs_down', 'return transition keeps the historical return event ID');
for (const stair of stairs) {
  const levels = stair.steps.map(s => Math.round(s.y / .15));
  assert.deepEqual(levels, stair.forward ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5]);
  assert.deepEqual(stair.steps.map(s => s.geometry.height), levels.map(n => .3 * n));
}
assert.notEqual(stairs[0].steps[0].geometry, stairs[1].steps[0].geometry);
assert.equal(cache.size, 10, 'five levels per direction, without cross-direction reuse');

const state = { floor: 0, x: 0, z: 0, enemies: [{room: 0, dead: false}] };
function use(stair) {
  if (Math.hypot(state.x - stair.x, state.z - stair.z) > stair.r + .2) return false;
  if (stair.forward && state.enemies.some(e => !e.dead && e.room === stair.room)) return false;
  state.floor = stair.to; state.x = stair.landing.x; state.z = stair.landing.z + 2; return true;
}
assert.equal(use(stairs[0]), false, 'forward stair remains blocked by defenders');
state.enemies[0].dead = true;
assert.equal(use(stairs[0]), true); assert.equal(state.floor, 1);
state.x = 100; state.z = 100;
assert.equal(use(stairs[1]), false, 'return requires proximity');
state.x = stairs[1].x; state.z = stairs[1].z;
assert.equal(use(stairs[1]), true); assert.equal(state.floor, 0);
console.log('PASS stair direction, cache isolation, labels, guards, proximity and return');
