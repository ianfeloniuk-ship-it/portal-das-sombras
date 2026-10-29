/* ============================================================================
 * PRIMEVA — MOTOR DE MISSÕES INFINITAS (RADIANT PRIMEVA ENGINE v1.0)
 * Arquivo: tools/motor-missoes-infinitas.js
 * Compatível com: Primeva v537+ (WorldSim479, Quests480, Enc502, Gat508, Dialogo520, Eco410, Surv437)
 * Regra de Linguagem (LINGUAGEM-do-Primeva.md): 100% números inteiros, efeito primeiro,
 * cada escolha muda o estado real do mundo (Confiança, Escassez, IPC, Fama, Clãs, Patrulhas).
 * ============================================================================ */
(function (global) {
  'use strict';

  const API = global.RadiantPrimeva = {
    version: 1,
    active: [],
    historyCount: 0
  };

  // 1. Semente determinística mas evolutiva (muda por dia, nível, escolhas e região)
  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  // 2. Catálogo Canônico do Mundo (Capitais, Biomas, Clãs, Pessoas das Margens, Criaturas)
  const REGIONS = [
    { id: 'aster', name: 'Aster', ruler: 'Comandante Brann & Chanceler Lyra', biome: 'campos', x: 0, z: 0 },
    { id: 'ymiria', name: 'Ymiria', ruler: 'Arquiduquesa Astrid Frostgard', biome: 'neve', x: 0, z: -3400 },
    { id: 'zahar', name: 'Zahar', ruler: 'Emir Tariq ibn Nadir', biome: 'deserto', x: 3400, z: 0 },
    { id: 'thalor', name: 'Thalor', ruler: 'Almirante Varis Moura', biome: 'costa', x: -3850, z: 0 },
    { id: 'urdan', name: 'Urdan', ruler: 'Mestres da Forja Basáltica', biome: 'vulcao', x: 0, z: 3400 },
    { id: 'verden', name: 'Verden', ruler: 'Arquidruida Eldrin', biome: 'pantano', x: 2300, z: 2300 }
  ];

  const CLANS = [
    { id: 'ferrugem', name: 'Clã Ferrugem (Goblins Base)', leader: 'Torvo', buff: '+10% velocidade de carroça e reparo gratuito' },
    { id: 'quebrarocha', name: 'Clã Quebra-Rocha (Orcs Base)', leader: 'Chefe Quebra-Rocha', buff: '+10% de ataque físico corpo a corpo por 300s' },
    { id: 'lagoa', name: 'Vigias da Lagoa Sagrada (Homens-Peixe Base)', leader: 'Ancião das Águas', buff: '+10s de fôlego máximo no mergulho' },
    { id: 'brejo', name: 'Confraria do Brejo (Sapos Guerreiros Base)', leader: 'Mestre de Casca', buff: 'lentidão do pântano reduzida para 5%' },
    { id: 'escama', name: 'Ordem da Escama Dourada (Dracônicos Base)', leader: 'Guardião da Escama', buff: '+10% de resistência ao fogo e lava' },
    { id: 'mantobranco', name: 'Povo do Manto Branco (Yetis Base)', leader: 'Patriarca Branco', buff: 'aviso antecipado de nevascas e Fendas no gelo' },
    { id: 'veu', name: 'Irmandade do Véu (Ninjas Base)', leader: 'Mestre do Véu', buff: 'revela atalhos e portais raros no mapa' },
    { id: 'micelio', name: 'Círculo do Micélio (Reis Cogumelos Base)', leader: 'Rei Cogumelo Ancião', buff: 'entrega esporos curativos e ervas raras' },
    { id: 'duasfaces', name: 'Conclave das Duas Faces (Máscaras Tribais)', leader: 'Oráculo das Duas Faces', buff: '-15% de dano mágico recebido por 300s' },
    { id: 'velodourado', name: 'Pastores do Velo Dourado (Nômades)', leader: 'Tratadora do Velo', buff: 'desconto de 15% em mantimentos e tecidos' },
    { id: 'fogueira', name: 'Companhias da Fogueira (Rasgados)', leader: 'Veterano da Fogueira', buff: 'recupera 100% da vida e marca Alvos Notórios' }
  ];

  const MARGIN_NPCS = [
    'A barqueira Nara', 'O carpinteiro Oren', 'A cartógrafa Iria',
    'O faroleiro Bento', 'A mergulhadora Sura', 'O cocheiro Teren',
    'A tratadora Maela', 'O cesteiro Rul', 'A salineira Edda',
    'O mensageiro Vico', 'A tecelã Ansa', 'O vigia Garo'
  ];

  const CREATURES_BY_BIOME = {
    campos: [
      { id: 'passaro', name: 'Pássaro Bravo Fendido', tactic: 'Espere o mergulho lateral passar e ataque quando ele recuperar altitude.' },
      { id: 'coelho', name: 'Coelho Assassino Fendido', tactic: 'Use controle ou armadilha antes que ele encurte a distância.' },
      { id: 'abelharainha', name: 'Abelha Rainha Blindada Fendida', tactic: 'Afaste a rainha do enxame para quebrar o zumbido de comando.' },
      { id: 'lobo_f', name: 'Lobo Fendido', tactic: 'Não permita que a matilha feche o círculo; corte pelos flancos.' }
    ],
    floresta: [
      { id: 'cogufuria', name: 'Cogumelo Furioso Fendido', tactic: 'Fique fora da nuvem de esporos e nunca pise na sombra dele.' },
      { id: 'aranha', name: 'Tecelã de Vidro (Aranha Fendida)', tactic: 'Olhe para as copas antes de avançar e ataque após o gasto da teia.' },
      { id: 'mono', name: 'Monkroose Fendido', tactic: 'Jogue uma moeda brilhante (Tecla Y) para distraí-lo antes que fuja para as ruínas altas.' },
      { id: 'fantasma', name: 'Fantasma Abissal', tactic: 'Use ataques físicos precisos; o perfil Espectral resiste à magia.' }
    ],
    neve: [
      { id: 'yeti_f', name: 'Yeti Corrompido', tactic: 'Mantenha uma fogueira ou Chá Térmico ativo e nunca ataque filhotes Base por perto.' },
      { id: 'redemoinho', name: 'Redemoinho Abissal', tactic: 'Lute em terreno firme e lembre que sua força cai ao amanhecer.' },
      { id: 'visitante', name: 'Visitante Abissal', tactic: 'Aproveite os 3 segundos em que ele observa antes do primeiro golpe.' }
    ],
    deserto: [
      { id: 'escaravelho', name: 'Cavaleiro Escaravelho Fendido', tactic: 'Saia da linha reta da investida ou jogue uma moeda (Tecla Y) para travá-lo na freada.' },
      { id: 'cactogig', name: 'Cactoro Gigante Fendido', tactic: 'Atraia o corpo pesado para longe da água e golpeie durante a recuperação.' }
    ],
    costa: [
      { id: 'homempeixe', name: 'Homem-Peixe Abissal', tactic: 'Atraia-o para a areia seca onde o movimento dele fica mais lento.' },
      { id: 'lula', name: 'Lula do Vazio Fendida', tactic: 'Saia da zona de silêncio imediatamente antes de contra-atacar.' },
      { id: 'arraia', name: 'Arraia do Vazio', tactic: 'Observe a sombra no alto e ataque logo após o rasante da cauda.' }
    ],
    vulcao: [
      { id: 'dino', name: 'Par de Dinos Fendidos', tactic: 'Não fique entre os dois; quebre a distração do primeiro antes do bote traseiro.' },
      { id: 'diabrete', name: 'Diabrete Abissal', tactic: 'Elimine-o rápido antes que o grito chame os Demônios Chifrudos.' },
      { id: 'chifrudo', name: 'Demônio Chifrudo Fendido', tactic: 'Use distância e penetração; ele foca sempre quem está com mais vida.' },
      { id: 'raptor', name: 'Raptor Abissal', tactic: 'Não corra em linha reta; mude de direção para quebrar o zigue-zague.' }
    ],
    pantano: [
      { id: 'gosma', name: 'Gosma Verde Fendida', tactic: 'Destrua os 3 fragmentos antes que se reúnam durante a noite.' },
      { id: 'espinhosa', name: 'Gosma Espinhosa Abissal', tactic: 'Avance em Passo Silencioso (Ctrl) para não disparar os espinhos por vibração.' },
      { id: 'sapo', name: 'Sapo Guerreiro Fendido', tactic: 'Lute em ilhota seca e use Botas de Lodo para manter a esquiva.' }
    ]
  };

  // 3. Os 8 Gatilhos Orgânicos (Skyrim x Primeva)
  const TRIGGERS = [
    'Rumor ouvido na taverna/pousada ao cair da noite',
    'Mensageiro Expresso abordando você na estrada real',
    'Carta manchada encontrada em carcaça ou acampamento abandonado',
    'Conversa ouvida ao passar entre dois moradores na praça',
    'Pedido urgente do Conselho Regional / Governante da Capital',
    'Sinal de fumaça avistado em um Nó de Encontro (World Encounter Node)',
    'Pedido de socorro de um batedor ferido na beira da trilha',
    'Aviso deixado por um dos Onze Clãs junto a uma fogueira acesa'
  ];

  // 4. Os 12 Arquétipos Narrativos com Escolhas e Mudança Real de Mundo
  const ARCHETYPES = [
    {
      code: 'CARAVAN_ESCORT',
      title: (ctx) => `O Comboio de ${ctx.region.name} na Curva da Serra`,
      desc: (ctx) => `${ctx.npc} precisa levar um carregamento vital de suprimentos até ${ctx.region.name}, mas um bando de ${ctx.mob.name} bloqueou a passagem sinuosa. Tática recomendada: ${ctx.mob.tactic}`,
      choiceA: {
        label: 'Escoltar o comboio gratuitamente por honra e dividir suas próprias Rações',
        effectText: (ctx) => `Reduz a Escassez de ${ctx.region.name} em 4 pontos, concede +10 de Confiança e +${ctx.rep * 2} de Reputação da Ordem.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 10, scarcity: -4, rep: ctx.rep * 2, fameGood: 2 })
      },
      choiceB: {
        label: 'Cobrar taxa de escolta de risco e ficar com parte da carga rara',
        effectText: (ctx) => `Você recebe ${Math.round(ctx.gold * 1.3)} de ouro e +${ctx.rep} de Reputação da Ordem, com +4 de Confiança em ${ctx.region.name}.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 4, scarcity: -2, gold: Math.round(ctx.gold * 1.3), rep: ctx.rep })
      }
    },
    {
      code: 'CLAN_DIPLOMACY',
      title: (ctx) => `Pacto de Fogueira com o ${ctx.clan.name}`,
      desc: (ctx) => `Um grupo do ${ctx.clan.name} liderado por ${ctx.clan.leader} está sendo culpado por ataques na fronteira de ${ctx.region.name}, mas os verdadeiros culpados são variantes de ${ctx.mob.name}.`,
      choiceA: {
        label: 'Provar a inocência do clã Base e abater apenas as criaturas corrompidas',
        effectText: (ctx) => `Ativa a aliança do ${ctx.clan.name} (${ctx.clan.buff}), concede +8 de Confiança em ${ctx.region.name} e +${ctx.gold} de ouro.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 8, gold: ctx.gold, rep: ctx.rep, clanAlly: ctx.clan.id, fameGood: 2 })
      },
      choiceB: {
        label: 'Exigir tributo de recursos do acampamento para encerrar o caso rapidamente',
        effectText: (ctx) => `Você recebe ${Math.round(ctx.gold * 1.4)} de ouro e 5 Minérios, mas perde 5 de Confiança com o clã local.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: -5, gold: Math.round(ctx.gold * 1.4), crystals: 5, fameBad: 1 })
      }
    },
    {
      code: 'MISSING_SCOUT_LETTER',
      title: (ctx) => `O Último Diário na Trilha de ${ctx.region.name}`,
      desc: (ctx) => `Uma carta achada perto de ${ctx.region.name} revela que um batedor escondeu uma arca de relíquias antes de ser cercado por ${ctx.mob.name}. Tática: ${ctx.mob.tactic}`,
      choiceA: {
        label: 'Recuperar a arca e devolver a insígnia e metade do espólio à família na cidade',
        effectText: (ctx) => `Você recebe ${ctx.gold} de ouro, +12 de Confiança em ${ctx.region.name} e os moradores comentam sua nobreza nas ruas.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 12, gold: ctx.gold, rep: ctx.rep + 15, fameGood: 3 })
      },
      choiceB: {
        label: 'Guardar todo o conteúdo da arca e as relíquias para a sua forja pessoal',
        effectText: (ctx) => `Você recebe ${Math.round(ctx.gold * 1.5)} de ouro e 8 Minérios do ranque atual.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { gold: Math.round(ctx.gold * 1.5), crystals: 8, rep: ctx.rep })
      }
    },
    {
      code: 'RIFT_MIASMA_CONTAINMENT',
      title: (ctx) => `Selo Instável nas Terras de ${ctx.region.name}`,
      desc: (ctx) => `Uma fissura secundária está vazando miasma e atraindo ${ctx.mob.name} para perto das fazendas e minas de ${ctx.region.name}. ${ctx.region.ruler} pede intervenção imediata.`,
      choiceA: {
        label: 'Usar 5 Minérios seus para reforçar o selo da terra após limpar os monstros',
        effectText: (ctx) => `Acelera a evolução autônoma de ${ctx.region.name} em +250 pontos de construção, concede +10 de Confiança e +${ctx.gold} de ouro.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 10, buildPts: 250, gold: ctx.gold, rep: ctx.rep + 20 })
      },
      choiceB: {
        label: 'Deixar a fissura transbordar até atrair a Elite e coletar todos os núcleos',
        effectText: (ctx) => `Combate mais difícil: rende ${Math.round(ctx.gold * 1.35)} de ouro, 3 Núcleos extras e +${ctx.rep} de Reputação.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { gold: Math.round(ctx.gold * 1.35), cores: 3, rep: ctx.rep })
      }
    },
    {
      code: 'SURVIVAL_EXPEDITION_SUPPLY',
      title: (ctx) => `Fogueira de Inverno e Provisões para ${ctx.region.name}`,
      desc: (ctx) => `${ctx.npc} avisa que uma patrulha ficou isolada no mato sem lenha e com alimentos apodrecendo sob ataque de ${ctx.mob.name}.`,
      choiceA: {
        label: 'Levar o seu Carrinho de Carga com Lenha e Carne Seca e montar um acampamento seguro para eles',
        effectText: (ctx) => `Ganha +2 pontos de treino em Resistência/Força, +10 de Confiança em ${ctx.region.name} e ${ctx.gold} de ouro.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 10, scarcity: -3, gold: ctx.gold, rep: ctx.rep + 10, trainStat: 'res' })
      },
      choiceB: {
        label: 'Abrir caminho à força para que a patrulha recuada volte correndo até a muralha',
        effectText: (ctx) => `Você recebe ${ctx.gold} de ouro e +${ctx.rep} de Reputação da Ordem imediatamente.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 5, gold: ctx.gold, rep: ctx.rep })
      }
    },
    {
      code: 'SABOTAGE_INVESTIGATION',
      title: (ctx) => `Sussurros de Logos nos Muros de ${ctx.region.name}`,
      desc: (ctx) => `Guardas de ${ctx.region.name} encontraram marcas rúnicas falsas desenhadas perto do portão para atrair ${ctx.mob.name} durante a madrugada.`,
      choiceA: {
        label: (ctx) => `Vigiar em Passo Silencioso (Ctrl) à noite, prender o sabotador vivo e entregá-lo a ${ctx.region.ruler}`,
        effectText: (ctx) => `Fortalece o Domo de ${ctx.region.name}, concede +12 de Confiança, +${ctx.gold} de ouro e reduz os preços locais em 5%.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 12, gold: ctx.gold, rep: ctx.rep + 15, fameGood: 2 })
      },
      choiceB: {
        label: 'Usar a isca do sabotador para emboscar a horda de monstros e confiscar o ouro do traidor',
        effectText: (ctx) => `Você recebe ${Math.round(ctx.gold * 1.4)} de ouro e XP extra de abate.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 5, gold: Math.round(ctx.gold * 1.4), rep: ctx.rep })
      }
    },
    {
      code: 'RIFT_TRAPPED_SURVIVOR',
      insideRift: true,
      title: (ctx) => `[DENTRO DA FENDA] O Batedor Encurralado no Portal de ${ctx.region.name}`,
      desc: (ctx) => `Dentro da Fenda próxima a ${ctx.region.name}, um batedor ferido está preso atrás de uma barreira de cristal vigiada por ${ctx.mob.name} antes da câmara do Chefe. Tática: ${ctx.mob.tactic}`,
      choiceA: {
        label: 'Quebrar a barreira de cristal, dividir 1 Ração/Poção e levá-lo como aliado contra o Chefe da Fenda',
        effectText: (ctx) => `O batedor luta ao seu lado dentro da Fenda, concede +12 de Confiança em ${ctx.region.name} e +${ctx.gold} de ouro ao sair.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 12, gold: ctx.gold, rep: ctx.rep + 20, fameGood: 3 })
      },
      choiceB: {
        label: 'Mandar o batedor escoltar os cristais já minerados até a saída enquanto você limpa a Fenda sozinho',
        effectText: (ctx) => `Garante +6 Minérios extras, +${Math.round(ctx.gold * 1.25)} de ouro e +${ctx.rep} de Reputação.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 6, gold: Math.round(ctx.gold * 1.25), crystals: 6, rep: ctx.rep })
      }
    },
    {
      code: 'RIFT_CORRUPTED_ALTAR',
      insideRift: true,
      title: (ctx) => `[DENTRO DA FENDA] O Pilar Partido no Coração da Fenda`,
      desc: (ctx) => `No corredor central desta Fenda você encontra um Altar da Primeira Era rachado pelo miasma e cercado por ${ctx.mob.name}. O pulso do altar está fortalecendo o Chefe da masmorra.`,
      choiceA: {
        label: 'Purificar o Altar com 3 Minérios antes de entrar na sala do Chefe da Fenda',
        effectText: (ctx) => `Enfraquece o Chefe da Fenda em 20%, soma +200 pontos de construção em ${ctx.region.name} e rende ${ctx.gold} de ouro.`,
        apply: (ctx) => {
          if (global.bossE && !global.bossE.dead) {
            global.bossE.hp = Math.max(1, Math.round(global.bossE.hp * 0.8));
          }
          applyWorldChange(ctx.region.id, { trust: 10, buildPts: 200, gold: ctx.gold, rep: ctx.rep + 15 });
        }
      },
      choiceB: {
        label: 'Sobrecarregar o Altar para atrair a fúria máxima da Fenda e dobrar os Núcleos',
        effectText: (ctx) => `Você recebe ${Math.round(ctx.gold * 1.5)} de ouro e +4 Núcleos puros do ranque atual.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { gold: Math.round(ctx.gold * 1.5), cores: 4, rep: ctx.rep + 10 })
      }
    },
    {
      code: 'RIFT_CAMPFIRE_MIASMA',
      insideRift: true,
      title: (ctx) => `[DENTRO DA FENDA] Fogueira Sitiada sob o Miasma`,
      desc: (ctx) => `Dentro da Fenda, uma Companhia da Fogueira está com as provisões apodrecendo pelo miasma dimensional enquanto ondas de ${ctx.mob.name} fecham o cerco ao redor das brasas.`,
      choiceA: {
        label: 'Usar a carne podre como Isca de Carniça (Tecla G) para desviar a horda e dividir suas Rações lacradas',
        effectText: (ctx) => `Restaura 100% da sua Vida e Mana dentro da Fenda, concede +10 de Confiança em ${ctx.region.name} e +${ctx.gold} de ouro.`,
        apply: (ctx) => {
          if (global.player) {
            global.player.hp = global.player.maxHp || 100;
            if (global.player.mana !== undefined) global.player.mana = global.player.maxMana || 100;
          }
          applyWorldChange(ctx.region.id, { trust: 10, gold: ctx.gold, rep: ctx.rep + 20, fameGood: 2 });
        }
      },
      choiceB: {
        label: 'Segurar a linha de frente no aço enquanto eles recolhem os cristais raros da câmara lateral',
        effectText: (ctx) => `Você recebe ${Math.round(ctx.gold * 1.35)} de ouro e +7 Minérios da Fenda.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 6, gold: Math.round(ctx.gold * 1.35), crystals: 7, rep: ctx.rep })
      }
    },
    {
      code: 'RIFT_SHADOW_SABOTEUR',
      insideRift: true,
      title: (ctx) => `[DENTRO DA FENDA] O Sabotador que Queria o Transbordo`,
      desc: (ctx) => `Você descobre dentro da Fenda um agente dos Despertadores cravando estacas rúnicas para forçar o portal a transbordar (Dungeon Break) sobre ${ctx.region.name} usando ${ctx.mob.name}.`,
      choiceA: {
        label: 'Arrancar as estacas rúnicas dentro da Fenda e prender o sabotador antes que o portal rompa',
        effectText: (ctx) => `Impede o cerco em ${ctx.region.name}, concede +14 de Confiança, Reduz a Escassez em 3 e paga ${ctx.gold} de ouro.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { trust: 14, scarcity: -3, gold: ctx.gold, rep: ctx.rep + 25, fameGood: 3 })
      },
      choiceB: {
        label: 'Deixar a última estaca pulsar para abater a Elite invocada dentro da Fenda e tomar o espólio',
        effectText: (ctx) => `Rende ${Math.round(ctx.gold * 1.45)} de ouro, +3 Núcleos e +5 Minérios.`,
        apply: (ctx) => applyWorldChange(ctx.region.id, { gold: Math.round(ctx.gold * 1.45), cores: 3, crystals: 5, rep: ctx.rep })
      }
    }
  ];

  // 5. Aplicação Real de Consequências no Save do Jogador e no Simulador de Mundo
  function applyWorldChange(regionId, delta) {
    // v541: Contratos541 lê o efeito de cada escolha sem aplicar (paga só no fim do contrato)
    if (API._capture) { API._capture.push(Object.assign({}, delta)); return; }
    const prof = global.profile || {};
    const r = global.run || {};

    if (delta.gold) {
      r.gold = Math.max(0, (r.gold || 0) + Math.round(delta.gold));
    }
    if (delta.rep && typeof global.addOrderRep === 'function') {
      global.addOrderRep(Math.round(delta.rep), 'Missão Viva das Terras Despertas');
    }
    if (delta.crystals && r.res) {
      const rk = typeof global.rankOf === 'function' ? Math.min(9, global.rankOf()) : 0;
      r.res.cry = r.res.cry || [];
      r.res.cry[rk] = (r.res.cry[rk] || 0) + Math.round(delta.crystals);
    }
    if (delta.cores && r.res) {
      const rk = typeof global.rankOf === 'function' ? Math.min(9, global.rankOf()) : 0;
      r.res.core = r.res.core || [];
      r.res.core[rk] = (r.res.core[rk] || 0) + Math.round(delta.cores);
    }
    // Atualiza Confiança e Escassez Regional (regions116)
    if (prof.regions116 && prof.regions116[regionId]) {
      const reg = prof.regions116[regionId];
      if (delta.trust) reg.trust = Math.max(0, Math.min(100, (reg.trust || 0) + Math.round(delta.trust)));
      if (delta.scarcity) reg.scarcity = Math.max(0, Math.min(20, (reg.scarcity || 0) + Math.round(delta.scarcity)));
    }
    // Atualiza Construção Autônoma da Cidade (WorldSim479)
    if (delta.buildPts && global.WorldSim479 && global.WorldSim479.state && global.WorldSim479.state[regionId]) {
      global.WorldSim479.state[regionId].buildPoints =
        (global.WorldSim479.state[regionId].buildPoints || 0) + Math.round(delta.buildPts);
    }
    // Atualiza Fama do Mundo Vivo (fama523)
    prof.fama523 = prof.fama523 || { good: 0, bad: 0, thief: 0 };
    if (delta.fameGood) prof.fama523.good += Math.round(delta.fameGood);
    if (delta.fameBad) prof.fama523.bad += Math.round(delta.fameBad);
  }

  // Catálogo Integral das 300 Missões Fixas das Terras Despertas
  API.FIXED_300_QUESTS = [
  {
    "id": "primeva_q001",
    "num": 1,
    "title": "O Céu Rasgado na Estrada Sul",
    "category": "Campanha Principal (Ato I)",
    "location": "Estrada Sul de Aster (0, +110)",
    "actors": "Edran (Batedor Veterano) e Gosma Fendida (#064)",
    "trigger": "Despertar após o sonho com a Mão do Arquiteto",
    "description": "Você desperta na lama da Estrada Sul sem classe e sem ouro diante da carroça tombada. Edran está ferido no ombro e dois civis estão presos sob a madeira enquanto uma Gosma Fendida avança do matagal.",
    "choicesText": "Empurrar a carroça imediatamente para salvar os dois sobreviventes antes de lutar no braço, ou atacar a Gosma Fendida primeiro para proteger Edran.",
    "worldConsequence": "Salvar os civis primeiro faz o casal se mudar para o primeiro anel de Aster e abrir uma banca de ataduras (+5 de Confiança em Aster); atacar o monstro primeiro preserva o escudo de Edran, que lhe entrega 1 Poção de Vida extra no portão."
  },
  {
    "id": "primeva_q002",
    "num": 2,
    "title": "A Ponte dos Escudos Caídos",
    "category": "Campanha Principal (Ato I)",
    "location": "Ponte Gótica da Estrada Sul e Vila Queimada",
    "actors": "Edran e Salteadores Fendidos",
    "trigger": "Conclusão do resgate da carroça na Estrada Sul",
    "description": "A Mão colossal do Arquiteto desce sete metros acima da estrada e recolhe a carcaça vencida. Você escolta Edran e os aldeões pela Vila da Fronteira em chamas até a Ponte dos Escudos Caídos.",
    "choicesText": "Manter a formação na ponte ao lado de Edran ou avançar sozinho pela margem para apagar o fogo do paiol da vila.",
    "worldConsequence": "Apagar o fogo do paiol salva os caixotes de grãos da Vila da Fronteira, reduzindo a Escassez inicial de Aster em 3 pontos; manter a formação evita que Edran sofra novo sangramento e acelera a chegada às Três Muralhas."
  },
  {
    "id": "primeva_q003",
    "num": 3,
    "title": "O Livro de Lyra e a Linha em Branco",
    "category": "Campanha Principal (Ato I)",
    "location": "Praça do Nexo, Fortaleza de Aster (0, 0)",
    "actors": "Comandante Brann, Mira e Chanceler Lyra",
    "trigger": "Cruzar o Portão Sul da Primeira Muralha de Aster",
    "description": "Edran desfalace nos braços da curandeira Mira perto do portão. Na tenda da Ordem, Lyra abre o Livro de Registros e pergunta seu nome e o mundo de onde você caiu.",
    "choicesText": "Revelar a Lyra a visão da Mão do Arquiteto no sonho da queda ou pedir que ela registre apenas a sua chegada e deixe o sonho em segredo.",
    "worldConsequence": "Contar sobre a Mão libera imediatamente uma nota investigativa de Aldric no Diário (+50 XP); guardar segredo faz o Narrador elogiar sua prudência e liberar uma fala rara no Histórico."
  },
  {
    "id": "primeva_q004",
    "num": 4,
    "title": "A Bigorna de Kael e o Primeiro Aço",
    "category": "Campanha Principal (Ato I)",
    "location": "Forja Central de Aster",
    "actors": "Mestre Ferreiro Kael",
    "trigger": "Registrar o nome no Livro da Ordem com Lyra",
    "description": "Sem classe e sem arma, você procura a forja de Kael. Diante da bigorna aquecida pelo Nexo, o ferreiro oferece o escambo inicial que despertará sua vocação marcial ou mágica e seus 9 pontos automáticos de atributo.",
    "choicesText": "Escolher entre as 14 classes iniciais (Guerreiro, Lâmina Arcana, Tanque, Berserker, Assassino, Arqueiro, Paladino, Invocador, Monge, Lanceiro ou um dos 4 Magos Elementais).",
    "worldConsequence": "Sua classe define a arma inicial entregue por Kael, distribui os 9 pontos iniciais de atributo da vocação e altera como os guardas e moradores de Aster se dirigem a você."
  },
  {
    "id": "primeva_q005",
    "num": 5,
    "title": "O Caderno sob o Casaco",
    "category": "Campanha Principal (Ato II)",
    "location": "Estrada Leste de Aster",
    "actors": "Lyra, Dorian e Sobreviventes da Caravana",
    "trigger": "Alcançar Rank E ou concluir o Ato I",
    "description": "Uma carroça de suprimentos de Dorian atrasou na rota leste. No local do ataque, você encontra a carroça carbonizada, dois sobreviventes encurralados por 6 inimigos e o Diário de Aldric protegido por um casaco entre duas pedras.",
    "choicesText": "Entregar o Diário de Aldric direto a Lyra ou fazer uma cópia das páginas sobre a inscrição antes de entregá-lo.",
    "worldConsequence": "Fazer a cópia garante a prova duplicada das inscrições da Primeira Era e impede que agentes de Logos apaguem o rastro na Ordem (+10 de Reputação da Ordem)."
  },
  {
    "id": "primeva_q006",
    "num": 6,
    "title": "A Caixa de Remédios Quebrada",
    "category": "Campanha Principal (Ato II)",
    "location": "Trilha das Colinas Centrais até Aster",
    "actors": "Mira e Mercador Dorian",
    "trigger": "Resgatar os sobreviventes da carroça de Aldric",
    "description": "Uma sobrevivente da caravana segura uma caixa quebrada de remédios essenciais para a enfermaria de Aster, mas bandos de Lobo Fendido (#063) farejam o sangue na trilha.",
    "choicesText": "Carregar a caixa pessoalmente (reduzindo sua velocidade em 15%) para que nenhum frasco quebre, ou dar cobertura rápida para que os sobreviventes corram até o portão.",
    "worldConsequence": "Carregar a caixa intacta aumenta permanentemente a Afinidade com Mira (+1 nível) e reduz o preço de poções em Aster; priorizar a velocidade salva 2 guardas da ronda externa."
  },
  {
    "id": "primeva_q007",
    "num": 7,
    "title": "Os Degraus da Torre da Vigília Antiga",
    "category": "Campanha Principal (Ato III)",
    "location": "Torre da Vigília Antiga / Torre da Ascensão",
    "actors": "Voz do Narrador e Guardião Corrompido (#007)",
    "trigger": "Ler o Diário de Aldric com Lyra",
    "description": "Você sobe o esporão rochoso sob chuva até a Torre da Vigília Antiga, visível a 2000 metros de Aster. Nos 5 primeiros andares, as pedras antigas mostram sinais de contenção raspados por mãos recentes.",
    "choicesText": "Purificar os archotes rúnicos de cada andar antes de subir ou avançar direto até a sala do monólito.",
    "worldConsequence": "Purificar os archotes reduz em 20% o dano mágico do chefe do terraço e revela a primeira falha de memória do Narrador ('Vocês chegaram a esta parte')."
  },
  {
    "id": "primeva_q008",
    "num": 8,
    "title": "O Sentinela do Terraço e a Moeda de Logos",
    "category": "Campanha Principal (Ato III)",
    "location": "Terraço Partido da Torre da Vigília Antiga",
    "actors": "Sentinela Corrompido (Chefe), Aldric e Brann",
    "trigger": "Alcançar o topo do 5º andar da Torre",
    "description": "No terraço aberto para o vale, o antigo comandante do posto foi transformado em um Sentinela Corrompido empunhando alabarda de éter. Ao lado da Primeira Tabuleta das Âncoras há uma moeda estrangeira com o selo de Logos.",
    "choicesText": "Mostra a moeda de Logos apenas a Brann e Lyra em conselho fechado, ou questionar Dorian abertamente no mercado sobre a origem da peça.",
    "worldConsequence": "Manter segredo no conselho permite rastrear os espiões de Logos em Thalor sem emboscadas extras nas rotas; confrontar Dorian cedo faz o mercador subir os preços em 10%, mas deixa cair um contrato cifrado."
  },
  {
    "id": "primeva_q009",
    "num": 9,
    "title": "O Sulco no Metal: As Marcas do Arquiteto",
    "category": "Campanha Principal (Ato IV)",
    "location": "Forja de Kael e Fenda de Fronteira",
    "actors": "Kael, Lyra e Guardião Acorrentado",
    "trigger": "Vencer o Sentinela da Torre e coletar a arma marcada",
    "description": "Kael analisa uma arma torta trazida da masmorra e prova que a marca escura foi gravada depois da forja. Você entra em uma Fenda ativa para confrontar um guardião preso por correntes de contenção.",
    "choicesText": "Quebrar primeiro os 5 pilares de corrente da sala para libertar o espírito do guardião antes do golpe final, ou abater o guardião diretamente enquanto as correntes o puxam.",
    "worldConsequence": "Quebrar as correntes purifica a arma recuperada, permitindo que Kael lhe entregue uma peça Rara limpa de maldição; matar direto fecha a Fenda mais rápido e rende +3 Minérios puros."
  },
  {
    "id": "primeva_q010",
    "num": 10,
    "title": "O Retorno de Aldric na Chuva",
    "category": "Campanha Principal (Ato V)",
    "location": "Morro da Rocha com Musgo e Enfermaria de Aster",
    "actors": "Aldric (Veterano) e Curandeira Mira",
    "trigger": "Concluir a análise das Marcas com Kael e Lyra",
    "description": "Aldric reaparece vivo, mas gravemente ferido, apoiado numa rocha coberta de musgo fora da estrada. Ele traz páginas escondidas sob a roupa alertando sobre uma patrulha inteira levada para uma câmara de seleção do Arquiteto.",
    "choicesText": "Escoltar Aldric passo a passo a menos de 8 metros até a tenda de Mira enfrentando batedores da ruptura, ou deixá-lo escondido sob guarda para limpar a estrada antes.",
    "worldConsequence": "Escoltar imediatamente sem deixá-lo cair preserva a saúde de Aldric, que lhe ensina o traço de leitura de inscrições (+5% XP em ruínas)."
  },
  {
    "id": "primeva_q011",
    "num": 11,
    "title": "O Corredor da Escolha: O Comandante ou os Prisioneiros",
    "category": "Campanha Principal (Ato V)",
    "location": "Fenda Vermelha da Câmara de Seleção",
    "actors": "Comandante Marcado, Patrulha Prisioneira e o Narrador",
    "trigger": "Ouvir o relato de Aldric na enfermaria",
    "description": "Dentro da Fenda que está desmoronando, o Comandante Marcado foge com os pergaminhos de rota enquanto soldados de Aster batem desesperados na porta trancada da câmara lateral. O Narrador insiste para você perseguir o comandante.",
    "choicesText": "Desobedecer ao Narrador e arrombar a porta para salvar os soldados feridos (deixando o comandante escapar), ou perseguir e abater o Comandante Marcado pelos pergaminhos.",
    "worldConsequence": "Salvar os soldados faz 3 guardas veteranos passarem a patrulhar o portão de Aster permanentemente (+15 de Confiança em Aster e respeito de Aldric); abater o comandante entrega o Tomo do Comandante (+1 ponto de habilidade), mas deixa 3 camas vazias e luto em Aster."
  },
  {
    "id": "primeva_q012",
    "num": 12,
    "title": "A Noite em que Aster Ardeu",
    "category": "Campanha Principal (Ato VI)",
    "location": "Três Muralhas de Aster e Bairro Externo",
    "actors": "Brann, Mira, Dorian e Selene",
    "trigger": "Retornar da Câmara de Seleção e minerar 20 minérios dos 6 veios",
    "description": "Um ataque massivo atinge Aster de madrugada. Enquanto Brann segura a brecha na muralha e Mira retira os feridos, uma carroça de remédios fica presa num beco em chamas do lado oposto ao depósito de armas de Kael.",
    "choicesText": "Correr para salvar a carroça de remédios de Mira ou defender o depósito de lingotes da forja de Kael.",
    "worldConsequence": "Salvar os remédios evita a morte de 4 moradores feridos e garante 2 Poções Concentradas diárias com Mira; defender o depósito preserva o estoque de aço de Kael e reduz em 15% o custo de reforço de equipamento."
  },
  {
    "id": "primeva_q013",
    "num": 13,
    "title": "O Mapa Astral no Centésimo Degrau",
    "category": "Campanha Principal (Ato VII)",
    "location": "Topo da Torre da Ascensão",
    "actors": "Rasgada do Mundo de Duas Luas e o Narrador",
    "trigger": "Concluir a defesa de Aster e a placa de Edran no portão",
    "description": "No alto da Torre, o mapa não está desenhado no chão, mas suspenso no ar entre fragmentos de pedra. Você e outra Rasgada encontram rotas que parecem levar aos seus mundos natais, além de uma ordem superior acima do nome do Arquiteto.",
    "choicesText": "Tocar o selo luminoso que lembra a porta da sua casa ou seguir o aviso do Narrador ('Não toque ainda') e copiar a hierarquia superior.",
    "worldConsequence": "Conter o impulso e copiar a inscrição revela a existência dos Superiores do Arquiteto no Diário e concede resistência permanente a ilusões mentais (+5 Vontade)."
  },
  {
    "id": "primeva_q014",
    "num": 14,
    "title": "A Chave Sem Porta no Vale da Fundição",
    "category": "Campanha Principal (Ato VIII)",
    "location": "Rota Oeste e Vale da Fundição Velha",
    "actors": "Torvo (Líder do Clã Ferrugem) e Saqueadores Falsos",
    "trigger": "Desbloquear o Ato VIII após o Mapa Astral",
    "description": "Saqueadores usando estandartes falsos do Clã Ferrugem bloqueiam o desfiladeiro com rochas e tocos. Mais adiante, Torvo protege refugiados humanos famintos com seu próprio corpo enquanto uma relíquia da Ordem é levada pelos ladrões.",
    "choicesText": "Ficar no Vale da Fundição para acender uma fogueira, entregar água fervida e comida assada aos refugiados de Torvo, ou abandonar os feridos para caçar os saqueadores e recuperar a relíquia.",
    "worldConsequence": "Ajudar Torvo e alimentar os refugiados sela o Pacto do Clã Ferrugem: goblins aliados passam a vigiar as 6 Rotas Reais e proteger suas carroças; perseguir a relíquia recupera 1 item Épico, mas deixa o Clã Ferrugem desconfiado de Aster."
  },
  {
    "id": "primeva_q015",
    "num": 15,
    "title": "A Primeira Âncora: O Trono de Gelo de Ymiria",
    "category": "Campanha Principal (Ato IX - Parte 1)",
    "location": "Desfiladeiro das Lágrimas e Capital de Ymiria (0, -3400)",
    "actors": "Arquiduquesa Astrid Frostgard, Povo do Manto Branco e Golias de Geada",
    "trigger": "Receber o Passe das Muralhas de Brann",
    "description": "Você cruza o Desfiladeiro das Lágrimas mantendo fogueiras e chá térmico contra o congelamento. Em Ymiria, a Pedra-Âncora de cristal azul flutua sob ataque do Golias de Geada cercado por Filhotes de Yeti assustados.",
    "choicesText": "Guardar a arma perto dos Filhotes de Yeti para não provocar o Povo do Manto Branco e focar apenas no Golias de Geada, ou atacar tudo na câmara com dano em área.",
    "worldConsequence": "Poupar os filhotes faz o Yeti Alfa se aliar a Ymiria e os menores fugirem em pânico quando o chefe cai, desbloqueando avisos de nevasca no norte e o 1º Relato Ancestral intacto."
  },
  {
    "id": "primeva_q016",
    "num": 16,
    "title": "A Segunda Âncora: As Ruínas do Primeiro Rei em Zahar",
    "category": "Campanha Principal (Ato IX - Parte 2)",
    "location": "Garganta das Cinzas e Deserto de Zahar (+3400, 0)",
    "actors": "Emir Tariq ibn Nadir e Guardião Solar (Braço Direito do Arquiteto)",
    "trigger": "Estabilizar a Pedra-Âncora de Ymiria",
    "description": "Sob o sol escaldante de Zahar, você colhe polpa de cacto e nivela a trilha de dunas para o Carrinho de Carga até as Ruínas Soterradas do Primeiro Rei, onde o Braço Direito do Arquiteto tenta romper as correntes.",
    "choicesText": "Selar o Braço Direito imediatamente com os minérios trazidos de Aster ou ler primeiro o 2º Relato Ancestral gravado sob o trono oxidado enquanto suporta as ondas de Escaravelhos.",
    "worldConsequence": "Ler o 2º Relato durante o cerco revela a origem do Narrador como antigo escriba real do primeiro ciclo e desbloqueia a relíquia regional Moeda do Primeiro Rei (+8% de ouro)."
  },
  {
    "id": "primeva_q017",
    "num": 17,
    "title": "A Terceira Âncora: A Fossa Abissal de Thalor e a Traição de Logos",
    "category": "Campanha Principal (Ato IX - Parte 3)",
    "location": "Porto de Thalor (-3850, 0) e Dungeon Abissal Submersa",
    "actors": "Dorian / Logos (Arauto da Ruptura), Almirante Varis e Leviatã das Correntes",
    "trigger": "Estabilizar a Pedra-Âncora de Zahar",
    "description": "No armazém do cais da neblina em Thalor, você flagra o mercador Dorian lançando cristais corrompidos nas correntes do mar: ele revela ser Logos, o Arauto da Ruptura. Depois que ele foge, você mergulha pela Fossa Abissal usando o bolsão de ar da caverna submersa até a base da 3ª Pedra-Âncora.",
    "choicesText": "No confronto do armazém, atacar Logos para arrancar um fragmento de seu manto ou destruir o lote de cristais corrompidos antes que caiam no mar.",
    "worldConsequence": "Destruir os cristais reduz pela metade a pressão abissal durante o mergulho contra o Leviatã e o Braço Esquerdo do Arquiteto; ferir Logos arranca o Estilhaço Dourado usado na forja de nível Estrela."
  },
  {
    "id": "primeva_q018",
    "num": 18,
    "title": "A Quarta Âncora: O Fogo Basáltico de Urdan",
    "category": "Campanha Principal (Ato X - Parte 1)",
    "location": "Galerias Cristalinas e Vulcânicas de Urdan (0, +3400)",
    "actors": "Mestres Mineiros de Urdan e Colosso Rachado (#065)",
    "trigger": "Emergir pelo Elevador Aquático de Thalor",
    "description": "Seguindo o mapa deixado por Logos na fuga, você desce pelas gargantas de basalto e rios de lava de Urdan até a Caverna da Âncora Cristalina, onde o calor drena vida continuamente sem unguento térmico.",
    "choicesText": "Desviar o fluxo de magma fechando as três comportas antigas com a Força antes do duelo, ou enfrentar o guardião diretamente sobre a ponte de obsidiana.",
    "worldConsequence": "Fechar as comportas resfria a galeria central, salvando os mineiros presos e revelando um veio permanente de Mithril e o 3º Relato Ancestral."
  },
  {
    "id": "primeva_q019",
    "num": 19,
    "title": "A Quinta Âncora: O Julgamento do Sapo Rei em Verden",
    "category": "Campanha Principal (Ato X - Parte 2)",
    "location": "Pântanos Profundos e Santuário da Árvore-Mãe em Verden (+2300, +2300)",
    "actors": "Arquidruida Eldrin e Sapo Rei (#020)",
    "trigger": "Purificar a 4ª Pedra-Âncora em Urdan",
    "description": "Navegando de Canoa a Remo pelas raízes gigantes de Verden, você encontra a 5ª Pedra-Âncora cercada pelo soberano anfíbio do brejo, cuja coroa de lodo foi infectada por Logos.",
    "choicesText": "Ao reduzir o Sapo Rei a 15% de vida, quebrar apenas a coroa corrompida e aceitar sua rendição (`F · ACEITAR RENDIÇÃO`), ou desferir o golpe mortal para reclamar seu núcleo.",
    "worldConsequence": "Aceitar a rendição faz o Sapo Rei jurar lealdade eterna como guardião da Âncora de Verden, reduzindo permanentemente a penalidade de lentidão do pântano pela metade e impedindo que a Mão do Arquiteto recolha seu corpo."
  },
  {
    "id": "primeva_q020",
    "num": 20,
    "title": "O Duelo com Logos e a Porta de Casa",
    "category": "Campanha Principal (Ato X - Final)",
    "location": "Fenda de Alta Concentração na Fronteira Central",
    "actors": "Logos (Arauto da Ruptura) e Projeção do Arquiteto",
    "trigger": "Estabilizar todas as 5 Pedras-Âncora",
    "description": "Você derrota Logos em sua câmara de linhas móveis. Na saída, o próprio Arquiteto rasga uma fresta mostrando a porta iluminada da sua casa no mundo natal e promete devolvê-lo se você abandonar uma única Pedra-Âncora.",
    "choicesText": "Dar um passo para trás e recusar a oferta ('Se pode abrir a rota, não precisa da morte de ninguém para mostrá-la'), ou hesitar e tocar a fresta para tentar ver quem está do outro lado.",
    "worldConsequence": "Recusar com firmeza fortalece sua Vontade (+3 pontos permanentes) e aumenta a Confiança de Lyra ao máximo; tocar a fresta causa a Cicatriz da Saudade (-5% Mana por 3 dias, mas +10% dano contra projeções do Arquiteto)."
  },
  {
    "id": "primeva_q021",
    "num": 21,
    "title": "Quatorze Dias no Outro Mundo",
    "category": "Campanha Principal (Ato XI - Parte 1)",
    "location": "Fenda Profunda de Érebo (Outro Mundo Infinito)",
    "actors": "Soberano da Cinza e Devoradores de Cinza",
    "trigger": "Iniciar a Era das Grandes Expedições (Livro II, Cap. 16-17)",
    "description": "Você estaciona o Carrinho de Carga na boca da Garganta das Cinzas e atravessa um portal que some às suas costas. Sob dois sóis partidos em eclipse, o Miasma da Fenda apodrece comidas desprotegidas enquanto você rastreia o Soberano pela Bússola de Ressonância.",
    "choicesText": "Usar a carne podre como Isca de Carniça (`[G]`) para distrair a matilha de Devoradores e conservar sua refeição lacrada no Invólucro de Resina para a véspera do chefe, ou abrir caminho à força.",
    "worldConsequence": "Usar a Isca de Carniça e o Invólucro de Resina garante o bônus máximo de Vida e Estamina contra o Soberano; ao sair, 14 dias se passaram em Primeva e o mundo simulou cercos e evolução das cidades."
  },
  {
    "id": "primeva_q022",
    "num": 22,
    "title": "A Mão no Portal Primordial",
    "category": "Campanha Principal (Ato XI - Parte 2)",
    "location": "Portal Primordial na Abóbada Subterrânea",
    "actors": "Projeção da Mão do Arquiteto, Aldric e Lyra",
    "trigger": "Retornar da Fenda de Érebo e revisar o relatório do cerco",
    "description": "Você desce com Aldric (mantido na retaguarda por ordem de Mira) até o Portal Primordial. Uma projeção translúcida da Mão do Arquiteto ataca o grupo sobre os registros da Primeira Ruptura.",
    "choicesText": "Romper o elo de mana da Mão enquanto protege a retirada de Aldric com os dois documentos antigos, ou avançar para destruir todos os dedos da projeção.",
    "worldConsequence": "Garantir a saída de Aldric vivo com os documentos revela que o Arquiteto recebia ordens de uma autoridade superior desconhecida e obriga o Narrador a confessar seu passado."
  },
  {
    "id": "primeva_q023",
    "num": 23,
    "title": "A Confissão do Narrador e a Ponte Inexistente",
    "category": "Campanha Principal (Ato XII)",
    "location": "Santuário do Nexo em Aster e Desfiladeiro do Arco",
    "actors": "O Narrador, Lyra, Aldric, Selene e Brann",
    "trigger": "Colocar os documentos do Portal Primordial na mesa de Lyra",
    "description": "O Narrador confessa ter sido o primeiro Viajante que matou o Primeiro Guardião para salvar prisioneiros, abrindo acidentalmente o caminho para o Arquiteto e perdendo o corpo físico. Logo depois, ele indica um atalho urgente por uma ponte antiga para levar remédios a uma Âncora sob pressão.",
    "choicesText": "Conferir o registro da ponte com Selene e Aldric antes de mandar a caravana (rota segura, porém mais longa), ou confiar cegamente na memória do Narrador.",
    "worldConsequence": "Verificar com Selene e Aldric prova que a ponte já caiu há décadas (evitando a morte da patrulha no abismo) e ensina o Narrador a separar 'memória deslocada' de 'sinal verificado' no Diário."
  },
  {
    "id": "primeva_q024",
    "num": 24,
    "title": "Caçada às Partes de Deus",
    "category": "Campanha Principal (Ato XIII - Parte 1)",
    "location": "Rotas das Cinco Capitais",
    "actors": "Partes Fugitivas do Arquiteto [Grau Supremo], Brann e Torvo",
    "trigger": "Uma ou mais Pedras-Âncora romperem ou iniciar a operação de Contenção",
    "description": "Uma parte física do Arquiteto escapa da prisão e caminha pelo continente buscando reunir-se às demais. Fechar a Fenda da Âncora não basta: você precisa rastrear o fragmento Supremo em campo aberto enquanto Torvo retira os civis.",
    "choicesText": "Interceptar a peça fugitiva longe das muralhas preparando armadilhas e frascos ácidos antes que ela alcance outra capital, ou esperar para enfrentá-la junto aos guardas da cidade.",
    "worldConsequence": "Interceptar na estrada aberta impede a destruição dos bairros externos da capital e preserva o nível de desenvolvimento municipal (Desfecho de Contenção)."
  },
  {
    "id": "primeva_q025",
    "num": 25,
    "title": "Quem Fechou a Porta",
    "category": "Campanha Principal (Ato XIII - Final)",
    "location": "Estrada de Aster / Santuário das Âncoras",
    "actors": "O Arquiteto [Grau Inefável], Lyra, Brann, Mira, Aldric e Torvo",
    "trigger": "Recapturar a última parte livre ou enfrentar o corpo reunido em marcha",
    "description": "O clímax do primeiro grande ciclo de Primeva. Se você conteve as partes separadas, sela a última brecha; se as cinco partes se reuniram, o Arquiteto marcha a 2 metros por segundo rumo ao Nexo de Aster e deve ser detido antes de alcançar 55 metros da muralha.",
    "choicesText": "No registro final do Livro de Lyra, declarar que continuará procurando o caminho de seu mundo natal mas que deseja poder voltar para Aster como seu lar, ou declarar que Aster agora é sua única casa.",
    "worldConsequence": "Conquista o título lendário 'Quem Fechou a Porta', 1.000.000 de ouro, relíquias primordiais e abre o pós-jogo completo nas Terras Despertas sem encerrar a jornada."
  },
  {
    "id": "primeva_q026",
    "num": 26,
    "title": "Juramento de Ferro nas Ameias",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Primeira Muralha de Aster",
    "actors": "Comandante Brann e Batedor Edran",
    "trigger": "Conversar com Brann após alcançar o Nível 5",
    "description": "Brann convoca novos braços para a Vanguarda da Muralha. Para provar que você conhece a disciplina da guarda, precisa testar seu bloqueio e aparo (`Botão do Meio do Mouse`) contra três veteranos no pátio e limpar uma patrulha de Goblins Fendidos na Estrada Norte.",
    "choicesText": "Vencer o treino usando apenas aparos perfeitos sem quebrar a guarda dos recrutas, ou derrubá-los com força bruta.",
    "worldConsequence": "Usar aparos perfeitos ganha o respeito imediato de Edran e concede o broche de Recruta da Vanguarda (+5% de escudo)."
  },
  {
    "id": "primeva_q027",
    "num": 27,
    "title": "A Ronda das Três Tochas",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Perímetro Externo de Aster (Anel Maria)",
    "actors": "Guarda de Ronda Varek",
    "trigger": "Concluir #026",
    "description": "À noite, os braseiros externos da Terceira Muralha estão sendo apagados por Lobos Sombrios (#053) antes de uma tentativa de infiltração.",
    "choicesText": "Reacender os 4 braseiros com Feixes de Lenha e Resina antes de caçar a matilha, ou emboscar o lobo líder no escuro usando um Lampião de Viagem.",
    "worldConsequence": "Reacender os braseiros faz os arqueiros da muralha passarem a dar suporte automático com flechas de fogo à noite."
  },
  {
    "id": "primeva_q028",
    "num": 28,
    "title": "Alvo Notório: Barrão, o Quebra-Cercas",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Campos Temperados a Leste de Aster",
    "actors": "Comandante Brann e Barrão, o Quebra-Cercas (Elite Rank E)",
    "trigger": "Aceitar contrato de Alvo Notório Rank E",
    "description": "Uma besta colossal vem destruindo as cercas das fazendas externas e virando carroças de feno. As pistas no Diário apontam para o moinho velho nos Campos.",
    "choicesText": "Construir uma paliçada estreita para travar a investida de Barrão ou enfrentá-lo em campo aberto.",
    "worldConsequence": "Concede permanentemente o título 'Caçador do Quebra-Cercas' (+2% de dano) e +75 de Reputação da Ordem."
  },
  {
    "id": "primeva_q029",
    "num": 29,
    "title": "Sangue na Neve do Desfiladeiro",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Desfiladeiro das Lágrimas (Rota Norte)",
    "actors": "Caçador Torben Halvorsen",
    "trigger": "Alcançar Rank D na Vanguarda",
    "description": "Uma patrulha de Ymiria desapareceu nas gargantas sinuosas do norte. Seguindo o rastro de sangue azul na neve, você encontra Torben cercado por Yetis Corrompidos (#119).",
    "choicesText": "Lutar ombro a ombro com Torben na garganta estreita ou subir a crista rochosa escalando para derrubar estalactites sobre as feras.",
    "worldConsequence": "Salvar Torben sem que ele caia faz dele um aliado que pode ser encontrado patrulhando a rota norte e dividindo fogueira."
  },
  {
    "id": "primeva_q030",
    "num": 30,
    "title": "Alvo Notório: Velha Míscaro",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Floresta Sombria ao Sul de Aster",
    "actors": "Velha Míscaro (Rei Cogumelo Elite Rank D)",
    "trigger": "Aceitar contrato de Alvo Notório Rank D",
    "description": "Um fungo gigante corrompido está espalhando esporos soníferos pela estrada florestal, fazendo cocheiros dormirem ao volante das carroças.",
    "choicesText": "Queimar os anéis de micélio com fogo antes do combate para cortar a nuvem de sono, ou lutar usando poções de Vontade para preservar os esporos raros.",
    "worldConsequence": "Concede permanentemente o título 'Caçador da Velha Míscaro' (+3% de vida máxima) e +150 de Reputação da Ordem."
  },
  {
    "id": "primeva_q031",
    "num": 31,
    "title": "Escolta de Guerra para Solaria",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Estrada Real de Solaria",
    "actors": "Teren (Cocheiro) e Grão-Mestre Aurelius",
    "trigger": "Concluir #030",
    "description": "Uma carroça blindada levando aço temperado de Kael precisa atravessar três Nós de Encontro infestados de Orcs Fendidos (#118) até Solaria.",
    "choicesText": "Viajar montado na traseira da carroça disparando à distância ou marchar à frente limpando as barricadas da estrada.",
    "worldConsequence": "Entregar a carga com 100% de integridade reduz a Escassez de Solaria a zero e libera armaduras douradas na loja local."
  },
  {
    "id": "primeva_q032",
    "num": 32,
    "title": "Alvo Notório: Orelha-Rubra",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Campos Floridos",
    "actors": "Orelha-Rubra (Coelho Assassino Elite Rank C)",
    "trigger": "Aceitar contrato de Alvo Notório Rank C",
    "description": "Parece um coelho branco comum entre as flores até saltar na garganta de três caçadores novatos. A caveira vermelha surge no minimapa a 60 metros.",
    "choicesText": "Usar uma Armadilha de Laço ou Flecha Enredante para travar a esquiva do Orelha-Rubra, ou vencê-lo no reflexo com Contra-Fluxo.",
    "worldConsequence": "Concede permanentemente o título 'Caçador do Orelha-Rubra' (+4% de ouro de monstros) e +270 de Reputação da Ordem."
  },
  {
    "id": "primeva_q033",
    "num": 33,
    "title": "O Cerco da Vila de Ardent",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Vila de Ardent (Pé da Serra Sul)",
    "actors": "Capitão da Milícia de Ardent",
    "trigger": "Alcançar Rank C",
    "description": "Um portal não fechado a tempo transbordou e uma tropa invasora está desgastando o Domo de proteção de Ardent.",
    "choicesText": "Doar 15 minérios do seu próprio bolso para recarregar o Domo antes que rompa, ou deixar o Domo cair para atrair o Chefe Invasor para a praça e abatê-lo no mano a mano.",
    "worldConsequence": "Impedir a queda do Domo preserva todas as lojas abertas e concede +20 de Confiança imediata em Ardent."
  },
  {
    "id": "primeva_q034",
    "num": 34,
    "title": "Alvo Notório: Rei Coaxo",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Pântanos de Verden",
    "actors": "Rei Coaxo (Sapo Guerreiro Elite Rank B)",
    "trigger": "Aceitar contrato de Alvo Notório Rank B",
    "description": "Um dissidente gigantesco e corrompido da Confraria do Brejo está afundando canoas de pescadores nas águas rasas de Verden.",
    "choicesText": "Atraí-lo para uma ilhota seca onde seu salto perde impulso, ou enfrentá-lo dentro da água rasa usando Botas de Lodo.",
    "worldConsequence": "Concede permanentemente o título 'Caçador do Rei Coaxo' (+4% de vida máxima) e +450 de Reputação da Ordem."
  },
  {
    "id": "primeva_q035",
    "num": 35,
    "title": "Asas sobre o Vale: O Primeiro Dragão Errante",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Colinas ao Norte de Aster",
    "actors": "Brann e Dragão Errante (Dragonete Colossal)",
    "trigger": "Alcançar Nível 35",
    "description": "Um rugido rasga as nuvens: um Dragão Errante circula a 24 metros de altura cuspindo fogo no chão antes de pousar entre as fazendas.",
    "choicesText": "Usar armas de alcance e balistas da muralha para forçar o pouso imediato do dragão, ou esperar o pouso natural de 14 segundos protegendo os agricultores com escudos.",
    "worldConsequence": "Abater o primeiro Dragão Errante inaugura a Estante de Troféus Dracônicos no quartel da Vanguarda (+2% dano contra dragões)."
  },
  {
    "id": "primeva_q036",
    "num": 36,
    "title": "Alvo Notório: Geada-Mãe",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Tundra Gelada de Ymiria",
    "actors": "Geada-Mãe (Yeti Abissal Elite Rank A)",
    "trigger": "Aceitar contrato de Alvo Notório Rank A",
    "description": "Nas geleiras ao norte de Ymiria, uma matriarca tomada pelo vazio congela o ar num raio de 20 metros, murchando toda vegetação ao redor.",
    "choicesText": "Montar duas Fogueiras de Pedra no perímetro da arena para anular o congelamento durante a luta, ou usar armas Flamejantes de Urdan.",
    "worldConsequence": "Concede permanentemente o título 'Caçador da Geada-Mãe' (+3% de dano) e +720 de Reputação da Ordem."
  },
  {
    "id": "primeva_q037",
    "num": 37,
    "title": "A Queda do Forte da Garganta",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Passagem Leste (1820, 0)",
    "actors": "Edran e O Marechal sem Bandeira (#191)",
    "trigger": "Concluir #036",
    "description": "Uma legião de mortos-vivos comandada por um O Marechal sem Bandeira tomou o posto avançado da Passagem Leste, cortando o comércio entre Aster e Zahar.",
    "choicesText": "Infiltrar-se pelas rochas altas para abater os Esqueletos Magos (#043) que sustentam a barreira, ou liderar uma carga frontal com os soldados de Edran.",
    "worldConsequence": "Reabre a rota de carroças para o deserto de Zahar e instala 2 guardas permanentes no posto da Passagem Leste."
  },
  {
    "id": "primeva_q038",
    "num": 38,
    "title": "Alvo Notório: Prisma Faminto",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Geleira de Cristal",
    "actors": "Prisma Faminto (Golem de Pedra Abissal Elite Rank S)",
    "trigger": "Aceitar contrato de Alvo Notório Rank S",
    "description": "Um Golem de Pedra que engoliu um núcleo abissal inteiro está devorando os veios de cristal de mana da cordilheira.",
    "choicesText": "Destruir os 4 cristais menores da caverna antes de golpear o Prisma Faminto para impedir que ele se cure, ou quebrá-lo com penetração máxima.",
    "worldConsequence": "Concede permanentemente o título 'Caçador do Prisma Faminto' (+5% de vida máxima) e +1080 de Reputação da Ordem."
  },
  {
    "id": "primeva_q039",
    "num": 39,
    "title": "Caçada ao Dragão Gélido de Ymiria",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Picos Glaciais de Ymiria",
    "actors": "Arquiduquesa Astrid Frostgard e Dragão Gélido de Ymiria",
    "trigger": "Alcançar Rank S na Vanguarda",
    "description": "O lendário Dragão Gélido de escala 8 atacou as torres externas de Ymiria. Seus sopros pintam o chão de azul congelante antes de explodir.",
    "choicesText": "Lutar ao lado dos besteiros anões de Ymiria nas ameias ou atrair o dragão para as Termas de Vapor Cinzento, onde o calor enfraquece sua couraça.",
    "worldConsequence": "Vencer nas Termas rende a Escama Intacta de Ymiria, usada por Kael para forjar armaduras imunes ao frio."
  },
  {
    "id": "primeva_q040",
    "num": 40,
    "title": "Alvo Notório: Sultão Escaravelho",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Dunas Profundas de Zahar",
    "actors": "Sultão Escaravelho (Cavaleiro Escaravelho Abissal Elite Rank SS)",
    "trigger": "Aceitar contrato de Alvo Notório Rank SS",
    "description": "Um besouro encouraçado colossal revestido de ouro antigo e vazio percorre as dunas a leste do oásis.",
    "choicesText": "Arremessar moedas de ouro (`Tecla Y`) na beira de uma cratera de pedra para forçar sua investida e atacá-lo durante os 3 segundos de freada, ou enfrentá-lo de frente.",
    "worldConsequence": "Concede permanentemente o título 'Caçador do Sultão Escaravelho' (+6% de ouro de monstros) e +1560 de Reputação da Ordem."
  },
  {
    "id": "primeva_q041",
    "num": 41,
    "title": "A Serpe das Dunas e o Dragão-Musgo",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Deserto de Zahar e Floresta de Verden",
    "actors": "Farid ibn Rashid e Cian Ardwyn",
    "trigger": "Concluir #040",
    "description": "Dois dragões regionais despertaram no mesmo ciclo semanal: a Serpe de Areia em Zahar e o Dragão-Musgo nas copas de Verden.",
    "choicesText": "Caçar primeiro a Serpe de Zahar para salvar as caravanas de especiarias ou o Dragão-Musgo de Verden para proteger os coletores de ervas.",
    "worldConsequence": "A capital socorrida primeiro reduz todos os preços de suas lojas em 10% por uma estação inteira."
  },
  {
    "id": "primeva_q042",
    "num": 42,
    "title": "Alvo Notório: Brasa-Velha",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Caldeira Vulcânica de Urdan",
    "actors": "Brasa-Velha (Dragão Ancião Fendido Elite Rank SS+)",
    "trigger": "Aceitar o 8º e último contrato de Alvo Notório",
    "description": "No coração da cratera de Urdan dorme Brasa-Velha, uma lenda com ouro derretido incrustado nas escamas.",
    "choicesText": "Usar Frascos de Ácido e armas Congelantes de Ymiria para trincar sua couraça de magma antes do sopro supremo.",
    "worldConsequence": "Concede permanentemente o título 'Caçador do Brasa-Velha' (+4% de dano e +4% de vida máxima) e +2250 de Reputação da Ordem."
  },
  {
    "id": "primeva_q043",
    "num": 43,
    "title": "O Nêmesis da Fronteira",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Rota Sul de Aster",
    "actors": "O Campeão das Arenas (#190) Nêmesis",
    "trigger": "Ter completado todos os 8 Alvos Notórios",
    "description": "Um O Campeão das Arenas que sobreviveu a uma ruptura anterior caça caçadores da Vanguarda pelo nome e desafia você diante da Ponte dos Escudos Caídos.",
    "choicesText": "Aceitar o duelo solitário sem ajuda de aliados/invocações ou chamar a guarnição de Brann para cercá-lo.",
    "worldConsequence": "Vencer no duelo solitário concede o Machado Rubro da Vanguarda e o respeito máximo de todos os soldados das 6 capitais."
  },
  {
    "id": "primeva_q044",
    "num": 44,
    "title": "O Dragão Sitiante nas Três Muralhas",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Céu de Aster (Nível Municipal 8+)",
    "actors": "Comandante Brann e Dragão Ancião Sitiante (5 Barras)",
    "trigger": "Cidade alcançar Nível 8 e concluir #043",
    "description": "Um Dragão Ancião colossal de escala 10 mergulha contra a Catedral de Pedra e as três muralhas de Aster. Você tem 5 minutos para impedir a destruição dos distritos.",
    "choicesText": "Subir na torre mais alta da Muralha Maria para saltar sobre o dorso do dragão quando ele rasar o telhado, ou comandar o fogo concentrado da praça.",
    "worldConsequence": "Derrotar o Dragão Sitiante coloca o crânio colossal da fera no portão de Aster e dobra a renda diária da cidade."
  },
  {
    "id": "primeva_q045",
    "num": 45,
    "title": "Espada Primeira de Aster",
    "category": "Facção: Vanguarda da Muralha",
    "location": "Praça do Nexo, Aster",
    "actors": "Comandante Brann, Edran e Lyra",
    "trigger": "Concluir #044",
    "description": "Cerimônia final da Vanguarda da Muralha. Brann entrega a você o comando de campo das patrulhas continentais.",
    "choicesText": "Nomear Edran como Capitão da Guarda Interna ou enviá-lo para comandar as patrulhas móveis das 6 Rotas Reais.",
    "worldConsequence": "Concede o título 'Espada Primeira de Aster' (+8% defesa física e guardas das capitais auxiliam você em até 80 metros dos portões)."
  },
  {
    "id": "primeva_q046",
    "num": 46,
    "title": "A Água que Não Deve Ser Bebida",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Lagoa Externa de Aster e Tenda de Mira",
    "actors": "Curandeira Mira",
    "trigger": "Falar com Mira sobre alquimia de campo",
    "description": "Três recrutas adoeceram com Parasitas após beberem água parada do pântano sem ferver. Mira pede que você colha Ervas Curativas, ferva água num Cantil de Ferro na fogueira e prepare o primeiro Antídoto.",
    "choicesText": "Entregar o antídoto aos recrutas gratuitamente ou cobrar pelas ervas gastas.",
    "worldConsequence": "Entregar gratuitamente libera o manual do Caldeirão de Campanha e aumenta sua Afinidade com Mira."
  },
  {
    "id": "primeva_q047",
    "num": 47,
    "title": "As Sete Folhas dos Biomas",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Campos, Floresta, Neve, Vulcão, Pântano e Fenda",
    "actors": "Mira e Aldric",
    "trigger": "Concluir #046",
    "description": "Para catalogar a flora das Terras Despertas, Mira pede uma amostra fresca de Raiz de Sangue, Musgo Glacial, Flor de Brasa, Líquen Ácido, Orquídea Abissal e Fungo Luminoso.",
    "choicesText": "Guardar as plantas na Mochila Térmica para entregá-las com 100% de vigor botânico, ou secá-las no Varal Portátil.",
    "worldConsequence": "Entregar frescas na Mochila Térmica aumenta em 20% a potência de todas as poções destiladas no seu Caldeirão."
  },
  {
    "id": "primeva_q048",
    "num": 48,
    "title": "O Caldeirão de Fogo Líquido",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Ponte de Pedra do Rio Central",
    "actors": "Mira e Bando de Couraçados",
    "trigger": "Concluir #047",
    "description": "Mira desenvolveu a fórmula dos Frascos Arremessáveis (`Tecla G`). Você deve destilar 3 Frascos de Ácido e 3 Frascos de Fogo Líquido e testá-los contra uma patrulha de inimigos Blindados na ponte.",
    "choicesText": "Derreter primeiro a armadura dos inimigos com Ácido (-50% armadura) antes de usar o Fogo Líquido, ou usar Cortina de Fumaça para emboscá-los.",
    "worldConsequence": "Desbloqueia a receita permanente de Frascos de Paralisia (4 segundos de controle) no seu Caldeirão de Campo."
  },
  {
    "id": "primeva_q049",
    "num": 49,
    "title": "Cartografia das Quatro Serras",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Passagens Norte, Leste, Sul e Oeste (`ridge513`)",
    "actors": "Sábio Aldric",
    "trigger": "Falar com Aldric na Biblioteca Circular",
    "description": "Aldric precisa confirmar a altitude e as passagens das quatro grandes serras que cercam o vale central a 170 metros de altura.",
    "choicesText": "Escalar até o cume das 4 serras usando Estamina para cravar marcos de bronze, ou mapear apenas os vales das estradas.",
    "worldConsequence": "Escalar os 4 cumes revela todos os pontos de encontro e cavernas num raio de 1000 metros no Mapa-Múndi (`Tecla M`)."
  },
  {
    "id": "primeva_q050",
    "num": 50,
    "title": "A Anomalia do Redemoinho ao Amanhecer",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Geleira de Cristal",
    "actors": "Aldric e Redemoinho (#023)",
    "trigger": "Concluir #049",
    "description": "O Bestiário diz que o Redemoinho nasce onde duas Fendas se cruzam e se desfaz ao amanhecer. Aldric quer que você mantenha um Redemoinho vivo até o nascer do sol (06:00 no relógio) para recolher seu núcleo de vento.",
    "choicesText": "Controlar a criatura com escudos e esquivas até as 06:00 sem matá-la antes da hora, ou abatê-la durante a noite.",
    "worldConsequence": "Aguardar o amanhecer faz o Redemoinho se desfazer sozinho deixando a Pena do Vento Norte (+5% de velocidade permanente)."
  },
  {
    "id": "primeva_q051",
    "num": 51,
    "title": "O Silêncio da Lula do Vazio",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Fenda de Érebo",
    "actors": "Aldric e Lula do Vazio (#032)",
    "trigger": "Alcançar Nível 25",
    "description": "A Lula do Vazio engole a luz e o som antes de atacar. Aldric precisa de uma glândula acústica intacta para estudar como proteger os batedores da cegueira sensorial.",
    "choicesText": "Abater a Lula do Vazio no exato instante em que ela cria a zona de silêncio, usando apenas ataques físicos sem recuar.",
    "worldConsequence": "Rende o Sino da Fenda e uma melhoria nos avisos sonoros de perigo dentro das Fendas."
  },
  {
    "id": "primeva_q052",
    "num": 52,
    "title": "Os Olhos que Enfraquecem",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Fenda Profunda de Xylo",
    "actors": "Mira e Olho Errante (#184)",
    "trigger": "Concluir #051",
    "description": "O Olho Errante (#184) se alimenta da força de quem encara. Mira quer criar um colírio espelhado usando o cristal da íris roxa dessa criatura.",
    "choicesText": "Lutar de costas ou usando cobertura de pilares para nunca encarar o feixe da pupila antes do golpe final.",
    "worldConsequence": "Concede a receita do Elixir do Olhar Firme (imunidade à inversão de controles de chefes por 5 minutos)."
  },
  {
    "id": "primeva_q053",
    "num": 53,
    "title": "A Semente que Vira Pedra",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Campos Agrícolas ao Sul de Aster",
    "actors": "Fazendeiro local, Aldric e Semente da Fenda (#187)",
    "trigger": "Concluir #052",
    "description": "Um bando de Sementes da Fenda (#187) escapou de um portal raso e está secando a grama das fazendas, transformando o solo fértil em cristal estéril.",
    "choicesText": "Arrancar e destruir as 8 Sementes antes que completem a cristalização, ou deixar 2 crescerem para minerar cristais grandes.",
    "worldConsequence": "Salvar toda a fazenda garante suprimento diário de Frutas e Ervas na cesta da Ordem; deixar cristalizar cria um veio de mineração, mas aumenta a Escassez de comida em Aster."
  },
  {
    "id": "primeva_q054",
    "num": 54,
    "title": "A Voz do Arauto",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Fenda Corrompida Rank B+",
    "actors": "Aldric, O Narrador e Arauto da Fenda (#186)",
    "trigger": "Alcançar Nível 45",
    "description": "O Arauto da Fenda (#186) surge antes de grandes rupturas e se alimenta das próprias palavras que anuncia. Aldric pede que você grave os dois anéis de runas que giram ao redor do seu capuz vazio.",
    "choicesText": "Sobreviver a três pronúncias do Arauto sem interrompê-lo para que Aldric copie o idioma inteiro, ou silenciá-lo no primeiro golpe.",
    "worldConsequence": "Deixar o Arauto falar as três frases revela um capítulo oculto sobre a Primeira Ruptura e concede +2 pontos de Inteligência por treino."
  },
  {
    "id": "primeva_q055",
    "num": 55,
    "title": "Pó de Estrela nas Asas da Arraia",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Fenda Astral de Kemet",
    "actors": "Mira e Arraia do Vazio (#185)",
    "trigger": "Concluir #054",
    "description": "A Arraia do Vazio (#185) filtra pó de estrela no ar das Fendas. Mira precisa desse pó para criar uma poção que recupere Mana instantaneamente sem tempo de espera.",
    "choicesText": "Atingir a Arraia em pleno mergulho aéreo com ataque à distância para não rasgar a membrana estelar.",
    "worldConsequence": "Desbloqueia a Poção Astral de Mira (+40% de Mana imediata) no estoque reservado."
  },
  {
    "id": "primeva_q056",
    "num": 56,
    "title": "O Mistério do Visitante",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Geleira de Cristal",
    "actors": "Aldric e Visitante (#012)",
    "trigger": "Concluir #055",
    "description": "O Visitante (#012) tem pele lisa, olhos vazios, nunca foi visto comendo e observa os humanos por 3 segundos antes de agir. Aldric suspeita que eles não são monstros, mas sondas de quem está acima do Arquiteto.",
    "choicesText": "Ficar imóvel por 10 segundos diante de um Visitante Base sem sacar a arma para ver o que ele faz quando não há hostilidade, ou atacá-lo.",
    "worldConsequence": "Permanecer imóvel faz o Visitante tocar o chão, deixar uma Tabuleta de Cristal intacta e desaparecer sem luta, revelando pistas sobre os Superiores do Arquiteto."
  },
  {
    "id": "primeva_q057",
    "num": 57,
    "title": "A Fenda na Parede da Mina",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Mina Profunda de Urdan",
    "actors": "Aldric e Mineradora Anã",
    "trigger": "Concluir #056",
    "description": "Enquanto trabalhava na mina fora da muralha de Urdan, uma mineradora quebrou uma parede de basalto e revelou um arco de coral branco petrificado que sopra vento frio.",
    "choicesText": "Atravessar a fenda estreita na rocha com uma tocha acesa e o kit de acampamento.",
    "worldConsequence": "Descobre a primeira entrada física para a **Abóbada Primordial** (o subsolo colossal sob o continente de 100 km²)."
  },
  {
    "id": "primeva_q058",
    "num": 58,
    "title": "As Catedrais de Coral Branco (A Abóbada Primordial)",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Abóbada Primordial (Subsolo do Continente)",
    "actors": "Aldric e Guardiões de Coral",
    "trigger": "Concluir #057",
    "description": "A câmera se abre numa caverna titânica iluminada por cogumelos fosforescentes gigantes e aquedutos da Primeira Era que ligam Urdan a Thalor por baixo da terra.",
    "choicesText": "Acender os 5 faróis de éter ao longo da estrada subterrânea para ativar o atalho permanente entre o sul e o oeste.",
    "worldConsequence": "Desbloqueia a travessia subterrânea rápida entre Urdan, Thalor e Verden através da Abóbada Primordial."
  },
  {
    "id": "primeva_q059",
    "num": 59,
    "title": "A Flor-da-Abóbada",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Jardim Subterrâneo da Abóbada Primordial",
    "actors": "Mira e Glub Ancião (#030)",
    "trigger": "Concluir #058",
    "description": "No centro da Abóbada cresce a lendária Flor-da-Abóbada, guardada por um Glub Ancião (#030) que dorme há séculos como uma lagoa imóvel.",
    "choicesText": "Colher as pétalas em Passo Silencioso (`Ctrl`) sem acordar o Glub Ancião, ou despertá-lo e lutar no terreno alto para escapar da inundação.",
    "worldConsequence": "Colher em silêncio permite que a flor continue brotando a cada 7 dias, fornecendo o ingrediente da Poção de Vida Eterna (+10% Vida máxima permanente na primeira dose)."
  },
  {
    "id": "primeva_q060",
    "num": 60,
    "title": "O Relógio Entre os Planos",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Observatório de Aster e Fenda de Nifl",
    "actors": "Aldric e Lyra",
    "trigger": "Concluir #059",
    "description": "Aldric quer calibrar o astrolábio de bronze da biblioteca para prever exatamente quantos dias passarão em Primeva durante cada expedição dimensional.",
    "choicesText": "Instalar três pêndulos de cristal sincronizados dentro de uma Fenda de Nifl e retornar em menos de 10 minutos.",
    "worldConsequence": "O HUD passa a exibir com precisão o relógio comparativo entre o tempo interno da Fenda e os dias corridos em Primeva."
  },
  {
    "id": "primeva_q061",
    "num": 61,
    "title": "Os Dois Sóis de Érebo",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Outro Mundo de Érebo",
    "actors": "Aldric e Espectro Abissal (#166)",
    "trigger": "Concluir #060",
    "description": "Aldric descobre que o mundo de Érebo foi a terra natal do primeiro rei de Zahar antes de ser costurado à Fenda pelo Arquiteto.",
    "choicesText": "Recuperar a coroa quebrada no altar sob o eclipse dos dois sóis e trazê-la para o museu de Aster ou devolvê-la ao Emir Tariq em Zahar.",
    "worldConsequence": "Devolver a Zahar sela uma aliança acadêmica entre Zahar e Aster (+15 Confiança em Zahar); deixar em Aster amplia o bônus da Biblioteca da sua casa (+2% XP)."
  },
  {
    "id": "primeva_q062",
    "num": 62,
    "title": "A Peste de Esporos Cinzentos",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Vila de Bruma (Floresta de Verden)",
    "actors": "Mira e Cogumelo Furioso Abissal (#141)",
    "trigger": "Concluir #061",
    "description": "Uma colônia de Cogumelos Furiosos Abissais está drenando o calor da Vila de Bruma, deixando os moradores em coma febril.",
    "choicesText": "Purificar o solo com cal de conchas marinhas trazida de Edda (a Salineira) e eliminar o foco abissal sem queimar as árvores sagradas.",
    "worldConsequence": "Salva todos os moradores da Vila de Bruma e libera uma estufa medicinal gratuita na região."
  },
  {
    "id": "primeva_q063",
    "num": 63,
    "title": "O Código das Seis Constelações",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Mirante Noturno de Aster (`Cons523`)",
    "actors": "Aldric",
    "trigger": "Ter pelo menos 10 estrelas acesas no céu de Constelações",
    "description": "Olhando para o céu 3D de Aster à noite, Aldric percebe que as 6 Constelações (O Dragão Rubro, O Olho da Fenda, A Arraia do Vazio, O Lobo de Mana, O Cálice Partido e A Mão do Arquiteto) apontam para uma 7ª posição oculta: A Estrela.",
    "choicesText": "Alinhar os espelhos da Torre da Vigília na noite de céu limpo para projetar o feixe estelar no Nexo.",
    "worldConsequence": "Concede +3 pontos de Constelação (`run.cpts`) e revela o requisito ancestral do Rank Aço-Estrela (`★`)."
  },
  {
    "id": "primeva_q064",
    "num": 64,
    "title": "O Experimento do Jardineiro da Podridão",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Fenda Vermelha de Xylo",
    "actors": "Mira, Aldric e O Jardineiro da Podridão (#199)",
    "trigger": "Concluir #063",
    "description": "O Jardineiro da Podridão (#199) está cultivando um miasma capaz de atravessar até os Invólucros de Resina e contaminar o lago de Aster.",
    "choicesText": "Usar o Antídoto Concentrado de Flor-da-Abóbada para caminhar dentro da névoa venenosa do Arconte e destruir seu coração floral.",
    "worldConsequence": "Concede imunidade permanente à perda de frescor de alimentos dentro de bolsas térmicas em qualquer Fenda."
  },
  {
    "id": "primeva_q065",
    "num": 65,
    "title": "Grão-Mestre do Círculo e da Lâmpada",
    "category": "Facção: Círculo Cartográfico e Alquímico",
    "location": "Biblioteca Circular de Aster",
    "actors": "Aldric e Mira",
    "trigger": "Concluir #064",
    "description": "Com o Atlas de 100 km² completo, a Abóbada mapeada e o bestiário catalogado, Aldric e Mira entregam a você a cátedra suprema do Círculo.",
    "choicesText": "Dedicar os recursos do Círculo à Alquimia de Combate (Mira) ou à Cartografia de Fendas Raras (Aldric).",
    "worldConsequence": "Escolher Mira dá +25% de duração em todas as poções e chás; escolher Aldric faz o mapa revelar automaticamente o caminho do Soberano em qualquer Outro Mundo. Concede o título 'Olho de Primeva'."
  },
  {
    "id": "primeva_q066",
    "num": 66,
    "title": "O Fole e a Faísca",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Forja de Kael, Aster",
    "actors": "Mestre Ferreiro Kael",
    "trigger": "Forjar ou reforçar seu primeiro equipamento",
    "description": "Kael vê que você não trata uma espada apenas como sucata. Ele pede que você minere 10 Cristais de Rank F/E, recolha 5 Núcleos e forje uma peça limpa sob sua supervisão.",
    "choicesText": "Temperar a lâmina em água fria do rio (foco em Dano) ou em óleo mineral de Urdan (foco em Escudo).",
    "worldConsequence": "Abre o caminho dos Artífices de Aço e Ferrugem e reduz em 10% o custo de ouro na forja de Kael."
  },
  {
    "id": "primeva_q067",
    "num": 67,
    "title": "Duas Rodas para o Continente",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Bosque Oeste de Aster e Bancada de Campo",
    "actors": "Kael e Torvo",
    "trigger": "Concluir #066",
    "description": "Para transportar toras maciças e minérios sem travar de sobrecarga, você precisa construir seu próprio Carrinho de Carga de duas rodas usando 6 Tábuas de Madeira Trabalhada, 2 Cipós e 1 Minério.",
    "choicesText": "Reforçar o eixo do carrinho com aros de ferro de Kael ou manter a madeira flexível do Clã Ferrugem.",
    "worldConsequence": "Aros de ferro dão +50% de durabilidade ao carrinho contra ataques de monstros; madeira flexível aumenta a velocidade de puxada nas subidas."
  },
  {
    "id": "primeva_q068",
    "num": 68,
    "title": "O Segredo do Aço Rank E",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Mina Externa de Aster",
    "actors": "Kael e Golenzinho (#018)",
    "trigger": "Alcançar Nível 10",
    "description": "Os Golenzinhos (#018) mastigam cristais de mana como doces e deixam uma escória mineral perfeita para temperar o conjunto de Aço.",
    "choicesText": "Alimentar os Golenzinhos com lascas de cristal para recolher a escória em paz, ou quebrá-los com picareta.",
    "worldConsequence": "Alimentá-los cria uma colônia mansa de Golenzinhos na mina de Aster, aumentando a chance de +1 cristal extra ao minerar."
  },
  {
    "id": "primeva_q069",
    "num": 69,
    "title": "Madeira de Lei para o Estaleiro",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Serra Costeira de Thalor",
    "actors": "Oren, o Carpinteiro Naval",
    "trigger": "Viajar até Thalor (-3850, 0) e falar com Oren",
    "description": "Oren precisa de 12 Toras de Carvalho maduro para reparar os barcos da costa, mas exige que você respeite a lei da floresta: derrubar apenas árvores marcadas e deixar os tocos intactos para rebrotarem.",
    "choicesText": "Cortar com o Machado de Pedra/Aço apenas as árvores velhas marcadas e levar no Carrinho de Carga até a praia.",
    "worldConsequence": "Oren ensina a você os moldes navais da Canoa a Remo e do Veleiro Costeiro de Carga (`tools/boats440.js`)."
  },
  {
    "id": "primeva_q070",
    "num": 70,
    "title": "A Forja Rústica do Mato",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Encosta Norte rumo a Ymiria",
    "actors": "Kael",
    "trigger": "Concluir #069",
    "description": "Longe das capitais, um verdadeiro Artífice ergue sua própria fornalha. Você deve juntar pedras brutas, argila do rio e lenha para montar uma Forja Rústica de Acampamento e forjar uma arma com Dente de Lobo Sombrio.",
    "choicesText": "Gravar sangramento na lâmina de osso ou fundir lascas de cristal para descarga mágica.",
    "worldConsequence": "Desbloqueia todas as receitas de armas customizadas de osso, quitina e escama na Forja Rústica portátil."
  },
  {
    "id": "primeva_q071",
    "num": 71,
    "title": "O Veio Perdido de Mithril",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Cavernas de Cristal de Urdan",
    "actors": "Kael e Golem de Pedra (#031)",
    "trigger": "Alcançar Rank D",
    "description": "Para forjar as armaduras de Mithril (`models/equipment429/mithril-r0..r7.glb`), Kael precisa do minério prateado que dorme atrás de três Golens de Pedra (#031). Eles só atacam quem tira cristais perto deles.",
    "choicesText": "Atrair os Golens para fora da caverna usando barulho antes de minerar o Mithril sem matá-los, ou derrotar os três guardiões.",
    "worldConsequence": "Liberar o veio de Mithril destrava a forja de armaduras de Mithril da raridade Comum até Primeva."
  },
  {
    "id": "primeva_q072",
    "num": 72,
    "title": "A Pistola da Escama Dourada",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Platô Vulcânico de Urdan",
    "actors": "Ferreiro Dracônico e Kael",
    "trigger": "Alcançar Rank C",
    "description": "Os artífices da Ordem da Escama Dourada guardam o segredo das armas de fogo movidas a câmara de brasa: a Pistola da Escama (`firearms372.js`).",
    "choicesText": "Entregar 5 Núcleos de Fogo e vencer o teste de mira rápida contra alvos voadores no desfiladeiro vulcânico.",
    "worldConsequence": "Desbloqueia a Pistola da Escama (48 m/s, munição ilimitada e recarga reduzida pela Agilidade) para compra e aprimoramento."
  },
  {
    "id": "primeva_q073",
    "num": 73,
    "title": "A Quilha do Navio de Expedição Pesada",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Enseada Sul de Thalor",
    "actors": "Oren (Carpinteiro Naval), Ansa (Tecelã de Velas) e Carpinteiros do Clã Ferrugem",
    "trigger": "Concluir #069 e #071",
    "description": "Para enfrentar tempestades oceânicas e ancorar sobre a Fossa Abissal, você precisa construir o Navio de Expedição Pesada em 6 etapas com costado duplo de carvalho, cabrestante de ferro e velas de couro curtido.",
    "choicesText": "Equipar a cabine interna com um Cofre de Carga de 300 kg reforçado ou com uma Bancada Alquímica Marítima.",
    "worldConsequence": "Seu Navio de Expedição Pesada fica ancorado em Thalor como base móvel com cama (remove Cansaço), salvamento e baú próprio."
  },
  {
    "id": "primeva_q074",
    "num": 74,
    "title": "O Escudo que Não Deita",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Forja de Kael e Arena de Aster",
    "actors": "Kael e Brann",
    "trigger": "Concluir #073",
    "description": "Kael projeta um escudo pesado de torre que permanece cravado em pé no antebraço esquerdo (`shield473.js`). Para temperá-lo, ele precisa da carapaça frontal de um Cavaleiro Escaravelho Fendido (#072).",
    "choicesText": "Abater o Escaravelho Fendido sem usar ataques mágicos na carapaça para não trincar o bronze.",
    "worldConsequence": "Entrega o Escudo Bastião de Kael (+25% de redução extra no bloqueio e Escudada que empurra 3 metros)."
  },
  {
    "id": "primeva_q075",
    "num": 75,
    "title": "Os Nove Cajados Elementais",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Santuário de Cristal e Forja de Kael",
    "actors": "Kael e Aldric",
    "trigger": "Concluir #074",
    "description": "Kael quer unir a madeira ancestral de Verden aos núcleos de Brasa, Geada, Raiz, Centelha, Tempo e Fenda para aperfeiçoar os cajados esculpidos (`armas155/*-490.glb`).",
    "choicesText": "Sintonizar os cristais na fonte do Nexo de Aster ou diretamente nas Pedras-Âncora de Ymiria e Urdan.",
    "worldConsequence": "Sintonizar nas Pedras-Âncora concede +10% de dano elemental correspondente a todas as armas mágicas forjadas por Kael."
  },
  {
    "id": "primeva_q076",
    "num": 76,
    "title": "O Elmo de Mergulho Abissal",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Oficina Costeira de Thalor",
    "actors": "Kael e Sura, a Mergulhadora",
    "trigger": "Concluir #073",
    "description": "A pressão abaixo de 8 metros de profundidade esmaga os pulmões. Kael e Sura pedem 4 Minérios Abissais, 2 Couros de Foca-Papo-de-Sal e 2 Resinas para vedar o Elmo de Mergulho.",
    "choicesText": "Testar o elmo mergulhando até 20 metros na Fossa de Thalor para resgatar a caixa de ferramentas perdida do avô de Oren.",
    "worldConsequence": "Concede o Elmo de Mergulho (+12 metros de limite de pressão submarina permanente)."
  },
  {
    "id": "primeva_q077",
    "num": 77,
    "title": "Aço Negro de Astrid",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Forja Geotérmica de Ymiria",
    "actors": "Arquiduquesa Astrid Frostgard e Mestre Ferreiro Anão",
    "trigger": "Alcançar Rank B",
    "description": "As caldeiras geotérmicas de Ymiria estão congelando por causa de um Golem de Mana Abissal (#165) alojado nos dutos de vapor.",
    "choicesText": "Destruir o Golem sem quebrar as tubulações de bronze da forja anã.",
    "worldConsequence": "Libera o reforço seguro até +12 nas forjas de Ymiria e entrega 5 lingotes de Aço Negro."
  },
  {
    "id": "primeva_q078",
    "num": 78,
    "title": "A Maldição da Lâmina Viva",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Ruínas de Mármore a Sudeste de Aster",
    "actors": "Kael e Espectro (#046)",
    "trigger": "Concluir #077",
    "description": "Uma espada antiga encontrada num baú de mármore drena a vida de quem a empunha porque o Espectro de seu antigo dono ainda está preso ao cabo.",
    "choicesText": "Purificar a lâmina na bigorna de Kael (removendo a maldição e o Espectro) ou dominar o Espectro em duelo para manter o poder vampírico.",
    "worldConsequence": "Dominar o Espectro transforma a peça na Espada Sussurrante (3% de roubo de vida permanente); purificar entrega 20 Cristais de Rank A."
  },
  {
    "id": "primeva_q079",
    "num": 79,
    "title": "Engrenagens da Primeira Era",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Abóbada Primordial",
    "actors": "Torvo e Autômatos Antigos",
    "trigger": "Concluir #078",
    "description": "Nas galerias profundas da Abóbada, Torvo encontrou uma ponte levadiça mecânica travada desde a Primeira Ruptura.",
    "choicesText": "Forjar 4 engrenagens de bronze na Forja Rústica local e reativar o mecanismo enquanto Torvo segura a onda de Invasores (#033).",
    "worldConsequence": "Abre a Câmara do Arsenal Antigo na Abóbada Primordial e fortalece os equipamentos dos guardas do Clã Ferrugem."
  },
  {
    "id": "primeva_q080",
    "num": 80,
    "title": "A Prova do +15",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Forja de Kael, Aster",
    "actors": "Mestre Ferreiro Kael",
    "trigger": "Alcançar Rank A",
    "description": "Acima de +10, o reforço de uma peça pode falhar. Kael descobre que o coração incandescente de um Demônio Chifrudo Abissal (#158) estabiliza o metal em temperaturas extremas.",
    "choicesText": "Abater o Demônio Chifrudo Abissal no vulcão de Urdan e trazer o núcleo ainda em brasa (em menos de 5 minutos usando a Carroça da Ordem).",
    "worldConsequence": "Concede o Martelo de Brasa de Kael: suas próximas 3 tentativas de reforço acima de +10 têm 100% de chance de sucesso."
  },
  {
    "id": "primeva_q081",
    "num": 81,
    "title": "O Ouro que Não Derrete",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Covil do Dragão Ancião em Urdan",
    "actors": "Kael e Dragão Ancião (#041)",
    "trigger": "Concluir #080",
    "description": "As escamas do Dragão Ancião têm ouro ancestral fundido nas juntas que resiste ao próprio magma. Kael precisa de 3 placas dorsais para criar engastes de relíquia.",
    "choicesText": "Arrancar as placas com golpes precisos nas costas do dragão ou negociar com um ancião da Ordem da Escama Dourada.",
    "worldConsequence": "Adiciona +1 espaço extra no Cofre de Relíquias da sua casa."
  },
  {
    "id": "primeva_q082",
    "num": 82,
    "title": "A Bigorna Submersa do Primeiro Ciclo",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Ruínas Inundadas do Mar de Thalor",
    "actors": "Oren, Sura e Guardião Corrompido Abissal (#127)",
    "trigger": "Concluir #081",
    "description": "No fundo do mar de Thalor repousa a Bigorna de Coral Estelar usada pelos Primeiros Viajantes para forjar as armas que dividiram o Arquiteto.",
    "choicesText": "Amarrar os cabos do Navio de Expedição Pesada na bigorna submersa e defender o cabrestante contra um Guardião Abissal enquanto ela é içada.",
    "worldConsequence": "A Bigorna Primordial é instalada na praça de Aster ao lado de Kael."
  },
  {
    "id": "primeva_q083",
    "num": 83,
    "title": "As Oito Faces da Estrela",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Forja Primordial de Aster",
    "actors": "Kael",
    "trigger": "Alcançar Rank SS e concluir #082",
    "description": "Com a Bigorna Primordial instalada, Kael estuda as oito raridades do conjunto Estrela (`estrela-r0..r7.glb`: Comum, Raro, Épico, Lendário, Mítico, Divino, Primordial e Primeva).",
    "choicesText": "Reunir 1 cristal puro de cada um dos 5 Outros Mundos (Érebo, Xylo, Pyra, Nifl e Kemet) para acender o fogo branco da bigorna.",
    "worldConsequence": "Habilita a evolução direta de raridade de equipamentos de Rank Aço-Estrela na oficina de Kael."
  },
  {
    "id": "primeva_q084",
    "num": 84,
    "title": "O Colosso da Forja Viva",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Câmara da Fornalha na Abóbada Primordial",
    "actors": "Kael, Torvo e O que Restou da Cidade (#197)",
    "trigger": "Concluir #083",
    "description": "O que Restou da Cidade (#197) invadiu a fornalha geotérmica central da Abóbada, ameaçando derreter os pilares que sustentam o continente.",
    "choicesText": "Usar os martelos hidráulicos da fornalha ancestral para quebrar a casca de pedra do Arconte e resfriar seu núcleo com água do mar de Thalor.",
    "worldConsequence": "Salva a estrutura da Abóbada e entrega o Núcleo da Forja Viva (qualquer arma forjada por você ganha +10% de ataque base)."
  },
  {
    "id": "primeva_q085",
    "num": 85,
    "title": "Mestre Forjador do Aço Primeva",
    "category": "Facção: Artífices de Aço e Ferrugem",
    "location": "Forja de Kael, Aster",
    "actors": "Kael, Torvo e Oren",
    "trigger": "Concluir #084",
    "description": "Você realiza a obra-prima final diante de Kael: forjar uma arma ou armadura de raridade Primeva (multiplicador ×5) onde a marca do Arquiteto jamais pode penetrar.",
    "choicesText": "Gravar na lâmina o símbolo de Aster (Defesa e Escudo para aliados) ou o símbolo do Viajante Livre (Penetração e Crítico).",
    "worldConsequence": "Concede o título 'Mestre do Aço Primeva' (+10% de qualidade em todos os equipamentos equipados e forja sem falha até +12)."
  },
  {
    "id": "primeva_q086",
    "num": 86,
    "title": "O Livro Caixa Manchado",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Pavilhão do Banco de Selene, Aster",
    "actors": "Selene (Guardiã do Banco)",
    "trigger": "Depositar pelo menos 1000 de ouro no Banco",
    "description": "Selene nota uma discrepância nos tributos vindos das caravanas do sul: alguém está desviando cristais do tesouro que mantém o Domo de proteção.",
    "choicesText": "Vigiar o depósito à noite em Passo Silencioso (`Ctrl`) para flagrar o escriturário corrupto, ou interrogar os cocheiros na taverna.",
    "worldConsequence": "Flagrar em silêncio recupera 2000 de ouro para o tesouro de Aster e inicia sua entrada na Rede de Caravanas e Sombras (+1 nível de Afinidade com Selene)."
  },
  {
    "id": "primeva_q087",
    "num": 87,
    "title": "O Vulto Encapuzado da Meia-Noite",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Vielas de Aster à Noite (`vida523.js`)",
    "actors": "Selene e Vulto Encapuzado",
    "trigger": "Concluir #086",
    "description": "Ladrões noturnos estão roubando bolsas de ouro de viajantes perto da pousada e sumindo por um bueiro atrás da muralha.",
    "choicesText": "Deixar-se roubar propositalmente para seguir o Vulto Encapuzado até o esconderijo da quadrilha, ou capturá-lo na hora com a ajuda dos guardas.",
    "worldConsequence": "Seguir até o esconderijo desbarata o depósito inteiro de cargas roubadas e devolve o ouro aos moradores (+10 de Confiança em Aster)."
  },
  {
    "id": "primeva_q088",
    "num": 88,
    "title": "A Sombra sob a Lona da Carroça",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Estrada Real entre Aster e Zahar",
    "actors": "Teren, o Cocheiro da Ordem",
    "trigger": "Concluir #087",
    "description": "Teren suspeita que um passageiro disfarçado está usando a carona da Carroça da Ordem para plantar runas de atração de monstros nas pontes.",
    "choicesText": "Embarcar na carroça (`F · PEGAR CARONA`) fingindo dormir e desmascarar o sabotador quando passar pela Garganta das Cinzas.",
    "worldConsequence": "Impede emboscadas nas próximas 5 viagens de carroça e reduz a tarifa de viagem em 25%."
  },
  {
    "id": "primeva_q089",
    "num": 89,
    "title": "O Contrabando de Cristais Impuros",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Mercado de Zahar (+3400, 0)",
    "actors": "Selene e Contrabandistas do Oásis",
    "trigger": "Alcançar Rank D",
    "description": "Mercadores desonestos estão pintando cristais de Rank F com pó brilhante para vendê-los como cristais de Rank C usados na reconstrução de cidades caídas.",
    "choicesText": "Confiscar a carga falsa e entregá-la ao Emir Tariq para prisão pública, ou obrigar os contrabandistas a trabalharem como informantes de Selene.",
    "worldConsequence": "Transformá-los em informantes revela no mapa a localização de 3 baús escondidos no deserto."
  },
  {
    "id": "primeva_q090",
    "num": 90,
    "title": "O Ninho do Monkroose Ladrão",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Ruínas Altas da Floresta Sombria",
    "actors": "Selene e Monkroose (#024)",
    "trigger": "Concluir #089",
    "description": "Um bando de Monkrooses (#024) roubou a chave de prata do cofre secundário de Selene e escondeu no alto de uma ruína de mármore.",
    "choicesText": "Jogar uma moeda brilhante (`Tecla Y`) no pátio para distrair o Monkroose líder e escalar a ruína sem matar os animais, ou abater o bando.",
    "worldConsequence": "Recuperar a chave com a moeda sem matar o bando faz um Monkroose manso passar a trazer moedas perdidas na entrada da ruína."
  },
  {
    "id": "primeva_q091",
    "num": 91,
    "title": "Célula Adormecida em Ymiria",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Taverna e Porto Fluvial de Ymiria",
    "actors": "Selene e Agente de Logos",
    "trigger": "Alcançar Rank C",
    "description": "Conversas ouvidas ao passar (*eavesdropping*) na praça de Ymiria revelam que um agente de Logos planeja envenenar a ração dos Bois de Tração da Ordem.",
    "choicesText": "Trocar os frascos de veneno por água com sal sem que o agente perceba (para descobrir para quem ele trabalha), ou eliminá-lo no beco com golpe furtivo (`FURTIVO ×2`).",
    "worldConsequence": "Trocar os frascos leva você até o esconderijo do tesoureiro traidor do norte, rendendo 8000 de ouro e uma carta cifrada."
  },
  {
    "id": "primeva_q092",
    "num": 92,
    "title": "O Leilão das Máscaras Quebradas",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Porão Secreto de Solaria",
    "actors": "Selene e Colecionador Corrupto",
    "trigger": "Concluir #091",
    "description": "Relíquias roubadas dos cadáveres de batedores da Primeira Era estão sendo leiloadas clandestinamente para financiadores dos Despertadores do Ciclo.",
    "choicesText": "Entrar no leilão usando um convite falso e arrematar as relíquias com ouro do banco, ou apagar as tochas e limpar o salão nas sombras.",
    "worldConsequence": "Recupera 4 placas de identificação de soldados caídos para o memorial de Brann e +15 de Confiança."
  },
  {
    "id": "primeva_q093",
    "num": 93,
    "title": "As Duas Faces da Moeda no Mercado",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Mercado de Aster e Tenda de Dorian",
    "actors": "Selene e Lyra",
    "trigger": "Após a revelação de Dorian como Logos no Ato IX",
    "description": "Com a traição de Dorian descoberta em Thalor, Selene precisa auditar todos os caixotes que ele deixou no depósito de Aster antes que armadilhas de éter explodam no mercado.",
    "choicesText": "Desativar os 6 caixotes armadilhados em menos de 3 minutos e converter o estoque legítimo em fundo de apoio para a enfermaria de Mira.",
    "worldConsequence": "Estabiliza o Índice de Preços (IPC) de Aster em 0,85 (preços 15% mais baratos para o jogador) e mantém o Mercado funcionando com um novo intendente leal."
  },
  {
    "id": "primeva_q094",
    "num": 94,
    "title": "A Rota Fantasma da Abóbada",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Estrada Subterrânea da Abóbada Primordial",
    "actors": "Teren e Batedores da Irmandade do Véu",
    "trigger": "Concluir #093",
    "description": "Quando as estradas da superfície ficam bloqueadas por cercos de dragões, Selene quer abrir uma rota de caravanas secreta por dentro da Abóbada Primordial.",
    "choicesText": "Limpar os 3 ninhos de Esqueleto Ladino (#061) que emboscam nas sombras dos aquedutos e instalar lanternas azuis ao longo de 800 metros.",
    "worldConsequence": "Garante que o rendimento diário do Banco de Selene nunca seja interrompido mesmo se uma capital da superfície estiver sob cerco."
  },
  {
    "id": "primeva_q095",
    "num": 95,
    "title": "Contrato de Silêncio: O Inquisidor Fendido",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Ruínas do Desfiladeiro Sul",
    "actors": "Selene e Invasor Abissal (#153)",
    "trigger": "Alcançar Rank B",
    "description": "Um comandante de outro mundo que conservou parte da fala está chantageando famílias de Aster com lembranças roubadas de desaparecidos.",
    "choicesText": "Aproximar-se em Passo Silencioso sem ser detectado por nenhum vigia (< 3 metros) e executá-lo antes que ele destrua os cristais de memória.",
    "worldConsequence": "Execução perfeita sem alerta recupera os cristais de memória das famílias e concede a Adaga do Véu Silencioso."
  },
  {
    "id": "primeva_q096",
    "num": 96,
    "title": "O Roubo da Coroa do Recife",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Docas de Thalor e Naufrágio Raso",
    "actors": "Almirante Varis e Piratas Renegados",
    "trigger": "Concluir #095",
    "description": "Saqueadores marítimos roubaram o tributo naval de Thalor e afundaram o cofre dentro de um casco naufragado vigiado por Arraias-Mosaico.",
    "choicesText": "Mergulhar à noite sem lampião (usando apenas o brilho dos Camarões-Lanterna) para destrancar o cofre no fundo e içá-lo para sua Canoa.",
    "worldConsequence": "Eleva sua Afinidade com Selene ao nível 8 e libera o Cofre Reforçado de nível máximo."
  },
  {
    "id": "primeva_q097",
    "num": 97,
    "title": "A Guerra dos Preços em Zahar",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Bazar das Especiarias de Zahar",
    "actors": "Selene e Mercadores de Sal",
    "trigger": "Concluir #096",
    "description": "Um cartel de especuladores comprou todo o estoque de sal e cantis de Zahar para forçar a Saturação e cobrar o dobro dos viajantes.",
    "choicesText": "Transportar 20 lotes de Sal Grosso destilado na praia de Thalor usando o seu Carrinho de Carga para quebrar o monopólio no mercado de Zahar.",
    "worldConsequence": "Derruba o preço de suprimentos de sobrevivência em Zahar pela metade e rende 15.000 de ouro de comissão."
  },
  {
    "id": "primeva_q098",
    "num": 98,
    "title": "O Espião no Conselho Regional",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Salão do Conselho Regional (`worldsim479.js`)",
    "actors": "Selene, Lyra e Emissário Suspeito",
    "trigger": "Alcançar Rank A",
    "description": "Um dos mensageiros que leva os Editais de Governança entre as 6 capitais está alterando os números para desviar recursos das muralhas.",
    "choicesText": "Interrogar os três mensageiros cruzando os horários do relógio das estradas e os selos de cera de cada capital.",
    "worldConsequence": "Identificar o culpado correto sem acusar inocentes aumenta a velocidade de evolução autônoma de todas as 6 capitais em 20%."
  },
  {
    "id": "primeva_q099",
    "num": 99,
    "title": "A Emboscada dos Cinco Assassinos",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Ponte Noturna de Verden",
    "actors": "Esquadrão de Ninjas Fendidos (#083)",
    "trigger": "Concluir #098",
    "description": "Os remanescentes da rede de Logos colocam a cabeça de Selene e a sua a prêmio, enviando cinco Ninjas Sombrios Fendidos em ataque coordenado na neblina.",
    "choicesText": "Usar Cortina de Fumaça, Frascos de Luz ou percepção elevada para revelar os assassinos antes do bote pelas costas.",
    "worldConsequence": "Sobreviver sem usar poções de cura rende o Manto das Sombras de Aster (+10% velocidade em Passo Silencioso)."
  },
  {
    "id": "primeva_q100",
    "num": 100,
    "title": "O Cofre do Primeiro Banco",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Ruínas Subterrâneas sob Aster",
    "actors": "Selene",
    "trigger": "Concluir #099",
    "description": "Durante a expansão da Terceira Muralha (Maria), escavadores encontraram a abóbada de ferro do banco original erguido logo após a Primeira Ruptura, guardada por um Guardião Corrompido (#007) imune a suborno.",
    "choicesText": "Decifrar a combinação de 4 alavancas baseada nas datas dos Três Relatos Ancestrais ou enfrentar o mecanismo de defesa completo.",
    "worldConsequence": "Abre o Cofre Ancestral sob Aster, elevando o teto diário de juros de Selene de 200 para 500 de ouro por dia."
  },
  {
    "id": "primeva_q101",
    "num": 101,
    "title": "Resgate na Caravana Congelada",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Passo Boreal de Ymiria",
    "actors": "Teren, Maela (a Tratadora) e Lobo Fendido (#063)",
    "trigger": "Concluir #100",
    "description": "Uma nevasca repentina prendeu duas Carroças da Ordem no Passo Boreal. Os Bois de Tração estão congelando e uma matilha de Lobos Fendidos fechou o cerco.",
    "choicesText": "Montar duas fogueiras ao lado dos bois e alimentá-los com a ração térmica de Maela enquanto segura as 4 ondas da matilha.",
    "worldConsequence": "Salva os Bois de Tração e faz com que a carona na Carroça da Ordem recupere o dobro de Vida e Mana por segundo."
  },
  {
    "id": "primeva_q102",
    "num": 102,
    "title": "A Sombra da Rainha Aranha",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Caverna das Teias Prateadas (Floresta Sombria)",
    "actors": "Selene e A Mãe do Ninho (#195)",
    "trigger": "Alcançar Rank S",
    "description": "As caravanas de seda e tecidos resistentes à mana estão desaparecendo na Floresta Sombria, arrastadas para o covil da Mãe do Ninho (#195).",
    "choicesText": "Queimar os casulos de ovos de cristal da coroa da Mãe do Ninho para libertar os mercadores vivos antes de abater a matriarca.",
    "worldConsequence": "Libertar todos os mercadores vivos inaugura a Rota da Seda de Mana entre os Campos Floridos e Aster (+10% renda diária de Aster)."
  },
  {
    "id": "primeva_q103",
    "num": 103,
    "title": "O Falso Exército de Servos",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Fenda de Espelhos em Érebo",
    "actors": "Selene e O Rei Oco (#192)",
    "trigger": "Concluir #102",
    "description": "O Rei Oco (#192) — uma coroa e manto flutuando sobre o vazio — está falsificando insígnias da Ordem da Fenda para atrair companhias inteiras de caçadores para emboscadas.",
    "choicesText": "Enfrentar O Rei Oco desviando de sua Chuva de Almas (que inverte o movimento por 3 segundos após breve aviso) e partir seu selo real.",
    "worldConsequence": "Entrega o Selo Inviolável da Ordem e +1500 de Reputação."
  },
  {
    "id": "primeva_q104",
    "num": 104,
    "title": "A Noite dos Cofres Abertos",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Todas as 5 Capitais",
    "actors": "Selene e Governantes das Capitais",
    "trigger": "Concluir #103",
    "description": "Uma crise continental exige que você transporte em uma única jornada pelo continente (usando Carroça, Veleiro e atalhos da Abóbada) as reservas de emergência de Aster para evitar o colapso simultâneo dos Domos de Ymiria, Zahar e Thalor.",
    "choicesText": "Completar a rota das 3 capitais sem morrer e sem perder nenhum fardo do Carrinho de Carga.",
    "worldConsequence": "Todas as capitais atingem Confiança 100 (Grau Herói Local: pousada grátis, vendas sem imposto de 8% e batedores marcando Fendas raras)."
  },
  {
    "id": "primeva_q105",
    "num": 105,
    "title": "Guardião das Chaves de Prata",
    "category": "Facção: Rede de Caravanas e Sombras",
    "location": "Pavilhão do Banco de Selene, Aster",
    "actors": "Selene, Teren e Lyra",
    "trigger": "Concluir #104",
    "description": "Selene entrega a você a Segunda Chave de Prata do Tesouro de Aster, tornando-o sócio-protetor de toda a rede comercial e de inteligência de Primeva.",
    "choicesText": "Investir o fundo soberano no fortalecimento militar dos Domos ou na expansão das feiras livres das 19 vilas.",
    "worldConsequence": "Concede o título 'Mestre das Chaves e Sombras' (+10% ouro em todas as vendas, 0% de perda de ouro ao morrer e acesso ao mercado secreto de relíquias)."
  },
  {
    "id": "primeva_q106",
    "num": 106,
    "title": "A Panela de Ferro de Ossa",
    "category": "Clã: Clã Ferrugem (Goblins Base)",
    "location": "Posto de Estrada Sul",
    "actors": "Ossa (Goblin Vigia) e Torvo",
    "trigger": "Conversar pacíficamente no posto do Clã Ferrugem",
    "description": "Ossa explica que os Goblins Escudeiros (#049) e Guerreiros (#048) do posto estão dividindo a própria comida com refugiados humanos, mas um bando de Goblins Brutos Fendidos (#116) roubou o caldeirão comunitário.",
    "choicesText": "Recuperar o caldeirão e cozinhar 5 porções de Carne Assada na fogueira do posto para o bando de Ossa.",
    "worldConsequence": "Todos os postos do Clã Ferrugem nas estradas passam a oferecer sopa quente gratuita (+10% Vida máxima temporária)."
  },
  {
    "id": "primeva_q107",
    "num": 107,
    "title": "Osfungos do Xamã Ferrugem",
    "category": "Clã: Clã Ferrugem (Goblins Base)",
    "location": "Bosque Central",
    "actors": "Goblin Xamã Base (#051) e Torvo",
    "trigger": "Concluir #106",
    "description": "O velho Xamã do Clã Ferrugem reconheceu o próprio irmão entre os Goblins Xamãs Fendidos (#115) que saíram de uma ruptura.",
    "choicesText": "Capturar o Xamã Fendido vivo com uma Armadilha de Laço reforçada para tentar o ritual de purificação de Kael, ou dar-lhe um fim rápido e honrado.",
    "worldConsequence": "Tentar o ritual limpa a marca externa (embora deixe a cicatriz) e o Xamã agradece ensinando o totem de regeneração de mana nos postos."
  },
  {
    "id": "primeva_q108",
    "num": 108,
    "title": "A Porta do Mundo Recolhido",
    "category": "Clã: Clã Ferrugem (Goblins Base)",
    "location": "Ruína da Fronteira Oeste",
    "actors": "Torvo",
    "trigger": "Concluir #107 e Ato VIII",
    "description": "Torvo descobre em uma Fenda antiga um batente de pedra do mundo de onde seu povo fugiu há cem anos — o único lugar onde sua 'chave sem porta' finalmente encaixa.",
    "choicesText": "Girar a chave ao lado de Torvo para resgatar as sementes das árvores natais do povo goblin antes que a memória se apague.",
    "worldConsequence": "Árvores de folhas douradas do mundo antigo de Torvo passam a crescer ao redor dos acampamentos do Clã Ferrugem."
  },
  {
    "id": "primeva_q109",
    "num": 109,
    "title": "O Sangue nos Nós dos Dedos",
    "category": "Clã: Clã Quebra-Rocha (Orcs Base)",
    "location": "Acampamento Tribal nas Colinas",
    "actors": "Chefe Orc Quebra-Rocha (#056)",
    "trigger": "Aproximar-se respeitosamente do totem Orc sem atacar",
    "description": "O Clã Quebra-Rocha vive pelo código da força. O líder propõe um Duelo de Honra 1 contra 1: levar o oponente a 20% da vida e parar o golpe quando ele se ajoelhar.",
    "choicesText": "Parar o ataque imediatamente aos 20% de vida e apertar `F · ACEITAR RENDIÇÃO`, ou continuar batendo até matar.",
    "worldConsequence": "Respeitar a rendição abre o comércio tribal do Clã Quebra-Rocha e concede o bônus físico de +10% de ataque corpo a corpo por 300 segundos; bater após a rendição marca você como Desonrado."
  },
  {
    "id": "primeva_q110",
    "num": 110,
    "title": "A Bravata do Orc Pequeno",
    "category": "Clã: Clã Quebra-Rocha (Orcs Base)",
    "location": "Encosta Rochosa do Sul",
    "actors": "Orc Pequeno Base (#010) chamado Grak",
    "trigger": "Concluir #109",
    "description": "Um Orc Pequeno (#010) roubou um pedaço de carne assada e correu para dentro de um covil de Raptores (#059) para impressionar os adultos, mas ficou sozinho e entrou em pânico.",
    "choicesText": "Salvar Grak sem matar os Raptores à vista dos outros orcs (para que o jovem dê o golpe final e não perca a honra), ou limpar o covil sozinho.",
    "worldConsequence": "Ajudar Grak a dar o golpe final faz dele seu escudeiro voluntário nos arredores das colinas."
  },
  {
    "id": "primeva_q111",
    "num": 111,
    "title": "O Chifre Partilhado",
    "category": "Clã: Clã Quebra-Rocha (Orcs Base)",
    "location": "Platô da Montanha",
    "actors": "Ancião Quebra-Rocha e Orc Abissal (#180)",
    "trigger": "Concluir #110",
    "description": "O antigo campeão do clã atravessou uma Fenda profunda e voltou como um Orc Abissal (#180) tomado pelo vazio, atacando a própria tribo.",
    "choicesText": "Vencer o campeão Abissal usando apenas armas corpo a corpo (sem magias) em respeito à tradição do clã.",
    "worldConsequence": "O Clã Quebra-Rocha entalha seu nome no Totem de Pedra (+5 Força permanente por treino)."
  },
  {
    "id": "primeva_q112",
    "num": 112,
    "title": "Lanças de Osso na Margem Escura",
    "category": "Clã: Vigias da Lagoa Sagrada",
    "location": "Lagoa Profunda do Pântano",
    "actors": "Ancião Homem-Peixe (#027)",
    "trigger": "Guardar a arma na margem do lago sagrado",
    "description": "Os Vigias da Lagoa Sagrada dialogam com quem não profana suas águas. Uma Gosma Espinhosa Fendida (#070) se alojou na nascente, disparando cristais que envenenam os girinos.",
    "choicesText": "Mergulhar na nascente sem usar frascos de veneno ou ácido (para não contaminar a água) e remover a Gosma na lâmina limpa.",
    "worldConsequence": "Os Vigias concedem a Bênção das Brânquias (+10 segundos de Fôlego máximo debaixo d'água)."
  },
  {
    "id": "primeva_q113",
    "num": 113,
    "title": "A Marcha da Chuva Noturna",
    "category": "Clã: Vigias da Lagoa Sagrada",
    "location": "Trilha Alagada de Verden",
    "actors": "Bando de Peixes Andantes Base (#014)",
    "trigger": "Iniciar durante uma noite de chuva (`rain387.js`)",
    "description": "Nas noites de chuva, os Peixes Andantes (#014) saem da água em bando para migrar até a lagoa alta, mas caçadores ilegais armaram redes na estrada.",
    "choicesText": "Cortar as 5 redes de caça furtiva e escoltar o bando lento pelas pedras secas até o novo lago.",
    "worldConsequence": "Sempre que chover em Primeva, Peixes Andantes amigáveis apontam poças com pérolas e peixes raros nas margens."
  },
  {
    "id": "primeva_q114",
    "num": 114,
    "title": "O Ídolo Afogado da Nascente",
    "category": "Clã: Vigias da Lagoa Sagrada",
    "location": "Fenda Submersa do Lago",
    "actors": "Homem-Peixe Guerreiro (#027) e Homem-Peixe Abissal (#149)",
    "trigger": "Concluir #112 e #113",
    "description": "Um grupo de Homens-Peixe corrompidos pelo Abismo roubou a Estátua da Maré Calma do fundo da lagoa.",
    "choicesText": "Recuperar o ídolo no fundo escuro e devolvê-lo ao altar submerso antes que o fôlego acabe.",
    "worldConsequence": "Desbloqueia lanças de osso encantadas com penetração aquática nos acampamentos dos Vigias."
  },
  {
    "id": "primeva_q115",
    "num": 115,
    "title": "O Tronco do Campeão",
    "category": "Clã: Confraria do Brejo (Sapos Guerreiros Base)",
    "location": "Ilhota Central do Pântano",
    "actors": "Mestre Sapo Guerreiro (#020)",
    "trigger": "Conversar no acampamento da Confraria do Brejo",
    "description": "Os Sapos Guerreiros (#020) disputam o melhor tronco caído do brejo em duelos limpos de escudo de casca. Eles convidam você para o torneio.",
    "choicesText": "Vencer três Sapos Guerreiros em sequência aceitando a rendição de cada um aos 15% de vida (`F · ACEITAR RENDIÇÃO`).",
    "worldConsequence": "A Confraria do Brejo reconhece você como Irmão de Casca: a lentidão natural do bioma de Pântano cai de 10% para 5% permanentemente."
  },
  {
    "id": "primeva_q116",
    "num": 116,
    "title": "O Segredo das Ervas do Lodo",
    "category": "Clã: Confraria do Brejo (Sapos Guerreiros Base)",
    "location": "Raízes Ocas de Verden",
    "actors": "Herbalista Sapo Base e Aranha Gigante (#054)",
    "trigger": "Concluir #115",
    "description": "As Aranhas Gigantes (#054) fecharam com teias grossas a clareira onde a Confraria colhe o lodo curativo que fecha feridas de ácido.",
    "choicesText": "Olhar para as copas antes de avançar, cortar os fios de captura e limpar a clareira sem pisar nos brotos verdes.",
    "worldConsequence": "Abre a troca de Unguentos do Pântano (anula penalidade do bioma por 5 minutos) por metade do preço nos totens da Confraria."
  },
  {
    "id": "primeva_q117",
    "num": 117,
    "title": "A Guarda Real do Sapo Rei",
    "category": "Clã: Confraria do Brejo (Sapos Guerreiros Base)",
    "location": "Santuário da 5ª Pedra-Âncora em Verden",
    "actors": "Sapo Rei e Confraria do Brejo",
    "trigger": "Concluir #116 e ter poupado o Sapo Rei no Ato X",
    "description": "Um bando de Sapos Guerreiros Abissais (#142) tenta assassinar o Sapo Rei depois que ele se aliou a Aster.",
    "choicesText": "Defender o trono de raízes ao lado de quatro Sapos Guerreiros Base usando escudos de casca.",
    "worldConsequence": "Concede o Escudo de Casca Anciã (regenera 2% do escudo por segundo quando você está na água ou na chuva)."
  },
  {
    "id": "primeva_q118",
    "num": 118,
    "title": "A Prova da Chama Antiga",
    "category": "Clã: Ordem da Escama Dourada",
    "location": "Picos Rochosos de Urdan",
    "actors": "Ancião Dracônico (#060) e Dragonete Base (#040)",
    "trigger": "Alcançar Rank B e visitar o posto Dracônico",
    "description": "Os Dracônicos (#060) lembram eras anteriores às Fendas e só negociam com quem suporta o calor de sua linhagem. Um Dragonete jovem (#040) desafia você para o teste do sopro.",
    "choicesText": "Esquivar lateralmente de três sopros de fogo sem sair do círculo de basalto e depois vencer o duelo de honra.",
    "worldConsequence": "Libera o comércio de relíquias de fogo e metal e o acesso à forja dracônica nos platôs vulcânicos."
  },
  {
    "id": "primeva_q119",
    "num": 119,
    "title": "O Ouro Derretido dos Ancestrais",
    "category": "Clã: Ordem da Escama Dourada",
    "location": "Ruína Vulcânica do Sul",
    "actors": "Guerreiro Dracônico Base e Diabretes (#035)",
    "trigger": "Concluir #118",
    "description": "Um bando de Diabretes (#035) está roubando o ouro derretido sagrado com que os Dracônicos alimentam suas gargantas metálicas e chamando Demônios maiores (#047).",
    "choicesText": "Abater os Diabretes antes que completem o chamado dos Demônios e devolver o ouro intacto ao altar dracônico.",
    "worldConsequence": "Concede +10% de resistência ao dano de fogo e de lava em todo o bioma de Vulcão."
  },
  {
    "id": "primeva_q120",
    "num": 120,
    "title": "Sangue do Dragão do Caos",
    "category": "Clã: Ordem da Escama Dourada",
    "location": "Fenda Vulcânica Profunda",
    "actors": "Ordem da Escama Dourada e A Fera dos Quatro Céus (#194)",
    "trigger": "Concluir #119",
    "description": "Um príncipe da Ordem da Escama Dourada foi corrompido pelos quatro elementos do vazio, tornando-se uma projeção de Kaelthys.",
    "choicesText": "Recuperar o medalhão da família dracônica no peito da fera e devolvê-lo ao clã.",
    "worldConsequence": "Os Dracônicos passam a enviar um Dragonete aliado para ajudar você durante cercos em Urdan."
  },
  {
    "id": "primeva_q121",
    "num": 121,
    "title": "O Filhote Perdido na Nevasca",
    "category": "Clã: Povo do Manto Branco (Yetis Base)",
    "location": "Floresta de Neve de Ymiria",
    "actors": "Yeti Adulto Base (#057) e Filhote de Yeti (#013)",
    "trigger": "Aproximar-se sem arma sacada do Filhote de Yeti",
    "description": "Um Filhote de Yeti (#013) caiu num barranco gelado perto da estrada e está cercado por Lobos Fendidos. O pai Yeti observa do alto da encosta, pronto para entrar em fúria se você ferir o pequeno.",
    "choicesText": "Abater os Lobos Fendidos usando apenas golpes precisos longe do filhote e deixar 2 peixes do gelo no chão antes de recuar.",
    "worldConsequence": "O Povo do Manto Branco passa a soprar um rugido grave sempre que uma avalanche ou Fenda oculta estiver a menos de 200 metros na neve."
  },
  {
    "id": "primeva_q122",
    "num": 122,
    "title": "O Abrigo da Caverna Glacial",
    "category": "Clã: Povo do Manto Branco (Yetis Base)",
    "location": "Caverna de Gelo a Oeste de Ymiria",
    "actors": "Família Yeti Base",
    "trigger": "Concluir #121",
    "description": "Uma tempestade polar apaga as fogueiras externas. A família de Yetis que você ajudou abre espaço na caverna aquecida deles, mas um Yeti Abissal (#181) tenta invadir a entrada.",
    "choicesText": "Defender a boca da caverna ao lado do Yeti adulto para proteger os três filhotes lá dentro.",
    "worldConsequence": "Todas as cavernas do Povo do Manto Branco tornam-se abrigos seguros onde você pode descansar sem gastar lenha."
  },
  {
    "id": "primeva_q123",
    "num": 123,
    "title": "Liquens do Pico Eterno",
    "category": "Clã: Povo do Manto Branco (Yetis Base)",
    "location": "Cordilheira do Gelo Eterno (-4200, 0)",
    "actors": "Patriarca do Manto Branco",
    "trigger": "Concluir #122",
    "description": "O patriarca Yeti está velho e ferido por estilhaços de cristal. Ele precisa do Líquen Dourado que cresce a 35 metros de altura no paredão de gelo.",
    "choicesText": "Escalar o paredão de gelo gerenciando a Estamina (`climb383.js`) e alimentar o patriarca.",
    "worldConsequence": "Entrega a Capa do Manto Branco (anula permanentemente a redução de 12% de movimento e 20% de mana na Neve)."
  },
  {
    "id": "primeva_q124",
    "num": 124,
    "title": "Duas Sombras no Bambuzal",
    "category": "Clã: Irmandade do Véu (Ninjas Base)",
    "location": "Ruína Oculta da Floresta Fechada",
    "actors": "Mestre Ninja Sombrio (#025) e Ninja Mirim (#011)",
    "trigger": "Aproximar-se sem interromper o treino da dupla",
    "description": "A Irmandade do Véu vive de pílulas de ervas e água e conversa em códigos curtos. Dois aprendizes Ninjas Mirins (#011) propõem um desafio de velocidade e furtividade.",
    "choicesText": "Alcançar o sino no topo da ruína em menos de 40 segundos usando esquivas e Passo Silencioso sem tocar nos fios de alarme.",
    "worldConsequence": "Abre a loja secreta da Irmandade do Véu: venda de mapas de portais raros e atalhos subterrâneos."
  },
  {
    "id": "primeva_q125",
    "num": 125,
    "title": "A Receita das Pílulas de Vento",
    "category": "Clã: Irmandade do Véu (Ninjas Base)",
    "location": "Acampamento Asceta do Véu",
    "actors": "Mestre do Véu",
    "trigger": "Concluir #124",
    "description": "Os Ninjas Sombrios sobrevivem semanas em missão com uma única pílula concentrada de arroz seco, frutas e ervas. O suprimento deles foi roubado por Ninja Sombrio Fendido (#083).",
    "choicesText": "Recuperar as bolsas de arroz sem ser atingido por nenhum golpe furtivo nas costas.",
    "worldConsequence": "Ensina a receita da Pílula do Véu na Bancada de Campo (restaura 50% da Fome com peso quase zero)."
  },
  {
    "id": "primeva_q126",
    "num": 126,
    "title": "O Contrato do Traidor Silencioso",
    "category": "Clã: Irmandade do Véu (Ninjas Base)",
    "location": "Bosque Noturno de Verden",
    "actors": "Irmandade do Véu e Ninja Sombrio Abissal (#147)",
    "trigger": "Concluir #125",
    "description": "Um antigo mestre da Irmandade entregou os códigos do clã para o outro lado da Fenda e agora caça seus ex-discípulos.",
    "choicesText": "Derrotar o mestre Abissal aguardando o exato instante do seu reaparecimento após o teleporte sombrio.",
    "worldConsequence": "Concede +10% de dano em todos os golpes desferidos com `FURTIVO ×2`."
  },
  {
    "id": "primeva_q127",
    "num": 127,
    "title": "Não Pise nas Sombras",
    "category": "Clã: Círculo do Micélio (Cogumelos Base)",
    "location": "Clareira Úmida da Floresta Antiga",
    "actors": "Rei Cogumelo Base (#039) e Cogumelinhos (#003)",
    "trigger": "Caminhar pela borda iluminada da clareira sem pisar nas sombras dos cogumelos",
    "description": "O Círculo do Micélio é uma colônia consciente que nutre a floresta. Eles se comunicam por pulsos de esporos quando você respeita seu espaço e pedem que você remova 4 pedras contaminadas por miasma que estão secando a umidade da clareira.",
    "choicesText": "Quebrar e retirar as pedras contaminadas sem pisar na sombra de nenhum Cogumelo Furioso (#019) da guarda real.",
    "worldConsequence": "O Círculo do Micélio passa a fornecer gratuitamente Esporos Curativos e ingredientes raros de poções a cada visita."
  },
  {
    "id": "primeva_q128",
    "num": 128,
    "title": "O Sono dos Lenhadores",
    "category": "Clã: Círculo do Micélio (Cogumelos Base)",
    "location": "Borda da Floresta de Aster",
    "actors": "Rei Cogumelo Base e Lenhadores de Aster",
    "trigger": "Concluir #127",
    "description": "Lenhadores desavisados encurralaram um grupo de Cogumelinhos (#003) e caíram todos no sono profundo dos esporos defensivos. Os guardas de Aster querem queimar a clareira achando que foi um ataque monstro.",
    "choicesText": "Acordar os lenhadores com água fria, explicar a Brann o comportamento pacífico dos Cogumelinhos e demarcar a fronteira de corte de lenha.",
    "worldConsequence": "Impede o massacre da colônia, ganha +5 de Confiança em Aster e garante que os tocos cortados perto da floresta rebrotem na metade do tempo."
  },
  {
    "id": "primeva_q129",
    "num": 129,
    "title": "A Raiz Podre do Abismo",
    "category": "Clã: Círculo do Micélio (Cogumelos Base)",
    "location": "Coração Subterrâneo da Floresta",
    "actors": "Rei Cogumelo Base (#039) e Rei Cogumelo Abissal (#161)",
    "trigger": "Concluir #128",
    "description": "Um Rei Cogumelo Abissal está sugando a seiva da Árvore-Mãe pela rede de micélio subterrânea.",
    "choicesText": "Descer às raízes e cortar a ligação abissal enquanto os Cogumelinhos Base iluminam o caminho com esporos dourados.",
    "worldConsequence": "Concede a Relíquia Raiz Anciã (+8% de vida máxima permanente)."
  },
  {
    "id": "primeva_q130",
    "num": 130,
    "title": "O Enigma dos Três Totens",
    "category": "Clã: Conclave das Duas Faces (Máscaras Tribais Base)",
    "location": "Círculo de Pedra no Interior Selvagem",
    "actors": "Guardião de Máscara Tribal Base (#036)",
    "trigger": "Parar fora do círculo de pedra e aguardar o fim da dança ritual",
    "description": "O Conclave das Duas Faces mantém danças antigas para impedir que a crosta de Primeva rache. A Máscara flutua até você e faz três perguntas em enigma sobre o Arquiteto, o Narrador e as Cinco Âncoras.",
    "choicesText": "Responder corretamente ('Cinco prisões e um nexo', 'Aquele que quebrou o primeiro selo', 'A matéria que lembra antes da marca') ou tentar forçar a entrada no círculo.",
    "worldConsequence": "Responder com sabedoria concede a Bênção das Duas Faces (-15% de dano mágico recebido por 300 segundos, renovável em qualquer círculo tribal)."
  },
  {
    "id": "primeva_q131",
    "num": 131,
    "title": "A Madeira que Guarda a Fé",
    "category": "Clã: Conclave das Duas Faces (Máscaras Tribais Base)",
    "location": "Totens Quebrados da Fronteira Sul",
    "actors": "Xamã do Conclave e Máscara Tribal Fendida (#094)",
    "trigger": "Concluir #130",
    "description": "Uma tempestade de Fenda rachou dois totens de contenção e corrompeu uma das máscaras ancestrais.",
    "choicesText": "Entalhar dois novos totens com Madeira Trabalhada e Resina e devolver a máscara caída ao fogo sagrado.",
    "worldConsequence": "Reduz em 30% a frequência de abertura de Fendas Vermelhas perto das estradas daquela região."
  },
  {
    "id": "primeva_q132",
    "num": 132,
    "title": "A Dança Contra a Fissura",
    "category": "Clã: Conclave das Duas Faces (Máscaras Tribais Base)",
    "location": "Grande Círculo Monolítico",
    "actors": "Três Máscaras Tribais Base",
    "trigger": "Concluir #131",
    "description": "O chão dentro do círculo começa a rachar para abrir uma Fenda Invasora. As três Máscaras precisam dançar por 60 segundos sem serem interrompidas para costurar a terra de volta.",
    "choicesText": "Defender o perímetro externo do círculo por 60 segundos impedindo que qualquer monstro pise dentro das pedras rituais.",
    "worldConsequence": "Fecha a fissura sem abrir masmorra e concede +3 pontos de Espírito e Vontade por treino."
  },
  {
    "id": "primeva_q133",
    "num": 133,
    "title": "Não Encare a Alpaca Real",
    "category": "Clã: Pastores do Velo Dourado",
    "location": "Acampamento Móvel dos Campos Floridos",
    "actors": "Pastor Ancião e Rebanho de Alpacas Reais (#028)",
    "trigger": "Conversar com os tratadores nos Campos Floridos",
    "description": "Três Pássaros Bravos Fendidos (#068) estão mergulhando pelos flancos para assustar o rebanho de Alpacas Reais (#028). Se você encarar as alpacas de frente durante a luta, elas cospem e fogem.",
    "choicesText": "Abater os Pássaros Bravos quando eles recuperarem altitude após o mergulho lateral, mantendo-se sempre de costas para o rebanho.",
    "worldConsequence": "Os Pastores entregam 3 novelos de Lã Dourada resistentes à mana e abrem o escambo de mantimentos."
  },
  {
    "id": "primeva_q134",
    "num": 134,
    "title": "A Passagem da Alpaca Imperial",
    "category": "Clã: Pastores do Velo Dourado",
    "location": "Vale das Flores Raras",
    "actors": "Tratadora Nômade e Alpaca Imperial (#037)",
    "trigger": "Concluir #133",
    "description": "A rara Alpaca Imperial (#037) de crina em coroa precisa pastar nas flores azuis que só abrem ao meio-dia, mas uma Abelha Rainha Blindada (#029) tomou a colina com seu enxame.",
    "choicesText": "Afastar a Abelha Rainha das demais abelhas blindadas para quebrar o zumbido de comando e limpar a colina antes do meio-dia.",
    "worldConsequence": "A Alpaca Imperial deixa cair o Velo Imperial, que Kael costura como forro interno da sua armadura (+5% defesa mágica)."
  },
  {
    "id": "primeva_q135",
    "num": 135,
    "title": "O Rebanho Roubado na Neblina",
    "category": "Clã: Pastores do Velo Dourado",
    "location": "Ponte do Rio Florido",
    "actors": "Pastores do Velo Dourado e Bandidos Renegados",
    "trigger": "Concluir #134",
    "description": "Contrabandistas cercaram duas Alpacas Reais para tosquiar a lã à força e vendê-la em Solaria.",
    "choicesText": "Libertar os animais sem usar ataques em área de fogo que queimem a pelagem dourada.",
    "worldConsequence": "Garante descontos permanentes em todas as tendas dos Pastores do Velo Dourado pelo continente."
  },
  {
    "id": "primeva_q136",
    "num": 136,
    "title": "Um Lugar Junto às Brasas",
    "category": "Clã: Companhias da Fogueira",
    "location": "Fogueira de Aventureiros na Floresta",
    "actors": "Companhia da Fogueira (3 Rasgados)",
    "trigger": "Sentar-se junto a uma Companhia da Fogueira à noite",
    "description": "Três Rasgados que caíram em Primeva meses antes de você estão sem lenha e com um membro envenenado por Aranha Gigante.",
    "choicesText": "Dividir 2 Feixes de Lenha e 1 Antídoto do seu cantil com o grupo.",
    "worldConsequence": "Eles curam 100% da sua Vida e Estamina, marcam 2 Alvos Notórios/covis no seu mapa e passam a aparecer como aliados contratáveis gratuitamente na próxima masmorra."
  },
  {
    "id": "primeva_q137",
    "num": 137,
    "title": "Os Objetos de Outro Mundo",
    "category": "Clã: Companhias da Fogueira",
    "location": "Acampamentos de Fogueira no Deserto, Neve e Vulcão",
    "actors": "Três Companhias da Fogueira distintas",
    "trigger": "Concluir #136",
    "description": "Cada Rasgado guarda no bolso um pequeno objeto sem valor de combate que tinha na mão quando o céu do seu mundo rachou: um relógio parado, uma chave de apartamento e um anel de formatura.",
    "choicesText": "Reunir as histórias dos três acampamentos para Lyra registrar no Livro de Memórias dos Mundos Perdidos.",
    "worldConsequence": "Desbloqueia +1 nível na passiva Rasgado sem gastar ponto de habilidade."
  },
  {
    "id": "primeva_q138",
    "num": 138,
    "title": "A Última Expedição da Companhia Cinza",
    "category": "Clã: Companhias da Fogueira",
    "location": "Fenda Vermelha de Pyra",
    "actors": "Sobrevivente da Companhia Cinza e O Último Portão (#188)",
    "trigger": "Concluir #137",
    "description": "Uma companhia inteira ficou presa dentro de um Portal Vermelho de Pyra. Apenas um arqueiro ferido aguarda perto da entrada trancada.",
    "choicesText": "Dividir suas Rações de Expedição com o arqueiro, curá-lo e avançar juntos para derrotar o Último Portão (#188) e destrancar a saída.",
    "worldConsequence": "A Companhia Cinza se estabelece em Aster e passa a defender os portões durante qualquer cerco."
  },
  {
    "id": "primeva_q139",
    "num": 139,
    "title": "O Conselho das Seis Regiões",
    "category": "Política & Capitais",
    "location": "Salão do Conselho Regional (`worldsim479.js`), Aster",
    "actors": "Brann, Lyra e Emissários das 5 Capitais",
    "trigger": "Abrir o painel do Conselho Regional pela primeira vez",
    "description": "Enquanto os Guardiões das Âncoras (leais a Aster) lutam para manter os 5 pilares trancados, panfletos dos Despertadores do Ciclo (seguidores da tese de Logos) começam a aparecer nas praças afirmando que as Âncoras são uma jaula cósmica.",
    "choicesText": "Apoiar o Edital de Vigilância Militar de Brann (foco em muralhas e guardas) ou o Edital de Liberdade de Pesquisa de Solaria (foco em estudar a energia das Âncoras).",
    "worldConsequence": "Define sua inclinação inicial na política continental, alterando diálogos de guardas e governantes."
  },
  {
    "id": "primeva_q140",
    "num": 140,
    "title": "Edital de Aster: A Terceira Muralha",
    "category": "Política & Capitais",
    "location": "Fortaleza de Aster (0, 0)",
    "actors": "Brann, Lyra e Selene",
    "trigger": "Aster alcançar Nível Municipal 5",
    "description": "Para erguer a Muralha Rose (85m) e a Muralha Maria (115m) com a Catedral de Pedra, Aster precisa de 40 Cristais, 15 Núcleos e segurança para os pedreiros.",
    "choicesText": "Financiar a obra pelo Conselho Regional (`WorldSim479.playerContribute`) e proteger o comboio de mármore contra os Despertadores.",
    "worldConsequence": "Aster evolui fisicamente no mapa 3D com novos bairros, moinhos, serraria e catedral iluminada."
  },
  {
    "id": "primeva_q141",
    "num": 141,
    "title": "O Gelo Dividido de Ymiria",
    "category": "Política & Capitais",
    "location": "Capital de Ymiria (0, -3400)",
    "actors": "Arquiduquesa Astrid Frostgard vs. Jarl Dissidente",
    "trigger": "Concluir #139",
    "description": "Em Ymiria, metade dos clãs nórdicos culpa a Pedra-Âncora pelo inverno eterno que congela as colheitas e quer afrouxar as correntes para aquecer os fiordes.",
    "choicesText": "Apoiar a Arquiduquesa Astrid reforçando as correntes rúnicas e construindo Caldeiras Geotérmicas para o povo, ou permitir que o Jarl drene parte do calor da Âncora.",
    "worldConsequence": "Construir as Caldeiras mantém a Âncora 100% segura e aquece as ruas de Ymiria; drenar a Âncora reduz o frio no bioma norte em 50%, mas dobra a chance de Fendas glaciais."
  },
  {
    "id": "primeva_q142",
    "num": 142,
    "title": "O Motim da Mina de Geada",
    "category": "Política & Capitais",
    "location": "Mina Externa de Ymiria",
    "actors": "Arquiduquesa Astrid e Mineiros Anões",
    "trigger": "Concluir #141",
    "description": "Agentes Despertadores convenceram os mineiros de Ymiria a parar a extração de cristais para o Domo da capital.",
    "choicesText": "Negociar melhores pagamentos usando o tesouro municipal de Ymiria ou substituir a guarda da mina por soldados da Vanguarda.",
    "worldConsequence": "Negociar eleva a Confiança de Ymiria em +15 e aumenta a produção autônoma de pontos de construção (`buildPoints`) da cidade."
  },
  {
    "id": "primeva_q143",
    "num": 143,
    "title": "O Sangue de Gelo nas Ruas à Meia-Noite",
    "category": "Política & Capitais",
    "location": "Vielas de Ymiria (Meia-Noite)",
    "actors": "Guarda de Ymiria e Assassino Despertador",
    "trigger": "Entrar em Ymiria entre 22:00 e 02:00",
    "description": "Inspirada em *Blood on the Ice*: você encontra marcas de sangue recente na neve perto da pousada de Ymiria. Um conselheiro da Arquiduquesa foi atacado e os guardas estão acusando um mendigo inocente.",
    "choicesText": "Seguir as pegadas de geada derretida até a casa vazia ao lado da forja e desmascarar o verdadeiro assassino antes que o mendigo seja preso.",
    "worldConsequence": "Salva o mendigo (que passa a lhe dar dicas de tesouros no norte) e impede o assassinato da Arquiduquesa Astrid."
  },
  {
    "id": "primeva_q144",
    "num": 144,
    "title": "As Águas Contadas de Zahar",
    "category": "Política & Capitais",
    "location": "Capital de Zahar (+3400, 0)",
    "actors": "Emir Tariq ibn Nadir vs. Sacerdotes do Sol Partido",
    "trigger": "Visitar o Conselho Regional de Zahar",
    "description": "Os Sacerdotes do Sol Partido pregam que se a 2ª Pedra-Âncora for desligada, os rios antigos do deserto voltarão a correr.",
    "choicesText": "Ajudar o Emir Tariq a construir o Grande Aqueduto Subterrâneo ligando a Abóbada ao oásis de Zahar, ou apoiar o ritual dos sacerdotes.",
    "worldConsequence": "Construir o Aqueduto traz água limpa permanente para as fontes de Zahar e reduz o IPC do mercado local em 15%."
  },
  {
    "id": "primeva_q145",
    "num": 145,
    "title": "O Julgamento das Areias Vermelhas",
    "category": "Política & Capitais",
    "location": "Arena de Arenito de Zahar",
    "actors": "Emir Tariq e Campeão Farid ibn Rashid",
    "trigger": "Concluir #144",
    "description": "Dois chefes de caravana acusam um ao outro de vender mapas das defesas de Zahar para Logos. Pela lei do deserto, a verdade é decidida na arena ou pela prova documental.",
    "choicesText": "Vasculhar as tendas dos dois mercadores durante a tempestade de areia para achar a carta selada de Logos, ou lutar como campeão na arena.",
    "worldConsequence": "Achar a carta prova a culpa do verdadeiro traidor sem derramar sangue inocente e faz Farid ibn Rashid respeitar sua sabedoria."
  },
  {
    "id": "primeva_q146",
    "num": 146,
    "title": "A Sabotagem dos Silos de Especiarias",
    "category": "Política & Capitais",
    "location": "Distrito Comercial de Zahar",
    "actors": "Emir Tariq e Escaravelhos Fendidos",
    "trigger": "Concluir #145",
    "description": "Dissidentes soltaram Cactoros Fendidos (#076) e Escaravelhos nos armazéns de Zahar para provocar fome e revolta contra a Ordem.",
    "choicesText": "Limpar os armazéns usando armas de gelo (para não incendiar os grãos e especiarias) e reparar os portões.",
    "worldConsequence": "Garante o Edital da Pérola das Dunas (+5% de ouro em contratos de todo o leste)."
  },
  {
    "id": "primeva_q147",
    "num": 147,
    "title": "O Motim das Correntes em Thalor",
    "category": "Política & Capitais",
    "location": "Cais e Farol de Thalor (-3850, 0)",
    "actors": "Almirante Varis Moura vs. Capitães Corsários",
    "trigger": "Visitar o Conselho Regional de Thalor",
    "description": "Os Capitães Corsários querem cortar duas das correntes colossais que prendem a rocha de Thalor à 3ª Pedra-Âncora no fundo do mar, alegando que as correntes atraem os Senhores das Águas.",
    "choicesText": "Defender as correntes ao lado do Almirante Varis e da frota da Ordem, ou negociar uma rota segura desviando os monstros abissais.",
    "worldConsequence": "Manter todas as correntes intactas estabiliza a rocha flutuante de Thalor e destrava o Edital do Estaleiro Naval."
  },
  {
    "id": "primeva_q148",
    "num": 148,
    "title": "O Farol Apagado na Tempestade",
    "category": "Política & Capitais",
    "location": "Farol Colossal de Thalor",
    "actors": "Bento (Guardião do Farol) e Sabotadores de Logos",
    "trigger": "Concluir #147",
    "description": "Durante uma tempestade marítima noturna, agentes Despertadores apagaram a chama superior do Farol de Thalor de 50 metros de altura para fazer o navio de suprimentos de Aster bater nos recifes.",
    "choicesText": "Subir a escadaria do farol sob ataque, derrotar o líder sabotador no topo e acender o espelho com Cristal de Fogo antes que o navio naufrague.",
    "worldConsequence": "Salva a frota de suprimentos, garante estoque raro no mercado de Thalor e +20 de Confiança."
  },
  {
    "id": "primeva_q149",
    "num": 149,
    "title": "O Bloqueio Naval do Oeste",
    "category": "Política & Capitais",
    "location": "Mar Aberto de Thalor",
    "actors": "Almirante Varis e Navios Renegados",
    "trigger": "Concluir #148",
    "description": "Três embarcações tomadas por dissidentes bloquearam a saída da enseada de Thalor.",
    "choicesText": "Usar o seu Navio de Expedição Pesada para abalroar a nau capitânia e prender a tripulação para julgamento.",
    "worldConsequence": "Garante o domínio da Ordem sobre o Mar de Thalor e renda diária extra de 150 de ouro no porto."
  },
  {
    "id": "primeva_q150",
    "num": 150,
    "title": "A Greve das Forjas de Basalto",
    "category": "Política & Capitais",
    "location": "Capital de Urdan (0, +3400)",
    "actors": "Conselho de Urdan e Mestres Forjadores",
    "trigger": "Visitar Urdan",
    "description": "Os ferreiros de Urdan estão exaustos de enviar todo o metal para reforçar Aster enquanto suas próprias paliçadas sofrem com chuvas de brasa.",
    "choicesText": "Construir a Muralha Basáltica Externa de Urdan com recursos trazidos no seu Carrinho de Carga e isentar Urdan do imposto de remessa por 7 dias.",
    "worldConsequence": "Urdan sobe 2 níveis de desenvolvimento imediatamente e passa a fornecer armas Flamejantes com 20% de desconto."
  },
  {
    "id": "primeva_q151",
    "num": 151,
    "title": "O Culto do Núcleo Aberto",
    "category": "Política & Capitais",
    "location": "Caverna Profunda de Urdan",
    "actors": "Sacerdote Despertador e Demônio Abissal (#167)",
    "trigger": "Concluir #150",
    "description": "Um grupo radical de Despertadores está tentando usar brocas de mineração para rachar a 4ª Pedra-Âncora e 'libertar a chama primordial'.",
    "choicesText": "Convencer os jovens mineiros enganados a largarem as brocas antes de abater o sacerdote e o Demônio Abissal invocado.",
    "worldConsequence": "Salvar os mineiros jovens preserva a força de trabalho de Urdan (+10 de Confiança e +300 pontos de construção)."
  },
  {
    "id": "primeva_q152",
    "num": 152,
    "title": "O Pacto das Raízes em Verden",
    "category": "Política & Capitais",
    "location": "Capital de Verden (+2300, +2300)",
    "actors": "Arquidruida Eldrin vs. Lenhadores Mercantis",
    "trigger": "Visitar o Conselho Regional de Verden",
    "description": "Mercadores de outras regiões querem derrubar os carvalhos gigantes dentro do anel externo de Verden para vender madeira nobre; o Arquidruida Eldrin ameaça fechar os portões da capital para forasteiros.",
    "choicesText": "Apoiar o Edital de Preservação Sagrada de Eldrin (permitindo apenas coleta de árvores secas e rebrote natural) ou autorizar o corte comercial.",
    "worldConsequence": "Proteger os carvalhos gigantes mantém a Árvore-Mãe brilhando no horizonte a 600 metros e concede regeneração natural de vida dentro de toda a região de Verden."
  },
  {
    "id": "primeva_q153",
    "num": 153,
    "title": "A Sombra sob a Árvore-Mãe",
    "category": "Política & Capitais",
    "location": "Praça Central de Verden",
    "actors": "Arquidruida Eldrin e Cian Ardwyn",
    "trigger": "Concluir #152",
    "description": "Esporos negros plantados por agentes de Logos estão apodrecendo a raiz norte da Árvore-Mãe de Verden.",
    "choicesText": "Descer pelo túnel das raízes com Cian Ardwyn e purificar os 3 focos de corrupção usando água sagrada dos Vigias da Lagoa.",
    "worldConsequence": "Desbloqueia o Santuário Ecológico de Verden (+10% potência em todas as ervas colhidas no sudeste)."
  },
  {
    "id": "primeva_q154",
    "num": 154,
    "title": "O Cisma do Sol Eterno em Solaria",
    "category": "Política & Capitais",
    "location": "Cidade de Solaria",
    "actors": "Grão-Mestre Aurelius e Paladinos Solares",
    "trigger": "Visitar Solaria",
    "description": "Em Solaria, uma ala de paladinos acredita que apenas Rasgados de Rank S deveriam governar os nativos, criando tensão civil nas ruas.",
    "choicesText": "Vencer o campeão arrogante num duelo público sem usar habilidades do Juramento da Âncora (apenas técnica básica) para provar que nativos e Viajantes têm o mesmo valor.",
    "worldConsequence": "Une a guarnição de Solaria sob Aurelius e desbloqueia o Colégio de Caçadores (+5% XP de missões)."
  },
  {
    "id": "primeva_q155",
    "num": 155,
    "title": "A Crise das Três Cidades Caídas",
    "category": "Política & Capitais",
    "location": "Três Vilas do Continente",
    "actors": "Brann, Selene e Governantes",
    "trigger": "Qualquer cidade cair ou alcançar Nível 50",
    "description": "Quando uma cidade cai para uma Fenda Invasora, lojas e pousada fecham, moradores fogem e uma Fenda Vermelha abre na praça central (`civic343.js`).",
    "choicesText": "Entrar na Fenda Invasora, derrotar o Chefe Invasor e entregar 30 cristais do ranque da região (ou superiores) no marco de reconstrução.",
    "worldConsequence": "Reconstrói a cidade na hora, traz os moradores e bichinhos de volta, concede +20 de Confiança e o título 'Bastião das Vilas'."
  },
  {
    "id": "primeva_q156",
    "num": 156,
    "title": "O Tribunal de Logos em Aster",
    "category": "Política & Capitais",
    "location": "Cidadela Alta de Aster",
    "actors": "Lyra, Brann, Selene e Prisioneiros Despertadores",
    "trigger": "Concluir #141, #144, #147 e #152",
    "description": "Doze cidadãos de Aster que ajudaram Dorian/Logos antes da revelação estão presos aguardando sentença. Brann pede exílio; a multidão pede execução.",
    "choicesText": "Propor que os arrependidos trabalhem na reconstrução das vilas da Estrada Sul sob guarda do Clã Ferrugem, ou decretar o exílio imediato.",
    "worldConsequence": "O trabalho de reconstrução recupera a Vila Queimada do Capítulo 2, transformando-a num posto próspero com ferreiro e pousada."
  },
  {
    "id": "primeva_q157",
    "num": 157,
    "title": "A Caravana da Concórdia",
    "category": "Política & Capitais",
    "location": "As 6 Rotas Reais do Continente",
    "actors": "Teren e Emissários das 5 Capitais",
    "trigger": "Concluir #156",
    "description": "Para selar a paz entre os Guardiões e os cidadãos comuns das 5 Capitais, uma grande caravana diplomática parte de Aster levando relíquias de proteção.",
    "choicesText": "Escoltar o comboio pelas 4 passagens das serras (`ridge513`) repelindo emboscadas de dragões e feras.",
    "worldConsequence": "Reduz os impostos comerciais em todas as cidades de Primeva para o piso mínimo de 5%."
  },
  {
    "id": "primeva_q158",
    "num": 158,
    "title": "O Domo de Cristal Azul",
    "category": "Política & Capitais",
    "location": "Muralhas de Ymiria e Zahar",
    "actors": "Selene e Artífices Rúnicos",
    "trigger": "Concluir #157",
    "description": "O custo diário de 60 de ouro do tesouro para manter os Domos de proteção está secando os cofres das vilas menores.",
    "choicesText": "Instalar condutores de ressonância ligados ao Nexo de Aster para reduzir pela metade o desgaste dos Domos quando atacados por tropas externas.",
    "worldConsequence": "Os Domos de todas as cidades passam a resistir o dobro do tempo contra invasões (`RAID155`)."
  },
  {
    "id": "primeva_q159",
    "num": 159,
    "title": "O Desafio dos Cinco Campeões",
    "category": "Política & Capitais",
    "location": "Arena de Combate de Aster",
    "actors": "Valen Corvino, Torben, Farid, Kaelen e Guarda de Thalor",
    "trigger": "Concluir #158",
    "description": "Os cinco maiores caçadores nativos do continente (`worldsim479.js`) convidam você para um torneio amistoso de cinco rodadas na praça dourada de Aster.",
    "choicesText": "Enfrentar os 5 campeões seguidos sem sair da arena.",
    "worldConsequence": "Ao vencer, os 5 campeões dobram sua eficiência na simulação autônoma do mundo (`WorldSim479`), selando Fendas e subindo o nível das cidades muito mais rápido enquanto você explora."
  },
  {
    "id": "primeva_q160",
    "num": 160,
    "title": "A Voz dos Sem-Teto",
    "category": "Política & Capitais",
    "location": "Pátio e Pousada de Aster (`vida522.js`)",
    "actors": "Mendigos de Aster e Selene",
    "trigger": "Ter Afeto 3 com os mendigos de Aster",
    "description": "Os mendigos das cidades (que dormem perto da pousada à noite) perderam suas casas em rupturas antigas nas vilas de fronteira.",
    "choicesText": "Financiar com 10.000 de ouro a reforma do Albergue do Segundo Anel em Aster ou dar empregos a eles nas serrarias e moinhos do Nível 7.",
    "worldConsequence": "Empregá-los nos moinhos e serrarias aumenta a renda diária da cidade em +50 de ouro e faz os ex-mendigos entregarem informações sobre relíquias ocultas."
  },
  {
    "id": "primeva_q161",
    "num": 161,
    "title": "A Lei das Ruas e dos Guardas",
    "category": "Política & Capitais",
    "location": "Quartel da Guarda de Aster (`vida523.js`)",
    "actors": "Comandante Brann e Guardas de Patrulha",
    "trigger": "Concluir #160",
    "description": "Brigas de rua entre moradores cansados e roubos de bolsa têm aumentado nos dias de escassez.",
    "choicesText": "Treinar os guardas da patrulha circular (14 metros) para separar brigas em 5 segundos e dobrar a vigilância noturna perto da pousada.",
    "worldConsequence": "Zera o risco de furto noturno em cidades onde você é Defensor ou Herói Local."
  },
  {
    "id": "primeva_q162",
    "num": 162,
    "title": "O Festival da Noite das Sombras",
    "category": "Política & Capitais",
    "location": "Praça Central de Aster",
    "actors": "Lyra, Mira, Kael e Moradores",
    "trigger": "Concluir #161",
    "description": "Para levantar o moral do povo após semanas de cercos, Aster prepara o grande Festival com estandartes nas torres e feira iluminada.",
    "choicesText": "Fornecer 10 Peixes Assados, 10 Carnes Defumadas e fogos de artifício rúnicos para a festa na praça.",
    "worldConsequence": "Ativa um Festival imediato na capital (-20% nos preços de todas as lojas e +25% de XP por 3 dias de jogo)."
  },
  {
    "id": "primeva_q163",
    "num": 163,
    "title": "A Embaixada dos Onze Clãs",
    "category": "Política & Capitais",
    "location": "Portão Leste de Aster",
    "actors": "Brann, Lyra, Torvo e Representantes dos 11 Clãs",
    "trigger": "Ter completado pelo menos 15 missões da Camada III",
    "description": "Pela primeira vez na história de Primeva, representantes dos povos Base (Goblins do Clã Ferrugem, Orcs Quebra-Rocha, Vigias da Lagoa, Dracônicos e Pastores) pedem um tratado formal de não-agressão com as patrulhas humanas.",
    "choicesText": "Convencer Brann e os governantes das 5 Capitais a assinarem o Tratado das Formas Base (proibindo guardas de atacarem acampamentos pacíficos).",
    "worldConsequence": "Patrulhas humanas e clãs Base passam a lutar juntos contra monstros Fendidos e Abissais nas estradas."
  },
  {
    "id": "primeva_q164",
    "num": 164,
    "title": "O Último Reduto de Logos",
    "category": "Política & Capitais",
    "location": "Fortaleza Oculta no Abismo das Cinzas (Leste de Zahar)",
    "actors": "Brann, Astrid, Tariq, Varis, Eldrin e General Despertador",
    "trigger": "Concluir #163",
    "description": "Os líderes radicais dos Despertadores reuniram um exército de monstros marcados na borda leste do continente para marchar contra Zahar e Aster.",
    "choicesText": "Comandar o ataque conjunto das guardas das 5 Capitais para desmantelar a fortaleza antes que o portal deles se estabilize.",
    "worldConsequence": "Encerra definitivamente as sabotagens políticas contra as Pedras-Âncora no continente."
  },
  {
    "id": "primeva_q165",
    "num": 165,
    "title": "A Catedral dos Vitrais Acesos",
    "category": "Política & Capitais",
    "location": "Terceiro Anel de Aster (Nível 8+)",
    "actors": "Mira, Aldric e Arquitetos de Aster",
    "trigger": "Aster alcançar Nível 8",
    "description": "A grande Catedral de Pedra de Aster está pronta, mas seus vitrais rúnicos precisam ser consagrados com a luz pura do Nexo para abençoar os viajantes.",
    "choicesText": "Subir ao campanário da catedral e canalizar um Cristal Estrela no prisma central.",
    "worldConsequence": "Visitar a Catedral de Aster concede uma bênção diária de +10% de Vida e Mana máximas."
  },
  {
    "id": "primeva_q166",
    "num": 166,
    "title": "O Obelisco do Nível Nove",
    "category": "Política & Capitais",
    "location": "Praça Alta de Aster (Nível 9)",
    "actors": "Kael, Selene e Lyra",
    "trigger": "Aster alcançar Nível 9",
    "description": "Aster ergue os Monumentos dos Heróis (incluindo a estátua de Edran e a sua) e o Obelisco de Mana que irradia um feixe até as nuvens.",
    "choicesText": "Defender o Obelisco durante sua primeira ativação contra uma onda de Arraias do Vazio e Olhos Errantes atraídos pela luz.",
    "worldConsequence": "Aumenta a regeneração natural de Mana e Estamina em um raio de 500 metros ao redor de Aster."
  },
  {
    "id": "primeva_q167",
    "num": 167,
    "title": "A Praça Dourada Imperial",
    "category": "Política & Capitais",
    "location": "Coração de Aster (Nível 10)",
    "actors": "Todos os Mestres de Aster",
    "trigger": "Levar Aster ao Nível 10 máximo",
    "description": "Com as runas circulares douradas ativas no chão da praça e os três anéis de muralha completos, Aster atinge o esplendor máximo da civilização em Primeva.",
    "choicesText": "Realizar o discurso de fundação diante do Nexo ao lado de Lyra e Brann.",
    "worldConsequence": "Concede o título 'Fundador de Primeva' (-10% em todas as lojas do mundo e renda máxima de 300 de ouro por dia com o título Protetor)."
  },
  {
    "id": "primeva_q168",
    "num": 168,
    "title": "A Paz das Cinco Âncoras",
    "category": "Política & Capitais",
    "location": "As 6 Capitais do Continente",
    "actors": "Conselho Regional Completo",
    "trigger": "Todas as 6 Capitais atingirem pelo menos Nível 6",
    "description": "Todas as grandes capitais (Aster, Ymiria, Zahar, Thalor, Urdan e Verden) estão muradas, iluminadas e unidas por estradas seguras.",
    "choicesText": "Assinar a Carta Magna das Terras Despertas no Conselho Regional.",
    "worldConsequence": "Garante que nenhuma capital possa cair abaixo do Nível 5 mesmo durante eventos de Fim do Mundo."
  },
  {
    "id": "primeva_q169",
    "num": 169,
    "title": "Coroa de Ossos: O Morto que Não Queria Partir",
    "category": "Juramento da Âncora & Artefatos (Necromante)",
    "location": "Fenda Vermelha da Cripta Silenciosa",
    "actors": "Guardião do Necromante e Espírito de Soldado Antigo",
    "trigger": "Reunir as 5 peças do conjunto de Necromante ou encontrar o Altar de Ossos",
    "description": "Diante do altar do Primeiro Necromante, o espírito de um guerreiro do primeiro ciclo pede que você não o obrigue a lutar como escravo, mas como companheiro de juramento.",
    "choicesText": "Jurar o Pacto dos Mortos por livre aliança (dividindo 10% da sua mana) e vencer a prova de replicar 2 habilidades da classe em 60 segundos.",
    "worldConsequence": "Desperta a classe rara **Necromante**, concede a **Coroa de Ossos com Caveira** e dobra para 2 Servos Especiais quando escolhida como Afinidade Principal."
  },
  {
    "id": "primeva_q170",
    "num": 170,
    "title": "Diadema do Relógio: O Segundo que Faltou",
    "category": "Juramento da Âncora & Artefatos (Mago do Tempo)",
    "location": "Fenda Vermelha do Pêndulo Partido",
    "actors": "Guardião do Tempo e Voz do Narrador",
    "trigger": "Reunir as 5 peças do conjunto do Tempo ou encontrar o Altar Cronológico",
    "description": "No santuário onde o tempo corre para trás, você vê a cena congelada do momento em que o Narrador hesitou 3 segundos antes da descarga que destruiu seu corpo.",
    "choicesText": "Ativar os pulsos temporais na ordem exata, suportar o colapso do relógio e vencer o Guardião do Tempo.",
    "worldConsequence": "Desperta a classe rara **Mago do Tempo**, concede o **Diadema Dourado de Engrenagem Viva** e amplia a Reserva Temporal de 3s para 6s na Afinidade Principal."
  },
  {
    "id": "primeva_q171",
    "num": 171,
    "title": "Aro de Cristais: A Costura do Abismo",
    "category": "Juramento da Âncora & Artefatos (Tecelão de Fendas)",
    "location": "Fenda Vermelha do Horizonte Rasgado",
    "actors": "Guardião Tecelão",
    "trigger": "Reunir as 5 peças do conjunto do Tecelão",
    "description": "O primeiro Tecelão de Fendas descobriu que as passagens não são feridas mortas, mas fios que podem ser dobrados para atravessar distâncias impossíveis.",
    "choicesText": "Atravessar as 4 bordas dimensionais em sequência sem tocar o chão corrompido e vencer o Guardião Tecelão.",
    "worldConsequence": "Desperta a classe rara **Tecelão de Fendas**, concede a **Coroa de Cristais Flutuantes** e permite abrir portais de até 2 ranques acima do seu na Afinidade Principal."
  },
  {
    "id": "primeva_q172",
    "num": 172,
    "title": "Coroa dos Elos Dourados: Quem Ficou para Trás",
    "category": "Juramento da Âncora & Artefatos (Guardião dos Vínculos)",
    "location": "Fenda Vermelha da Ponte Quebrada",
    "actors": "Peregrino Ferido e Guardião dos Vínculos",
    "trigger": "Reunir as 5 peças do conjunto do Guardião dos Vínculos",
    "description": "Um peregrino imóvel está cercado por três manifestações que ignoram escudos comuns e só podem ser detidas se você ligar sua própria vida à dele.",
    "choicesText": "Manter o Elo Protetor ativo recebendo metade do dano do peregrino por 12 segundos e derrotar o Guardião.",
    "worldConsequence": "Desperta a classe rara **Guardião dos Vínculos**, concede a **Coroa de Elos Dourados** e dobra sua capacidade para 2 vínculos protetores simultâneos."
  },
  {
    "id": "primeva_q173",
    "num": 173,
    "title": "Coroa de Garras e Chifres: O Instinto Antes da Forma",
    "category": "Juramento da Âncora & Artefatos (Metamorfo)",
    "location": "Fenda Vermelha da Selva Primordial",
    "actors": "Guardião Metamorfo",
    "trigger": "Reunir as 5 peças do conjunto do Metamorfo (`metamorfo-rig.glb`)",
    "description": "No altar selvagem onde lobos, raptores e dragões deixaram suas peles, o espírito da primeira caçadora exige que você lute alternando alcance e ferocidade sem depender de aço forjado.",
    "choicesText": "Vencer o duelo alternando entre combate a curta e longa distância e replicar as formas da fera.",
    "worldConsequence": "Desperta a classe rara **Metamorfo**, concede a **Coroa de Garras e Chifres** e permite preparar 4 formas animais na Afinidade Principal."
  },
  {
    "id": "primeva_q174",
    "num": 174,
    "title": "Coroa de Engrenagens Rúnicas: O Arquiteto Mortal",
    "category": "Juramento da Âncora & Artefatos (Artífice Rúnico)",
    "location": "Fenda Vermelha da Oficina Esquecida",
    "actors": "Guardião Artífice",
    "trigger": "Reunir as 5 peças do conjunto do Artífice Rúnico",
    "description": "Três torres rúnicas antigas estão quebradas enquanto hordas avançam pelo corredor de basalto.",
    "choicesText": "Consertar os três núcleos sob fogo inimigo, posicionar as armadilhas e vencer o Guardião Artífice.",
    "worldConsequence": "Desperta a classe rara **Artífice Rúnico**, concede a **Coroa de Engrenagens Rúnicas** e dobra o limite de construções ativas de 2 para 4."
  },
  {
    "id": "primeva_q175",
    "num": 175,
    "title": "Coroa de Lâminas: O Espelho do Golpe",
    "category": "Juramento da Âncora & Artefatos (Duelista Espectral)",
    "location": "Fenda Vermelha do Salão de Espelhos",
    "actors": "Guardião Duelista Espectral",
    "trigger": "Reunir as 5 peças do conjunto do Duelista Espectral",
    "description": "Um espadachim fantasma aguarda no centro de uma arena circular e só recebe dano após ter seu próprio golpe aparado no tempo exato.",
    "choicesText": "Executar 3 aparos perfeitos seguidos e devolver o contra-ataque para quebrar a postura do Guardião.",
    "worldConsequence": "Desperta a classe rara **Duelista Espectral**, concede a **Coroa de Lâminas** e permite guardar 2 contra-ataques espectrais."
  },
  {
    "id": "primeva_q176",
    "num": 176,
    "title": "Coroa de Raios: O Passo que Gera Trovão",
    "category": "Juramento da Âncora & Artefatos (Condutor das Tempestades)",
    "location": "Fenda Vermelha do Pico Elétrico",
    "actors": "Guardião Condutor",
    "trigger": "Reunir as 5 peças do conjunto do Condutor das Tempestades",
    "description": "Nesta dimensão, ficar parado drena sua energia até zero; apenas o movimento contínuo entre os condutores abastece a tempestade.",
    "choicesText": "Percorrer o circuito elétrico sem parar de se mover por um único segundo e derrotar o Guardião.",
    "worldConsequence": "Desperta a classe rara **Condutor das Tempestades**, concede a **Coroa de Raios** e dobra sua reserva máxima de Energia de 3 para 6 cargas."
  },
  {
    "id": "primeva_q177",
    "num": 177,
    "title": "Coroa do Olho e Raios: A Verdade Antes do Gesto",
    "category": "Juramento da Âncora & Artefatos (Oráculo dos Vestígios)",
    "location": "Fenda Vermelha da Névoa Branca",
    "actors": "Guardião Oráculo",
    "trigger": "Reunir as 5 peças do conjunto do Oráculo dos Vestígios",
    "description": "Inimigos invisíveis atacam da neblina e só revelam um vestígio luminoso no chão 1 segundo antes do impacto.",
    "choicesText": "Ler os sinais antecipados no chão para esquivar de 5 golpes letais e derrotar o Guardião Oráculo.",
    "worldConsequence": "Desperta a classe rara **Oráculo dos Vestígios**, concede a **Coroa do Olho Astral** e amplia a janela de antecipação de 1s para 2s."
  },
  {
    "id": "primeva_q178",
    "num": 178,
    "title": "Coroa do Orbe do Vazio: A Fome Controlada",
    "category": "Juramento da Âncora & Artefatos (Devorador do Vazio)",
    "location": "Fenda Vermelha do Abismo Negro",
    "actors": "Guardião Devorador do Vazio",
    "trigger": "Reunir as 5 peças do conjunto do Devorador do Vazio",
    "description": "O altar do Vazio oferece poder para engolir projéteis inimigos e devolvê-los, mas tenta corromper sua mente com a voz do Arquiteto.",
    "choicesText": "Manter os 3 selos limpos de corrupção, absorver os disparos do Guardião e devolvê-los sem ceder ao sussurro.",
    "worldConsequence": "Desperta a classe rara **Devorador do Vazio**, concede a **Coroa de Chifres e Orbe do Vazio** e permite absorver até 2 ataques simultâneos."
  },
  {
    "id": "primeva_q179",
    "num": 179,
    "title": "O Trono de Sangue do Último Portão",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Cidadela de Obsidiana em Pyra",
    "actors": "O Último Portão (#188)",
    "trigger": "Encontrar o Altar Carmesim no mundo aberto",
    "description": "O Último Portão (#188), antigo marechal de um império engolido pela Fenda, guarda em seu Trono de Sangue a espada que rachou sua própria capital.",
    "choicesText": "Destruir o Trono de Sangue para libertar a alma do marechal ou absorver o poder de seu Golpe Sísmico para o seu Tomo de Guardião.",
    "worldConsequence": "Libera o poder 'Golpe Sísmico' na Biblioteca de Poderes e entrega 1 Relíquia Única de Chefe."
  },
  {
    "id": "primeva_q180",
    "num": 180,
    "title": "A Coroa e o Grimório do Arquivista",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Necrópole de Érebo",
    "actors": "O Arquivista (#189)",
    "trigger": "Ler o Tomo Proibido nas Ruínas de Mármore",
    "description": "O Arquivista (#189) de 6 metros de altura canaliza a Chuva de Almas sobre um trono de crânios rúnicos.",
    "choicesText": "Quebrar o grimório flutuante antes de abater o Lich para impedir que ele renasça, ou selar o grimório com a ajuda de Aldric.",
    "worldConsequence": "Libera o poder 'Chuva de Almas' e entrega o Anel de Mana Ancestral (+10% regeneração de mana)."
  },
  {
    "id": "primeva_q181",
    "num": 181,
    "title": "Os Dois Machados do Campeão das Arenas",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Arena de Cinzas da Fenda",
    "actors": "O Campeão das Arenas (#190)",
    "trigger": "Vencer 3 duelos do Clã Quebra-Rocha",
    "description": "O Campeão das Arenas (#190) nunca recuou em mil anos de batalha e busca alguém capaz de suportar sua Fúria Sangrenta.",
    "choicesText": "Derrotá-lo enquanto ele está no auge do buff de Fúria Sangrenta sem fugir do círculo da arena.",
    "worldConsequence": "Libera o poder 'Fúria Sangrenta' e concede +10 de Fúria máxima permanente."
  },
  {
    "id": "primeva_q182",
    "num": 182,
    "title": "A Última Ordem do Marechal sem Bandeira",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Fortaleza Subterrânea da Abóbada",
    "actors": "O Marechal sem Bandeira (#191)",
    "trigger": "Encontrar o estandarte rasgado na Passagem Norte",
    "description": "O Marechal sem Bandeira (#191) continua convocando sua Legião de mortos para defender um rei que já não existe.",
    "choicesText": "Apresentar o selo real de Zahar antes do combate para dispensar metade da guarda de honra ou enfrentar a Legião inteira.",
    "worldConsequence": "Libera o poder 'Legião' e o troféu do General para a Estante da sua casa."
  },
  {
    "id": "primeva_q183",
    "num": 183,
    "title": "O Manto Sem Corpo do Rei Oco",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Palácio Espelhado de Érebo",
    "actors": "O Rei Oco (#192)",
    "trigger": "Concluir #103",
    "description": "O Rei Oco (#192) vendeu o corpo físico do próprio povo em troca de imortalidade vazia, restando apenas a coroa e o manto flutuante.",
    "choicesText": "Cravar sua arma no centro vazio sob o manto no exato segundo após o Colapso do Vazio.",
    "worldConsequence": "Libera o poder 'Colapso do Vazio' e a relíquia Coroa Vazia."
  },
  {
    "id": "primeva_q184",
    "num": 184,
    "title": "A Fornalha do Senhor da Fornalha",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Trono de Fogo em Pyra",
    "actors": "O Senhor da Fornalha (#193)",
    "trigger": "Alcançar Nível 60 e entrar na Fenda Vulcânica",
    "description": "Sentado num trono de magma vivo, o Senhor da Fornalha (#193) comanda os Demônios Chifrudos que invadem o sul de Urdan.",
    "choicesText": "Derrubar os dois pilares de basalto sobre o Trono de Fogo e vencer Vharok em três fases.",
    "worldConsequence": "Libera o poder 'Chama do Rei Demônio' e a relíquia regional Coração de Brasa (+6% de dano permanente)."
  },
  {
    "id": "primeva_q185",
    "num": 185,
    "title": "As Quatro Escamas de Kaelthys",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Pico Tempestuoso do Outro Mundo",
    "actors": "A Fera dos Quatro Céus (#194)",
    "trigger": "Abater pelo menos 3 dragões de mundo aberto",
    "description": "A Fera dos Quatro Céus (#194) possui escamas de quatro cores (fogo, gelo, raio e vazio) e muda de fraqueza elemental a cada barra de vida quebrada.",
    "choicesText": "Alternar elementos ou usar penetração física pura para quebrar todas as barras de vida de Kaelthys.",
    "worldConsequence": "Libera o poder 'Sopro do Caos' e entrega 1 equipamento de raridade Mítica garantido."
  },
  {
    "id": "primeva_q186",
    "num": 186,
    "title": "O Trono de Seda da Rainha Nhyssa",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Catedral de Teias de Xylo",
    "actors": "A Mãe do Ninho (#195)",
    "trigger": "Concluir #102",
    "description": "Com tronco élfico e coroa de ovos de cristal, a Mãe do Ninho (#195) tece fios dimensionais que puxam fragmentos de florestas inteiras para dentro da Fenda.",
    "choicesText": "Cortar os 4 cabos mestres de teia que sustentam o teto da catedral e derrotar Nhyssa.",
    "worldConsequence": "Libera o poder 'Ninhada Sombria' e concede imunidade à lentidão de teias de aranha em todo o jogo."
  },
  {
    "id": "primeva_q187",
    "num": 187,
    "title": "O Coração da Geleira: Colosso Ymrak",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Trono Glacial de Nifl",
    "actors": "O Inverno Que Andava (#196)",
    "trigger": "Alcançar Rank S em Ymiria",
    "description": "Ymrak (#196) é uma montanha viva de gelo azul cujo passo provoca o Inverno Absoluto.",
    "choicesText": "Manter uma fogueira acesa no centro da arena ou usar o Chá de Flor de Brasa para não congelar durante a nova glacial.",
    "worldConsequence": "Libera o poder 'Inverno Absoluto' e entrega o Núcleo Glacial Eterno."
  },
  {
    "id": "primeva_q188",
    "num": 188,
    "title": "O Trono do que Restou da Cidade",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Cidadela Central de Pyra (Rank SS)",
    "actors": "O que Restou da Cidade (#197)",
    "trigger": "Alcançar Rank SS",
    "description": "Primeiro dos quatro Soberanos Supremos das Fendas. Seu corpo de rocha rachada guarda um sol em colapso no peito.",
    "choicesText": "Sobreviver ao cone de Autoridade da Destruição e quebrar as 6 barras de vida do Soberano.",
    "worldConsequence": "Libera o poder supremo 'Autoridade da Destruição' e 1 peça de equipamento Divino."
  },
  {
    "id": "primeva_q189",
    "num": 189,
    "title": "O Trono da Rainha do Inverno Parado",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Cidadela Central de Nifl (Rank SS)",
    "actors": "A Rainha do Inverno Parado (#198)",
    "trigger": "Concluir #188",
    "description": "Com coroa de estalactites e olhos brancos, a Rainha do Inverno Parado (#198) tenta congelar o próprio tempo ao redor da Pedra-Âncora do norte.",
    "choicesText": "Quebrar os 4 cristais orbitais antes que ele canalize a Era do Gelo máxima.",
    "worldConsequence": "Libera o poder supremo 'Era do Gelo' do Soberano e +5 de Resistência permanente."
  },
  {
    "id": "primeva_q190",
    "num": 190,
    "title": "O Trono do Caçador Primevo",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Cidadela Selvagem de Xylo (Rank SS+)",
    "actors": "O Caçador Primevo (#200)",
    "trigger": "Alcançar Rank SS+",
    "description": "Metade titã, metade fera primordial com galhadas colossais, o Caçador Primevo (#200) comanda todas as criaturas selvagens tomadas pela Fenda.",
    "choicesText": "Enfrentar o Soberano sem matar as feras comuns invocadas pelo seu Rugido (focando apenas no titã) ou limpar a arena inteira.",
    "worldConsequence": "Libera o poder supremo 'Rugido das Feras' e faz com que animais selvagens comuns do mundo aberto nunca ataquem você primeiro."
  },
  {
    "id": "primeva_q191",
    "num": 191,
    "title": "O Coração Rúnico da Estátua da Colina",
    "category": "Tronos de Poder & Últimos Reis",
    "location": "Colina Rochosa a Sudeste de Aster (x = 210, z = 360) (`marcos526.js`)",
    "actors": "Altar do Titã Vigilante e Guardião Ancestral",
    "trigger": "Descobrir a Estátua Gigantesca de 30 metros no topo da colina",
    "description": "No topo da colina sudeste de Aster ergue-se uma estátua colossal de 30 metros com uma câmara oca iluminada por tochas fumegantes em sua base. Ao tocar o Baú Relicário Dourado (`F · ABRIR RELICÁRIO DA ESTÁTUA DA COLINA`), a memória do Titã Vigilante desperta para testar se você é digno do tesouro.",
    "choicesText": "Vencer o Guardião do Relicário dentro da câmara sem apagar as tochas sagradas ou fazer uma oferenda de 5 Cristais Estrela no Altar do Titã.",
    "worldConsequence": "Entrega o **Coração Rúnico do Titã** (+10% de Escudo máximo permanente e +50.000 de ouro) e transforma a câmara da estátua em um ponto de descanso sagrado."
  },
  {
    "id": "primeva_q192",
    "num": 192,
    "title": "Os Bancos de Areia de Nara",
    "category": "Pessoas das Margens",
    "location": "Travessia do Rio Central",
    "actors": "Nara, a Barqueira (Livro Oficial p. 93)",
    "trigger": "Conversar com Nara junto ao barco Casca-de-Salgueiro",
    "description": "Nara conhece cada banco de areia do rio, mas troncos submersos cheios de Caranguejos-Sino estão quebrando o reforço em Y da proa do seu barco Casca-de-Salgueiro.",
    "choicesText": "Mergulhar no canal raso para retirar os 4 troncos espinhosos e trazer 2 galhos bifurcados de salgueiro para o reparo.",
    "worldConsequence": "Nara passa a atravessar você e seu Carrinho de Carga gratuitamente entre as margens de todos os rios do continente."
  },
  {
    "id": "primeva_q193",
    "num": 193,
    "title": "As Tábuas que Ainda Prestam",
    "category": "Pessoas das Margens",
    "location": "Estaleiro da Margem Oeste",
    "actors": "Oren, o Carpinteiro Naval (Livro Oficial p. 93)",
    "trigger": "Conversar com Oren com o esquadro de madeira",
    "description": "Oren nunca desperdiça madeira firme de barcos perdidos. Ele pede que você recupere o leme de carvalho de um Costureiro das Marés encalhado numa praia tomada por Homens-Peixe Fendidos (#085).",
    "choicesText": "Desmontar o leme e as cavernas intactas com cuidado (sem usar habilidades explosivas perto do casco) e levá-los no carrinho até Oren.",
    "worldConsequence": "Todas as suas embarcações (`boats440.js`) ganham +20% de velocidade de navegação e reparo gratuito nos portos."
  },
  {
    "id": "primeva_q194",
    "num": 194,
    "title": "O Mapa que Só Existe na Maré Baixa",
    "category": "Pessoas das Margens",
    "location": "Falésias Costeiras de Thalor",
    "actors": "Iria, a Cartógrafa das Marés (Livro Oficial p. 93)",
    "trigger": "Encontrar Iria desenhando na costa",
    "description": "Iria guarda num estojo cilíndrico rotas costeiras que só aparecem durante a maré baixa. Ela precisa que você a escolte até três arcos de pedra antes que a água suba e as Lesmas-Manto-de-Maré fechem a passagem.",
    "choicesText": "Proteger Iria enquanto ela desenha os 3 pontos sem interromper seu traço e voltar antes da maré encher.",
    "worldConsequence": "Revela no seu mapa todas as cavernas subaquáticas com bolsão de ar e recifes de pérolas da costa de Thalor."
  },
  {
    "id": "primeva_q195",
    "num": 195,
    "title": "Os Três Navios Atrasados de Bento",
    "category": "Pessoas das Margens",
    "location": "Base do Farol de Thalor",
    "actors": "Bento, o Guardião do Farol (Livro Oficial p. 93)",
    "trigger": "Falar com Bento com a lanterna quadrada",
    "description": "Bento mantém o sinal costeiro aceso e anota cada barco que parte. Três pequenos barcos de pesca não voltaram antes do nevoeiro fechar.",
    "choicesText": "Navegar de Veleiro seguindo os sinais de luz da lanterna de Bento para rebocar os pescadores perdidos na neblina.",
    "worldConsequence": "Bento entrega a Lanterna Quadrada do Faroleiro (aumenta o alcance de luz noturna em +15 metros mesmo na neblina densa)."
  },
  {
    "id": "primeva_q196",
    "num": 196,
    "title": "O Cinto de Lastro de Sura",
    "category": "Pessoas das Margens",
    "location": "Recife Raso de Thalor",
    "actors": "Sura, a Mergulhadora (Livro Oficial p. 93)",
    "trigger": "Conversar com Sura na enseada",
    "description": "Sura recupera ferramentas antigas de ruínas rasas usando óculos de vidro grosso, mas um Polvo-Ceramista gigante roubou seu saco de relíquias e o escondeu sob cacos de cerâmica.",
    "choicesText": "Mergulhar com Sura e retirar apenas os cacos falsos da toca do Polvo-Ceramista sem matar o animal.",
    "worldConsequence": "Sura ensina a técnica de respiração profunda (+25% de duração do fôlego submarino e chance dobrada de achar pérolas em ostras)."
  },
  {
    "id": "primeva_q197",
    "num": 197,
    "title": "O Eixo Quebrado na Curva da Serra",
    "category": "Pessoas das Margens",
    "location": "Estrada Sinuosa do Norte",
    "actors": "Teren, o Cocheiro da Ordem (Livro Oficial p. 93)",
    "trigger": "Encontrar Teren parado na estrada",
    "description": "O caixote de mapas sob o banco da Carroça da Ordem soltou-se quando uma roda bateu numa pedra solta durante uma emboscada de Lobos Sombrios.",
    "choicesText": "Proteger Teren e o Boi de Tração enquanto conserta a roda com 2 Tábuas e recupera os 3 rolos de mapa levados pelo vento.",
    "worldConsequence": "Teren lhe entrega o Broche da Roda de Madeira: você pode chamar a Carroça da Ordem em qualquer posto de estrada visitado."
  },
  {
    "id": "primeva_q198",
    "num": 198,
    "title": "O Cansaço do Boi de Testa Marfim",
    "category": "Pessoas das Margens",
    "location": "Estábulo Externo de Aster",
    "actors": "Maela, a Tratadora (Livro Oficial p. 93)",
    "trigger": "Conversar com Maela junto aos Bois de Tração",
    "description": "Maela reconhece pelo olhar quando um animal de carga está no limite. Um Boi de Tração voltou da rota de Zahar com febre de areia nos cascos.",
    "choicesText": "Colher 4 maços de capim fresco dos Campos Floridos e preparar uma compressa fria com água fervida para tratar o boi.",
    "worldConsequence": "Maela ajusta as correias da sua mochila e do seu Carrinho de Carga (+10 kg de capacidade de peso sem penalidade)."
  },
  {
    "id": "primeva_q199",
    "num": 199,
    "title": "Os Juncos Dobrados de Rul",
    "category": "Pessoas das Margens",
    "location": "Margem do Rio de Verden",
    "actors": "Rul, o Cesteiro (Livro Oficial p. 93)",
    "trigger": "Falar com Rul na beira do rio",
    "description": "Rul fabrica cestos impermeáveis para pesca e transporte, mas um enxame de Vespas Rainhas (#055) fez ninho no melhor juncal da margem.",
    "choicesText": "Usar fumaça da fogueira portátil para afastar as vespas e colher 15 feixes de junco longo para Rul.",
    "worldConsequence": "Rul entrega o Cesto de Junco Trançado (peixes pescados guardados nele demoram o dobro do tempo para perder o frescor)."
  },
  {
    "id": "primeva_q200",
    "num": 200,
    "title": "As Salinas Brancas de Edda",
    "category": "Pessoas das Margens",
    "location": "Tabuleiros de Sal ao Sul de Thalor",
    "actors": "Edda, a Salineira (Livro Oficial p. 93)",
    "trigger": "Falar com Edda nas salinas",
    "description": "Edda conserva as provisões de todos os viajantes que vão para as Fendas, mas Peixes-Martelo-de-Pedra subiram na maré cheia e quebraram as muretas de madeira dos tabuleiros de sal.",
    "choicesText": "Reconstruir as muretas com Pedra Lascada e ajudar Edda a recolher o sal puro com a pá de madeira antes da chuva.",
    "worldConsequence": "Edda fornece Sal Marinho Puro ilimitado para o seu Alforje Curado no Sal e para a caixa de salmoura do seu carrinho."
  },
  {
    "id": "primeva_q201",
    "num": 201,
    "title": "As Três Pontes Marcadas de Vico",
    "category": "Pessoas das Margens",
    "location": "Pontes sobre o Rio das Cinzas Claras",
    "actors": "Vico, o Mensageiro das Pontes (Livro Oficial p. 94)",
    "trigger": "Ser abordado por Vico correndo na estrada",
    "description": "Vico corre de polainas altas e bolsa triangular no peito levando avisos entre travessias. Ele descobriu que três pontes foram minadas por Golens de Pedra Fendidos (#089), mas torceu o tornozelo.",
    "choicesText": "Assumir a corrida de Vico, cravar as bandeiras de alerta nas 3 pontes antes que a caravana passe e derrotar os Golens.",
    "worldConsequence": "Concede as Polainas de Vico (+5% de velocidade de movimento em estradas e pontes)."
  },
  {
    "id": "primeva_q202",
    "num": 202,
    "title": "Os Três Remendos Cor de Ferrugem",
    "category": "Pessoas das Margens",
    "location": "Porto de Cabotagem de Thalor",
    "actors": "Ansa, a Tecelã de Velas (Livro Oficial p. 94)",
    "trigger": "Falar com Ansa no cais",
    "description": "Ansa reconhece qualquer barco de longe pelos remendos que ela mesma costurou com sua grande agulha de madeira. Uma vela com três remendos ferrugem apareceu à deriva, sem tripulação.",
    "choicesText": "Navegar até o barco à deriva, enfrentar a Lula do Vazio Fendida (#090) escondida no porão e trazer o diário do capitão para Ansa.",
    "worldConsequence": "Ansa costura uma Vela de Três Cores para o seu Veleiro e Navio, aumentando a resistência contra tempestades marinhas."
  },
  {
    "id": "primeva_q203",
    "num": 203,
    "title": "Os Entalhes no Escudo de Garo",
    "category": "Pessoas das Margens",
    "location": "Promontório da Enseada de Thalor",
    "actors": "Garo, o Vigia da Enseada (Livro Oficial p. 94)",
    "trigger": "Falar com Garo olhando o mar",
    "description": "O escudo oval de Garo tem três entalhes marcando as três vezes em que os Senhores das Águas subiram das fossas. Hoje a água mudou de cor: ele precisa fazer o quarto entalhe e soar o alarme.",
    "choicesText": "Ajudar Garo a acender o facho de óleo na ponta do promontório enquanto segura os primeiros batedores marinhos.",
    "worldConsequence": "Garo passa a marcar no seu mapa-múndi a posição exata dos 4 Senhores das Águas sempre que emergirem."
  },
  {
    "id": "primeva_q204",
    "num": 204,
    "title": "O Bastião das Cracas no Estreito",
    "category": "Senhores das Águas & Mar",
    "location": "Passagem Costeira Norte de Thalor",
    "actors": "Garo, Oren e Bastião das Cracas (Livro Oficial p. 92)",
    "trigger": "Concluir #203",
    "description": "O Bastião das Cracas — um caranguejo colossal de seis pernas, duas pinças-escudo e três torres de cracas nas costas — fechou a passagem costeira, incorporando cascos de barcos ao seu abrigo.",
    "choicesText": "Quebrar primeiro as três torres de cracas nas costas usando ataques em salto antes de golpear a articulação das pinças-escudo.",
    "worldConsequence": "Desobstrui a rota marítima norte de Thalor e entrega o Escudo Pinça do Bastião."
  },
  {
    "id": "primeva_q205",
    "num": 205,
    "title": "O Badalar do Sino do Fundão",
    "category": "Senhores das Águas & Mar",
    "location": "Ruínas Submersas da Fossa de Thalor",
    "actors": "Sura (Mergulhadora) e Sino do Fundão (Livro Oficial p. 92)",
    "trigger": "Mergulhar abaixo de 12 metros na Fossa de Thalor",
    "description": "Uma medusa colossal de campânula opaca marfim e quatro tentáculos grossos faz todas as colunas submersas ressoarem antes de sua chegada, aumentando a pressão da água.",
    "choicesText": "Nadar para trás dos pilares de pedra a cada contração sonora do Sino do Fundão e atacar o aro escuro no intervalo.",
    "worldConsequence": "Entrega a Relíquia Regional **Pérola da Maré** (+12% de Mana máxima permanente)."
  },
  {
    "id": "primeva_q206",
    "num": 206,
    "title": "A Serpe das Três Comportas",
    "category": "Senhores das Águas & Mar",
    "location": "Eclusa Antiga Inundada entre Thalor e Verden",
    "actors": "Nara (Barqueira) e Serpe das Três Comportas (Livro Oficial p. 92)",
    "trigger": "Navegar pelo canal antigo de comportas",
    "description": "A Serpe das Três Comportas usa suas três placas dorsais retangulares móveis para travar as comportas da estrutura inundada, alagando as estradas ribeirinhas.",
    "choicesText": "Destravar manualmente as alavancas das comportas enquanto a Serpe muda de canal para prendê-la na câmara seca.",
    "worldConsequence": "Drena o trecho alagado da estrada oeste e abre um canal navegável rápido para Canoas a Remo."
  },
  {
    "id": "primeva_q207",
    "num": 207,
    "title": "O Sono da Matriarca do Recife Oco",
    "category": "Senhores das Águas & Mar",
    "location": "Banco de Corais de Alto-Mar",
    "actors": "Iria (Cartógrafa) e Matriarca do Recife Oco (Livro Oficial p. 92)",
    "trigger": "Navegar de Veleiro até os recifes externos",
    "description": "A Matriarca do Recife Oco é uma tartaruga colossal com quatro pilares naturais de coral vivo no casco em arco. Pescadores imprudentes ancoraram sobre o dorso dela achando que era uma ilha.",
    "choicesText": "Retirar a âncora cravada no casco da Matriarca e afastar os tubarões fendidos sem ferir a tartaruga colossal, ou enfrentá-la.",
    "worldConsequence": "Ajudar a Matriarca pacificamente transforma o dorso dela numa Ilha Móvel pacífica onde brotam Pérolas Abissais raras a cada semana."
  },
  {
    "id": "primeva_q208",
    "num": 208,
    "title": "A Dança do Peixe-Vela-de-Folha",
    "category": "Senhores das Águas & Mar",
    "location": "Corredeiras do Rio Central",
    "actors": "Pescador Velho e Peixe-Vela-de-Folha (Livro Oficial p. 90)",
    "trigger": "Equipar Vara de Pesca nas corredeiras",
    "description": "O Peixe-Vela-de-Folha acompanha troncos à deriva e dobra a nadadeira ocre na corrente forte. Capturar um exemplar recorde exige seguir o tronco de canoa.",
    "choicesText": "Fisgar o peixe lendário sem arrebentar a linha e soltá-lo no Aquário da sua casa ou assá-lo na brasa.",
    "worldConsequence": "Colocá-lo no Aquário concede +1 ponto de Destreza por treino e +1 tentativa em todas as pescas futuras."
  },
  {
    "id": "primeva_q209",
    "num": 209,
    "title": "O Segredo do Polvo-Ceramista",
    "category": "Senhores das Águas & Mar",
    "location": "Enseada dos Cacos Antigos",
    "actors": "Aldric e Polvo-Ceramista (Livro Oficial p. 90)",
    "trigger": "Mergulhar nas águas rasas da enseada",
    "description": "Um Polvo-Ceramista cobriu sua toca com fragmentos de um vaso real da Primeira Era que falta no museu de Aldric.",
    "choicesText": "Levar conchas brilhantes e cacos coloridos para trocar pacíficamente pelas peças históricas com o polvo.",
    "worldConsequence": "O Polvo-Ceramista aceita a troca e entrega o Vaso da Primeira Era intacto (+500 XP e +3000 de ouro)."
  },
  {
    "id": "primeva_q210",
    "num": 210,
    "title": "O Cardume de Camarões-Lanterna",
    "category": "Senhores das Águas & Mar",
    "location": "Caverna Subaquática Escura",
    "actors": "Sura e Camarões-Lanterna (Livro Oficial p. 91)",
    "trigger": "Entrar na caverna submersa à noite",
    "description": "A água turva da caverna submersa cega qualquer mergulhador, mas os Camarões-Lanterna de placa abdominal âmbar guiam quem não os espanta.",
    "choicesText": "Nadar devagar sem usar golpes em área para seguir o cardume âmbar até a câmara secreta do bolsão de ar.",
    "worldConsequence": "Descobre um baú ancestral da Primeira Era no bolsão de ar seco com uma arma Épica."
  },
  {
    "id": "primeva_q211",
    "num": 211,
    "title": "A Laje da Foca-Papo-de-Sal",
    "category": "Senhores das Águas & Mar",
    "location": "Lajes Costeiras do Sul de Thalor",
    "actors": "Maela e Foca-Papo-de-Sal (Livro Oficial p. 90)",
    "trigger": "Caminhar pela praia rochosa",
    "description": "Uma Foca-Papo-de-Sal está presa em redes velhas de contrabandistas enquanto Homens-Peixe Fendidos se aproximam pela rebentação.",
    "choicesText": "Cortar a rede e defender a laje costeira até que a foca mergulhe em segurança.",
    "worldConsequence": "A foca volta trazendo na boca uma Chave Enferrujada de Naufrágio que abre o segundo baú da Fossa Abissal."
  },
  {
    "id": "primeva_q212",
    "num": 212,
    "title": "Raspando as Ruínas com a Tartaruga-de-Quilhas",
    "category": "Senhores das Águas & Mar",
    "location": "Canal Submerso da Ponte Antiga",
    "actors": "Aldric e Tartaruga-de-Quilhas (Livro Oficial p. 90)",
    "trigger": "Mergulhar sob a Ponte dos Escudos Caídos",
    "description": "As inscrições submersas dos pilares da ponte estão cobertas por algas grossas que só a Tartaruga-de-Quilhas consegue raspar.",
    "choicesText": "Atrair a Tartaruga-de-Quilhas até os 3 pilares usando ervas aquáticas para revelar os glifos.",
    "worldConsequence": "Revela um esconderijo de Mithril na base seca da ponte."
  },
  {
    "id": "primeva_q213",
    "num": 213,
    "title": "A Trilha na Areia da Arraia-Mosaico",
    "category": "Senhores das Águas & Mar",
    "location": "Baixios Claros de Thalor",
    "actors": "Iria e Arraia-Mosaico (Livro Oficial p. 90)",
    "trigger": "Observar o fundo raso da praia",
    "description": "As placas em mosaico marfim da Arraia-Mosaico deixam sulcos na areia rasa que apontam para veios de minério soterrados.",
    "choicesText": "Seguir a trilha da arraia mergulhando até o recife e minerar o veio antes que a correnteza o cubra.",
    "worldConsequence": "Rende 8 Cristais Marinhos e 2 Pérolas Abissais."
  },
  {
    "id": "primeva_q214",
    "num": 214,
    "title": "As Fendas da Enguia-de-Anéis",
    "category": "Senhores das Águas & Mar",
    "location": "Paredão Submerso da Fossa",
    "actors": "Sura e Enguia-de-Anéis (Livro Oficial p. 90)",
    "trigger": "Mergulhar a 15 metros de profundidade",
    "description": "Uma Enguia-de-Anéis gigante travou seus seis anéis ósseos claros na entrada de uma gruta que guarda um carregamento de Chá de Algas antigo.",
    "choicesText": "Usar uma isca de peixe fora da toca para fazê-la soltar os anéis da rocha sem precisar lutar no túnel estreito.",
    "worldConsequence": "Recupera 5 frascos de Poção de Pressão (+15 metros de profundidade máxima) intactos."
  },
  {
    "id": "primeva_q215",
    "num": 215,
    "title": "A Corrente Abissal para as Ilhas-Cidade",
    "category": "Senhores das Águas & Mar",
    "location": "Fundo da Fossa Abissal (-3950, +150) (`deep447.js`)",
    "actors": "Almirante Varis e Guardiões Abissais",
    "trigger": "Ter o Elmo de Mergulho, Chá de Algas e Poção de Pressão",
    "description": "No ponto mais fundo da fossa oceânica pulsa uma Corrente Abissal — um portal submerso de travessia marítima que liga o Mar de Thalor ao Arquipélago das Ilhas-Cidade.",
    "choicesText": "Suportar a pressão máxima no leito do oceano, derrotar os 3 guardiões de fundo (Lula, Arraia e Homem-Peixe Abissal) e estabilizar a Corrente Abissal.",
    "worldConsequence": "Habilita o teleporte marítimo instantâneo entre o Mar Norte, o Mar Sul e o Arquipélago."
  },
  {
    "id": "primeva_q216",
    "num": 216,
    "title": "O Primeiro Acampamento Sem Rastros",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Clareira da Encosta Oeste",
    "actors": "Batedor Veterano da Ordem",
    "trigger": "Construir Fogueira e Tenda pela primeira vez fora da cidade",
    "description": "Aprenda a lei sagrada do Livro II (Cap. 16): montar sua Fogueira de Pedra, Tenda de Couro, Varal de Secagem e Bancada Rústica, dormir para zerar o Cansaço e depois recolher tudo (`F · GUARDAR ACAMPAMENTO`) deixando a clareira intacta.",
    "choicesText": "Recolher 100% das estruturas antes de partir sem deixar entulho na mata.",
    "worldConsequence": "Concede o bônus 'Explorador Sem Rastros' (+10% de duração do efeito Bem Descansado ao dormir na Tenda Portátil)."
  },
  {
    "id": "primeva_q217",
    "num": 217,
    "title": "A Ciência da Carne Seca e da Salmoura",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Margem do Rio e Varal de Secagem",
    "actors": "Edda (Salineira) e Mira",
    "trigger": "Concluir #216",
    "description": "Comida crua apodrece em 1,5 dia e assada em 3,5 dias. Para sobreviver duas semanas numa Fenda, você precisa curar 5 Carnes Secas no Varal Portátil, costurar o Alforje Curado no Sal (-50% apodrecimento) e abastecer a Caixa de Salmoura do Carrinho (-75%).",
    "choicesText": "Levar um lote de Peixe Defumado e Ração de Expedição intactos até os batedores do Desfiladeiro das Lágrimas.",
    "worldConsequence": "Aumenta permanentemente em +20% a saciedade restaurada por qualquer Carne Seca ou Peixe Defumado."
  },
  {
    "id": "primeva_q218",
    "num": 218,
    "title": "O Lacre de Resina e o Cristal Frio",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Bancada Rústica de Campo",
    "actors": "Aldric e Kael",
    "trigger": "Concluir #217",
    "description": "O Miasma da Fenda acelera o apodrecimento em 2 vezes. Costure a Mochila Térmica com couro duplo e cristal glacial de Ymiria (-80% apodrecimento) e lacre 4 refeições reais dentro do Invólucro de Resina e Fibra (0% de perda).",
    "choicesText": "Abrir o Invólucro de Resina apenas no 10º dia dentro de uma Fenda Profunda antes de enfrentar o Soberano.",
    "worldConsequence": "Comer uma refeição recém-aberta do Invólucro de Resina dentro de uma Fenda concede +25% de Vida máxima e +30% de regeneração de Estamina contra o chefe."
  },
  {
    "id": "primeva_q219",
    "num": 219,
    "title": "A Isca de Carniça contra a Matilha Cega",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Vale Estreito da Fenda de Érebo",
    "actors": "O Narrador e Matilha de Devoradores/Lobos Fendidos",
    "trigger": "Ter 1 Carne Podre (`Isca de Carniça`) na bolsa",
    "description": "Quando uma comida chega a 0% de frescor, ela vira Isca de Carniça. Seis predadores bloqueiam a subida estreita da masmorra-mundo.",
    "choicesText": "Arremessar a Isca de Carniça (`Tecla G`) na depressão lateral para atrair os 6 predadores e passar em Passo Silencioso sem gastar uma única poção.",
    "worldConsequence": "Desbloqueia a conquista tática de Sobrevivência (+2 pontos de Percepção e Agilidade por treino)."
  },
  {
    "id": "primeva_q220",
    "num": 220,
    "title": "Peixe Frito na Beira do Lago",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Lago Cristalino da Floresta",
    "actors": "Cozinheiro do Mercado de Aster",
    "trigger": "Pescar 3 espécies diferentes de peixe (`lakeAt239`)",
    "description": "Acenda sua fogueirinha portátil a menos de 5 metros da margem do lago e frite o peixe recém-pescado na hora sobre a brasa (`alchemy470.js`).",
    "choicesText": "Dividir o peixe frito fumegante com um viajante faminto na estrada.",
    "worldConsequence": "Concede o título 'Pescador das Brasas' (comidas de peixe duram o dobro e dão +15% de resistência ao frio)."
  },
  {
    "id": "primeva_q221",
    "num": 221,
    "title": "O Cantil Congelado de Ymiria",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Trilha Glacial de Ymiria",
    "actors": "Viajante Caído na Neve",
    "trigger": "Viajar para Ymiria com um Cantil Térmico Isolado",
    "description": "Um recruta viajou para o norte apenas com um Odre de Couro Simples; a água congelou lá dentro e ele está morrendo de hipotermia.",
    "choicesText": "Acender uma fogueira imediata, derreter o gelo e dar a ele um gole do seu Chá Térmico do Cantil Térmico Isolado.",
    "worldConsequence": "O recruta salvo entrega o Mapa da Cachoeira Congelada (apontando para um baú de Mithril)."
  },
  {
    "id": "primeva_q222",
    "num": 222,
    "title": "O Alambique na Praia de Thalor",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Praia de Areia Clara de Thalor",
    "actors": "Edda e Oren",
    "trigger": "Acender uma fogueira na praia de Thalor",
    "description": "Conforme o Capítulo 16 do Manuscrito, monte o destilador sobre a fogueira na praia para ferver a água salgada das ondas, condensando água doce pura e extraindo Sal Grosso.",
    "choicesText": "Destilar 10 goles de água pura e abastecer o Navio de Expedição antes de zarpar.",
    "worldConsequence": "Rende +2 pontos de Inteligência por treino e dobre a produção de Sal Grosso em fogueiras costeiras."
  },
  {
    "id": "primeva_q223",
    "num": 223,
    "title": "A Subida Pesada da Garganta",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Ladeira Íngreme da Garganta das Cinzas",
    "actors": "Mercador Doran (`quests480.js`)",
    "trigger": "Puxar o Carrinho de Carga cheio (> 200 kg) na subida",
    "description": "Doran quebrou a roda de sua carroça na subida da serra. Ele precisa que você transporte 8 caixotes pesados no seu próprio Carrinho de Carga até o topo, soltando o carrinho (`F`) quando os salteadores emboscarem no meio da ladeira.",
    "choicesText": "Soltar o carrinho antes do combate para não deixá-lo sofrer dano, vencer os salteadores, consertar qualquer risco com tábuas e entregar a carga no topo.",
    "worldConsequence": "Concede +3 pontos de Força e Resistência por treino de tração e 6000 de ouro."
  },
  {
    "id": "primeva_q224",
    "num": 224,
    "title": "A Briga no Meio da Praça",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Praça de Aster (`vida527.js`)",
    "actors": "Dois Moradores em Discussão e Guarda da Ronda",
    "trigger": "Presenciar uma briga de moradores de dia a menos de 60 metros",
    "description": "Dois artesãos discutem aos gritos no meio da rua por causa de um lote de lenha úmida antes que o guarda chegue para separar.",
    "choicesText": "Separar a briga com diplomacia (+3 de Reputação), tomar o partido do ferreiro ou do padeiro (mudando o afeto dos dois), ou deixar que se engalfinhem.",
    "worldConsequence": "Separar a briga grava fama de Bondade em `profile.fama523`, fazendo os moradores comentarem sua justiça quando você passa."
  },
  {
    "id": "primeva_q225",
    "num": 225,
    "title": "O Segredo do Mendigo do Pátio",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Pátio de Aster / Pousada à Noite (`vida522.js`)",
    "actors": "Velho Mendigo de Aster",
    "trigger": "Dar esmola de 50 de ouro 3 vezes (Afeto 3)",
    "description": "O velho mendigo que dorme perto da pousada era batedor da primeira geração de Aldric. Quando seu afeto chega a 3, ele tenta lhe entregar 150 de ouro que guardou a vida inteira sob uma laje.",
    "choicesText": "Recusar o dinheiro do mendigo ('Guarde para sua coberta e sopa') ou aceitar os 150 de ouro.",
    "worldConsequence": "Recusar o dinheiro concede +10 de Reputação da Ordem, fama de Bondade máxima e a chave de um baú esquecido na Torre Antiga."
  },
  {
    "id": "primeva_q226",
    "num": 226,
    "title": "A Corrida das Crianças na Praça",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Praça de Aster de Dia (`vida527.js`)",
    "actors": "Duas Crianças de Aster (Leo e Nina)",
    "trigger": "Conversar com as crianças correndo de dia",
    "description": "As duas crianças da cidade perderam uma boneca de madeira perto do portão externo e têm medo de sair porque viram um Lobo Sombrio na colina.",
    "choicesText": "Buscar a boneca de madeira fora do portão, consertar o braço dela na Bancada e devolver antes do pôr do sol (quando as crianças vão dormir).",
    "worldConsequence": "Os pais das crianças deixam uma cesta de pães quentes na porta da sua casa todas as manhãs."
  },
  {
    "id": "primeva_q227",
    "num": 227,
    "title": "O Bêbado da Taverna e o Mapa Molhado",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Pousada de Aster à Tarde (`vida523.js`)",
    "actors": "Caçador Bêbado na Pousada",
    "trigger": "Conversar com o bêbado no horário da taverna",
    "description": "Um veterano embriagado está prestes a ser multado pelos guardas por quebrar canecas, mas jura que viu uma arca dourada numa ruína de mármore ao norte.",
    "choicesText": "Pagar uma bebida de 5 de ouro e ajudá-lo a caminhar até sua casa (+2 de Reputação), ou provocá-lo.",
    "worldConsequence": "Ajudá-lo a ir para casa faz ele entregar de manhã, já sóbrio, as coordenadas exatas da Ruína de Mármore com tesouro dobrado."
  },
  {
    "id": "primeva_q228",
    "num": 228,
    "title": "A Multa e a Honra do Guarda",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Portão Leste de Aster (`vida523.js`)",
    "actors": "Guarda de Patrulha",
    "trigger": "Ter uma multa pendente ou conversar com o guarda sobre a lei",
    "description": "Um mercador forasteiro foi multado injustamente em 50 de ouro porque sua carroça assustou as galinhas da praça.",
    "choicesText": "Pagar a multa de 50 de ouro pelo mercador ou provar ao guarda que foi um Pássaro Bravo que rasou a feira.",
    "worldConsequence": "Provar a verdade livra o mercador, que lhe entrega 3 Pergaminhos de Ressurgimento."
  },
  {
    "id": "primeva_q229",
    "num": 229,
    "title": "A Casa Própria no Portão Leste",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Terreno Leste da Cidade (X+46, Z+12)",
    "actors": "Selene e Construtor Municipal",
    "trigger": "Reunir 150.000 de ouro e comprar sua Casa Própria",
    "description": "Adquira sua residência permanente ao lado do portão leste e instale a Cama, o Baú de 20 itens (que sobrevive a qualquer morte), a Estante de Troféus, o Aquário e o Altar de Mana.",
    "choicesText": "Construir primeiro a Sala de Treino (+4% dano) e a Arena de Combate (+1 fúria por golpe), ou a Biblioteca (+5% XP) e a Estufa de Ervas (+8% vida).",
    "worldConsequence": "Sua casa se torna sua base definitiva em Primeva, gerando 3 poções diárias no Altar de Mana e descanso de 80% de cura."
  },
  {
    "id": "primeva_q230",
    "num": 230,
    "title": "O Pombo, o Gato e a Galinha da Praça",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Ruas de Aster de Dia (`spawnCritter`)",
    "actors": "Maela e Bichinhos da Cidade",
    "trigger": "Fazer carinho (`Tecla E`) nos três bichinhos da cidade",
    "description": "Durante os cercos, os gatos, galinhas e pombos da cidade se escondem nos telhados. Um pombo-correio de Thalor pousou ferido com uma cápsula de prata na pata.",
    "choicesText": "Curar o pombo com uma gota de poção de Mira e ler a mensagem urgente vinda do mar.",
    "worldConsequence": "Revela a localização de um navio mercante naufragado cheio de lingotes de aço."
  },
  {
    "id": "primeva_q231",
    "num": 231,
    "title": "A Lenhadora e o Carvalho Gigante",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Serraria do Nível 7 de Aster",
    "actors": "Mestra da Serraria",
    "trigger": "Cidade alcançar Nível 7 (Moinhos e Serraria)",
    "description": "A lâmina da serraria municipal travou num tronco petrificado trazido da borda de uma Fenda.",
    "choicesText": "Usar um Frasco de Ácido para amolecer a crosta de cristal do tronco e destravar a roda d'água.",
    "worldConsequence": "A serraria passa a fornecer 5 Tábuas de Madeira Trabalhada gratuitas por dia para os seus reparos."
  },
  {
    "id": "primeva_q232",
    "num": 232,
    "title": "O Moinho de Vento nas Colinas",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Campos Agrícolas de Aster (Nível 7)",
    "actors": "Moleiro de Aster e Pássaros Bravos",
    "trigger": "Concluir #231",
    "description": "Um bando de Pássaros Bravos (#004) fez ninho nas pás do moinho de vento, impedindo a moagem do trigo para as rações da guarda.",
    "choicesText": "Construir 3 ninhos altos em postes de madeira ao lado do campo para transferir os ovos sem matar as aves.",
    "worldConsequence": "Os Pássaros Bravos passam a caçar insetos e pragas da lavoura, reduzindo o custo de Rações de Expedição pela metade."
  },
  {
    "id": "primeva_q233",
    "num": 233,
    "title": "A Colheita de Cactos Sob Tempestade",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Vale dos Cactos Espinhosos em Zahar (`clear445.js`)",
    "actors": "Herbalista do Oásis",
    "trigger": "Viajar ao deserto com Machado ou Pá",
    "description": "Cortar cactos pela raiz (`F · CORTAR CACTO PELA RAIZ`) fornece Polpa/Água de Cacto, Fibra Árida e Espinhos para armadilhas, mas um Cactoro Gigante (#026) mais velho que as cidades vigia o vale.",
    "choicesText": "Colher apenas os cactos secos da borda sem tocar na reserva de água do Cactoro Gigante, ou atraí-lo para longe da fonte.",
    "worldConsequence": "Garante o Molde de Armadilha de Espinhos Aprimorada (prende e causa sangramento duplo em monstros que pisarem)."
  },
  {
    "id": "primeva_q234",
    "num": 234,
    "title": "A Estrada Limpa para a Carroça",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Rota Sinuosa de Urdan (`clear445.js`)",
    "actors": "Teren e Engenheiro da Ordem",
    "trigger": "Possuir Picareta e Machado",
    "description": "Pedregulhos caídos da encosta vulcânica e tocos velhos estão obrigando a Carroça da Ordem a reduzir a marcha.",
    "choicesText": "Quebrar 5 pedregulhos com a Picareta (`F · QUEBRAR PEDREGULHO`) e arrancar 5 tocos ao longo da curva da serra.",
    "worldConsequence": "As limpezas ficam salvas permanentemente em `run.clear445` e aumentam a velocidade das carroças naquela rota."
  },
  {
    "id": "primeva_q235",
    "num": 235,
    "title": "O Banquete dos Cem Dias",
    "category": "Sobrevivência & Mundo Vivo",
    "location": "Praça Dourada de Aster",
    "actors": "Mira, Kael, Brann, Lyra, Selene e Torvo",
    "trigger": "Ter todas as profissões (Mineração, Forja, Pesca) no Nível 10+",
    "description": "Para celebrar cem dias de sobrevivência desde que você caiu da Fenda na Estrada Sul, você prepara na fogueira central um banquete com ingredientes das 5 regiões de Primeva.",
    "choicesText": "Servir a mesa com todos os companheiros de jornada diante do memorial de Edran.",
    "worldConsequence": "Concede +5% permanentes em todos os ganhos de XP de Profissão e o troféu 'Mestre da Sobrevivência Autônoma'."
  },
  {
    "id": "primeva_q236",
    "num": 236,
    "title": "O Esqueleto Atrás da Cachoeira Congelada",
    "category": "Ecologia & Terras Despertas (Gatilho: Diário em Cadáver)",
    "location": "Sopé do Desfiladeiro das Lágrimas (Livro II, Cap. 26)",
    "actors": "Dois Esqueletos Abraçados na Cabana Soterrada",
    "trigger": "Ler a carta inacabada ao lado do frasco vazio de antídoto na cabana soterrada",
    "description": "Sem nenhum marcador prévio, você entra numa cabana soterrada pela neve e encontra dois esqueletos abraçados junto à lareira apagada. A carta inacabada conta que eles esconderam a herança da família atrás da cachoeira congelada antes que o veneno os matasse.",
    "choicesText": "Seguir as pistas visuais até a cachoeira congelada, quebrar a cortina de gelo e abrir o baú de Mithril.",
    "worldConsequence": "Entrega o Arco Élfico da Geada e 1 peça de Mithril Épica; se levar a carta aos descendentes em Ymiria, ganha +10 de Confiança."
  },
  {
    "id": "primeva_q237",
    "num": 237,
    "title": "A Divisão Noturna da Gosma Verde",
    "category": "Ecologia & Terras Despertas (Bestiário #002)",
    "location": "Borda do Pântano de Verden",
    "actors": "Guarda Assustado e Gosma Verde (#002 / #064 / #126)",
    "trigger": "Ouvir rumor na taverna sobre 'o monstro que volta à noite'",
    "description": "Um recruta cortou uma Gosma Verde ao meio durante o dia e achou que tinha vencido, mas ao cair da noite os três fragmentos se reuniram (`gosma347.js`) junto com uma Gosma Verde Abissal e cercaram o posto.",
    "choicesText": "Impedir fisicamente que os 3 fragmentos separados se toquem durante os 8 segundos noturnos e eliminar cada parte.",
    "worldConsequence": "Desbloqueia o domínio completo da família Gosma no Bestiário (+10% dano contra todas as variantes de Gosma)."
  },
  {
    "id": "primeva_q238",
    "num": 238,
    "title": "Cercado pelos Slimes Rosas",
    "category": "Ecologia & Terras Despertas (Bestiário #001)",
    "location": "Fenda Rasa de Aster",
    "actors": "Batedor Novato e Grupo de Slimes Rosas (#001)",
    "trigger": "Abordagem forçada de um novato saindo do portal",
    "description": "Um Slime Rosa sozinho é inofensivo e pacífico, mas o novato atacou um perto de um bando de oito e agora seu companheiro está sendo sufocado lentamente no fundo da Fenda.",
    "choicesText": "Empurrar os Slimes com habilidade de área sem matar os Slimes Base pacíficos (abatendo apenas o Slime Rosa Fendido #062 que iniciou a fúria), ou limpar todos.",
    "worldConsequence": "Salvar o novato sem massacrar os Slimes pacíficos faz um Slime Rosa manso aparecer perto do jardim da sua casa."
  },
  {
    "id": "primeva_q239",
    "num": 239,
    "title": "O Disparo Cego da Gosma Espinhosa",
    "category": "Ecologia & Terras Despertas (Bestiário #005)",
    "location": "Trilha de Lodo do Pântano",
    "actors": "Mercador Ambulante Doran e Gosma Espinhosa (#005)",
    "trigger": "Encontrar Doran parado imóvel na trilha",
    "description": "Doran pisou num campo de seis Gosmas Espinhosas (#005), que só disparam espinhos de cristal quando sentem vibração de passos ou corrida (`spiky350.js`). Se ele der um passo rápido, morre cravejado.",
    "choicesText": "Aproximar-se em Passo Silencioso (`Ctrl`), provocar o disparo à distância com uma pedra, esquivar no aviso de meio segundo e limpar o caminho na pausa de recarga.",
    "worldConsequence": "Doran salva sua carga e lhe entrega gratuitamente 1 Bolsa de Expansão de Equipamentos."
  },
  {
    "id": "primeva_q240",
    "num": 240,
    "title": "A Moeda na Frente do Cavaleiro Escaravelho",
    "category": "Ecologia & Terras Despertas (Bestiário #006)",
    "location": "Estrada das Dunas de Zahar",
    "actors": "Ferreiro Viajante Ignis e Cavaleiro Escaravelho (#006)",
    "trigger": "Ouvir Ignis chamar (`F para falar`) a 12 metros",
    "description": "Três Cavaleiros Escaravelhos (#006) de carapaça de bronze foram atraídos pelo brilho das armaduras polidas na carroça de Ignis e estão prestes a esmagá-la em linha reta.",
    "choicesText": "Jogar moedas de ouro brilhantes (`Tecla Y`) para o lado do penhasco, fazendo os três besouros investirem na moeda e travarem por 3 segundos na freada (`ecology410.js`).",
    "worldConsequence": "Salva a carroça de Ignis sem um único arranhão e ele tempera gratuitamente sua arma equipada (+8% qualidade)."
  },
  {
    "id": "primeva_q241",
    "num": 241,
    "title": "O Passo que Não Deve Cruzar a Soleira",
    "category": "Ecologia & Terras Despertas (Bestiário #007)",
    "location": "Ruína de Arco Antigo",
    "actors": "Sábio Zephyr e Guardião Corrompido (#007)",
    "trigger": "Encontro emergente no monólito ancestral",
    "description": "O Guardião Corrompido (#007) fica completamente imóvel como uma estátua até que alguém cruze a linha invisível da porta que ele vigiava em vida.",
    "choicesText": "Usar o ângulo da câmera para ler os ladrilhos desgastados do piso e contornar pela janela quebrada para pegar a relíquia sem ativar os 4 guardiões, ou provocá-los à distância um por um.",
    "worldConsequence": "Pegar a relíquia sem despertar o salão inteiro concede +2 pontos de Percepção e o título 'Passo de Sombra'."
  },
  {
    "id": "primeva_q242",
    "num": 242,
    "title": "Quando os Cactoros Levantam ao Entardecer",
    "category": "Ecologia & Terras Despertas (Bestiário #008)",
    "location": "Oásis Seco de Zahar",
    "actors": "Peregrino Perdido e Cactoros (#008 / #076)",
    "trigger": "Chegar ao oásis às 17:30 no relógio do mundo",
    "description": "Durante o dia, os Cactoros (#008) enterram as raízes e parecem cactos comuns; mas exatamente ao entardecer todo o bosque ao redor do peregrino desperta e começa a cuspir espinhos.",
    "choicesText": "Acender um anel de fogo ao redor do peregrino e escoltá-lo para fora da baixada antes que o Cactoro Abissal (#130) feche a saída.",
    "worldConsequence": "O peregrino revela a localização de um reservatório subterrâneo de água pura no deserto."
  },
  {
    "id": "primeva_q243",
    "num": 243,
    "title": "O Cheiro de Sangue e a Chegada do Magote",
    "category": "Ecologia & Terras Despertas (Bestiário #009)",
    "location": "Túnel de Fenda em Érebo",
    "actors": "Caçador Ferido Vael e Magotes (#009 / #077 / #139)",
    "trigger": "Terminar um combate grande perto das rochas altas",
    "description": "Os Magotes (#009) seguem o cheiro de batalha e aparecem rastejando depois que a luta termina para devorar os restos. Vael está caído sem forças enquanto dezenas de larvas de cristal emergem da terra.",
    "choicesText": "Afastar Vael do local das carcaças imediatamente e usar uma Isca de Carniça para atrair o Magote Abissal (#139) para uma armadilha explosiva.",
    "worldConsequence": "Vael entrega o mapa da Arca das Rochas Altas (`quests480.js`) com recompensa dobrada."
  },
  {
    "id": "primeva_q244",
    "num": 244,
    "title": "O Pânico dos Goblins Sem o Bruto",
    "category": "Ecologia & Terras Despertas (Bestiário #048-#052)",
    "location": "Acampamento Saqueador na Floresta",
    "actors": "Refugiados Presos e Bando Goblin Hostil",
    "trigger": "World Encounter Node na Estrada Oeste",
    "description": "Um bando de 8 Goblins Guerreiros e Arqueiros mantém uma família refém. Se você lutar contra os 8 devagar, os arqueiros podem ferir os reféns; mas a ecologia do jogo (`ecology410.js`) dita que todos os goblins fogem em pânico se o Goblin Bruto (#052) cair primeiro.",
    "choicesText": "Usar Passo Sombrio ou Investida para ignorar a linha de frente e abater o Goblin Bruto em 5 segundos.",
    "worldConsequence": "Todo o bando grita `PÂNICO!` e foge sem tocar nos reféns, rendendo +10 de Confiança e um baú intacto."
  },
  {
    "id": "primeva_q245",
    "num": 245,
    "title": "O Grito Noturno da Caveira Fantasma",
    "category": "Ecologia & Terras Despertas (Bestiário #022)",
    "location": "Cemitério Antigo da Fronteira",
    "actors": "Vigia do Cemitério e Caveira Fantasma (#022)",
    "trigger": "Passar pelo cemitério à noite com o Lampião aceso",
    "description": "A Caveira Fantasma (#022) enxerga luzes de longe à noite e seu grito acorda todos os Esqueletos (#042) e Esqueletos Magos (#043) enterrados ao redor.",
    "choicesText": "Apagar o lampião, aproximar-se no escuro guiado apenas pelo brilho da chama fria da Caveira e destruí-la num único golpe crítico antes que ela grite.",
    "worldConsequence": "Impede o despertar de 20 mortos-vivos e preserva os túmulos sagrados da vila (+500 XP e bênção espiritual)."
  },
  {
    "id": "primeva_q246",
    "num": 246,
    "title": "A Fúria do Demônio Chifrudo",
    "category": "Ecologia & Terras Despertas (Bestiário #038)",
    "location": "Garganta de Lava de Urdan",
    "actors": "Dois Caçadores Novatos e Demônio Chifrudo (#038)",
    "trigger": "Encontrar o Demônio Chifrudo ignorando os novatos feridos",
    "description": "O Demônio Chifrudo (#038) desafia apenas os mais fortes e ignora presas com pouca vida (`ecology410.js`). Os dois novatos estão com 10% de vida e salvos por enquanto, mas se você curá-los antes de atrair o demônio, ele os matará.",
    "choicesText": "Entrar na frente com a vida cheia e provocar o Demônio Chifrudo para longe antes de jogar uma poção de cura para os novatos.",
    "worldConsequence": "Salva a dupla de novatos e ganha a insígnia 'Escudo dos Fracos'."
  },
  {
    "id": "primeva_q247",
    "num": 247,
    "title": "Os Gestos Repetidos da Fantasma",
    "category": "Ecologia & Terras Despertas (Bestiário #015)",
    "location": "Casa Queimada da Vila da Fronteira",
    "actors": "Fantasma (#015) de uma Padeira",
    "trigger": "Entrar na ruína da casa queimada à noite",
    "description": "Uma Fantasma (#015) atravessa as paredes repetindo sem parar o último gesto que fez em vida: tentar abrir o forno trancado para tirar a filha que já havia escapado com Edran.",
    "choicesText": "Em vez de atacar a Fantasma, trazer a filha viva (que hoje mora em Aster) até a porta da ruína para que a mãe a veja e descanse em paz.",
    "worldConsequence": "A Fantasma se desfaz em luz dourada sem combate, deixando o Anel da Mãe (+10% cura recebida)."
  },
  {
    "id": "primeva_q248",
    "num": 248,
    "title": "O Último Lobo da Matilha",
    "category": "Ecologia & Terras Despertas (Bestiário #053)",
    "location": "Colinas Nevadas",
    "actors": "Matilha de Lobos Sombrios (#053) e Lobo Fendido (#063)",
    "trigger": "Ser cercado por uma matilha em campo aberto",
    "description": "Os Lobos Sombrios cercam a presa, mas o último lobo ferido foge quando fica sozinho (`ecology410.js`). Porém, este último lobo usa uma coleira de couro de um batedor desaparecido.",
    "choicesText": "Não matar o último lobo quando ele fugir; segui-lo a 25 metros de distância até a caverna onde o batedor ferido está abrigado.",
    "worldConsequence": "Encontra o batedor vivo (que o lobo domesticado tentava defender) e ganha um companheiro lobo no acampamento."
  },
  {
    "id": "primeva_q249",
    "num": 249,
    "title": "O Par de Dinos Caçadores",
    "category": "Ecologia & Terras Despertas (Bestiário #034)",
    "location": "Platô de Cinzas de Urdan",
    "actors": "Caravana de Minério e Par de Dinos (#034)",
    "trigger": "World Encounter Node na Rota Sul",
    "description": "Os Dinos (#034) caçam sempre em pares: um faz barulho na frente para distrair enquanto o segundo ataca pelas costas.",
    "choicesText": "Fingir cair na distração do primeiro Dino e girar com golpe pesado ou armadilha exatamente onde o segundo salta da moita.",
    "worldConsequence": "Quebra a tática do par instantaneamente e rende 4 Couros Grossos de Réptil e 2 Carnes Nobres."
  },
  {
    "id": "primeva_q250",
    "num": 250,
    "title": "A Parede que Respira: O Gigante de Pedra",
    "category": "Ecologia & Terras Despertas (Bestiário #058)",
    "location": "Desfiladeiro de Cristal",
    "actors": "Caravana de Aldric e Gigante de Pedra (#058)",
    "trigger": "Caminhar pelo desfiladeiro estreito",
    "description": "O Gigante de Pedra (#058) de 3,6 metros dorme encostado no paredão, parecendo parte da montanha até alguém passar perto.",
    "choicesText": "Identificar a silhueta dos estratos curvos na parede antes que a caravana passe e guiar os bois pelo desvio silencioso, ou atrair o Gigante para a clareira aberta.",
    "worldConsequence": "Evita o esmagamento da caravana e rende 10 Cristais de Rank A."
  },
  {
    "id": "primeva_q251",
    "num": 251,
    "title": "O Zigue-Zague do Raptor",
    "category": "Ecologia & Terras Despertas (Bestiário #059)",
    "location": "Planície Vulcânica",
    "actors": "Mensageiro a Pé e Raptor Fendido (#087)",
    "trigger": "Ver um mensageiro correndo em linha reta sendo perseguido",
    "description": "O Raptor (#059) caça tudo o que corre em linha reta usando zigue-zague veloz pelos flancos.",
    "choicesText": "Gritar para o mensageiro parar de correr em linha reta e interceptar o Raptor com Quebra-Passo ou Tiro Preciso na virada.",
    "worldConsequence": "O mensageiro entrega a você uma Carta Selada que aponta para uma relíquia esquecida."
  },
  {
    "id": "primeva_q252",
    "num": 252,
    "title": "A Marcha Cega dos Invasores",
    "category": "Ecologia & Terras Despertas (Bestiário #033)",
    "location": "Ponte de Pedra de Solaria",
    "actors": "Coluna de Invasores (#033 / #091)",
    "trigger": "Portal rasgar ao lado da estrada real",
    "description": "Os Invasores (#033) são soldados de outro mundo em armaduras cerâmicas sem rebites que marcham em linha reta seguindo ordens de um general já morto há séculos, ignorando quem sai da frente.",
    "choicesText": "Em vez de enfrentar a coluna de frente na ponte estreita, derrubar as barricadas para que eles marchem direto para o abismo lateral ou atacar pelos flancos.",
    "worldConsequence": "Elimina a coluna inteira sem perder escudo e recupera 5 placas cerâmicas de outro mundo para Kael."
  },
  {
    "id": "primeva_q253",
    "num": 253,
    "title": "A Vingança Eterna do Espectro",
    "category": "Ecologia & Terras Despertas (Bestiário #046)",
    "location": "Ruínas de Ardent",
    "actors": "Mercador Assombrado e Espectro (#046)",
    "trigger": "Mercador abordar você tremendo na pousada",
    "description": "Diferente de todos os outros monstros que desistem a 30 metros, o Espectro (#046) nunca desiste da perseguição porque confunde o mercador com o traidor que o matou na vida passada.",
    "choicesText": "Levar o Espectro até a lápide do verdadeiro traidor no cemitério antigo para que ele reconheça o erro, ou destruí-lo com ataques físicos (já que seu perfil Espectral resiste à magia).",
    "worldConsequence": "Mostrar a lápide liberta o espírito e o mercador lhe dá 10% de participação nos lucros de sua loja."
  },
  {
    "id": "primeva_q254",
    "num": 254,
    "title": "Os Esqueletos Sem Comando",
    "category": "Ecologia & Terras Despertas (Bestiário #042-#044)",
    "location": "Cripta da Colina Central",
    "actors": "Esqueleto Guarda (#044), Esqueleto Mago (#043) e 15 Esqueletos (#042)",
    "trigger": "Entrar na cripta da colina",
    "description": "Os Esqueletos comuns (#042) só têm direção enquanto o Esqueleto Mago ou Guarda estiver de pé (`ecology410.js`); sem eles, vagam sem rumo.",
    "choicesText": "Saltar por cima da barreira do Esqueleto Guarda no corredor e abater o Esqueleto Mago no fundo em 2 golpes.",
    "worldConsequence": "Os 15 Esqueletos comuns perdem o vínculo e desmontam no chão instantaneamente, liberando o sarcófago central."
  },
  {
    "id": "primeva_q255",
    "num": 255,
    "title": "O Glub que Explode de Susto",
    "category": "Ecologia & Terras Despertas (Bestiário #017)",
    "location": "Caverna Úmida da Serra",
    "actors": "Alquimista Aprendiz e Glub (#017)",
    "trigger": "Encontrar o aprendiz encharcado na entrada da caverna",
    "description": "O Glub (#017) é uma bolha d'água com humor imprevisível que explode em respingos quando assustado e se reconstrói depois.",
    "choicesText": "Congelar o Glub no momento exato em que ele se espalha em respingos para recolher a Água Mineral Pura antes que ele se junte.",
    "worldConsequence": "Entrega 3 frascos de Água de Glub (restaura 100% da Estamina instantaneamente)."
  },
  {
    "id": "primeva_q256",
    "num": 256,
    "title": "A Conspiração dos Três Golpes",
    "category": "Ecologia & Terras Despertas (Mecânica Conspirar `conspiracy333.js`)",
    "location": "Acampamento Forte de Goblins Fendidos",
    "actors": "Capitão de Patrulha de Aster",
    "trigger": "Ter defesa física suficiente para sofrer 0 de dano de um monstro comum",
    "description": "Quando um monstro comum acerta você 3 vezes seguidas sem causar dano, ele chama os aliados a até 8 metros, um anel vermelho pulsa e todos atacam juntos somando a força para furar sua defesa.",
    "choicesText": "Provocar propositalmente a conspiração de 4 inimigos e usar esquiva perfeita no instante do golpe sincronizado (`strike`) para ativar Contra-Fluxo em todos eles.",
    "worldConsequence": "Domina a tática anti-conspiração e recebe +3 pontos de Resistência e Agilidade."
  },
  {
    "id": "primeva_q257",
    "num": 257,
    "title": "A Aposta de Bebida na Taverna de Thalor",
    "category": "Ecologia & Terras Despertas (Inspiração Skyrim: *A Night to Remember*)",
    "location": "Pousada de Thalor → Topo do Farol de Ymiria",
    "actors": "Marinheiro Misterioso 'Velho Sal'",
    "trigger": "Aceitar beber três canecas de Hidromel da Fenda na pousada de Thalor",
    "description": "Você aceita uma aposta de bebida com um velho marinheiro risonho em Thalor. A tela escurece e você acorda no dia seguinte no alto da neve de Ymiria, sem botas, com uma Alpaca Real (#028) amarrada ao poste, um recibo de casamento com uma estátua e suas botas penhoradas num ferreiro anão.",
    "choicesText": "Rastrear passo a passo a noite perdida: devolver a Alpaca Real aos Pastores do Velo Dourado, recuperar suas botas no ferreiro e descobrir que o 'Velho Sal' era um espírito brincalhão da Primeira Era.",
    "worldConsequence": "Recupera suas botas aprimoradas em +2 níveis gratuitamente e ganha o Cajado da Ressaca Rúnica."
  },
  {
    "id": "primeva_q258",
    "num": 258,
    "title": "O Tabuleiro Mental do Antigo Escriba",
    "category": "Ecologia & Terras Despertas (Inspiração Skyrim: *The Mind of Madness*)",
    "location": "Beco Silencioso de Solaria → Fenda Onírica",
    "actors": "Rasgado Enlouquecido (Soren) e o Narrador",
    "trigger": "Conversar com Soren murmurando sozinho perto da fonte de Solaria",
    "description": "Soren ouviu vozes demais durante a queda na Fenda e sua mente criou um bolsão dimensional próprio onde os medos dele viraram golens reais. Ao tocar o ombro dele, você é puxado para dentro da memória de Soren.",
    "choicesText": "Resolver os três traumas de Soren sem matar as projeções da família dele (usando apenas escudos, curas e apaziguamento).",
    "worldConsequence": "Cura a mente de Soren, que desperta lúcido como um mestre encantador na praça de Solaria (-15% custo de encantamento)."
  },
  {
    "id": "primeva_q259",
    "num": 259,
    "title": "O Cão que Falava na Estrada",
    "category": "Ecologia & Terras Despertas (Inspiração Skyrim: *A Clavicus Vile Tale*)",
    "location": "Encruzilhada da Floresta de Verden",
    "actors": "Lobo Sombrio Manso ('Cinza') e Altar Esquecido",
    "trigger": "Ser abordado na estrada por um Lobo Sombrio que não ataca e caminha à sua frente latindo",
    "description": "Um Lobo Sombrio Base guia você até um santuário coberto de hera onde a voz de um antigo campeão preso numa espada tenta convencê-lo a sacrificar o lobo para destravar o poder total da lâmina.",
    "choicesText": "Recusar sacrificar o lobo e quebrar a pedra de prisão para manter o animal vivo ao seu lado, ou aceitar a oferta da espada.",
    "worldConsequence": "Poupar o lobo concede a Máscara da Lealdade (+10% preços melhores e +1 invocação aliada); sacrificar entrega o Machado Amaldiçoado."
  },
  {
    "id": "primeva_q260",
    "num": 260,
    "title": "A Casa Abandonada do Segundo Anel",
    "category": "Ecologia & Terras Despertas (Investigação de Horror)",
    "location": "Casa Trancada no Segundo Anel de Aster",
    "actors": "Vigilante da Ordem e Altar de Sombra",
    "trigger": "Ouvir dois moradores sussurrando sobre barulhos numa casa fechada",
    "description": "Uma casa antiga no segundo anel treme à noite: um ex-mercador de Dorian deixou um transmissor de Fenda ligado no porão que tenta possuir objetos da casa.",
    "choicesText": "Entrar à noite com o vigilante, resistir à voz que manda você atacar seu aliado e destruir o cristal negro do porão.",
    "worldConsequence": "Limpa a maldição do bairro e transforma a casa numa biblioteca pública para os moradores de Aster."
  },
  {
    "id": "primeva_q261",
    "num": 261,
    "title": "A Mulher Sem Memória no Oásis",
    "category": "Ecologia & Terras Despertas (Dilema Moral)",
    "location": "Pousada do Oásis de Zahar",
    "actors": "Lyanna (Camponesa) e Caçadores de Recompensa de Solaria",
    "trigger": "Ser abordado por caçadores perguntando por uma mulher de cicatriz no pulso",
    "description": "Caçadores de Solaria afirmam que Lyanna fugiu após abrir acidentalmente um portal que destruiu uma fazenda; Lyanna jura que foi incriminada por um oficial corrupto que trabalha exatamente com aqueles caçadores.",
    "choicesText": "Investigar o acampamento dos caçadores para encontrar a ordem forjada e emboscar o oficial corrupto, ou entregar Lyanna pela recompensa imediata.",
    "worldConsequence": "Provar a inocência de Lyanna salva sua vida, rende o Anel da Verdade e expulsa os mercenários corruptos de Zahar."
  },
  {
    "id": "primeva_q262",
    "num": 262,
    "title": "O Crime da Meia-Noite no Cais",
    "category": "Ecologia & Terras Despertas (Detetive)",
    "location": "Docas de Thalor",
    "actors": "Guarda Portuário e 3 Suspeitos",
    "trigger": "Encontrar um barril de cristais arrombado no cais",
    "description": "O barril de cristais do farol foi arrombado sem quebrar o cadeado. Há três suspeitos: um aprendiz do Clã Ferrugem, um marinheiro bêbado e um escriba do porto.",
    "choicesText": "Examinar as mãos dos três suspeitos (procurando o pó luminescente azul que só sai com salmoura) para apontar o escriba.",
    "worldConsequence": "Evita a prisão injusta do goblin do Clã Ferrugem e fortalece a aliança entre Torvo e o Almirante Varis."
  },
  {
    "id": "primeva_q263",
    "num": 263,
    "title": "A Árvore que Chora Resina Dourada",
    "category": "Ecologia & Terras Despertas (Natureza Sagrada)",
    "location": "Santuário Antigo de Verden",
    "actors": "Peregrino Druida e Lenhador Ambicioso",
    "trigger": "Ouvir diálogo na estrada de Verden",
    "description": "Para curar a muda da árvore sagrada de uma vila vizinha, você precisa da seiva da Árvore Dourada. Se cortar a raiz com violência, a árvore revida invocando Reis Cogumelos Fendidos; se for acompanhado do peregrino e fizer a oferenda de água limpa, ela solta uma muda viva.",
    "choicesText": "Fazer o ritual pacífico da muda viva com o peregrino ou cortar a casca à força.",
    "worldConsequence": "Plantar a muda viva na vila faz uma nova árvore gigante crescer no centro da praça em 7 dias de jogo."
  },
  {
    "id": "primeva_q264",
    "num": 264,
    "title": "O Fantasma do Batedor da Primeira Era",
    "category": "Ecologia & Terras Despertas (Ruína Ancestral)",
    "location": "Ruína de Mármore na Serra Norte (`encontros502.js`)",
    "actors": "Espírito do Batedor Kaelen I",
    "trigger": "Ler o diário em um esqueleto ao lado da Ruína de Mármore",
    "description": "Ao abrir o diário do esqueleto, o espírito do batedor aparece e caminha à sua frente apontando três colunas tombadas onde seus companheiros caíram séculos atrás.",
    "choicesText": "Seguir o espírito pelas três colunas, derrotar a Aranha Gigante Abissal (#174) que profanava os ossos e enterrar as três insígnias.",
    "worldConsequence": "O espírito aponta um compartimento secreto no pedestal de mármore com um equipamento Lendário."
  },
  {
    "id": "primeva_q265",
    "num": 265,
    "title": "O Duelo dos Dois Irmãos Ferreiros",
    "category": "Ecologia & Terras Despertas (NPCs de Vila)",
    "location": "Vila da Rocha Clara (Pé da Serra Oeste)",
    "actors": "Irmãos Ferreiros Bram e Torg",
    "trigger": "Separar uma discussão na frente da forja da vila",
    "description": "Bram diz que a melhor espada leva núcleo de fogo de Urdan; Torg diz que leva cristal glacial de Ymiria. Eles pedem que você teste as duas lâminas contra um Golem de Pedra Fendido (#089).",
    "choicesText": "Testar as duas lâminas no combate real e mostrar que fundir os dois metais numa liga equilibrada supera ambos.",
    "worldConsequence": "Os irmãos voltam a trabalhar juntos e criam a Espada Bimetálica de Gelo e Brasa para você."
  },
  {
    "id": "primeva_q266",
    "num": 266,
    "title": "A Criança que Viu a Mão no Céu",
    "category": "Ecologia & Terras Despertas (Lore & Mundo Vivo)",
    "location": "Vila Costeira ao Norte de Thalor",
    "actors": "Menino Téo (`vida527.js`) e Mira",
    "trigger": "Falar com a criança olhando para o céu perto da praia",
    "description": "Téo é uma criança nativa que, após sobreviver a uma ruptura costeira, desenha na areia o formato exato dos cinco dedos da Mão do Arquiteto antes mesmo de uma Fenda se abrir.",
    "choicesText": "Proteger a vila no ponto exato que o desenho de Téo apontou na praia antes que o portal abra.",
    "worldConsequence": "Impede que a vila sofra qualquer dano na invasão e Aldric passa a estudar o dom premonitório dos nativos."
  },
  {
    "id": "primeva_q267",
    "num": 267,
    "title": "A Colmeia Blindada do Moinho Velho",
    "category": "Ecologia & Terras Despertas (Bestiário #016 & #029)",
    "location": "Campos Floridos do Leste",
    "actors": "Apicultor dos Campos e Abelha Rainha Blindada (#029)",
    "trigger": "World Encounter Node nos Campos Floridos",
    "description": "Uma Abelha Rainha Blindada (#029) instalou sua colmeia de quitina no teto do moinho velho. As Abelhas Blindadas (#016) patrulham as flores e avisam as outras com um zumbido grave.",
    "choicesText": "Usar uma tocha com ervas calmantes para colher a Geleia Real sem matar a Rainha Base, ou destruir a colmeia Fendida ao lado que estava irritando o enxame.",
    "worldConsequence": "Destruir apenas a colmeia Fendida acalma a Rainha Base, que passa a produzir Geleia Real diária (+20% recuperação de Estamina)."
  },
  {
    "id": "primeva_q268",
    "num": 268,
    "title": "O Caçador que Virou Presa",
    "category": "Ecologia & Terras Despertas (Gatilho: Carta em Covil)",
    "location": "Covil das Rochas Altas na Floresta (`encontros502.js`)",
    "actors": "Caçador Arrogante preso em teia",
    "trigger": "Vasculhar uma mochila caída na entrada do covil",
    "description": "Um caçador que zombava de você na taverna de Aster entrou sozinho num covil de Tecelãs de Vidro (#118 - Aranha Fendida) e está pendurado no teto prestes a virar banquete.",
    "choicesText": "Cortar a teia e salvá-lo sem cobrar nada, ou exigir que ele entregue sua capa de gala em troca do resgate.",
    "worldConsequence": "Salvá-lo sem cobrar muda completamente o diálogo dele em Aster: ele passa a defender seu nome nas tavernas e pagar rodadas."
  },
  {
    "id": "primeva_q269",
    "num": 269,
    "title": "O Segredo das Sete Almas do Demônio",
    "category": "Ecologia & Terras Despertas (Bestiário #047)",
    "location": "Cratera Sul de Urdan",
    "actors": "Oráculo dos Vestígios e Demônio Fendido (#109)",
    "trigger": "Alcançar Nível 55",
    "description": "Onde o Demônio (#047) pisa, a terra queima e abre caminho para outros demônios. Um ritual antigo está prestes a abrir sete fendas menores em círculo.",
    "choicesText": "Congelar ou purificar as pegadas de brasa do primeiro Demônio antes que elas alcancem o centro do círculo.",
    "worldConsequence": "Interrompe a invocação em cadeia e entrega 5 Núcleos de Rank S."
  },
  {
    "id": "primeva_q270",
    "num": 270,
    "title": "O Refugiado com Febre da Fenda",
    "category": "Ecologia & Terras Despertas (Gatilho: Ponto Vivo `gatilhos508.js`)",
    "location": "Acampamento de Beira de Estrada",
    "actors": "Refugiado Doente e Curandeiro do Clã",
    "trigger": "Encontrar refugiado tossindo junto a uma fogueira apagada",
    "description": "Um viajante escapou por um triz de uma Fenda Corrompida (com o modificador 'Sem Cura') e seu corpo continua rejeitando poções comuns.",
    "choicesText": "Acender uma fogueira ao lado dele, preparar um Chá de Flor-da-Abóbada quente e escoltá-lo até o acampamento do Círculo do Micélio.",
    "worldConsequence": "Inicia a cadeia de gratidão do clã: o refugiado recuperado vira o intendente do seu acampamento avançado."
  },
  {
    "id": "primeva_q271",
    "num": 271,
    "title": "A Mensagem no Corpo do Mensageiro",
    "category": "Ecologia & Terras Despertas (Gatilho: Carcaça na Estrada)",
    "location": "Passagem Sul da Serra (`ridge513`)",
    "actors": "Carcaça de Mensageiro Real (`encontros502.js`)",
    "trigger": "Vasculhar os restos mortais ao lado da carroça quebrada",
    "description": "As costelas e o escudo partido de um mensageiro de Solaria guardam um cilindro de chumbo com a senha de um cofre submerso no lago central.",
    "choicesText": "Levar a insígnia do mensageiro à família dele em Solaria antes de abrir o cofre no fundo do lago.",
    "worldConsequence": "A família agradece entregando a chave complementar que dobra o ouro dentro do cofre submerso."
  },
  {
    "id": "primeva_q272",
    "num": 272,
    "title": "O Duelo entre Dois Clãs na Clareira",
    "category": "Ecologia & Terras Despertas (Gatilho: Evento Presenciado `gatilhos508.js`)",
    "location": "Fronteira entre Campos e Floresta",
    "actors": "Patrulha do Clã Ferrugem vs. Guerreiros Quebra-Rocha",
    "trigger": "Presenciar o confronto na clareira fora da estrada",
    "description": "Um mal-entendido sobre uma caça abatida colocou Goblins do Clã Ferrugem e Orcs Quebra-Rocha de armas em punho.",
    "choicesText": "Entrar no meio antes do primeiro golpe, oferecer 2 Carnes Assadas da sua própria bolsa para dividir o banquete ou desafiar os dois líderes para um Duelo de Honra amigável.",
    "worldConsequence": "Reconcilia os dois clãs na região e concede +10% de ataque físico por 300 segundos sempre que passar por lá."
  },
  {
    "id": "primeva_q273",
    "num": 273,
    "title": "A Caravana Cercada na Chuva",
    "category": "Ecologia & Terras Despertas (Gatilho: Evento Presenciado)",
    "location": "Estrada Real de Verden sob Chuva",
    "actors": "Carroça da Ordem (`civic343.js`) e Bando de Sapos Fendidos (#078)",
    "trigger": "Passar pela estrada enquanto a carroça sofre emboscada",
    "description": "A roda da carroça de Teren atolou na lama da chuva enquanto Sapos Guerreiros Fendidos saltam do brejo.",
    "choicesText": "Abater os atacantes sem deixar a barra de integridade da carroça cair abaixo de 80%.",
    "worldConsequence": "Paga ouro imediato, concede +5 de Confiança e reduz a Escassez de Verden em 3 pontos."
  },
  {
    "id": "primeva_q274",
    "num": 274,
    "title": "O Mensageiro Expresso de Lyra",
    "category": "Ecologia & Terras Despertas (Gatilho: Mensageiro na Rota `gatilhos508.js`)",
    "location": "Qualquer Rota Real após subir de Rank",
    "actors": "Mensageiro Expresso da Ordem (`Povo482`)",
    "trigger": "Subir de Rank na Ordem ou abrir o baú de um covil grande",
    "description": "Enquanto você caminha pela estrada, um batedor corre até você chamando seu nome e entrega uma carta urgente selada por Lyra: uma Fenda Rara de Classe Secreta acabou de pulsar na região vizinha.",
    "choicesText": "Seguir imediatamente as coordenadas da carta antes que a tempestade de éter mude de lugar.",
    "worldConsequence": "Garante entrada direta num Portal do Juramento da Âncora com chance dobrada de peça faltante do conjunto."
  },
  {
    "id": "primeva_q275",
    "num": 275,
    "title": "Os Guardas Contra o Colosso na Porta",
    "category": "Ecologia & Terras Despertas (Gatilho: Evento Presenciado)",
    "location": "Portão Norte de Ymiria",
    "actors": "Guardas de Ymiria e Colosso Rachado (#065)",
    "trigger": "Aproximar-se a 100 metros do portão de Ymiria",
    "description": "Três guardas da muralha estão lutando desesperadamente contra um Colosso Rachado (#065) que desceu da geleira.",
    "choicesText": "Intervir imediatamente usando Provocação ou Golpe de Escudo para puxar o aggro do Colosso e salvar os três guardas.",
    "worldConsequence": "Os guardas sobreviventes prestam continência sempre que você passa e abrem um contrato especial no mural de Ymiria."
  },
  {
    "id": "primeva_q276",
    "num": 276,
    "title": "O Mistério das Sete Ruínas de Mármore",
    "category": "Ecologia & Terras Despertas (Arqueologia das Terras Despertas)",
    "location": "As 7 Grandes Ruínas de Mármore do Continente (`encontros502.js`)",
    "actors": "Aldric e Guardiões Antigos",
    "trigger": "Abrir o primeiro Baú Relicário de Mármore",
    "description": "As colunatas imperiais de mármore marfim espalhadas pelo continente faziam parte de uma única estrada processional da Primeira Era antes de o relevo ser dobrado pela queda do Arquiteto.",
    "choicesText": "Visitar e catalogar os capitéis esculpidos das 7 ruínas de mármore sem destruir nenhuma estátua antiga.",
    "worldConsequence": "Reconstitui no Diário a história do Império de Mármore e concede a Relíquia Regional **Olho do Cronista** (+5% de XP permanente)."
  },
  {
    "id": "primeva_q277",
    "num": 277,
    "title": "A Mina Tomada pelos Cristais Vivos",
    "category": "Ecologia & Terras Despertas (Economia Viva)",
    "location": "Mina Externa de Solaria (`vida486.js`)",
    "actors": "Mineradora Chefe e Golens de Mana Fendidos (#107)",
    "trigger": "Seguir uma mineradora até a entrada da mina",
    "description": "A mineradora da cidade entra na mina e sai correndo assustada: um veio de cristal acordou três Golens de Mana Fendidos (#107) que ficam mais fortes perto dos cristais.",
    "choicesText": "Atrair os Golens de Mana para fora da boca da mina (longe dos veios de cristal) antes de abatê-los.",
    "worldConsequence": "A produção mineral de Solaria dobra e a mineradora lhe entrega 10 Cristais do seu Rank atual."
  },
  {
    "id": "primeva_q278",
    "num": 278,
    "title": "O Anão e a Elfa na Carroça",
    "category": "Ecologia & Terras Despertas (Viajantes das Estradas `vida486.js`)",
    "location": "Portão Sul de Aster",
    "actors": "Viajante Anão de Ymiria e Viajante Elfa de Verden",
    "trigger": "Abordar a carroça de viajantes recém-chegada ao portão",
    "description": "Um ferreiro anão do norte e uma arquearia elfa do sudeste vieram na mesma carroça até Aster para propor uma liga de madeira-ferro, mas perderam o baú de amostras na curva do desfiladeiro.",
    "choicesText": "Recuperar o baú de amostras na garganta sul (`desfiladeiro510.js`) entre os pinheiros gigantes.",
    "worldConsequence": "Eles fabricam para você o Arco Composto de Pinho Boreal e Aço (ou um Braçal Élfico-Anão se você for classe corpo a corpo)."
  },
  {
    "id": "primeva_q279",
    "num": 279,
    "title": "O Canto das Sereias de Coral",
    "category": "Ecologia & Terras Despertas (Lenda Costeira)",
    "location": "Recifes Bioluminescentes de Thalor",
    "actors": "Bento e Espíritos do Naufrágio",
    "trigger": "Navegar à noite sobre os corais bioluminescentes",
    "description": "Luzes azuis cantam debaixo d'água onde a primeira frota de refugiados afundou cem anos atrás.",
    "choicesText": "Mergulhar até o convés iluminado e tocar o sino de bronze do navio para encerrar a vigília dos marinheiros mortos.",
    "worldConsequence": "Acalma as águas daquele trecho costeiro e revela um depósito perpétuo de Ostras Gigantes."
  },
  {
    "id": "primeva_q280",
    "num": 280,
    "title": "A Forja de Magma do Eremita",
    "category": "Ecologia & Terras Despertas (Encontro Emergente `quests480.js`)",
    "location": "Borda do Rio de Lava de Urdan",
    "actors": "Ferreiro Eremita do Vulcão",
    "trigger": "Encontrar o eremita batendo metal sobre uma rocha incandescente",
    "description": "Um velho ferreiro que se recusou a viver atrás de muralhas tenta temperar uma lâmina diretamente na garganta de um Dragonete Fendido (#102).",
    "choicesText": "Segurar o Dragonete Fendido com controle/atordoamento no momento do sopro para que o eremita mergulhe a lâmina no fogo vivo.",
    "worldConsequence": "O eremita entrega a lâmina recém-temperada com dano de fogo puro."
  },
  {
    "id": "primeva_q281",
    "num": 281,
    "title": "O Mago da Tempestade na Chuva",
    "category": "Ecologia & Terras Despertas (Encontro Emergente de Clima `quests480.js`)",
    "location": "Colina Aberta durante Tempestade (`WX.type === 'rain'`)",
    "actors": "Mago da Tempestade Errante",
    "trigger": "Explorar colinas abertas enquanto chove",
    "description": "Um mago solitário que só aparece durante chuvas fortes tenta canalizar um relâmpago natural num pára-raios rúnico, mas o pulso elétrico atrai uma onda de Redemoinhos Abissais (#145).",
    "choicesText": "Proteger o mago por 45 segundos na chuva sem sair do círculo condutor.",
    "worldConsequence": "Concede uma bênção de +15% de velocidade de movimento e +10% de dano elétrico até o fim da estação."
  },
  {
    "id": "primeva_q282",
    "num": 282,
    "title": "A Bruxa do Pântano e o Caldeirão Negro",
    "category": "Ecologia & Terras Despertas (Encontro Emergente `quests480.js`)",
    "location": "Cabana Isolada de Verden",
    "actors": "Velha Herbalista do Brejo",
    "trigger": "Encontrar a cabana fumegante no pântano profundo",
    "description": "A velha herbalista conhece o segredo para transformar veneno de Vespa Rainha Abissal (#179) em um elixir que amplia a resistência universal, mas seu caldeirão foi roubado por Orcs Fendidos.",
    "choicesText": "Recuperar o caldeirão de ferro fundido e colher 3 bolsas de veneno fresco.",
    "worldConsequence": "Entrega o Elixir da Casca Negra (+2 pontos de Vontade por treino e +50% resistência a veneno)."
  },
  {
    "id": "primeva_q283",
    "num": 283,
    "title": "O Náufrago da Ilha Flutuante",
    "category": "Ecologia & Terras Despertas (Encontro Costeiro `quests480.js`)",
    "location": "Ilhota de Rocha Flutuante de Thalor (`m434`)",
    "actors": "Náufrago preso no alto da rocha",
    "trigger": "Avistar fumaça de socorro numa ilhota costeira",
    "description": "Uma anomalia gravitacional da 3ª Pedra-Âncora ergueu uma ilhota rochosa 12 metros acima das ondas com um pescador preso no topo.",
    "choicesText": "Subir pelos degraus de rocha escalando com Estamina, derrotar as Arraias do Vazio que cercam o topo e descer o pescador de corda até o seu barco.",
    "worldConsequence": "O pescador entrega a Pérola Negra da Fossa e 5000 de ouro."
  },
  {
    "id": "primeva_q284",
    "num": 284,
    "title": "A Expedição Perdida na Nevasca",
    "category": "Ecologia & Terras Despertas (Encontro de Neve `quests480.js`)",
    "location": "Tundra Norte de Ymiria",
    "actors": "Três Exploradores Congelados",
    "trigger": "Seguir o sinal de uma tocha apagando na neve",
    "description": "Três cartógrafos de Ymiria ficaram sem lenha a 400 metros da muralha com as pernas congeladas (`cold441`).",
    "choicesText": "Montar uma Fogueira de Pedra imediatamente ao lado deles e entregar 3 Feixes de Lenha do seu inventário.",
    "worldConsequence": "Salva a expedição inteira e adiciona ao seu mapa todos os veios de cristal da tundra norte."
  },
  {
    "id": "primeva_q285",
    "num": 285,
    "title": "O Segredo das Cinco Moedas do Primeiro Rei",
    "category": "Ecologia & Terras Despertas (Coleção Histórica)",
    "location": "As 5 Regiões das Capitais",
    "actors": "Aldric e Selene",
    "trigger": "Encontrar a primeira moeda antiga num baú de deserto",
    "description": "Antes da Primeira Ruptura, o Primeiro Rei cunhou cinco moedas de ouro estrelado entregues aos fundadores das cinco cidades que depois receberiam as Pedras-Âncora.",
    "choicesText": "Reunir as 5 moedas nas ruínas de Ymiria, Zahar, Thalor, Urdan e Verden e montá-las no medalhão real de Aster.",
    "worldConsequence": "Ativa o bônus completo da Relíquia Regional **Moeda do Primeiro Rei** (+8% de ouro de todos os monstros permanentemente)."
  },
  {
    "id": "primeva_q286",
    "num": 286,
    "title": "O Juramento da Pedra do Bastião",
    "category": "Ecologia & Terras Despertas (Relíquia Regional)",
    "location": "Muralha Antiga da Fronteira",
    "actors": "Brann e Espírito do Primeiro Comandante",
    "trigger": "Ter Confiança 50+ em Aster e visitar a ruína da primeira muralha",
    "description": "Antes das Três Muralhas atuais de Aster, houve um forte menor onde o primeiro comandante segurou a linha por três dias sozinho.",
    "choicesText": "Sustentar a Defesa do Núcleo naquela ruína por 60 segundos contra 4 ondas sem deixar o núcleo sofrer um único ponto de dano.",
    "worldConsequence": "Concede a Relíquia Regional **Pedra do Bastião** (+10% de Escudo máximo permanente)."
  },
  {
    "id": "primeva_q287",
    "num": 287,
    "title": "O Caçador de Cem Espécies",
    "category": "Ecologia & Terras Despertas (Domínio do Bestiário `bestiary294.js`)",
    "location": "Todo o Continente e Fendas",
    "actors": "Lyra e Aldric",
    "trigger": "Descobrir pelo menos 100 das 200 fichas do Bestiário",
    "description": "O Bestiário estilo Pokédex (`bestiary294.js`) libera a descrição com 1 abate, a alimentação com 10, o comportamento com 50 e o habitat com 100.",
    "choicesText": "Entregar a Lyra o relatório comportamental de 20 espécies em suas três variantes (Base, Fendida e Abissal).",
    "worldConsequence": "Ativa em dobro o efeito da passiva **Leitura de Combate** (+1% de dano contra a espécie a cada 50 abates, até +10%)."
  },
  {
    "id": "primeva_q288",
    "num": 288,
    "title": "A Provação do Centésimo Nível",
    "category": "Ecologia & Terras Despertas (Provação de Classe)",
    "location": "Santuário de Provação de Aster",
    "actors": "Mestre da Provação da sua Classe",
    "trigger": "Alcançar o Nível 100",
    "description": "A cada 100 níveis após a evolução do nível 30, a Ordem convoca o Viajante para a Arena de Provação: 3 ondas de elite seguidas pelo Mestre da Provação da sua própria vocação.",
    "choicesText": "Vencer o Mestre da Provação usando apenas as técnicas da sua classe principal.",
    "worldConsequence": "Concede +15% de dano e vida acumulados, +3 pontos de habilidade e o título 'Mestre' da sua evolução."
  },
  {
    "id": "primeva_q289",
    "num": 289,
    "title": "O Transbordo de Dez Minutos",
    "category": "Ecologia & Terras Despertas (Quebra de Masmorra)",
    "location": "Qualquer Fenda Limpa em Transbordo",
    "actors": "O Narrador",
    "trigger": "Permanecer dentro de uma Fenda após a limpeza quando começa o Transbordo",
    "description": "Quando uma masmorra termina, a saída se abre mas ondas infinitas cada vez mais fortes começam a jorrar do vazio (`brkBest`).",
    "choicesText": "Resistir 30 segundos, 1 minuto e finalmente 10 minutos inteiros dentro do Transbordo antes de cruzar a saída.",
    "worldConsequence": "Concede em sequência os três títulos lendários: **Resistente** (escudo recarrega 30% mais rápido), **Inabalável** (esquiva 15% mais rápida) e **Imortal** (regenera 1% de vida por segundo)."
  },
  {
    "id": "primeva_q290",
    "num": 290,
    "title": "O Túmulo de Quem Caiu Antes",
    "category": "Ecologia & Terras Despertas (Memória de Morte `grave192`)",
    "location": "Local de uma Queda Anterior no Mundo",
    "actors": "Voz do Narrador",
    "trigger": "Retornar ao ponto onde um Viajante caiu em combate",
    "description": "Em Primeva, a terra guarda a marca de quem tombou lutando. Uma espada fincada na pedra guarda 20% do ouro perdido e uma lembrança.",
    "choicesText": "Recuperar o espólio do túmulo e vencer o monstro elite que rondava o local da queda.",
    "worldConsequence": "Recupera o ouro acrescido de um bônus de Vontade ('Quem levanta depois da queda conhece o peso do chão')."
  },
  {
    "id": "primeva_q291",
    "num": 291,
    "title": "O Portal Encomendado Acima do Limite",
    "category": "Ecologia & Terras Despertas (Desafio de Alto Risco `lux267.js`)",
    "location": "Arredores de Aster",
    "actors": "Lyra e Tecelão da Ordem",
    "trigger": "Encomendar um Portal 1 Rank acima do seu (custo 1,2 H)",
    "description": "Você investe ouro para forçar a abertura controlada de uma Fenda um ranque inteiro acima da sua graduação atual.",
    "choicesText": "Entrar sozinho (ou contratando 2 Mercenários de Elite por 2,5 H) e derrotar o Soberano de ranque superior.",
    "worldConsequence": "Garante saque de equipamento do ranque superior (que pode ser equipado livremente sem trava de rank) e +200 de Reputação."
  },
  {
    "id": "primeva_q292",
    "num": 292,
    "title": "A Sombra da Reencarnação",
    "category": "Ecologia & Terras Despertas (Ciclo de Poder)",
    "location": "Altar do Nexo em Aster",
    "actors": "O Narrador e Lyra",
    "trigger": "Alcançar o Nível 100+ e considerar a Reencarnação voluntária",
    "description": "O Nexo permite que um Viajante no auge do nível 100 reinicie seu nível para 1 mantendo seu Rank, suas Casas, seu Banco e ganhando +10% permanente no pool de bônus e treino 10% mais rápido.",
    "choicesText": "Realizar o ritual da Primeira Reencarnação diante do Nexo.",
    "worldConsequence": "Concede +10% permanente de poder, +50 andares de teto simbólico e acelera o ganho dos 9 atributos por treino."
  },
  {
    "id": "primeva_q293",
    "num": 293,
    "title": "A Guilda Própria nas Terras Despertas",
    "category": "Ecologia & Terras Despertas (Fundação de Guilda)",
    "location": "Sede da Ordem em Aster",
    "actors": "Lyra, Brann e Selene",
    "trigger": "Alcançar Nível 50 e reunir 8 H do seu Rank em ouro",
    "description": "Você deixa de ser apenas um membro avulso da Ordem e funda seu próprio Clã/Guilda oficial dentro de Aster, escolhendo estandarte, lema e foco.",
    "choicesText": "Dedicar sua Guilda à Caçada de Soberanos (+bônus de XP/dano em Fendas) ou à Prosperidade Comercial (+bônus de ouro em contratos e vendas).",
    "worldConsequence": "Funda sua Guilda permanente no save e adiciona estandartes com as suas cores na entrada da sua casa."
  },
  {
    "id": "primeva_q294",
    "num": 294,
    "title": "Os Cinco Dragões sob a Mesma Lua",
    "category": "Ecologia & Terras Despertas (Caçada Lendária `dragoes510.js`)",
    "location": "Os 5 Biomas do Continente",
    "actors": "Brann, Aldric e Ordem da Escama Dourada",
    "trigger": "Ter abatido pelo menos 1 exemplar de cada uma das 5 espécies de Dragão de mundo aberto",
    "description": "Em uma única semana do calendário do mundo, você rastreia e enfrenta o Dragonete, o Dragão Gélido de Ymiria, a Serpe de Zahar, o Dragão-Musgo de Verden e o Dragão Ancião.",
    "choicesText": "Forjar com Kael o Brasão das Cinco Escamas usando os 5 troféus.",
    "worldConsequence": "Reduz em 25% todo o dano elemental recebido de qualquer sopro dracônico ou feitiço de chefe."
  },
  {
    "id": "primeva_q295",
    "num": 295,
    "title": "O Segredo do Fundo do Lago de Aster",
    "category": "Ecologia & Terras Despertas (Isca de Missão Diversa)",
    "location": "Lago de Pesca de Aster",
    "actors": "Mira e Guardião Submerso da Primeira Era",
    "trigger": "Ouvir rumor sobre 'luzes azuis no fundo do lago de Aster à meia-noite'",
    "description": "Mergulhando até o fundo do lago de Aster à meia-noite com o Elmo de Mergulho, você descobre que o Nexo da praça tem uma raiz de cristal que desce até uma câmara subaquática esquecida.",
    "choicesText": "Limpar os parasitas abissais grudados na raiz inferior do Nexo sem danificar o cristal.",
    "worldConsequence": "O brilho do Nexo na praça de Aster fica mais intenso e a água do lago passa a curar ferimentos leves ao nadar."
  },
  {
    "id": "primeva_q296",
    "num": 296,
    "title": "O Último Diário do Primeiro Ciclo",
    "category": "Ecologia & Terras Despertas (Lore Profunda do Narrador)",
    "location": "Câmara Oculta na Abóbada Primordial",
    "actors": "O Narrador e Aldric",
    "trigger": "Encontrar todas as 15 Cartas e Diários do mundo aberto (`gatilhos508.js`)",
    "description": "Ao reunir os 15 relatos perdidos nas estradas e ruínas, forma-se o mapa da câmara onde o próprio Narrador dormiu na noite anterior à batalha em que perdeu o corpo físico.",
    "choicesText": "Ler a carta de despedida que o Narrador escreveu quando ainda era humano e entregá-la a Lyra.",
    "worldConsequence": "O Narrador agradece com voz embargada, muda seu tom para Cúmplice Leal máximo e concede +5 em todos os 9 atributos."
  },
  {
    "id": "primeva_q297",
    "num": 297,
    "title": "As Duzentas Presenças: O Mestre do Bestiário",
    "category": "Ecologia & Terras Despertas (Completude 200/200)",
    "location": "Biblioteca de Aster",
    "actors": "Aldric, Lyra e Mira",
    "trigger": "Registrar todas as 200 criaturas no Bestiário (61 Base + 61 Fendidas + 61 Abissais + 4 da Fenda + 13 Chefes)",
    "description": "Você completou o feito que nenhum batedor jamais alcançou: viu, estudou e sobreviveu a todas as 200 presenças catalogadas no Livro Oficial de Primeva.",
    "choicesText": "Assinar seu nome como Coautor de Campo na capa do Grimório Oficial de Aster.",
    "worldConsequence": "Concede o título mítico **Historiador das Duzentas Presenças** (+10% de dano universal contra todas as criaturas do jogo e +20% de chance de drop raro)."
  },
  {
    "id": "primeva_q298",
    "num": 298,
    "title": "A Prova Secreta da Estrela (`★`)",
    "category": "Ecologia & Terras Despertas (Ascensão Máxima)",
    "location": "Santuário da Ressonância / Templo Estelar",
    "actors": "O Examinador Supremo",
    "trigger": "Alcançar Nível 260, Rank SS+, 20.000 de Reputação e Juramento da Âncora concluído",
    "description": "Além do Rank SS+ existe o ranque que a Ordem não imprime nos quadros comuns: o Rank Aço-Estrela (`★`, escala de arma 850, unidade H = 360.000 de ouro). O Examinador Supremo aguarda em duelo direto sem ondas e sem saída.",
    "choicesText": "Vencer o Examinador Supremo provando domínio de ataque, defesa, aparo e Juramento da Âncora.",
    "worldConsequence": "Promove você ao **Rank Aço-Estrela (`★`)**, acende a auréola estelar sobre sua cabeça e libera todas as armas e armaduras Estrela na forja de Kael."
  },
  {
    "id": "primeva_q299",
    "num": 299,
    "title": "O Guardião do Horizonte de Cem Quilômetros",
    "category": "Ecologia & Terras Despertas (Marco Continental)",
    "location": "Topo da Terceira Muralha de Aster (Livro II, Cap. 27)",
    "actors": "Brann, Lyra, Kael, Mira, Selene, Aldric e Torvo",
    "trigger": "Ter visitado todas as 25 cidades/vilas, as 6 Capitais e os 5 Outros Mundos",
    "description": "De pé no alto da terceira muralha ao pôr do sol, você enxerga a Torre da Vigília Antiga, o brilho glacial de Ymiria ao norte, o Farol de Thalor a oeste, as dunas de Zahar a leste e as colunas de Urdan e Verden ao sul.",
    "choicesText": "Acender o Farol Central do Nexo que conecta visualmente todas as 5 Pedras-Âncora no horizonte.",
    "worldConsequence": "Concede o título **Senhor das Terras Despertas** (viagem de carroça e barco instantânea opcional e +15% em todos os atributos)."
  },
  {
    "id": "primeva_q300",
    "num": 300,
    "title": "Histórias que Nunca Terminam: O Pacto do Motor Vivo",
    "category": "Ecologia & Terras Despertas (Transição para o Motor Infinito)",
    "location": "Mesa de Mapas de Lyra e Quadro das 6 Capitais",
    "actors": "Chanceler Lyra, Sábio Aldric e o Narrador",
    "trigger": "Disponível a qualquer momento (e consagrado ao concluir a 300ª missão)",
    "description": "Lyra abre um novo livro em branco sobre a mesa de carvalho: mesmo com as grandes crônicas registradas, as Terras Despertas continuam respirando. A cada dia que passa no relógio, a cada estação que vira e a cada escolha que você faz, novas histórias nascem nas estradas, nas vilas, nos clãs e nas Fendas.",
    "choicesText": "Ativar o **Motor de Histórias e Contratos Vivos** no Livro de Lyra para receber missões procedurais infinitas moldadas pelo estado real do seu mundo.",
    "worldConsequence": "Conecta permanentemente as 300 missões fixas ao **Motor Procedural de Missões Infinitas (`Radiant Primeva Engine`)**, garantindo que Primeva nunca fique sem histórias inéditas para viver."
  }
];

  // v541: peças expostas para tools/contratos541.js montar contratos de verdade no mundo
  Object.assign(API, { REGIONS, CLANS, MARGIN_NPCS, CREATURES_BY_BIOME, TRIGGERS, ARCHETYPES, mulberry32 });

  // 6. Gerador de Nova Missão Infinita Contextualizada
  API.generateQuest = function (seedOffset) {
    const r = global.run || { level: 1 };
    const prof = global.profile || { rank: 0 };
    const day = Math.floor((prof.dayT || 0) / 3600) + 1;
    const baseSeed = (day * 7919) + ((r.level || 1) * 104729) + ((API.historyCount + (seedOffset || 0)) * 3571);
    const rng = mulberry32(baseSeed);

    const region = pick(rng, REGIONS);
    const clan = pick(rng, CLANS);
    const npc = pick(rng, MARGIN_NPCS);
    const trigger = pick(rng, TRIGGERS);
    const pool = CREATURES_BY_BIOME[region.biome] || CREATURES_BY_BIOME.campos;
    const mob = pick(rng, pool);
    const arch = pick(rng, ARCHETYPES);

    const rankIdx = Math.max(0, Math.min(9, prof.rank || 0));
    const scaleGold = [1, 3, 6, 14, 30, 70, 160, 380, 600, 900][rankIdx] || 1;
    const gold = Math.round(85 * scaleGold);
    const rep = Math.round(15 + rankIdx * 12);
    const count = Math.round(4 + (rankIdx % 4));

    const angle = rng() * Math.PI * 2;
    const dist = Math.round(180 + rng() * 240);
    const tx = Math.round(region.x + Math.cos(angle) * dist);
    const tz = Math.round(region.z + Math.sin(angle) * dist);

    const ctx = { region, clan, npc, trigger, mob, gold, rep, count, tx, tz };

    const quest = {
      id: 'radiant_' + baseSeed,
      code: arch.code,
      title: arch.title(ctx),
      trigger: trigger,
      regionId: region.id,
      regionName: region.name,
      biome: region.biome,
      targetX: tx,
      targetZ: tz,
      enemyKind: mob.id,
      enemyName: mob.name,
      needCount: count,
      gotCount: 0,
      rewardGold: gold,
      rewardRep: rep,
      description: arch.desc(ctx),
      choices: [
        { id: 'A', label: typeof arch.choiceA.label === 'function' ? arch.choiceA.label(ctx) : arch.choiceA.label, effect: arch.choiceA.effectText(ctx), run: () => arch.choiceA.apply(ctx) },
        { id: 'B', label: typeof arch.choiceB.label === 'function' ? arch.choiceB.label(ctx) : arch.choiceB.label, effect: arch.choiceB.effectText(ctx), run: () => arch.choiceB.apply(ctx) }
      ]
    };

    API.historyCount++;
    return quest;
  };

  // 7. Gera um lote de 3 contratos vivos para o Mural/Diário sem repetição de arquétipo
  API.generateBoard = function () {
    const out = [];
    const used = new Set();
    let offset = 1;
    while (out.length < 3 && offset < 30) {
      const q = API.generateQuest(offset++);
      if (!used.has(q.code)) {
        used.add(q.code);
        out.push(q);
      }
    }
    API.active = out;
    return out;
  };

  // 7.1. Gerador específico de Missão Dentro da Fenda (disparado ao entrar num Portal / Fenda)
  API.generateRiftQuest = function (gateObj) {
    const q = API.generateQuest(Math.floor(Math.random() * 100) + 500);
    const riftArchs = ARCHETYPES.filter(a => a.insideRift);
    if (riftArchs.length) {
      const r = global.run || { level: 1 };
      const prof = global.profile || { rank: 0 };
      const rankIdx = Math.max(0, Math.min(9, (gateObj && gateObj.rank !== undefined) ? gateObj.rank : (prof.rank || 0)));
      const scaleGold = [1, 3, 6, 14, 30, 70, 160, 380, 600, 900][rankIdx] || 1;
      const gold = Math.round(110 * scaleGold);
      const rep = Math.round(20 + rankIdx * 15);
      const region = REGIONS[rankIdx % REGIONS.length];
      const clan = CLANS[rankIdx % CLANS.length];
      const npc = MARGIN_NPCS[rankIdx % MARGIN_NPCS.length];
      const pool = CREATURES_BY_BIOME[region.biome] || CREATURES_BY_BIOME.campos;
      const mob = pool[rankIdx % pool.length];
      const arch = riftArchs[(API.historyCount++) % riftArchs.length];
      const ctx = { region, clan, npc, trigger: 'Evento Interno ao Entrar na Fenda / Portal', mob, gold, rep, count: 5, tx: 0, tz: 0 };
      const rq = {
        id: 'rift_quest_' + Date.now(),
        code: arch.code,
        insideRift: true,
        title: arch.title(ctx),
        trigger: 'Ao atravessar o Portal da Fenda',
        regionId: region.id,
        regionName: region.name,
        biome: region.biome,
        enemyKind: mob.id,
        enemyName: mob.name,
        needCount: 5,
        gotCount: 0,
        rewardGold: gold,
        rewardRep: rep,
        description: arch.desc(ctx),
        choices: [
          { id: 'A', label: typeof arch.choiceA.label === 'function' ? arch.choiceA.label(ctx) : arch.choiceA.label, effect: arch.choiceA.effectText(ctx), run: () => arch.choiceA.apply(ctx) },
          { id: 'B', label: typeof arch.choiceB.label === 'function' ? arch.choiceB.label(ctx) : arch.choiceB.label, effect: arch.choiceB.effectText(ctx), run: () => arch.choiceB.apply(ctx) }
        ]
      };
      API.activeRiftQuest = rq;
      return rq;
    }
    return q;
  };

  // 7.2. Filtra todas as missões fixas do catálogo de 300 que acontecem DENTRO de Fendas / Portais / Outros Mundos
  API.getFixedRiftQuests = function () {
    return (API.FIXED_300_QUESTS || []).filter(q =>
      /fenda|portal|érebo|erebo|xylo|pyra|nifl|kemet|outro mundo|transbordo|abóbada|abobada/i.test(
        (q.location || '') + ' ' + (q.title || '') + ' ' + (q.category || '') + ' ' + (q.trigger || '')
      )
    );
  };

  // 8. Integração automática com Quests480 se presente no jogo
  if (global.QUEST_CATALOG && typeof global.QUEST_CATALOG === 'object') {
    const initial = API.generateBoard();
    initial.forEach(q => {
      global.QUEST_CATALOG[q.id] = q;
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);