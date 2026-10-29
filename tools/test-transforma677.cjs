// v677: confere a troca de modelo e a pele cinza das três transformações.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } }), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => window.PDS_SITE = 1);
    await page.goto('http://127.0.0.1:8671/game.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 240000 });
    await page.waitForTimeout(6000);
    await page.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player && player.m && window.Criaturas673 && Criaturas673.ready.vampiro, null, { timeout: 240000 });
    const r = await page.evaluate(async () => {
      profile.creationPending91 = false; try { closeModal(); } catch (_) {} paused = false; window.requestAnimationFrame = () => 0;
      const out = {}; let t = performance.now(); const step = n => { for (let i = 0; i < n; i++) { t += 16; frame(t); } };
      for (const k of ['vampiro', 'lobisomem', 'draugr']) { const ok = Transforma677.start(k); step(300);
        let col = null; player.m.root.traverse(o => { if (!col && o.isMesh && o.material && o.material.color) col = o.material.color.getHexString(); });
        out[k] = { ok, crit: player.m.crit673 || null, cur: Transforma677.cur, base: (Criaturas673.base[k] || []).length, col, err: Transforma677.err || null };
        Transforma677.end(); step(240); out[k].back = !player.m.crit673 && !Transforma677.cur; }
      return out; });
    console.log(JSON.stringify(r)); console.log('errors', errors.slice(0, 3));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
