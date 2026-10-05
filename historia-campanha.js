window.SOLO_RPG_STORY = {
  "version": "narrativa-v4-2026-10-05",
  "title": "",
  "status": "Textos integrados ao browser v255. Cenas literárias e missões físicas novas permanecem propostas de desenvolvimento.",
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
      "evidence": "Cada capital contém uma parte do Arquiteto. Aster é o vínculo central, separado das cinco prisões.",
      "consequence": "Preservar as Âncoras passa a ter um motivo claro. Nenhuma capital é destruída automaticamente pelo roteiro.",
      "diary": "Os ataques tentam libertar as cinco partes. Fechar uma Fenda não recaptura uma parte que já escapou; será preciso encontrá-la e contê-la.",
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
      "evidence": "A mente do Arquiteto consegue agir através das passagens mesmo com o corpo dividido.",
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
        "Exigir respostas e investigar a proposta de retorno feita pelo Arquiteto."
      ],
      "evidence": "O Narrador matou o Primeiro Guardião para resgatar desaparecidos. A descarga destruiu seu corpo e dispersou sua alma pelas passagens. Desde então, tenta impedir o Arquiteto em inúmeras realidades e tempos, acompanhando outros Transmigradores. Se o inimigo alcançar a libertação completa em uma única realidade, poderá destruir todas. Os superiores continuam desconhecidos.",
      "consequence": "{nome} conhece a extensão da ameaça e participa das decisões. A confiança precisa ser reconstruída por ações; não há perdão automático nem promessa de vitória universal.",
      "diary": "A voz que me acompanha também orienta outros Transmigradores. O Narrador carrega lembranças de tentativas em realidades e tempos diferentes. Ele abriu as passagens ao derrubar o Primeiro Guardião; agora tenta impedir a libertação completa do Arquiteto em qualquer realidade. Defender Aster importa para todas as outras. Sua experiência não é conhecimento de tudo, e ouvir sua confissão não resolve minha confiança.",
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
        "“Você perguntou quem mais me ouve. Outros Transmigradores, {nome}. Em outros mundos, em outros tempos. Tentei detê-lo em tantas realidades que não consigo ordenar todas as lembranças.”",
        "“Se ele conseguir se libertar por inteiro em uma única realidade, poderá destruir todas. É por isso que continuo procurando quem possa fechar os caminhos que eu já não consigo tocar.”",
        "“Eu lembro tentativas. Isso não significa que saiba o que acontece em toda parte, nem quem dá ordens a ele. Também não posso dizer que seu mundo natal está salvo. Você tem direito de exigir provas de mim.”",
        "{nome} não oferece perdão automático. A resistência segue com a verdade conhecida e com as decisões compartilhadas com quem terá de viver suas consequências."
      ]
    },
    "victory": {
      "title": "XIII — Quem Fechou a Porta",
      "text": "{nome} e a resistência impediram o Arquiteto de alcançar Aster. As cinco partes voltaram às Âncoras deste mundo. Uma frente entre as realidades continua fechada. O Narrador e o Clã Ferrugem cuidaram das rotas e dos sobreviventes, fora do confronto. A vitória preservou esta defesa; não prova o destino de todas as outras realidades nem revela os superiores."
    }
  },
  "continuity": {
    "authorDirection": "Ian: o Narrador acompanha Transmigradores em inúmeras realidades/tempos; libertação em uma realidade ameaça todas.",
    "integrationProposal": "IA: distinguir queda do selo/passagens, projeção de influência e libertação completa. As cinco Âncoras e Aster mantêm suas funções locais.",
    "gameplayLimit": "Texto atualizado; regras de morte, Fim do Ciclo, ranks, eventos, contagens e recompensas não foram alteradas.",
    "source": "13-Ideia-do-Narrador-entre-realidades-transcricao-v1.md"
  }
};
