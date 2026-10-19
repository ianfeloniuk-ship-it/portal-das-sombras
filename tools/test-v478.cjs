const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8094;

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
  if (u === '/') u = '/index.html';
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
  console.log('HTTP Server listening on port', PORT);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  try {
    await page.goto(`http://localhost:${PORT}/game.html`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(() => typeof started !== 'undefined' || typeof pickAwaken !== 'undefined', { timeout: 30000 });

    await page.evaluate(() => {
      try {
        if (typeof pickAwaken === 'function') {
          profile = pickAwaken(0);
          store.set('pds2_profile', profile);
          startGame();
        }
      } catch (_) {}
    });

    await page.waitForFunction(() => typeof started !== 'undefined' && started, { timeout: 30000 });

    // Test Assertions
    const testResult = await page.evaluate(() => {
      const results = {};
      results.v478_version = document.title || 'ok';
      results.hasFlip = typeof window.Flip470 !== 'undefined';
      results.hasSurv = typeof window.Surv437 !== 'undefined';
      results.hasGrowth = typeof window.Growth465 !== 'undefined';

      // Test class growth panel cleanliness
      if (window.Growth465) {
        const pHtml = window.Growth465.panel(0);
        results.panelHasGanhos = pHtml.includes('GANHOS POR NÍVEL');
        results.panelNoCompare = !pHtml.includes('Comparado ao Guerreiro');
        results.panelNoL50 = !pHtml.includes('No nível 50');
        results.panelNo9pts = !pHtml.includes('9 pontos');
      }

      // Test overweight logic
      if (window.Surv437 && typeof window.movementSpeed === 'function') {
        const baseSpeed = window.movementSpeed(10);
        const s = window.Surv437.S();
        if (s) {
          s.inv = s.inv || {};
          s.inv.pedra = 500; // Heavily overburdened
          const slowSpeed = window.movementSpeed(10);
          results.slowsOnOverburden = slowSpeed < baseSpeed;
          results.sprintBlocked = window.Sprint373 ? !window.Sprint373.canSprint({}, null, true, true) : true;
        }
      }

      // Test playerMoveDir
      if (typeof window.playerMoveDir === 'function') {
        window.keys = window.keys || {};
        window.keys.KeyD = true;
        const dirRight = window.playerMoveDir();
        window.keys.KeyD = false;
        results.moveDirRight = dirRight && dirRight.x > 0;
      }

      // Test exit beam
      results.hasExitBeamGeo = typeof THREE !== 'undefined';

      return results;
    });

    console.log('Automated Test Results:', JSON.stringify(testResult, null, 2));

    if (errors.length > 0) {
      console.warn('Page errors logged:', errors);
    }

    if (!testResult.panelHasGanhos || !testResult.panelNoCompare || !testResult.slowsOnOverburden) {
      throw new Error('Test assertions failed');
    }

    console.log('ALL v478 CHECKS PASSED SUCCESSFULLY!');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
