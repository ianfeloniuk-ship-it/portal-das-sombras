// v673: lobisomem com o banco de animações de criatura (models/anim-lobisomem673.glb, Mixamo "Mutant").
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'lobi673', GLB = process.argv[3] || 'tmp672/lobi_patriarca_fera.glb';
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
    const shots = await page.evaluate(async (GLB) => {
      profile.creationPending91 = false; try { closeModal(); } catch (_) {} paused = true; window.requestAnimationFrame = () => 0;
      player.x = 300; player.z = 60; player.m.root.visible = false;
      await Warrior127.loadBank486('lobo', 'models/anim-lobisomem673.glb?t=' + performance.now());
      const g = await new Promise(r => new THREE.GLTFLoader().load(GLB + '?t=' + performance.now(), r, undefined, () => r(null)));
      const m = Warrior127.create({ modelScene: g.scene, legacyLinearOutput: true, equip: {} }); const y = typeof terrH === 'function' ? terrH(300, 70) : 0;
      m.root.position.set(300, y, 70); scene.add(m.root); const out = [];
      const runs = [['idle', 0, null], ['walk', 1, null], ['run', 2, null], ['garra', 0, 'garra'], ['rugido', 0, 'rugido']];
      for (const [tag, mv, clip] of runs) { m.bank486_lobo && (m.bank486_lobo.cur = null);
        for (let k = 0; k < 75; k++) { Warrior127.animate(m, { move: mv, speed: mv ? (mv > 1 ? 7 : 1.7) : 0, walking: mv === 1, sprint: mv > 1, atk: 0, dead: 0, bank486: 'lobo', clip486: clip, once486: !!clip }, k / 60, 1 / 60);
          if (k === 30 || k === 50 || k === 70) { const p = m.root.position; m.root.rotation.y = 0.9;
            camera.position.set(p.x + 0.3, p.y + 1.3, p.z + 3.8); camera.lookAt(p.x, p.y + 1.0, p.z); camera.updateMatrixWorld(); renderer.render(scene, camera); out.push([tag, renderer.domElement.toDataURL('image/jpeg', .8)]); } } }
      return out;
    }, GLB);
    shots.forEach(([t, b], i) => fs.writeFileSync(path.join(OUT, `${String(i).padStart(2, '0')}_${t}.jpg`), Buffer.from(b.split(',')[1], 'base64')));
    console.log('fotos', shots.length, 'errors', errors.slice(0, 3));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
