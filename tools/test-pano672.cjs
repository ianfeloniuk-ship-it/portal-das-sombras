// v672: física de pano numa base do povo (civil_sobrevivente_f). Fotos andando/correndo com física ligada e desligada.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'pano672';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 800, height: 900 } }), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => window.PDS_SITE = 1);
    await page.goto('http://127.0.0.1:8671/game.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 240000 });
    await page.waitForTimeout(6000);
    await page.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player && player.m, null, { timeout: 240000 });
    await page.waitForTimeout(3000);
    const ids = process.argv.slice(3);
    await page.evaluate(() => { profile.creationPending91 = false; try { closeModal(); } catch (_) {} paused = true; window.requestAnimationFrame = () => 0; player.x = 300; player.z = 60; player.m.root.visible = false; });
    for (const id of ids) {
      const shots = await page.evaluate(async (id) => {
        const g = await new Promise(r => new THREE.GLTFLoader().load('tmp672/' + id + '.glb', r, undefined, () => r(null))); if (!g) return [];
        const m = Warrior127.create({ modelScene: g.scene, legacyLinearOutput: true, equip: {} }); const y = typeof terrH === 'function' ? terrH(300, 70) : 0;
        m.root.position.set(300, y, 70); scene.add(m.root); Pano672.on = true; const out = [];
        for (const [mv, sp] of [[0, 0], [1, 1.7], [2, 7]]) for (let k = 0; k < 70; k++) { Warrior127.animate(m, { move: mv, speed: sp, walking: mv === 1, sprint: mv > 1, atk: 0, dead: 0 }, k / 60, 1 / 60);
          if (k === 40 || k === 52 || k === 64) { const p = m.root.position; m.root.rotation.y = (k === 52 ? Math.PI / 2 : 0.6);
            camera.position.set(p.x + 0.3, p.y + 1.15, p.z + 3.3); camera.lookAt(p.x, p.y + 0.9, p.z); camera.updateMatrixWorld(); renderer.render(scene, camera); out.push(renderer.domElement.toDataURL('image/jpeg', .8)); } }
        scene.remove(m.root); return out;
      }, id);
      shots.forEach((b, i) => fs.writeFileSync(path.join(OUT, `${id}_${i}.jpg`), Buffer.from(b.split(',')[1], 'base64')));
    }
    console.log('stats', await page.evaluate(() => JSON.stringify(Pano672.stats) + ' err=' + (Pano672.err || '')));
    console.log('errors', errors.slice(0, 5));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
