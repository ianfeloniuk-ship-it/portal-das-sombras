const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Simple static server
const PORT = 8792;
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.glb': 'model/gltf-binary',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
  let file = req.url.split('?')[0];
  if (file === '/' || file === '') file = '/index.html';
  const filePath = path.join(ROOT, file);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const type = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log('Serving on port ' + PORT);

  try {
    const browser = await chromium.launch({
      headless: true,
      channel: 'msedge',
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--no-sandbox']
    });

    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    page.on('console', msg => {
      const txt = msg.text();
      if (!txt.includes('AudioContext') && !txt.includes('favicon')) {
        console.log('[BROWSER]', txt);
      }
    });

    page.on('pageerror', err => {
      console.error('[BROWSER ERROR]', err);
    });

    await page.goto(`http://localhost:${PORT}/index.html`);
    await page.waitForTimeout(1500);

    // Iniciar jogo
    const started = await page.evaluate(() => {
      if (typeof window.startNewGame === 'function') {
        window.startNewGame(0);
        return true;
      }
      const btn = document.querySelector('#bNew') || document.querySelector('#bCont');
      if (btn) { btn.click(); return true; }
      return false;
    });
    console.log('Game start initiated:', started);

    await page.waitForTimeout(2500);

    // Entrar em 1ª Pessoa oficial
    const fpOk = await page.evaluate(() => {
      if (!window.FP550) return false;
      window.FP550.set(true);
      return window.FP550.active;
    });
    console.log('FP550 active:', fpOk);

    await page.waitForTimeout(800);

    // 1. Captura 1: Visão em 1ª Pessoa com Espada Nórdica
    const out1 = path.join(ROOT, 'proof-fp-skyrim-sword.png');
    await page.screenshot({ path: out1 });
    console.log('Saved:', out1);

    // 2. Captura 2: Ataque / Golpe de corte em 1ª Pessoa
    await page.evaluate(() => {
      if (typeof window.attack === 'function') window.attack();
    });
    await page.waitForTimeout(150);
    const out2 = path.join(ROOT, 'proof-fp-skyrim-combat.png');
    await page.screenshot({ path: out2 });
    console.log('Saved:', out2);

    // 3. Captura 3: Defesa / Bloqueio com Escudo Nórdico Levantado
    await page.evaluate(() => {
      if (window.Guard472) {
        window.Guard472.stats.parries++;
        // Simula bloqueio ativo
        if (window.FP550) window.FP550.blockWeight = 1.0;
      }
    });
    await page.waitForTimeout(200);
    const out3 = path.join(ROOT, 'proof-fp-skyrim-shield.png');
    await page.screenshot({ path: out3 });
    console.log('Saved:', out3);

    // 4. Captura 4: Olhando para baixo (Pés e relevo em 1ª pessoa)
    await page.evaluate(() => {
      if (window.FP550) window.FP550.blockWeight = 0;
      if (window.pcCam) window.pcCam.pitch = -0.95; // olha para baixo
    });
    await page.waitForTimeout(300);
    const out4 = path.join(ROOT, 'proof-fp-skyrim-looking-down.png');
    await page.screenshot({ path: out4 });
    console.log('Saved:', out4);

    // 5. Testar alternância de volta para 3ª pessoa
    const tpOk = await page.evaluate(() => {
      window.FP550.set(false);
      return !window.FP550.active && !window.pcCam.firstPerson;
    });
    console.log('Returned to 3rd person successfully:', tpOk);

    await browser.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
  }
});
