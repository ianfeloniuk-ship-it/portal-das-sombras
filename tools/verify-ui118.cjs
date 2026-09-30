const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('game.html', 'utf8');
function extract(name) {
  const start = source.indexOf(`function ${name}(`);
  assert(start >= 0, `missing ${name}`);
  const brace = source.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`unterminated ${name}`);
}

const nodes = { modal: {hidden: true}, mb: {scrollTop: 0, innerHTML: ''}, mt: {textContent: ''}, mx: {hidden: false}, dlg: {hidden: true}, modalNotice95: {hidden: true}, mback118: {hidden: true}, dead: {hidden: true} };
const ctx = {
  nodes,
  profile: {creationPending91: false}, started: true, modalOpen: false, paused: false, modalRoute118: '', view: null, player: {dead: false},
  CHAR_UI118: {route: 'status', scroll: {}, details: {}, filters: {}},
  MODAL_NAV118: {current: null, back: [], returning: false, restore: null, serial: 0},
  $: id => nodes[id], toggleGameMenu95() {}, requestAnimationFrame: fn => fn(),
  row: () => '', btn: () => '', safeText: String, fmt: String,
  audioSettings: () => '', readySoundSettings: () => '', localStorage: {getItem: () => null},
  narratorSettings105: () => '', movementSettings: () => '',
  AU: {on: true}, ENV: {lite: false}, CFG: {btn: 1}, touch: false, saveRun() {}, applyCfg() {},
  KEYACT: [['attack', 'Atacar', 'Space']], keyOf: () => 'Space', keyLabel: String, bindWait: null,
  document: {createElement: () => ({})}, console,
};
vm.createContext(ctx);
for (const name of ['modalParent118', 'modalBack118', 'enterModal118', 'rememberCharacter118', 'openModal', 'closeModal', 'rerender', 'cfgView', 'controlsView', 'keysView']) vm.runInContext(extract(name), ctx);
vm.runInContext(`
function skillsView(){ view=skillsView; openModal('PERSONAGEM','skills','skills') }
function loadoutView(slot){ view=()=>loadoutView(slot); openModal('PERSONAGEM','loadout:'+slot,'loadout:'+slot) }
`, ctx);

ctx.cfgView();
assert.equal(ctx.nodes.mt.textContent, 'CONFIGURAÇÕES');
ctx.controlsView();
ctx.keysView();
assert.equal(ctx.MODAL_NAV118.back.length, 2, 'Config → Controls → Keys has two parents');
ctx.modalBack118();
assert.equal(ctx.nodes.mt.textContent, 'CONTROLES DE PC');
ctx.modalBack118();
assert.equal(ctx.nodes.mt.textContent, 'CONFIGURAÇÕES');
assert.equal(ctx.MODAL_NAV118.back.length, 0);
ctx.closeModal();

ctx.run = {spts: 3};
ctx.skillsView();
ctx.nodes.mb.scrollTop = 240;
ctx.CHAR_UI118.details.fire = true;
ctx.CHAR_UI118.filters.skillClass111 = 'all';
ctx.loadoutView(0);
assert.equal(ctx.MODAL_NAV118.back.length, 1);
ctx.modalBack118();
assert.equal(ctx.nodes.mt.textContent, 'PERSONAGEM');
assert.equal(ctx.nodes.mb.innerHTML, 'skills');
assert.equal(ctx.nodes.mb.scrollTop, 240, 'return restores skills scroll');
assert.equal(ctx.CHAR_UI118.details.fire, true);
assert.equal(ctx.CHAR_UI118.filters.skillClass111, 'all');
ctx.run.spts = 1;
ctx.rerender();
assert.equal(ctx.nodes.mb.innerHTML, 'skills', 'rerender regenerates the current view');
ctx.closeModal();
assert.equal(ctx.MODAL_NAV118.back.length, 0);
assert.equal(ctx.MODAL_NAV118.current, null);
assert.equal(ctx.modalOpen, false);

ctx.profile.creationPending91 = true;
ctx.nodes.mback118.hidden = false;
ctx.modalBack118();
assert.equal(ctx.nodes.mback118.hidden, false, 'creation guard does not mutate navigation');
console.log('PASS modal stack, back depth, regenerated views, character state, close reset and creation guard');
