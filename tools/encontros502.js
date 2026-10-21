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
  const TYPES = ['camp', 'ruin', 'chest', 'altar', 'carcass', 'den', 'npc'];
  const BASE = { camp: 22, ruin: 18, chest: 14, altar: 9, carcass: 17, den: 14, npc: 9 };
  const MOD = {
    deserto: { carcass: 2, ruin: 1.3, camp: .6 }, neve: { camp: .5, carcass: 1.5 },
    pantano: { den: 1.5, altar: .5 }, vulcao: { den: 1.6, altar: .6, camp: .3 }, floresta: { camp: 1.3 }, cristal: { altar: 1.5, camp: .5 }
  };
  const CLEAR = { camp: 9, ruin: 15, chest: 7, altar: 9, carcass: 7, den: 10, npc: 8 };
  let seed = null; const cache = new Map();
  function pickType(R, bio) {
    const m = MOD[bio] || {}; let t = 0; for (const k of TYPES) t += BASE[k] * (m[k] || 1);
    let r = R() * t; for (const k of TYPES) { r -= BASE[k] * (m[k] || 1); if (r < 0) return k; } return 'camp';
  }
  const rawType = (cx, cz) => { const R = mulberry32(rh(cx, cz, 501)); R(); R(); return pickType(R, biomeAt((cx + .5) * CELL, (cz + .5) * CELL)); };
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
    const bio = biomeAt(x, z); let type = pickType(() => r1, bio);
    /* dois encontros iguais lado a lado: o sorteio de cada vizinho (sem filtros) é comparado e o tipo é re-sorteado */
    const nb = [rawType(cx - 1, cz), rawType(cx, cz - 1), rawType(cx + 1, cz), rawType(cx, cz + 1)];
    for (let t = 0; t < 5 && nb.includes(type); t++) type = pickType(R, bio);
    return { id: cx + ',' + cz, x, z, ry, r2, bio, type, cl: CLEAR[type] };
  }
  function site(cx, cz) {
    if (seed !== WSEED || cache.size > 6000) { cache.clear(); seed = WSEED; }
    const k = cx + ',' + cz; if (!cache.has(k)) cache.set(k, make(cx, cz)); return cache.get(k);
  }
  function near(x, z, rad) { const out = [], c0 = Math.floor((x - rad) / CELL), c1 = Math.floor((x + rad) / CELL), d0 = Math.floor((z - rad) / CELL), d1 = Math.floor((z + rad) / CELL);
    for (let i = c0; i <= c1; i++) for (let j = d0; j <= d1; j++) { const s = site(i, j); if (s && Math.hypot(s.x - x, s.z - z) <= rad) out.push(s); } return out; }

  /* ---------- peças de cada encontro ----------
     Pedra, prédio e muro vêm dos modelos Tripo (TripoEnvironment153, com textura); do env.glb ficam só peças com cor própria
     (tenda, barril, ossos, baú...) e o entulho, pintado com a cor da pedra do bioma. */
  const TM = () => (window.TripoEnvironment153 && TripoEnvironment153.models) || {};
  const BUILDINGS = [['house', 6.6], ['church', 12], ['inn', 10], ['mill', 11], ['forge', 7], ['guild', 11], ['defense', 12]];
  function build(s, b, addCol, inter) {
    const R = mulberry32(rh(Math.round(s.x), Math.round(s.z), 502)), X = s.x, Z = s.z, TMs = TM();
    const snow = s.bio === 'neve' || s.bio === 'cristal' || ice(X, Z) > 20, dry = snow || s.bio === 'vulcao' || s.bio === 'deserto';
    const stone = snow ? 0xf0f4f8 : s.bio === 'vulcao' ? 0x8a766c : s.bio === 'deserto' ? 0xe8d2a0 : s.bio === 'campos' || s.bio === 'flores' ? 0xb5ab98 : 0x8fa07a;
    const rockId = () => dry ? 'stones' : 'mossrock';
    const pos = (a, d) => [X + Math.cos(a) * d, Z + Math.sin(a) * d];
    const P = (k, a, d, ry, H, tint, y) => { const [x, z] = pos(a, d); return eh0(b, k, x, y || 0, z, ry == null ? R() * TAU : ry, H, tint) && { x, z }; };
    const col = (a, d, r) => { const [x, z] = pos(a, d); addCol({ x, z, r }); };
    /* modelo Tripo por largura (w) ou altura (h); sy estica na vertical; y negativo enterra */
    const tp = (id, a, d, ry, o) => { const m = TMs[id]; if (!m) return null; const [x, z] = pos(a, d), sc = o.h ? o.h / m.h : o.w / m.w;
      (b.tripo153 || (b.tripo153 = [])).push({ id, x, y: o.y || 0, z, ry, scale: sc, sy: sc * (o.sy || 1), sz: sc }); return { m, sc, x, z }; };
    /* pedra de terra úmida: Tripo (musgo/pedras); nos biomas secos, rocha do env.glb pintada com a cor do bioma */
    const ashT = s.bio === 'vulcao' ? 0x5a4a44 : stone;
    const pile = (a, d, ry, w) => { if (!dry) return tp('stones', a, d, ry, { w }); const [x, z] = pos(a, d); return ew0(b, 'rock_smallA', x, -.05, z, ry, w, ashT); };
    const rocks = (n, d, w0, w1, sy, r, gap) => { for (let i = 0; i < n; i++) { if (R() < (gap || 0)) continue; const a = s.ry + i / n * TAU + (R() - .5) * .35, w = w0 + R() * (w1 - w0);
      const dd = d + (R() - .5) * 1.2, ry = R() * TAU;
      if (dry) { const [x, z] = pos(a, dd); ew0(b, ['rock_tallA', 'rock_tallB', 'rock_tallC'][Math.floor(R() * 3)], x, -.05, z, ry, w * .8, ashT); col(a, d, w * .38); }
      else if (tp(rockId(), a, dd, ry, { w, sy: sy * (.85 + R() * .4), y: -.25 })) col(a, d, w * .38); } };
    const wall = (a, d, L, h, y) => { const m = TMs.wall; if (!m) return; const [x, z] = pos(a, d), ry = a + Math.PI / 2 + (R() - .5) * .5;
      (b.tripo153 || (b.tripo153 = [])).push({ id: 'wall', x, y, z, ry, scale: L / m.sx, sy: h / m.h, sz: 1.4 / m.sz });
      for (const f of [-.3, .3]) addCol({ x: x + Math.cos(ry) * L * f, z: z - Math.sin(ry) * L * f, r: 1 }); };
    const gr = Math.max(0, Math.min(9, danger(X, Z)));
    let label, mult = 1, minRar = 0, chest = null, guard = 0, npc = null;
    if (s.type === 'camp') {
      const k = R();
      P('tent_detailedOpen', 0, 0, s.ry, 3 + R() * .8); col(0, 0, 1.7);
      P('campfire_stones', s.ry + 1, 4.4 + R(), 0, .45); if (k < .6) P('log', s.ry + 2.2, 5, null, .5); if (k > .35) P('log_stack', s.ry + 4.8, 4.8, null, .8);
      P('barrel_small', s.ry + 2.4, 3.2, null, 1); P('sack', s.ry + 3, 2.8, null, .6); if (k < .5) P('crate_B_small', s.ry + 4.2, 3.6, null, .7);
      if (k > .5) P('tent_detailedOpen', s.ry + 3.6, 7.5, R() * TAU, 2.4);
      if (s.r2 < .5) P('bone_A', s.ry + 5.2, 5.5, null, .4);
      pile(s.ry + 5.5, 7 + R() * 2, R() * TAU, 2 + R() * 1.5);
      label = 'F · VASCULHAR ACAMPAMENTO ABANDONADO'; guard = s.r2 < .25 ? 2 : 0;
    } else if (s.type === 'ruin') {
      /* prédio medieval caído: casa, capela, taverna, moinho, forja, guilda ou torre, afundado no chão e achatado */
      const [id, H] = BUILDINGS[Math.floor(R() * BUILDINGS.length)], sy = .55 + R() * .3;
      const mp = tp(id, 0, 0, R() * TAU, { h: H * (.9 + R() * .2), y: -H * (.16 + R() * .2), sy });
      if (mp) col(0, 0, Math.min(mp.m.sx, mp.m.sz) * mp.sc * .42);
      if (R() < .55) { const a = s.ry + 1 + R() * 3, q = tp('house', a, 12 + R() * 3, R() * TAU, { h: 5.4, y: -2.2, sy: .5 + R() * .25 }); if (q) addCol({ x: q.x, z: q.z, r: 2.2 }); }
      const nw = 3 + Math.floor(R() * 3); for (let i = 0; i < nw; i++) wall(s.ry + i * TAU / nw + (R() - .5) * .7, 9 + R() * 3.5, 4 + R() * 3, 1 + R() * 2.4, -.35 - R() * .4);
      for (let i = 0; i < 3; i++) pile(s.ry + R() * TAU, 4 + R() * 4, R() * TAU, 2 + R() * 2);
      rocks(2 + Math.floor(R() * 2), 10 + R() * 3, 3, 5, .8, 1, .2);
      for (let i = 0; i < 2; i++) P(R() < .5 ? 'rubble_large' : 'rubble_half', s.ry + R() * TAU, 5 + R() * 3, null, 1.1, stone);
      const cd = mp ? Math.max(mp.m.sx, mp.m.sz) * mp.sc * .5 + 2.6 : 6; chest = { k: 'chest_gold', a: s.ry + 3.14, d: cd, H: 1 };
      label = 'F · ABRIR BAÚ DA RUÍNA'; mult = 2; minRar = 1;
    } else if (s.type === 'chest') {
      rocks(4 + (R() < .4 ? 1 : 0), 3.6, 2.8, 3.8, 1.5, 1.7, 0);
      P('tree_dead_large', s.ry + .8, 7.5, null, 4.6 + R() * 1.6); if (R() < .5) P('bone_A', s.ry + 2, 5, null, .4);
      chest = { k: 'chest', a: 0, d: 0, H: .9 }; label = 'F · ABRIR BAÚ ESCONDIDO'; mult = 1.4; minRar = 1;
    } else if (s.type === 'altar') {
      /* círculo de pedras antigas em pé, laje de pedras no meio, velas e lanternas */
      rocks(5 + Math.floor(R() * 2), 5.6, 2.2, 3.2, 1.9, 1.4, .12);
      pile(0, 0, s.ry, 2.6); col(0, 0, 1.2); P('candle_triple', 0, 0, s.ry, .5, undefined, 1.0);
      P('lantern_standing', s.ry + 1, 2.8, null, 1.6); if (R() < .6) P('lantern_standing', s.ry - 1, 2.8, null, 1.6);
      if (R() < .5) P('skull', s.ry + 2.4, 2.2, null, .5);
      label = 'F · REZAR NO ALTAR ANTIGO';
    } else if (s.type === 'carcass') {
      P('ribcage', 0, 0, s.ry, 1.3 + R() * .6); P('skull', s.ry + 1, 2.2, null, .5);
      for (let i = 0, n = 2 + Math.floor(R() * 3); i < n; i++) P(R() < .7 ? 'bone_A' : 'skull', s.ry + 2 + i * 2.1, 3 + R(), null, .5);
      P('sword_shield', s.ry + 2.6, 1.8, null, 1); P('sack', s.ry + 3.4, 2.4, null, .6); if (R() < .4) P('barrel_small', s.ry + 3.9, 3.2, null, .9);
      if (s.r2 < .5) { P('cart', s.ry + 4.4, 4.5, s.ry, 1.5 + R() * .4); col(s.ry + 4.4, 4.5, 1.4); } else pile(s.ry + 4.4, 3.5, R() * TAU, 1.8);
      label = 'F · REVISTAR OS RESTOS'; mult = .8;
    } else if (s.type === 'den') {
      rocks(6, 5.6, 3, 4.6, 1.5, 1.4, .15);
      P('post_skull', s.ry + .4, 4.4, null, 2.4 + R() * .5); P('post_skull', s.ry - .9, 4.4, null, 2.4 + R() * .5);
      P('ribcage', s.ry + 2.2, 2.4, null, 1.3); P('skull', s.ry + 3, 2, null, .5); for (let i = 0; i < 3; i++) P('bone_A', s.ry + i * 2.1, 3, null, .5);
      P('tree_dead_large', s.ry + 3.8, 8.5, null, 4.8 + R() * 1.4);
      chest = { k: 'chest', a: s.ry + 3.14, d: 1.1, H: .9 }; label = 'F · ABRIR BAÚ DO COVIL'; mult = 1.6; minRar = 1; guard = 2 + (gr >= 4 ? 1 : 0) + (s.r2 < .3 ? 1 : 0);
    } else {
      /* viajante parado junto a uma fogueira: peregrino, mercador ambulante ou caçador */
      const kind = s.r2 < .34 ? 'peregrino' : s.r2 < .67 ? 'mercador' : 'cacador';
      P('campfire_stones', s.ry, 2.6, 0, .45); P('log', s.ry + 1.4, 3.4, null, .5); P('sack', s.ry + 2.4, 3, null, .6);
      if (kind === 'mercador') { P('cart', s.ry + 3.4, 5, s.ry, 1.6); col(s.ry + 3.4, 5, 1.5); P('barrel', s.ry + 4, 3.6, null, 1); }
      else if (kind === 'cacador') { P('tent_detailedOpen', s.ry + 3.4, 5.5, R() * TAU, 2.6); col(s.ry + 3.4, 5.5, 1.5); }
      else pile(s.ry + 3.4, 4.6, R() * TAU, 1.8);
      npc = kind; label = 'F · FALAR';
    }
    let cx = X, cz = Z;
    if (chest) { const [x, z] = pos(chest.a, chest.d); cx = x; cz = z; P(chest.k, chest.a, chest.d, s.ry, chest.H); }
    const done = () => !!(run && run.enc502 && run.enc502[s.id]);
    const it = { type: 'enc502', x: cx, z: cz, r: 3.2, label, hidden: !npc && done(), use: () => use(s, it, mult, minRar, label) };
    if (s.type === 'altar') { it.r = 3.6; it.hidden = false; }
    if (!npc) inter.push(it);
    const old = BUILT.get(s.id); BUILT.set(s.id, { s, guard, spawned: old ? old.spawned : false, npc, npcObj: old ? old.npcObj : null });
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

  /* ---------- viajantes parados (peregrino, mercador ambulante, caçador errante): modelos do Povo482 ---------- */
  const WHO = {
    peregrino: { sub: 'Peregrino', names: [['Irmão Aldren', 'm'], ['Irmã Maud', 'f'], ['Peregrino Osric', 'm']], lines: [
      'Caminho para Aster desde a primeira geada. As Fendas abrem mais perto a cada lua.',
      'Reze antes de dormir. O que atravessa as Fendas não pede licença.',
      'Os mortos não descansam nesta estrada. Mantenha a fogueira acesa.'] },
    mercador: { sub: 'Mercador ambulante', names: [['Brígida, a mercadora', 'f'], ['Mercadora Elsbeth', 'f'], ['Mercadora Petronela', 'f']], lines: [
      'Vendo o que sobrou das caravanas. O resto ficou na estrada, com quem o carregava.',
      'Ouro não compra a volta para casa, viajante. Mas ajuda no caminho.',
      'Se achar um covil por perto, não diga que fui eu quem avisou.'] },
    cacador: { sub: 'Caçador errante', names: [['Caçador Voss', 'm'], ['Caçadora Mirae', 'f'], ['Caçador Kargan', 'm']], lines: [
      'Rastreei algo grande por esta mata. Não é bicho. Dorme mal quem já viu os olhos dele.',
      'A Ordem paga pouco e esquece rápido. Os monstros, não.',
      'Cuidado com os covis: o que vive neles aprendeu a esperar.'] }
  };
  function spawnNpc(e) {
    const s = e.s, w = WHO[e.npc], R = mulberry32(rh(Math.round(s.x), Math.round(s.z), 503)), [name, sex] = w.names[Math.floor(R() * w.names.length)];
    const a = s.ry + .7, x = s.x + Math.cos(a) * 3.2, z = s.z + Math.sin(a) * 3.2, pk = arr => arr[Math.floor(R() * arr.length)];
    const m = makeChibi({ body: pk([0x6b4a2a, 0x3a5fd0, 0x8a2b4a, 0x2f7a4a, 0xb39a6a, 0x7a5a9a]), hair: pk([0x222222, 0xc85a1e, 0xe8e8ff, 0x6b4a2a, 0xd8b060]), wep: 'none', gk: pk(['Knight', 'Barbarian', 'Mage', 'Rogue']), scale: .9 });
    m.root.position.set(x, 0, z); m.root.userData.terrainRoot245 = true; scene.add(m.root);
    let k = 0;
    const n = { kind: 'traveler', m, x, z, face: Math.atan2(s.x - x, s.z - z), r: .45, name, short: name, col: '#d9c9a8', t: R() * 9, label: 'F · FALAR COM ' + name.toUpperCase(), gone: false };
    n.use = () => speech153(n, w.lines[(k++) % w.lines.length], w.sub);
    npcs.push(n); e.npcObj = n;
    try {
      const P = window.Povo482, seed = rh(Math.round(s.x), Math.round(s.z), 504);
      if (P && P.register) P.register(n, e.npc === 'cacador' ? { role: 'hunter', family: 'soldado', cls: 0, rank: 1, sex, seed, isCurrent: () => !n.gone && L.mode === 'world' } : { role: 'civil', sex, seed });
    } catch (_) {}
  }
  function dropNpc(e) { const n = e.npcObj; if (!n) return; n.gone = true; try { scene.remove(n.m.root); } catch (_) {} e.npcObj = null; }

  /* ---------- covil / acampamento vigiado: criaturas aparecem quando você chega ---------- */
  const BUILT = new Map();
  setInterval(() => {
    try {
      if (typeof started === 'undefined' || !started || !player || !run || L.mode !== 'world' || player.dead) return;
      for (const [id, e] of BUILT) {
        const d = Math.hypot(e.s.x - player.x, e.s.z - player.z);
        if (e.npc) { if (!e.npcObj && d < 90) spawnNpc(e); else if (e.npcObj && d > 150) dropNpc(e); }
        if (d > 400) { dropNpc(e); BUILT.delete(id); continue; }
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
