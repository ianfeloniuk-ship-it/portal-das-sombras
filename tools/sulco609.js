/* Missão fixa #9 «O Sulco no Metal: As Marcas do Arquiteto» (v647). Forja de Kael e Fenda de Fronteira.
   Depois de Kael examinar a arma marcada (missão lateral da forja), ele prova que a marca escura foi gravada depois da forja e aponta uma
   Fenda de Fronteira ativa ao sul de Aster. Lá dentro, o Guardião Acorrentado é puxado por 5 pilares de corrente.
   Quebrar os 5 pilares antes do golpe final: a arma é purificada e Kael entrega uma peça Rara limpa de maldição.
   Abater direto: a Fenda fecha mais rápido (20 s) e rende +3 minérios puros. */
(function () {
  'use strict';
  let world = null, worldT = 0, portal = null, portalInter = null, pillars = [], boss = null, pullT = 6, lastSave = 0, busy = false;
  const cxz = z => { const t = Math.min(1, Math.max(0, (z - 100) / 160)), s = t * t * (3 - 2 * t); return s * (130 * Math.sin(z * .005712) + 52 * Math.sin(z * .013369) + 18 * Math.sin(z * .033069)); };
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q009 = profile.fixas545.q009 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function aster() { return typeof regionCity === 'function' ? regionCity(0, 0) : { x: 0, z: 0, name: 'Aster' }; }
  const dAster = () => Math.hypot(player.x - aster().x, player.z - aster().z);
  /* ponto fixo ao sul de Aster, longe de Fendas/portões do mundo; guardado na missão */
  function spot(fresh) {
    const s = S(); if (s && s.spot && (s.lock || !fresh)) return s.spot;
    let best = null, bestR = 1e9;
    for (const z of [140, 155, 125, 170, 110, 185, 200, 215, 230]) for (const off of [16, -16, 30, -30, 45, -45, 60, -60]) {
      const x = cxz(z) + off, ok = typeof gates === 'undefined' || !gates.some(g => Math.hypot(g.x - x, g.z - z) < 30);
      const hs = [[0, 0], [6, 0], [-6, 0], [0, 6], [0, -6]].map(([a, b]) => terrH(x + a, z + b)), r = Math.max(...hs) - Math.min(...hs);
      if (ok && hs[0] > 0.5 && r < bestR) { best = { x, z }; bestR = r; }
    }
    best = best || { x: cxz(140) + 16, z: 140 };
    if (s) { s.spot = best; if (fresh) s.lock = true; save(); }
    return best;
  }
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q009; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  if (typeof LORE !== 'undefined') LORE.q009_marca = ['A marca gravada depois da forja', 'Kael provou que a marca escura da arma foi gravada a frio, depois da forja: o Arquiteto marca o dono antes de ele cair. A Fenda de Fronteira guarda um guardião preso por cinco pilares de corrente.'];

  /* ---------- 1. Kael prova a marca e aponta a Fenda ---------- */
  function sceneKael() {
    const s = S(); if (busy) return; busy = true;
    const lines = [
      'Kael: — Veja você mesmo. Se a marca fosse da forja, o metal em volta dela estaria dobrado pelo martelo. Não está: ela foi gravada depois, a frio.',
      'Kael: — O dono não caiu e foi marcado. Foi marcado e depois caiu. É o mesmo sulco escuro que a Lyra viu nos guardiões.',
      'Kael: — A Ordem registrou uma Fenda de Fronteira ativa ao sul de Aster. Tem um guardião preso lá dentro por correntes de contenção. Leve a arma e confira.'
    ];
    const end = () => { s.phase = 'fenda'; s.t0 = Date.now(); save(); busy = false; try { unlockLore('q009_marca'); } catch (_) {} try { toast('<b>[MISSÃO]</b> O Sulco no Metal: entre na Fenda de Fronteira, ao sul de Aster, e confronte o guardião acorrentado.', 8000); } catch (_) {} };
    try { if (window.Intro401) Intro401.dialog('Kael', lines, end); else { toast(lines.join('<br>'), 9000); end(); } } catch (_) { end(); }
  }

  /* ---------- 2. Fenda de Fronteira no mundo ---------- */
  function buildPortal() {
    const p = spot(), y = terrH(p.x, p.z), g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, .28, 10, 36), new THREE.MeshBasicMaterial({ color: 0xff3a2a }));
    ring.position.y = 2.8; g.add(ring);
    const core = new THREE.Mesh(new THREE.CircleGeometry(2.2, 28), new THREE.MeshBasicMaterial({ color: 0x5a0a14, transparent: true, opacity: .75, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    core.position.y = 2.8; core.userData.pulse = 1; g.add(core);
    const light = new THREE.PointLight(0xff3a2a, 1.8, 18); light.position.y = 2.8; g.add(light);
    g.position.set(p.x, y, p.z); g.userData.terrainAbsolute245 = true; scene.add(g);
    portal = g;
    portalInter = { x: p.x, z: p.z, r: 4.2, label: 'F · ENTRAR NA FENDA DE FRONTEIRA', use: enterFenda };
    L.inter.push(portalInter);
  }
  function dropPortal() {
    if (portal) { try { scene.remove(portal); portal.traverse(o => { o.geometry && o.geometry.dispose && o.geometry.dispose(); o.material && o.material.dispose && o.material.dispose(); }); } catch (_) {} }
    portal = null;
    if (portalInter && L.inter) L.inter = L.inter.filter(i => i !== portalInter);
    portalInter = null;
  }
  function enterFenda() {
    const s = S(); if (phase() !== 'fenda' || typeof L === 'undefined' || L.mode !== 'world') return;
    s.broken = 0; s.entradas = (s.entradas || 0) + 1; save();
    dropPortal(); pillars = []; boss = null;
    buildSpecial('sulco', null);
  }

  /* ---------- 3. Sala do Guardião Acorrentado (kind 'sulco') ---------- */
  const ss = specialSetup2;
  specialSetup2 = function (kind, S0, arg) {
    ss.apply(this, arguments);
    if (kind !== 'sulco') return;
    S0.sulco = true; S0.spawned = false; S0.broken = 0; pullT = 6; pillars = []; boss = null; S().broken = 0;
  };
  function mkPillar(i, bx, bz) {
    const a = i / 5 * Math.PI * 2 - Math.PI / 2, x = bx + Math.cos(a) * 9.5, z = bz + Math.sin(a) * 9.5;
    const g = new THREE.Group();
    const col = new THREE.Mesh(new THREE.CylinderGeometry(.55, .75, 3.6, 10), new THREE.MeshStandardMaterial({ color: 0x35373d, roughness: .6, metalness: .7 }));
    col.position.y = 1.8; g.add(col);
    const rune = new THREE.Mesh(new THREE.TorusGeometry(.8, .09, 8, 22), new THREE.MeshBasicMaterial({ color: 0xff4a2a }));
    rune.rotation.x = Math.PI / 2; rune.position.y = 2.6; g.add(rune);
    g.position.set(x, 0, z); L.group.add(g);
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 1, 6), new THREE.MeshBasicMaterial({ color: 0xc9c2b4 }));
    L.group.add(chain);
    const p = { i, x, z, g, rune, chain, broken: false, inter: null };
    p.inter = { x, z, r: 2.9, label: 'F · QUEBRAR A CORRENTE DO PILAR (' + (S().broken || 0) + '/5)', use: () => breakPillar(p) };
    L.inter.push(p.inter);
    return p;
  }
  function relabel() { const n = S().broken || 0; for (const p of pillars) if (!p.broken) p.inter.label = 'F · QUEBRAR A CORRENTE DO PILAR (' + n + '/5)'; }
  function breakPillar(p) {
    if (p.broken || !boss || boss.dead) return;
    p.broken = true; const s = S(); s.broken = (s.broken || 0) + 1; L.special.broken = s.broken;
    L.inter = L.inter.filter(i => i !== p.inter);
    p.chain.visible = false; p.rune.material.color.setHex(0x3a3a3a);
    try { fxBurst(p.x, 1.6, p.z, 0xff7a3a, 18, 4); fxRing(p.x, p.z, 0xff7a3a, 3, .5); sfx('boom'); shake(.35); } catch (_) {}
    try { floater(p.x, p.z, 'CORRENTE QUEBRADA ' + s.broken + '/5', '#ffb04a', true); } catch (_) {}
    relabel();
    if (s.broken >= 5) {
      s.livre = true; boss.freed609 = true;
      try { fxRing(boss.x, boss.z, 0x9fe8ff, 6, .9); sfx('level'); bigText('O GUARDIÃO ESTÁ LIVRE', 1800); } catch (_) {}
      try { toast('<b>[GUARDIÃO]</b> — A corrente... parou de puxar. Termine o que o Arquiteto começou, Viajante. Rápido.', 8000); } catch (_) {}
    } else {
      try { toast('<b>[FENDA]</b> Pilar partido (' + s.broken + '/5). O Guardião ainda puxa você pelas correntes que sobraram.', 4500); } catch (_) {}
    }
  }
  function sulcoTick(dt) {
    const sp = L.special; if (!sp || sp.kind !== 'sulco') return;
    if (!sp.spawned && sp.t > 1.5) {
      sp.spawned = true;
      const pool = typeof BOSSES !== 'undefined' ? BOSSES : null;
      const b = spawnBoss(0, -10, sp.gr, pool ? pool[Math.floor(Math.random() * pool.length)] : undefined);
      dunScale(b, sp.gr, Math.max(1, run.level || 1));
      b.name = b.short = 'Guardião Acorrentado'; b.aggro = true; b.sulco609 = true; b.spd = (b.spd || 1) * .85; boss = b;
      for (let i = 0; i < 5; i++) pillars.push(mkPillar(i, b.x, b.z));
      try { bossAggro(b); } catch (_) {}
      try { toast('<b>[FENDA]</b> Cinco pilares de corrente prendem o Guardião. Quebre-os (F) para libertar o espírito antes do golpe final, ou abata-o enquanto as correntes o puxam.', 9000); } catch (_) {}
    }
    if (!boss) return;
    const n = S().broken || 0;
    sp.msg = boss.dead ? 'Fenda de Fronteira · Guardião derrotado' : 'Fenda de Fronteira · pilares quebrados ' + n + '/5';
    for (const p of pillars) {
      p.rune.rotation.z += dt * 1.4;
      if (p.broken) continue;
      if (boss.dead) { p.chain.visible = false; continue; }
      const ax = p.x, az = p.z, ay = 3.1, bx = boss.x, bz = boss.z, by = 1.5, dx = bx - ax, dy = by - ay, dz = bz - az, len = Math.hypot(dx, dy, dz) || 1;
      p.chain.position.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2); p.chain.scale.y = len;
      p.chain.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx / len, dy / len, dz / len));
    }
    if (boss.dead) return;
    const noPilar = !pillars.some(p => !p.broken && Math.hypot(player.x - p.x, player.z - p.z) < 4.5);
    if (n < 5 && !player.dead && noPilar) {
      pullT -= dt;
      if (pullT <= 0) {
        pullT = 6; const dx = boss.x - player.x, dz = boss.z - player.z, d = Math.hypot(dx, dz);
        if (d > 5) { const k = Math.min(4, d - 3) / d; player.x += dx * k; player.z += dz * k; try { fxRing(player.x, player.z, 0xff7a3a, 2, .4); sfx('laser'); } catch (_) {} try { toast('As correntes puxam você para o Guardião.', 1400); } catch (_) {} }
      }
    }
  }
  const obd = onBossDeath;
  onBossDeath = function (b) {
    obd.apply(this, arguments);
    try {
      if (!(L.special && L.special.kind === 'sulco')) return;
      const s = S(), tudo = (s.broken || 0) >= 5;
      s.escolha = tudo ? 'quebrar' : 'direto'; s.phase = 'kael'; s.pureza = tudo; save();
      if (tudo) {
        try { toast('<b>[FENDA]</b> O espírito do Guardião se solta e se vai. A marca escura da arma recuperada desbotou: está purificada. Volte a Kael.', 9000); } catch (_) {}
      } else {
        L.closeT = Math.min(L.closeT || 60, 20);
        const g = Math.min(9, L.special.gr || 0); run.res.cry[g] = (run.res.cry[g] || 0) + 3; save();
        try { toast('<b>[FENDA]</b> Guardião abatido com as correntes ainda presas. A Fenda fecha em 20 s. <b>+3 minérios ' + GR[g].id + ' puros.</b> A arma continua marcada: leve-a a Kael.', 9000); } catch (_) {}
      }
    } catch (e) { console.warn('Sulco609', e); }
  };

  /* ---------- 4. Kael encerra: peça Rara limpa (ou a arma marcada derretida) ---------- */
  function sceneEntrega() {
    const s = S(); if (busy) return; busy = true;
    let lines, gave = null;
    if (s.escolha === 'quebrar') {
      const t = Math.max(0, Math.min(8, rankOf())), kind = classShopKind290() || 'sword';
      gave = makeItem('w', t, 1, kind); gave.aff = rollAff2(t, 1); gave.name = gave.name + ' Purificada'; gave.sulco609 = true;
      lines = [
        'Kael: — O sulco desbotou. Olhe: o metal voltou a ser só metal. Nenhuma maldição segurando o dono pela mão.',
        'Kael: — Refundi a lâmina com o que sobrou do aço dela. Uma peça Rara, limpa. Essa é sua. E a marca que ficou no guardião, a Lyra vai querer ver.'
      ];
    } else {
      lines = [
        'Kael: — Você abateu o guardião com as correntes presas e trouxe minério puro. É bom aço. Mas a marca da arma continua escura: não confio em quem a empunhar.',
        'Kael: — Fundi a arma marcada. Não conserto o que o Arquiteto assinou. A Lyra vai querer saber o que você viu lá dentro.'
      ];
    }
    const end = () => {
      if (gave) { try { addItem(gave); } catch (_) { run.items.push(gave); } }
      s.done = true; s.phase = 'fim'; s.t = Date.now(); save(); busy = false;
      try { toast('<b>[MISSÃO]</b> O Sulco no Metal concluída: ' + (gave ? gave.name + ' (Rara, limpa de maldição) na bolsa.' : '+3 minérios puros e a arma marcada fundida.'), 8000); } catch (_) {}
    };
    try { if (window.Intro401) Intro401.dialog('Kael', lines, end); else { toast(lines.join('<br>'), 9000); end(); } } catch (_) { end(); }
  }

  /* ---------- objetivo (bússola/mapa) ---------- */
  function objective() {
    const ph = phase(); if (!ph) return null;
    if (typeof L !== 'undefined' && L.special && L.special.kind === 'sulco') {
      const n = S().broken || 0, alive = boss && !boss.dead;
      return { actTitle: 'O SULCO NO METAL', step: 2, totalSteps: 3, text: !boss ? 'Prepare-se: o Guardião Acorrentado desperta' : alive ? 'Quebre os pilares de corrente [F] ' + n + '/5 ou abata o Guardião' : 'Guardião derrotado: saia da Fenda', target: null };
    }
    if (ph === 'fenda') return { actTitle: 'O SULCO NO METAL', step: 2, totalSteps: 3, text: 'Entre na Fenda de Fronteira, ao sul de Aster [F]', target: spot() };
    const k = typeof vendor === 'function' ? vendor('Kael') : null;
    return { actTitle: 'O SULCO NO METAL', step: 3, totalSteps: 3, text: 'Leve o resultado a Kael, na Forja de Aster', target: k || { x: aster().x, z: aster().z } };
  }

  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile) return;
    if (L.special && L.special.kind === 'sulco') { sulcoTick(dt); return; }
    if (L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); portal = null; portalInter = null; pillars = []; boss = null; }
    if (performance.now() - worldT < 3500) return; /* espera o retorno da Fenda terminar (posição ainda velha) */
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) {
      const kw = window.Campaign327 && Campaign327.state('kael_weapon');
      if (kw && kw.done && free && dAster() < 120) sceneKael();
      return;
    }
    if (s.phase === 'fenda') {
      const s0 = S(); let sp0 = spot();
      if (!s0.lock && Math.hypot(player.x - sp0.x, player.z - sp0.z) < 230 && terrH(sp0.x, sp0.z) !== 0) sp0 = spot(true);
      const near = s0.lock && Math.hypot(player.x - sp0.x, player.z - sp0.z) < 170;
      if (near && !portal) buildPortal(); else if (!near && portal) dropPortal();
      if (portal) portal.traverse(o => { if (o.userData && o.userData.pulse) o.material.opacity = .6 + Math.sin(performance.now() / 260) * .18; });
    } else if (portal) dropPortal();
    if (s.phase === 'kael' && free && dAster() < 120) sceneEntrega();
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q009) Fixas545.LIVE.primeva_q009 = 'v647'; } catch (e) { console.warn('Sulco609', e); } };
  window.Sulco609 = { state: S, active, objective, enterFenda, breakPillar, get pillars() { return pillars; }, get boss() { return boss; }, spot, sceneKael, sceneEntrega };
})();
