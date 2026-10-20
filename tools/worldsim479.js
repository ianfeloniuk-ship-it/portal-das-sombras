/* v479 (Ian, 19/10/2026): "O mundo tem que acontecer sozinho. Se eu estou dentro da masmorra e passou 14 dias,
   as coisas descritas que aconteceram têm que ter acontecido mesmo. Cidades crescem e sobem de nível sem precisar de mim,
   caçadores chegam e ajudam, todas as regiões têm natureza, economia e governantes (reis, prefeitos, governadores).
   O jogo funciona sem eu estar lá; quando estou, eu só agrego." */
(function (global) {
  'use strict';

  const TAU = Math.PI * 2;

  // Definição das 6 Grandes Capitais, Regiões e Governantes
  const REGION_DATA = {
    aster: {
      id: 'aster',
      name: 'Aster',
      title: 'Coração da Ordem',
      leader: {
        name: 'Comandante Brann & Chanceler Lyra',
        role: 'Regentes da Ordem dos Caçadores',
        title: 'Governança da Ordem',
        desc: 'Foco no acolhimento de Transmigradores, ampliação de forjas e defesa de perímetro.',
        color: '#e7bd6c'
      },
      edicts: [
        { id: 'muralhas', title: 'Reforço das Muralhas Externas', desc: 'Artesãos e caçadores trazem pedras para elevar as ameias e postos de vigia.', reward: 'Aumenta defesa das muralhas e reduz dano de invasões' },
        { id: 'escola', title: 'Acolhimento de Novos Caçadores', desc: 'Treinamento de novatos que caíram das fendas, ampliando as patrulhas.', reward: 'Patrulhas de caçadores mais fortes nas estradas' },
        { id: 'celeiro', title: 'Celeiro Comunitário de Suprimentos', desc: 'Armazenamento estratégico de grãos e carnes contra cercos prolongados.', reward: 'Escassez zerada e preços estáveis' },
        { id: 'oficinas', title: 'Guilda dos Forjadores de Aster', desc: 'Modernização das bigornas de Kael com carvão abissal.', reward: 'Equipamentos refinados e estoques raros' }
      ],
      goods: ['Aço da Ordem', 'Equipamentos Refinados', 'Grãos de Aster'],
      hunters: [
        { name: 'Aldric das Brumas', rank: 'Veterano', victories: 28 },
        { name: 'Edran Protetor da Carroça', rank: 'Guarda Veterano', victories: 19 },
        { name: 'Kallan Lâmina-do-Aço', rank: 'Caçador Batedor', victories: 14 }
      ]
    },
    solaria: {
      id: 'solaria',
      name: 'Solaria',
      title: 'A Cidade do Sol Eterno',
      leader: {
        name: 'Grão-Mestre Aurelius',
        role: 'Soberano da Luz Solar',
        title: 'Arquimestre de Solaria',
        desc: 'Foco na canalização de raios solares em espelhos gigantes e caravanas de seda e ouro.',
        color: '#ffd070'
      },
      edicts: [
        { id: 'espelhos', title: 'Array de Espelhos Solares', desc: 'Instalação de refletores de quartzo que desintegram fendas fracas no horizonte.', reward: 'Fendas secundárias contidas à distância' },
        { id: 'seguro_caravanas', title: 'Fundo de Proteção a Mercadores', desc: 'Garantia de recomposição para mercadores cruzando os desfiladeiros.', reward: 'Fluxo intenso de carruagens e comércio aquecido' },
        { id: 'cupula_ouro', title: 'Cúpula Rúnica de Solaria', desc: 'Canalização do calor do sol em barreiras que cegam monstros noturnos.', reward: 'Domo solar regenera sozinho' }
      ],
      goods: ['Ouro Solar', 'Lentes de Quartzo', 'Seda Dourada'],
      hunters: [
        { name: 'Valen Radiante', rank: 'Cavaleiro Solar', victories: 32 },
        { name: 'Cynthia Alvorada', rank: 'Maga Rúnica', victories: 21 }
      ]
    },
    ymiria: {
      id: 'ymiria',
      name: 'Ymiria',
      title: 'Bastião do Gelo Profundo',
      leader: {
        name: 'Arquiduquesa Astrid Frostgard',
        role: 'Governadora das Geadas',
        title: 'Senhora do Aço Negro',
        desc: 'Foco em aquecimento geotérmico, sobrevivência à nevasca e forja de ferro negro.',
        color: '#8fe3ff'
      },
      edicts: [
        { id: 'caldeiras', title: 'Caldeiras Comunitárias a Carvão', desc: 'Dutos de vapor geotérmico pelas calçadas para derreter o gelo e proteger cidadãos.', reward: 'Imunidade ao frio extremo nas muralhas' },
        { id: 'fundicao_negra', title: 'Forjas de Aço de Ymir', desc: 'Metalurgia pesada usando minérios das cavernas profundas.', reward: 'Armaduras pesadas térmicas disponíveis' },
        { id: 'patrulhas_lobos', title: 'Batedores dos Picos Glaciais', desc: 'Patrulhas de esquiadores e caçadores rastreando yetis e matilhas.', reward: 'Segurança absoluta nas rotas de neve' }
      ],
      goods: ['Ferro Negro', 'Peles de Urso Polar', 'Carvão Mineral'],
      hunters: [
        { name: 'Torben Machado-de-Gelo', rank: 'Patrulheiro Glacial', victories: 25 },
        { name: 'Eira Caçadora dos Montes', rank: 'Batedora do Norte', victories: 18 }
      ]
    },
    zahar: {
      id: 'zahar',
      name: 'Zahar',
      title: 'Pérola das Dunas Vermelhas',
      leader: {
        name: 'Emir Tariq Al-Zahar',
        role: 'Governador dos Oásis',
        title: 'Guardião das Areias',
        desc: 'Foco em poços artesianos subterrâneos, colheita de incensos e rotas de camelos.',
        color: '#ff9852'
      },
      edicts: [
        { id: 'aquiferos', title: 'Canalização dos Aquíferos das Dunas', desc: 'Escavação de poços e fontes com água purificada nas estradas áridas.', reward: 'Fontes de água pura abundantes no deserto' },
        { id: 'vigia_miragem', title: 'Postos de Vigia das Miragens', desc: 'Torres altas de terracota que avisam sobre vermes da areia e tempestades.', reward: 'Eliminação de emboscadas no deserto' },
        { id: 'bazar_especiarias', title: 'Expansão do Grande Bazar', desc: 'Abertura de entrepostos comerciais para mascates de todo o mundo.', reward: 'Variedade de especiarias e elixires raros' }
      ],
      goods: ['Especiarias Vermelhas', 'Cristais do Sol', 'Incensos Sagrados'],
      hunters: [
        { name: 'Farid Falcão-das-Dunas', rank: 'Atirador do Deserto', victories: 27 },
        { name: 'Zahra Passo-Silencioso', rank: 'Espadachim Miragem', victories: 17 }
      ]
    },
    thalor: {
      id: 'thalor',
      name: 'Thalor',
      title: 'Porto dos Mares Bravios',
      leader: {
        name: 'Almirante Varis Onda-Viva',
        role: 'Governador dos Estreitos',
        title: 'Lorde dos Portos',
        desc: 'Foco na construção naval, pesca oceânica e defesa contra feras abissais do mar.',
        color: '#4ecdc4'
      },
      edicts: [
        { id: 'farois_arcanos', title: 'Faróis de Luz Contínua', desc: 'Torres de lanternas arcanas nos recifes que guiam embarcações com segurança.', reward: 'Navegação segura e pescas abissais sem perda' },
        { id: 'estaleiro', title: 'Modernização das Docas e Estaleiros', desc: 'Construção de caravelas e barcos resistentes a tempestades.', reward: 'Barcos avançados e comércio costeiro' },
        { id: 'pesca_abissal', title: 'Frota de Caça às Feras Marinhas', desc: 'Arpoadores profissionais caçam leviatãs e recolhem escamas raras.', reward: 'Peixes frescos e escamas marinhas no mercado' }
      ],
      goods: ['Peixe Abissal Fresco', 'Pérolas Negras', 'Madeira de Casco'],
      hunters: [
        { name: 'Kaelen Arpoador', rank: 'Guardião dos Mares', victories: 22 },
        { name: 'Marina Olho-da-Tormenta', rank: 'Navegadora Arcana', victories: 16 }
      ]
    },
    urdan_verden: {
      id: 'urdan_verden',
      name: 'Urdan & Verden',
      title: 'O Vale dos Ancestrais',
      leader: {
        name: 'Arquidruida Eldrin & Conselho das Raízes',
        role: 'Guardiões das Florestas Primitivas',
        title: 'Voz da Natureza',
        desc: 'Foco na preservação da fauna primordial, purificação das águas e regeneração de ervas.',
        color: '#7cf4c2'
      },
      edicts: [
        { id: 'santuario_feras', title: 'Santuário de Reprodução das Feras', desc: 'Proteção de ninhos e manadas contra o miasma da fenda.', reward: 'População de feras saudáveis e caça sustentável' },
        { id: 'circulo_telurico', title: 'Círculos Druídicos de Purificação', desc: 'Ervas e raízes ancestrais plantadas para limpar parasitas do solo e rios.', reward: 'Água e alimentos 100% livres de parasitas' },
        { id: 'horto_astral', title: 'Horto de Fungos e Frutas Astrais', desc: 'Cultivo de espécies medicinais de crescimento rápido.', reward: 'Ingredientes de cura abundantes na floresta' }
      ],
      goods: ['Seiva Curativa', 'Ervas Medicinais Raras', 'Madeira Ancestral'],
      hunters: [
        { name: 'Kaelen Garra-Verde', rank: 'Druida Guardião', victories: 29 },
        { name: 'Sylas Sombra-da-Copa', rank: 'Arqueiro da Floresta', victories: 20 }
      ]
    }
  };

  // Garante inicialização no perfil do jogador (com fallback resiliente se o jogo estiver no menu)
  let _fallbackSimState = null;
  function getSimState() {
    let S;
    if (typeof profile !== 'undefined' && profile) {
      profile.worldSim = profile.worldSim || {};
      S = profile.worldSim;
    } else {
      if (!_fallbackSimState) _fallbackSimState = {};
      S = _fallbackSimState;
    }
    S.lastSimDay = S.lastSimDay || 0;
    S.history = S.history || [];
    S.regions = S.regions || {};

    for (const [rid, def] of Object.entries(REGION_DATA)) {
      if (!S.regions[rid]) {
        S.regions[rid] = {
          id: rid,
          name: def.name,
          level: 1,
          buildPoints: 0,
          buildMax: 100,
          treasury: 1500,
          scarcity: 4,
          activeEdict: def.edicts[0].id,
          edictProgress: 25,
          completedEdicts: [],
          hunterFame: 10,
          lastEdictName: def.edicts[0].title
        };
      }
    }
    return S;
  }

  // Simula a passagem do tempo no mundo autônomo (ex.: 14 dias de masmorra ou dias do jogo)
  function simulate(daysPassed, opts = {}) {
    const S = getSimState();
    if (!S || !(daysPassed > 0)) return null;

    const eventsLog = [];
    const fromRift = !!opts.fromRift;
    const rank = opts.rank || 1;

    // 1. Simulação para cada uma das Regiões
    for (const [rid, rState] of Object.entries(S.regions)) {
      const def = REGION_DATA[rid];
      if (!def) continue;

      // a. Caçadores NPCs trabalhando sozinhos e entregando recursos
      const huntersCount = def.hunters.length;
      const huntingPower = huntersCount * (1.2 + Math.random() * 0.8);
      const pointsContributed = Math.round(daysPassed * huntingPower * 2.5);
      const goldEarned = Math.round(daysPassed * huntingPower * 18);

      rState.buildPoints += pointsContributed;
      rState.treasury += goldEarned;
      rState.hunterFame += Math.round(daysPassed * 0.8);

      // Chance de caçadores subirem triunfos individuais
      const starHunter = def.hunters[Math.floor(Math.random() * def.hunters.length)];
      if (starHunter) starHunter.victories += Math.round(daysPassed * 0.5);

      // b. Verificação de subida de nível da Cidade/Capital
      const BUILD_LEVEL_MAX = [300, 500, 800, 1200, 1800, 2600, 3600, 5000, 7000, 10000];
      rState.buildMax = BUILD_LEVEL_MAX[Math.min(BUILD_LEVEL_MAX.length - 1, rState.level)] || 2000;

      let leveledUp = false;
      const oldLevel = rState.level;
      if (rState.buildPoints >= rState.buildMax && rState.level < 10) {
        rState.buildPoints -= rState.buildMax;
        rState.level += 1;
        rState.buildMax = BUILD_LEVEL_MAX[Math.min(BUILD_LEVEL_MAX.length - 1, rState.level)] || 2000;
        leveledUp = true;
      }

      // Sincroniza o nível com o sistema de cidades do núcleo (profile.cityLv)
      if (typeof profile !== 'undefined' && profile) {
        profile.cityLv = profile.cityLv || {};
        const keyMap = {
          aster: '0,0',
          ymiria: '0,-5',
          zahar: '5,0',
          thalor: '-5,0',
          urdan_verden: '0,5',
          solaria: '1,0'
        };
        const cityKey = keyMap[rid] || (rid === 'aster' ? '0,0' : null);
        if (cityKey) {
          profile.cityLv[cityKey] = Math.max(profile.cityLv[cityKey] || 0, rState.level);
        }
        if (leveledUp) {
          if (typeof store !== 'undefined' && store.set) store.set('pds2_profile', profile);
          if (typeof reloadCityChunks === 'function' && typeof cityCache !== 'undefined') {
            const c = cityCache.get(cityKey);
            if (c) reloadCityChunks(c);
          }
        }
      }

      const curDay = (typeof profile !== 'undefined' && profile && profile.gameDays) || 1;
      if (leveledUp) {
        const ev = `<b>${def.name}</b> expandiu para o <b>Nível ${rState.level}</b> graças à entrega de materiais e patrulhas dos caçadores locais!`;
        eventsLog.push({ region: def.name, text: ev, type: 'city_level' });
        S.history.unshift({ day: curDay + daysPassed, text: ev });
      }

      // c. Progresso do Edital Governamental da Região
      const activeEdictDef = def.edicts.find(e => e.id === rState.activeEdict) || def.edicts[0];
      const edictGain = Math.round(daysPassed * (3.8 + Math.random() * 2.2));
      rState.edictProgress += edictGain;

      if (rState.edictProgress >= 100) {
        rState.edictProgress = 0;
        if (!rState.completedEdicts.includes(activeEdictDef.id)) {
          rState.completedEdicts.push(activeEdictDef.id);
        }
        const ev = `O Governante de <b>${def.name}</b> (${def.leader.name}) concluiu com sucesso o projeto: <b>"${activeEdictDef.title}"</b>! Bônus regional ativo: <i>${activeEdictDef.reward}</i>.`;
        eventsLog.push({ region: def.name, text: ev, type: 'edict_complete' });
        S.history.unshift({ day: curDay + daysPassed, text: ev });

        // Seleciona próximo edital
        const nextEdict = def.edicts.find(e => !rState.completedEdicts.includes(e.id)) || def.edicts[Math.floor(Math.random() * def.edicts.length)];
        rState.activeEdict = nextEdict.id;
        rState.lastEdictName = nextEdict.title;
      }

      // d. Economia e Caravanas Autônomas
      const caravanTrips = Math.max(1, Math.round(daysPassed / 3));
      rState.scarcity = Math.max(0, rState.scarcity - Math.round(caravanTrips * 0.7));
      if (Math.random() < 0.4) {
        const ev = `Caravanas de <b>${def.name}</b> completaram viagens comerciais trazendo <i>${def.goods.join(', ')}</i>. Escassez reduzida no mercado.`;
        eventsLog.push({ region: def.name, text: ev, type: 'economy' });
      }

      // e. Fendas fechadas no horizonte por outros caçadores
      const riftsClosedByNPCs = Math.max(1, Math.round(daysPassed * 0.35));
      if (riftsClosedByNPCs > 0) {
        const ev = `Patrulhas de caçadores de <b>${def.name}</b> localizaram e selaram <b>${riftsClosedByNPCs} fenda(s)</b> menores no horizonte.`;
        eventsLog.push({ region: def.name, text: ev, type: 'hunters' });
      }
    }

    // Mantém histórico limpo (últimos 30 eventos)
    if (S.history.length > 30) S.history.length = 30;

    // Salva perfil
    try {
      if (typeof store !== 'undefined' && store.set && typeof profile !== 'undefined' && profile) store.set('pds2_profile', profile);
    } catch (_) {}

    return {
      daysPassed,
      events: eventsLog,
      regions: S.regions
    };
  }

  function getRun() {
    try {
      if (typeof run !== 'undefined' && run) return run;
    } catch (_) {}
    try {
      if (typeof window !== 'undefined' && window.run) return window.run;
    } catch (_) {}
    return null;
  }

  // Ação do jogador de "Agregar" a uma cidade (acelerar o progresso autônomo)
  function playerContribute(rid, kind = 'crystals', amount = 10) {
    const S = getSimState();
    if (!S || !S.regions[rid] || !(amount > 0)) return false;
    const r = S.regions[rid];
    const def = REGION_DATA[rid];
    const R = getRun();

    if (!R) {
      if (typeof toast === 'function') toast('Inicie ou carregue seu personagem para contribuir.');
      return false;
    }

    if (kind === 'crystals') {
      const tot = (R.res && R.res.cry) ? R.res.cry.reduce((a, b) => a + b, 0) : 0;
      if (tot < amount) {
        if (typeof toast === 'function') toast(`Você precisa de ${amount} cristais de qualquer rank para doar.`);
        return false;
      }
      let need = amount;
      for (let i = 0; i < R.res.cry.length && need > 0; i++) {
        const u = Math.min(R.res.cry[i], need);
        R.res.cry[i] -= u;
        need -= u;
      }
      r.buildPoints += amount * 3;
      r.edictProgress = Math.min(100, r.edictProgress + Math.round(amount * 0.5));
      if (typeof toast === 'function') toast(`<b>[CONSELHO DE ${def.name.toUpperCase()}]</b> Você entregou <b>${amount} cristais</b>! O projeto avançou.`);
    } else if (kind === 'gold') {
      const curGold = R.gold || 0;
      if (curGold < amount) {
        if (typeof toast === 'function') toast(`Você precisa de ${amount} de ouro para financiar as obras.`);
        return false;
      }
      R.gold -= amount;
      r.treasury += amount;
      r.buildPoints += Math.round(amount * 0.15);
      r.edictProgress = Math.min(100, r.edictProgress + Math.round(amount * 0.05));
      if (typeof toast === 'function') toast(`<b>[CONSELHO DE ${def.name.toUpperCase()}]</b> Você financiou <b>${amount} de ouro</b> para o tesouro municipal!`);
    }

    // Verifica subida de nível
    if (r.buildPoints >= r.buildMax && r.level < 10) {
      r.buildPoints -= r.buildMax;
      r.level += 1;
      r.buildMax = Math.round(r.buildMax * 1.35);
      bigText(`${def.name.toUpperCase()} · NÍVEL ${r.level}`, 2000);
      toast(`<b>[CIDADE]</b> Com a sua contribuição, <b>${def.name}</b> subiu para o <b>Nível ${r.level}</b>!`, 6000);
      sfx('level');
    }

    try {
      if (typeof store !== 'undefined' && store.set && typeof profile !== 'undefined' && profile) store.set('pds2_profile', profile);
      if (typeof saveRun === 'function') saveRun();
    } catch (_) {}
    return true;
  }

  // Modal com o Conselho Regional, Governante e Editais Autônomos
  function openCouncilView(rid = 'aster') {
    const S = getSimState();
    if (!S) return;
    const def = REGION_DATA[rid] || REGION_DATA.aster;
    const r = S.regions[rid] || S.regions.aster;
    const activeEdict = def.edicts.find(e => e.id === r.activeEdict) || def.edicts[0];

    let h = `<div class="guide93" style="border-left:4px solid ${def.leader.color}">`;
    h += `<strong>${def.name.toUpperCase()} · ${def.title.toUpperCase()}</strong>`;
    h += `<p><b>Governante:</b> ${def.leader.name} (${def.leader.role})</p>`;
    h += `<p style="opacity:.9">${def.leader.desc}</p>`;
    h += `</div>`;

    // Nível e Crescimento Autônomo da Capital
    const pct = Math.min(100, Math.round((r.buildPoints / r.buildMax) * 100));
    h += `<div class="sec">STATUS DA CIDADE · NÍVEL ${r.level}/10 (${pct}% para Nível ${r.level + 1})</div>`;
    h += `<div style="background:rgba(255,255,255,.08);height:10px;border-radius:5px;overflow:hidden;margin:6px 0 10px">`;
    h += `<div style="background:${def.leader.color};width:${pct}%;height:100%"></div></div>`;
    h += `<div class="sysline" style="font-size:12px">A cidade cresce dia após dia com o trabalho de artesãos e caçadores que chegam e investem materiais, mesmo quando você estiver fora. Quando estiver por aqui, você pode contribuir para acelerar as obras.</div>`;

    // Edital em Andamento pelo Governante
    const edictPct = Math.min(100, Math.round(r.edictProgress));
    h += `<div class="sec">EDITAL DO GOVERNANTE · EM ANDAMENTO (${edictPct}%)</div>`;
    h += row(
      `<b>${activeEdict.title}</b>`,
      `${activeEdict.desc}<br><span style="color:#7ef5a5">Recompensa regional: ${activeEdict.reward}</span>`,
      `<span style="color:#ffd070">${edictPct}% Concluído</span>`
    );

    // Caçadores Locais da Região
    h += `<div class="sec">QUADRO DE CAÇADORES AUTÔNOMOS DA REGIÃO</div>`;
    for (const hunter of def.hunters) {
      h += row(
        `<b>${hunter.name}</b> · ${hunter.rank}`,
        `Ativo nas estradas e fendas da região · ${hunter.victories} fendas seladas sozinho`,
        `<span style="color:#6fe39a">Em Patrulha</span>`
      );
    }

    // Ações para o Jogador Agregar
    h += `<div class="sec">SUA CONTRIBUIÇÃO (ACELERAR PROJETOS)</div>`;
    const R = getRun();
    const totCry = (R && R.res && R.res.cry) ? R.res.cry.reduce((a, b) => a + b, 0) : 0;
    const curGold = (R && R.gold) || 0;
    const fmtGold = (typeof fmt === 'function') ? fmt(curGold) : curGold;
    h += row(
      'Entregar 20 Cristais de Mana',
      `Acelera o projeto municipal em +60 pontos de construção (você tem ${totCry} cristais).`,
      `<button class="btn hot" onclick="WorldSim479.playerContribute('${rid}','crystals',20);WorldSim479.openCouncilView('${rid}')" ${totCry < 20 ? 'disabled' : ''}>Entregar 20 Cristais</button>`
    );
    h += row(
      'Financiar 300 de Ouro para o Tesouro',
      `Reforça o erário do Governante para contratação de artesãos (você tem ${fmtGold} ouro).`,
      `<button class="btn" onclick="WorldSim479.playerContribute('${rid}','gold',300);WorldSim479.openCouncilView('${rid}')" ${curGold < 300 ? 'disabled' : ''}>Financiar 300 Ouro</button>`
    );

    // Seletor de outras regiões
    h += `<div class="sec">VER OUTRAS REGIÕES DO MUNDO</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">`;
    for (const [otherId, otherDef] of Object.entries(REGION_DATA)) {
      h += `<button class="btn ${otherId === rid ? 'on' : ''}" onclick="WorldSim479.openCouncilView('${otherId}')">${otherDef.name}</button>`;
    }
    h += `</div>`;

    openModal(`CONSELHO DE ${def.name.toUpperCase()} · GOVERNANÇA`, h);
  }

  // Gera o relatório dinâmico e real para o pós-masmorra
  function generateRiftReportHtml(daysPassed, rank) {
    const simResult = simulate(daysPassed, { fromRift: true, rank });
    const events = (simResult && simResult.events) || [];

    let h = `<div class="sysline" style="font-size:13px;line-height:1.4">`;
    h += `<b>${daysPassed} dias se passaram em Primeva enquanto você esteve nas profundezas da Fenda.</b><br>`;
    h += `O mundo não parou: governantes emitiram editais, caçadores patrulharam as estradas e as capitais evoluíram sozinhas enquanto você caçava lá dentro.</div>`;

    h += `<div class="sec">O QUE ACONTECEU NO MUNDO DURANTE A SUA EXPEDIÇÃO:</div>`;
    if (events.length > 0) {
      for (const ev of events.slice(0, 8)) {
        h += row(`<b>${ev.region}</b>`, ev.text, '');
      }
    } else {
      h += row('Capitais Estáveis', `Durante as semanas passadas, as patrulhas da Ordem mantiveram as estradas e os mercados operantes.`, '');
    }

    h += `<div class="sysline" style="margin-top:10px">As mudanças acima já se refletem no mapa, nos estoques das lojas e no nível das capitais. Visite o marco no centro de Aster ou das capitais para ver os novos Editais do Conselho.</div>`;
    return h;
  }

  // v481 (Ian): Simulação autônoma contínua no mundo aberto
  let simAccumSec = 0;
  function worldTick(dt) {
    if (typeof paused !== 'undefined' && paused) return;
    if (typeof L === 'undefined' || !L || L.mode !== 'world' || typeof player === 'undefined' || !player || player.dead) return;
    simAccumSec += dt;
    if (simAccumSec >= 20) {
      simAccumSec = 0;
      // 20s no mundo real avança uma fração suave de tempo autônomo (caçadores patrulham e entregam suprimentos)
      simulate(0.015, { continuous: true });
    }
  }

  setInterval(() => {
    try { worldTick(0.5); } catch (_) {}
  }, 500);

  // Publica módulo no escopo global
  global.WorldSim479 = {
    REGIONS: REGION_DATA,
    getSimState,
    simulate,
    playerContribute,
    openCouncilView,
    generateRiftReportHtml
  };

})(window);
