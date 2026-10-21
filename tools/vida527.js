/* v527 (Ian, 21/10/2026): mundo vivo, parte 3 — crianças que brincam na praça e brigas entre moradores.
   Crianças: 2 por cidade de dia, correm entre pontos da praça; à noite vão dormir (somem). Falam pelo menu de tools/dialogo520.js.
   Brigas: de tempos em tempos (no máximo uma a cada 150 s, perto do jogador, de dia) dois moradores de tools/vida523.js
   discutem no meio da rua. O jogador pode separar (+3 de reputação), tomar partido ou deixar; se ninguém resolver em 25 s,
   o guarda mais próximo vai até lá e separa. As notícias que os NPCs contam mudam com o que o jogador fez (Dialogo520.fama). */
(function (global) {
  'use strict';
  const KN = ['Pipo', 'Lila', 'Tico', 'Nina', 'Duda', 'Beto'];
  const KLINES = ['Pega eu!', 'Você não me pega!', 'Minha mãe disse que tem monstros lá fora!', 'Quero ser guarda quando crescer!'];
  const BLINES = ['Você me deve!', 'Mentiroso!', 'Isso é meu!', 'Saia da minha frente!', 'Vou chamar a guarda!'];
  const rnd = (a, b) => a + Math.random() * (b - a);
  let lastBrawl = 0;

  const ready = () => typeof L !== 'undefined' && L && L.mode === 'world' && typeof player !== 'undefined' && player && !player.dead
    && typeof npcs !== 'undefined' && typeof makeChibi === 'function' && typeof scene !== 'undefined' && typeof chunks !== 'undefined';
  const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const dlen = () => (typeof DAYLEN !== 'undefined' ? DAYLEN : 3600);
  const phase = () => ((typeof dayT !== 'undefined' ? dayT : 0) % dlen()) / dlen();
  const night = () => typeof isNight === 'function' && isNight();
  const drop = n => { n.gone = true; try { scene.remove(n.m.root); } catch (_) {} };

  function spawnKid(c) {
    const used = new Set(npcs.filter(x => x.vida527 && !x.gone).map(x => x.name)), free = KN.filter(x => !used.has(x)), nm = free[0] || KN[0];
    const a = rnd(0, 6.28), x = c.x + Math.cos(a) * 6, z = c.z + Math.sin(a) * 6;
    const m = makeChibi({ body: [0xd8a23a, 0x4a8fd0, 0xc25a8a, 0x6ab04a][Math.floor(Math.random() * 4)], hair: [0x222222, 0xc85a1e, 0xd8b060][Math.floor(Math.random() * 3)], wep: 'none', gk: 'Rogue', tint: 0xffffff, scale: .6 });
    m.root.position.set(x, 0, z); scene.add(m.root);
    const n = { kind: 'morador', vida527: true, role523: 'crianca', job523: 'Criança', act523: 'brincar', home: c, m, x, z, face: rnd(0, 6.28), r: .35, t: Math.random() * 9, tx: x, tz: z, wait: 0, path: [], name: nm, short: nm, col: '#ffe08a', seed523: Math.floor(rnd(0, 360)), label: 'F · FALAR COM ' + nm.toUpperCase() };
    n.use = () => { if (global.Dialogo520) Dialogo520.vida(n); };
    npcs.push(n);
  }
  function kidTick(n, p, nn) {
    if (nn || p > .6) { // vai dormir
      if (n.kind !== 'deco') { n.kind = 'deco'; n.m.root.visible = false; }
      return;
    }
    if (n.kind === 'deco') { n.kind = 'morador'; n.m.root.visible = true; n.m.root.position.set(n.x, 0, n.z); }
    n.goGate = null;
    const d = Math.hypot((n.pt || { x: n.x, z: n.z }).x - n.x, (n.pt || { x: n.x, z: n.z }).z - n.z);
    if (!n.pt || d < 1.5 || (n.ptT = (n.ptT || 0) + 1) > 20) {
      const a = rnd(0, 6.28), r = rnd(2, 10); n.pt = { x: n.home.x + Math.cos(a) * r, z: n.home.z + Math.sin(a) * r }; n.ptT = 0;
      if (Math.random() < .25 && typeof speech153 === 'function' && dist(n, player) < 12) speech153(n, KLINES[Math.floor(Math.random() * KLINES.length)], '');
    }
    n.tx = n.pt.x; n.tz = n.pt.z; n.path = []; n.wait = 0;
  }

  function startBrawl(c, now) {
    const pool = npcs.filter(n => n.vida523 && !n.gone && n.home === c && n.kind === 'morador' && (n.role523 === 'morador' || n.role523 === 'bebado') && !n.brigaT523);
    if (pool.length < 2) return false;
    const a = pool[0], b = pool[1], mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
    a.briga523 = b; b.briga523 = a; a.brigaT523 = b.brigaT523 = performance.now() + 25000;
    a.brigaPt523 = { x: mid.x - .7, z: mid.z }; b.brigaPt523 = { x: mid.x + .7, z: mid.z };
    a.act523 = b.act523 = 'briga'; a.brigaSay = b.brigaSay = 0; a.brigaStart = b.brigaStart = performance.now();
    if (dist(player, mid) < 60 && typeof toast === 'function') toast('<b>[CIDADE]</b> ' + a.short + ' e ' + b.short + ' estão brigando no meio da rua!');
    lastBrawl = now; return true;
  }
  function brawlTick(n, now) {
    if (!n.brigaT523) return;
    const o = n.briga523;
    if (now > n.brigaT523 || !o || o.gone) { n.brigaT523 = 0; if (n.act523 === 'briga') n.act523 = 'trabalho'; return; }
    if (typeof speech153 === 'function' && now - (n.brigaSay || 0) > 5000 && dist(n, player) < 14) { n.brigaSay = now + rnd(0, 2000); speech153(n, BLINES[Math.floor(Math.random() * BLINES.length)], ''); }
    // depois de 10 s o guarda mais próximo vem separar
    if (now - n.brigaStart > 10000) {
      const g = npcs.filter(x => x.role523 === 'guarda' && !x.gone && x.home === n.home).sort((a, b) => dist(a, n) - dist(b, n))[0];
      if (g) { g.chase523 = { x: n.x, z: n.z, gone: false }; if (dist(g, n) < 3) { n.brigaT523 = 0; o.brigaT523 = 0; g.chase523 = null; } }
    }
  }

  function tick() {
    try {
      if (!ready()) return;
      const p = phase(), nn = night(), now = performance.now();
      for (const n of npcs.filter(x => x.vida527 && !x.gone)) {
        if (!n.home || dist(player, n.home) > 220) { drop(n); continue; }
        kidTick(n, p, nn);
      }
      for (const n of npcs) if (n.brigaT523 && !n.gone) brawlTick(n, now);
      for (const ch of chunks.values()) {
        const c = ch.city; if (!c || (typeof cityFallen === 'function' && cityFallen(c)) || dist(player, c) > 120) continue;
        const kids = npcs.filter(x => x.vida527 && !x.gone && x.home === c).length;
        if (kids < 2 && !nn) { spawnKid(c); break; }
        if (!nn && p > .05 && p < .6 && dist(player, c) < 60 && now - lastBrawl > 150000 && Math.random() < .08) { if (startBrawl(c, now)) break; }
      }
    } catch (_) {}
  }
  setInterval(tick, 1000);
  global.Vida527 = { tick };
})(typeof window !== 'undefined' ? window : globalThis);
