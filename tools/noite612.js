/* Missão fixa #12 «A Noite em que Aster Ardeu» (v650). Três Muralhas de Aster e Bairro Externo. Ato VI.
   Depois do Corredor da Escolha (#11) e de 20 minérios minerados, um ataque atinge Aster de madrugada. Brann segura a brecha, Mira retira os feridos
   e uma carroça de remédios fica presa num beco em chamas, do lado oposto ao depósito de lingotes de Kael.
   Salvar a carroça (libertar e levar até Mira): evita a morte de 4 moradores e dá 2 Poções Concentradas por dia com Mira.
   Defender o depósito (3 ondas): preserva o aço de Kael e reduz em 15% o custo de aprimorar equipamento (Kael e Forja de Espólios).
   Fogo: o fogo da grama (Grass446.element) e chamas de cones; o jogador queima ao ficar dentro. Ao fim o fogo apaga; o lado que ficou sem socorro
   guarda uma mancha de queimado. Estado em profile.fixas545.q012. */
(function () {
  'use strict';
  const NEED = 20, DEP_HP = 100;
  let world = null, brann = null, brannInter = null, fires = [], cart = null, cartInter = null, depot = null, foes = [], marks = [], busy = false;
  let lastSave = 0, burnT = 0, spawnT = 3, waveGap = 0, worldT = 0, noteT = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q012 = profile.fixas545.q012 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function aster() { return typeof regionCity === 'function' ? regionCity(0, 0) : { x: 0, z: 0, name: 'Aster' }; }
  const dAster = () => Math.hypot(player.x - aster().x, player.z - aster().z);
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q012; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  function mira() {
    const l = typeof npcs !== 'undefined' ? npcs.filter(n => !n.gone && (n.short === 'Mira' || n.name === 'Mira')) : [];
    return l.sort((a, b) => Math.hypot(a.x - aster().x, a.z - aster().z) - Math.hypot(b.x - aster().x, b.z - aster().z))[0] || null;
  }
  const tent = () => { const m = mira(); return m ? { x: m.x, z: m.z } : { x: aster().x, z: aster().z + 14 }; };
  if (typeof LORE !== 'undefined') {
    LORE.q012_remedios = ['A Noite em que Aster Ardeu: os remédios', 'Você tirou a carroça de remédios do beco em chamas e a levou a Mira. Quatro moradores feridos viveram. Mira agora separa 2 Poções Concentradas por dia para você. O depósito de Kael queimou.'];
    LORE.q012_deposito = ['A Noite em que Aster Ardeu: o depósito', 'Você segurou o depósito de lingotes de Kael. O estoque de aço está inteiro e o custo de aprimorar equipamento cai 15%. A carroça de remédios queimou no beco e quatro moradores feridos não sobreviveram.'];
  }

  /* ---------- pontos do ataque: um de cada lado de Aster, fora das muralhas ---------- */
  function ring(ang) {
    const c = aster();
    for (let R = 80; R < 200; R += 6) {
      const x = c.x + Math.cos(ang) * R, z = c.z + Math.sin(ang) * R;
      let inside = false; try { inside = !!inCity(x, z); } catch (_) {}
      if (!inside && terrH(x, z) > 0.5) return { x, z };
    }
    return { x: c.x + Math.cos(ang) * 120, z: c.z + Math.sin(ang) * 120 };
  }
  function spots() {
    const s = S(); if (!s.pa) { s.pa = ring(0.7); s.pb = ring(0.7 + Math.PI); save(); } return { beco: s.pa, deposito: s.pb };
  }

  /* ---------- fogo ---------- */
  const flameMat = [0xb02000, 0xe84a08, 0xff8a20].map(c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .82, depthWrite: false }));
  function flame(x, z, r, n) {
    const g = new THREE.Group();
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * r, h = 1 + Math.random() * 1.6, w = .28 + Math.random() * .25;
      const m = new THREE.Mesh(new THREE.ConeGeometry(w, h, 6), flameMat[i % 3]);
      m.position.set(Math.cos(a) * d, h / 2, Math.sin(a) * d); m.userData.ph = Math.random() * 6; g.add(m);
    }
    const y = terrH(x, z); g.position.set(x, y, z); g.userData.terrainAbsolute245 = true; scene.add(g);
    const f = { x, z, r, g, grass: 0 }; fires.push(f); return f;
  }
  function putOut() {
    for (const f of fires) { try { scene.remove(f.g); f.g.traverse(o => o.geometry && o.geometry.dispose && o.geometry.dispose()); } catch (_) {} }
    fires = [];
  }
  function fireTick(dt) {
    const t = performance.now() / 1000;
    for (const f of fires) {
      f.g.children.forEach(m => { if (!m.userData.ph) return; const k = .75 + Math.sin(t * 9 + m.userData.ph) * .25; m.scale.set(k, .8 + k * .4, k); });
      f.grass -= dt; if (f.grass <= 0) { f.grass = 5; try { if (window.Grass446) Grass446.element('fire', f.x, f.z, f.r + 2); } catch (_) {} }
      if (!player.dead && Math.hypot(player.x - f.x, player.z - f.z) < f.r + .3) {
        burnT -= dt;
        if (burnT <= 0) { burnT = .5; player.hp = Math.max(1, player.hp - Math.max(1, Math.round(player.maxhp * .015))); if (Math.random() < .4) { try { toast('Você está queimando: saia do fogo.', 900); } catch (_) {} } }
      }
    }
  }
  function mark(p) { /* mancha de queimado que fica depois da noite */
    const m = new THREE.Mesh(new THREE.CircleGeometry(5, 20), new THREE.MeshBasicMaterial({ color: 0x0c0806, transparent: true, opacity: .75, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.rotation.x = -Math.PI / 2; m.position.set(p.x, terrH(p.x, p.z) + .06, p.z); m.userData.terrainAbsolute245 = true; scene.add(m); marks.push(m);
  }
  function dropMarks() { for (const m of marks) { try { scene.remove(m); m.geometry.dispose(); } catch (_) {} } marks = []; }

  /* ---------- atores ---------- */
  function mk(id, name, x, z) {
    const m = NPC456.create(id), f = NPC456.figure(id, { m, name, down: false, x, z, t: 0 });
    m.root.userData.terrainAbsolute245 = true; m.root.position.set(x, terrH(x, z), z); scene.add(m.root); return f;
  }
  function addInter(label, x, z, fn, r) { const i = { x, z, r: r || 4, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function drop() {
    putOut();
    for (const f of [brann]) if (f) { try { scene.remove(f.m.root); } catch (_) {} }
    if (cart) { try { scene.remove(cart.g); } catch (_) {} }
    if (depot) { try { scene.remove(depot.g); } catch (_) {} }
    rmInter(brannInter); rmInter(cartInter);
    brann = cart = depot = brannInter = cartInter = null; foes = [];
  }
  function box(w, h, d, c, x, y, z) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: c, roughness: .9 })); m.position.set(x, y, z); return m; }
  function buildCart(p) {
    const g = new THREE.Group();
    g.add(box(2.4, .3, 1.4, 0x5a3c22, 0, .8, 0));
    for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .12, 12), new THREE.MeshStandardMaterial({ color: 0x3a2a1a })); w.rotation.x = Math.PI / 2; w.position.set(sx * .9, .55, .76); g.add(w); const w2 = w.clone(); w2.position.z = -.76; g.add(w2); }
    g.add(box(.7, .6, .6, 0xb0c8d8, -.5, 1.25, 0)); g.add(box(.7, .5, .6, 0xc8a0a0, .5, 1.2, 0));
    const t = new THREE.Mesh(new THREE.BoxGeometry(.5, .06, .5), new THREE.MeshBasicMaterial({ color: 0xd02020 })); t.position.set(0, 1.62, 0); g.add(t);
    g.position.set(p.x, terrH(p.x, p.z), p.z); g.userData.terrainAbsolute245 = true; scene.add(g);
    return { g, x: p.x, z: p.z, free: false };
  }
  function buildDepot(p) {
    const g = new THREE.Group();
    g.add(box(5, 2.4, 3.4, 0x4c4038, 0, 1.2, 0)); g.add(box(5.4, .3, 3.8, 0x2c2420, 0, 2.55, 0));
    for (let i = 0; i < 6; i++) g.add(box(1.1, .25, .45, 0x9aa4b0, -2 + (i % 3) * 1.1, .15 + Math.floor(i / 3) * .3, 2.1));
    g.position.set(p.x, terrH(p.x, p.z), p.z); g.userData.terrainAbsolute245 = true; scene.add(g);
    return { g, x: p.x, z: p.z, hp: DEP_HP };
  }

  /* ---------- 1. ataque ---------- */
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'brann'; save();
    try { toast('<b>[MISSÃO]</b> A Noite em que Aster Ardeu: um ataque atinge Aster de madrugada. Brann segura a brecha da muralha e Mira retira os feridos. Fale com Brann.', 9000); } catch (_) {}
    setup();
  }
  function setup() {
    const s = S(), p = spots();
    if (!fires.length) {
      for (const [dx, dz] of [[5, 1], [-4, 3], [0, -5], [4, 6]]) flame(p.beco.x + dx, p.beco.z + dz, 2.2, 7);
      for (const [dx, dz] of [[-5, 2], [5, -2], [0, 6]]) flame(p.deposito.x + dx, p.deposito.z + dz, 2.2, 6);
    }
    if (s.phase === 'brann' && !brann) {
      brann = mk('homem', 'Brann', player.x + 3, player.z + 2);
      brannInter = addInter('E · FALAR COM BRANN', brann.x, brann.z, talk);
    }
    if ((s.phase === 'carroca' || s.phase === 'levar') && !cart) { cart = buildCart(s.phase === 'levar' && s.cartPos ? s.cartPos : p.beco); cart.free = s.phase === 'levar'; if (s.phase === 'carroca') cartInter = addInter('E · LIBERTAR A CARROÇA', cart.x, cart.z, freeCart, 4.5); }
    if (s.phase === 'defesa' && !depot) { depot = buildDepot(p.deposito); depot.hp = s.dhp == null ? DEP_HP : s.dhp; }
  }
  function talk() {
    const s = S(); if (s.phase !== 'brann') return;
    Dialogo520.custom({ name: 'Brann', title: 'Capitão das Muralhas', type: 'brann612' }, brann, () => ({
      raiz: { t: 'Eles vieram de madrugada, por três lados. Eu seguro a brecha, a Mira tira os feridos. Mas há fogo nos dois lados da cidade: uma carroça de remédios está presa num beco em chamas, e do lado oposto o depósito de lingotes do Kael está sendo cercado. Só dá para você chegar a um dos dois a tempo.', o: [
        { l: 'Correr para salvar a carroça de remédios da Mira', fn: () => { choose('remedios'); return 'fim'; } },
        { l: 'Defender o depósito de lingotes da forja do Kael', fn: () => { choose('deposito'); return 'fim'; } }] }
    }));
  }
  function choose(c) {
    const s = S(); if (s.phase !== 'brann') return;
    s.escolha = c; s.t = Date.now(); rmInter(brannInter); brannInter = null;
    if (brann) { try { scene.remove(brann.m.root); } catch (_) {} brann = null; }
    const p = spots();
    if (c === 'remedios') {
      s.phase = 'carroca'; s.mortos = 0; save(); setup();
      try { toast('<b>[ESCOLHA]</b> Você corre ao beco em chamas. Elimine os incendiários, liberte a carroça e leve-a até a Mira. Não fique dentro do fogo.', 9000); } catch (_) {}
    } else {
      s.phase = 'defesa'; s.onda = 0; s.mortos = 0; s.dhp = DEP_HP; save(); setup(); spawnT = 4;
      try { toast('<b>[ESCOLHA]</b> Você corre ao depósito de Kael. Segure 3 ondas de incendiários sem deixar o depósito cair.', 9000); } catch (_) {}
    }
  }

  /* ---------- 2. combate e entregas ---------- */
  function raider(x, z, big) {
    const lvl = run.level || 1;
    try {
      const e = spawnKind('rogue', x, z, 0, { wild: true }); e.name = e.short = 'Incendiário da Ruptura';
      e.hp = e.maxhp = Math.min(e.maxhp, 40 + 12 * lvl); e.dmg = Math.min(e.dmg || 4, 4 + lvl); e.aggro = true; e.noite612 = true; foes.push(e); return e;
    } catch (_) { return null; }
  }
  function around(p, n, d) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.283; raider(p.x + Math.cos(a) * d, p.z + Math.sin(a) * d); } }
  function freeCart() {
    const s = S(); if (s.phase !== 'carroca') return;
    if (foes.some(e => !e.dead)) { try { toast('Ainda há incendiários perto da carroça.', 2500); } catch (_) {} return; }
    s.phase = 'levar'; save(); rmInter(cartInter); cartInter = null; cart.free = true;
    try { toast('<b>[MISSÃO]</b> Carroça livre. Ela segue você: leve-a até a Mira, longe do fogo.', 6500); } catch (_) {}
  }
  function followCart(dt) {
    const dx = player.x - cart.x, dz = player.z - cart.z, d = Math.hypot(dx, dz);
    if (d > 4) { const k = Math.min(4.2 * dt, d - 4) / d; cart.x += dx * k; cart.z += dz * k; cart.g.rotation.y = Math.atan2(dx, dz); }
    cart.g.position.set(cart.x, terrH(cart.x, cart.z), cart.z);
    const S0 = S(); S0.cartPos = { x: cart.x, z: cart.z };
  }
  function dayKey() { return typeof todayKey === 'function' ? todayKey() : Math.floor(Date.now() / 86400000); }
  function finish(c, ok) {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); busy = false; s.salvou = c === 'remedios' ? true : !!ok;
    if (c === 'remedios') { s.potDia = null; try { unlockLore('q012_remedios'); } catch (_) {} try { toast('<b>[MIRA]</b> Quatro moradores feridos vão viver. Mira vai separar 2 Poções Concentradas por dia para você. O depósito de Kael queimou.', 9500); } catch (_) {} }
    else { if (ok) { s.desconto = true; try { unlockLore('q012_deposito'); } catch (_) {} try { toast('<b>[KAEL]</b> O estoque de aço está inteiro. Aprimorar equipamento custa 15% menos. A carroça de remédios queimou e quatro moradores não sobreviveram: Aster está de luto.', 10000); } catch (_) {} }
      else { try { toast('<b>[KAEL]</b> O depósito caiu: o aço virou escória. Sem desconto. A carroça de remédios queimou e quatro moradores não sobreviveram.', 9000); } catch (_) {} } }
    save(); drop(); const p = spots(); mark(c === 'remedios' ? p.deposito : p.beco);
  }

  /* ---------- objetivo ---------- */
  function objective() {
    const ph = phase(); if (!ph) return null; const s = S(); let text, target = null, step = 2;
    if (ph === 'brann') { text = 'Fale com Brann nas muralhas [E]'; target = brann ? { x: brann.x, z: brann.z } : null; }
    else if (ph === 'carroca') { const e = foes.find(e => !e.dead); text = e ? 'Elimine os incendiários do beco · fique fora do fogo' : 'Liberte a carroça de remédios [E]'; target = e ? { x: e.x, z: e.z } : (cart ? { x: cart.x, z: cart.z } : spots().beco); step = 3; }
    else if (ph === 'levar') { text = 'Leve a carroça até a Mira'; target = tent(); step = 4; }
    else if (ph === 'defesa') { const e = foes.find(e => !e.dead); text = 'Defenda o depósito de Kael · onda ' + Math.max(1, s.onda || 1) + '/3 · depósito ' + Math.max(0, Math.round((s.dhp == null ? DEP_HP : s.dhp))) + '%'; target = e ? { x: e.x, z: e.z } : spots().deposito; step = 3; }
    return { actTitle: 'A NOITE EM QUE ASTER ARDEU', step, totalSteps: 4, text, target };
  }

  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile) return;
    if (L.mode !== 'world') return;
    if (world !== L) { drop(); dropMarks(); world = L; worldT = performance.now(); }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s) return;
    if (s.done) { if (!marks.length && s.pa) { const p = spots(); mark(s.escolha === 'remedios' ? p.deposito : p.beco); } miraPots(); return; }
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof inConversation === 'function' && inConversation()) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) {
      const q11 = profile.fixas545 && profile.fixas545.q011;
      if (q11 && q11.done && (s.minerio || 0) >= NEED && free && dAster() < 140) begin();
      return;
    }
    setup(); fireTick(dt);
    if (brannInter && brann) { brannInter.x = brann.x; brannInter.z = brann.z; }
    if (!free) return;
    foes = foes.filter(e => !e.dead);
    const p = spots();
    if (s.phase === 'carroca') {
      const near = Math.hypot(player.x - p.beco.x, player.z - p.beco.z) < 60;
      if (near && !s.spawned) { s.spawned = true; save(); around(p.beco, 4, 11); }
    }
    if (s.phase === 'levar' && cart) {
      followCart(dt);
      const t = tent();
      if (Math.hypot(cart.x - t.x, cart.z - t.z) < 9 && Math.hypot(player.x - t.x, player.z - t.z) < 12) { busy = true; finish('remedios', true); }
    }
    if (s.phase === 'defesa' && depot) {
      const near = Math.hypot(player.x - p.deposito.x, player.z - p.deposito.z) < 55;
      if (near) {
        if (!foes.length && (s.onda || 0) < 3) { waveGap -= dt; if (waveGap <= 0) { s.onda = (s.onda || 0) + 1; waveGap = 3; save(); around(p.deposito, 3, 14); try { toast('<b>[ONDA ' + s.onda + '/3]</b> Incendiários chegam ao depósito.', 3500); } catch (_) {} } }
        let hit = 0; for (const e of foes) if (Math.hypot(e.x - depot.x, e.z - depot.z) < 6) hit++;
        if (hit) { depot.hp -= hit * 1.2 * dt; s.dhp = depot.hp; if (depot.hp <= 0) { busy = true; foes.forEach(e => { e.dead = true; }); finish('deposito', false); return; } }
        if ((s.onda || 0) >= 3 && !foes.length) { busy = true; finish('deposito', true); return; }
      }
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  /* 2 Poções Concentradas por dia com Mira (escolha dos remédios): ao chegar perto dela em cada dia novo */
  function miraPots() {
    const s = S(); if (!s || s.escolha !== 'remedios' || !s.done) return;
    const m = mira(); if (!m || Math.hypot(player.x - m.x, player.z - m.z) > 14) return;
    const k = dayKey(); if (s.potDia === k) return;
    s.potDia = k; run.pots372 = (run.pots372 || 0) + 2; save();
    try { toast('<b>[MIRA]</b> Mira lhe entrega 2 Poções Concentradas do dia.', 5000); } catch (_) {}
  }

  /* conta incendiário abatido (onda e beco) e minério minerado para abrir a missão */
  const ke = typeof killEnemy === 'function' ? killEnemy : null;
  if (ke) killEnemy = function (e) { const r = ke.apply(this, arguments); try { if (e && e.noite612) { const s = S(); if (s) { s.mortos = (s.mortos || 0) + 1; } } } catch (_) {} return r; };
  let lastOre = null;
  function oreTick() { /* conta o minério que entra na mochila (só depois da #11) */
    const U = window.Surv437; if (!U || typeof U.count !== 'function') return;
    let n = 0; try { n = U.count('minerio') || 0; } catch (_) { return; }
    const s = S(), q11 = profile.fixas545 && profile.fixas545.q011;
    if (lastOre != null && n > lastOre && s && !s.done && q11 && q11.done) s.minerio = (s.minerio || 0) + (n - lastOre);
    lastOre = n;
  }

  /* −15% no custo de aprimorar equipamento (ouro e minérios, arredondando para cima) */
  const euc = typeof equipmentUpgradeCost === 'function' ? equipmentUpgradeCost : null;
  if (euc) equipmentUpgradeCost = function () {
    const c = euc.apply(this, arguments), s = profile && profile.fixas545 && profile.fixas545.q012;
    if (s && s.desconto && c) return { ...c, gold: Math.ceil(c.gold * .85), cry: Math.max(1, Math.ceil(c.cry * .85)) };
    return c;
  };

  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { oreTick(); tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q012) Fixas545.LIVE.primeva_q012 = 'v650'; } catch (e) { console.warn('Noite612', e); } };
  window.Noite612 = { state: S, active, objective, begin, choose, spots, get cart() { return cart; }, get depot() { return depot; }, get foes() { return foes; }, get fires() { return fires; } };
})();
