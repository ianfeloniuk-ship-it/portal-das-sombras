/* Missão fixa #24 «Caçada às Partes de Deus» (v727). Ato XIII, depois da #23.
   Uma parte física do Arquiteto [Grau Supremo] escapa e caminha pela Estrada Sul rumo a Aster (z decrescente) enquanto Torvo retira os civis.
   Escolha (por onde você a enfrenta): interceptar na estrada aberta, longe das muralhas (z acima de 150), armando as 3 armadilhas ácidas da estrada [E] antes de ela passar
   (cada uma tira 12% da vida da peça quando ela pisa); ou esperar que ela chegue perto da cidade (z até 150) e enfrentá-la junto aos guardas.
   Interceptar: os bairros externos ficam intactos e o desenvolvimento municipal é preservado (Desfecho de Contenção, marca contencao).
   Esperar: a peça alcança os bairros externos antes de cair (marca bairrosDestruidos).
   Estado em profile.fixas545.q024.
   Simplificações: a peça é um colosso de vida alta (3×) que marcha em linha pela estrada; os guardas da cidade não ganham IA nova (a ajuda é a que já têm);
   «frasco ácido» = dano fixo da armadilha; Torvo e Brann só aparecem no aviso; o desenvolvimento municipal é uma marca. */
(function () {
  'use strict';
  let world = null, worldT = 0, parte = null, traps = [], busy = false, lastSave = 0, cutZ = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q024 = profile.fixas545.q024 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const roadX = z => { try { return Fronteira551.cx(z); } catch (_) { return 0; } };
  const START = 480, TRAPS = [450, 420, 390], LIMIT = 150, STOP = 70;
  const q23 = () => profile && profile.fixas545 && profile.fixas545.q023;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q024; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dS = () => Math.hypot(player.x - roadX(START), player.z - START);
  if (typeof LORE !== 'undefined') {
    LORE.q024_estrada = ['Caçada às Partes de Deus', 'Você interceptou a parte fugitiva do Arquiteto na estrada aberta, longe das muralhas, com armadilhas ácidas. Os bairros externos de Aster ficaram intactos e a cidade manteve seu desenvolvimento (Desfecho de Contenção).'];
    LORE.q024_muralha = ['A parte que chegou aos bairros', 'Você esperou a parte fugitiva do Arquiteto chegar perto de Aster para enfrentá-la com os guardas. Ela caiu, mas antes passou pelos bairros externos, que sofreram com a passagem.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> Caçada às Partes de Deus: uma parte do Arquiteto marcha pela Estrada Sul rumo a Aster. Torvo retira os civis. Vá à estrada e arme as armadilhas ácidas [E] antes que ela passe.', 10000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3.5, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function mkTraps() {
    for (const t of traps) { rmInter(t.inter); try { scene.remove(t.m); } catch (_) {} }
    traps = TRAPS.map(z => {
      const x = roadX(z);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .15, 12), new THREE.MeshStandardMaterial({ color: 0x405020, emissive: 0x70a020, emissiveIntensity: .2 }));
      m.position.set(x, terrH(x, z) + .1, z); m.userData.terrainAbsolute245 = true; scene.add(m);
      const t = { x, z, m, set: false, hit: false, inter: null }; t.inter = addInter('E · ARMAR ARMADILHA ÁCIDA', x, z, () => arm(t)); return t;
    });
  }
  function arm(t) {
    const s = S(); if (t.set || s.phase !== 'cacada') return; t.set = true; rmInter(t.inter); t.inter = null;
    try { t.m.material.emissiveIntensity = 1; t.m.material.color.setHex(0x80c030); } catch (_) {}
    s.armadas = (s.armadas || 0) + 1; save();
    try { toast('Armadilha ácida armada (' + s.armadas + ' de 3).', 3500); } catch (_) {}
  }
  function spawnParte() {
    const x = roadX(START);
    try { parte = foe('colosso', 'Parte Fugitiva do Arquiteto [Grau Supremo]', x, START); parte.hp = parte.maxhp = Math.round(parte.maxhp * 3); parte.isBoss = true; parte.aggro = false; parte.parte727 = true; parte.hpIni727 = parte.hp; parte.minZ727 = START; } catch (_) { parte = null; }
  }
  function startCacada() {
    const s = S(); s.phase = 'cacada'; save(); mkTraps(); spawnParte();
    try { toast('<b>[ESTRADA SUL]</b> A parte fugitiva do Arquiteto ainda não chegou. Arme as armadilhas ácidas [E] ao longo da estrada e intercepte-a longe das muralhas, ou espere por ela perto da cidade.', 11000); } catch (_) {}
  }
  function finish() {
    const s = S(); const z = parte ? Math.max(parte.z, 0) : 0; const aberta = (parte && (parte.cutZ727 || parte.z)) > LIMIT;
    s.done = true; s.phase = 'fim'; s.t = Date.now(); s.matouEmZ = Math.round(parte ? parte.z : 0);
    for (const t of traps) { rmInter(t.inter); try { scene.remove(t.m); } catch (_) {} } traps = [];
    if (aberta) {
      s.escolha = 'estrada'; s.contencao = true; try { unlockLore('q024_estrada'); } catch (_) {}
      try { toast('<b>[CONTENÇÃO]</b> A peça cai na estrada aberta. Os bairros externos de Aster ficam intactos e a cidade preserva seu desenvolvimento.', 11000); } catch (_) {}
    } else {
      s.escolha = 'muralha'; s.bairrosDestruidos = true; try { unlockLore('q024_muralha'); } catch (_) {}
      try { toast('<b>[CONTENÇÃO]</b> A peça cai perto da cidade, mas antes passou pelos bairros externos de Aster.', 11000); } catch (_) {}
    }
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const s = S(); let text, target = { x: roadX(START - 40), z: START - 40 };
    if (ph === 'rota') text = 'Siga pela Estrada Sul até onde a parte fugitiva vai passar';
    else { text = 'Arme as armadilhas [E] (' + (s.armadas || 0) + ' de 3) e intercepte a parte fugitiva longe das muralhas, ou espere por ela perto da cidade'; if (parte && !parte.dead) target = { x: parte.x, z: parte.z }; }
    return { actTitle: 'CAÇADA ÀS PARTES DE DEUS', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); parte = null; traps = []; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q23() && q23().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dS() < 55) startCacada();
    if (s.phase === 'cacada') {
      if (parte && !parte.dead && !parte.gone) {
        if (!parte.aggro && parte.hp < parte.hpIni727) parte.aggro = true;
        if (!parte.aggro && !parte.marchStop) {
          /* a peça marcha para o norte pela estrada (2 m/s) enquanto você está perto; para quando você some de vista */
          const pd = Math.hypot(parte.x - player.x, parte.z - player.z);
          if (pd < 60 && parte.z > STOP) {
            const tz = parte.z - 2 * dt, tx = roadX(tz);
            try { moveEnt(parte, tx - parte.x, tz - parte.z); } catch (_) {}
            if (parte.m && parte.m.root) parte.m.root.rotation.y = Math.PI;
            if (pd < 14) parte.aggro = true;
          }
        }
        for (const t of traps) if (t.set && !t.hit && Math.hypot(parte.x - t.x, parte.z - t.z) < 6) {
          t.hit = true; const d = Math.round(parte.maxhp * .12); parte.hp = Math.max(1, parte.hp - d);
          try { fxBurst(t.x, 1, t.z, 0x80c030, 16, 3); } catch (_) {} try { floater(t.x, t.z, 'ÁCIDO −' + d, '#a0e040', true, 2.2); } catch (_) {}
          try { t.m.material.emissiveIntensity = 0; } catch (_) {}
        }
        if (parte.z > LIMIT) parte.cutZ727 = parte.z; else parte.cutZ727 = Math.min(parte.cutZ727 || 999, parte.z);
      } else if (parte && parte.dead) finish();
      else if (parte && parte.gone && free) { const lz = parte.z; parte = null; if (dS() < 80 || true) { spawnParte(); } }
      if (!parte && free && dS() < 55 && s.phase === 'cacada') spawnParte();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q024) Fixas545.LIVE.primeva_q024 = 'v727'; } catch (e) { console.warn('Cacada727', e); } };
  window.Cacada727 = { state: S, active, objective, begin, get parte() { return parte; }, get traps() { return traps; } };
})();
