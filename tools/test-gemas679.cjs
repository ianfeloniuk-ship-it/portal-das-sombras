// v679: gemas de mana e de vida (Gemas679): presente, coleta ao abater, gema antes da barra, custo em vida que não mata, sobra de cura, telas.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'gemas679', PORT = process.argv[3] || '8677';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 } }), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => { window.PDS_SITE = 1; });
    await page.goto('http://127.0.0.1:' + PORT + '/game.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 240000 });
    await page.waitForFunction(() => { try { return typeof started === 'boolean' && typeof CARGA630 !== 'undefined'; } catch (_) { return false; } }, null, { timeout: 240000 });
    await page.waitForTimeout(4000);
    await page.evaluate(() => { profile = pickAwaken(3); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player && player.m && window.Gemas679 && typeof Civic343 !== 'undefined', null, { timeout: 240000 });
    await page.waitForTimeout(2000);
    const r = await page.evaluate(() => {
      profile.creationPending91 = false; try { closeModal(); } catch (_) { } window.requestAnimationFrame = () => 0; paused = false;
      let t = performance.now(); const step = n => { for (let i = 0; i < n; i++) { t += 16; frame(t); } };
      const G = Gemas679, out = { cls: profile.cls, mage: Mana642.isMage() };
      step(20); const s = G.st(); out.gift = JSON.parse(JSON.stringify(s.s)); out.cap0 = G.capOf(s.s[0]);
      // 1) coleta ao abater
      const m0 = G.total('mana'); const e = spawnKind('fantasma', player.x + 4, player.z + 3, 0, {}) || enemies.find(x => !x.dead);
      out.enemy = e && (e.kind || e.mon); if (e) { hurtEnemy(e, 999999, player.x, player.z, { fromPlayer: true }); step(5); }
      out.killGain = G.total('mana') - m0; out.coreMana = e ? Mana642.drop(e).m : null;
      // 2) gema antes da barra: barra vazia, gema cheia -> barra volta pela gema
      s.s[0].m = G.capOf(s.s[0]); player.mp = 0; step(30); out.mpAfterRefill = Math.floor(player.mp); out.gemAfterRefill = G.total('mana');
      // 3) pagar habilidade de mana com barra 0 e gema
      const sk = { n: 'TesteMana', mp: 20, sourceClass: 3 }; s.s[0].m = 50; player.mp = 0;
      out.errMana = resourceError260(sk); const pay = resourcePay260(sk); out.payMana = !!pay; out.gemAfterPay = G.total('mana'); out.mpAfterPay = Math.floor(player.mp);
      s.s[0].m = 0; player.mp = 0; out.errNoMana = resourceError260(sk);
      // 4) gema de vida
      run.gold = 99999; out.inCity = !!inCity(player.x, player.z);
      extraActions('g679buy', 'vida:0'); try { closeModal(); } catch (_) { } paused = false; out.afterBuy = s.s.map(g => g && g.t + ':' + g.m + '/' + G.capOf(g));
      const vg = s.s.find(g => g && g.t === 'vida'); out.vidaCap = vg && G.capOf(vg);
      const blood = { n: 'TesteSangue', mp: 0, vida679: 20, sourceClass: 3 };
      vg.m = 30; player.hp = player.maxhp; const hp0 = player.hp;
      out.textBlood = resourceText260(blood); out.errBlood1 = resourceError260(blood); resourcePay260(blood); out.vidaAfter1 = G.total('vida'); out.hpLost1 = Math.round(hp0 - player.hp);
      vg.m = 0; player.hp = 10; out.errBlood2 = resourceError260(blood); out.pay2 = !!resourcePay260(blood); out.hp2 = player.hp;
      player.hp = 25; out.errBlood3 = resourceError260(blood); out.pay3 = !!resourcePay260(blood); out.hp3 = player.hp;
      // 5) cura que passaria do máximo enche a gema de vida
      vg.m = 0; player.hp = player.maxhp; out.regenHp = naturalRegen(player).hp; for (let i = 0; i < 6; i++) step(60); out.vidaOverflow = G.total('vida');
      // 6) telas
      bagView('itens'); out.bagHas = $('mb').innerHTML.includes('GEMAS ('); const bag = $('mb').innerText.split('GEMAS')[1]; out.bagTxt = bag && bag.slice(0, 400);
      closeModal(); mktView(); out.shopHas = $('mb').innerHTML.includes('DORIAN · GEMAS'); closeModal(); paused = false;
      step(10); out.mpt = $('mpt').textContent; out.hpt = $('hpt').textContent;
      return out;
    });
    await page.evaluate(() => { bagView('itens'); const b = [...document.querySelectorAll('#mb .sec')].find(x => x.textContent.startsWith('GEMAS')); b && b.scrollIntoView(); });
    await page.waitForTimeout(500); await page.screenshot({ path: path.join(OUT, 'bolsa.png') });
    await page.evaluate(() => { closeModal(); mktView(); const b = [...document.querySelectorAll('#mb .sec')].find(x => x.textContent.includes('GEMAS')); b && b.scrollIntoView(); });
    await page.waitForTimeout(500); await page.screenshot({ path: path.join(OUT, 'dorian.png') });
    console.log(JSON.stringify(r, null, 1)); console.log('errors', errors.slice(0, 8));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
