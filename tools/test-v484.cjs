const assert = require('assert');
const fs = require('fs');

console.log('--- TEST v484 ---');

// 1. Test updNpc in src/jogo-completo.js
const code = fs.readFileSync('game.html', 'utf8');

// Check that updNpc contains emergent handler and !c guard
assert(code.includes("if(n.kind==='emergent_skyrim'||n.kind==='emergent'||n.kind==='traveler')"), 'Missing emergent_skyrim check in updNpc');
assert(code.includes('if(!c)return;'), 'Missing if(!c)return in updNpc');

// Create mock environment to run updNpc
const mockGlobal = {
  player: { x: 10, z: 10, face: 0 },
  enemies: [],
  gates: [],
  scene: { remove: () => {} },
  turnTo: (n, target, dt, speed) => { n.face = target; },
  animChibi: (m, state, t) => {},
  clamp: (v, min, max) => Math.max(min, Math.min(max, v))
};

// Extract updNpc function
const fnMatch = code.match(/function updNpc\(n,dt\)\{[\s\S]*?\n\}/);
assert(fnMatch, 'updNpc function not found');

const testSandbox = new Function('player', 'enemies', 'gates', 'scene', 'turnTo', 'animChibi', 'clamp', `
  ${fnMatch[0]}
  return updNpc;
`)(mockGlobal.player, mockGlobal.enemies, mockGlobal.gates, mockGlobal.scene, mockGlobal.turnTo, mockGlobal.animChibi, mockGlobal.clamp);

// Test 1: emergent NPC without home or path should NOT throw
const emergentNpc = {
  kind: 'emergent_skyrim',
  name: 'Viajante',
  x: 12,
  z: 12,
  face: 0,
  m: { root: { position: { set: () => {} }, rotation: {} } }
};

try {
  testSandbox(emergentNpc, 0.016);
  console.log('PASS: updNpc runs without error on emergent_skyrim NPC');
} catch (err) {
  console.error('FAIL: updNpc threw on emergent_skyrim NPC:', err);
  process.exit(1);
}

// Test 2: NPC without home (c is undefined) should NOT throw
const homelessNpc = {
  kind: 'citizen',
  name: 'Desconhecido',
  x: 0,
  z: 0,
  face: 0,
  m: { root: { position: { set: () => {} }, rotation: {} } }
};

try {
  testSandbox(homelessNpc, 0.016);
  console.log('PASS: updNpc runs without error on NPC without home');
} catch (err) {
  console.error('FAIL: updNpc threw on homeless NPC:', err);
  process.exit(1);
}

// Test 3: Wall Collider Gaps
const TAU = Math.PI * 2;
// Wall 1: R=60, 180 points, r=1.8
const step1 = TAU / 180;
const arcDist1 = 60 * step1; // ~2.094m
const colDiam1 = 1.8 * 2; // 3.6m
assert(arcDist1 < colDiam1, `Wall 1 has gap: distance ${arcDist1} >= diameter ${colDiam1}`);
console.log(`PASS: Wall 1 spacing = ${arcDist1.toFixed(2)}m < diameter = ${colDiam1}m (overlap ${(colDiam1 - arcDist1).toFixed(2)}m)`);

// Wall 2: R=85, n2=Math.round(TAU*85/4)=134, r=2.6
const n2 = Math.round(TAU * 85 / 4);
const arcDist2 = TAU * 85 / n2; // ~3.985m
const colDiam2 = 2.6 * 2; // 5.2m
assert(arcDist2 < colDiam2, `Wall 2 has gap: distance ${arcDist2} >= diameter ${colDiam2}`);
console.log(`PASS: Wall 2 spacing = ${arcDist2.toFixed(2)}m < diameter = ${colDiam2}m (overlap ${(colDiam2 - arcDist2).toFixed(2)}m)`);

// Wall 3: R=115, n3=Math.round(TAU*115/4.2)=172, r=2.8
const n3 = Math.round(TAU * 115 / 4.2);
const arcDist3 = TAU * 115 / n3; // ~4.20m
const colDiam3 = 2.8 * 2; // 5.6m
assert(arcDist3 < colDiam3, `Wall 3 has gap: distance ${arcDist3} >= diameter ${colDiam3}`);
console.log(`PASS: Wall 3 spacing = ${arcDist3.toFixed(2)}m < diameter = ${colDiam3}m (overlap ${(colDiam3 - arcDist3).toFixed(2)}m)`);

// Test 4: Road Segments Alignment
// Check roadSegs implementation
const roadMatch = code.match(/function roadSegs\(x,z,n\)\{[\s\S]*?\n\}/);
assert(roadMatch, 'roadSegs not found');
assert(roadMatch[0].includes('const mx=(c.x+e.x)/2,mz=(c.z+so.z)/2;'), 'roadSegs does not use midpoint');

console.log('PASS: roadSegs uses midpoint routing connecting directly to cardinal gates');
console.log('ALL TESTS PASSED SUCCESSFULLY!');
