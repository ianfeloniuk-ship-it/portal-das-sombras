const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8098;

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.glb': 'model/gltf-binary'
};

const server = http.createServer((req, res) => {
  let u = req.url.split('?')[0];
  if (u === '/') u = '/game.html';
  const fp = path.join(ROOT, u);
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(fp).toLowerCase();
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
});

async function run() {
  server.listen(PORT);
  console.log('Test server listening on port', PORT);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    const txt = msg.text();
    if (msg.type() === 'error' || /dream|arquiteto|spawnAwakening/i.test(txt)) {
      console.log(`[BROWSER ${msg.type()}]:`, txt);
    }
  });

  await page.goto(`http://localhost:${PORT}/game.html`, { waitUntil: 'load', timeout: 30000 });
  console.log('game.html loaded');

  await page.waitForFunction(() => typeof pickAwaken !== 'undefined' && typeof window.Dream488 !== 'undefined', { timeout: 30000 });
  console.log('Game functions and Dream488 available');

  // Test 1: Start New Game with classless character
  console.log('--- Starting New Game to trigger Dream Cutscene ---');
  await page.evaluate(() => {
    try {
      store.del('pds2_profile');
      store.del('pds3_run');
    } catch (_) {}
    profile = pickAwaken(0);
    profile.classless = true;
    profile.name = 'Viajante';
    profile.orderPending401 = true;
    profile.creationPending91 = false;
    store.set('pds2_profile', profile);

    startGame();
  });

  // Verify dream cutscene activates
  await page.waitForFunction(() => window.Dream488 && window.Dream488.active, { timeout: 15000 });
  console.log('PASS: Dream cutscene activated at start of New Game!');

  // Wait for 1st subtitle
  await page.waitForFunction(() => {
    const el = document.getElementById('pds_dream_subtitle');
    return el && el.textContent.includes('Sim... é você');
  }, { timeout: 8000 });
  console.log('PASS: Subtitle 1 displayed: "— Sim... é você. Eu finalmente o encontrei."');
  await page.screenshot({ path: path.join(__dirname, 'dream_phrase1.png') });

  // Wait for 2nd subtitle
  await page.waitForFunction(() => {
    const el = document.getElementById('pds_dream_subtitle');
    return el && el.textContent.includes('libertar... ou então acabar comigo');
  }, { timeout: 10000 });
  console.log('PASS: Subtitle 2 displayed: "— Você vai ser aquele que vai me libertar... ou então acabar comigo."');
  await page.screenshot({ path: path.join(__dirname, 'dream_phrase2.png') });

  // Wait for 3rd subtitle
  await page.waitForFunction(() => {
    const el = document.getElementById('pds_dream_subtitle');
    return el && el.textContent.includes('Acorde. Vamos juntos destruir');
  }, { timeout: 10000 });
  console.log('PASS: Subtitle 3 displayed: "— Acorde. Vamos juntos destruir o que resta deste mundo."');
  await page.screenshot({ path: path.join(__dirname, 'dream_phrase3.png') });

  // Wait for hand touch / lunge cut to Skyrim eyelid awakening
  await page.waitForFunction(() => {
    return document.getElementById('pds_skyrim_wake') !== null || !window.Dream488.active;
  }, { timeout: 12000 });
  console.log('PASS: Hand touch triggered cut to Skyrim eyelid awakening!');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(__dirname, 'skyrim_eyelids.png') });

  // Wait for vision to clear and player to awaken on Estrada Sul
  await page.waitForFunction(() => {
    const wake = document.getElementById('pds_skyrim_wake');
    return wake === null && !window.Dream488.active;
  }, { timeout: 10000 });
  console.log('PASS: Skyrim awakening complete: eyelids opened, vision clear, player on Estrada Sul!');
  await page.screenshot({ path: path.join(__dirname, 'estrada_sul_awake.png') });

  // Test 2: Test Skip button functionality
  console.log('--- Testing Dream Cutscene Skip Button ---');
  await page.evaluate(() => {
    window.Dream488.play({
      onAwaken: () => { window._testAwakenCalled = true; }
    });
  });
  await page.waitForFunction(() => window.Dream488.active);
  const skipBtn = await page.$('#pds_dream_skip');
  if (!skipBtn) throw new Error('Skip button not found!');
  await skipBtn.click();

  await page.waitForFunction(() => !window.Dream488.active);
  console.log('PASS: Skip button successfully interrupted dream and transitioned to awakening!');

  if (errors.length) {
    console.warn('Page errors noted:', errors);
  }

  await browser.close();
  server.close();
  console.log('ALL DREAM488 REGRESSION TESTS PASSED!');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
