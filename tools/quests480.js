/* v480 (Ian, 20/10/2026): Sistema de Missões Secundárias e Murais de Contratos estilo Skyrim.
   Mundo aberto com total liberdade: contratos de caçada (bounties), resgates de caravanas na estrada,
   criptas/ruínas antigas com relíquias, ninhos de pragas e entregas expressas de carroça.
   Acesse pelos Murais nas praças, Pousadas, Conselho Regional ou pelo Diário [J]. */
(function (global) {
  'use strict';

  const TAU = Math.PI * 2;

  // Catálogo rico de Missões Secundárias & Contratos das 6 Regiões (Estilo Skyrim)
  const QUEST_CATALOG = {
    // ASTER
    bounty_gorlok: {
      id: 'bounty_gorlok',
      region: 'aster',
      type: 'bounty',
      title: 'Caçada: Gorlok, o Rompe-Muralhas',
      giver: 'Comandante Brann · Mural da Ordem',
      desc: 'Um chefe orc desertor reuniu batedores e tem saqueado carroças nas colinas a noroeste de Aster. Abata Gorlok e traga paz à estrada.',
      rank: 1, // D
      biome: 'campos',
      offset: { dx: 130, dz: -110 },
      bossKind: 'orcinho',
      bossName: 'Gorlok Rompe-Muralhas',
      bossScale: 1.6,
      minions: 4,
      minionKinds: ['orcinho', 'magote'],
      gold: 950,
      xp: 420,
      rep: 45,
      trust: 12,
      rewardItem: 'Espada de Aço Refinado'
    },
    rescue_caravan_aster: {
      id: 'rescue_caravan_aster',
      region: 'aster',
      type: 'rescue',
      title: 'Socorro na Estrada das Brumas',
      giver: 'Edran Holt',
      desc: 'Uma caravana com novatos transmigradores foi encurralada por feras nas brumas da estrada. Use sua carroça rápida para chegar a tempo e espantar as feras.',
      rank: 0, // E
      biome: 'campos',
      offset: { dx: -120, dz: 90 },
      minions: 5,
      minionKinds: ['slime', 'gosma'],
      gold: 650,
      xp: 280,
      rep: 35,
      trust: 15
    },
    crypt_aster: {
      id: 'crypt_aster',
      region: 'aster',
      type: 'crypt',
      title: 'Cripta do Primeiro Cavaleiro',
      giver: 'Chanceler Lyra · Arquivos da Ordem',
      desc: 'Relatos de uma antiga tumba de pedra selada por runas. O guardião de pedra acordou e protege o relicário de armadura ancestral da Primeira Cruzada.',
      rank: 2, // C
      biome: 'campos',
      offset: { dx: 180, dz: 140 },
      bossKind: 'golempedra',
      bossName: 'Guardião de Pedra da Cripta',
      bossScale: 1.5,
      minions: 2,
      minionKinds: ['golenzinho'],
      gold: 1400,
      xp: 650,
      rep: 60,
      trust: 10,
      relicReward: 'Relíquia: Selo do Cavaleiro Antigo'
    },

    // SOLARIA
    bounty_valkor_solaria: {
      id: 'bounty_valkor_solaria',
      region: 'solaria',
      type: 'bounty',
      title: 'Caçada: Valkor Lâmina-do-Sol Negro',
      giver: 'Grão-Mestre Aurelius · Domo Solar',
      desc: 'Um antigo paladino solar corrompido pelo miasma da fenda desafia quem cruza o desfiladeiro brilhante. Purifique sua lâmina em combate.',
      rank: 3, // B
      biome: 'flores',
      offset: { dx: 150, dz: -160 },
      bossKind: 'escaravelho',
      bossName: 'Valkor Lâmina-do-Sol Negro',
      bossScale: 1.5,
      minions: 3,
      minionKinds: ['coelho', 'abelha'],
      gold: 2100,
      xp: 950,
      rep: 80,
      trust: 15
    },
    courier_solaria_aster: {
      id: 'courier_solaria_aster',
      region: 'solaria',
      type: 'delivery',
      title: 'Entrega Expressa de Quartzo Solar',
      giver: 'Consórcio de Mascates de Solaria',
      desc: 'Os forjadores de Aster precisam com urgência de lentes de quartzo solar para refratar portais. Use sua carroça de alta velocidade para fazer a entrega.',
      rank: 1, // D
      biome: 'flores',
      offset: { dx: -80, dz: 110 },
      gold: 1100,
      xp: 480,
      rep: 50,
      trust: 14
    },

    // YMIRIA
    bounty_yeti_ymiria: {
      id: 'bounty_yeti_ymiria',
      region: 'ymiria',
      type: 'bounty',
      title: 'Caçada: Garra-Gélida, o Yeti Ancião',
      giver: 'Arquiduquesa Astrid Frostgard',
      desc: 'Um yeti colossal desceu dos picos nevados e bloqueia a passagem das caravanas geotérmicas. Derrube a fera e proteja o abastecimento de carvão.',
      rank: 4, // A
      biome: 'neve',
      offset: { dx: -160, dz: -140 },
      bossKind: 'yeti',
      bossName: 'Garra-Gélida o Ancião',
      bossScale: 1.7,
      minions: 4,
      minionKinds: ['yetinho'],
      gold: 3200,
      xp: 1500,
      rep: 120,
      trust: 20
    },
    rescue_ymiria: {
      id: 'rescue_ymiria',
      region: 'ymiria',
      type: 'rescue',
      title: 'Batedores Soterrados na Geada',
      giver: 'Torben Halvorsen',
      desc: 'Uma nevasca violenta cercou dois batedores entre as pedras de gelo. Leve provisões quentes na carroça e elimine os lobos que farejam o rastro.',
      rank: 2, // C
      biome: 'neve',
      offset: { dx: 110, dz: 160 },
      minions: 5,
      minionKinds: ['yetinho'],
      gold: 1600,
      xp: 750,
      rep: 65,
      trust: 16
    },

    // ZAHAR
    bounty_wyrm_zahar: {
      id: 'bounty_wyrm_zahar',
      region: 'zahar',
      type: 'bounty',
      title: 'Caçada: O Verme das Dunas Vermelhas',
      giver: 'Emir Tariq ibn Nadir',
      desc: 'Uma criatura subterrânea gigantesca tem atacado poços artesianos e engolido camelos de carga inteiros. Cace a fera no coração das dunas.',
      rank: 4, // A
      biome: 'deserto',
      offset: { dx: 190, dz: -130 },
      bossKind: 'cactogig',
      bossName: 'Verme Soberano das Areias',
      bossScale: 1.6,
      minions: 4,
      minionKinds: ['cactinho', 'escaravelho'],
      gold: 3400,
      xp: 1600,
      rep: 130,
      trust: 20
    },

    // THALOR
    bounty_kraken_thalor: {
      id: 'bounty_kraken_thalor',
      region: 'thalor',
      type: 'bounty',
      title: 'Caçada: O Terror dos Arrecifes',
      giver: 'Almirante Varis Moura',
      desc: 'Uma fera abissal com carapaça de corais tem afundado barcos de pesca nos recifes externos. Limpe as águas para os pescadores de Thalor.',
      rank: 3, // B
      biome: 'pantano',
      offset: { dx: -140, dz: 150 },
      bossKind: 'homempeixe',
      bossName: 'Campeão Abissal dos Arrecifes',
      bossScale: 1.5,
      minions: 5,
      minionKinds: ['homempeixe', 'sapo'],
      gold: 2400,
      xp: 1100,
      rep: 90,
      trust: 18
    },

    // URDAN & VERDEN
    bounty_treant_urdan: {
      id: 'bounty_treant_urdan',
      region: 'urdan_verden',
      type: 'bounty',
      title: 'Caçada: Raiz-Maldita, o Guardião Corrompido',
      giver: 'Arquidruida Eldrin · Conselho das Raízes',
      desc: 'Um treant secular teve seu cerne infectado por esporos da Fenda e começou a estrangular animais e nascentes de água pura. Purifique o bosque.',
      rank: 3, // B
      biome: 'floresta',
      offset: { dx: 130, dz: 150 },
      bossKind: 'cogufuria',
      bossName: 'Raiz-Maldita o Corrompido',
      bossScale: 1.6,
      minions: 4,
      minionKinds: ['cogu', 'ninjinha'],
      gold: 2600,
      xp: 1200,
      rep: 100,
      trust: 18
    }
  };

  // Garante estado das missões no profile
  function getState() {
    let p = null;
    if (typeof profile !== 'undefined' && profile) p = profile;
    else if (typeof window !== 'undefined' && window.profile) p = window.profile;
    if (!p) return null;

    p.quests480 = p.quests480 || {};
    const Q = p.quests480;
    Q.active = Q.active || {};       // { [questId]: { progress: 0, max: 1, targetPos: {x, z}, spawned: false } }
    Q.completed = Q.completed || {}; // { [questId]: timestamp }
    Q.tracked = Q.tracked || null;   // questId sendo rastreado no HUD/compasso
    // v490: contratos de encontro (Aceitar no diálogo) voltam ao catálogo depois de recarregar
    for (const k in Q.active) { const d = Q.active[k] && Q.active[k].def490; if (d && !QUEST_CATALOG[k]) QUEST_CATALOG[k] = d; }
    return Q;
  }

  // Retorna as coordenadas da cidade / capital
  function getCityPos(regionKey) {
    // v541: mural aberto pela cidade ("rx,rz") ou pelo nome da capital usa a posição real da cidade
    const c541 = window.Contratos541 && Contratos541.cityOf(regionKey);
    if (c541) return { x: c541.x, z: c541.z };
    if (typeof CITIES !== 'undefined' && Array.isArray(CITIES)) {
      const match = CITIES.find(c => (c.name || '').toLowerCase().includes(regionKey.toLowerCase()) || (c.id || '').includes(regionKey));
      if (match) return { x: match.x, z: match.z };
    }
    if (typeof nearestCity === 'function' && typeof player !== 'undefined' && player) {
      const near = nearestCity(player.x, player.z);
      if (near && near.c) return { x: near.c.x, z: near.c.z };
    }
    return { x: 0, z: 0 };
  }

  // Aceita uma missão secundária
  function acceptQuest(qid) {
    const qdef = QUEST_CATALOG[qid];
    if (!qdef) return false;
    const S = getState();
    if (!S) return false;

    if (S.completed[qid]) {
      if (typeof toast === 'function') toast('Você já concluiu este contrato anteriormente.');
      return false;
    }
    if (S.active[qid]) {
      trackQuest(qid);
      if (typeof toast === 'function') toast(`<b>[MISSÃO]</b> Agora acompanhando: <b>${qdef.title}</b>.`);
      return true;
    }

    // v490: encontro no mundo aberto marca perto de onde você aceitou, não na cidade mais próxima
    const cityPos = (qdef.region === 'mundo_aberto' && typeof player !== 'undefined' && player) ? { x: player.x, z: player.z } : getCityPos(qdef.region);
    const targetX = cityPos.x + (qdef.offset?.dx || 100);
    const targetZ = cityPos.z + (qdef.offset?.dz || 100);

    S.active[qid] = {
      id: qid,
      acceptedAt: Date.now(),
      progress: 0,
      max: qdef.count541 ? qdef.minions : 1,
      targetPos: { x: targetX, z: targetZ },
      spawned: false,
      def490: (qdef.type === 'emergent' || qdef.count541) ? qdef : undefined
    };
    S.tracked = qid;

    if (typeof bigText === 'function') bigText('NOVA MISSÃO: ' + qdef.title.toUpperCase(), 1800);
    if (typeof sfx === 'function') sfx('gong');
    if (typeof toast === 'function') {
      toast(`<b>[MURAL DE CONTRATOS]</b> Missão aceita: <b>${qdef.title}</b>!<br>Abra o Diário [J] para acompanhar os detalhes no mapa.`);
    }

    saveState();
    return true;
  }

  // Define qual missão é acompanhada no HUD
  function trackQuest(qid) {
    const S = getState();
    if (!S) return;
    S.tracked = qid;
    saveState();
  }

  // Abandona uma missão secundária (liberdade Skyrim)
  function abandonQuest(qid) {
    const S = getState();
    if (!S || !S.active[qid]) return;
    delete S.active[qid];
    if (S.tracked === qid) S.tracked = Object.keys(S.active)[0] || null;
    try { cleanupQuestSpawn(qid); } catch (_) {}
    if (typeof toast === 'function') toast('Contrato abandonado.');
    saveState();
  }

  // Conclui uma missão secundária com recompensas completas
  function completeQuest(qid) {
    const S = getState();
    const qdef = QUEST_CATALOG[qid] || S?.active?.[qid]?.def490;
    if (!qdef || !S || !S.active[qid]) return;
    cleanupQuestSpawn(qid);

    delete S.active[qid];
    S.completed[qid] = Date.now();
    if (S.tracked === qid) S.tracked = Object.keys(S.active)[0] || null;

    // v541: contrato vivo paga o que a escolha prometeu, só agora no fim
    if (qdef.pay541 && window.Contratos541) {
      const txt = Contratos541.pay(qdef);
      if (typeof bigText === 'function') bigText('CONTRATO CUMPRIDO', 2400);
      if (typeof sfx === 'function') { sfx('level'); sfx('coin'); }
      if (typeof toast === 'function') toast(`<b>[CONTRATO CUMPRIDO]</b> <b>${qdef.title}</b><br>${txt}`, 9000);
      saveState();
      return;
    }

    // Entrega recompensas
    const curRun = (typeof run !== 'undefined' && run) ? run : (typeof window !== 'undefined' ? window.run : null);
    if (curRun) {
      curRun.gold = (curRun.gold || 0) + (qdef.gold || 500);
    }
    if (typeof gainXp === 'function') {
      gainXp(qdef.xp || 500, 'quest');
    }
    if (typeof addOrderRep === 'function') {
      addOrderRep(qdef.rep || 50, 'Contrato cumprido: ' + qdef.title);
    }

    // Melhora a relação e confiança com a região
    if (typeof regionEvent116 === 'function') {
      const cityPos = getCityPos(qdef.region);
      regionEvent116({ name: qdef.region.toUpperCase(), ...cityPos }, qdef.trust || 12, -4, 'Você concluiu o contrato: ' + qdef.title);
    }

    if (typeof bigText === 'function') bigText('MISSÃO CONCLUÍDA!', 2400);
    if (typeof sfx === 'function') { sfx('level'); sfx('coin'); }
    if (typeof toast === 'function') {
      toast(`<b>[CONTRATO CUMPRIDO]</b> <b>${qdef.title}</b>!<br>Recompensas: <b>+${qdef.gold} ouro</b>, <b>+${qdef.xp} XP</b> e <b>+${qdef.rep} reputação da Ordem</b>.`, 8000);
    }

    saveState();
  }

  function saveState() {
    try {
      if (typeof profile !== 'undefined' && profile && typeof store !== 'undefined' && store.set) {
        store.set('pds2_profile', profile);
      }
      if (typeof saveRun === 'function') saveRun();
    } catch (_) {}
  }

  // Modal do Mural de Recompensas e Contratos
  function openBoard(regionKey = 'aster') {
    const S = getState();
    let h = `<div class="guide93" style="border-left:4px solid #ffd070">`;
    h += `<strong>MURAL DE RECOMPENSAS & CONTRATOS REGIONAIS</strong>`;
    h += `<p>Escolha contratos para caçar feras lendárias, resgatar caravanas ou explorar criptas com total liberdade pelo mundo aberto.</p>`;
    h += `</div>`;

    const fixKey541 = window.Contratos541 ? Contratos541.boardKey(regionKey) : regionKey;
    const quests = Object.values(QUEST_CATALOG).filter(q => !q.count541 && (q.region === fixKey541 || regionKey === 'all'));
    h += `<div class="sec">CONTRATOS DISPONÍVEIS NA REGIÃO</div>`;

    if (!quests.length) {
      h += `<div class="sysline">Nenhum contrato ativo neste mural no momento. Verifique as outras capitais.</div>`;
    }

    for (const q of quests) {
      const isDone = S && S.completed[q.id];
      const isActive = S && S.active[q.id];
      const isTracked = S && S.tracked === q.id;

      let actHtml = '';
      if (isDone) {
        actHtml = '<b style="color:#6fe39a">✔ CONCLUÍDO</b>';
      } else if (isActive) {
        actHtml = `<button class="btn ${isTracked ? 'on' : 'hot'}" onclick="Quests480.trackQuest('${q.id}');Quests480.openBoard('${regionKey}')">${isTracked ? 'Acompanhando' : 'Acompanhar'}</button> ` +
                  `<button class="btn" style="color:#ff8fa3" onclick="Quests480.abandonQuest('${q.id}');Quests480.openBoard('${regionKey}')">Abandonar</button>`;
      } else {
        actHtml = `<button class="btn hot" onclick="Quests480.acceptQuest('${q.id}');Quests480.openBoard('${regionKey}')">Aceitar Contrato</button>`;
      }

      const rankBadge = typeof GR !== 'undefined' && GR[q.rank] ? `<span class="rl" style="color:${RANKS[q.rank]?.c || '#ffd54f'}">${GR[q.rank].id}</span> · ` : '';
      const typeLabel = q.type === 'bounty' ? '☠ CAÇADA' : q.type === 'rescue' ? '🛡 RESGATE' : q.type === 'crypt' ? '⚔ CRIPTA' : '📜 CONTRATO';

      let rewardText = `Recompensa: <b>${q.gold} ouro</b> · <b>+${q.xp} XP</b> · <b>+${q.rep} reputação</b>`;
      if (q.rewardItem) rewardText += ` · <i>${q.rewardItem}</i>`;

      h += row(
        `${rankBadge}<b>${q.title}</b> <small style="color:#ffd070">[${typeLabel}]</small>`,
        `${q.desc}<br><small style="color:#8fe3ff">Contratante: ${q.giver}</small><br><span style="color:#7ef5a5">${rewardText}</span>`,
        actHtml
      );
    }

    if (window.Contratos541) h += Contratos541.boardHtml(regionKey);

    // Seletor de Capitais
    h += `<div class="sec">VER MURAIS DE OUTRAS REGIÕES</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">`;
    const regions = [
      ['aster', 'Aster'],
      ['solaria', 'Solaria'],
      ['ymiria', 'Ymiria'],
      ['zahar', 'Zahar'],
      ['thalor', 'Thalor'],
      ['urdan_verden', 'Urdan & Verden']
    ];
    for (const [rid, rname] of regions) {
      h += `<button class="btn ${rid === regionKey ? 'on' : ''}" onclick="Quests480.openBoard('${rid}')">${rname}</button>`;
    }
    h += `</div>`;

    if (typeof openModal === 'function') {
      openModal('MURAL DE CONTRATOS & RECOMPENSAS', h);
    }
  }

  // Hook no Minimapa para desenhar marcadores de missões secundárias ativas
  function hookMinimap() {
    if (typeof window.Campaign327 !== 'undefined' && typeof window.Campaign327.map === 'function' && !window.Campaign327.map.__quests480) {
      const origMap = window.Campaign327.map;
      const wrapped = function (ctx, S, full) {
        origMap.apply(this, arguments);
        try {
          const st = getState();
          if (!st || !st.tracked || !st.active[st.tracked] || typeof player === 'undefined' || !player) return;
          const q = QUEST_CATALOG[st.tracked];
          const act = st.active[st.tracked];
          if (!q || !act || !act.targetPos) return;

          const k = full ? S / 560 : 2.2;
          const dx = (act.targetPos.x - player.x) * k;
          const dz = (act.targetPos.z - player.z) * k;
          const lim = S / 2 - 12;
          const scale = Math.min(1, lim / Math.max(Math.abs(dx), Math.abs(dz), 1));
          const mx = S / 2 + dx * scale;
          const my = S / 2 + dz * scale;

          ctx.save();
          ctx.translate(mx, my);
          ctx.fillStyle = '#ff4d6a';
          ctx.strokeStyle = '#2b050d';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#ff4d6a';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          if (scale < 1) {
            ctx.rotate(Math.atan2(dz, dx));
            ctx.moveTo(8, 0); ctx.lineTo(-6, -6); ctx.lineTo(-3, 0); ctx.lineTo(-6, 6); ctx.closePath();
          } else {
            ctx.arc(0, 0, 6, 0, TAU);
          }
          ctx.fill();
          ctx.stroke();

          if (full) {
            ctx.fillStyle = '#ffe5b4';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText(q.title.split(':')[0] || 'Missão', 10, 3);
          }
          ctx.restore();
        } catch (_) {}
      };
      wrapped.__quests480 = true;
      window.Campaign327.map = wrapped;
    }
  }

  // Loop de monitoramento para spawn do encontro e conclusão
  let lastTick = performance.now();

  // =========================================================================
  // ENCONTROS EMERGENTES DE MUNDO ABERTO POR BIOMA (ESTILO SKYRIM)
  // Mar, Neve, Deserto, Pântano, Vulcão, Floresta e Clima de Tempestade.
  // NPCs errantes, expedições congeladas, náufragos, caravanas e eremitas
  // que o jogador encontra organicamente enquanto explora qualquer terreno.
  // =========================================================================
  let lastEmergentCheck = performance.now();
  let currentEmergentNpc = null;

  const EMERGENT_DEFS = [
    // --- CAMPOS, FLORESTAS E PLANÍCIES ---
    {
      type: 'injured_hunter',
      biomes: ['campos', 'floresta', 'flores'],
      name: 'Kallan, Caçador Ferido',
      sign: '! CAÇADOR DA ORDEM',
      speech: 'Pelos Sete... Viajante, aproxime-se! Preciso de ajuda!',
      title: 'ENCONTRO NA ESTRADA · CAÇADOR DA ORDEM',
      desc: 'Minha patrulha foi emboscada por uma alcateia de Feras Abissais na colina logo ao norte. A líder da alcateia levou o amuleto da nossa capitã e dispersou meus companheiros. Se você caçar a fera alfa e vingar a patrulha, a Ordem te recompensará generosamente!',
      chibi: { body: 0x3d4a36, hair: 0xd0b070, wep: 'bow', wcol: 0xffd08a, gk: 'Rogue', tint: 0xd0ff8a },
      quest: {
        id: 'emergent_alpha_beast',
        title: 'Caçada: A Fera Alfa das Colinas',
        giver: 'Kallan · Patrulha da Ordem',
        desc: 'Derrote a fera alfa abissal que emboscou a patrulha de Kallan nas colinas e recupere a honra dos caçadores.',
        bossKind: 'lobo',
        bossName: 'Lobo Alfa Abissal',
        bossScale: 1.7,
        minions: 3,
        minionKinds: ['lobo'],
        gold: 1800,
        xp: 950,
        rep: 75,
        trust: 15
      }
    },
    {
      type: 'broken_cart',
      biomes: ['campos', 'floresta', 'flores'],
      name: 'Doran, Mercador Ambulante',
      sign: '! CARROÇA SAQUEADA',
      speech: 'Malditos saqueadores! Levaram meus caixotes!',
      title: 'SOCORRO NA ESTRADA · CARROÇA SAQUEADA',
      desc: 'Minha carroça quebrou a roda nesta subida pedregosa e um bando de renegados caiu sobre nós! Eles arrastaram meus fardos de minério refinado e tecidos raros para o acampamento de pedras logo adiante. Recupere minha carga e divido 2.200 de ouro e cristais raros com você!',
      chibi: { body: 0x5a3a22, hair: 0x8a5a3a, wep: 'none', gk: 'Merchant', tint: 0xffd54f },
      quest: {
        id: 'emergent_stolen_cargo',
        title: 'Resgate: A Carga Roubada de Doran',
        giver: 'Doran · Mercador da Estrada',
        desc: 'Elimine os saqueadores renegados que emboscaram a carroça de Doran e recupere o baú de mercadorias refinadas.',
        bossKind: 'orcinho',
        bossName: 'Chefe dos Saqueadores da Estrada',
        bossScale: 1.6,
        minions: 4,
        minionKinds: ['ninjinha', 'orcinho'],
        gold: 2200,
        xp: 1100,
        rep: 90,
        trust: 20
      }
    },
    {
      type: 'ancient_scholar',
      biomes: ['campos', 'floresta', 'flores', 'ruinas'],
      name: 'Eldrin, Sábio das Ruínas',
      sign: '? MONÓLITO ANCESTRAL',
      speech: 'A voz dos Primevos ainda ressoa neste monumento...',
      title: 'MISTÉRIO ANTIGO · MONÓLITO DOS PRIMEVOS',
      desc: 'Saudações, Transmigrador. Você sente o calor desta pedra antiga? Este monumento guarda o espírito de um Guardião Ancestral que resistiu às primeiras Fendas. Se você tiver a audácia de tocar a runa e superar a Provação da Sombra, os tesouros do santuário reconhecerão seu poder!',
      chibi: { body: 0x2a3a5a, hair: 0xffffff, wep: 'staff', wcol: 0x7fd8ff, gk: 'Mage', tint: 0x7fd8ff },
      quest: {
        id: 'emergent_monolith_trial',
        title: 'Provação: O Guardião do Monólito Ancestral',
        giver: 'Eldrin · Estudioso das Ruínas',
        desc: 'Toque o monólito rúnico antigo e derrote a aparição espectral do Guardião Ancestral para liberar seus segredos.',
        bossKind: 'cavaleiro',
        bossName: 'Aparição do Guardião Ancestral',
        bossScale: 1.8,
        minions: 2,
        minionKinds: ['esqueleto'],
        gold: 2500,
        xp: 1300,
        rep: 120,
        trust: 25
      }
    },
    {
      type: 'deserter_scout',
      biomes: ['campos', 'floresta', 'flores'],
      name: 'Vael, Batedor Renegado',
      sign: '! FUGITIVO NAS ROCHAS',
      speech: 'Psiu! Ei, Transmigrador... aqui nas rochas!',
      title: 'SEGREDOS NAS MONTANHAS · O BATEDOR RENEGADO',
      desc: 'A guarnição acha que fugi por covardia, mas a verdade é que descobri algo aterrador: um ninho de feras com chifres guardando uma arca reluzente de cristais abissais em um covil secreto logo acima. Eu não consigo derrotá-los sozinho, mas você sim. Fique com a localização da arca!',
      chibi: { body: 0x2d3436, hair: 0x636e72, wep: 'dagger', wcol: 0xb2bec3, gk: 'Rogue', tint: 0xdfe6e9 },
      quest: {
        id: 'emergent_deserter_stash',
        title: 'Covil Secreto: A Arca das Rochas Altas',
        giver: 'Vael · Batedor Renegado',
        desc: 'Siga as coordenadas entregues pelo batedor Vael até o covil oculto nas pedras e conquiste o tesouro das feras.',
        bossKind: 'cogufuria',
        bossName: 'Monstruosidade com Chifres',
        bossScale: 1.7,
        minions: 3,
        minionKinds: ['cogu'],
        gold: 2800,
        xp: 1400,
        rep: 100,
        trust: 18
      }
    },
    {
      type: 'druid_grove',
      biomes: ['floresta', 'pantano'],
      name: 'Silvanus, Druida Ancestral',
      sign: '? BOSQUE SAGRADO',
      speech: 'As raízes deste bosque choram seiva negra... ajude a purificá-las!',
      title: 'NATUREZA CORROMPIDA · O BOSQUE ANCESTRAL',
      desc: 'As raízes desta clareira sagrada foram infectadas pelo miasma das fendas. Uma monstruosidade fúngica está sugando a vitalidade das árvores. Elimine o fungo primordial antes que toda a mata apodreça!',
      chibi: { body: 0x1b4332, hair: 0xd8f3dc, wep: 'staff', wcol: 0x52b788, gk: 'Druid', tint: 0x74c69d },
      quest: {
        id: 'emergent_corrupted_grove',
        title: 'Purificação: O Coração Fúngico da Floresta',
        giver: 'Silvanus · Druida Ancestral',
        desc: 'Destrua o fungo primordial corrompido que infecta o bosque sagrado de Silvanus.',
        bossKind: 'cogufuria',
        bossName: 'Fungo Primordial Corrompido',
        bossScale: 1.8,
        minions: 4,
        minionKinds: ['cogu'],
        gold: 2600,
        xp: 1350,
        rep: 110,
        trust: 20
      }
    },

    // --- MAR, COSTA E ÁGUAS ---
    {
      type: 'shipwreck_sailor',
      biomes: ['coast', 'water', 'campos'],
      requireWater: true,
      name: 'Bran, Pescador Náufrago',
      sign: '! NÁUFRAGO NO ROCHEDO',
      speech: 'Minha jangada partiu ao meio nas pedras! As criaturas das marés levaram meus barris!',
      title: 'MARÉS TRAIÇOEIRAS · O NÁUFRAGO DE ROCHEDOS',
      desc: 'Uma onda súbita jogou minha embarcação contra os arrecifes. As bestas marinhas de carapaça dura cercaram os caixotes de pérolas que eu trazia da ilha exterior. Me ajude a quebrar as carapaças das feras e recuperar meus bens!',
      chibi: { body: 0x1e3a8a, hair: 0x93c5fd, wep: 'spear', wcol: 0x38bdf8, gk: 'Warrior', tint: 0x60a5fa },
      quest: {
        id: 'emergent_shipwreck_salvage',
        title: 'Resgate nas Marés: Os Fardos do Náufrago Bran',
        giver: 'Bran · Pescador Náufrago',
        desc: 'Derrote os monstros de carapaça nas pedras costeiras e recupere as pérolas da jangada naufragada.',
        bossKind: 'escaravelho',
        bossName: 'Caranguejo Titânico dos Arrecifes',
        bossScale: 1.7,
        minions: 3,
        minionKinds: ['slime', 'escaravelho'],
        gold: 2400,
        xp: 1200,
        rep: 95,
        trust: 22
      }
    },
    {
      type: 'abyssal_carcass',
      biomes: ['coast', 'water', 'campos'],
      requireWater: true,
      name: 'Morren, Caçador de Marés',
      sign: '! CARCAÇA DO LEVIATÃ',
      speech: 'Uma fera colossal encalhou aqui... e os corsários querem roubar nosso troféu!',
      title: 'ESPÓLIOS DA MARÉ · O LEVIATÃ ENCALHADO',
      desc: 'Conseguimos encurralar uma serpente das profundezas na maré baixa, mas saqueadores da costa chegaram armados para roubar os dentes e o âmbar cinzento. Junte-se a nós para espantar esses piratas e dividiremos o espólio abissal!',
      chibi: { body: 0x0f172a, hair: 0xe2e8f0, wep: 'axe', wcol: 0x38bdf8, gk: 'Warrior', tint: 0x0284c7 },
      quest: {
        id: 'emergent_leviathan_spoils',
        title: 'Disputa Costeira: Os Espólios do Leviatã',
        giver: 'Morren · Caçador de Marés',
        desc: 'Expulse os corsários renegados que tentam roubar a carcaça do leviatã encalhado na costa.',
        bossKind: 'orcinho',
        bossName: 'Capitão Corsário dos Arrecifes',
        bossScale: 1.6,
        minions: 4,
        minionKinds: ['ninjinha', 'orcinho'],
        gold: 2700,
        xp: 1400,
        rep: 105,
        trust: 24
      }
    },

    // --- NEVE, TUNDRA E PICOS GLACIAIS ---
    {
      type: 'frozen_expedition',
      biomes: ['neve', 'cristal'],
      name: 'Yara, Exploradora Glacial',
      sign: '! EXPEDIÇÃO NA NEVASCA',
      speech: 'O gelo não perdoa... Meus batedores congelaram e golens nos cercaram!',
      title: 'EXPEDIÇÃO GLACIAL · O CERCO DE GELO',
      desc: 'Nossa equipe de mapeamento foi pega por uma tempestade de gelo súbita. O calor da nossa tenda atraiu golens glaciais primordiais que bloquearam a trilha de retorno. Destrua os golens e escolte nossa expedição até a fogueira segura!',
      chibi: { body: 0xe0f2fe, hair: 0x38bdf8, wep: 'staff', wcol: 0xbae6fd, gk: 'Mage', tint: 0x7dd3fc },
      quest: {
        id: 'emergent_frozen_expedition',
        title: 'Socorro no Gelo: Os Golens Glaciais da Nevasca',
        giver: 'Yara · Exploradora Glacial',
        desc: 'Quebre o cerco dos golens de gelo ao redor da tenda da expedição de Yara nas montanhas congeladas.',
        bossKind: 'golempedra',
        bossName: 'Colosso do Gelo Eterno',
        bossScale: 1.7,
        minions: 3,
        minionKinds: ['golenzinho'],
        gold: 2600,
        xp: 1350,
        rep: 110,
        trust: 25
      }
    },
    {
      type: 'avalanche_trap',
      biomes: ['neve', 'cristal'],
      name: 'Torik, Condutor da Nevasca',
      sign: '! TRENÓ SOTERRADO',
      speech: 'A avalanche bloqueou a passagem e os lobos brancos farejaram nosso rastro!',
      title: 'PERIGO BRANCO · A AVALANCHE DAS ALTURAS',
      desc: 'Uma tonelada de neve desabou do pico e soterrou meu trenó de suprimentos. Pior ainda: os lobos da nevasca desceram a crista atraídos pelo cheiro das carnes secas. Me dê cobertura enquanto desenterro a carga!',
      chibi: { body: 0x475569, hair: 0x94a3b8, wep: 'axe', wcol: 0xf1f5f9, gk: 'Warrior', tint: 0x94a3b8 },
      quest: {
        id: 'emergent_avalanche_ambush',
        title: 'Emboscada na Neve: A Alcateia das Geadas',
        giver: 'Torik · Condutor da Nevasca',
        desc: 'Extermine a alcateia de lobos da nevasca que cerca o trenó soterrado pela avalanche.',
        bossKind: 'lobo',
        bossName: 'Lobo Alfa da Nevasca',
        bossScale: 1.8,
        minions: 4,
        minionKinds: ['lobo'],
        gold: 2400,
        xp: 1250,
        rep: 95,
        trust: 18
      }
    },
    {
      type: 'frost_hermit',
      biomes: ['neve', 'cristal'],
      name: 'Skadi, Eremita da Chama Eterna',
      sign: '? FOGUEIRA MÁGICA',
      speech: 'Aproxime-se do fogo sagrado, viajante. Os espectros do frio querem apagá-lo.',
      title: 'CHAMA ETERNA · A VIGÍLIA DA MONTANHA',
      desc: 'Esta fogueira mágica arde há três séculos sobre o gelo e impede que os mortos sepultados na avalanche acordem. Mas hoje as sombras do frio estão agitadas. Me ajude a repelir os espectros congelados e compartilharei o fogo primordial com sua lâmina!',
      chibi: { body: 0x1e293b, hair: 0xfbbf24, wep: 'staff', wcol: 0xf59e0b, gk: 'Mage', tint: 0xfcd34d },
      quest: {
        id: 'emergent_eternal_flame',
        title: 'Vigília Sagrada: A Chama Eterna de Skadi',
        giver: 'Skadi · Eremita da Chama',
        desc: 'Proteja a fogueira eterna contra a investida dos cavaleiros espectrais do gelo.',
        bossKind: 'cavaleiro',
        bossName: 'Cavaleiro Espectral do Gelo',
        bossScale: 1.8,
        minions: 3,
        minionKinds: ['esqueleto'],
        gold: 2900,
        xp: 1500,
        rep: 130,
        trust: 30
      }
    },

    // --- DESERTO, DUNAS E CÂNYONS ---
    {
      type: 'sandstorm_caravan',
      biomes: ['deserto'],
      name: 'Hakim, Mercador do Oásis',
      sign: '! CARAVANA NAS DUNAS',
      speech: 'A tempestade de areia engoliu nossa trilha e os escaravelhos saíram das dunas!',
      title: 'TERROR NAS AREIAS · O ATAQUE DOS ESCARAVELHOS',
      desc: 'Nossos camelos empacaram quando as areias movediças cederam. De repente, escaravelhos carnívoros brotaram debaixo da terra querendo estraçalhar nossa carga de especiarias e água pura. Esmague o ninho antes que sejamos devorados!',
      chibi: { body: 0xb45309, hair: 0xfde68a, wep: 'dagger', wcol: 0xf59e0b, gk: 'Merchant', tint: 0xfbbf24 },
      quest: {
        id: 'emergent_dune_beetles',
        title: 'Praga das Areias: O Ninho de Escaravelhos Gigantes',
        giver: 'Hakim · Mercador do Oásis',
        desc: 'Esmague a rainha dos escaravelhos do deserto que cerca a caravana encalhada de Hakim.',
        bossKind: 'escaravelho',
        bossName: 'Rainha Escaravelho das Dunas',
        bossScale: 1.8,
        minions: 4,
        minionKinds: ['escaravelho'],
        gold: 2700,
        xp: 1350,
        rep: 110,
        trust: 22
      }
    },
    {
      type: 'dune_mirage',
      biomes: ['deserto'],
      name: 'Zayd, Guardião das Areias',
      sign: '? OÁSIS ILUSÓRIO',
      speech: 'Você vê as águas cristalinas adiante? Não passe: é o encanto de um Djinn furioso!',
      title: 'ILUSÃO MORTAL · O ENIGMA DO DJINN',
      desc: 'Aquele oásis verdejante é uma miragem arcana projetada por um feiticeiro do vento corrompido pelas fendas. Todo viajante sedento que se aproxima tem a alma drenada pelas tempestades de poeira. Rompa a miragem derrotando a aparição do Djinn!',
      chibi: { body: 0x78350f, hair: 0xfef08a, wep: 'staff', wcol: 0xfacc15, gk: 'Mage', tint: 0xfde047 },
      quest: {
        id: 'emergent_sand_mirage',
        title: 'Miragem Arcana: O Djinn das Areias Douradas',
        giver: 'Zayd · Guardião das Areias',
        desc: 'Derrote a aparição mágica do Djinn e dissipe a miragem mortal no meio do deserto.',
        bossKind: 'magote',
        bossName: 'Aparição do Djinn das Tempestades de Areia',
        bossScale: 1.7,
        minions: 3,
        minionKinds: ['magote'],
        gold: 2800,
        xp: 1450,
        rep: 125,
        trust: 25
      }
    },
    {
      type: 'tomb_raider_sand',
      biomes: ['deserto'],
      name: 'Farah, Saqueadora de Relíquias',
      sign: '! TUMBA SOTERRADA',
      speech: 'Consegui quebrar o selo da tumba, mas acordei a múmia guardiã! Me ajude a derrubá-la!',
      title: 'TUMBA PRIMEVA · O DESPERTAR DO FARAÓ',
      desc: 'Passei semanas desenterrando a entrada deste mausoléu de arenito. Assim que quebrei a pedra-chave rúnica, um faraó esquelético despertou com guardas de bronze jurando matar quem violasse seu descanso. Ajude a derrotá-lo e o tesouro rúnico é nosso!',
      chibi: { body: 0x451a03, hair: 0xfbbf24, wep: 'dagger', wcol: 0xd97706, gk: 'Rogue', tint: 0xf59e0b },
      quest: {
        id: 'emergent_pharaoh_tomb',
        title: 'Mausoléu de Arenito: O Faraó Esquelético das Dunas',
        giver: 'Farah · Saqueadora de Relíquias',
        desc: 'Penetre na entrada da tumba soterrada e derrote o guardião esquelético das dunas.',
        bossKind: 'esqueleto',
        bossName: 'Faraó Esquelético das Areias',
        bossScale: 1.8,
        minions: 4,
        minionKinds: ['esqueleto'],
        gold: 3000,
        xp: 1550,
        rep: 135,
        trust: 26
      }
    },

    // --- PÂNTANO E TERRAS CORROMPIDAS ---
    {
      type: 'swamp_witch',
      biomes: ['pantano'],
      name: 'Morrigan, Alquimista da Lama',
      sign: '? CALDEIRÃO NO PÂNTANO',
      speech: 'Hihihi... Um viajante no meu pântano? Traga-me o núcleo da Gosma Matriarca!',
      title: 'ALQUIMIA SOMBRIA · O CALDEIRÃO DA BRUXA',
      desc: 'Eu preparo elixires que os tolos das cidades chamam de veneno. Preciso do núcleo gelatinoso da Gosma Matriarca que vive no charco profundo. Destrua a gosma e coloque o núcleo no meu caldeirão; em troca, te darei uma poção de mutação de dano!',
      chibi: { body: 0x3b0764, hair: 0xa855f7, wep: 'staff', wcol: 0x9333ea, gk: 'Mage', tint: 0xc084fc },
      quest: {
        id: 'emergent_swamp_slime',
        title: 'Ingrediente Proibido: A Gosma Matriarca do Pântano',
        giver: 'Morrigan · Alquimista da Lama',
        desc: 'Derrote a Gosma Matriarca no coração do pântano para alimentar o caldeirão de Morrigan.',
        bossKind: 'gosma',
        bossName: 'Gosma Matriarca do Charco Escuro',
        bossScale: 2.0,
        minions: 5,
        minionKinds: ['gosma'],
        gold: 2700,
        xp: 1400,
        rep: 100,
        trust: 20
      }
    },
    {
      type: 'will_o_wisp',
      biomes: ['pantano'],
      name: 'Espírito das Brumas',
      sign: '? FOGO-FÁTUO LUMINOSO',
      speech: 'Siga minha luz fátua... meu túmulo foi profanado nas águas paradas...',
      title: 'ALMAS ERRANTES · A CRIPTA SUBMERSA',
      desc: 'Eu era um campeão da Ordem antes das Fendas. Minha armadura ancestral e meus ossos descansam sob a água fétida, guardados por um cavaleiro espectral corrompido pelo lodo. Purifique meu sepulcro e a bênção da minha espada protegerá seu caminho.',
      chibi: { body: 0x064e3b, hair: 0x34d399, wep: 'sword', wcol: 0x6ee7b7, gk: 'Warrior', tint: 0xa7f3d0 },
      quest: {
        id: 'emergent_sunken_tomb',
        title: 'Purificação Espectral: A Cripta Submersa do Pântano',
        giver: 'Espírito das Brumas',
        desc: 'Encontre a cripta submersa indicada pelo fogo-fátuo e derrote o cavaleiro espectral do lodo.',
        bossKind: 'cavaleiro',
        bossName: 'Cavaleiro Espectral do Charco',
        bossScale: 1.7,
        minions: 3,
        minionKinds: ['esqueleto'],
        gold: 2900,
        xp: 1500,
        rep: 130,
        trust: 28
      }
    },

    // --- VULCÃO E ROCHAS ARDENTES ---
    {
      type: 'magma_smith',
      biomes: ['vulcao'],
      name: 'Ignis, Forjador das Brasas',
      sign: '! FORJA NO MAGMA',
      speech: 'Vim temperar metal no rio de fogo, mas as feras ígneas cercaram minha bigorna!',
      title: 'FOGO PRIMORDIAL · A FORJA NA LAVA',
      desc: 'O aço comum quebra contra as garras das fendas; apenas a têmpera no magma verdadeiro produz gumes inquebráveis. Porém, o bater do meu martelo despertou golens de pedra incandescente das fendas vulcânicas. Me ajude a derrubá-los e te darei lingotes de obsidiana viva!',
      chibi: { body: 0x7f1d1d, hair: 0xf87171, wep: 'axe', wcol: 0xef4444, gk: 'Warrior', tint: 0xfca5a5 },
      quest: {
        id: 'emergent_magma_forge',
        title: 'Forja do Vulcão: Os Colossos de Rocha Ardente',
        giver: 'Ignis · Forjador das Brasas',
        desc: 'Elimine os golens de magma incandescente que sitiaram a bigorna de Ignis na ravina vulcânica.',
        bossKind: 'golempedra',
        bossName: 'Colosso de Lava e Obsidiana',
        bossScale: 1.8,
        minions: 3,
        minionKinds: ['golenzinho'],
        gold: 3100,
        xp: 1600,
        rep: 140,
        trust: 30
      }
    },

    // --- CLIMA ESPECIAL: TEMPESTADE DE RAIOS ---
    {
      type: 'storm_sorcerer',
      requireRain: true,
      biomes: ['campos', 'floresta', 'flores', 'coast'],
      name: 'Zephyr, Mago das Tempestades',
      sign: '? RELÂMPAGOS NO CÉU',
      speech: 'A tempestade está em seu ápice! Os golens de trovão foram atraídos pelo meu cajado!',
      title: 'IRA DOS CÉUS · O SURTO DOS RELÂMPAGOS',
      desc: 'Aproveito as chuvas torrenciais para sintonizar a magia de choque com as nuvens carregadas. Mas o excesso de eletricidade arcana gerou criaturas de estática pura que estão fora de controle. Supere o choque desses golens elétricos e te concederei a Essência da Tempestade!',
      chibi: { body: 0x312e81, hair: 0x818cf8, wep: 'staff', wcol: 0x6366f1, gk: 'Mage', tint: 0xa5b4fc },
      quest: {
        id: 'emergent_thunder_storm',
        title: 'Fúria dos Relâmpagos: Os Golens de Trovão da Tempestade',
        giver: 'Zephyr · Mago das Tempestades',
        desc: 'Neutralize os golens elétricos atraídos pelo cajado de Zephyr durante a tempestade de raios.',
        bossKind: 'golempedra',
        bossName: 'Colosso de Relâmpago e Trovão',
        bossScale: 1.8,
        minions: 3,
        minionKinds: ['magote'],
        gold: 3300,
        xp: 1700,
        rep: 150,
        trust: 32
      }
    }
  ];
  /* v655 (Ian): nome sem título («Zayd, Guardião das Areias» vira «Zayd»); a função aparece embaixo do nome na conversa */
  for (const d of EMERGENT_DEFS) {
    if (d.name && d.name.includes(',') && !d.role) { const p = d.name.split(','); d.name = p[0].trim(); d.role = p.slice(1).join(',').trim(); }
    if (d.quest && d.quest.giver) d.quest.giver = String(d.quest.giver).split(' · ')[0].trim();
  }

  // Objetos interativos e de tesouro gerados no local do contrato (Skyrim style)
  const QUEST_OBJECTS = {
    emergent_deserter_stash: {
      kind: 'chest',
      name: 'ARCA DAS ROCHAS ALTAS',
      label: 'F · ABRIR ARCA DAS ROCHAS ALTAS',
      hintDefeat: 'Derrote a Monstruosidade com Chifres e as feras guardiãs para abrir a Arca!',
      hintReady: 'As feras do covil foram derrotadas! Pressione [E] para abrir a Arca de Cristais!',
      winTitle: 'ARCA CONQUISTADA',
      winMsg: 'Você abriu a Arca das Rochas Altas e resgatou os cristais abissais!'
    },
    emergent_stolen_cargo: {
      kind: 'cargo',
      name: 'CARGA ROUBADA DE DORAN',
      label: 'F · RECUPERAR FARDOS DE MERCADORIAS',
      hintDefeat: 'Elimine os saqueadores renegados para recuperar os fardos!',
      hintReady: 'Os saqueadores foram derrotados! Pressione [E] para resgatar a carga!',
      winTitle: 'CARGA RECUPERADA',
      winMsg: 'Você resgatou a carga refinada do mercador Doran!'
    },
    emergent_monolith_trial: {
      kind: 'monolith',
      name: 'MONÓLITO ANCESTRAL',
      label: 'F · TOCAR MONÓLITO RÚNICO',
      hintDefeat: 'Derrote a Aparição do Guardião para liberar o segredo do Monólito!',
      hintReady: 'A Provação foi superada! Pressione [E] para tocar o Monólito!',
      winTitle: 'PROVAÇÃO CUMPRIDA',
      winMsg: 'O Monólito ressoou e revelou seus tesouros ancestrais!'
    },
    emergent_shipwreck_salvage: {
      kind: 'cargo',
      name: 'FARDOS DO NÁUFRAGO BRAN',
      label: 'F · RESGATAR BARRIS DE PÉROLAS',
      hintDefeat: 'Destrua as criaturas das marés para recuperar os barris!',
      hintReady: 'As marés se acalmaram! Pressione [E] para recuperar os barris de Bran!',
      winTitle: 'BARRIS RESGATADOS',
      winMsg: 'Você recuperou os barris de pérolas do náufrago Bran!'
    },
    emergent_leviathan_spoils: {
      kind: 'chest',
      name: 'ESPÓLIOS DO LEVIATÃ',
      label: 'F · SAQUEAR ESPÓLIOS DO LEVIATÃ',
      hintDefeat: 'Derrote o Capitão Corsário para reivindicar os espólios!',
      hintReady: 'Os corsários caíram! Pressione [E] para abrir o baú do Leviatã!',
      winTitle: 'ESPÓLIOS REIVINDICADOS',
      winMsg: 'Você conquistou os espólios lendários do Leviatã!'
    },
    emergent_eternal_flame: {
      kind: 'altar',
      name: 'CHAMA ETERNA DE SKADI',
      label: 'F · ACENDER CHAMA SAGRADA',
      hintDefeat: 'Derrote o Cavaleiro Espectral do Gelo para reacender o fogo sagrado!',
      hintReady: 'O espectro se dissipou! Pressione [E] para acender a Chama Eterna!',
      winTitle: 'CHAMA SAGRADA ACESA',
      winMsg: 'A Chama Eterna de Skadi voltou a arder contra o frio!'
    },
    emergent_pharaoh_tomb: {
      kind: 'sarcophagus',
      name: 'SARCÓFAGO DAS DUNAS',
      label: 'F · ABRIR SARCÓFAGO ANCESTRAL',
      hintDefeat: 'Destrua o Faraó Esquelético antes de abrir o sarcófago!',
      hintReady: 'O Faraó ruiu em pó! Pressione [E] para saquear o sarcófago!',
      winTitle: 'TÚMULO CONQUISTADO',
      winMsg: 'Você violou os tesouros de ouro do sarcófago das areias!'
    },
    emergent_sunken_tomb: {
      kind: 'altar',
      name: 'RELICÁRIO DA CRIPTA SUBMERSA',
      label: 'F · PURIFICAR RELICÁRIO SUBMERSO',
      hintDefeat: 'Derrote o Cavaleiro Espectral do charco primeiro!',
      hintReady: 'A cripta submersa silenciou! Pressione [E] para purificar o relicário!',
      winTitle: 'CRIPTA PURIFICADA',
      winMsg: 'A cripta do pântano foi purificada da maldição espectral!'
    },
    emergent_magma_forge: {
      kind: 'altar',
      name: 'FORJA DE OBSIDIANA',
      label: 'F · RECLAMAR FORJA VULCÂNICA',
      hintDefeat: 'Esmague os Colossos de Rocha Ardente antes de usar a forja!',
      hintReady: 'Os colossos ardentes tombaram! Pressione [E] para ativar a forja!',
      winTitle: 'FORJA RECLAMADA',
      winMsg: 'A forja vulcânica foi reativada com poder primordial!'
    },
    emergent_corrupted_grove: {
      kind: 'altar',
      name: 'CORAÇÃO FÚNGICO DA FLORESTA',
      label: 'F · PURIFICAR BOSQUE SAGRADO',
      hintDefeat: 'Destrua o Fungo Primordial antes de purificar as raízes!',
      hintReady: 'O fungo corrupto foi destruído! Pressione [E] para purificar a clareira!',
      winTitle: 'BOSQUE PURIFICADO',
      winMsg: 'O bosque de Silvanus foi purificado de toda corrupção!'
    }
  };

  // Popula todas as missões de EMERGENT_DEFS no QUEST_CATALOG global imediatamente
  EMERGENT_DEFS.forEach(enc => {
    if (enc.quest && enc.quest.id) {
      QUEST_CATALOG[enc.quest.id] = {
        ...enc.quest,
        region: 'mundo_aberto',
        type: 'emergent',
        encType: enc.type,
        biome: (enc.biomes && enc.biomes[0]) || 'campos',
        offset: { dx: 110, dz: -90 }
      };
    }
  });

  function createQuestObjectMesh(kind) {
    const g = new THREE.Group();
    let lid = null;

    if (kind === 'chest') {
      if (typeof envChest === 'function' && typeof ENV !== 'undefined' && ENV.ok) {
        try {
          const o = envChest(true);
          g.add(o.g);
          lid = o.lid;
        } catch (_) {}
      }
      if (!g.children.length) {
        const bodyGeo = new THREE.BoxGeometry(1.5, 0.85, 1.1);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x54321d, roughness: 0.8 });
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        bodyMesh.position.y = 0.42;
        g.add(bodyMesh);

        lid = new THREE.Group();
        lid.position.set(0, 0.85, -0.55);
        const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.38, 1.15), new THREE.MeshStandardMaterial({ color: 0x824e2d, roughness: 0.7 }));
        lidMesh.position.set(0, 0.19, 0.55);
        lid.add(lidMesh);
        g.add(lid);

        const goldBand = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 1.2), new THREE.MeshStandardMaterial({ color: 0xffd070, roughness: 0.3, metalness: 0.8 }));
        goldBand.position.y = 0.85;
        g.add(goldBand);
      }
      const cry = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: false }));
      cry.position.set(0, 1.45, 0);
      cry.scale.set(0.7, 1.4, 0.7);
      g.add(cry);
      g.userData.crystal = cry;

    } else if (kind === 'cargo') {
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), new THREE.MeshStandardMaterial({ color: 0x6e4a2e, roughness: 0.85 }));
      c1.position.set(0, 0.55, 0);
      g.add(c1);
      const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.85), new THREE.MeshStandardMaterial({ color: 0x8a5d3b, roughness: 0.85 }));
      c2.position.set(0.6, 0.42, 0.5);
      g.add(c2);
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.2, 12), new THREE.MeshStandardMaterial({ color: 0x4a321f, roughness: 0.9 }));
      bar.position.set(-0.7, 0.6, 0.3);
      g.add(bar);

    } else if (kind === 'monolith') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 1.8), new THREE.MeshStandardMaterial({ color: 0x3d3f45, roughness: 0.9 }));
      base.position.y = 0.2;
      g.add(base);
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 3.2, 0.7), new THREE.MeshStandardMaterial({ color: 0x5a5d66, roughness: 0.8 }));
      pillar.position.y = 1.8;
      g.add(pillar);
      const rune = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), new THREE.MeshBasicMaterial({ color: 0x7fd8ff }));
      rune.position.set(0, 2.5, 0.37);
      g.add(rune);

    } else if (kind === 'altar') {
      const aBase = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.8, 8), new THREE.MeshStandardMaterial({ color: 0x444450, roughness: 0.9 }));
      aBase.position.y = 0.4;
      g.add(aBase);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.5, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x22222a, roughness: 0.7 }));
      bowl.position.y = 0.95;
      g.add(bowl);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff6a00 }));
      flame.position.y = 1.35;
      g.add(flame);
      g.userData.flame = flame;

    } else if (kind === 'sarcophagus') {
      const sBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 2.4), new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.9 }));
      sBase.position.y = 0.4;
      g.add(sBase);
      const sLid = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 2.5), new THREE.MeshStandardMaterial({ color: 0xfaedcd, roughness: 0.8 }));
      sLid.position.y = 0.95;
      g.add(sLid);
      lid = sLid;
    }

    const aura = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 2.1, 32),
      new THREE.MeshBasicMaterial({ color: 0xffd070, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
    );
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.06;
    g.add(aura);

    return { group: g, lid };
  }

  function openEmergentDialogue(encDef, npc) {
    /* v520: árvore de diálogo com escolhas e memória (tools/dialogo520.js) */
    if (global.Dialogo520 && global.Dialogo520.open) { try { global.Dialogo520.open(encDef, npc || currentEmergentNpc); return; } catch (_) {} }
    let h = `<div class="guide93">`;
    h += `<strong>${encDef.name}</strong>`;
    h += `<p style="font-size:13px;line-height:1.45;margin-top:6px;color:#dbe8f2">${encDef.desc}</p>`;
    h += `</div>`;

    h += `<div class="sec">O QUE VOCÊ DESEJA FAZER?</div>`;
    h += `<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">`;
    h += `<button class="btn hot" onclick="Quests480.acceptEmergent('${encDef.type}');if(typeof closeModal==='function')closeModal();">Aceitar: ${encDef.quest.title} (+${encDef.quest.gold} Ouro)</button>`;
    h += `<button class="btn" onclick="if(typeof toast==='function')toast('Você optou por seguir viagem sem se envolver.');if(typeof closeModal==='function')closeModal();">Seguir Viagem (Liberdade de Exploração)</button>`;
    h += `</div>`;

    if (typeof openModal === 'function') {
      openModal(encDef.title, h);
    }
  }

  function acceptEmergent(encType, over) {
    const encDef = EMERGENT_DEFS.find(e => e.type === encType);
    if (!encDef) return;
    const qid = encDef.quest.id;
    // Registra quest dinamicamente no catálogo se não existir
    QUEST_CATALOG[qid] = {
      ...encDef.quest,
      ...(over || {}),
      region: 'mundo_aberto',
      type: 'emergent',
      biome: (encDef.biomes && encDef.biomes[0]) || 'campos',
      offset: { dx: 110, dz: -90 }
    };
    acceptQuest(qid);
    if (typeof sfx === 'function') sfx('quest');
    if (typeof toast === 'function') toast(`<b>[MISSÃO INICIADA]</b> ${encDef.quest.title}! Veja o marcador no minimapa e no HUD.`, 6000);
  }

  function checkEmergentSpawns() {
    if (typeof L === 'undefined' || !L || L.mode !== 'world' || typeof player === 'undefined' || !player || player.dead) return;
    if (typeof nearestCity !== 'function') return;

    const nc = nearestCity(player.x, player.z);
    if (!nc || nc.d < 110) return; // Só spawna fora das cidades, na natureza e estradas

    const now = performance.now();
    if (now - lastEmergentCheck < 35000) return; // Intervalo de 35s entre checagens
    lastEmergentCheck = now;

    // Se já tem um encontro vivo por perto, não spawna outro
    if (currentEmergentNpc && !currentEmergentNpc.gone && Math.hypot(player.x - currentEmergentNpc.x, player.z - currentEmergentNpc.z) < 120) {
      return;
    }

    // Identifica o contexto ambiental atual do jogador (bioma, água, chuva)
    const curBiome = (typeof biomeAt === 'function') ? biomeAt(player.x, player.z) : 'campos';
    const isWet = (typeof inWater244 === 'function') ? inWater244(player.x, player.z) : false;
    const isRaining = (typeof WX !== 'undefined' && WX && WX.type === 'rain');

    // Filtra encontros compatíveis com o ambiente atual
    let matching = EMERGENT_DEFS.filter(enc => {
      if (enc.requireRain && !isRaining) return false;
      if (enc.requireWater && !isWet && curBiome !== 'coast') return false;
      if (enc.biomes && !enc.biomes.includes(curBiome) && !enc.biomes.includes('any')) return false;
      return true;
    });

    // Se a chuva estiver ativa, dá prioridade alta para o encontro de tempestade
    if (isRaining && Math.random() < 0.6) {
      const stormEnc = EMERGENT_DEFS.find(e => e.type === 'storm_sorcerer');
      if (stormEnc) matching = [stormEnc];
    }

    // Fallback gracioso se nenhum bater exatamente com a região
    if (!matching.length) {
      matching = EMERGENT_DEFS.filter(enc => !enc.requireRain && !enc.requireWater);
    }
    if (!matching.length) return;

    const encDef = matching[Math.floor(Math.random() * matching.length)];
    const pAng = (player.face || 0) + (Math.random() - 0.5) * 0.8;
    const dist = 32 + Math.random() * 12;
    const nx = player.x + Math.sin(pAng) * dist;
    const nz = player.z + Math.cos(pAng) * dist;

    if (typeof makeChibi === 'function' && typeof scene !== 'undefined' && typeof npcs !== 'undefined') {
      try {
        const look = encDef.chibi || {
          body: 0x3d4a36,
          hair: 0xd0b070,
          wep: 'bow',
          wcol: 0xffd08a,
          gk: 'Rogue',
          tint: 0xd0ff8a
        };
        const m = makeChibi(look);
        m.root.position.set(nx, 0, nz);
        scene.add(m.root);

        const npcObj = {
          kind: 'emergent_skyrim',
          name: encDef.name,
          short: encDef.name.split(',')[0],
          job523: encDef.role || '',
          m,
          x: nx,
          z: nz,
          face: Math.atan2(player.x - nx, player.z - nz),
          r: 0.8,
          t: 0,
          wait: 999999,
          path: [],
          col: '#6fe39a',
          sign: encDef.sign,
          label: `F · FALAR COM ${encDef.name.toUpperCase()}`,
          speech: encDef.speech,
          calls: 0,
          nextCall: 0,
          use: () => { npcObj.talked = true; openEmergentDialogue(encDef, npcObj); }
        };
        const interEntry = {
          type: 'emergent_npc',
          x: nx,
          z: nz,
          r: 3.2,
          label: npcObj.label,
          use: npcObj.use
        };
        npcObj.interRef = interEntry;
        npcs.push(npcObj);
        currentEmergentNpc = npcObj;

        if (typeof L !== 'undefined' && L && Array.isArray(L.inter)) {
          L.inter.push(interEntry);
        }

        if (typeof toast === 'function') {
          toast(`<b>[AVISTAMENTO]</b> Um viajante chama sua atenção adiante: <i>"${encDef.speech}"</i>`, 6000);
        }
      } catch (_) {}
    }
  }

  const activeSpawns = {}; // { [qid]: { group, chestIt, boss, minions: [], readyNotified: false } }

  function cleanupQuestSpawn(qid) {
    const sp = activeSpawns[qid];
    if (!sp) return;
    if (sp.group && sp.group.parent) {
      try { sp.group.parent.remove(sp.group); } catch (_) {}
    }
    if (sp.chestIt && typeof L !== 'undefined' && L && Array.isArray(L.inter)) {
      L.inter = L.inter.filter(i => i !== sp.chestIt);
    }
    delete activeSpawns[qid];
  }

  function tick(dt) {
    if (typeof paused !== 'undefined' && paused) return;
    if (typeof L === 'undefined' || !L || L.mode !== 'world' || typeof player === 'undefined' || !player || player.dead) return;
    try { checkEmergentSpawns(); } catch (_) {}

    /* v519 (Ian): como no Skyrim, o NPC de encontro chama o jogador ao ver ele chegar perto (13 a 4 m), até 4 vezes */
    const cn = currentEmergentNpc;
    if (cn && !cn.gone && !cn.talked && cn.speech && cn.calls < 4 && typeof speech153 === 'function') {
      const dc = Math.hypot(player.x - cn.x, player.z - cn.z), nowc = performance.now();
      if (dc < 13 && dc > 4 && nowc >= cn.nextCall) {
        cn.calls++; cn.nextCall = nowc + 14000;
        cn.face = Math.atan2(player.x - cn.x, player.z - cn.z);
        try { speech153(cn, cn.speech, cn.calls === 1 ? 'F para falar' : ''); } catch (_) {}
        try { if (typeof beep === 'function') beep(520, .12, .05, 'triangle'); } catch (_) {}
      }
    }

    // Limpeza de NPC emergente distante (> 160m)
    if (currentEmergentNpc && !currentEmergentNpc.gone) {
      const dNpc = Math.hypot(player.x - currentEmergentNpc.x, player.z - currentEmergentNpc.z);
      if (dNpc > 160) {
        currentEmergentNpc.gone = true;
        if (currentEmergentNpc.m && currentEmergentNpc.m.root && typeof scene !== 'undefined') {
          try { scene.remove(currentEmergentNpc.m.root); } catch (_) {}
        }
        if (typeof L !== 'undefined' && L && Array.isArray(L.inter) && currentEmergentNpc.interRef) {
          L.inter = L.inter.filter(i => i !== currentEmergentNpc.interRef);
        }
        currentEmergentNpc = null;
      }
    }

    const S = getState();
    if (!S || !Object.keys(S.active).length) return;

    for (const [qid, act] of Object.entries(S.active)) {
      const qdef = QUEST_CATALOG[qid] || act.def490;
      if (!qdef || !act.targetPos) continue;
      if (!QUEST_CATALOG[qid]) QUEST_CATALOG[qid] = qdef;
      if (qdef.custom508) continue; // v508: missões de "ir até lá" são resolvidas por tools/gatilhos508.js

      const dist = Math.hypot(player.x - act.targetPos.x, player.z - act.targetPos.z);

      // Limpeza se o jogador se afastar muito (> 160m)
      if (dist > 160 && activeSpawns[qid]) {
        cleanupQuestSpawn(qid);
        act.spawned = false;
      }

      // Verifica se as entidades deste contrato estão atualmente ativas na cena
      const sp = activeSpawns[qid];
      const liveBoss = typeof enemies !== 'undefined' ? enemies.some(e => e.questBoss480 === qid && !e.dead) : false;
      const liveMinions = typeof enemies !== 'undefined' ? enemies.some(e => e.questLethal480 === qid && !e.dead) : false;
      const liveChest = typeof L !== 'undefined' && L && Array.isArray(L.inter) ? L.inter.some(i => i.questChest480 === qid && !i.opened) : false;
      const isLive = liveBoss || liveMinions || liveChest || !!sp;

      // Spawna o encontro e o objeto físico quando o jogador se aproxima (dist < 55m)
      // OU se o jogador já está no local (< 55m) mas a cena atual não tem as entidades vivas (ex: pós-recarregamento)
      if (!isLive && dist < 55) {
        act.spawned = true;
        saveState();

        const objDef = QUEST_OBJECTS[qid];
        if (typeof toast === 'function') {
          toast(`<b>[ÁREA DO CONTRATO]</b> Você encontrou o local: <b>${qdef.title}</b>!`, 6000);
        }
        if (typeof bigText === 'function') bigText(objDef ? objDef.name : 'ÁREA DA MISSÃO', 1400);
        if (typeof sfx === 'function') sfx('quest');

        let chestIt = null;
        let groupObj = null;

        // Spawna objeto físico 3D no centro do objetivo (Arca / Monólito / Carga / Altar / Sarcófago)
        if (objDef && typeof THREE !== 'undefined' && typeof scene !== 'undefined') {
          try {
            const { group, lid } = createQuestObjectMesh(objDef.kind);
            // Escolhe o chão mais plano perto do objetivo para a arca não ficar torta nem pendurada
            const flat = (x, z) => { const t = typeof terrH === 'function' ? terrH : () => 0; const v = [t(x, z), t(x - 2.4, z), t(x + 2.4, z), t(x, z - 2.4), t(x, z + 2.4)]; return Math.max(...v) - Math.min(...v); };
            let bx0 = act.targetPos.x, bz0 = act.targetPos.z, bs = flat(bx0, bz0);
            for (const r of [5, 9, 13, 18]) for (let k = 0; k < 10 && bs > 0.25; k++) {
              const cx = act.targetPos.x + Math.cos(k * 0.628 + r) * r, cz = act.targetPos.z + Math.sin(k * 0.628 + r) * r;
              const sl = flat(cx, cz);
              if (sl < bs) { bs = sl; bx0 = cx; bz0 = cz; }
            }
            act.targetPos.x = bx0; act.targetPos.z = bz0; saveState();
            const tx0 = bx0, tz0 = bz0;
            const gy = (typeof terrH === 'function' ? terrH(tx0, tz0) : 0) - 0.05;
            group.position.set(tx0, gy, tz0);
            scene.add(group);
            groupObj = group;

            chestIt = {
              type: 'quest_chest',
              questChest480: qid,
              x: act.targetPos.x,
              z: act.targetPos.z,
              r: 3.5,
              label: objDef.label,
              opened: false,
              use: () => {
                if (chestIt.opened) return;
                const remB = typeof enemies !== 'undefined' ? enemies.some(e => e.questBoss480 === qid && !e.dead) : false;
                const remM = typeof enemies !== 'undefined' ? enemies.some(e => e.questLethal480 === qid && !e.dead) : false;
                if (remB || remM) {
                  if (typeof bigText === 'function') bigText('DERROTE OS GUARDIÕES ANTES (' + ((typeof enemies !== 'undefined' ? enemies.filter(e => (e.questBoss480 === qid || e.questLethal480 === qid) && !e.dead).length : 0)) + ')', 1800);
                  if (typeof toast === 'function') toast(`<b>[GUARDIÕES PRESENTES]</b> ${objDef.hintDefeat}`, 4000);
                  if (typeof sfx === 'function') sfx('hit');
                  if (typeof fxRing === 'function') fxRing(chestIt.x, chestIt.z, 0xff4d6a, 3.5);
                  return;
                }
                chestIt.opened = true;
                chestIt.hidden = true;
                if (lid) {
                  if (lid.isMesh) lid.position.x += 0.8;
                  else lid.rotation.x = -1.9;
                }
                if (typeof fxBurst === 'function') fxBurst(chestIt.x, gy + 1, chestIt.z, 0x00f0ff, 35, 7);
                if (typeof fxRing === 'function') fxRing(chestIt.x, chestIt.z, 0xffd700, 4, 1.2);
                if (typeof sfx === 'function') sfx('gong');
                if (typeof bigText === 'function') bigText(objDef.winTitle, 1800);
                if (typeof toast === 'function') toast(`<b>[${objDef.winTitle}]</b> ${objDef.winMsg}`, 6000);
                completeQuest(qid);
              }
            };
            if (typeof L !== 'undefined' && L && Array.isArray(L.inter)) {
              L.inter.push(chestIt);
            }
          } catch (_) {}
        }

        // Spawna os inimigos / guardiões do contrato
        let spawnedBoss = null;
        const spawnedMinions = [];
        if (typeof spawnKind === 'function' && typeof enemies !== 'undefined') {
          const gr = qdef.rank || 1;
          const kBoss = qdef.bossKind || 'orcinho';
          if (!qdef.noBoss) try {
            const bx = act.targetPos.x + 3.0;
            const bz = act.targetPos.z + 1.5;
            const b = spawnKind(kBoss, bx, bz, gr, { wild: true, breaker: true });
            if (b) {
              b.questBoss480 = qid;
              b.questTarget480 = true;
              b.hp *= 2.2;
              b.maxhp *= 2.2;
              b.dmg *= 1.35;
              b.name = qdef.bossName || qdef.title;
              b.aggro = true;
              if (b.m && b.m.root) b.m.root.scale.setScalar(qdef.bossScale || 1.5);
              if (typeof fxRing === 'function') fxRing(b.x, b.z, 0xff4d6a, 2.5);
              spawnedBoss = b;
            }
          } catch (_) {}

          const nMinions = qdef.count541 ? Math.max(0, qdef.minions - (act.progress || 0)) : (qdef.minions || 3);
          for (let i = 0; i < nMinions; i++) {
            const a = (i / nMinions) * TAU + 0.35;
            const mx = act.targetPos.x + Math.cos(a) * (4.5 + Math.random() * 2.5);
            const mz = act.targetPos.z + Math.sin(a) * (4.5 + Math.random() * 2.5);
            const kMinion = (qdef.minionKinds && qdef.minionKinds[i % qdef.minionKinds.length]) || 'cogu';
            try {
              const m = spawnKind(kMinion, mx, mz, gr, { wild: true, breaker: true });
              if (m) {
                m.questLethal480 = qid;
                m.aggro = true;
                spawnedMinions.push(m);
              }
            } catch (_) {}
          }
        }
        activeSpawns[qid] = { group: groupObj, chestIt, boss: spawnedBoss, minions: spawnedMinions, readyNotified: false };
      }

      // Anima cristais dos objetos de contrato ativos
      if (sp && sp.group && sp.group.userData && sp.group.userData.crystal) {
        sp.group.userData.crystal.rotation.y += dt * 1.6;
      }

      // Guardiões não fogem nem se perdem: se passarem de 16 m do objetivo, voltam para perto da arca
      if (typeof enemies !== 'undefined' && act.spawned) {
        for (const e of enemies) {
          if (e.dead || (e.questBoss480 !== qid && e.questLethal480 !== qid)) continue;
          const dx = e.x - act.targetPos.x, dz = e.z - act.targetPos.z, dd = Math.hypot(dx, dz);
          if (dd > 16) {
            const k = 12 / dd;
            e.x = act.targetPos.x + dx * k; e.z = act.targetPos.z + dz * k;
            if (e.m && e.m.root) e.m.root.position.set(e.x, e.m.root.position.y, e.z);
          }
        }
      }

      // v541: contrato vivo conta cada abate e só conclui quando a conta fecha
      if (qdef.count541) {
        if (sp && sp.minions) for (const m of sp.minions) {
          if (!m.dead || m.counted541) continue;
          m.counted541 = true;
          act.progress = Math.min(act.max, (act.progress || 0) + 1);
          if (typeof floater === 'function') floater(m.x, m.z, act.progress + '/' + act.max, '#ffd070', true);
          saveState();
        }
        if ((act.progress || 0) >= act.max) completeQuest(qid);
        continue;
      }

      // Verifica se o chefe / guardiões foram abatidos
      if (isLive || act.spawned) {
        const remainingBoss = typeof enemies !== 'undefined' ? enemies.some(e => e.questBoss480 === qid && !e.dead) : false;
        const remainingMinions = typeof enemies !== 'undefined' ? enemies.some(e => e.questLethal480 === qid && !e.dead) : false;
        const objDef = QUEST_OBJECTS[qid];

        if (!remainingBoss && !remainingMinions) {
          if (objDef && sp && sp.chestIt && !sp.chestIt.opened) {
            // Há um objeto interativo (Arca/Monólito/etc). Alerta o jogador para pressionar [E]!
            if (!sp.readyNotified) {
              sp.readyNotified = true;
              if (typeof toast === 'function') toast(`<b>[GUARDIÕES DERROTADOS]</b> ${objDef.hintReady}`, 6000);
              if (typeof bigText === 'function') bigText('OBJETIVO DESIMPEDIDO', 1500);
              if (typeof sfx === 'function') sfx('quest');
            }
          } else if (!objDef) {
            // Missão de pura caçada: abate de todos os alvos conclui o contrato
            completeQuest(qid);
          }
        }
      }
    }
  }

  // Desenha marcador no minimapa do mundo e mapa grande (v524)
  function drawMinimap(ctx, tx, tz, full) {
    try {
      const st = getState();
      if (!st || !st.active) return;

      if (!full) {
        // --- MINIMAPA CIRCULAR DO HUD ---
        if (!st.tracked || !st.active[st.tracked]) return;
        const act = st.active[st.tracked];
        const q = QUEST_CATALOG[st.tracked] || act.def490;
        if (!q || !act || !act.targetPos || typeof player === 'undefined' || !player) return;

        const cx = 96, cz = 96, maxR = 82;
        const dx = (act.targetPos.x - player.x) * 2.2;
        const dz = (act.targetPos.z - player.z) * 2.2;
        const distM = Math.hypot(act.targetPos.x - player.x, act.targetPos.z - player.z);
        const distPx = Math.hypot(dx, dz);

        ctx.save();
        if (distPx > maxR) {
          // CLAMP NA BORDA DO MINIMAPA COM SETA DIREÇÃO (ESTILO SKYRIM)
          const angle = Math.atan2(dz, dx);
          const ex = cx + Math.cos(angle) * maxR;
          const ey = cz + Math.sin(angle) * maxR;

          ctx.translate(ex, ey);
          ctx.rotate(angle);

          // Seta direcional apontando para o objetivo
          ctx.fillStyle = '#4ade80';
          ctx.strokeStyle = '#052e16';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(8, 0);
          ctx.lineTo(-4, -6);
          ctx.lineTo(-1, 0);
          ctx.lineTo(-4, 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Ponto dourado
          ctx.rotate(-angle);
          ctx.fillStyle = '#ffd54f';
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();

          // Badge com distância em metros
          const dTxt = Math.round(distM) + 'm';
          ctx.font = '700 8.5px "Chakra Petch", sans-serif';
          const tw = ctx.measureText(dTxt).width;
          ctx.fillStyle = 'rgba(5, 35, 18, 0.88)';
          ctx.fillRect(-tw / 2 - 2, -14, tw + 4, 10);
          ctx.fillStyle = '#86efac';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(dTxt, 0, -9);
        } else {
          // DENTRO DO MINIMAPA: DIAMANTE PULSANTE
          const px = cx + dx, pz = cz + dz;
          const pulse = (Date.now() % 1200) / 1200;
          ctx.strokeStyle = `rgba(74, 222, 128, ${1 - pulse})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, pz, 7 + pulse * 6, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#4ade80';
          ctx.strokeStyle = '#052e16';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px, pz - 8);
          ctx.lineTo(px + 7, pz);
          ctx.lineTo(px, pz + 8);
          ctx.lineTo(px - 7, pz);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffd54f';
          ctx.beginPath();
          ctx.arc(px, pz, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else {
        // --- MAPA GRANDE (MAPA-MÚNDI) ---
        // Desenha todos os contratos ativos com destaque
        const entries = Object.entries(st.active);
        for (const [qid, qact] of entries) {
          if (!qact || !qact.targetPos) continue;
          const curQ = QUEST_CATALOG[qid] || qact.def490;
          if (!curQ) continue;
          const isTrack = st.tracked === qid;
          const px = tx(qact.targetPos.x), pz = tz(qact.targetPos.z);
          const col = isTrack ? '#ffd070' : '#4ade80';
          const colDark = isTrack ? '#3b2505' : '#052e16';

          ctx.save();
          // Halo de destaque
          ctx.fillStyle = isTrack ? 'rgba(255, 208, 112, 0.35)' : 'rgba(74, 222, 128, 0.25)';
          ctx.beginPath();
          ctx.arc(px, pz, isTrack ? 12 : 9, 0, Math.PI * 2);
          ctx.fill();

          // Diamante
          ctx.fillStyle = col;
          ctx.strokeStyle = colDark;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px, pz - (isTrack ? 9 : 7));
          ctx.lineTo(px + (isTrack ? 8 : 6), pz);
          ctx.lineTo(px, pz + (isTrack ? 9 : 7));
          ctx.lineTo(px - (isTrack ? 8 : 6), pz);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Ponto central
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(px, pz, isTrack ? 3 : 2, 0, Math.PI * 2);
          ctx.fill();

          // Placa com o nome da missão e distância
          const distM = (typeof player !== 'undefined' && player) ? Math.round(Math.hypot(player.x - qact.targetPos.x, player.z - qact.targetPos.z)) : 0;
          const tag = isTrack ? '★ [MISSÃO] ' : '[MISSÃO] ';
          const titleTxt = tag + (curQ.title.length > 24 ? curQ.title.slice(0, 22) + '...' : curQ.title) + (distM ? ` (${distM}m)` : '');

          ctx.font = '700 11px "Chakra Petch", sans-serif';
          const tw = ctx.measureText(titleTxt).width;
          ctx.fillStyle = 'rgba(12, 18, 28, 0.9)';
          ctx.strokeStyle = col;
          ctx.lineWidth = 1;
          ctx.fillRect(px + 12, pz - 9, tw + 8, 18);
          ctx.strokeRect(px + 12, pz - 9, tw + 8, 18);
          ctx.fillStyle = col;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(titleTxt, px + 16, pz);
          ctx.restore();
        }
      }
    } catch (_) {}
  }

  // Retorna texto de acompanhamento para o HUD
  function getHudTrackText() {
    const S = getState();
    if (!S || !S.tracked || !S.active[S.tracked]) return null;
    const qid = S.tracked;
    const qdef = QUEST_CATALOG[qid] || S.active[qid]?.def490;
    const act = S.active[qid];
    if (!qdef || !act || !act.targetPos || typeof player === 'undefined' || !player) return null;

    const d = Math.round(Math.hypot(player.x - act.targetPos.x, player.z - act.targetPos.z));
    const objDef = QUEST_OBJECTS[qid];
    const liveBoss = typeof enemies !== 'undefined' ? enemies.filter(e => e.questBoss480 === qid && !e.dead).length : 0;
    const liveMinions = typeof enemies !== 'undefined' ? enemies.filter(e => e.questLethal480 === qid && !e.dead).length : 0;
    const totalFoes = liveBoss + liveMinions;

    let detail = '';
    if (qdef.count541) {
      const cnt = `${qdef.mobName541}: ${act.progress || 0}/${act.max}`;
      return { title: qdef.title, detail: d > 45 ? `${d} m · ${cnt}` : `⚔ ${cnt}` };
    }
    if (d > 45) {
      detail = `${d}m · ${qdef.giver}`;
    } else if (totalFoes > 0) {
      detail = `⚔ Derrote os guardiões (${totalFoes} restantes)`;
    } else if (objDef) {
      detail = `★ Interaja com: ${objDef.name} [E]!`;
    } else {
      detail = `Objetivo concluído!`;
    }

    return {
      title: qdef.title,
      detail: detail
    };
  }

  // Intervalo do loop
  setInterval(() => {
    const now = performance.now();
    const dt = Math.min(0.1, (now - lastTick) / 1000);
    lastTick = now;
    try { tick(dt); hookMinimap(); } catch (_) {}
  }, 100);

  // Expõe a API globalmente
  global.Quests480 = {
    CATALOG: QUEST_CATALOG,
    getState,
    acceptQuest,
    acceptEmergent,
    openEmergentDialogue,
    trackQuest,
    abandonQuest,
    completeQuest,
    openBoard,
    getHudTrackText,
    drawMinimap
  };

})(window);
