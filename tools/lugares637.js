/* v639 (Ian: "lugares no caminho, como Skyrim"): um lugar a cada ~300 m de caminhada, cada um no seu bioma.
   Tipos: ruínas, acampamento de bandidos, altar, entrada de caverna, torre de vigia, fazenda, cemitério.
   - Os lugares saem de uma grade de 224 m (hash do mundo), então são sempre os mesmos; fora de cidades, estradas, rios e mar.
   - Estruturas: peças do kit do cenário (EnvBatch/InstancedMesh) com colisor; baú e guardiões usam o que já existe
     (envChest + rollItem como o baú das ruínas; spawnKind + worldKinds124 do bioma, como a emboscada da caravana).
   - Ao chegar a 120 m o lugar é descoberto (profile.lug637) e passa a aparecer na bússola e no mapa 3D.
   Chamado por loadChunk (250) no fim da montagem do pedaço. */
(function () {
  const CELL = 224, TAU = Math.PI * 2;
  const TYPES = {
    ruina: { name: 'Ruínas esquecidas', ico: '◭', col: '#c9b27a', map: 'ruin', guards: [0, 2], chest: .8 },
    acampamento: { name: 'Acampamento de bandidos', ico: '▲', col: '#e0a85a', map: 'camp', guards: [3, 5], chest: 1 },
    altar: { name: 'Altar esquecido', ico: '✦', col: '#9fe8ff', map: 'altar', guards: [0, 1], chest: 0 },
    caverna: { name: 'Entrada de caverna', ico: '◖', col: '#b9a0e8', map: 'cave', guards: [2, 4], chest: 1 },
    torre: { name: 'Torre de vigia', ico: '♜', col: '#e8e2d0', map: 'tower', guards: [2, 3], chest: .7 },
    fazenda: { name: 'Fazenda', ico: '⌂', col: '#9ccf6a', map: 'farm', guards: [0, 0], chest: 0 },
    cemiterio: { name: 'Cemitério', ico: '✝', col: '#c8c8d8', map: 'grave', guards: [3, 4], chest: .9 }
  };
  const BIO = {
    campos: ['fazenda', 'fazenda', 'torre', 'altar', 'acampamento', 'ruina', 'cemiterio'],
    flores: ['fazenda', 'altar', 'ruina', 'torre', 'acampamento'],
    floresta: ['acampamento', 'altar', 'cemiterio', 'ruina', 'caverna', 'torre', 'acampamento'],
    pantano: ['altar', 'cemiterio', 'ruina', 'caverna', 'acampamento'],
    neve: ['acampamento', 'caverna', 'ruina', 'torre', 'altar'],
    vulcao: ['ruina', 'caverna', 'altar', 'cemiterio'],
    deserto: ['ruina', 'acampamento', 'altar', 'cemiterio', 'torre'],
    cristal: ['altar', 'caverna', 'ruina']
  };
  const H = { sites: 0, built: 0, spawned: 0, found: 0, TYPES };
  window.Lugares637 = H;
  const roadCache = new Map();
  function roads(x, z) { const k = Math.floor(x / 512) + ',' + Math.floor(z / 512); let s = roadCache.get(k); if (!s) { if (roadCache.size > 60) roadCache.clear(); s = roadSegs(Math.floor(x / 512) * 512 + 256, Math.floor(z / 512) * 512 + 256, 1); roadCache.set(k, s) } return s }
  const cache = new Map();
  function siteOfCell(ci, cj) {
    const key = ci + ',' + cj + ',' + WSEED; if (cache.has(key)) return cache.get(key);
    let r = null; const h = rh(ci, cj, 6379);
    if (h % 100 < 84) {
      const x = (ci + .18 + ((h >> 8) & 255) / 255 * .64) * CELL, z = (cj + .18 + ((h >> 16) & 255) / 255 * .64) * CELL;
      const nc = nearestCity(x, z);
      if (nc.d >= (nc.c.capital ? 330 : 170) && x > -3800 && !onRoad(roads(x, z), x, z, 22) && !outpostPoint361(Math.round(x / CH), Math.round(z / CH)) && !ruinAt(Math.round(x / CH), Math.round(z / CH))) {
        let wet = false; try { wet = riverClear239(x, z) || riverClear239(x + 14, z) || riverClear239(x - 14, z) || riverClear239(x, z + 14) || riverClear239(x, z - 14) } catch (_) { }
        if (!wet && terrH(x, z) < 110) {
          const B = biomeAt(x, z), tb = BIO[B]; if (tb) { const type = tb[(h >>> 24) % tb.length]; r = { id: ci + ',' + cj, x, z, type, B, ry: ((h >> 4) & 1023) / 1023 * TAU, cx: Math.round(x / CH), cz: Math.round(z / CH), h } }
        }
      }
    }
    if (cache.size > 4000) cache.clear(); cache.set(key, r); return r;
  }
  const prof = () => { profile.lug637 = profile.lug637 || {}; return profile.lug637 };
  /* ---- construção ---- */
  function build(ch, g, addCol, cityD) {
    if (typeof ENV === 'undefined' || !ENV.ok) return;
    const x0 = ch.cx * CH, z0 = ch.cz * CH; ch.lug637 = [];
    for (let ci = Math.floor((x0 - 32) / CELL); ci <= Math.floor((x0 + 32) / CELL); ci++) for (let cj = Math.floor((z0 - 32) / CELL); cj <= Math.floor((z0 + 32) / CELL); cj++) {
      const s = siteOfCell(ci, cj); if (!s || s.cx !== ch.cx || s.cz !== ch.cz) continue;
      const q = cityD(s.x, s.z); if (q.clear) continue;
      try { place(ch, g, addCol, s); ch.lug637.push(s); H.built++ } catch (e) { console.warn('lugares637', s.type, e) }
    }
  }
  function place(ch, g, addCol, s) {
    const b = new EnvBatch(), P = mulberry32(rh(s.cx, s.cz, 6380)), cs = Math.cos(s.ry), sn = Math.sin(s.ry), T = s.B === 'neve' ? 0xf0f4f8 : undefined;
    const W = (dx, dz) => [s.x + dx * cs + dz * sn, s.z - dx * sn + dz * cs];
    const w = (k, dx, dz, wd, solid = true, rot = 0) => { const [x, z] = W(dx, dz); if (solid) envSolidEW357(addCol, b, k, x, 0, z, s.ry + rot, wd, T); else EW(b, k, x, 0, z, s.ry + rot, wd, T) };
    const hh = (k, dx, dz, ht, solid = false, rot = 0) => { const [x, z] = W(dx, dz); const sc = EH(b, k, x, 0, z, s.ry + rot, ht, T); if (solid) envSolid357(addCol, k, x, 0, z, s.ry + rot, sc) };
    const ring = (n, r, f) => { for (let i = 0; i < n; i++) { const a = i / n * TAU + P() * .15; f(Math.cos(a) * r, Math.sin(a) * r, a, i) } };
    const pickOf = a => a[Math.floor(P() * a.length)];
    let chestAt = W(0, 5);
    switch (s.type) {
      case 'ruina':
        ring(6, 6.5, (x, z, a, i) => { if (i === 4) return; w(pickOf(['statue_column', 'statue_columnDamaged', 'pillar', 'statue_column']), x, z, 1.6, true) });
        hh('statue_head', 0, 0, 1.6); w('rubble_large', -3, 2, 3.6, false); w('rubble_half', 3, -3, 3, false); w('rubble_large', 1, 7.5, 3.4, false);
        if (P() < .5) hh('post_skull', 2, -1.5, 2.4); chestAt = W(0, 2.8); break;
      case 'acampamento':
        hh('campfire_stones', 0, 0, .7); w('tent_detailedOpen', -5, 3, 3.6, true, 0); w('tent_detailedOpen', 5, 2, 3.6, true, 2.4); w('tent_detailedOpen', 0, -6, 3.6, true, 1);
        w('crate_A_big', 3, 5, 1.1); w('barrel', -3, -4, 1); w('weaponrack', 6.5, -3, 2.4); w('sack', -2, 5, .9, false); hh('log', 2.6, 0, .6, false, 1.2); hh('log', -2.6, .6, .6, false, 2.4);
        chestAt = W(-6.5, -2); break;
      case 'altar':
        hh('statue_obelisk', 0, 0, 5.5, true); ring(4, 4.4, (x, z) => hh('lantern_standing', x, z, 2.2)); w('rubble_half', 4, 4, 2.6, false); w('rubble_half', -4.5, -3, 2.4, false); hh('campfire_stones', 0, 3.2, .5);
        break;
      case 'caverna': {
        const ys = [['rock_largeA', -6, 0, 6.5], ['rock_largeB', -4, -3.5, 7], ['rock_largeC', 0, -5, 7.5], ['rock_largeD', 4, -3.5, 7], ['rock_largeA', 6, 0, 6.5], ['rock_tallA', -2.5, -1.5, 5], ['rock_tallB', 2.5, -1.5, 5]];
        for (const [k, dx, dz, wd] of ys) w(k, dx, dz, wd, true);
        const [mx, mz] = W(0, 0.6), disc = new THREE.Mesh(new THREE.CircleGeometry(2.6, 20), new THREE.MeshBasicMaterial({ color: 0x03030a })); disc.position.set(mx, 1.9, mz); disc.rotation.y = s.ry; disc.scale.set(1, .95, 1); disc.userData.own = 1; g.add(disc);
        hh('post_skull', -3, 4, 2.4); hh('lantern_standing', 3.2, 4.2, 2.2); hh('skull', 1.5, 4.6, .4); chestAt = W(0, 3.2); break; }
      case 'torre':
        w('building_tower_A_blue', 0, 0, 7.5, true); hh('barrel', 4.5, 3.5, 1, true); hh('crate_B_small', -4.2, 3.8, .9, true); hh('banner_blue', 0, 5.6, 4); w('sack', 3, -4.5, .9, false); chestAt = W(-3.4, 5.4); break;
      case 'fazenda':
        w('building_home_B_green', 0, 0, 9, true); w('building_windmill_blue', 13, -4, 8, true); hh('wheelbarrow', -5.5, 6, 1.1); hh('log_stack', 6.4, 5.6, 1.4, true); hh('sack', -3, 7, .9); hh('barrel_large', 5, 7, 1.2, true);
        for (let i = 0; i < 6; i++) w('fence_broken', -10 + i * 3.1, 11, 3, false, Math.PI / 2 * 0); for (let i = 0; i < 4; i++) w('hedge', -9.5, 6 - i * 3, 3, false, Math.PI / 2);
        break;
      case 'cemiterio':
        for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { if (P() < .15) continue; const k = pickOf(['gravestone', 'grave_A', 'gravemarker_A']), [x, z] = W(-3.6 + i * 3.6, -5.4 + j * 3.6), sc = EH(b, k, x, 0, z, s.ry + (P() - .5) * .3, 1.2 + P() * .5, T); envSolid357(addCol, k, x, 0, z, s.ry, sc) }
        hh('tree_dead_large', -8.5, 2, 12); hh('tree_dead_medium', 8.5, -3, 9); hh('statue_column', 0, 8, 3.2, true); hh('post_skull', 6.5, 7, 2.4); chestAt = W(0, -8.4); break;
    }
    envOwn(g, b.mesh(ENVMAT));
    const rec = prof()[s.id];
    /* baú (como o das ruínas): uma vez só por jogador */
    const def = TYPES[s.type];
    if (def.chest && !(rec && rec.o) && (s.h % 100) / 100 < def.chest) {
      const cg = envChest(false).g; cg.position.set(chestAt[0], 0, chestAt[1]); cg.rotation.y = s.ry; g.add(cg);
      const it = {
        type: 'lugar637', chunk: ch, grp: cg, x: chestAt[0], z: chestAt[1], r: 2.4, label: 'F · ABRIR BAÚ · ' + def.name.toUpperCase(),
        use: () => { it.hidden = true; g.remove(cg); const r2 = prof()[s.id] = prof()[s.id] || { x: s.x, z: s.z, t: s.type }; r2.o = 1; store.set('pds2_profile', profile); const gr = danger(s.x, s.z), gold = Math.round(70 * GR[gr].gold); run.gold += gold; floater(chestAt[0], chestAt[1], '+' + fmt(gold) + ' ouro', '#ffd54f', true); sfx('coin'); addItem(rollItem(gr, false)) }
      }; L.inter.push(it);
    }
    if (s.type === 'altar') {
      const [ax, az] = W(0, 2.2), it = {
        type: 'lugar637', chunk: ch, x: ax, z: az, r: 3.2, label: 'F · REZAR NO ALTAR',
        use: () => { const r2 = prof()[s.id] = prof()[s.id] || { x: s.x, z: s.z, t: s.type }, now = Date.now(); if (r2.a && now - r2.a < 300000) { toast('<b>[ALTAR]</b> O altar ainda está quieto. Volte em alguns minutos.', 3500); return } r2.a = now; store.set('pds2_profile', profile); player.hp = player.maxhp; try { if (player.mp != null && player.maxmp) player.mp = player.maxmp } catch (_) { } toast('<b>[ALTAR]</b> Uma luz fria envolve você. Vida restaurada.', 4000); try { sfx('heal') } catch (_) { } }
      }; L.inter.push(it);
    }
  }
  /* ---- guardiões e descoberta ---- */
  const live = new Map();
  function tick() {
    try {
      if (typeof L === 'undefined' || L.mode !== 'world' || !player || typeof chunks === 'undefined') return;
      const D = prof();
      for (const ch of chunks.values()) {
        if (!ch.lug637) continue;
        for (const s of ch.lug637) {
          const d = Math.hypot(s.x - player.x, s.z - player.z), def = TYPES[s.type]; let rec = D[s.id];
          if (d < 120 && !(rec && rec.d)) { rec = D[s.id] = Object.assign(rec || {}, { x: s.x, z: s.z, t: s.type, d: 1 }); H.found++; try { store.set('pds2_profile', profile) } catch (_) { } try { toast('<b>[LOCAL]</b> ' + def.name + ' descoberto.', 3500) } catch (_) { } }
          if (d < 75 && def.guards[1] > 0 && !(rec && rec.c) && !live.has(s.id)) {
            const P = mulberry32(rh(s.cx, s.cz, 6381)), n = def.guards[0] + Math.floor(P() * (def.guards[1] - def.guards[0] + 1)), dg = danger(s.x, s.z), gr = Math.max(0, Math.min(9, Math.max(dg, rankOf() - 2))), list = [];
            for (let i = 0; i < n; i++) { let x = 0, z = 0, ok = false; for (let t = 0; t < 8 && !ok; t++) { const a = i / n * TAU + P() * 2, r = 5 + P() * 8; x = s.x + Math.cos(a) * r; z = s.z + Math.sin(a) * r; ok = worldFreeL(x, z) } if (!ok) continue; const e = spawnKind(wpick(worldKinds124(dg, x, z)).k, x, z, gr, { wild: true }); e.lug637 = s.id; list.push(e) }
            live.set(s.id, { list, s }); H.spawned += list.length;
          }
        }
      }
      for (const [id, v] of live) {
        const chLoaded = chunks.has(v.s.cx + ',' + v.s.cz), alive = v.list.filter(e => !e.dead && !e.gone);
        if (!alive.length) { const rec = D[id] = D[id] || { x: v.s.x, z: v.s.z, t: v.s.type }; rec.c = 1; try { store.set('pds2_profile', profile) } catch (_) { } live.delete(id); continue }
        if (!chLoaded && Math.hypot(v.s.x - player.x, v.s.z - player.z) > 260) { for (const e of alive) if (!e.aggro) { e.gone = true; try { scene.remove(e.m.root) } catch (_) { } const i = enemies.indexOf(e); if (i >= 0) enemies.splice(i, 1) } live.delete(id) }
      }
    } catch (e) { if (!H.w) { H.w = 1; console.warn('lugares637 tick', e) } }
  }
  setInterval(tick, 600);
  /* ---- para bússola e mapa ---- */
  H.known = () => { const D = prof(), out = []; for (const id in D) { const r = D[id]; if (r && r.d && isFinite(r.x) && TYPES[r.t]) out.push({ id, x: r.x, z: r.z, type: r.t, name: TYPES[r.t].name, ico: TYPES[r.t].ico, col: TYPES[r.t].col, map: TYPES[r.t].map, cleared: !!r.c }) } return out };
  H.build = build; H.siteOfCell = siteOfCell; H.CELL = CELL;
  H.sitesNear = (x, z, rad) => { const out = []; for (let ci = Math.floor((x - rad) / CELL); ci <= Math.floor((x + rad) / CELL); ci++) for (let cj = Math.floor((z - rad) / CELL); cj <= Math.floor((z + rad) / CELL); cj++) { const s = siteOfCell(ci, cj); if (s) out.push(s) } return out };
})();
