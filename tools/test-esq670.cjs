// v670: golpe e magia da mão esquerda (clipes espelhados). Fotos do golpe direito x esquerdo em 3ª pessoa.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'esq670';
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
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player && player.m, null, { timeout: 240000 });
    await page.waitForTimeout(4000);
    const info = await page.evaluate(() => {
      profile.creationPending91 = false; try { closeModal(); } catch (_) {}
      paused = true; window.requestAnimationFrame = () => 0;
      player.x = 300; player.z = 60; player.face = 0;
      const sw = run.equip.w || { name: 'Espada', kind155: 'sword' };
      run.equip.w = sw; run.equip.wl = JSON.parse(JSON.stringify(sw)); try { refreshStats(); } catch (_) {}
      try { if (typeof makePlayer === 'function') {} } catch (_) {}
      return { esq: Warrior127.esq670 || null, wl: !!run.equip.wl, wep: sw.kind155 || sw.name };
    });
    console.log('info', JSON.stringify(info));
    // foto: câmera de lado/frente do jogador
    const shoot = async (tag, side) => {
      const shots = await page.evaluate(async (side) => {
        paused = false; const P = player; P.x = 30; P.z = 30; P.face = 0; P.atkCd = 0; P.atkT = 0; P.dead = false;
        let t = performance.now(); for (let k = 0; k < 20; k++) { t += 16; frame(t); }
        if (side === 'L') Maos662.leftAttack(false, true); else { Maos662.leftUntil = 0; attack(); }
        const out = [];
        for (let k = 1; k <= 24; k++) { t += 16; frame(t);
          if (k % 5 === 0) { const p = P.m.root.position; P.m.root.rotation.y = 0;
            camera.position.set(p.x + 0.2, p.y + 1.7, p.z + 3.6); camera.lookAt(p.x, p.y + 1.15, p.z); camera.updateMatrixWorld(); renderer.render(scene, camera);
            out.push(renderer.domElement.toDataURL('image/jpeg', .85)); } }
        paused = true; return out;
      }, side);
      shots.forEach((b64, i) => fs.writeFileSync(path.join(OUT, `${tag}_${i}.jpg`), Buffer.from(b64.split(',')[1], 'base64')));
    };
    await shoot('direita', 'R'); await shoot('esquerda', 'L');
    console.log('errors', errors.slice(0, 5));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
