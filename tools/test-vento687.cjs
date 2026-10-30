// v687: vento e nuvens. Fotos de dia, chuva e noite, olhando o céu e o campo.
const fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'vento687', PORT = process.argv[3] || '8803';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 650 } }), errors = [];
    page.on('pageerror', e => console.log('PE', e.message.slice(0,90), String(e.stack||'').split(String.fromCharCode(10)).slice(1,7).join(' | ').slice(0,700)) || errors.push(e.message + ' @ ' + String(e.stack || '').split(String.fromCharCode(10)).slice(1, 3).join(' | '))); page.on('console', m => { const t = m.text(); if (/687|shader|ERROR/i.test(t)) errors.push(t.slice(0, 400)) });
    await page.addInitScript(() => window.PDS_SITE = 1);
    await page.goto('http://127.0.0.1:' + PORT + '/game.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 240000 });
    await page.waitForTimeout(6000);
    await page.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player && player.m, null, { timeout: 240000 });
    await page.waitForTimeout(4000);
    await page.evaluate(() => { profile.creationPending91 = false; try { closeModal(); } catch (_) {} });
    await page.evaluate(() => { const r = renderer.renderBufferDirect; window.__seen = {}; renderer.renderBufferDirect = function (c, sc, g, m, o, gr) { try { return r.apply(this, arguments) } catch (e) { const k = (o.name || o.type) + '/' + m.type + '/' + (m.name||''); if (!__seen[k]) { __seen[k] = 1; console.log('BAD ' + k + ' ' + e.message.slice(25, 45) + ' par=' + (o.parent && o.parent.name) + ' U=' + (()=>{const u=renderer.properties.get(m).uniforms||{};return Object.keys(u).filter(k=>/\d{3}|^u[A-Z]/.test(k)).map(k=>k+':'+(u[k]&&u[k].value&&u[k].value.constructor?u[k].value.constructor.name:typeof (u[k]&&u[k].value))).join(',')})() + ' SRC=' + String(m.onBeforeCompile).slice(0,160)) } throw e } } });
    page.on('console', m => { if (m.text().startsWith('BAD')) console.log(m.text()) });
    const shots = [].concat([
      ['manha-neblina', { night: 0, rain: 0, x: 330, z: 110, pitch: .08, dawn: 1 }],
      ['lua-cheia', { night: 1, day: 27, moon: 1, x: 330, z: 110 }],
      ['lua-quarto', { night: 1, day: 7, moon: 1, x: 330, z: 110 }],
      ['dia-ceu', { night: 0, rain: 0, x: 330, z: 110, pitch: .35 }],
      ['dia-campo', { night: 0, rain: 0, x: 330, z: 110, pitch: .05 }],
      ['chuva', { night: 0, rain: 1, x: 330, z: 110, pitch: .25 }],
      ['noite', { night: 1, rain: 0, x: 330, z: 110, pitch: .35 }],
      ['deserto', { night: 0, rain: 0, desert: 1, pitch: .1 }],
    ]).slice(0, 1);
    for (const [name, o] of shots) {
      await page.evaluate((o) => {
        if (o.desert) { for (let r = 200; r < 4000; r += 150) { let f = false; for (let a = 0; a < 6.28; a += .4) { const x = Math.cos(a) * r, z = Math.sin(a) * r; if (biomeAt(x, z) === 'deserto') { player.x = x; player.z = z; f = true; break } } if (f) break } }
        else { player.x = o.x; player.z = o.z }
        player.y = terrH(player.x, player.z);
        const p = o.dawn ? .07 : o.night ? (NIGHT0_377 + NIGHT1_377) / 2 : .3; dayT = ((o.day || 0) + p) * DAYLEN; window.__moon = o.moon;
        if (typeof WX !== 'undefined') WX.type = o.rain ? 'rain' : 'clear'; if (window.RAIN626) RAIN626.k = o.rain ? 1 : 0;
        if (L.dn) L.dn.w = o.rain ? .9 : 0;
        window.__pitch = o.pitch; Vento687.parts.material.visible = !o.hide; if (o.red) { window.__pm = Vento687.parts.material; Vento687.parts.material = window.__pm; } else if (window.__pm) Vento687.parts.material = window.__pm;
      }, o);
      for (let i = 0; i < 50; i++) await page.evaluate(() => { try { const c = window.CAM || null; } catch (_) {} });
      await page.waitForTimeout(5000);
      if (o.dawn) await page.evaluate(() => { const d = camera.getWorldDirection(new THREE.Vector3()); Vento687.FB.forEach((f, i) => { const r = 10 + (i % 6) * 6, s = ((i * 7) % 11 - 5) * 3; f.x = player.x + d.x * r - d.z * s; f.z = player.z + d.z * r + d.x * s; f.y = terrH(f.x, f.z) + 1.5; f.life = 60; }); }); await page.waitForTimeout(500);
      await page.evaluate(() => { if (window.__moon) { const m = new THREE.Vector3(.55, .42, -.72).normalize(); camera.lookAt(camera.position.clone().add(m)); camera.fov = 12; camera.updateProjectionMatrix(); return } try { camera.rotation.x = window.__pitch; camera.updateMatrixWorld() } catch (_) {} });
      await page.screenshot({ path: `${OUT}/${name}.png` }); await page.evaluate(() => { camera.fov = 60; camera.updateProjectionMatrix() }); console.log(name, await page.evaluate(() => JSON.stringify({ph: Doenca681.fase(), lc: Doenca681.luaCheia(), gd: gameDay198(),a: Vento687.fog.material.uniforms.uA.value, v: Vento687.fog.visible, b: biomeAt(player.x, player.z), f0: (()=>{const m=new THREE.Matrix4();Vento687.fog.getMatrixAt(0,m);return m.elements.slice(12,15).map(v=>v|0)})(), py: player.y|0, ferr: Vento687.ferr||''})));
    }
    const grab = async (name, day, rain) => { const url = await page.evaluate(([day, rain]) => { const p = rain ? .3 : (NIGHT0_377 + NIGHT1_377) / 2; dayT = (day + p) * DAYLEN; updDayNight(0); if (window.RAIN626) RAIN626.k = rain; if (L.dn) L.dn.w = rain * .9; Vento687.tick(.01); camera.fov = rain ? 60 : 12; if (rain) camera.rotation.x = .5; else camera.lookAt(camera.position.clone().add(new THREE.Vector3(.55, .42, -.72).normalize())); camera.updateProjectionMatrix(); camera.updateMatrixWorld(); renderer.render(scene, camera); const u = renderer.domElement.toDataURL('image/png'); camera.fov = 60; camera.updateProjectionMatrix(); return u }, [day, rain]); fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(url.split(',')[1], 'base64')) };
    console.log('CAL', await page.evaluate(() => { const r = []; for (const [d, z] of [[0, 110], [182, 110], [0, -3400], [182, -3400]]) { dayT = (d + .5) * DAYLEN; player.z = z; const a = nightK710(); dayT = (d + .83) * DAYLEN; r.push([d, z, a, nightK710(), isNight(), JSON.stringify(cal710())]) } player.z = 110; return JSON.stringify(r) })); await grab('g-cheia', 27, 0); await grab('g-quarto', 7, 0); await grab('g-nova', 13, 0); await grab('g-chuva', 0, 1);
    const st = await page.evaluate(() => JSON.stringify({s0: Vento687.S.slice(0,3).map(s=>[s.x|0,s.y|0,s.z|0,s.k]), pl:[player.x|0,player.y|0,player.z|0], mat: (()=>{const m=new THREE.Matrix4();Vento687.parts.getMatrixAt(0,m);return m.elements.map(v=>+v.toFixed(2))})(), vis: Vento687.parts.visible, prog: renderer.info.programs.length, v: Vento687.stats, err: (Vento687.err || '') + (Vento687.ferr || ''), fogA: Vento687.fog.material.uniforms.uA.value, fogV: Vento687.fog.visible, gust: ENV.gust.value, sky: Vento687.sky.visible, pano: Pano672.err || '' }));
    console.log(st); console.log('errors', JSON.stringify(errors.slice(0, 5)));
  } finally { await browser.close(); }
})();
