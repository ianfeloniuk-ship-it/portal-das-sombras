/* v502 (Ian, 21/10/2026): densidade estilo Skyrim no mapa finito — um segredo ou encontro a cada ~150 m.
   - Grade de 150 m com posição sorteada por semente (rh/mulberry32): mesmo mundo = mesmos encontros. Seis tipos:
     acampamento abandonado, ruína com baú, baú escondido entre rochas, altar antigo, carcaça de viajante e covil.
     O tipo muda com o bioma (deserto: mais carcaças; neve/vulcão: menos acampamentos; pântano/vulcão: mais covis).
   - Só modelos que já existem (env.glb: tenda, fogueira, pilares, rochas, ossos, baús…). Nenhuma forma crua.
   - Não nasce no mar/praia, em água, perto de cidade, na estrada, em morro íngreme, nem nas ruínas/postos/acampamentos de clã
     que o jogo já tem (esses já contam como encontro).
   - O cenário comum (árvore, grama, pedra) abre uma clareira em volta de cada encontro.
   - Baús, restos e acampamentos: F para vasculhar (ouro, um item, às vezes suprimentos); uma vez só por mundo.
     Altar: F para rezar (vida e mana cheias, de novo a cada dia). Covil: criaturas do bioma aparecem quando você chega perto.
   - Cordilheira de gelo (ice500 > 20): sem arbusto, flor, cogumelo nem grama; no lugar entram coníferas nevadas e rochedos
     (cenário, coleta de arbustos de tools/survival437.js e grama de tools/grass446.js). */
(function () {
  'use strict';
  const CELL = 150, LIM = 4700, TAU = Math.PI * 2;
  const ice = (x, z) => { try { return window.TER245 && TER245.ice500 ? TER245.ice500(x, z) : 0; } catch (_) { return 0; } };

  /* ---------- cordilheira de gelo: nada verde ---------- */
  const GREEN = /^(plant_|flower_|grass|mushroom_|blades$|lily_)/;
  const eh0 = EH, ew0 = EW;
  function iceSwap(orig, b, k, x, y, z, ry, size) {
    const h = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1;
    if (h < .22) return eh0(b, 'tree_pineTallA_detailed', x, y, z, ry, 2.6 + h * 9, 0xe8f0f6);
    if (h < .36) return eh0(b, h < .29 ? 'rock_smallA' : 'rock_smallFlatA', x, y, z, ry, .5 + h * 1.8, 0xf0f4f8);
    return 0;
  }
  EH = function (b, k, x, y, z, ry, H, t) { if (GREEN.test(k) && ice(x, z) > 20) return iceSwap(eh0, b, k, x, y, z, ry, H); return eh0.apply(this, arguments); };
  EW = function (b, k, x, y, z, ry, W, t) { if (GREEN.test(k) && ice(x, z) > 20) return iceSwap(ew0, b, k, x, y, z, ry, W); return ew0.apply(this, arguments); };

  /* ---------- sorteio dos encontros ---------- */
  const TYPES = ['camp', 'ruin', 'chest', 'altar', 'carcass', 'den'];
  const BASE = { camp: 22, ruin: 18, chest: 14, altar: 9, carcass: 17, den: 14 };
  const MOD = {
    deserto: { carcass: 2, ruin: 1.3, camp: .6 }, neve: { camp: .5, carcass: 1.5 },
    pantano: { den: 1.5, altar: .5 }, vulcao: { den: 1.6, altar: .6, camp: .3 }, floresta: { camp: 1.3 }, cristal: { altar: 1.5, camp: .5 }
  };
  const CLEAR = { camp: 9, ruin: 11, chest: 7, altar: 8, carcass: 7, den: 10 };
  let seed = null; const cache = new Map();
  function pickType(R, bio) {
    const m = MOD[bio] || {}; let t = 0; for (const k of TYPES) t += BASE[k] * (m[k] || 1);
    let r = R() * t; for (const k of TYPES) { r -= BASE[k] * (m[k] || 1); if (r < 0) return k; } return 'camp';
  }
  function make(cx, cz) {
    const R = mulberry32(rh(cx, cz, 501));
    const x = (cx + .5) * CELL + (R() - .5) * 90, z = (cz + .5) * CELL + (R() - .5) * 90, r1 = R(), ry = R() * TAU, r2 = R();
    if (Math.abs(x) > LIM || Math.abs(z) > LIM) return null;
    try {
      const S = window.TER245 && TER245.SEA439; if (S && S.d(x, z) > -80) return null;
      if (nearestCity(x, z).d < 130) return null;
      if (onRoad(roadSegs(x, z, 1), x, z, 18) || inWater244(x, z)) return null;
      const lk = lakeAt239(Math.round(x / CH), Math.round(z / CH)); if (lk && Math.hypot(x - lk.x, z - lk.z) < lk.r + 14) return null;
      const ccx = Math.round(x / CH), ccz = Math.round(z / CH); if (ruinAt(ccx, ccz) || outpostAt217(ccx, ccz)) return null;
      if (window.Living372 && Living372.nearbySites(x, z).some(p => Math.hypot(p.x - x, p.z - z) < 45)) return null;
      /* relevo ligado à força (o cenário do pedaço às vezes é montado antes dele ligar) */
      const o = TER245.on.value; TER245.on.value = 1; let steep = false;
      try { const h0 = terrH(x, z); steep = Math.abs(terrH(x + 6, z) - h0) > 2.4 || Math.abs(terrH(x, z + 6) - h0) > 2.4; } finally { TER245.on.value = o; }
      if (steep) return null;
    } catch (_) { return null; }
    const bio = biomeAt(x, z), type = pickType(() => r1, bio);
    return { id: cx + ',' + cz, x, z, ry, r2, bio, type, cl: CLEAR[type] };
  }
  function site(cx, cz) {
    if (seed !== WSEED || cache.size > 6000) { cache.clear(); seed = WSEED; }
    const k = cx + ',' + cz; if (!cache.has(k)) cache.set(k, make(cx, cz)); return cache.get(k);
  }
  function near(x, z, rad) { const out = [], c0 = Math.floor((x - rad) / CELL), c1 = Math.floor((x + rad) / CELL), d0 = Math.floor((z - rad) / CELL), d1 = Math.floor((z + rad) / CELL);
    for (let i = c0; i <= c1; i++) for (let j = d0; j <= d1; j++) { const s = site(i, j); if (s && Math.hypot(s.x - x, s.z - z) <= rad) out.push(s); } return out; }

  /* ---------- peças de cada encontro (só modelos de env.glb) ---------- */
  function build(s, b, addCol, inter) {
    const R = mulberry32(rh(Math.round(s.x), Math.round(s.z), 502)), X = s.x, Z = s.z, snow = s.bio === 'neve' || ice(X, Z) > 20;
    const rk = snow ? 0xf0f4f8 : s.bio === 'vulcao' ? 0x6a5a52 : s.bio === 'deserto' ? 0xe8d2a0 : undefined;
    const P = (k, a, d, ry, H, tint, y) => { const x = X + Math.cos(a) * d, z = Z + Math.sin(a) * d; return eh0(b, k, x, y || 0, z, ry == null ? R() * TAU : ry, H, tint) && { x, z }; };
    const col = (a, d, r) => addCol({ x: X + Math.cos(a) * d, z: Z + Math.sin(a) * d, r });
    const ring = (keys, n, d, H, jit, tint, r) => { for (let i = 0; i < n; i++) { if (R() < jit) continue; const a = s.ry + i / n * TAU + (R() - .5) * .3; const k = keys[Math.floor(R() * keys.length)]; P(k, a, d + (R() - .5) * 1.4, R() * TAU, H * (.8 + R() * .5), tint); if (r) col(a, d, r); } };
    const gr = Math.max(0, Math.min(9, danger(X, Z)));
    let label, mult = 1, minRar = 0, chestKey = null, guard = 0;
    if (s.type === 'camp') {
      P('tent_detailedOpen', 0, 0, s.ry, 3.2); col(0, 0, 1.7);
      P('campfire_stones', s.ry + 1, 4.4, 0, .45); P('log', s.ry + 2.2, 5, null, .5); P('log_stack', s.ry + 4.8, 4.8, null, .8);
      P('barrel_small', s.ry + 2.4, 3.2, null, 1); P('sack', s.ry + 3, 2.8, null, .6); P('crate_B_small', s.ry + 4.2, 3.6, null, .7);
      if (s.r2 < .5) P('bone_A', s.ry + 5.2, 5.5, null, .4);
      label = 'F · VASCULHAR ACAMPAMENTO ABANDONADO'; guard = s.r2 < .25 ? 2 : 0;
    } else if (s.type === 'ruin') {
      ring(['pillar_decorated', 'd_pillar', 'column', 'statue_columnDamaged', 'pillar'], 7, 6.2, 3.8, .22, rk, 1);
      P('arch', s.ry, 6.4, s.ry + Math.PI / 2, 5, rk); col(s.ry, 6.4, 1.2);
      ring(['rubble_large', 'rubble_half'], 5, 3.4, 1.1, .1, rk);
      P('statue_head', s.ry + 2, 3.2, null, 1.4, rk);
      chestKey = 'chest_gold'; label = 'F · ABRIR BAÚ DA RUÍNA'; mult = 2; minRar = 1;
    } else if (s.type === 'chest') {
      ring(['rock_largeA', 'rock_largeB', 'rock_largeC'], 4, 3.6, 3, 0, rk, 1.7);
      P('tree_dead_large', s.ry + .8, 7.5, null, 5.2);
      chestKey = 'chest'; label = 'F · ABRIR BAÚ ESCONDIDO'; mult = 1.4; minRar = 1;
    } else if (s.type === 'altar') {
      P('statue_block', 0, 0, s.ry, 1.1, rk); col(0, 0, 1.3); P('candle_triple', 0, 0, s.ry, .5, undefined, 1.1);
      P('statue_obelisk', s.ry, 3.4, s.ry, 4.4, rk); col(s.ry, 3.4, 1);
      P('pillar', s.ry + 2, 4.2, null, 3, rk); col(s.ry + 2, 4.2, .7); P('pillar', s.ry - 2, 4.2, null, 3, rk); col(s.ry - 2, 4.2, .7);
      P('lantern_standing', s.ry + 1, 2.6, null, 1.6); P('lantern_standing', s.ry - 1, 2.6, null, 1.6);
      label = 'F · REZAR NO ALTAR ANTIGO';
    } else if (s.type === 'carcass') {
      P('ribcage', 0, 0, s.ry, 1.5); P('skull', s.ry + 1, 2.2, null, .5); ring(['bone_A', 'bone_A', 'skull'], 3, 3, .5, .2);
      P('sword_shield', s.ry + 2.6, 1.8, null, 1); P('sack', s.ry + 3.4, 2.4, null, .6);
      if (s.r2 < .5) { P('cart', s.ry + 4.4, 4.5, s.ry, 1.7); col(s.ry + 4.4, 4.5, 1.4); } else P('gravemarker_A', s.ry + 4.4, 3.5, null, 1.1);
      label = 'F · REVISTAR OS RESTOS'; mult = .8;
    } else {
      ring(['rock_tallA', 'rock_tallB', 'rock_tallC'], 6, 5.6, 3.6, .15, rk, 1.2);
      P('post_skull', s.ry + .4, 4.4, null, 2.6); P('post_skull', s.ry - .9, 4.4, null, 2.6);
      P('ribcage', s.ry + 2.2, 2.4, null, 1.3); P('skull', s.ry + 3, 2, null, .5); ring(['bone_A'], 3, 3, .5, 0);
      P('tree_dead_large', s.ry + 3.8, 8.5, null, 5.4);
      chestKey = 'chest'; label = 'F · ABRIR BAÚ DO COVIL'; mult = 1.6; minRar = 1; guard = 2 + (gr >= 4 ? 1 : 0) + (s.r2 < .3 ? 1 : 0);
    }
    if (chestKey) P(chestKey, s.ry + 3.14, 1.1, s.ry, chestKey === 'chest_gold' ? 1 : .9);
    const done = () => !!(run && run.enc502 && run.enc502[s.id]);
    const it = { type: 'enc502', x: X + (chestKey ? Math.cos(s.ry + 3.14) * 1.1 : 0), z: Z + (chestKey ? Math.sin(s.ry + 3.14) * 1.1 : 0), r: 3.2, label, hidden: done(), use: () => use(s, it, mult, minRar, label) };
    if (s.type === 'altar') { it.x = X; it.z = Z; it.r = 3.6; it.hidden = false; }
    inter.push(it); BUILT.set(s.id, { s, guard, spawned: false });
  }

  /* ---------- usar ---------- */
  const day = () => Math.floor((typeof dayT === 'number' ? dayT : 0) / DAYLEN);
  function use(s, it, mult, minRar, label) {
    if (!run || L.mode !== 'world' || player.dead) return;
    const st = run.enc502 || (run.enc502 = {});
    if (s.type === 'altar') {
      if (st[s.id] === day() + 1) { toast('<b>[ALTAR]</b> A luz já respondeu hoje. Volte amanhã.', 2500); return; }
      st[s.id] = day() + 1; player.hp = player.maxhp; player.mp = player.maxmp;
      floater(s.x, s.z, 'Vida e mana cheias', '#bfe4ff', true); toast('<b>[ALTAR]</b> Uma luz fria atravessa você. Vida e mana cheias.', 3500);
      try { sfx('coin'); } catch (_) {} saveRun(); return;
    }
    if (st[s.id]) return; st[s.id] = 1; it.hidden = true;
    const gr = Math.max(0, Math.min(9, danger(s.x, s.z))), gold = Math.round((6 + Math.random() * 8) * (GR[gr].gold || 1) * mult);
    run.gold += gold; floater(s.x, s.z, '+' + gold + ' ouro', '#ffd76a', true);
    let msg = gold + ' de ouro';
    if (minRar > 0 || Math.random() < .3) { try { const item = rollItem(gr, false, 0, minRar); if (item && addItem(item)) msg += ' e ' + item.name; } catch (_) {} }
    const sv = window.Surv437; if (sv && sv.add && s.type !== 'ruin') { try { sv.add(s.type === 'camp' ? 'galho' : 'erva', 2, true); } catch (_) {} }
    toast('<b>[ACHADO]</b> Você encontrou ' + msg + '.', 3500); try { sfx('coin'); } catch (_) {} saveRun();
  }

  /* ---------- covil / acampamento vigiado: criaturas aparecem quando você chega ---------- */
  const BUILT = new Map();
  setInterval(() => {
    try {
      if (typeof started === 'undefined' || !started || !player || !run || L.mode !== 'world' || player.dead) return;
      for (const [id, e] of BUILT) {
        const d = Math.hypot(e.s.x - player.x, e.s.z - player.z);
        if (d > 400) { BUILT.delete(id); continue; }
        if (!e.guard || e.spawned || d > 42 || (run.enc502 && run.enc502[id])) continue;
        e.spawned = true; const gr = Math.max(0, Math.min(9, danger(e.s.x, e.s.z)));
        for (let i = 0; i < e.guard; i++) {
          const a = i / e.guard * TAU, x = e.s.x + Math.cos(a) * 5, z = e.s.z + Math.sin(a) * 5;
          const k = wpick(worldKinds124(gr, x, z)).k, m = spawnKind(k, x, z, gr, { wild: true }); bioMob(m, e.s.bio);
        }
      }
    } catch (_) {}
  }, 1000);

  /* ---------- liga no carregamento do pedaço ---------- */
  let pending = [];
  const ec0 = envChunk;
  envChunk = function (g, R, x0, z0, cityD, addCol) {
    const mine = near(x0, z0, CH * .75 + 14);
    const cd = mine.length ? (x, z) => { const q = cityD(x, z); for (const s of mine) if (Math.hypot(x - s.x, z - s.z) < s.cl) return Object.assign({}, q, { clear: true, d: Math.min(q.d, 0) }); return q; } : cityD;
    const r = ec0.call(this, g, R, x0, z0, cd, addCol);
    try {
      const b = new EnvBatch();
      for (const s of mine) if (Math.abs(s.x - x0) <= CH / 2 && Math.abs(s.z - z0) <= CH / 2) build(s, b, addCol, pending);
      if (b.l.length) envOwn(g, b.mesh(ENVMAT));
    } catch (e) { console.warn('encontros502', e); }
    return r;
  };
  const lc0 = loadChunk;
  loadChunk = function (cx, cz) {
    pending = [];
    const r = lc0.apply(this, arguments);
    try { const ch = chunks.get(cx + ',' + cz); if (ch && L && L.inter) for (const it of pending) { it.chunk = ch; L.inter.push(it); } } catch (_) {}
    pending = []; return r;
  };

  window.Enc502 = {
    site, near, ice,
    clearAt(x, z) { for (let i = Math.floor((x - 12) / CELL); i <= Math.floor((x + 12) / CELL); i++) for (let j = Math.floor((z - 12) / CELL); j <= Math.floor((z + 12) / CELL); j++) { const s = site(i, j); if (s && Math.hypot(s.x - x, s.z - z) < s.cl) return true; } return false; },
    stats() { const c = {}; let n = 0; for (let i = -33; i <= 33; i++) for (let j = -33; j <= 33; j++) { const s = site(i, j); if (s) { n++; c[s.type] = (c[s.type] || 0) + 1; } } return { total: n, cells: 67 * 67, byType: c }; }
  };
})();
