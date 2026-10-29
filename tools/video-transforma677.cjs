// v677: grava um vídeo jogando as três transformações (lobisomem, vampiro, praga do draugr). Saída: .webm em OUT.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'video677';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=d3d11'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage(), errors = [];
  // quadros pelo screencast do navegador (sem o ffmpeg do Playwright); o vídeo é montado depois com o ffmpeg do sistema
  const cdp = await ctx.newCDPSession(page); let nf = 0, rec = false; const times = [];
  cdp.on('Page.screencastFrame', async f => { try { if (rec) { const n = String(nf++).padStart(5, '0'); fs.writeFileSync(path.join(OUT, `f${n}.jpg`), Buffer.from(f.data, 'base64')); times.push(f.metadata.timestamp); } await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (_) {} });
  page.on('pageerror', e => errors.push(e.message));
  try {
    await page.addInitScript(() => window.PDS_SITE = 1);
    await page.goto('http://127.0.0.1:8671/game.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 240000 });
    await page.waitForTimeout(6000);
    await page.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player && player.m && window.Criaturas673 && Criaturas673.ready.lobisomem && Criaturas673.ready.vampiro, null, { timeout: 240000 });
    await page.evaluate(() => { profile.creationPending91 = false; try { closeModal(); } catch (_) {} player.x = 26; player.z = 30; player.face = 2.4; player.hp = player.maxhp = 99999; try { for (const e of enemies) e.gone = true; } catch (_) {} try { if (window.FP550 && FP550.active) FP550.set(false); } catch (_) {} pcCam.distance = 4.2; pcCam.pitch = .12; });
    const key = async (code, ms) => { await page.keyboard.down(code); await page.waitForTimeout(ms); await page.keyboard.up(code); };
    const strike = async n => { for (let i = 0; i < n; i++) { await page.evaluate(() => { try { player.atkCd = 0; attack(); } catch (_) {} }); await page.waitForTimeout(700); } };
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: 1280, maxHeight: 720, everyNthFrame: 1 }); rec = true;
    await page.waitForTimeout(3000);
    for (const k of ['lobisomem', 'vampiro', 'draugr']) {
      await page.waitForFunction(() => !Transforma677.scene && !Transforma677.cur, null, { timeout: 60000 });
      await page.evaluate(k => Transforma677.start(k), k);
      await page.waitForFunction(() => !Transforma677.scene, null, { timeout: 60000 });   // a cena inteira, no tempo do jogo
      await page.waitForTimeout(1200);
      await key('KeyW', 2500);                          // anda
      await page.keyboard.down('KeyW'); await key('AltLeft', 2500); await page.keyboard.up('KeyW'); // corre
      await strike(3);                                  // ataca
      await page.waitForTimeout(800);
      await page.evaluate(() => Transforma677.end());
      await page.waitForFunction(() => !Transforma677.scene && !Transforma677.cur, null, { timeout: 60000 });   // volta
      await page.waitForTimeout(1500);
    }
    console.log('errors', errors.slice(0, 5), 'err677', await page.evaluate(() => Transforma677.err || ''));
    rec = false; await cdp.send('Page.stopScreencast');
    // lista de duração por quadro para o ffmpeg (concat demuxer)
    let L = ''; for (let i = 0; i < times.length; i++) { const d = i + 1 < times.length ? Math.max(.01, times[i + 1] - times[i]) : .1; L += `file 'f${String(i).padStart(5, '0')}.jpg'
duration ${d.toFixed(3)}
`; }
    fs.writeFileSync(path.join(OUT, 'frames.txt'), L); console.log('frames', times.length, 'segundos', (times.at(-1) - times[0]).toFixed(1));
  } finally { await ctx.close(); await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
