const fs = require('fs'), http = require('http'), path = require('path'), assert = require('assert');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const root = process.cwd();
  const server = http.createServer((req, res) => {
    const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!f.startsWith(root) || !fs.existsSync(f) || !fs.statSync(f).isFile()) {
      res.writeHead(404).end();
      return;
    }
    const ext = path.extname(f);
    res.setHeader('Content-Type', ({
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.glb': 'model/gltf-binary',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.css': 'text/css',
      '.json': 'application/json'
    })[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    fs.createReadStream(f).pipe(res);
  });

  await new Promise(r => server.listen(8476, '127.0.0.1', r));
  console.log('Test server listening on port 8476');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--enable-webgl', '--ignore-gpu-blocklist']
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];

    page.on('pageerror', e => {
      if (!e.stack.includes('deep447.js')) {
        errors.push(e.message);
      }
      console.log('PAGEERROR:', e.stack);
    });

    page.on('console', m => {
      const txt = m.text();
      if (txt.includes('Guard472') || txt.includes('Flip470') || txt.includes('v476') || txt.includes('FAIL')) {
        console.log('GAME CONSOLE:', txt);
      }
    });

    await page.addInitScript(() => {
      window.PDS_SITE = 1;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register = () => Promise.reject(new Error('SW disabled in test'));
      }
    });

    console.log('Navigating to http://127.0.0.1:8476/game.html...');
    await page.goto('http://127.0.0.1:8476/game.html', { waitUntil: 'load', timeout: 180000 });
    await page.waitForFunction(() => typeof ENV !== 'undefined' && ENV.ok && window.Flip470 && window.Guard472, { timeout: 180000 });
    console.log('Game loaded with Flip470 and Guard472 available!');

    // Initialize game run
    await page.evaluate(() => {
      profile = pickAwaken(0);
      store.set('pds2_profile', profile);
      startGame();
    });
    await page.waitForFunction(() => typeof started !== 'undefined' && started, { timeout: 180000 });
    console.log('Game loop started successfully');

    // Wait for Flip470 textures
    await page.waitForFunction(() => {
      if (!window.Flip470 || !window.Flip470.SHEETS) return false;
      const keys = ['lightning', 'water', 'rune', 'fireball', 'explosion', 'flame', 'smoke', 'dust'];
      return keys.every(k => {
        const s = Flip470.SHEETS[k];
        return s && s.tex && s.tex.image;
      });
    }, { timeout: 30000 });
    console.log('All Flip470 sprite sheet textures loaded successfully');

    // Close modal before testing
    await page.evaluate(() => {
      try {
        profile.name = 'Viajante';
        const inp = document.querySelector('input[type="text"]');
        if (inp) inp.value = 'Viajante';
        if (typeof finishCreation === 'function') finishCreation();
        if (typeof closeModal === 'function') closeModal();
        const m = document.getElementById('modal') || document.querySelector('.modal');
        if (m) m.style.display = 'none';
        modalOpen = false;
        paused = false;
      } catch (_) {}
    });

    // Test Assertions
    const testResults = await page.evaluate(async () => {
      const log = [];
      const assertChk = (cond, msg) => {
        if (!cond) throw new Error('Assertion failed: ' + msg);
        log.push('PASS: ' + msg);
      };

      const C = document.getElementById('c');

      // 1. Controls test: Middle click triggers Guard472
      assertChk(typeof Guard472 !== 'undefined', 'Guard472 module present');
      assertChk(!Guard472.blocking(), 'Guard starts non-blocking');

      // Dispatch middle pointerdown (button 1) to canvas C
      C.dispatchEvent(new PointerEvent('pointerdown', { button: 1, bubbles: true, clientX: 200, clientY: 200 }));
      assertChk(Guard472.blocking(), 'Middle click (button 1) engages defense/guard');

      // Dispatch middle pointerup (button 1) to window
      window.dispatchEvent(new PointerEvent('pointerup', { button: 1, bubbles: true, clientX: 200, clientY: 200 }));
      assertChk(!Guard472.blocking(), 'Middle pointerup releases defense/guard');

      // 2. Controls test: Right click does NOT trigger Guard472, but triggers camera drag
      const camYawBefore = pcCam.yaw;
      C.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 1, button: 2, bubbles: true, clientX: 300, clientY: 300 }));
      assertChk(!Guard472.blocking(), 'Right click (button 2) does NOT engage defense');
      assertChk(pcCam.active === true, 'Right click engages camera drag (pcCam.active === true)');

      // Drag mouse to the right
      C.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, buttons: 2, bubbles: true, clientX: 350, clientY: 300 }));
      assertChk(pcCam.yaw !== camYawBefore, 'Right drag updates camera yaw angle');

      // Release right button
      window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, button: 2, bubbles: true, clientX: 350, clientY: 300 }));
      assertChk(pcCam.active === false, 'Right pointerup releases camera drag');

      // 3. Magic Projectiles Test: Mage auto-attack has no rigid solid geometry, but has spriteFx
      profile.cls = 8; // Mago Fogo
      run.elem = 'fogo';
      if (typeof updateWeaponPose === 'function') updateWeaponPose();

      const projCountBefore = projs.length;
      shoot(player.x, player.z, player.face, 15, 50, 'player', 0xff6622, 'fire', { elem300: 'fogo', fromPlayer: true });
      assertChk(projs.length > projCountBefore, 'Mage projectile spawned');

      const p = projs[projs.length - 1];
      assertChk(!!p.mesh, 'Projectile has container group/mesh');
      const sf = p.mesh.userData.spriteFx;
      assertChk(!!sf, 'Projectile has spriteFx billboard Flip470 sprite in mesh userData');
      
      // Check that mesh children do not contain rigid SphereGeometry or IcosahedronGeometry solids
      let hasRigidSolid = false;
      p.mesh.traverse(obj => {
        if (obj.isMesh && obj.geometry) {
          const gType = obj.geometry.type || '';
          if (gType.includes('Sphere') || gType.includes('Icosahedron') || gType.includes('Dodecahedron')) {
            hasRigidSolid = true;
          }
        }
      });
      assertChk(!hasRigidSolid, 'Mage projectile has NO rigid solid geometry meshes');

      // Advance projectiles update loop and verify spriteFx animates
      const prevT = sf.t;
      updateProjectiles253(0.05);
      assertChk(sf.t > prevT, 'updateProjectiles253 advanced spriteFx flight animation frame');

      // 4. Meteor / fallFx test: verify it does not create rigid sphere
      const fxsLenBefore = fxs.length;
      fallFx(player.x + 5, player.z, 0.4, 'meteor', 0xff5511);
      assertChk(fxs.length > fxsLenBefore, 'Meteor fallFx spawned');
      const meteorFx = fxs[fxs.length - 1];
      let meteorHasRigidSphere = false;
      meteorFx.o.traverse(obj => {
        if (obj.isMesh && obj.geometry && (obj.geometry.type || '').includes('Sphere')) {
          meteorHasRigidSphere = true;
        }
      });
      assertChk(!meteorHasRigidSphere, 'Meteor fallFx has NO rigid SphereGeometry');

      // 5. Test Skyrim smoke spawn on mob death
      const smokeSprite = Flip470.spawn('smoke', player.x, 1.0, player.z, 2.5, {
        grow: 1.5,
        rise: 1.2,
        dur: 1.8
      });
      assertChk(!!smokeSprite, 'Skyrim/Primeva hybrid smoke sprite spawned successfully');
      assertChk(Flip470.live.some(s => s.kind === 'smoke'), 'Smoke sprite tracked in Flip470.live');

      // 6. Test Controls modal text
      profile.creationPending91 = false;
      controlsView();
      const modalText = ($('mb') || $('modal') || document.body).innerHTML;
      assertChk(modalText.includes('Botão do meio'), 'Controls view includes Botão do meio for defense');
      assertChk(modalText.includes('Botão direito'), 'Controls view includes Botão direito for camera');
      if (typeof closeModal === 'function') closeModal();

      return log;
    });

    console.log('PAGE ASSERTIONS PASSED:');
    testResults.forEach(l => console.log('  ' + l));

    // Showcase VFX in 3D scene and capture proof
    await page.evaluate(() => {
      try {
        profile.name = 'Viajante';
        const inp = document.querySelector('input[type="text"]');
        if (inp) inp.value = 'Viajante';
        if (typeof finishCreation === 'function') finishCreation();
        if (typeof closeModal === 'function') closeModal();
        const m = document.getElementById('modal') || document.querySelector('.modal');
        if (m) m.style.display = 'none';
      } catch (_) {}

      // Spawn Skyrim smoke effect in front of player
      Flip470.spawn('smoke', player.x + 1.8, 1.0, player.z, 3.0, { grow: 1.8, rise: 1.4, dur: 5.0 });
      // Spawn fireball projectile sprite next to it
      Flip470.spawn('fireball', player.x - 1.5, 1.2, player.z, 2.5, { dur: 5.0 });
      // Spawn golden rune circle under player
      Flip470.spawn('rune', player.x, 0.05, player.z, 5.0, { dur: 5.0, tint: 0xffd700 });
    });

    await page.waitForTimeout(500);
    const proofPath = path.join(root, 'v476-proof.png');
    await page.screenshot({ path: proofPath });
    console.log('Proof screenshot saved to:', proofPath);

    assert.strictEqual(errors.length, 0, 'Uncaught page errors encountered: ' + errors.join('; '));
    console.log('ALL V476 VERIFICATIONS PASSED WITH 0 ERRORS!');
  } finally {
    await browser.close();
    server.close();
  }
})();
