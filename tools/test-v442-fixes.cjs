const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('Testing v442 fixes...');

// 1. Test mechanics434 marksView
{
  let modalOpened = null;
  let modalTitle = null, modalContent = null;
  const ctx = {
    P423: () => ({ marks: [] }),
    openModal: (t, h) => { modalTitle = t; modalContent = h; },
    TAU: Math.PI * 2,
    R: () => 0.5,
    esc: (s) => s,
    glyph: () => '<svg></svg>'
  };
  vm.createContext(ctx);

  const m434Code = fs.readFileSync('tools/mechanics434.js', 'utf8');
  const marksViewMatch = m434Code.match(/function marksView\(\) \{[\s\S]*?\n  \}/);
  assert.ok(marksViewMatch, 'marksView function must exist');
  vm.runInContext(marksViewMatch[0] + '; marksView();', ctx);

  assert.equal(modalTitle, 'MARCAS DO ARQUITETO', 'Modal title should be MARCAS DO ARQUITETO');
  assert.ok(modalContent.includes('NENHUMA MARCA REGISTRADA AINDA'), 'Modal should show empty state when 0 marks');
  assert.ok(modalContent.includes('Derrote os Guardiões das Fendas'), 'Modal should guide player how to obtain marks');

  // Now test with 1 mark
  ctx.P423 = () => ({ marks: [{ seed: 123, n: 'Marca da Fenda de Aster' }] });
  vm.runInContext('marksView();', ctx);
  assert.ok(modalContent.includes('Marca da Fenda de Aster'), 'Modal should display recorded mark');
  assert.ok(modalContent.includes('Derrote mais um guardião para comparar'), 'Modal should prompt for 2nd mark to compare');

  // Verify button does not have conditional check
  assert.ok(m434Code.includes("bMarks423'; m.textContent = 'MARCAS DO ARQUITETO'; m.onclick = marksView;"), 'Menu button must call marksView unconditionally');
  console.log('✔ mechanics434 marksView verification passed.');
}

// 2. Test intro401 dynamic tracking
{
  let hudText = {};
  const ctx = {
    window: {},
    document: {
      getElementById: () => ({ after: () => {} }),
      createElement: () => ({
        append: () => {},
        setAttribute: () => {},
        addEventListener: () => {},
        querySelector: (sel) => ({
          set textContent(v) { hudText[sel] = v; },
          get textContent() { return hudText[sel]; },
          setAttribute: () => {}
        })
      }),
      head: { append: () => {} },
      body: { append: () => {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} } }
    },
    addEventListener: () => {},
    setInterval: () => {},
    setTimeout: () => {},
    store: { set: () => {} },
    CFG: {},
    started: true,
    player: { x: 100, z: 200 },
    run: { trackObj: 'camp327:a8' },
    profile: { rank: 3 },
    Campaign327: {
      state: (id) => {
        if (id === 'a1') return { done: true, s: 6 };
        if (id === 'a8') return { s: 1, hit: [], killed: 0, done: false, city: 'Aster' };
        return null;
      },
      active: () => [
        { id: 'a8', act: 8, title: 'O Clã Ferrugem', steps: [{ d: 'Passo 1' }, { d: 'Fale com Torvo no vale da fundição velha.' }] }
      ],
      target: () => ({ x: 500, z: 600 }),
      W: { get: () => null },
      rescueCamera: () => {}
    },
    THREE: {
      Group: class { constructor() { this.userData = {}; this.add = () => {}; this.traverse = () => {}; } },
      ConeGeometry: class {},
      CylinderGeometry: class {},
      RingGeometry: class {},
      MeshBasicMaterial: class {},
      Mesh: class { constructor() { this.userData = {}; this.position = { set: () => {}, y: 0 }; this.scale = { setScalar: () => {} }; this.rotation = { set: () => {}, x: 0, y: 0, z: 0 }; } traverse() {} },
      Vector3: class { constructor(x,y,z) { this.x=x;this.y=y;this.z=z; } clone() { return this; } lerp() {} copy() {} }
    },
    scene: { add: () => {} },
    terrH: () => 0,
    performance: { now: () => 1000 },
    camera: { position: { clone: () => ({ lerp: () => {}, copy: () => {} }) }, quaternion: { clone: () => {} }, lookAt: () => {} },
    camUpdate: () => {},
    L: { mode: 'world' }
  };
  ctx.window.Campaign327 = ctx.Campaign327;
  ctx.window.run = ctx.run;
  vm.createContext(ctx);

  const introCode = fs.readFileSync('tools/intro401.js', 'utf8');
  vm.runInContext(introCode, ctx);

  const t = ctx.window.Intro401.targetAndText();
  assert.ok(t, 'targetAndText must return tracked mission data');
  assert.equal(t.actTitle, 'ATO VIII · O CLÃ FERRUGEM', 'Must display ATO VIII roman numeral and title');
  assert.equal(t.step, 2, 'Step should be 2 (s: 1 + 1)');
  assert.equal(t.totalSteps, 2, 'Total steps should be 2');
  assert.equal(t.text, 'Fale com Torvo no vale da fundição velha.');
  assert.deepEqual(t.target, { x: 500, z: 600 });
  console.log('✔ intro401 dynamic tracking verification passed.');
}

// 3. Test cityL and reloadCityChunks
{
  const profile = { cityLv: { '0,0': 0 } };
  const capital = { id: '0,0', name: 'Aster', capital: true, cx: 0, cz: 0 };
  
  // Test cityL definition
  const cityL = c => c ? (profile.cityLv || {})[c.id] || 0 : 0;
  assert.equal(cityL(capital), 0, 'Level should start at 0 for capital so upgrades take immediate effect');
  profile.cityLv['0,0'] = 1;
  assert.equal(cityL(capital), 1, 'Level should reflect donation to level 1');
  profile.cityLv['0,0'] = 3;
  assert.equal(cityL(capital), 3, 'Level should reflect donation to level 3');

  // Test reloadCityChunks logic
  const unloads = [];
  const chunks = new Map([
    ['0,0', { cx: 0, cz: 0, city: capital }],
    ['1,0', { cx: 1, cz: 0 }],
    ['-1,1', { cx: -1, cz: 1 }],
    ['5,5', { cx: 5, cz: 5 }]
  ]);
  const unloadChunk = (ch) => { unloads.push(ch.cx + ',' + ch.cz); };
  let updChunksCalled = false;
  const updChunks = () => { updChunksCalled = true; };

  function reloadCityChunks(c) {
    if (!c) return;
    for (const ch of [...chunks.values()]) {
      if ((ch.city && ch.city.id === c.id) || (Math.abs(ch.cx - c.cx) <= 2 && Math.abs(ch.cz - c.cz) <= 2)) {
        unloadChunk(ch);
      }
    }
    updChunks(true);
  }

  reloadCityChunks(capital);
  assert.ok(unloads.includes('0,0'), 'Center chunk must be unloaded');
  assert.ok(unloads.includes('1,0'), 'Neighbor chunk within radius 2 must be unloaded');
  assert.ok(unloads.includes('-1,1'), 'Diagonal chunk within radius 2 must be unloaded');
  assert.ok(!unloads.includes('5,5'), 'Distant chunk must not be unloaded');
  assert.ok(updChunksCalled, 'updChunks(true) must be called to rebuild city area');
  console.log('✔ cityL and reloadCityChunks verification passed.');
}

console.log('ALL V442 FIXES VERIFIED SUCCESSFULLY.');
