// v681: contágio, incubação, estágios, sol do vampiro, carne crua do draugr e linhas da ficha.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const p = await b.newPage({ viewport: { width: 800, height: 600 } }), errors = [];
    p.on('pageerror', e => errors.push(e.message));
    await p.addInitScript(() => window.PDS_SITE = 1);
    await p.goto('http://127.0.0.1:8671/game.html', { waitUntil: 'domcontentloaded', timeout: 600000 });
    await p.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 600000 });
    await p.waitForTimeout(4000);
    await p.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await p.waitForFunction(() => typeof started !== 'undefined' && started && window.Doenca681 && run && run.corpo659, null, { timeout: 600000 });
    const r = await p.evaluate(() => { window.requestAnimationFrame = () => 0; profile.creationPending91 = false; try { closeModal(); } catch (_) {}
      const D = Doenca681, c = run.corpo659, out = {}; let t = performance.now(); const step = n => { for (let i = 0; i < n; i++) { t += 50; frame(t); } };
      // chance real: 12000 golpes de draugr com ferida grau 2 → perto de 1000
      let n = 0; for (let i = 0; i < 12000; i++) { c.disease = null; c.mal681 = null; D.rolar(c, null, 2, 'Draugr'); if (c.disease) n++; } out.draugr12000 = n;
      n = 0; for (let i = 0; i < 1000; i++) { c.disease = null; D.rolar(c, null, 1, 'Draugr'); if (c.disease) n++; } out.grau1 = n;
      const day0 = dayT; dayT = Math.floor(dayT / DAYLEN) * DAYLEN + DAYLEN * .45; out.noite = isNight();
      n = 0; for (let i = 0; i < 800; i++) { c.disease = null; D.rolar(c, null, 2, 'Lobisomem'); if (c.disease) n++; } out.loboDeDia = n;
      // vampiro: incuba 3 dias, toma conta, sol queima
      c.disease = null; c.mal681 = null; D.pegar(c, 'sangue'); out.incuba = c.disease && c.disease.until - c.hh;
      const R = (a, b) => a + ' = ' + b + '\n', esc = x => x; out.fichaInc = D.ficha(c, R, esc);
      c.hh += 73; D.hora(c); out.vamp = c.mal681 && c.mal681.k; out.est1 = D.estagio(c.mal681, c);
      player.hp = player.maxhp = 5000; const hp0 = player.hp; const est0 = D.estagio(c.mal681, c); let lost = 0; const H0 = player.hp; for (let i = 0; i < 70; i++) { const a = player.hp; step(1); if (player.hp < a) lost += a - player.hp; } out.solTirou = hp0 - player.hp; out.solPerdas = lost; out.solDiag = [est0, isNight(), L.mode, c.mal681.k];
      c.hh += 50; D.hora(c); out.est3 = D.estagio(c.mal681, c); out.fichaVamp = D.ficha(c, R, esc);
      // draugr: estágio 2 deixa mais lento; carne crua volta ao 1
      c.mal681 = null; D.pegar(c, 'tumulo'); c.hh += 49; D.hora(c); const v1 = movementSpeed(5); c.hh += 80; D.hora(c); out.dEst = D.estagio(c.mal681, c); const v2 = movementSpeed(5); out.vel = [v1, v2];
      Surv437.add('carne', 1, false, 0); Corpo659.onUse('carne'); out.dDepoisCarne = D.estagio(c.mal681, c); out.fichaDraugr = D.ficha(c, R, esc);
      c.mal681 = null; D.pegar(c, 'lua'); out.luaEm = D.luaEm(); out.fichaLua = D.ficha(c, R, esc);
      out.diag = { ticks: Doenca681.ticks, hp: [player.hp, player.maxhp], onUse: String(Corpo659.onUse).slice(0, 90), paused: typeof paused !== 'undefined' && paused, mode: L.mode, freeze: typeof freeze !== 'undefined' && freeze, upd: String(update).slice(0, 80) }; out.err = D.err || ''; return out; });
    console.log(JSON.stringify(r, null, 1)); console.log('errors', errors.slice(0, 5));
  } finally { await b.close(); }
})().catch(e => { console.error(e); process.exit(1); });
