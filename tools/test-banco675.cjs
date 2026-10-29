// v675: criaturas rigadas com banco próprio (Warrior127 + banco Mixamo). Uso: node test-banco675.cjs OUT id:banco:arquivo:clipeAtaque ...
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2]; const jobs = process.argv.slice(3).map(s => s.split(':'));
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
    await page.evaluate(() => { profile.creationPending91 = false; try { closeModal(); } catch (_) {} paused = true; window.requestAnimationFrame = () => 0; });
    for (const [id, bank, bankFile, atk] of jobs) {
      const shots = await page.evaluate(async ([id, bank, bankFile, atk]) => {
        await Warrior127.loadBank486(bank, bankFile);
        const g = await new Promise(r => new THREE.GLTFLoader().load('tmp672/' + id + '.glb', r, undefined, () => r(null))); if (!g) return [];
        const m = Warrior127.create({ modelScene: g.scene, legacyLinearOutput: true, equip: {} });
        const S2 = new THREE.Scene(); S2.background = new THREE.Color(0x8fa6b8); S2.add(new THREE.HemisphereLight(0xffffff, 0x445544, 1.1)); const dl = new THREE.DirectionalLight(0xffeedd, 1); dl.position.set(3, 6, 4); S2.add(dl); S2.add(m.root);
        const C2 = new THREE.PerspectiveCamera(35, 1, .05, 100); const out = [];
        for (const [mv, clip] of [[0, null], [1, null], [2, null], [0, atk]]) { m.bank486_x = 0;
          for (let k = 0; k < 50; k++) { Warrior127.animate(m, { move: mv, speed: mv ? (mv > 1 ? 6 : 1.7) : 0, walking: mv === 1, sprint: mv > 1, atk: 0, dead: 0, bank486: bank, clip486: clip, once486: !!clip }, k / 60, 1 / 60);
            if (k === 38) { m.root.rotation.y = .7; m.root.updateMatrixWorld(true); C2.position.set(0, 1.4, 6); C2.lookAt(0, 1.1, 0); renderer.render(S2, C2); out.push(renderer.domElement.toDataURL('image/jpeg', .8)); } } }
        S2.remove(m.root); return out;
      }, [id, bank, bankFile, atk]);
      shots.forEach((b, i) => fs.writeFileSync(path.join(OUT, `${id}_${i}.jpg`), Buffer.from(b.split(',')[1], 'base64')));
    }
    console.log('ok errors', errors.slice(0, 3));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
