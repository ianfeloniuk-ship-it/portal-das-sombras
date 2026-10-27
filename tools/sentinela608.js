/* Missão fixa #8 «O Sentinela do Terraço e a Moeda de Logos» (v615). Terraço partido da Torre da Vigília Antiga (5º andar da subida do Ato III).
   O Sentinela Corrompido (chefe, alabarda de éter) guarda a Primeira Tabuleta das Âncoras; ao lado, uma moeda estrangeira com o selo de Logos.
   Escolha: mostrar a moeda só a Brann e Lyra em conselho fechado, ou questionar Dorian abertamente no mercado.
   Conselho: rastrear os espiões de Logos em Thalor sem emboscadas extras nas rotas.
   Dorian: o mercador sobe os preços em 10%, mas deixa cair um contrato cifrado. */
(function () {
  'use strict';
  let coin = null, brann = null, bossRef = null;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q008 = profile.fixas545.q008 || {}; }
  function q7() { return profile && profile.fixas545 && profile.fixas545.q007; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const base = () => (q7() && q7().base) || 0;
  const isTerrace = () => typeof L !== 'undefined' && L.special && L.special.kind === 'tower' && base() && L.special.floor === base() && !S().done;
  if (typeof LORE !== 'undefined') {
    LORE.q008_conselho = ['Conselho fechado · A moeda de Logos', 'Brann, Lyra e você viram a moeda do terraço: um selo de Logos em metal estrangeiro. Combinaram não contar a mais ninguém. A Ordem agora rastreia os espiões de Logos em Thalor sem avisar ninguém.'];
    LORE.q008_contrato = ['Contrato cifrado de Dorian', 'Ao ser confrontado diante dos fregueses, Dorian deixou cair um contrato cifrado com o mesmo selo de Logos da moeda. As frases estão em código; Lyra pode ler.'];
  }
  /* o 5º andar da subida é o terraço do Sentinela: sempre chefe */
  const ss = specialSetup2;
  specialSetup2 = function (kind, S0, arg) { ss.apply(this, arguments); if (kind === 'tower' && base() && S0.floor === base() && !S().done) { S0.boss = true; S0.terraco608 = true; } };
  /* ponto da moeda: o mais livre de outras interações do andar (o terraço recebe coletáveis ao acaso) */
  let cSpot = null;
  function coinSpot() {
    if (cSpot && cSpot.L === L) return cSpot;
    let best = { x: -3, z: -8 }, bd = -1;
    for (const [x, z] of [[-3, -8], [4, -7], [7, -4], [-7, -4], [0, -12], [5, -11], [-8, -9], [8, -9]]) {
      const md = Math.min(99, ...L.inter.filter(i => !i.coin608).map(i => Math.hypot(i.x - x, i.z - z)));
      if (md > bd) { bd = md; best = { x, z }; }
    }
    return cSpot = { x: best.x, z: best.z, L };
  }
  function mkBrann() {
    if (brann || !window.NPC456) return;
    try { const m = NPC456.create('homem'); brann = NPC456.figure('homem', { m, name: 'Brann', down: false, x: coinSpot().x - 1.6, z: coinSpot().z - 1.4, t: 0 }); m.root.userData.terrainAbsolute245 = true; scene.add(m.root); m.root.position.set(coinSpot().x - 1.6, 0, coinSpot().z - 1.4); m.root.rotation.y = Math.PI; } catch (_) { brann = null; }
  }
  function dropBrann() { if (brann) { try { scene.remove(brann.m.root); } catch (_) {} brann = null; } }
  function talkCoin() {
    const s = S(); if (s.done || s.choice) return;
    mkBrann();
    const npc = brann || { x: coinSpot().x - 1.6, z: coinSpot().z - 1.4, name: 'Brann' };
    Dialogo520.custom({ name: 'Brann', title: 'Defesa de Aster', type: 'sentinela608' }, npc, () => ({ raiz: { t: 'A moeda tem o selo de Logos. Se isso vazar, os espiões somem antes de os acharmos. Ou alguém daqui já sabia dela. O que você faz?', o: [
      { l: 'Mostrar a moeda só a Brann e Lyra, em conselho fechado', fn: () => { choose('conselho'); return 'fim'; } },
      { l: 'Questionar Dorian abertamente no mercado', fn: () => { choose('dorian'); return 'fim'; } }] } }));
  }
  function choose(c) {
    const s = S(); if (s.choice) return; s.choice = c; s.t = Date.now();
    if (coin) { const i = L.inter.indexOf(coin); if (i >= 0) L.inter.splice(i, 1); coin = null; }
    if (c === 'conselho') {
      s.done = true; s.espioes = true;
      try { unlockLore('q008_conselho'); } catch (_) {}
      try { toast('<b>[ESCOLHA]</b> Conselho fechado: só Brann e Lyra viram a moeda. Você vai rastrear os espiões de Logos em Thalor, sem emboscadas extras nas rotas.', 8500); } catch (_) {}
    } else {
      s.pendente = true;
      try { toast('<b>[ESCOLHA]</b> Você vai questionar Dorian abertamente. Fale com ele no mercado de Aster.', 7500); } catch (_) {}
    }
    save();
  }
  function confrontDorian(then) {
    const s = S(); s.done = true; s.pendente = false; s.dorian = true; save();
    const lines = ['Você: — Dorian, esta moeda tem o selo de Logos. Achei no terraço da torre.', 'Dorian: — Fale baixo! Eu... nunca vi isso na vida. Ninguém precisa saber de nada.', 'Dorian: — Se vai me acusar na frente de todos, os preços sobem. Eu também preciso me proteger.'];
    const end = () => {
      try { unlockLore('q008_contrato'); } catch (_) {}
      try { toast('<b>[DORIAN]</b> O mercador pálido deixa cair um contrato cifrado. Os preços do mercado sobem 10%.', 9000); } catch (_) {}
      then();
    };
    try { if (window.Intro401) Intro401.dialog('Dorian', lines, end); else end(); } catch (_) { end(); }
  }
  function tick() {
    if (typeof L === 'undefined') return;
    const s = S(); if (!s) return;
    if (isTerrace()) {
      if (bossE && !bossE.dead && !bossE.sent608) {
        bossRef = bossE; bossE.sent608 = true; bossE.name = 'Sentinela Corrompido'; bossE.short = 'Sentinela Corrompido';
        try { toast('<b>[TORRE]</b> O Sentinela Corrompido ergue a alabarda de éter.', 5000); } catch (_) {}
      }
      if (bossE && !bossE.dead && bossE.sent608 && !bossE.reduz608 && q7() && q7().todos) { bossE.reduz608 = true; bossE.dmg = Math.max(1, Math.round(bossE.dmg * .8)); try { toast('<b>[TORRE]</b> Os cinco archotes enfraquecem o éter: o Sentinela causa 20% menos dano mágico.', 6500); } catch (_) {} }
      if (bossRef && bossRef.dead && L.special.spawned && !coin && !s.choice) {
        const cp = coinSpot(); coin = { coin608: 1, x: cp.x, z: cp.z, r: 3.2, label: 'F · EXAMINAR A MOEDA DE LOGOS', use: talkCoin }; L.inter.push(coin);
        try { toast('<b>[TORRE]</b> Ao lado da Primeira Tabuleta das Âncoras há uma moeda estrangeira com o selo de Logos.', 7000); } catch (_) {}
      }
    } else { bossRef = null; if (coin || brann) { coin = null; dropBrann(); } }
  }
  const pu = update;
  update = function () { pu.apply(this, arguments); try { tick(); if (window.Fixas545 && !Fixas545.LIVE.primeva_q008) Fixas545.LIVE.primeva_q008 = 'v615'; } catch (e) { console.warn('Sentinela608', e); } };
  /* Dorian: preços +10% depois da cobrança aberta; a confrontação acontece ao abrir o mercado dele */
  const pm = priceMul;
  priceMul = function (kind) { const v = pm.apply(this, arguments); const s = profile && profile.fixas545 && profile.fixas545.q008; return s && s.dorian && kind === 'mkt' ? v * 1.1 : v; };
  const os = openShop;
  openShop = function (id) {
    const s = profile && profile.fixas545 && profile.fixas545.q008;
    if (id === 'mkt' && s && s.pendente && !s.done) { const self = this, args = arguments; confrontDorian(() => os.apply(self, args)); return; }
    return os.apply(this, arguments);
  };
  /* Conselho fechado: nenhum evento extra de emboscada nas rotas (guardas/mensageiros de Gatilhos) perto de Thalor */
  function wrapGat() {
    if (!window.Gat508 || window.Gat508.wrap608) return;
    window.Gat508.wrap608 = true;
    for (const k of ['startGuards', 'startMessenger']) {
      const f = Gat508[k]; if (typeof f !== 'function') continue;
      Gat508[k] = function (cap) { const s = profile && profile.fixas545 && profile.fixas545.q008; if (s && s.espioes && cap && /Thalor/i.test(cap.name || cap.id || '')) return; return f.apply(this, arguments); };
    }
  }
  const pu2 = update; update = function () { pu2.apply(this, arguments); wrapGat(); };
  window.Sentinela608 = { state: S, choose, talkCoin, confrontDorian, isTerrace };
})();
