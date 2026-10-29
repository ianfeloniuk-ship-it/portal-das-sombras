// v681: gemas pelo Sistema de Mana v4 — migração da v679, gema de mana da coroa (raridade × rank), gema de vida no engaste,
// custo em vida que não mata, cura que sobra, "Carregar acessório" com núcleo, telas.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'gemas681', PORT = process.argv[3] || '8681';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 } }), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => { window.PDS_SITE = 1; });
    await page.goto('http://127.0.0.1:' + PORT + '/game.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => { try { return typeof started === 'boolean' && typeof pickAwaken === 'function' && typeof CARGA630 !== 'undefined'; } catch (_) { return false; } }, null, { timeout: 240000 });
    await page.waitForTimeout(4000);
    await page.evaluate(() => { profile = pickAwaken(3); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player && player.m && window.Gemas679 && window.Mana642 && typeof Civic343 !== 'undefined', null, { timeout: 240000 });
    await page.waitForTimeout(2000);
    const r = await page.evaluate(() => {
      profile.creationPending91 = false; try { closeModal(); } catch (_) { } window.requestAnimationFrame = () => 0; paused = false;
      let t = performance.now(); const step = n => { for (let i = 0; i < n; i++) { t += 16; frame(t); } };
      const G = Gemas679, M = Mana642, out = {}, A = () => run.acc642;
      const unpause = () => { try { closeModal(); } catch (_) { } paused = false; };
      // 1) migração de um save da v679
      step(5); run.gold = 1000; run.gem679 = { s: [{ t: 'mana', rar: 0, r: 0, m: 30 }, { t: 'vida', rar: 1, r: 0, m: 5 }, null], hpAcc: 0 }; player.mp = 0;
      step(3); out.migr = JSON.stringify(run.gem679); out.goldAfterMigr = run.gold; out.mpAfterMigr = Math.floor(player.mp);
      // 2) coroa + gema de mana (v4: base da raridade × fator do rank)
      run.gold = 999999; out.rank = rankOf();
      extraActions('m642buy', 'c:0'); unpause(); extraActions('m642buy', 'g0:1'); unpause();
      out.g0 = JSON.stringify(A().g0); out.g0cap = M.gemCap('g0');
      // 3) gema de vida no engaste 2
      extraActions('g679buy', 'g1:0'); unpause();
      out.g1 = JSON.stringify(A().g1); out.lifeCap = G.capOf(A().g1); out.accCap = M.accTotals().c; out.crownCap = 20 * M.FR[rankOf()] * 5;
      // 4) golpe que custa vida
      const blood = { n: 'TesteSangue', mp: 0, vida679: 20, sourceClass: 3 };
      A().g1.m = 15; player.hp = player.maxhp; const hp0 = player.hp;
      out.txt = resourceText260(blood); out.pay1 = !!resourcePay260(blood); out.gemAfter1 = G.total(); out.hpLost1 = Math.round(hp0 - player.hp);
      A().g1.m = 0; player.hp = 10; out.err2 = resourceError260(blood); out.pay2 = !!resourcePay260(blood); out.hp2 = player.hp;
      player.hp = 25; out.pay3 = !!resourcePay260(blood); out.hp3 = player.hp;
      // 5) cura que sobra enche a gema de vida (na cidade)
      player.hp = player.maxhp; for (let i = 0; i < 6; i++) step(60); out.lifeOverflow = G.total();
      // 6) a mana dos acessórios não conta a gema de vida
      A().g1.m = 0; out.accTotalsAfter = JSON.stringify(M.accTotals());
      // 7) carregar acessório com núcleo: a mana vai direto para os acessórios, não para a barra
      const n0 = run.nuc642.length; run.res.core[0]++; run.nuc642.push({ r: 0, k: 'chefe', th: 0, m: 50, M: 50, c: 0 }); const ci = run.nuc642.length - 1;
      run.mana642.last = -99; player.mp = 0; const acc0 = M.accTotals().s;
      out.startCharge = M.startExtract(ci, true); out.charge = JSON.stringify(M.finish(99)); out.accGain = M.accTotals().s - acc0; out.mpAfterCharge = Math.floor(player.mp);
      // 8) mana normal: com a barra em 0 o jogo puxa dos acessórios ao lançar
      const sk = { n: 'TesteMana', mp: 5, sourceClass: 3 }; player.mp = 0; const accBefore = M.accTotals().s;
      out.errMana = resourceError260(sk); out.payMana = !!resourcePay260(sk); out.accPulled = accBefore - M.accTotals().s;
      // 9) telas
      bagView('itens'); out.bagLife = $('mb').innerText.includes('Gema de vida'); unpause();
      mktView(); out.shopLife = $('mb').innerHTML.includes('DORIAN · GEMAS DE VIDA'); unpause();
      statusView(); out.statusCharge = $('mb').innerHTML.includes('Carregar acessório'); unpause();
      step(10); out.hpt = $('hpt').textContent; out.mpt = $('mpt').textContent;
      return out;
    });
    await page.evaluate(() => { mktView(); const b = [...document.querySelectorAll('#mb .sec')].find(x => x.textContent.includes('GEMAS DE VIDA')); b && b.scrollIntoView(); });
    await page.waitForTimeout(500); await page.screenshot({ path: path.join(OUT, 'dorian.png') });
    await page.evaluate(() => { closeModal(); statusView(); const b = [...document.querySelectorAll('#mb .sec')].find(x => x.textContent.includes('MANA E EXTR')); b && b.scrollIntoView(); });
    await page.waitForTimeout(500); await page.screenshot({ path: path.join(OUT, 'status.png') });
    console.log(JSON.stringify(r, null, 1)); console.log('errors', errors.slice(0, 8));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
