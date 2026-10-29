// v678: quadros do golpe de cada criatura numa cena isolada (frente e lado), para ver braço e garra.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'golpes678';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const p = await b.newPage({ viewport: { width: 600, height: 600 } });
    await p.addInitScript(() => window.PDS_SITE = 1);
    await p.goto('http://127.0.0.1:8671/game.html', { waitUntil: 'domcontentloaded', timeout: 600000 });
    await p.waitForFunction(() => typeof pickAwaken === 'function' && typeof startGame === 'function', null, { timeout: 600000 });
    await p.waitForTimeout(4000);
    await p.evaluate(() => { profile = pickAwaken(0); store.set('pds2_profile', profile); startGame(); });
    await p.waitForFunction(() => typeof started !== 'undefined' && started && window.Criaturas673 && ['lobisomem', 'vampiro', 'draugr'].every(k => Criaturas673.ready[k]), null, { timeout: 600000 });
    await p.waitForTimeout(3000);
    const shots = await p.evaluate(() => { window.requestAnimationFrame = () => 0; const out = [];
      const S2 = new THREE.Scene(); S2.background = new THREE.Color(0x8fa6b8); S2.add(new THREE.HemisphereLight(0xffffff, 0x445544, 1.1)); const dl = new THREE.DirectionalLight(0xffeedd, 1); dl.position.set(3, 6, 4); S2.add(dl);
      const C2 = new THREE.PerspectiveCamera(35, 1, .05, 100); renderer.setSize(600, 600, false);
      for (const [k, want] of [['lobisomem', null], ['vampiro', /masculino/], ['draugr', /guerreiro/]]) {
        const m = Criaturas673.model(k, want); S2.add(m.root); m.root.position.set(0, 0, 0);
        let t = 0; const st = { move: 0, dead: 0, atk: 0 };
        for (let i = 0; i < 30; i++) { t += 1 / 30; animChibi(m, st, t); }
        for (let i = 0; i < 48; i++) { t += 1 / 30; st.atk = Math.max(0, 1 - i / 40); window.ADT = 1 / 30; animChibi(m, st, t);
          if (i % 6 === 0) for (const ang of [0, 1.4]) { m.root.rotation.y = ang; m.root.updateMatrixWorld(true); const h = (m.height482 || 2) ; C2.position.set(0, h * .7, h * 2.4); C2.lookAt(0, h * .55, 0); renderer.render(S2, C2); out.push([k + '_' + i + '_' + ang, renderer.domElement.toDataURL('image/jpeg', .8)]); } }
        const A = m['bank486_' + Criaturas673.DEF[k].bank]; out.push(['dbg_' + k, JSON.stringify({ act: A && Object.keys(A.act), adt: typeof ADT !== 'undefined' ? ADT : 'x', t: A && A.mixer && A.mixer.time, clip: m.atkClip673 })]);
        S2.remove(m.root); }
      return out; });
    for (const [n, d] of shots) if (n.startsWith('dbg_')) console.log(n, d); else fs.writeFileSync(path.join(OUT, n + '.jpg'), Buffer.from(d.split(',')[1], 'base64'));
    console.log('shots', shots.length);
  } finally { await b.close(); }
})().catch(e => { console.error(e); process.exit(1); });
