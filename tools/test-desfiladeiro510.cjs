const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8099;

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.glb': 'model/gltf-binary'
};

const server = http.createServer((req, res) => {
  let u = req.url.split('?')[0];
  if (u === '/') u = '/game.html';
  const fp = path.join(ROOT, u);
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404);
    res.end('Not found: ' + u);
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

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 }
  });

  const errors = [];
  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('[PAGE ERROR]:', err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[CONSOLE ${msg.type()}]:`, msg.text());
    }
  });

  await page.goto(`http://localhost:${PORT}/game.html`, { waitUntil: 'load', timeout: 35000 });
  console.log('game.html loaded successfully');

  await page.waitForFunction(() => typeof startGame !== 'undefined' && typeof window.Desfiladeiro510 !== 'undefined', { timeout: 30000 });
  console.log('Desfiladeiro510 is loaded in browser');

  // Start game and place player at Estrada Sul awakening spot
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

  // Skip cutscene if dream is active to land directly on Estrada Sul
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    if (window.Dream488 && window.Dream488.active) {
      window.Dream488.skip();
    }
  });

  // Ensure all dream, awakening and intro fade overlays are completely cleared
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    // Remove all faders, wake overlays and dream artifacts
    document.querySelectorAll('div, section').forEach(el => {
      if (el.id && (el.id.includes('fade') || el.id.includes('wake') || el.id.includes('dream') || el.id.includes('intro'))) {
        el.remove();
      }
    });
    document.body.classList.remove('story401');

    const px = 1.8, pz = 109.4;
    if (typeof player !== 'undefined' && player) {
      player.x = px;
      player.z = pz;
      player.hp = 99999;
      player.dead = false;
      player.iT = 99999;
      player.face = 0;
      if (player.m && player.m.root) {
        player.m.root.position.set(px, typeof gy === 'function' ? gy(px, pz) : 0, pz);
        player.m.root.visible = true;
      }
    }
    if (typeof cam !== 'undefined') {
      cam.x = px;
      cam.z = pz;
    }
    if (typeof updChunks === 'function') updChunks(true);

    if (window.Desfiladeiro510) {
      window.Desfiladeiro510.ensure();
    }
  });

  // Wait for Desfiladeiro510 to finish async loading and mounting
  console.log('Waiting for Desfiladeiro510 mounting...');
  await page.waitForFunction(() => window.Desfiladeiro510 && window.Desfiladeiro510.mounted === true, { timeout: 30000 });
  console.log('Desfiladeiro510 mounted successfully!');

  // Verify player position and Desfiladeiro mounting
  const state = await page.evaluate(() => {
    const p = player;
    const des = window.Desfiladeiro510;
    return {
      px: p ? p.x : 0,
      pz: p ? p.z : 0,
      mode: L ? L.mode : '',
      desMounted: des ? des.mounted : false,
      hasGrp: !!(des && des.grp && des.grp.children.length > 0),
      childCount: des && des.grp ? des.grp.children.length : 0
    };
  });
  console.log('World State:', JSON.stringify(state));

  // Allow 3 seconds for intro fade CSS transition to expire completely
  await page.waitForTimeout(3000);

  // Helper to render active frame
  const renderFrames = async (count = 15) => {
    await page.evaluate((n) => {
      // Clear any dynamically created fade overlays
      document.querySelectorAll('#pds_intro_fade, #pds_skyrim_wake, #pds_dream_overlay').forEach(el => el.remove());
      if (typeof dayT !== 'undefined') dayT = 600;
      if (typeof updDayNight === 'function') updDayNight(0);
      for (let i = 0; i < n; i++) {
        if (typeof camUpdate === 'function') camUpdate(0.016);
        if (typeof frame === 'function') frame(performance.now() + i * 16);
      }
    }, count);
  };

  await renderFrames(30);

  const outDir = path.join(ROOT, 'docs', 'previa-desfiladeiro');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const placePlayer = async (px = 1.8, pz = 109.4) => {
    await page.evaluate(({ px, pz }) => {
      document.querySelectorAll('#pds_intro_fade, #pds_skyrim_wake, #pds_dream_overlay').forEach(el => el.remove());
      if (typeof dayT !== 'undefined') dayT = 600;
      if (typeof updDayNight === 'function') updDayNight(0);
      if (typeof player !== 'undefined' && player) {
        player.x = px;
        player.z = pz;
        player.vx = 0;
        player.vz = 0;
        player.hp = 99999;
        player.dead = false;
        player.iT = 99999;
        if (player.m && player.m.root) {
          player.m.root.position.set(px, typeof gy === 'function' ? gy(px, pz) : 0, pz);
          player.m.root.visible = true;
        }
      }
      if (typeof cam !== 'undefined') {
        cam.x = px;
        cam.z = pz;
      }
      if (typeof W377 !== 'undefined' && W377.releaseAll) W377.releaseAll();
    }, { px, pz });
  };

  // 1. Vista Shot: olho do Viajante olhando para o Norte (Portão Sul de Aster emoldurado pela garganta)
  await placePlayer(1.8, 109.4);
  await page.evaluate(() => {
    // Congelar camUpdate temporariamente para enquadramento cinematográfico exato da Vista
    window._prevCamUpdate = window.camUpdate;
    window.camUpdate = () => {};
    camera.position.set(1.8, 2.4, 114);
    camera.lookAt(1.8, 4.2, 75);
  });
  await renderFrames(10);
  await page.evaluate(() => {
    camera.position.set(1.8, 2.4, 114);
    camera.lookAt(1.8, 4.2, 75);
    if (typeof renderer !== 'undefined' && typeof scene !== 'undefined') {
      renderer.render(scene, camera);
    }
    // Restaurar camUpdate para os próximos planos
    if (window._prevCamUpdate) window.camUpdate = window._prevCamUpdate;
  });
  await page.waitForTimeout(400);
  const shot1 = path.join(outDir, '01-vista-portao-aster.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved Screenshot 1 (Vista Shot):', shot1);

  // 2. Olhando para a Carroça Tombada e Falésia Oeste (-45°)
  await placePlayer(1.8, 109.4);
  await page.evaluate(() => {
    pcCam.yaw = -0.78;
    pcCam.pitch = 0.12;
    pcCam.distance = 4.2;
    if (typeof camUpdate === 'function') camUpdate(0.016);
  });
  await renderFrames(12);
  await page.waitForTimeout(400);
  const shot2 = path.join(outDir, '02-carroca-falesia-oeste.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved Screenshot 2 (Carroça e Falésia Oeste):', shot2);

  // 3. Olhando para a Falésia Leste e Pinheiros Gigantes (+45°)
  await placePlayer(1.8, 109.4);
  await page.evaluate(() => {
    pcCam.yaw = 0.78;
    pcCam.pitch = 0.12;
    pcCam.distance = 4.2;
    if (typeof camUpdate === 'function') camUpdate(0.016);
  });
  await renderFrames(12);
  await page.waitForTimeout(400);
  const shot3 = path.join(outDir, '03-falesia-leste-pinheiros.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved Screenshot 3 (Falésia Leste e Pinheiros):', shot3);

  // 4. Olhando para o Sul (180° - a garganta sinuosa que se aprofunda)
  await placePlayer(1.8, 109.4);
  await page.evaluate(() => {
    pcCam.yaw = 3.14159;
    pcCam.pitch = 0.10;
    pcCam.distance = 4.2;
    if (typeof camUpdate === 'function') camUpdate(0.016);
  });
  await renderFrames(12);
  await page.waitForTimeout(400);
  const shot4 = path.join(outDir, '04-garganta-sul.png');
  await page.screenshot({ path: shot4 });
  console.log('Saved Screenshot 4 (Garganta ao Sul):', shot4);

  // 5. Visão Aérea / Panorâmica do Desfiladeiro (sem sobrescrever com camUpdate)
  await placePlayer(1.8, 109.4);
  await page.evaluate(() => {
    camera.position.set(0, 32, 195);
    camera.lookAt(0, 6, 95);
    if (typeof renderer !== 'undefined' && typeof scene !== 'undefined') {
      renderer.render(scene, camera);
    }
  });
  await page.waitForTimeout(400);
  const shot5 = path.join(outDir, '05-visao-aerea-desfiladeiro.png');
  await page.screenshot({ path: shot5 });
  console.log('Saved Screenshot 5 (Visão Panorâmica):', shot5);

  console.log('All screenshots completed successfully!');
  await browser.close();
  server.close();

  if (errors.length > 0) {
    console.error('Errors encountered during test:', errors);
    process.exit(1);
  } else {
    console.log('TEST PASSED WITH ZERO ERRORS!');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
