/* v546 (Ian, 22/10/2026): as 300 missões fixas do motor (RadiantPrimeva.FIXED_300_QUESTS) entram no jogo uma por uma,
   fiéis ao texto. Cada missão ligada registra aqui o que a escolha muda no mundo.
   #1 «O Céu Rasgado na Estrada Sul» (cena da carroça no tools/campaign327.js):
     - empurrar a carroça antes de lutar → o casal salvo abre uma banca de ataduras no primeiro anel de Aster (+5 de confiança em Aster);
     - atacar a Gosma Fendida primeiro → o escudo de Edran aguenta e ele entrega 1 Poção de Vida no portão. */
(function (global) {
  'use strict';

  const LIVE = { primeva_q001: 'v546' }; // missões fixas que já acontecem no jogo
  const ATADURA_PRECO = 25;

  function st() {
    if (typeof profile === 'undefined' || !profile) return null;
    return profile.fixas545 = profile.fixas545 || {};
  }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function aster() { return typeof regionCity === 'function' ? regionCity(0, 0) : null; }

  /* ---------- #1 O Céu Rasgado na Estrada Sul ---------- */
  function done1(choice) {
    const S = st(); if (!S || S.q001) return;
    S.q001 = { choice, t: Date.now() };
    if (choice === 'civis') {
      const c = aster();
      if (c && typeof regionEvent116 === 'function') regionEvent116(c, 5, 0, 'Você tirou o casal de baixo da carroça na Estrada Sul. Eles vão abrir uma banca de ataduras no primeiro anel.');
      try { toast('<b>[ESCOLHA]</b> Você salvou o casal antes de lutar. <b>+5 de confiança em Aster.</b> A banca de ataduras deles abre no primeiro anel da cidade.', 7000); } catch (_) {}
    }
    save();
  }
  function gate1() {
    const S = st(); if (!S || !S.q001 || S.q001.choice !== 'luta' || S.q001.pot) return;
    S.q001.pot = true;
    if (typeof run !== 'undefined' && run) run.pots = (run.pots || 0) + 1;
    save();
    const lines = ['Chegamos ao portão. Meu escudo aguentou inteiro porque você foi direto na criatura.', 'Fique com uma Poção de Vida da minha reserva. Lá fora você vai precisar.'];
    try { if (global.Intro401) Intro401.dialog('Edran', lines, () => { try { toast('<b>+1 Poção de Vida</b> (presente de Edran).', 5000); } catch (_) {} }); else toast('<b>Edran:</b> — ' + lines.join(' ') + '<br><b>+1 Poção de Vida</b>', 7000); } catch (_) {}
  }

  // Banca do casal: ao lado da estrada sul, dentro da primeira muralha de Aster
  let stall = null;
  function stallPos() { const c = aster(); return c ? { x: c.x + 9, z: c.z + 30 } : null; }
  function buildStall() {
    const p = stallPos(); if (!p || typeof scene === 'undefined') return null;
    const g = new THREE.Group(); g.userData.terrainAbsolute245 = true;
    const y = (typeof gy === 'function' ? gy : terrH)(p.x, p.z);
    try {
      if (typeof envMesh === 'function' && typeof ENV !== 'undefined' && ENV.m.stall) {
        const m = envMesh('stall'), s = 3.2 / (ENV.m.stall.w || 1); m.scale.setScalar(s); m.rotation.y = -Math.PI / 2; g.add(m);
      }
    } catch (_) {}
    g.position.set(p.x, y, p.z); scene.add(g);
    const people = [];
    if (global.NPC456) [['homem', -1.2], ['mulher', 1.2]].forEach(([id, dz]) => {
      const m = NPC456.create(id); m.root.position.set(p.x - 1.8, y, p.z + dz); m.root.rotation.y = -Math.PI / 2; m.root.userData.terrainAbsolute245 = true; scene.add(m.root); people.push(m);
    });
    const it = { type: 'fixa545', x: p.x - 1.8, z: p.z, r: 3.4, label: 'F · BANCA DE ATADURAS', use: openStall };
    if (L && Array.isArray(L.inter)) L.inter.push(it);
    if (window.Solid429) try { Solid429.prop(g, [{ x: 0, z: 0, r: 1.4 }]); } catch (_) {}
    // Figurante parado (kind 'deco': sem rotina) para a conversa achar o casal e pôr a câmera neles
    let deco = null;
    if (people[1] && typeof npcs !== 'undefined') {
      deco = { kind: 'deco', name: 'Casal da Estrada Sul', short: 'Casal da Estrada Sul', job523: 'Banca de Ataduras', home: aster(), m: people[1], x: p.x - 1.8, z: p.z + 1.2, r: .6, face: -Math.PI / 2, t: 0 };
      npcs.push(deco);
    }
    return { g, people, it, L, deco };
  }
  function dropStall() {
    if (!stall) return;
    try { scene.remove(stall.g); stall.people.forEach(m => { scene.remove(m.root); }); } catch (_) {}
    if (stall.deco) stall.deco.gone = true;
    try { if (stall.L && Array.isArray(stall.L.inter)) stall.L.inter = stall.L.inter.filter(i => i !== stall.it); if (L && L.inter) L.inter = L.inter.filter(i => i !== stall.it); } catch (_) {}
    stall = null;
  }
  function count(k) { try { return Surv437.count(k) || 0; } catch (_) { return 0; } }
  function buy(n) {
    const price = ATADURA_PRECO * n;
    if (!run || (run.gold || 0) < price || !global.Surv437) return 'raiz';
    run.gold -= price; Surv437.give('atadura', n, 'Comprado na banca do casal da Estrada Sul'); save();
    try { sfx('coin'); } catch (_) {}
    return 'comprou';
  }
  function tree() {
    const N = {};
    N.raiz = {
      t: 'Você! Foi você que levantou a carroça de cima da gente. Montamos esta banca com o que sobrou da carga. Para você, as ataduras são feitas com as melhores ervas.',
      o: [
        { l: `Comprar 1 Atadura de Ervas (${ATADURA_PRECO} de ouro)`, if: () => (run.gold || 0) >= ATADURA_PRECO, fn: () => buy(1) },
        { l: `Comprar 5 Ataduras de Ervas (${ATADURA_PRECO * 5} de ouro)`, if: () => (run.gold || 0) >= ATADURA_PRECO * 5, fn: () => buy(5) },
        { l: 'Como vocês estão?', go: 'conversa' },
        { l: 'Até mais', fn: () => 'fim' }
      ]
    };
    N.comprou = { t: `Está aí. Cada atadura estanca sangramento e restaura 35% da vida. Você tem ${count('atadura')} agora.`, o: [{ l: 'Obrigado', go: 'raiz' }, { l: 'Até mais', fn: () => 'fim' }] };
    N.conversa = { t: 'Vivos, graças a você. A gente ia para Aster de qualquer jeito. Agora temos onde ficar no primeiro anel, e a Ordem compra nossas ataduras para as patrulhas.', o: [{ l: 'Fico feliz', go: 'raiz' }] };
    return N;
  }
  function openStall() {
    if (global.Dialogo520 && Dialogo520.custom) Dialogo520.custom({ name: 'Casal da Estrada Sul', title: 'Banca de Ataduras', type: 'fixa545:q001' }, stall && stall.deco, tree);
  }
  function tick() {
    const S = st();
    const want = S && S.q001 && S.q001.choice === 'civis' && typeof L !== 'undefined' && L && L.mode === 'world' && typeof player !== 'undefined' && player;
    const p = want && stallPos();
    const near = p && Math.hypot(player.x - p.x, player.z - p.z) < 160;
    if (near && (!stall || stall.L !== L)) { dropStall(); stall = buildStall(); }
    else if (!near && stall) dropStall();
  }
  setInterval(() => { try { tick(); } catch (_) {} }, 1000);

  global.Fixas545 = { LIVE, done1, gate1, openStall, state: st };
})(window);
