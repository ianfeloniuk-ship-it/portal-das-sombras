/* v523 (Ian, 21/10/2026): mundo vivo, parte 2 — moradores com rotina (trabalhar, comer, taverna, dormir em casa),
   guardas de ronda, bêbados na taverna e ladrões à noite. Diálogos em tools/dialogo520.js (Dialogo520.vida).
   Rotina pelo relógio do jogo (dayT/DAYLEN): 0-5% sai de casa, 5-30% trabalha, 30-38% almoça,
   38-50% trabalha, 50-67% taverna, noite volta para casa e dorme (some dentro da casa; volta de manhã). */
(function (global) {
  'use strict';
  const MN = ['Aldo', 'Brígida', 'Cedric', 'Elsbeth', 'Godwin', 'Flora', 'Gerold', 'Helena', 'Ivo', 'Matilde', 'Otto', 'Petronela'];
  const GN = ['Capitão Ruy', 'Guarda Marcos', 'Guarda Telma', 'Guarda Brás'];
  const JOBS = ['Ajudante do mercado', 'Varredor da praça', 'Carregador', 'Tecelã'];
  const rnd = (a, b) => a + Math.random() * (b - a);
  let lastThief = 0, lastFine = 0;

  const ready = () => typeof L !== 'undefined' && L && L.mode === 'world' && typeof player !== 'undefined' && player && !player.dead
    && typeof npcs !== 'undefined' && typeof makeChibi === 'function' && typeof scene !== 'undefined' && typeof chunks !== 'undefined';
  const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const dlen = () => (typeof DAYLEN !== 'undefined' ? DAYLEN : 3600);
  const phase = () => ((typeof dayT !== 'undefined' ? dayT : 0) % dlen()) / dlen();
  const night = () => typeof isNight === 'function' && isNight();
  const mine = c => npcs.filter(n => n.vida523 && !n.gone && n.home === c);

  function inn(c) { const i = L.inter && L.inter.find(x => x.type === 'inn' && x.city === c); return i ? { x: i.x, z: i.z + 2.2 } : { x: c.x + 8, z: c.z - 10 }; }
  function market(c) { const v = npcs.find(x => x.kind === 'vendor' && x.home === c && x.sign === 'MERCADO'); return v ? { x: v.x + 2.6, z: v.z } : { x: c.x + 7, z: c.z + 9 }; }
  function houseSpot(c, seed) { const a = (seed % 360) * Math.PI / 180; return { x: c.x + Math.cos(a) * 24, z: c.z + Math.sin(a) * 24 }; }
  function patrolPt(c, i) { const a = i * Math.PI / 4; return { x: c.x + Math.cos(a) * 14, z: c.z + Math.sin(a) * 14 }; }

  function mk(c, o) {
    const m = makeChibi(o.look); const p = o.pos; m.root.position.set(p.x, 0, p.z); scene.add(m.root);
    const n = Object.assign({ kind: 'morador', vida523: true, home: c, m, x: p.x, z: p.z, face: rnd(0, 6.28), r: .45, t: Math.random() * 9, tx: p.x, tz: p.z, wait: 0, path: [], col: '#c9d3de' }, o.n);
    n.short = n.name; n.label = 'F · FALAR COM ' + n.name.toUpperCase();
    n.use = () => { if (global.Dialogo520) Dialogo520.vida(n); };
    npcs.push(n); return n;
  }
  function spawnMorador(c) {
    const used = new Set(npcs.filter(x => x.vida523 && !x.gone).map(x => x.name)), free = MN.filter(x => !used.has(x)), nm = free[Math.floor(Math.random() * free.length)] || MN[0];
    const seed = Math.floor(Math.random() * 360), job = JOBS[seed % JOBS.length];
    const pick = a => a[Math.floor(Math.random() * a.length)];
    mk(c, { pos: houseSpot(c, seed), look: { body: pick([0x6b4a2a, 0x3a5fd0, 0x8a2b4a, 0x2f7a4a, 0xb39a6a]), hair: pick([0x222222, 0xc85a1e, 0x6b4a2a, 0xd8b060]), wep: 'none', gk: pick(['Knight', 'Mage', 'Rogue']), tint: 0xffffff, scale: .9 },
      n: { name: nm, role523: 'morador', job523: job, seed523: seed, beber523: seed % 3 === 0 } });
  }
  function spawnGuarda(c) {
    const used = new Set(npcs.filter(x => x.vida523 && !x.gone).map(x => x.name)), free = GN.filter(x => !used.has(x)), nm = free[0] || GN[0], i = Math.floor(Math.random() * 8);
    mk(c, { pos: patrolPt(c, i), look: { body: 0x2a3f6a, hair: 0x333333, wep: 'sword', wcol: 0xcfd8e3, gk: 'Knight', tint: 0xd0e0ff, scale: 1 },
      n: { name: nm, role523: 'guarda', job523: 'Guarda da cidade', wp523: i, act523: 'patrulha' } });
  }
  function drop(n) { n.gone = true; try { scene.remove(n.m.root); } catch (_) {} }

  function goto(n, p, stop) {
    const d = Math.hypot(p.x - n.x, p.z - n.z); n.goGate = null;
    if (d <= (stop || 2.5)) { n.path = []; n.tx = n.x; n.tz = n.z; n.wait = 3; return true; }
    n.tx = p.x; n.tz = p.z; n.path = []; n.wait = 0; return false;
  }
  function sleep(n, on) {
    if (on) { n.kind = 'deco'; n.m.root.visible = false; n.act523 = 'dormir'; }
    else { n.kind = 'morador'; n.m.root.visible = true; n.m.root.position.set(n.x, 0, n.z); }
  }

  function routine(n, p, nightNow) {
    const c = n.home;
    if (n.role523 === 'guarda') {
      if (n.chase523 && !n.chase523.gone) { n.act523 = 'patrulha'; goto(n, { x: n.chase523.x, z: n.chase523.z }, 1.6); return; }
      if (goto(n, patrolPt(c, n.wp523 || 0), 3)) n.wp523 = ((n.wp523 || 0) + 1) % 8;
      return;
    }
    if (nightNow) {
      n.act523 = 'casa';
      if (n.kind === 'deco') return;
      n.role523 = 'morador';
      if (goto(n, houseSpot(c, n.seed523), 3) || (n.nightT523 = (n.nightT523 || 0) + .4) > 90) { n.nightT523 = 0; sleep(n, true); }
      return;
    }
    n.nightT523 = 0;
    if (n.kind === 'deco') { const h = houseSpot(c, n.seed523); n.x = h.x; n.z = h.z; sleep(n, false); }
    let spot, act;
    if (p < .05) { act = 'casa'; spot = houseSpot(c, n.seed523); }
    else if (p < .30 || (p >= .38 && p < .50)) {
      act = 'trabalho'; const mk0 = market(c);
      spot = n.job523 === 'Varredor da praça' ? { x: c.x + 6 * Math.sin(p * 80), z: c.z + 6 * Math.cos(p * 80) } : { x: mk0.x + (n.seed523 % 5) - 2, z: mk0.z + 1.5 };
    } else if (p < .38) { act = 'almoco'; const i = inn(c); spot = { x: i.x + (n.seed523 % 4), z: i.z + 2 }; }
    else { act = 'taverna'; const i = inn(c); spot = { x: i.x + (n.seed523 % 5) - 2, z: i.z + 2.5 }; }
    n.act523 = act;
    n.role523 = (act === 'taverna' && n.beber523) ? 'bebado' : 'morador';
    goto(n, spot, 2.5);
  }

  function thief(c) {
    if (npcs.some(x => x.role523 === 'ladrao' && !x.gone && x.home === c)) return;
    const a = rnd(0, 6.28), pos = { x: player.x + Math.cos(a) * 22, z: player.z + Math.sin(a) * 22 };
    const n = mk(c, { pos, look: { body: 0x1a1a22, hair: 0x222222, wep: 'dagger', wcol: 0x888888, gk: 'Rogue', tint: 0x9aa0b0, scale: .9 }, n: { name: 'Vulto Encapuzado', role523: 'ladrao', job523: 'Ladrão', act523: 'espreita' } });
    n.use = () => {
      if (n.loot523 > 0) {
        if (typeof run !== 'undefined' && run) run.gold = (run.gold || 0) + n.loot523;
        if (typeof toast === 'function') toast('<b>[LADRÃO]</b> Você pegou o ladrão e recuperou ' + n.loot523 + ' de ouro.');
        if (typeof addOrderRep === 'function') addOrderRep(3, 'Pegou um ladrão');
        n.loot523 = 0; drop(n);
      } else if (typeof speech153 === 'function') speech153(n, 'Só estou passando...', '');
    };
    n.label = 'F · VULTO ENCAPUZADO';
  }
  function thiefTick(n) {
    if (n.loot523 > 0) { // fugindo: guarda próximo persegue e devolve
      const g = mine(n.home).find(x => x.role523 === 'guarda' && dist(x, n) < 35);
      if (g) {
        g.chase523 = n;
        if (dist(g, n) < 2.2) {
          if (typeof run !== 'undefined' && run) run.gold = (run.gold || 0) + n.loot523;
          if (typeof toast === 'function') toast('<b>[GUARDA]</b> ' + g.name + ' pegou o ladrão e devolveu ' + n.loot523 + ' de ouro.');
          n.loot523 = 0; g.chase523 = null; drop(n);
        }
      }
      return;
    }
    if (n.stolen523) return;
    n.goGate = null; n.tx = player.x; n.tz = player.z; n.path = []; n.wait = 0;
    if (dist(n, player) < 1.6) {
      const gd = typeof run !== 'undefined' && run ? (run.gold || 0) : 0, a = Math.atan2(n.x - player.x, n.z - player.z);
      n.stolen523 = 1; n.leaving = true; n.tx = n.home.x + Math.sin(a) * 40; n.tz = n.home.z + Math.cos(a) * 40;
      if (gd >= 20) {
        const amt = Math.min(150, Math.max(10, Math.round(gd * .1))); run.gold -= amt; n.loot523 = amt;
        if (typeof floater === 'function') floater(n.x, n.z, 'FUROU!', '#ff8a8a');
        if (typeof toast === 'function') toast('<b>[LADRÃO]</b> Um vulto roubou ' + amt + ' de ouro de você! Corra atrás dele (F) ou chame um guarda.', 6000);
        n.label = 'F · PEGAR O LADRÃO';
      }
    }
  }

  function tick() {
    try {
      if (!ready()) return;
      const p = phase(), nn = night(), now = performance.now();
      for (const n of npcs.filter(x => x.vida523 && !x.gone)) {
        if (!n.home || dist(player, n.home) > 220) { drop(n); continue; }
        if (n.role523 === 'ladrao') { thiefTick(n); continue; }
        routine(n, p, nn);
        if (n.role523 === 'guarda' && typeof profile !== 'undefined' && profile && profile.multa523 && dist(n, player) < 6 && now - lastFine > 30000 && typeof speech153 === 'function') {
          lastFine = now; speech153(n, 'Ei, você! Pague a multa por desordem!', 'F para falar');
        }
      }
      for (const ch of chunks.values()) {
        const c = ch.city; if (!c || (typeof cityFallen === 'function' && cityFallen(c)) || dist(player, c) > 120) continue;
        const list = mine(c), mors = list.filter(x => x.role523 !== 'guarda' && x.role523 !== 'ladrao').length, gs = list.filter(x => x.role523 === 'guarda').length;
        if (gs < 2) { spawnGuarda(c); break; }
        if (mors < 3) { spawnMorador(c); break; }
        if ((nn || p > .55) && dist(player, c) < 45 && now - lastThief > 90000 && Math.random() < .25) { lastThief = now; c.ladrao523 = 1; thief(c); }
        else if (!list.some(x => x.role523 === 'ladrao')) c.ladrao523 = 0;
      }
    } catch (_) {}
  }
  setInterval(tick, 400);
  global.Vida523 = { tick, phase };
})(typeof window !== 'undefined' ? window : globalThis);
