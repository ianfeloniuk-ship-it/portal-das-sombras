/* v522 (Ian, 21/10/2026): mundo vivo — mendigos nas cidades, com vida própria.
   Cada cidade (de pé) tem 1 ou 2 mendigos. Eles têm nome, passado e memória (tools/dialogo520.js).
   Mudam de ponto da cidade (pátio de dia, perto da pousada à noite) só quando o jogador está longe (>40 m). */
(function (global) {
  'use strict';
  const NAMES = ['Zé', 'Tobias', 'Dona Marta', 'Velho Anselmo', 'Bento', 'Cora', 'Mestre Lúcio', 'Nico', 'Rute', 'Gaspar'];
  const DAY = [[6, 6], [-7, 5], [2, -9], [-4, -6]];
  const NIGHT = [[9, -6], [-9, -5], [8, 8]];
  let last = 0;

  function nearPlayer(x, z, r) { return typeof player !== 'undefined' && player && Math.hypot(player.x - x, player.z - z) < r; }
  function spot(c, night, seed) { const L = night ? NIGHT : DAY, s = L[Math.abs(seed) % L.length]; return { x: c.x + s[0], z: c.z + s[1] }; }

  function spawn(c) {
    if (typeof makeChibi !== 'function' || typeof scene === 'undefined' || typeof npcs === 'undefined') return;
    const used = new Set(npcs.filter(n => n.mendigo522 && !n.gone).map(n => n.name));
    const free = NAMES.filter(x => !used.has(x));
    const nm = free[Math.floor(Math.random() * free.length)] || NAMES[0];
    const night = typeof isNight === 'function' && isNight();
    const seed = Math.floor(Math.random() * 100), p = spot(c, night, seed);
    const m = makeChibi({ body: 0x4a3f35, hair: 0x8a8a8a, wep: 'none', gk: 'Barbarian', tint: 0xbba88a, scale: .85 });
    m.root.position.set(p.x, 0, p.z); scene.add(m.root);
    const n = { kind: 'traveler', mendigo522: true, home: c, m, x: p.x, z: p.z, face: Math.random() * 6.28, r: .45, name: nm, short: nm, col: '#bba88a',
      t: Math.random() * 9, seed522: seed, night522: night, label: 'F · FALAR COM ' + nm.toUpperCase() };
    n.use = () => { if (global.Dialogo520) Dialogo520.mendigo(n); };
    npcs.push(n);
  }

  function tick() {
    try {
      if (typeof L === 'undefined' || !L || L.mode !== 'world' || typeof player === 'undefined' || !player || player.dead) return;
      if (typeof chunks === 'undefined' || typeof npcs === 'undefined') return;
      const night = typeof isNight === 'function' && isNight(), live = npcs.filter(n => n.mendigo522 && !n.gone);
      for (const n of live) {
        if (!n.home || Math.hypot(player.x - n.home.x, player.z - n.home.z) > 220) { n.gone = true; try { scene.remove(n.m.root); } catch (_) {} continue; }
        if (n.night522 !== night && !nearPlayer(n.x, n.z, 40)) { // vida própria: troca de ponto fora da vista
          const p = spot(n.home, night, n.seed522 + 1); n.x = p.x; n.z = p.z; n.night522 = night; n.m.root.position.set(n.x, 0, n.z);
        }
      }
      if (live.length >= 8) return;
      for (const ch of chunks.values()) {
        const c = ch.city; if (!c) continue;
        if (typeof cityFallen === 'function' && cityFallen(c)) continue;
        if (!nearPlayer(c.x, c.z, 150)) continue;
        const want = (typeof cityL === 'function' && cityL(c) >= 3) ? 2 : 1;
        if (live.filter(n => n.home === c).length < want) { spawn(c); break; }
      }
    } catch (_) {}
  }
  setInterval(tick, 3000);
  global.Vida522 = { tick };
})(typeof window !== 'undefined' ? window : globalThis);
