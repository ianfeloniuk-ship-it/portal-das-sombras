// v670: defesa só no botão do meio (direito = mão esquerda, sem defender), passo dos moradores e corrida do jogador.
const http = require('http'), path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const root = process.cwd();
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]); const f = path.resolve(root, '.' + (u === '/' ? '/game.html' : u));
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    const ext = path.extname(f); res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css', '.wav': 'audio/wav', '.mp3': 'audio/mpeg' }[ext] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(8670);
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }), errors = [];
    page.on('pageerror', e => { errors.push(e.message); console.log('PAGEERROR', e.message); });
    await page.addInitScript(() => window.PDS_SITE = 1);
    await page.goto('http://127.0.0.1:8671/game.html', { waitUntil: 'domcontentloaded', timeout: 180000 }); await page.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 240000 }); await page.waitForTimeout(8000);
    await page.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await page.waitForFunction(() => typeof started !== 'undefined' && started && player, null, { timeout: 240000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => { profile.creationPending91 = false; try { closeModal(); } catch (_) {} });
    const res = await page.evaluate(async () => {
      const out = {}; const C = document.getElementById('c');
      player.x = 300; player.z = 60; for (let i = 0; i < 20; i++) update(1 / 20);
      keys.KeyW = true; keys.AltLeft = true; for (let i = 0; i < 6; i++) update(1 / 20);
      out.cond = { mounted: !!run.mounted, air: !!player.air344, dodgeT: player.dodgeT, atkT: player.atkT, atkCd: player.atkCd, skill: !!(player.skillAnim155 && player.skillAnim155.until > time), anim303: !!(window.Anim303 && Anim303.active()), running: player.sprint372 && player.sprint372.running };
      { const x0 = player.x, z0 = player.z; for (let i = 0; i < 20; i++) update(1 / 20); out.alt_primeiro_mps = +Math.hypot(player.x - x0, player.z - z0).toFixed(2); out.running2 = player.sprint372.running; }
      keys.KeyW = false; keys.AltLeft = false; for (let i = 0; i < 20; i++) update(1 / 20);
      keys.KeyW = true; for (let i = 0; i < 6; i++) update(1 / 20); { const x0 = player.x, z0 = player.z; for (let i = 0; i < 20; i++) update(1 / 20); out.andar_primeiro_mps = +Math.hypot(player.x - x0, player.z - z0).toFixed(2); } keys.KeyW = false;
      const md = (b, t = 'mousedown') => C.dispatchEvent(new MouseEvent(t, { button: b, buttons: t === 'mousedown' ? (b === 2 ? 2 : b === 1 ? 4 : 1) : 0, bubbles: true }));
      const pd = (b, t) => C.dispatchEvent(new PointerEvent(t, { button: b, buttons: t === 'pointerdown' ? (b === 2 ? 2 : b === 1 ? 4 : 1) : 0, bubbles: true, pointerType: 'mouse' }));
      const guard = () => !!(window.Guard472 && Guard472.blocking && Guard472.blocking());
      // 1) direito com escudo (ou vazio) não defende; meio defende
      run.equip.sh = run.equip.sh || { name: 'Escudo de teste', kind155: 'shield' };
      pd(2, 'pointerdown'); md(2); await new Promise(r => setTimeout(r, 120));
      out.direito_com_escudo_defende = guard() || !!(window.Maos662 && Maos662.debug.blk); out.maos662 = !!window.Maos662; pd(2, 'pointerup'); md(2, 'mouseup');
      run.equip.sh = null;
      md(1); await new Promise(r => setTimeout(r, 120)); out.meio_defende = guard(); C.dispatchEvent(new MouseEvent('mouseup', { button: 1, bubbles: true }));
      out.guardKeys = Object.keys(window.Guard472 || {});
      // 2) passo dos moradores
      const a = npcs.find(n => n.kind === 'morador' || n.kind === 'citizen') || npcs[0];
      if (a) { a.tx = a.x + 30; a.tz = a.z; a.path = []; a.wait = 0; const x0 = a.x, z0 = a.z; for (let i = 0; i < 40; i++) updNpc(a, 1 / 20); out.morador_mps = +(Math.hypot(a.x - x0, a.z - z0) / 2).toFixed(2); out.morador_kind = a.kind; }
      // 3) corrida do jogador em campo aberto
      player.x = 300; player.z = 60; for (let i = 0; i < 20; i++) update(1 / 20);
      const meas = extra => { for (const k in keys) keys[k] = false; keys.KeyW = true; for (const k of extra) keys[k] = true; for (let i = 0; i < 8; i++) update(1 / 20); const x0 = player.x, z0 = player.z; for (let i = 0; i < 20; i++) update(1 / 20); const v = Math.hypot(player.x - x0, player.z - z0); for (const k in keys) keys[k] = false; for (let i = 0; i < 20; i++) update(1 / 20); return +v.toFixed(2); };
      out.remapAlt = remapCode('AltLeft'); out.sprintSrc = String(Sprint373.canSprint).slice(0, 400); out.sp372 = JSON.stringify(player.sprint372); out.vig = [player.vig, player.vigor, player.st, player.sta, player.stam]; out.andar_mps = meas([]); out.alt_mps = meas(['AltLeft']); keys.KeyW = true; keys.AltLeft = true; update(1/20); out.sp372b = JSON.stringify(player.sprint372); out.held = Object.keys(keys).filter(k => keys[k]).map(k => k + '>' + remapCode(k)); keys.KeyW = keys.AltLeft = false; out.sprintKey = keyOf('sprint');
      return out;
    });
    console.log(JSON.stringify(res, null, 1)); console.log('errors', errors);
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); process.exit(1); });
