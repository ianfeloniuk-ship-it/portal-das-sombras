/* Dados portáveis da campanha; cinemáticas históricas não são executadas. */
window.SOLO_RPG_STORY = {
  "version": "narrativa-v5-2026-10-05",
  "title": "",
  "status": "Campanha central completa em prosa. Capítulos integrados ao Diário; missões físicas novas e escolhas dramatizadas ainda não são sistemas implementados.",
  "acts": [
    {
      "id": "act_01",
      "title": "I — O Chamado",
      "objective": "Chegar a Aster e procurar respostas sobre a travessia.",
      "steps": [
        "Registrar a travessia de {nome} no Diário.",
        "Ajudar o guarda ferido na estrada e alcançar a muralha.",
        "Registrar o nome com Lyra e conhecer a Ordem."
      ],
      "evidence": "Outros viajantes também chegaram de mundos diferentes. O mundo de origem pode continuar em perigo.",
      "consequence": "{nome} recebe abrigo e uma primeira direção para investigar os portais.",
      "diary": "Cheguei a Aster depois que uma Fenda alcançou meu mundo. Uma voz me orientou na estrada. Por um instante, pareceu esperar uma resposta de outra pessoa. Lyra conhece outros viajantes como eu.",
      "prerequisites": [],
      "sourceAct": 1
    },
    {
      "id": "act_02",
      "title": "II — O Diário de Aldric",
      "objective": "Recuperar as anotações de Aldric e retirar sobreviventes da estrada.",
      "steps": [
        "Encontrar Brann e acompanhar a patrulha.",
        "Localizar o transporte interrompido pela Fenda.",
        "Resgatar os sobreviventes e levar os registros à Ordem."
      ],
      "evidence": "Aldric anotou marcas semelhantes em passagens de lugares diferentes. Dois relatos descrevem a mesma inscrição com datas incompatíveis; ele aponta a Torre Antiga para conferir a diferença.",
      "consequence": "A recuperação da rota devolve mantimentos a Aster. A investigação segue para a Torre.",
      "diary": "Aldric desapareceu numa passagem vermelha. Suas anotações ligam os portais a uma construção antiga. Há uma inscrição repetida em relatos de épocas diferentes; ainda pode ser erro de registro.",
      "prerequisites": [
        "act_01"
      ],
      "sourceAct": 2
    },
    {
      "id": "act_03",
      "title": "III — A Torre Antiga",
      "objective": "Investigar a Torre e comparar suas inscrições com os registros de Aldric.",
      "steps": [
        "Entrar preparado nos andares acessíveis.",
        "Registrar uma inscrição que se repete nas passagens.",
        "Comparar o achado com as anotações da Ordem."
      ],
      "evidence": "A construção antecede a abertura geral das Fendas. Seus registros repetem uma tentativa de contenção em épocas que os arquivos de Aster não conseguem conciliar.",
      "consequence": "A exploração deixa de ser apenas uma busca por força: observar as marcas produz conhecimento.",
      "diary": "A Torre é mais antiga que os portais atuais. Encontrei inscrições parecidas com as descritas por Aldric, mas as datas não concordam. Ao vê-las, a voz disse: “Vocês chegaram a esta parte.” Não explicou quem mais estava ouvindo.",
      "prerequisites": [
        "act_02"
      ],
      "sourceAct": 3
    },
    {
      "id": "act_04",
      "title": "IV — As Marcas",
      "objective": "Identificar a origem das marcas impostas aos guardiões.",
      "steps": [
        "Comparar inscrições de guardiões de Fendas diferentes.",
        "Levar as evidências a Lyra.",
        "Investigar o nome que aparece nos registros: Arquiteto."
      ],
      "evidence": "As criaturas não pertencem todas ao mesmo povo ou mundo. As marcas sugerem uma intervenção comum.",
      "consequence": "A Ordem passa a investigar quem usa criaturas e passagens como parte de uma operação.",
      "diary": "Lyra associou as marcas ao Arquiteto. Ainda precisamos entender o que ele faz com os guardiões e o que procura aqui.",
      "prerequisites": [
        "act_03"
      ],
      "sourceAct": 4
    },
    {
      "id": "act_05",
      "title": "V — O Retorno",
      "objective": "Ajudar Aldric em seu retorno e conferir o que descobriu.",
      "steps": [
        "Encontrar o veterano que retornou ferido.",
        "Levá-lo a Mira e ouvir seu relato.",
        "Comparar suas evidências com as marcas já registradas."
      ],
      "evidence": "Aldric viu que o Arquiteto usa caçadores fortes como recurso. Evoluir exige preparo para resistir à manipulação.",
      "consequence": "A resistência revê suas expedições e reconhece o valor de retirada, preparo e resgate.",
      "diary": "Aldric voltou vivo. Atravessar e ganhar poder não garante segurança: o Arquiteto também observa quem se fortalece.",
      "prerequisites": [
        "act_04"
      ],
      "sourceAct": 5
    },
    {
      "id": "act_06",
      "title": "VI — As Muralhas",
      "objective": "Defender a cidade, sustentar a rota de remédios e reparar suas proteções.",
      "steps": [
        "Levar os suprimentos de Mira à rota ameaçada.",
        "Ajudar Brann a reunir materiais para reparar a defesa.",
        "Participar da contenção da invasão e procurar sobreviventes."
      ],
      "evidence": "Os ataques insistem em pontos específicos, mesmo quando existem alvos mais fáceis.",
      "consequence": "A defesa e os resgates preservam vidas e abastecimento. Danos realmente ocorridos orientam o trabalho de reconstrução.",
      "diary": "Os ataques seguem um padrão. Aster tem pessoas e rotas que dependem da resistência. Minhas ações também deixam consequências aqui.",
      "prerequisites": [
        "act_05"
      ],
      "sourceAct": 6
    },
    {
      "id": "act_07",
      "title": "VII — O Topo",
      "objective": "Alcançar o mapa no topo da Torre e investigar rotas entre mundos.",
      "steps": [
        "Concluir a subida ao andar 100 conforme as provas disponíveis.",
        "Examinar o mapa de mundos fragmentados.",
        "Comparar seus sinais com a lembrança da ruptura do mundo de {nome}."
      ],
      "evidence": "O mapa liga muitos mundos atingidos. Certas rotas ocupam o mesmo lugar em registros de épocas incompatíveis. Uma semelhança de sinais ainda não confirma o destino do mundo natal.",
      "consequence": "A investigação ganha escala. Voltar para casa passa a exigir compreender o estado das rotas.",
      "diary": "O mapa mostra mundos rompidos e caminhos sobrepostos que não cabem numa única sequência de datas. O Narrador reconheceu uma rota antes de eu apontá-la. Ele diz que não pode confirmar o destino da minha casa.",
      "prerequisites": [
        "act_06"
      ],
      "sourceAct": 7
    },
    {
      "id": "act_08",
      "title": "VIII — O Clã Ferrugem",
      "objective": "Ouvir Torvo e ajudar a proteger a rota dos refugiados.",
      "steps": [
        "Encontrar os caçadores do Clã Ferrugem.",
        "Distinguir os protetores dos saqueadores que usam o mesmo nome.",
        "Ajudar no resgate e registrar o testemunho de Torvo."
      ],
      "evidence": "Seu povo fugiu há cem anos de um mundo esvaziado pelo Arquiteto. Ele recolhe seres e usa alguns nas passagens.",
      "consequence": "A resistência encontra aliados e compreende o custo de perder uma terra natal.",
      "diary": "Torvo conhece o Arquiteto pelo que ele deixou para trás. O Clã é dividido; a espécie de alguém não determina a quem essa pessoa protege.",
      "prerequisites": [
        "act_07"
      ],
      "sourceAct": 8
    },
    {
      "id": "act_09",
      "title": "IX — As Capitais",
      "objective": "Relacionar os ataques às cinco Pedras-Âncora e organizar a defesa.",
      "steps": [
        "Comparar os registros das cinco capitais com Lyra.",
        "Localizar os sinais de pressão em cada Âncora.",
        "Reforçar as defesas e conter ameaças onde realmente surgirem."
      ],
      "evidence": "Depois do resgate antigo, sobreviventes e Transmigradores usaram as técnicas da Torre para separar o corpo do Arquiteto em cinco partes, cada uma presa numa capital. Aster estabiliza a rede; não contém uma sexta parte.",
      "consequence": "Preservar as Âncoras passa a ter um motivo claro. Nenhuma capital é destruída automaticamente pelo roteiro.",
      "diary": "Os registros das capitais explicam como a resistência formou as cinco prisões depois da primeira abertura. As Pedras-Âncora são antigas, mas seu uso para prender o corpo é posterior ao resgate. Fechar uma Fenda não recaptura uma peça fugitiva.",
      "prerequisites": [
        "act_08"
      ],
      "sourceAct": 9
    },
    {
      "id": "act_10",
      "title": "X — Pedaços de Deus",
      "objective": "Enfrentar Logos e aproveitar o alívio para investigar uma ligação primordial.",
      "steps": [
        "Preparar-se para a ameaça de Logos.",
        "Vencer o encontro e registrar o fragmento encontrado.",
        "Usar a redução temporária dos portais perigosos para organizar a expedição."
      ],
      "evidence": "A influência do Arquiteto atravessa as passagens com o corpo dividido. Seu fragmento de Logos não é outra peça física. A promessa de retorno exige abandonar uma defesa; a imagem oferecida não prova uma rota segura para casa.",
      "consequence": "A vitória cria uma oportunidade de investigação e defesa; suas perdas anteriores permanecem relevantes.",
      "diary": "Logos revelou parte da influência do Arquiteto. Precisamos investigar enquanto a pressão sobre os portais diminuiu.",
      "prerequisites": [
        "act_09"
      ],
      "sourceAct": 10
    },
    {
      "id": "act_11",
      "title": "XI — A Mão do Arquiteto",
      "objective": "Investigar o Portal Primordial e retirar a equipe com as provas.",
      "steps": [
        "Entrar com preparo e uma rota de retirada.",
        "Observar a mão projetada e recuperar registros da abertura antiga.",
        "Retornar com os sobreviventes e confrontar as divergências."
      ],
      "evidence": "A primeira ruptura seguiu a morte de um guardião de contenção. Os registros distinguem abertura de uma passagem, projeção da mente e libertação completa: fenômenos relacionados, mas diferentes.",
      "consequence": "A equipe encontra provas para exigir a verdade do Narrador. O destino de Aldric não é alterado para impor uma morte.",
      "diary": "A mão era uma projeção, não uma parte física fora da prisão. Encontrei registros do resgate e do selo rompido. Abrir as Fendas permitiu a influência do Arquiteto atravessar; ainda não foi sua libertação completa.",
      "prerequisites": [
        "act_10"
      ],
      "sourceAct": 11
    },
    {
      "id": "act_12",
      "title": "XII — O Narrador",
      "objective": "Confrontar o Narrador, entender a ameaça entre realidades e decidir como continuar a resistência.",
      "steps": [
        "Apresentar ao Narrador as provas da abertura antiga.",
        "Ler a confissão no Diário e perguntar quem mais ouve a voz.",
        "Conferir as orientações da voz com os registros de Aldric, da Torre e da Ordem antes de decidir a defesa."
      ],
      "evidence": "O Narrador matou o Primeiro Guardião para resgatar desaparecidos. A descarga destruiu seu corpo e dispersou sua alma pelas passagens. Desde então, tenta impedir o Arquiteto em inúmeras realidades e tempos, acompanhando outros Transmigradores. Se o inimigo alcançar a libertação completa em uma única realidade, poderá destruir todas. Os superiores continuam desconhecidos.",
      "consequence": "{nome} conhece a extensão da ameaça e participa das decisões. A confiança precisa ser reconstruída por ações; não há perdão automático nem promessa de vitória universal.",
      "diary": "A voz que me acompanha também orienta outros Transmigradores. O Narrador carrega lembranças de tentativas em realidades e tempos diferentes. Ele abriu as passagens ao derrubar o Primeiro Guardião; agora tenta impedir a libertação completa do Arquiteto em qualquer realidade. Defender Aster importa para todas as outras. Sua experiência não é conhecimento de tudo, e ouvir sua confissão não resolve minha confiança. A partir de agora, suas lembranças precisam ser comparadas com sinais deste mundo: uma rota lembrada pode existir em outra realidade. A confiança se reconstrói por provas e ações.",
      "prerequisites": [
        "act_11"
      ],
      "sourceAct": 12
    },
    {
      "id": "act_13",
      "title": "XIII — Quem Fechou a Porta",
      "objective": "Conter as partes do Arquiteto e impedir que Aster se torne o caminho para sua libertação completa.",
      "steps": [
        "Conter cada parte que tenha escapado: derrotar seu corpo e devolvê-lo à Âncora.",
        "Se as cinco partes se reunirem, enfrentar o Arquiteto antes de alcançar Aster.",
        "Registrar o resultado real e cuidar das perdas e da reconstrução."
      ],
      "evidence": "As cinco Âncoras prendem o corpo neste mundo; Aster é o nexo separado. Reunir as partes e alcançar Aster rompe a continuidade local. A libertação completa do inimigo permitiria que a ameaça alcançasse todas as realidades.",
      "consequence": "A contenção preventiva recebe um encerramento próprio; o confronto e o Fim do Ciclo dependem do que realmente aconteceu. Narrador e Clã não entram no combate contra o chefe.",
      "diary": "Conter o Arquiteto aqui mantém uma passagem fechada entre as realidades. A resistência precisa preservar as Âncoras ou impedir sua chegada a Aster se as partes se reunirem. Se a cidade for perdida, a continuidade deste mundo se rompe e começa o Fim do Ciclo. A ameaça às outras realidades torna cada tentativa de contenção necessária.",
      "prerequisites": [
        "act_12"
      ],
      "sourceAct": 13
    }
  ],
  "cinematics": {
    "intro": {
      "id": "intro_transmigration_v1",
      "summary": "Meu mundo não conhecia magia e começou a romper. Uma Fenda me levou durante o desastre e alterou minha capacidade de evoluir. Cheguei a Aster; ainda preciso descobrir o que aconteceu com quem ficou.",
      "scenes": [
        {
          "id": "intro_home",
          "visual": "home",
          "caption": "No mundo de {nome}, ninguém conhecia magia. Havia uma vida antes das Fendas.",
          "duration": 12
        },
        {
          "id": "intro_crack",
          "visual": "crack",
          "caption": "A primeira rachadura apareceu acima dos telhados. Depois vieram os desaparecimentos. Ninguém sabia como impedir aquilo.",
          "duration": 18
        },
        {
          "id": "intro_crossing",
          "visual": "crossing",
          "caption": "{nome} tentou alcançar a porta. A passagem atravessou a parede e o chão. Outras silhuetas caíam dentro dela.",
          "duration": 18
        },
        {
          "id": "intro_changed",
          "visual": "changed",
          "caption": "Durante a travessia, a Fenda alterou algo em sua alma. A capacidade de evoluir começava ali, antes que pudesse compreendê-la.",
          "duration": 14
        },
        {
          "id": "intro_aster",
          "visual": "aster",
          "caption": "Quando {nome} abriu os olhos, as estrelas estavam nos lugares errados. Adiante havia uma muralha: Aster.",
          "duration": 20
        }
      ]
    },
    "narrator": {
      "id": "narrator_memory_v1",
      "summary": "O Narrador procurou desaparecidos, resgatou pessoas e matou o Primeiro Guardião sem conhecer a função do selo. Sua queda abriu as Fendas. A descarga destruiu seu corpo e dispersou a alma, deixando a voz. Sua memória não explica tudo que o Arquiteto fez depois.",
      "scenes": [
        {
          "id": "memory_traces",
          "visual": "traces",
          "caption": "“Fui atrás dos desaparecidos.” O homem que se tornaria o Narrador encontrou uma rachadura e seguiu um pedido de socorro.",
          "duration": 14
        },
        {
          "id": "memory_captives",
          "visual": "captives",
          "caption": "“Encontrei gente viva.” Os sobreviventes estavam atrás de uma barreira. Um guardião se colocava entre eles e a saída.",
          "duration": 18
        },
        {
          "id": "memory_guardian",
          "visual": "guardian",
          "caption": "Ele lutou para alcançar as pessoas. O golpe final derrubou o guardião. As marcas que o ligavam ao selo se apagaram.",
          "duration": 20
        },
        {
          "id": "memory_breach",
          "visual": "breach",
          "caption": "A barreira abriu. Os sobreviventes escaparam, enquanto a rachadura crescia e outras Fendas se espalhavam pelo mundo.",
          "duration": 18
        },
        {
          "id": "memory_soul",
          "visual": "soul",
          "caption": "A descarga atingiu quem estava junto ao núcleo. Seu corpo se desfez; sua alma foi dispersa pelas passagens.",
          "duration": 15
        },
        {
          "id": "memory_voice",
          "visual": "voice",
          "caption": "“Tem alguém aí?” No escuro, restou a voz. “Quando percebi o que tinha aberto, eu já não tinha mãos para fechar.”",
          "duration": 17
        }
      ]
    }
  },
  "sideQuests": [
    {
      "id": "lyra_names",
      "npc": "Lyra",
      "title": "Os nomes que chegaram",
      "objective": "Recuperar três registros legíveis de viajantes e conferir seus relatos com a Ordem.",
      "consequence": "Pessoas resgatadas e outros Transmigradores passam a aparecer nas conversas; pistas de travessia alimentam o Diário."
    },
    {
      "id": "mira_route",
      "npc": "Mira",
      "title": "A rota dos remédios",
      "objective": "Proteger ou recuperar uma carga de remédios na estrada e devolvê-la ao destino indicado.",
      "consequence": "A rota abastecida ajuda feridos. Se houver perda real da carga, a tarefa de recuperação parte desse estado, sem matar automaticamente personagens."
    },
    {
      "id": "brann_wall",
      "npc": "Brann",
      "title": "A muralha que fica",
      "objective": "Reunir materiais adequados e reparar o trecho de defesa ameaçado.",
      "consequence": "Reparo e cerco usam o estado real das defesas existentes; vitória e dano orientam as falas e a reconstrução."
    },
    {
      "id": "kael_weapon",
      "npc": "Kael",
      "title": "O que a arma guarda",
      "objective": "Recuperar uma arma abandonada e conferir suas marcas com o ferreiro.",
      "consequence": "A oficina ajuda a interpretar marcas impostas; a arma recorda quem a carregava sem obrigar o protagonista a seguir necromancia."
    },
    {
      "id": "torvo_route",
      "npc": "Torvo",
      "title": "Uma estrada para dois povos",
      "objective": "Distinguir os protetores dos saqueadores e ajudar refugiados a atravessar uma rota segura.",
      "consequence": "O testemunho do Clã revela o recolhimento de mundos. A proteção de rotas e civis não coloca o Clã no combate final."
    },
    {
      "id": "selene_record",
      "npc": "Selene",
      "title": "Quem ainda procura casa",
      "objective": "Conferir registros de viajantes e entregar notícias verificadas a quem aguarda respostas.",
      "consequence": "O registro preserva nomes e demonstra que outras pessoas também procuram retornar."
    },
    {
      "id": "dorian_delivery",
      "npc": "Dorian",
      "title": "A carga sem destino",
      "objective": "Comparar marcas e destinos de uma carga suspeita com os registros da Ordem.",
      "consequence": "Uma pista de recolhimento e ordens externas pode ser verificada fora da memória do Narrador."
    }
  ],
  "endings": [
    {
      "id": "containment",
      "title": "As Âncoras resistiram",
      "condition": "Nenhuma parte livre e a operação invasora contida.",
      "result": "Aster é preservada. O encerramento reconhece defesa e recapturas, sem forçar a reunião do chefe."
    },
    {
      "id": "confrontation",
      "title": "Quem fechou a porta",
      "condition": "As cinco partes se reuniram; o Arquiteto foi derrotado antes de alcançar Aster.",
      "result": "As partes retornam à contenção. A vitória protege este mundo e abre espaço para reconstrução."
    },
    {
      "id": "cycle_end",
      "title": "Fim do Ciclo",
      "condition": "O Arquiteto reunido alcançou Aster.",
      "result": "Aplicar somente a regra real do jogo para Fim do Ciclo; ler esta prévia não altera nem apaga nenhum perfil."
    }
  ],
  "cinematicsStatus": "retiradas_a_pedido_de_Ian_v254; campo cinematics preservado somente como histórico, fora da renderização atual",
  "lore": {
    "start": {
      "title": "A Travessia",
      "text": "Meu mundo não conhecia magia e começou a romper. Uma Fenda me levou durante o desastre e alterou minha capacidade de evoluir. Cheguei a Aster; ainda preciso descobrir o que aconteceu com quem ficou."
    },
    "origin": {
      "title": "Minha chegada a Aster",
      "paragraphs": [
        "No mundo de {nome}, ninguém conhecia magia. Havia uma vida antes das Fendas.",
        "A primeira rachadura apareceu acima dos telhados. Depois vieram os desaparecimentos. Ninguém sabia como impedir aquilo.",
        "{nome} tentou alcançar a porta. A passagem atravessou a parede e o chão. Outras silhuetas caíam dentro dela.",
        "Durante a travessia, a Fenda alterou algo em sua alma. A capacidade de evoluir começava ali, antes que pudesse compreendê-la.",
        "Quando {nome} abriu os olhos, as estrelas estavam nos lugares errados. Adiante havia uma muralha: Aster."
      ]
    },
    "narratorMemory": {
      "title": "A memória do Narrador",
      "paragraphs": [
        "“Fui atrás dos desaparecidos, {nome}. Ouvi gente viva do outro lado de uma rachadura. O Primeiro Guardião impedia a passagem. Eu o matei para tirar aquelas pessoas de lá.”",
        "“O resgate aconteceu. E o selo caiu. A descarga destruiu meu corpo e espalhou o que restava de mim pelas passagens. Quando entendi o que tinha aberto, eu já não tinha mãos para fechar.”",
        "“As Fendas deram caminho à influência do Arquiteto. Isso não era ainda a libertação de tudo que ele é. As cinco Âncoras deste mundo contêm seu corpo; a mão que você viu era uma projeção. Aster é o nexo que ele tenta alcançar.”",
        "“Não acompanhei a formação de todas as prisões. Os registros preservados mostram que sobreviventes, Transmigradores e a primeira resistência usaram os conhecimentos da Torre para conter meu erro. Minha memória não substitui esses documentos.”",
        "“Você perguntou quem mais me ouve. Outros Transmigradores, {nome}. Em outros mundos, em outros tempos. Tentei detê-lo em tantas realidades que não consigo ordenar todas as lembranças.”",
        "“Se ele conseguir se libertar por inteiro em uma única realidade, poderá destruir todas. É por isso que continuo procurando quem possa fechar os caminhos que eu já não consigo tocar.”",
        "“Eu lembro tentativas. Isso não significa que saiba o que acontece em toda parte, nem quem dá ordens a ele. Também não posso dizer que seu mundo natal está salvo. Você tem direito de exigir provas de mim.”",
        "{nome} não oferece perdão automático. A resistência segue com a verdade conhecida e com as decisões compartilhadas com quem terá de viver suas consequências.",
        "Lyra exige que a voz diferencie o que viu, o que lembra e o que deduz. A defesa de Aster continua por uma escolha de {nome}, não como pagamento da dívida do Narrador."
      ]
    },
    "victory": {
      "title": "XIII — Quem Fechou a Porta",
      "text": "{nome} e seus aliados derrotaram o Arquiteto reunido antes de alcançar Aster. As cinco partes voltaram às Âncoras deste mundo. Narrador e Clã Ferrugem cuidaram das rotas e dos sobreviventes, fora do confronto. A cidade preservada tem perdas e reconstrução a fazer conforme os danos da batalha. A vitória fecha esta ofensiva; os superiores desconhecidos não desfazem o que a resistência impediu. A busca por casa continua sem entregar Aster como preço."
    },
    "containment": {
      "title": "XIII — As Âncoras resistiram",
      "text": "{nome} e a resistência contiveram esta ofensiva. O Portal Primordial foi fechado, as cinco capitais estão de pé e não há Âncora aberta, peça livre ou corpo reunido em marcha. Aster foi preservada antes que o Arquiteto pudesse alcançá-la. A vitória pertence também a quem protegeu as rotas, cuidou dos feridos e manteve a cidade habitável. A busca pelo mundo natal continua sem entregar outras pessoas como preço. Novas ameaças ainda precisarão de defesa."
    }
  },
  "continuity": {
    "authorDirection": "Ian: o Narrador acompanha Transmigradores em inúmeras realidades/tempos; libertação em uma realidade ameaça todas.",
    "integrationProposal": "IA: cronologia das prisões reconstruída pelos registros; memória testada por observação; arco de retorno e pertencimento; finais ligados a contenção, confronto e Fim do Ciclo.",
    "gameplayLimit": "Leitura e registro preventivo integrados. A leitura não concede recompensas nem altera morte, reset, classes ou missões físicas.",
    "source": "18-Historia-completa-em-prosa-v5.md; 19-Cronologia-e-regras-da-historia-v5.md"
  },
  "book": {
    "title": "Crônica de Aster",
    "chapters": [
      {
        "id": "act_01",
        "title": "I — O Chamado",
        "paragraphs": [
          "A primeira rachadura apareceu num céu que ninguém pensara em vigiar.",
          "Durante alguns minutos, as pessoas pararam para olhar. Alguém disse que era uma mudança no tempo. Outra pessoa apontou um reflexo de luz. Naquele mundo, magia era uma palavra usada em histórias. Depois, uma janela desapareceu de uma parede. O vidro, a moldura e a mão de quem tentara fechá-la sumiram juntos.",
          "{nome} correu quando o chão começou a ceder.",
          "A porta estava perto. Do outro lado havia alguém chamando, mas o som vinha de direções diferentes a cada passo. A rachadura atravessou a casa antes que fosse possível alcançá-la. Não houve tempo para escolher o que levar, para prometer uma volta ou para saber quem tinha conseguido sair.",
          "Na queda, outras silhuetas surgiram e desapareceram. Algo passou através do peito de {nome}, sem abrir ferida. Uma dor funda chegou com a impressão impossível de que o próprio corpo havia aprendido a guardar uma força que antes não existia.",
          "Então houve terra sob as mãos.",
          "As estrelas estavam nos lugares errados. A estrada tinha marcas de rodas, sangue seco e uma linha de árvores queimadas. Um homem de armadura tentava se levantar ao lado de uma carroça tombada.",
          "— A muralha — disse uma voz, perto demais para pertencer a alguém distante. — Vá para a muralha.",
          "{nome} olhou em volta. Não havia ninguém falando.",
          "O homem caído bateu a mão na lateral da carroça.",
          "— Se consegue andar, empurre isto. Tem gente embaixo.",
          "Seu nome era Edran. Ele segurava uma ferida com a mesma mão que usava para mostrar onde levantar a madeira. Juntos, retiraram duas pessoas. Uma delas tentou voltar pelos pertences. Edran apontou o caminho sem discutir: a luz vermelha que crescia entre as árvores já alcançava as rodas.",
          "{nome} ficou para ajudá-lo a caminhar.",
          "Edran perguntou de onde vinha aquela roupa. A resposta saiu em pedaços: uma casa, o céu aberto, a porta que não fora alcançada. Ele escutou sem surpresa.",
          "— Conte isso a Lyra. Ela registra quem chega.",
          "Perto da muralha, as pernas dele cederam. Mira saiu com dois ajudantes, ajoelhou-se, apertou a ferida e pediu espaço. Edran tentou dizer mais alguma coisa. A mão que segurava a de {nome} afrouxou antes que a frase terminasse.",
          "Dentro de Aster, Lyra abriu um livro. Não perguntou se a história parecia possível. Perguntou o nome de quem precisava de abrigo.",
          "— {nome}.",
          "Ela escreveu, deixou uma linha para a origem e esperou. A linha ficou vazia.",
          "Naquela noite, havia uma cama, uma tigela de caldo e uma muralha entre os vivos e a estrada. {nome} pensou na porta de casa. Depois perguntou a Mira onde seria anotado o nome de Edran."
        ]
      },
      {
        "id": "act_02",
        "title": "II — O Diário de Aldric",
        "paragraphs": [
          "Brann encontrou {nome} observando o portão ao amanhecer.",
          "— Ele fazia a ronda daqui — disse, ao perceber para onde ia o olhar. — Agora preciso de outra pessoa na estrada.",
          "A Ordem da Fenda aceitava gente capaz de lutar, transportar uma carga ou reconhecer a hora de recuar. Lyra explicou as primeiras tarefas enquanto conferia uma lista de mantimentos. Fechar passagens ajudava a cidade. Registrar o que existia do outro lado ajudava a próxima patrulha.",
          "— E voltar para casa? — perguntou {nome}.",
          "Lyra virou o livro. Havia nomes de pessoas que vinham de lugares que não apareciam em nenhum mapa de Aster.",
          "— Se descobrirmos um caminho seguro, você saberá. Até lá, não vou inventar uma resposta.",
          "A primeira expedição seguiu a rota de uma carga atrasada. A carroça estava vazia. Mais adiante, entre duas pedras, encontraram um caderno protegido por um casaco. Na capa, Aldric escrevera o próprio nome e um aviso para devolver os registros à Ordem.",
          "O veterano desaparecera numa passagem vermelha.",
          "As páginas começavam com entregas comuns. Depois vinham relatos de desaparecimentos em estradas onde ainda não havia portais grandes. Aldric desenhara uma inscrição vista numa ruína. Em outra página, copiara o depoimento de um viajante: a mesma inscrição, num lugar semelhante, com uma data que antecedia o nascimento de quem a descrevera.",
          "{nome} chamou a voz.",
          "— Você conhece isto?",
          "— A Torre — respondeu ela. — Ele estava procurando a Torre.",
          "— Eu não perguntei o que ele procurava.",
          "A voz demorou.",
          "— Conheço partes.",
          "Um ruído veio da vala. A patrulha encontrou sobreviventes que tinham abandonado a carroça quando a passagem se abriu. Uma mulher segurava uma caixa quebrada de remédios. O problema deixou de ser apenas um caderno perdido: era preciso levá-los de volta antes que a estrada fechasse.",
          "Em Aster, Mira recebeu a caixa como se pesasse muito mais do que madeira. Dorian conferiu a carga e riscou os itens que não chegariam. Brann pediu que os nomes dos sobreviventes fossem acrescentados à lista da ronda.",
          "{nome} entregou o caderno inteiro a Lyra e ficou para copiar as páginas necessárias. Não queria que a única prova estivesse na mão de uma só pessoa.",
          "Enquanto a tinta secava, Lyra separou os dois desenhos incompatíveis.",
          "— Pode ser uma data errada. Pode ser uma cópia. Vamos olhar a inscrição antes de decidir.",
          "A voz não ofereceu explicação. Pela primeira vez, seu silêncio pareceu uma escolha."
        ]
      },
      {
        "id": "act_03",
        "title": "III — A Torre Antiga",
        "paragraphs": [
          "A Torre não parecia ter sido construída para os caminhos que agora a cercavam. Suas pedras atravessavam o relevo como se a estrada houvesse chegado depois, tentando encontrar espaço em volta delas.",
          "Nos primeiros andares, {nome} aprendeu a escutar os passos antes de abrir uma porta. A força recebida na travessia respondia ao esforço: o corpo suportava um movimento que antes o derrubaria, reconhecia uma abertura em meio ao ataque, conseguia reter mais energia. Cada avanço cobrava atenção, descanso e preparo.",
          "Perto de uma inscrição, a dor da queda voltou ao peito.",
          "— Isso acontece com os outros? — perguntou à voz.",
          "— Com alguns dos que atravessam.",
          "A resposta importava. Em Aster, o nome dado a essas pessoas era Transmigradores. A Fenda havia alterado outras almas também. {nome} não era a primeira pessoa a sentir aquela ressonância, nem a única capaz de aprender a usá-la.",
          "A inscrição de Aldric estava numa sala de portas fechadas. Um arco tinha cinco pequenas marcas ao redor e um sinal central, afastado delas. Sob a pedra, outra inscrição fora parcialmente apagada. A camada inferior era muito mais antiga do que as anotações sobre a crise atual.",
          "{nome} copiou os traços. Quando tocou a borda do desenho, a voz deixou escapar:",
          "— Vocês chegaram a esta parte.",
          "— Vocês quem?",
          "Houve um som semelhante a uma respiração interrompida. A voz corrigiu a frase, depressa demais.",
          "— Você. Eu quis dizer você.",
          "Na volta, Lyra examinou a cópia e ouviu o relato. O registro mais antigo descrevia contenção; a marca recente descrevia uma ligação. Eram parecidas, mas as linhas terminavam em pontos diferentes.",
          "— Se tratarmos tudo como a mesma coisa, alguém vai abrir uma porta pensando que está fechando — disse ela.",
          "{nome} deixou espaço nas anotações para as diferenças. A Torre oferecia força, mas também exigia uma espécie de disciplina que não aparecia nas provas da Ordem: perceber quando uma resposta conveniente escondia uma pergunta.",
          "Antes de dormir, chamou de novo a voz.",
          "— Você estava falando com outra pessoa?",
          "— Eu lembro de ter estado ali.",
          "— Isso não responde.",
          "— Eu sei."
        ]
      },
      {
        "id": "act_04",
        "title": "IV — As Marcas",
        "paragraphs": [
          "Kael pousou uma arma recolhida numa masmorra sobre a bancada. A peça estava torta, e o metal tinha uma marca escura que não acompanhava o desenho original.",
          "— Isto foi feito depois — disse. — Quem forjou a arma não abriu esse sulco.",
          "Em outros portais, a mesma marca apareceu sobre escamas, couro e osso. Algumas criaturas avançavam com movimentos que pareciam interrompidos por uma ordem recebida de muito longe. Outras lutavam por vontade própria. Era perigoso presumir inocência; também era falso atribuir a todos uma mesma origem.",
          "O guardião de uma dessas passagens tinha correntes presas ao chão. Quando {nome} o atingiu, as correntes puxaram seu corpo de volta ao centro. A energia que alimentava a abertura vinha de uma marca sob seu peito.",
          "Na queda do guardião, a ligação cedeu. O portal começou a fechar. A patrulha correu para a saída enquanto a mana acumulada se dissipava.",
          "— Hoje ele sustentava uma invasão — disse {nome} à voz. — Na Torre, o outro selo parecia impedir uma passagem.",
          "— Guarde essa diferença.",
          "— Você podia ter contado antes.",
          "— Podia.",
          "Lyra reuniu os achados numa mesa. Uma ordem fragmentada, encontrada entre as ruínas da masmorra, repetia um nome usado em depoimentos antigos: Arquiteto. Abaixo, havia uma instrução para separar sobreviventes capazes de suportar a marca.",
          "Mira passou a mão sobre a última linha, sem encostar na tinta.",
          "— Ele chama isso de seleção.",
          "Naquela noite, {nome} ouviu alguém perguntar por uma pessoa desaparecida na estrada. Até então, os monstros tinham parecido a ameaça inteira. Agora havia um método por trás de parte deles: capturar, marcar, transportar e usar.",
          "A pergunta sobre casa mudou de peso. Encontrar alguém do mundo natal dentro de uma passagem talvez não significasse ter encontrado uma rota de volta.",
          "Lyra guardou a prova longe das cópias destinadas às patrulhas. Todas continham a conclusão necessária para o combate: os guardiões atuais sustentavam aquelas ligações. Nenhuma dizia que o Arquiteto havia criado os povos que atravessavam por elas.",
          "Na oficina, Kael conseguiu limpar a marca da arma. O sulco permaneceu. Ser livre da ordem não devolvia ao metal a forma que tinha antes."
        ]
      },
      {
        "id": "act_05",
        "title": "V — O Retorno",
        "paragraphs": [
          "Aldric voltou numa manhã de chuva.",
          "O guarda que o viu primeiro correu para avisar Mira. O veterano trazia parte do caderno presa sob a roupa e uma ferida que reabria a cada tentativa de andar. Reconheceu a capa dos registros sobre a mesa de Lyra e riu uma única vez.",
          "— Pensei que tinha perdido também isso.",
          "Durante dois dias, conseguiu falar pouco. No terceiro, pediu que {nome} chegasse mais perto.",
          "Havia uma patrulha presa além da passagem de onde escapara. Aldric vira um comandante marcado conduzindo pessoas para uma câmara. As que tinham atravessado Fendas recebiam atenção especial. Seu crescimento permitia suportar forças que quebravam outros corpos.",
          "— Ele não deixa de olhar porque você fica mais forte — disse. — Às vezes é quando começa.",
          "A expedição encontrou a patrulha no lugar indicado. Quando o comandante recuou, abriu-se um caminho para persegui-lo. Da câmara ao lado vieram golpes contra uma porta trancada.",
          "A voz disse que aquele comandante carregava informações importantes.",
          "{nome} parou no corredor. Havia poucos instantes e gente demais para fazer as duas coisas.",
          "— Informações não vão abrir aquela porta depois que a passagem cair.",
          "A perseguição foi abandonada. A patrulha retirou os prisioneiros. Uma das pessoas não conseguia caminhar; precisaram deixar para trás parte do equipamento. O comandante escapou com seus registros, e a Ordem perdeu uma oportunidade real de saber mais.",
          "Aldric ouviu o resultado deitado, com a mão sobre a atadura.",
          "— Vamos ter de encontrá-lo outra vez.",
          "{nome} assentiu, esperando uma repreensão.",
          "— E essas pessoas não vão precisar ser encontradas outra vez — completou ele.",
          "A voz não comentou a escolha. Mais tarde, quando {nome} arrumava o equipamento perdido, ela disse:",
          "— Eu conheço essa pressa.",
          "— A pressa de perseguir?",
          "— A de achar que você precisa resolver tudo antes de poder tirar alguém de lá.",
          "A frase parecia próxima demais de uma lembrança. {nome} fez uma anotação abaixo das inscrições da Torre: perguntar de onde ela vinha."
        ]
      },
      {
        "id": "act_06",
        "title": "VI — As Muralhas",
        "paragraphs": [
          "O primeiro ataque que {nome} viu de dentro de Aster durou até a madrugada.",
          "Brann distribuiu a defesa e mandou retirar as pessoas das casas próximas ao portão. Mira levou seus pacientes para uma rua interior. Dorian discutiu com quem tentava guardar mercadoria no caminho das macas, depois abriu o próprio depósito.",
          "Os invasores tinham uma direção. Passavam por alvos mais expostos e voltavam a insistir na mesma estrada. Lyra marcou o trajeto num mapa enquanto os mensageiros chegavam, cada um trazendo uma parte incompleta da batalha.",
          "{nome} correu entre a muralha e o depósito. O poder adquirido nas expedições permitia enfrentar ameaças maiores, mas não permitia estar em dois lugares ao mesmo tempo. Quando a carroça de remédios ficou presa junto a uma defesa rompida, foi preciso escolher um caminho, voltar e admitir que outra carga se perderia.",
          "Ao amanhecer, o ataque tinha sido contido. Parte do bairro externo queimara. Brann encontrou uma lista de patrulha molhada e pediu a Selene que fizesse uma cópia antes de o papel se desfazer.",
          "Entre os mortos havia pessoas com quem {nome} nunca conversara. Uma mulher atravessou a rua procurando um nome e se sentou quando o encontrou. Ninguém tentou explicar a ela que a cidade vencera.",
          "Mira pediu ajuda para carregar água.",
          "O trabalho continuou nos dias seguintes. O lago alimentava os feridos. O metal recolhido por Kael voltava para a defesa. As cargas de Dorian seguiam rotas mais longas. Selene conferia notícias antes de entregá-las, recusando acrescentar uma morte à lista por causa de um boato.",
          "{nome} começou a conhecer Aster pelo que faltava: uma voz na ronda, uma porta onde agora havia cinza, o espaço ocupado por uma cama vazia.",
          "Na parede junto ao portão, o nome de Edran entrou numa placa de madeira. Brann segurou o martelo sem dizer nada.",
          "À noite, a voz perguntou se {nome} ainda pensava em voltar.",
          "— Todos os dias.",
          "— E por que voltou para a carga?",
          "{nome} olhou as luzes do depósito, onde Mira ainda trabalhava.",
          "— Porque eles estavam ali."
        ]
      },
      {
        "id": "act_07",
        "title": "VII — O Topo",
        "paragraphs": [
          "No centésimo andar, o mapa não estava desenhado sobre uma superfície. Suas linhas ocupavam o ar entre pedaços de pedra.",
          "Algumas terminavam em escuridão. Outras se dividiam em trajetos quase iguais, com pequenas diferenças nas inscrições. Havia passagens que apareciam abertas num registro e fechadas em outro, embora ambos carregassem a mesma data.",
          "Aldric permanecera em Aster. Lyra enviara cópias de suas anotações com a expedição. {nome} comparou cada uma, esperando encontrar o sinal que lembrava a rachadura do céu natal.",
          "Quando o encontrou, a voz falou antes que fosse apontado.",
          "— Não toque ainda.",
          "Era parecido. Não era prova.",
          "{nome} manteve a mão suspensa.",
          "— Você reconheceu.",
          "— Reconheço a rota.",
          "— Para onde?",
          "— Não consigo afirmar onde ela termina agora.",
          "Do outro lado da sala, uma Transmigradora da expedição também tinha encontrado um sinal familiar. Ela vinha de um mundo com duas luas. Sua cópia descrevia uma ponte que nunca existira nas memórias de {nome}. As duas rotas se tocavam no mapa e seguiam para direções diferentes.",
          "Não havia um caminho único de casa. Havia muitas casas, muitos desastres e uma rede capaz de misturar seus vestígios.",
          "Uma inscrição nova cobria parte do desenho antigo. Não descrevia um destino; distribuía funções. Uma linha terminava no nome do Arquiteto. Acima dela, as ordens continuavam para fora da área preservada do mapa.",
          "— Ele responde a alguém — disse a Transmigradora.",
          "{nome} copiou o trecho. Era possível reconhecer uma hierarquia sem saber quem ocupava o alto dela.",
          "Antes de sair, guardou também o sinal parecido com o do mundo natal. Não o chamou de esperança nem de mentira. Era uma pista que precisaria sobreviver à pressa de acreditar.",
          "Na volta, a voz indicou uma porta que não existia. Corrigiu o caminho quando a expedição lhe descreveu a parede inteira.",
          "{nome} acrescentou mais uma diferença ao registro."
        ]
      },
      {
        "id": "act_08",
        "title": "VIII — O Clã Ferrugem",
        "paragraphs": [
          "Brann avisou que havia goblins nas estradas. Torvo avisou que havia gente usando o nome do Clã Ferrugem para justificar saques. Os dois estavam certos sobre parte do problema e desconfiavam da outra parte.",
          "{nome} encontrou Torvo junto a uma carroça de refugiados. Ele tinha colocado pessoas de seu povo entre a carga e os atacantes. Mais adiante, outros goblins carregavam objetos retirados de uma casa vazia.",
          "— Aqueles não estão comigo — disse Torvo. — Mas, quando chegam à sua muralha, ninguém pergunta.",
          "A proteção da carroça custou tempo. Uma peça antiga, procurada pela Ordem, foi levada pelos saqueadores enquanto a patrulha abria caminho para os feridos. Torvo viu {nome} observar a direção da fuga e esperou.",
          "— Ainda dá para seguir os dois? — perguntou.",
          "Não dava.",
          "Foram os refugiados que chegaram primeiro a Aster. Lyra registrou seus nomes, e Brann exigiu que entregassem as armas antes de entrar. Houve discussão, mas as camas de Mira não permaneceram vazias por causa dela.",
          "Torvo contou sua história diante do mapa da Torre.",
          "Cem anos antes, seu povo havia fugido de um mundo recolhido pelo Arquiteto. A passagem de saída não fora um convite. Eles tinham atravessado levando o que cabia nas mãos. Alguns perderam parentes no caminho. Outros reencontraram rostos conhecidos entre criaturas marcadas a serviço das invasões.",
          "— Ele ofereceu um lugar para os que sobraram — disse Torvo. — Escolheu o que esse lugar faria deles.",
          "{nome} pensou nas silhuetas vistas durante a própria queda.",
          "— Você voltou a encontrar o caminho?",
          "Torvo abriu uma pequena bolsa e retirou uma chave sem porta.",
          "— Encontrei isto entre as coisas que levaram. Só isto.",
          "A chave passou de uma mão para outra. Não revelava uma rota. Tornava a perda impossível de tratar como desenho num mapa.",
          "Torvo propôs ajudar a proteger estradas e retirar pessoas das capitais ameaçadas. Não prometeu lutar no lugar da Ordem, nem que todo o Clã obedeceria a ele.",
          "Brann examinou o mapa das rotas e marcou um ponto de encontro.",
          "— Se vierem por aqui, minha patrulha vai saber quem está chegando.",
          "Foi o primeiro acordo que não exigiu que os dois fingissem confiar um no outro."
        ]
      },
      {
        "id": "act_09",
        "title": "IX — As Capitais",
        "paragraphs": [
          "As cinco marcas vistas na Torre pertenciam a cinco capitais. Cada uma guardava uma Pedra-Âncora. Aster ficava separada, no vínculo central da rede.",
          "Nas câmaras das capitais, os registros guardavam uma parte da história que o Narrador nunca contara.",
          "Depois da primeira grande abertura, o Arquiteto tentara fixar seu corpo naquele mundo. Sobreviventes do resgate antigo, Transmigradores e a resistência que daria origem à Ordem trabalharam juntos para detê-lo. Conhecimentos da Torre permitiram separar sua manifestação em cinco partes. As Pedras-Âncora, antes usadas para conter passagens, tornaram-se prisões ligadas entre si.",
          "Os registros posteriores à abertura preservavam nomes diferentes em suas cópias. As marcas do trabalho eram as mesmas. A Ordem atual herdara a defesa; não a inventara do nada. Aquela reconstrução não dependia de o Narrador ter testemunhado cada etapa.",
          "Aster estabilizava a rede de passagens. As cinco capitais mantinham suas próprias prisões físicas; o nexo central não guardava uma sexta parte. Por isso o Arquiteto atacava rotas específicas: libertar o corpo sem alcançar Aster ainda o deixaria dependente deste mundo.",
          "O primeiro aviso chegou de uma capital cuja defesa havia cedido. A Fenda da Âncora estava aberta. Sua parte prisioneira escapara.",
          "{nome} e a patrulha fecharam a passagem. A pressão sobre a cidade diminuiu, mas os sinais da peça fugitiva continuaram na estrada.",
          "— Ela não voltou — disse Brann, ouvindo o relatório.",
          "Lyra separou as tarefas no mapa. Fechar o portal. Encontrar o corpo que escapara. Derrotá-lo e devolvê-lo à prisão. Reconstruir a defesa para impedir outra ruptura.",
          "Não eram nomes diferentes para uma única vitória.",
          "A peça livre procurava as demais. Se as cinco se reunissem, haveria um corpo capaz de marchar até Aster. Ainda era possível impedir isso. As outras capitais continuavam defendidas, e a resistência não precisava perdê-las para enfrentar o inimigo.",
          "Durante a reunião, {nome} perguntou por que a voz nunca mencionara as pessoas do primeiro resgate.",
          "— Eu lembro delas saindo — respondeu o Narrador.",
          "— E o que você fazia lá?",
          "A pergunta permaneceu sem resposta até que Lyra fechou o livro."
        ]
      },
      {
        "id": "act_10",
        "title": "X — Pedaços de Deus",
        "paragraphs": [
          "Logos surgiu numa ligação que concentrava mais mana do que a Ordem conseguia medir com segurança.",
          "Seu nome passou pelos relatos antes de sua forma. Patrulhas recuavam de caminhos conhecidos; criaturas marcadas resistiam onde outras passagens já haviam perdido força. A resistência se preparou enquanto a peça fugitiva do Arquiteto continuava sendo rastreada, longe das outras prisões.",
          "Na câmara de Logos, as linhas da marca se moviam mesmo quando o guardião parava.",
          "{nome} esperou o ataque em vez de seguir a primeira abertura. A luta deixou pouca margem para corrigir um erro. Quando Logos caiu, a ligação sofreu uma ruptura e soltou um fragmento carregado de sinais. Não era uma sexta parte do Arquiteto. Era uma prova do modo como sua influência atravessava as passagens.",
          "O alívio sobre as invasões abriu uma janela curta para investigar o Portal Primordial.",
          "Antes de a expedição partir, {nome} ouviu uma nova voz.",
          "Uma abertura estreita se formou além da área segura. Do outro lado havia uma porta familiar. A posição da luz, a parede, o som distante de uma vida anterior: tudo parecia devolver por instantes aquilo que a Fenda havia arrancado.",
          "— Você quer ir embora — disse o Arquiteto. — Posso colocar essa rota ao seu alcance.",
          "{nome} deu um passo e parou.",
          "A exigência veio sem disfarce: abandonar a defesa de uma Âncora e deixar a passagem aberta por tempo suficiente. As outras pessoas poderiam cuidar do resto, afirmou ele. Só era necessário retirar uma pessoa da linha que resistia.",
          "— Quem está do outro lado? — perguntou {nome}.",
          "O Arquiteto repetiu a promessa de casa.",
          "— Eu perguntei quem.",
          "A imagem não trouxe uma pessoa que pudesse responder. Quanto mais {nome} tentava olhar além da porta, mais a cena se parecia com uma lembrança, sem distância, sem mudança, sem o tempo que deveria ter passado.",
          "Ainda podia haver um caminho verdadeiro por trás daquela oferta. Recusá-la significava perder uma oportunidade que talvez não voltasse.",
          "{nome} recuou.",
          "— Se pode abrir a rota, não precisa da morte de ninguém para mostrá-la.",
          "O Arquiteto não tentou justificar o preço. A porta se apagou.",
          "Em Aster, {nome} contou tudo a Lyra, inclusive a vontade de aceitar. Ela guardou a pista sem transformá-la em prova de que o mundo natal tinha sobrevivido."
        ]
      },
      {
        "id": "act_11",
        "title": "XI — A Mão do Arquiteto",
        "paragraphs": [
          "A equipe entrou no Portal Primordial com uma ordem de retirada combinada antes da primeira luta.",
          "Aldric insistira em acompanhar. Mira proibira a linha de frente. Ele aceitou um lugar onde pudesse reconhecer registros e ajudar a orientar a volta. Cada movimento lembrava que havia retornado da primeira expedição sem recuperar tudo o que perdera nela.",
          "No interior, uma mão imensa se formou sobre a passagem. Sua superfície seguia os movimentos da mana, e a parede continuava visível através de partes dos dedos.",
          "— Projeção — disse Lyra, comparando o fenômeno às cópias. — Não tirem uma peça da conta por causa disso.",
          "A mão atacou mesmo sem ser o corpo livre. A equipe precisou recuar antes de encontrar espaço para responder. {nome} rompeu a ligação que a sustentava enquanto os demais retiravam os feridos.",
          "Nas câmaras expostas pela queda, encontraram registros de uma abertura muito mais antiga. Havia nomes de desaparecidos, marcas de uma barreira e a indicação de um guardião que mantinha o selo fechado. Uma sequência gravada na pedra mostrava os sobreviventes atravessando depois de sua morte. Perto do núcleo, a descarga havia apagado o registro de quem permanecera.",
          "Aldric localizou um segundo documento. A ordem de recolhimento vinha de uma autoridade acima do Arquiteto. O nome fora destruído, mas a instrução permanecia: preservar materiais úteis e separar os que suportariam novas funções.",
          "Obedecer àquela ordem não absolvia quem escolhera a marca, o cárcere ou a promessa usada para atrair uma pessoa. O Arquiteto tinha executado a operação por seus próprios meios.",
          "Quando a expedição alcançou a saída, Aldric precisou de ajuda para completar os últimos passos. Voltou vivo, com os documentos presos sob a roupa seca que Lyra lhe entregara.",
          "O portal foi fechado.",
          "Em Aster, o desenho da barreira foi colocado ao lado das marcas da Torre e dos registros das capitais. As evidências concordavam onde a memória da voz deixava um espaço.",
          "Lyra chamou o Narrador.",
          "— Agora você vai nos contar quem ficou junto ao núcleo."
        ]
      },
      {
        "id": "act_12",
        "title": "XII — O Narrador",
        "paragraphs": [
          "Na sala havia uma mesa, três cadeiras ocupadas e uma voz sem lugar onde se sentar.",
          "Mira acabara de trocar a atadura de Aldric. Lyra abriu os registros. {nome} deixou a própria cópia sobre a mesa. Nenhum dos três ofereceu ao Narrador uma pergunta que permitisse responder pela metade.",
          "— Fui eu — disse ele.",
          "Havia desaparecimentos antes das grandes Fendas. Ele seguira um pedido de socorro através de uma rachadura. Encontrara pessoas vivas além de uma barreira. O Primeiro Guardião se colocara entre elas e a saída. O homem que ainda tinha corpo lutara, vencera e quebrara o selo.",
          "As pessoas escaparam. Isso também era verdade.",
          "Mas o guardião mantinha uma passagem maior contida. Quando suas marcas se apagaram, a rachadura se espalhara. O caminho aberto permitira à influência do Arquiteto atravessar e buscar uma forma naquele mundo.",
          "— A descarga chegou antes que eu pudesse sair — disse o Narrador. — Meu corpo se desfez. O que restou de mim foi carregado pelas passagens.",
          "Ele não vira a resistência erguer todas as prisões. Partes de sua alma haviam seguido trajetos diferentes. Vozes e lembranças tornaram a se encontrar sem preservar a ordem em que tinham acontecido.",
          "— Eu lembro pessoas trabalhando nas Âncoras. Nem sempre sei de qual mundo vem a lembrança.",
          "{nome} pensou no erro da porta na Torre.",
          "— Quem eram os outros quando você disse “vocês”?",
          "— Outros Transmigradores. Em outros lugares, em outros tempos. Eu tento falar com quem ainda pode alcançar os caminhos.",
          "Não havia uma única tentativa, nem um único viajante. O Narrador ouvira nomes que agora confundia, acompanhara defesas que não sabia ordenar e perdera contato com pessoas cujo fim desconhecia.",
          "— As tentativas que lembro e os registros que conseguimos comparar apontam para o mesmo risco: se o Arquiteto conseguir se libertar por inteiro em uma realidade, poderá destruir todas. Um nexo rompido dá a ele o caminho para continuar. Eu não conheço todo o mecanismo, nem sei onde cada tentativa está agora. É por isso que continuo procurando.",
          "Aldric passou um dedo pela margem do documento.",
          "— E preferiu nos mandar para as passagens sem contar o que abriu.",
          "— Preferi que vocês acreditassem que eu sabia o caminho.",
          "Lyra fechou a capa do diário, sem fechar a conversa.",
          "— Quando você viu uma coisa, diga que viu. Quando lembrar, diga que lembra. Quando estiver deduzindo, nós precisamos saber.",
          "{nome} esperara que a verdade tornasse a voz mais compreensível. Tornou-a também mais difícil de aceitar. O resgate tinha acontecido. A culpa tinha motivo. Nenhuma dessas coisas desfazia a ocultação.",
          "— Vou defender Aster — disse. — Não para pagar a sua dívida. E continuar ouvindo você não significa acreditar em tudo.",
          "— Então me peça provas.",
          "A primeira veio antes do ataque seguinte.",
          "O Narrador indicou uma passagem para um depósito de remédios. Recordava uma ponte, um arco e um caminho curto até uma Âncora sob pressão. A urgência era real. Seguir a lembrança sem conferir custaria menos tempo.",
          "{nome} levou a indicação a Selene. Seus registros não mencionavam a ponte. Aldric comparou o arco com uma cópia da Torre: a terceira linha terminava do lado oposto. Brann enviou uma observação pela estrada conhecida, sem colocar a carga inteira na rota incerta.",
          "A ponte não existia. Havia um desfiladeiro.",
          "— Eu atravessei ali — disse a voz ao receber o relato.",
          "— Você lembra de atravessar — respondeu {nome}.",
          "Depois de um longo silêncio, ele concordou.",
          "Mira recebeu os remédios pela rota mais demorada. Não chegaram todos a tempo de evitar sofrimento, mas chegaram com quem os transportava. A falha não tornou a experiência do Narrador inútil: a descrição do arco ajudou a reconhecer uma marca de instabilidade numa passagem próxima. Aquela informação foi conferida antes de entrar no plano.",
          "O mapa ganhou duas anotações diferentes: memória deslocada; sinal verificado. A confiança começou a ser reconstruída ali, sem uma declaração de perdão."
        ]
      },
      {
        "id": "act_13",
        "title": "XIII — Quem Fechou a Porta",
        "paragraphs": [
          "A resistência não esperou que as cinco prisões se rompessem.",
          "Lyra reuniu os relatórios das capitais. Brann manteve gente suficiente nas muralhas e nos pontos de passagem. Torvo protegeu as estradas usadas na retirada dos civis. Mira preparou os postos para os feridos. Aldric conferiu as marcas que a equipe encontraria na busca pela peça fugitiva.",
          "O Narrador ofereceu lembranças e aceitou deixá-las marcadas como lembranças. Ele e o Clã Ferrugem permaneceram nas rotas de apoio. Não entraram no confronto contra a parte do Arquiteto.",
          "{nome} saiu de Aster com a equipe que seguiria os sinais confirmados.",
          "A peça livre se movia na direção de outra prisão. Não era preciso permitir que a alcançasse para descobrir se a Ordem seria capaz de enfrentar o corpo inteiro. A batalha começou longe da muralha central, num lugar escolhido porque as vias de retirada estavam abertas.",
          "O Arquiteto falou através da própria parte. Repetiu a oferta de retorno enquanto a força reunida pelo fragmento deformava o chão. Não trouxe uma prova nova. {nome} já conhecia o preço.",
          "A equipe conteve seu avanço, perdeu a primeira posição e voltou pelo caminho preparado. Quando a marca que sustentava aquele corpo ficou exposta, {nome} alcançou a abertura que Aldric havia desenhado. O golpe não apagou o mundo em torno da peça. Desfez a forma que permitia a ela permanecer fora da prisão.",
          "A Âncora recebeu de volta o que perdera.",
          "Ainda foi preciso fechar as ligações que pressionavam as outras capitais. Os relatórios chegaram em momentos diferentes. Numa delas, a defesa resistira sem ceder; noutra, a invasão deixara feridos e reparos a fazer. A última confirmação demorou uma noite inteira.",
          "Lyra só marcou a operação contida quando tinha os cinco registros: nenhuma parte livre, nenhuma Âncora aberta. Aster continuava de pé.",
          "Não houvera um corpo completo derrotado à entrada da cidade. A resistência tinha vencido antes que ele pudesse chegar.",
          "Na volta, {nome} encontrou Brann trabalhando no portão. Torvo discutia os próximos trajetos com Dorian. Mira dormira numa cadeira e alguém cobria seus ombros. Aldric estava à mesa, vivo, reclamando da tinta que secava depressa demais.",
          "O Narrador permaneceu em silêncio até que a equipe atravessou a muralha.",
          "— Obrigado — disse.",
          "{nome} não respondeu com absolvição. Perguntou pelos nomes de quem ainda precisava ser procurado. A voz recordou alguns e admitiu a incerteza dos outros. Selene anotou apenas o que podia ser enviado como notícia.",
          "O livro de Lyra recebeu a conclusão daquela defesa. As páginas sobre as origens continuaram abertas. Os superiores do Arquiteto ainda existiam em ordens sem nome. O caminho para o mundo natal precisava ser investigado, mas já não seria comprado deixando uma cidade para trás.",
          "Perto do portão, {nome} parou diante da placa de Edran. A madeira trazia outros nomes desde a primeira noite. A cidade sobrevivera com espaços que ninguém preencheria.",
          "Quando Lyra perguntou o que escrever ao lado do registro de chegada, {nome} olhou a linha vazia da origem.",
          "— Ainda estou procurando o caminho de volta.",
          "Ela esperou.",
          "— Mas, quando eu sair, quero poder voltar para cá também.",
          "Lyra acrescentou Aster à coluna das pessoas que deviam receber notícias.",
          "Lá fora, amanhecia sobre uma estrada que ainda podia ser atravessada."
        ]
      }
    ],
    "containment": [
      "A resistência não esperou que as cinco prisões se rompessem. Lyra reuniu os relatórios, Brann sustentou a defesa e Torvo protegeu as estradas de retirada. Mira cuidou dos feridos; Aldric, vivo, conferiu os sinais que voltavam das expedições.",
      "Depois do fechamento do Portal Primordial, a defesa preservou ou recuperou as capitais. As peças que escaparam precisaram ser contidas; fechar uma passagem não bastava para devolvê-las às prisões. O Narrador ofereceu orientações sujeitas a confirmação. Ele e o Clã Ferrugem permaneceram nas rotas de apoio.",
      "Os avisos chegaram em momentos diferentes. Lyra esperou até ter os cinco registros: as capitais estavam de pé, nenhuma Âncora permanecia aberta e não havia peça livre ou corpo reunido marchando para Aster.",
      "A ofensiva havia sido contida antes que o Arquiteto pudesse alcançar a cidade. A resistência não precisara oferecer outras capitais para encontrar uma vitória.",
      "O Narrador ficou em silêncio quando {nome} voltou pela muralha. Depois agradeceu. Não recebeu uma declaração de perdão; recebeu perguntas sobre as pessoas que ainda precisavam ser procuradas. Selene anotou os nomes cujas informações podiam ser conferidas.",
      "O caminho para o mundo natal continuava desconhecido. As ordens acima do Arquiteto ainda guardavam nomes apagados. Nenhum desses espaços vazios desfazia a defesa que acabara de preservar Aster.",
      "Perto do portão, {nome} parou diante dos nomes deixados pela guerra. A cidade estava viva, mas sobreviver não preenchia seus espaços vazios. Havia gente para procurar, feridos para cuidar e caminhos para reparar conforme os danos de cada ataque.",
      "Lyra abriu o registro da primeira chegada e perguntou o que acrescentar à linha que continuava vazia.",
      "— Ainda estou procurando o caminho de volta — disse {nome}.",
      "Ela esperou.",
      "— Mas, quando eu sair, quero poder voltar para cá também.",
      "Lyra acrescentou Aster à coluna dos destinos que deveriam receber notícias. Lá fora, amanhecia sobre uma estrada que ainda podia ser atravessada."
    ],
    "confrontation": [
      "As confirmações das capitais não chegaram a tempo. As cinco partes encontraram umas às outras, e o Arquiteto começou a marcha para Aster.",
      "A resistência manteve as rotas de retirada abertas. Torvo e o Clã Ferrugem retiraram civis; Mira recebeu os feridos; o Narrador transmitiu apenas os sinais que a equipe conseguia confirmar. O corpo inteiro teria de ser detido antes de alcançar o nexo.",
      "{nome} o enfrentou com os aliados capazes de acompanhar o combate. Cada avanço cedido encurtava a distância até a cidade. A última posição foi mantida enquanto a equipe destruía a ligação que reunia as cinco formas.",
      "O Arquiteto caiu antes de Aster. Suas partes voltaram às Âncoras.",
      "Na estrada, a vitória tinha a forma de gente exausta procurando quem faltava. As capitais feridas precisariam ser reconstruídas. Aldric continuava vivo. O Narrador e o Clã vieram depois do confronto, com as rotas seguras e os sobreviventes.",
      "Lyra escreveu que a porta havia sido fechada. Registrou o custo sem transformar as perdas em preço obrigatório da vitória. O inimigo fora realmente contido naquele mundo; os desconhecidos acima dele não mudavam o que a resistência acabara de impedir.",
      "Na volta, Lyra perguntou se {nome} continuaria procurando o mundo natal. A resposta foi sim. Depois, diante do registro de chegada, veio outra certeza: quando saísse de Aster, também desejaria poder voltar para lá. Lyra escreveu o nome da cidade entre os destinos que deveriam receber notícias. Pela primeira vez desde a travessia, partir não significaria perder todos os caminhos de casa."
    ],
    "cycleEnd": [
      "O último aviso veio quando já não havia estrada suficiente entre o Arquiteto e a muralha.",
      "Brann tentou manter o portão. Lyra levou os registros para dentro. O nexo cedeu antes que uma nova linha de defesa pudesse ser formada. A chegada do corpo reunido rompeu a continuidade daquele mundo e abriu caminho para a ameaça alcançar outras realidades.",
      "Aster foi recolhida. Não restaram casa, banco, rank ou recursos daquele personagem para continuar a mesma jornada. Esse era o Fim do Ciclo.",
      "A voz perdeu os sons da cidade um a um. Onde antes reconhecia nomes, agora não conseguia saber quem ainda a ouviria. Sua experiência não permitia afirmar que todas as realidades tinham desaparecido no mesmo instante; permitia saber o que aquela defesa não conseguira impedir.",
      "Em outra passagem, quando encontrou alguém capaz de escutar, o Narrador começou pela verdade que havia ocultado de {nome}.",
      "— Fui atrás dos desaparecidos. Matei o guardião que fechava o caminho. Preciso contar o que aconteceu antes que você escolha me seguir."
    ]
  }
};
