// v687: vento e nuvens. Fotos de dia, chuva e noite, olhando o céu e o campo.
const fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'vento687', PORT = process.argv[3] || '8803';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 650 } }), errors = [];
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { const t = m.text(); if (/687|shader|ERROR/i.test(t)) errors.push(t.slice(0, 400)) });
    await page.addInitScript(() => window.PDS_SITE = 1);
    await page.goto('http://127.0.0.1:' + PORT + '/game.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 240000 });
    await page.waitForTimeout(6000);
    await page.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player && player.m, null, { timeout: 240000 });
    await page.waitForTimeout(4000);
    await page.evaluate(() => { profile.creationPending91 = false; try { closeModal(); } catch (_) {} });
    const shots = [
      ['vermelho', { night: 0, rain: 0, x: 330, z: 110, pitch: .05, red: 1 }],
      ['dia-ceu', { night: 0, rain: 0, x: 330, z: 110, pitch: .35 }],
      ['dia-campo', { night: 0, rain: 0, x: 330, z: 110, pitch: .05 }],
      ['chuva', { night: 0, rain: 1, x: 330, z: 110, pitch: .25 }],
      ['noite', { night: 1, rain: 0, x: 330, z: 110, pitch: .35 }],
      ['deserto', { night: 0, rain: 0, desert: 1, pitch: .1 }],
    ];
    for (const [name, o] of shots) {
      await page.evaluate((o) => {
        if (o.desert) { for (let r = 200; r < 4000; r += 150) { let f = false; for (let a = 0; a < 6.28; a += .4) { const x = Math.cos(a) * r, z = Math.sin(a) * r; if (biomeAt(x, z) === 'deserto') { player.x = x; player.z = z; f = true; break } } if (f) break } }
        else { player.x = o.x; player.z = o.z }
        player.y = terrH(player.x, player.z);
        const p = o.night ? (NIGHT0_377 + NIGHT1_377) / 2 : .3; dayT = p * DAYLEN;
        if (typeof WX !== 'undefined') WX.type = o.rain ? 'rain' : 'clear'; if (window.RAIN626) RAIN626.k = o.rain ? 1 : 0;
        if (L.dn) L.dn.w = o.rain ? .9 : 0;
        window.__pitch = o.pitch; Vento687.parts.material.visible = !o.hide; if (o.red) { window.__pm = Vento687.parts.material; Vento687.parts.material = window.__pm; } else if (window.__pm) Vento687.parts.material = window.__pm;
      }, o);
      for (let i = 0; i < 50; i++) await page.evaluate(() => { try { const c = window.CAM || null; } catch (_) {} });
      await page.waitForTimeout(5000);
      await page.evaluate(() => { try { camera.rotation.x = window.__pitch; camera.updateMatrixWorld() } catch (_) {} });
      await page.screenshot({ path: `${OUT}/${name}.png` });
    }
    const st = await page.evaluate(() => JSON.stringify({s0: Vento687.S.slice(0,3).map(s=>[s.x|0,s.y|0,s.z|0,s.k]), pl:[player.x|0,player.y|0,player.z|0], mat: (()=>{const m=new THREE.Matrix4();Vento687.parts.getMatrixAt(0,m);return m.elements.map(v=>+v.toFixed(2))})(), vis: Vento687.parts.visible, prog: renderer.info.programs.length, v: Vento687.stats, err: Vento687.err || '', gust: ENV.gust.value, sky: Vento687.sky.visible, pano: Pano672.err || '' }));
    console.log(st); console.log('errors', JSON.stringify(errors.slice(0, 5)));
  } finally { await browser.close(); }
})();
