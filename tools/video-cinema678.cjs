// v678: grava a cena de cinema de uma transformação (KIND) e um pouco da fera andando. Saída: quadros + frames.txt em OUT.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'video678', KIND = process.argv[3] || 'lobisomem';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=d3d11'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage(), errors = [];
  const cdp = await ctx.newCDPSession(page); let nf = 0, rec = false; const times = [];
  cdp.on('Page.screencastFrame', async f => { try { if (rec) { fs.writeFileSync(path.join(OUT, `f${String(nf++).padStart(5, '0')}.jpg`), Buffer.from(f.data, 'base64')); times.push(f.metadata.timestamp); } await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (_) {} });
  page.on('pageerror', e => errors.push(e.message));
  try {
    await page.addInitScript(() => window.PDS_SITE = 1);
    await page.goto('http://127.0.0.1:8671/game.html', { waitUntil: 'domcontentloaded', timeout: 600000 });
    await page.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 900000 });
    await page.waitForTimeout(6000);
    await page.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(k => typeof started !== 'undefined' && started && player && player.m && window.Criaturas673 && k.split(',').every(c => Criaturas673.ready[c]) && window.Cinema678, KIND, { timeout: 900000 });
    await page.evaluate(([PX,PZ,PF]) => { profile.creationPending91 = false; try { closeModal(); } catch (_) {} player.x = PX; player.z = PZ; player.face = PF; window.PF678 = PF; player.hp = player.maxhp = 99999; try { for (const e of enemies) e.gone = true; } catch (_) {} try { if (window.FP550 && FP550.active) FP550.set(false); } catch (_) {} pcCam.distance = 4.2; pcCam.pitch = .12; }, [+(process.env.PX||30), +(process.env.PZ||24), +(process.env.PF||2.4)]);
    await page.waitForFunction(() => window.CARGA630 && CARGA630.ms > 0, null, { timeout: 600000 }).catch(() => console.log('carga630 não soltou'));
    page.on('console', m => { if (/error|warn/i.test(m.type())) console.log('console', m.text().slice(0, 300)); });
    await page.waitForTimeout(3000);
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: 1280, maxHeight: 720, everyNthFrame: 1 }); rec = true;
    await page.waitForTimeout(1000);
    for (const k of KIND.split(',')) {
      await page.waitForFunction(() => !Cinema678.s && !Transforma677.scene && !Transforma677.cur, null, { timeout: 300000 });
      await page.evaluate(() => { player.face = +(window.PF678||0); });
      console.log('play', k, await page.evaluate(k => Cinema678.play(k), k));
      await page.waitForFunction(() => !Cinema678.s, null, { timeout: 600000 });
      for (let i = 0; i < 2; i++) { await page.evaluate(() => { try { player.atkCd = 0; attack(); } catch (_) {} }); await page.waitForTimeout(2500); }
      await page.evaluate(() => Transforma677.end());
      await page.waitForFunction(() => !Transforma677.scene && !Transforma677.cur, null, { timeout: 300000 });
      await page.waitForTimeout(3000);
    }
    console.log('errors', errors.slice(0, 5), 'err678', await page.evaluate(() => Cinema678.err || ''));
    rec = false; await cdp.send('Page.stopScreencast');
    let L = ''; for (let i = 0; i < times.length; i++) { const d = i + 1 < times.length ? Math.max(.01, times[i + 1] - times[i]) : .1; L += `file 'f${String(i).padStart(5, '0')}.jpg'\nduration ${d.toFixed(3)}\n`; }
    fs.writeFileSync(path.join(OUT, 'frames.txt'), L); console.log('frames', times.length, 'segundos', (times.at(-1) - times[0]).toFixed(1));
  } finally { await ctx.close(); await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
