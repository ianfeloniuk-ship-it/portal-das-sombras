/* Missão fixa #19 «A Quinta Âncora: O Julgamento do Sapo Rei em Verden» (v722). Ato X, depois da #18 (Urdan).
   Em Verden (+2300, +2300) a 5ª Pedra-Âncora está cercada pelo Sapo Rei, de coroa de lodo infectada por Logos.
   Reduza o Sapo Rei a 15% de vida: ele se rende (F · ACEITAR RENDIÇÃO, igual à de tools/ecology410.js: mata sem carcaça, marca reclaimed372) ou você desfere o golpe mortal.
   A rendição é feita aqui, não pelo ecology410, que não dispara de forma confiável neste chefe.
   Aceitar: ele jura lealdade como guardião da Âncora, a lentidão do pântano cai pela metade (de −10% para −5% de velocidade, em tools/biomes295.js, marca guardiao) e a Mão do Arquiteto não recolhe o corpo.
   Matar: reclama o núcleo (marca no perfil e no Diário) e a lentidão do pântano continua inteira.
   Estado em profile.fixas545.q019.
   Simplificações: sem canoa (a trilha é a pé, pelo brejo da cidade); a coroa de lodo é o nome do chefe, sem peça quebrável; o núcleo é uma marca no perfil. */
(function () {
  'use strict';
  let world = null, worldT = 0, rei = null, busy = false, lastSave = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q019 = profile.fixas545.q019 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const city = () => { try { const n = nearestCity(2300, 2300); if (n && n.c && n.c.name === 'Verden') return n.c; } catch (_) {} return { x: 2300, z: 2300, name: 'Verden', id: 'verden' }; };
  const q18 = () => profile && profile.fixas545 && profile.fixas545.q018;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q019; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dC = () => { const c = city(); return Math.hypot(player.x - c.x, player.z - c.z); };
  const spot = () => { const c = city(); return { x: c.x, z: c.z + 22 }; };
  if (typeof LORE !== 'undefined') {
    LORE.q019_rendicao = ['O Julgamento do Sapo Rei', 'Você quebrou a coroa de lodo e aceitou a rendição do Sapo Rei de Verden. Ele jurou lealdade eterna como guardião da Âncora, a lentidão do pântano ficou pela metade e a Mão do Arquiteto não pôde recolher o corpo dele.'];
    LORE.q019_nucleo = ['O núcleo do Sapo Rei', 'Você desferiu o golpe mortal no Sapo Rei de Verden e reclamou o núcleo dele. A Âncora ficou sem guardião e o pântano continua pesado.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> A Quinta Âncora: siga pelo brejo até Verden (+2300, +2300). O Sapo Rei guarda a Pedra-Âncora.', 9000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true;
    e.name = e.short = name; return e;
  }
  function spawnRei() {
    const p = spot();
    try {
      rei = foe('sapo', 'Sapo Rei de Verden', p.x, p.z); rei.hp = rei.maxhp = Math.round(rei.maxhp * 8); rei.aggro = false; rei.rei722 = true; rei.hpIni722 = rei.hp;
      try { rei.m.root.scale.multiplyScalar(2.2); } catch (_) {}
    } catch (_) { rei = null; }
  }
  function accept() {
    if (!rei || rei.dead || !rei.surr722) return;
    rei.surr722 = false; rei.accepted722 = true;
    try { fxBurst(rei.x, 1, rei.z, 0xffd76a, 18, 4); } catch (_) {}
    try { killEnemy(rei); rei.m.root.userData.reclaimed372 = true; } catch (_) {}
  }
  if (typeof ctxTarget === 'function' && !ctxTarget.verden722) {
    const c0 = ctxTarget;
    ctxTarget = function () { const b = c0.apply(this, arguments); try { if (!b && rei && !rei.dead && rei.surr722 && Math.hypot(rei.x - player.x, rei.z - player.z) < 5) return { label: 'F · ACEITAR RENDIÇÃO', use: accept }; } catch (_) {} return b; };
    ctxTarget.verden722 = 1;
  }
  function startPedra() {
    const s = S(); s.phase = 'pedra'; save(); spawnRei();
    try { toast('<b>[VERDEN]</b> O Sapo Rei guarda a 5ª Pedra-Âncora, com a coroa de lodo infectada por Logos. Reduza-o a 15% de vida: aceite a rendição [F] ou dê o golpe mortal.', 11000); } catch (_) {}
  }
  function finish(how) {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); s.escolha = how;
    if (how === 'rendicao') {
      s.guardiao = true; try { unlockLore('q019_rendicao'); } catch (_) {}
      try { toast('<b>[VERDEN]</b> O Sapo Rei jura lealdade eterna como guardião da Âncora. A lentidão do pântano cai pela metade e a Mão do Arquiteto não recolhe o corpo dele.', 11000); } catch (_) {}
    } else {
      s.nucleo = true; try { unlockLore('q019_nucleo'); } catch (_) {}
      try { toast('<b>[VERDEN]</b> O golpe cai e você reclama o núcleo do Sapo Rei. A Quinta Âncora se estabiliza, mas o pântano segue pesado.', 10000); } catch (_) {}
    }
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const c = city(); let text, target = { x: c.x, z: c.z };
    if (ph === 'rota') text = 'Siga pelo brejo até Verden e procure a Pedra-Âncora';
    else { text = 'Reduza o Sapo Rei a 15% de vida: aceite a rendição [F] ou dê o golpe mortal'; target = rei && !rei.dead ? { x: rei.x, z: rei.z } : spot(); }
    return { actTitle: 'A QUINTA ÂNCORA: O JULGAMENTO DO SAPO REI EM VERDEN', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); rei = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q18() && q18().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dC() < 90) startPedra();
    if (s.phase === 'pedra') {
      if (!rei && free && dC() < 120) spawnRei();
      else if (rei && !rei.dead && !rei.gone) {
        if (rei.surr722) { rei.aggro = false; rei.act = null; if (rei.hp > rei.maxhp * .15) rei.surr722 = false; }
        else if (rei.hp <= rei.maxhp * .15 && Math.hypot(rei.x - player.x, rei.z - player.z) < 14) {
          rei.surr722 = true; rei.aggro = false; rei.act = null;
          try { floater(rei.x, rei.z, 'SE RENDEU', '#ffd76a', true, 2.6); } catch (_) {}
          try { toast('<b>Sapo Rei de Verden</b> se rendeu. <b>F</b> para aceitar a rendição, ou desfira o golpe mortal.', 7000); } catch (_) {}
        } else if (!rei.aggro && (rei.hp < rei.hpIni722 || Math.hypot(rei.x - player.x, rei.z - player.z) < 10)) rei.aggro = true;
      } else if (rei && rei.dead) finish(rei.m && rei.m.root && rei.accepted722 ? 'rendicao' : 'golpe');
      else if (rei && rei.gone && free) rei = null;
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q019) Fixas545.LIVE.primeva_q019 = 'v722'; } catch (e) { console.warn('Verden722', e); } };
  window.Verden722 = { state: S, active, objective, begin, get rei() { return rei; } };
})();
