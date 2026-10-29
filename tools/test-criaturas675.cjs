// v675: lobisomem como monstro (Criaturas673): nasce, persegue, ataca, morre e solta o Couro de Lobisomem.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'criaturas675';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 900 } }), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => window.PDS_SITE = 1);
    await page.goto('http://127.0.0.1:8671/game.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 240000 });
    await page.waitForTimeout(6000);
    await page.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player && player.m && window.Criaturas673 && Criaturas673.ready.lobisomem, null, { timeout: 240000 });
    await page.waitForTimeout(2000);
    const r = await page.evaluate(async () => {
      profile.creationPending91 = false; try { closeModal(); } catch (_) {} window.requestAnimationFrame = () => 0;
      player.x = 300; player.z = 60; player.hp = player.maxhp = 99999; let t = performance.now(); const step = n => { for (let i = 0; i < n; i++) { t += 16; frame(t); } };
      step(30); const e = spawnKind('lobisomem', 306, 64, 4, {}); const out = { kind: e && e.kind, name: e && e.name, hp: e && e.hp, a: MON_DEF.lobisomem && MON_DEF.lobisomem.a, shots: [] };
      const S2 = new THREE.Scene(); S2.background = new THREE.Color(0x8fa6b8); S2.add(new THREE.HemisphereLight(0xffffff, 0x445544, 1.1)); const dl = new THREE.DirectionalLight(0xffeedd, 1); dl.position.set(3, 6, 4); S2.add(dl); const C2 = new THREE.PerspectiveCamera(35, 1, .05, 100);
      const shoot = tag => { const r0 = e.m.root, par = r0.parent, pos = r0.position.clone(), rot = r0.rotation.y; par && par.remove(r0); r0.position.set(0, 0, 0); r0.rotation.y = .8; S2.add(r0); r0.updateMatrixWorld(true);
        C2.position.set(0, 1.5, 6.5); C2.lookAt(0, 1.3, 0); renderer.render(S2, C2); out.shots.push([tag, renderer.domElement.toDataURL('image/jpeg', .8)]); S2.remove(r0); r0.position.copy(pos); r0.rotation.y = rot; par && par.add(r0); };
      step(10); shoot('parado'); step(25); shoot('vindo'); step(25); shoot('perto'); step(30); shoot('ataque'); step(20); shoot('ataque2');
      out.dist = +Math.hypot(e.x - player.x, e.z - player.z).toFixed(1);
      hurtEnemy(e, 999999, player.x, player.z, { fromPlayer: true }); step(40); shoot('morte'); step(60);
      out.loot = (run.worldLoot353 || []).slice(-1).map(r => r.entries.map(x => x.name || x.type)).flat();
      return out;
    });
    r.shots.forEach(([t, b], i) => fs.writeFileSync(path.join(OUT, `${i}_${t}.jpg`), Buffer.from(b.split(',')[1], 'base64')));
    delete r.shots; console.log(JSON.stringify(r)); console.log('errors', errors.slice(0, 5));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
