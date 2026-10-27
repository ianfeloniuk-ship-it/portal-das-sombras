## v656 (27/10/2026) — magia como no Skyrim: toque = 1 magia, segurar = fluxo contínuo (áudio de Ian)
- **`tools/magia653.js` (novo, carregado antes de `ecology410.js` para ser o envoltório mais interno do `attack()`):** vale para o ataque básico mágico que soltava projéteis (cajado, varinha, tomo, orbe ou mãos no estilo arcano; todas as classes de `MAGIC_CLS` menos a Lâmina Arcana, que é corpo a corpo). **Toque** (soltar antes de um instante): 1 projétil de sempre, mesmo efeito, **1 de mana**. **Segurar**: fluxo contínuo da mão/cajado na direção da mira (alvo travado, `aimPoint` ou frente) — fogo (Mago de Fogo, Mago Elemental) = jato de chamas em cone de 6 m; gelo = jato de geada em cone de 6 m com lascas de cristal; terra = jato de areia e pedrinhas em cone de 5 m; raio, Condutor, arcano, luz e trevas = feixe de 18 m até o primeiro inimigo (o chão corta). Dano 4 vezes por segundo, inteiro: `round(dano do básico ÷ intervalo × 1/4)`, mínimo 1 (mesmo dano por segundo do básico com projéteis); efeitos do básico da classe continuam (fogo queima, gelo deixa lento, `applyBasicAttackEffect`); efeitos de 3º golpe só no toque. Mana: 1 ao começar e mais 1 a cada segundo (o toque paga só 1: o `lote541` não liga mais o gasto por segundo depois de um toque); não regenera enquanto o fluxo sai; sem mana para e avisa (SEM MANA). Para ao soltar, rolar, defender, abrir conversa/pausa ou trocar para arma física. Contador de combo e clarões de impacto (`Flip470`, `Impact459`) contam 1 vez por segundo de fluxo, não 4.
- **Visual:** técnica aprovada (peças do `Golpes487.fx`): cones/tubo com shader de ruído que corre, bolas de fogo/geada que saem da mão e crescem, brasas, lascas de cristal, fumaça/névoa na ponta, raios em zigue-zague no feixe do Raio, orbe na mão; brilho reduzido quando a câmera olha ao longo do jato (atrás do personagem) para não virar mancha branca. 1ª pessoa: sai da mão direita, logo abaixo da câmera.
- **Partes ligadas:** tela de controles (`630-controles.js`, linha do Mouse), dica de Combate (`450`), descrição do ataque básico mágico na ficha (`basicAttackDesc`), comentário do `lote541.js` (dreno antigo continua barrando o ataque sem mana). Não mudou: armas físicas, defesa no botão do meio, câmera/mira no direito, Shift/dash/Alt, habilidades com tecla própria, toque na tela (celular).
- **Teste (navegador local, porta 8788, eventos de mouse reais no canvas):** as 14 classes mágicas × elemento (cone/feixe certo, dano no monstro, mana −2 em 2 s segurando, toque = 1 projétil e −1 de mana); Guerreiro sem arma e com espada no mago = corpo a corpo sem fluxo; Guerreiro com cajado = fluxo; defendendo não sai; sem mana não sai; mana 2 acaba e para; monstro morre pelo feixe; 1ª pessoa (fluxo e toque). Sem erros de JS no console. Não testado: mouse físico, desempenho em PC real, som (o fluxo não tem som próprio), NPCs (o fluxo não fere NPCs; o golpe corpo a corpo do `crime545` continua igual).
- **v656 (revisão antes de publicar):** o número v653 já tinha sido usado por outra sessão, então saiu como v656 (o arquivo continua `tools/magia653.js`). Correções: toque não paga mana em dobro (`Magia653.tapJust` lido pelo `lote541`); o fluxo para a cada quadro em cena (`isCinematic451`), dormindo (`Cogu348`), conversa, janela aberta, defendendo (`Guard472.blocking`), montado (`run.mounted`) e de carona (`Living372.riding`); efeitos de acerto do básico (`applyBasicAttackEffect`, `hitHooks183`, veneno, runas, `cm154Basic`) e passivas com chance (`applyPassive`) só 1 vez por segundo de fluxo; a diária de ataques (`dprog('atk')`) sobe 1 por segundo de fluxo; dano com resto acumulado (sempre inteiro, mesmo dano por segundo do projétil, sem o mínimo de 1 por tick); peso excessivo enfraquece o fluxo; talentos: alcance (+15% no comprimento), vários projéteis (feixe mais forte) e perfurar (feixe pega todos na linha); `curDType281` volta ao valor de antes depois de cada tick; o fluxo também pega inimigo dormindo; soltar o botão antes de o fluxo sair sempre lança o toque (antes, com o jogo lento, não saía nada). Texto ligado: tela de controles ("com arma física, segure para repetir"; "1 de mana ao começar e mais 1 a cada segundo"; cone "que pega todos à frente"), dica de Combate e `basicAttackDesc` com o mesmo gasto. Teste v656 (porta 8788, painel escondido a 7 quadros por segundo): 3 toques = 3 de mana e nenhum gasto depois; segurar 2 s = 3 de mana, 4 s = 4 efeitos de acerto, 4 passivas e 4 pontos de diária para 16 ticks; o fluxo para em cena, dormindo, defendendo e com janela aberta; Mago de Gelo (cone), Mago de Fogo (cone) e Mago do Raio (feixe) dão dano; sem erro de JS (só 404 antigos). Pendente para Ian: brilho branco na ponta, bolinhas no cone, cone pegando todos, pernas travadas andando, combo 1 por segundo, fluxo não fere NPC.

## v655 (27/10/2026) — Nomes por região, morte de verdade e povo que vive sem você (estilo Skyrim)
- Pedido de Ian: «arruma os nomes por região e tipo, e não coloca tipo "Zahar, o mestre do deserto"» · «tem gente que eu mato e simplesmente fica de pé» · «essa mecânica de vida que existe independente de você, como em Skyrim… as pessoas vivem sem mim».
- `tools/povo655.js` (novo): `Nomes655`, nome e sobrenome pela região (Aster medieval, Solaria latina, Ymiria nórdica -sson/-dottir, Zahar árabe ibn/bint, Thalor portuguesa de porto, Urdan e Verden celta), sem apelido. Guardas «Guarda Fulano», o primeiro de cada cidade é «Capitão Sobrenome» (em Ymiria e Zahar, Capitão + primeiro nome). `Povo655`: moradores fixos de cada cidade (mesma semente, mesmo número de antes: 14 nas cidades grandes, 3 nas outras) com profissão da região, amigo e hábito de beber. Ao chegar, cada um aparece onde a rotina da hora manda. Morto continua morto (`profile.povo655`), e 3 dias depois chega alguém novo para a casa. Moradores e guardas param para conversar entre si (clima, trabalho, morte de alguém, quem chegou, fama do jogador, recompensa da guarda, fantasmas à noite) e às vezes falam com você quando você passa perto.
- Morte: o morador morto tocava o clipe «soldado ferido sentado» (`defeat_02`) do banco do povo e parecia vivo. `tools/npc482.js` agora usa a animação de morte quando morto. O corpo fica no chão até você se afastar 160 m (ou 15 min); antes sumia em 2 min. Vendedores e personagens de missão continuam essenciais: caem e levantam (como os essenciais do Skyrim).
- Nomes trocados (todas as referências): Aldric das Brumas → Aldric Fenwick, Edran Protetor da Carroça → Edran Holt, Kallan Lâmina-do-Aço → Kallan Brandt, Valen Radiante → Valen Corvino, Cynthia Alvorada → Cynthia Valerio, Torben Machado-de-Gelo → Torben Halvorsen, Eira Caçadora dos Montes → Eira Solberg, Farid Falcão-das-Dunas → Farid ibn Rashid, Zahra Passo-Silencioso → Zahra bint Karim, Kaelen Arpoador → Martim Duarte, Marina Olho-da-Tormenta → Marina Salgado, Kaelen Garra-Verde → Cian Ardwyn, Sylas Sombra-da-Copa → Sylas Fenwyr, Almirante Varis Onda-Viva → Almirante Varis Moura, Emir Tariq Al-Zahar → Emir Tariq ibn Nadir. Encontros na estrada (`quests480.js`): «Zayd, Guardião das Areias» vira «Zayd», e a função aparece embaixo do nome. Quem dá missão fica só com o nome. NPCs das missões infinitas: «Nara, a Barqueira» vira «A barqueira Nara» (texto da missão).
- Partes ligadas: `vida523.js` (moradores do Povo655, guardas com nome da região, conversa respeitada pela rotina), `crime545.js` (morte registrada, corpo fica), `dialogo520.js` (notícias de morte e de quem chegou), caçadores (`260-v341.js`) e moradores antigos (`500-moradores-e-festivais.js`) com nome da região, `sexOfName` consulta `Nomes655`.
- Não mudado: «Gorran, o Muro» (líder de guilda no texto das guildas) e nomes de monstros (Alvos Notórios).
- Teste: Edge headless local (porta 8796): nomes em Aster e amostra das 6 regiões; morador morto deitado no chão (print), recompensa da guarda cobrada; sair e voltar sem o morto reaparecer; 3 dias depois Walter Pell no lugar de Edmund Hale; notícia do enterro no diálogo; dois moradores conversando entre si; sem erro de JavaScript.

## v654 (27/10/2026) — Fendas: entrada fica aberta, objetivo 100 monstros ou o Soberano, colapso com reputação
- Pedido de Ian (áudio): dentro da Fenda não há mais nada mostrando o chefe; o portal de entrada não fecha; só a Fenda vermelha mostra o chefe e não deixa sair; objetivo = matar 100 monstros ou o chefe; cumprido, a vermelha volta a deixar sair; ao sair com o objetivo cumprido a Fenda colapsa e dá reputação.
- **`tools/otherworld460.js`:** a Fenda de entrada nasce aberta atrás de você na chegada (`arrive`), no mesmo lugar, em toda variante do Outro Mundo; na vermelha ela fica trancada. Saiu o «O PORTAL SE FECHOU» e a Fenda que reaparecia a 260–620 m. Objetivo `GOAL_KILLS = 100` (abates contados por `run.kills` desde a chegada) ou o Soberano (ou a defesa do Núcleo); `completeGoal()` destranca as saídas. O feixe do Soberano (`beam469`) só aparece na vermelha (o do Núcleo e o da Fenda nova pós-chefe continuam). Linha de objetivo em `objective()` e `hudLine()`; toasts de chegada e de vitória reescritos. API: `OW460.kills/goalDone/hudLine/completeGoal`.
- **`tools/explorar539.js`:** no Outro Mundo, a linha da bússola mostra «Objetivo: 37/100 monstros ou o Soberano» (com «· saída trancada» na vermelha) e «Objetivo cumprido · saia pela Fenda». O `#obj` antigo continua escondido (v520).
- **`290-bloco-crystals125-cont.js`:** `tryExit` aceita o objetivo de 100 monstros; `leaveDungeon` conta como Fenda concluída sair com o objetivo cumprido (colapsa com `Rift131.close`, igual à vitória). Sair antes de cumprir: a Fenda continua no mesmo lugar (`OW460.relocateGate` foi removido).
- **`160-jogador.js`:** `recordRankPortal` paga no colapso da Fenda do Outro Mundo: `orderRepReward(rank)` na comum, o dobro na vermelha; toast «[ORDEM] Fenda vermelha rank E colapsada: +50 de reputação».
- **Partes ligadas:** dicas `HLINES` (050), frase do narrador da Fenda vermelha (030, «se trancou atrás de você»), janela do portal (Saída e Orientação) e pergaminho de retorno (620).
- **Teste (navegador, porta 8787, abates por `killEnemy`):** comum: entrada aberta a 5 m, sem feixe do Soberano, contador 60/100 e 99→100, sair → Fenda colapsou, +10 reputação (rank F); comum saindo cedo: Fenda fica no mesmo lugar e aceita de novo; vermelha (combate): entrada trancada, recusa ao tentar sair, 100 abates destrancam, sair → +50 (rank E ×2); vermelha padrão: feixe em cima do Soberano, matar o Soberano destranca a entrada e abre a Fenda nova, sair → +50. Captura do portal vermelho atrás do herói. Sem erros no console. Não testado: variantes Núcleo/Zonas/Caçada de ponta a ponta, celular.
- **Ajustes da revisão (v654):** Núcleo destruído não conta como concluído nem paga reputação (`goalDone`, `leaveDungeon`, `recordRankPortal` checam `L.defense.failed`/`g.coreFailed103`; a bússola diz «Núcleo destruído · sem recompensa»); na Fenda comum a zona é só pela distância da entrada (160/360 m) e a Zona 3 se chama «Confins do Outro Mundo», sem pista do Soberano; `onBossDeath` (370) não mostra mais «Transbordo em 60s… única saída» no Outro Mundo; o feixe verde-água da entrada continua depois do chefe; `completeGoal(why)` só fala «100 monstros abatidos» quando foi por abates; aviso de passagem do tempo sem decimais (`passTxt`: «2 horas se passaram», «1 hora se passou», «3 dias e 4h se passaram»), também nas linhas das Capitais.
- **Reteste v654 (navegador, porta 8787):** comum padrão (entrada aberta a 5 m, sem feixe do Soberano, Zona 3 «Confins», chefe morto sem o aviso de 60s, feixe verde-água visível, sair → +10 e colapso); Núcleo comum com Núcleo destruído + 100 abates (sem conclusão, sem reputação, `run.clears` igual); vermelha padrão (feixe no Soberano, saída recusada, 100 abates destrancam, sair → +50 rank E); vermelha combate (trancada). Sem erro de script. Não testado: Três Zonas, Caçada, chegar ao Soberano andando, celular; bússola a 800 px ainda fica sob o painel da campanha.
- Publicada como v654 porque a v653 da main já era de outra sessão (conversas e almas).

## v653 (27/10/2026) — Conversas que mudam e almas à noite (fantasmas estilo Skyrim)
- Pedido de Ian (áudio de 22/10): «é sempre as mesmas perguntas, as mesmas coisas» e «pode ter fantasmas que nem no Skyrim, as pessoas vivas com VFX».
- `tools/dialogo520.js`: cada pessoa tem um jeito fixo pelo nome (falante, rabugento, medroso, orgulhoso, sonhador, devoto); a saudação muda com afeto, chuva, neve e noite; cada dia ela traz 3 assuntos seus (2 nos vendedores), que saem da lista depois de ouvidos (+1 de afeto na primeira vez); caçadores têm assuntos de caçada e rank; «Conversar sobre a vida»: a pessoa pergunta por que você luta e reage pela resposta. Elogio, agrado e provocação com palavras diferentes por pessoa; agrado só a partir de 2 de afeto. Guardas ganham 2 assuntos do dia. Loja, banco, missão pessoal de Aster, presentes e a saudação de Kael (`Kael604.addr`) continuam iguais.
- `tools/fantasmas545.js` (novo): à noite, perto da cidade, às vezes aparece uma alma (8 personagens, uma por vez): corpo de morador Povo482 em luz azul translúcida (borda acesa, faixas que sobem, tremulação), fiapos de luz e brilho no chão. Flutua devagar e fala pelo diálogo de sempre. Ouvir «Quem é você?» e «Por que ainda está aqui?» libera «Descanse em paz»: ela some em luz e dá 2 de reputação da Ordem; cada alma descansa uma vez só (`profile.almas545`). De manhã some.
- Parte ligada: `tools/crime545.js` ignora almas como alvo e como testemunha.
- Preparado em 22/10 sobre a v550 (prévia v551 não publicada) e reaplicado sobre a v652.
- Teste: Edge headless local (cópia própria, porta 8796): caçador, guarda, vendedor Kael (loja abre), assunto muda de um dia para o outro, alma com corpo Povo482 e 2 materiais de alma, conversa até +2 de reputação e sumiço; sem erro de JavaScript.

## v652 (27/10/2026) — missão fixa #14 «A Chave Sem Porta no Vale da Fundição»
- **`tools/vale614.js` (novo):** com a #13 feita, a Rota Oeste leva a um ponto plano a oeste de Aster (~150–190 m, longe de portões, fixado a 90 m; o acampamento fica 42 m mais a oeste). **Desfiladeiro:** rochas, tocos e estandartes falsos (vermelho vivo, não o do Clã Ferrugem); 5 saqueadores (um orc) calibrados pelo nível; todos mortos, a barreira some. **Vale:** Torvo (goblin amigo), 4 refugiados caídos e um ladrão com a relíquia; Torvo dá a escolha (diálogo).
- **Ficar:** acender a fogueira (E, chama de cones) e dar água fervida (cantil com água limpa/chá) ou comida assada (`Surv437`); refugiados se levantam; **Pacto do Clã Ferrugem** (`LORE.q014_pacto`): com o Carrinho de Carga montado, 2 goblins aliados o escoltam (até 120 m de você) e afastam inimigos comuns a 9 m (10% da vida por segundo; chefes não). **Perseguir:** o ladrão foge de quem chega a menos de 30 m por 16 s e depois luta; ao morrer dá **1 item Épico** (`rollItem(..., minRarity 2)`), os refugiados ficam caídos e `desconfia` marca o Clã Ferrugem contra Aster (só a marca e o texto, sem efeito em jogo). Estado em `profile.fixas545.q014`.
- **Simplificações:** as «6 Rotas Reais» viraram a escolta da carroça; o desfiladeiro desobstruído é só o fim dos saqueadores (a #14 não usa as pedras do Ato VIII da campanha, que seguem à parte).
- **Teste (navegador, tecla E real, andando por passos):** barreira e saqueadores (captura), Torvo e diálogo, os dois ramos (fogueira + comida: pacto, lore, guardas com inimigo perdendo vida; perseguição: ladrão foge e é alcançado, item Épico, lore). Não testado: Rota inteira por estrada e colisão real.

## v651 (27/10/2026) — missão fixa #13 «O Mapa Astral no Centésimo Degrau»
- **`tools/mapa613.js` (novo):** com a #12 feita, o objetivo manda subir ao **andar 100 da Torre da Ascensão**; depois de limpo o andar (chefe morto, `L.special.cleared`), o **mapa astral** aparece suspenso (14 fragmentos de pedra em órbita, núcleo e anéis de luz), com um selo luminoso em forma de porta e uma **Transmigradora do Mundo de Duas Luas** (figura NPC). Examinar (E) abre o diálogo com o aviso do Narrador.
- **Copiar a hierarquia:** os **Superiores do Arquiteto** entram no Diário (`LORE.q013_superiores`), **+5 de Vontade** (`run.stats.von`, uma vez) e marca `resiste` (resistência a ilusões mentais: só marca, ainda sem efeito de jogo). **Tocar o selo:** visão da porta de casa, `LORE.q013_selo`, sem bônus e sem cópia. Estado em `profile.fixas545.q013`.
- **Simplificações:** a «placa de Edran no portão» não existe no jogo, então o gatilho é só a #12; o chefe do andar 100 é o normal da Torre.
- **Teste (navegador, tecla E real):** andar 100 com chefe derrotado, mapa (captura), os dois ramos (copiar: Vontade 0 -> 5 e lore; tocar: sem Vontade, lore do selo). Não testado: efeito real da resistência a ilusões.

## v650 (27/10/2026) — missão fixa #12 «A Noite em que Aster Ardeu»
- **`tools/noite612.js` (novo):** abre com a #11 feita e **20 minérios que entram na mochila** depois dela (contados por `Surv437.count`; simplificação do «minerar 20 dos 6 veios»), perto de Aster. Dois focos de fogo fora das muralhas, em lados opostos (beco da carroça e depósito de Kael): cones de chama + fogo da grama (`Grass446.element('fire')` renovado a cada 5 s); o jogador **queima** ao ficar dentro (1,5% da vida a cada 0,5 s). Brann dá a escolha (diálogo).
- **Remédios:** 4 incendiários no beco, libertar a carroça (E), ela segue o jogador até a tenda de Mira: **4 moradores vivem** + **2 Poções Concentradas por dia** (`run.pots372`, ao chegar perto de Mira em cada dia novo). **Depósito:** 3 ondas de 3 incendiários; cada um perto do depósito o desgasta; abatidas as 3 ondas, **-15% no custo de aprimorar** (ouro e minérios, `equipmentUpgradeCost` embrulhado, vale em Kael e na Forja de Espólios). Se o depósito cai (0%): sem desconto. Estado em `profile.fixas545.q012`.
- **Depois da noite:** o fogo apaga e a cidade fica normal; o lado sem socorro guarda uma **mancha de queimado** no chão. Objetivo em `intro401.js`, alvo em `campaign327.js`.
- **Teste (navegador, tecla E real):** diálogo, os dois ramos de ponta a ponta com capturas, desconto conferido (9136 -> 7766 ouro), persistência após recarregar. Andou-se por passos de posição (sem colisão); incendiários mortos por `killEnemy`. Não testado: depósito caindo a 0%, madrugada escura (o dia/noite segue o relógio normal).

## v649 (27/10/2026) — missão fixa #11 «O Corredor da Escolha: O Comandante ou os Prisioneiros»
- **`tools/corredor611.js` (novo):** com o Ato V concluído e a #10 feita (Aldric entregue e relato ouvido), a Ordem localiza uma **Fenda Vermelha** a ~150 m de Aster (portal vermelho, bússola e mapa; ponto plano longe de portões, fixado a 90 m). Dentro (`buildSpecial('corredor')`, tema vermelho): a Fenda **desmorona em 150 s**; o **Comandante Marcado** foge com os pergaminhos de rota (corre entre 4 pontos por até 14 s ou até ser alcançado a 2,4 m, quando vira chefe e luta) e **3 soldados de Aster** batem na porta da câmara lateral (oeste); o Narrador insiste em perseguir o comandante. Se o tempo acaba sem decisão, a Fenda expulsa o jogador e o portal reabre.
- **Ramo salvar (arrombar a porta, 3 golpes de F):** o comandante escapa (some), 3 soldados saem; **+15 de confiança em Aster** (`regionEvent116`), **+1 de afinidade com Aldric (respeito)**, e **3 guardas veteranos passam a patrulhar o portão de Aster** (figuras NPC456 que andam de um lado a outro quando o jogador está a menos de 170 m, sempre depois da missão). **Ramo abater (perseguir e vencer):** **Tomo do Comandante: +1 ponto de habilidade** (além do +1 que todo guardião já dá), as batidas na porta param e Aster fica com **3 camas vazias com faixa preta ao lado da tenda de Mira** (luto; Diário `q011_comandante`). Estado em `profile.fixas545.q011`.
- **Correção da #9 (v647):** o ponto da Fenda de Fronteira era fixado a 230 m, antes de os portões vizinhos carregarem; um jogador podia cair num portão do mundo no caminho. Agora fixa a 90 m (igual à #11).
- **Partes ligadas:** `440-instancias-especiais.js` (tema `corredor`, nas listas de `specialSetup2`/`updSpecial2`), `onBossDeath` (embrulhado), objetivo em `intro401.js` e alvo do mapa em `campaign327.js`.
- **Teste (navegador, jogado, tecla E real, vida infinita):** Fenda no mundo à noite (captura), entrada, comandante fugindo e depois lutando, abater (+1 ponto, camas ao lado de Mira, captura), segunda rodada arrombando a porta com 3 toques de E (soldados livres, +15 confiança, afinidade, captura) e guardas veteranos no portão (captura). Primeiro teste do ramo abater matou o personagem de teste (morte verdadeira, nível 1): a vida infinita do teste não segurou um golpe, não é bug da missão.
- **Limites:** a sala é uma arena simples (sem terreno de Fenda); soldados salvos só se mostram dentro da Fenda e depois somem; os guardas veteranos usam o corpo de NPC comum (sem armadura própria).

## v648 (27/10/2026) — missão fixa #10 «O Retorno de Aldric na Chuva» + correção da moeda da #8
- **`tools/aldric610.js` (novo):** no Ato V, depois que Aldric é achado ferido (`a5.s===1`) e o jogador está a mais de 60 m de Aster, Aldric aparece ferido ao lado dele (a chuva fica ligada durante a missão, `WX.type='rain'`). Conversa com as páginas da patrulha levada para a câmara de seleção do Arquiteto e a **escolha**: **(a) escoltar agora** até a tenda de Mira ficando a menos de 8 m, enfrentando batedores da ruptura (2 a cada 11 s, até 3 vivos); se o jogador se afasta mais de 8 m por 1,5 s, Aldric **cai** (uma queda conta) e só levanta se o jogador voltar a 3 m; **(b) escondê-lo sob guarda** (2 guardas da Ordem), eliminar 4 batedores na estrada, voltar a Aldric e levá-lo sem mais batedores.
- **Consequência:** escolta imediata **sem nenhuma queda** → Aldric ensina o traço de **leitura de inscrições: +5% de XP em ruínas** (`gainXp` embrulhado; vale perto de ruínas do mundo, chunk ±1 de `ruinAt`; Diário `q010_leitura`). Com queda, ou pelo ramo (b), ele chega bem mas sem o traço. O texto oficial só dá consequência ao ramo da escolta imediata; o ramo (b) é a versão simples do gerente. Fecha na tenda de Mira (NPC Mira); a etapa «falar com Mira» e o relato com a Lyra do Ato V continuam como antes. Estado em `profile.fixas545.q010`.
- **#8 corrigida:** o Brann do terraço ficava a ~7,6 m da moeda e a conversa fecha a mais de 7 m; e o ponto da moeda coincidia com coletáveis do andar (a interação mais próxima era "colher água"). Agora a moeda e o Brann ficam no ponto mais livre do terraço (`coinSpot`).
- **Pendência da #7 resolvida:** o ramo «avançar direto» foi jogado de ponta a ponta (andares 1–5 sem purificar, chefe com dano normal sem Narrador, moeda, escolha do Dorian). Nada quebrou; a única correção foi a da #8 acima.
- **Teste (navegador, jogado, tecla E real, vida infinita):** os três desfechos (queda → sem traço, rota limpa, sem queda → traço), objetivo na bússola e no mapa, chuva ligada, diálogo com as duas escolhas. Capturas do canvas de Aldric sob a chuva e da queda. Falta ver: Aldric com aparência de ferido (usa o corpo normal), chegada em Aster à noite.

## v647 (27/10/2026) — missão fixa #9 «O Sulco no Metal: As Marcas do Arquiteto» (retomada das missões fixas)
- **Retomada:** Ian pediu para continuar as 300 missões fixas a partir da #9 (decisões técnicas com o gerente). #1–#8 conferidas carregadas (`Fixas545.LIVE`).
- **`tools/sulco609.js` (novo):** depois que Kael examina a arma marcada (missão lateral `kael_weapon` concluída) e o jogador está a menos de 120 m de Aster, cena de Kael (a marca foi gravada a frio, depois da forja). Aparece então uma **Fenda de Fronteira** no mundo (portal vermelho, bússola e mapa apontam) em ponto plano ao sul de Aster, longe de portões; fixado ao chegar a 230 m. Dentro (`buildSpecial('sulco')`): o **Guardião Acorrentado** (chefe da classe de rank do jogador, nível = nível do jogador) preso por **5 pilares de corrente**; sem os pilares quebrados as correntes puxam o jogador para o chefe a cada 6 s (não puxa quem está a 4,5 m de um pilar).
- **Ramo quebrar (5/5 antes do golpe final):** o espírito se solta, a arma é purificada; Kael entrega uma **arma Rara da classe, "… Purificada"**, limpa de maldição. **Ramo direto (abater com correntes ainda presas):** a Fenda fecha em 20 s (em vez de 60) e rende **+3 minérios puros** do rank da Fenda (`run.res.cry`; o texto oficial diz "Minérios"); Kael funde a arma marcada. Estado em `profile.fixas545.q009`.
- **Partes ligadas:** `440-instancias-especiais.js` (tema `sulco`, chama `specialSetup2`/`updSpecial2`), `onBossDeath` (embrulhado), objetivo em `intro401.js` e alvo do mapa em `campaign327.js`. Sem texto de mana/núcleo na missão: nada do sistema de mana foi ligado.
- **Bug achado e corrigido na main (v645):** `inConversation()` (`370-v281.js`) dava `true` sempre, porque `#dialog401` escondido por `hidden` tem `style.display` vazio; isso bloqueava a tecla de interagir (E/F), ataques e câmera em todo o jogo. Agora olha `hidden` e o estilo calculado.
- **Teste (navegador, jogado, tecla E real):** cena de Kael com diálogo; caminhada pela estrada sul até o portal; entrar; quebrar os 5 pilares (5/5, espírito livre) e abater → arma Rara na bolsa; segundo percurso quebrando só 1 pilar e abatendo → +3 minérios, Fenda em 18 s, Kael funde a arma. Capturas de canvas do portal, da sala acorrentada e dos pilares quebrados. Só o golpe final foi dado por código (`hurtEnemy`), vida infinita no teste.
- **Limites:** a estrutura do chefe (rank e habilidades) vem da lista `BOSSES` existente; o sistema de pilares é o mesmo para qualquer rank. O retorno da Fenda leva o jogador a Aster (regra do jogo), onde Kael encerra a missão.

## v646 (27/10/2026) — Mana: 60 inicial, mago, Espírito, Domo só com núcleo, extrair no chão, peso, refino
- `mana642.js`: mana máxima mínima 60 (`statsFor`; classes com mais mana mantêm a delas); classes de mago (`MAGIC_CLS`): +2 de mana por hora, +10 de aproveitamento (máx. 100), −10 de erro (mín. 1); Espírito multiplica a regeneração (`pManaRegen281`); segurar **E** 0,6 s sobre um núcleo caído (3,5 m) o pega e começa a extrair, toque curto abre o saque; núcleos pesam 1/1/2/3/5 kg (comum/elite/chefe/Fenda/dragão) e entram na carga de `survival437.js`; **Refinar** na ficha (3 núcleos → 1 do rank seguinte, só em cidade). `economy154.js`: Domo = 55 núcleos (reparo 5), sem minério.
- **Não feito (decisão provisória do gerente):** runas ligadas por núcleo e núcleo como combustível de relíquias — mudariam o que o jogador já tem equipado (regra sem-retrocesso); ficam para Ian decidir. Encantar equipamento com núcleo também fica de fora.
- Teste (v644 local antes de rebase): mana máxima 60; mago 3/h × guerreiro 1/h; erro 30 → 20 (mago); peso 2 kg; Domo 55 núcleos; refino 3→1; E segurado inicia a extração; toque curto abre o saque.
## v645 (27/10/2026) — bloqueio total de ataques e troca de câmera durante conversas
- Pedido de Ian: "quando to em conversa eu posso acidentealmnete dar golpes nos npc oq não deveria acontecer eu não pdoderia nem mudar de camera caso não saissse da converesa eu quero que essas mecanicas funcionem do jeiot correto".
- Função `inConversation()` criada no núcleo (`src/core/370-v281.js` e exposta em `window.inConversation`): detecta ativamente diálogos da história (`Intro401.conversation`), diálogos do Skyrim (`#skyrim-dialog`, `.dlg520`, `.story401`, `Dialogo520.active()`, `#dialog401`). Integrada também a `isCinematic451()`.
- Bloqueio de golpes e magias em conversa: `attack()`, `useSkill()` e `mouseHeld` bloqueados em `380-acoes.js`, `400-loop.js`, `630-controles.js` e `skyrim588.js`; `crime545.js` impede qualquer dano em NPCs com diálogo aberto (`n.talk575` e `inConversation()`).
- Bloqueio de câmera e atalhos em conversa: alternância de 1ª/3ª pessoa (`KeyV` / `pov` / `FP550.toggle()` / `FP550.set()` / zoom de roda do mouse) bloqueada com aviso «Saia da conversa para mudar a câmera.»; atalhos de lote (`1-4`), habilidades e pulo pausados no `630-controles.js` para não conflitar com as opções [1-9] da conversa.
- Teste: verificação de sintaxe `node --check` em todos os módulos e scripts inline, `build.py` ok, `core_parts.py check` ok.

## v644 (27/10/2026) — defender apenas no meio (roda do mouse); mira e câmera no direito
- Pedido de Ian: "troca pra mim, deixa o botão de defender apenas na roda do mouse clicando se segurando, e a mira pelo direito".
- Defesa: mapeada exclusivamente para o botão do meio (`e.button === 1`), clicando e segurando a roda do mouse; `pointerdown`, `mousedown` e `auxclick` com `preventDefault` para eliminar autoscroll em qualquer navegador; soltar no meio (`pointerup`/`mouseup`/`blur`) encerra a guarda imediatamente; nenhum outro botão defende.
- Mira e Câmera: botão direito (`e.button === 2`) arrastado gira a câmera livremente / mira (em 1ª pessoa gira o corpo/visão; em 3ª pessoa orbita a visão); clique curto (< 8 px) trava/solta a mira no alvo (`W377.toggle(true)`). O botão direito não defende em hipótese alguma.
- Limpeza de cache / PWA: `tools/guard472.js`, `tools/skyrim588.js`, `tools/witcher377.js` e `tools/skyrim-overhaul538.js` atualizados para `?v=644` no HTML e no `sw.js` (eliminando o cache antigo que mantinha o botão direito com defesa); removidos ícones excluídos (`icon-192.png`, `icon-512.png`) do array `CORE` do `sw.js` para garantir instalação limpa do Service Worker (`pds-v644`).
- Teste: verificação de sintaxe `node --check` em todos os módulos e scripts, `core_parts.py check` ok, compilação de `build.py` ok.

## v643 (27/10/2026) — Mana: fogueira acesa e tenda portátil, guarda do sono
- `mana642.js`: perto de fogueira acesa (Build437, 6 m) regenera 2 por hora; a tenda portátil (`build437.js`) deixa de encher a mana e dá 24; a guarda do sono por pousada/casa usa o objeto `run.rested`. Testes: 1 hora do jogo (150 s) andando 1, parado 2, fogueira 2, Fenda 1 (relógio normal), nível 300 = 4, tenda 24, pousada +32 (limitado à barra); extração de 60 s e fadiga de 150 s simuladas quadro a quadro; save antigo (anel de mana, minérios e núcleos) carrega como Minério.
## v642 (27/10/2026) — Sistema de Mana (PDF v4 aprovado por Ian)
- `tools/mana642.js` (`window.Mana642`): regeneração de mana **por hora do jogo** (1 h = 150 s reais; relógio normal, também na Fenda): 1 andando, 2 parado, +1 a cada 100 níveis, +1 a cada 25 pontos de Restauração; dormir (pousada/casa) devolve 32. `naturalRegen().mp` agora é 0 (a conta antiga foi trocada). **Núcleos** com mana = tipo (5/20/50/120/300) × rank (1,2,4,7,12,20,35,60,90,140) × ameaça (1..10,12,15), guardados em `run.nuc642` (`run.res.core` segue sendo a contagem do Domo/venda e é sincronizada). Drop: comum 1 em 10, elite 1 em 3, chefe/Fenda/dragão sempre 1 (`370-v281.js`). **Extração** em 9 graus (`run.mana642 = {g,t,hh,last}`): porção, aproveitamento, erro (30/18/10/4 +10 por extração, máx. 90), fadiga de 1 h do jogo, tempo 60→20 s, Treino 10…100, cancela com dano; botão **Extrair** por núcleo na ficha (Status → MANA E EXTRAÇÃO); subir de grau na ficha numa cidade (Mestre de Extração: Treino cheio + nível + ouro). **Acessórios**: 16 peças (10 anéis, 2 brincos, 2 braceletes, colar, coroa + 3 gemas), capacidade = base da raridade × fator do rank × peso, `run.acc642`; aparecem em Bolsa → Itens e Dorian vende Comum/Raro/Épico no rank do jogador (preço = capacidade × 4). Mana nova com a barra cheia vai para os acessórios; com a barra vazia o jogo puxa deles ao lançar (`resourceError260`). Ataque básico mágico continua 1/s.
- **Minério × núcleo:** "Cristal de mana" passou a se chamar **Minério** (textos de mercado, forja, obras, missões). **Forja** = 10 minérios do rank + ouro (sem núcleo, sem mana); fundir com Ecos = 100 minérios sem núcleo. Migração de save: `Mana642.ensure()` cria os campos, mantém `res.core/res.cry`, cria um núcleo comum por núcleo antigo e converte o anel de mana (+10%) em anel comum F de reserva.
- **Decisões provisórias do gerente (perguntas abertas do PDF):** (5) começo 30 de erro como no PDF; (6) provas de Treino 10/15/20/30/40/60/80/100 como no PDF; (7) nível mínimo trava o grau; subir de grau paga ouro (300, 1.200, 4.500, 15 mil, 48 mil, 150 mil, 450 mil, 1,4 mi) num instrutor em qualquer cidade (o PDF v4 dizia sem professor; Ian pediu instrutor); (8) 16 peças como no PDF, sem peças extras; (9) sem teto de capacidade; (10) erro quebra o núcleo; (11) anel antigo vira anel comum; (12) mana máxima e Inteligência não mudam (hoje 28 no nível 0, o PDF dizia 60: a calibrar); (13) Estrela entra na tabela (×140), grau 9 só extrai até SS+; Espírito (regeneração %) e bônus de mago (+2/h, −10 erro, +10 aproveitamento) **não** foram ligados; Alquimia soma +1 de aproveitamento a cada 5 pontos. Não feito: Domo só com núcleo (55), encantar/runas/combustível/refino com núcleo, peso dos núcleos, tenda/fogueira dormindo (3 por hora), segurar tecla sobre o núcleo no chão.
- Teste (navegador local): chefe elite morto → núcleo 20 de mana no saque → pego → extração com acerto (6 entraram no anel, Treino 1/10, fadiga de 150 s) e com erro (núcleo quebrou) → anel enche → barra em 0 puxa do anel ao lançar → dormir devolve 32 → ficha, bolsa e mercado abrem sem erro → migração do save antigo.
## v641 (27/10/2026) — Menos chamadas: grama só à frente, objetos pequenos somem com a distância, oclusão por relevo
- `culling637.js`: (1) **LOD por distância** das malhas pequenas sob `L.group` (raio < 2,5 m somem além de 45 + 55·raio m; ~300 malhas, ex.: peças das Fendas, decalques); (2) **oclusão por relevo** dos tiles de árvores distantes (3 raios câmera→tile sobre `terrH`, >320 m); (3) stats em `Culling637.stats()`.
- `grass446.js`: a grama/flores só entram no buffer na frente da câmera (±100°, e tudo a menos de 10 m); o anel refaz a cada 0,35 rad de giro (máx. 8 vezes por segundo).
- **Medido (renderer.info, mesmos pontos, lado A/B):** chamadas v639 → v641: floresta 344/356 → 272/276; campos 361/302 → 258/236; colina 387/343 → 319/310. Triângulos: floresta 2,06/2,17 mi → 1,32/1,33; campos 2,23/2,20 → 1,02/1,12; colina 1,73/1,54 → 1,23/1,08. 53–60 fps, 0 erros. Falta: fundir malhas repetidas (colina ainda ~310 chamadas) e não desenhar o mundo atrás de casa/masmorra/Fenda (não medido).
## v640 (27/10/2026) — "O que eu não vejo não é desenhado": corte por quadro e animação em ritmo baixo
- **Medido na v639 (renderer.info, 1280x720, Edge GPU):** 34 InstancedMesh com `frustumCulled=false` (883 mil triângulos, 21 mil instâncias; entre eles as 11 mil árvores distantes da v637, a grama e o enfeite dos pedaços) e 84 malhas com pele sem corte (412 mil triângulos) eram desenhados por inteiro mesmo atrás da câmera: olhando para um lado ou para o outro dava o mesmo total (~2,1 mi de triângulos, ~350 chamadas).
- `tools/culling637.js` (`window.Culling637`, embrulha `renderer.render`): a cada quadro monta o frustum e só liga os InstancedMesh sem corte cuja esfera (das instâncias, ou `userData.sph637`) o cruza; personagens com pele fora do frustum e a >30 m não são desenhados; `Culling637.mix` (usado em `animGlb` do `140`) roda o `mixer` de monstro fora da vista ou a >70 m a cada 4 quadros (8 além de 150 m) acumulando o tempo. Sem sombra em mapa, então a imagem não muda. Fora do corte: grama/flores (anel que se refaz) e o que o CULL180/golpes487 já controlam. `horizonte637.js` agora faz tiles de 448 m com esfera própria.
- **Antes → depois (triângulos / chamadas):** floresta 2,06 mi/344 → 1,31 mi/360 (lado A), 2,17 mi/356 → 1,58 mi/307 (lado B); campos 2,23 mi/361 → 1,39 mi/377 e 2,20 mi/302 → 1,42 mi/335; colina 1,73 mi/387 → 1,38 mi/366 e 1,54 mi/343 → 0,80 mi/298. Animação: ~82% das atualizações de mixer puladas. 60 fps nos dois; 0 erros; câmera girando rápido sem árvores faltando.
- **Não feito:** grama/flores por pedaço (ainda ~11 mil instâncias em anel); oclusão por muralha/montanha/casa; IA já remove selvagens a >90 m.
## v639 (27/10/2026) — Lugares no caminho: ruínas, acampamentos, altares, cavernas, torres, fazendas, cemitérios (Etapa 3 de 3)
- `tools/lugares637.js` (`window.Lugares637`): grade de 224 m (hash do mundo, 84% das células) → ~537 lugares num raio de 3 km, **~0,8 lugar por 300 m de caminhada** (a menos de 70 m do trajeto). Fora de cidades (170 m; capitais 330 m), estradas (22 m), rios, mar, postos e ruínas antigas. Tipo por bioma (`BIO`): campos/flores → fazenda, torre, altar, acampamento, ruína, cemitério; floresta → acampamento, altar, cemitério, ruína, caverna, torre; pântano, neve, vulcão, deserto, cristal têm tabelas próprias.
- **Estruturas** do kit do cenário (EnvBatch/InstancedMesh, com colisor), montadas por `loadChunk` (`250`: `Lugares637.build`). **Baú** como o das ruínas (`envChest` + `rollItem`, uma vez por jogador, `profile.lug637[id].o`); **altar**: F reza e restaura a vida (5 min de recarga); **guardiões** = inimigos do bioma (`spawnKind` + `worldKinds124`, grau = maior entre perigo e rank−2) que nascem a 75 m, sem respawn depois de limpos (`.c`) e somem se o jogador se afasta sem combate.
- **Descoberta** a 120 m (aviso «[LOCAL] … descoberto»): vira ícone na **bússola** (`explorar539.js`, glifos ◭ ▲ ✦ ◖ ♜ ⌂ ✝) e no **mapa 3D** (`mapa3d544.js`, ícones novos ruin/altar/cave/tower/farm/grave; acampamento usa o `camp`), só os descobertos.
- Teste (Edge GPU): os 7 tipos montados e fotografados, descoberta + guardiões + bússola OK, 0 erros; 52–54 fps andando 300 m (igual ao v638).
- **Não feito:** pontes (precisam de geometria sobre o rio; ficam para depois) e interação nos acampamentos além do baú. Inimigos dos lugares são os do bioma, não "bandidos" próprios.
## v638 (27/10/2026) — Densidade: mais árvores em bosques e enfeites por bioma (Etapa 2 de 3)
- **Árvores:** `210-bloco-environment128-cont.js` (`envChunk`): limite do ruído baixou (floresta .40→.34, vulcão .70→.66, resto .56→.50) e o sorteio solto 3,5%→4,5%; a camada distante da v637 (`horizonte637.js`) usa a mesma regra. As espécies seguem o catálogo regional (`flora-regioes.js` / `TripoEnvironment153.treeOk`).
- **Enfeites** (`tools/enfeite637.js`, `window.Enfeite637`, chamado no fim de `envChunk`, gerador próprio — não muda os sorteios de antes): 1 a 3 por pedaço de 64 m (+ sepulturas onde o perigo é ≥4): carroça quebrada com barris/caixas/saco, cerca caída (cerca de pedra do kit), pilha de troncos com toras e tocos, ossadas (+ poste de caveira com perigo ≥2), tronco morto, grupos de cogumelos, círculo de pedras, canteiro de flores; tabela por bioma (deserto/neve/cristal/vulcão/pântano/floresta/campos). Tudo em InstancedMesh (`EH`/`EW`), com colisor quando sólido, e respeita cidade, estrada, lago e rio (`cityD`). Pedras/ervas soltas: 150→240 por pedaço.
- Teste (Edge, RTX 4060): 52–54 fps andando 300 m em floresta/campos (v637: 51–54), pior quadro 94–100 ms; 0 erros; capturas antes/depois do mesmo ponto e de cada tipo de enfeite. `log_stack` do kit é uma caixa lisa (ficou feio de perto; trocar quando houver modelo melhor).
- Não feito: lugares no caminho (Etapa 3).
## v637 (27/10/2026) — Horizonte cheio: árvores distantes, névoa rala e perspectiva atmosférica (Etapa 1 de 3)
- **Pedido de Ian:** o mundo parecia vazio e as coisas "apareciam aos poucos". Causa medida: árvores reais só até 90 m (`split423`), névoa FogExp2 ~0,0076 (opaca a ~300 m) e o chão distante (v529) sem nenhuma árvore.
- `tools/horizonte637.js` (novo, `window.Horizonte637`): **~11 mil árvores distantes** (InstancedMesh, ~40 triângulos, 1 desenho por espécie) de 70 m a 1,05 km, na mesma regra de bioma/ruído do cenário (mesmas espécies: pinheiro/carvalho/outono/salgueiro/neve/cristal/brasa; sem árvore no deserto, nas cidades, estradas e rios; nem acima de 120 m de altura). Posições vêm do mundo (hash), refeitas em fatias de 4 ms quando o jogador anda 160 m ou a estação muda. Entram por **dithering** entre 80 e 112 m, sobrepostas às árvores reais (agora até 105 m em `680`), sem aparecer de repente.
- **Atmosfera:** `fog.density × 0,42` no mundo (após `look154`/`witcher377`; a água e a masmorra não são afetadas) e o chão distante (`capitais504.js`) mistura com a cor da névoa até 85% com a distância.
- Teste (Edge, RTX 4060): capturas antes/depois do mesmo morro e de caminhada de 300 m; 60 fps parado (antes 60) e 57,9 fps andando (antes 57,3); pior quadro 93 ms (antes 90); 0 erros. Carga da v631 não mudou (a malha é feita depois do mundo, em fatias).
- **Não feito ainda:** densidade (Etapa 2) e lugares (Etapa 3). Árvores do TRELLIS e do Antigravity não foram mexidas.
## v636 (27/10/2026) — rolamento de verdade (animação feita no Blender)
- **Pedido de Ian (via diretor):** Shift + direção fazia o mesmo "dash" do toque duplo (a esquiva antiga era um clipe de 0,32 s). Agora **rolar** é um rolamento de verdade e o **dash** é outra coisa.
- **Animação:** `models/anim-rolar632.glb` (34 KB, clipe `rolar`, 0,667 s a 30 fps, 79 ossos do esqueleto Mixamo do `anim-viajante155.glb`, loop fechado: primeiro e último quadro = pose de idle). Feita em Blender 5.2 por `tools/blender/rolar632.py` (`blender -b --python rolar632.py -- anim-viajante155.glb anim-rolar632.glb`): parte da pose do clipe `idle`, gira o quadril 360° em torno do eixo lateral (quadros 3–15) com encolhimento (coluna, pescoço, coxas −95°, canelas +115°, braços e antebraços à frente) e baixa o quadril 14 cm; as rotações são aplicadas no referencial do osso pai. `warrior-player127.js` carrega o GLB junto dos outros 25 clipes (`clips.rolar`) e toca `rolar` quando `st.roll632`.
- **Jogo:** `mover632.js` — Shift + direção: 0,65 s, ~2,9 m, invulnerável 0,43 s, recarga 0,9 s, 20 de Estamina; o personagem vira para a direção e rola para a frente (mesmo clipe para os 4 lados). `400-loop.js`: duração/velocidade do rolo (`rollDur632`, `rollSpd632`) em vez do 0,32 s fixo. **Dash** (toque duplo): 3,6 m em 0,2 s, sem rolar, sem invulnerabilidade, 10 de Estamina.
- **Velocidades (pedido: restaurar as de antes da v632):** conferido no jogo v631 × atual — andar devagar 1,85 · andar 4,2 · correr 5,8 m/s (`sprint373.js` não muda desde a v548; correr não gasta Estamina). A v632 só tirou `C/Alt` da condição de andar devagar. Com Alt + W o jogo marca corrida; o toque rápido no Alt trava/destrava a corrida (`RUNLOCK378`, como era no Shift): se Ian tocou o Alt sem querer, andar e correr ficam iguais até tocar de novo.
- Teste: jogo real — rolar nos 4 lados e em 1ª pessoa (2,93 m, 650 ms, estado `rolar`), dash (3,6 m, sem `rolar`), poses congeladas do clipe e captura ao vivo.

## v635 (27/10/2026) — Teste real da agua viva + atalho `Primeva.testeEnchente()`
- **Achado**: o leito fundo so existe perto do jogador (terrH carrega depressoes de rio/lago ao redor dele); longe, a profundidade lida e ~0. Rio fundo real: ~(-2937, 206), profundidade 2,3 m no centro; lago real: (-6784, -1673), raio 20, 3,4 m. Teleporte e espera de 2,5 s antes de medir.
- **Atalho (sem botao no HUD)**: no console (F12) `Primeva.testeEnchente('rio')` ou `('lago')` leva ao rio/lago mais perto, monta fogueira, barraca, carrinho e um despojo na margem, forca chuva e acelera x12 (`RAIN626.fast`, em `rain387.js`). `Primeva.testeEnchente.fim()` para a chuva (agua baixa); `.estado()` mostra nivel, enchente, fogueira, quanto cada coisa foi arrastada e umidade/fertilidade da margem. Arquivo `tools/teste-agua634.js`.
- Testado (Edge GPU) rio e lago, chuva -> enchente -> baixando: nivel 0 -> 0,8 m, enchente 0 -> 1, fogueira apaga, barraca e carrinho arrastados (rio: 12-85 m; lago: 3-5 m para a margem), despojo arrastado 1-8 m (some quando o cristal expira), chao vira lama escura; fertilidade da margem sobe (rio 150 -> 231, lago 179 -> 255).
- **Corrigido**: despojos eram procurados em `enemies` (nao existem la); agora `Loot353.records()`. A margem alagada nao ficava mais fertil porque o tick do EcoGrid so passa por 2 chunks por ciclo; `enchente630.js` agora sobe umidade (+25) e fertilidade (+3) por segundo nas celulas sob a enchente num raio de 24 m. Lago: correnteza radial para a margem.
## v634 (27/10/2026) — mouse volta ao de antes: meio defende, direito gira a câmera
- **Decisão do diretor (Ian achou a v600 horrível):** **defender = segurar o botão do meio**; o botão direito **não defende em hipótese alguma** e **gira a câmera arrastando** (clique curto trava/solta o alvo), como antes da v593/v600. O pointer lock da v600 saiu (`tools/mouse600.js` removido; `fp550.js` voltou a ser o da v599).
- `guard472.js` e `skyrim588.js` (ponte direito→meio removida; o meio saca a arma), `skyrim-overhaul538.js` (texto do bônus de bloqueio), `400-loop.js` (arrasto de câmera sem a trava `MOUSE600`), `630-controles.js` (texto de Controles) e o `sw.js` ajustados; `mousedown` do meio com `preventDefault` (sem autoscroll). As teclas salvas não mudam com isso (mouse não é remapeável), então não há migração.
- Teste: jogo real — arrastar com o direito gira a câmera (−0,42 rad em 140 px) sem defender; segurar o meio defende e soltar para; o direito parado não defende.

## v633 (27/10/2026) — reverte os degraus da v632
- Decisão do diretor: os degraus de 45 cm (`170-colisao.js`) vinham de uma leitura errada do áudio de Ian e ninguém pediu. `src/core/170-colisao.js` voltou exatamente ao que era antes da v632 (`STEP600` saiu). Rolar (Shift + direção), impulso (toque duplo) e correr no Alt continuam. Teste: rolar 2,9 m (−20 Estamina), impulso 3,7 m (−10), Alt corre (7,8 m em 1,5 s), muralha de Aster segura rolos (57,9 m).

## v632 (27/10/2026) — movimento fluido: rolar, impulso, correr no Alt, degraus
- **Pedido de Ian:** Shift = rolar; toque duplo = impulso; correr no Alt; degraus/escadas fluidos.
- **Teclas (`630-controles.js`):** `dodge` (Rolar) → **Shift**, `sprint` (Correr, segurar) → **Alt** (toque rápido no Alt trava a corrida). Migração única (`pds_keys_move632`): só `sprint` e `dodge` salvos voltam ao padrão novo; o resto das trocas fica. Removida a regra antiga que apagava `dodge` em Shift. O Alt já não abre o menu do navegador (`witcher377.js` faz `preventDefault`). Em `400-loop.js` saiu `keys.KeyC/AltLeft` do "andar devagar" (C agora é combinação, Alt é correr).
- **Rolar (`tools/mover632.js`, novo):** é a esquiva de sempre (invulnerável 0,38 s, recarga por Agilidade) + custo de **20 de Estamina** (sem Estamina: "Sem fôlego"); sem direção rola para a frente (a animação de rolar é para a frente); não rola nadando.
- **Impulso:** dois toques em W/A/S/D (setas) em até 0,25 s → avanço de ~3,6 m (0,2 s a 18 m/s), sem animação de rolar (`P.dashNoRoll632`), sem invulnerabilidade, 10 de Estamina, recarga de 0,9 s; relativo à câmera; ignora com Shift/Ctrl/Alt.
- **Colisão:** rolar e impulso passam pelo `moveEnt` (passos de 25 cm): muralha de Aster ficou em 57,9 m do centro (parede a 60) em 6 rolos e 6 impulsos; água funda: o rolo para ao chegar em 1,3 m de profundidade (guarda em `mover632.js`).
- **Degraus (`170-colisao.js`):** antes qualquer colisor com altura bloqueava (só dava para subir pulando) e descer virava queda. Agora o jogador no chão sobe degraus de até **45 cm** sozinho (`STEP600`; `worldFree`/`pushOut` aceitam colisor até 45 cm acima dos pés; `stepVertical357` sobe a 5 m/s e desce a 9 m/s sem entrar no estado de queda). Teste: degraus de 0,3/0,6/0,9 m subidos sem pular (jy 0→0,3→0,6→0,9), descida sem nenhum quadro no ar, parede de 2,5 m continua bloqueando e pular continua funcionando. Pode haver props baixos (≤45 cm) que agora se sobe em cima.
- Teste: jogo real (Edge, GPU) — rolar em 3ª e 1ª pessoa, impulso, Alt corre (7,6 m em 1,5 s contra 5,0 andando), parede, água, degraus, migração por flag, tela de Controles com a linha nova. **Não testado:** rolar com cada classe/arma e montado (a rotina é a mesma da esquiva), escadas de masmorra (são portais F, não degraus).

## v631 (26/10/2026) — Carregamento: compilacao em paralelo + medida real com cache
- **Medido (Edge, RTX 4060, ANGLE D3D11)**: 1a visita (cache de shader vazio) ~11 s atras da tela CARREGANDO MUNDO; **visita seguinte (cache do navegador) ~3,6-3,9 s** e quase nenhum quadro > 150 ms depois. A tela agora avisa que a 1a vez demora mais.
- `carga630.js`: usa `KHR_parallel_shader_compile` (checkShaderErrors desligado so durante o carregamento; espera `COMPLETION_STATUS` de todos os programas antes de soltar): 11,7 -> 10,7 s a frio. Ganho pequeno: a compilacao e quase toda serial no driver.
- Achado: ~107 programas; MeshStandard ~25 variantes (fragment ~57 KB cada, por onBeforeCompile/defines diferentes), Toon ~12, ShaderMaterial de VFX ~35 (prewarm de `golpes487`). Durante o carregamento da pagina (titulo) o three compila 3 geracoes de Toon/Standard porque as luzes mudam (5 pontos/1 dir/1 hemi -> 3/1/1 -> 3/2/2 quando `dream488` entra): antes do clique, fora da tela de carga. Proximo passo possivel: criar as luzes finais no inicio do `game.html` (antes do 1o desenho) e unificar variantes de MeshStandard.

## v630 (26/10/2026) — Tela de carregamento no lugar do congelamento + enchente viva
- **Medido (Edge headless, sem cache de shader)**: ~40 programas de ~200 ms cada (~9,5 s) compilam no 1º desenho; o custo e por programa (quantidade), nao pelo tamanho: reduzir luzes de ponto 6 -> 3 (`performance350.js`, pool fixo) so encolheu o fragment em ~2% e nao mudou o tempo.
- `tools/carga630.js` (novo): `startGame` mostra "CARREGANDO MUNDO..." antes do trabalho pesado e so solta o jogador depois de 30 quadros seguidos < 110 ms (maximo 15 s). Resultado: o travamento de ~7,5 s + rajada de 0,3-0,8 s por ~4 s agora acontece atras da tela; depois dela nao ha quadro > 150 ms. **Nao** zerou o tempo total de compilacao (~11 s); isso exige menos programas ou three com compilacao assincrona.
- `tools/enchente630.js` (novo): com `RAIN626.flood` alto, fogueira na agua perde o fogo (aviso), barraca (abrigo), carrinho solto e despojos de inimigos mortos sao arrastados rio abaixo (~1-3,5 m/s, malha e interacao acompanham). `Build437.spawned` e `Cart437.moveTo630` exportados.
- Teste (Edge, agua simulada por falta de rio fundo achado): fogueira apagou, barraca/carrinho andaram ~3,5 m em 6 s, canoa embarca, anda e fica na superficie da agua nova. Despojos/lago nao testados.

## v629 (26/10/2026) — Congelamento de shader: causas medidas e 1a reducao
- **Medido (Edge GPU, cache de shader burlado)**: o chao era ~5 s por programa (3 programas). O vertex shader do chao tinha 12 copias inlinadas de `terrH245`; o fragment (iluminacao padrao, 6 luzes de ponto) e o resto. Ruido, sombras e as camadas v626/v627 contam pouco (~1 s).
- `tools/terrain245.js`: o chao calcula o relevo 3 vezes por vertice (`tgCompute245`: centro + 2 vizinhos) e reaproveita na elevacao, na normal e na estrada. **Programas do chao: ~4,7 s -> ~2,1 s cada.** A normal e a inclinacao viram diferenca adiante (leve mudanca, visual conferido).
- `tools/dream488.js`: hemisferio e luz direcional do sonho existem desde o inicio com intensidade 0 (antes eram criados/removidos e a mudanca de contagem de luzes recompilava todos os shaders). Gaps de ~10 s e ~5 s ao entrar/sair do sonho caem para ~2 s.
- Tentativas descartadas: pre-compilar no titulo, `checkShaderErrors=false` + `renderer.compile` periodico (a espera so muda de lugar, o r128 bloqueia no 1o desenho). Texturas de ruido nao ajudam (ruido barato = so -1 s).
- **Pendente**: ainda ha travadas de 2 a 7 s ao entrar no mundo (programas de ~0,4 s de outros materiais: Standard com 6 luzes de ponto ~58 KB cada, ~34 variantes no sonho). Caminho: menos luzes de ponto (pool 350 de 6 para 3), ou three mais novo com compilacao assincrona.
- Agua (teste de jogabilidade): nadar ok; enchente aumenta a profundidade em 0,8 m. Nao testado/feito: barco, fogueira apagada, barraca arrastada.

## v628 (26/10/2026) — Água viva e mais real (rio, lago, mar, embaixo d'água, enchente)
- `tools/water154.js` (lago e rio): reflexo do céu (Fresnel), espuma de margem em linhas, raso mais transparente, turvação marrom na enchente; rio com correnteza (padrão corre no sentido do rio, mais rápido na enchente) em `580-bloco-b` (`riverMat240`). `tools/sea439.js`: ondas com amplitude `uAmp` (cresce com a chuva e a enchente) e nível do mar sobe até 0,4 m.
- **Água viva**: `RAIN626.acc` (chuva acumulada, em `rain387.js`: ~70 s de chuva forte enche, ~5 min seca) -> `rise` (até 0,8 m no rio/lago) e `flood`: a água sobe e alarga até 5 m por lado pelos baixios (vértices, sem novo mesh). `water391.js` (nado/profundidade) acompanha o nível e a largura. Chão alagado (EcoGrid com umidade alta) vira lama escura e brilhante (`ecossistema550.js`, `uFlood626`) e a margem alagada ganha fertilidade.
- `tools/agua628.js` (novo): marolas ao andar/boiar, respingo com gotas ao entrar na água (`Agua628.splash`); embaixo d'água a névoa fica azul-esverdeada curta, com tinta e raios de luz na tela.
- Teste (Edge GPU): 60 fps; capturas de rio, lago, mar, embaixo d'água, respingo e enchente antes/depois (acc=1).
- **Não feito (honesto)**: apagar fogueira / arrastar barraca, carrinho e itens soltos na enchente; som abafado embaixo d'água; corredeiras nas pedras e refração real do fundo; estradas e cidades já não têm rio (cidade a menos de 220 m não monta água), mas o nível sobe também sob pontes.
- Congelamento de ~10 s ao 1º carregamento: medido — são 3 programas do shader do chão de ~5 s cada (o fragment do chão, com a iluminação padrão, leva ~4,5 s; a v626 acrescentou ~1 s); já existia antes. Pré-compilar no título e `checkShaderErrors=false` NÃO resolveram (foram descartados).

## v627 (26/10/2026) — Pisoteio realista + chuva de verdade (chão molhado, poças, respingos)
- **Pisoteio (EcoGrid v550 → chão)**: `ecossistema550.js` trilha pisada vira terra batida com borda irregular e sulcos; por bioma: neve suja, areia compactada, cinza escura, lama no pântano; úmido/chuva vira lama escura e brilhante (`mudK626`). Teste: 480 pisadas em círculo → campo vira trilha de terra sem capim, pântano lama, deserto areia batida.
- **Chuva** (`rain387.js` + `chao626.js`): estado `RAIN626` (intensidade variável `k`, vento em rajadas, `wet` sobe em ~10 s e seca em ~90 s, `pud` enche em ~35 s e seca em ~160 s). Chão molhado escurece e fica liso; poças em manchas nos baixios planos e nas ruas; respingos (anéis) no chão e na água; gotas e respingos escalam com a intensidade; céu/névoa pesam mais com a intensidade (`450-oraculos`). A umidade do EcoGrid sobe até 235 na chuva e seca devagar até a do bioma.
- Teste (Edge GPU): 60 fps com chuva; capturas com/sem chuva em deserto, neve, pântano e campo; sem erro de shader.
- **Pendente (honesto)**: fio d'água dos beirais não feito; poça não reflete o céu de verdade (só tinge); a 1ª carga do mundo trava ~10 s compilando o shader do chão (mais pesado desde a v626).

## v626 (26/10/2026) — Chão realista medieval por bioma (camada nova)
- **Pedido de Ian**: "o chão é meio feio; a pedra é tudo uma coisa só, o deserto também, a neve também".
- `tools/chao626.js` (novo, carregado depois de `ground446.js`): última camada do shader do chão. Mistura por inclinação, altura, umidade, distância e ruído em várias escalas, usando as máscaras de borda irregular do `terrain153` (transição sem borda reta). Campo/floresta: manchas de terra, pedrinhas, folhas e raízes. Pântano: lama escura, poças brilhantes, alga. Deserto: duna com crista clara, ondulação, cascalho, manchas ocre. Neve: tons azulados nos baixios, ondulação de vento, terra/rocha onde o vento varre (some o desenho de "quebra-cabeça"). Vulcão: basalto, cinza e rachaduras de brasa (emissivo). Rocha em encosta/altura: estrato, fendas, cascalho no pé, musgo em faces úmidas viradas para cima; paleta por bioma. Relevo falso (bump) de pedrinha/duna por derivada de tela.
- Não mexido: árvores, ambiente Antigravity, capitais, grama de fios, chuva. Trilhas (v512) e estradas preservadas (`trail626`).
- Teste (Edge GPU): 60 fps antes e depois; capturas antes/depois em rocha, deserto, neve, campo, pântano, vulcão, floresta; sem erro de shader.
- Pendente: pisoteio do EcoGrid (v550) ainda não alimenta o chão; chuva/poça molhada virá depois e deve ler `pud626`/`roughK626`; grama de fios cobre muito o chão do campo.

## v625 (26/10/2026) — Capitais: casas realistas por raça + fim do anel antigo redondo
- `tools/capitais504.js`: `grade()` aplica nas casas e prédios das 5 capitais um acabamento realista (dessatura o cartoon, paleta por raça, grão de material, sujeira no pé, musgo em Thalor/Verden, neve nos telhados de Ymiria/Urdan); chamado também pelo `capitais597.js` nos bairros. O anel antigo (muralha de 60 m, as 8 torres/bandeiras, os anéis de 85/115 m, os portões internos e os colisores desses anéis) não é mais criado nas capitais.
- Teste (Edge GPU): 60 fps nas 5 capitais, 37–41 NPCs, capturas de rua de Zahar, Urdan, Thalor, Verden e Ymiria sem o anel.
- Pendente: as casas ainda são os modelos Tripo regradados (não há modelo novo de adobe/palafita/forja/catedral); palafitas de Thalor e forjas de Urdan precisam de modelos.

## v624 (26/10/2026) — Urdan, Thalor, Verden e Ymiria no kit de muralha realista
- O kit da v623 é genérico: as 4 capitais restantes já trocaram a muralha/torres Tripo por geometria própria + material procedural, com contorno poligonal próprio (Urdan lado norte reto na serra, Thalor lado do mar reto, Verden 15 lados, Ymiria angulosa) e subúrbio nos portões. Identidade: Urdan basalto escuro (torres hexagonais de topo plano), Thalor pedra úmida com musgo + torres com telhado cônico de ardósia, Verden pé de pedra clara + paliçada de madeira velha com torres cônicas, Ymiria pedra azul-acinzentada com neve, ameias em ponta e torres em agulha. Kit sem sombra recebida (evita acne).
- Teste (Edge GPU, painel visível): 60 fps nas 5 capitais (Zahar 59, Urdan 60, Thalor 60, Verden 60, Ymiria 60), 271–493 chamadas, 39–41 NPCs, mapa 3D abre e mostra as estradas; capturas de rua de todas.
- **Pendente (honesto):** casas e torres do anel interno antigo (a "cidade antiga" de ~100 m, peças Tripo rosadas/paliçada) seguem cartoon; casas dos bairros ainda do cenário Tripo; nenhuma ainda tem catedral/forjas/palafitas/cais novos além do que a v504/v597 já tinham; relevo (muralha seguindo morro) não feito porque o chão é plano até 285 m; piso e casas não aparecem em câmera alta de teste (precisão de profundidade), só na rua.

## v623 (26/10/2026) — Zahar: muralha de adobe realista (kit de muralha das capitais)
- **Muralha "não aparecia" (v622):** conferido em Edge COM GPU (painel visível, `--disable-backgrounding-occluded-windows`): as peças desenhavam, o problema era só o teste em painel escondido/software. Mesmo assim o visual era cartoon (pedra rachada tingida), então foi trocado.
- `tools/capitais504.js` (kit v623): contorno agora é um POLÍGONO irregular por capital (`POLYCFG`/`polyOf`/`polyRho`; Zahar espalhada, Urdan com lado norte reto, Thalor com lado do mar reto, Verden 15 lados, Ymiria angulosa; só Zahar usa por enquanto, as outras ainda caem no raio redondo até a vez delas), muralha reta entre torres de canto; geometria própria de muralha/torre (`wallGeo`/`towerGeo`, `LOOK` por capital) e material procedural (`kitMaterial`: fiadas de pedra/adobe com junta, reboco, rachadura, sujeira no pé, musgo/neve por capital; coordenadas relativas ao centro da cidade para não perder precisão). Torres de canto, torres dos portões (antes pilares), fortaleza (torreão + 4 torres) e o marco da capital usam o mesmo kit; Zahar = adobe, torres quadradas.
- Teste (Edge GPU): 59 fps em Zahar, 218 chamadas, 39 NPCs, captura de rua com muralha, torres e fortaleza. Captura de cima: contorno poligonal ok, mas o piso/casas dos bairros não saem em câmera alta (precisão de profundidade), a conferência dos bairros foi pela rua.
- Pendente: casas continuam do cenário Tripo (madeira/telhado verde); relevo da muralha (chão é plano até 285 m).

## v622 (26/10/2026) — Zahar com planta orgânica (1ª capital reconstruída)
- **Pedido de Ian**: capitais NÃO redondas; muralha que segue um contorno, ruas tortas para a praça central, fortaleza no alto, subúrbio fora dos muros, identidade por raça (Zahar = lobisomens: deserto, muralha de adobe, bazar). Aster continua redonda.
- `tools/capitais504.js`: contorno por ângulo (`ORG`, só Zahar por enquanto; `Capitais501.rho(c,a)`), muralha em pontos igualmente espaçados ao longo do contorno, torres/tochas/lanternas/adornos no raio local, fortaleza (torreão de 34 m + 4 torres de canto) no ponto mais largo (`c.keep622`). Portões continuam nos 4 eixos (estradas da v600) mas cada um no seu raio (`cityGates341` aceita lista de raios, `260-v341.js`).
- `tools/capitais597.js`: casas, vielas e piso respeitam o contorno; subúrbio de casas fora dos muros junto a cada portão; Zahar com bazar grande (praça de 24 m, 20 barracas).
- Teste: Edge headless — vista de cima mostra o contorno em forma de ovo irregular, 4 avenidas, praça central, subúrbio; 34 NPCs, 4,2 ms/quadro, 342 chamadas, 0 erro.
- **NÃO verificado / pendente**: nas minhas capturas (Edge sem tela, renderização por software) as PEÇAS DE MURALHA não apareceram, nem em Verden sem nenhuma alteração minha (instâncias existem, matrizes certas, mas não desenham) — pode ser só do ambiente de teste; Ian precisa conferir no navegador dele. Materiais continuam os do cenário (casas de madeira com telhado verde); sem modelos novos de adobe/palha. O contorno ainda é suave (ovo); Urdan, Verden, Thalor e Ymiria seguem redondas até a vez delas.

## Missões fixas: retomadas em 27/10 (#9 v647, #10 v648, #11 v649; antes pausado após #8 v618)
- Decisão de Ian (26/10/2026): as 300 missões fixas pausam depois da #8. Próxima a implementar: #9 «O Sulco no Metal» (5 pilares de corrente: quebrar = peça Rara limpa de Kael; matar direto = +3 Cristais puros), depois #10 «O Retorno de Aldric na Chuva». Notas de método: ver memória `primeva-missoes-fixas` (teste jogando: bomba de rAF, andar com `moveEntGround348`, tecla E nas interações, `buildSpecial('tower',null,N)` para andares, vida infinita em teste).
- O ramo «avançar direto» da #7 foi conferido só pelo dano do chefe sem redução (79 contra 63 com os 5 archotes); não foi jogado de ponta a ponta.

## v621 (26/10/2026) — Flora: espécies novas de Ian no catálogo (ainda sem modelo)
- Revisão do Drive (pasta `Arvores-Biomas-TRELLIS2-2026-10-23/referencias` e `views`, criadas em 26/10 16:00): chegaram imagens de estágios e recortes (broto, jovem, adulta, morta, toco) de **carvalho_aster, cipreste_raizes, salgueiro_brejo, arvore_cristal_mana, cacto_colunar**, e só a imagem de estágios de **acacia_espinhosa, baoba_zahar, betula_prateada**. **Nenhum GLB novo existe** (busca por `.glb` criado depois de 23/10 20:00 voltou vazia), então nada novo entra no jogo ainda.
- `tools/flora-regioes.js`: as 8 espécies entram no catálogo como `falta` (GLB), com a região pela imagem e `proposta: true`: carvalho de Aster → campos/flores (copa dourada); cipreste de raízes e salgueiro do brejo → pântano (Thalor; raízes aéreas, musgo); árvore de cristal de mana → cristal; cacto colunar, acácia espinhosa e baobá → deserto (Zahar); bétula prateada → floresta (região não clara pelo nome). A escolha da espécie agora é por dados: `candidatos(bio)` usa as espécies sem `falta` do bioma e, com mais de uma, divide em manchas fixas por ruído; quando um GLB entrar, é só tirar `falta`, pôr `estagios` e o id nas listas de árvores.
- Teste (Edge): distribuição por bioma igual à da v619/v620 (neve = abeto + bétula, vulcão = brasa, pântano = salgueiro, cristal = conífera, resto = carvalho, deserto sem árvore). Não testado nada visual novo (sem modelos).

## v620 (26/10/2026) — Flora: dispersão por animal testada de verdade e semente que cresce
- `tools/flora-regioes.js`: o limite de fertilidade da semente (150) impedia nascer broto na neve e no vulcão (solo pobre, 55 a 110); agora é 55, e a folga entre árvores é 2,6 m. `tools/ecossistema550.js`: célula com broto plantado por animal cresce 2 por visita até 240 mesmo em solo pobre (antes o teto de biomassa da neve, ~86, o travava no estágio 1).
- Teste (Edge): pássaro real (`spawnKind('passaro')`) parado a ~3 m de bétula adulta na neve, sorteio forçado a sair (`Math.random` = 0) por 14 s: plantadas 0 → 1, na mesma espécie e bioma; com 80 ciclos de `ecoTick` por bloco o broto foi a jovem (biomassa 129 → 151). Capturas: broto→jovem→adulta com o modelo certo no chão (a adulta que volta é a árvore real, 1 de 1 instância visível) e o pássaro ao lado da muda. Falta ver: a muda chegar a adulta (≈ 40 blocos) e a dispersão sem o sorteio forçado.

## v619 (26/10/2026) — Árvores por região, bosques fixos e espalhamento por animais (versão 1)
- **Pedido de Ian** (via diretor): as árvores não nascem mais aleatórias; cada tipo nasce na sua região, com as espécies criadas nas ferramentas de Ian (pasta `Arvores-Biomas-TRELLIS2-2026-10-23` no Drive).
- **Catálogo** (`tools/flora-regioes.js`, `Flora.ESPECIES`): abeto de geada e bétula gélida (neve, Ymiria), árvore brasa (vulcão, Urdan), salgueiro (pântano, Thalor), conífera (cristal), carvalho como padrão nos outros biomas (campos, floresta, flores; Verden e Aster até Ian criar espécies próprias), cacto no deserto (Zahar; colocado pelo cenário). **Pinheiro cinza** está no catálogo como "falta modelo" (só há imagens); o vulcão usa só a brasa. Para entrar uma espécie nova: GLB em `models/flora/`, uma linha em `ESPECIES` e o id nas listas `TREEIDS`/`NAT422` (680), `survival437`, `270-masmorra` e `ecossistema550`.
- **Modelos**: GLB `_game` do Drive refeitos no Blender (adulta 12 mil faces + versão leve 3 mil; broto, jovem, morta e toco 5 mil; texturas 1024/512 em JPEG, peças soltas removidas): 18 arquivos, ~8,5 MB em `models/flora/`. As espécies adultas entram no mesmo carregador das árvores Tripo (vento, versão leve, recorte de visão); os outros estágios carregam sob demanda.
- **Fim do aleatório** (`Flora.pick`, usado por `tree()` em `680`): bosques e clareiras por ruído fixo (região + semente do mundo), densidade por bioma (floresta 73% de bosque, pântano 50%, neve/vulcão ~41%, campos 25%, árvore solitária rara só em campos). Estradas, cidades e muralhas continuam excluídas pelo gerador do chunk; deserto sem árvores.
- **Ciclo (EcoGrid)**: nas espécies com modelo, os 5 estágios TROCAM o modelo (broto, jovem, adulta = a árvore real, anciã = real 20% maior, morta); o toco do lenhador (`survival437`) usa o modelo de toco da espécie. Espécies sem estágios continuam só mudando de escala.
- **Espalhamento por animais, versão 1**: pássaro, coelho e alpaca (os que já existem) perto (9 m) de árvore adulta deixam, às vezes, uma semente; só vira broto em célula fértil (fertilidade ≥ 150, sem pisoteio) do MESMO bioma e da mesma espécie, e só nas espécies com estágios. No máximo 60 por sessão; não é salva no arquivo de jogo.
- **Morta**: o GLB `_morta` do TRELLIS veio com placas brancas ao redor; uma árvore que morre (fenda ativa) vira o modelo de toco da espécie. Os GLB `_morta` ficam em `models/flora/` para quando Ian trouxer outro.
- **Teste (Edge, GPU Intel UHD)**: distribuição por bioma medida (groves 25–73%); estágios trocados por código em abeto (neve) — broto, jovem, adulta, anciã, toco do lenhador e semente de animal com captura; vulcão e campos com captura. FPS igual à v618 nos mesmos pontos: início 58, neve 53–60, vulcão 60, floresta 60. Não testado: dispersão por animais real (só `EcoGrid.addTree` direto), celular, nem Urdan/Ymiria como capitais.

## v618 (26/10/2026) — missões fixas #7 «Os Degraus da Torre da Vigília Antiga» e #8 «O Sentinela do Terraço e a Moeda de Logos»
- **`tools/torre607.js` (#7):** nos 5 andares da subida do Ato III na Torre da Ascensão há um archote rúnico por andar (interação E, chama azul ao purificar). Purificar os 5: o chefe do terraço causa 20% menos dano e o Narrador deixa escapar a primeira falha de memória («Vocês chegaram a esta parte»). Avançar direto: nada muda. Estado em `profile.fixas545.q007` (`pur`, `todos`, `base`).
- **`tools/sentinela608.js` (#8):** o 5º andar da subida vira terraço com o **Sentinela Corrompido** (chefe). Ao vencê-lo, a moeda de Logos: conselho fechado com Brann e Lyra (página no Diário, sem emboscadas extras de guardas/mensageiros perto de Thalor) ou questionar Dorian no mercado (ao abrir o mercado dele: contrato cifrado no Diário e preços do mercado +10%). Estado em `profile.fixas545.q008`.
- **Partes ligadas:** `specialSetup2` (terraço = chefe), `priceMul` (+10% no mercado), `openShop` (confronto com Dorian; carrega antes de `dialogo520.js`), objetivo em `intro401.js`.
- **Teste:** jogado no navegador (andares 1–5 com archotes, chefe real, moeda, os dois ramos da #8). Atalhos: mortes dos inimigos comuns por código e vida infinita (um nível 1 morreu no andar 2). O ramo "direto" da #7 só foi conferido pelo dano do chefe (sem redução).
- **Limites:** Brann no terraço é um figurante simples; «sem emboscadas extras nas rotas» só silencia guardas/mensageiros do `gatilhos508` perto de Thalor; Aldric não aparece no terraço.

## v612 (26/10/2026) — missão fixa #6 «A Caixa de Remédios Quebrada»
- **`tools/caixa606.js` (novo) + `intro401.js`/`campaign327.js` (objetivo e marcador):** ao resgatar os sobreviventes da carroça (#5) e se afastar da cidade, uma sobrevivente segura a caixa rachada de remédios. Escolha: carregar a caixa (velocidade -15% até o portão; ao chegar, Afinidade com Mira +1 nível, o que já barateia as poções pelo `priceMul`) ou dar cobertura (os sobreviventes correm na frente; ao chegar, 2 guardas da ronda externa salvos e +3 de confiança em Aster). Matilha de Lobo Fendido (calibrada pelo nível) na trilha. Estado em `profile.fixas545.q006`.
- **Teste (v612):** os dois ramos da #6 e o ramo "entregar direto" da #5 jogados no navegador, andando e atacando de verdade, com capturas; o ramo "copiar" da #5 já tinha sido jogado em v610.
- **Limites:** a trilha é curta (a carroça fica a ~40 m do portão leste); os sobreviventes seguem o jogador por IA simples; o salvo dos 2 guardas é registro e confiança, sem figuras novas.

## v610 (26/10/2026) — missão fixa #5 «O Caderno sob o Casaco»
- **`tools/caderno605.js` (novo) + `campaign327.js`:** o Ato II abre ao concluir o Ato I (ou no Rank E); a carroça de Dorian queimada fica na Estrada Leste (a leste de Aster), 6 inimigos (5 + 1 elite) com vida/dano calibrados pelo nível, diário sob o casaco, 2 sobreviventes. Ao entregar a Lyra, escolha: entregar direto ou copiar as páginas da inscrição antes. Copiar: página nova no Diário (Descobertas), +10 de Reputação da Ordem e a prova da Primeira Era em duas vias (`profile.fixas545.q005.copia`; agentes de Logos não apagam o rastro).
- **Teste:** jogado no navegador (Brann → Estrada Leste → combate → diário → 2 sobreviventes → Lyra → escolha da cópia) e a #4 até a saudação por classe. Sem calibrar, a emboscada tinha 150–250 de vida e matava um nível 1.
- **Pendente/limites:** só o ramo "copiar" foi jogado; o ramo "direto" só confere o aviso. Nenhum marcador novo: usa o do passo da missão.

## v606 (26/10/2026) — missão fixa #4 «A Bigorna de Kael e o Primeiro Aço»
- **`tools/kael604.js` (novo) + `dialogo520.js`:** ao despertar a classe no escambo com Kael (que já entrega a arma de treino da classe de graça), Kael fala diante da bigorna aquecida pelo Nexo, confirma a arma e conta que os 9 pontos iniciais (v465) já foram para a vocação. Consequência: guardas e moradores de Aster passam a cumprimentar pela classe ("Salve, Guerreiro."; guardas: "Alto lá, ..."). Registro em `profile.fixas545.q004`.
- **Partes ligadas:** `bondTxt` da conversa de cidade (`dialogo520.js`) recebe o prefixo; `kael604.js` carrega antes de `dialogo520.js`. Fase C: nada novo.
- **Teste:** jogado no navegador do registro com Lyra até a forja de Kael (Guerreiro) e a fala de Helena com a nova saudação; capturas de cada etapa.

## v603 (26/10/2026) — correção da missão #3 (testada jogando de verdade)
- **Bug real:** em Aster, falar com Lyra abre a conversa de cidade (`dialogo520.js`), que chama o `openShop` guardado antes da `lyra601.js` — a escolha da #3 nunca aparecia; e ao devolver `'fim'` a conversa fechava a escolha. Agora `lyra601.js` carrega antes de `dialogo520.js` e abre a escolha 120 ms depois.
- **Teste:** jogado no navegador (carroça → Edran → ponte com combate → portão → Mira → Lyra → escolha de guardar o sonho), com capturas de diálogo, bússola, mapa e a ponte.

## v601 (26/10/2026) — missão fixa #3 «O Livro de Lyra e a Linha em Branco»
- **`tools/lyra601.js` (novo):** ao chegar ao Portão Sul depois da #2, Mira recebe Edran desfalecido (diálogo). Na tenda da Ordem, Lyra abre o Livro e pergunta nome/mundo com a escolha (estilo Skyrim): contar a Mão → nota de Aldric no Diário (Descobertas) + 50 XP; guardar segredo → o Narrador elogia e entra fala rara no Histórico. Escolha em `profile.fixas545.q003`.
- **Detalhe:** sem classe o XP é zero; os 50 XP ficam guardados (`xpPend`) e entram assim que a classe é escolhida. Marcador na bússola/mapa: o já existente do passo "falar com Lyra". Fase C: nenhum sistema novo.
- **Teste:** laço de atualização com #2 inteira → portão → Mira → Lyra, os dois caminhos; sem captura (painel oculto).

## v600 (26/10/2026) — mouse do Skyrim, corpo em pé, estradas só por portão
- **Mouse (`tools/mouse600.js`, novo):** a câmera gira só mexendo o mouse, com pointer lock durante o jogo (3ª e 1ª pessoa). O cursor é solto ao abrir menu, mapa, inventário, conversa/diálogo, leitura, Favoritos, tela de morte, menu do jogo, sonho, e com Esc; clicar na tela (ou apertar uma tecla) prende de novo e aparece a dica "Clique na tela para controlar a câmera". Preso, a mira dos golpes (`mouseAim`) fica no centro da tela e há um ponto de mira em 3ª pessoa. **Botão direito só defende** (`Guard472`, agora escuta o botão direito; o arrasto de câmera do `400-loop.js` fica desligado com `window.MOUSE600`; a ponte do `skyrim588.js` só saca a arma); **botão do meio não faz nada**. `fp550.js` não gira mais a câmera sozinho (evita giro dobrado). Tela de Controles e texto do bônus de bloqueio atualizados. Toque (celular) não mudou.
- **Corpo tombado (`tools/upright600.js`, novo + `400-loop.js`):** não consegui reproduzir (testei ataque, esquiva, pulo, queda de 40 m, 1ª pessoa, sacar, agachar, correr, montar, favoritos, esperar, dano). Rotações que inclinam o corpo: nado (water391), escalada (climb383), inclinação de ladeira (anim547, máx. 24°) e morte (warrior127). Duas correções/guardas: `P.deadA=0` ao viver (a pose de morte ficava acumulada) e um vigia a cada 100 ms que zera X/Z do root e limita o corpo fora dessas poses; se a cabeça ficar fora da vertical (>60°) por ~1 s ele reseta ossos/animação e avisa no console `upright600: corpo tombado {estado}` — se Ian ver de novo, o console diz o estado que causou.
- **Estradas (`tools/mundo513.js`):** as rotas à mão chegavam às cidades por qualquer ângulo e cruzavam a muralha onde não há portão (portões ficam nos 4 pontos cardeais). Agora toda estrada que sai ou chega numa cidade ganha um trecho reto sobre o eixo cardeal mais próximo (135 m; 285 m nas capitais de 250 m) antes de seguir a curva. Verificado: em Aster, nas 5 capitais e nas vilas todos os cruzamentos de muralha ficam a ≤ 6 m do eixo do portão (antes: 80 cruzamentos fora do portão) e o ponto de cruzamento está livre de colisão.
- Teste: jogo real (Edge, GPU) — pointer lock, giro (160 px = 0,48 rad em 1ª e 3ª pessoa), botão direito (defende; câmera não gira por arrasto), botão do meio (nada), menu solta/clique prende, F5-F9 etc. sem regressão; vigia (rotação forçada voltou a 0, NaN corrigido); varredura de estradas × muralhas; captura da estrada até o portão leste de Aster. **Não testado:** cada capital a pé, mapa 3D com as estradas novas, pointer lock no Firefox/Safari.

## v599 (26/10/2026) — Capitais grandes (bloco 2): gente e lojas nos bairros
- **Pedido de Ian**: NPCs nos bairros novos das 5 capitais, rotina, reação a ameaça e vendedores nas lojas.
- `tools/vida523.js`: nas Capitais grandes (`cityBig533`) moradores moram e guardas rondam pelas avenidas dos bairros (112–237 m), com 8 guardas e 14 moradores (antes 2 e 3) e geração a até 300 m; rotina (trabalho, almoço, taverna, casa) e reação a ameaça (v554) são as de sempre. `tools/capitais597.js`: cada ferreiro, mercado, igreja e quartel dos bairros ganha vendedor (equipamentos, mercado, poções, defesa).
- Teste: Edge headless, Zahar e Thalor: 8 guardas, 14 moradores, 8 vendedores, 5–9 ms por quadro (software), captura de rua com casas, calçada e morador; 0 erro. Não testado: reação a ameaça dentro dos bairros novos, FPS em máquina real, celular.

## v598 (23/10/2026) — Paredão da garganta não cobre mais o mapa inteiro
- **Pedido de Ian**: "montanha reta" e relevo que não dá para atravessar.
- Causa: o paredão do Desfiladeiro (`terrain245.js`, +17 m em z 78–560) valia para QUALQUER x: uma faixa de serra reta atravessando o mapa de ponta a ponta (ex.: Zahar tinha 23 m ao sul do centro, onde o chão devia ser plano). Agora o paredão some entre 70 e 170 m da estrada (GLSL e CPU iguais).
- Teste: alturas em 6 linhas z × 6 x (faixa sumiu), Zahar plano até 250 m, paredes da garganta mantidas perto da estrada.

## v597 (23/10/2026) — Capitais grandes (bloco 1: muralha de 250 m e bairros)
- **Pedido de Ian**: cidades maiores e vivas estilo Skyrim nas 5 Capitais (Aster fica como está; garganta e missões #1/#2 intactas).
- `tools/capitais504.js`: muralha das Capitais de 150 → 250 m (RC), 70 tochas. `tools/capitais597.js` (novo): bairros do anel da cidade antiga (106 m) até a muralha — 4 avenidas, vielas tortas, casas coladas de frente para a rua, praça do mercado com poço e barracas, pousada/ferreiros/mercado/igreja/quartel, adereços e árvores, piso de pedra; cada capital com cores e peças próprias (Ymiria gelada com igrejas, Urdan com ferreiros e pedra, Verden árvores, Thalor barris/caixas, Zahar areia e cactos). Só visual: a raça guardiã é da Fase C.
- Ligações (raio grande por `cityBig533(c)` em `170-colisao.js`, 265 m): `inCity`, estrada/limpeza (`200`, `250`, `environment-bridge128`), portais fora da cidade (`260`), monstros fora (`390`), zona segura e chão plano até 285 m (`400-loop`).
- Teste: Edge headless, Urdan/Verden/Ymiria: 166–181 casas, 330–875 chamadas de desenho, 5–22 ms por quadro em software; vista da rua com casas, lanternas e calçada; 0 erro. Não testado: Zahar e Thalor por captura, NPCs/carroças andando nas ruas novas, FPS em máquina real, celular.
- Pendente: mais vida (NPCs e rotina espalhados pelos bairros), toque visual mais forte por capital.

## v596 (23/10/2026) — Grama de fios: habilidades reais e dobra visível
- `tools/grass446.js`: o fogo/gelo/vento da grama agora é disparado por habilidade REAL: área/pulsos/empurrão pelo ponto da conjuração (`VFX302/328.play`), projéteis e golpes pelo acerto (`hurtEnemy` com `elem300` fogo/gelo, `kitHit111`, `elemMul300`). Projétil não queima mais no ponto de lançamento.
- Dobra em volta do jogador mais forte (empurrão ×1,8, raio ×2 por entidade): captura parada no meio do capim mostra os fios abertos ao redor dos pés.
- Teste (Edge): `useSkill` com Bola de Fogo (classe 8), Nova de Gelo (9) e Rajada de Vento (11) criam a zona certa; fogo no ponto do acerto no lobo. Não testado: celular.

## v595 (23/10/2026) — Grama de fios (reação, vento e elementos)
- **Pedido de Ian** (via outra sessão): grama como a do reel da PhysicsMorph — fios finos e densos, base escura e ponta clara, reagindo ao mundo, mantendo a relva baixa da v568.
- `tools/grass446.js`: tufos de 9 fios finos com afinamento e degradê base→ponta; fios cheios até 18 m e LOD simples (3 fios largos, 1 em cada 4 tufos) de 18 a 44 m (`mesh2`). Altura continua do EcoGrid (`grassMul`: trilha baixa, biomassa alta mais alta).
- **Reação:** até 12 amostras (jogador + 7 NPCs/monstros mais próximos, raio por entidade) vão ao vertex shader; os fios dobram e voltam em ~2,4 s. **Vento:** onda que atravessa o campo.
- **Elementos** (`Grass446.element(kind,x,z,r)`, ligado ao `VFX302/328.play` pelo nome/cor da habilidade e ao `elemMul300` para projéteis de fogo/gelo): fogo escurece e encolhe os fios e derruba a biomassa/fertilidade das células (o Solo Vivo faz crescer de novo); gelo deixa os fios rígidos e azulados por 20 s; vento deita os fios por 5 s.
- Teste (Edge, GPU Intel UHD): captura de perto, passando pelo campo, com fogo, gelo/vento e de longe; FPS 24–25 contra 22 da v594 (a grama custa ~1,7 FPS). Não testado: celular; golpe de fogo por habilidade real do jogador (testado por `Grass446.element`).

## v594 (23/10/2026) — Mapa (M) estilo Skyrim: ícones-brasão presos no relevo
- **Pedido de Ian**: mapa como o do Skyrim — ícones nos lugares, nome + estado ao passar o mouse, seta do jogador, não descobertos escondidos, sem bolhas empilhadas.
- `tools/mapa3d544.js`: ícones desenhados em canvas (sem Tripo) e presos na altura do relevo, tamanho fixo na tela, com pino. Tipos: capital, cidade, portal (marquinha com a cor do rank), Fenda, objetivo de missão, acampamento, posto da estrada (também prontos: masmorra, forja, mina — ainda sem dado no mundo).
- Mouse em cima: nome em destaque + estado (Descoberto/Caída; portal: rank, nível, fecha em N min). Ícones colados na tela viram um grupo com contador e se separam ao aproximar.
- Só aparece o que o jogador já descobriu (mesmas chaves da bússola v564 + `profile.map594`, preenchido ao chegar a <130–150 m). Seta do jogador 2D apontando o olhar. Bolhas de portal pintadas no chão removidas. Lista de portais segue fechada por padrão (v563).
- Teste: ícones de longe e de perto, hover de portal e de grupo, abrir/fechar 3× sem erro no console.

## v593 (23/10/2026) — Controles no padrão do Skyrim (PC)
- **Pedido de Ian:** "tudo no mesmo local". Layout padrão novo; trocas do jogador continuam na tela de Controles (Mudar / Restaurar padrão).
- **Tabela final:** Andar WASD/setas · atacar = botão esquerdo · defender = botão direito (com arma; arrastar ainda gira a câmera) ou do meio · **E** usar/falar/pegar (Enter também) · **R** sacar/guardar a arma · **F** 1ª/3ª pessoa · **V** montar/desmontar · Espaço pular · Shift correr · Ctrl agachar/passo silencioso · Alt esquiva · **Z** grito/Domínio Absoluto · **Q** Favoritos (novo: painel com habilidades, armas do lote, poção, poderes) · **T** esperar 1 hora (novo; recusa com inimigo a 45 m) · **Tab** menu do personagem · **P** habilidades/magias · **I** inventário · **M** mapa · **J** diário (era L) · **L** bestiário (era J) · **K** coleção de ecos · N notícias · O ordens dos ecos · X estilo físico/arcano · **1–6 e 8** habilidades 1–6 e 7 (antes Q R T G Y U 5) · **7** constelações (como antes) · **F1–F4** armas do lote (antes 1–4) · 9, 0, = poderes absorvidos · − poder fundido · **C** combinação de técnicas (era 6) · H poção · G frasco/isca · B construir/acampamento · U luz (Deluminador, era H) · Y moeda (era 7) · ` árvore de habilidades (era K) · CapsLock travar alvo · **F5/F9** salvar/carregar rápido (novo; F9 recarrega a página e pede CONTINUAR) · F10 painel de teste de escalada (era F9).
- **Como funciona:** `src/core/630-controles.js` — `KEYACT[2]` é o código interno estável dos tratadores; a tecla que vale é a do jogador (`pds_keys`) ou `SKY592`. `remapCode` traduz a tecla física para o código interno e neutraliza a tecla antiga de quem mudou de lugar (nenhuma tecla dispara duas ações; teste em jogo, 47 ações sem repetição). **Migração única:** save sem a flag `pds_keys_sky593` zera `pds_keys` e adota o layout novo; depois a flag segura as trocas. Tratadores soltos passaram a usar `keyOf`: build437 (B), survival437 (frasco), skyrim-overhaul538 (luz, árvore), dialogo520/intro401 (usar), ecology410 (moeda; guardar arma agora é a mesma ação `sheathe`, sem disparar duas vezes em 1ª pessoa), climb383 (F10).
- **Textos:** `[F]`→`[E]` (missões, murais, acampamento, embarcar), Diário `[L]`→`[J]`, "(tecla J)" do bestiário→L, moeda "tecla 7"→Y, mochila `[V]`→`[I]`, HUD de 1ª/3ª pessoa e luz (F, U). O prompt de interação no HUD já lia a tecla de `keyOf`.
- `tools/controles593.js` (novo): Favoritos, Esperar, F5/F9. Controles mostra todas as ações (47) e a linha do Enter.
- Teste: jogo real (Edge, GPU) — cada tecla acima apertada e conferida (janelas, ações, chamadas de habilidade/interagir/poção/combo sem duplicar, F5/F9, remapear e swap, migração por flag). **Não testado:** esperar com noite/chuva ativa, R com arma em 1ª pessoa, favoritos com arma de lote real, toque (celular não mudou).

## v592 (23/10/2026) — Fase A, item 12 (copas escuras)
- **Causa real:** nenhum código sobrescreve o material (`361c13` era só o `getHexString` estourando com cor 1,22/1,12/1,08). O tom marrom vinha da textura: partes da copa dos carvalhos têm texels marrons, e o tingimento de estação só pegava texels "verdes" (`leaf154`). Os carvalhos têm ~30 m, então a parte de baixo da copa enche a tela.
- `src/core/680-bloco-journey113-cont.js`: o fragment recebe a altura relativa do modelo (`vH153`) e tinge a parte alta da copa (h > 24–30%) com a cor da estação mesmo em texel marrom; o tronco/base continua marrom. Conífera não muda.
- Teste: jogo real, captura antes/depois (spawn e campo aberto). Não testado: outono/inverno, salgueiro/pântano.

## v591 (23/10/2026) — Fase A, fechamento (reteste dos 19 itens)
- `tools/campaign327.js`: o herói acorda ao lado de Edran (x+4,6) em vez de na frente dele; antes o corpo do herói escondia Edran da câmera inicial (item 4 não estava resolvido). Item 15: `tools/mapa3d544.js` — nome da capital mais alto e com contorno escuro (os marcadores de portal cobriam "ASTER").
- Reteste a pé na v590: estrada até a ponte livre, escolta, salteadores com 32 de vida, gosma→Edran, praça de Aster. **Ainda quebrado:** item 12 (copas/cascas escuras das árvores vistas de baixo), item 16/17 não reproduzidos. Doc "Fase A — fechamento" no Drive.
- Teste: jogo real (Edge, GPU), câmera do despertar e mapa M com captura. Não testado: Fenda, barcos/mergulho.

## v590 (23/10/2026) — 1ª pessoa: sacar/guardar arma e defesa no botão direito
- **Pedido de Ian**: implementar os próximos passos do estilo Skyrim (sacar/guardar e bloquear).
- `tools/skyrim588.js`: **sacar/guardar** — tecla "Sacar / guardar arma (1ª pessoa)" (padrão `` ` `` Backquote; aparece em Controles e dá para remapear). Começa guardada; atacar, puxar o arco ou defender saca sozinho. Guardada: mãos baixas nos cantos, arma/arco escondidos, dedos relaxados. **Defesa no botão direito** (só em 1ª pessoa, soma ao botão do meio que já existia; usa `Guard472`: mesmas regras de dano/aparar).
- `tools/fp550.js`: pose de defesa (arma erguida na vertical à frente), pose guardada, transição suave; o balanço da animação some enquanto defende/puxa/guarda.
- Teste: jogo real — guardada, tecla saca, botão direito defende (`Guard472.blocking()` e pose), soltar encerra, tecla guarda de novo. **Não testado**: arco guardado, escudo (a mão livre não levanta o escudo na 1ª pessoa), bloqueio andando.

## v589 (23/10/2026) — 1ª pessoa: movimento de mãos como no Skyrim
- **Pedido de Ian**: conferir como o Skyrim deixa o personagem em 1ª pessoa e replicar.
- `tools/fp550.js`: mãos respiram parado (oscilação lenta), balançam ao andar (passo alternado, mão da arma e livre em contrafase) e, correndo, a arma desce e inclina para a frente e a mão livre cai (como o sprint do Skyrim); velocidade medida pelo deslocamento real do jogador. Mantém: enquadramento v587 (mão livre pequena embaixo à esquerda, arma pela direita), arco/golpe forte/magia da v588.
- Teste: jogo real parado (captura em tela larga 16:9: composição igual à referência). **Não testado em captura**: andando/correndo (o painel escondido não anda de verdade); valores conferidos só por código.

## v588 (23/10/2026) — Ataque e magia no estilo Skyrim (só a mecânica)
- **Pedido de Ian**: arco como no Skyrim (segurar puxa, soltar atira) e copiar a mecânica de ataques e lançamento de habilidades da vista em 1ª pessoa.
- `tools/skyrim588.js` (novo, `window.Skyrim588`): **arco** — segurar o botão puxa a corda por ~1 s (zoom de mira de até 26% no FOV, flecha encaixada na mão da corda), soltar dispara; dano ×0,4→×1,5 e velocidade ×0,65→×1 pela puxada; menos de 20% cancela; botão direito/Esc cancela; vale em 1ª e 3ª pessoa. **Espada/machado/maça/martelo (só 1ª pessoa)** — clique rápido = golpe leve; segurar >0,4 s e soltar = golpe forte (dano ×2, recarga ×1,8, tremor de tela; o braço recua enquanto segura). **Habilidades (1ª pessoa)** — ao lançar, a mão livre sobe ao centro, abre a palma e brilha na cor do elemento (~0,5 s).
- `tools/fp550.js`: poses (mão da corda puxa, bow no centro, recuo do golpe forte, palma da magia), flecha 3D e luz de magia presas à câmera.
- Teste: jogo real — arco (puxada, zoom, tiro, FOV volta), golpe leve ×1 e forte ×2 com `player.dmg` restaurado, magia (pose/brilho, cor do elemento). **Não testado**: andando, cajado/lança, escudo/bloqueio (botão direito = ainda o do jogo), efeito sonoro da puxada.

## v587 (23/10/2026) — 1ª pessoa no enquadramento do Skyrim
- **Pedido de Ian** (referência de captura do Skyrim): mão livre pequena no canto inferior esquerdo, arma entrando pela borda direita em diagonal, centro da tela livre.
- `tools/fp550.js`: mãos escaladas pelo osso da mão (`FP.handScale`: arma 0,72 · livre 0,62; a arma compensa pelo âncora); alvos do IK: mão livre em (-0,17; -0,16; -0,5), mão da arma quase fora da tela (0,27; -0,26; -0,52); guarda da espada/machado/maça em diagonal (lâmina sobe, ponta levemente à esquerda); golpe curto à esquerda e volta. Arco: mão esquerda, pequeno.
- Teste: jogo real, espada parada e em golpe, arco. **Não testado**: andando (bobbing), cajado/lança, FOV próprio do viewmodel (não precisou).

## v586 (23/10/2026) — Fase A, bloco 9: primeira pessoa (item 11)
- `tools/fp550.js`: as mãos ficam mais longe da câmera (direita z -0,62→-0,76, esquerda -0,5→-0,64): aparecem menores; o golpe é menos lateral (deslocamento -0,24→-0,14, direção final [-0,55; 0,35; -0,75]) para a arma não cruzar a tela. Testado em captura com o machado equipado (mãos menores, arma segura pelo cabo). Não testado: espada fina (modelo sem guarda continua sendo o do catálogo) nem combate real com clique.

## v585 (23/10/2026) — Fase A, bloco 8: prévia 3D das lojas (item 14)
- `tools/telas535.js`: na Alquimia a prévia mostra um frasco de poção (antes ficava a armadura/modelo anterior preso, pois as linhas não são itens); na Forja, "Forjar arma …" mostra a espada (antes armadura, pelo texto "armadura" no resto da linha). Banco continua com o baú (é o cofre). Defesa mostra armadura. Testado no jogo (captura da Alquimia com o frasco; Forja com a espada).
- Item 15 (mapa): o mapa atual (2D, v535+) não tem mais relevo; os ícones se aglomeram em volta de Aster, mas o nome continua legível — não alterado. Itens 16 e 17 não feitos nesta versão.

## v583 (23/10/2026) — Fase A, bloco 7: rótulos do céu de constelações
- `tools/constel523.js`: os rótulos agora são coletados e desenhados depois, empilhando os que colidem em x (<150 px) e ficando acima do horizonte (antes todos grudavam em `hy-34`, sobrepostos e sob a colina). Captura do céu com as 24 constelações: sem sobreposição de texto. (Escalada ainda encosta no desenho da chave: é o desenho, não o texto.)
- Item 11 (1ª pessoa) **não** feito: não consegui reproduzir a espada com o equipamento por código; mãos parecem grandes (alvo z=-0,62 em `fp550.js` pose).

## v581 (23/10/2026) — Fase A, bloco 6: copas (item 12), loot da gosma, glifo do rank
- **Item 12 (copas vermelhas/escuras):** causa real = as versões leves das árvores (`models/tripo-*153-lod.glb`) tinham só ~9% dos triângulos do modelo cheio (a nota da v418 dizia 35%): sobravam cascas gigantes cor de tronco que cobriam a tela. Os três lods (carvalho, salgueiro, conífera) foram refeitos no Blender a 30% (colapso, mesmas dimensões). Material/cor do catálogo já estavam certos (`361c13` era leitura errada de cor clampada). Teste: captura no jogo, copa verde, sem cascas.
- **Item 6:** saque coerente — criatura Fendida/Abissal de gosma não solta mais "Lasca de Cristal Frio" (`survival437.js`). O fluxo de falas/rótulo da missão #1 foi relido no código; não reproduzido em combate real.
- **Item 19:** nome "Gosma Verde" é o do bestiário (`ecology410`), "Fendida" vem do sufixo automático de `variants308`; mantido. Glifo ★ do rank 777: `#rk` ganhou fontes de símbolo de reserva (`game.html`); não confirmado visualmente em 777.

## v580 (23/10/2026) — Fase A, bloco 5: barcos e águas profundas ligados
- `Surv437` agora expõe `ready()` e `world()`; `Cart437` expõe `pulling()`, `setPull()`, `loadKg()` e `menu()`. Sem isso `boats440` e `deep447` nunca ativavam, e `Boats440.board` quebrava com `Cart437.pulling is not a function`.
- Teste no jogo local: lançar canoa em (15,450) e embarcar → `run.aboard440` ligado, sem erro de script. Não testado: navegar de verdade, entrar na água a nado/mergulho (`deep447`).
- Teste a pé da ponte (movimento real por `moveEntGround348` de z=185 a z=149): o jogador atravessa a zona de Edran/casal sem travar; salteadores ficam com 32/32 de vida sem dreno.
- Item 12 (copas): investigado, não resolvido. Os materiais do carvalho/pinheiro/salgueiro estão com a cor certa no catálogo (`TripoEnvironment153.models`), mas os `InstancedMesh` de árvore no mundo têm cor de material `361c13` e emissivo `161614`; falta achar quem reescreve (suspeita: ajuste de noite/estação).

## v579 (23/10/2026) — Fase A, bloco 4
- **Praça de Aster lavanda (bug 13):** (0,0) é o centro da fonte (sólido); quem aparecia ali (teleporte, queda) ficava com a câmera dentro do objeto. Novo `tools/saida579.js`: se o jogador fica 1 s dentro de um sólido, vai ao ponto livre mais próximo (raio até 24 m). Testado com captura: de (0,0) vai para (5,0) e a praça aparece.
- `boats440`/`deep447`: o aviso `U(...).ready is not a function` sumiu (guarda `typeof`); os dois módulos continuam inativos porque `Surv437` não expõe `ready()`/`world()` — falta definir essa API.
- Não feitos nesta versão: 6 (ordem das ações da missão #1), 12 (copas), 14–17, 19 (nome Gosma).

## v578 (23/10/2026) — Fase A, bloco 3 (Mão no chefe, hitbox dos dragões, placa de nível)
- **Mão × chefe** (`370-v281.js`): `claimEnemy` agora roda para todo `isBoss` (antes só tutorial/camp a1/architectClaim; chefe de Fenda comum nunca chamava). Mob comum continua sem Mão (`test-mao-so-chefes` ok). Testado: chefe morto fora da abertura → 1 trabalho da Mão. **Atenção:** `Reclaim372.start` ainda não age enquanto `Intro401.guided()` é verdadeiro (abertura guiada); o teste automático da v575 estava nesse estado. Se Ian quiser a Mão já na abertura, é decisão separada.
- **Hitbox dos dragões** (`tools/hitbox-dragao551.js`, `380-acoes.js`): as esferas compostas (tronco, pescoço, cabeça, asas, cauda, patas) só valiam para o dragão voador (`drake510`); os dragões de chão (Ancião, Gélido, Musgo, Zahar...) usavam raio de ~3 m. Agora `Dragao551.is(e)` inclui `kind` que começa com `drag`/`serpe_zahar`, e as esferas somam o relevo (o shader soma o chão, a malha fica em y local). Medido: Ancião 15×14×15 m, 21 esferas, a maior r=2,5.
- **Placa "Nv N"** (`410-overlay-e-hud.js`): lê `e.lvl||balanceLevel||nível do grau` sem gravar; antes `eLvl` gravava "Nv 1" no primeiro quadro. **Causa da reescala tardia não reproduzida** (spawnKind aplica `dunScale` na criação); revisar com repro real.
- Teste: jogo local (porta 8792): melee x esferas do Ancião (acerta no tronco a 4 m), chefe lobo morto → Mão. Não testado em combate real com clique.

## v577 (23/10/2026) — Fase A, bloco 2
- Texto "Marcador dourado" (`campaign327.js`); o HUD da ponte agora usa o mesmo título do Ato I ("ATO I · O CHAMADO", passo 4/6) em vez de "A PONTE DOS ESCUDOS CAÍDOS 4/6" (`fronteira551.js`). O painel "passo N/4" é outro sistema (`campaign327`) e não foi mexido.
- Não corrigido: `boats440`/`deep447` chamam `Surv437.ready()`/`world()`, que não existem (os dois módulos nunca ativam; arrumar exige decidir a API).

## v576 (23/10/2026) — Fase A, bloco 1 (lista de bugs do teste automático da v575)
- **Ponte da missão #2** (`tools/fronteira551.js`): `clearSite` limpa 16 m de cada lado da estrada (era 9; o arbusto de coleta em (38,8; 165,3) ficava a 9,9 m e prendia jogador/câmera) e 24 m ao redor da ponte. O dreno de vida do Edran nos salteadores foi removido (chegavam a 1 HP sozinhos e "Invasor desistiu" aparecia sem o jogador agir).
- **Edran e o casal** não bloqueiam mais o jogador na estrada estreita (`f.noBlock551`, lido em `tools/solid429.js`).
- **Abertura** (`tools/campaign327.js`): o herói nasce olhando para a muralha (`face=π`); antes a câmera pegava o rosto de frente.
- **Constelações** (`tools/constel523.js`): as 18 ativas + 5 apagadas já estavam na main desde a v570 (24 em `CONS`, 5 "em breve"; conferido no jogo). A tela só abre sozinha no detalhe de uma constelação se houver ponto; sem ponto não mostra "Disponível · 1 ponto" (mostra "Sem pontos").
- Teste: jogo local (porta 8791): abertura (câmera atrás do herói), céu com 0 pontos, `clearSite` no arbusto. **Não testado a pé**: caminhada pela ponte com salteadores e Edran.

## v575 (23/10/2026) — Fase A: ponte da missão #2, conversa que segura o mundo, carroça da abertura
- **Pedido de Ian** (jogou a v574): "ponte toda errada", NPC anda/inimigo bate durante a conversa, carroça do início sumida.
- **Ponte** (`tools/fronteira551.js`, `tools/terrain245.js` GLSL e CPU): a estrada cruza z=150 na diagonal (~48°, curva da garganta), mas a ponte e a vala eram alinhadas ao eixo z, então as pontas entravam nas paredes do desfiladeiro. Agora ponte, vala, tabuleiro caminhável, escudos, colisão dos parapetos e salteadores seguem o eixo da estrada (u/v com sen/cos fixos 0,7429/0,6694). Vala some a 11 m (o tabuleiro termina em 12: sem degrau na ponta). O arco tinha o sinal da inclinação das aduelas trocado (parecia escada): corrigido.
- **Conversa** (`tools/dialogo520.js`): enquanto a conversa está aberta o NPC fica parado no lugar e olha para o jogador, o jogador fica invulnerável (iT) e a conversa fecha sozinha se ele se afastar mais de 7 m. Vale para todas as conversas (open/custom/vida/mendigo/cidade).
- **Carroça da abertura** (`tools/campaign327.js`): nascia antes do relevo ligar (terrH=0) e ficava enterrada em y=0 (a v561 não mexeu nela; só mostrou o problema). Agora é reassentada no chão a cada quadro até o resgate. As carroças da estrada (civic343 v560/v561) não foram tocadas.
- Teste: navegador local (cópia própria, porta 8785), prints da ponte (frente e lateral com arco), cart visível no início, conversa simulada (invulnerável, NPC parado/virado, fecha ao afastar), salteadores na ponte. Não testado: andar a pé pela ponte inteira nem combate real com Edran.

## v574 (23/10/2026) — Reencarnação: +2% de XP
- **Pedido de Ian**: cada reencarnação dá +2% de XP permanente (o +10% de dano e vida por reencarnação já existia em `bonusPool`).
- `370-v281.js` (`xpReward253`), texto na janela de reencarnação (`610-bloco-regions116-cont.js`).
- Teste no jogo (navegador local): 1000 de XP viram 1060 com 3 reencarnações; nível 780 nos selvagens de grau 9; 776→777 trava; sem erro de script. Combate real não testado.

## v573 (23/10/2026) — Equilíbrio até o 777 (proposta aprovada por Ian)
- **Aprovado por Ian**: XP achatado acima do 500 e monstros podendo passar do nível do jogador. Proposta: Doc "Primeva — Proposta de equilíbrio até o nível 777" no Drive.
- `tools/balance-rpg.js` (`xpNeed`): até o 500 igual; do 500 ao 650 desce de 100% a 85%; do 650 ao 777 a 70%. Total 1→777 ≈ 167 milhões (era 189). Sempre crescente (teste de monotonia ok).
- `300-entidades.js` (`spawnKind`): nível dos selvagens de grau 6+ usa 25% por grau (era 15%): grau 6 ≈ 270, 7 ≈ 450, 8 ≈ 605, 9 ≈ 780. Graus 0–5 iguais.
- **Não feito**: bônus de reencarnação (Ian não escolheu). Teste só por script (XP e nível dos monstros); não testado em combate real.

## v572 (23/10/2026) — Nível máximo 777 e ponto de constelação a cada 3 níveis
- **Pedido de Ian**: teto 777 (era infinito); 1 ponto de constelação a cada 3 níveis, de propósito, para ninguém encher as 29 constelações (290). Do nível 37 ao 777 dá **247 pontos**.
- `370-v281.js` (`LEVEL_MAX`, `gainXp`: trava no 777, XP zera no teto, ponto só em nível ≥37 com nível%3==1), `640-telas.js` (save com nível >777 vira 777; pontos e constelações já gastos ficam), reencarnação pede `min(777, 100×(n+1))` (450, 610). Textos: `constel523.js`, `570-...constelaco.js`.
- Teste por script (node, a função real): 1→777 = 247 pontos, nada passa do 777, save no 900 vira 777 sem perder pontos. **Não feito**: curva de XP/monstros/ranks até 777 (aguarda proposta aprovada de Ian).

## v571 (23/10/2026) — 1ª pessoa: a MÃO NORMAL do Viajante, com ossos nos dedos
- **Pedido de Ian**: mão de 1ª pessoa igual à do Viajante, com dedos que fecham na arma ("cria ossos nos dedos e junta a malha", "refaz na mão normal").
- `tools/fp550.js` (`rigHand`): só na 1ª pessoa, as peças da mão (`tripo_part_7` direita, `tripo_part_8` esquerda) ganham 12 ossos novos (3 por dedo: indicador, médio, anelar, mindinho), com pesos por faixa e por articulação (geometria própria; a 3ª pessoa não muda). Os ossos fecham os dedos (relaxado sem arma, firme com arma). A arma é movida para a palma (âncora) e o punho gira para a lâmina apontar à guarda; golpe em 3 tempos; arco na esquerda (menor). Sai da 1ª pessoa → tudo volta ao original. Refaz os ossos se o modelo for refeito (troca de equipamento).
- Lição: atributos do GLB vêm intercalados — ler com `getX/getY/...`, não `.array`.
- Teste: jogo real (pane), espada parada e em golpe, arco, ida e volta 1ª/3ª pessoa. **Não testado**: cajado/lança/machado nessa pegada, escudo, armadura de mão equipada, polegar articulado (fica preso à mão).

## v570 (23/10/2026) — Constelações novas (estilo Skyrim)
- **Pedido de Ian**: constelações por habilidade. 18 ativas (Uma Mão, Duas Mãos, Arquearia, Bloqueio, Armadura Pesada/Leve, Destruição, Restauração, Conjuração, Forja, Alquimia, Furtividade, Fala, Caça, Pesca, Mineração, Cozinha, Montaria) + 5 apagadas ("desperta em breve": Ilusão, Alteração, Encantamento, Gatunagem, Escalada). As 6 antigas ficam (29 no total).
- `tools/constel569.js` (dados, efeitos por wrappers, imagens), `img/const570/*.png` (13 ilustrações geradas; `conj.png` = Conjuração, "con" é nome reservado no Windows), `constel523.js` (céu mais espaçado, nomes com contorno, suporte a imagem). 3 linhas no core (escudo, golpe furtivo, mineração).
- Pendente (Ian): nível máximo 777 e taxa de pontos (diretor); ilustrações das 10 restantes (acabaram os créditos). Não testado em combate real: dano por arma, Caça, Cozinha, Forja, Mineração.

## v569 (23/10/2026) — 1ª pessoa: braços e mãos reais do Viajante
- **Pedido de Ian**: "mãos nada a ver" (blocos marrons/pretos em 1ª pessoa). Agora são os braços do próprio modelo do Viajante (mesma malha, ossos e luvas da 3ª pessoa).
- `tools/fp550.js`: em 1ª pessoa só as peças `tripo_part_1/2/7/8` (braços) ficam visíveis (reforçado a cada quadro); a pose dos braços é um IK de 2 ossos até a frente da câmera, aplicado logo depois da animação (`Warrior127.animate`); o relevo (shader) é descontado do alvo. A arma segue o socket do jogo, mas o cabo é preso no centro do punho e a lâmina gira para a guarda de 1ª pessoa; golpe em 3 tempos (preparo, corte, recuperação) a cada ataque; espada/machado/maça/adaga/cajado/lança na direita, arco na esquerda. Ao sair da 1ª pessoa tudo volta ao original. `src/core/400-loop.js`: chama `FP550.body(true)` em vez de esconder o corpo.
- Teste: Edge/pane do jogo real, espada (parada e em golpe), cajado, arco, e volta à 3ª pessoa. **Não testado**: lança, machado, escudo, armadura equipada nos antebraços, dedos fechando no cabo (a mão é um punho fixo; pedido de Ian de criar ossos nos dedos fica para depois).

## v568 (23/10/2026) — Capim fino e baixo
- **Pedido de Ian**: a grama estava grossa e alta; queria algo mais real.
- `tools/grass446.js`: lâminas ~metade da altura (0,13–0,26 m) e ~40% da largura, tufo mais compacto; flores menores para acompanhar (haste 0,28 m). Densidade da v567 mantida (~12 mil tufos).
- Teste (Edge, GPU Intel UHD): captura mostra relva baixa e contínua; FPS 32. Não testado: celular.

## v567 (23/10/2026) — Gramado contínuo
- **Pedido de Ian**: a grama eram poucos tufos muito espaçados; queria um gramado de verdade, falhando só em trilha, terra, estrada, lama e água.
- `tools/grass446.js`: tufos a cada 0,34 m (antes 0,55 m), raio 28 m (antes 34 m), cerca de 12 mil tufos ao redor do jogador. Regras de onde não nasce (água, estrada, trilha, cidade, EcoGrid pisoteado) intactas.
- Teste (Edge, GPU Intel UHD): captura mostra capim contínuo; FPS 25–27, igual ao da v566. Não testado: celular.

## v566 (23/10/2026) — Solo Vivo (v550) conferido no jogo e consertado
- **Pedido**: conferir no jogo real (com capturas) o EcoGrid da v550, que só tinha teste de lógica.
- **Estava quebrado**: o EcoGrid tinha **0 chunks** (ganchos liam `global.chunks`/`gates`/`WX`/`npcs`/`run`/`WN`, que são `let/const` e não existem em `window`) — nada rodava: sem trilha, sem fenda, sem pisoteio de NPC/carrinho. Material do chão clonado perdia o `onBeforeCompile` do bioma. O gancho da grama mexia numa cópia de `rebuild` que o loop nunca chama. As árvores do EcoGrid eram ~2000 grupos (+1000 chamadas de desenho) duplicados e debaixo da terra.
- **Corrigido** (`tools/ecossistema550.js`, `tools/grass446.js`, `tools/survival437.js`): leitura dos globais pelo escopo de scripts (`gv()`), `attachChunk` (inclui os chunks já carregados), descarga de chunks removidos; grama lê `EcoGrid.grassMul` no próprio rebuild (altura = biomassa × pisoteio; trilha sem capim) e refaz quando o solo muda; estágios de árvore usam o **modelo real** da árvore do jogo em escala (muda 0,15–0,30, jovem 0,35–0,65, adulta 1, anciã até 1,2), sem cones/cilindros (pedido de Ian: sem formas geométricas); jogador continua sem derrubar árvore; lenhador deixa toco; `npcFellTree` agora acha a árvore mesmo na malha 'perto'. **Grama mais uniforme** (gramado; só falha em trilha, terra, estrada, água).
- **Teste (Edge, GPU Intel UHD)**: trilha após 22 passadas: terra batida visível e capim sumindo; fenda ativa: fertilidade 150→108, biomassa 104→85 (longe, intacto); FPS 23–27 com e sem o sistema (a GPU integrada do teste não chega a 60 nem sem o EcoGrid).
- **Pendente**: modelos Tripo de árvore medieval para muda/jovem (pedido de Ian) no lugar da árvore real encolhida.

## v565 (22/10/2026) — Constelações fáceis de achar
- **Pedido de Ian**: não sabia onde fica o céu de constelações.
- Tecla **7** (`cons` em `KEYACT`, remapeável; abre/fecha), entrada **✦ CONSTELAÇÕES [7]** no MENU, aviso "Novo ponto — 7 Constelações" (clicável, 12 s) quando `run.cpts` sobe. `tools/constel523.js`, `src/core/630-controles.js`, menu em `game.html`.
- Teste: navegador (tecla, menu, aviso, bloqueio abaixo do nível 35 com recado). Não testado: celular.

## v564 (22/10/2026) — Bússola estilo Skyrim
- **Pedido de Ian**: a bússola do topo só mostrava N/NE/L... e nada marcado.
- `tools/explorar539.js`: objetivo da missão ativo (◆ dourado, preso à borda se fora de vista; `Campaign327.target()` e missão rastreada de `Quests480`), cidades (⌂) e capitais (♛) descobertas, portais (◉, cor do rank), com opacidade caindo com a distância; lugares não descobertos por perto aparecem apagados em cinza e viram normais ao chegar a 130 m (`profile.cmp564`; cidade já visitada/registrada conta como descoberta, Aster desde o início); inimigos em combate a menos de 38 m viram ponto vermelho. Olhando para um marcador (±7°) aparece nome e distância sob a barra. Sem botões novos.
- Teste: jogo real no navegador (sem erro de script); marcador, nome «Aster · 700 m», quest, cinza dos não descobertos. Não testado: celular, inimigo vermelho em combate real.

## v563 (22/10/2026) — Mapa: lista de portais começa fechada
- **Pedido de Ian**: no mapa (M) a lista "Cidades próximas / Portais abertos" cobria tudo.
- `tools/mapa3d544.js`: o painel começa fechado; só abre no botão PORTAIS (e fecha no mesmo botão); a escolha fica salva (`pds_maplist`).
- Teste: jogo real, mapa 3D aberto: painel `off` (display none) → clique abre → clique fecha, escolha gravada. Sem texto ligado a mudar.
- **Não feito**: mãos de 1ª pessoa com a malha real do Viajante (tentativa parou: os pesos de pele do Tripo são ruidosos; rascunho em side-session-notes `fp563-maos-wip.diff`). Mãos continuam os blocos da v550.

## v562 (22/10/2026) — Chão distante não fura mais o chão real
- **Pedido de Ian**: montanha reta, personagem enterrado em morro, relevo que não dá para atravessar.
- Causa medida (profundidade do jogo real x `terrH`): o chão distante (`tools/capitais504.js`, malha de 30 m) subia acima do chão real em desfiladeiros e serras estreitas (374 pontos errados, até 25 m, na Estrada Sul). Agora a malha distante some a menos de 150 m do jogador e ficou mais fina (20 m). Pontos errados 374 → 40 (só na borda dos 150 m).
- Teste: Edge headless, desfiladeiro da Estrada Sul e serra de gelo ao norte, sem buraco nem emenda visível. Não testado: desempenho em máquina fraca, celular.
- **Não feito**: ponte da Estrada Sul sobre vala seca; cidades grandes nas capitais.

## v561 (22/10/2026) — Correção da v560: carroça de volta em y=0
- O relevo do jogo é aplicado pelo shader (a lógica fica em y=0); a v560 pôs a carroça em `terrH` e ela subiu duas vezes (flutuava). `tools/civic343.js` volta a y=0 (inclinação na subida mantida). Visto em captura do jogo real: carroça na estrada, na encosta, assentada.
- Lição: nunca somar `terrH` à posição y de um objeto de cena; só em lógica/câmera/mira.

## v561 (22/10/2026) — Mão do Arquiteto volta a pegar só chefões (correção de regressão)
- Pedido de Ian: a Mão pegou um bicho comum depois de morto; já tinha sido corrigido na v515.
- Causa: a v551 (missão fixa #2, outra sessão) reintroduziu em `Reclaim372.claimEnemy` a exceção `isIntroTutorial` (herdada da v402), que chamava a Mão para o mob do tutorial, contra o «tutorial sem mão» da v515. Não foi rebase nem conflito: foi edição nova na mesma linha. O teste `test-coleta513.cjs` já pegava isso, mas não era rodado no build.
- Corrigido: `claimEnemy` só aciona a Mão se `e.isBoss`. Guarda nova `tools/test-mao-so-chefes.cjs` (roda no `build.py`, falha se a Mão voltar a aceitar não-chefe).
- Revisão v527–v560: nenhuma outra correção aprovada desfeita (ver relatório).

## v560 (22/10/2026) — Carroças das estradas: seguem a estrada, no chão, mais lentas
- **Pedido de Ian**: depois da mudança de escala/relevo, muitas carroças ficaram bugadas e rápidas demais.
- `tools/civic343.js`: a carroça civil andava a 14,5 m/s (o sprint agora é 5,8) e ficava em y=0 (enterrada/flutuando no relevo) num caminho em L reto que atravessava serra. Agora: 6,4 m/s (rodas a 12,8 rad/s), altura = `terrH` com inclinação pela subida, e o caminho é a estrada sinuosa real (`Mundo513.segs`), com o antigo caminho em L só como reserva. Destruída fica no chão (`terrH`-0,25).
- Teste: Edge headless com o jogo real; carroça na Estrada Sul seguiu a garganta (48 pontos), altura = `terrH`, inclinada na subida, sem erro. Não testado: carroças entrando em cidade grande, som.
- **Não feito**: "pontos do mapa que parecem chão e não são" (sem local exato) e cidades grandes nas capitais (decisão de Ian: capitais, não mover a garganta).

## v559 (22/10/2026) — Forja da Ordem e Laboratório de Alquimia
- **Pedido de Ian**: criação em forja/refino por rank da Fenda, aprimoramento de ataque/defesa, alquimia por experimentação (descobrir efeitos e receitas, elixires permanentes), no HUD novo.
- `tools/forja551.js`: janela FORJA · ORDEM DOS ARTÍFICES (Criar = regra `forge` já existente, núcleos+cristais por rank F…★; Refinar = regra de aprimoramento existente +8%/nível, agora também para peças na bolsa). Janela ALQUIMIA · LABORATÓRIO: mistura 2–4 ingredientes (plantas, sais, Essências = cristais da Fenda), resultado pelas propriedades (cheiro dá pista), Diário de receitas com Repetir, sal estabilizador dobra a quantidade. Essência + bebida = Elixir Eterno (+0,4%×(rank+1) de Vida/Ataque/Mana/Velocidade/Escudo, teto 12% por atributo; já no teto, nada é gasto). Salvo em `profile.fa551`; bônus entra em `statsFor`.
- Entradas: lojas do Kael/Brann (Forja da Ordem) e da Mira (Laboratório). `telas535.js`: títulos FORJA/ALQUIMIA usam o visual aprovado com 3D.
- Partes ligadas: receitas fixas do caldeirão (alchemy470) e Kael/aprimorar continuam como estavam.
- Teste: Edge headless com o jogo real (30 checagens: misturas, consumo atômico, borra não gasta, elixir+teto, save, forjar, refinar peça da bolsa, janelas, 0 erros). Não testado: som, celular.

﻿## v557 (22/10/2026) — Ficha Personagem no novo HUD + Primeira Arma Kael corrigida
- **Pedido de Ian**: adaptar a ficha (Status, Habilidades, Passivas, Títulos, Build) ao novo HUD, centralizada e responsiva; corrigir a Primeira Arma · Kael (nomes cortados, imagens de Paladino/Invocador, baú 3D encobrindo a direita).
- `tools/telas535.js`: janela PERSONAGEM usa o fundo/estilo do novo HUD, conteúdo centralizado (máx. 1100px), abas quebram linha em tela estreita. Kael: baú 3D removido dessa tela, cartões em grade com nome completo e botão inteiro.
- Imagens novas `assets/equipment405/class-5.webp` (Paladino, Maça da Aurora) e `class-6.webp` (Invocador, Tomo), renderizadas dos GLB oficiais `models/armas155/varinha-paladino-490.glb` e `tomo-invocador-490.glb`; registradas em `tools/equipment-art405.json`.
- Testado no Edge headless 1280×720 (ficha Status/Build e Kael). Cache: telas535 ?v=557, catálogo ?v=555, sw pds-v557.

## v558 (22/10/2026) — Mestre Lúcio e falas por região
- Pedido de Ian (chat «capitais, vampiros e mundo»): corrigir o Mestre Lúcio falando como mendigo e dar diálogos por região. O mendigo agora se chama «Lúcio» (sem o título «Mestre»). `tools/vida522.js`.
- `tools/dialogo520.js`: saudação e boatos próprios de cada capital (Aster, Solaria, Ymiria, Zahar, Thalor, Urdan & Verden) via `Povo482.regionOf`; 40% das notícias vêm do boato regional.
- NÃO feito (precisa de decisão/arte): região vampírica gótica, espíritos noturnos, mais rotas de cidadãos, falas por raça/facção (não há orcs/vampiros como NPCs ainda).
- Teste: `node --check`. Não testado no navegador.

## v554 (22/10/2026) - NPCs da cidade reagem a ameacas
- **Pedido de Ian**: Idle dos NPCs (Banco, Forja, Lojas, Guilda) e guardas, HUD nome/vida ao foco/dano, e deteccao de ameacas: guardas/cacadores (Marcos, Kallan) combatem, civis fogem e voltam a rotina. Preserva NPCs essenciais e interacao.
- `tools/ameaca554.js` (novo, `window.Ameaca554`): vendedores nomeados (Citizens133 = malha sem esqueleto, ficavam parados) ganham respiracao, troca de apoio, olhar em volta e encolhem de medo; continuam no posto. Guardas (role523) e cacadores da cidade sacam a arma, correm ate o monstro agressivo/invasor a menos de 40 m e batem a cada ~1 s com `hurtEnemy` (`guard343`, passa a muralha); o monstro revida e o defensor cai 10 s (nunca morre); fim da ameaca: guardam a arma e voltam a ronda. Moradores/cidadaos fogem a 22 m e retomam a rotina 4 s depois. HUD de nome+vida ao mirar (12 m) ou 4 s apos apanhar. Um unico varrer de inimigos a cada 0,4 s.
- Teste (navegador): lobo invasor em Aster: Marcos, Ruy, Kallan e Voss em luta, lobo morreu (24 golpes), 3 moradores fugiram e voltaram a trabalhar, armas guardadas, HUD "Selene - BANCO"; varredura ~0,004 ms. Nao testado: hitbox do dragao (outra sessao), som.
- Limite: vendedores seguem sem esqueleto (Idle e procedural no corpo todo); esqueleto de verdade exige rig no Blender.
## v553 (22/10/2026) - Hitboxes 3D compostas do dragao
- **Pedido de Ian**: dano do dragao (inclui Dragao Ancião Errante) pelo corpo real, nao pela projecao no chao.
- tools/hitbox-dragao551.js: 21 esferas (tronco, pescoco, cabeca, asas, cauda, patas) seguindo o modelo; substitui a capsula unica em Projectiles253.segmentCapsule/intersectRayCapsule quando o alvo e dragao (Lanca de Gelo, flechas, mira). Golpe corpo a corpo basico (380-acoes.js) usa Dragao551.melee em 3D: de baixo, com o dragao a 24 m, nao acerta.
- Teste (navegador): dragao no ar - cabeca/asa/cauda acertam por cima, tiro rente ao chao e golpe por baixo nao; Lanca de Gelo tira vida; morte ok. Habilidades de area ainda usam distancia no chao (nao alteradas).
## v552 (22/10/2026) — Crash ao fechar o mapa + painel de portais recolhível
- **Pedido de Ian**: corrigir o crash ao fechar o mapa 3D e permitir recolher/reabrir o painel lateral de portais.
- **Causa (medida no console)**: `tools/mapa3d544.js` deixava um 2º contexto WebGL vivo (antialias, canvas de marcas 2048, ~120 malhas) por cima do jogo; a GPU estourava (`GL_OUT_OF_MEMORY` → `CONTEXT_LOST_WEBGL` → "Error creating WebGL context").
- **Correção**: `unmount()` agora chama `teardown()` (dispose de geometrias/materiais/texturas, `forceContextLoss`) e `mount()` refaz a cena; listeners voltam a ser ligados no canvas novo.
- **Painel**: botão "PORTAIS ›/‹" (`.tg`) recolhe/reabre a lista; estado lembrado entre aberturas.
- **Teste**: 4 ciclos abrir/recolher/reabrir/fechar: canvas volta a 5, `paused=false`, console sem erros.

## v550 (22/10/2026) — Solo Vivo, EcoGrid e Trilhas por Pisoteio (Desire Paths)
- **Missão de Ian**: Implementar o sistema de Solo Vivo, Crescimento Progressivo de Grama/Arbustos/Árvores e Trilhas por Pisoteio (Desire Paths) integrado ao relevo (terrH em terrain245.js), biomas/clima (biomes295.js) e águas (lakeAt239), mantendo 60 FPS cravados.
- **Grade Celular Leve por Chunk (EcoGrid)** (tools/ecossistema550.js):
  - Cada chunk ativo (64m × 64m) dividido em grade 32×32 de células de 2.0m × 2.0m armazenado em um único Uint8Array(32 * 32 * 4) (exatos 4 KB de RAM por chunk).
  - Canal 0 = Umidade (0–255): calculado pela proximidade de lakeAt239, rios e mar, amortecido pela inclinação da normal de terrH (vales retêm água, encostas drenam) e precipitação climática de biomes295.js.
  - Canal 1 = Fertilidade (0–255): matéria orgânica/serrapilheira; sobe +2 por tick perto de árvores adultas (6m) e várzeas/margens de água; cai -3 se exposto/desmatado ou sob fenda ativa.
  - Canal 2 = Pisoteio (0–255): compactação do solo por Viajante (+6 a pé, +10 sprint), Carrinho de Carga (+12), Moradores/Guardas (+4), Carroças (+18) e Manadas/Montarias (+14). Sem tráfego, o solo descompacta (-1 por tick).
  - Canal 3 = Biomassa (0–255): estágio acumulado de cobertura vegetal da célula.
- **Lei do Fator Limitante (Liebig) em Background Tick Assíncrono** (tools/ecossistema550.js):
  - Simulação biológica executada assincronamente a cada 500 ms (1 a 2 chunks por segundo), garantindo 60 FPS cravados sem engasgos no loop de renderização.
  - fatorCrescimento = Math.min(umidade, fertilidade) * (1.0 - pisoteio / 255.0).
  - Pisoteio > 180: capim morre rapidamente (-14 biomassa/tick), abrindo a trilha de terra batida.
  - Pisoteio < 80 e fatorCrescimento > 60: biomassa se desenvolve gradualmente até o teto do bioma e da fertilidade.
- **Transição Visual 3D Contínua e Shaders**:
  - Fragment Shader do Terreno: textura THREE.DataTexture(32, 32) com filtro bilinear contínuo; interpolação suave da vegetação para terra batida/lama via smoothstep(0.45, 0.75, pisoteio) e escurecimento orgânico do solo conforme fertilidade e umidade.
  - Vertex Shader da Grama (grass446.js): altura das folhas modulada por clamp((biomassa / 100.0) * (1.0 - pisoteio * 0.85), 0.0, 1.4), com inclinação física lateral ao passar o jogador.
- **Ciclo de Vida de Árvores e Arbustos em 4 Estágios Reais + Toco** (tools/survival437.js, tools/ecossistema550.js):
  - Árvore cortada pelo jogador não some: estado muda para Toco (biomassa = 50, modelo de toco).
  - Estágio 1 (Muda/Brote, biomassa 120–150): scale 0.25 a 0.50.
  - Estágio 2 (Árvore Jovem, biomassa 151–200): malha de árvore fina, scale 0.55 a 0.85.
  - Estágio 3 (Árvore Adulta, biomassa 201–240): árvore completa, scale 0.90 a 1.15, gera serrapilheira (+fertilidade em 6m) e pode ser cortada para Toras e Lenha.
  - Estágio 4 (Árvore Anciã, biomassa 241–255): surge em várzeas e solos de altíssima fertilidade intocados, scale 1.20 a 1.45, fornecendo madeira nobre dobrada e resinas raras.
- **IA de Navegação e Fendas**:
  - Animais e NPCs fora da estrada principal ganham bônus de custo menor (-35%) ao caminhar sobre células com pisoteio > 120, reforçando naturalmente as trilhas abertas.
  - Fendas ativas degradam fertilidade e biomassa no raio de miasma; fendas seladas pelo Viajante regeneram a vegetação sob a chuva, fazendo a floresta renascer.
- **Regra de Coleta de Madeira e Derrubada de Árvores (Diretriz de Ian)** (tools/survival437.js, tools/workers350.js):
  - O jogador NUNCA derruba árvores de pé; a vegetação permanece viva e intocada.
  - Ao redor das árvores de qualquer estágio, o jogador cata gravetos caídos no solo (`galho`), folhas e resina com tempo de recarga local de 60s.
  - Apenas NPCs Lenhadores (`tools/workers350.js`) derrubam árvores em seus canteiros de trabalho fora das muralhas, deixando tocos e troncos caídos.
  - O jogador pode interagir com tocos e troncos caídos largados no chão para recolher lenha e gravetos extras.
- **Visão em 1ª Pessoa 3D Estilo Skyrim Calibrada para FOV 48** (tools/fp550.js, src/core/400-loop.js, src/core/630-controles.js, tools/skyrim-overhaul538.js):
  - Desvinculação total da tecla V do inventário de sobrevivência e remoção de listener duplicado: alternância imediata em 1 único toque.
  - Viewmodel calibrado para a visibilidade em FOV 48 (base Y = -0.095, Z = -0.32): mãos, manoplas de ferro/couro e armas SEMPRE visíveis em idle (nunca somem abaixo da tela).
  - Animação de idle com respiração suave, passada física sincronizada, corte inercial (slash) com recuperação fluida para a guarda, e apoio bimanual na empunhadura de cajados e lanças (como a Lança de Gelo).
  - Retículo minimalista Skyrim (< · >) alinhado ao ponto de mira central.
- **Validação e Testes**:
  - Testes unitários de arquitetura, Liebig, trilhas por pisoteio e os 4 estágios executados com sucesso em tools/test-ecossistema550.cjs.
  - Verificação de carregamento e inicialização em navegador real Edge headless via CDP (tools/test-edge-cdp.cjs).
  - Sincronização via tools/build.py e validação tools/core_parts.py check (ok).

## v549 (22/10/2026) — Biomecânica orgânica Skyrim × Primeva (IK real no relevo, inclinação e curvas do Viajante, dinâmica de voo dos dragões e articulação)
- **Pedido de Ian (Estúdio de Animação Orgânica e Cinemática)**: Acabar definitivamente com o visual de boneco rígido em dragões, Viajante, monstros e NPCs, trazendo a física, peso corporal e apoio no relevo de Skyrim.
- **Viajante & Humanoides (Foot IK e Terreno)** (	ools/anim547.js, src/core/400-loop.js, 	ools/warrior-player127.js):
  - Foot IK analítico de 2 ossos integrado diretamente ao relevo 	errH(x, z): a pelve rebaixa dinamicamente até alcançar a cota mais baixa do terreno, enquanto a perna mais alta flexiona o joelho (shin_l/shin_r) e ajusta a coxa (	high_l/	high_r), apoiando as solas firmemente no solo rochoso sem flutuação nem afundamento.
  - Inclinação anatômica em ladeiras (*pitch* frontal suave) e inclinação lateral no relevo (*roll*).
  - Inclinação nas curvas (*banking*): corpo inclina para dentro nas mudanças de direção em proporção à velocidade de deslocamento. Olhar/cabeça com contra-rotação compensatória no horizonte.
- **Dragões e Criaturas Aladas** (	ools/anim547.js, 	ools/dragoes510.js, src/core/580-bloco-b-economia-caravanas-chefes-errant.js):
  - Curva com inclinação aerodinâmica real (*roll* de até 40° em manobras fechadas), arfagem (*pitch*) sincronizada à taxa de subida e descida vertical.
  - Peso corporal e impulso de voo: deslocamento vertical (*bobbing* de 0,75 m) sincronizado com a fase de empuxo das batidas de asa.
  - Propagação em onda com atraso de fase no pescoço (cadeia de 6 juntas) e na cauda, chicoteando e acompanhando as curvas.
  - Asas de 3 juntas articuladas (ombro -> cotovelo -> pulso/vela) com ciclo aerodinâmico que recolhe os membros na subida para cortar o ar e abre com impulso máximo na descida.
  - Pouso adaptado ao relevo: dragão no chão orienta o corpo de acordo com a normal do solo sob suas patas.
- **Monstros GLB e Quadrúpedes** (	ools/anim547.js, src/core/140-monstros-animados-quaternius-cc0-carrega.js, src/core/300-entidades.js):
  - Monstros GLB orientam a caixa torácica e coluna na inclinação do terreno em tempo real.
  - Lobo Espiritual construído com pernas articuladas de 2 juntas (coxa + joelho/canela) com marcha diagonal (trote), flexão de joelho na fase de balanço (*swing*) e firmeza na fase de apoio (*stance*), além de cauda segmentada em 3 partes ondulando com atraso de fase.
- **Validação e Testes**:
  - Teste automatizado com Edge headless via CDP no jogo ativo: 594 ciclos de Player IK, 250 cálculos dinâmicos de dragão em voo e 4276 atualizações de relevo em monstros.
  - Sincronização e empacotamento validados via 	ools/core_parts.py check e 	ools/build.py.

## v548 (22/10/2026) — Proporção nórdica 1:7.5, câmera nos olhos e escala Skyrim
- Pedido de Ian: Corrigir definitivamente a percepção de escala e proporção entre o Viajante (2,00 m–2,05 m), os NPCs e o mundo com os 5 Especialistas do Estúdio Visual Primeva × Skyrim sem quebrar colisões (HASH / ddCol), missões ou saves.
- **Câmera na linha dos olhos e FOV Skyrim** (src/core/070-three.js, src/core/400-loop.js, 	ools/witcher377.js):
  - Em 
esize(), camera.fov configurado para 48 no PC (60 mantido apenas em mobile portrait).
  - Em pcCam e camUpdate(), distância a pé alterada de 3.9 m para 2.25 m (montado 4.2 m), pivô vertical pivot.y de 1.72 m para 1.60 m, offset lateral camRot de 0.62 para 0.45, pitch inicial de 0.16 para 0.03 (câmera alinhada aos olhos/ombro a ~1,67 m do chão, com visada no horizonte, eliminando a perspectiva de maquete).
- **Proporção humana 1:7,5 e fim dos bonecos chibi** (	ools/warrior-player127.js, 	ools/citizens133.js, 	ools/npc482.js, 	ools/vida522.js, 	ools/vida523.js):
  - Todos os makeChibi eliminados de 	ools/vida522.js (mendigos) e 	ools/vida523.js (moradores, guardas, ladrões), substituídos pelos corpos e malhas humanoides do Povo482 (	ools/npc482.js). Raio de LOD do Povo482 expandido de 60 m para 140 m (FAR = 140, DROP = 160, CAP = 48).
  - Em warrior-player127.js, citizens133.js e 
pc482.js, medição e normalização de altura realizada pela posição mundial do osso head + 0.12 m (evitando distorções por cristas, elmos e elmos altos), com aplicação de scale.setScalar(0.88) no osso da cabeça para proporção áurea de 7,5 a 8 cabeças (Viajante = 2.02 m, homens = 1.84 m–1.95 m, mulheres = 1.72 m–1.82 m).
- **Escala vertical de árvores, casas, portas e muralhas** (src/core/210-bloco-environment128-cont.js, src/core/680-bloco-journey113-cont.js, 	ools/encontros502.js):
  - Gerador de chunks do mundo (EH) e árvores de cidades ampliados de 5.2–7.5 m para 15.5 m–23 m ((dead ? 11.5 : 15.5) + R() * 7.5), com raio de projeção de sombra expandido para 5.8 m, integrando a floresta do continente ao padrão do desfiladeiro.
  - Em TripoEnvironment153.HEIGHT: guild: 16 m, defense: 16 m, forge: 9.5 m, inn: 13.5 m, church: 18 m, potion: 10.5 m, mill: 16 m, well: 2.8 m, bank: 3.2 m, market: 3.4 m, bankhall: 14 m, house: 8.5 m–10.5 m (com vãos de porta livres de 2.5 m–2.8 m).
  - Muralhas internas de cidades elevadas para 7.0 m (eram 3.1 m), portões cityGates341 para 6.2 m (eram 3.5 m). Barris reduzidos para 0.78 m e caixotes para 0.85 m.
- **Velocidade física e cadência de passada** (src/core/160-jogador.js, src/core/400-loop.js, 	ools/sprint373.js, 	ools/character405.js, 	ools/warrior-player127.js):
  - Velocidade base em statsFor() reescalada para 4.2 m/s (caminhada 1.85 m/s, corrida 4.2 m/s, sprint 5.8 m/s).
  - Sincronização do AnimationMixer.timeScale com a velocidade física real (speed / refSpeed), eliminando o deslizamento dos pés e conferindo peso nórdico ao deslocamento.
- **Testes e validação:**
  - uild.py e core_parts.py check executados com sucesso (checksums e sincronia de src/core/ para game.html e index.html).
  - Sintaxe JS verificada com 
ode --check em todos os módulos alterados.
  - 4 capturas no navegador geradas e validadas comprovando proporção ao lado de NPC, diante de porta/casa, ao lado da muralha e sob árvores gigantes.

## v547 (22/10/2026) — animação anti-boneco rígido
Pedido de Ian: Viajante, NPCs, mobs e dragões sem cara de boneco rígido. Novo tools/anim547.js roda depois de todo AnimationMixer.update: pé no relevo (IK de 2 ossos com terrH, pelve desce até o pé mais baixo, corpo inclina na ladeira), cauda/pescoço/asas em onda com atraso de fase e inércia no giro, quadril inclina nas curvas. LOD: IK até 24 m, ondas até 45 m; desliga com Anim547.on=false. 140-monstros: troca de animação com mistura (0,22 s) no dracônico, na volta ao parado dos clipes próprios e na corrida. Teste: node (pé na ladeira bate com terrH) e navegador (28 rigs, sem erro novo). Não cobre modelos estáticos sem ossos (balançam inteiros, como antes).

## v546 (22/10/2026) — Missão fixa #1 «O Céu Rasgado na Estrada Sul» no jogo
- Pedido de Ian: «uma por uma e publica cada uma que tu criar» — as 300 missões fixas do motor (`RadiantPrimeva.FIXED_300_QUESTS`) entram fiéis ao texto, uma por versão.
- `tools/fixas545.js` (novo, `window.Fixas545`): guarda as escolhas das missões fixas (`profile.fixas545`) e o que elas mudam no mundo. `LIVE` lista as que já acontecem no jogo.
- Missão #1 na cena da carroça (`tools/campaign327.js`, Ato I passo 1): Edran agora diz que há dois presos debaixo da carroça e que a gosma vem do mato. A criatura é a Gosma Fendida (`gosma_f`). A escolha:
  - **Empurrar a carroça antes de lutar** (F na carroça com a gosma viva): o casal sai de baixo da carroça. Depois da luta, Edran conta que o escudo dele rachou segurando a gosma e que o casal vai abrir uma banca. **+5 de confiança em Aster**. A **banca de ataduras** aparece no primeiro anel de Aster (ao lado da estrada sul, dentro da muralha), com o mesmo homem e a mesma mulher do resgate (modelos `NPC456`). F abre a conversa nova: Atadura de Ervas por 25 de ouro (1 ou 5), «Como vocês estão?».
  - **Atacar a gosma primeiro**: Edran diz que o escudo aguentou inteiro e, ao chegar ao portão de Aster, entrega **1 Poção de Vida**.
- Texto = contrato: o catálogo dizia «Poção de Vida Menor» e «banca de bandagens»; o jogo tem uma poção só (Poção de Vida) e o item de curativo é a Atadura de Ervas, então o texto da missão #1 foi ajustado para esses nomes. Objetivo na tela: «Empurre a carroça para salvar os dois [F] ou derrote a criatura primeiro».
- `tools/dialogo520.js`: `Dialogo520.custom(def, npc, árvore)` para conversas próprias de missão. O casal entra em `npcs` como figurante parado (`kind:'deco'`) para a conversa achar o rosto e aproximar a câmera.
- Teste: navegador local com personagem novo nos dois caminhos: A (gosma viva → empurrar → abater → Edran → confiança de Aster 0→5, banca no anel, comprar atadura 100→75 de ouro e 0→1 atadura, banca continua depois de recarregar a página); B (abater → bálsamo → empurrar → portão → Edran entrega a poção, 3→4). Sem erro JavaScript.

## v545 (22/10/2026) — Atacar qualquer NPC, recompensa por cidade e guardas que cobram
- Pedido de Ian (áudio): atacar qualquer NPC como no Skyrim, ele revida; cidadão da cidade dá problema, de outra cidade não, mas se virem você fica falado e perde reputação.
- `tools/crime545.js` (novo, `window.Crime545`): golpe corpo a corpo (alcance do básico) e tiros do jogador acertam NPCs no mundo aberto; crianças não. Quem apanha revida (moradores/viajantes/caçadores fraco, guardas forte) e desiste a 30 m ou após 25 s sem apanhar. Vendedores e personagens da história caem por 10 s e levantam. Morto fica caído 2 min e some (o vida523 repõe moradores).
- Crime: só se alguém viu (NPC a até 22 m, guarda a até 35 m; a vítima viva denuncia a agressão). Morador/guarda/vendedor da cidade: agressão 40, morte 1000 de recompensa naquela cidade (`profile.bounty545[cidade]`) e confiança da cidade −2/−10 (`regionEvent116`, sai nas notícias). Caçador, viajante e encontro (de fora): sem recompensa, mas a confiança cai se alguém viu. Ladrão da noite não conta.
- Guardas (`dialogo520.js` buildGuard): com recompensa na cidade eles vêm até você e param para conversar: pagar (zera a recompensa) ou resistir (`profile.resist545`: todos os guardas da cidade atacam até você pagar; falar com um guarda de novo permite pagar). Sem ouro: o guarda manda voltar com o valor. Não há cela.
- Aviso no canto de cima: «40 de recompensa em Aster» (some sozinho).
- `tools/skyrim-overhaul538.js`: o ataque a NPC dela desligado (nunca rodava: usava `window.npcs`).
- Teste: navegador local: moradora morta com testemunhas (40 + 1000 em Aster), guarda veio e abriu a conversa, resistir → dois guardas atacaram (−64 de vida em 4 s), pagar → ouro −1040, recompensa 0 e guardas calmos; Kael caiu e levantou com a vida cheia; criança não foi atingida; caçador morto: 0 de recompensa e confiança −12; morte sem testemunha: só os 40 da agressão; flecha acerta morador. Sem erro de JavaScript.

## v544 (22/10/2026) — Mapa-múndi 3D estilo Skyrim
- Pedido de Ian (áudio): «quando for apertar o mapa, eu quero um mapa de Skyrim … relevo, névoa … o mar igual Skyrim».
- `tools/mapa3d544.js` (novo, `window.Mapa3D544`): no mundo aberto, M abre o mapa na tela inteira em 3D (WebGL próprio). Relevo real (`terrH`, grade 321×321 dos 10 km, altura 3×), cor do mapa-múndi (`Mapa501.sample`, 1024 px, menos saturada como no Skyrim) com estradas; mar só onde o jogo tem mar (`SEA439`), com ondas; nuvens baixas que passam e somem quando você aproxima; nuvens grossas na borda do mundo; névoa no horizonte. Nomes das cidades flutuam (Capitais em maiúsculas, só elas de longe), seta dourada e «VOCÊ» no jogador. Portais, chefes do mundo, missões (`Quests480.drawMinimap`), carroças (`Civic343.map`), alvo da campanha e tesouro ficam pintados sobre o chão (atualiza a cada meio segundo). Arrastar move, rodinha aproxima, botão direito gira; M, Esc ou × fecham. A lista do mapa antigo (missões com Acompanhar, cidades, portais) vai para o painel da direita. O relevo é calculado uma vez por mundo (cerca de 3 s, com «DESENHANDO O RELEVO…»).
- Masmorras e lugares especiais continuam com o mapa 2D. `tools/mapa501.js` exporta `sample` e `ensure`. `tools/skyrim-overhaul538.js`: o mapa falso dela (canvas 2D) desligado (`map3DActive:false`).
- Teste: navegador local (cópia própria, porta 8784): prints do mundo inteiro, Aster, Thalor com o mar e Ymiria; abrir com M e fechar com M, Esc e ×; abrir duas vezes não duplica; masmorra mostra o mapa 2D; sem erro de JavaScript.

## v543 (22/10/2026) — Conversa nova para todos os NPCs e para as falas da história (um sistema só)
- Pedido de Ian: «Leva a conversa nova também para os moradores, NPCs de outras cidades e para as falas da história.»
- Problema encontrado: a v540 criou uma conversa própria interceptando `openShop`, mas o jogo já tinha o diálogo do `dialogo520.js` (vendedores, caçadores, moradores com rotina, guardas, bêbados, mendigos, brigas, encontros). Em Aster, escolher «comprar» no diálogo antigo abria a conversa da v540 em seguida (duas conversas).
- `tools/conversa539.js` (reescrito): não intercepta mais a loja. Vira a camada visual de todas as conversas do `dialogo520`: câmera de perto (o jogador some da cena), nome + função + corações à esquerda de uma linha (afinidade 0–10 dos 6 de Aster ou afeto 0–5 do `dialogo520`), perguntas à direita com o cristal da Fenda seguindo o mouse, fala embaixo e teclas 1-9/F/Esc. Os avisos (`toast`) durante a conversa viram fala do Narrador no alto. As falas da história (`Intro401.dialog`, `#dialog401`) usam o mesmo visual: nome à esquerda da linha, fala embaixo e «Continuar» à direita.
- `tools/dialogo520.js`: nos 6 vendedores de Aster entram, dentro do diálogo existente, «● Como estão as coisas?» (`NPCTALK`), «◆ Missão pessoal» (`NPCQ`; concluir usa `npcdone`; «⌂» bloqueada até 3 corações) e «♥ Trouxe um presente» (ação `gift`, preço real). As marcas ◆ ● ♥ ⌂ ganham cor.
- `tools/explorar539.js`: a bússola e o cristal somem durante conversas e falas da história. Corrigido um caractere de controle (backspace) que quebrava essa verificação.
- Teste: Edge headless com o jogo real. Kael pelo F de verdade (o `n.use` envolvido pelo `dialogo520`): opções novas aparecem, fala com nome, presente 500→478 de ouro com afinidade subindo, «Quero ver suas armas» abre a loja sem segunda conversa e devolve câmera e jogador. Caçadora Talia [F] (Caçador · Aster). Fala da história do Kael em 2 linhas termina e chama o retorno. Celular 390 px. Sem pageerror. Reaplicado por cima da v542.

## v542 (22/10/2026) — Contratos vivos: o motor infinito vira missão de verdade
- Pedido de Ian («quero»): ligar o motor da v539 (`tools/motor-missoes-infinitas.js`) ao `tools/quests480.js` — alvos no mundo, abates contados, marca no mapa e pagamento só no fim. Começar pelos contratos infinitos.
- `tools/contratos541.js` (novo, `window.Contratos541`): todo Mural de Contratos (Região → Abrir Contratos, ou o mural da cidade) ganha «CONTRATOS VIVOS DE <cidade>»: 3 contratos daquela cidade montados com título/história/arquétipo do motor. O alvo fica a 140–230 m da cidade; a criatura sai do bioma real do ponto (`biomeAt` → lista do motor → monstro do `KINDS`; Tecelã para a aranha) e a quantidade vem da vida do monstro (2, 3 ou 4–6). Ao aceitar você escolhe A ou B; o mural mostra o que cada uma paga. O pagamento é lido do próprio motor (sem aplicar) e entra só quando o último alvo cai: ouro, reputação da Ordem, cristais/núcleos do seu rank, confiança e acréscimo de preço da cidade (`regionEvent116`), pontos de obra no Conselho (só capitais do `WorldSim479`) e fama (`fama523` bondade/maldade). Contrato cumprido dá lugar a outro na mesma vaga; a cada dia as vagas livres mudam.
- Texto = contrato: os rótulos das escolhas foram reescritos (curtos, sem prometer carroça, Ctrl, cristais gastos ou elite que o código não faz) e a «Tática» do motor saiu da descrição (citava tecla 7 e itens que não existem). Efeitos do motor que não existem no jogo (aliança de clã, treino de atributo, desconto de 5%) não aparecem nem são prometidos.
- `tools/quests480.js`: mural aceita o id da cidade («rx,rz») e o nome da capital (antes o mural aberto pela cidade ficava vazio; agora Aster mostra também os contratos fixos dela); contrato com `count541` não tem chefe, conta cada abate (número sobe em cima do monstro e no HUD «Coelho Assassino: 2/5»), renasce só o que falta se você sair e voltar, guarda a definição no save (`def490`) e paga pelo `Contratos541.pay`. Abandonar agora também tira a arca/grupo do mundo.
- `tools/motor-missoes-infinitas.js`: expõe as listas do motor e um modo de leitura do efeito (`_capture`). `tools/skyrim-overhaul538.js`: tirada a injeção das 300 fixas e do quadro no catálogo do quests480 (entravam sem região nem alvo); o mapa 3D (M) passa a desenhar as missões aceitas (losango dourado na acompanhada).
- Teste: navegador local (cópia própria, porta 8785) com o jogo real: mural de Aster com 3 contratos e pagamentos A/B; aceitar B; 5 Coelhos nascem no ponto; 2 abates → HUD 2/5; sair 400 m e voltar → nascem só 3; abater → ouro 20→169 (119 do contrato + queda dos monstros), confiança de Aster +5, vaga ganha contrato novo; aceitar outro e recarregar a página → contrato continua; marcador no minimapa, no mapa e no mapa 3D. Sem erro JavaScript.
- Não feito: as 300 missões fixas continuam só como catálogo (descrições com recompensas e mecânicas próprias que o jogo ainda não tem); missão dentro de Fenda (`generateRiftQuest`) segue como estava.

## v541 (22/10/2026) — Troca de arma pela rodinha/1–4 e mana por segundo no ataque mágico
- Pedido de Ian (áudios estilo Skyrim): o ataque mágico gasta 1 de mana por segundo atacando; girar a rodinha do mouse ou apertar 1–4 troca entre 4 armas; apertar a rodinha continua defendendo. Correção dele: «esses botões não é pra aparecer … é intrínseco».
- `tools/lote541.js` (novo, `window.Lote541`): o lote são até 4 armas reais do jogador (a equipada + as da bolsa, na ordem em que entraram; `run.lote541` guarda os uid). Rodinha (no canvas, só jogando, sem janela aberta) e 1–4 trocam a arma na mão sem passar pelo bloqueio de estilo: arma mágica põe o básico arcano, física o físico. O nome da arma sobe por um instante sobre o personagem; nenhuma barra na tela.
- Mana: ataque básico mágico gasta 1 de mana a cada segundo atacando e a mana não regenera enquanto ataca (poção vale). Sem mana o ataque mágico não sai («SEM MANA»); arma física continua atacando.
- Teclas: Arma 1–4 do lote = 1–4 (configuráveis). Poderes absorvidos passaram de 1–3 para 8, 9 e 0; Poder fundido de 4 para − (a tecla 7 já era a moeda brilhante). Textos ligados atualizados: Biblioteca de Poderes (620) e aviso da fusão (540).
- `tools/skyrim-overhaul538.js` (v539, outra IA): tirada a barra de botões no rodapé (aparecia até na tela inicial), a rodinha e 1–4 dela (trocavam só o nome/modelo de armas fixas) e o dreno de mana dela (usava `player.mana`, que não existe). Observação: esse módulo usa `window.profile/run/player`, que são `let` e não existem em `window`; por isso quase nada dele roda (nem o «sem classe forçado»). V (1ª pessoa) ainda conflita com montar, H (luz) com poção, K (árvore) com coleção de ecos — não mexido, fica para os próximos itens.
- Teste: navegador local (cópia própria, porta 8784): lote de 4 armas, 1–4 e rodinha para baixo/cima, mana 20→15 em 5 s atacando com cajado sem regenerar e voltando a subir parado, cajado bloqueado com 0 de mana, espada ataca com 0 de mana, modelo na mão igual ao equipar pela bolsa. Sem erro novo de JavaScript.

## v540 (22/10/2026) — Conversa estilo Skyrim e HUD de exploração novo
- Pedido de Ian: o print do Skyrim (Jiub) com «é isso que quero mas com a cara de Primeva»; proposta aprovada («gostei»): https://claude.ai/artifact/Q4oeAzqbJ1KcHt2U16ktfR
- `tools/conversa539.js` (novo, `window.Conversa539`): F num vendedor de Aster (Lyra, Mira, Kael, Brann, Dorian, Selene) abre primeiro a conversa. A câmera fica de perto, um pouco de lado, e o jogador some da cena. O nome, a função e os corações de afinidade ficam à esquerda de uma linha; à direita, perguntas com marcas (◆ missão, ● assunto novo, ♥ presente, ⌂ bloqueado); a fala sai embaixo e o Narrador comenta no alto. As opções vêm do jogo: «Como estão as coisas?» (`NPCTALK`, com {nome} preenchido), missão pessoal (`NPCQ`; concluir usa a ação `npcdone`; bloqueada até 3 corações), loja (chama o `openShop` anterior, então tutorial/campanha/Intro401 seguem iguais), presente (ação `gift`, preço real) e «Até mais». Se o objetivo na tela cita o NPC, aparece «Sobre a missão», que leva direto ao fluxo da história. Sem conversa no tutorial (`classless`, `orderPending401`, `creationPending91`), com janela aberta ou fora do mundo. Teclas: ↑ ↓, E/Enter, Esc.
- `tools/explorar539.js` (novo, `window.Explorar539`): o painel de barras do canto (`#stat`) fica invisível e entra o cristal de rank (letra e cor do rank) com vida, mana (ou o recurso da classe) e estamina (`martialState260().vigor`) em arcos. Do lado ficam os números, o escudo (quando houver) e o ouro. A XP vira uma linha fina embaixo. Bússola em cima (N/L/S/O pela câmera, marcas de Aster, cidade mais próxima e portal). Ao entrar numa cidade aparece no canto esquerdo «Local registrado na Ordem» (primeira vez, salvo em `profile.found539`) ou «Entrando em». O cristal fica apagado quando está tudo cheio.
- Teste: Edge headless (CDP) com o jogo real: conversa com Kael (fala com nome, pergunta feita fica apagada, presente 500→478 ouro e afinidade sobe, Esc fecha e devolve câmera, pausa e jogador, «Quero ver o que você vende» abre a loja), abrir outra loja com a conversa aberta fecha a conversa, HUD com vida baixa e aviso de Aster, celular 390 px. Sem pageerror.
- Não feito: conversa para NPCs de outras cidades/moradores (usam o fluxo antigo); `Intro401.dialog` da história mantém o visual antigo.

## v538 (22/10/2026) — Mercado, banco e coleta voltam ao visual aprovado
- Correção de Ian: «eu marquei errado, era só o HUD que não ficou com minha cara» / «o mercado, o banco e a coleta que tu tinha feito estavam perfeitos». A v536 tinha trocado o visual aprovado por outro (bordas da Fenda, cantos chanfrados).
- `tools/telas535.js`: só CSS, luzes e escolha do modelo. Volta ao visual da proposta aprovada (https://claude.ai/artifact/KayJAsWizQBUJCcec3Ycga): faixa preta translúcida sobre o jogo desfocado, linha branca fina, letra fina em maiúsculas (Jost), seleção clara, preço e ouro em dourado, cartão do item centralizado embaixo do 3D. Núcleos e cristais do Mercado usam o modelo do `Loot513` na cor do rank. Celular em coluna (3D, cartão, lista). Regras, botões e modelos próprios de Couro/Presa seguem iguais.
- Teste: Edge headless com o jogo real (Kael, Mercado, Banco com depósito 12.480→12.380, Saque com pegar 3→4, fechar volta ao normal, celular 390 px).
- Pendente: HUD de exploração (nome do lugar/«Descoberto», barras de vida etc.) — Ian não gostou dessa parte; precisa de proposta nova com a cara dele.

## v537 — habilidades de Arqueiro, Paladino e Invocador — 21/10/2026
Mais 27 ativas com peças da demo aprovada, movimento próprio e efeito ligado a alvo/projétil/aliado/zona reais. Completadas as 30 dessas classes e as 100 ativas das dez classes já migradas por inteiro. A Matilha respeita as vagas reais e só separa desenhos sobrepostos; Sentinela preserva AI imóvel e tiros, com forma cristalina animada. Carga da Flecha Perfurante preservada nos três níveis. Dano, cura, recursos, alcance, recargas e colisão mantidos nos controles normal/leve. Autorização de publicação automática já dada por Ian. Entrega: https://drive.google.com/drive/folders/1SPQToYdxn6GLTOITmziOjVefjm-EkQ9L
Pendentes: demais habilidades de Monge, Lâmina Arcana, Lanceiro e Berserker; básicos e habilidades das classes raras.

A integração v537 preserva v510–v536 de mundo/telas. Corrigida a chamada EH da câmara da estátua: EnvBatch verdadeiro e resultado anexado ao cenário, sem mudar recompensas ou colisões.

Validação final: 108 controles pelo lançamento real, 26 de borda e 36 de regressão sem erro JavaScript capturado. A medição por software na cena atual ficou em 18–22 fps normal e 26–27,5 leve, com a apresentação antiga em 21,6–26,6 e 25,7–27; não comprova fluidez no aparelho de Ian. Testes e limitações completos no Drive.

## v536 (21/10/2026) — Mercado, lojas, banco e coleta com a cara do Primeva
- Pedido de Ian (proposta aprovada com ajustes: «arruma e coloca no jogo»; escolheu levar mercado, banco e coleta; HUD fica para uma proposta nova): janelas largas com o jogo desfocado atrás, item girando em 3D num pedestal de cristal na cor do rank, título em Russo One com brilho, linha da Fenda animada (violeta→verde-água→dourado), linhas e botões com cantos chanfrados. Ian disse que a versão anterior estava «igual Skyrim»; esta usa as fontes, as cores de rank e a energia da Fenda do jogo.
- `tools/telas535.js` (novo, `window.Telas535`): envolve `openModal`/`closeModal` e só muda a forma de Mercado de Recursos (Dorian), lojas do Kael/Brann/Mira (`SHOPS`, inclusive estoque `kael405-item`), Banco e Saque. Regras, preços e botões são os mesmos (cliques seguem pelo `#mb` original). Modelos: armas/armadura/baú do próprio jogo (`models/armas155`, `equipment431/aco-r3`, `m437/bau`); núcleo/cristal usam `Loot513.model` (o painel antigo do loot513 é removido na janela nova); peças de monstro ganharam modelo próprio feito em código — Presa, Couro, Osso, Garra, Escama, Gel, Pena, Chifre, Olho, Coração, Essência, Poção, Pergaminho (antes couro e presa caíam no baú).
- Teste: Edge headless (CDP) com o jogo real: Kael (Espada de Ferro em 3D, preço 346), Mercado, Banco (depositar 100: ouro 12.480→12.380, banco +100) e Saque (Núcleo, Presa e Couro com modelos diferentes; Pegar soma o núcleo 3→4); fechar e abrir outra janela volta ao visual normal; celular 390 px. Erro `b.add is not a function` em `EH` (cenário) já existia na base.
- Fora desta versão: HUD (Ian pediu algo com a cara dele, não Skyrim); Ordem/guilda e demais janelas seguem como estavam.

## v535 (21/10/2026) — Revisão do relevo, parte 2: encostas lisas, clima por região, acampamento sem primitivas, legenda, árvore perto da câmera
- Pedido de Ian: corrigir os itens 6 a 11 da análise do relevo e do mapa.
- Facetas (6): o chão passa a inclinação lisa do relevo (`vNy534`, calculada no vértice por `terrH245`) para a rocha de encosta (`environment128`) e para a textura vista de cima (`biome-materials132`); antes cada triângulo tinha a sua inclinação e apareciam remendos.
- Clima (7): `tools/mapa500.js` puxa o bioma para o clima da região — norte frio, sul quente (mais fraco), leste um pouco mais seco. Não há mais manchas de neve no meio do mapa.
- Acampamento de clã (8, `tools/living372.js`): barraca, fogueira e totem são modelos do env.glb (`tent_detailedOpen`, `campfire_stones`, `post_skull`); o fogo é um brilho suave. Antes eram pirâmide, cones e dodecaedros.
- Vila nível 0 (9): falso alarme — a vila existe inteira; no print da análise a câmera olhava para o outro lado.
- Triângulos pretos (10): eram tronco/copa de árvore quando a câmera passava por dentro. Agora todo cenário instanciado (árvore, pedra) e as árvores pintadas somem em pontilhado a menos de ~2,6 m da câmera (`terrain245`, `biome-materials132`).
- Legenda (11, `tools/map393.js`): compacta em 2 colunas no canto de cima (gelo/mar); não tampa mais nenhuma vila.
- Teste: navegador local (cópia própria, porta 8784) com prints do oeste sem neve, vila de pé, árvore perto da câmera, acampamento e mapa. Sem erro novo.

## v534 (21/10/2026) — Crianças: ciclo de andar e correr sem salto
- Pedido de Ian: corrigir o possível salto quando o ciclo de andar/correr reinicia.
- `tools/vida527.js`: os trechos antigos (andar 91 a 119, correr 74 a 90) incluíam o começo e o fim do movimento original (parado e braço da lanterna), por isso davam salto. Medi a diferença de pose no GLB e conferi as poses no Blender: andar agora usa os quadros 90 a 111 (o 112 repete o 91) e correr os quadros 73 a 83 (o 84 repete o 73).
- Teste: poses vistas no Blender; o ciclo em si não foi visto rodando no jogo.

## v532 (21/10/2026) — Tela simples: conversa não tapa nada
- Pedido de Ian: muita coisa na tela; conversas ficavam em cima dos botões de habilidade; «as coisas não podem tapar umas às outras».
- `tools/dialogo520.js`: durante a conversa somem botões de habilidade, aviso «F», minimapa, lista de missão e menu (classe `dlg520` no body). A caixa de texto do canto inferior direito (`#obj`: região, missão, portal) fica sempre escondida.
- Teste: estilos conferidos no navegador (todos `display:none` com a conversa aberta); a captura de tela do painel escondido não atualizou, então o visual final não foi visto.

## v533 (21/10/2026) — Revisão do relevo: serras visíveis de longe, passagens largas, paredes limpas, portais espaçados
- Pedido de Ian: análise completa do relevo e do mapa; corrigir os 5 problemas mais graves.
- Vista longe: `tools/terrain245.js` deixa a neblina do chão bem mais fraca (fator .02 no FOG_EXP2, só no chão), e `tools/capitais504.js` põe o plano de corte da câmera em 1.300 m em todo o mundo aberto (antes 260 m, ou 950 m só perto de Capital). As serras e o chão distante (1,1 km) aparecem no horizonte. Custo medido: 8,8 → 9,3 ms por quadro.
- Passagens: as passagens das 4 serras viraram cápsulas ao longo da estrada (vale largo, não um corredor). A estrada achata para as colinas grandes (`hl529`) e não mais para y = 0, então não cava vala nos morros. Também vale perto da cidade (mistura com a altura do disco).
- Paredes: a cor de estrada desliga em encosta (vértice do chão); a textura vista de cima (`biome-materials132`) não estica mais em parede (antes virava mancha marrom); a rocha de encosta (`environment128`) ganhou blocos menores e menos faixas (antes parecia curva de nível); sem grama (`grass446`) nem planta/flor/arbusto (`mundo513`, EH/EW) em encosta íngreme. A inclinação é medida com o relevo ligado (`Mundo513.steep`), porque o cenário às vezes é montado antes de o relevo ligar.
- Portais: nascem a pelo menos 90 m um do outro (antes 30 m, em montes de 6 a 11). No mapa-múndi, portais próximos viram um ícone só com o número.
- Teste: navegador local (cópia própria `%TEMP%\prim-diretor`, porta 8784), prints da passagem norte (vale aberto com montanhas ao fundo), leste, desfiladeiro do marco zero (paredes sem grama) e mapa com portais agrupados. Sem erro novo.
- Pendente (da análise): facetas grandes no relevo das serras, neve no meio do mapa (falta clima por região), tenda de clã em pirâmide (`living372`), vila nível 0 que parece sumida, triângulos pretos no chão, legenda do mapa tampando "Ardent".

## v531 (21/10/2026) — Arca no chão plano, guardiões que não fogem, mais falas
- Pedido de Ian: «o baú tá voando, não tem monstros pra lutar, tudo tem que ser arrumado, tem que ter mais fala».
- `tools/quests480.js`: a arca escolhe o chão mais plano num raio de 18 m do objetivo (o ponto do objetivo se move junto, minimapa inclui); guardiões e chefe que passam de 16 m do objetivo voltam para perto (os Cogus fugiam e sumiam, dando «N restantes» sem ninguém à vista).
- `tools/dialogo520.js`: 8 aberturas, 6 despedidas e 10 notícias sorteadas; nova opção «Perguntar sobre as redondezas».
- Teste no navegador: missão do Vael aceita, arca em chão plano (inclinação 0,1–0,3), 4 guardiões em volta, chefe jogado a 60 m voltou para 12 m, arca abre e conclui depois de matar os guardiões; diálogo só com letras.
- Pendente: falas próprias por personagem (hoje só a primeira fala de cada um e as 17 pitches são específicas).

## v532 (21/10/2026) — Crianças: olhos e cores com borda nítida
- Pedido de Ian («cuida disso», sobre os pontos que ficaram imperfeitos na criança nova).
- `tools/vida527.js`: cor agora por triângulo (camisa, bermuda, pele, cabelo e sapatos com borda nítida, sem a transição borrada) e dois olhos pretos presos no osso da cabeça (z 0,135, a superfície do rosto fica em 0,147).
- Teste: Node com THREE simulado (olhos criados, cor uniforme por triângulo). Não visto no jogo. Não mexi nos trechos de andar e correr (possível salto no reinício do ciclo).

## v530 (21/10/2026) — Diálogo só com letras, Vael fala em 1ª pessoa, aviso da arca
- Pedido de Ian (áudios + prints): o painel do diálogo tapava a tela, quer só as letras como no Skyrim; Vael falava de si na 3ª pessoa; a arca «faz uma luzinha e não aparece nada».
- `tools/dialogo520.js`: sem fundo escuro, sem caixas e sem bordas (letras com contorno preto); escolha marcada fica dourada. Novo `FALA520`: fala em 1ª pessoa para as 17 missões de encontro (a descrição do diário continua em 3ª pessoa).
- `tools/quests480.js`: abrir a arca com guardiões vivos agora mostra na tela «DERROTE OS GUARDIÕES ANTES (N)» (antes só um anel vermelho e um aviso pequeno).
- Teste: só sintaxe (node --check) e build; não abri no navegador.

## v529 (21/10/2026) — Constelações viram um céu estilo Skyrim
- Pedido de Ian (aprovado no protótipo: «Ficou bom. Pode levar essa tela de constelações para o jogo»): a lista de Constelações com ★ vira um céu em 3D, visto do chão de Aster, como no Skyrim. Figuras e frases tiradas do Livro Oficial (Ed. 05) e do Manuscrito Completo.
- `tools/constel523.js` (novo, `window.Cons523`): substitui `consView()`. As 6 constelações reais de `CONS` com figura própria — Fúria = O Dragão Rubro, Arcano = O Olho da Fenda, Caçador = A Arraia do Vazio, Vento = O Lobo de Mana, Sangue = O Cálice Partido, Sombra = A Mão do Arquiteto — e A Estrela (rank secreto, só aparece bloqueada). Cada uma tem 10 estrelas + Ápice; acende em ordem, 1 ponto de `run.cpts` por estrela, o Ápice acende sozinho no 10 (regra do jogo mantida). Painel mostra o texto de `CONS` e um exemplo em números inteiros. Nexo de Aster aparece como estrela azul acima da serra. Botão de converter pontos aparece quando tudo está cheio (usa `consconv`). Pausa o jogo enquanto aberto; Esc volta ao céu e fecha.
- Partes ligadas: `610` — o botão +1 antigo fazia `run.cons[v]++` em valor vazio (NaN), então o primeiro ponto gasto numa constelação sumia; agora soma de verdade. Efeitos, custo e ganho de pontos não mudaram.
- Teste: Edge headless (CDP) com o jogo real: +1 antigo soma (arc 1, pontos 5→4); tela abre e pausa; entra em Fúria; Enter acende a estrela 1 (pontos 4→3); Ápice com 10; Esc fecha e despausa; celular 390 px sem rolagem lateral. Erro `b.add is not a function` em `EH` (cenário, já na base v528) aparece no carregamento, sem ligação com esta mudança.
- Frases de lore das constelações são do Claude a partir do livro/manuscrito, não cânone fixo.

## v528 (21/10/2026) — Garganta com pinheiros nas cristas e rocha facetada
- Pedido de Ian: «faz» para os pendentes da v522 (rocha com padrão de camuflagem; pinheiros gigantes, névoa e tochas não apareciam; pontes/ruínas; cidades maiores).
- `tools/desfiladeiro510.js`: as peças seguem a curva da garganta (centro `gc510`, igual a `terrain245.js` e `mundo513.js`); pinheiros de 18 a 24 m nas cristas até z 520 (antes só até 236 e fora da curva); névoa rasteira até z 520; fogo das tochas na altura do chão (antes y fixo 1,8, enterrado em morro); rochedos pequenos escuros removidos (os paredões são relevo).
- `tools/environment128.js` + `src/core/200-bloco-environment128.js`: rocha com facetas angulares (distorção pequena e rápida) no lugar do padrão ondulado.
- Teste: Edge sem tela; portão, trecho a 150–230 m e vista alta olhados: pinheiros e rocha aparecem. Tochas e névoa continuam sem aparecer nas capturas (não confirmados). Pontes: a v513 já adaptou o cruzamento (não visto). Cidades maiores: não feito (mexe em muralha, colisão, povo e lojas).

## v531 (21/10/2026) — Crianças com modelo de criança de verdade (Low Poly Kid, CC BY 4.0)
- Pedido de Ian: as crianças da v527 eram o boneco de adulto reduzido a 60%; ele quis modelo grátis de criança, no estilo do jogo (sem blocos geométricos), e pediu o crédito.
- `models/criancas527/crianca.glb` (novo, 600 KB): «Low Poly Kid» de **malekith97 (Nitin Chowdary)**, OpenGameArt, **CC BY 4.0** (https://opengameart.org/content/lowpolykid). Convertido do .blend no Blender 5.2 (rig Rigify, animação assada nos ossos de deformação). Crédito em `models/criancas527/LICENSE-LowPolyKid.md` e no jogo (menu da criança: «Ver o crédito do modelo desta criança»).
- `tools/vida527.js`: a criança agora é o GLB, escala 0,55, com cores por altura do corpo (cabelo, pele, camisa, bermuda, sapatos; 4 tons de pele, 4 de cabelo, 5 de camisa e 4 de bermuda sorteados), e animação por velocidade: parado (quadros 1 a 68), andando (91 a 119) e correndo (74 a 90) do clipe original, sem os clipes com lanterna. Um boneco de chibi escondido continua só para o motor de NPCs andar; o modelo acompanha ele (`n.kid527`). À noite some com a criança que dorme.
- Teste: modelo visto no Blender (poses de andar e correr e as cores por região); lógica no Node com THREE simulado (2 crianças, troca de clipe, some quando dorme). Não visto no navegador do jogo. Trechos dos clipes (andar 91 a 119, correr 74 a 90) foram escolhidos por contato visual e podem ter um pequeno salto no ciclo.
- Pendente: as cores ficam com transição suave nas bordas (cor por vértice); o rosto não tem olhos.

## v527 (21/10/2026) — Mundo vivo, parte 3: crianças, brigas e notícias que mudam
- Pedido de Ian («faz ai», depois da lista de pendências da v523).
- `tools/vida527.js` (novo): 2 crianças por cidade de dia, correm entre pontos da praça e falam frases soltas; à noite vão dormir (somem). Brigas: no máximo uma a cada 150 s, de dia, a menos de 60 m do jogador, dois moradores discutem no meio da rua por 25 s; depois de 10 s o guarda mais próximo vai até lá e separa.
- `tools/dialogo520.js`: menu da briga (separar = +3 de reputação, tomar o partido de um muda o afeto dos dois, ou deixar). Crianças não têm «pedir agrado» nem «provocar». Notícias dos NPCs mudam com a fama do jogador (`profile.fama523`: bondade = esmolas e briga separada, maldade = ameaçar, expulsar e provocar, ladrões = ladrão pego), com multa pendente e com contratos concluídos; 65% das vezes que há algo a comentar. `tools/vida523.js`: moradores em briga vão ao ponto da discussão; ladrão pego conta na fama.
- Ao subir, as v524 a v526 de outra sessão já estavam na main (HUD de diálogo estilo Skyrim, arca do covil, marcos do mundo); reaplicado por cima, sem mexer no que elas fizeram.
- Teste: só simulação em Node (2 crianças, 3 moradores, briga começa, guarda vai e separa, crianças dormem à noite, fama gravada). O menu da briga no HUD novo e o jogo no navegador não foram testados.
- Pendente (mundo vivo): modelo Povo482 nos moradores, andar sentado e deitado, NPCs que mudam de cidade, comércio entre moradores.

## v526 (21/10/2026) — Marcos do mundo: Acampamentos com carroças, Ruínas de Mármore e Estátua Gigantesca da Colina
- Pedido de Ian: "Coloca no jogo acampamentos que a gente precisa, pedras de mármore que vão fazer construções jogadas. Sabe aquela estátua gigantesca que tem lá no topo de uma colina que tem coisas dentro? Eu quero também no jogo."
- Implementação:
  1) Acampamentos de Estrada aprimorados (`tools/encontros502.js`):
     - Acampamentos agora contam com carroças de mantimentos rústicas (`cart`), paliçadas perimetrais (`wall`), caixotes, barris e fogueiras de acampamento rústicas, sem primitivas vazias.
  2) Ruínas de Mármore (`tools/encontros502.js`):
     - Novo tipo de encontro `marble_ruin` distribuído pelo mundo aberto com densidade e semente determinística.
     - Colunatas imperiais e capitéis tombados no solo em ângulos naturais (`statue_column`, `statue_columnDamaged`, `column`, `d_pillar`, `pillar_decorated`), blocos esculpidos (`statue_block`, `statue_head`) e entulho de mármore marfim antigo (0xf6f2e8).
     - Baú Relicário de Mármore central com tesouro dobrado e itens raros.
  3) A Estátua Gigantesca na Colina (`tools/marcos526.js`):
     - Monumento de 30 metros de altura erguido no topo da colina sudeste de Aster (x = 210, z = 360).
     - Malha de colosso ancestral de pedra (m_colosso.glb) emoldurada por contrafortes de rocha natural (tripo-rocha-musgo154).
     - Câmara oca esculpida na base da estátua acessível por portal frontal em arco.
     - No interior da câmara: tochas e lanternas com luz suave, Altar do Titã e Baú Relicário Dourado interativo (F) entregando ouro e o Coração Rúnico do Titã.

## v525 (21/10/2026) — Correção do covil secreto / arca das rochas altas e encontros emergentes
- Pedido de Ian (print e mensagem): "to aqui mas não aparece oq fazer nem nada" (no local do contrato "Covil Secreto: A Arca das Rochas Altas").
- Diagnóstico:
  1) `EMERGENT_DEFS` não era registrado em `QUEST_CATALOG` na inicialização do script, tornando `QUEST_CATALOG[qid]` nulo após recarregar a página e travando o tick da missão.
  2) Não existia objeto físico 3D nem item de interação `[F]` para a Arca ou tesouros em missões de covil/baú.
  3) O check `!act.spawned && dist < 45` só rodava uma vez e gravava no localStorage; se o jogador recarregava ou chegava no local, não havia entidades vivas na cena e nada acontecia.
  4) O HUD apenas mostrava "Distância: 1m", sem indicar o que fazer.
- Correções aplicadas:
  - `tools/quests480.js`:
    - Registro de todas as 17 missões de `EMERGENT_DEFS` no `QUEST_CATALOG` no carregamento.
    - Criação de `QUEST_OBJECTS` com geração de malhas 3D (arcas com aura, monólitos rúnicos, fardos de carga, altares e sarcófagos) e itens em `L.inter`.
    - Spawning reativo (< 55m): se a cena atual não tiver os guardiões nem a arca ativos, spawna imediatamente (inclusive se o jogador já estiver parado a 1m do local).
    - Inimigos recebem `breaker: true` e `wild: true` para não serem repelidos por cidades ou limites de chunk.
    - Se o jogador tentar abrir a Arca antes de matar as feras, o jogo avisa com anel vermelho e som de impacto.
    - Ao eliminar todas as feras, aviso com bigText e toast para abrir a Arca com [F].
    - Abrir a Arca entrega ouro, XP, partículas e conclui o contrato.
    - `getHudTrackText()` dinâmico: indica "⚔ Derrote os guardiões (N restantes)" ou "★ Interaja com: Arca [F]!".
  - `src/core/410-overlay-e-hud.js`:
    - Marcador 3D flutuante no mundo exibe o objetivo atualizado conforme a proximidade e o combate.
  - `sw.js`:
    - Cache atualizado para `pds-v525`.

## v524 (21/10/2026) — HUD de diálogo Skyrim, correção de banco/lojas e missões no minimapa/mapa
- Pedido de Ian (áudios e print):
  1) "O HUD de falar ali tem que mudar, tem que ser que nem no Skyrim, que tem as escolhas ali, não assim como tá agora."
  2) "Banco tem ver mercadorias e eu não consigo entrar, tá tudo no diálogo... tá errado isso aqui, não é assim que funciona o banco e as coisas, tem que ser arrumado."
  3) "Vou no mercado, aperto em ver mercadorias e sai da loja. Não consigo ver. Mesma coisa com o ferreiro."
  4) "Às vezes eu pego uma missão com NPC e ela não aparece no mapa."
- `tools/dialogo520.js`:
  - HUD de diálogo próprio no estilo Skyrim (`#skyrim-dialog`): legendas com nome e fala do NPC centralizadas na parte inferior em card translúcido escuro com borda dourada suave; menu vertical de escolhas à direita com atalhos numéricos [1-9], diamante ◆ e suporte a teclado (números 1-9, F/Enter/Espaço para escolher a primeira, ESC para sair).
  - Correção de lojas e banco: abrir uma loja ou banco fecha o HUD de diálogo e abre a janela do serviço SEM chamar `closeModal()` indevido (antes fechava instantaneamente a janela que o NPC acabava de abrir).
  - Diálogos especializados e imersivos para cada comerciante:
    - Selene (Banco): opção 1 é "Acessar o Banco (Depositar e Sacar)", além de dúvidas sobre o banco, notícias e saída.
    - Kael (Ferreiro): opção 1 é "Quero ver suas armas e equipamentos", além de dicas de aprimoramento.
    - Dorian (Mercado): opção 1 é "Quero negociar recursos do mercado".
    - Mira (Poções): opção 1 é "Quero comprar poções e pergaminhos".
    - Brann (Defesa da Vila): opção 1 é "Quero ver armaduras e defesas da vila".
    - Lyra (Ordem): opção 1 é "Ver missões e serviços da Ordem".
- `tools/quests480.js`:
  - Minimapa circular do HUD: quando o objetivo da missão fica além do raio do minimapa (>40m, como os 142m do encontro do Zephyr), o marcador é clampado na borda do minimapa como uma seta de bússola estilo Skyrim, com diamante dourado e a distância exata em metros (ex.: "142m"). Quando o jogador entra no raio, o marcador vira um diamante verde pulsante sobre o local exato.
  - Mapa-múndi grande (tecla M / `mapa501.js`): desenha todas as missões ativas com halo brilhante, diamante de destaque e plaqueta escura com o título da missão e distância em metros.
- `src/core/410-overlay-e-hud.js`:
  - Marcador 3D no mundo: desenha o diamante dourado flutuante `◆ [MISSÃO] Titulo · N metros` projetado no horizonte sobre o local do objetivo quando no campo de visão.
  - HUD (caixa amarela do minimapa `obj`): adiciona linha com a missão rastreada e distância, garantindo que o objetivo seja visível mesmo se o painel de objetivos for fechado.
- `src/core/620-janelas.js`:
  - Janela do Mapa (tecla M): adiciona a seção "MISSÕES E CONTRATOS ATIVOS" listando cada contrato com título, distância e botão de acompanhar/localizar.
- Teste: simulação em Node (Selene abre banco sem fechar modal, Kael abre equipamentos, Dorian abre mercado, Zephyr aceita missão e registra coordenadas; clamp do minimapa desenha seta na borda e badge de distância 142m; mapa grande desenha plaqueta com título; verificação de integridade das partes e build.py ok).

## v523 (21/10/2026) — Mundo vivo, parte 2: rotina dos moradores, guardas, bêbados e ladrões
- Pedido de Ian: rotina dos moradores (trabalhar, comer, dormir em casa) e ladrões, bêbados e guardas.
- `tools/vida523.js` (novo): cada cidade de pé ganha 3 moradores e 2 guardas. Rotina pelo relógio do jogo: 0 a 5% sai de casa, 5 a 30% trabalha perto da barraca do mercado (o varredor circula na praça), 30 a 38% almoça na pousada, 38 a 50% trabalha, 50 a 67% taverna na pousada (1 em 3 vira bêbado), noite volta para casa e dorme (some dentro da casa, vira kind `deco`, e reaparece de manhã). Guardas patrulham um círculo de 14 m. À noite (ou depois de 55% do dia), com o jogador a menos de 45 m da cidade, no máximo uma vez a cada 90 s e com 1 chance em 4, aparece um Vulto Encapuzado que corre até o jogador e rouba 10% do ouro (de 10 a 150, só com 20 ou mais de ouro) e foge: se um guarda estiver a 35 m ele persegue e devolve o ouro; se o jogador alcançar e apertar F, recupera o ouro e ganha 3 de reputação; senão o ladrão escapa.
- `tools/dialogo520.js`: `Dialogo520.vida`. Morador: menu da cidade (v521) e a opção principal diz o que ele está fazendo. Guarda: perguntar de ladrões e da cidade, provocar (multa e -10 de reputação), pagar a multa de 50 ou subornar por 100 (-10 de reputação). Bêbado: pagar bebida (5 ouro, afeto), ajudar a ir para casa (2 de reputação) ou provocar (multa). Multa em `profile.multa523`; guarda a menos de 6 m cobra a cada 30 s.
- Teste: só simulação em Node (3 moradores e 2 guardas, trabalho, taverna, sono, roubo, guarda devolve ouro, bêbado, multa, pagar). Não testado no navegador (o painel recusou localhost). Riscos: o caminho até a casa e a pousada usa posições aproximadas (anel de 24 m); morador pode ficar preso em prédio; moradores novos somam aos antigos «citizen» (que continuam sumindo à noite).
- Pendente (mundo vivo): crianças, NPCs que brigam entre si, notícias que mudam com o que o jogador fez, modelo Povo482 nos moradores novos, andar sentado/deitado.

## v522 (21/10/2026) — Estrada Sul sinuosa, trilha de terra e rocha nas encostas
- Pedido de Ian: a estrada de Aster parecia reta e de pedra larga; no Skyrim é uma trilha de terra estreita que serpenteia, com paredões de rocha. Aprovado por Ian nas capturas do clone de teste.
- `tools/mundo513.js`: a rota Aster→sul sai reta do portão (z até 88) e serpenteia até z 520 (meandros de até 136 m para o lado, pontos de controle tirados da curva `gc510`).
- `tools/terrain245.js`: garganta do Marco Zero acompanha a curva (centro `gc510` = mesma conta do `mundo513.js`, mude os dois juntos); paredões abrem e fecham (trechos estreitos e vales abertos); z de 78 a 560. GLSL e CPU iguais.
- `tools/environment128.js` + `src/core/200-bloco-environment128.js` (sombreador do chão): estrada fora das cidades deixa de ser calçada de pedra e vira trilha de terra de 3 a 4 m, desenhada pelo segmento real (`uTerR`, só nos 24 segmentos mais próximos do jogador); encostas íngremes ganham rocha em camadas, com a inclinação tirada da posição na tela (`vViewPosition`). `environment-bridge128.js`/núcleo: só as praças das cidades continuam como pedra. `tools/grass446.js`: sem grama só a 2,6 m do eixo.
- Teste: Edge sem tela (Playwright) num clone; capturas olhadas ao longo do trecho. Rocha em vista alta tem padrão ondulado; sem pinheiros gigantes nem névoa de vale; pontes e ruínas perto de estrada fora do trecho sem teste.
- Combinado com a v513/v514 de outra sessão: o `roadSegs/onRoad` dessa sessão vale (a minha versão em `250-mundo-infinito.js` foi descartada).

## v522 (21/10/2026) — Mundo vivo, parte 1: mendigos nas cidades
- Pedido de Ian: «um mundo totalmente vivo e independente, mendigos e tal». Esta é a primeira parte; o resto da lista abaixo ainda não foi feito.
- `tools/vida522.js` (novo): cada cidade de pé ganha 1 mendigo (2 se o nível da cidade for 3 ou mais), com nome, roupa rasgada e vida própria: de dia fica no pátio, à noite perto da pousada, e troca de ponto sozinho quando o jogador está a mais de 40 m. Some se o jogador passa de 220 m.
- `tools/dialogo520.js`: menu do mendigo — dar 1, 10 ou 50 de ouro (afeto; 50 dá 5 de reputação da Ordem), perguntar o passado, expulsar (-15 de reputação, ele foge). Com afeto 3 ele entrega 150 de ouro escondidos (ou você recusa e ganha 10 de reputação). Memória em `profile.dialogo520["cidade:Nome"]`.
- Teste: só simulação em Node (spawn de 2 mendigos, esmola, afeto, presente, troca de ponto e sumiço). Não testado no navegador. Mendigo é parado no ponto (sem andar e sem sentar); não aparece à noite no modelo Povo482.
- Pendente (mundo vivo): rotina de trabalho dos moradores (comércio, dormir em casa), ladrões que roubam o jogador, bêbados na pousada, crianças, guardas de patrulha, NPCs que brigam entre si, notícias que mudam com o que o jogador fez.

## v521 (21/10/2026) — Diálogo com escolhas nos NPCs de cidade e vilas
- Pedido de Ian: levar o diálogo com escolhas para os NPCs de cidade e vilas.
- `tools/dialogo520.js`: vendedores e caçadores (kind `vendor` e `hunter`, inclusive Povo482) ganham menu ao apertar F: ver mercadorias / ouvir o NPC (abre o que já existia), perguntar da cidade, elogiar (afeto de 0 a 5), pedir um agrado (só com afeto 3: 100 de ouro uma vez, depois 25) e provocar (-10 de reputação; ele recusa loja e conversa até você pedir desculpas por 100 de ouro). Memória em `profile.dialogo520["cidade:Nome"]`. O módulo troca o `use` dos NPCs a cada 1,5 s; o que o NPC já fazia (loja, fala de caçador, passos da campanha) continua pela primeira opção.
- Teste: só simulação em Node (vendedor: elogio, agrado cedo, provocar, recusa, desculpas, loja abre). Não testado no navegador. Pendente: falas próprias por NPC; consequência no mundo.

## v520 (21/10/2026) — Diálogo com escolhas e consequências (como Skyrim)
- Pedido de Ian (áudio): as respostas do diálogo com NPCs têm que levar a coisas, e o jogo muda conforme o que você faz.
- `tools/dialogo520.js` (novo): árvore de diálogo para todos os NPCs de encontro. Respostas: aceitar (pelo ouro ou de graça por honra, com o dobro de reputação e confiança), perguntar o que acontece (um lacaio a menos e 10% a mais de XP), pedir mais pagamento (+25%, só com 200 de reputação da Ordem), ameaçar (ele foge e deixa 10% do ouro, -20 de reputação, e passa a recusar falar até você pedir desculpas por 200 de ouro) e seguir viagem (ele lembra e fala «você voltou»). Depois de concluir a missão, agradece uma vez com ouro. A memória fica em `profile.dialogo520[tipo]`.
- `tools/quests480.js`: `openEmergentDialogue` chama `Dialogo520.open`; `acceptEmergent(tipo, over)` aceita ajustes de recompensa. `game.html`: script novo, `?v=520`; `sw.js` pds-v520.
- Teste: só simulação em Node (fluxo ameaçar → desculpas → perguntar → aceitar, ouro e flags certos). Não testado no navegador (o painel recusou abrir localhost). Falas são genéricas; falas próprias por NPC ainda não.
- Pendente: NPCs de cidade e vilas ainda sem esse diálogo; consequências no mundo (local muda se o NPC morrer).

## v519 (21/10/2026) — NPCs de encontro chamam o jogador como no Skyrim
- Pedido de Ian: os NPCs têm que chamar o jogador quando ele passa perto, como no Skyrim.
- `tools/quests480.js`: o NPC de encontro (Doran, Ignis, Zephyr etc.) guarda a fala (`speech`); quando o jogador chega entre 13 e 4 m, ele vira para o jogador, mostra a fala em balão (`speech153`) com um sinal sonoro e a dica «F para falar». Repete a cada 14 s, no máximo 4 vezes, e para quando o jogador fala com ele. O balão aparece só até 14 m (limite do `speech153`).
- Teste: navegador local, encontro «Doran, Mercador Ambulante» gerado, jogador a 10 m: balão com a fala e NPC virado para o jogador, sem erro novo. Contagem de chamadas passou de 1 em 3 s (provável quadro duplicado do teste), cap de 4 mantido.
- Pendente: NPCs de cidade e vilas ainda não chamam; só os de encontro. Bugs da v517 (rocha, Meteoro, mar, relógio).

## v518 (21/10/2026) — NPCs de encontro com modelo do Povo482
- Pedido de Ian (print do Ignis): o Ignis era um boneco de caixas, não um NPC de verdade.
- `tools/npc482.js`: NPCs `emergent_skyrim` (Ignis, Zephyr etc., criados em `quests480.js` com `makeChibi`) entram no Povo482 como civis (sexo pelo nome: lista, senão final «a» = f, senão m). Perto de 60 m viram o modelo rigado e animado; longe voltam ao boneco.
- Teste: navegador local, NPC de teste «Ignis» virou `povo482` (civil_artesa_f, antes do ajuste de sexo) sem erro novo. Ainda não: roupa/martelo de ferreiro próprios; Ignis ficou civil comum.
- Pendente: bugs da v517 (rocha, Meteoro, mar, relógio, NPCs que chamam como no Skyrim).

## v517 (21/10/2026) — Bola de Fogo grande e bichos/NPCs fora da água
- Pedido de Ian (áudios + prints): a Bola de Fogo saía igual ao ataque básico do mago de fogo e deveria ser 3 a 4 vezes maior; havia bichos e NPCs dentro da água.
- `src/core/380-acoes.js`: habilidade Bola de Fogo sai com escala 5,4 (era 1,8) e acerto `r` 1,3 para projéteis grandes. `tools/vfx328.js`: bola e explosão da pré-visualização acompanham (escala 5,4, explosão 3,2).
- `tools/agua517.js` (novo): a cada meio segundo, inimigo ou NPC não aquático dentro do mar, lago ou rio é levado à margem seca mais próxima (até 1600 m). Aquáticos (peixinho, homem-peixe etc.) ficam.
- Teste: navegador local, goblin no mar foi para a costa (-4055, 0), peixinho ficou; sem erro no console. Bola de Fogo não vista em jogo (só código); Meteoro continua pendente.
- Pendente: personagem entrando na rocha do bioma (print 2), NPC Ignis em formas geométricas, decisão de tirar o mar (rios e pontes), relógio/tempo bugado, NPCs que chamam o jogador como no Skyrim.

## v516 (21/10/2026) — Serras no mapa-múndi com cor de rocha do bioma
- Pedido de Ian: as serras da v514 apareciam brancas como neve no mapa em qualquer bioma.
- `tools/mapa501.js`: onde há serra (`TER245.ridge513`), o mapa pinta rocha do bioma (cinza no campo, musgo escuro na floresta, arenito no deserto, basalto no vulcão, lodo no pântano, rocha clara na neve, lilás no cristal) com sombra de relevo; cume nevado só no bioma de neve. A cordilheira de gelo do norte continua branca.
- Teste: navegador local, mapa aberto com as 4 serras visíveis em cores diferentes por bioma, sem erro novo.

## v515 (21/10/2026) — coleta em 3D, Mão só nos chefes e Edran
- Pedido e autorização de publicação: Ian neste chat («pode»). Comuns desaparecem deixando cristal de saque, sem Mão nem câmera do efeito. Mão limitada a chefes, incluindo agrupamento; partes físicas do Arquiteto excluídas. Cristal acessível durante a animação do chefe.
- `tools/loot513.js`: palco isolado girável para núcleo/cristal, material Crystal310 e cor do rank, geometria facetada assimétrica, arraste/teclado/botões, responsivo e descarte ao fechar. Outros itens mantêm lista; palco mostra recipiente de saque sem substituir sua identidade.
- Partes ligadas: `loot353`, `reclaim372`, Edran em `campaign327` (cristal/F/dez segundos/ouro automático), objetivo `intro401` e aviso de saque de rival. Recompensas, chances/quantidades de drops e bolsa preservadas. Mercado, constelações e estrada fora desta etapa.
- Integração: base v513 fa2064c preservada (elmo fora do cenário, silêncio do narrador). Nomes internos loot513 são identificadores do módulo, não número da versão pública.
- Validação: Edge headless desktop e viewport 390px, comuns/chefes/chefes agrupados, coleta única, expiração, registro restaurado, tutorial sem mão, rotação por botão/teclado, descarte e ausência de pageerror. Estado preparado por fixture; sem playtest humano nem medição de FPS. Sintaxe/montagem/partes verificadas; repetição sobre a base integrada antes do push.
- História de por que a projeção recolhe chefes segue proposta no Drive; não fixada como novo cânon por este código. Manuscrito antigo descreve comuns, pendente de reconciliação na próxima revisão narrativa.
- Fontes/prévia/evidência: https://drive.google.com/drive/folders/1rsU6mbhyfWBW3fCNzjqAaT725uGJ-sYj . Confirmar implantação após push.

## v514 (21/10/2026) — Mapa feito à mão como Skyrim: serras, passagens e estradas sinuosas
- Pedido de Ian: o mapa não pode ter grade nem estrada reta ("anda reto e chega no fim"); tem que ter as coisas bem colocadas, como Skyrim.
- `tools/terrain245.js` (CPU e GLSL iguais): `ridge513` = 4 serras feitas à mão (norte entre Aster e Ymiria, leste antes do deserto de Zahar, sul antes de Urdan, oeste antes de Thalor), com ~170 m e encosta íngreme (só passa escalando, com Estamina). Cada serra tem uma passagem (0,−2150 · 1820,0 · 0,2050 · −2400,0). O achatamento da estrada usa a distância real até o trecho (`sd513`), não mais uma caixa.
- `tools/mundo513.js` (novo, depois de `mapa500.js`): as 19 vilas ficam em lugares escolhidos (costa, beira de rio, pé da serra, oásis), não mais sorteadas na grade. 16 estradas curvas (Catmull-Rom, trechos de 40 m, 1.168 no total) ligam Aster às Capitais pelas passagens e as vilas entre si. `roadSegs`/`onRoad` foram trocados (distância real até o trecho). A estrada sul continua reta no desfiladeiro do marco zero (x = 0, z de 88 a 280).
- Partes ligadas: `580` (ponte sobre o rio agora acha o cruzamento de qualquer trecho, não só horizontal).
- Teste: navegador local, mapa-múndi com serras e estradas curvas, passagem norte vista do chão, encosta até 1,23 de inclinação (só escalando), marco zero na estrada, sem erro novo. Reaplicado por cima da v513.
- Pendente: no mapa-múndi as serras aparecem brancas como neve (a cor é pela altura), inclusive no deserto e na floresta; trechos de estrada em morro cortam uma vala (comportamento antigo).

## v513 (21/10/2026) — Elmo fora do cenário e narrador com menos falas
- Pedido de Ian: remover definitivamente a armadura do Metamorfo usada como pedra; impedir narrador junto do Arquiteto e reduzir comentários.
- Confirmado por render: `tripo-rochedo154.glb` é o elmo preto/vermelho do print. Removido do catálogo de cenário e LOD; moldura da carroça e desfiladeiro usam rocha com musgo. Armadura legítima em set153 preservada. Build rejeita reintrodução do nome errado nos scripts.
- Narrador: bloqueado no sonho, despertar, prólogo guiado e diálogos; limpar banner/fila ao começar sonho ou conversa. Removidos comentários sem evento; intervalos quiet/normal/chatty agora 300/240/120 segundos. Não muda falas do Arquiteto nem objetivos do prólogo.
- Revisão pelos cinco papéis do estúdio, sem criação de modelos. Montagem e sintaxe verificadas; navegador Edge: novo jogo, silêncio no prólogo, sem comentário ocioso, intervalo de 4 min, fala por evento e ocultação do banner passaram; nenhum pageerror. Ian autorizou a publicação nesta conversa ("pode").

## v512 (21/10/2026) — Teia de gatilhos do mundo aberto (Skyrim)
- Pedido (diretor/Ian): o que prende no Skyrim são os vários gatilhos de missão combinados; explorar sempre esbarra numa história e uma missão leva a outra. Tudo dentro do Diário [L] (aba Contratos) e de `quests480.js`; nenhum diário novo.
- `tools/gatilhos508.js` (novo, `window.Gat508`; estado em `run.gat508`, missões em `profile.quests480`): (1) 17 modelos de carta/diário (15 achados em baús, carcaças, acampamentos, covis e ruínas via `Enc502` + 2 de mensageiro); cada um aponta um lugar REAL (ruína, covil ou altar do `Enc502`) e um item com nome; ler abre "Missão diversa", chegar a 18 m revela o item. (2) Pontos vivos: 36% dos acampamentos/carcaças/baús/altares sorteiam a cada visita (peso por rank/nível/o que já fez/vezes que passou; `pv[id].seen` evita repetir): bandidos com carta, caçador morto com diário, refugiado doente, duelo de clãs. (3) Eventos presenciados: carroça atacada (Civic343, quando você vence o ataque) e fera contra guardas perto de uma Capital. (4) Mensageiro (Povo482) após subir de rank ou abrir o baú de um covil. (5) Cadeias: carta→relíquia→contrato do mural; guardas→relato na Capital→contrato do mural; carroça→entrega→missão de guilda; refugiado→clã (bênção)→missão de clã; duelo de clãs→missão de clã (+10% de ataque físico por 5 min).
- Partes ligadas: `quests480.js` (tick ignora missões `custom508`), `encontros502.js` (`Gat508.onLoot` ao vasculhar), `450-oraculos…` (Diário: seção "Cartas e diários", botão Ler, tag da missão, recompensa de contrato usa `gold` quando não há `rewardGold`), `game.html` (script novo).
- Teste (navegador, painel escondido): as 5 cadeias completas até o contrato final; carta lida, item na bolsa, estado salvo (`pds3_run.gat508`); sem erro de console. Prints nas notas do diretor.
- Não feito: carroça atacada depende do Civic343 (só roda para quem tem classe); 2 eventos presenciados (não 3); inimigos dos pontos vivos limitados a rank+2.

## v511 (21/10/2026) — Dragões de verdade no mundo, estilo Skyrim
- Pedido de Ian (print do Dragão Errante chibi com duas placas vermelhas): "tu não colocou os dragões no jogo"; quer que apareçam do nada, com chance, atacando uma vila, como no Skyrim.
- `tools/dragoes510.js`: o Dragão Errante (chefe de mundo, `spawnWorldBoss`) e o Dragão Sitiante (ataque à cidade, `startSiege`) usam os dragões novos de `models/povo482` pelo bioma (neve/cristal → Gélido de Ymiria; deserto → Serpe de Zahar; floresta/pântano → Musgo de Verden; vulcão → Ancião; resto → Ancião ou Dragonete). Sem modelo carregado, cai no antigo.
- Voo: chega pelo céu (~24 m de altura), circula o alvo (você; no ataque à vila, a cidade) soltando sopro no chão a cada ~3 s (o chão acende e queima 0,7 s depois; cor pelo elemento), pousa depois de ~14 s e luta com a IA de chefe; decola de novo após 20 s (12 s se ferido).
- Frequência: Errante a cada ~10 min (era 20); ataque de dragão à vila também em cidades nível 2–4 (antes só 5+).
- Teste local: spawn do Errante, voo → circula → pousa → luta, sopros com dano, sem erros no console; print do Ancião voando.

## v508 (21/10/2026) — Chão distante: as Capitais deixam de flutuar
- `tools/capitais504.js`: malha única de relevo distante (72×72, ±1100 m em volta do jogador, refeita a cada 150 m andados), com o mesmo material/shader do chão (`envGroundMat` clonado + `envGroundColors`: mesmo relevo e cor de bioma, sem vegetação), 3,2 m abaixo do chão carregado (sem briga de profundidade) e neblina reduzida a 20%. O mar e a cordilheira de gelo saem do próprio shader do chão. Só aparece no mundo aberto. Pilares lisos dos portões (caixa + cone) trocados por peças de muro Tripo na cor do bioma, nas Capitais.
- Teste: prints de Zahar e Ymiria a 600 m com a muralha pousada no chão, cordilheira de gelo vista de Ymiria, portão de Zahar. Custo de quadro medido com `frame()` em loop: ~7 ms com e sem a malha distante (sem diferença visível).
- Tentativa descartada: plano de água plano para o mar (cobria o deserto); o shader do chão já pinta o mar.

## v507 (21/10/2026) — Capitais: revisão do diretor (tochas, cor das torres, árvore sólida, silhueta de longe)
- `tools/capitais504.js`: (1) o lampião vitoriano vira poste de tocha (`post_skull` do env.glb + chama) em toda Capital, inclusive na cidade interna; no muro, braseiros (`campfire_stones`); (2) torres e muros pegam a cor do bioma por shader (luminância × cor da Capital: arenito, pedra azul, pedra clara, madeira/carvão, musgo), também nas torres e no muro da cidade interna; (3) Verden: Árvore-Mãe e carvalhos gigantes viraram malha própria, opaca e com as cores do modelo (antes sumiam além de 90 m pelo recorte das árvores e o brilho cobria a copa); o halo fica no topo; o muro interno também vira paliçada; (4) neblina reduzida (28% do normal) nas peças da muralha, plano de corte da câmera sobe de 260 para 950 m perto de uma Capital e o chunk central fica carregado até 700 m: a silhueta aparece a 600 m.
- Não feito (não era barato): portões ainda não barram monstro; tendas e barcos continuam peças soltas (poucas). A 600 m a muralha flutua sobre o céu porque o chão do jogo só carrega 2 chunks.
- Teste: 5 Capitais, print de frente ao portão, a ~250 m e a ~600 m. FPS não remedido nesta rodada (painel escondido travou o rAF).

## v506 (21/10/2026) — Encontros sem primitivas + NPC errante (correção da revisão da v502)
- `tools/encontros502.js`: ruína = prédio medieval Tripo caído (casa, capela, taverna, moinho, forja, guilda ou torre, afundado e achatado, às vezes uma segunda casa), com pedaços do muro Tripo, pilhas de pedras e rochas com musgo; baú dourado ao lado. Altar = círculo de pedras antigas em pé (rocha com musgo Tripo) com laje, velas e lanternas. Baú escondido e covil = rochões Tripo. Nos biomas secos/vulcão/neve as pedras viram rocha do env.glb pintada com a cor do bioma. Saíram pilares, colunas, estátuas e blocos lisos do env.glb.
- Variação: prédio, escala, giro e peças pela semente; um encontro nunca repete o tipo do vizinho (4 lados).
- Novo tipo `npc`: viajante parado junto a uma fogueira — peregrino, mercador ambulante ou caçador errante, com modelo do Povo482 (civil ou soldado) e três falas curtas cada (`speech153`). Aparece a 90 m e some a 150 m; sem mecânica nova.
- Teste: prints a ~15 m de ruína (floresta e deserto), altar, baú, covil, acampamento, carcaça e NPC; fala do caçador abre; sem erro novo.


## v505 (21/10/2026) — Sem Sede (cânon)
- Pedido de Ian: tirar a barra de Sede e o sistema de sede (o cânon diz que não existe Sede em Primeva).
- `tools/survival437.js`: a Sede não cai mais (fica sempre 100, então nunca dá dano de "Sede extrema"). A janela de água não tem mais "Beber Água Bruta Direto". Os textos de beber (chá, água fervida) e a linha de status não falam mais em Sede. Fome, temperatura, cantil (Chá Térmico/Antídoto) e pesca continuam iguais.
- `tools/attrs462.js`: o HUD (painel Ficha) e a janela de Status mostram só a Fome. Os textos de Vitalidade e Vontade foram atualizados.
- Partes ligadas: `biomes295` (texto do deserto sem Sede), `campaign327` (missão dos refugiados: "Fome e Cansaço", 5 textos).
- Teste: navegador local, Sede forçada em 10 volta a 100, HUD só com Fome, Status e mochila sem "Sede". Sem erro novo.

## v504 (21/10/2026) — As 5 Capitais com cara de capital
- Pedido: Ymiria, Zahar, Thalor, Urdan e Verden maiores que cidade comum, com muralha e identidade do bioma (Aster não mudou).
- `tools/capitais504.js` (gancho em `buildCity`): muralha externa de 150 m (muro de pedra ou paliçada Tripo, tingido por instância; peças `dim` sem a luz própria forte para a cor pegar), 4 portões (`cityGates341`), 12 torres, tochas, lanternas nas avenidas, praça pavimentada, marco com farol de luz (torre de 46–50 m; Verden = Árvore-Mãe). Ymiria: pedra azul-escura, abetos, tochas azuis. Zahar: arenito, 14 tendas (m437 cabana/abrigo), cactos. Thalor: muro claro mais alto voltado ao mar, cais de tábuas até a água funda, navio, veleiros e canoas atracados. Urdan: paliçada que escurece do pântano (norte) para carvão (sul), brasas subindo, pedras. Verden: paliçada verde, carvalhos gigantes dentro.
- Partes ligadas: `400-loop.js` (chão plano até 175 m nas Capitais, antes 85–145) e `250-mundo-infinito.js` (`updChunks`: o chunk central da Capital fica carregado até 430 m, para a muralha e o farol aparecerem de longe). Colisão real em cada segmento, torre, tocha e árvore.
- Teste: navegador local, as 5 Capitais montadas sem erro, jogador barrado na muralha (r=145 m), `terrH`=0 de 20 a 170 m, ~80 FPS em Ymiria (Edge, painel). Pendente: portões ainda não bloqueiam monstro fora do raio da cidade interna; neblina do jogo apaga a muralha a mais de ~250 m (só o farol, sem névoa, aparece de longe); tendas/barcos são peças soltas (não instanciadas, poucas).

## v503 (21/10/2026) — Monge, Lâmina Arcana, Lanceiro e Berserker
- Continuação e publicação automática autorizadas por Ian. Lote cobre os quatro básicos e Chute Giratório21:1, Salto Rúnico22:2, Salto do Dragão23:2 e Redemoinho de Aço24:1, com peças/paletas da demo e novos movimentos no esqueleto. Com isso, as14 classes normais têm básico e a habilidade da referência migrados; os quatro magos também já têm todas40 ativas. Demais habilidades normais e raras continuam pendentes.
- Cinco papéis do estúdio revisaram o lote: direção, geometria, materiais, colocação e performance. Referência específica de Ian prevalece sobre direção genérica; nenhuma alteração de cenário. Chi laranja, magenta, turquesa e vermelho preservados; ganho reduzido só nestes contextos para evitar branco excessivo. Geometrias/cristais e faíscas do motor aprovado; sem Blender necessário.
- Cinco sinais de soco se distribuem nos três ataques reais do Monge, sem criar dano adicional. Espirais duplas e anel acompanham a estocada; com lança equipada, o projétil real recebe lâmina facetada/espirais e mantém a física de arremesso. Cortes e impactos nas posições reais, sem mudar dano, área, recarga ou passivas.
- Novas fora do kit usam fila própria com acertos originais: Chute a0,25s e Redemoinho a0,1s. Gate registrado no motor bloqueia a geometria antiga até liberar o orçamento, impedindo dano dobrado pela Zone475. Alvos que entram depois continuam usando a área antiga e agora notificam o impacto novo.
- Saltos acompanham o avanço real de0,28s, sem escrever posição, direção ou collider do jogador. Salto vertical é só pose do corpo; arco foi adaptado à duração real. Rastro/fantasmas seguem o caminho efetivamente percorrido, o final usa o último contato confirmado; sem alvo, o ponto real de chegada. Fantasmas antigos seguem invisíveis. Esquiva comum cancela a pose; só dashDmg de habilidade permite a animação própria.
- Limite de efeitos não impede aplicação da fila de dano. Desligar VFX durante preparação libera o dano pendente antes da limpeza. Dash interrompido encerra o rastro sem pouso falso. Estado de materiais/camadas restaurado; recursos novos passam pelo descarte global.
- Validação:16 casos de habilidades e16 básicos, dano igual normal/leve; avanço igual em trecho livre. Lanceiro com lança equipada:4 casos, dano igual. Área com entrada tardia:4 casos, dano56 igual e impacto novo1 por alvo. Tetos, interrupção, troca de modo e esquiva passaram. Regressão36 casos anteriores, movimento/status e limpeza passaram. Oito gravações de210 quadros,34 poses diferentes por habilidade e zero efeitos após limpeza, sem erros JavaScript capturados. Medição final isolada Edge/WebGL por software720×720, cena carregada, aquecimento3,8s de jogo/amostra3,5s reais: normal Monge75/Lâmina67/Lanceiro66/Berserker68fps; leve80/71/77/81. Controle antigo normal82/81/66/82 e leve82/74/75/84. São amostras controladas, não garantia para todo aparelho/mapa. Ensaios com gravação/montagem concorrente foram descartados como medida final.
- Testes e prévia: https://drive.google.com/drive/folders/1s1dtIDfN8L1AGwZ-1fTdqVU9K-RREQ6I
- Integração preserva v499: novas armas Blender dos magos/Paladino/Invocador/Necromante e cabeça dos cajados guardados voltada para cima.

- Integrado sobre v500/7910824: mapa finito10×10km, mares oeste/leste/sul, cordilheira norte e cinco capitais preservados. Medições anteriores são do cenário controlado antes desta mudança de mapa; integração exige validação própria.
- Integração do mapa validada: repetidos16 casos das habilidades e16 dos básicos +4 com lança equipada; todos preservaram dano, e habilidades preservaram deslocamento em trecho livre. Oito gravações reatualizadas. Performance pós-mapa em Edge/software720×720 variou: série sequencial normal35–75/leve60–80fps; repetição dedicada Lanceiro novo70/antigo69 normal e78/77 leve; Berserker55/66 normal e67/65 leve. As quedas da série longa permanecem registradas; não se promete60fps em todo mapa/aparelho.

- Preservadas também v501/mapa-múndi e v502/densidade de encontros e gelo sem verde. Vídeos foram regravados após mapa finito v500 e antes desses dois ajustes de interface/encontros; apresentação dos golpes é a mesma.

## v502 (21/10/2026) — Densidade estilo Skyrim: um encontro a cada ~150 m + bordas de gelo limpas
- Pedido do diretor (sessão de mapa): segredos e encontros no mapa finito; sem verde na cordilheira de gelo; conferir filtro de mar nas costas novas.
- `tools/encontros502.js` (novo): grade de 150 m com posição por semente (`rh`), seis tipos montados só com modelos de `env.glb`: acampamento abandonado (tenda, fogueira, toras, barril; 1 em 4 vigiado), ruína com baú dourado (pilares, arco, entulho), baú escondido entre rochões, altar antigo (reza: vida e mana cheias, de novo a cada dia), carcaça de viajante (costelas, crânio, espada e escudo, carroça) e covil (rochas altas, postes de crânio, baú; criaturas do bioma aparecem a 42 m). Tipo muda com o bioma. Não nasce no mar/praia, água, lago, perto de cidade, na estrada, em morro íngreme, nem onde já há ruína/posto/acampamento de clã (Living372, a cada ~160 m, conta como encontro). Em volta de cada um o cenário comum abre uma clareira (árvores, pedras, grama). Baú/restos/acampamento: F, uma vez por mundo (`run.enc502`); ouro por perigo + item. `Enc502.stats()` conta os sítios.
- Cobertura medida (semente 20260927): ~1750 encontros novos + ~775 acampamentos de clã + ~180 ruínas/postos em ~3200 células de 150 m de terra (≈ 85%).
- Gelo (`ice500 > 20`): `EH/EW` trocam plantas/flores/cogumelos/grama por conífera nevada ou rochedo pequeno (ou nada); `tools/survival437.js` não gera arbusto/erva/cogumelo colhível ali (vira pedra); `tools/grass446.js` não planta grama ali e deixa clareira nos encontros.
- Filtro do mar (`sea439` EH/EW): usa `SEA439.d` (máximo das três costas), então já vale para oeste, leste e sul; conferido por amostra (leste 53/60 e sul 50/60 pontos do mar filtrados, o resto é praia acima da água).
- Teste: navegador local, seis tipos renderizam e abrem, altar cura, covil chama criaturas, gelo sem verde (63 nós de coleta, nenhum arbusto), costa leste sem cenário no fundo. Sem erro novo (só os 404 que já existiam).
- Pendente: NPC errante novo (só existem os clãs); prints em `side-session-notes`.

## v501 (21/10/2026) — Mapa-múndi finito e minimapa com mar
- Pedido (diretor): o mapa grande mostra o quadrado inteiro de 10 km, não mais 560 m em volta do jogador.
- `tools/mapa501.js` (novo, carregado depois de `mapa500.js`): em mundo aberto, `drawMap(…, full)` desenha o mundo todo: mar (azul, mais fundo longe da costa) a oeste/leste/sul, praia, cordilheira de gelo ao norte, cor do bioma (`biomeAt`) e sombra de relevo numa grade de 400×400 guardada numa tela (versão 100×100 na hora, a detalhada em fatias de 20 linhas depois; sem tarefa longa), rios/lagos, 120 trechos de estrada, 25 cidades (nome), as 6 Capitais com estrela e nome em destaque, postos avançados, acampamentos (pontos), portais, chefes lendários, tesouro, alvo da campanha, jogador com seta e cone de visão. Dentro de masmorra/Outro Mundo/especial o mapa antigo continua.
- `tools/map393.js`: `waterKind` reconhece o mar (`SEA439.d>0`); pixels fora de ±5000 ficam escuros (minimapa e mapa); exporta `Map393.{waterKind,biomeColor,frame,tent,tower,…}`. O minimapa segue local (~90 m), agora com mar na borda.
- Sem neblina de guerra: o mundo aberto não tem sistema de áreas exploradas (só as masmorras).
- Textos: nenhum texto de interface fala em mundo infinito (só o Outro Mundo da Fenda e a Torre da Ascensão, que são infinitos de verdade; comentário/arquivo `250-mundo-infinito.js` é só nome interno).
- Teste: navegador local, mapa aberto com tudo no lugar, sem erros; desenho em cache 0,8 ms, primeira abertura ~90 ms, grade detalhada em ~0,75 s sem tarefa longa; 20 aberturas/fechamentos 2,6 ms cada.

## v500 (21/10/2026) — Mapa finito de 10 km × 10 km: bordas, biomas e as 5 Capitais
- Pedido de Ian: montar o mapa finito (x e z de −5000 a +5000) com Aster no centro e as 5 Capitais em volta.
- `tools/mapa500.js`: só existem as regiões −2..2 (25 cidades, nomes sem repetir em ordem fixa). Capitais fixas: Ymiria (0, −3400) na neve, Zahar (3400, 0) no deserto, Thalor (−3850, 0) na costa oeste, Urdan (0, 3400) com pântano ao norte e vulcão ao sul, Verden (2300, 2300) na floresta. Aster fica em campos temperados. Os biomas são forçados por `biomeSample317`, então o chão, a vegetação e os efeitos mudam juntos. Cidades comuns ficam dentro de 3,7 km. Estradas para fora do mapa somem. Ninguém passa de ±4920 m (toast "Cordilheira de gelo" ou "Mar sem fim").
- `tools/terrain245.js` (CPU e GLSL iguais): `seaD439` passa a ter mar no oeste (costa em −4100), no leste (+4250) e no sul (+4300). `ice500` cria a cordilheira de gelo do norte (de −3950 a −4550, com até ~220 m). O teste de visibilidade do chão considera a altura da cordilheira (antes o chão sumia).
- Partes ligadas: `biomes295` (Zahar e Ymiria em 2,0 e 0,−2), `mechanics434` (Thalor −2,0), `deep447` (destinos da Corrente Abissal dentro do mar novo), `test-living372`.
- Teste: navegador local, as 6 cidades nos lugares certos, biomas certos, mar e praia a oeste, cordilheira ao norte (chão aparece), deserto em Zahar, limite segura o jogador. Sem erro novo (o 404 de `pedra-lasca.glb` já existia).
- Pendente (outras conversas): densidade de segredos a cada ~150 m, muralhas e visual de cada Capital, mapa-múndi finito no `map393`.

## v499 (21/10/2026) — Armas próprias para Paladino, Invocador, Necromante e cada mago (Blender)
- Pedido de Ian: encaixar as armas feitas no Blender (Drive: Projetos/Portal-das-Sombras/Armas-Blender-v490) nas classes.
- `models/armas155/*-490.glb` (9 arquivos, 652 KB juntos): varinha do Paladino (antes usava a maça), tomo do Invocador e cajado de ossos do Necromante (antes o cajado comum), e um cajado por mago: fogo, gelo, terra, raio, tempo e fendas.
- `tools/warrior-player127.js`: `STAFF495`/`staffFile495` escolhe o cajado pelo elemento no nome do item (Brasa/Geada/Raiz/Centelha/Tempo/Fenda) e, sem isso, pela classe do jogador (Mago Elemental pelo elemento escolhido). Cor original (`make428`). Modelos `-490` não passam pela adivinhação de lado da cabeça (`fixed490`).
- Guardados nas costas: cajado, cajado de ossos e varinha ficam com a cabeça para cima, saindo por cima do ombro (antes a regra das espadas deixava o cristal perto da cintura). Espada, machado e adaga continuam como estavam.
- Teste: navegador local, as 9 armas carregam e aparecem (classes 5–13), na mão durante o ataque e nas costas. Sem erros. Não mexe nos ataques/efeitos (GPT). Reaplicado por cima da v498.

## v498 (21/10/2026) — Invocador: esfera arcana e lobo de cristal vivo
- Continuação automática autorizada por Ian. `tools/invocador497.js` usa a esfera com três brilhos orbitando, runa no alvo e o lobo de cristal arcano da demo aprovada. O desenho corresponde somente ao Lobo Espiritual aliado permanente; lobos inimigos do mundo mantêm seu modelo. Este lote cobre básico e Lobo Espiritual; outras ativas do Invocador seguem pendentes.
- O mesmo aliado real conserva IA, vida, dano, alcance, recarga e colisão. Modelo aprovado acompanha posição/direção reais, com ciclo de patas por distância, respiração, cauda, cabeça ao morder, reação curta ao dano e dissolução ao morrer. A mordida desenha três cortes no acerto confirmado. O corpo anterior fica escondido só durante a renderização, com visibilidade restaurada ao final; não se muda o modelo usado na lógica de combate.
- Motor aceita tempo máximo por efeito: oito segundos continuam sendo o padrão; apenas a apresentação da invocação permanece enquanto o aliado existir. Troca de classe/cena, morte e liga/desliga limpam corretamente. Limite de efeitos volta ao projétil original visível, sem deixar os três brilhos soltos.
- Brilho contínuo otimizado sem clonar materiais: na passagem de profundidade, ignoram-se ramos invisíveis e malhas que não escrevem profundidade, restaurando as camadas depois. Comparação de720×720 com obstáculo: zero pixels diferentes antes/depois, inclusive ocultação; estados restaurados. Mantida resolução0,75 do bloom aprovado; as experiências0,5/0,35 não foram adotadas.
- Testes normal/leve: quatro comparações do aliado por12s preservaram dano120 no alvo, posição, vida, força e quantidade; quatro casos de básicos preservaram dano68 e os três projéteis identificados. Duas gravações de três básicos + habilidade, personagem e lobo animados, corpo ainda ativo mais de14s após conjurar e zero VFX após a retirada real. Idle, hit/retorno de cor, morte, liga/desliga e visibilidade passaram. Regressão de36 casos das nove classes migradas preservou dano; movimento/status passaram. Teto900/500 testado com recuperação do projétil original e zero brilhos soltos. Sem erros JavaScript capturados.
- Desempenho em Edge sem interface/WebGL por software,720×720, cena fixa carregada, aquecimento3,8s de jogo/amostra3,5s reais: controle antigo4 lobos32fps; novo: um lobo31fps; quatro32fps; oito30fps; leve8 lobos37. A carga sintética aumentou só a mana do teste para permitir8 aliados, sem mudar a regra de jogo. Não garante os mesmos FPS em todo aparelho/mapa. Ensaios anteriores sem otimização e escalas alternativas estão nos resultados como experimentos.
- Reaplicado sobre v497 (Marco Zero, frase oficial do Arquiteto, Adrian e estrada enquadrada), com versões de cache dessas duas rotinas atualizadas para o conteúdo novo não ficar preso no navegador.
- Corrigido erro da moldura recém-integrada da Estrada Sul: chamada inexistente addCol substituída pela colisão gerenciada Solid429, materiais inicializados e carregamento tardio cancelado após sair da cena. Teste da abertura passou sem erros JavaScript, incluindo oito obstáculos, remoção e cancelamento assíncrono; comparação do Invocador repetida e aprovada após a correção. Avisos HTTP404 de recursos opcionais da base ainda existem.
- Prévia, código e testes: https://drive.google.com/drive/folders/1EaYo9K_4Dk6jZtXm8IydJhgmii0RaxOW

## v497 (21/10/2026) — Marco Zero do Livro I: Arquiteto, Adrian e Estrada Sul
- Pedido de Ian: abertura canonica com o Arquiteto e o despertar na estrada ao lado de Adrian e da carroca tombada.
- **Frase Oficial do Arquiteto (tools/dream488.js)**: Correcao para a frase do livro: *"Voce vai ser aquele que vai me erguer ou me destruir."* na transicao do vacuo da Fenda.
- **Alinhamento do Marco Zero (tools/campaign327.js)**: O Ato I (a1) fixa a carroca (wagon369.glb) e Adrian (edran452.glb) deterministamente na Estrada Sul de Aster ([c.x, c.z + wall + 22]).
- **Enquadramento de Camera e Moldura Cenica**: Ao acordar da cutscene, o jogador desperta deitado na estrada olhando a 0 graus (Norte) em direcao ao Portao Sul de Aster e as tochas da muralha. O trecho da estrada e emoldurado por coniferas nordicas rusticas (tripo-conifera153) e rochedos com musgo (tripo-rocha-musgo154, tripo-rochedo154) nas margens, sem nenhuma forma geometrica primitiva pura.

## v496 (21/10/2026) — Arqueiro e Paladino: básicos, Chuva de Flechas e Julgamento
- Continuação automática autorizada por Ian. `tools/luz-flechas496.js` usa as peças aprovadas: flechas BLADE de cristal verde (terceira maior), rastro e impacto verde; orbe sagrado com estrela dourada no contato; 16 flechas de cristal caindo e ficando cravadas; Julgamento com runas, coluna e onda de luz. Este lote cobre básicos e uma habilidade de cada classe; as demais ativas delas ainda estão pendentes.
- As 16 flechas acompanham os cinco pulsos canônicos sem alterar a cadência. Julgamento libera o orçamento original de dano no clarão de 0,35s; círculo e onda usam o raio real da habilidade, inclusive crescimento. Movimento próprio de puxar/disparar o arco para cima e conjurar a coluna; básicos mantêm os clipes existentes.
- Caminho de arco equipado não trazia `basicClass`: a apresentação lê a classe do básico selecionado e repassa só `basicVfx487` aos VFX. Não altera o campo de classe usado no dano/passivas, velocidade, colisão ou penetração. A terceira flecha é maior visualmente; atravessamento continua dependendo das regras de arma/talentos já existentes. Armas de outro tipo e tiros dos aliados não são convertidos em flecha/orbe destas duas receitas.
- `golpes487` recebe atraso por provedor e identidade só visual para impedir o impacto antigo duplicado; `magos488` só desenha impactos de seus quatro magos. Colisões antigas continuam invisíveis. Corrigida a altura da coluna sobre o relevo. Leve sem bloom e com menos partículas.
- Testes: oito casos de habilidade (duas classes × normal/leve × VFX ligado/desligado), com dano e posições iguais; oito de básicos com dano igual e os três projéteis de cada caso identificados no visual novo. Quatro gravações com três básicos + habilidade, poses variadas e zero efeitos vivos após limpeza; Julgamento regravado com área verdadeira. Sem erros JavaScript capturados. Movimento e status passaram; no primeiro roteiro, a checagem de status era bloqueada por uma flag de criação usada só para pausar o treino no controle; flag restaurada e teste repetido. Sintaxe de16 scripts e build/core_parts conferidos.
- Amostras controladas em Edge/WebGL por software, 720×720, cena carregada, aquecimento de3,8s de jogo e amostra de3,5s reais: Arqueiro normal59/leve78fps; Julgamento final normal84/leve99fps. Cenas de teste de sessões distintas; não usar como promessa para todo aparelho/mapa.
- Prévia, código e testes: https://drive.google.com/drive/folders/1T7Enn2WOPhEKWOxvUlBoOZrPBjSRSGiq

## v495 (21/10/2026) — quatro magos com todos os poderes e movimento
- Continuação autorizada por Ian: publicar automaticamente os lotes testados, magos primeiro, depois demais normais e raras. Somadas à v492, as quatro classes de mago agora têm os quatro básicos e as 40 habilidades do catálogo carregado (10 por classe). Este lote acrescenta 28 habilidades base e oito de expansão; as outras classes ainda estão na fila em `docs/VFX-ROLLOUT.md`.
- `tools/magos493.js`: receitas por ação com as peças aprovadas (cristal facetado, fita, esfera, raio, runa, brasa, névoa e estilhaço), no ponto/raio verdadeiro. Muralhas e zonas duram o tempo real; escudos seguem o personagem e somem ao esgotar; deslocamentos ligam origem e destino reais; o golem real permanece visível. Cinco movimentos novos no esqueleto para explosão, selo/defesa, jato, chamada do céu e passo. Não altera dano, recargas, alvos, alcance ou cadência dos novos poderes.
- Motor compartilhado guarda origem/aliados antes do efeito, informa cada acerto de pulso ao desenho e mantém os VFX antigos invisíveis, com sua colisão anterior. Corrigida a altura de clarões de gelo/fogo no relevo. Removidos carga/rastros/brilho antigo sobrepostos aos projéteis migrados; som e combate preservados. Bloom normal, leve sem bloom. Módulos novos e bibliotecas do bloom entram no cache da aplicação.
- Integração sobre v494 / 2f952b8: preservados NPCs Tripo, banco de animação, dragões, mina, moradores/viajantes, nomes medievais e os modelos/encaixe de machado e escudo do Tanque. A rotina compartilhada de animação foi novamente exercitada em 14 gravações após a integração, cobrindo os cinco movimentos.
- Testes: 144 controles de dano/estados em 36 habilidades × normal/leve × VFX desligado/ligado, todos iguais, repetidos depois da integração. Mais 24 controles dos pulsos no acerto; regressões de básicos dos magos, quatro habilidades dos vídeos e Guerreiro/Assassino/Tanque preservaram dano. Golem com 25 malhas na camada visível; três escudos removidos ao esgotar. Movimento/status, build/core_parts, 15 verificações de sintaxe e cache conferidos.
- 72 combinações gravadas (36 habilidades × dois modos), 225 quadros/7,5s cada, poses variando e zero VFX presos após limpeza. Trechos contaminados por invocação de outro caso foram refeitos com aliados limpos entre testes. Sem erros JavaScript capturados; isso não elimina avisos HTTP404 antigos de recursos opcionais da base no servidor de desenvolvimento.
- Desempenho controlado: cena carregada, 720×720, Edge sem interface/WebGL por software, materiais aquecidos por 3,8s de jogo, amostras de 3,5s reais, surgimentos aleatórios do mundo pausados só no benchmark. Normal fogo53/gelo63/terra60/raio60 fps; leve 80/84/84/84 fps. Não é garantia para todo aparelho ou trecho do mapa.
- Prévia, código e testes: https://drive.google.com/drive/folders/1042QNoWqGx_KHEzqMlnM2H0KJ_oWSjxJ

## v494 (21/10/2026) — Machado e escudo do Tanque (Tripo), escudo só quando equipado
- Pedido de Ian: "o cara tem um escudo e um machado, e o machado não tá nem encaixado direito no tanque… quando eu coloco o escudo, não aparece".
- Machado: o jogo usava o modelo da MAÇA como machado (`W171.axe`). Novo `models/armas155/machado-tanque490.glb` (Tripo texto, 30 cr; reduzido no Blender de 1,4 mi para 12 mil triângulos, textura 1024 JPEG, 0,7 MB), cor original (`make428`, sRGB), sem tinta de rank.
- Escudo: novo `models/armas155/escudo-tanque490.glb` (Tripo texto, 30 cr), girado −90° no Blender para a face ficar como a do escudo antigo. Preso em pé com a face para fora do braço esquerdo, medido contra o corpo (antes seguia o giro da mão e ficava deitado como bandeja).
- Escudo só aparece com o slot Escudo equipado (`SHIELD171={}`): Tanque e Paladino não levam mais escudo grudado.
- Bugs que escondiam o escudo: (1) a assinatura do visual não incluía o slot `sh`, então equipar escudo não remontava o personagem; (2) a fila `wait171` era apagada quando o PRIMEIRO modelo carregava, e o segundo (escudo) nunca entrava. Ambos corrigidos em `tools/warrior-player127.js`.
- Ainda com modelo provisório: varinha do Paladino usa a maça; tomo/cajado de ossos usam o cajado comum. Modelos Blender para todas as classes no Drive (Projetos/Portal-das-Sombras/Armas-Blender-v490), não integrados.
- Teste: navegador local, machado + escudo equipados, sem escudo = nada na mão esquerda, com escudo = em pé no braço; golpe com o machado na mão. Sem erros. Não testado: pose de guarda com escudo (shield473).

## v493 (21/10/2026) — Povo novo (NPCs Tripo + rig no Blender), 5 dragões estilo Skyrim, mina e viajantes de carroça
- Pedido de Ian (20/10): NPCs do Tripo com rig no Blender (não pagar rig no Tripo), do tamanho do Viajante, anões e elfos, 5 dragões animalescos estilo Skyrim com movimento fluido, moradores sem arma/armadura (só caçadores lutam), magos sem armadura.
- `models/povo482/`: 24 bases humanas (14 caçadores m/f de 7 famílias, 6 moradores, 2 anões, 2 elfos) rigadas por `tools/blender482/rig_humanoid.py` (esqueleto Mixamo, máscara `_NPC_MASK` roupa/cabelo/pele), 5 dragões por `tools/blender482/rig_dragon.py` (69 ossos, 14 clipes no lugar e ciclos fechados), `anim-povo482.glb` (36 animações grátis do Tripo, só esqueleto), `mina482.glb`. Índice: `python tools/povo482-index.py`.
- `tools/npc482.js`: moradores e caçadores usam as bases via `Warrior127.create` (25 clipes do Viajante; moradores também o banco do Tripo), variação por região (matiz da roupa, cabelo, pele, porte, ritmo), arma do jogo pelo Rank, caçadores nomeados da v479 com corpo, LOD 24 NPCs/60 m. Dragões: Dragonete e Dragão Ancião trocam os Quaternius; Gélido de Ymiria (neve), Serpe de Zahar (deserto, alvo de `bounty_wyrm_zahar`) e Dragão-Musgo de Verden (floresta/pântano) são espécies novas raras. Escala pedida por Ian (bem maiores que o Viajante, acima do porte do Livro): Dragonete 4,2; Serpe 7; Musgo 8,2; Gélido 8,4; Ancião 10,2 — raio, alcance e passada crescem junto.
- `tools/vida486.js` (print de Ian: gente demais, bloco na mão, raças misturadas, nomes modernos): menos moradores (`400-loop`: 2+min(4,nível/2)); só 1 em 3 trabalha e o trabalho é a mina da cidade (fora da muralha, longe de árvores/estrada/água, com colisão; o minerador entra, fica 1–3 min e volta; sem caixa); raça pelo bioma (floresta → elfos; neve/vulcão/cristal → anões; resto humanos); outras raças só como viajantes que chegam de carroça ao portão e vão embora; nomes medievais por raça (CNAMES e NAMES dos caçadores trocados). `workers350` continua, mas pescador/lenhador de caixa saíram dos moradores.
- Teste (local, Aster): moradores e caçadores com bases novas e nomes novos, mineradora sem caixa, carroça com anão e elfa viajantes, mina em clareira com colisão, dragões medidos no jogo. Não visto: minerador entrando na mina em tempo real; carroça na câmera.
- Arquivos de origem (GLBs crus, provas, scripts) no Drive em `Primeva-Povo482` (a subir).

## v492 (20/10/2026) — quatro magos, básicos e habilidades dos vídeos
- Ian aprovou automaticamente todos os lotes testados, pediu os magos primeiro e publicação gradual. Não pedir nova aprovação visual a cada lote. Fluxo completo em `docs/VFX-ROLLOUT.md`.
- `tools/magos488.js`: fogo, gelo, terra e raio, com básicos seguindo projéteis reais e impactos no ponto de contato; Chuva de Meteoros, Lança de Gelo, Estaca de Pedra e Corrente de Raios com peças da demo e movimentos novos no esqueleto. Só estas quatro habilidades estão neste lote; as outras habilidades dos magos vêm a seguir.
- Meteoros conservam os cinco pulsos e a cadência original; o voo visual de cada pedra termina no respectivo pulso. Gelo/terra liberam o orçamento original de acertos no impacto da lança; raio usa a ordem e até cinco alvos canônicos, embora a demo tenha três. Sem aumento de dano, alcance ou recarga.
- Motor compartilhado recebe provedores por classe, atualização com Set no lugar de buscas repetidas em toda a lista, aquecimento dos materiais novos ao entrar no mundo (também no leve) e limpeza dos projéteis ao desligar/trocar. `vfx302` preserva a invisibilidade dos efeitos antigos também nos callbacks atrasados; estes continuam servindo à colisão anterior.
- Testes: 16 comparações de dano de habilidades e 16 de básicos, em normal/leve, todos iguais com VFX desligado/ligado. No teste de básicos, treino automático foi pausado somente no teste para evitar atributos diferentes entre tentativas. Corrente com zero, um e cinco alvos; tiros no terreno; limpeza/restauração; 8 gravações com três básicos e habilidade, movimentos novos ativos e zero efeitos presos. Sem erros JavaScript capturados. Build/core_parts/sintaxe conferidos.
- Reaplicado sobre v491 (inclui mira do Lobo Fendido, missões e desvio dos NPCs), além de v489: preservadas a cutscene do sonho, as revisões de texto, a regra de armaduras do Segundo Despertar e o banner do Narrador.
- Benchmark controlado em cena carregada, 720x720, Edge sem interface, WebGL por software: normal fogo48/gelo54/terra53/raio67 fps; leve fogo73/gelo74/terra73/raio64 fps. Materiais aquecidos por 4s de jogo antes de amostra de 4s; surgimentos aleatórios do mundo pausados só no benchmark. Não garante os mesmos números em todos os aparelhos/mapas.
- Prévia, código e testes: https://drive.google.com/drive/folders/1uiUiZP1CByUaSyeOFg8u-0ff54Cp35ne

## v491 (20/10/2026) — NPCs da cidade desviam da fonte, bancas e casas
- Pedido de Ian (print da fonte roxa em Aster): "os NPCs batem nas coisas como se não enxergassem que tem coisas na frente".
- Causa: `updNpc` (src/core/390-ia.js) andava reto até o destino; a colisão só empurrava para fora, então esfregavam no obstáculo. O destino sorteado também podia cair dentro da fonte.
- Agora: `steerNpc490` olha 2,4 m à frente e vira para o lado livre mais perto do destino (mantém o lado por um instante); destino só em lugar livre; chegou perto de um destino bloqueado = chegou; preso por mais de 1 s escolhe outro destino.
- Teste (5 caçadores cruzando a praça pela fonte, 10 s): encostados 20% → 0%. Sem erros.

## v490 (20/10/2026) — Aceitar missão de encontro, mira no Lobo Fendido, relatório do cerco
- Pedido de Ian (áudios 20/10): "aperto nas missões e não acontece nada"; mira de longe desce para o chão no Lobo Fendido; abrir o relatório do cerco contava o tempo da Fenda de novo.
- `tools/quests480.js` (?v=490): `acceptEmergent`/`openEmergentDialogue` não estavam exportados — o botão "Aceitar: …" dos encontros (ex.: Vael, Batedor Renegado) dava erro e não fazia nada. Exportados; contrato de encontro guarda a definição no save (volta depois de recarregar) e marca o alvo perto de onde foi aceito.
- `src/core/380-acoes.js`: `projectileBody253` media o Lobo Fendido pela pose de ligação do SkinnedMesh (~230 m de altura) → cápsula absurda. Caixa absurda volta ao raio do bicho; mede de novo se o modelo trocar; centro nunca abaixo do chão. Mira trava no lobo a 0,7 m.
- `src/core/270-masmorra-procedural.js` + `tools/worldsim479.js` (?v=490): o mundo simula o tempo da Fenda uma vez, ao sair; o relatório só mostra o resultado guardado (antes cada abertura simulava de novo).
- Teste: navegador local, lobo fendido + mira no centro (trava, y 0,7), relatório aberto 2× sem mudar o save, aceitar `deserter_scout` → missão ativa e no HUD. Sem erros no console.
- Pendentes (áudios): fenda vencida pelo guardião 3× não aparece no registro; golpe seguir a arma; NPCs batendo em objetos; gravidade de itens.

## v489 (20/10/2026) — Segundo Despertar por Armaduras de Chefes e Narrador no topo da tela
- Pedido de Ian:
  1. Segundo Despertar: confirmar e garantir a regra real. O jogador entra em um portal que se torna vermelho, derrota o chefe de classe rara e obtém partes da armadura dele (cada uma com passiva exclusiva). Ao reunir e equipar as 5 peças do conjunto completo, abre-se a prova para despertar a classe daquele chefe. Removido do código todo e qualquer resquício antigo de "investigações de fissuras com o Narrador" e "afinidades".
  2. Narrador: como o histórico de conversas fica recolhido, o Narrador estava invisível. Implementado banner elegante no topo da tela (`narratorSayTop` / `#narratorTopBar`) com título dourado, tipografia em destaque e som suave. O Narrador agora aparece no alto mesmo com o histórico fechado, tanto em eventos importantes quanto em observações periódicas do mundo.
- Modificados:
  - `src/core/330-efeitos.js`: adicionada `narratorSayTop` com banner dinâmico e integração com `toast`.
  - `src/core/640-telas.js`: `narratorUpdate105` agora exibe as falas no topo da tela e aciona observações ambientais quando a fila estiver livre.
  - `src/core/440-instancias-especiais.js`: tela do Segundo Despertar (`awakeningView103`) atualizada com a regra oficial dos conjuntos de armadura em Fendas Vermelhas.
  - `src/core/660-bloco-runtime111-cont.js` e `680-bloco-journey113-cont.js`: eliminadas funções e ações mortas do sistema antigo (`awakeningViewOld103`, `rareLearn103`, `rareAttune103`).
- Testes: montagem e build ok; node --check em todos os scripts e blocos inline; asserções de verificação aprovadas.

## v488 (20/10/2026) — Cutscene de sonho com a Mão do Arquiteto e despertar estilo Skyrim
- Pedido de Ian: adicionar na cutscene de abertura de Novo Jogo (logo no início, antes de despertar da queda da Fenda) a cena de sonho em 1ª pessoa com a Mão do Arquiteto:
  1. Cena em 1ª pessoa no vazio escuro/violeta da Fenda: a Mão do Arquiteto (`arquiteto246.glb`) desce lentamente da escuridão em direção à câmera/rosto do jogador com tremor de câmera e pulso de luz púrpura.
  2. Fala sincronizada do Arquiteto em 3 legendas diretas (~9s) com botão de Pular opcional:
     - "— Sim... é você. Eu finalmente o encontrei."
     - "— Você vai ser aquele que vai me libertar... ou então acabar comigo."
     - "— Acorde. Vamos juntos destruir o que resta deste mundo."
  3. Transição estilo Skyrim: a Mão avança como se fosse tocar a cabeça do jogador -> corte com efeito de piscar os olhos (pálpebras superiores e inferiores abrindo com fade-in da visão turva para nítida) acordando diretamente na Estrada Sul em frente à carroça tombada e Edran caído.
- `tools/dream488.js`: módulo da cena de sonho, iluminação púrpura, partículas de fenda, áudio atmosférico profundo, sincronia de legendas, botão "PULAR [ESC]" e overlay de abertura de olhos com desfoque progressivo estilo Skyrim.
- `tools/reclaim372.js`: exporta `cachedHand`, `poseHand404` e `handRig404` para reuso da malha real e articulação de dedos de `arquiteto246.glb`.
- `tools/campaign327.js`: `spawnAwakening()` dispara `window.Dream488.play()` para novo personagem sem classe, com transição direta ao fim ou no pulo para a Estrada Sul.
- `src/core/370-v281.js`: `isCinematic451()` protege o jogador durante a cena de sonho.
- Revisão de textos de UX (princípios da skill `primeva-textos`): murais, descrições de classes e sobrevivência enxutos e diretos.
- Testes: `node tools/test-dream488.cjs` executado com Playwright no Microsoft Edge — ativação da cena de sonho em Novo Jogo aprovada, 3 legendas validadas, corte no avanço da mão validado, efeito de piscar de olhos e despertar na Estrada Sul validado, botão Pular validado; `test-intro401.cjs`, `test-intro402.cjs` e `test-reclaim402.cjs` passando; `python tools/build.py` e `python tools/core_parts.py check` ok.

## v487 (20/10/2026) — VFX aprovados e personagem animado, lote 1
- Ian aprovou os efeitos de Guerreiro, Assassino e Tanque e pediu movimentos próprios para as novas habilidades. Também aprovou a publicação automática de todos os próximos lotes testados: fazer os magos primeiro (fogo, gelo, terra e raio), depois as demais classes; cobrir básicos e todas as habilidades, normais e raras.
- `tools/golpes487.js`: peças e receitas originais da demo, bloom seletivo normal, partículas reduzidas e sem bloom no leve, decalques no terreno, efeitos antigos invisíveis e colisão/dano liberados uma vez no impacto. Só as 3 classes deste lote estão integradas.
- `tools/anim303.js`: movimentos novos para Corte Giratório (dois giros), Mil Cortes (sequência rápida e final cruzado) e Golpe de Escudo (preparação e empurrão), sincronizados pelo tempo do jogo; esquiva interrompe a pose. Animações anteriores do básico preservadas. A rigidez na prévia anterior vinha do gravador: ADT estava zerado durante update; o gravador agora avança ADT antes de animar.
- Ian autorizou sincronizar os acertos com a demo, preservando dano total, recarga e alvos. Mil Cortes mantém seis parcelas em sequência rápida e o contato adicional de colisão já existente, sem aumento do total.
- Correção ligada ao teste de console: `deep447.js` usava `Surv437.IT`, mas a bolsa exporta `ITEMS`; itens do mar passam a registrar sem TypeError.
- Testes: build e core_parts ok; sintaxe; três básicos + habilidade nas 3 classes × 2 modos; zero efeitos vivos após limpeza; lançamento por useSkill, fim das poses, pausa e esquiva; andar e janela de status. Dano com VFX desligado/ligado: Guerreiro [50,50,0], Assassino [203,102,0], Tanque [62,62,0] nos alvos a 2/4/7 m, nos dois modos. Zero erros JavaScript registrados; recursos ausentes da base podem ainda gerar avisos HTTP.
- FPS em cena aberta 720×720, Edge sem interface e renderização por software, amostra curta: controle 79, normal 56, leve 72. Não é garantia em todos os mapas/aparelhos.
- Código, relatório e prévia R3: https://drive.google.com/drive/folders/1TffooHVxm4BfRkhw2_CyEZNl4GD3j8JA

## v486 (20/10/2026) — "MURALHA" fora da cidade
- Pedido de Ian: usou habilidade num lobo longe de qualquer cidade e o jogo mostrou "MURALHA" e não deu dano.
- Causa: na v482 `inCity` passou a usar raio em metros (65/95/125) mas continuou multiplicando por CITYK (1,76): a cidade "ia" até 114/167/220 m.
- Correção: `src/core/170-colisao.js` usa o raio direto. Ligado: o mesmo `inCity` vale para bloqueio de dano (wallBlock341), zona segura e sobrevivência — todos voltam ao tamanho certo.
- Teste: inCity em níveis 1/6/8 = dentro até 63/90/120 m, fora a partir de 70/100/130 m.

## v485 (20/10/2026) — Linguagem do jogo (estilo Skyrim) e fim dos números quebrados

Pedido de Ian: "estude Skyrim e jogos de RPG… desenvolva uma linguagem… explicações simples e funcionais, que o que for dito realmente aconteça, e não use números quebrados; se tiver número quebrado no jogo, refaça para uma melhor explicação e balanceamento".

1. **`LINGUAGEM.md` (raiz)**: 8 regras (texto = contrato com o código; só inteiros; efeito primeiro; uma frase, uma coisa; "você"; glossário fixo; dizer limites; sabor separado) + glossário + antes/depois + checklist. Citado em `src/LEIA-ME.md` (regra 7).
2. **A mecânica passou a usar inteiros** (não só o texto):
   - Recarga de toda habilidade = segundos inteiros (`skillCooldown` arredonda; botão mostra `Math.ceil`). `preciseNumber` agora mostra inteiro.
   - Catálogo de classes (`class-catalog111-base.json`, `expansion260.py`): Mil Cortes raio 5, Evasão 1s, Golpe de Escudo 5 m, Praga 6 m, Muralhas 2 m, Ruína Anunciada 1s, Pedra Suspensa/Colapso Local 1s, Corpo Etéreo 1s, Julgamento +1 m a cada 2 níveis (`kitRadius111` com floor).
   - Habilidades antigas (`380-acoes`): Meteoro 1s, Era do Gelo 1 pulso/s, Fúria dos Céus 3 raios em 1s, Lâmina Rúnica 3/6/9 m raio 2, Mil Cortes 1s raio 5, leque 5 m, praga 6 m.
   - Atributos: movimento +1% a cada 2 de Agilidade, ataque +2% a cada 5, esquiva 1% mais rápida por ponto (ficha mostra "% mais rápida"); crítico +1% a cada 4 de Percepção, dano crítico +1% a cada 2; Estamina/Fúria máximas +1 a cada 2 de Vitalidade/Resistência; `attrRed281`, `critChance`, `bonusPool` e `naturalRegen` arredondados no código (a ficha mostra o que vale); bônus de sobrevivência do `attrs462` em % inteiros, patamares "+20%".
   - Maestria +1% a cada 2 pontos; Diário de caça +1% por marco (antes 0,5%); Troféus +1% a cada 2 guardiões; Tomo do Vampiro 1%/nível, Tomo do Vento 2%/nível; Sede de sangue 2%/melhoria; Arcano −2% recarga/ponto; Sangue 1% a cada 3 pontos; Graça 2%; Paladino básico 1%; título Inabalável esquiva 15% mais rápida; Veterano poção +15% (Mira 75%/90%); Selene 1 ouro a cada 500 por nível.
   - Estamina volta após 1s (Retomar o fôlego: na hora); Recuperação tranquila e biomas Flores/Vulcão 1% a cada 3s; Elo Elemental 1s; Contra-Fluxo 2s; Passagem 1s entre travessias; Firmeza atordoa 2s; Frasco de Paralisia 4s; pistola 1s; provações 2s e 3 m; torre +5 níveis a cada 2 andares (andar 100 = nível 250).
   - Palavras no lugar de frações pequenas: "por um instante", "após um breve aviso".
   - Peso de peixe e distâncias: `wTxt()` (gramas abaixo de 10 kg) e `distTxt()` (metros abaixo de 10 km) em `020-util.js`.
3. **Textos reescritos na linguagem nova**: as 12 habilidades raras (`RSK103`).
4. **Pendente (fase 2)**: peso da mochila/carrinho ainda em kg com vírgula (itens de 0,25–0,75 kg; proposta: unidade "peso" ×10) e reescrita dos ~200 textos de habilidades de classe e passivas no estilo novo.
5. **Teste**: varredura no navegador de 455 habilidades × 11 níveis (5005 textos) e da ficha/atributos/recuperação = zero números quebrados; habilidades lançadas com recarga inteira; sem erro novo no console (o erro do `deep447.js` já existia).

## v483 (20/10/2026) — Coleta Automática de Ouro, Carnes/Espólios Opcionais nos Corpos e Botão de Descarte em Lote

Correções fundamentais pedidas pelo Ian para eliminar sobrepeso indesejado por coleta forçada e agilizar o combate:

1. **Coleta Automática Imediata de Ouro (`src/core/370-v281.js`)**:
   - O ouro dropado por monstros, elites e chefes agora é creditado automaticamente e de forma instantânea diretamente na carteira do jogador (`run.gold`) no exato momento da morte da criatura.
   - Dispara som de moeda (`sfx('coin')`), feedback visual flutuante dourado (`+X ouro`) e atualiza o HUD imediatamente.
   - O ouro não é mais deixado no chão nem dentro do corpo da criatura, eliminando o trabalho tedioso de abrir corpos apenas para pegar moedas.

2. **Carnes e Espólios de Monstros 100% Opcionais (`tools/survival437.js`, `tools/loot353.js`)**:
   - Removida a inserção forçada de carne crua (`carne`), couro (`couro`), ossos (`osso`), penas (`pena`), etc., que era injetada automaticamente na mochila de sobrevivência ao matar qualquer fera e causava sobrepeso imediato.
   - Todos os recursos de caça agora são depositados no saque do corpo (`corpseDrop353` com `type: 'surv'`), ficando visíveis na interação `F · VASCULHAR`.
   - O jogador tem total liberdade: pode inspecionar e escolher pegar apenas o que precisa, ou ignorar completamente os restos mortais sem carregar peso extra.

3. **Botão "Largar Tudo" na Mochila de Sobrevivência (`tools/survival437.js`)**:
   - Na janela de suprimentos (`Tecla V`), itens com quantidade maior que 1 agora exibem um botão `Largar Tudo` ao lado de `Largar 1`.
   - Permite descartar em 1 clique qualquer estoque excessivo acumulado anteriormente.

4. **Regra de Partes Ligadas & Integração**:
   - `tools/loot353.js`: atualizadas as explicações da janela de saque ("O ouro é recolhido automaticamente ao abater inimigos. Espólios, peles e carnes são opcionais e ficam no corpo...").
   - Teste automatizado `tools/test-v483-loot-gold.cjs` cobre e valida os novos comportamentos.

## v482 (20/10/2026) — Correção Crítica de Terreno das Cidades, Bloqueio de Monstros e Matriz Completa de Biomas

Correções de alinhamento visual e terreno de cidades solicitadas pelo Ian após inspeção visual com capturas de tela:

1. **Remoção do Interior Primitivo de Taverna & Restauração Estável**:
   - Revertido o protótipo com caixas e cilindros primitivos (`tavern482.js`). Interiores só serão feitos com modelos GLB texturizados e finalizados em Blender no padrão das armas/monstros do jogo.
   - Pousada de volta ao fluxo seguro e limpo de `innView()` sem telas quebradas ou caixas flutuantes no horizonte.

2. **Aplainamento e Nivelamento Total do Relevo nas 3 Muralhas (`src/core/400-loop.js`, `tools/terrain245.js`)**:
   - O raio de terraplanagem das cidades foi estendido para acompanhar toda a expansão das muralhas concêntricas (Muralha 2 a 85m e Muralha 3 a 115m + margem de transição suave):
     - Anteriormente, o relevo só aplainava 76m (`CITYR + 16`), fazendo com que casas e muralhas do nível 6+ e 8+ fossem construídas sobre morros e encostas íngremes (causando casas flutuando no ar ou enterradas na terra).
     - Agora, `D.push([c.x, c.z, cr + 20, 0])` nivela até 145 metros na cota zero, garantindo que todos os bairros, casas, portões e muralhas fiquem assentados sobre chão plano e uniforme.
   - O desmatamento (`gw`) em `250-mundo-infinito.js` foi alinhado a 120m para evitar árvores dentro dos distritos murados.

3. **Bloqueio de Monstros e Portais Dentro das Cidades (`src/core/170-colisao.js`, `src/core/260-v341.js`)**:
   - `inCity(x, z)` agora reconhece dinamicamente o raio real da cidade expandida (até 125m no nível 8+), impedindo que monstros selvagens (aranhas, feras) considerem os bairros externos como natureza e façam spawn nas ruas.
   - Geração de Fendas (`newGate`) ajustada para respeitar no mínimo 135m de distância das capitais, evitando portais brotando sobre as muralhas ou dentro dos distritos residenciais.

4. **Matriz Completa de Encontros Emergentes por Bioma e Clima (`tools/quests480.js`)**:
   - Detecção ambiental contínua do terreno: biomas (`neve`, `cristal`, `deserto`, `pantano`, `vulcao`, `floresta`, `campos`), águas/costa (`inWater244` / `coast`) e clima (`WX.type === 'rain'`).
   - 17 encontros vivos completos com chibis temáticos personalizados, diálogos, escolhas e objetivos no minimapa (Náufragos nas marés, expedições na neve, caravanas no deserto, bruxas de pântano, forja de magma e o Mago da Tempestade na chuva).

## v481 (20/10/2026) — As 3 Muralhas de Attack on Titan, Ciclo de 1h (40/20), Tempo Proporcional e Encontros Vivos estilo Skyrim

Avanços cruciais pedidos pelo Ian para consolidar um mundo verdadeiramente vivo, imersivo e contínuo:

1. **As 3 Muralhas Concêntricas de Attack on Titan (Sina, Rose e Maria)**:
   - **Muralha 1 (Central / Sina — 60m)**: Sempre presente, cerca a Praça do Selo, Pedra-Âncora, o Banco, a Guilda, Taverna e as primeiras casas nobres.
   - **Muralha 2 (Intermediária / Rose — 85m)**: Desbloqueada no Nível 6 municipal. Cerca o Primeiro Distrito com 14 casas adicionais, feira de rua, oficinas, estábulos e 4 portões com torres.
   - **Muralha 3 (Externa / Maria — 115m)**: Desbloqueada no Nível 8 municipal. Cerca o Segundo Distrito com 18 casas, a grande Catedral de Pedra com vitrais iluminados, serraria, moinhos internos e baluartes reforçados.
   - Todas as 3 muralhas permanecem de pé simultaneamente a partir do nível 8, formando a gigantesca fortaleza de três anéis concêntricos com portões quádruplos alinhados para carroças e pedestres.

2. **Duração do Dia/Noite Calibrada para 1 Hora Real (40 min / 20 min)**:
   - Ciclo completo definido exatamente em 60 minutos reais (`DAYLEN = 3600`).
   - 40 minutos de luz solar contínua (06:00 às 18:00 no relógio).
   - 20 minutos de noite densa e atmosférica (18:00 às 06:00 no relógio).
   - Transição e relógio (`clock384`) perfeitamente calibrados para as novas proporções.

3. **Ritmo de Tempo das Fendas 100% Contínuo e Proporcional**:
   - Fim dos degraus artificiais e travas fixas: `daysPassed = (durSec / 3600) * 7`.
   - Exatamente: 60 minutos reais dentro de uma fenda equivalem a 7 dias no mundo exterior; 120 minutos reais equivalem a 14 dias; cada 5 minutos equivalem a ~14 horas.
   - Recuar após 30 segundos ou 1 minuto avança apenas frações suaves de hora, sem queimar dias inteiros desnecessariamente.

4. **Simulação Autônoma Contínua no Mundo Aberto (`WorldSim479.worldTick`)**:
   - A simulação das regiões não espera o jogador e não depende exclusivamente das saídas de fenda: roda de forma contínua durante a exploração do mundo aberto.
   - Caçadores patrulham, enfrentam monstros e entregam suprimentos continuamente.
   - Requisitos de construção (`buildMax`) escalonados (300 a 10.000 pontos) para que a evolução das cidades seja uma conquista progressiva e realista ao longo de semanas de jogo, e não um salto repentino.

5. **Missões Secundárias Orgânicas Encontradas no Mundo Aberto estilo Skyrim (`tools/quests480.js`)**:
   - Encontros dinâmicos que surgem espontaneamente ao explorar estradas e ermos:
     - **Caçador Ferido na Estrada**: Emboscado por feras, clama por socorro e pede vingança contra o lobo alfa.
     - **Mercador de Carroça Quebrada**: Saqueado por bandidos, oferece divisão de lucros se você recuperar a carga no esconderijo.
     - **Sábio do Monólito Ancestral**: Estuda runas antigas e propõe a provação da sombra contra um guardião de pedra.
     - **Batedor Renegado**: Escondido nas rochas, entrega as coordenadas de uma caverna secreta com arca abissal.
   - Total liberdade Skyrim: aproxime-se, converse com `[F]`, escolha aceitar, ajudar ou simplesmente seguir viagem sem penalidades.

## v480 (20/10/2026) — Carroça rápida, ciclo de tempo calibrado, visual vivo das cidades e Missões Secundárias estilo Skyrim

Quatro grandes avanços pedidos pelo Ian com foco em jogabilidade fluida, liberdade de exploração e mundo vivo:

1. **Velocidade da Carroça e Transporte de Cargas**:
   - Carroça cívica das estradas (`Civic343`): velocidade aumentada para 14.5 m/s (rotação das rodas a 18.0 rad/s), superando com folga o sprint do jogador (8.6 m/s).
   - Carroça manual do jogador (`Cart437` / `Survival437`): puxar a carroça concede multiplicador de 1.48x de velocidade sem penalidade de estamina por sobrepeso, permitindo transporte ágil de minérios e materiais entre postos e capitais.

2. **Calibração do Ritmo Temporal e Fendas**:
   - Duração do ciclo dia/noite duplicada para 48 minutos reais (`DAYLEN = 2880`), garantindo 28 minutos de dia e 20 minutos de noite para exploração calma.
   - Saída de emergência das Fendas: fugir de uma fenda perigosa ou de nível muito alto nos primeiros 60 segundos avança apenas 1 dia no mundo exterior. Expedições profundas e completas avançam os dias conforme a profundidade (7 a 14 dias).
   - Remoção do feixe vertical de luz dos portais do mundo comum; o feixe brilhante agora é exclusivo do portal de saída dentro das masmorras para orientar fugas seguras.

3. **Cidades que Mudam Visualmente a Cada Nível (Nível 0 a 10)**:
   - Densidade de casas internas cresce dinamicamente (de 4 casas em assentamentos básicos até 14 na vila desenvolvida).
   - Nível 1: Estandartes heráldicos nas torres e acessos.
   - Nível 2: Área de suprimentos com carroças, caixotes e pilhas de madeira e pedra.
   - Nível 3: Quatro colunas de mármore adornando a praça e cristais rúnicos nas muralhas.
   - Nível 4: Grande feira central com barracas coloridas, toldos e bancadas de mercadorias.
   - Nível 5: Rede de postes de luz nas quatro avenidas principais, iluminando a cidade à noite com lâmpadas douradas.
   - Nível 6: Bairros externos (extramuros) com muralha secundária alta e torres ao estilo Attack on Titan.
   - Nível 7: Moinhos de vento funcionais e serraria nos campos agrícolas.
   - Nível 8: Segunda expansão extramuros e Catedral de pedra com vitrais iluminados.
   - Nível 9: Monumentos de heróis e Obelisco de Mana irradiando feixe para o céu.
   - Nível 10: Praça dourada com runas circulares ativas e honras imperiais.
   - Sincronização em tempo real de todas as capitais no simulador autônomo com recarregamento imediato dos modelos 3D dos chunks.

4. **Missões Secundárias & Liberdade Aberta estilo Skyrim (`tools/quests480.js`)**:
   - Murais de Contratos e Recompensas nas praças das 6 capitais (Aster, Solaria, Ymiria, Zahar, Thalor, Urdan & Verden).
   - Contratos de caça a feras abissais, bandidos renegados e resgates com recompensas generosas de ouro, reputação e títulos.
   - Integração completa: botão de acompanhamento no HUD com distância métrica em tempo real, marcador verde em diamante no Minimapa do mundo aberto, e aba dedicada "Contratos" no Diário de Jornada [L].
   - Liberdade absoluta: o jogador pode aceitar, ignorar, desviar o caminho ou abandonar qualquer contrato a qualquer momento sem falhas ou punições.

## v479 — Simulação Autônoma de Mundo Vivo: Capitais, Governantes, Editais, Economia e Caçadores NPCs, 19/10/2026
- Pedido de Ian:
  - "Uma coisa que eu quero implementar no jogo, e pode ser agora mesmo depois de terminar tudo o que está fazendo. O mundo tem que acontecer sozinhos. Se eu estou dentro da masmorra e passou 14 dias, as coisas que estão descritas ali que aconteceram depois que eu saí tem que ter acontecido mesmo. Tipo, Astera pode crescer, pode ser melhorada e passar para os próximos níveis sem precisar de mim. Caçadores que chegam ali no jogo, eles mesmos vão aí, botam, tentam ajudar, Astera cresce. Todas as regiões, elas têm que ter uma natureza, uma economia e um sistema próprio que funciona sozinho, sabe, no jogo. Podem ter reis, prefeitos, presidentes, governadores das regiões. Tem que ter esse sistema, sabe? Eu quero um jogo que ele funcione sem eu precisar estar lá, e quando eu estou, eu só agrego. Entende? É um sistema mais ou menos assim."
- Mudanças técnicas implementadas:
  - **Módulo de Simulação de Mundo Autônomo (`tools/worldsim479.js`)**:
    - Criado sistema com as 6 Grandes Capitais e Regiões de Primeva (Aster, Solaria, Ymiria, Zahar, Thalor, Urdan & Verden).
    - Cada região possui Governantes / Líderes com perfis temáticos:
      - Aster: Comandante Brann & Chanceler Lyra (Regentes da Ordem dos Caçadores)
      - Solaria: Grão-Mestre Aurelius (Arquimestre da Cidade do Sol Eterno)
      - Ymiria: Arquiduquesa Astrid Frostgard (Senhora do Aço Negro e Bastião do Gelo Profundo)
      - Zahar: Emir Tariq Al-Zahar (Guardião das Areias e Pérola das Dunas Vermelhas)
      - Thalor: Almirante Varis Onda-Viva (Lorde dos Portos e Mares Bravios)
      - Urdan & Verden: Arquidruida Eldrin & Conselho das Raízes (Voz da Natureza e Vale dos Ancestrais)
    - Cada região conta com Editais de Governança com recompensas permanentes (reforço de muralhas, colégios de caçadores, caldeiras geotérmicas, aquedutos, estaleiros navais, santuários ecológicos).
    - Quadro de Caçadores NPCs autônomos por região (ex.: Aldric das Brumas, Valen Radiante, Torben Machado-de-Gelo, Farid Falcão-das-Dunas, Kaelen Garra-Verde) que patrulham estradas, acumulam triunfos e entregam materiais de construção independentemente da presença do jogador.
    - Economia e caravanas autônomas que realizam viagens comerciais, reduzem escassez de produtos e selam fendas secundárias no horizonte.
    - Crescimento e elevação de nível de cidades autônomo: `rState.level` e `profile.cityLv` sobem sozinhos quando os caçadores e artesãos atingem os pontos de construção (`buildPoints >= buildMax`), destravando tiers visuais, torres e descontos sem exigir que o jogador pague todas as doações.
    - Papel do Jogador ("Quando estou, eu só agrego"): o jogador pode voluntariamente financiar ouro ou doar cristais de mana no Conselho Regional para acelerar as obras públicas e editais em andamento (`WorldSim479.playerContribute`), subindo cidades e colhendo recompensas mais rápido.
    - Interface interativa do Conselho Regional (`WorldSim479.openCouncilView(rid)`): acessível pela aba de Cidades (`cityTab`), visualizador de regiões (`regionView116`) e após o rescaldo de fendas procedurais. Permite navegar entre todas as capitais, inspecionar o governante, o progresso do edital e o ranking dos caçadores locais.
  - **Integração com a Passagem do Tempo de Fendas e Dias Reais**:
    - `src/core/270-masmorra-procedural.js`:
      - `spawnRiftAftermath456(gx, gz, rank, daysPassed)`: dispara imediatamente a simulação de dias passados (`WorldSim479.simulate(daysPassed, { fromRift: true, rank })`).
      - `showRiftTimeReport456(daysPassed, rank)`: substitui o texto estático de fenda por eventos reais gerados pela simulação (`WorldSim479.generateRiftReportHtml(daysPassed, rank)`), relatando exatamente quais capitais expandiram de nível, editais concluídos pelos governantes e fendas seladas por NPCs enquanto o jogador esteve fora.
    - `src/core/450-oraculos-status-diaria-ecos-guilda-forja.js`:
      - `ensureRun()`: detecta a passagem de dias reais (`todayKey() > S.lastSimDay`) e avança a simulação diária do mundo autônomo mesmo em sessões normais sem entrar em fendas procedurais.
    - `src/core/460-ideias-afixos-pesca-culinaria-mimic-titu.js` e `src/core/600-bloco-regions116.js`:
      - Adicionado botão de atalho direto para o Conselho Regional em `cityTab()` e `regionView116()`.
  - **Montagem, Build e Versão**:
    - `game.html`: registrado `<script src="tools/worldsim479.js?v=479"></script>`.
    - `sw.js`: atualizado cache para `pds-v479` e incluído `tools/worldsim479.js?v=479`.
    - `VERSAO.md`: atualizado para `v479`.
    - `tools/build.py`: executado com sucesso gerando `index.html`.

## v478 — Direção de ataque por movimento, feixes de portais, minério na dungeon, debuffs de peso/parasitas, gelo cristalino e limpeza da HUD, 19/10/2026
- Pedidos de Ian:
  1. "Tá vendo isso aí que tá acontecendo? O ataque não tá indo para o lado que eu tô direcionando. Aparece o fluxo para o lado esquerdo enquanto eu tô apertando para o lado direito. Tá bugado de novo, tem que arrumar também."
  2. "Não tem aparecido também o feixe dos portais. Isso é ruim, porque daí eu não sei como sair."
  3. "O asset que é para minerar na dungeon está com o asset de outra coisa que é para tomar água. Tem que arrumar isso aí."
  4. "O que significa isso e por que ele fica aí? Nada disso é explicado. Me joga várias mecânicas no jogo e se eu não sou o criador, eu não sei como funciona, não sei onde eu vejo. [Placa Cerco Contido e halo na cabeça]"
  5. "ESSA BARRAS NA MINHA CARA ELA TEM QUE OU ME ACOMPANHAR OU NÃO EXISTIR"
  6. "Outra coisa, eu estou com mais peso do que eu posso ter na mochila e não está acontecendo nada. Eu deveria pelo menos andar mais devagar ou ter mais dificuldade no meu ataque com espada ou arco ou qualquer coisa, diminuir a velocidade... E parasitas/corrupção está fazendo um bom tempo e não aconteceu nada."
  7. "Esse gelo está meio bizarro. E tem que fazer nas habilidades também, parece que você só fez nos auto-ataques. Eu queria que tudo isso fosse incluído em todas as habilidades... parece um PNG, tipo uma bomba do Call of Duty."
  8. "Outra coisa, tem muito texto ali quando você vai escolher a tua classe, muito texto. Eu só queria que mostrasse o quanto ganha por nível, não comparando com nada. Não precisa ter escrito ali que os nove pontos iniciais da classe são distribuídos... Mudou, não preciso escrever que mudou."
- Mudanças técnicas implementadas:
  - **Direção de Ataque Prioritária por Movimento**:
    - `src/core/380-acoes.js`: criada a função `playerMoveDir()` e atualizada a lógica de `faceTarget()`. Quando o jogador está se movimentando com WASD / setas, o golpe (espada, arco, cajado ou habilidade) e o fluxo visual (`fxSlash`, `Combat139`) alinham-se estritamente à direção do movimento, a menos que o cursor esteja ativamente sobre um monstro específico.
    - `tools/witcher377.js`: removido o gatilho acidental de clique curto do botão direito que ativava a trava de mira (`toggleLock()`) durante o giro de câmera, evitando puxar o ataque para inimigos fora do curso.
  - **Remoção da Barra na Cara e Halo Flutuante**:
    - `src/core/410-overlay-e-hud.js`: eliminada a mini-barra verde/azul desenhada em canvas sobre a face do personagem (o HUD principal na tela já monitora HP/MP com precisão). Mantidos apenas os marcadores de status de combate temporários quando afetado por debuffs.
    - `src/core/160-jogador.js`: removido o toroide branco (`halo`) que ficava permanentemente aceso sobre a cabeça do modelo.
    - `src/core/270-masmorra-procedural.js`: removida a placa flutuante de texto 3D `CERCO CONTIDO · X DIAS`. O rescaldo da fenda mantém a cratera e estilhaços físicos no solo e interação limpa `F · RELATÓRIO DO CERCO`.
  - **Feixe Luminoso nos Portais de Saída e Fendas**:
    - `src/core/260-v341.js`: adicionado feixe vertical luminoso contínuo de 80m de altura com gradiente ciano/lilás nos portais de fenda do mundo aberto (`Rift131`).
    - `src/core/270-masmorra-procedural.js`: adicionado farol vertical de 85m (`owExitBeam478`) no portal de saída da dungeon procedurais e do Outro Mundo, visível de qualquer sala ou planície.
  - **Mineração Correta na Dungeon**:
    - `src/core/270-masmorra-procedural.js` e `tools/otherworld460.js`: substituído o tipo `poca_abissal` por `minerio_abissal`. Renderiza um depósito rochoso multifacetado com cristais puros integrados (`owOreRock478`), com o rótulo `F · MINERAR MINÉRIO E CRISTAIS DO OUTRO MUNDO`, concedendo minério, pedras e cristais abissais com efeito de mineração.
  - **Debuff de Peso Excessivo (Sobrecarga) e Parasitas Ativos**:
    - `tools/survival437.js`: conectado o cálculo de velocidade real do motor (`movementSpeed`) ao multiplicador de peso `overMul()`. Ao exceder o peso da mochila, a velocidade cai drasticamente (para até 25%), o sprint é bloqueado (`Sprint373.canSprint = false`), e o intervalo de recuperação dos ataques com espada/arco é retardado proporcionalmente em `src/core/380-acoes.js`, exibindo alerta de sobrecarga.
    - Parasitas: o debuff agora drena 2.5% da vida máxima a cada 3.5s com números flutuantes roxos, diminui a velocidade em 18% e drena estamina, motivando o jogador a ferver água ou consumir chá/antídoto.
  - **Gelo Cristalino e Habilidades Fluidas em Todas as Classes**:
    - `src/core/340-efeitos-visuais-por-habilidade.js`: substituído o sprite plano de água nos projéteis gélidos por um cluster tridimensional com núcleo octaédrico translúcido e lascas de cristal pontiagudas (`iceCore478` e `iceShard478`).
    - `tools/flip470.js`: impacto de gelo agora produz estilhaços cristalinos vivos (`fxBurst`) e runa suave de geada no chão (`zoneMark178`), sem cartazes planos com bordas quadradas.
    - `castFluid139`: removido o bloqueio que ignorava classes de ataque à distância; todos os ataques e habilidades agora desfrutam dos rastros fluidos e sequências visuais estéticas de combate.
  - **Limpeza do Painel de Escolha de Classe**:
    - `tools/classgrowth465.js`: simplificado o painel de classe para exibir apenas a tabela concisa de ganhos por nível (`+X/nível` de Vida, Mana, Ataque Físico e Mágico), sem comparações com o guerreiro, projeções de nível 50 ou textos explicativos de atualizações passadas.
    - `src/core/630-controles.js`: removido texto burocrático sobre pontos de atualização no registro do Livro da Ordem.

## v477 — Efeitos fluidos estilizados (fantasia RPG) substituindo texturas fotográficas e esclarecimento da defesa, 19/10/2026
- Pedidos de Ian:
  1. "Não sei se tu consegue perceber, mas pelo menos na imagem que eu estou colocando, parece distópico de como é o meu jogo. Ela parece algo mais realista da vida real, parece um PNG, tipo uma bomba do Call of Duty. Não parece algo daquela realidade. Mais importante, parece muito um PNG. Não sei se tu consegues fazer efeitos fluidos mais realísticos, mas com a vibe do meu game. Eu não sei como explicar isso, eu preciso de ajuda para isso."
  2. "Faz isso para todos os auto-ataques e todas as habilidades do jogo. Use o que precisar, Blender ou o que for... para ficar... no estilo Skyrim, mas com a aparência do meu game."
  3. "E a mecânica ali do escudo de segurar a bolinha para defender, eu não sei como é que está funcionando, se eu preciso ter um escudo ou não, enfim."
- Mudanças técnicas:
  - Eliminação total dos efeitos estilo "bomba fotográfica/Call of Duty":
    - As antigas texturas de vídeo fotográfico/gasolina da Unity Labs foram integralmente substituídas por sequências procedurais de fantasia estilizada renderizadas no Blender 5.2 (EEVEE):
      - `fx/unity470/explosion_5x5.webp` (?v=477): 25 quadros de detonação mágica de alta energia com núcleo dourado radiante (`#fff2a0`), camada de fogo saturado (`#ff6200`), contornos limpos ("traços") de cinza rubro escuro e faíscas/brasas orbitantes.
      - `fx/unity470/fireball_8x8.webp` (?v=477): 64 quadros de bola de fogo rodopiante com línguas de fogo estilizadas e brasas dinâmicas.
      - `fx/unity470/flame_16x4.webp` (?v=477): 64 quadros cíclicos de chamas dançantes com contornos toon para monstros queimando.
      - `fx/unity470/smoke_8x8.webp` (?v=477): 64 quadros de pluma de fumaça e fuligem estilizada em ardósia escura/obsidiana com brasas douradas vivas e contornos suaves, unindo a volumetria de Skyrim aos traços de Primeva.
      - `fx/unity470/dust_16x4.webp` (?v=477): 64 quadros de ondas de poeira de impacto físico com tons terrosos quentes de calçamento (`#8f7d66`/`#baa993`).
  - Harmonização de Escala e Ancoragem ao Solo:
    - `tools/flip470.js` (?v=477): escalas de spawn reduzidas de 2.6–2.8m para 1.15–1.7m, concentrando os efeitos no corpo do monstro sem cobrir a tela inteira como um billboard plano.
    - Ancoragem espacial ao terreno: acertos críticos e elementais em `hurtEnemy` e finalizações em `killEnemy` agora geram anéis de choque luminosos no solo via `fxRing`, fixando os efeitos no espaço 3D do mundo.
  - Esclarecimento da Defesa e Mecânica do Escudo:
    - **Não é obrigatório ter escudo para defender**: qualquer personagem (com ou sem arma) pode segurar o botão do meio (roda do mouse) para erguer a guarda (bloqueia 50% do dano frontal, custa estamina) e aparar (soltar/iniciar até 0,22s antes do impacto: nega 100% do dano, atordoa o monstro por 1,2s e concede contra-ataque crítico x1,8).
    - **Com escudo equipado** (slot `sh` no inventário com arma de uma mão): a redução de dano sobe para 75%, o custo de estamina cai pela metade, a janela de aparar aumenta para 0,32s, o modelo 3D do escudo é erguido na mão esquerda cobrindo o peito (`tools/shield473.js`), e libera a habilidade **Escudada** (segurar meio + clique esquerdo empurra o monstro 2,5m e atordoa por 0,7s).
  - Versão e Service Worker:
    - `sw.js`: versão elevada para `pds-v477` e hashes atualizados para todas as folhas WebP.
    - `VERSAO.md`: atualizado para `v477`.
    - `tools/build.py`: executado com sucesso (montagem do `core_parts`, sincronização e geração do `index.html`).
- Teste e Validação:
  - `python tools/core_parts.py check` validou `ok`.
  - `node --check` em todos os arquivos modificados passou com 0 erros.
  - Suite automatizada Playwright (`tools/test-v477.cjs`) no Microsoft Edge validou com 100% de sucesso e 0 erros:
    - Todas as 8 folhas WebP carregadas e instanciadas corretamente no `Flip470`.
    - Controles de mouse: botão do meio ativa/desativa defesa, botão direito arrasta câmera.
    - Spawns de explosão, bola de fogo, fumaça híbrida, chamas contínuas, poeira e anéis de choque no solo validados visualmente.

## v476 — Defesa no botão do meio, câmera no botão direito, magia sem sólidos e fumaça estilo Skyrim harmonizada com Primeva, 19/10/2026
- Pedidos de Ian:
  1. "Ficou muito ruim o botão de defesa no direito. Troca para ele ser no do meio e a mira voltar a ser onde ela é, a bolinha de movimentar a visão no direito de novo."
  2. "Outro ponto importante é aqueles sólidos que eu usei no Tripo para as habilidades, os outros ataques de mago e etc. Eu disse que podiam ser retirados e usar só aquilo que foi criado no Blender."
  3. "E também achei a fumaça muito irrealista, não bate com o cenário. Eu queria algo mais desenho, mas também realidade, algo mais fluido, com traços... estilo Skyrim... mas que puxe para o visual do meu RPG, do meu jogo. Tira prints do meu jogo, compara com Skyrim e faz algo novo, algo que remeta ao meu jogo e que seja no estilo Skyrim, mas com a aparência do meu game."
- Mudanças técnicas:
  - Controles do Mouse:
    - `tools/guard472.js` (?v=476): defesa, aparar e escudada mapeadas para o botão do meio (`e.button === 1`, com prevenção de rolagem/autoscroll em `auxclick`).
    - `src/core/400-loop.js`: rotação e arrasto da câmera restauradas para o botão direito (`e.button === 2`, `e.buttons & 2`).
    - `tools/witcher377.js` (?v=476): clique curto no botão direito (< 8 px de movimento) trava/solta o alvo (lock-on).
    - `src/core/630-controles.js`: texto do modal de controles ("CONTROLES DE PC") atualizado para orientar o jogador sobre o botão do meio para defesa e botão direito para câmera/mira.
  - Magia sem sólidos rígidos:
    - `src/core/340-efeitos-visuais-por-habilidade.js`: remoção total dos modelos 3D sólidos rígidos do Tripo e esferas/icosaedros sólidos em magias e ataques de magos (`projModel`), bem como do meteoro (`fallFx`). Projéteis mágicos e habilidades de área agora usam exclusivamente sprites animados fluidos (`Flip470` com as folhas de fogo, raio, água, fumaça/trevas, runa dourada).
    - `src/core/380-acoes.js`: `updateProjectiles253` atualizado para avançar a animação dos quadros da folha de sprite (`userData.spriteFx`) durante a trajetória de voo em sincronia com os rastros de partículas elementais.
  - Fumaça Híbrida Skyrim + Primeva:
    - `fx/unity470/smoke_8x8.webp` (?v=476): nova folha de 64 quadros (8x8, 1024x1024, 171 KB) renderizada via Blender 5.2 headless com EEVEE. Combina a turbulência densa, plumas volumétricas de fuligem e brasas ardentes de Skyrim com contornos estilizados ("traços"), sombreamento facetado e iluminação quente em tom âmbar (`#ffd070` / `#ff8a1e`) extraídos diretamente da paleta de Primeva.
    - `tools/flip470.js` (?v=476): parâmetros de morte de inimigos ajustados para escala natural (1.8 a 2.5), dispersão suave e sem lavagem de cor, revelando as brasas e o contorno da nova fumaça.
  - Versão e Service Worker:
    - `sw.js`: versão elevada para `pds-v476` e caches atualizados.
    - `VERSAO.md`: atualizado para `v476`.
    - `tools/build.py`: executado com sucesso (montagem do `core_parts`, sincronização e geração do `index.html`).
- Teste e Validação:
  - `python tools/core_parts.py check` validou `ok`.
  - `node --check` em todos os arquivos modificados passou com 0 erros.
  - Suite automatizada Playwright (`tools/test-v476.cjs`) no Microsoft Edge validou com 100% de sucesso e 0 erros:
    - Defesa ativa e liberada pelo botão do meio (botão 1).
    - Rotação de câmera e lock-on ativos no botão direito (botão 2) sem acionar guarda.
    - Projéteis de mago sem nenhuma malha sólida rígida, com sprites fluidos do Flip470 animados durante o voo.
    - Meteoro (`fallFx`) sem geometria de esfera sólida.
    - Renderização da fumaça híbrida de fuligem com brasas sem erros.
    - Modal de controles exibindo as instruções corretas.

## v475 — Habilidades: visual realista (raio, água, runa dourada) e área de dano batendo com o visual (zone475), 19/10/2026
- Pedido de Ian:
  1. Visual realista, fluido e visceral para TODAS as habilidades e auto-ataques: substituir esferas sólidas por efeitos elementais de verdade (fogo, raio, água, fumaça/trevas, luz/sagrado, poeira física), reaproveitando `Flip470.spawn(...)`. Renderizar os efeitos faltantes (raio, água e círculos de runa dourados no estilo tomsilf_motion) no Blender 5.2 headless em sequências de quadros WebP 8x8 (1024x1024).
  2. Área de dano batendo com o visual (`tools/zone475.js`): enquanto o efeito estiver na tela, ele dá dano naquela área física/geométrica (sombra convexa no solo atualizada a cada quadro), uma vez por lançamento/cast, e empurra os monstros para fora (fora chefes). Empurrões sem dano (como Maremoto, força 0) passam a ferir como golpe normal (força 1). Efeitos de prender/lentidão/puxar ferem na área sem empurrar.
- Mudanças técnicas:
  - `fx/unity470/lightning_8x8.webp` (novo): 64 quadros de arcos elétricos e descargas de raio volumétricas renderizadas via Blender 5.2 headless.
  - `fx/unity470/water_8x8.webp` (novo): 64 quadros de borrifos fluidos e ondas de água renderizadas via Blender 5.2 headless.
  - `fx/unity470/rune_8x8.webp` (novo): 64 quadros de círculos e mandalas rúnicas douradas com nós geométricos entrelaçados (estilo tomsilf_motion) renderizadas via Blender 5.2 headless.
  - `tools/flip470.js` (?v=475): inclusão de `lightning`, `water` e `rune` nas folhas carregadas; detecção aprimorada dos 5 elementos em `hurtEnemy` e `killEnemy`; exposição de `Flip470.live` e propriedade `kind` em cada sprite vivo para rastreamento.
  - `tools/zone475.js` (novo módulo, ?v=475): intercepta conjurações (`runSkill` e `kitRun111`), rastreia peças visuais ativas (`fxs`, `VFX302.live`, `Flip470.live`), projeta casco convexo no chão atualizado com escala/posição, aplica dano único por conjuração com identificação por alvo, empurra inimigos para fora na direção de propagação do efeito (ou radial ao centro da conjuração) e converte empurrões de força 0 em força 1 padrão.
  - `src/core/340-efeitos-visuais-por-habilidade.js`: `projModel` atualizado com malhas compostas e brilhos elementais dedicados; `skillFx` integrado com disparos de `Flip470` para labaredas, ondas glaciais/líquidas, relâmpagos e runas douradas de cura/invocação.
  - `src/core/380-acoes.js`: `projectileImpact253` e `updateProjectiles253` disparando rastros e impactos realistas do `Flip470` conforme o elemento.
  - `src/core/650-bloco-runtime111.js` e `tools/kit111-runtime.js`: integração do `Flip470` no `kitRun111` e atualização do texto de empurrão no `kitEffect111`.
  - `game.html` e `sw.js`: inclusão do `tools/zone475.js?v=475`, cache de novos WebP e elevação da versão do Service Worker para `pds-v475`.
- Teste (navegador Edge headless via Playwright, `tools/test-v475.cjs`): 17 asserções validadas com 0 erros de página ou console: folhas de textura carregadas com sucesso, spawn de raio/água/runa, detecção de área visual no solo, aplicação de dano pow: 1 em empurrão sem dano (Maremoto), empurrão físico do monstro para fora da área, prevenção de dano repetido no mesmo cast (single-hit tracking) e projéteis elementais mágicos com impacto explosivo.

## v474 — Escudo erguido à frente ao defender, 19/10/2026
- Pedido de Ian: "faz a animação com o escudo erguido à frente".
- `tools/shield473.js` (?v=474): por cima do clipe "guarda", logo antes de desenhar, o braço esquerdo é mirado em espaço do mundo (cotovelo à frente/esquerda do peito, mão à frente do peito) e o escudo vira com a face para onde o personagem olha; entra e sai em ~0,1 s e devolve a rotação original do escudo. Só com escudo ativo (arma de uma mão).
- Teste (navegador): espada + escudo, segurando o botão direito → escudo na frente do peito, face para a frente (print). Sem erro no console.

## v473 — Slot de Escudo, escudo na mão esquerda e pose de defesa, 19/10/2026
- Pedido de Ian: "faz o slot de escudo com modelo na mão e animação de defesa".
- `tools/shield473.js` (novo, ?v=473): slot "Escudo" (`sh`) entra em `EQUIP_SLOTS`/`EQUIP_LABEL` → aparece na ficha (linha de baixo), em baús, loja e forja como as outras peças; vale meia armadura (`equipFactor` 0,5). Só conta com arma de uma mão (espada, machado, maça sacra, pistola) ou sem arma; com duas mãos/adagas a ficha avisa "Escudo guardado". Segurando o botão direito, o Viajante faz o clipe "guarda".
- `tools/warrior-player127.js` (?v=473): o escudo da mão esquerda (o mesmo que machado/maça já mostravam) também aparece quando há escudo equipado e arma de uma mão.
- `tools/guard472.js` (?v=473): "tem escudo" passa a exigir arma de uma mão.
- Teste (navegador): slots w,a,h,g,b,sh; "Escudo de Mithril" com 127 de escudo; espada + escudo equipados → escudo na mão esquerda (print) e pose de guarda ao defender; cajado → aviso e escudo sem efeito; 44 de 200 itens sorteados foram escudos.
- Pendente: o clipe "guarda" é uma pose de prontidão, o escudo não sobe à frente do corpo; um clipe próprio de bloquear (escudo erguido) pode ser feito depois.

## v472 — Defender, aparar e contra-atacar (botão direito); câmera no botão do meio, 19/10/2026
- Pedido de Ian: "faz o bloqueio, aparar e contra-ataque com escudo e espadas" (referência: combate do Enshrouded) e "Defender no botão direito do mouse; a câmera vai para o botão do meio".
- `tools/guard472.js` (novo, ?v=472; envolve `hurtPlayer`, `hurtEnemy`, `attack`, `movementSpeed`): segurar o direito = defender (golpes de frente ~75° para cada lado: 50% do dano, 25% com escudo; gasta Estamina 8 + 25% do dano, metade com escudo; sem Estamina a guarda quebra: lento e sem defender 1,5 s); andar a 55% defendendo. Aparar = começar a defender até 0,22 s antes do golpe (0,32 s com escudo): sem dano, "APARADO!", faíscas, inimigo atordoado 1,2 s (chefe 0,5 s) e próximo golpe em 1,6 s é contra-ataque x1,8 (crítico). Defendendo + esquerdo: escudada (só com escudo; empurra 2,5 m, atordoa 0,7 s, 15 Estamina, a cada 1,2 s); sem escudo não ataca enquanto defende. Inimigos que vão golpear de perto piscam branco no começo da preparação.
- Escudo lido de `run.equip.sh`. **Pendente:** criar o slot de escudo (item, inventário, modelo na mão esquerda e animação de defesa) — pedido de Ian.
- Câmera: `400-loop` gira com o botão do meio arrastado; `tools/witcher377.js` (?v=472): clique curto no meio (sem arrastar) trava/solta o alvo.
- Partes ligadas: tela de controles (`630`, linha "Mouse") reescrita; comentário do `400`.
- Teste (navegador, Viajante): sem defesa 16 de dano; aparar 0 + inimigo atordoado 1,2 s; contra-ataque 18 (x1,8); defendendo 6 e gastou 13 de Estamina; de costas não defende (16); com escudo de teste 1 de dano; escudada empurrou 2,5 m e atordoou; velocidade 10 → 5,5 defendendo; câmera girou com o meio. O aviso de piscar não foi visto em ataque real (teste simulado).

## v471 — Efeitos realistas de fogo, explosão, chamas e fumaça, 19/10/2026
- Pedido de Ian: "algo mais real, mais fluido, mais visceral" nas habilidades e ataques; combinação aprovada: pacotes prontos + Blender. Ian autorizou baixar os pacotes da Unity Labs (CC0).
- `fx/unity470/` (novo): 5 folhas WebP da Unity Labs, licença CC0 (`LICENCA-CC0.txt`): bola de fogo 8x8, explosão 5x5, chama 16x4, fumaça 8x8, poeira 16x4.
- `tools/flip470.js` (novo, ?v=471, depois da juice468; envolve `hurtEnemy` e `killEnemy`): acerto de fogo (projétil de fogo/meteoro, queimadura, arma ou classe de fogo) → bola de fogo real (crítico/3º golpe/habilidade → explosão); golpe forte sem fogo → poeira no chão; monstro queimando → chama real acompanhando o corpo enquanto durar; morte → fumaça subindo (morte queimando → explosão + fumaça). Sprites virados para a câmera, uma textura por tipo, limite 60 (24 no modo leve). Só visual: dano e regras não mudam; vale para todas as classes e armas.
- Teste (navegador): chamas e fumaça aparecem e somem; acerto de fogo e morte geram os efeitos sem erro. Não gravei vídeo dentro do jogo.

## v470 — Autonomia de Sobrevivência: Alquimia, Frascos Arremessáveis, Forja Rústica e Peixe Frito na Fogueira, 19/10/2026
- Pedido de Ian (Etapa 2):
  1. Alquimia botânica: matinhos, flores, raízes e fungos variados pelos biomas e Fendas (cura, sangue, veneno, ácido, fogo, gelo, vigor, luminescência); Caldeirão / Bancada de Alquimia no acampamento; poções de beber (cura imediata, regeneração contínua, vida máx, resistência térmica/elemental e vigor); frascos arremessáveis em área com balística 3D (veneno/lentidão, ácido redutor de armadura, fogo líquido, cortina de fumaça e choque paralisante).
  2. Forja Rústica de Acampamento (Fornalha e Bigorna): estrutura portátil no acampamento [B] combinando minérios, madeiras e partes de monstros para gerar armas com atributos, visuais e efeitos únicos (sangramento, veneno, gelo, fogo e quebra de postura).
  3. Fritar Peixe na Fogueira: conexão direta entre a pesca (lakeAt239 / run.fish) e a fogueira portátil acesa, permitindo fritar peixes com chiado na brasa, fumaça, restauração de Fome/Vida e bônus de calor de sobrevivência.
  4. Correção da tela de morte: corrigido o aviso de "Você tem 9 pontos para distribuir" para indicar que os 9 pontos retornaram automaticamente para a classe.
- Mudanças técnicas:
  - `tools/alchemy470.js` (novo módulo, ?v=470): catálogo de botânica, caldeirão com receitas de poções e frascos arremessáveis, física de arremesso parabólico 3D (`throwFlask`) com detonação em área, hook no dano para debuff ácido (-50% armadura), sistema de forja rústica de armas e fritura de espécies de peixe.
  - `tools/build437.js`: inclusão das estruturas `caldeirao` e `forja` em `STRUCTS` com custos balanceados e recolhimento [F]; integração do modal da fogueira com a lista de peixes pescados (`Alchemy470.getAvailableFish`); modais interativos para destilar poções e forjar armas de campo.
  - `tools/survival437.js`: nós de coleta botânica enriquecidos por bioma e nas Fendas (ervas curativas, raiz de sangue, musgo glacial, flor de brasa, líquen ácido, orquídea abissal, fungo luminoso); botões de beber poção e arremessar frascos; tecla [G] com prioridade para arremesso de frascos de combate.
  - `src/core/380-acoes.js`: correção do texto da tela de morte para os 9 atributos automáticos da classe.

## v469 — Fendas Infinitas: sinal no horizonte (Soberano/retorno), reposicionamento elástico invisível, colisão física sólida em pedras/cristais e revisão geral de textos, 19/10/2026
- Pedido de Ian:
  1. Localização do Soberano nas Fendas Infinitas (Combinação A+B): indicador orgânico sem GPS fixo (feixe vertical pulsante para o Soberano e verde-água para o retorno) + reposicionamento elástico invisível (150m–300m à frente) ao explorar para longe sem combate.
  2. Colisão física sólida em pedras, cristais e estruturas geradas nas Fendas (altura com terrH/floor344/stepVertical357, contorno e pulo).
  3. Revisão geral de textos: Fendas normais vs portais vermelhos, passagem do tempo na viagem de carroça e expedições, atributos só por treino e guia completo de conservação de alimentos, água tratada, cantis, carrinho e acampamento.
- Mudanças técnicas:
  - `tools/otherworld460.js`: feixe vertical de energia (`st.beam469`) no Soberano/Núcleo com pulso de opacidade e feixe verde-água (`st.exitBeam469`) na Fenda de retorno de Fendas normais; lógica elástica em `guide(dt)` que reposiciona o Soberano 180m–250m adiante na direção da caminhada se o jogador se afastar >350m sem combate; travamento do reposicionamento após início do combate (`engaged469`); gerador de colisões sólidas (`addSolid` / `dropSolids`) para pedras e cristais GLB registrados na grade espacial (`solidHash`), com altura de colisão compatível com o salto do jogador; descarregamento de chunks sem deixar colisores fantasmas.
  - `src/core/170-colisao.js`: integração do `freeAt` e da altura da superfície nas Fendas infinitas.
  - `tools/cart437.js` e `tools/survival437.js`: painel expansível com tutorial completo e objetivo de sobrevivência (como tratar água no fogo, estágios de frescor da comida, resina, alforjes e salmoura no carrinho), revisão das descrições dos cantis.
  - `src/core/620-janelas.js` e `src/core/580`: explicação clara da Carroça da Ordem (tempo e calendário de até meio dia na viagem), modal de portais distinguindo Fendas normais e portais vermelhos.
  - `tools/attrs462.js`: descrições dos 9 atributos atualizadas para refletir treino direto e marcos.
- Testes: Playwright em Chromium/Edge (`tools/test-fendas469.cjs`), 35 checagens aprovadas (feixe, reposicionamento, colisão, pulo, persistência após combate, descarregamento de chunks e variantes de expedição: standard, hunt, combat, core, floors, rupture). Prints gerados: proof-fendas469.png, proof-suprimentos469.png, proof-status469.png.

## v468 — Golpe com mais peso: achatamento, rastro branco na vida e som de combo, 19/10/2026
- Pedido de Ian: itens 1 a 3 do PDF "Técnicas de Instagram para o Primeva" (Drive, pasta Referências - Técnicas (Instagram)). A v459 já tinha flash, hitstop, tremor, faíscas e números de dano; esta versão completa o que faltava.
- `tools/juice468.js` (novo, ?v=468, carregado depois da impact459; envolve `hurtEnemy` e `bar`): (1) o monstro atingido achata e estica por 0,15 s (0,2 s no crítico) e volta ao tamanho exato de antes; (2) rastro branco atrasado nas barras de vida — HUD do jogador (`#hpb`), barra do chefe (`#bb`) e barrinhas sobre monstros, aliados e jogador (espera 0,35 s e alcança a barra); (3) som: camada grave no impacto + "tic" que sobe 2 semitons a cada acerto seguido (até 8), zera após 1,1 s sem acertar.
- Só reage quando a vida do monstro cai de fato (a v459 guarda o golpe para o quadro do impacto e chama `hurtEnemy` de novo). Dano, alcance, tempo de ataque e regras não mudam. Vale para todas as classes e armas (entra por `hurtEnemy`).
- Partes ligadas: `410` passa a entidade como 8º parâmetro de `bar(...)` (4 chamadas). Nenhum texto do jogo descrevia esses efeitos. sw.js pds-v468.
- Teste (navegador, Viajante): slime achatou (x 1,08 / y 0,87) e voltou a 1; rastro da barra do monstro em 1 → alcançou 0,654; barra do HUD com rastro branco de 50% a 100% (print); 5 ataques reais: combo 1→2→3, sem erro no console do módulo. Não deu para ouvir o som (Claude não ouve áudio).

## v467 — Ficha mostra o ataque à distância (Destreza) separado do corpo a corpo (Força), 19/10/2026
- Pedido de Ian: "boto ponto em destreza e o arqueiro não ganha dano… tem que ter a derivação para quem dá dano à distância; um guerreiro com arco não deveria dar o dano da Força… essas derivativas existem mas não mostra ou não sei se funciona."
- Medido no jogo (nível 10, Força 10): Arqueiro de arco com Destreza 0 acerta 46 por flecha e com Destreza 30 acerta 106 (a Força não entra); Guerreiro de arco também sobe com Destreza; Guerreiro de espada não muda com Destreza. A conta já existia (`atkRanged281` em `src/core/370`, usada pelo ataque básico com arco/adaga arremessada/arma de fogo e pelas habilidades de classes que atiram); o problema era a ficha, que só mostrava "Ataque físico" (da Força) e um "Dano por golpe" que ignorava a arma.
- `src/core/610` charSheet: "Ataque corpo a corpo (Força)", "Ataque à distância (Destreza)", "Penetração (Destreza)" e "Dano por golpe (corpo a corpo / à distância / mágico)" com o dano real da arma equipada (`player.dmg × basicDmgMul()`).
- `src/core/450` statDesc: Destreza diz que vale para arco, adaga arremessada e arma de fogo em qualquer classe; Força diz que não conta para arco e arremesso.
- `tools/classgrowth465.js`: os 9 pontos do Assassino passam a 3 Destreza, 3 Força, 3 Agilidade (a adaga dele é de arremesso e usa Destreza; as habilidades de perto usam Força).
- Teste (navegador, porta 8887): números acima; ficha com arco mostra à distância 106 e dano por golpe 106; com espada, corpo a corpo e dano por golpe 87. `test-v456`, `test-acts89-441` passam.

## v466 — Os 9 pontos iniciais voltam, mas vão sozinhos para os atributos da classe, 19/10/2026
- Correção de Ian sobre a v465: "primeiro são nove pontos… não ganha pontos [para distribuir]… tu ganha nove pontos nas coisas que mais vão favorecer aquela classe. E os pontos de habilidade ainda são ganhos ao subir de nível."
- `tools/classgrowth465.js` (?v=466): ao ter classe (despertar no Kael ou criação), o personagem recebe 9 pontos automáticos nos atributos da classe, com aviso. Tabela: Guerreiro/Berserker/Lanceiro/Espada rara 4 Força, 3 Vitalidade, 2 Resistência; Monge 4 Força, 3 Agilidade, 2 Vitalidade; Tanque 4 Resistência, 3 Vitalidade, 2 Força; Guardião e Paladino 3 Vitalidade, 3 Resistência, 3 Inteligência; Assassino 4 Agilidade, 3 Percepção, 2 Força; Arqueiro 4 Destreza, 3 Agilidade, 2 Percepção; Metamorfo 3 Força, 3 Agilidade, 3 Vitalidade; Espada Arcana 4 Inteligência, 3 Força, 2 Agilidade; Invocador e Necromante 4 Inteligência, 3 Espírito, 2 Vitalidade; demais magos 4 Inteligência, 3 Espírito, 2 Vontade. O painel "Ao subir de nível" mostra "Começa com 9 pontos: …". Reencarnação devolve os 9 da classe. Personagens antigos (que já distribuíram os 9) não ganham de novo.
- Pontos de habilidade: continuam +1 por nível (sem mudança).
- Partes ligadas: textos do registro/criação (`630`), comentário de `370`, reencarnação (`610`).
- Teste (navegador): save antigo marcado sem ganho extra; Arqueiro novo recebeu Destreza 4, Agilidade 3, Percepção 2; painel do Mago mostra 4 Inteligência, 3 Espírito, 2 Vontade; sem erro novo.

## v465 — Atributos só por treino (sem ponto por nível e sem os 9 iniciais) e painel "Ao subir de nível" na escolha de classe, 19/10/2026
- Pedido de Ian: "não ganha mais ponto por nível, já que agora ganha ponto por treino, e não ganha aqueles nove pontos iniciais, porque não faz sentido colocar pontos… tem que reescrever a regra: a cada ponto que tu ganha por treino." E: "tu ganha coisas ao subir de nível, dependendo da tua classe… quando for escolher a classe, um painel que explique o que a classe ganha (magos mais mana e menos vida que um guerreiro); tem um PDF sobre como isso funciona."
- Nível: só +1 ponto de habilidade e o crescimento da classe (vida, mana, ataque físico e mágico — `tools/balance-rpg.js`, a mesma tabela do PDF "Grimório de Atributos e Bestiário" v281). Sem ponto de atributo (`src/core/370`). Criação/registro sem os 9 pontos e sem a seção de distribuir (`370` CREATION_PTS281=0, `630`). Reencarnação começa sem pontos (`610`).
- Status (`450`): sem +1/+5/Redistribuir; texto "Atributos sobem treinando". Dicas de cada atributo reescritas: "Como sobe: treinando com …" + "Cada ponto ganho no treino: …" + sobrevivência + marcos (`450` statDesc e `tools/attrs462.js`). Painel do Status (`tools/character405.js`) virou "Atributos sobem treinando".
- Novo `tools/classgrowth465.js`: painel "AO SUBIR DE NÍVEL" (base + por nível, comparação com o Guerreiro em palavras, exemplo no nível 50, lembrete de que atributo vem do treino) na escolha de classe do Kael (`tools/vocation405.js`), na lista de classes do título (`src/core/640`) e no Status.
- Recompensas que davam ponto para distribuir viraram ponto de treino direto (decisão minha, fácil de trocar): espécie nova no Aquário → +1 Destreza; Masmorra do Sonho → +1 Vontade; Reavaliação de rank na Ordem → +1 Espírito (o texto dizia "2 pontos", o código dava 1); Constelação cheia → cada ponto vai para o atributo mais baixo. Reencarnação: no lugar de "+1 ponto a cada 5 níveis", treino 10% mais rápido por reencarnação.
- Trocar de trabalho não troca mais os atributos (são do treino do corpo) (`470`).
- Saves antigos: pontos livres que sobraram são repartidos sozinhos entre os 9 atributos (os mais baixos primeiro), uma vez, com aviso. Pontos já distribuídos ficam.
- Partes ligadas: HUD sem aviso de pontos (`410`), menu "Status e habilidades" (`610`), texto da Reencarnação (`610`), recompensa da Reavaliação (`620`), liberação "Janela de Status: atributos e treino" (`560`), textos do Aquário/Sonho/Ordem.
- Teste (navegador, porta 8885): subir 1→3 deu +2 de habilidade e 0 de atributo, vida/mana do Mago cresceram; 7 pontos livres antigos repartidos; Status sem botões de distribuir, com painel e dicas novas; escolha de classe do Kael mostra o painel (Guerreiro e Mago conferidos); registro na Ordem sem a seção de atributos e conclui normal. `test-v456`, `test-ecology410`, `test-acts89-441` passam.

## v464 — Outro Mundo: Soberano solto, sem sinais nem gaiola; a Fenda de entrada reaparece em algum lugar e leva de volta; peças do Arquiteto não vão para a Mão, 17/10/2026
- Pedido de Ian (sobre a v461): "não deixa o chefe preso em uma gaiola, esquece esse negócio de energia, o chefe tem que estar solto; esse outro mundo também pode ter fendas, eu posso sair a qualquer momento achando a fenda de onde eu entrei; toda vez que eu entro em uma fenda ela some atrás de mim e aparece em algum lugar; posso voltar pra Aster pela mesma fenda, ou matando o chefe surge uma nova fenda." E: "peças do Arquiteto (braços, tronco, pernas) não são puxadas pela mão do Arquiteto que nem os mobs."
- `tools/otherworld460.js` (?v=464):
  - Fora: Cidadela com muralha, portão selado, cortina de energia e os 3 Sinais de Energia. No lugar, um covil aberto (ruínas e cristais soltos, sem colisão de muralha).
  - O Soberano anda solto: passeia até ~340 m em volta do covil, para e segue; ao te ver (≈26 m) vira a luta normal de chefe. Não "dorme" de longe (`src/core/390-ia.js`: exceção ao sono a 55 m só para ele). Sem marca no minimapa (`410`: chefe e alvos do Combate não aparecem no Outro Mundo).
  - A Fenda por onde você entrou some atrás de você (como antes) e reaparece em algum lugar deste mundo, 260–620 m da chegada e longe do covil, sem marca. Encostar nela leva de volta a Primeva a qualquer momento. Portal vermelho segue a regra antiga: ela fica trancada até o Soberano cair.
  - Saindo cedo por ela: em Primeva você sai onde o portal estava, ele se fecha atrás de você e reabre a 120–280 m dali (`OW460.relocateGate`, chamado no `leaveDungeon` de `src/core/290`); dá para entrar de novo no mesmo mundo. A passagem do tempo da v458 continua.
  - Matando o Soberano: uma Fenda nova se rasga onde ele morreu (e a de entrada destranca); atravessar qualquer uma conclui o portal (transbordo em 2 min, como antes).
  - Veios do chão viraram só decoração (não apontam para nada).
- `tools/loot353.js` (?v=464): corpo de peça do Arquiteto (`piece250`/`piece222`) e do próprio Arquiteto (`arch223`) não é puxado pela Mão do Arquiteto; monstros comuns continuam sendo.
- Partes ligadas: dica da taverna ("a Fenda some atrás de você e reaparece em algum lugar de lá…"), pergaminho (toast e descrição: "volte pela Fenda por onde entrou"), descrições de Núcleo (covil, dá para desistir pela Fenda) e Três Zonas (como voltar), objetivo do Núcleo concluído ("uma Fenda nova abriu no covil"), HUD do Outro Mundo ("O Soberano anda solto · ache a Fenda por onde entrou para voltar").
- Teste (navegador, porta 8883): Fenda de entrada reaparece a 441 m; Soberano anda sozinho (18 m em 12 s) e reage de perto; pergaminho recusado; sair pela Fenda → Primeva, portal fecha atrás e reabre a 177–224 m, reentrada no mesmo mundo; vermelho: Fenda trancada até o Soberano; Soberano morto → Fenda nova a 5 m de onde caiu, saída conclui o portal; corpo de peça do Arquiteto nunca chama a Mão (corpo comum chama). `test-v456`, `test-ecology410`, `test-acts89-441` passam.

## v463 — Fome/Sede no painel Ficha com o mesmo bloco do Status, 17/10/2026
- Pedido de Ian (sobre a v462): queria a barra de Fome e Sede "como na segunda versão" = o bloco do Status (caixinha, nome à esquerda, % colorido à direita, barra embaixo). As barrinhas finas do painel Ficha do HUD viraram esse bloco (lado a lado, menor). Clicar abre a mochila [V].
- Só `tools/attrs462.js` (`hudBars` e CSS), `?v=463`.
- Teste (navegador, porta 8892): blocos aparecem no painel Ficha antes do XP, cor muda com o valor (62% verde, 21% vermelho), clique abre "SOBREVIVÊNCIA, FRESCOR & EXPEDIÇÃO"; sem erro novo. `build.py` e `core_parts.py check` ok.

## v462 — Fome/Sede na Ficha, ← Voltar nas subpáginas e os 9 atributos sobem por treino (com marcos de 25 e bônus de sobrevivência), 17/10/2026
- Pedido de Ian (4 pontos, sem refazer o layout e sem mexer na matemática de combate v281–v283).
- Novo `tools/attrs462.js` (carregado por último). Combate intacto: os ganchos de luta só CONTAM ações; um ponto de treino entra em `run.stats` igual a um ponto distribuído.
  1. Fome/Sede: o widget do canto (`surv437hud`, 🍖 💧) saiu. Barras de Fome e Sede no painel "Ficha" do HUD (mesmo estilo de Vida/Estamina, antes do XP), bloco "SOBREVIVÊNCIA" no Status do Personagem (Fome, Sede, temperatura, carga, botão da mochila [V]) e linhas Fome/Sede na "FICHA DO PERSONAGEM" da Build.
  2. ← Voltar: `modalParent118` (`src/core/150`) agora cobre "Combinar técnicas" (→ Habilidades), EQUIPAMENTOS (→ Build) e APARÊNCIA (→ Status), que abriam sem botão. Backspace volta (fecha primeiro a peça aberta no guarda-roupa da Build). Layout igual.
  3. Treino: metas 10 → 20 → 30 → 50 → 75 → 100 → 150 → 200 → +50 cada. Força: golpe corpo a corpo, cortar árvore, minerar. Destreza: acerto à distância, pescar (vara e minijogo), fabricar. Agilidade: esquiva, nadar, andar em Passo Silencioso. Percepção: crítico, colher, salas novas nas Fendas. Inteligência: magia/habilidade elemental, ataque básico mágico, cozinhar, ferver chá/antídoto. Vitalidade: perder/recuperar vida, gastar estamina, mergulhar. Resistência: receber/bloquear dano físico, puxar carrinho (25 m), frio/calor extremos (20 s). Espírito: gastar/regenerar mana, 30 s dentro de Fenda. Vontade: 3 golpes em 5 s, sofrer lentidão/atordoamento/sangramento/intoxicação/parasitas, acertar com menos de 35% de vida. Status mostra "Treino 14/20 · Marco 50 · patamar · Total (distribuídos + treino)". Redistribuir só devolve pontos distribuídos (os de treino ficam); reencarnar/trocar de classe zera tudo como antes.
  - Marcos de 25: não existia regra no código. Para não mexer no combate, o marco vale para os bônus de sobrevivência: pontos 1–25 rendem ×1, 26–50 ×1,2, 51–75 ×1,4… Aviso grande no 25º, 50º…
  4. Sobrevivência (texto no balão de cada atributo, via `statDesc`): Força carga +0,8 kg/ponto (antes lia `run.stats.str`, que não existe), carrinho pesa menos, chance de não gastar machado/picareta e de lenha extra. Destreza zona de fisgada maior no minijogo de pesca (`src/core/460`) e chance de fabricar 1 a mais. Agilidade nado/mergulho mais rápido e Passo Silencioso percebido mais de perto. Percepção coleta extra e achado raro; nas Fendas o mapa revela mais casas (`src/core/400`). Inteligência comida apodrece mais devagar, chá/antídoto duram mais. Vitalidade fôlego (fórmula de `Water.max` em `tools/mechanics434.js`, agora com marcos), Fome/Sede caem mais devagar, descanso da Tenda dura mais (`tools/build437.js`). Resistência frio/calor, fôlego/pressão, Cansaço acumula mais devagar. Espírito Miasma mais fraco, lenha da fogueira e tocha rendem mais. Vontade dano de Fome/Sede zeradas menor, parasitas/intoxicação passam mais rápido.
  - Não aplicado (não há o que reduzir): correr não gasta estamina desde a v378; cortar árvore/minerar/montar acampamento/fabricar já são de 1 clique (por isso Força/Destreza dão rendimento extra em vez de "menos golpes"/"mais rápido"); pérolas e pressão do fundo do mar dependem do `tools/deep447.js`, que segue quebrado (erro ao carregar, já anotado na v460).
- Partes ligadas: `tools/survival437.js` (peso, carrinho, clima, fome/sede, apodrecimento, miasma, chá, tocha, fome extrema, parasitas, coleta, corte, pesca, fabricação; HUD do canto removido), `tools/build437.js` (lenha, descanso), `tools/mechanics434.js` (fôlego), `src/core/150` (Voltar), `400` (revelar mapa na Fenda), `460` (pesca). Versões `?v=462` no `game.html`.
- Teste (navegador, porta 8891, save de exemplo): sem widget no canto; Fome/Sede no painel Ficha e no Status; Voltar e Backspace em Equipamentos, Combinar técnicas, Ataque básico e peça aberta na Build; 40 ataques num alvo → Força 0→2 (metas 10 e 20), críticos contaram Percepção; 12 cordas → Destreza +1; Percepção 24→25 deu o marco (patamar 1); Redistribuir devolveu só os 3 pontos distribuídos; com 50 pontos em tudo: carga 36,6→79 kg, apodrecimento ×0,74 (carrinho ×0,18), fôlego 12→34 s; andar e atacar normais; sem erro novo no console (só o antigo do deep447). `build.py` e `core_parts.py check` ok; `test-v456.cjs`, `test-ecology410.cjs`, `test-acts89-441.cjs` passam.

## v461 — O Outro Mundo da Fenda é infinito e sem marcação: difícil de sair, 17/10/2026
- Pedido de Ian (sobre a v460): "o planeta tem que ser procedural infinito, é outro mundo… e não quero marcação de onde tá o chefe ou as energias brilhando alto, é pra ser difícil sair de lá."
- `tools/otherworld460.js` (mesmo arquivo, ?v=461): o mapa fechado de ~330 m com cordilheira na borda virou um planeta infinito.
  - Relevo sem borda (`owH460` em `tools/terrain245.js`, GPU e CPU iguais): colinas + cordilheiras em crista que se repetem sem fim; chegada e Cidadela planas.
  - Chão que acompanha o jogador (altura, cor e veios calculados pela posição no mundo) e pedaços de 64 m gerados em volta (formações, flora, rochas flutuantes, recursos), descartados atrás. Acampamentos novos de monstros nascem conforme você anda (um a cada ~160 m com 55% de chance); longe e sem briga somem e voltam quando você volta.
  - Colisão numa grade virtual infinita (`L.grid.cells` e `L.visited` são Proxy; nada de array do tamanho do mapa). Monstro travado usa caminho numa janela local (`OW460.path`).
  - A Cidadela fica a 900–1300 m da chegada, numa direção sorteada. Você chega virado para um lado qualquer.
  - Sem marcação: tirei os feixes de luz do céu (sinais e Cidadela), as placas dos sinais e as marcas do minimapa (sinal, Cidadela e X da chegada). O minimapa só mostra o que você já explorou.
  - Pistas no próprio mundo: os 3 Sinais de Energia são cristais baixos perto da rota escondida (25–70 m dela); rastrear um solta um rastro de runas de 40 m no chão apontando o próximo e diz só "perto / longe / muito longe"; os veios do chão pulsam a partir da Cidadela (bem fracos longe dela, fortes perto). O 3º sinal abre o portão; nenhum texto diz onde ela está.
- Partes ligadas: `src/core/270` (grade/explorado virtuais, `expPath` local, texto do rastro completo sem "revelada no mapa"), `410` (mapa grande mostra 600 m em volta no Outro Mundo), `tools/kit111-runtime.js` → `650` (habilidade de revelar o mapa só varre as células no alcance — antes varria a grade inteira), objetivo do HUD ("procure os cristais que falam · os veios pulsam a partir da Cidadela").
- Teste (navegador, porta 8881): entrada em 0,1 s com 81 pedaços; caminhada simulada de 1,5 km (pedaços nascem e somem, geometria estável ~670–720, acampamentos novos); ciclo completo (sem saída, pergaminho recusado, sinal fora de ordem recusado, portão 2→1 no 3º sinal, Soberano → portal de volta → mundo com relevo normal); Núcleo, Caçada (chefe anda, portão aberto), Combate, Ruptura e Zonas sem erro; render 10,5 ms no Outro Mundo × 8,6 ms no mundo. `test-v456`, `test-ecology410`, `test-acts89-441` passam.

## v460 — As Fendas viram OUTRO MUNDO de verdade: planeta aberto, portal que some atrás de você e só reabre com o Soberano morto, 17/10/2026
- Pedido de Ian (sobre a v458): "a parte principal que não foi atendida é as dungeons. Elas continuam iguais… só tem uma lua lá… é para ser outro mundo. Tu entrou… tem um portal vermelho… Tu não pode sair dali até matar o chefe… o portal some, é outro mundo, é outro lugar." A v458 só tinha posto céu/lua por cima das mesmas salas e corredores.
- Novo `tools/otherworld460.js` (0 crédito Tripo; só modelos que já existem): toda Fenda comum vira um planeta aberto de ~330 m, sem salas nem corredores.
  - Relevo próprio do planeta: ramo `owH460` no `tools/terrain245.js` (GPU e CPU iguais; uniformes `uOW460`/`uOWB460`), colinas de até ~6 m, chegada e Cidadela planas, cordilheira de rochas na borda (é a "parede" do mundo). Fora da Fenda o relevo normal volta (`clearLevel`/`ter245tick`).
  - Céu: cúpula com aurora, nebulosa e estrelas, planeta gigante com faixas e anel, duas luas; 5 mundos pelo bioma do portal (Érebo violeta, Xylo esmeralda, Pyra carmesim, Nifl gelo, Kemet âmbar), cada um com cor de chão, neblina, luz, partículas (esporos, brasas, neve, areia), cristais do Tripo da cor certa, rochas flutuantes (`rocha-flutuante`), árvores/cactos do Tripo e pedras da Kenney tingidas. Ciclo de dia do próprio mundo (1 dia = DAY_LENGTH; conta no "Dia N").
  - Chegada: você aparece com o portal vermelho atrás; a câmera mostra o portal desmoronar (Rift131.close) e gira até revelar o planeta. Aviso: "o portal se fechou… só volta quando o Soberano cair".
  - Caçada: 12 acampamentos de monstros (6 na rota, 6 espalhados), 3 Sinais de Energia em sequência pelas Zonas 1–3 (feixe de luz visível de longe; fora de ordem é recusado), Cidadela do Soberano com muralha de cristais e portão selado por uma cortina de energia até o 3º sinal (na Caçada o portão já começa aberto). Recursos do outro mundo (lenha/resina, fungos, poças para cantil e pesca) espalhados.
  - Saída: não existe portal de volta até o Soberano cair; aí abre um portal dourado no centro da Cidadela e o mundo transborda 2 min depois (era 60 s). Pergaminho de Retorno não funciona antes do chefe. Ao sair, a passagem do tempo e o cerco da v458 continuam (testado: 22 dias).
  - Tipos de Fenda: Defesa de Núcleo acontece dentro da Cidadela; "Masmorra de Andares" virou "Expedição em Três Zonas" (mesmos baús garantidos: Raro na Zona 1, Épico na Zona 2, Lendário no Soberano); Ruptura, Caçada, Combate e portal vermelho também. Ficam na masmorra antiga só o Acampamento Goblin, a Extração e as instâncias especiais.
  - Desempenho: monstros a mais de 85 m (fora o chefe) ficam escondidos; medido no mesmo método: Fenda nova ~20 ms por quadro, masmorra antiga ~28 ms, mundo ~24 ms.
- Partes ligadas (mudadas junto): `src/core/270` (buildDungeon usa o layout aberto; sinais/recursos; portal de volta; transbordo 120 s; baú da zona; texto de Núcleo/Andares/Caçada), `290` (startBreak abre o portal de volta; aviso de entrada), `400` (relevo do planeta; minimapa revela 24 m em volta), `410` (objetivo "Mundo · Dia · Zona" e marcas no minimapa: próximo sinal, Cidadela, X da chegada), `620` (pergaminho bloqueado e descrição), `050` (loja: Pergaminho de Retorno "não funciona… no Outro Mundo antes do Soberano cair"; dica nova da taverna), `180` (desliga o relevo do planeta), `tools/habitat-render124.js` (decoração dos acampamentos com a pedra do mundo).
- Correções da v458 achadas no teste: varal misturava carne e peixe (tudo saía como o último pendurado) → agora um tipo por vez; chama da fogueira era um cone laranja chapado → chama com shader animado; cristais do cerco usavam o cristal antigo (crystalCluster230) → cristal do Tripo.
- Ainda quebrado da v458 (não mexido aqui): `tools/deep447.js` (fundo do mar da v447) chama a API antiga da mochila (`Surv437.IT/ready/world`) e dá erro ao carregar; algas, ostras e pressão não funcionam.
- Teste (navegador, porta 8879): ciclo inteiro — fogueira/varal/bancada fora da cidade, carne assada, peixe defumado, Ração de Expedição, Alforje, Mochila Térmica (apodrecimento 0,2×), Invólucro lacrado, cantis de ferro/térmico, carrinho com comida estacionado na Fenda → chegada (portal fecha) → fogueira + tenda dentro, dormir (dia 1→2, cansaço zerado) → 3 sinais (Cidadela abre) → pergaminho recusado → Soberano morto → portal dourado → volta com "22 dias se passaram", cerco e carrinho intactos. Também: Núcleo, Combate, Ruptura, vermelho, Andares→Zonas e Goblin (antigo) sem erro; andar no morro (16 m, altura acompanha), ataque acerta. `python tools/build.py` (src/core: igual) e `core_parts.py check` ok; `node tools/test-v456.cjs`, `test-ecology410.cjs`, `test-acts89-441.cjs` passam.

## v459 — Peso no golpe e na magia (2 reels de game feel do vasilev.yegor), 16/10/2026
- Pedido de Ian: "assiste esses 2 vídeos e coloca em prática no Primeva" — reels "How to make a punch juicy" (5 passos) e "How to make a spell juicy" (8 passos). Só visual e som: dano, alcance, alvos e tempo de ataque não mudam. Vale igual para todas as classes e armas.
- tools/impact459.js (novo, carregado por último; envolve hurtEnemy, killEnemy, attack e projectileImpact253):
  - Golpe no quadro do impacto: medido no jogo, a espada só cruza o alvo a ~25% do golpe, mas o dano, o congelamento e a tremida saíam no clique (a tela congelava com o personagem parado). Agora os acertos do golpe corpo a corpo esperam esse tempo (no máximo 0,13 s; alvos escolhidos no clique). O monstro fica branco já no quadro do acerto (antes só acendia depois do congelamento).
  - Clarão no ponto do contato e faíscas saindo na direção do golpe (cor pelo elemento; crítico dourado e maior; bloqueio cinza). Recuo de 0,16 m do jogador no golpe corpo a corpo.
  - Tiros e magias: clarão + faíscas atravessando o alvo no ponto real do acerto, anel no crítico/projétil grande, e congelamento/tremida curtos (antes só o golpe básico tinha), no máximo um a cada 0,14 s.
  - Magia: clarão na ponta do cajado/mão no disparo; segurando o ataque, energia puxada para a ponta e um núcleo que cresce até o próximo disparo; rastro em todo projétil do jogador que não tinha (fogo, alma e flecha especial já tinham).
  - Som sintetizado: golpe seco por arma (lâmina com brilho metálico), baque para flecha/adaga, estrondo por elemento no impacto mágico, sopro no disparo mágico (no lugar do bipe), corda no arco, "pop" na morte, crepitar quando vira cinza. Claude não ouve: Ian precisa julgar.
  - Depois do acerto: monstro em chamas enquanto queima (QUEIMA/fogo), apagando aos poucos; pingos de sangue enquanto sangra.
  - Morte: estouro de faíscas, clarão e congelamento curto; morte por fogo = cinzas e brasas e o corpo fica carbonizado (o saque do corpo continua igual).
  - Partículas num InstancedMesh só (1 desenho), metade no modo Gráficos leve.
- src/core/410-overlay-e-hud.js: números de dano nascem maiores e "socam" de volta em 0,12 s (crítico maior).
- Partes ligadas: nenhum texto do jogo descrevia esses efeitos; o golpe atrasado não muda dano nem tempo de recarga. sw.js pds-v459.
- Teste (navegador): golpe de espada com quadros medidos (impacto agora em ~30% do golpe, junto da lâmina), crítico, bola de fogo (disparo, explosão, QUEIMA com chamas), morte por fogo (cinzas, corpo carbonizado), ataque básico + 1ª habilidade de todas as entradas da lista CLASSES do código (Ian: o jogo tem 24 classes; a lista tem 25 entradas, 0 Guerreiro a 24 Berserker) sem erro do módulo. Não testado: som (Claude não ouve), segurar o botão com o mouse de verdade (a carga só aparece segurando).
- Aviso: com a v458, tools/deep447.js dá erro no console ao abrir ("Cannot convert undefined or null to object", linha 20: U().IT não existe). Não é desta versão.

## v458 — Acampamento Portátil, Frescor da Comida (4 Estágios), Bolsas de Conservação, Cantis, Fendas como Outros Mundos (Passagem de Semanas) e Fechamento 200/200 + Atos X–XIII (Zero Créditos Tripo), 16/10/2026
- Regra Nº 1 cumprida: 0 créditos Tripo (nenhum novo `.glb` ou placeholder criado; 100% dos visuais usam os modelos `.glb`, rigs, shaders, materiais Three.js e UI já existentes no repositório).
- 1) Remoção da Terraplenagem e Casas Fixas → Acampamento Portátil (`tools/terrain245.js`, `src/core/400-loop.js`, `tools/terra444.js`, `tools/clear445.js`, `tools/build437.js`):
  - Desativadas todas as ferramentas de deformação da malha do terreno (cavar, nivelar, aterrar, calçamento) e o nivelamento automático em Zahar (`tools/mechanics434.js`), mantendo `terrH` e os arredores de Aster e das 5 Capitais 100% naturais e protegidos.
  - Coleta orgânica com regeneração natural (galhos, frutas, ervas, pedras soltas e corte de lenha com tocos que regeneram sem desmatar o mapa permanentemente).
  - Removidas cabanas/paliçadas permanentes e implementado o Acampamento Portátil de Expedição (na superfície e dentro das Fendas): Fogueira de Pedra e Lenha (aquece contra o frio de `biomes295.js`, ilumina, afasta predadores fotofóbicos, ferve água e cozinha), Tenda/Abrigo Portátil (dormir, curar ferimentos, passar o tempo e remover Cansaço da `v287`), Varal de Secagem Portátil (curar carnes e peixes ao calor da fumaça) e Bancada Rústica de Campo (flechas, cordas, tochas, bolsas de conservação e conserto do Carrinho de Carga), com recolhimento por `F` (`packStruct456` / `packAllCamp456`) devolvendo os materiais para a mochila/carrinho e deixando o bioma limpo.
- 2) Sistema Profundo de Comida, Frescor, Água e Bolsas de Conservação (`tools/survival437.js`, `tools/cart437.js`):
  - 4 Estágios de Frescor com barra visual no inventário: Fresca (Verde 100%–60%, 100% saciedade + bônus de Vida Máx e regen de Vigor), Amanhecida/Passada (Amarela 59%–25%, 50% fome, sem buffs), Estragada/Rançosa (Vermelha 24%–1%, 15% fome + intoxicação leve por 2 min) e Podre (Cinza 0%, converte-se automaticamente em `Isca de Carniça`, jogável no chão com `[G]` como `LURE_FOOD` para atrair e distrair feras e carniceiros).
  - Duração por preparo: Carne/Peixe Cru e Frutas (1,5 dias), Assados na Fogueira (3,5 dias + bônus de Vida/Vigor), Carne Seca/Peixe Defumado no Varal Portátil (12 dias) e Ração de Expedição (22 dias).
  - Bolsas Especiais e Pacotes de Conservação na Bancada Rústica: Alforje de Couro Curado no Sal (-50% apodrecimento), Mochila Térmica de Cristal Frio (-80% apodrecimento + blindagem contra o Miasma da Fenda), Invólucro de Resina e Fibra (`sealBundle` / `unsealBundle`, lacra até 4 refeições com 0% de perda até abrir na masmorra) e Caixa de Salmoura no Carrinho de Carga (-75% apodrecimento).
  - Água, Temperatura e Progressão de Cantis: Água Bruta (causa Parasitas/Corrupção), Água Fervida/Destilada (100% potável), Chás Térmicos e Antídotos com barra de Potência/Calor, e 3 níveis de cantil: 1) Odre de Couro Simples (congela em Ymiria até aquecer na fogueira e evapora mais rápido em Zahar), 2) Cantil de Ferro (8 goles, ferve na metade do tempo) e 3) Cantil Térmico Isolado (10 goles, não congela/evapora e triplica a duração da potência dos chás).
- 3) As Fendas como "Outros Mundos" (`src/core/270-masmorra-procedural.js`, `src/core/290-bloco-crystals125-cont.js`, `tools/habitat-render124.js`):
  - Estacionamento automático do Carrinho de Carga na porta da Fenda (`Cart437.parkAtGate456`, marcado no minimapa) ao entrar no portal (`F`).
  - Masmorra-Mundo multi-zonas com céu/domo alienígena, luas gêmeas, anéis planetários, neblina, iluminação, gravidade e flora exótica (`OTHERWORLDS456`), Miasma da Fenda (apodrecimento 2× fora de bolsas térmicas/invólucros), coleta de recursos exóticos (Lenha Abissal, Fungos Astrais, Fenda Abissal de Pesca) e Caçada ao Chefe através de 3 Sinais de Energia pelas zonas com uso do Acampamento Portátil lá dentro.
  - Impacto Temporal ao sair da Fenda (`leaveDungeon`): avanço de 14+ dias no calendário de Primeva, aviso dramático (`"14 dias se passaram em Primeva desde que você entrou na Fenda"`), mudança climática, vestígios 3D de cerco/batalha contida ao redor da fenda selada (`spawnRiftAftermath456`) e relatório de status atualizado das Capitais (`run.capitalStatus456`).
- 4) Fechamento do Bestiário (200/200) e Atos X a XIII (`tools/ecology410.js`, `tools/scenes406.js`, `tools/campaign327.js`, `tools/mechanics434.js`):
  - Adicionadas as 4 criaturas restantes (`olhoerrante`, `arraia`, `arauto`, `semente`) fechando 200/200 no Bestiário com ecologia ativa e suporte a `LURE_FOOD` (`Eco410.dropLure`).
  - Conectados de ponta a ponta os Atos X (fragmento de Logos com Dorian, Urdan e Verden com rendição honrada do Sapo Rei `#020`), XI (Portal Primordial com Mão de `arquiteto246.glb` e registros divergentes), XII (Confissão do Narrador no Diário, Inscrição Antiga e confronto com o Arquiteto usando `arquiteto246.glb`) e XIII (Monumento da Reconstrução com Brann, Mira e Lyra).
- Testes: `python tools/build.py` (duas passagens: `src/core: igual`), `python tools/core_parts.py check` (`ok`), `node tools/test-ecology410.cjs` (`200 criaturas (200/200)`), `node tools/test-acts89-441.cjs` (`ALL_V441_AND_V456_CAMPAIGN_TESTS_PASSED`), `node tools/test-v456.cjs` (`ALL_V456_INTEGRATION_TESTS_PASSED`).

## v457 — Sobreviventes presos EMBAIXO da carroça tombada e comboio andando sem trancos, 16/10/2026
- Pedido de Ian (print da carroça): "as pessoas deitadas têm que estar nessa parte da carroça, porque a carroça está tombada em cima delas… se estão onde a carroça não está, quando eu levantar vou jogar a carroça em cima das pessoas" e "o caminhar das pessoas tá travado, um passo, para, um passo, para".
- tools/campaign327.js: pinUnderCart457() põe os dois sobreviventes deitados no espaço da própria carroça (debaixo da carroceria e da lona tombadas, medido no jogo), cabeça para o lado aberto. No resgate eles ficam presos até a carroça subir de cima deles (80% da cena), aí se levantam e saem andando para a frente do jogador.
- Trancos: o comboio (carroça e pessoas) ia até a cidade com setInterval de 0,5 s, pulando 0,9–1 m de cada vez. Agora walk457() move a cada quadro a 1,5 m/s com giro suave; o clipe de andar do Tripo acompanha a velocidade.
- tools/npc456.js: ângulo do corpo deitado por modelo (lieYaw). game.html/sw.js (npc456 e campaign327 ?v=457, pds-v457).
- Teste (navegador): de cima e do lado, os dois ficam cobertos pela carroceria; sequência do resgate (presos → carroça sobe → levantam → andam); velocidade medida 1,2–1,9 m/s contínua com o clipe de andar, sem paradas; sem erro novo no console.

## v456 — Edran e os sobreviventes da carroça viram NPCs do Tripo com rig e animação, 16/10/2026
- Pedido de Ian: "os bonequinhos ali do início, o Adrian [Edran] da carroça, não são NPCs de verdade… pode gerar no Tripo esses personagens… NPCs com rigs de animação e tudo".
- Tripo Studio (créditos do Studio): imagem em T-pose no estilo do Viajante (Nano Banana, modelo de T-pose) → modelo H3.1 com textura 2K e ~20 mil triângulos → auto-rig humanoide Mixamo (65 ossos) → animações. Edran: guarda veterano de Aster, peitoral de aço com o sol dourado da Ordem, gibão azul, faixa no braço esquerdo ferido. Sobreviventes: um viajante (capa marrom, colete) e uma camponesa (vestido azul, avental, trança ruiva).
- Animações: parado e andar (prontas do Tripo); Edran também empurrando (lift_heavy); sobreviventes assustados (scared_01). As poses de ferido foram geradas por texto no Tripo: Edran SENTADO no chão segurando o braço e falando; sobreviventes DEITADOS no chão respirando (as prontas do Tripo só tinham sentar em cadeira).
- models/npc456/edran456.glb, sobrevivente-homem456.glb, sobrevivente-mulher456.glb. tools/npc456.js (novo): carrega com SkeletonUtils.clone, mantém o PBR com saída linear→sRGB (sem toToon), tira as trilhas de escala, escolhe o clipe pelo estado (caído → sentado/deitado, andando → andar com velocidade pelo deslocamento, parado → idle), mixer por quadro no gancho camUpdate e pés sempre no relevo (a cena às vezes nascia antes do relevo e ficava enterrada).
- Partes ligadas: tools/campaign327.js figure() usa NPC456 para Edran, Sobrevivente e Refugiado (homem e mulher se alternam; o modelo do Blender v454 e os cidadãos Dorian/Selene ficam como reserva se o módulo faltar); o levantar dos sobreviventes não gira mais o corpo de lado (a animação faz isso). tools/intro401.js pose(): Edran do Tripo só vira para o jogador, a pose sentada vem do clipe. src/core/140 animChibi ignora NPC456. game.html/sw.js (npc456, campaign327 e intro401 ?v=456, pds-v456).
- Teste (navegador): cena da carroça com Edran sentado ferido e os dois sobreviventes deitados embaixo da carroça; depois de levantar ficam em idle e Edran anda com o clipe de andar; GLBs 200, sem erro novo no console. Não testado: o diálogo completo e o comboio até o portão jogando de verdade.

## v455 — Menos morte no mundo aberto: selvagens no rank do jogador, monstro desiste a 30 m, menos monstros até o nível 12 e cinemáticas sem brecha, 16/10/2026
- Pedido de Ian: "tem muito monstro ainda pelo mundo, e é fácil eu morrer, eu morro muito rápido, eu não consigo avançar" e "durante algumas [cinemáticas] eu posso ser atacado por mobs". A v451 já protegia diálogos e o Ato I perto de Aster; esta versão cobre o resto.
- Medido no jogo (Guerreiro nível 1, 181 de vida): o grau da região sobe +1 a cada 130 m longe de cidade (danger()), e cada grau tem cerca de 2,5× mais vida e dano. A 200 m de Aster já nasciam goblins de grau 1 (32–76 por golpe, morte em 3 golpes); a 450 m, de grau 3 (173–416 por golpe, morte com 1 golpe). Monstro comum com aggro perseguia para sempre (só chefe desistia, a 40 m).
- src/core/400-loop.js (updWorld): o selvagem ALEATÓRIO do mundo nasce no máximo no rank do jogador, com 25% de chance de rank +1 (antes: o grau da região). O mapa de perigo, os portais, os invasores de portal, elites, chefes, masmorras e eventos não mudam. Limite de selvagens vivos por nível: até nv 5 = 5, até nv 12 = 7, depois 10 (Ato I segue 3); intervalo de nascimento 3,5 s até o nível 12 (antes 2,5 s). Vale igual para todas as classes.
- src/core/390-ia.js: monstro comum larga o aggro se você estiver a mais de 30 m (o bando junto). Chefes, chefes de mundo, rivais e invasores de portal continuam perseguindo.
- Cinemáticas (400-loop.js): ao fim da âncora rompendo e da junção do Arquiteto (CINE231) entram 3 s de carência (sem dano, sem aggro); a duração da cena não depende mais do FPS; nenhum monstro nasce durante cena/diálogo; sangramento não corre durante a cena.
- Partes ligadas: nenhum texto do jogo descrevia o nascimento ou a perseguição; o HUD "perigo X" continua mostrando o rank da região (vale para portais e invasores). sw.js pds-v455.
- Teste (navegador): região de perigo 3 com jogador rank F nv 1 → 5 selvagens, graus 0 e 1; mob larga a 45 m e não volta a 20 m; cena CINE231 com 3 mobs colados e sangramento → 0 dano, sangramento parado, 0 monstro novo, carência ativa ao fim; sem erro no console.

## v454 — Reconstrução profissional no Blender do Guarda Edran (Ordem da Fenda) com malha poligonal completa, armadura de placas, elmo forjado, curativo de combate e rigging esquelético orgânico, 16/10/2026
- Pedido de Ian: "Pega todas as referências do meu projeto Primeva, abstrai elas para ti, coloca no teu cerne, entende, e pesquisa em todas as referências de como ser um profissional de Blender, como criar criaturas, como criar movimento, como criar tudo. Cria ossos, pele, textura, cada detalhe por polígonos ou quadriláteros da forma que melhor for exercida para fazer isso e reconstrói esse guarda que tu botou aí."
- Diagnóstico da imagem enviada pelo usuário:
  - O guarda Edran anteriormente carregado exibia formas primitivas geométricas (esfera como cabeça, cubo cinza com disco no tórax, cilindros como braços e pernas) que se assemelhavam a um manequim de madeira ou boneco de testes, em forte contraste com a qualidade do protagonista e dos demais personagens de Primeva.
- Reconstrução Artística & Técnica Profissional no Blender 5.2 (tools/build_edran_professional.py):
  - Malha Humanoide e Feições Anatômicas: Cabeça esculpida em alta densidade com feições de guerreiro veterano, cabelos escuros estilizados, mãos articuladas com luvas de combate e dedos modelados, culote e calças acolchoadas de gambeson militar, botas reforçadas com cinto de couro, fivelas e bolsas de suprimentos.
  - Armadura de Placas da Guarda da Ordem:
    - Peitoral de aço com o Brasão Solar dourado da Ordem da Fenda moldado em relevo no tórax.
    - Ombreiras segmentadas com rebites e braçais de placas protegendo os membros superiores.
    - Grevas de aço com joelheiras polidas protegendo as pernas e canelas.
    - Elmo forjado de combate de ferro e aço (Ferro_Elmo) com crista cônica central e reforços laterais.
  - Curativo de Combate 3D (Ferimento de Fenda): Faixa helicoidal de linho acolchoado com espessura real e manchas de combate ao redor do ombro e braço esquerdo ferido pela criatura.
  - Rigging & Deformação de Pele ("Ossos e Pele"):
    - Esqueleto profissional com 17 ossos (hips, spine, chest, neck, head, upperarm_l/r, forearm_l/r, hand_l/r, thigh_l/r, shin_l/r, foot_l/r).
    - Mapeamento de pesos de vértices orgânico: cotovelos, joelhos, quadris e ombros deformam com transição suave, eliminando qualquer separação de peças rígidas.
  - Shaders e Materiais PBR ("Textura"):
    - Aço polido com reflexão metálica PBR calibrada (metallic 0.88, roughness 0.28).
    - Ouro do brasão e fivelas (metallic 0.95, roughness 0.20).
    - Tecido de gambeson e couro natural nos arreios.
    - Linho texturizado no curativo ferido.
- Sincronização e Posição no Solo (tools/intro401.js & tools/campaign327.js):
  - pose(edran(), dt) calibrada para a cinemática de pernas flexionadas (thigh_l: -1.25, shin_l: 1.6, thigh_r: -1.1, shin_r: 1.4) assentando a bacia exatamente na grama da estrada (m.body.position.y = -0.22) com o braço esquerdo apoiado no joelho ferido e o braço direito gesticulando no diálogo.
  - tools/campaign327.js e sw.js atualizados com URL cache-busted models/edran452.glb?v=454.
- Cache-Busting v454: game.html, index.html e sw.js sincronizados para ?v=454 em todos os 9 módulos essenciais.
- Testes: python tools/build.py (passagens com src/core: igual), python tools/core_parts.py check (ok).

## v453 — Sincronização completa de cache busting (?v=453) em todas as tags e Service Worker, e shaders sRGB em Edran, 16/10/2026
- Pedido de Ian: "Pode colocar no jogo, porque eu acabei de abrir o jogo e não parece muito que..."
- Diagnóstico: tags <script src="tools/..."> em game.html e index.html estavam apontando para query strings legadas de versões anteriores (?v=441 em campaign327.js, ?v=443 em survival437.js, ?v=434 em intro401.js, ?v=170 em boss160.js, ?v=405 em anim303.js), o que fazia o navegador puxar scripts antigos do cache HTTP de disco em vez dos arquivos atualizados das versões 451 e 452.
- Correção de Cache Busting Geral:
  - Todas as 9 tags em game.html e index.html foram sincronizadas para ?v=453 (warrior-player127, boss160, citizens133, set-visual153, anim303, campaign327, intro401, mechanics434, survival437).
  - sw.js (v453) atualizado com a lista exata CORE refletindo ?v=453 para todas as dependências, forçando o Service Worker a descartar caches anteriores e baixar os scripts renovados.
- Shader sRGB e Pose de Edran:
  - tools/campaign327.js: Adicionado patch de shader LinearTosRGB e DoubleSide aos materiais de models/edran452.glb, assegurando cores vibrantes na iluminação sem estourar contraste.
  - tools/intro401.js: Ajustado o offset vertical de Edran ferido para m.body.position.y = -0.48 com leve rotação lateral, assentando sua bacia e coxas com firmeza na grama ao lado da carroça em vez de flutuar.
- Testes: python tools/build.py (duas passagens com src/core: igual), python tools/core_parts.py check (ok).

## v452 — Correção de estiramento de armaduras, animações e pele de monstros/chefes, e modelo 3D articulado de Edran e Sobreviventes, 16/10/2026
- Pedido de Ian: "algumas cinemáticas que ainda estão feio os bonequinhos ali do início uh, o Adrian, não sei o nome dele, da carroça e tal, não são NPCs de verdade, a gente precisa ainda gerar NPCs com rigs de animação e tudo" e "algumas animações de monstros, chefes que a gente botou que eles estão meio bugados, a pele não se move junto com como ele anda ou a armadura do personagem também fica meio bugada, meio que estica e volta".
- Correção de estiramento de armaduras ("estica e volta"):
  - Script no Blender inspecionou e normalizou os pesos de vértices de todas as armaduras em models/equipment431/, models/equipment429/, models/equipment423/, models/equipment340/ e models/set153/.
  - Removidos os pesos indevidos de coxas (thigh_l, thigh_r) nas malhas de peitorais/torsos (como eq331_a_peito e eq414_a_torso), onde 2.000 a 3.000 vértices de cada armadura puxavam em direção às pernas a cada passada, causando deformação elástica. Esses vértices foram reatribuídos para o quadril (hips), mantendo a placa de metal rígida e estável.
  - Removidos objetos Icosphere órfãos e sem pesos presentes nas malhas de armadura e mobs.
- Correção de animação e pele em monstros e chefes:
  - tools/boss160.js: Modelos em models/mobs165/*.glb (Cavaleiro Carmesim, Golem de Pedra, Berserker Rubro, Goblins, etc.) possuem 5 animações embutidas (Run, Idle, Attack, Death, HitRecieve) projetadas para o esqueleto próprio do modelo (PrimevaRig). O carregador agora mapeia diretamente esses clipes para correr, idle, golpe e morte em vez de tentar usar anim-viajante155.glb (que usava nomes Mixamo e resultava em 0 trilhas correspondentes, deixando o monstro congelado deslizando pelo chão).
  - src/core/140-monstros-animados-quaternius-cc0-carrega.js: Substituído o loopPingPong413 por smoothLoop452. A animação de corrida de monstros não é mais executada em vai-e-volta (que causava o efeito visual de esticar e voltar no meio do passo), adotando agora uma interpolação de fechamento suave e esférica (slerp) nos últimos 25% do clipe, garantindo passadas contínuas para a frente sem estalos na emenda.
- Novo modelo 3D de Edran (Guarda da Ordem) e Sobreviventes:
  - models/edran452.glb: Novo modelo 3D exclusivo gerado no Blender com placas de armadura completas da Guarda de Aster, brasão solar dourado da Ordem da Fenda no peito, ombreiras, braçais, grevas, cinto de couro com fivela de ouro, túnica azul imperial, curativo de combate no ombro ferido e rig humanoide padrão de 17 ossos.
  - tools/campaign327.js: Hook em figure() carrega makeEdranActor() com models/edran452.glb para o guarda Edran no Ato I. Os sobreviventes civis abrigados sob a carroça passam a usar os modelos detalhados de cidadãos de Aster (Dorian e Selene) via Citizens133.
  - tools/intro401.js: pose(edran(), dt) atualizada para mapear diretamente os ossos do novo esqueleto (thigh_l, shin_l, upperarm_l, forearm_l, head, spine, chest), mantendo a cinemática de respiração e gestos de fala enquanto caído.
  - src/core/140-monstros-animados-quaternius-cc0-carrega.js: animChibi() atualizado com suporte à marcha articulada de Edran ao se levantar e guiar os sobreviventes até Aster.
- Testes: node --check em todos os módulos, python tools/build.py (duas passagens com src/core: igual), python tools/core_parts.py check (ok).

## v451 — Imunidade em cinemáticas, zona segura da estrada e corte de árvore com Machado de Pedra visível, 16/10/2026
- Pedido de Ian: "Durante algumas meio que eu posso ser atacado por mobs. E isso não deveria acontecer, porque daí eu posso morrer e eu não posso fazer nada, porque tá, é uma cinemática", "tem muito monstro ainda pelo mundo e é fácil eu morrer, eu morro muito rápido, eu não consigo avançar assim no jogo", e "o que eu quero é, pô, tô cortando madeira, eu fiz o machado. Ao invés de ser o machado que eu uso para matar mob, é um machado que eu fiz e tal, e eu começo a bater, eu quero essas animações, bater nas árvores, fazer ela cair, sabe?".
- Cinemáticas sem mortes injustas:
  - src/core/370-v281.js: Criada função isCinematic451() com verificação completa de estados de cinemática/diálogo (_cinematicGrace451, FX2.cine, window.CINE231, pds_intro_fade, Intro401.conversation, Intro401.reclaiming(), story401, reading406, e modalOpen). hurtPlayer(amt) retorna imediatamente sem dano enquanto o jogador estiver em cutscene/diálogo/fade ou durante a carência.
  - src/core/390-ia.js: pickTarget(e) ignora o jogador como alvo durante cinemáticas/diálogos, impedindo que monstros se aproximem ou iniciem agressão contra o jogador indefeso.
  - tools/intro401.js: Inserido buffer de carência de 2,5 segundos (_cinematicGrace451 e player.iT) após sair de diálogos e conversas, permitindo ao jogador se posicionar e puxar a arma antes de receber qualquer dano.
- Estrada de Aster protegida e recuperação no Ato I:
  - src/core/400-loop.js: No Ato I (ou enquanto sem classe), os spawns de monstros selvagens a menos de 170 metros dos portões de Aster são bloqueados (safeBuffer), o intervalo de spawn na região é desacelerado para 7,5s e o limite de monstros simultâneos é limitado a 3, evitando o acúmulo letal de monstros logo no início da jornada.
  - tools/campaign327.js: O diálogo de socorro a Edran no Ato I agora restaura 100% da vida do jogador (player.hp = player.mhp, floater('VIDA RESTAURADA')) e concede 3 segundos de invulnerabilidade (player.iT = 3.0), garantindo que o novato não morra logo após ajudar a carroça.
- Novo Machado de Pedra artesanal e animação de corte de árvore com queda física:
  - models/m437/machado-pedra.glb: Modelo 3D exclusivo modelado no Blender (haste de madeira rústica, empunhadura reforçada com fibras trançadas, cabeça de pedra lascada afiada e amarrações cruzadas em X).
  - tools/anim303.js: Nova animação de corte machadada com movimento vertical em dois tempos (elevação do tronco e golpe firme de duas mãos para baixo).
  - src/core/420-audio-musica-e-efeitos.js: Adicionados novos efeitos sonoros procedurais SFX.chop() (impacto rústico de machado na madeira viva) e SFX.tree_fall() (rangido de tronco quebrando e estalo vegetal).
  - tools/survival437.js: Ao cortar árvore, o personagem esconde temporariamente a arma de combate, equipa visualmente o machado-pedra.glb no socket da mão direita, executa a animação machadada, emite faíscas de lascas de madeira no ponto de impacto (fxBurst), aplica screen shake (shake(0.35)), faz a árvore balançar e tombar ao chão com áudio tree_fall e chuva de folhas antes de se converter em toras de madeira e toco.
- Testes: node --check em todos os módulos alterados, python tools/build.py (duas passagens com src/core: igual), python tools/core_parts.py check (ok).

## v450 — Cutscene da âncora rompendo usa a pedra da própria capital, que treme e explode em estilhaços da cor dela, 16/10/2026
- Ajuste na cinemática de quebra da âncora com a pedra visual específica de cada capital e explosão de fragmentos procedurais.

## v449 — Peça do Arquiteto sem corpo de chefe genérico temporário, 16/10/2026
- Prevenção do fallback para mesh genérico de chefe enquanto o modelo 3D das peças do Arquiteto (Pernas, Braços) carrega.

## v448 — Força atualização de cache para correção de fenda e HUD, 16/10/2026
- Atualização de cache para propagação imediata da correção de sobreposição de elementos na interface e interação com a Fenda.

## v447 — Fundo do mar: pressão, algas e Chá de Algas, ostras com pérola, veios do recife, monstros de fundo e correntes abissais, 16/10/2026
- Pedido de Ian (Sobrevivência parte 4, o que faltava do mar; a v441 já tinha caverna com ar, naufrágio, corais e a Masmorra Abissal de Thalor).
- tools/deep447.js (novo): PRESSÃO — mergulhando além do limite (8 m) a barra de pressão (no painel de Vida, só mergulhando) passa do limite, a pressão sobe e tira vida; limite +12 m com o Elmo de Mergulho (bolsa), +10 m e Fôlego +50% com o Chá de Algas, +15 m com a Poção de Pressão (Mira vende na Loja de Poções; aparece no fim da janela dela). Fundo do mar em células de 34 m: ALGAS no raso, OSTRAS GIGANTES (pérola 55%, sempre 1 carne) no recife e alto-mar, VEIOS (cristal Tripo do jogo) nas fossas (Minério + 1 Cristal); só pega mergulhando perto do fundo; voltam em 1 dia de jogo. MONSTROS DE FUNDO (lula, arraia, homem-peixe) aparecem nas fossas abaixo de 9 m (até 3). CORRENTES ABISSAIS (a Fenda do jogo) raras nas fossas: F leva ao Mar de Thalor Norte/Sul ou ao Arquipélago das Ilhas-Cidade (travessia entre mares). Bolsa: BEBER chá/poção e VENDER PÉROLAS (perto de cidade). Manual (seção MAR): Chá de Algas (2 Algas + 1 gole de água limpa, perto de fogueira acesa) e Elmo de Mergulho (4 Minério, 2 Couro, 2 Resina, perto da bancada).
- Leito do mar com areia molhada que escurece e fica azulada no fundo (tools/terrain245.js passa sea446 ao chão; tools/ground446.js pinta). Modelo novo models/m440/algas.glb (Tripo Studio).
- Partes ligadas: openShop (Mira), janela da bolsa e do Manual (botões injetados), Water.max do mechanics434 (fôlego), game.html/sw.js (deep447, terrain245/ground446 ?v=447, pds-v447).
- Teste: costa de Thalor: 64 pontos de fundo; colher algas mergulhando; fossa (−10620, 150) a 13,7 m com limite 8 m → pressão cheia, vida 137→104, 3 monstros de fundo; Mira mostra a Poção de Pressão; botões na bolsa e no Manual; chão em terra sem mudança. Sem erro no console. Não testado: corrente abissal (nenhuma perto no teste).

## v446 — Cenário refeito: grama por ruído Perlin, flores, cactos e pedras Tripo, chão de areia, gelo e terra, 16/10/2026
- Pedido de Ian: "refaz esse cenário ... grama com aquele negócio de Perlin noise, o cacto, essas pedras" e "areia tbm gelo terra".
- tools/grass446.js (novo): grama em tufos de 11 lâminas em células de 0,55 m num raio de 34 m, onde nasce e quanto nasce vem de ruído Perlin de gradiente (fbm de 4 oitavas + detalhe), então o campo fica em manchas; densidade e cor por bioma (campos/flores cheios, floresta mais escura, pântano amarelado, neve e cristal ralos com capim claro, deserto tufos secos raros, vulcão nada). Não nasce em água, estrada, cidade, trilha/calçamento nem perto de construção. Vento e o jogador empurrando as lâminas no shader; raiz pelo relevo (instância). Flores procedurais (haste + pétalas em cruz, 5 cores, manchas de cor por ruído) nos campos floridos e raras nos campos. A grama/flores/folhinhas antigas do cenário (grass*, flower_*, plant_flat*) saem. Até 30 mil tufos e 4 mil flores, montados em ladrilhos de 8 m (10 por vez).
- tools/ground446.js (novo): última camada do chão por ruído no shader — AREIA com ondulações de vento tortas pelo fbm, dunas e grãos brilhantes; NEVE com montes e placas de GELO azul rachado e liso (reflexo: rugosidade 0,16); TERRA com manchas de solo, pedrinhas e variação no verde. Estradas/trilhas ficam como estão.
- Cactos e pedras: src/core/680 (TripoEnvironment153) — cactos antigos (cactus_*) viram 2 cactos novos do Tripo Studio (saguaro com flor e palma com frutos; models/tripo-cacto446a/b.glb + versões leves), pedrinhas (rock_small*, stone_small*) viram o monte de pedras Tripo e pedras grandes (rock_large/tall, stone_large/tall) o rochedo Tripo; todos com versão leve para longe (tripo-pedras437-lod, tripo-rochedo154-lod) e recorte a 90 m como as árvores. tools/clear445.js reconhece esses modelos (cacto/pedra/pedregulho continuam removíveis).
- Partes ligadas: src/core/680 (files, lod, scen446, NAT422, sem brilho de janela à noite nos cactos), tools/clear445.js (?v=446), game.html/sw.js (ground446, grass446, pds-v446).
- Teste: campos (8 mil tufos), flores (6,6 mil + flores), neve (capim claro, placas de gelo rachado), deserto (cacto Tripo, ondulações, tufos secos); sem erro no console. Não testado: fps na máquina do Ian com a grama cheia.

## v445 — Limpar o terreno: cactos, arbustos, pedras, pedregulhos e tocos, 16/10/2026
- Pedido de Ian (limpeza total para construir, junto da terraplenagem). A v441 já tinha cactos como pontos de coleta próprios; esta versão remove o que JÁ ESTÁ no cenário.
- tools/clear445.js (novo): cada lote de cenário (EnvBatch dos modelos do jogo) guarda a lista do que tem; perto de um cacto, arbusto, pedra, pedregulho ou toco aparece "F · CORTAR CACTO PELA RAIZ / ARRANCAR ARBUSTO / QUEBRAR PEDRA / QUEBRAR PEDREGULHO / ARRANCAR TOCO" com golpes (2/1/2/5/3) e estamina. Ao terminar, os vértices daquele objeto somem do lote, o colisor sai e o ponto fica em run.clear445 (reaplicado quando o pedaço do mapa recarrega). Pedras grandes do cenário Tripo (rochedo, pedras, rocha com musgo) somem como as árvores derrubadas.
- Ferramentas: cacto com as mãos, machado, pá ou picareta; arbusto e pedra pequena com as mãos; pedregulho só com Picareta; toco com machado, picareta ou pá. Recompensas: cacto → Polpa/Água de Cacto, Fibra Árida e Espinhos (item novo); arbusto → Fibras (+Cipó/Frutas às vezes); pedra → Pedra Lascada; pedregulho → 4–6 Pedra Lascada (+Minério); toco → Feixe de Lenha, Fibra, às vezes Resina.
- Árvore derrubada agora deixa um TOCO (pedaço curto da Tora Bruta Tripo em pé) que dá para arrancar.
- Partes ligadas: Armadilha de espinhos passa a pedir 2 Lenha + 3 Espinhos + 2 Fibras (antes 2 Ossos); "Fibras Espinhosas" da v441 passam a se chamar Fibra Árida. game.html/sw.js (clear445, pds-v445).
- Teste: cacto, pedra e arbusto removidos com recompensa; árvore derrubada → toco → arrancado (1/3, 2/3, sai); depois de recarregar o cacto continua removido (4 limpezas salvas). Sem erro no console. Não testado: pedregulho Tripo (nenhum perto no teste).

## v444 — Terraplenagem suave (sem blocos): nivelar, cavar, aterrar, trilha e calçamento, 16/10/2026
- Pedido de Ian (terraplenagem estilo Valheim/Planet Crafter, sem blocos; mapa persistente de alturas; ferramentas com círculo no chão; trilha que tira a penalidade do carrinho). A v441 (outra sessão) tinha um "nivelar" simples (disco plano na altura 0 pelo TER245.D, ainda usado pelo Ato VIII); este é o sistema completo e fica ao lado.
- tools/terrain245.js: carimbos de terraplenagem aplicados por último no relevo, iguais no shader (terra444/path444, uniform uTF444[48] + uTFN444, enviados a cada desenho como os outros) e no CPU (terra444cpu, TER245.path444). Tipos: 0 soma altura com borda suave (cavar/aterrar), 1 nivela até uma altura, 2 trilha de terra batida, 3 calçamento de pedra. O chão (malha de 2 m) segue e as normais saem do próprio relevo. A trilha/calçamento pinta o chão com o visual de estrada (road128).
- tools/terra444.js (novo): modo TERRAPLENAGEM (tecla 9 na tela de teclas, ou MENU → TERRAPLENAGEM) com barra abaixo dos painéis do topo e círculo laranja no chão à frente (raio 2–6 m); F aplica. NIVELAR (Pá ou Enxada) deixa o círculo na altura dos pés; CAVAR (Pá; rocha só com Picareta) rebaixa 0,35 m por uso e dá Terra, Areia (deserto/praia), Argila (água/pântano) ou Pedra Lascada (rocha/fundo); ATERRAR (Pá) gasta 1 Terra/Areia/Argila/Pedra e sobe 0,35 m; TRILHA (Enxada/Pá) terra batida; CALÇAMENTO (Picareta, 2 Pedra Lascada). Gasta estamina; não cava dentro de cidade. Edições salvas em run.terra444.st (até 3000; as 48 mais perto vão para o relevo); seguidas no mesmo ponto se juntam.
- Carrinho (tools/cart437.js): em trilha/calçamento não gasta estamina na subida e anda até 20% mais rápido.
- Manual (tools/build437.js): Enxada Pesada (3 Pedra, 1 Lenha, 2 Fibras, 1 Minério) e Picareta (2 Pedra, 1 Lenha, 3 Minério); a "Pá / Enxada" da v441 passa a se chamar Pá de Terraplenagem. Itens novos: Terra, Areia, Argila.
- Teste: encosta em (−52, 193): nivelar 4× → desnível do círculo 1,15 m → 0,06 m na altura dos pés; cabana em cima do platô; cavar −1,75 m; aterrar +1,05 m; calçamento de 9 passos visível; recarregar o jogo mantém tudo (19 edições). Sem erro no console. Não testado: fps com muitas edições na máquina do Ian.

## v443 — Barcos acertados (casco na linha d'água, navio) e HUD sem sobreposição, 16/10/2026
- Observação: a v441 (outra sessão) publicou uma cópia anterior destes arquivos de barco junto com os Atos VIII–IX; esta versão traz o que faltava (casco afundado na linha d'água e convés certo, navio de expedição, sem montar barco em cima de outro, HUD). Números ?v=443.
- Pedido de Ian (Sobrevivência parte 4, barcos) + reclamação dele com print: "essas coisas estão muito perto uma da outra e tampa" (barras Fome/Sede, botão Passo silencioso e o aviso do F empilhados no meio de baixo).
- HUD: Fome e Sede agora ficam dentro do painel de Vida/Estamina (#stat), lado a lado, com as mesmas barras (.bar/.lbl) e % (tools/survival437.js). O botão fixo de Passo silencioso saiu: um selo pequeno aparece no mesmo painel só com o passo ativo (Ctrl), e a barra de fôlego aparece ali só mergulhando (tools/mechanics434.js). A barra do molde de construção desce para baixo dos painéis do topo (não cobre mais Vida nem a missão).
- tools/boats440.js (novo): no Manual, Canoa (Tora + Tábuas + Resina), Veleiro de pesca e carga (casco, mastro, vela de couro e fibra, vedação) e Navio de expedição (6 etapas). O molde vai sozinho para a 1ª água funda à frente e não monta em cima de outro barco; pronto, vira barco em run.boats440 (y absoluto na superfície, casco na linha d'água). F perto: EMBARCAR. A bordo: anda só na água funda (encalha na margem), canoa 1,3×, veleiro 1,65× (mais lento com o carrinho e a carga), navio 1,4×; F abre o menu: desembarcar na margem seca, pular na água para mergulhar (Ctrl/Espaço), e no navio dormir na cabine (sono completo), salvar e baú de 300 kg. O veleiro leva o carrinho que estiver a até 14 m (aparece no convés, desce na margem junto).
- Partes ligadas: tools/build437.js (moldes na água: water/draft, y na superfície, corte por etapa somando a altura, alcance do F maior, storeView exportado), tools/water391.js (a bordo não nada: run.aboard440), tools/cart437.js (carrinho no barco some do chão: onBoat440), tools/survival437.js (glb aceita pasta: m440/navio). Modelos novos do Tripo Studio em models/m440/: navio, ostra, caverna (ostra e caverna são da próxima parte). game.html/sw.js (?v=440, pds-v440).
- Teste: canoa/veleiro/navio montados na água perto da praia (−9609, 550), levados ao mar aberto, embarcar no veleiro com o carrinho (vai no convés, segue o barco), navegar sem nadar, pular (nadando), navio: menu com dormir (cansaço zerado) e baú, canoa desembarca em terra seca; HUD conferido em print. Sem erro no console.

## v442 — Correção das Marcas do Arquiteto no menu, rastreamento dinâmico de Atos no HUD e evolução visual imediata da cidade, 16/10/2026
- Pedido de Ian:
  1. **Marcas do Arquiteto no menu:** ao clicar em "MARCAS DO ARQUITETO" sem ter marcas registradas, nada abria (apenas um toast silencioso). Agora o modal abre sempre com guia explicativo completo da mecânica das Marcas (glifos rúnicos dos Guardiões a partir do Ato IV), slots rúnicos e indicação de como comparar sinais com Lyra.
  2. **Objetivos do Ato no HUD:** ao trocar a missão acompanhada no Diário/Rank, o HUD do Ato (`tools/intro401.js`) ficava preso em "MUNDO ABERTO · HISTÓRIA OPCIONAL" porque só verificava o Ato I. Agora detecta `run.trackObj` dinamicamente, exibindo o título do Ato com numeral romano (ex.: `ATO VIII · O CLÃ FERRUGEM · 2/5`), descrição exata do passo corrente e aponta a seta 3D/anel de pulso diretamente para o alvo da missão (`Campaign327.target()`).
  3. **Evolução da Cidade:** `cityL(c)` prendia capitais (inclusive Aster) no nível 4 artificialmente (`Math.max(c.capital ? 4 : 0, ...)`), fazendo com que as doações para os níveis 1, 2, 3 e 4 não gerassem nenhuma alteração visual na cidade inicial. Corrigido para `(profile.cityLv||{})[c.id]||0`, permitindo que cada doação (bandeiras nas torres no nv 1, carroça e depósito no nv 2, muralhas brilhantes e colunas no nv 3, estandartes e feira no nv 4, etc.) apareça imediatamente. Além disso, `reloadCityChunks(c)` descarrega e recria a zona de chunks num raio de 2 ao redor da cidade, aciona aviso sonoro (`sfx('level')`, `sfx('gong')`), anel de partículas (`fxRing`) e `bigText('NÍVEL X')`.

## v441 — Integração completa dos Capítulos 8, 9 e 10 (Atos VIII e IX, Dungeon Abissal de Thalor, Zahar e Ymiria) com Sobrevivência e Terraplenagem, 16/10/2026
- Pedido de Ian: integrar e validar os Capítulos 8, 9 e 10 do Livro Oficial (Atos VIII e IX da campanha em `tools/campaign327.js`, `tools/mechanics434.js` e `tools/biomes295.js`) com Sobrevivência, Lenha, Carrinho de Carga, Mar e Terraplenagem (`terrain245.js` / `terrH`).
- Ato VIII Completo (O Clã Ferrugem e Torvo, `tools/campaign327.js`):
  - Passo 0 (rota para o oeste): desfiladeiro obstruído por rochas, tocos e estandarte falso pintado por cima com emboscada dos falsos saqueadores (`6 goblins + 1 elite`). Permite soltar o Carrinho (`F`) para lutar com mobilidade total e usar a **Pá/Enxada** (`pa`) para nivelar (`Surv437.levelTerrain441` → `TER245.D` em `src/core/400-loop.js`) e limpar a passagem.
  - Passo 1 (vale da fundição velha): encontro real com **Torvo** e os refugiados cercados.
  - Passo 2: curar a Fome, Sede e Cansaço dos refugiados no vale da fundição velha montando/acendendo uma **Fogueira** próxima ou entregando **Água Fervida** (`cantil` com `limpa`/`cha`) ou **Comida Assada** (`assada`/`defumada`/`cogu_assado`).
  - Passos 3 e 4: colher o testemunho de Torvo e registrá-lo com **Lyra** na Ordem.
- Ato IX (Parte 1) — Thalor (-5, 0) e Interior da Dungeon Abissal (`tools/mechanics434.js`):
  - **Veleiro Costeiro de Carga** (`veleiro` de `tools/boats440.js`, integrado ao peso do Carrinho) ancorado na costa oeste de Thalor; zona de mergulho vertical sob a rocha flutuante com corais bioluminescentes (`coral-reef.glb`), navio naufragado (`models/m437/naufragio.glb`) e caverna submersa com bolsão de ar (`models/m440/caverna.glb`, recupera o fôlego).
  - **Portal Aquático (Fenda Submersa)** carrega a câmara da **Dungeon Abissal de Thalor** (`enterAbyssalDungeon441`), onde o **Braço Esquerdo do Arquiteto** (`pieceMesh250(0)` de `models/arquiteto246.glb`) aparece acorrentado sob a base da Pedra-Âncora de Thalor (`anchor-thalor.glb`). Derrotar os 3 Elites Abissais estabiliza as correntes, sintoniza a Âncora de Thalor e libera o **Elevador Aquático** para emergir na cidade flutuante de Thalor.
- Ato IX (Parte 2) — Sobrevivência Climática em Zahar (5, 0) e Ymiria (0, -5) (`tools/biomes295.js`, `tools/survival437.js`, `tools/build437.js`, `tools/ecology410.js`, `tools/mechanics434.js`):
  - **Deserto de Zahar (5, 0):** bioma árido garantido na região de Zahar com queda acelerada de Sede (`2,35×`); cortar **Cactos** (`models/m440/cacto.glb`) fornece **Polpa/Água de Cacto** (`polpa_cacto`, +32% Sede, +14% Fome) e **Fibras Espinhosas** (`fibra_espinhosa`); uso da **Pá/Enxada** (`pa`) para nivelar dunas na rota do Carrinho; defesa da Pedra-Âncora contra os Elites do Deserto revelando o **Braço Direito do Arquiteto** (`pieceMesh250(1)`) selado.
  - **Montanhas Glaciais de Ymiria (0, -5):** bioma glacial garantido na região de Ymiria com acúmulo de Frio/Congelamento (`cold441`) longe de calor, neutralizado por **Fogueiras** alimentadas com **Feixes de Lenha**, **Tochas com Resina** (`tocha`, 1 Feixe de Lenha + 1 Resina) ou **Chá Térmico** (`cha` fervido no Cantil). Comportamento do Povo do Manto Branco: guardar/empunhar arma (`X` / `Eco410.toggleSheath`) mantém o **Filhote de Yeti (#013)** (`yetinho`) neutro, e os menores fogem em pânico (`FUGA DO BANDO!`) quando o **Yeti Alfa Corrompido** cai na defesa da Pedra-Âncora de Ymiria.
- Teste: `python tools/build.py` (duas vezes, `src/core: igual`), `python tools/core_parts.py check` (`ok`), `node --check` em todos os módulos alterados e suíte `node tools/test-acts89-441.cjs` + `test-scenes406.cjs` + `test-ecology410.cjs` (`ALL_V441_TESTS_PASSED`).

## v440 — Barcos (Canoa e Veleiro Costeiro de Carga), fundo do mar e modelos m440, 16/10/2026
- `tools/boats440.js`, `models/m440/` (`caverna.glb`, `cacto.glb`, `coral-2.glb`, `estatua-submersa.glb`, `arca.glb`, `perola.glb`), integração do peso do Carrinho no Veleiro Costeiro de Carga e mergulho no mar de Thalor.

## v439 — O Mar de Thalor (Sobrevivência, parte 4: o mar), 16/10/2026
- Pedido de Ian (pacote Sobrevivência parte 4), publicado em partes a pedido dele ("cada vez que terminar uma parte já publica"). Esta parte: o mar no relevo, a superfície e a água salgada. Barcos e fundo do mar vêm nas próximas versões.
- tools/terrain245.js: seaD439/seaBed439 iguais no CPU (terrH) e no shader (terrH245). Costa em x ≈ −9750 (onda de ±230 m em z), a oeste de Thalor (Thalor fica na costa). Fundo: praia (d 0), recifes com corais altos até ~450 m (−3 a −7 m), alto-mar até −22 m, fossas de até −64 m depois de 800 m. Nível do mar TER245.SEA439.Y = −0,9 (absoluto). Cidades além da costa viram ilhas (o disco plano da cidade, 400-loop, continua a 0 m); estradas viram píer até 300 m e afundam até 600 m (rk439).
- tools/water391.js: waterAt reconhece o mar ({top: −0,9, sea:true}); nado e mergulho (mechanics434) funcionam no mar.
- tools/sea439.js (novo): superfície do mar (ShaderMaterial com ondas, cor pela profundidade lida do relevo no shader, espuma na praia, reflexo do céu, dia/noite), malha de perto 1,2 km + anel de longe 9 km, só onde seaD439 > −60 (vales e rios em terra não ganham água do mar). Cenário de terra firme (árvores, casas, pedras: EH/EW) não nasce no fundo (mede com o relevo ligado, porque o pedaço às vezes monta antes do relevo ligar). Bicho terrestre que nasceria a mais de 1,4 m de fundo vira homem-peixe, lula, arraia ou peixinho (história/chefe ficam como estão). Aviso ao chegar perto da costa.
- Água do mar: beber dá mais sede (−8); cantil cheio de água do mar se DESTILA na fogueira acesa (metade dos goles vira água limpa e sobra 1 Sal Grosso). tools/survival437.js e tools/build437.js (?v=439).
- Partes ligadas: game.html/sw.js (terrain245, water391, survival437, build437 ?v=439; sea439 novo; pds-v439).
- Teste: costa de Thalor (−9626, 300), superfície visível até o horizonte, nadar no mar (Water391 sea:true, nadando), 0 árvores submersas depois de recarregar, goblin no fundo vira arraia, sem erro no console. Não testado: fps na máquina do Ian; ilhas-cidade de perto.

## v438 — Cristal de Ymiria flutuando, 16/10/2026
- Pedido de Ian ("Sim, flutuando"): em Ymiria o cristal de gelo era parte do modelo da base e era o único preso. No Blender o modelo foi separado em base (models/m434/anchor-ymiria-base.glb) e cristal (models/m434/cristal-ancora-gelo.glb); o arquivo antigo anchor-ymiria.glb saiu. tools/mechanics434.js: Ymiria usa base + cristal flutuando e girando como Zahar, Thalor, Urdan e Verden (?v=438).
- Teste: Ymiria com a pedra no centro, cristal solto acima da base, sem erro no console.

## v437 — Sobrevivência no mundo aberto: lenha e coleta, carrinho de mão, fome e sede, construção peça por peça, 16/10/2026
- Pedido de Ian (pacote Sobrevivência, partes 1–3; a parte 4, mar/barcos/fossas, fica para a próxima versão porque o mundo ainda não tem mar: só rios e lagos). Sem "Modo Sobrevivência" separado: tudo no mundo aberto.
- tools/survival437.js (núcleo): bolsa de sobrevivência por peso (35 kg; +30% Bem Alimentado), MENU → SOBREVIVÊNCIA, tecla 8 (tela de teclas) ou clique nas barras Fome/Sede acima do HUD. Fome (~1,6 dia de jogo) e Sede (~1 dia; 1,8× no deserto/vulcão) caem mais com esforço (estamina gasta), carga e frio. Fome baixa: −25%/−50% de regeneração de estamina e −10%/−20% de dano; zerada tira vida até 15%. Sede <15: −40% de estamina e cansaço (v287, run.awake287) 2× mais rápido; zerada tira vida até 10% e −10% de velocidade. Comida assada/defumada/salgada dá Bem Alimentado (+10% vida máx., +20% estamina, +30% carga). Crua estraga (carne ½ dia, frutas 1,5, cogumelo 1) e vira Comida Estragada; assada 3 dias, defumada 8, salgada 12. Carne crua e cogumelo cru e água crua podem dar Mal-estar.
- Água: na margem de rio/lago, F · BEBER / ENCHER O CANTIL (água crua 25% de mal-estar, pântano 60%); ferver na fogueira ou chá de ervas deixa segura; coletor enche com chuva. Não existe água do mar ainda.
- Coleta: pontos fixos por célula de 26 m fora das cidades e estradas, voltam em 1 dia de jogo — pedras do cenário Tripo (Pedra Lascada, Minério Superficial, Sal Grosso no deserto), arbusto de frutas (Frutas, Cipós) e touceira de ervas (Fibras, Ervas, Cogumelos). Árvore sem machado: F dá Resina. Caça: coelho, alpaca, lobo, chifrudo, yeti, dino, raptor etc. dão Couro, Carne Crua e Ossos.
- Árvores: com Machado de Pedra (Manual: 2 Pedra + 3 Fibras) ou machado equipado, F golpeia (carvalho 6, salgueiro 5, conífera 4; 8 de estamina cada); a árvore cai (cópia do modelo girando) e deixa 2–3 Toras Brutas físicas no chão. A instância some do lote (base423 zerada + colisor tirado) e fica salva em run.surv437.felled (reaplicada quando o pedaço do mapa recarrega). Tora: cortar em 3 Feixes de Lenha ou 2 Tábuas, levar no ombro (−30% de velocidade; atacar larga) ou pôr no carrinho.
- tools/cart437.js: carrinho de mão (Manual, na bancada: 6 Tábuas, 2 Cipós, 1 Minério, montado em 2 etapas). F · PUXAR / SOLTAR; 400 kg com toras, feixes, tábuas e caixas empilhados à vista; −10% a −45% de velocidade pela carga; subida gasta estamina pela altura (terrH) e pelo peso, sem estamina fica mais lento; atacar solta na hora; largado, monstro com aggro encostado estraga (−5%/s por monstro), quebrado perde 30% da carga e conserta com 2 Tábuas. Modelo de 2 rodas num eixo gerado no Tripo Studio pela extensão do Chrome (o da API veio com 4 rodas): varais no −x do modelo, girado +90°.
- tools/build437.js: Manual de Sobrevivência → molde translúcido na frente (vermelho onde não dá: árvore, água, cidade, outra obra); Enter coloca, R gira, Esc cancela (enquanto o molde está aberto R não solta a Habilidade 2 e Enter não interage). F no molde encaixa 1 peça por vez tirando da bolsa, do carrinho a 8 m ou da tora no ombro; o modelo pronto sobe de baixo para cima por etapa (shader de corte no y antes do relevo) e o resto fica translúcido. Estruturas: Fogueira (cozinha, ferve, chá, salga, aquece no frio usando a proteção do biomes295), Abrigo (dormir: cansaço zerado, 60% da vida, salva; à noite acorda de manhã), Cabana (5 etapas; cama 100%, lareira, porta trancável, baú), Suporte de toras, Varal (defuma 1 h com fogueira acesa perto, 4 h sem; salga), Coletor de chuva, Bancada (cantil e carrinho), Baú (200 kg, separado do banco), Armadilha de espinhos (fere e prende monstros), Armadilha de laço (bicho pequeno sozinho), Paliçada e Portão (abre/fecha). Recolher armadilha/paliçada devolve metade. Tudo salvo em run.build437.
- Modelos novos em models/m437/ (Tripo pela API, 30 créditos os grandes, 20 os de coleta; ~5 mil triângulos, 0,2–0,5 MB): carrinho, tora, feixe-lenha, tabuas, fogueira, abrigo, cabana, varal, coletor, bau, armadilha (deitada no código), suporte-toras, bancada, arbusto, ervas; canoa, veleiro e naufragio já reduzidos para a parte do mar.
- Correção achada no teste: models/tripo-pedras154.glb (as "pedras" espalhadas pelo mundo, TripoEnvironment153 stones) era desde a v153 um braçal preto e vermelho ("dark fantasy forearm gauntlet", do Metamorfo) — por isso apareciam peças pretas soltas no chão, que Ian achava ser a armadura do Metamorfo. Trocado por um monte de pedras novo do Tripo Studio (models/tripo-pedras437.glb, ~1,8 mil triângulos; src/core/680 aponta para ele) e o arquivo errado foi removido. A armadura do Metamorfo em si não foi mexida.
- Partes ligadas: game.html (3 scripts depois do mechanics434), sw.js (pds-v437 + cache), tela de teclas (KEYACT surv437 = 8; B e E já eram Bolsa e Interagir). Funções embrulhadas: pVigorRegen281, hurtEnemy, refreshStats, movementSpeed, attack, killEnemy (sem embrulhar pickTarget).
- Teste no navegador integrado: árvore derrubada e salva (some depois de recarregar), 3 toras no chão, 32 pontos de coleta, carrinho montado/carregado (216 kg, 71% de velocidade)/puxado/subida/estrago por goblin (100→85), 13 estruturas montadas, cabana em etapas, fogueira acesa com luz, assar/ferver/chá, comer (Bem Alimentado), cantil, comida estragando, baú, dormir no abrigo, coletor na chuva, caça, nadar/mergulhar, andar e atacar (goblin 152→95). Sem erro no console. Não testado: celular, fps na máquina do Ian, sessão longa de jogo real.

## v436 (16/10/2026) — Registro visível, F pega, aviso e acompanhamento dos Atos
- Pedido de Ian: (1) não aparecia nenhum livro de registro para pegar; (2) F não pegava nada; (3) ao terminar um ato não avisava que dava para jogar livre e continuar depois, e o ato seguinte não entrava no acompanhamento.
- Causa: a missão "Os nomes que chegaram" (lyra_names) usava marcador vazio (makeBeacon sem nada) — ponto invisível, F só a 3 m de um lugar que não se via.
- Correção (tools/campaign327.js): livro de couro com fecho brilhando, flutuando de leve, em cada um dos 3 pontos (flag book:true); alcance do F 3,6 m. Ao concluir um ato principal: aviso "Agora o mundo é seu… o Ato X abre assim: …" (ou "já está liberado"). Quando o próximo ato libera, entra sozinho no Acompanhar (a menos que outra missão da campanha esteja acompanhada) com toast "Novo ato liberado… Acompanhando no mapa".
- Teste: 3 livros aparecem, F recolhe os 3 e a missão passa para "Leve os registros a Lyra"; Ato I concluído → aviso; rank D → Ato II começa e fica acompanhado.

## v435 (16/10/2026) — Aster não é atacada por monstros
- Pedido de Ian (print: 'ASTER SOB ATAQUE: DEFESA 0%/1%' piscando). Causa: o evento de Invasão (updEvents) mirava a cidade mais próxima, inclusive Aster; a trava antiga segurava a defesa em 1% e ela piscava 1/0.
- Regra: Aster é o último refúgio — só o Arquiteto a ameaça. Invasão não escolhe Aster; ataque já ativo em Aster é cancelado e os monstros soltos (save antigo). Removida a trava de 1%. Rompimento de portal e Horda já excluíam Aster.
- Partes: 260-v341.js (updRaids155), 450-oraculos (updEvents). Teste: ataque falso em Aster some e HUD limpa; outra cidade segue sendo atacada; Invasão perto de Aster não dispara.

## v434 — Pedras-Âncora no lugar da fonte, cristais novos do Tripo, Passo Silencioso, rastros, Atos IV–VII e mergulho, 16/10/2026
- Pedido de Ian (lista de mecânicas v422+), refeito depois de Ian achar a 1ª versão feia ("não bate com o jogo"): nada de forma geométrica solta; modelos do Tripo e do próprio jogo. Arena de Sobrevivência descartada por Ian (não existe).
- Módulo novo tools/mechanics434.js (depois do bestiary405). Modelos novos em models/m434/ gerados no Tripo por texto (30 créditos cada; 13 modelos = 390 créditos da API) e enxugados no Blender (~9 mil triângulos, textura 1024 JPEG, 0,2–0,5 MB cada): 5 bases de Pedra-Âncora (uma por capital), 4 cristais de âncora (âmbar, turquesa, violeta, verde), 2 cristais de veio (brancos, tingidos pelo rank), coral, ruína submersa, ilhota de rocha flutuante.
- Pedra-Âncora: nas 5 capitais (Ymiria, Zahar, Thalor, Urdan, Verden) fica no centro, no lugar do selo/fonte (src/core/260 chama Anchor434.seal; o resto das cidades segue com o seal231). Base própria + cristal da cor da capital girando + círculo de runas (shader da campanha) + clima local (neve, areia, névoa, faíscas, esporos). Thalor tem ilhotas flutuando em volta. Verden: o cristal do próprio modelo saía torto (Ian) — tirado no Blender e trocado pelo cristal verde centralizado. F = sintonizar; MENU → PEDRAS-ÂNCORA mostra as 5.
- Cristal antigo (cristal-fenda-rank125 / crystalCluster230) não é mais usado (Ian: "muito feio"): crystalCluster230 agora devolve o cristal Tripo tingido pela cor do rank só na parte clara (a rocha da base fica natural). Vale para veios de mineração, cristais de masmorra e núcleo da defesa.
- Altura no relevo (lição): o shader do terrain245 soma a altura do chão a todo objeto pela raiz; peças posicionadas com terrH()/gy() precisam de userData.terrainAbsolute245. A campanha (figuras de Edran/Aldric/sobreviventes, carroça do resgate, marcadores, poeira) e a seta/anel do objetivo (intro401) flutuavam em morro: marcadas como absolutas.
- Passo Silencioso (Ctrl ou botão no HUD; tecla na tela de teclas): -35% de velocidade, agachado; criaturas cegas (slime, gosma, cogumelo, glub) só percebem encostando (<0,9 m), as outras a <3,2 m; 1º golpe num alvo que não te viu = dano x2 ("FURTIVO x2"). Filtro no los (embrulhar pickTarget entra em laço com o witcher377).
- Rastros: Ato II (carroça) e Ato V (Aldric) — pegadas e sangue azul com textura desenhada, brasas e coluna de fumaça preta (sprites), da cidade até o local.
- Ato IV: círculo de runas e 5 runas flutuando em volta dos guardiões; ao derrotar, janela MARCAS DO ARQUITETO (comparação). Ato V: Aldric ferido contra a rocha com musgo (Tripo do cenário) e escolta até Mira (Mira só aceita com ele a < 8 m). Ato VI: 6 veios reais (addVein, cristal novo) para os 20 cristais; brecha com muro Tripo, a Fenda esculpida (Rift131, fecha ao vencer) e o Brann Tripo. Ato VII: MAPA ASTRAL antes do relato a Lyra.
- Mergulho: nadando, Ctrl afunda e Espaço sobe; Fôlego 12 s + 0,25×Vit + 0,15×Res; sem fôlego perde 8% da vida/s; tela azul; corais e ruínas Tripo no leito (mais em Thalor); Portal Aquático (Rift131) solta Homem-Peixe Fendido, Lula e Arraia e fecha ao vencer.
- Partes ligadas: src/core/260 (selo das capitais), tools/campaign327.js e intro401.js (?v=434, altura absoluta), game.html/index.html, sw.js (pds-v434), tela de teclas (KEYACT sneak423). Save: profile.m423 (âncoras, marcas, mapa astral).
- Revisão antes de publicar: ao entrar numa masmorra/instância, os corais, o Portal Aquático (cena + F) e a tela azul do mergulho ficavam no mundo; agora saem ao sair do modo mundo, e um portal aberto e abandonado some a 180 m. Teste: portal criado, entrar na masmorra → removido da cena e do F; voltar, andar e atacar (goblin 152→107) sem erro.
- Testado no navegador integrado (prints enviados a Ian): 5 capitais com a pedra no centro, veios com cristal novo (mineração conta +cristal e storyEv), Aldric na rocha num morro de 18 m sem flutuar, runas do guardião, furtivo (slime não vê a 2,5 m, goblin vê a 2,7 m e não a 6 m; velocidade 65%; dano x2), mergulho/fôlego/portal. Não testado: celular, campanha jogada do início, fps na máquina do Ian.

## v433 — Colisão em carroças, pessoas e enfeites; carroça entra na cidade e para, com cena de embarque/desembarque, 16/10/2026
- Pedido de Ian: dava para atravessar a carroça, NPCs e vários objetos; a carroça chegava no portão, sumia e o jogador caía dela. Ela tem que entrar, parar e ter uma cena de sentar/sair.
- tools/solid429.js (novo): o que se mexe entra no mesmo HASH de colisores (hadd/hrem) e é atualizado a cada quadro. Carroça da estrada = 7 círculos no corpo e no boi (barra jogador, monstros e câmera; some enquanto o jogador está nela). NPCs da cidade (vendedores, caçadores, moradores), clãs amigos, caravana escoltada e figurantes da campanha = colisor `pl429`, que só barra o jogador; quem anda desvia dele e ninguém entra na carroça. Acampamentos de clã (barraca, fogueira, totem) e a carroça tombada da campanha registrados como peças fixas. Bichinhos (gato/galinha/pombo) continuam sem colisão.
- 170-colisao: `pushOut` ignora `pl429` para quem não é o jogador; `worldFree` ignora `pl429` (pessoas não contam para câmera, IA nem lugar livre).
- Enfeites que ficavam atravessáveis ganharam colisor: colunas de estátua da praça, cavalete/alvo/caixote ao lado das lojas, estandartes do festival, sua casa e o andaime da casa à venda (490, `buildHouse` recebe `addCol`), caixotes e lampião dos postos de estrada.
- tools/civic343.js: perto da cidade de destino a carroça segue o eixo do portão mais próximo, o portão abre para ela (260 `updGates341`), entra pela rua principal (faixa a 1,2 m do centro) e estaciona a 30 m da praça (2ª vaga a 39,5 m). Para se o jogador estiver na frente. Some só quando o jogador está a 75 m (ou após 150 s a 28 m). Cidade caída continua como antes.
- tools/living372.js: embarque = cena curta (câmera de lado, o Viajante anda com a animação real até a traseira, vira e senta no banco); desembarque (F/Espaço ou chegada) = levanta, desce e se afasta para um lugar livre; a carroça espera parada. Na chegada o mercador fala "Chegamos a …". Troca de mapa/carroça destruída ainda desembarca na hora, em lugar livre.
- Partes ligadas: nenhum texto falava de atravessar carroça/NPC; o aviso de carona continua certo. tools/test-living372.js espera a cena terminar antes de conferir o desembarque.
- Teste (navegador, passo fixo): andar contra Kael para a 0,95 m; contra a carroça andando, de lado para a 1,6 m do eixo; de frente a carroça para e o Viajante fica no boi; carroça estacionada barra de lado/trás. Viagem de carona até Aster pelo portão leste: entrou, estacionou a 30 m, desembarque com cena (prints). Desembarque no meio da estrada: carroça parada durante a cena e segue depois. Edran caído e carroça tombada barram, "F · AJUDAR EDRAN" continua. Andar 4,3 m/s e ataque acertando. Custo do módulo: 0,013 ms por quadro. Não testado: capital de nível 6+ com muralha externa e vagas cheias com 2 carroças na mesma porta.

## v432 — Ombreira e saiote acompanham o corpo em todas as armaduras GLB, 16/10/2026
- Pedido de Ian: "faz isso tbm pra todas as armaduras com glb que tem no jogo" (ombreira presa no peito, braço atravessando; saiote inteiro mexendo).
- Refeitos com o fit.py novo (v430): Estrela r0..r6, Ferro r1..r7, Aço r0..r7, a partir dos GLBs originais (casados por render e cor, sem mapa salvo). Estrela Primeva (r7) ficou a antiga: o GLB original não estava no PC.
- Pasta nova models/equipment431/ (cache); EST416 aponta para ela. set-visual153.js ?v=432.
- Teste: folhas do Blender (frente e ataque) das 22 e as peças no herói no navegador.

## v431 — Sem auras feias: auréola na cabeça; adaga SS retirada, 16/10/2026
- Pedido de Ian: tirar as auras em volta (armas e mobs) e trocar por uma auréola de cor em cima da cabeça; armas sem aura nenhuma (forma e cor do modelo identificam o rank); adaga SS não ficou boa, voltar a padrão até ele refazer.
- tools/warrior-player127.js (?v=431): `aura162` desligada (nenhuma arma tem aura). `DAG428[7]=0`: rank SS volta à adaga comum pintada; `models/armas155/adaga-rank7.glb` fica no repositório, sem uso.
- 300-entidades: monstro com ameaça (`threatApply184`) ganha `halo431` (anel da cor da ameaça, 25 cm acima do topo do modelo) em vez da coluna `auraMesh184` (função mantida, sem uso). Nome [Ameaça] e números não mudaram.
- 160-jogador: anel de rank no chão escondido; auréola na cabeça sempre (cor do rank; com título equipado, cor do título). 370/440: ao subir de rank refaz o visual para a auréola pegar a cor nova.
- Não mexido: efeitos de habilidade (V.aura do vfx328), anel dourado dos NPCs.
- Teste: 3 monstros com ameaça Legião/Babel/Apocalipse com auréola e sem coluna; herói sem anel no chão, com auréola, adaga SS padrão, sem aura na arma; sem erro no loop.

## v430 — Armaduras Mithril (rank D) Comum..Primeva; ombreira segue o braço, 16/10/2026
- Pedido de Ian: 8 GLBs pela skill primeva-armadura-encaixe. Identificados pela referência armadura-raridade-01..07 (base Mithril D) e armadura-D-mithril-08: Comum (gema azul), Raro (âmbar pequeno), Épico (roxo), Lendário (âmbar e dourado), Mítico (vermelho), Divino (azul com coroa), Primordial (laranja-vermelho), Primeva (prata espinhosa).
- Ian (andando no jogo): a ombreira ficava presa no peito e o braço atravessava; o saiote tem que mexer inteiro. fit.py: parte do ombro do peitoral segue upperarm (misturado com o peito), ombreira solta 85% braço; barra do saiote 100% coxa.
- Jogo: models/equipment429/mithril-r0..r7.glb; EST416 tier 2; corte da canela do corpo-base também no rank D. set-visual153.js ?v=430.
- Teste: as 8 no herói no navegador (corpo e botas em 4 ângulos), sem sapato saindo, sem erro no console.

## v429 — Adaga SS, 16/10/2026
- Pedido de Ian: GLB `ornate fantasy dagger 3d model` = adaga SS Comum (bate com a ficha dourada de gema âmbar). O arquivo veio com um cubo padrão do Blender (2 m) junto; removido, reduzido (16 mil triângulos, 1024 JPEG): `models/armas155/adaga-rank7.glb`.
- DAG428 agora cobre os 10 ranks; cada rank usa sua Comum em todas as raridades até Ian fazer as outras. Script ?v=429.
- Teste: SS Comum/Lendário/Primeva com a adaga SS, F Mítico com a F, ★ Primordial com a ★; cabo para baixo, cor original.

## v428 — Adagas próprias por rank (Comum de F a ★), 16/10/2026
- Pedido de Ian: 9 GLBs de adaga, cada um no seu rank; por ora a Comum de cada rank vale para todas as raridades daquele rank, até ele fazer as outras.
- Identificação pelas fichas `assets/equipment405/dagger-N-0.webp`: F = medieval dagger; E = ornate dagger; D = fantasy dagger; C = dark fantasy dagger (runas roxas); B = fantasy (1) (vermelho-cobre); A = fantasy (2) (roxo); S = fantasy (3) (preto/vermelho); SS+ = ornate (1) (pérola); ★ = fantasy (4) (estrela). **SS sem modelo** (ficha dourada com gema âmbar) — continua a adaga comum pintada.
- Modelos reduzidos no Blender (16 mil triângulos, textura 1024 JPEG, ~0,7 MB): `models/armas155/adaga-rank0..6,8,9.glb`.
- tools/warrior-player127.js (?v=428): `DAG428`/`make428` — adaga do rank com a cor original (srgb413, sem tinta); `load171` aceita modo separado (handleDown415 'dagger'). Adaga arremessada (`daggerModel`) não mudou.
- Teste no navegador: as 10 adagas montadas pelo `gear` com cabo para baixo e cor original. Não testado: luta real com o Assassino, bainha na cintura.

## v427 — Aço (rank E): sapato saindo pela greva, 15/10/2026
- Pedido de Ian (print): botas com sapato saindo / ângulo errado; ao tirar a bota do corpo-base as pernas sumiram.
- Causa: a greva de Aço é aberta atrás e a canela/pé marrom do corpo-base (base169_b) aparecia por ela. O ângulo da greva já bate com o pé do esqueleto (~20° para fora nos dois).
- tools/set-visual153.js (?v=427): no rank E o corpo-base da perna perde só a parte abaixo de 30 cm (cutShin426); coxa fica.
- Teste: as 8 no herói, coxas visíveis, sem sapato aparecendo.

## v425 — Armaduras Aço (rank E) Comum..Primeva separadas e rigadas no Viajante, 15/10/2026
- Pedido de Ian: 8 GLBs novos pela skill primeva-armadura-encaixe. Identificados pela referência armadura-E-aco-01..08: Comum (liso), Raro (gema dourada), Épico (roxo), Lendário (dourado/laranja), Mítico (pano vermelho), Divino (coroa de raios, viseira fechada), Primordial (gemas vermelhas), Primeva (prata espinhosa).
- fit.py: saída `aco-rN`; elmo do Mítico subido 2 cm (`'aco-r4': .02`) porque tapava os olhos.
- Jogo: `models/equipment423/aco-r0..r7.glb`; `EST416` usa a pasta Aço no rank E (tier 1), todas as raridades. Script ?v=424.
- Teste no navegador: as 8 equipadas no herói (rank E) em cena isolada, frente e 3/4. Rosto e corrida conferidos nas poses do Blender.

## v424 — Jogo mais leve: detalhe por árvore/construção, 15/10/2026
- Pedido de Ian: jogo liso no navegador.
- Medido: perto de bosque o pedaço inteiro virava completo (carvalho de 12 mil triângulos): 4,7 mi de triângulos e 700 chamadas de desenho.
- 680 `split423` (no CULL180): por instância, a cada 1,5 m andados. Árvore/pedra completa só até 10 m, leve até 90 m (afinada por distância do pedaço), além disso some; construção completa até 40 m e leve em qualquer distância. 250 `propCull415` não mexe mais nelas (só passa a fração).
- Resultado no navegador de teste: bosque 4,7 mi → 0,87 mi triângulos (700 → 173 chamadas); Aster 1,27 mi → 0,51 mi; borda da cidade 0,67 mi. Sem erro novo. Não medido: fps na máquina do Ian.

## v423 — Muralha e casas não somem de longe, 15/10/2026
- Pedido de Ian: a muralha inteira sumia de longe e sobravam pedaços soltos no céu.
- Causa: CULL180 escondia tudo além de 100 m, e propCull415 (v417/418) cortava 50–80% das cópias de muro/casa por distância.
- 680: lista NAT422 (árvores e pedras). Só elas somem além de 100 m; construções ficam na versão leve até o pedaço do mapa descarregar. 250: propCull415 só afina árvores/pedras/grama.
- Teste: carrega sem erro novo. Não medido: fps na máquina do Ian (agora tem mais muro desenhado de longe, só que na versão leve).

## v422 — Piscadas pretas e NPCs furados, 15/10/2026
- Pedido de Ian (print): tela pisca preto, NPCs (Selene etc.) com partes faltando.
- src/core/070: a resolução automática trocava a cada 2 s subindo e descendo; cada troca recria a imagem e pisca preto. Agora desce no máximo a cada 8 s (só abaixo de 28 fps), sobe só após 30 s acima de 58 fps, respeita a base do ULTRA e não reaplica o mesmo valor.
- tools/citizens133.js (?v=422): NPCs detalhados com material dos dois lados (malha Tripo com faces invertidas) e sem corte por caixa nos modelos com ossos.
- Teste: jogo carrega sem erro novo; Selene criada com DoubleSide. Não visto: as peças marrons flutuando no céu do print (ainda sem causa achada).

## v421 — Armaduras Ferro (rank F) Raro..Primeva separadas e rigadas no Viajante, 15/10/2026
- Pedido de Ian: 7 GLBs novos pela skill primeva-armadura-encaixe. Identificados pela referência armadura-F-ferro-02..08: Raro (liso), Épico (roxo), Lendário (crista dourada), Mítico (pano vermelho), Divino (coroa de raios), Primordial (gemas vermelhas), Primeva (prata espinhosa).
- fit.py: braçais deste conjunto ficam mais perto do corpo (centro |x|≈0,137) — corte de braçal baixado de 0,14 para 0,12. Saída `ferro-rN`.
- Jogo: `models/equipment421/ferro-r1..r7.glb`; `est416` agora também pega rank F (tier 0) com raridade 1–7; F Comum continua no Ferro comum aprovado. Script ?v=421.
- Teste no navegador: as 7 equipadas no herói (elmo+rosto, peitoral, braçais, grevas, corpo-base) com a cor do jogo. Corrida conferida nas poses do Blender.

## v420 — Armaduras Estrela só no rank ★, 15/10/2026
- Pedido de Ian: as armaduras Estrela são todas do rank ★ (uma por raridade, Comum..Primeva). A v416 punha a Estrela em qualquer rank quando a peça era rara — errado.
- tools/set-visual153.js: `est416` agora exige `tier===9` (qualquer raridade 0..7). Nos outros ranks a peça volta ao visual normal do rank. Script ?v=420.
- Teste: ★/Épico e ★/Comum → Estrela; rank C/Épico e F/Primeva → armadura normal.

## v419 — Armadura Estrela Primeva (raridade 7), 15/10/2026
- Pedido de Ian: a armadura inteira do Tripo (knight armor, ranque ★ Estrela Primeva) separada em elmo, peitoral, braçais e grevas, encaixada no Viajante e se mexendo com ele.
- models/equipment416/estrela-r7.glb gerado pelo fit.py da v416 (mesmo método aprovado: saiote quadril→coxas, rosto sem cabelo sob o elmo). No r7 o corte lateral do rosto é 4,4 cm (sobrava uma mecha no canto do olho).
- tools/set-visual153.js: `est416` aceita raridade 7 (antes parava na 6). Script ?v=419.
- Teste no navegador: herói com as 4 peças rar 7 andando com a animação real; GLB carregou (200), sem erro novo.

## v418 — Enfeites mais leves (árvores, pedras, muro, casas, torre), 15/10/2026
- Pedido de Ian: versões mais leves dos enfeites para o jogo rodar mais rápido.
- Blender (decimate) nos modelos Tripo do cenário: versões leves conífera 2241→784, salgueiro 3672→1285, carvalho 3169→1109, muro 3767→1506, paliçada 3765→1506, casa 4125→2062 triângulos; completas muro 12578→3773, casa 11797→4718, torre de defesa 12582→4403; rocha com musgo ganhou versão leve (7883→2364, `tripo-rocha-musgo154-lod.glb`). Originais seguem no histórico do git.
- src/core/250 `propCull415` agora só afina a quantidade por distância (100% / 50% / 20%); quem liga e desliga perto/leve/longe continua sendo o CULL180 (antes os dois brigavam).
- Medido (triângulos por quadro): fora da cidade 3,0 → 1,0 mi; centro de Aster 2,2 → 1,2 mi. Print da praça de Aster sem perda visível. Não medido: fps na máquina do Ian.

## v417 — Espada na mão de verdade e jogo mais leve, 15/10/2026
- Pedido de Ian (print): a espada aparecia solta no chão; tela com engasgos, ~20 fps.
- tools/warrior-player127.js: a virada da v415 era feita num grupo por fora e deslocava a pegada (~60 cm). Agora gira o próprio `inner` e a pegada fica no lugar. Testado no jogo: espada nas costas com o cabo no ombro, e na mão pelo cabo ao atacar.
- src/core/250 `propCull415`: enfeites instanciados (árvores/pedras do Tripo, até 812 cópias de 2,1 mil triângulos) com nível de detalhe por pedaço de terreno: até ~70 m tudo, até ~128 m 35%, além disso escondidos. Medido: 3,0 → 1,8 mi de triângulos fora da cidade. No centro de Aster ainda ficam ~2,2 mi: o peso real são os próprios modelos de enfeite (precisam de versão mais leve).
- Não medido: fps na máquina do Ian (o navegador de teste não mede a GPU dele).

## v416 — Armaduras Estrela por raridade (Comum..Primordial) separadas e rigadas no Viajante, 15/10/2026
- Pedido de Ian: 7 GLBs das armaduras (a 8ª, Primeva, está em outra conversa) separadas em peças, coladas nos ossos do Viajante e colocadas na raridade certa.
- Identificação pela referência do Drive (armadura-estrela-primeva-0N, pasta 1ED4rlDFpSde6uBP7G3ugqnTcqiY4s-Qd), por gema/saiote/elmo: `fantasy knight armor 3d model (1)` = 01 Comum; `fantasy armor 3d model (2)` = 02 Raro; `ornate armor` = 03 Épico; `fantasy armor 3d model (1)` = 04 Lendário; `full suit of armor` = 05 Mítico; `fantasy knight armor 3d model` = 06 Divino; `fantasy armor 3d model` = 07 Primordial.
- Blender (script fit.py): peças soltas separadas em elmo, peitoral(+ombreiras), braçais e grevas; braçal girado para o antebraço em T; greva centrada na canela; folga radial contra o corpo-base. Pesos: peitoral pelo corpo mais próximo; saiote dividido entre quadril e coxas por altura e lado (acompanha as pernas, pedido de Ian); ombreiras 100% chest; braçal antebraço→mão; greva canela→pé (joelho com um pouco de coxa); elmo 100% head.
- Elmo (Ian: cabeça tem de aparecer, elmo reto, centrado entre os olhos, sem cabelo saindo): centrado no osso da cabeça e no topo do cabelo; malha `eq414_hface` = rosto sem cabelo/orelhas, usa o mesmo material da cabeça do herói; Primordial subido 2 cm para os olhos ficarem livres. Divino é de viseira fechada, como na referência.
- Jogo: `models/equipment416/estrela-r0..r6.glb` (~1,8 MB cada), `estrela416` em tools/set-visual153.js (?v=416). Entra para peças h/a/g/b sem conjunto raro com raridade 1–6 em qualquer rank, e Comum só no rank ★ (o Ferro Comum aprovado continua nos outros ranks). Raridade 7 (Primeva) continua com o que já existia, aguardando a outra conversa. Esconde a roupa larga da parte (túnica/mangas/cinto/saia, luvas, calça/botas, cabeça→rosto) e mostra o corpo-base de braço/perna.
- Testado no navegador: os 7 conjuntos equipados no herói, rosto visível, cor do jogo, pose de combate com braçais/grevas seguindo. Não testado no motor: corrida (a animação só roda com o jogador andando de verdade); conferido nas poses do Blender.

## v415 — Arma pelo cabo e bainha do lado certo, sempre, 15/10/2026
- Pedido de Ian: as armas (espadas novas da v411) eram seguradas pela lâmina e iam viradas para as costas; pediu que isso nunca mais aconteça.
- tools/warrior-player127.js: `handleDown415` mede o próprio modelo antes de normalizar. Espada/adaga: a guarda é a fatia mais larga e o cabo fica do lado curto. Maça/machado/cajado/lança: a cabeça é o lado mais pesado. A ponta sempre fica em +Y e o cabo em -Y, onde ficam a pegada e a bainha. O `flip` manual da adaga foi aposentado (a medição resolve).
- Verificado com render das 12 armas normalizadas (adaga, cajado, lança, maça, espada162, sword-r0..r5, r7): todas com o cabo para baixo; as 7 espadas novas e a adaga foram viradas; cajado, lança, maça e espada162 ficaram como estavam.

## v414 — Dracônico com o modelo novo, 15/10/2026
- Pedido de Ian: trocar o Dracônico pelo GLB que ele mandou (dragao-kaelthys.glb, conferido com a ficha 060). src/core/050: dragao usa user_dragao_kaelthys (cor original, corrida corrigida da v413); Fendido/Abissal herdam. O modelo antigo draconico318 fica no repositório sem uso. Ataques especiais de garra/cauda do draconico318 não valem para o modelo novo (ele usa o golpe comum).

## v413 — Modelos da v411 no lugar certo, cor original e andar sem tranco, 15/10/2026
- Pedido de Ian: a v411 ligou os GLBs pelo nome genérico do Tripo (ex.: o "gigante de pedra" era o Arconte da Destruição); andavam "um, dois, para, trava"; cor feia no jogo. Pediu também regra fixa para todo modelo novo (skill `primeva-modelos-novos` no cofre).
- Identidade conferida com as fichas do Drive (pasta 1GxEPOGf2dKCw3o3D791m6ruRK_n2BjMq) e o Livro, com verificação independente dos 14:
  gigante-pedra = Arconte da Destruição (ficha 197) → só no chefe; Gigante de Pedra volta ao modelo dele.
  yeti = Arconte das Feras (200) → chefe ganhou modelo; Yeti volta ao dele.
  yeti-corrompido = Arconte do Gelo Eterno (198) → só nele; Colosso de Gelo Ymrak volta ao padrão.
  golem-madeira = Arconte das Pragas (199) → só nele; Golem de Mana volta ao padrão.
  rei-oco = Lich Ancestral → só nele; O Rei Oco volta ao "monarca" (o Livro o descreve sem corpo).
  golem-pedra = Guardião Corrompido (desenho da ficha mob- v004) → fora do jogo por enquanto: o Guardião tem modelo próprio animado (Guardian370) e Golem de Pedra/Arconte não são ele.
  dragao-kaelthys = Dracônico (ficha 060), não o Kaelthys (quadrúpede alado) → Kaelthys volta ao padrão; Dracônico continua com o modelo dedicado draconico318 até Ian decidir trocar.
  Goblins: goblin-guerreiro = Guerreiro, goblin-arqueiro = Arqueiro, goblin-bruto = Xamã, goblin-xama = Escudeiro, orc = Goblin Bruto (o Orc volta ao modelo dele). Berserker Rubro e Cavaleiro Carmesim estavam certos.
- Andar: os 14 usam o mesmo rig (18 ossos) e o Run não fechava o ciclo (coxa -31,5° no começo e 0° no fim → estalo de 31° a cada volta) e começava em 1/24 s; o jogo ainda reiniciava a passada no quadro 1 a cada parada curta. core 140: `fixUserRigClips413` (tempos desde 0, sem deslocamento da raiz, Run vai-e-volta com costura de 0,03°), gPlay retoma a passada, 0,25 s de folga antes de parar, velocidade da passada pela velocidade real. Idle vinha parado: respiração leve.
- Cor: core 140 makeMonster deixa os userRig em PBR + saída linear→sRGB (sem toToon e sem a tinta do chefe); core 130 bioMob não pinta userRig; variants308 `reclone308` mantém a correção nas versões Fendida/Abissal e o flash de dano; warrior-player127 `srgb413` nas espadas novas (sword-r*). 
- Teste: navegador — 5 goblins com o modelo certo e material original (print com cor igual ao render), Run com costura 0,03°; regressões intro401/402, scenes406, loot402, interface405, ecology124/410 e scripts inline ok. Simulação do agente: salto máximo 4,4°/quadro (antes 31,7°), 0 reinícios na borda do alcance (antes 15). Não testado no jogo: chefes Arcontes/Lich em luta real, espada nova equipada (só código).

## v412 — Ecologia viva do Bestiário (fuga, rendição, moeda, moral), Histórico fora da tela e painel do Ato, 15/10/2026
- Feito sobre a v411 (modelos de criaturas e espadas, outra conversa); nada dela foi alterado.
- Pedido de Ian: as reações descritas no Bestiário / Livro Oficial (Hábitos e perigo + Tática de sobrevivência) viram regra de verdade na IA, para todas as criaturas — não só exemplos.
- tools/ecology410.js (novo, ligado em src/core/390-ia.js antes dos módulos de espécie): perfil para as 61 espécies × normal/Fendida/Abissal + 13 chefes (196). Cada perfil tem família de reação, regra de escape e a tática copiada do Livro (v368). Teste `node tools/test-ecology410.cjs` falha se alguma criatura ficar sem perfil, tática ou escape.
- Reações novas: Filhote de Yeti brinca até um adulto ser atacado e foge em pânico se o Yeti cair; Yeti entra em fúria se um filhote apanha. Goblins fogem se o Goblin Bruto cair; cogumelos se o Rei Cogumelo cair; abelhas se a Rainha cair; golenzinho sem golem maior; esqueletos sem mago/guarda/espectro ficam sem ordens. Orc Pequeno, goblin e o último lobo ferido fogem quando ficam sozinhos. Sapo Guerreiro e Orc se rendem com 15% de vida (F · ACEITAR RENDIÇÃO dá a recompensa sem carcaça para a Mão do Arquiteto; bater de novo = desonra). Caveira enxerga longe à noite e o grito acorda outros mortos; Diabrete chama os demônios; Abelha zumbe e chama as outras. Coelho, Cogumelo Furioso, Gigante, Glub Ancião, Cactoro Gigante, Máscara Tribal e Dragão Ancião só despertam de perto; Golem de Pedra só se for atacado; Alpaca cospe em quem a encara; Alpaca Imperial foge; Visitante observa 2,5 s antes de agir; Demônio Chifrudo ignora presa com pouca vida; Magote vai comer os restos de luta; Homem-Peixe/Peixe Andante ficam lentos fora da água; Redemoinho se desfaz ao amanhecer.
- Moeda brilhante: tecla nova 7 (Jogar moeda brilhante, custa 1 de ouro; aparece na tela de teclas). Cavaleiro Escaravelho investe em linha reta na moeda e fica 2,6 s parado na freada; Monkroose pega a moeda e foge.
- Escape: cada espécie desiste por distância, por perder a linha de visão ou ao você sair do território (Espectro nunca desiste). Só no mundo aberto; inimigos da campanha (camp327), tutorial, invasões e chefes de expedição ficam de fora para não quebrar os Atos.
- Fendida pula o estado neutro ("ataca qualquer coisa que carregue mana"); Abissal não entra em pânico nem se rende ("obedece a um chamado do outro lado") — como no Livro.
- Interface (Ian: "só na primeira vez"): a dica da espécie e o aviso "Tática funcionou" aparecem uma única vez por save (profile.eco410.seen/won); depois ficam na ficha do Bestiário ("Reação", "Tática de sobrevivência" e "Você já usou"). Chefes mostram a tática do Livro só no primeiro combate. Na tela ficam só os avisos curtos de estado: PÂNICO!, FREADA!, FÚRIA!, SE RENDEU.
- Pedido de Ian (mesma conversa): o painel Histórico saiu da tela de jogo (core 640 não o mostra mais ao iniciar; fechar tira o painel inteiro, sem a barrinha recolhida); abre e fecha pelo MENU → HISTÓRICO (core 330 newsView/toggleHistory95). Painel do Ato (intro401) ganhou − (minimizar) e × (fechar), estado salvo em CFG.quest410, e MENU → OBJETIVO DO ATO reabre. Minimizado esconde também a seta 3D do objetivo.
- Atos II e III: já encenados na v406 (carroça queimada, Diário de Aldric físico com leitura, monólito da Torre); não mexidos.
- Partes ligadas: 330-efeitos e 640-telas (Histórico), tools/intro401.js ?v=412 (painel do Ato + botão no menu), 390-ia (gancho), game.html/index.html (script), sw.js (pds-v412 + cache), tela de teclas (KEYACT recebe a moeda). killEnemy e ctxTarget são embrulhados (moral e rendição). Módulos de espécie já existentes (Slime360, Gosma347, Cogu348, Bird349, Spiky350, Beetle352, Guardian370, Cactoro372) mantêm a IA; ganharam só dica, moeda e moral.
- Testado no navegador: yeti/filhotes (neutros → fera → pânico, 11→21 m), Sapo rendido + F aceito (XP, sem carcaça), Escaravelho na moeda (freada 2,6 s, print), Monkroose com a moeda, goblins fogem com o Bruto morto, grito da Caveira acorda Esqueleto e Mago, lobo desiste ao abrir 60 m, Coelho normal não ataca a 7 m e o Fendido ataca. Painel do Ato: − e × clicados de verdade e reaberto pelo MENU (print); Histórico abre/fecha pelo menu; dica e "Tática funcionou" do Lobo não repetem no segundo lobo e aparecem na ficha. Sem erros JS. Regressões intro401/402, scenes406, loot402, interface405, ecology124 e sintaxe dos scripts inline ok. Rendição do Orc + F também testada na versão já juntada com a v411. Não testado: celular, partida inteira jogada à mão.

## v411 — Modelos de criaturas e espadas no jogo, 15/10/2026
- Pedido: integrar os modelos fornecidos e publicar; esclarecimento de Ian: `fantasy sword 3d model (1).glb` = Primeva (raridade 7), `fantasy sword 3d model (4).glb` = Lendária (raridade 3).
- Criaturas: adicionados modelos rigados em `models/mobs165/` e associações em `src/core/050-bloco-catalog111-cont.js`, `120-bloco-ecology124-cont.js` e `140-monstros-animados-quaternius-cc0-carrega.js`.
- Espadas: slots próprios para raridades 0–5 e 7; raridade 6 conserva a espada padrão. Hashes SHA256 confirmam `(4)` no slot r3 e `(1)` no r7. Modelo anterior do r3 foi movido ao r5 para manter a espada Divina.
- Código: `tools/warrior-player127.js`, cache v411. Build e `core_parts.py check` passaram; `node --check` nos JS alterados passou. Teste interativo antes da publicação ficou indisponível nesta sessão.

## v409 — Arma de ponta-cabeça na mão, 15/10/2026
- Pedido de Ian: a arma ficava de ponta-cabeça quando segurada.
- tools/warrior-player127.js: a v407 virava 180° todos os modelos de arma (menos o escudo); só a adaga precisa disso (o GLB dela vem com o cabo do outro lado). Voltou a virar só a adaga. Versão do script subiu para ?v=409 (a v407 não tinha subido, então o cache podia segurar a versão antiga).
- Teste com print: espada, machado, lança, adaga e cajado sacados com o cabo na mão; machado guardado nas costas.

## v408 — Mira à distância no Lobo Fendido e equipamentos fora do Status, 15/10/2026
- Pedido de Ian: tiro de mago/arqueiro no Lobo Fendido ia para o chão; equipamentos apareciam no Status (devem ficar só na Build).
- src/core/380-acoes.js: `projectileBody253` mede também a largura do modelo (`rw`) e usa como raio da cápsula (bichos baixos e compridos); a mira do mouse tem folga de 0,35 m. Teste: 49/49 pontos do corpo do lobo acertam (plano e morro).
- tools/character405.js: o guarda-roupa de equipamentos só entra na Build. Status mostra atributos sem os slots.
- Partes ligadas: a cápsula maior também vale para o acerto dos projéteis (mesma função). Sem textos a mudar.

## v407 — Correções de combate, pegada e bainha da arma, performance e narrativa do início, 15/10/2026
- Pedido de Ian: empunhadura e bainha das armas corrigidas (arma não fica de cabeça para baixo e vai para as costas); jogo a 60 FPS (corrigido gargalo de 1.100 passos/frame no raycast de mira); Edran não afunda mais no chão e fica visível na estrada; refugiados civis posicionados junto à carroça desde o início; carroça desvira e comitiva caminha até Aster em vez de sumir; sem glitch de tela preta piscando (câmera com distância mínima segura de 85 cm evitando clipping na capa); sem redundâncias de texto nos comparadores de equipamento ("▲ +X de escudo a mais" sem repetir a unidade duas vezes).
- tools/warrior-player127.js: `load171` inverte modelos não-escudo para empunhar pelo cabo com a ponta para cima; cajado embainha nas costas e desativa pose em mãos quando guardado.
- tools/projectiles253.js: `terrainHit` reduz passos de marcha de 1.100 por frame (0,2 m) para amostragem inicial de 2 m (máx. 60 passos) mantendo a busca binária de 16 iterações para precisão milimétrica. Queda de FPS eliminada.
- src/core/400-loop.js: câmera clampada em 0,85 m no sweep de colisão para nunca penetrar na cabeça/capuz do jogador.
- tools/intro401.js: elevação do corpo de Edran (`m.body.position.y = 0.05`) para acomodá-lo confortavelmente sentado/apoiado no chão sem afundar na malha de terreno.
- tools/campaign327.js: 2 refugiados civis posicionados junto à carroça desde o início em `buildWorldFor`; resgate desvira a carroça e comitiva anda em comboio até os portões de Aster em vez de sumir de repente.
- tools/kael405.js e src/core/620-janelas.js: comparação de peças na loja limpa sem duplicar o sufixo "de escudo".
- Partes ligadas: `src/core/400-loop.js`, `src/core/620-janelas.js`, `tools/campaign327.js`, `tools/warrior-player127.js`, `tools/projectiles253.js`, `tools/kael405.js`, `tools/intro401.js`, `sw.js`, `game.html`, `index.html`.
- Testado: sintaxe com `node --check`, `python tools/core_parts.py check` (ok), `python tools/build.py` (ok).

## v406 — Mundo vibrante e cenas dos Atos II/III, 15/10/2026
- Pedido de Ian: tornar a direção vibrante oficial na main e encenar fisicamente o Diário de Aldric e a inscrição da Torre. Publicação autorizada; sequência da v405, commit 45a1b8d.
- Mundo: céu azul vivo, luz diurna clara, verdes nas paletas efetivas do terreno/vegetação, menor peso das texturas oliva. Toon usa rampa compartilhada de três tons, sem segunda quantização nos materiais toon; contorno discreto e grade sem sépia. Dia/noite, clima e contraste violeta da corrupção preservados. Look154 reaplica parâmetros quando a estrutura de iluminação é recriada.
- Partes ligadas: core 070/190/450/630, environment128 e sua bridge (sincronizados no core 200), look154, terrain153 e biome-materials132. Configuração renomeada para Visual vibrante. Sem alterações de altura, colisão, dano ou progressão.
- Ato II: cena com carroça existente carbonizada, destroços, cinzas, marcas de luta e dois sobreviventes visíveis durante o cerco. Coordenadas dos sobreviventes persistem após a batalha. Diário físico com emissão dourada aparece somente após vencer os seis inimigos (incluindo elite). F abre leitura; Voltar não coleta, Guardar diário confirma e mantém a sequência de resgate/retorno a Lyra.
- Ato III: monólito nas ruínas com arco, cinco marcas e sinal central, camada inferior apagada, colunas e brilho de proximidade. Copiar requer vencer os quatro inimigos e abre leitura antes de confirmar. A exigência anterior de cinco andares e as etapas de entrega permanecem.
- Texto: relato curto em primeira pessoa adaptado dos fatos já descritos no Ato II de historia-campanha.js; não é transcrição de um diário preexistente. A inscrição descreve os traços já canônicos, sem inventar tradução. Leitor de pergaminho pausa o jogo, recolhe HUD, mantém foco e restaura o estado ao fechar.
- Integração: scenes406.js/css carregados antes de campaign327; descarte de recursos e callbacks tardios protegidos; cache pds-v406 com 100 caminhos locais conferidos. Fixtures qa-* não são publicadas.
- Validação: duas montagens com hash idêntico, core_parts check, sintaxe dos 9 scripts inline e 7 módulos alterados e git diff --check aprovados. test-scenes406 verifica combate/coleta/cancelamento, sobreviventes persistentes, reload parcial, exigência de andares, cópia, limpeza e carga tardia da carroça. Regressões world404, intro401/402 e interface405 aprovadas. VM de iluminação verifica troca de estrutura, toggle, rampa/grade e neblina apenas no mundo.
- Navegador integrado: cenas físicas, carroça carregada, dois civis, diário oculto antes da vitória/visível depois, leitura e pausa; inscrição, confirmação e avanço à etapa de Lyra, sem erros JS capturados na fixture. Direção diurna e leitura documentadas por capturas. Encontros/andares foram preparados por controles temporários de QA, não por uma campanha inteira jogada manualmente. Sem teste em celular físico ou de áudio; não há captura noturna válida nesta rodada.

## v405 — Interface Primeva, equipamentos oficiais e prévias 3D, 15/10/2026
- Pedido de Ian: reduzir texto e HUD; identidade própria nos menus; equipamento por imagem oficial existente; ficha sem slots vazios nem volta obrigatória à Build; personagem/bestiário giratórios; 14 caminhos do Kael separados; demonstrações com animações e efeitos do jogo. Publicação e coordenação entre conversas autorizadas. Base integrada: main 89d5c36 (V404).
- Interface: paleta verde escuro/ouro envelhecido, títulos e cartões; HUD recolhe informações secundárias e se oculta nos menus/cenas. Intro401 permanece dono único do título do rastreador, removendo a alternância concorrente.
- Kael: primeira arma apresenta 14 classes, com confirmação na galeria e nomes próprios (inclui Lâmina Rúnica e quatro cajados elementais). Regras e tipos internos preservados em Awaken396; prévia não concede classe/arma/atributos. Loja posterior agrupa compra por rank e aprimoramento em seção recolhível, preservando custos e riscos.
- Paladino: Maça da Aurora / Maça Sacra, usando o modelo comum-maca existente e escudo. O ID interno wand, classe 5, stats mágicos e saves continuam compatíveis; loja, legenda e reconhecimento por nome atualizados em conjunto. Não foi produzida arte nova nem alterada a geometria.
- Ficha/Build: categorias aparecem quando há item equipado ou na bolsa; seleção, equipar, trocar e retirar no mesmo painel. Relíquias vazias ocultas. Viewer gira o clone do corpo/equipamento atual; não converte desenho em modelo 3D e não inventa peça inexistente. Arte oficial ampliada ao lado, sem equipar ao apenas selecioná-la.
- Catálogo oficial: 213 WebPs derivados das fontes existentes no Drive, 32.604.272 bytes; 207 combinações exatas (68 armaduras isoladas, 80 adagas, 50 espadas, 9 machados) e 6 referências de classe. Correspondência estrita de tipo/rank/raridade, sem substituir por outra peça ou recolorir. Gaps explicitados no JSON; conjuntos completos não viram slots isolados. Fontes/crops/hashes registrados sem URLs assinadas. Imagens carregadas sob demanda, catálogo em cache.
- Locomoção: o preload da galeria marcava o modelo como carregado antes das animações, e o início pulava essa etapa. Warrior127.prepare compartilha a espera por modelo/animações/arco, e o início também aguarda projéteis. Preserva flags antigas, clips, velocidades e modelos; não houve necessidade de editar rig no Blender.
- Bestiário: modelos das fábricas reais do jogo (incluindo variantes), idle, giro, zoom, frente/lado/costas e recuperação de contexto. Cena isolada, limites normalizados dos skins; preserva descobertas, lore e bloqueios.
- Galeria: cena isolada reutiliza receitas VFX302/VFX328, modelos de projéteis/chuvas e escolha de clips/poses compartilhada com combate. 14 classes, 10 habilidades cada, pausa/repetição; nenhuma alteração do save, inimigos ou recursos do mundo na demonstração.
- Coordenação: conversas separadas cuidaram de catálogo, ficha, bestiário, readiness e galeria, com propriedade de arquivos e integração central. Mão, prólogo, cidades, progressão e correções da V404 preservadas. Fixtures qa-* são temporárias e não publicadas.
- Validação: build repetido com hash estável; core_parts check e sintaxe dos 9 scripts inline/módulos aprovados. Passaram testes de 14 classes/confirmação/bolsa cheia, 67 verificações de arte, readiness de animação, factories VFX e exhibit, além de intro401/402, loot402, reclaim402/404 e world404. Navegador integrado: início neutro nível 0, título estável em 18 amostras, 14 cartões, Paladino confirmado com Luz Curativa e animações prontas, sem erros JS na fixture; ficha/bestiário e 140 prévias verificados pelas frentes responsáveis, incluindo viewport estreita. Celular físico não testado. Galeria demonstra efeitos em alvos parados, sem simular dano/colisão/terreno; rastro secundário de meteoro não reproduzido.

## v404 — Mão articulada, prólogo protegido e Aster sem Fenda indevida, 15/10/2026
- Pedidos atuais de Ian: corrigir Mão gigante após o goblin; impedir portal indevido em Aster (pilar central/ciclo do Arquiteto); corrigir invasões antes do despertar e fala repetida. Publicação autorizada explicitamente somente após animar também os dedos; essa condição foi atendida e testada.
- Reclaim372: cálculo CPU normaliza pesos Uint8/Uint16/float, corrigindo limites gigantes e deslocamento da câmera. O asset original recebe deformação independente de quatro dedos e polegar: abertura na descida, fechamento escalonado na pegada e manutenção na subida. Palma/punho fixos, geometria própria por recolhimento e descartada no fim; materiais do corpo restauram emissão anterior ao golpe. Não muda o saque manual/cristal de 10 s.
- Prólogo: updEvents, raids, invasões, cercos, carroças e marcha do Arquiteto aguardam o despertar. Fala da muralha é registrada uma única vez via toast. Interface de interação, Bestiário, minimapa e menu fica oculta durante cenas de história, voltando depois.
- Aster não é uma das cinco capitais que soltam peças: não cai por ataques comuns nem cria Fenda da Âncora. Portais indevidos antigos são removidos. Pilar/cidade voltam à aparência íntegra também em saves com marca antiga de invasão. As cinco capitais e o fim do ciclo pelo Arquiteto permanecem com suas regras; não foi criada história nova.
- Testes: pesos reais Three r128 e reprodução da falha anterior; cinco dedos se movem, punho fixo e poses reversíveis; proteção de Aster e remoção de portal antigo; eventos pausam antes e retomam depois do despertar; contato de portais em escalas 1/1,8/2,4. Regressões reclaim402/loot402/intro401/intro402, build/core_parts e sintaxe dos 9 scripts inline/módulos aprovados.
- Navegador desktop: save antigo com Aster caída voltou íntegro/sem portal; 100 chamadas de 60 s aos eventos não criaram invasão/carroça no prólogo; entrada em portal comum levou à masmorra; história inicial contém uma fala da muralha; poses aberta/fechada vistas no modelo isolado e descida/pegada/subida/cristal na cena. QA local criou/abateu goblin e simulou travessia; não foi percurso integral de combate manual. Masmorra emitiu avisos de material sem cor, sem erro JS impeditivo observado. Celular e áudio não testados.
- Partes ligadas: core 260/450/510/550/610; reclaim372, intro401 (somente ocultação CSS), campaign327 (deduplicação), civic343 (eventos); cache e arquivos gerados. Testes novos test-reclaim404.cjs e test-world404.cjs usam caminho para Three r128 como argumento. Controles qa-* são temporários e não publicados.
- Coordenação autorizada por Ian com chat 01a14007: reformulação de seleção de classe/HUD/escambo/armas será feita em clone separado a partir desta versão; não incluída aqui.

## v403 — Prólogo nível 0, registro na Ordem, resgate e checkpoint, 15/10/2026
- Pedido de Ian: Despertar direto na estrada como Viajante sem classe/ouro; nome e 9 pontos com Lyra; nível 1 e crescimento da classe somente no escambo de Kael; marcador discreto/minimapa; carroça animada; morte antes do portão não pula para Aster.
- Integradas as v401/v402 concorrentes (1e1f38d/87ef2fb), mantendo Mão/grupos/saque/cristal10s: preservados diálogos cinematográficos, Edran ferido, sequência guiada e liberação dos sistemas após o prólogo.
- Sem classe usa base neutra sem crescimento/XP nem habilidades de Guerreiro; 14 classes mantêm curvas próprias. Livro de Registros confirma nome/atributos uma vez e encaminha a Kael. Nome aparece no HUD/save. Recompensa de XP do Ato I removida para o despertar terminar no nível 1, sem salto imediato ao 2; ouro e reputação preservados.
- Carroça real wagon369.glb: interação F, pose de empurrar, balanço/levantamento, poeira e rangido sintetizado; sobreviventes saem. Seta dourada e pulso da v401 preservados por preferência explícita de Ian; ícone dourado/seta de borda no minimapa acompanha Edran/carroça/portão/Lyra/Kael. Removida a bolinha experimental.
- Checkpoint da estrada persiste no perfil e preserva missão/HP cheio após a morte, antes e depois do resgate. Ativação de Aster usa raio dos portões reais (não o raio aproximado da cidade). Até despertar, morte na cidade preserva o registro; morte após despertar mantém as regras existentes.
- Partes ligadas: HUD/status/equipamento/dicas de crescimento, texto de XP e tela inicial, criação/escambo, campanha/Intro401, minimapa e cache v403.
- Integração final v402: fluxo repetido até Kael/Lâmina nível1, mortes antes/depois do resgate e 14 classes aprovadas novamente; regressões test-reclaim402.cjs e test-loot402.cjs também passaram. Seta, Mão, saque manual e cristal10s da outra conversa preservados.
- Validação: build.py + core_parts.py check (ok), sintaxe dos módulos alterados e scripts inline; testes test-intro401.cjs e test-intro402.cjs. Navegador integrado: criação direta, nível 0/9 atributos base/0 ouro, morte na estrada antes/depois do resgate, F em Edran/carroça, portão, livro de Lyra com 1 ponto em cada atributo, Kael/Lâmina Arcana nível 1, 14 classes com crescimento ao nível 2, recarregar save com nome/atributos/arma preservados; sem erros JS observados. Deslocamentos longos e dano fatal acelerados por controles de teste locais não publicados. Áudio sintetizado implementado, sem validação auditiva; celular não testado.

## v402 — Mão completa, recolhimento em grupos e cristais temporários, 15/10/2026
- Pedido de Ian: conferir a Mão descendo do céu, levando a criatura e deixando cristal; durante o teste escolheu grupos sem interromper a câmera, coleta manual inclusive do ouro e desaparecimento do cristal não recolhido após 10 segundos.
- `reclaim372`: sequência de 6 s com portal a pelo menos 7 m, descida, contato, subida conjunta e cristal após a retirada; geometria real `arquiteto246.glb#hand_R` extraída uma vez e reutilizada. O trigger ocorre depois da criação do loot, usando o mesmo registro para impedir que o cadáver volte ao chão. Espera do GLB, falha e cancelamento ao trocar área tratados.
- Combate comum: uma Mão ativa por vez, até 4 corpos próximos por grupo, 12 partículas e intervalo de 1,5 s entre grupos. Recolhe após o combate próximo cessar ou o jogador se afastar mais de 15 m; sem fila adicional de clones. Câmera/bloqueio de entrada apenas no primeiro abate do prólogo.
- Cada corpo recolhido deixa cristal flutuante e pulsante, com saque separado. Ouro permanece manual. Após 10 segundos de jogo o cristal e os recursos não recolhidos expiram; menus de saque pausam o tempo. Esta decisão atual de Ian substitui a persistência ilimitada dos vestígios para estes cristais. Nenhuma venda ou coleta automática foi adicionada.
- Partes ligadas: `loot353` (agrupamento, expiração, restauração e texto), core `370-v281` (ordem do abate), `390-ia` (modelo pronto), `intro401` (câmera e espera), `campaign327` (aguarda a Mão e fala dos cristais), cache v402.
- Verificado no navegador embutido: abate por ataques reais no prólogo; inspeção por etapas da descida/contato/subida/cristal; velocidade normal; atraso artificial do modelo bloqueia F até carregar. Ensaios com 40 abates simultâneos no mundo e 40 em dungeon real mantiveram máximo de 1 Mão/4 corpos e câmera livre; na dungeon todos os grupos acabaram com zero jobs, cristais e registros restantes. Ouro só aumentou após clicar em Pegar tudo. Cenários de carga usam controles QA locais, não publicados. Não é benchmark de FPS nem validação de celular.
- Validação automatizada: build/core_parts check, sintaxe de módulos e 9 scripts inline; testes comportamentais `test-reclaim402.cjs` (tempos, idempotência, descarte, limite e readiness), `test-loot402.cjs` (10 s, pausa e ouro manual) e regressão `test-intro401.cjs`.
- Coordenação autorizada por Ian: conversa “Refinar introdução e chegada a Aster” prepara nível 0, livro de Lyra, checkpoint de morte e animação do resgate para integração posterior, preservando seta/HUD e este recolhimento. Não incluídos nesta v402.

## v401 — Prólogo guiado, direção de cena e transição ao mundo aberto, 15/10/2026
- Pedido de Ian: revisão integral do onboarding do Ato I, com assets reais, Edran articulado, objetivo sempre visível, diálogos com câmera e exploração livre depois de Kael.
- `campaign327`: carroça real `models/wagon369.glb` tombada (sem boi/condutor), rig Knight do projeto para Edran; espera de modelos sem substituir por primitivas. Spawn alinhado à estrada e ao portão sul; ajuda ao guarda antes de gerar a criatura; conversa após o combate; Lyra avança somente ao concluir o diálogo. Os quatro índices antigos de save foram preservados; o HUD apresenta os seis momentos da experiência.
- `intro401`: rastreador com seis objetivos, seta dourada e pulso sobre alvo, pose ferida nos ossos KayKit, respiração/gesto e acompanhamento do jogador; diálogo inferior com identificação, digitação, som e câmera aproximada; pausa e bloqueio de entrada durante conversa. Rastreador recolhível depois do prólogo.
- Partes ligadas: IA e efeitos de bioma não interrompem o personagem sem classe durante o prólogo; HUD identifica Sem Classe; dica de equipamento concorrente fica para depois; título diz Despertar na Estrada; `unl` libera acesso aos sistemas depois do Ato I. Missões de contratos em `320-missoes.js` auditadas, sem alteração necessária. Progressão, custos e desafios próprios dos sistemas permanecem.
- Correção encontrada por Ian no teste: seleção de espada abria Vocação e o rerender reabria a loja/diálogo sobre ela. Ações de escambo/vocação agora encerram o handler sem rerender; conversa de Kael é registrada uma vez. Lâmina Arcana inicia no estilo físico para manter a espada, preservando suas habilidades mágicas.
- Mão do Arquiteto reutilizada no abate; adicionado cristal flutuante persistente até descarregar a área.
- Validação: build.py e core_parts.py check; sintaxe de módulos modificados e sete scripts inline; testes de progressão, diálogo só avança ao fechar, acesso pós-prólogo, regressão do rerender e espada da Lâmina Arcana. Teste conjunto no navegador embutido: Ian controlou o percurso, com inspeção de carroça/guarda/HUD, conversa de Lyra e conclusão do escambo como Lâmina Arcana; sem erros no console nas inspeções. Não foi registrada captura da animação completa da Mão nem testado celular/treze atos completos. Aprovação estética final não presumida.

## v400 — Plano Oficial Ian: Reversão Visual, Ato I Estrada, 14 Classes (Lâmina Arcana em Espada) e 5 Capitais Canônicas, 15/10/2026
- Diretrizes oficiais do documento de Ian seguidas à risca:
  - Reversão visual completa: revertidas as alterações de shader/luz/cores de v399 em 070-three.js, 190-cenario-3d, 450-oraculos, 630-controles e tools/shaders312.js. O jogo volta à paleta autêntica de fantasia sombria/limpa de Primeva sem o terreno saturado.
  - Tarefa A (Ato I na Estrada): abertura cinematográfica com fade-in suave saindo do escuro da queda da Fenda (introFade), spawn na estrada fora da muralha de Aster em frente à carroça tombada e Edran caído; voz do Narrador imediata: "— A muralha… Vá para a muralha."; combate tutorial no soco sem classe contra 1 criatura da Fenda; Mão do Arquiteto emergindo de fenda para recolher o monstro (Reclaim372.claimEnemy); Edran instrui procurar Lyra e Kael em Aster.
  - Tarefa B (14 Classes Comuns no Escambo do Kael): Lâmina Arcana corrigida para wep: 'sword'; Espada abre escolha entre Guerreiro ou Lâmina Arcana; Machado abre escolha entre Tanque ou Berserker; Cajado abre escolha entre Mago de Fogo, Gelo, Terra ou Raio; Arco→Arqueiro; Adaga→Assassino; Varinha→Paladino; Tomo→Invocador; Lança→Lanceiro; Punhos→Monge. Escambo inicial gratuito direto no diálogo com Kael, sem item físico de fragmento no inventário.
  - Tarefa C (5 Capitais Canônicas): Aster (0,0 - nexo central), Ymiria (0,-5 - Neves), Zahar (5,0 - Deserto), Thalor (-5,0 - Marinha), Urdan (0,5 - Cavernas de Cristal), Verden (5,5 - Pântano Profundo) integradas em regionCity em 250-mundo-infinito.js e nos textos de historia-campanha.js, narrativa-campanha.js e tools/campaign327.js sem alterar os IDs de save.
- Partes ligadas: sw.js (v400), VERSAO.md, game.html, index.html.

## v399 — Revisão de Direção de Arte (Zelda BotW / Genshin Toon Shading) e Abertura Cinemática (Ato I), 14/10/2026
- Pedido de Ian: visual vibrante estilizado inspirado em Zelda: Breath of the Wild e Genshin Impact (Toon Shading, céu azul vivo, grama verde vibrante, sombras menos escuras, contornos sutis) + Abertura cinematográfica do Ato I com tela preta/fade-in, queda na estrada fora da muralha, carroça tombada, Edran ferido, combate tutorial no soco contra 1 monstro base, efeito da Mão do Arquiteto puxando o monstro derrotado para a fenda, fala de Edran indicando Lyra e Kael em Aster para o escambo e despertar da classe.
- Frente 1 (Direção de Arte Toon / Cel Shading):
  - 070-three.js: rampa de Cel Shading atualizada no ShaderChunk com stepped lighting limpo (Zelda/Genshin), piso mínimo de iluminação nas sombras (0.72) com leve reflexo lavanda/céu, eliminando pretos pesados; luz ambiente hemisférica com céu azul vívido (0x52b0ff) e rebote de grama exuberante (0x7eb356, intensidade 0.95); sol dourado ensolarado (0xfff8e7, intensidade 1.05); contorno sutil de anime (0x241d30, escala 1.04).
  - 190-cenario-3d...: paleta de relevo e campos atualizada para verdes esmeralda vivos e primaveris (#56be32, #72d43e, floresta #3ea030, estradas de terra ensolarada #d2b57d); tufos de grama com cores luminosas; folhagens com tons claros.
  - 450-oraculos...: ciclo dia/noite com céu azul anil vibrante (#4ea8ff) e névoa atmosférica azul luminosa (#8ed5ff) com densidade reduzida de 0.0105 para 0.0045, ampliando o campo de visão do horizonte; luz com forte rebote verdejante.
  - 630-controles.js: filtro do canvas purificado sem sépia opaco (saturate(1.32) contrast(1.05) brightness(1.05)); gradiente toon com tons suaves e claros; celMat211 habilitado para converter materiais de modelos PBR (inclusive com texturas) para Toon Shading; contorno sutil (0x241d30, largura 0.0032).
  - tools/shaders312.js: função `toonize(root)` para converter materiais de malhas PBR para Toon Shader.
- Frente 2 (Abertura Cinemática do Ato I):
  - tools/campaign327.js: nova transição cinemática de despertar com overlay de tela preta e fade-in suave (`introFade`), simulando abrir os olhos na estrada após cair da Fenda; nascimento fora dos muros de Aster (16–26 m), ao lado da carroça tombada e do guarda Edran caído; fala do Narrador na tela: "A muralha… Vá para a muralha."; combate tutorial com 1 monstro base da Fenda (HP 30) perto da carroça para o jogador Sem Classe derrotar no soco; Edran instrui: "Procure Lyra e Kael em Aster." ao ser ajudado, avançando o objetivo até a muralha e Kael.
  - tools/reclaim372.js e 370-v281.js: adicionado `Reclaim372.claimEnemy(e)` disparado ao matar o monstro do tutorial na estrada — uma fenda escura se abre no chão e a Mão do Arquiteto (extraída do asset do Arquiteto) emerge, agarra o corpo e o puxa para dentro do vazio.
- Partes ligadas: sw.js (v399), VERSAO.md, game.html, index.html.
- Testado: compilação sintática em node --check de todos os scripts, montagem e verificação com build.py e core_parts.py check.

## v398 — Vocação por arma: as 14 classes comuns no escambo, 14/10/2026
- Pedido de Ian: cobrir as 14 classes comuns iniciais no escambo do Kael com escolha da vocação quando a arma serve a mais de uma.
- tools/awaken396.js: tipos de arma e classes agora vêm direto de `CLASSES` (comuns, não raras/legadas). Espada→Guerreiro; Machado→Tanque ou Berserker; Adaga→Assassino; Arco→Arqueiro; Lança→Lanceiro; Cajado→Mago de Fogo, Gelo, Terra, Raio ou Lâmina Arcana; Varinha→Paladino; Tomo→Invocador; Punhos (sem arma, `wep:'none'`)→Monge. Arma com mais de uma classe abre a janela "Qual caminho sua alma desperta com esta arma?", tanto no escambo quanto ao equipar a primeira arma vinda de baú/forja/compra (se fechar sem escolher, pergunta de novo em 2,5 s).
- Observação: no código a Lâmina Arcana usa `staff` (Cajado), não Espada; por isso a Espada tem só o Guerreiro. Mudar isso exigiria trocar a arma da classe — decisão de design de Ian.
- Monge não tem arma: no escambo é a opção "Punhos (sem arma)" e desperta sem item.
- Testado no navegador: as 14 classes despertam pelo fluxo real (barter → vocação → habilidade 1 na barra), sem erros; arma de baú com 2 classes abre a pergunta. Não testado: celular, aparência da janela de vocação em tela pequena.

## v397 — Nascer na estrada (Ato I, passo 1), 14/10/2026
- Pedido de Ian: o personagem novo aparecia parado dentro de Aster. Agora nasce na estrada fora da muralha, ao lado da carroça tombada e de Edran caído, com efeito de despertar no chão e a fala do Narrador ("A muralha… Vá para a muralha").
- tools/campaign327.js: `spawnAwakening()` (chamada ao terminar a criação de um personagem sem classe) escolhe um ponto livre a 16–26 m além da muralha, move o jogador, começa o Ato I com a luz nesse ponto e dispara o efeito (anéis, coluna de luz, som). Passo 1 agora cita Edran (figura deitada) e cria uma carroça tombada de malhas simples. Novo passo 4 do Ato I (`barter`): fazer o escambo com Kael; conclui sozinho quando a classe desperta. Lyra avisa do escambo na última fala.
- Partes ligadas: 630-controles (finishCreation chama spawnAwakening), texto do passo 1 e 3 do Ato I, sw.js, game.html.
- Testado: criação, nascimento a 108 m do centro (muralha 82 m), luz dourada a 5 m, Edran deitado + carroça, narrador no histórico, avançar passos até o escambo e despertar do Arqueiro, sem erros. Não testado: celular, caminhar de verdade até Lyra/Kael, aparência da carroça de perto (só vista de longe).
- Saves antigos: nada muda (só personagem novo nasce na estrada).

## v396 — Início sem classe e escambo com o Kael, 14/10/2026
- Pedido de Ian: o Viajante chega sem classe, sem ouro e sem técnicas; Kael troca (escambo) a primeira arma e a classe desperta ao equipar a primeira arma.
- Novo tools/awaken396.js: novo personagem nasce `profile.classless` (cls 0 é só marcador); barra de habilidades vazia; Kael oferece 1 troca (Espada→Guerreiro, Machado→Tanque, Adaga→Assassino, Arco→Arqueiro, Varinha→Paladino, Tomo→Invocador, Cajado→Mago de Fogo). Qualquer primeira arma equipada (baú, forja, compra) também desperta a classe pelo tipo.
- Partes ligadas: 640-telas (título sem escolha de classe; `?escolherClasse` volta ao seletor antigo), 630-controles (criação sem escolha de habilidade), 160-jogador (arma livre de estilo enquanto sem classe), 310-itens (equipBagItem desperta), 620-janelas (loja do Kael + ação barter396), 450 (textos do narrador e da missão de primeiro equipamento), game.html, sw.js.
- Testado: título, criação, loja com escambo, Cajado (Mago de Fogo/Bola de Fogo) e Espada (Guerreiro/Corte Giratório), salvar e recarregar mantém a classe. Sem erros. Não testado: celular, arma achada em baú, combate prolongado.
- Observação: o Viajante sem classe usa o modelo de Guerreiro como base visual. Saves antigos continuam com a classe que já tinham.

## v395 — Nado corrigido, 14/10/2026
- Pedido de Ian: "o jeito que o viajante tá nadando é muito feio e bugado". Problemas achados (tools/water391.js): o corpo deitava de COSTAS com a cabeça para trás e girava pelos pés (ia parar 2 m atrás do ponto real e afundava); a braçada ia e voltava pelo mesmo caminho (parecia abanar); parado, os braços ficavam erguidos acima da cabeça; o anel de rank aparecia torto debaixo d'água; a posição do nado era sobrescrita pelo loop (agora entra no gancho Anim303.root).
- Agora: de bruços, girando pelo quadril, costas na linha d'água e cabeça para fora; crawl em volta completa (puxa por baixo, volta por cima, cotovelo dobrado na volta, rolagem do tronco); pernas batendo; parado = em pé com ombros fora e braços remando embaixo; anel de rank some na água; entrada/saída com folga de 15 cm para não piscar na margem.
- Correção ligada (580-bloco-b): a água do lago subia sempre 2,5 m, mas onde há estrada perto a bacia é mais rasa — a superfície desenhada ficava ~0,6 m acima da usada pelo nado (o herói sumia). Água e margem agora sobem o quanto a bacia realmente afunda.
- Testado com print: lago parado e nadando (braçadas alternadas saindo da água), rio, saída para a margem (pose volta ao normal). Sem erros.

## v394 — Magote, Magote Fendido e Magote Abissal (família 009), 14/10/2026
- Pedido de Ian: fila de modelos do catálogo a partir da família 009. Fichas v006 Frente/Costas/Lado do Drive; Tripo Studio H3.1 multivista, 60 créditos por forma (180), sem rig pago.
- Blender: 24 mil triângulos, comprimento oficial 1,2/1,2/1,4 m (altura 0,46/0,42/0,53), cadeia de ossos nos segmentos (6/7/6, achados pelas dobras) para rastejar por compressão/extensão, osso dos lobos olfativos que pulsa. Fendido: 386 ilhas de cristal com peso rígido (não esticam). Abissal: segmentos com peso rígido (separam na morte) e 4 cristais orbitais criados no Blender (o Tripo omitiu).
- 8 clipes por forma: Idle, Walk, Alert, Prep, Attack, Recover, HitRecieve, Death; mortes diferentes (base enrola e tomba, Fendido convulsiona e afunda, Abissal solta os segmentos e os cristais caem).
- Jogo: models/m_magote*.glb; MON_DEF magote/_f/_a com aliases novos; variantes dedicadas (variants308); preparo usa o clipe Prep, golpe Attack e depois Recover (só Magote, part 140); morte toca o clipe inteiro (390-ia, loot353); textura PBR preservada com a mesma correção de cor do Cactoro. IA, HP, dano e recompensas não mudaram (Alert existe no GLB, sem gatilho próprio ainda).
- Testado no jogo local: 3 modelos carregam com 8 clipes; no mundo andam, preparam e morrem com o clipe próprio e somem depois; print com cor corrigida. Celular e aprovação visual de Ian pendentes.

## v393 — Mapa de RPG e dano de queda, 14/10/2026
- Pedido de Ian: o mapa era escuro só com pontos. tools/map393.js: minimapa e mapa grande com terreno pintado por bioma, sombra de relevo (montanhas, picos claros), rios e lagos (gelo claro), estradas, barracas dos clãs com nome, postos avançados, moldura de pergaminho, rosa dos ventos e legenda no mapa grande. Pontos antigos (cidades, portais, monstros, chefes, carroças, tesouro, batedores) continuam iguais por cima. Abre em ~0,1 s com versão rápida e refina em seguida.
- Dano de queda (tools/fall393.js): borda que desce mais de 1,4 m por metro faz cair com gravidade; até 6 m sem dano, depois 5% da vida máxima por metro; abaixo de 30 m sempre sobra 1 de vida, acima de 30 m pode matar. Água funda e montaria/carroça sem dano.
- Testado: mapa aberto (print), queda de 12,4 m = −57 de 181 (31%), caminhar em morro suave não dispara queda, pulo normal sem dano. Sem erros.

## v392 — Animação de nado no esqueleto, 14/10/2026
- Pedido de Ian: rig de nadar e boiar no personagem. tools/water391.js aplica poses nos ossos do Viajante (mesmo esquema do pulo, anim303): nadando = corpo deitado, crawl com braçadas alternadas, pernas batendo, cabeça para a frente, sobe para a linha d'água; parado = boiando em pé, braços abrindo/fechando e pernas pedalando. Base parada antes do nado para a caminhada não misturar.
- Correção ligada: climb383 e water391 usavam `window.player` (o jogador é `let`, não fica em window) — a inclinação do corpo na escalada (v383) nunca rodava; agora roda.
- Testado com print: boiando parado e nadando (braçada visível). Sem erros.

## v391 — Rios e lagos fundos + nado, 14/10/2026
- Relato de Ian (print): o rio parecia uma linha reta sem profundidade (água 6 cm acima do fundo). Agora (tools/terrain245.js, CPU e GLSL juntos): leito em U de 2,2 m nos rios, bacia de 2,5 m nos lagos, margens mais íngremes (7 m em vez de 16). Água do rio mais escura no meio e transparente na margem; água do lago sobe junto com a bacia (580-bloco-b).
- Nado (tools/water391.js): água com mais de 1,3 m → o herói boia com a cabeça para fora, nada a 60% e deita o corpo. Atravessa rio e lago sem ponte (paredes invisíveis da água removidas). Gelo: anda em cima, na altura da margem. Leito seco (deserto/vulcão): anda no fundo. Monstros comuns não entram na água funda.
- Testado: travessia de rio de 13 m (sobe para boiar no meio, sai do outro lado), print nadando, sem erros.
- Pendente (Ian): bioma marinho, mergulho para o fundo com coisas lá embaixo, portais aquáticos, mais barcos.

## v390 — Habilidades e passivas em qualquer lugar, 14/10/2026
- Pedido de Ian (áudio): coisas do próprio personagem (sem comprar/vender itens) não podem exigir cidade/acampamento.
- `canRedistribute()` agora vale em qualquer lugar (só não morto). Liberados fora da cidade: equipar/trocar habilidades, combinar técnicas, talentos de rank (escolher e redistribuir), redistribuir atributos, preparar formas, aprender despertar e afinidade. Partes: 450-oraculos, 160-jogador, tools/combo261.js, tools/kit111-runtime.js, 660-runtime111-cont.
- Lista de melhorar habilidades: mostra só as habilidades em uso; as aprendidas fora de uso viram só um aviso ("equipe primeiro").
- Textos ligados atualizados: "Troque a combinação a qualquer momento", "redistribuir a qualquer momento", "Gratuito por enquanto, em qualquer lugar", "Prepare esta forma/formas no menu do personagem", "Aprendizado e escolha de afinidade podem ser feitos em qualquer lugar".
- Continuam só na cidade (envolvem loja/serviço ou classe): vender, forja, trocar de trabalho/classe, bolsas, defesas, regiões.
- Testado fora da cidade: trocar Corte Giratório ↔ Investida (HUD atualiza), botões de Equipar ativos, combinação, textos novos. Sem erros.

## Regra para IAs (14/10/2026)
- Pedido de Ian: toda IA (ChatGPT/Codex, Claude) é obrigada a ler `AGENTS.md` e seguir a skill `docs/skills/primeva-codigo.md` antes de mexer no jogo.

## v389 — Tiro básico segue a mira na vertical, 14/10/2026
- Relato de Ian: depois da câmera nova os projéteis não iam na direção da mira; mirando para cima ou para baixo seguiam reto.
- Causa: regra da v365 (feita para a câmera de cima) deixava o tiro básico sem criatura na mira na altura de saída. Com a câmera atrás do ombro isso parecia bug.
- Agora o tiro básico livre mira o ponto exato onde a mira cai (chão) ou um ponto longe no céu: sobe e desce com a mira. Mirando numa criatura continua indo na altura dela. Habilidades não mudaram.
- Partes: src/core/380-acoes.js (aimPoint guarda ray388; shoot usa freeAim389 no lugar de levelAim365). Sem textos ligados a mudar (nenhum texto do jogo citava a regra).
- Testado no navegador com arco: mira no céu vy +5,8; mira no chão vy −15,9; meio −0,8. Sem erro novo no console.

## v388 — Código dividido em partes, 14/10/2026
- Pedido de Ian: dividir o código para um pedido não mexer em outra coisa e trazer bug novo.
- O script principal (7,8 MB, um bloco só) agora mora em 68 partes em `src/core/` (util, dados, jogador, colisão, mundo, masmorra, combate, IA, loop, HUD, janelas, controles, telas...). Mapa e regras: `src/LEIA-ME.md`.
- `tools/build.py` junta as partes no `game.html` (idêntico byte por byte ao anterior — o jogo não mudou) e refaz as partes depois dos syncs. Edição direta no game.html é detectada; mudança dos dois lados para o build com erro.
- Testado: divisão e junção idênticas; editar parte → vai para o jogo; desfazer → idêntico; edição direta detectada.

## v387 — Chuva visível, 14/10/2026
- Relato de Ian: aviso "Começou a chover" sem chuva. A chuva eram 700 pontos de 0,09 roxos, invisíveis. Agora tools/rain387.js: 2600 gotas finas (InstancedMesh; linhas THREE não renderizam com o shader do relevo) caindo inclinadas com vento ao redor da câmera, mais fracas à noite. Regra do clima inalterada.
- Testado com print na cidade de dia. A neve continua com os pontos antigos (conferir se Ian reclamar).

## v386 — Trava contra tecla presa, 14/10/2026
- Ian: o andar sozinho acontece fora do gelo (v385 não era a causa). No PC só as teclas movem o personagem, então o keyup se perde (alerta/janela do navegador, troca de foco).
- Trava (tools/climb383.js, KEYWATCH386): segurando uma tecla o Windows repete o keydown; se a última tecla de movimento parar de repetir por 1,2 s sem keyup, as teclas de movimento são soltas. KEYWATCH386.fixes conta quantas vezes agiu.
- Testado: segurar W com repetição mantém andando; sem keyup para em ~1,2 s; apertar/soltar normal funciona.

## v385 — Andar sem tocar em nada, 14/10/2026
- Relato de Ian: personagem anda sozinho. Causa encontrada: no gelo (rios/lagos congelados da neve) o deslize depois de soltar as teclas levava ~14 s para parar, devagar. Agora para em ~1 s (1,6 m de deslize a partir da corrida). tools/climb383.js.
- Reforço: soltar tecla é registrado na fase de captura (nenhum outro código consegue engolir o keyup); teclas soltas ao sair da janela sem foco.
- Se acontecer fora do gelo, Ian vai avisar onde (cidade, estrada, montanha).

## v384 — Relógio no minimapa e save por arquivo, 14/10/2026
- Pedido de Ian: relógio do dia perto do minimapa; lugar/perigo/noite saem da ficha do personagem e vão para a caixa em cima do minimapa (linha 1: relógio e noite; linha 2: lugar/bioma e perigo; depois portal e cidade mais próximos). A ficha mostra só "NV n" no mundo aberto (masmorras continuam como antes).
- Relógio: noite (18h–6h) segue o ciclo real de 14 min de dia + 10 min de noite; ☀ de dia, ☾ de noite.
- Save: Exportar baixa um arquivo .json pequeno (primeva-save-AAAAMMDD-HHMM.json); Importar abre o seletor de arquivo e pede confirmação. Códigos antigos (texto) salvos em arquivo ainda carregam. Fim da caixa de texto enorme.
- Testado: cidade, mundo à noite, horários do ciclo, exportar (15 KB), importar arquivo novo, código antigo e arquivo inválido. Sem erros.

## v383 — Montanhas por ruído, escalada e painel de ajustes, 14/10/2026
- Pedido de Ian (vídeo do André Elias): técnicas de Perlin noise e escalada estilo Zelda.
- Terreno (tools/terrain245.js): cordilheiras com cristas (ruído suave "ridged" em 3 camadas), até ~40 m, em ~1/3 do mundo; mesma fórmula no CPU e no shader. Cidades, estradas e rios continuam planos/cavados por cima.
- Escalada (tools/climb383.js): encosta mais íngreme que ~45° vira escalada — metade da velocidade, gasta 14 de Estamina/s, corpo inclina para a parede; ao chegar na borda dá um impulso para subir no topo. Sem Estamina escorrega encosta abaixo até recuperar 20.
- Painel F9 com controles deslizantes: altura e tamanho das montanhas, inclinação que vira escalada, velocidade, custo de Estamina e inclinação do corpo (salvo no navegador; "Voltar ao padrão").
- Testado: subida de 16 m a 39 m com impulso no topo, sem Estamina desce até a base, no plano não escala, sem erros. Pés que se ajustam ao chão (IK) ficam para depois.

## v382 — Monstros param de seguir, 14/10/2026
- Relato de Ian (print): monstros seguiam infinitamente, inclusive com ele na carroça. Na v381 a proteção da carona só bloqueava dano; a função de alvo dos monstros não era trocada porque o witcher377 tinha uma função local chamada pickTarget (renomeada para pickLock377).
- Agora (tools/witcher377.js): pickTarget é reembrulhado sempre que outro módulo o troca; na carona os monstros não miram o jogador (param); a pé, monstros comuns desistem além de 35 m (chefes, hordas, emboscada de carroça e duelo seguem as regras antigas).
- Testado: monstro parado durante a carona sem dano; a 40 m desiste; travar alvo continua funcionando. Sem erros.

## v381 — Carroças sem sobreposição e carona segura, 14/10/2026
- Relato de Ian (print): duas carroças uma dentro da outra. Agora cada carroça anda na própria faixa (1,7 m à direita do centro da estrada), espera a da frente no mesmo sentido (9,5 m) e nasce a 30 m+ de outra (tools/civic343.js).
- Pedido de Ian: na carona da carroça os monstros não atacam (sem dano e sem perseguir; tools/witcher377.js). Monstros da emboscada continuam atacando a carroça.
- Testado: sentidos opostos passam a 3,4 m; mesmo sentido não encosta; na carona vida cheia sob ataques; ao descer o dano volta. Sem erros.

## v380 — Projétil indo para o céu, 14/10/2026
- Relato de Ian (print): magia subia ao infinito. Com a câmera baixa da v377, cursor fora do corpo do monstro apontava para o céu.
- Correção (tools/witcher377.js, aimPoint): sem acertar monstro com o cursor, mira o monstro na direção do cursor (até 32 m, cone estreito); sem monstro, o tiro sai reto na altura do peito (máx. +0,6 m), até 40 m. Travar alvo continua mirando no alvo.
- Testado: cursor no céu com monstro à frente → mira no monstro; sem monstro → tiro reto. Sem erros.

## v379 — Correção urgente: andar sem parar / câmera girando, 14/10/2026
- Relato de Ian: às vezes o personagem anda sem parar e a câmera buga. Causa provável: soltar Alt (esquiva) manda o foco para o menu do navegador no Windows e o jogo perde o keyup do W; com a câmera que segue o movimento (v377) ela girava junto.
- Correção (tools/witcher377.js): Alt sem ação padrão na descida e na subida; todas as teclas são soltas quando a página perde o foco (blur, focusout, hasFocus falso, tecla Windows, pagehide).
- Câmera só se realinha quando você anda quase para frente (não gira mais andando de lado).
- Travar alvo saiu do E (já era Interagir) e foi para Caps Lock + botão do meio do mouse.
- Testado: andar, Alt preventDefault, blur solta W e para o personagem, foco falso solta, foco normal mantém, sem erros.

## v378 — Correr sem gastar Estamina e corrida travada, 14/10/2026
- Pedido de Ian: correr não gasta mais Estamina (Sprint373 sem dreno nem cansaço).
- Toque rápido (<0,25 s) na tecla de correr trava a corrida; outro toque destrava; segurar continua funcionando. Código em tools/witcher377.js (RUNLOCK378).
- Testado: andar 4,3 m/s, travado 6,5 m/s, Estamina não caiu, destravar volta a andar, sem erros.

## v377 — Câmera Witcher, travar alvo, corpo sólido, lampião e ciclo 14/10 min, 14/10/2026
- Pedido de Ian: câmera como The Witcher 3 (perto, sobre o ombro direito, personagem à esquerda, volta devagar para trás ao andar; não gira ao andar para trás). Botão direito continua girando a câmera.
- Travar câmera no alvo: botão do meio do mouse ou E (configurável). Ataques/magias miram o alvo travado; solta se morrer ou passar de 34 m. Anel vermelho no alvo.
- Jogador e monstros têm corpo: ninguém atravessa ninguém (chefes não são empurrados). Código em tools/witcher377.js.
- Vigor renomeado para Estamina em todos os textos (chaves internas continuam `vigor` para não quebrar saves).
- Lampião de Viagem na loja de Poções, 5 níveis (300/900/2200/5000/11000 de ouro): acende sozinho ao escurecer; nível 1 ilumina 10 m à frente, nível 5 ilumina quase tudo.
- Dia 14 min + noite 10 min (DAYLEN 1440).
- Testado no navegador: movimento WASD, colisão nos dois sentidos, lock e mira, lampião nível 1 e 5, sem erros. Bug do W relatado por Ian não reproduzido.

## v376 — Coleta completa antes da mão, 14/10/2026
- Pedido de Ian: recolher corpo após pegar todos os itens ou afastar demais, preservando itens para depois.
- Pegar tudo coleta o que cabe; coleta individual mantém janela aberta. Mão dispara ao esvaziar ou além de 15 m (distância escolhida na implementação). Vestígios conservam itens e posição, inclusive com bolsa cheia; persistência existente de mundo/masmorra preservada.
- Doze verificações no jogo passaram: coleta parcial/total, janela, distância, retorno, duplicação e bolsa cheia. Build/sintaxe conferidos. Base f222b55.

## v375 — Controles do mouse, 14/10/2026
- Correção após relato de Ian: ataque esquerdo não depende mais do giro da câmera. Giro usa pointermove e deslocamento de coordenadas com captura durante botão direito, liberada ao soltar/cancelar/perder foco. Cursor permanece livre.
- Sete verificações no jogo passaram: giro nos dois sentidos parado, liberação, ataque sem câmera, soltura e bloqueio por menu. Sem erros no console inspecionado. Base 68a24ff.

## v374 — Viajante e câmera, 14/10/2026
- Caminhada/corrida humanas no modelo original; fatores .65/1.35 da velocidade-base (4,16/8,64 unidades/s na base 6,4 antes de terreno/bônus), cadência estimada 2,52/3,80 passos/s; Shift corre consumindo 16 vigor/s, esgotamento retorna à caminhada; Alt faz esquiva compacta de 0,32 s/2,72 m. Outros 22 clipes preservados.
- Câmera em terceira pessoa, botão direito + arrastar, cursor livre para avisos/bestiário, distância fixa, inclinação contínua céu/chão, colisão. Sem zoom nem botões extras; correção de Ian incorporada. Carroça da v373 preservada.
- Integração sobre 0571eb1; 23 testes de movimento e 12 de câmera/cursor passaram novamente; aviso do bestiário clicado e aberto, sintaxe/build conferidos e prévia visual inspecionada. Celular físico não validado. Publicação explicitamente solicitada por Ian nesta sessão.

## v373 — Mundo vivo e segurança de retorno, 13/10/2026

- Pedido de Ian implementado sobre a v371 (434bae9), conforme confirmação neste chat. Equipamentos continuam sem afixos; tipos de mercadorias recebem peso regional 4× nas três vagas diárias. Arma da classe permanece fixa.

- Onze clãs em pontos determinísticos fora das estradas. Clareiras reservadas antes da vegetação, fogueira, tenda/totem, modelos base carregados e speech153. Fendidos/Abissais não falam. Patrulha Ferrugem protege viajantes; yetis defendem filhotes provocados.

- Duelo 1v1: rendição a 20%, sem mortes/saque; recompensa por acampamento/dia. Bônus físico +10% por 300 s; respeito dos sapos reduz lentidão de 10% para 5%. Bênção reduz dano mágico em 15% por 300 s; abrigo da neve, cura/descanso e batedores.

- Reconstrução exige 30 cristais do rank regional ou superior, consumindo menores elegíveis primeiro. Como cidades antigas não têm campo rank, usa danger(c.x+90,c.z); rank explícito prevalece. Mensagem/UI e compra preservam o saldo em falha.

- Fenda Invasora grava retorno e estado numa única entrada do run, com token/readback. Entrada bloqueada se a gravação falha. Morte/recarga mantêm cidade caída e portal aberto; chefe grava fechamento antes de alterar o perfil. A animação Rift131.close acontece no retorno ao mundo; marco liberado sem reconstrução automática.

- Oito pistas geográficas nos contratos; caveira vermelha e nome apenas a até 60 m no minimapa. Mapa completo mantém localização.

- Carona F na carroça móvel: banco traseiro, pose sentada, câmera afastada, +1% HP/MP a cada 3 s; F/Espaço desembarca. Movimento, ataques e habilidades bloqueados durante carona. Embarque não é persistido; save guarda posição da estrada.

- Anel de mana é uma relíquia de viagem separada, equipável pela bolsa (+10% regeneração de mana), e poção concentrada recupera 60% de vida. Não reintroduz afixos nem bônus nos equipamentos comuns.

- Armas de fogo autorizadas por Ian neste chat: Pistola da Escama, tipo firearm, vendida no posto dracônico por preço normal de arma do ranque. Modelo próprio no Blender, encaixado na mão direita; projétil físico de 48 m/s, alcance temporal 0,85 s, recarga automática base de 1,2 s reduzida pela agilidade, sem mana e munição básica ilimitada. Não adiciona afixos.

- Limites: Espada arcana é nome regional de espada comum, sem dano mágico adicional. Sem teste em celular ou aprovação criativa. Publicação autorizada por Ian em 13/10/2026. Integração sobre a v372/7952b6e preserva Cactoros e recolhimento de corpos; número ajustado para v373.




## v372 — Cactoros e recolhimento pelo Arquiteto, 13/10/2026
- Pedido atual de Ian: após pegar o primeiro item de um cadáver, uma mão sai de uma fenda, agarra o corpo e o recolhe com evaporação. Efeito global no saque, não dispara só por abrir ou por tentativa sem espaço. Restos mantêm todos os itens não coletados; flag persistente impede repetição ao recarregar. Chefes mantêm essência e poderes existentes.
- Cactoro padrão/Fendido/Abissal: Tripo multivista, 180 créditos autorizados e consumidos; rig e oito clipes por forma no Blender, 24 mil triângulos, UV0, 1,2/1,2/1,4 m. Quatro cristais do Abissal corrigidos. Ataque de espinho com alvo travado, aviso e recuperação; padrão/Fendido enraizados de dia, móveis ao entardecer; Abissal sempre móvel. HP/dano/recompensas preservados; alcance 9 m é escolha técnica.
- Correção final de Ian: mão extraída de hand_R do modelo Tripo models/arquiteto246.glb; Arquiteto completo e fragmentos preservam texturas Tripo, sem recoloração procedural. Rig/animações existentes continuam; nenhuma geração ou crédito adicional.
- Validação: 91 verificações no navegador (50 Cactoros, 33 saque/famílias, 8 Arquiteto/texturas/clipes); reabertura/reimportação Blender e 21 amostras por clipe. Desktop; celular e aprovação visual de Ian pendentes.
- Encerrar esta etapa após publicar, mostrar e conferir arquivo online. Não iniciar outros mobs.

## v368 — Gosma Espinhosa, Fendida e Abissal, 13/10/2026
- Três GLBs próprios com oito clipes cada, feitos no Blender. Padrão comprime a massa e perde sustentação; Fendida articula as rosetas e fecha os prismas ao morrer; Abissal orbita quatro rosetas, alinha o disparo e recolhe cristais enquanto o corpo vazado colapsa.
- Todas ficam imóveis: padrão reage a passos/dano; Fendida também percebe mana no alvo atual; Abissal dispara por proximidade. Alcance 9 m, aviso 0,5 s, direção travada, recarga 1,4 s. Escolhas técnicas de combate; não simula consumo físico de luz/calor nem imunidade por corpo vazado. HP, dano, colisores e recompensas preservados.
- Morte, atordoamento e congelamento cancelam preparo. Vida do cadáver respeita a duração integral do clipe. Chefes/aliados mantêm comportamento anterior.
- 59 verificações de combate local passaram, incluindo dano/esquiva reais e provocação por mana. Desktop validado; celular e aprovação criativa de Ian pendentes.
- Tripo multivista Fendida/Abissal autorizado por Ian por até 120 créditos; 60 + 60 consumidos. Rig/animação no Blender. Abissal corrigida de oito para quatro rosetas; projéteis reutilizam geometria texturizada dos próprios modelos.

## v367 — Pássaro Bravo, Fendido e Abissal, 13/10/2026
- Modelos próprios para as três formas, dez clipes cada; asas independentes, patas recolhidas em voo, mergulho e recuperação. Padrão cai de lado, Fendido tomba para frente, Abissal recolhe corpo em rotação e dispersa quatro cristais.
- Variantes usam abordagem lateral e passagem com direção fixa. Congelamento cancela mergulho; morte completa antes de encerrar atualização, saque preservado. HP, dano e recompensas anteriores preservados.
- 51 verificações no jogo local; rigs 12/12/16 ossos reimportados. Geração multivista Tripo: 60 créditos por variante, sem rig pago. Cristais ausentes do Abissal completados no Blender com malha texturizada já produzida para Cogumelinho Abissal.
- Desktop validado; celular e aprovação criativa de Ian pendentes.
## v365 — Mira do ataque básico, 13/10/2026
- Ataques básicos à distância sem criatura sob o cursor seguem a direção do mouse na altura de saída do projétil. Não inclinam para o chão ou céu por causa do ponto livre; alvo direto e assistência no toque preservam a altura real da criatura. Habilidades com alvo no chão preservadas.

## v364 — Equipamentos comuns e relíquias na bolsa, 13/10/2026
- Equipamentos comuns preservam ataque/escudo, raridade e aprimoramento. Removidos bônus de andar, tecido, maldição, conjunto aleatório, arma viva, afixos e runas; migração inclui bolsa, equipado, casa e saque pendente. Conjuntos de chefes de classe rara preservados.
- Bolsa separa equipamentos, materiais e relíquias equipáveis. Troféus de chefe identificam o destino; relíquias únicas são salvas imediatamente, repetidas informam conversão em ouro. Tags legadas de relíquia em equipamento recuperam a posse no perfil.
- Validado coleta com bolsa cheia, bloqueio de coleta duplicada, gravação e recarga. O item exato relatado por Ian é desconhecido; não foi comprovada perda no save dele.

## v350 — Gosma Espinhosa, 12/10/2026
- Catálogo online e trio v006 conferidos: gosma de pântano, 1,2 m, cristais, espera imóvel e dispara ao sentir vibração. Tripo multivista H3.1: 55 créditos, sem rig pago.
- GLB 1.802.992 bytes, duas malhas, quatro ossos, sete clipes: Idle, Walk, Windup, Fire, Regrow, HitRecieve, Death. Ponta central separada/fechada; projétil usa sua malha e nasce no osso Crystal. Materiais revistos para retirar reflexos brancos excessivos.
- Espécie espinhosa detecta deslocamento do alvo até 9 m e perda da própria vida. Não persegue. Preparo 0,5 s, recarga 1,4 s e dano original; projétil a 12 m/s como lançador existente. Alvo travado no aviso permite esquiva; morte e atordoamento cancelam. Raio de detecção é escolha técnica; não simula propagação física de vibrações. Chefes/variantes mantêm IA anterior.
- Quinze verificações no combate real local, incluindo dano do projétil e esquiva; sete clipes x 21 amostras em todas as malhas sem vértices inválidos ou chão atravessado. Reimportado no Blender; build idempotente. Teste reproduzível: python tools/test_spiky350.py e spiky-playtest.html local, sem publicar página de teste. Desktop; celular não testado; sem aprovação criativa de Ian.
- Fonte: https://drive.google.com/file/d/1UPvB1ZLe3Mgl8gJpmArchY5eWOk70s0C/view

## v349 — Pássaro Bravo, 12/10/2026
- Catálogo e três referências v006 consultados: ave territorial de campos floridos, mergulhos laterais, nunca aborda de frente. Modelo Tripo H3.1 (60 créditos), tratado no Blender sem rig pago.
- GLB 3.596.260 bytes, três malhas com asas separadas, 12 ossos e dez clipes. Esticamentos da primeira abertura corrigidos separando regiões e fechando interiores; render e motor inspecionados. Escala no jogo 1,1 m.
- IA busca lateral do alvo, sinaliza pelo tempo de preparo existente e segue direção fixa no mergulho. Acerto apenas no contato da passagem, uma vez, com dano original 1,2x; velocidade 13 e recarga originais. Esquiva e defesa existentes preservadas. Morte e atordoamento cancelam. Virar para a ave durante preparo obriga nova aproximação. Somente espécie passaro; variantes preservadas.
- 13 verificações no jogo real local: frente/lateral, aviso, trajetória fixa, desvio, acerto e não duplicação, cancelamento por morte/atordoamento/rotação do alvo. Dez clipes × 21 amostras, todas as malhas, sem vértices inválidos ou chão atravessado; GLB reimportado no Blender. Teste: python tools/test_bird349.py, abrir bird-playtest.html localmente, não publicar página de teste.
- Fonte: https://drive.google.com/file/d/1q98lrik-UQLWTntAh0qoJ3orOOi0k6pD/view
- Editáveis, referências, GLB, renders e prova: https://drive.google.com/file/d/1KxWnFTt9dRhOniiEoSxxPZHmO3FGfiwj/view
- Limites: teste desktop; celular não testado, avaliação visual da IA sem aprovação criativa de Ian. Não há simulação aerodinâmica; voo baixo estilizado, colisões seguem o motor existente.

## v348 — Cogumelinho: fuga e esporos de sono, 12/10/2026
- Características e trio v006 consultados antes da produção: cogumelo de floresta, cerca de 1 m, pernas curtas, sem braços, chapéu assimétrico e lamelas; foge e solta esporos soníferos quando encurralado.
- Tripo multivista H3.1: 60 créditos, sem rig pago. Blender: 24 mil triângulos, cinco ossos e clipes Idle, Walk, Spore, HitRecieve e Death. GLB 3.588.740 bytes. Chapéu funciona como fole na emissão.
- Espécie cogu tenta fugir; em contato/sem saída prepara esporos por 0,7 s, raio 2,8 m com linha de visão. Sono de até 2 s conforme resistência; bloqueia movimento e ações, dano acorda e há imunidade de 6 s após sono. Morte/atordoamento interrompem emissão. Números são escolhas técnicas da IA. Variantes mantêm IA anterior.
- Validação no jogo real local: 13 verificações de fuga, aviso, alcance, sono, bloqueios, despertar, imunidade, expiração e interrupções; regressão da Gosma passou 13/13. Reimportação Blender e cinco clipes em Three.js r128, 21 amostras cada. Teste reproduzível: python tools/test_cogu348.py, abrir cogu-playtest.html localmente; não publicar página de teste. Celular não testado; sem aprovação visual de Ian.
- Fonte: https://drive.google.com/file/d/19cLOtvqC5ulDJhmjcrQd8mNP9XNVw6LE/view
- Pacote completo: https://drive.google.com/file/d/1OcgxmioUGBk5jgkALxbdb7_quulAj438/view (29.509.780 bytes, SHA256 remoto conferido).
- Prova no jogo: https://drive.google.com/file/d/1nAW88dAQVszkUd-zF6yk48YdWHl9PHh_/view

## v347 — Gosma Verde: divisão e reunião noturna, 12/10/2026
- Pedido de Ian: ler as características antes de produzir cada mob; implementar e testar divisão/reunião da Gosma, depois seguir ao Cogumelinho.
- Gosma v005 multivista Tripo, otimizada e animada no Blender. Inteiro + três fragmentos fechados, seis ossos, sete clipes, incluindo Split/Merge. PBR preservado. Nenhum rig pago.
- Espécie gosma divide uma vez ao sobreviver a dano com HP <= 50%. Fragmentos recebem 60/23/17% da vida restante, vida máxima e dano. Mantêm ataques próprios. Após 8 s separados, à noite pelo relógio existente, aproximam-se com colisão e se reúnem; sem cura ou ressurreição de pedaços. Apenas a derrota do último sobrevivente liquida uma recompensa e uma morte do organismo original. Variantes não alteradas.
- Validado: reimportação Blender; 28 clipes em Three.js r128, 21 amostras cada, sem vértices inválidos/chão atravessado; 13 verificações no jogo com funções reais e avanço controlado do motor; capturas dia/noite. Teste reproduzível: python tools/test_gosma347.py na raiz e abrir gosma-playtest.html localmente. Não publicar a página de teste. Celular não testado; visual avaliado pela IA, sem aprovação criativa de Ian.
- Fonte: https://drive.google.com/file/d/1XepV_eZ33B41hKcw1pYEQA2AYnwMuw7v/view . Geração Tripo: 60 créditos.

- Editáveis, GLBs, manifesto e evidências no Drive: https://drive.google.com/file/d/1ZvC379sNT2Jhn-T_bw6lSny7eYjZpIzO/view . Prévia noturna: https://drive.google.com/file/d/1kMG9iEd6jn7iqGnJXCTjBSUakKW1lE3n/view .

## v346 — Slime Rosa multivista, rig e animações no Blender, 12/10/2026
- Pedido de Ian: gerar mobs com frente/costas/lado no Tripo e substituir no jogo; rig, reparos e animações no Blender, sem pagar rig Tripo.
- `models/m_slime.glb`: fonte Tripo v006 otimizada de 1.884.622 para 24.000 triângulos; 1.289.556 bytes, textura incorporada, altura 1 m e rig com 4 ossos. Clipes Idle, Walk, Bite_Front, HitRecieve e Death mantêm os aliases existentes.
- `makeMonster`: Slime preserva material PBR com roughness .42 para aparência úmida. Outros monstros mantêm o comportamento anterior. Dados de combate e saves não alterados.
- Validação: reimportação GLB no Blender 5.2.2; renders frente/costas/lado e poses; Three.js r128 com makeMonster/gAct/gPlay do jogo: 5 clipes presentes, deformação não estática e minY >= 0 em 21 amostras por clipe; página principal inicia sem erros de console; build executado duas vezes sem mudar game.html na segunda.
- Limites: combate completo e celular não testados; visual avaliado pela IA, sem aprovação criativa de Ian. O modelo não simula transparência volumétrica.
- Fonte online: https://drive.google.com/file/d/1uqiKXM9mAbxH8y7hiFH33-YnS0g4OkuV/view . GLB final: https://drive.google.com/file/d/1BzvAoVIUy7gaS-K-kzVSfZG0Ow62ybTt/view . 65 créditos na geração, zero rig/animação Tripo.

## v345 — conferência medida das 240: efeito no mesmo lugar do dano, 09/10/2026
- Pedido de Ian: "confere as 240 habilidades nesse critério" (efeito × onde o dano realmente cai).
- Método: grade de 48 inimigos em volta do personagem; para cada habilidade, lança a real (`runSkill`) e registra onde `hurtEnemy` acertou, zonas e projéteis; depois dispara só o efeito e registra as caixas do que foi desenhado; compara. Duas rodadas completas das 240.
- 1ª rodada: 213 batiam, 27 sinalizadas. Causa geral: o jogo aplica quase tudo em "inimigos num raio em volta de `kitPoint111`" (muitas vezes o próprio personagem) e escolhe o alvo único pelo ponto de mira (`kitTarget111`); várias receitas desenhavam "para a frente" ou num alvo adivinhado.
- Correção geral em `tools/vfx328.js`: `truth(sk)` pergunta ao jogo ponto, raio e alvos reais; `c.tx/c.tz`, `c.t()`, `c.list`, `c.rad`, `c.range` passam a vir daí; alvo único mira no alvo real; efeitos de área/estado ganham um anel fino no raio verdadeiro e faísca em cada alvo atingido (`reach`).
- Receitas refeitas: Mil Cortes (em volta), Cortina de Fumaça, Faca de Interrupção (uma faca por alvo real), Flecha Enredante, Maremoto e Rajada de Vento (em volta, é onde empurram), Erupção, Corrente de Raios/Descarga (mesma cadeia do jogo), Fratura Glacial, Agulha de Fenda, Corte Espacial e Lança de Gelo (alcance real).
- 2ª rodada: 218 batem; das 22 restantes, 18 são do teste (habilidades que exigem aliado/dispositivo/ataque anterior e dão erro sem isso; linhas que passam do fim da grade; saltos, em que o teste do efeito não move o personagem; veneno de habilidade anterior ainda pingando) e 4 eram reais de alvo único (Tiro Preciso, Estocada, Instante Fatal, Cravo de Muralha) — corrigidas as três do kit; reconferência das 18 mexidas: 18 de 18 batem.
- Não coberto pela medição: habilidades que não rodam sem pré-condição (Reprise, Ascensão de Fenda, Elo Protetor, Interposição, Âncora Protetora, Reparar, Desmontar, Sobrecarga, Projetar) e Cravo de Muralha (classe nova, alvo próprio). Ian precisa olhar essas no jogo.

## v344 — parar em cima de pedras e troncos; botão de reconstruir diz por que não funciona, 09/10/2026
Pedido de Ian (chat): "o botão de reconstruir cidade não faz nada" e "quando pulo por uma pedra não consigo parar em cima dela, é como se ela fosse infinitamente pra cima".
- **Colisão com altura:** os obstáculos eram círculos sem altura. Pedras (`ROCKS` e as pedras altas de cristal/vulcão) e troncos caídos agora guardam `c.h` (85% da altura real do modelo, `envTop344`). Quem está acima do topo passa por cima e pousa em cima (`floor344`); sair andando faz cair. Dá para pular de cima da pedra. Árvores, muros e prédios continuam sem `c.h` (bloqueiam em qualquer altura). Vale só para o jogador; monstros continuam contornando.
- **Reconstruir:** o botão ficava apagado sem dizer o motivo, e `doRebuild` saía calado. Agora o botão mostra "Limpe a cidade antes", "Falta ouro" ou "Faltam cristais", e toda recusa vira aviso na tela. Não achei caso em que o botão aceso falhasse; hipótese do Claude: Ian estava sem os 30 cristais ou sem ouro.
- **Testado no navegador local:** andar contra a pedra bloqueia; pulo pousa em cima (1,14 m), fica, pula de novo, sai andando e cai; os três textos do botão e a reconstrução completa.

## v343 — Espaço pula, cidade ocupada por Fenda, status cívico, carroças e Alvos Notórios, 08/10/2026
Pedido de Ian (texto colado no chat, confirmado ponto a ponto). Módulo novo: `tools/civic343.js` (carregado depois de `dome154.js`); ganchos pequenos em `game.html`, `tools/dome154.js`, `tools/economy154.js` e `tools/anim303.js`.
- **Controles:** Espaço só pula (`jump343`, impulso 8,2 e gravidade 24: ~1,3 m, ~0,66 s; pose em `Anim303.air`). Ataque básico só no botão esquerdo do mouse. A ação "Atacar" saiu da lista de teclas; entrou "Pular". Montado não pula.
- **Ataque à cidade (RAID155) com domo:** a tropa que ataca a cidade fica do lado de fora e gasta o domo (~1 min com 4 monstros + chefe); só entra quando ele rompe. Cidade longe: a perda de defesa simulada vai para o domo primeiro. Sem domo: como antes.
- **Cidade ocupada:** cidade que cai por ataque ganha `profile.inv343[id]` e uma Fenda Invasora vermelha na praça (rank = perigo da região ou o do jogador, o maior). Reconstrução no marco só depois de fechar a Fenda (chefe "Chefe Invasor"). Capitais continuam com a Fenda da Âncora (v221). A pousada agora também tranca em cidade caída (antes ficava aberta).
- **Defesa vencida:** +15 de confiança e ouro tirado do tesouro da cidade (`Econ154.treasuryPay`), se o jogador ajudou (6 s perto). Invasão comum (L.inv) passou de +12 para +15. Não existia festival de vitória no código; os festivais de calendário não foram mexidos.
- **Status cívico (confiança por cidade, `profile.regions116`):** Forasteiro 0–24, Conhecido 25–49, Defensor Local 50–74, Herói Local 75–100. Conhecido: estoque reservado (1 peça Rara por dia do jogo por loja, 2× o preço; elixires mesmo em cidade nível <2, inclusive com mascates) e moradores chamam pelo nome. Defensor: guardas das muralhas atiram em quem persegue o jogador até os portões (7% da vida do monstro por tiro, 3% elite, 1% chefe) e pousada pela metade. Herói: pousada grátis, sem imposto nas vendas, batedores (1×/dia do jogo marcam Fendas raras e peças soltas no mapa). Descontos de loja antigos mudaram de 20/50/80 para 25/50/75. Quadro explicativo na janela REGIÃO.
- **Carroças:** até 2 perto do jogador, andando pelas estradas em L entre cidades vizinhas; ~1 em 3 nasce emboscada. Salvar: balão do mercador, ouro, +5 de confiança e −3 de escassez na cidade de destino. Perder: +2 de escassez. Modelo feito por código (provisório).
- **Alvos Notórios:** aba nova na Ordem. 8 contratos, um por bioma, liberados pela reputação da Ordem (`ORDER_REP_NEED`). Um ativo por vez; o alvo (elite com nome, 3× vida) aparece no bioma longe das cidades. Recompensa: título `notor_<bioma>` com bônus pequeno, reputação e ouro. Estado em `profile.notor343`.
- **Decisões do Claude (não aprovadas por Ian):** números acima, nomes dos alvos e dos títulos, visual da carroça e da pose de pulo.
- **Testado no navegador local:** pulo/ataque, graus, pousada, imposto, estoque, raid com e sem domo, queda, Fenda, reconstrução, defesa vencida, carroça (trânsito, salva, perdida), guardas, batedores, alvo notório. Não testado: luta real dentro da Fenda Invasora até o chefe (a saída foi simulada), cidade nível 6+, celular.

## v342 — habilidades sem projétil duplicado; efeito no ponto do dano, 08/10/2026
- Ian: "bola de fogo e chuva de flechas usam junto com as novas a mesma animação, mas só a antiga dá o dano; saiu uma menor que deu o dano e uma grande que não fez nada".
- Causa (erro da v334): o teste "o jogo já atira o projétil" olhava `sk.t==='bolt'`, mas as habilidades do kit têm `t:'kit111'` e o tipo em `effect`; o efeito soltava um segundo projétil só de enfeite. Além disso a Chuva de Flechas e a Chuva de Meteoros já tinham queda real por pulso (`pulseFx156`/`fallFx`) e ganhavam outra por cima.
- Agora: em `bolt`, `fan` e `release` o vfx328 não cria projétil (`REAL`); fica só um brilho curto no lançamento. Chuva de Flechas e Chuva de Meteoros mostram só o círculo no chão; quem cai é o projétil real.
- Os shaders foram para o que dá o dano: o meteoro real usa bola e cauda de fogo e deixa chamas ao cair; a flecha real fica cravada um instante (`VFX328.stuck`); o projétil de habilidade do kit sai maior (`sc:1.7`) que o do ataque básico.
- Efeitos de área do kit nascem no ponto de `kitPoint111` (o mesmo do dano). Antes iam para a mira mesmo quando a área real era em volta do personagem.
- Testado no navegador pelo caminho real (`runSkill` + efeito): Bola de Fogo, Adaga e Arremesso de Rocha = 1 projétil; Leque = 3; chuvas = só a queda real; sem erros. Habilidades de linha/alvo (dano instantâneo, sem projétil real) continuam com o projétil visual, que é o único.

## v341 — ponto de habilidade sem erro, habilidade não troca ao morrer, portões das cidades, 08/10/2026
- Ian (áudio 1): começou com Redemoinho de Aço (Berserker); a lista de Habilidades mostrava todas, ele pôs um ponto na errada e a habilidade em uso virou outra. **Causa da troca:** gastar o ponto não muda a habilidade equipada (conferido); quem trocava era a morte — `die()` recriava o `run` guardando só a posição, então `classLoadout` voltava para a 1ª habilidade da classe (Golpe Brutal). Agora `die()` guarda `classLoadout` e `initialSkillFix259`.
- Personagem → Habilidades: só as habilidades **em uso** aparecem com o botão Melhorar; as outras ficam em "Habilidades fora de uso · N", recolhido (`<details data-skill114="others341">`, estado lembrado em `CHAR_UI118.details`). Ainda dá para melhorar ali dentro; trocar continua em Equipar habilidades, na cidade.
- Ian (áudio 2): de dentro da cidade dava para bater à distância nos monstros sem eles reagirem; sugeriu portão ou os monstros perseguirem. Feito (proposta minha juntando as duas ideias, **Ian ainda não aprovou**):
  - `cityGates341` (chamado em `envCity`): portão de duas folhas nas 4 entradas da muralha de toda cidade (e na muralha externa, nível 6+). `updGates341`: abre quando o jogador chega perto (meia largura + 6 m) ou quando um invasor chega; fecha depois. Cidade caída = portão arrombado.
  - `cityRaider341(e)` = `raid155 || breaker || inv || siege || aw103`. Monstro comum agora é barrado na borda da zona segura (36*CITYK), não mais a 38 m do centro; invasor continua entrando.
  - `hurtEnemy`: jogador dentro da cidade não fere monstro comum que está fora ("MURALHA" + aviso do Narrador a cada 45 s).
  - `pickTarget`: invasor que está dentro da cidade pode mirar o jogador lá dentro (antes o jogador era intocável na cidade e matava invasor de graça).
- Testado no navegador: lista de habilidades; morte mantém Redemoinho de Aço; monstro comum barrado a 64,1 m; golpe de dentro para fora = 0; fora da cidade luta normal; invasor ataca o jogador dentro (136→85 de vida); portão abre/fecha. Sem erros no console.
- Pendente: Ian ver o visual do portão (primeira versão, madeira com ferragens) e dizer se a regra ficou boa; o portão é só regra + visual, não tem colisão própria.

## v339 — Lanceiro arremessa a própria lança; sem lança bate de perto, 08/10/2026
- Ian: "ele tem que arremessar a mesma lança que ele usa e não outras; sem lança ele é igual o assassino sem adaga, deve bater de perto". **Substitui a regra da v326** (Lanceiro desarmado arremessava lanças).
- Lanceiro sem `basicRanged`: desarmado usa o caminho corpo a corpo (animação de soco, sem projétil, sem a penalidade de intervalo dos desarmados à distância). Descrição do ataque básico atualizada.
- Com lança equipada: `projModel('tspear')` usa `Warrior127.spearModel(m)`, clone da lança que está na mão (modelo e cor do rank); a lança some da mão por 0,3 s enquanto voa (`player.spearGone339`). Sem lança na mão (ex.: efeitos de habilidade) cai no modelo comum.
- Efeitos de estocada (vfx328) passam a usar a lança no tamanho real.
- Testado no navegador: desarmado = soco, 0 projéteis; com lança = 1 projétil com o modelo da mão, mão vazia durante o voo, acerto no inimigo; sem erros. Dano/alcance/cadência com lança não mudaram.

## v338 — lança segurada do jeito certo, 08/10/2026
- Ian: "o jeito que ele segura a lança eu percebi que é estranho". Causa: a lança usava a pegada de espada — ficava em pé (ponta para cima) durante a estocada e o arremesso, e deitada na cintura com o braço duro quando parado.
- `Warrior127.spearAim` (tools/warrior-player127.js), chamado em game.html depois de todas as animações: gira só o encaixe da mão para a ponta seguir uma direção — para a frente em golpes e arremesso, em pé ao lado do corpo parado (cabo no chão), de lado no giro (`gira_lanca`), para baixo no `salto_impacto`. Guardada nas costas (correndo) não muda. Só o jogador; caçadores/NPCs não foram alterados.
- `Anim303.active()` informa a animação de habilidade em curso.
- Conferido em close de vários ângulos (parado, estocada, mira, recuo, cruz, giro, salto, arremesso básico), sem erros. Conferência da IA, não aprovação de Ian.

## v337 — pendências dos efeitos: folha das 24 classes, animações com arma na mão, Mago Elemental, 08/10/2026
- Pedido de Ian: fazer o que faltava da v334.
- Folha de prints das 24 classes refeita com os shaders novos (2 momentos por habilidade): 0 erros. Único ajuste: `Clarão` durava tão pouco que quase não se via (agora com onda e arco elétrico).
- Animações das classes novas conferidas com a arma na mão (lança e machado equipados; `gearLook()` é quem desenha a arma). A estocada e a mira apontavam a lança para o chão: `hand_r` levanta a ponta. Nada atravessa o corpo.
- Mago Elemental (Ian: "não existe mais"): a entrada 3 de `CLASSES` continua, marcada `legacy`, porque apagar mudaria o número de todas as classes seguintes e quebraria saves; saves antigos de classe 3 já são migrados para o mago do elemento. Corrigidos os três sorteios que ainda podiam mostrá-lo ao jogador: classe de caçadores/rivais (2) e a roleta de nomes do despertar.
- Conferência visual da IA em prints, não aprovação estética de Ian. As v335 (Conspirar) e v336 (armadura Ferro/Comum) são de outras sessões e foram preservadas.

## v334 — shaders próprios e projéteis reais nas habilidades, 08/10/2026
- Pedido de Ian: "quero shaders nas habilidades, se tiver fogo que se movimente como uma chama, mais visualmente bonito e não só luzinha; se precisar usa os projéteis que já estão, que nem na chuva de flecha, muito importante".
- `tools/shaders312.js`: shaders novos por tipo de efeito — `fire` (chama com a ponta balançando, aceita cor), `fireball`, `smoke` (volume macio que se desfaz), `electric` (fio que treme e ramifica), `ray` (pilar de luz), `shield` (colmeia com onda), `magic` (círculo mágico girando), `slash` (meia-lua que afina nas pontas), `swirl`, `water` (onda com espuma), `voidm` (núcleo negro). `make()` aceita vertex shader próprio.
- `tools/vfx302.js`: peças refeitas com esses shaders — fireRing, meteor (cauda de chama; variante de pedra), bolt/storm, pillar, slash, whirl, dome, runeCircle, vortex, smoke, poison; novas `flames` (fogueira) e `zap` (arco elétrico entre dois pontos).
- `tools/vfx328.js`: projéteis reais via `projModel` (os mesmos modelos do jogo): `fly` (flecha, adaga, lança, bola de fogo, gelo, rocha, raio, vazio voando) e `rainArrows` (Chuva de Flechas com flechas caindo e cravando no chão). Receitas trocadas em Arqueiro (7), Assassino (2), Mago de Fogo (10), Gelo (Lança de Gelo, Maremoto com onda de água), Terra, Raio/Condutor/Artífice, Devorador, Lanceiro (lança de verdade nas estocadas) e Lança Solar. Onde o jogo já atira o projétil (`sk.t==='bolt'`) o efeito não duplica.
- Fumaça do Assassino (era um bloco chapado) agora usa o shader de fumaça.
- Validação: shaders compilam sem erro; varredura das 240 habilidades com 0 erros (inclui erros atrasados); prints em close de ~30 habilidades de dia e à noite; desenho de um quadro ~3 ms. Conferência visual da IA, NÃO aprovação estética de Ian.
- Pendente: animações das classes novas com a arma na mão continuam sem conferência visual (no personagem de teste a lança equipada por código não apareceu na mão). Entrada interna do Mago Elemental não removida (mexe em numeração de classe e saves). As v332 e v333 (missões, XP, Conspirar) são de outra sessão e foram preservadas.

## v331 — conferência por print das 240 habilidades, correções de efeito e animações das classes novas, 08/10/2026
- Pedido de Ian: continuar o que faltou na v329 (ver cada habilidade por print e ajustar; animações próprias das classes novas). São 24 classes × 10 habilidades; o Mago Elemental não existe mais (sobra só a entrada interna 3, base dos magos de elemento, fora da escolha de classe). A v330 (luva do Viajante) é de outra sessão e foi preservada.
- Conferência: folhas de print de todas as 24 classes (2 momentos por habilidade), de dia e à noite, mais varredura das 240 pelo caminho real (`skillAnim155` + `VFX302.play`) capturando também erros atrasados: 0 erros.
- Defeitos achados e corrigidos:
  - `vfx302.slash` desenhava o arco de corte ATRÁS do personagem (desde a v302); `shout` da v329 tinha o mesmo erro.
  - `Shaders312.energy` e `fire` eram só aditivos: de dia viravam branco. Agora pré-multiplicados cobrindo parte do fundo (a cor da classe aparece de dia e continua brilhando à noite). `whirl` passou a usar o mesmo material.
  - `afterimages` (14 receitas) quebrava em silêncio (`new T.CapsuleGeometry ? …`) dentro de um setTimeout e nunca aparecia.
  - `anim303`: giro (spin) e altura (y) da raiz eram zerados pelo jogo logo depois do `post`; `Anim303.root(P)` reaplica depois do reposicionamento. Vale também para as animações antigas (giro, salto_impacto, ajoelhar, firme).
  - Lanceiro conforme a descrição: Cruz de Hastes em X (era +), Bússola Partida só nos flancos (eram 4 lados), Ponta Absoluta só de 4 a 8 m.
  - Rastro de flecha com aros menores; Aparo/Aparo Espectral, Passo de Flanco/Recuar visíveis; fendas do Tecelão viram para a câmera; estacas/muralha de pedra com rachadura acesa e brilho próprio; raios de vínculo só para aliados a até 16 m; cores de Lanceiro, Duelista e Lâmina Arcana mais saturadas.
- Animações novas em `tools/anim303.js` (21, por código nos ossos): socos, chute, palma, respirar, direto, duplo, roda (Monge); estocada, gira_lanca, cruz, recuo, mirar (Lanceiro); esmagar, rugido, sacrificio, varrer, explodir (Berserker); corte, erguer (Lâmina Arcana). `Anim303.map` liga 36 habilidades pelo nome e substitui o clipe genérico.
- Validação visual feita pela IA em prints; NÃO é aprovação estética de Ian. Animações vistas no Monge sem arma; com lança/machado na mão só foi testado que não dá erro. Fumaça do Assassino continua um bloco chapado (não mexido).

## v330 — Viajante: linha do pescoço à mão direita corrigida no próprio GLB, 08/10/2026
- Causa: o vértice 0 de `tripo_part_7` (luva direita) em `models/viajante153.glb` tinha o X zerado (ficava no centro do corpo, com pesos de antebraço), formando 6 triângulos-fio de ~48 cm até a mão.
- Correção direta no buffer, sem reexportar pelo Blender: X do vértice = média dos 6 vizinhos (volta para a superfície da luva, sem buraco) e ossos/pesos copiados do vizinho mais próximo; `max` do acessor de posição recalculado. Mudam 13 bytes do BIN e um `max` no JSON; esqueleto, materiais, UVs, normais e todas as outras malhas ficam byte a byte iguais (12 malhas, 19 ossos, 97 nós, mesmos nomes).
- O corte em tempo de execução da v156 (`sliver156`, em `tools/warrior-player127.js`) continua no código: agora corta 0 triângulos na luva. Ainda corta 3 em `tripo_part_4` e 1 em `tripo_part_10` (mesmo defeito, Y zerado, dentro das botas) — conferidos em render cru de perto em 4 ângulos e não aparecem, por isso não foram alterados.
- Testado no navegador: GLB cru em repouso, corrida e ataque sem a linha; no jogo, Guerreiro novo andando e atacando, maior aresta da luva em pose = 2,6 cm, sem erros do jogo no console. Sem mudança em saves ou balanceamento.

## v329 — efeito visual próprio para todas as habilidades, 08/10/2026
- Pedido de Ian: arrumar o visual das habilidades de TODAS as classes, não só as 3 primeiras. Antes, 126 das 200 habilidades do catálogo usavam efeito genérico (anel, cúpula, brilho) e as 7 habilidades novas de Monge, Lâmina Arcana, Lanceiro e Berserker só um anel.
- tools/vfx328.js: uma receita por habilidade (243 das 24 classes, todas cobertas), com peças novas: punhos, estocada de luz, sangue, relógio do tempo, fenda, correntes, espíritos, ossos, totem rúnico, selos (palma, cinco pontos, oito), grito, faísca de aparo, jaula, imagens residuais. Habilidades de chefes/roubadas seguem no vfx302.
- Validação: todas as 243 disparadas no navegador sem erro; print dos punhos do Monge. Conferência visual das demais NÃO concluída (Ian pediu para parar e publicar). Pendente: revisar por print e ajustar; animações próprias das classes novas.

## v328 — 10 passivas novas (55–100) e passivas ocultas até liberar, 08/10/2026
- Pedido de Ian: passivas gerais novas por nível, depois do 50 (`tools/passives327.js`): Golpe Resoluto 55, Respiro 60, Ímpeto 65, Elo Elemental 70, Desgaste 75, Caçador de Marcas 80, Leitura de Combate 85, Sangue-Frio 90, Contra-Fluxo 95, Último Fôlego 100.
- Aba Passivas só mostra as liberadas (sem 🔒 nem nível futuro); o aviso [PASSIVA] continua ao liberar.
- Ganchos: hurtEnemy (crítico do Contra-Fluxo, Desgaste, Resoluto/Leitura, Elo Elemental após elemMul300), perfectDodge, hurtPlayer (Respiro; Último Fôlego antes de die), killEnemy (espalha marcas), laço (Ímpeto), attackTiming, passiveCost263 (Sangue-Frio).
- Último Fôlego: 1× por masmorra/portal; fora, recarga de 3 min. Não conflita com o título Fênix.
- Validação: 10 passivas testadas em Node com as funções reais, node --check em todos os scripts, build ok. Sem teste no navegador.

## v327 — campanha jogável, missões dos NPCs, Torvo e Tomo, 08/10/2026
- Pedido de Ian (revisão da história): os passos dos atos agora são missões de verdade (`tools/campaign327.js`). Um ato por vez, na ordem, liberado pelo rank (I a VII; o Ato I já no início) ou pelo evento que libera a página do Diário (VIII a XIII). Tipos de passo: ir até uma luz no mundo (dourada = ato, azul = NPC), com inimigos que aparecem ao chegar, figura (guarda, Aldric, sobreviventes, Torvo) e F para interagir; falar com o NPC na cidade (a fala aparece no topo da janela dele); eventos já contados pelo jogo (guardiões, elites, portais, cristais); andar da Torre; capitais visitadas; ler a confissão no Diário.
- As 7 missões de NPC da Crônica (Lyra, Mira, Brann, Kael, Selene, Dorian, Torvo) existem: aparecem na janela de afinidade de cada NPC depois do ato correspondente, com botão Aceitar; a do Torvo começa sozinha na estrada. Cada conclusão dá XP, ouro, reputação e uma página no Diário.
- Torvo é personagem único: aparece nas missões do Ato VIII e na dele; saiu da lista de nomes aleatórios dos goblins dos postos (no lugar: Ossa).
- Tela de rank mostra os 13 atos com o passo atual, como liberar os bloqueados e botão Acompanhar.
- Tomo da Pele de Ferro: deixou de reduzir dano em porcentagem; dá defesa universal em número (1,5 × poder do nível por nível do tomo), conforme a regra de defesa em número. Livraria continua até o nível 10 (Ian: não mudar).
- Nome: título da Crônica = Primeva; estudos visuais e licença dos NPCs trocados de Ecos da Fenda para Primeva.
- Validação: personagem de teste novo, Ato I jogado no navegador (luta, guarda, muralha, Lyra), todos os 13 atos e 7 missões de NPC completados por roteiro automático sem erro no console, Torvo e luz conferidos em print, tela de rank e Tomo conferidos. Sem campanha longa jogada à mão.

## v326 — Lanceiro arremessa lanças, 07/10/2026
- Pedido de Ian: básico do Lanceiro arremessa lanças pela mão, como o Arqueiro. Sem arma, reaproveita penalidade existente de intervalo ×1,6; não é 60% mais lento que o Arqueiro. Assassino desarmado continua corpo a corpo, sem gerar adagas.
- Lança equipada lança projétil físico, preservando prioridade da arma. Lanceiro desarmado lança lança física, animação de arremesso e origem na mão. Habilidades e escala por Força do Lanceiro preservadas. Descrição explica o intervalo de ataque.

## v325 — tutorial sem texto cortado, 07/10/2026
- Remove altura fixa e corte de três linhas dos avisos. A caixa cresce conforme o texto, preservando fonte de 13 px, largura máxima de 420 px e posição superior. Normaliza o bloco interno do tutorial para evitar borda, margens e espaçamento duplicados. Avisos continuam ocultos sobre menus e sem capturar cliques.

## v324 — lembranças e Bestiário/Grimório, 07/10/2026
- Corrige retorno indevido da ação narrator105 que redesenhava o Diário sobre a tela recém-aberta. A tela de lembranças registra sua própria função de atualização, preservando a navegação e o histórico de Voltar.

- Bestiário sempre no menu e Diário, busca por descobertas, fichas com imagem do modelo, abates, lore e domínio. Avisos de descoberta, lore, domínio, raros e chefes clicáveis para a criatura; ocultos sobre menus, prazo ampliado enquanto focados. Prévia cria modelo isolado, sem spawn/abate.

## v323 — equipamentos Ferro/Comum, 07/10/2026
- Prioridade de Ian: todas as armas, armaduras e acessórios após concluir o piloto. Inventário online: 139 referências de armas observadas entre 720 combinações planejadas, 80 conjuntos de armadura e 10 coroas. Isso não equivale a modelos 3D prontos.
- Primeiro piloto: espada Ferro/Comum modelada no Blender conforme três vistas; elmo TripoSG ajustado ao Viajante original, textura da referência e variante de cabelo apenas na área coberta. Corpo/rosto originais preservados, cabelo restaurado ao retirar.
- Seleção restrita a tier 0 / rar 0 sem conjunto especial; outros equipamentos mantêm seus modelos. Ligações do elmo ao esqueleto original e espada ao encaixe da mão. Respostas assíncronas descartadas após trocar/remover item.
- Validação: pegada, repouso/corrida/ataque, retirada e restauração da cabeça, cancelamento de carregamento tardio; build/sintaxe. Sem benchmark em celular ou campanha longa.
- Fontes, referências e evidências: https://drive.google.com/drive/folders/1Tb7vOq-UQGP34xLDPzL3QiNfTajmNbCC . Próximos lotes seguem pendentes, sem geração contínua.

## v321 — avisos compactos e ficha de volta à Build, 07/10/2026
- Correção explícita de Ian: ficha de combate e regeneração pertencem à Build. Status volta a priorizar atributos e pontos disponíveis. Reverte a mudança de localização introduzida na v320.
- Avisos flutuantes: até 420 px, fonte 13 px, até três linhas, margem superior 10 px, duração até 6,5 s e sem interceptar cliques. Texto completo preservado no Histórico.
- Avisos ocultos imediatamente ao abrir qualquer janela ou o menu do jogo; fila não inicia novos avisos enquanto há janela aberta.

## v320 — Primeva e revisão de consistência, 07/10/2026
- Decisão de Ian: jogo Primeva; Primeva é a oitava raridade de equipamento. IDs anteriores e chaves de save preservados. Padrões iniciais de balanceamento: multiplicador 5,2, três afixos e pesos 0,001/0,01 em saque comum/chefe.
- Bolsa contém ouro carregado, equipamentos guardados, recursos e consumíveis. Ficha de combate e regeneração em Personagem → Status; progressão da arma viva em Build. Painel opaco evita ler o HUD por trás.
- Correções: tipo/elemento das habilidades mantém a classe de origem, inclusive projéteis e queimadura; defesa não vaza dano mínimo; mana natural corresponde ao valor exibido e não multiplica poções; proibição de cura vale na recuperação natural e no bioma florido.
- Passivas aprendidas das quatro classes permanecem ativas após mudar classe; cadeia do Monge expira, Cicatriz inclui golpes antigos e marca alternada usa o tipo real do dano. Bestiário não inventa afinidade com base na localização do jogador. Recompensa informa conversão em ouro quando a bolsa está cheia.
- Validação: 17 regressões, 243 descrições geradas, 69 scripts analisados, interface em 1100×720 e 390×844, round-trip de save com raridade 7. Teste de navegador isolado com animação contínua suspensa; não equivale a campanha longa nem celular físico.
- Integradas v318/v319 do Dracônico (28c55ca), preservadas sem reverter modelo/animações. Cache inclui recursos e versões efetivamente referenciados.

## v315 — quatro criaturas remodeladas, 07/10/2026
- Pedido de Ian: substituir as quatro inéditas pelos modelos Blender recém-criados. Olho Errante, Arraia do Vazio, Arauto da Fenda e Semente da Fenda nos mesmos IDs e arquivos; regras de combate/lore preservadas.
- Movimentos de Idle/Run/Attack/Hit/Death adaptados por grupos, tentáculos/raízes/anéis; sem skinning novo. Escala e flutuação normalizadas; Arraia dimensionada pelo comprimento para não ampliar pela espessura. Carregador exclusivo evita corrida que sobrescreveria as animações.
- Testes: nascimento das quatro em partida isolada, 20 estados de animação, prévia com materiais do jogo, sem erros de console; build estável. Sem campanha longa ou teste em celular físico. Entrega: https://drive.google.com/drive/folders/1l6XNUEtghfniCZGZsKBlzZPNbEhMqNMR
- Base preservada: v314 de habilidades/fúria (585e0fa), recebida durante a integração.

## v313 — mais shaders, 07/10/2026
- Cristais do mundo (cryMat230) usam o shader Crystal310. Anel do rank do jogador, auréola do título, anel das criaturas raras e anel dos Abissais usam o shader de energia (Shaders312). Materiais de shader expõem .color para o jogo trocar a cor do rank.

## v312 — biblioteca de shaders, 07/10/2026
- tools/shaders312.js: energy (fluxo de ruído + fresnel, aditivo), fire (gradiente de calor + tremulação), lava (brilho escorrendo), metal (rampa em degraus + reflexo em faixa + borda). Efeitos das habilidades (vfx302) usam energy em vez de brilho chapado; anel de fogo usa fire; fissuras usam lava. Coroas: metal, joias com Crystal310, partes luminosas com energy.

## v310 — shader de cristal, 07/10/2026
- Direção visual do Ian (cartunesco + shaders, cristais reais): tools/crystal310.js — shader compartilhado com faces lapidadas, fresnel, luz fluindo por dentro, especular em degraus e cintilância. Aplicado nos cristais das Fendidas (Blender e código), fragmentos dos Abissais, espinhos de gelo dos efeitos e cristais da coroa do Tecelão.

## v309 — 200 criaturas (4 inéditas do Blender), 07/10/2026
- Olho Errante, Arraia do Vazio, Arauto da Fenda e Semente da Fenda modeladas do zero no Blender (peças em ossos, animações Idle/Run/Attack/Hit/Death), script no cofre Entregas/Fendidos-2026-10-07/ineditas-blender.py. Aparecem nas Fendas (Arauto só em Fendas fundas; Sementes também perto de portais). Bestiário: 183 espécies + 13 chefes + 4 inéditas = 200 (tools/ineditas309.js).
- DIREÇÃO VISUAL DO IAN: estilo cartunesco mas com shaders bonitos (como água e Fenda); cristais mais reais. Aplicar em tudo que for criado.

## v308 — 196 criaturas no Bestiário, 07/10/2026
- Pedido do Ian (200 criaturas com lore): cada uma das 61 espécies ganhou versão FENDIDA (_f: cristais por bioma, +60% vida) e ABISSAL (_a: corpo de vazio, fragmentos orbitando, anel roxo, +140% vida). Lobo/Aranha/Gigante/Yeti Fendidos usam os modelos do Blender. Nas Fendas: 14% vira Fendida; em Fendas vermelhas/corrompidas/rank B+, 5% Abissal; perto de portais abertos no mundo: 8% Fendida. Lore gerada a partir da lore da espécie. 13 chefes entram no Bestiário com lore própria e aviso 'CHEFE DESCOBERTO'. Total: 183 espécies + 13 chefes = 196 (tools/variants308.js). Faltam 4 inéditas (Blender) para 200.

## v307 — Fendidos (4 primeiros), 07/10/2026
- Lore nova do Ian: criaturas tocadas pela Fenda. Lobo Fendido, Tecelã de Vidro, Colosso Rachado, Yeti Corrompido: modelos CC0 da Quaternius transformados no Blender (cristais presos aos ossos, corpo escurecido, olhos brilhando; materiais FendaCristal/FendaBrilho). Mutação por bioma (cor dos cristais + nome: Gélido, Ígneo, de Âmbar, Tóxico, Musgoso, Florido, Prismático). Aparecem em 12% das criaturas nas Fendas e 8% perto de portais abertos (tools/fendidos307.js). Script do Blender no cofre (Entregas/Fendidos-2026-10-07).
- Próximo: PDF de escalas; 200 criaturas com lore; prompts de imagem para o Tripo.

## v306 — habilidades das classes novas; Bestiário só com o que está na tela, 07/10/2026
- Bug (Ian, Berserker): as 4 classes novas não tinham habilidades 'aprendidas' (kitUnlocked111 só aceitava classes com catálogo KIT_DEFS111), então nada entrava no espaço. Agora as 3 habilidades das classes 21+ contam como aprendidas. 'Varredura' do Lanceiro virou 'Varredura de Lança' (nome igual ao do Guerreiro confundia o kit).
- Bestiário: espécie só conta como vista se o monstro estiver dentro do campo da câmera (frustum + margem), até 30 m.

## v305 — espada não atravessa o peito; movimento dos chefes, 07/10/2026
- Poses novas: com arma na mão, o braço direito nunca cruza o peito (a espada atravessava o corpo).
- Chefes, elites e rivais se movem nos ataques (Anim303.enemyPost): pancada = sobe, tomba para trás e desce com fissuras e tremor; investida = inclina e solta poeira; magia = flutua com círculo rúnico; golpe = gira o tronco e solta com arco de corte; tiro = recuo.

## v304 — animações novas de lançamento, 07/10/2026
- Pedido do Ian: animações criadas no código direto nos ossos do Viajante (tools/anim303.js), aplicadas por cima da animação normal: salto_impacto (terremoto, Salto do Dragão), giro 360° (giratórios), ceu (raios, meteoros, tempestades), palmas (jatos e rajadas mágicas), ajoelhar (curas), firme (escudos/guarda).

## v303 — animação de lançamento por habilidade, 07/10/2026
- Pedido do Ian: o personagem faz um movimento ao lançar cada habilidade (skillAnim155), usando as 24 animações do Viajante: pesado2 (terremoto, golpes brutais), golpe3 (giratórios), arco2/arremesso_flecha (flechas), soco (Monge e punhos), lanca1 (Lanceiro, estocadas), guarda (defesas), esquiva (deslocamentos), adaga2 (Assassino), pesado1/golpe2 (golpes), magia_mao/cajado2 (magias, curas, buffs). Animações novas feitas no Blender ficam para depois.

## v302 — efeitos visuais das habilidades, 07/10/2026
- Pedido do Ian (prioridade): habilidades eram só anéis brilhando. tools/vfx302.js liga as 415 habilidades (classes + kits) a efeitos próprios por nome/elemento/tipo: Terremoto/Tremor/Erupção = fissuras no chão com brilho de lava, pedras e tremor de tela; pedra = espinhos de rocha; gelo = espinhos de gelo/cúpula; fogo = anel de chamas com brasas, meteoros em chuva, jato; raio = relâmpagos do céu; luz = pilar; flechas = rastro perfurante/leque; giratórios = corte 360°; fumaça, veneno, cura, cúpula de escudo, círculo rúnico, vórtice, vento, rastro de investida. O anel antigo é silenciado no instante do lançamento.
- Próximo: refinar efeitos por habilidade (feedback do Ian) e animações próprias das classes novas; mais monstros (peças grátis/Blender).

## v301 — tela de escolha de classe, 07/10/2026
- A lista vazava da caixa e o texto ficava minúsculo (print do Ian). Agora: botões curtos (nome + estilo + recurso) em 2 colunas dentro da caixa; ao clicar abre o detalhe (recurso, atributo, passiva, habilidades) e o botão 'Escolher'.

## v300 — Afinidade elemental (nível 55), 07/10/2026
- Criaturas têm fraqueza/resistência (fogo, gelo, terra, raio) pelo perfil (Espectral, Arcano, Blindado, Universal) ou bioma. Fraqueza +30% ('FRACO A X!'), resistência −30%. Projéteis pelo tipo (fire/ice/stone/spark), golpes pela arma encantada (Mercado, 60× ouro do rank), habilidades pela classe elemental. Bestiário mostra após 10 abates (tools/elem300.js).
- PENDENTE (prioridade alta, pedido do Ian): refazer efeitos visuais de TODAS as habilidades (terremoto abre fissura e treme; flecha perfurante etc.) e animações próprias das classes novas; criar mais monstros com peças grátis/Blender (Tripo sem créditos).

## v299 — Fendas corrompidas (nível 50), 07/10/2026
- Primeiro sistema novo depois do nível 45. Do nível 50 em diante, 15% dos portais nascem corrompidos com 1–3 modificadores: Monstros fortes (+50% vida/dano), Sem poção, Frenesi (+30% velocidade), Sem regeneração. Rótulo 'CORROMPIDA · ... · +N%'. Ao fechar: ouro (80 × ouro do rank × nº de riscos × bônus) e XP extra (tools/corrupt299.js). Entrada nova no UNLOCK (nível 50).

## v298 — criaturas raras por bioma, 06/10/2026
- No mundo, 1,5% dos monstros comuns nascem como variante rara do bioma (Alfa, Encantado, Ancião, Dourado, Infernal, Ancestral, Prismático, Venenoso): vida ×3, dano ×1,4, maior, anel e luz na cor do bioma; ouro ×10, XP extra e equipamento Épico garantido. Aviso 'CRIATURA RARA AVISTADA/DERROTADA' e seção no Bestiário (tools/rare298.js).

## v297 — 4 classes corpo a corpo, 06/10/2026
- Pedido do Ian (mais corpo a corpo): Monge (21, punhos, Fúria, passiva Punho Ressonante), Lâmina Arcana (22, mago corpo a corpo com dano mágico, Mana, passiva Lâmina Sedenta), Lanceiro (23, lança, Vigor, passiva Primeiro Sangue), Berserker (24, machado, Fúria, passiva Fúria Sanguinária). MELEE_MAGIC297: Lâmina Arcana ataca corpo a corpo com dano mágico. Nova arma 'spear' (Lança, modelo comum-lanca). GROWTH com 4 entradas novas; resourceType260 com os índices novos.

## v296 — defesa em número, 06/10/2026
- REGRA DO IAN: defesa é NÚMERO descontado do dano, não porcentagem (100 de dano contra 200 de defesa = 0). Resistência = defesa física, Espírito = defesa mágica, Vontade = defesa universal (metade por ponto, soma com as duas). Cada ponto vale atkPer(nível). Penetração da Destreza também é número (metade por ponto). Monstros: pontos × atkPer(nível) × 0,5. A armadura (player.def 12%) continua como antes.

## v295 — biomas com efeito, 06/10/2026
- Pedido do Ian: biomas ~2,5× mais longos (biomeAt com frequência menor; média ~320 m numa linha). Ao entrar, aviso com o efeito. Penalidades: Deserto (cansaço 2×, vigor −25%), Neve (movimento −12%, mana −20%), Vulcão (−0,3% vida/s, até 20%), Pântano (movimento −10%, vigor −15%). Bônus: Floresta (+5% crítico), Campos floridos (vida fora de combate), Cristal (+25% mana).
- Mercado (Dorian) vende Cantil, Capa de pele, Unguento e Botas de lodo: anulam a penalidade do bioma por 5 min (tools/biomes295.js).

## v294 — Bestiário estilo Pokédex, 06/10/2026
- Pedido do Ian: ao VER uma espécie pela primeira vez aparece no canto 'MONSTRO DESCOBERTO · N de 61' (tools/bestiary294.js). Lore escrita para as 61 espécies: descrição (1 abate), alimentação (10), comportamento (50), onde vive (100, tirado dos habitats do jogo). Aviso 'LORE DESBLOQUEADA' a cada trecho. Bestiário mostra '???' para não descobertos.

## v293 — escolha de classe e Bestiário, 06/10/2026
- Escolha de classe mostra recurso (Mana/Fúria/Vigor), atributo principal e a passiva com descrição, mais uma linha explicando os três recursos.
- Bestiário mede um monstro real da espécie no seu rank (antes usava fórmula antiga e errava vida/dano) e mostra perfil de atributos, distribuição dos pontos e defesa física/mágica atual (bestStats293).

## v292 — coroas em todos os conjuntos, rank ★ escondido, 06/10/2026
- Pedido do Ian: todos os 10 conjuntos raros usam coroas temáticas modeladas no código (CROWN291): Metamorfo (garras/chifres), Necromante (ossos/caveira), Tempo (relógio/engrenagem), Tecelão (cristais), Guardião (elos dourados), Artífice (engrenagens rúnicas), Duelista (lâminas), Condutor (raios), Oráculo (olho e raios), Devorador (chifres e orbe do vazio).
- Condutor não tem peitoral próprio: usa o peitoral comum em azul (antes parecia sem peitoral).
- Rank ★ só aparece (loja do Kael) depois de ganhar uma classe secreta (secretRankKnown292).

## v291 — coroas temáticas, 06/10/2026
- Ideia do Ian: elmos que não encaixavam viram coroas modeladas no código (set-visual153.js CROWN291): Necromante = coroa de ossos com caveira; Mago do Tempo = diadema dourado com relógio, engrenagem girando e aro de luz; Tecelão de Fendas = aro com cristais da Fenda flutuando. Assentam no cabelo, medidas pela cabeça.

## v290 — elmos dos conjuntos e loja, 06/10/2026
- Elmos dos conjuntos raros vinham do encaixe do Blender (set169_h) e ficavam atrás da cabeça (Necromante, Tempo, Tecelão) ou grandes demais (Metamorfo, Oráculo). Agora usam o encaixe medido no osso da cabeça e são dimensionados por 1,3× a largura da cabeça (set-visual153.js). Peitoral, braçais e grevas dos conjuntos continuam no encaixe do Blender (estavam bons).
- Loja (decisão do Ian): a arma da classe fica sempre à venda em todos os ranks; as outras mudam por dia (shopKinds290).

## v289 — armadura comum troca a roupa, 06/10/2026
- Só os conjuntos raros escondiam a roupa do Viajante; a armadura comum ficava por cima da roupa larga. Agora peitoral, luvas e botas comuns escondem a roupa da parte, mostram o corpo base justo (base169_* do guardiao-rig.glb) e a peça vai por cima. tools/set-visual153.js (BODY289).

## v288 — cômodos da casa, 06/10/2026
- 'Jardim de mana' (dava vida) virou 'Estufa de ervas' (+8% vida; mesmo cômodo salvo). Novos: Sala de meditação (+8% mana), Arena de combate (+1 fúria por golpe, +10 fúria máxima), Pista de corrida (+10 vigor máximo, vigor 10% mais rápido). tools/lux267.js ROOMS.

## v287 — pousada importa, 06/10/2026
- Regeneração de vida na cidade 8%/s → 1,5%/s (antes enchia em ~12 s, descanso era inútil).
- Dormir (pousada): cura 50% + 10% por nível da pousada (100% no nível 5), Bem descansado para todos os níveis: +10% de XP (+2% por nível) por 10 min, além do +5% de vida por nível.
- Cansaço: 2 dias de jogo (16 min) sem dormir = −10% de dano e −10% de XP até dormir (pousada ou casa). Casa: cura 80%, tira cansaço.

## v286 — passivas por nível, 06/10/2026
- As 12 passivas gerais estavam todas ativas no nível 1 sem explicação. Agora liberam nos níveis 3, 6, 10, 14, 18, 22, 26, 30, 35, 40, 45 e 50 (passives263.js, PASSIVE_LV286); a aba Passivas mostra o efeito e o nível de cada uma (🔒 quando bloqueada) e um aviso aparece ao liberar.

## v285 — portal da torre, 06/10/2026
- O portal de subir andar da Torre usava o anel dourado antigo (do início do jogo). Agora usa a Fenda nova (Rift131, cor de saída), igual às masmorras.

## v284 — missões por rank, 06/10/2026
- XP da missão usa o nível do jogador quando a missão é gerada (q.lvl283; antes usava sempre o nível mínimo do rank e dava XP minúsculo). Base de XP de missão 0,04→0,07 e matar conta 0,3 min por monstro.
- Quantidade por rank: portais 1+rank/3, caçadores 1+rank/2, monstros 20+10×rank.
- Novos tipos: 'Derrote N elites' (rank D+, 3+rank) e 'Derrote N chefes de portal' (rank B+). Missões antigas são recalculadas ao carregar.

## v283 — sem teto, vigor máximo, penetração mágica, 06/10/2026
- REGRA DO IAN: nada tem teto no jogo (personagem e criaturas). Pontos crescem sem limite; porcentagens usam pts/(pts+K+nível), que nunca chega a 100% sozinha. Removidos os tetos dos atributos e o limite somado de 75% da defesa de atributos.
- Vitalidade: vida + vigor máximo (+0,5/ponto, vigorMaxR260). Recuperação de vigor por atributo removida.
- Destreza: penetração vale contra defesa física E mágica.
- Fúria máxima (Resistência), fúria por golpe (Força) e dano crítico (Percepção) sem limite.

## v282 — dois efeitos por atributo, 06/10/2026
- Pedido do Ian: distribuir os efeitos de forma equilibrada. Resistência agora dá também fúria máxima (+0,5/ponto, 100→160; furyMaxR260 em resources260/kit111). Regeneração de mana passou da Inteligência para o Espírito. Cura recebida removida (seria 3º efeito da Vitalidade). Cada atributo tem 2 efeitos.

## v281 — 9 atributos e defesas (Grimório), 06/10/2026
- Aprovado pelo Ian. Referência: cofre Projetos/Solo RPG/Entregas/Grimorio-Atributos-2026-10-06/Grimorio-de-Atributos-e-Bestiario.pdf.
- Atributos: Força (corpo a corpo, fúria por golpe), Destreza (ataque físico à distância no lugar da Força, penetração), Agilidade, Percepção (+dano crítico), Inteligência (+regeneração de mana), Vitalidade (+vigor e cura recebida), Resistência (def. física), Espírito (def. mágica), Vontade (def. universal fraca + resistência a efeitos). Regra do Ian: um efeito, um atributo; física e mágica separadas.
- Fórmula pts/(pts+K+nível) com teto (estável em nível infinito). Defesa total máx. 75%.
- Criaturas: pontos = 0,5 × nível × papel × ameaça, divididos por perfil (8 perfis, 61 espécies) — mobAttr281.
- Criação dá 9 pontos (devolvidos ao morrer). Saves antigos ganham 1 ponto por nível já alcançado (run.attr281).
- balance-rpg.js: classes físicas (guerreiro, assassino, tanque, arqueiro, espada rara) com mana/magia mínimas; ganho foi para vida e ataque físico; Tanque > Guerreiro em vida.

## v280 — volta o bloqueio por estilo, 06/10/2026
- REGRA DO IAN (não remover): para usar arma do outro tipo, troca-se o estilo antes (físico/mágico). Ataque básico mágico só existe com pelo menos uma classe mágica, que decide qual magia sai. A v278 tinha tirado o bloqueio e a v275 fazia classe física lançar 'orb' genérico com cajado — ambos desfeitos.

## v279 — tiro de monstro mira a altura do alvo, 06/10/2026
- Projétil de monstro (team != player) mira a altura do alvo (jogador ou aliado na direção do tiro) no momento do disparo e segue reto: não é teleguiado. Teste em terreno com 2+ m de desnível: acertos 0/15 antes, 13/15 agora; esquivando 3 m para o lado: 0/15.

## v278 — comparação de armas por tipo, 06/10/2026
- Loja e bolsa comparam a arma pelo ataque do tipo dela (wDelta278): cajado mostra quanto o ataque MÁGICO sobe, espada quanto o FÍSICO sobe (antes comparava número com número e dava '+1').
- Tirado o bloqueio 'esta arma exige estilo': qualquer classe equipa qualquer arma (o ataque segue a arma desde a v272).

## v277 — avisos menores, um por vez, 06/10/2026
- popNews194 virou fila: um aviso por vez, fonte 12px, no alto, some em até 3,2 s se houver monstro perto (5,5 s fora de luta). Avisos iguais não repetem. Tudo continua no Histórico.
- Falha de desafio (ex.: 'sem esquivar') não abre mais aviso; fica só no Histórico e na aba de missões.

## v276 — monstros não ficam presos, 06/10/2026
- moveEnt agora detecta quando o monstro/aliado quase não anda (parede, cristal). Na masmorra calcula caminho pelo grid (expPath) até o alvo; no mundo aberto escolhe um desvio livre (50°–170°) e segue por ~0,7 s. Vale para todos os monstros, chefes, fugitivos e aliados.
- Teste: monstros chegando ao jogador numa masmorra: 4/21 antes, 20/21 agora.

## v275 — mira e arma em todas as classes, 06/10/2026
- Regra do Ian: toda mecânica vale para TODAS as classes e armas.
- Flecha e adaga arremessada agora sobem/descem com a mira (antes iam retas).
- Arma mágica (cajado, varinha, tomo) em qualquer classe lança magia com dano mágico (antes guerreiro batia com o cajado e arqueiro atirava flecha). Animação segue a arma.
- Dano do básico = ataque do tipo da arma (pontos) + ataque da arma. Testado em 8 classes x 6 armas.

## v274 — adaga, 06/10/2026
- O GLB comum-adaga vinha com o cabo na ponta errada: a mão segurava a lâmina. Agora é virado 180° ao carregar (warrior-player127.js, norm171) e a mão pega no cabo.
- A adaga arremessada usa o mesmo modelo da mão (Warrior127.daggerModel), lâmina para frente.

## v273 — tipo de dano do ataque básico, 06/10/2026
- Regra do Ian: com arma física (arco, adaga, espada, machado) o ataque básico dá dano FÍSICO (Força + ataque da arma), mesmo em classe mágica. Habilidades continuam com o tipo da própria habilidade (habilidade mágica = dano mágico). Cajado/varinha/tomo e mão vazia seguem a classe.

## v272 — ataque básico segue a arma, 06/10/2026
- Pedido do Ian: qualquer classe com arco atira flechas, com adaga arremessa adagas (pelo cabo, lâmina na frente), com espada/machado bate corpo a corpo — inclusive magos. Cajado/varinha/tomo e mãos vazias seguem a regra da classe. Animação também segue a arma.
- Ian confirmou que o gasto de vigor do arqueiro estava certo (não era bug).

## v271 — lentidão sem arma, 06/10/2026
- Regra corrigida pelo Ian: só fica 60% mais lento quem ataca à distância (arqueiro, magos que atiram projéteis) sem NENHUMA arma. Arma de outro tipo não deixa lento, e o assassino (atira adagas) nunca sofre a lentidão.

## v270 — exploits de portal, 06/10/2026
- Portal em fechamento não aceita mais entrada (antes dava para reentrar e o chefe voltava, com reputação de novo).
- Sair/recarregar o jogo dentro de um portal sela aquele portal por 1 hora real: não dá para sair, tomar poção e voltar.

## v269 — loja de armas e pontos na morte, 06/10/2026

Relatos de jogo de 06/10 (áudios), confirmados no jogo rodando e corrigidos por Claude com autorização de Ian:
- **Loja de armas:** o tipo de arma de cada rank era sorteado toda vez que a loja era desenhada e de novo na compra, então o jogador comprava um item e recebia outro. Agora `shopWeaponKind269(t)` fixa o tipo por cidade e por dia do jogo; a compra entrega o item mostrado. O estoque muda a cada dia do jogo (pedido de Ian).
- **Morte:** os 5 pontos da criação voltam em `run.pts` depois da morte verdadeira (antes eram perdidos e o personagem ficava mais fraco que um recém-criado). O texto da tela de morte avisa.

## Nome definitivo — Hollow Rank, v268, 06/10/2026

Ian escolheu o título **Hollow Rank** ("Ranque Vazio": o Transmigrador chega vazio, no rank F, e preenche o próprio ranque). Aplicado na aba/janela (`<title>`), na tela inicial (`#ttl`, antes vazio e escondido), no manifesto do app instalado e no `apple-mobile-web-app-title` (`tools/build.py`). Saves não mudam: chaves `pds*` do localStorage e prefixo `pds-v` do `sw.js` mantidos. Termos do jogo (Ecos, ERGUER ECO, Fendas) continuam. O endereço continua `/portal-das-sombras/` até Ian renomear o repositório para `hollow-rank` no GitHub (decisão dele: trocar o link). Ícones ainda são os antigos — troca só após Ian aprovar uma prévia.

## Correção de Ian — passivas simultâneas v265, 05/10/2026

As doze passivas gerais funcionam todas juntas desde o início: sem limite de três, espaços por nível, seleção, equipar/retirar ou troca na cidade. Listas antigas optionalPassives263 não restringem os efeitos. Habilidades ativas continuam usando seus próprios espaços e recursos; condições de efeito descritas nas passivas permanecem. Esta correção substitui as regras de seleção da v264 abaixo.

## Recursos e passivas opcionais v264 — 05/10/2026

Custos físicos revistos por técnica (configuração em tools/resource-balance263.json); +10% por melhoria, sem depender de mana máxima ou nível do personagem. Vigor recupera 8/s após 1,5s; Fúria mantém geração por combate e Grito. Doze passivas opcionais de efeito único em Personagem → Passivas, até três espaços nos níveis máximos 10/30/60, troca gratuita na cidade sem recuperar saldos. Seleção opcional persiste no perfil; isso não muda o reset por morte dos talentos comprados e Transmigrador. Descontos de 10% por recurso, arredondados para cima, com piso 1 para técnicas pagas. Combinações somam os custos individuais já descontados e cobram atomicamente. Preserva correções v262 e XP por desafio/missões v263.

## Correções de combate, loot e espaço v262 — 05/10/2026

Direção de Ian: loot aleatório independente da classe; armas físicas somente no estilo físico, mágicas somente no mágico; mudança deve trocar animação/dano. Gerador comum tem oito tipos com 12,5% cada, incluindo espada e grimório. Sets mantêm tipo da classe dona do set. Trocar estilo guarda arma incompatível; bolsa cheia bloqueia sem perder item. Desarmado usa soco físico ou magia pela mão, com intervalo ×1,6; limpa combo/pose antiga. Criação oferece somente as três habilidades iniciais, equipa a escolhida e permite trocar na cidade. Save inicial inválido tem correção com backup.

Mira usa vetor XYZ para alvos altos/baixos e morro bloqueia antes do alvo; não acompanha relevo. Aster tem lotes/telhados separados, ruas/portas livres e modelo próprio de Defesa. Baús ficam em piso livre fora de parede/rocha/cristais. Modelos mantêm hierarquia rígida sobre o terreno. Transmigrador e talentos de pontos zeram na morte verdadeira e podem ser reaprendidos; ressurreição protetora não zera. Sem histórico individual de XP. Migração antiga tem backup e não repete após novos investimentos.

Integração preserva main v261 e seus recursos simultâneos/combinações (história/Diário, mana, catálogo e recursos físicos), regras de banco/casa/rank e fórmulas de XP/ouro. QA de 33 escolhas iniciais, 1.200 armas com sementes iguais entre três classes e 27 checks de estilo/loot/criação passou sem erros de página. Testes adicionais e limites registrados na entrega do cofre `Publicacao-Correcoes-v252-2026-10-05/Correcoes-v259/Registro.md`. Pasta v259 é nome histórico; versão final v262. Aceite visual/playtest de Ian pendentes.

## Recursos simultâneos e combinação v261 — 05/10/2026

Correção explícita de Ian: Guerreiro também ganha mana por Inteligência e pode equipar magia; a combinação equipada deve mostrar os recursos simultaneamente. Mana é permanente no HUD; Fúria, Vigor e energia têm barras separadas conforme técnicas/classe. Botão de 2–3 técnicas soma os custos de cada recurso, valida tudo antes do débito e compartilha as recargas individuais. Detalhes, limites e testes: [docs/multiclasse-combinacoes-v261.md](docs/multiclasse-combinacoes-v261.md). As 40 habilidades da v260 são mantidas.

## Classes e recursos v260 — 05/10/2026

Ian pediu habilidades claras, duas novas por classe e recursos físicos mais convencionais. Foram adicionadas 40 (200 no catálogo); Guerreiro usa Fúria, Assassino/Tanque/Arqueiro usam Vigor, magias usam mana e Condutor mantém energia. O custo sobe por aprimoramento, nunca pela reserva. Antigos bônus ocultos de Fúria foram substituídos pelo custo explícito. Textos compactos visíveis, recursos e novos IDs persistem no save. Base v259 preservada. Detalhes e limites: [docs/classes-habilidades-v260.md](docs/classes-habilidades-v260.md).

## Mana e habilidades v258 — 05/10/2026

Ian corrigiu a regra: o custo cresce ao melhorar a própria habilidade, nunca por ganhar mana ou apenas subir o nível do personagem. Autorizou implementar e publicar na versão mais recente. A base v257 e sua campanha foram preservadas.

Implementado custo-base × (1 + 10% por melhoria), com arredondamento para cima e limite de 10 melhorias. Lista e tooltip mostram custo atual/próximo. Cobrança compartilhada nas rotas atuais e legadas; Égide só após execução confirmada; Eco gratuito restitui a mana paga sem resetar recarga. Regeneração reduzida em combate e bônus após seis segundos sem combate. Saves, classes, recursos especiais, narrativa, XP, ouro e morte/ciclo preservados. Escopo completo e limites em [docs/mana-habilidades-v258.md](docs/mana-habilidades-v258.md).

## Campanha em prosa v257 — 05/10/2026

Pedido atual de Ian: terminar a história. A campanha central possui treze capítulos completos e desfechos de contenção, confronto e Fim do Ciclo. As cenas e a ligação da coalizão que criou as prisões são desenvolvimento da IA; nenhum novo título do jogo foi aprovado. Aldric vivo; cinco capitais prendem cinco partes, Aster é o nexo separado; superiores desconhecidos; Narrador e Clã fora do combate final.

O Diário → História oferece leitura dos capítulos liberados pela progressão. A confissão e o capítulo XII exigem provas XI e descobertas anteriores. O final corresponde a act13 (chefe derrotado) ou containmentV5 (Portal Primordial fechado, confissão conhecida, cinco capitais preservadas/reconstruídas, nenhuma Âncora aberta, peça livre ou corpo em marcha). O registro preventivo concede apenas uma página: não chama a vitória do chefe, não distribui seus prêmios e não força prisões a romper. Reabrir ameaças mantém o registro histórico e exige nova defesa.

Chronologia: pedras e Torre antigas; resgate e morte do Primeiro Guardião abrem as grandes Fendas; depois, uma resistência precursora divide a manifestação física e usa as cinco pedras como prisões. Memórias da voz são confrontadas com registros, inclusive uma rota de outra realidade. A procura pela origem e pelos superiores continua depois da vitória concreta de Aster. As escolhas e os resgates da prosa não são novos sistemas físicos implementados. Cinemáticas rejeitadas continuam retiradas. Combate, classes, resets e recompensas mantidos.

## Atualização narrativa v256 — publicação em 05/10/2026

Direção atual de Ian: publicar as atualizações do jogo ao concluir, mantendo a main como fonte oficial. Esta publicação parte da main v252 e preserva seus ajustes de balanceamento, conjuração, maldições, economia e relevo.

Campanha textual v4 em `historia-campanha.js` e `narrativa-campanha.js`: nome escolhido nas falas/Diário, pistas nos atos iniciais/Torre, confissão no Ato XII após XI, Narrador orienta vários Transmigradores em realidades/tempos diferentes e libertação completa do Arquiteto numa realidade ameaça todas. Abertura de passagens e projeção de influência são distintas dessa liberdade completa; cinco Âncoras e Aster separado mantidos. Narrador não é onisciente; Aldric vivo, superiores desconhecidos e Narrador/Clã fora da batalha final.

Cenas 2D e replays rejeitados: não carregados nem publicados. O campo cinematics nos dados é somente histórico, sem renderização atual. Título definido em 05/10/2026: **Hollow Rank** (ver topo). Texto é integrado aos eventos existentes; resgates/escoltas e decisões físicas novos continuam em desenvolvimento. Saves, regras de morte/ciclo, IDs, requisitos, contagens e recompensas mantidos.

## Histórico anterior

# Contexto do projeto Primeva (antes Hollow Rank / Ecos da Fenda / Portal das Sombras) (para outra conversa/IA continuar)

> **Versão atual e regras para começar: veja [`VERSAO.md`](VERSAO.md).** Sempre parta da `main` do GitHub; cópias locais podem estar atrasadas.

Autor e decisões: **Ian**. Jogo RPG de ação 3D no navegador, com foco em PC e suporte a celular, ambientado nas Fendas e ecos de mundos mortos. Nomes, personagens e termos são originais do projeto — não usar nomes, falas ou termos marcantes de obras existentes. O título definitivo é **Hollow Rank** (escolha de Ian em 05/10/2026; Ecos da Fenda e Portal das Sombras são nomes antigos), com a ação **ERGUER ECO**; os registros históricos abaixo descrevem versões anteriores.
Versão para celular jogável em https://ianfeloniuk-ship-it.github.io/portal-das-sombras/ (GitHub Pages, branch `main`, pasta raiz).

## Arquivos
- `game.html`: **fonte única** do jogo (HTML + JS, Three.js r128 via CDN). Também é o que vai para o Artifact do Claude.
- `index.html`: gerado por `python3 tools/build.py` (acrescenta cabeçalho de app, `window.PDS_SITE=1`, service worker). Nunca editar à mão.
- `sw.js`: cache offline. **Subir a versão (`pds-vN`) a cada lançamento.**
- `models/`: personagens KayKit (`Knight.glb`…, `anims.glb` com 14 animações compartilhadas), armas `w_*.glb`, cenário `env.glb` (146 modelos Kenney/KayKit com cor assada no vértice), montaria `fox.glb`. Licenças em `models/LICENSE-*`.
- Fluxo de publicação: editar `game.html` → `python3 tools/build.py` → subir versão do `sw.js` → commit → push em `main`.

## Versão de PC
- Mesmo `game.html`. No PC: `JOGAR-PC.bat` sobe um servidor local (porta 8770) e abre `index.html` no Edge em modo app (o `game.html` puro mostra acentos quebrados por falta de charset).
- Câmera livre só no PC (`pcCam`): botão direito arrasta para girar, roda aproxima/afasta, botão do meio volta ao padrão; WASD e esquiva seguem a câmera. No celular nada muda.
- Mira pelo mouse no PC (`faceTarget` usa o ponto do chão sob o cursor; no celular segue mirando no inimigo mais próximo).
- Barra de habilidades de PC (`body.pc`): sem joystick e sem botões de ataque/esquiva na tela; Q/R/T/H/G numa barra embaixo com recarga.
- Modo ULTRA automático no PC com gráficos HD (resolução até 2x + tonemap filmico). O botão LEVE continua desligando.
- Save do PC fica no navegador do PC; levar progresso via Exportar/Importar save.

## Atualizações recentes (set/2026, feitas com Claude no PC)
- Armas das classes corrigidas (o carregador renomeia `handslot.r` → `handslotr`); armas embutidas dos modelos ficam escondidas. Necromante: cajado de osso e tom sombrio; Curandeiro: varinha + livro; Invocador: cajado + livro.
- Status liberado no nível 1 (tecla C/Tab no PC, tocar no painel do personagem no celular).
- 10 monstros Quaternius (CC0) em `models/m_*.glb`, carregados em segundo plano (`MON`, `MON_DEF`); entram por rank em `kindsFor`.
- Esquiva perfeita (câmera lenta + contra-ataque +60%), contador de combo, alvo sob o mouse (PC).
- Entrada cinematográfica do chefe (câmera fecha e mostra o nome).
- Reavaliação na Associação (aba Reavaliação): oficializa o rank atual com cerimônia, ouro e 2 pontos. `run.official`.
- Coleção de Sombras permanente (`profile.album`), tecla K ou menu ⚙.
- Livro de Habilidade: elites têm 8% de chance de dar +1 ponto de habilidade.
- NOTÍCIAS: todo aviso (toast/showSys) fica em `profile.news` (últimos 100); tecla N, botão NOTÍCIAS no topo ou clicar no aviso.
- Invasão explicada: aviso longo com o que fazer e as consequências (preço +20% na cidade abandonada, reputação/karma) e contador no HUD.
- Recomendação na bolsa: nota de poder (`itemScore`), ▲/▼ comparando com o equipado, botão EQUIPAR O MELHOR.
- Mecânicas de chefe (`BMECH`, 60% dos chefes): Couraça Frontal (dano só pelas costas), Divisão (2 fragmentos na metade), Olhar Distorcido (inverte controles), Barreira de Mana.
- Direitos autorais: "ARISE" trocado por ERGUER SOMBRA; nomes de sombra parecidos com a obra trocados.
- Atalhos de teste (7 toques no título = Soberano, 5 toques no sorteio = templo, Novo despertar) só funcionam com `DEV` = servidor local + `?dev` no endereço. No site publicado estão desligados.
- Equilíbrio por classe (`CLS_BAL`): Guerreiro vida×1,35 dano×1,25 def+12%; Tanque vida×1,6 def+20%; Assassino dano×1,4; distância vida×0,9. Motivo: corpo a corpo estava mais fraco que o Arqueiro (feedback do irmão do Ian).
- Sombras com função (arqueiro/tanque/atacante pela origem) e ordens ATACAR/DEFENDER/SEGUIR (`run.order`, tecla O ou tocar na linha de missão).
- Bestiário permanente (`profile.bestiary` — NÃO usar `profile.best`, que é o recorde de andar): abates por espécie dão +3/6/10/15% de dano contra ela (10/50/200/1000). Tecla J ou menu ⚙.
- Viagem rápida: cidades visitadas ficam em `profile.visited`; Associação → aba Viagem, custa ouro pela distância, bloqueada com monstros perseguindo.
- PC: segurar botão do mouse ou tecla de ataque continua atacando (`mouseHeld`).
- Atributo principal por classe: mágicas (Mago, Curandeiro, Invocador, Necromante) usam INT para ataque e habilidades, FOR dá +1% vida; físicas usam FOR para os dois, INT só mana. Empurrão de projéteis do jogador reduzido (1,2→0,35). Habilidade de ataque sem inimigo perto não gasta mana nem recarga. (feedback do irmão do Ian)
- ESTILO DE LUTA (decisão do Ian): Força = dano físico, Inteligência = dano mágico, para todos. Tecla X / botão ESTILO: SÓ classes mágicas podem guardar a varinha e lutar no braço (Força, 70%). Classes físicas NUNCA usam magia (decisão do Ian: senão as classes perdem sentido).
- CLASSES MÁGICAS NOVAS (decisão do Ian, substitui a escolha de elemento no nível 20 para quem desperta daqui em diante): Mago de Fogo, Mago de Gelo, Mago da Terra, Mago do Raio, 3,5% cada no sorteio, elemento fixo de nascença, evolução própria (Arquimago Ígneo/Glacial/Telúrico/Tempestuoso). Mago Elemental saiu do sorteio (w:0, `legacy`), mas quem já é continua com a escolha no nível 20.
- Passivas de classe (`PASSIVES`, `applyPassive`, sugestão do Irror): Guerreiro Fúria de Batalha, Assassino Sangramento, Tanque Muralha Viva, Mago Elemental Afinidade Arcana, Arqueiro Olho de Águia, Curandeiro Graça, Invocador Elo Espiritual, Necromante Colheita de Almas, Fogo Queimadura, Gelo Frio Cortante, Terra Abalo, Raio Estática. Aparecem na Janela de Status.
- Provação da Classe (decisão do Ian): após a evolução do nível 30, a cada 100 níveis (100, 200, 300…) arena de 3 ondas + Mestre da Provação; passou = +15% dano e vida acumulado, +3 pontos de habilidade, título Mestre/Grão-Mestre/Lendário/Mítico/Divino/Primordial + nome da evolução. `run.tier`, `tierB()`.
- Reencarnação: cada uma exige +100 níveis (1ª no 100, 2ª no 200…), +10% cada (decisão do Ian).
- Soberano mais forte (decisão do Ian): ergue sombras com QUALQUER classe (`canArise()`), sombras +30%, habilidade exclusiva Domínio Absoluto (tecla Z, recarga 25s, atordoa em volta). Além de poder x7, roubo 95%, título e Criar portal.
- Feedback do Irror (28/09): explicação das habilidades (`skillDesc`, tooltip nos botões no PC e na Janela de Status); loja compara com o equipado em pontos de poder; Aprimorar/Forjar explicados; físico/mágico em negrito colorido; Lampião Mágico (loja de Poções, 120 ouro) acende sozinho em masmorra com Escuridão (3 min); áreas de ataque somem se o monstro que as criou morrer (`hazard.owner`).
- Botão PERSONAGEM no topo (tecla P) abre a ficha (`charSheet`: cada número com sua origem), títulos, constelações, Bestiário e Coleção.
- Visual do equipamento (`gearLook`): arma brilha na cor da raridade e cresce com o rank; armadura dá brilho na roupa.
- Torre: bug corrigido (andar limpava sozinho porque 'vivos' era contado antes dos inimigos nascerem). Portal de subir só depois de matar todos; saída só abre nos andares de chefe (10, 20...) — ideia do Irror.
- Pet agora é um dragãozinho voando (modelo Dracônico em miniatura), cor pelo poder e brilho pela raridade (`makePetModel`).
- Janela de Status mostra os limites da Agilidade (`agiDesc`): ataque +54% no ponto 70, esquiva 0,55s no ponto 51, movimento sem limite.
- Pontos de habilidade (ideias do Irror): poderes absorvidos também sobem de nível (2 pontos por nível); Maestria sem limite (+1% dano e vida por ponto, `run.mastery`); Grimórios no Mercado ensinam poderes de guardiões (caros, preço cresce com o rank, `bookList`).
- Biblioteca de Poderes (`run.lib`, `learnPower`, `powLib`): todo poder absorvido/aprendido fica guardado; só 3 ativos nas teclas 1–3, escolhidos em Bolsa → Poderes. Antes o 4º apagava o mais antigo (feedback do Irror). Poder repetido (guardião ou grimório) sobe 1 nível dele; no máximo vira +2 pontos de habilidade. Duplicatas antigas são limpas.
- Constelações completas (30/30): cada nível passa a dar +2 pontos de status em vez de ponto de constelação; pontos que sobraram podem ser convertidos (1 → 2 de status). `consFull()`.
- Mais desafio (feedback do Irror, sem nerf seco): traços de monstro a partir do portal C (`TRAITS`: Regenerador, Veloz, Blindado, Vampírico; chance 15%+6% por rank, máx 60%); chefes com mecânica 60%+6% por rank; furtividade voltou a x3 contra tudo (o Irror apontou que era nerf só da classe; o equilíbrio veio do buff geral nos portais).
- Bestiário mostra informação dos monstros conforme os abates (10: atributos, 50: comportamento, 200: ponto fraco). Permanente.
- Pendência de design (multiplayer): como escalar monstros para jogadores de níveis diferentes juntos.
- Dificuldade dos portais (Ian e Irror acharam fácil): vida +25% e dano +15% por rank acima do E (SS: vida x70, dano x18). Sombras causam 60% do dano do jogador (era 110%). Rebalancear de novo conforme o feedback.
- Aprimorar aceita cristais do rank do item OU MAIORES (`cryUp`/`spendCry`), gastando primeiro os mais baixos (pedido do Irror).
- Mundo aberto: criaturas selvagens mais fortes conforme o perigo (vida +20% e dano +12% por nível de perigo acima de D).
- Crítico: chance acima de 100% vira dano crítico extra (`critChance`, `critMul`); ficha mostra o multiplicador (x1,7 base, x2,4 com Fúria 10).
- Segredo do Soberano: itens de rank 8 se chamam 'Primeva' e só aparecem na loja para quem é Soberano. Os chefes 'Soberano da ...' continuam (lore do Ian).
- Exigência do Sistema: mensagem explica a regra e o progresso perdido; HUD mostra '[EXIGÊNCIA: sem esquivar x/30]'. Recarga da esquiva ligada à Agilidade (`dodgeCdVal`): 1,4s sem pontos, −1,2% por ponto, mínimo 0,55s (ideia do Irror). Habilidades Q/R/T mantêm a natureza da classe. `run.style`, `basicDmgMul()`.
- Correções (feedback do Irror, 28/09 noite): baú da torre não vira mais Mímico (reabria o andar já limpo); nível 3 da cidade agora acende cristais azuis na muralha e a cidade é reconstruída na hora da doação; recompensa das missões da Associação escala com o nível (×(1+nível/10)). Grimórios ficam no Mercado (Dorian).
- Teclas configuráveis no PC (menu ⚙ → Configurar teclas), salvas em `pds_keys`.

## SISTEMA 2.0 (28/09/2026, feedback do Irror, Ian mandou "fazer tudo e converter")
Motivo: no nível 200 tudo morria com 1 golpe (muitos pontos + bônus % multiplicando entre si). Regras novas:
- **1 ponto de status por nível** (diária +1, exigência/clone +2, sonho +1, reavaliação +1). Constelações completas não dão mais pontos.
- **Números fixos:** Ataque = 10 + 2×nível + 2×Força (físico) ou 2×Inteligência (mágico) + arma. Vida = 100 + 10×nível + 12×Vitalidade + armadura. Mana = 50 + 3×nível + 3×Int. Agilidade: +0,4% vel. de ataque (máx 30%), +0,5% movimento (máx 25%), esquiva 1,50 s −0,01 s/pt (mín 1,00 s). Percepção +0,25% crítico.
- **Todo bônus em % soma numa conta só** (`bonusPool`): rank (5% por rank, Soberano 80%), evolução 10%, Provação 15% cada, reencarnação 10% cada, maestria 0,5%/pt, constelações (Fúria 1%/pt dano, Muralha 1,5%/pt vida), título, comida, conjunto, afixos, Kael. Efetivo = 3×soma ÷ (3+soma), máx +300% (`effB`). `CLS_BAL` continua multiplicando (identidade da classe).
- **Crítico:** base 5%, sempre ×2; chance acima de 100% vira chance de ×3. Fúria 10 = +10% de chance.
- **Equipamento com teto por rank:** arma dá ataque fixo `WATK[rank]`, armadura dá vida `AHPV` e armadura `AARM` (redução = arm ÷ (arm + 20 + 1,5×nível)). Raridade +6% por nível, aprimoramento +8% por nível, maldição ×1,3. Afixos: no máximo 2, valores pequenos. Um item comum de rank acima sempre ≥ primordial do rank abaixo. Venda = 40% do preço.
- **Monstros com a mesma conta:** `GR[i].hp/dmg` = jogador esperado no nível do rank (`expAtk/expHp`, `eHP = expAtk/20`, `eDMG = expHp/110`).
- **Chefes:** 3 barras de vida (5 no andar 100+ da torre); ao quebrar uma barra ficam imunes 1,5 s; nenhum golpe tira mais de 6% da vida. Elites resistem 20%.
- **Marcas (sinergia):** habilidades de ataque marcam por 6 s; golpe normal no marcado = +50% e −1 s na recarga das habilidades.
- **Torre infinita:** andar N = monstros nível N×2,6 (até 100), depois +4 por andar. Cada reencarnação libera +50 andares (`towerCap`). Prêmio de 5 milhões do andar 100 só uma vez (`profile.tower100`).
- **Reencarnação:** +10% no bônus somado, +1 ponto extra a cada 5 níveis por reencarnação, +50 andares, 5 pontos iniciais; zera maestria também.
- **Mercado:** compra cristais em pacote de 10 (3× o preço base de venda), até o seu rank.
- **Ficha do personagem** reescrita: cada número com a conta, lista dos bônus somados e o efetivo.
- **Conversão:** saves antigos (`run.v2` ausente) recebem os pontos de volta (nível−1 + extras de reencarnação) e itens convertidos (`v2Item`).

## SISTEMAS PARALELOS (28/09/2026, 2º feedback do Irror)
Ideia do Irror: cada sistema faz UMA coisa, para não existir estratégia única dominante.
- **Arma só dá ataque; armadura só dá ESCUDO** (`itemSh`, `SHV` = 1,6× AHPV). Escudo absorve o dano antes da vida e recarrega 20%/s depois de 4 s sem apanhar. Barra ESCUDO no HUD. Armadura não dá mais vida nem defesa (defesa = classe + Brann).
- **Constelações com mecânica própria:** Fúria +1% de crítico por ponto (ápice +10%); Muralha +3% de escudo por ponto (ápice revive); Arcano −1,5% de recarga por ponto (ápice −20%). Saíram da soma de dano/vida.
- **Títulos: até 3 equipados** (`profile.titles`, `eqTitles`, `hasT`), cada um com mecânica: Caçador (abate recarrega 5% do escudo), Matador de Reis (quebrar barra de chefe cura 10%), Veterano (poções +25%), Magnata (+10% ouro), Fênix (abaixo de 20% o escudo enche, 1×/min), Escalador (andar da torre cura 25%), General (sombras +20%), Pescador (comida dura 2×), Vingador (+20% em elites), Senhor de Domínios (baús +15% de item), Soberano (+10% dano/vida). Novos: Resistente/Inabalável/Imortal (30 s / 1 min / 10 min de Quebra): escudo recarrega 30% mais rápido / esquiva −0,20 s / regenera 1% de vida por segundo.
- **Quebra de Masmorra:** quando o tempo da masmorra limpa acaba, em vez de expulsar começa uma invasão sem fim (ondas mais fortes com o tempo, até 40 monstros vivos). A saída fica aberta; recorde em `profile.brkBest`. Morrer é morte normal.
- **Pousada com níveis (0–5, por cidade, `profile.innLv`):** custa 20.000×(nível+1)²; descansar dá "Bem descansado" por 10 min: +5% de vida por nível (entra na soma) e, no nível 5, +25% de escudo.
- **Afinidade vai de 0 a 10** (saves antigos dobram); descontos e perks por nível viraram metade (o máximo fica igual). Missão do NPC libera na afinidade 6. **Habilidades mostram NV 0–10** (antes 1–11).

## CIDADE QUE CRESCE E PESCA 2.0 (28/09/2026, pedido do Ian)
- Cidade vai até o **nível 10** (`CITY_U`, `cityNeed`: cristais 20×(nível+1) e, do 6 em diante, ouro 50.000×(nível−3)²). Visual por nível em `envCity`: 4 estandartes e feira, 5 postes de luz, 6 bairro fora da muralha (raio 42), 7 moinhos e serraria, 8 segundo bairro (raio 56) e catedral, 9 monumentos e obelisco aceso, 10 praça dourada. Árvores e decoração abrem espaço conforme o nível (`cityD` desconta o crescimento). Renda diária da cidade do nível 6 em diante (`cityIncome`, aba Cidade). Nível 10 dá o título Fundador (lojas −10% em todas as cidades).
- **Pesca 2.0:** 10 espécies (`FISH`) conforme hora (noite), clima (chuva) e bioma (neve, pântano, deserto), peso em kg com recorde por espécie (`profile.aqua`), espécie nova = +1 ponto de status. Peixes difíceis têm faixa menor e a faixa se mexe. Varas (`ROD`, `run.rod`) aumentam faixa e tentativas. Aquário, vara e venda de peixes ficam na Cozinha (Mercado).

## MUNDO VIVO (28/09/2026, Ian: "tudo legal pode fazer")
- **Casa própria** (`houseView`, `profile.house`): perto do portão leste de qualquer cidade (X+46, Z+12), 150.000 de ouro (mudar de cidade: 20.000). Móveis `FURN` aparecem do lado de fora: Cama (dormir grátis, Bem descansado nível 3), Baú (20 itens, sobrevive à morte), Estante de Troféus (`profile.trophies`, +0,5% contra chefes por guardião diferente, máx. 25%), Aquário (+1 tentativa na pesca), Altar de Mana (3 poções por dia).
- **Moradores** (`spawnCitizen`, kind 'citizen'): andam pela cidade de dia (4 + nível da cidade, até 10) e voltam para casa à noite. **Festivais** por data real (`festival()`): fim de semana (lojas −15%, estandartes na praça), Noite das Sombras 25/10–02/11 (XP +50% à noite), Festival de Inverno 20/12–06/01 (lojas −20%, XP +25%).
- **Ataque à cidade** (`startSiege`/`updSiege`): a cada ~25 min no mundo, perto de cidade nível 5+, um Dragão Sitiante (5 barras) ataca; 5 min para vencer. Vitória: ouro, troféu e a renda da cidade pode ser coletada de novo.
- **Profissões** (`profLv`, `profile.prof`): Mineração (chance de +1 cristal), Forja (raridades melhores), Pesca (faixa maior). XP para o nível N = 20×N². Aparecem na ficha do personagem.
- **Histórias da Associação** (aba Histórias, `STORIES`, `storyEv`): 4 histórias em capítulos (Dorian, Mira, Lyra, Selene) com ouro, pontos de status e títulos únicos: Amigo dos Mineiros (+1 cristal por golpe), Guardião do Lago (poção enche 30% do escudo), Eleito da Torre (+20% de dano na torre), Protetor da Cidade (renda +50%).
- **Estações** (`seasonI`: 5 dias de jogo cada, 40 min reais): Primavera (mais chuva, chão verde), Verão (tempo aberto), Outono (árvores douradas), Inverno (chão branco, árvores com neve, nevascas). O tempo do jogo é salvo em `profile.dayT`. Os pedaços do mundo são refeitos quando a estação muda.
- Site: versão no canto inferior esquerdo e aviso "NOVA VERSÃO" quando o jogo atualiza (`tools/build.py`).

## RODADA 28/09 NOITE (pedidos do Ian + áudios do Irror)
- **Torre infinita** sem exigir reencarnação (`towerCap` = infinito); "Continuar" sempre do recorde (antes sumia no andar 100 e só sobrava o andar 1).
- **Sem sorteio (decisão do Ian):** novo despertar = escolher a classe numa grade (`pickAwaken`); todo mundo começa no rank E. Saves existentes mantêm classe e rank.
- **Livraria** na praça (`libView`, `PBOOK`, `run.pbook`): passivas para todas as classes, 1 ponto de habilidade + ouro 2.000×(nível+1)², máx. 10: XP +3%, roubo de vida +0,5%, escudo +4%, dano recebido −1,5%, evasão +1,5%, alcance corpo a corpo +4% (por nível). Tomos de guardião saíram do Mercado e só aparecem para guardiões já derrotados.
- **Compensação:** a conversão do Sistema 2.0 apagou os pontos vindos de missões; saves convertidos recebem +1 ponto por nível (`run.v2fix`).

## ITENS 1–9 DOS ÁUDIOS DO IRROR (28/09 noite, Ian: "vai até o 9")
1. Atributos crescem com o nível: fator `statK` = 1 + nível/50. Força/Int +2×fator de ataque, Vitalidade +15×fator de vida, Int +4×fator de mana. Ranks de equipamento mais separados (`WATK`/`AHPV` novos). Crítico com limite de 200%.
2. Furtividade contra chefe: golpe furtivo pode tirar até 20% (normal 6%).
3. Tela: SOM/HD dentro do ⚙; ESTILO só aparece para magos; botões novos MUNDO e POÇÃO; "Mundo" saiu da bolsa; notícias só com o que importa; linha de objetivos em português claro.
4. Nível nos monstros (`eLvl`) com caveira de ameaça (`threat`: amarela 2×, laranja 5×, vermelha 10× o seu nível); chefe mostra NV na barra; Bestiário mostra vida e dano no seu rank.
5. Chefes giram mais rápido, soltam rajadas de projéteis em círculo (mais em ranks altos); magos/espectros/vespas/yetis deixam lento; ladinos/aranhas/lobos/raptores fazem sangrar; áreas inimigas no máximo 8 m.
6. Chefe de masmorra dá +1 ponto de habilidade e ouro extra.
7. "Poder" explicado na bolsa.
8. Cidade que cresce empurra os monstros para fora (raio conforme o nível da cidade).
9. `docs/BALANCO.md`: tabela gerada das fórmulas (rank, torre, equipamento, atributos, chefes, ameaça).

- **Atributos sem limite (decisão do Ian, nível é infinito):** crítico sem teto (cada 100% garante +1 multiplicador, o resto é chance de mais um: 250% = ×3 sempre e 50% de ×4); Agilidade sem teto (+0,4% vel. de ataque, +0,5% movimento por ponto; esquiva 1,50 s ÷ (1 + 1% por ponto)).

## PROGRESSÃO CONTÍNUA, TRABALHOS, PROVA DE RANK E HISTÓRIA (28/09 noite, decisões do Ian)
- **Morte não apaga mais o personagem (decisão do Ian):** perde 20% do ouro (10% com Selene) e metade da XP do nível; acorda na cidade mais próxima. Itens, trabalhos, rank e sombras ficam.
- **Rank por prova** (`profile.rk2`, `rankOf` = `profile.rank`): aba "Prova de Rank" na Associação; requisito = nível do rank (`GR[r].lvl`); arena de 3 ondas + Examinador (reusa a arena do Julgamento, `L.rankTrial`). Cada rank: +10% no bônus somado (antes 5%), +1 vaga de trabalho, novo ato da história. Saves antigos: o rank calculado pelo nível virou oficial uma vez. Soberano continua secreto (templo). Aba Reavaliação saiu.
- **Trabalhos** (`profile.jobs`, `run.jobData`, `switchJob`): trocar de classe dentro da cidade; cada trabalho tem atributos próprios e recebe todos os pontos de nível; vagas = 1 + rank. Ao trocar, a habilidade da evolução (nível 30) do trabalho anterior vai para a Biblioteca de Poderes.
- **História principal** (`MAIN_ACTS`, `storyAct`): 7 atos, um por rank (Aldric, a Torre Antiga, o Arquiteto que cria os guardiões). Aparece ao passar na prova e fica na aba Prova de Rank.
- **Arte:** decisão do Ian = pacotes grátis CC0 (Quaternius/KayKit) num estilo só. Passo 1 feito: todo modelo GLB (personagens, monstros, armas, montaria) usa material toon com a mesma rampa de luz do chão (`toToon`, `gmap`) e uma paleta comum puxada para o azul do Sistema (`PAL`; monstros 16%, personagens 6%).
- **Multiplayer:** fica para depois; precisa da Project URL + anon key do Supabase.

## MUNDO MAIOR E MASMORRAS NO SEU NÍVEL (28/09 noite, pedidos do Ian)
- Masmorras comuns acompanham o jogador (`dunScale`/`dunLvl`): se o seu nível passa o do rank, os monstros sobem até o seu nível (XP e ouro sobem pela raiz do ganho de vida). Torre e especiais não mudam.
- Nomes de cidade gerados (`cityNameGen`: 50 inícios × 40 finais × sufixos), centenas de nomes diferentes. Aster continua no centro.
- 8 biomas, menores (aparecem mais): Terras selvagens, Tundra gelada, Deserto, Pântano + novos Terras Vulcânicas (rochas vermelhas, árvores mortas, monstros Ígneos +35% dano), Geleira de Cristal (cristais azuis, monstros Cristalinos +45% vida), Floresta Sombria (mata densa escura), Campos Floridos. Chão tingido pelo bioma (`BIO_G`).

## MONSTROS NOVOS (28/09 noite, Ian: "baixa tudo")
- Pacote **Ultimate Monsters (Quaternius, CC0)** inteiro baixado do Poly Pizza (45 modelos, ~11 MB); Orc, Demônio Azul e Yeti já existiam. Créditos e links em `models/LICENSE-Quaternius-Monstros.md`.
- **39 espécies novas** (`KINDS` com `rk` = rank mínimo e `bio` = bioma preferido), de Slime Rosa (E) até Dragão Ancião (SSS): fantasmas e ninjas na Floresta Sombria, cactoros no Deserto, Golem de Pedra e Visitantes na Geleira de Cristal, Dino/Diabrete/Demônio Chifrudo/Dragões no Vulcânico, gosmas/sapos/homens-peixe no Pântano, abelhas/coelhos/alpacas nos Campos Floridos. `kindsFor(gr,bio)`: no mundo o bioma pesa ×2,4; nas masmorras entram todas as do rank.
- **Bichinhos nas cidades** (`spawnCritter`): gato, galinha e pombo andando de dia (F = fazer carinho).

- **Atributos em números inteiros (Irror):** valor de 1 ponto sobe a cada 25 níveis (`pStep`): Força/Int +2 +1 a cada 25 níveis de ataque (`atkPer`), Vitalidade 15 +8 (`hpPer`), mana 4 +2 (`mpPer`). Substitui o fator 1 + nível/50. Janela de Status mostra só o total (ex.: 'Ataque físico +12') e a explicação fica em dica (`tipRow`: passar o mouse ou tocar no nome); habilidades também.

- **Tela (Irror, 28/09):** botões no topo direito, mapa no canto inferior direito no PC (em cima no celular), linha de objetivos abaixo do painel com ✕ (volta pelo ⚙ → Tela), atalhos do teclado só no ⚙. BOLSA só com itens; PERSONAGEM tem as abas Personagem/Poderes. Todas as explicações (status, maestria, habilidades, ficha) em dica ao tocar/passar o mouse, formatadas em lista (`tipRow`, `tipFmt`).
- **Necromante/invocações:** limite de sombras pela mana (`shadowCap` = 2 + mana máx ÷ 50, mínimo 3); invocações também (`summonCap` = 2 + mana ÷ 60); usar a habilidade de novo renova as que estão vivas (vida cheia e tempo zerado) e troca as mais antigas se passar do limite.

- **Polimento (Irror, 28/09 21:50):** prédios das lojas com colisão nos cantos (não dá para entrar na Associação); Selene e Dorian atrás das barracas (antes a estaca atravessava); loja e bolsa mostram diferença em ataque/escudo em vez de 'poder'; a arma só aparece na mão quando há arma equipada; a linha de objetivos não mostra mais 'Ataque básico: mágico (X)'.

- **Visual do equipamento (Irror):** sem armadura = sem capa/elmo; com armadura = capa; rank B+ = elmo/chapéu; roupa e metal tingidos pela cor do rank (`TIER_COL`); arma rank A+ troca para a versão grande embutida no modelo (`BIGW`).
- **Estradas entre cidades (Irror):** cada cidade liga à vizinha do leste e do sul por estrada em L (`roadSegs`/`onRoad`), no chão (cinza, sem tinta de bioma) e no mapa.
- Profissões no topo da ficha (PERSONAGEM). ⚙ sem Coleção/Bestiário (ficam em PERSONAGEM) e sem seção de gráficos duplicada.

## Decisões do Ian (não mudar sem perguntar)
- Rank **Soberano** é secreto: não sai no sorteio do despertar; só é obtido no templo escondido dentro de uma masmorra comum (teste dos mandamentos, como no anime). Ranks públicos até SSS.
- 5 guildas pré-existentes com história. Fundar guilda: **50 bilhões de ouro e nível 50**. Andar 100 da torre paga **5 milhões**.
- Visual realista com modelos 3D (nada de formas geométricas); tema azul/sistema.
- Itens: raridades Comum, Raro, Épico, Lendário, Mítico, Divino, Primordial; 0–5 afixos sorteados; aprimoramento sem limite (após +10 pode falhar, nunca quebra).
- Mago escolhe elemento no nível 20: Fogo, Água/Gelo, Terra, Ar/Raio (troca custa 20.000). Afixo do mesmo elemento vale o triplo.
- Pets: Ovo de Companheiro (8.000) com raridade até Primordial e poder (Disparo, Gelo, Raio, Cura); treinar sem limite.

## Sistemas já existentes (resumo)
Mundo infinito em pedaços (chunks) com várias cidades, portais por rank (E→SSS, vermelhos, invertidos), masmorras procedurais que somem ao limpar, recursos (núcleos/cristais), lojas, banco, forja, montaria (raposa 3D), exército de sombras, guildas, diária com penalidade, pontos de status, dia/noite, clima, biomas (Tundra, Deserto, Pântano) com monstros próprios, torre de 100 andares, chefe semanal, fim do mundo sazonal com cidades caindo e reconstrução, nêmesis, NPCs, domínios, fusão, títulos com auréola, pesca/culinária, mímico, maldições, sonho/passado/clone, tutorial, exportar/importar save, botão HD/LEVE e menu ⚙ (volume, tamanho dos botões).
Save no `localStorage`: `pds2_profile` (perfil permanente) e `pds3_run` (vida atual).

## Pendências
- Multiplayer e save na nuvem: plano é Supabase (Ian manda só Project URL + anon key; nunca service_role).
- Balanceamento depende do Ian jogar e dizer onde ficou fácil/difícil.
- O repositório é público: o segredo do Soberano está visível no código.

## Identidade própria (29/09/2026) — decisão do Ian
Para evitar cópia de Solo Leveling, os termos visíveis foram trocados: Portal das Sombras → **Ecos da Fenda**; Sistema → **Oráculo**; Soberano → **Arconte**; Associação de Caçadores → **Ordem da Fenda**; sombras → **ecos**; "Levante-se" → **Desperte**; quebra de masmorra → **transbordo da fenda**. Não reintroduzir os nomes antigos. Personagens e monstros novos devem ser originais (não usar protagonista de casaco preto e olhos azuis com adagas).
Próximos passos sugeridos: trocar a paleta azul-sistema por uma própria, e a história da origem das fendas.

## Ranks e paleta (29/09/2026)
Ranks públicos: **F, E, D, C, B, A, \*\*, \*\*\***; rank secreto: **@** (antigo Arconte/Soberano). Paleta própria: âmbar (#ffb347 / #ffd08a) sobre violeta escuro (#0e0710), no lugar do azul-sistema. Lore: há cem anos o céu rachou; das Fendas saem ecos de mundos mortos; o Oráculo escolhe quem os enfrenta.

## Continuação no Codex — 29/09/2026, v68

Base: revisão pública `7e90abc` (v67), mais recente que a cópia antiga de PC. Feedback enviado por Ian: explicar Pacto Sombrio e limite das invocações, preservar esqueletos nas transições, mostrar a recarga com Arcano e evitar o nome repetido na mira.

- Pacto: descrição dos efeitos, sem custo quando não há ecos/invocações; em `Sem cura`, fortalece sem recuperar vida. Invocações respeitam o teto de mana, renovam duração/vida ao conjurar novamente (vida bloqueada em `Sem cura`) e substituem apenas as mais antigas necessárias. Contratados, convidados e caravanas não entram nesse limite.
- Invocações temporárias acompanham entrada/saída/subida de andar com vida, tempo restante e buffs preservados. Continuam temporárias: não são restauradas ao reabrir o jogo. Contador de ecos e invocações no painel, também em orientação retrato; nessa orientação, botões do topo ficam em duas filas, sem cobrir o personagem.
- `skillCooldown` compartilha a conta entre execução, janela, tooltip e barra, incluindo Arcano e seu ápice. O overlay de alvo não repete o nome de elites/rivais que já está na barra.
- Domínio Absoluto ganhou botão de toque, recarga e tecla configurável, visível apenas depois do rank secreto. Seleção inicial mostra F, e o modo local `?dev` foi corrigido.
- Decisão atual de Ian: **manter o Necromante na escolha inicial e decidir a proposta de classe especial depois**. Nenhum ajuste de dano geral nesta rodada.
- **Foco da entrega: PC.** A prévia principal deve mostrar a interface com mouse/teclado em tela larga; a captura em retrato serviu apenas à revisão complementar de toque.

Validação: scripts inline dos dois HTMLs analisados; regressão nas funções reais de mana/recarga, invocações, transições e descrições aprovada; revisão no navegador da interface de PC em 1280×720, dos controles de toque em 390×844 e da janela mostrando 11,1s com Arcano 5. Não foi feita uma sessão extensa de balanceamento. Ian autorizou publicar a v68 e continuar o projeto em 29/09, após confirmar que a tela em retrato era a prévia de celular. O foco da versão continua sendo PC.

Publicação v68: revisão `a7f67be` enviada ao branch principal, implantação do GitHub Pages concluída com sucesso e marcador v68 confirmado no site em 29/09/2026.

## Continuação no Codex — 29/09/2026, v69

Ian autorizou continuar acrescentando funcionalidades e terminar partes esquecidas. Esta rodada reúne sistemas existentes para facilitar a experiência de PC:

- **Diário de Jornada (L):** objetivos da próxima Prova de Rank, missões da Ordem, histórias paralelas ativas e treino diário. É possível acompanhar um objetivo no painel; a escolha fica no save e segue o próximo capítulo da mesma história. Atos principais e páginas descobertas podem ser relidos nas abas História e Descobertas.
- **Torre e história:** rank público máximo (`***`) mais andar 100 desbloqueiam uma conclusão original do Ato VII, registrada uma única vez no Diário. Saves que já cumpriram as condições recebem a página ao continuar. A torre infinita e recompensas existentes foram preservadas; o fim de cada andar salva o progresso imediatamente.
- **Controles de PC:** ajuda completa usa as teclas configuradas. Ao escolher uma tecla ocupada por outra ação configurável, as duas trocam de lugar; movimento e atalhos fixos ficam reservados. Barra de habilidades, interação e poção mostram a tecla atual. Nível da habilidade aparece na dica da barra.
- **Coerência:** indicador do próximo rank mostra o nível exigido pela prova. Diário usa a origem das Fendas há cem anos, ranks `**`/`***` e transbordo. A câmara secreta agora se chama Santuário da Ressonância e usa protocolos do Vigia, com a mesma mecânica. Exibição do rank secreto padronizada em `@`.
- **Layout:** botões de PC podem quebrar linha; objetivo, barra de chefe e avisos são posicionados abaixo deles. Em retrato, o botão Diário cabe nas duas filas do topo. README passa a orientar o jogo no PC.

Multiplayer/save na nuvem e balanceamento por sessões extensas continuam pendentes. A proposta de Necromante como classe especial continua para decisão futura de Ian.

Validação v69: análise dos scripts inline, regressão das correções v68 e testes nas funções reais de objetivos, capítulos, conclusão da torre, migração e remapeamento aprovados. No navegador: Diário, acompanhamento após recarregar, ajuda completa, troca Q/R e restauração dos controles verificados em PC 1280×720; topo/painel verificados em retrato 390×844. Nenhuma sessão extensa de combate/balanceamento foi feita nesta rodada.


## Correção de movimento — 29/09/2026, v70

Ian identificou movimento travado/deslizante no Escaravelho e aprovou usar um cavaleiro articulado gratuito. Os GLBs de Escaravelho e Monarca traziam duas figuras fundidas na mesma malha e nenhuma animação; balançar o conjunto não articulava as pernas. Foram substituídos em execução por variantes do Knight KayKit CC0 já presente, com animações existentes. Os GLBs antigos permanecem como referência, sem carregamento em execução.

- Escaravelho: dourado, chifre e carapaça presos às articulações; espada e escudo acompanham as mãos.
- Monarca: armadura escura, coroa, capa e gema. Caminhada, repouso, ataque e queda usam o esqueleto animado; instâncias possuem mixers independentes.
- Ritmo da corrida acompanha deslocamento efetivo; movimento bloqueado retorna ao repouso. Valores de combate e câmera não foram alterados.
- Validação: cenários reais de animação em navegador para ambas as variantes (pernas, independência, velocidade, bloqueio, ataque, retorno ao repouso e queda), análise dos scripts e regressões v68/v69. Integração no cenário local de PC verificada. Nenhuma ferramenta ou serviço pago, instalação ou modelo externo novo foi usado.

### Propostas de Ian para a próxima etapa — ainda não implementadas

1. Câmera mais próxima por trás do personagem, quase em primeira pessoa, com roda do mouse para afastar e ampliar o campo de visão. Manter leitura dos perigos no chão. Ian pediu concluir os modelos primeiro; ângulo, colisão e controles precisam de protótipo.
2. Segundo Despertar muito raro: 10 classes iniciais e escolha entre 10 classes especiais, incluindo Necromante e Mago do Tempo. Ideia do Mago do Tempo: reduzir nível/força do oponente e ultimate que devolve dano/reflete projéteis. Sugestão discutida: redução temporária limitada de atributos e resistência de chefes, sem números aprovados. Falta decidir se a especialização complementa ou substitui a classe inicial, condições de desbloqueio e as outras oito classes. A seleção atual do Necromante permanece até implementar a decisão futura.

### Revisão solicitada por Ian — 29/09/2026, após v70

Decisões posteriores: aprender classes comuns e combinar habilidades; mais espaços de habilidades; somar todas as passivas aprendidas. Especialização rara será adicional, com uma única escolha por personagem. Proposta de títulos sem o limite atual de três; distinguir equipar todos de criar conteúdo ilimitado.

Implementação local em andamento em game.html/index.html: seis espaços de classe, passivas acumuladas e painel, títulos sem teto de equipados, magias diferenciadas e separação inicial da especialização. Ainda sem publicação ou validação completa no navegador; verificar migração, recargas, remapeamento e desbloqueio raro antes de fechar entrega. sw.js permanece v70.

Ian pediu comparar os prints e áudios antigos com o jogo e continuar por partes. Revisão identificou: compensação de pontos antigos estimada; arma viva descrita como +3% mas calculada como +2%; espólios sem uso na forja; tomo de alcance restrito ao corpo a corpo; missão do Segundo Despertar ausente; raios de cidade divergentes; torre sem temas por blocos. Persistência de poderes não pertencentes à lista de chefes e rank das recompensas genéricas da torre precisam de teste dirigido. Câmera próxima e multiplayer continuam pendentes. Relatório entregue em outputs/Revisao-Ecos-da-Fenda-v70.md no workspace do chat. Nenhuma publicação nesta revisão.


## Parte 1 — personalização, v71

Ian pediu entregas por partes e ajuda para desenvolver a história quando chegarmos nessa etapa. Esta entrega fecha seis habilidades de classes aprendidas (Q/R/T/Y/U/5), evolução separada (G), passivas acumuladas e painel, e títulos conquistados sem limite de equipados. Magias de fogo/gelo/terra/raio ganharam diferenças iniciais de projétil e comportamento. Todas as classes comuns podem ser aprendidas na Ordem; Necromante existente é preservado. Novos desbloqueios raros aguardam a jornada do Segundo Despertar, sem escolha provisória irreversível por rank. Acesso antigo a erguer ecos no rank @ foi preservado.

Correção pedida durante a etapa: personagem de origem física que aprende magia pode alternar o ataque básico com X; habilidades equipadas independem do estilo. Ian pediu esconder o botão de estilo e explicar no tutorial. Implementado aviso contextual único, tutorial e ajuda de PC. Estilo fica salvo; projétil arcano usa uma classe mágica aprendida, priorizando a combinação equipada.

Proteção do progresso: combinação e recargas salvas, recarga preservada ao retirar/recolocar e trocar classe, restauração de poderes de evolução da biblioteca, cópia local única do save anterior em pds3_backup_v70 antes da primeira migração. Trocar repetidamente de classe não melhora de graça a mesma evolução já aprendida. Descrição de arma viva corrigida para +2% por nível, sem alterar o cálculo.

Validação: 14 cenários nas funções reais (incluindo save antigo, poderes de evolução, passivas, títulos, recarga e ataque arcano de personagem físico), regressões v68/v69 e análise dos scripts. No navegador PC: combinação equipada/reaberta, painel de passivas e alternância X verificados. Não é uma sessão extensa de balanceamento. Próxima parte: combate/recompensas; aguardar Ian antes de iniciar. História e câmera permanecem posteriores.


## Vila e preparação defensiva — v72

Ian pediu reunir armas/armaduras no mesmo personagem, remover nomes flutuantes dos serviços e ampliar as funções/evoluções da vila. Escolheu começar por defesa contra as Fendas. Kael passa a vender e aprimorar ambos os equipamentos em abas; Brann assume a defesa. Afinidade antiga com Brann preserva desconto de armaduras; aplica-se a maior entre ela e Kael. Placas flutuantes de cidade, lojas, casa, biblioteca e pousada removidas; vendedores sem rótulos permanentes, com nome/serviço no aviso de interação próximo. Placas de portais/saídas permanecem.

Selene mantém banco e ganha acesso às defesas e ao desenvolvimento da vila. Defesa permanente por cidade, disponível no nível 2: guarnição (3 níveis, +1 guarda por nível) e vigia (3 níveis, +8m de alcance das torres por nível; torres requerem cidade nível 5). Custos por nível n: 1500*n² ouro e 8*n núcleos, menores ranks primeiro. Guardas participam de transbordos e cercos; melhorias bloqueadas durante cerco ativo. Não foi criada nova história canônica: esta etapa prepara funções para desenvolver a narrativa com Ian depois.

Validação: 6 cenários específicos de custos, limites, saves, cidades independentes e integração da defesa; regressões v71/v69. Navegador: loja única com abas, compra da guarnição e permanência após recarregar, cerco com quatro guardas após uma melhoria, vila sem placas. Balanceamento prolongado continua pendente. Próxima etapa ainda depende de Ian.


## Ataque básico por classe aprendida — v73

Ian pediu escolher o ataque básico em Personagem (ex.: aprendeu fogo e gelo, quer alternar qual usa no autoataque) e efeitos próprios por classe; confirmou que deseja abranger os outros tipos. Implementado Personagem → Ataque básico → Escolher estilo, com todas as classes aprendidas e descrição de cada efeito. Guarda escolhas física/mágica separadas no save; X alterna entre elas. Não muda a combinação de seis habilidades nem remove passivas.

Efeitos do ataque básico: Guerreiro atordoa comuns no 3º golpe; Assassino sangra 30% do dano em 3s; Tanque recupera 2% do escudo máximo no 3º golpe; Arqueiro tem flechada perfurante no 3º ataque; Curandeiro cura 0,5% da vida máxima por acerto; Invocador recupera 1 mana; Necromante drena 3% do dano como vida; fogo queima 25% em 3s; gelo aplica lentidão 2s; terra atordoa comuns no 3º disparo; raio salta a mais um alvo com 25% do dano no 3º disparo. Sem cura bloqueia cura/dreno. Golpes bloqueados não aplicam efeitos inatos; imunidade continua respeitada. Projéteis guardam a classe de origem mesmo se o estilo mudar durante o voo. Sangramento e queimadura básicos têm temporizadores separados e renovam sem empilhar cópias ilimitadas.

Validação: 7 cenários específicos de escolha/persistência, alternância, DoT, suporte, chefes e raio; regressões v71/v72/v69. No navegador, acesso pelo Personagem, lista dos 11 tipos aprendidos no personagem de teste e troca gelo→fogo. Valores iniciais sujeitos a sessões de balanceamento; não foi feita campanha longa. Nenhuma etapa de história nova iniciada.


## Invocações e equilíbrio dos ataques — v74

Ian considerou atordoamento forte demais e cura/dreno parecidos. Escolheu para Necromante fortalecer os ecos que atacam o alvo marcado: +20% por 4s, sem cura do jogador. Invocador deixa de recuperar mana por acerto: marca prioridade de alvo por 4s para invocações, e aprender a classe aumenta a capacidade para 2 + piso(mana máxima / 30), em vez de /60. Mana por conjuração e recarga permanecem.

Invocações de habilidades permanecem até morrer, acompanham transições e são salvas com vida/dano/buff preservados para reabrir. Reinvocar preenche apenas vagas livres: não apaga, substitui nem cura as existentes. Capacidade cheia não gasta mana nem inicia recarga. Redução posterior da mana máxima não remove criaturas existentes; bloqueia novas até haver vaga.

Eco despertado morto permanece no exército: nível 0, XP 0, guardado, podendo ser chamado novamente. Não ganha XP enquanto morto; nível zero requer 80 XP para subir. Libertar e consumir um eco manualmente continuam ações próprias, distintas de morrer. Atordoamentos por acertos/passivas/básicos limitados a 0,3s, com resistência de 3s por alvo; chefes não recebem esse controle. Domínio Absoluto mantém seu efeito específico de habilidade suprema.

Validação: 8 cenários específicos de capacidade, limite sem custo, morte/XP do eco, persistência, resistência e marca; regressões v73/v71/v69. No navegador: lobo invocado, eco morto mantido em nível zero e chamado novamente. Balanceamento extenso continua pendente. Não iniciada outra etapa de história.


## v75 — aparência do Lobo Espiritual
- Corrigido o uso acidental do humano genérico: invocações wolf usam o lobo quadrúpede animado já incluído no projeto, com tonalidade espiritual.
- Modelo carregado antes de restaurar invocações salvas; alternativa geométrica quadrúpede se o arquivo falhar. Sem novos serviços ou compras.
- Verificação: regressões v74 e v69 aprovadas; prévia no navegador sem erros.


## Espólios, passivas de equipamento e correções — v76
Ian autorizou seguir a lista por partes, começando pela forja. Durante a etapa pediu passivas nos equipamentos e enviou falhas de remapeamento de várias teclas e habilidades de área exigindo inimigo próximo.
- Kael → Trabalhar espólios (nível 12): 10 partes da mesma espécie ou 3 relíquias + 5 cristais do rank atual ou maior + ouro fabricam item no rank atual, mínimo Raro/Épico respectivamente. Novo item vai à bolsa, sem autoequipar; bolsa cheia bloqueia sem custo. Estoques antigos funcionam.
- Aprimoramento com partes: 5 + nível atual de aprimoramento unidades, desconto de 25% no ouro/cristais (arredonda custo para cima). Relíquias: 3 + piso(aprimoramento/5), custo normal, sucesso garantido. Corrigido botão antigo que travava em +10; falhas a partir da tentativa +11 preservam item e consomem materiais. Função comum para os dois caminhos.
- Uma passiva gravada por peça, separada dos afixos, substituível com custo explícito. 12 partes comuns ou 3 relíquias, 3 cristais e 20% do preço do rank em ouro. Presa/Garra/Chifre → Ferida da Caçada (básico sangra 10%/3s, renova sem acúmulo); Couro/Escama/Osso → Couraça Natural (+8% escudo); Essência/Olho/Fragmento → Condutor Arcano (+5% dano de habilidades); Pena → Passos Leves (+3% movimento); demais partes → Reserva Etérea (+5% mana); relíquias → Vínculo do Guardião (+8% dano de ecos/invocações). Duas peças somam; bolsa não concede efeitos. Painel de passivas e descrição do item mostram gravação. Bônus sujeitos a balanceamento durante jogo.
- Teclas: antigos atalhos fixos P/J/N/O/X/V/1–4 agora configuráveis; E/B/Tab/Enter/Shift direito liberados como alternativas atribuíveis. Só movimento e Esc reservados. Conflitos entre ações trocam teclas; ajuda/barra de poderes e estilo usam a configuração. Testado E acionando invocação e persistindo após reabrir.
- Habilidades: removida trava genérica de inimigo próximo para cone/nova/projétil/chuva/praga/terra/tempestade. Corrente ainda exige um alvo inicial em 12m. Chuva usa chão da mira até 14m, com impactos distribuídos; praga fixa no chão até 11m, cinco pulsos em cerca de 5s, atingindo quem chega depois. Tempestade gera áreas mesmo sem alvos. Tooltip atualizado. Testadas chuva e flecha em cidade sem inimigos.
- Validação: 14 cenários específicos em tools/verify-v76.cjs (inclui sintaxe dos dois HTMLs), regressões v71/v72/v73/v74/v69; navegador PC: fabricação, aprimoramento, gravação e reabertura do save, teclas e disparos sem alvo. Nenhuma campanha extensa de equilíbrio. Próximo item continua Segundo Despertar; história a desenvolver com Ian, sem começar automaticamente.

- Feedback adicional de interface: descrições de habilidades agora em linhas Efeito/Dano atual/Marca/Custo/Recarga atual, com dano calculado pela mesma função da execução; removidos “poder x”, repetição físico/Força e explicação de Arcano em cada habilidade. Melhorias de suporte explicam que só reduzem recarga (não prometem +15% em efeitos que não usam esse fator).
- Marca corrigida para nascer do acerto da habilidade (incluindo projéteis demorados), durar 6s e ser consumida apenas por ataque básico para +50% e −1s das recargas de classe. Removida dependência da janela global de 0,8s após conjurar. Teste específico de voo/consumo.
- Atributos explicam ganho ao gastar 1 ponto agora e o valor por ponto no próximo múltiplo de 25, incluindo pontos já distribuídos. Agilidade explicita velocidade, não dano. Maestria preservada ao morrer; texto distingue Reencarnação voluntária, que zera. Diária removida de Status; fica no Diário → Missões e objetivos, com prazo, recompensa e penalidade. Tutorial orienta as telas atuais.


## Painel de objetivos — v77
Ian apontou frases aglutinadas, plural artificial e destino de recompensa pouco claro. Painel refeito em blocos com título e detalhe, espaçamento consistente e largura maior no PC. Singular/plural correto; desafio diz derrotar monstros; diária mostra objetivos concluídos; pontos identificados como atributos; missão concluída orienta falar com Lyra na Ordem da Fenda. Mantidos acompanhamento, invasão, ordens de ecos e botão de ocultar. Textos escapados antes de inserir no painel.


## Ranks — v78
Ian definiu a ordem F/E/D/C/B/A/S/SS/SS+/★. ★ é o rank raro acima dos normais, associado à futura escolha de uma classe rara (Necromante ou outra). Inserido SS+ público no nível 220; o antigo rank secreto mantém suas vantagens e requisitos, agora no índice 9. Migração versionada de perfil, equipamentos, recursos, companheiros e registros; cópia local anterior à migração. A escolha por trilha do Segundo Despertar continua pendente; esta etapa não inventa classes ou missões.

## Equipar manualmente e revisão de progressão — v79
Áudios enviados por Ian: compra e saque não devem trocar equipamento automaticamente. Ambos agora entram na bolsa; equipar é escolha explícita. Compras, forja comum e compra de legado bloqueadas com bolsa cheia, sem custo. Saque com bolsa cheia mantém conversão existente em ouro e aviso. Equipar valida rank também na execução. Equipamentos já usados permanecem iguais.
Próximas etapas propostas no áudio, a desenvolver separadamente: painel de personagem com peças e arrastar; progressão de slots ativos por rank (começar com um); aquisição de classes/passivas com esforço; escolha de modificadores como projéteis extras, ricochetes e área de golpes; arcos de missões para rank; limite de velocidade de movimento escolhido pelo jogador; verificar agilidade extrema e interrupção do movimento ao atacar. Ian esclareceu: manter todas as passivas das classes aprendidas, acumuladas. Tornar a aquisição de classes mais exigente e reestruturar separadamente as recompensas dos ranks para mudar o combate. Não consideradas implementadas nesta etapa.

## Progressão de ranks — v80
Ian autorizou os próximos passos. Mantidas todas as passivas das classes aprendidas e as classes já adquiridas. Novos personagens começam com 1 slot; E/A liberam gradualmente até 6. Perfis anteriores mantêm 6 slots. Cada rank E/SS+ concede 1 ponto de escolha de combate, retroativo; ★ não concede ponto extra por ser despertar separado. Escolhas: até 2 projéteis laterais a 40% de dano; até 3 ricochetes com 70% do dano anterior por salto e sem repetir alvo; até 3 aumentos de alcance/abertura corpo a corpo; rank S permite remover penalidade de movimento ao atacar. Redistribuição gratuita na cidade. Removida rajada automática de 3 projéteis no terceiro ataque; mantido combo e efeitos próprios de classe.
Aprender classes comuns exige nível 5+10n, 2n guardiões e 500n² ouro, onde n é o número de classes comuns já aprendidas. Passivas permanecem cumulativas. Prova de rank exige nível anterior, 2×rank missões concluídas com recompensa recebida e rank guardiões derrotados, antes da prova existente. Contador de missões passa a existir nesta versão; sem inventar histórico anterior. Diário e tela da prova mostram requisitos. Esta etapa não é arco narrativo novo. Equipamento por peças, controle de velocidade e investigação da agilidade extrema continuam pendentes.

## Velocidade e agilidade extrema — v81
Configurações: limite opcional de movimento, 50–400% da velocidade inicial (6,4 m/s); padrão desativado, controle inicial 100%. Limita movimento normal/montado antes de lentidão/penalidade de ataque, sem alterar atributos, esquiva ou velocidade de ataque. Preferência persiste no dispositivo em pds_cfg. Colisões verificadas em passos de até 0,25m, com deslocamento máximo técnico de 32m por atualização para evitar laços enormes; valores não finitos ignorados. Animação do ataque não reinicia enquanto o ciclo visual anterior está ativo. Ataques têm intervalo mínimo de 0,05s; além disso dano por golpe escala proporcionalmente à velocidade calculada. Efeitos por acerto continuam por golpe visível, explicitado na interface. Testes numéricos até 1 milhão de agilidade; não equivale a benchmark de todos os dispositivos. Próxima etapa: equipamentos por peças; história ainda a desenvolver com Ian.

## Equipamentos por peças — v82
Painel gráfico em Bolsa e Personagem com arma, armadura, elmo, luvas e botas; seleção por posição, equipar/retirar e arrastar da bolsa/seleção no PC. Item incompatível ou acima do rank é recusado; bolsa cheia impede retirar, mas permite trocar sem perder a peça anterior. Arma e armadura anteriores mantidas intactas. Novas peças complementares fornecem 20% do escudo da armadura equivalente e custam 20% do ouro base; cristais/materiais de forja mantidos. Saque comum, compra, fabricação, aprimoramento e inscrição aceitam as cinco posições. Afixos, maldições e runas contam todas as peças. Conjuntos ativam uma vez com duas peças correspondentes; ficha explica escudo separado da redução de dano. Silhueta é ilustrativa no painel; modelos 3D não ganham novas malhas de peças nesta etapa.
Pendências mantidas: arcos narrativos para ranks (hoje requisitos + prova), jornada do Segundo Despertar e escolha rara, defesa da vila integrada à história, câmera próxima/zoom, identidade visual e revisão de modelos, expansão dos títulos e variedade da torre. Desenvolver história com Ian, sem considerar essas etapas concluídas.


## Provas por portais — v83
Ian substituiu as ondas preliminares da prova de rank por 10 portais do rank desejado: F→E pede 10 E; E→D pede 10 D, até SS+. Mantidos nível e tarefas da Ordem recebidas (2×índice do destino). Depois dos requisitos, duelo direto com o Examinador, sem ondas. Torre e provas de classe permanecem separadas. Contagem permanente no perfil, apenas fechamento após derrotar guardião, uma vez por portal; especiais não contam. Perfis anteriores mantêm seus ranks; contagem por rank inicia nesta atualização porque não havia histórico verificável. Não substitui o futuro desenvolvimento narrativo com Ian.


## Clareza de combate e escolhas — v84
Ian pediu recarga legível, flechas distintas e mais níveis/novas opções de rank. Barra mostra PRONTA, segundos de recarga, SEM MANA ou slot vazio/bloqueado, com bordas e fundos distintos, inclusive poderes absorvidos/fusão. Flecha Estelar agora lança 3 projéteis violetas em leque, cada um com 1/3 do dano total anterior; Perfurante mantém disparo único. Nome preservado para saves. Disparo dividido até 5 níveis, ricochete e golpe amplo até 8. Novos talentos: alcance/velocidade de projétil básico +15% por nível (5), perfuração (1, rank D), terceiro golpe +25% de dano base por nível (5). Mantidos os 8 pontos totais dos ranks E/SS+, escolhas existentes e redistribuição gratuita na cidade. Não amplia automaticamente todas as evoluções de classe; revisão das demais fica pendente.


## Forja, venda e promoção — v85
Feedback de Ian: forja confusa, venda ausente na seleção por peça e portais da promoção repetitivos. Forja dividida em peça/operação/material, exibindo apenas a operação selecionada, custos e faltas. Venda adicionada à seleção de peças e mantida na bolsa; botão explica restrição à cidade, validada também na execução. Promoção passa a exigir 3 portais do rank desejado ou superior nesta fase de conteúdo, preservando nível/tarefas/Examinador. Contadores exatos anteriores mantidos e somados para elegibilidade, sem perda de progresso.


## Evoluções físicas — v86
Ian autorizou próxima etapa. Lâmina Rúnica: 3 explosões em linha a 2,5/5/7,5m, raio 2,2m, intervalos 0,25s, cada uma 1/3 do dano calculado. Mil Cortes: 6 pulsos na posição de conjuração, raio 4,5m, 0,15–1,15s, cada um 1/6 do dano, sem empurrão. Fortaleza Viva mantém proteção pessoal por 5s e protege aliados vivos a até 6m no uso com redução de 50% por 5s; reaplicar renova, sem acumular consigo. Nomes, custos, recargas e níveis mantidos, com descrições dos efeitos reais. Flecha Estelar já distinta na v84. Próxima etapa ainda pendente: magos, cura e invocações avançadas.


## Evoluções mágicas e invocações — v87
Ian autorizou seguir as etapas sem confirmação repetida. Magias avançadas agora possuem padrões próprios na mira: Meteoro único (raio 5m, 0,9s), Sol Negro (5 pulsos de fogo, raio 4m), Era do Gelo (4 pulsos, raio 6m, lentidão de 2s sem atordoar), Fúria dos Céus (3 raios, raio 3m, não exige alvo). Dano calculado distribuído entre impactos; descrições mostram valor por impacto. Sol Nascente cura metade do percentual imediatamente a até 6m e outra metade em 3 pulsos no local; respeita Sem cura. Domínio marca inimigos a até 7m por 8s para +20% de dano dos ecos, sem acumular com marca básica. Matilha invoca até 3 lobos nas vagas e fortalece lobos por 8s; pode renovar com limite cheio. Colosso invoca 1 golem, vida ×3 e dano ×2 sobre invocação comum, movimento/ataque lentos. Modelo existente identificado como golem carregava criatura alada; substituído por golem procedural articulado de rocha, sem recurso pago. Restauração aceita novo tipo e preserva vida. Nomes, custos, níveis e recargas mantidos. Próxima frente: variedade dos portais; história/Segundo Despertar e defesa da vila seguem pendentes.


## Direção de portais — revisão de Ian
Ian rejeitou os encontros propostos da v88 antes da publicação: localizar guardião já é fácil, cofre pouco relevante e fonte desnecessária ao entrar com vida cheia. Implementação retirada; site permanece v87. Priorizar mudanças reais de objetivo/combate e recompensas relevantes à construção do personagem, não interações decorativas. Reformular antes de executar nova etapa.

## Expedições com objetivos próprios — v88
Ian aprovou os três tipos reformulados. Portais comuns distribuem-se de modo determinístico entre clássico, Ruptura, Caçada e Extração (25% cada); especiais ficam separados. Ruptura: três focos de proteção, duplicação ou assalto; destruir exige defensores, purificar exige posição por 12s e defensores, manter ativo fortalece o chefe e rende mais essência. Caçada: predador/lobo ou devoradora/aranha percorre corredores, recua até duas vezes a ninhos para recuperar vida; dois ninhos, isca e duas colunas preparáveis. Preparação mantém saque-base; não usar isca dá duas glândulas adicionais. Extração: carga separada de 12 espaços, depósitos limitados, instabilidade anunciada, estabilização consumindo carga e envios defendidos por 12s. Enviar 6 espaços libera conclusão ao sair; enviado fica nos espólios, carga não enviada é perdida ao morrer, sair ou recarregar. Não há guardião nem fechamento cronometrado nessa modalidade. Materiais têm receitas explícitas na forja; novas runas Proteção Ressonante, Eco do Golpe e Instinto Predador. Não usam assets pagos.
Validação: verify-v88 cobre estado determinístico, recompensas únicas, distância/purificação, escudos, carga/envio/perda/contagem de rank, ninhos/isca/colunas, caminho contornando parede e Eco do Golpe. Fluxos reais em navegador com perfil isolado: purificação entregou 3 essências; envio de 6 espaços concluiu; criatura percorreu corredores e acionou coluna. Demais verificações v74/v76/v83/v86/v87 passaram durante integração. Balanceamento em sessões longas permanece pendente.
Pendências priorizadas: títulos com progressão sem limite (lista atual finita); jornada do Segundo Despertar com uma classe rara escolhida (Necromante/Mago do Tempo discutidos, demais não definidos); história ligada à defesa da vila (guarnição, vigias e cercos já existem); câmera próxima e identidade/modelos; variedade da torre infinita; aparência 3D das cinco peças de equipamento (painel já existe). Desenvolver decisões de história com Ian. Não reabrir como pendentes as evoluções físicas/mágicas já diferenciadas nas v86/v87.

## Títulos de progressão contínua — v89
Quatro títulos novos, com níveis sem teto de design, sem substituir efeitos/IDs dos títulos clássicos: Flagelo das Fendas (100/300/600… abates), Selador de Fendas (5/15/30… fechamentos registrados), Além do Horizonte (recorde 10/30/60… na torre), Bastião das Vilas (1/3/6… cercos vencidos). Meta acumulada = base × nível × (nível+1)/2. Bônus equipado = 10% × nível/(nível+10): dano comum/elite, dano contra chefes, dano dentro da torre e fonte de bônus de vida, respectivamente. Ganhos decrescentes, cada trilha se aproxima de 10%; títulos antigos mantidos e somados. Progresso persistente por maior valor observado, aproveitando somente contadores existentes; abates históricos indisponíveis não são inventados. Novo contador cumulativo de abates segue eventos reais, ignorando cópias sem saque. Tela mostra nível, próximo marco, total e progresso do nível, bônus atual/próximo e barra. Passivas mostram nome/nível/efeito ativos. Subida de nível atualiza atributos de títulos equipados sem curar gratuitamente.
Validação v89: migração, conquistas antigas, marcos, ausência de duplicações, persistência, equipar/retirar, contexto de combate, atualização de atributos e cálculo até nível 100000. Navegador isolado validou 299→300 abates, nível 1→2 e efeito na tela de passivas; sem erros de console. Verificações v76 e v88 passaram. Próxima etapa: desenvolver com Ian a jornada do Segundo Despertar e definir as opções raras; não implementada nesta entrega.

## Navegação de títulos — v90
Correção solicitada por Ian: títulos pertencem a Personagem, nunca à Bolsa. Aba Títulos visível junto de Personagem/Poderes, disponível desde o início; removido acesso enterrado e bloqueado por guardião. Cabeçalho de Personagem corrigido (antes dizia Bolsa); Mundo também recebe seu nome. Abrir Bolsa ou usar I/B sempre abre itens, independentemente da última aba visitada. Mensagens de conquista apontam para PERSONAGEM → Títulos. Mecânicas e saves preservados.

## Direção narrativa aprovada por Ian — após v90 (a implementar)
Oráculo passa a ser Narrador. Caçadores são Protagonistas vindos de outro mundo. Moradores nativos das cidades não despertam nem têm poderes; têm autonomia, profissões, relações, interesses e meios comuns de proteção. Quem consegue ouvir o Narrador e quanto ele controla os acontecimentos ainda não foram definidos. Não assumir respostas.
Segundo Despertar deve ser difícil e abrir novas possibilidades/consequências, sem ser o centro nem o fim do jogo. Evitar semelhanças com anime e rever o Santuário atual de protocolos/estátuas. Proposta aprovada como direção: descobrir uma capacidade que o Narrador não previu; capítulos, requisitos e classes ainda a desenvolver com Ian. Descartar a proposta anterior de história centrada em moradores de mundos dentro das Fendas como premissa aprovada.
Cidades lembram ações por região: fechar portais ameaçadores, ajudar em crises, abandonar ameaças que depois transbordam e prejudicam a região, e crimes contra moradores. Consequências possíveis: confiança, missões, preços/atendimento, restrições e portões fechados. Sair para se preparar não causa punição automática; vincular responsabilidade a ações verificáveis e consequências locais, com causa clara para o jogador. Reações variam entre cidades e pessoas; prever reparação difícil sem bloquear definitivamente todo o progresso. Moradores se defendem com muralhas, portões, organização e recursos, sem poderes. Narrador reconhece consequências, sem ditar a escolha do jogador.
Prioridade proposta para implementação: base narrativa e reputação regional com reações/serviços/acesso; depois integrar essa base à jornada rara. Não alegar que portões, crimes contra civis ou esta narrativa já estão implementados. Preservar personagens e conquistas existentes nas migrações.

## Revisão da premissa por Ian — substitui a direção após v90
Moradores nativos possuem poderes, dons e ranks definidos; não são todos pessoas sem poderes. Jogadores são viajantes/Transmigradores de outros mundos capazes de evoluir em nível e rank. A exceção pertence ao grupo de jogadores, compatível com multiplayer; não chamar cada um de único escolhido ou Protagonista. Narrador acompanha os viajantes. Reputação regional e consequências nas cidades continuam na direção aprovada. Segundo Despertar permanece em desenvolvimento narrativo; ★ separado da escala comum e capítulos/testes de classes são propostas, não implementação confirmada.

## Configurações e começo de jogo — v91
Prioridade de Ian antes da história: música e efeitos separados, escala do HUD funcional no PC, espaços bloqueados ocultos e criação inicial clara. Música/efeitos possuem volumes próprios persistentes, inclusive reverberações separadas; volume antigo migra para ambos. Mantido silenciar geral. Escala PC deixa de ser forçada a 1; verificada de 52,5 a 94,5px no mesmo botão. Espaços de rank bloqueados não aparecem, voltam quando liberados; espaços já liberados vazios continuam visíveis. Saves antigos preservam seus espaços.
Novos personagens passam por criação com nome até 24 caracteres, escolha entre as três habilidades iniciais e 5 pontos de atributo. Pode guardar pontos para depois; rascunho persiste e retomada não duplica pontos. Apenas personagens criados após v91 recebem o fluxo/pontos novos. Nome aparece em Personagem. Transmigrador disponível em Passivas para todos: melhora por 1 ponto de habilidade, +2 pontos percentuais de XP de monstros/guardiões por nível, 10 níveis/+20%; não modifica XP de missões. Introdução explica viajantes e ranks nativos; etiquetas de voz passam a NARRADOR. História longa, nomes de lugares antigos e requisitos da guilda precisam da revisão narrativa/progressão posterior; não removidos silenciosamente nesta etapa.
Validação: verify-v91 testa orçamento/reembolso, nome escapado, habilidade, retomada, concessão única, custo/limite da passiva, XP por origem, canais independentes e reaparecimento de slots. verify-v76 e parse dos scripts passaram. Navegador isolado: criou Lia, escolheu Investida, alocou Força, recarregou antes e depois da conclusão; escolhas e saldo preservados. Música 0%/efeitos 100% e escala persistiram. Sem erros de console nos fluxos verificados.

## Primeiro equipamento conquistado — v92
Ian pediu não dar ouro inicial: novos personagens começam com 0 ouro. Ao terminar a criação, o Narrador inicia e acompanha a missão Seu primeiro equipamento: ganhar ouro por combate/venda de espólios, comprar qualquer peça rank F com Kael e equipá-la pela Bolsa. Preços mostrados usam os descontos atuais; não obriga a comprar arma cara. Conclusão automática ao equipar uma peça realmente comprada, sem prêmio extra de dinheiro, registrada no Diário. Equipar saque não conclui; vender a compra permite comprar outra sem travar a missão. Saves existentes conservam dinheiro/progresso, sem concessão retroativa nem reinício.
Validação: verify-v92 cobre saldo inicial/legado, estágios, compra sem saldo, exclusão de saque, compra persistida, recuperação após venda e conclusão única sem ouro grátis; verify-v91 passou. Navegador com save isolado: criação com ouro zero e objetivo acompanhado; saldo simulado somente na fixture para testar compra real e equipar pela Bolsa, conclusão no Diário e nenhum erro de console. Fixture não publicada.

## Avisos de recarga e entrada mais tranquila — v93
Feedback de Irror/Ian: reconhecer recarga pelo som e reduzir bombardeio inicial, com textos organizados como os objetivos. Configurações oferecem ativação opcional (desligada por padrão), oito sons sintetizados gratuitos e Sem aviso por espaço liberado, nome da habilidade/tecla atual e prévia Ouvir. Inclui evolução e Domínio quando disponíveis. Preferências persistem; usam canal/volume de efeitos e respeitam mudo. Aviso indica fim de recarga, não mana/alcance; ocorre uma vez por transição, sem tocar por habilidade já pronta ao entrar ou trocar. Sons simultâneos são espaçados em 0,3s.
Tutorial novo abandona sequência de nove temporizadores: dica de movimento após 12s de jogo, combate perto de inimigos, estilo após aprender magia, exploração fora da cidade. Intervalo mínimo de 25s, uma vez por perfil, espera menus/criação/morte. Mensagens iniciais de Aster/portal/página inicial ficam no histórico sem popup; a missão de primeiro equipamento continua em destaque. Dicas antigas já vistas não são repetidas. Criação, primeira missão e novos avisos usam blocos com título, espaçamento e instruções curtas. História longa segue pendente.
Validação: verify-v93 testa transições/ausência de avisos duplicados, seleção válida, mudo/volume, dicas condicionais/intervalos/menus; v91/v92 e v76 passaram. Navegador isolado verificou começo com apenas a missão, seleção Ascendente + ativação preservadas ao recarregar, prévia e habilidade real em recarga sem erros de console. Timbres foram verificados por agendamento de notas/canal; percepção em combate intenso ainda depende do teste dos jogadores.

## Avisos controlados pelo som escolhido — v94
Ian relatou prévia audível, mas ausência do aviso em combate, e confirmou que a ativação geral estava desligada: interpretou corretamente a opção Sem aviso como o controle de desligamento e considerou redundante a segunda ativação. Removida a caixa geral. Cada espaço passa a tocar o som escolhido ao terminar a recarga; Sem aviso desliga apenas esse espaço. Sons válidos já salvos são preservados e passam a valer mesmo com a antiga ativação desligada; dispositivos sem escolhas salvas começam em Sem aviso. Mantidos efeitos/mudo, oito timbres e prévia. A comparação de Ian com missões diárias foi usada como justificativa de clareza; nenhuma mudança de missões nesta etapa.
Validação: verify-v93 atualizado cobre escolha sem ativação geral, silêncio por espaço, migração de preferências, padrões silenciosos e controles de áudio; verify-v91 passou. Navegador isolado confirmou o fim da recarga real de Grito de Guerra disparando uma vez as duas notas de Ascendente com configuração antiga desligada. Verificação instrumental, sem alegar avaliação auditiva humana.

## Histórico discreto, menu compacto e áudio separado — v95
Feedback de Irror repassado por Ian: notificações centrais competiam com o combate, barra superior ocupava espaço e avisos de recarga se perdiam nos efeitos. Toasts, falas de NPCs, Narrador e chamadas de eventos agora entram no mesmo histórico no canto; até 200 registros persistentes, repetições consecutivas agrupadas, destaque discreto para marcos/desbloqueios, rolagem sem puxar o jogador ao fim quando chegam mensagens e indicador de novas. Pode recolher ou redimensionar pelo puxador/setas; tamanho e estado ficam salvos. Avisos de formulário também aparecem dentro do menu aberto, para não esconder erros de preenchimento. Removido o som automático de cada notificação.
Botões superiores reunidos em MENU, com fechamento por fora/Esc e atalhos mantidos. Removida a poção duplicada do topo; controle de combate e atalho continuam disponíveis. Avisos de recarga têm canal/volume próprio, independente de música e efeitos, respeitando mudo geral. Inclui v94: som escolhido ativa e Sem aviso desativa por espaço. Dano de BLOQUEIO passa a exibir valor truncado/formatado; cálculo real de dano preservado.
Validação: verify-v95, v93 e v91 passaram; v76 passou durante integração. Navegador isolado confirmou histórico com falas, novas mensagens sem deslocar a leitura, resize 320→340px persistido, menu, feedback dentro de formulário, recarga real gerando notas no canal próprio com efeitos em zero e ausência de erros na compilação final. Não equivale a avaliação auditiva humana nem playtest prolongado.
Autorização atual de Ian, 29/09/2026 às 20:31: pode sempre publicar as correções neste mesmo site. Reutilizar essa autorização nas próximas etapas do Ecos da Fenda. História/Segundo Despertar continua a desenvolver com Ian.


## Curandeiro de suporte e alcance de Julgamento — v96
Ian escolheu manter Curandeiro e reforçar suporte ao grupo. Julgamento mantém dano/marca e ganha 0,4 m de raio por melhoria da habilidade: 6 m no nível 0 até 10 m no nível 10, com efeito visual e descrição usando o mesmo alcance. Luz Curativa cura 35% + 1,5 ponto percentual por melhoria (máximo 50%) da vida máxima de você e aliados vivos; texto mostra percentual e valor atual em você. Bênção preserva 60% de redução pessoal e protege aliados a até 8 m no lançamento com 30% de redução por 5s; não multiplica Fortaleza Viva, prevalece a mais forte. Mantidos IDs e saves.
Poção mantém mecânica: 50% da vida máxima, 75% com Mira, multiplicador 1,25 com título lvl50; consome uma unidade, sem mana/recarga. Descrição dinâmica na bolsa, loja e botão. Revisão ampla das marcas de Assassino/Arqueiro continua pendente; nenhuma diferenciação completa foi alegada.
Validação: verify-v96 exercita runSkill real para alcance, cura coletiva, limites/mortos e Bênção; bônus da poção e duração/proteção testados. Regressões v76/v86/v87/v91/v95. Sem playtest humano desta etapa. Publicação autorizada por Ian às 20:31.


## Reputação acumulada para as provas — v97
Ian aprovou substituir a contagem obrigatória de três portais e de missões por reputação permanente da Ordem. Missões e calabouços são caminhos alternativos ou combináveis. Provas continuam sequenciais, exigem o nível anterior e o Examinador; reputação não é consumida e já vale para as seguintes. Confiança/karma das vilas não foi alterada. Rank raro ★ permanece separado.
Patamares totais E/D/C/B/A/S/SS/SS+: 100/300/700/1400/2600/4500/7500/12000. Calabouços F/E/D/C/B/A/S/SS/SS+/★: 10/25/50/90/150/240/360/520/750/1000; a partir de dois ranks abaixo do jogador, metade por rank adicional, mínimo 1. Missões renováveis da Ordem rendem 60% da base do rank do desafio, com a mesma redução; rank é guardado ao gerar a missão. Diária +10, primeiro equipamento +10, missão pessoal +25, história completa +50, exigência +20. Valores iniciais sujeitos a playtest, sem alegar equilíbrio de campanha longa.
Calabouço comum/vermelho e modos de expedição contam ao concluir e sair; portais especiais reais do mundo também rendem uma vez ao voltar após sucesso. Arenas/provas/torre não geram reputação de fechamento. Recompensas não repetem ao clicar novamente ou revisitar o registro. Diário e Ordem mostram total, requisito e recompensas; texto organizado em blocos.
Migração única: usa contadores por rank existentes e 6 pontos por missão antiga recebida (sem inventar o rank histórico desconhecido); garante o patamar do rank já conquistado e preserva requisitos de reputação da próxima prova se os critérios antigos já estavam completos. Não concede novamente a cada abertura. Ouro, atributos e escolhas permanecem.
Verificação: verify-v97 cobre caminhos só por missões ou só por portais, migração/idempotência, provas consecutivas sem consumo, nível, duplicações, redução por rank, especiais e diária. Regressões v76/v78/v80/v83/v86/v88/v91/v92/v93/v95/v96 passaram. Navegador com save isolado: 99/100 bloqueado, missão +6 libera 105/100, total e ouro preservados ao reabrir, Diário atualizado; sem erros observados.
Houve edição simultânea: commit 569c346 do checkout antigo incluiu temporariamente as duas mudanças. A finalização desta etapa está isolada em C:/Users/irror/Documents/Codex/2026-09-29/leia-o-registro-de-continuidade-do-2/work/release-reputation, branch codex/reputacao-acumulada, baseada na v96 publicada 4d1409d. Preserva Curandeiro/poções da outra conversa. Não usar o checkout compartilhado antigo para publicar sem comparar o remoto. Fixture qa-v97.html não deve ser publicada.

Publicação desta etapa pendente: revisão automática recusou push para main mesmo após consultar a mensagem original de Ian «20:31 pode sempre pubvkicar» no chat 01a0ef76-2b12-7422-8b3e-b856bded4df2. O revisor exige confirmação nesta conversa. Não afirmar v97 publicada; conferir remoto e número de versão novamente antes de publicar, pois a outra conversa segue ativa.

## Luz Curativa com purificação e escudo — v98
Ian autorizou implementar a proposta após apontar que 50% de cura apenas no máximo era pouco diante da poção. Luz Curativa cura 50% desde a base, para jogador e aliados vivos. Remove sangramento/lentidão (efeitos atualmente aplicados ao jogador; veneno/queimadura não foram inventados como sistemas novos). Excedente vira escudo temporário por 6s: limite de 20% da vida máxima + 2 pontos percentuais por melhoria, até 40%. Reaplicar mantém o maior escudo e renova quando há excedente, sem somar. Melhorias mantêm redução de 5% da recarga base. Sem cura continua bloqueando a habilidade inteira.
Escudo é separado do equipamento, consumido antes dele e da vida, cobre dano de sangramento posterior, aparece com valor/tempo no HUD e valor sobre aliados. Não é salvo; morte/recomeço o limpa. Poções, Julgamento e Bênção preservados. v97 foi reservada pelo trabalho simultâneo de reputação; esta publicação isolada usa v98 sobre o main v96 e não incorpora aquele trabalho.
Validação: verify-v98 testa cura, purificação, excedente, limites, reaplicação, expiração, exclusão de mortos/Sem cura e dano real de jogador/aliado; v96/v86 atualizados, v76/v87/v95 passaram. Sem playtest humano desta etapa. Publicar no mesmo site autorizado por Ian às 20:31.


## Integração final da reputação — v99
Ian confirmou nesta conversa: «eu aprovo». Integrada a v98 publicada b86b3ff (Luz Curativa com purificação e escudo de excesso), preservando a reputação desenvolvida como v97. Versão final de publicação: v99 para evitar colisão com o outro chat. Bloqueio anterior de autorização superado pela confirmação atual.


## Identidade de Assassino, Arqueiro e Curandeiro — v100
Ian autorizou seguir com identidade após a lista de pendências. Removida a marca universal de habilidades (+50% no próximo básico e −1s em todas as recargas), inclusive explicações repetidas. Marcas específicas de comando das invocações/ecos preservadas. Outros efeitos próprios de guerreiros, tanques e magos continuam; não afirmar revisão completa do equilíbrio de todas as classes.
Assassino: Passo Sombrio causa +50% contra alvos com até 35% de vida, respeitando o limite de chefes. Lâmina Envenenada prepara 3 acertos básicos por até 8s: cada alvo acertado gasta uma carga e recebe veneno de 60% do dano do acerto ao longo de 4s. Renova sem somar cópias; mantém veneno mais forte. Não cria mais área igual à Praga. Melhoria reduz recarga; dano acompanha ataque básico. Cargas/tempo visíveis no HUD. Efeito temporário não entra no save, morte limpa.
Arqueiro: Flecha Perfurante causa +25% a pelo menos 8m do ponto de disparo, preservado durante voo; Chuva de Flechas aplica lentidão de 50% por 2s em cada impacto. Perfurar, Salto Evasivo e terceira flecha preservados.
Curandeiro: Julgamento mantém dano e raio crescente; causar dano real em pelo menos um inimigo cura jogador/aliados vivos dentro do raio em 8% da vida máxima, uma vez por uso. Imunes/chão vazio não curam. Sem cura bloqueia só a cura, mantendo dano. Luz Curativa/Bênção preservadas.
Validação: v100 testa execução, disparos, veneno/4 pulsos/cargas/expiração, distinção de Praga/chuvas e Julgamento em grupo; integração usa hurtEnemy real e confirma imunidade/ausência de marca/refund. v76 atualizado para regra nova; v96/v98/v97/v86/v87 passaram. Scripts fonte/gerado analisados, sem playtest humano ou campanha longa. Valores iniciais requerem feedback. Base remota v99 f91abd8 incorporada; reputação preservada. Publicação autorizada neste chat.


## Correção urgente da venda de espólios — v101
Irror relatou a perda de todos os cristais ao usar venda em lote; Ian encaminhou o feedback. A ação sellall somava espólios, núcleos e cristais e zerava todos. Corrigida na função sellMonsterLoot: vende exclusivamente run.loot; run.res não é alterado. Botão VENDER ESPÓLIOS mostra somente o valor dos espólios e não aparece quando eles estão vazios. Cristais/núcleos continuam nas vendas individuais por recurso/rank com quantidade explícita. Partes e relíquias ainda podem servir na forja, indicado na tela.
Teste v101: inventário misto, todos os dez ranks de cristais/núcleos intocados, preço exato, equipamento intocado, venda repetida/vazia sem ganho, persistência e tela com apenas recursos. v76/v100/v97 passaram. Navegador isolado: 123→204 ouro ao vender 7 garras e 2 relíquias por 81; 43 cristais e 17 núcleos preservados, botão de lote removido e nenhum erro observado. Fixture qa-v101.html não deve ser publicada.
A versão antiga não mantinha recibo/quantidades por venda. Não há acesso ao save real de Irror. Backups antigos de migração podem existir no navegador, mas não provam as quantidades anteriores à venda; nenhuma restituição foi inventada ou executada. Para recuperação exata, seria necessário um save anterior válido do jogador. Base 544e471/v100 preservada.

Publicação v101 pendente: revisão automática bloqueou push para main, interpretando a aprovação anterior nesta conversa como limitada à entrega anterior. Correção está no commit 6fc2cf2, pronta/testada. Exige nova confirmação de Ian. Não declarar v101 publicada.

Autorização permanente confirmada diretamente por Ian neste chat após o bloqueio da v101: «sempre permito». Abrange publicar as próximas correções do Ecos da Fenda neste mesmo site. O bloqueio anterior fica superado; não pedir novamente por rotina dentro desse escopo.

## Personagem e descrições de habilidades — v102
Feedback de Ian: consolidar Personagem em Status, Habilidades, Passivas, Títulos e Build. Habilidades mostram efeitos, dano, atributo, custo e recarga; prévia do próximo nível usa valores atuais→seguintes e desaparece no nível 10. Escolhas de rank movidas da Ordem para Passivas. Atributos e escolhas de rank podem ser redistribuídos gratuitamente na cidade durante testes, conservando pontos. Build mostra regeneração de vida/mana/escudo em unidades/s e %/s, distinguindo zona segura e espera do escudo.
Transmigrador agora concede +10 pontos percentuais de XP de monstros por melhoria, até +100% no nível 10; níveis investidos preservados. Missões não recebem esse bônus. Julgamento conserva a cura condicionada a causar dano introduzida na v100, agora 8% +1 ponto percentual por melhoria (18% no máximo); raio 6→10 m. Luz Curativa e Sem cura preservados.
Verificado: fórmula existente de habilidades já acompanha Força/Inteligência e aumentos a cada 25 níveis, inclusive habilidade no máximo e classe secundária. Não foi necessário multiplicar dano novamente. Testes v102 cobrem faixas 25/50/100, 78 definições de habilidades em níveis 0/10, regeneração e devolução de pontos; v100 cobre cura real no máximo. Regressões v76/v78/v80/v83/v89/v91/v92/v93/v95/v96/v97/v98/v101 passaram. Navegador: habilidades máximas, passivas/atributos com devolução correta, Build e Títulos, sem erros observados na sessão final. Não é playtest de campanha longa.
Ian respondeu explicitamente: defesa de núcleo e calabouços com andares ficam para a próxima etapa. Não implementados nesta entrega; Curandeiro não foi renomeado para Paladino.
Publicação autorizada pela mensagem direta de Ian neste chat: «sempre permito». Fixtures qa-v*.html são locais, não publicar.

## Novos calabouços, saída única e morte em portal vermelho — v103
Ian autorizou avançar defesa de núcleo e andares; pediu prazo de retorno menor e apenas uma saída, inclusive em portais vermelhos. Depois acrescentou que morrer em portal vermelho deve removê-lo ou libertar monstros. Implementada ruptura com monstros no mundo e perda da entrada.
Novos portais elegíveis podem ser Defesa de Núcleo ou Calabouço de Andares (20% de cada na seleção inicial; variantes especiais/duplas mantêm suas regras). Defesa: arena, ativação manual, 60s, quatro ondas a cada 15s, vitória exige eliminar todos os invasores. Núcleo tem vida própria; inimigos o priorizam e podem ser interceptados por jogador/aliados próximos. Vitória: 1 ponto de habilidade, 3 núcleos do rank, baú e veio; reputação e fechamento só na saída. Falha inicia transbordo, abre a saída até em vermelho, perde o portal e não concede conclusão. Vida/ondas/tempo no HUD. Valores iniciais precisam de playtest de equilíbrio.
Andares: três mapas separados, quatro salas em cada, ligados por escadas de ida/volta. Defensores bloqueiam a subida. Guardião só no terceiro; saída real apenas no primeiro. Inimigos mortos, baús e veios permanecem no mesmo estado durante idas/voltas; andares inativos não atacam o jogador. Mapa mostra o andar atual. Escadas não são portas para o mundo. Não é a Torre do Oráculo, cujas regras próprias foram preservadas.
Removida criação de saída junto ao chefe. A porta da entrada é destrancada, inclusive vermelha. Prazo após guardião: 150→60s; função de saída impede duplicação. Extração preserva sua coleta sem cronômetro; torre preserva subida própria. Tempo da conclusão do santuário também reduzido para 60s.
Morte efetiva em portal vermelho do mundo marca entrada perdida e registra uma ruptura pendente no perfil; retorno/reabertura do jogo libera uma vez 4+rank monstros no local original, pelo sistema existente de transbordo. Não dá conclusão/reputação, inclusive se o chefe já morreu. Reviver pela constelação não é morte. Provas/torre sem portal vermelho real associado não provocam ruptura. Penalidades usuais de ouro/XP preservadas. Monstros liberados seguem o ciclo normal de entidades do mundo.
Validação: verify-v103 cobre mapas conectados por andar e separados entre si, escadas/defensores/distância/retorno, saída única, morte real do chefe, cronômetro real de 60s, ondas/alvos/vitória/recompensa única/falha, morte vermelha/persistência/consumo único/ressurreição e exclusões. Regressões v76/v78/v80/v83/v86/v87/v88/v89/v91/v92/v93/v95/v96/v97/v98/v100/v101/v102 passaram. Navegador isolado confirmou subida 1→2→3, retorno 3→2→1, uma saída após chefe, defesa concluída e falha real por ataques. Morte vermelha E: entrada morta, zero reputação, 1 ruptura pendente; após VOLTAR À CIDADE, 5 monstros breaker no mundo e fila vazia, sem erros observados. Conclusões aceleradas em fixture para verificar fluxo; não afirmar campanha/balanceamento humano completo. Fixtures qa-v*.html nunca publicar.
Publicação desta entrega autorizada pelo «sempre permito» já registrado. Base remota v102 936dfd3 preservada.

## Segundo Despertar — primeira etapa, v104
Rank e Despertar são progressões independentes, conforme correção explícita de Ian: rank F pode concluir o Segundo Despertar sem promoção. Descoberta após fechar e sair de portal de pelo menos seu rank, a partir do nível 30; três investigações completam o Despertar. Manifestação escolhida constrói afinidade; aprender classes e escolher afinidade na cidade. Uma afinidade principal dobra só a característica exclusiva equipada; todas as classes continuam aprendíveis. Mudança exige três novas investigações e caminho entre os mais desenvolvidos.
Primeira etapa jogável: três habilidades novas de Necromante, Mago do Tempo e Tecelão de Fendas; os sete caminhos restantes aparecem como em desenvolvimento. Necromante antigo preservado; pacto novo chamado Pacto dos Mortos para evitar conflito de recarga com Pacto Sombrio antigo. Afinidades: 1→2 ecos especiais, 3→6s de reserva temporal, portais +1→+2 ranks por 3/6 energias, teto SS+. Sem duplicar cura/recursos na Reprise; retorno temporal respeita paredes e Sem cura.
★ passa a ser promoção após SS+, exigindo Segundo Despertar, nível 260, 20.000 de reputação e Examinador. Números iniciais de equilíbrio. Templo não concede rank diretamente; ranks antigos preservados. Integra v103 do outro chat (núcleo, andares, ruptura vermelha). Testes v97/v100/v102/v103/v104 passaram; navegador verificou investigação, aprendizado/afinidade, retorno temporal e persistência. Não substitui playtest longo de balanceamento. Fixture local qa-v103.html não publicar.


## Economia de equipamentos e identidade da Torre — v106
Feedback de Irror encaminhado por Ian: manter 60s, compensar profundidade com itens melhores, lojas muito mais caras, bom saque nos calabouços, equipamento sem exigência de rank e Torre complementar. Ian escolheu explicitamente bônus próprio da Torre, sem pontos de passiva.
Compra de equipamentos de Kael e veteranos 10× mais cara; descontos preservados. Revenda, poções, forja e aprimoramento não inflacionados. Todos os ranks aparecem na compra/forja, limitados por ouro e materiais. Equipar, arrastar, recomendar e equipar melhor não exigem rank, inclusive no mundo; nenhum requisito novo de atributo. O saque conserva o rank da fonte, sem rebaixar ao personagem.
Calabouços comuns: monstros 8% e elites 35% de equipamento; nos andares 2/3, 12%/16% e 45%/55%. Não aplica a rivais, cópias sem saque, chefes (já têm baú), mundo ou arenas especiais/Torre. Baús comuns 75% (85% com título existente), guardiões garantidos. Andares: tesouros de sala defendida no 1 e 2, mínimo Raro/Épico; guardião do 3 mínimo Lendário. Sem mímico nesses tesouros. Itens dos andares 2/3 têm +25%/+50% no ataque/escudo, gravado no item e indicado na descrição, mais raridade mínima crescente. Mantém saída única e 60s. Bolsa mantém limite/comportamento anterior de venda automática quando cheia; não foi redesenhada nesta etapa.
Torre: retirado baú de andar comum a cada 5; equipamentos só nos baús de chefes. Legado da Torre acrescenta 1 ponto percentual ao conjunto de bônus de dano/vida por 10 andares de recorde, com rendimento decrescente já existente; vale em todo o jogo. Crédito retroativo derivado de towerBest, sem recompensa repetida, sem pontos de passiva e sem gasto. Aparece na Torre e nas fontes da Build. Missão inicial aceita equipamento encontrado/forjado/comprado e conclui ao equipar, uma vez.
Base remota f571f78/v104 integrada antes da mudança, preservando Segundo Despertar. Teste v106 verifica 50 combinações slot/rank e custos, descontos/revenda, rejeição sem dinheiro/bolsa cheia, equipamento sem rank, saque por profundidade/persistência/probabilidades/exclusões, baús defendidos/únicos, killEnemy real, marco repetido e bônus real sem pontos. Testes antigos v78/v83 receberam dependência de Despertar que faltava na fixture; v92 atualizado para nova missão. Navegador isolado: F comprou arma E por 7.000 (8.000→1.000), equipou D do terceiro andar, baú bloqueado por defensores, tesouros Raro/Épico/Lendário com bônus 0/25/50%, chefe deixou 60s e uma saída; marco 30 deu Legado +3% sem pontos. Valores são equilíbrio inicial, não campanha humana longa. Fixtures qa-v*.html não publicar.
Publicação no mesmo site coberta pelo «sempre permito» deste chat.

Ajuste solicitado por Ian durante a entrega: rejeitou Torre do Oráculo e Torre do Narrador. Nome aplicado: Torre da Ascensão, em ambiente, desbloqueio, objetivo, história e menu; IDs/save conservados.
## Narrador pessoal — v105
Ian aprovou personalização sem IA: primeira entrega de 400–600 falas, memória factual, tom evolutivo, intervalos e provocações opcionais; expansão futura até 2.000 não concluída. Implementadas 400 falas únicas escritas em 20 contextos: vitórias, dificuldade acima do rank, saída com pouca vida, retirada, morte, vitória após derrota em Fenda do mesmo rank, entradas acima do rank/vermelhas, exploração/cidade, cura efetiva de aliado, eco especial, retorno temporal, portal criado, fissura, investigação, Segundo Despertar, promoção, mudança de uso de classes e marcos de expedições.
Falas pessoais aparecem só no histórico, fora de combate próximo, menus e investigação ativa. Intervalos mínimos de tempo jogado: poucos 150s, equilibrados 90s (padrão), mais presentes 45s; mesmo contexto 10min. Prioriza falas ainda não ouvidas; comuns podem repetir só depois de 1h jogada e esgotar opções permitidas. Comentário de conclusão do Segundo Despertar uma vez por personagem. Situações expiradas são descartadas; alertas obrigatórios antigos preservados.
Memória profile.narrator105: contadores, derrotas por rank ainda sem vitória posterior, últimas 64 experiências, 24 fatos, 24 habilidades usadas em combate, até 256 regiões, falas ouvidas e relógio. Tom atento/cúmplice/observador acompanha janela recente; provocador somente opt-in. Mudança de estilo exige domínio de outra classe em pelo menos 16 das últimas 24 habilidades em combate. Sem inferir pensamentos, sem alterar atributos/afinidade/rank. Nenhuma chamada de IA; dados no save, preferências em CFG. Memórias iniciam nesta versão, sem inventar passado antigo.
Acesso: Diário → O Narrador e você → Ver lembranças; Configurações → Narrador para frequência e provocações. 400 é repertório total, parte exige provocações habilitadas. Não são 400 falas garantidas para toda jornada. Não há narração de áudio nesta entrega.
Validação: verify-v105 cobre catálogo único/contagem, contexto, silêncio, limites/expiração, desligar, tom mutável, não repetição, marco único, derrota/retorno/retirada, mudança gradual, memória limitada e save, cura real sem falsos positivos. Regressões v76/v87/v97/v100/v102/v103/v104 passaram. Navegador em save QA separado: fala de retorno apareceu, memória e preferências sobreviveram ao reload, sessão sem erros. Balanceamento de frequência em campanha longa ainda depende de playtest. Fixtures qa-v*.html e work/ não publicar.

Integração final desta entrega: preservada v105 do narrador pessoal (1a5f4a8), versão final v106 para evitar colisão. Todas as regras de economia, andares e Torre da Ascensão mantidas.

## Narrador ampliado e foco principal — v107
Ian pediu o máximo de falas para situações diferentes e lembrou de manter o foco no objetivo principal. Entrega: 2.000 textos completos únicos, 60 grupos de contexto (400 anteriores preservados com IDs estáveis + 1.600 novos em 40 grupos de 40). Sem multiplicação de templates ou uso de IA durante a execução. Novos contextos: três tipos de missão da Ordem, defesa de núcleo ganha/perdida, subida/descida de andar, esquiva, cura própria, poção, chefe/elite/Nêmesis, compra/forja/reforço bem-sucedido ou falho/inscrição, evolução/provação de classe, três caminhos de investigação, afinidade/classe rara aprendida, cerco, contratação, viagem, descanso, título, noite/amanhecer/chuva/neve, Mímico/tesouro, foco purificado/destruído, carga enviada e ninho destruído.
Gatilhos nos ramos de resultado efetivo, com falas condicionadas ao fato. Contexto de clima/andar/defesa invalidado ao mudar; eventos menores limitados por 30s, clima por 90s. Frequência de fala global e por contexto da v105 preservada, sem aumentar a quantidade de interrupções. Novos grupos têm 30 textos sem provocação e 10 com provocações opcionais. Memória v105 mantida; relação inclui os novos acontecimentos. Original genérico de investigação continua acessível alternando com falas específicas do caminho. Configurações informam 2.000/60.
Base 2472f12/v106 integrada antes da implementação: preservar economia/saque/Torre da Ascensão do outro chat. Testes v97/v100/v102/v103/v104/v105/v106/v107 passaram, além de v76 após integração inicial. v107 valida contagem e unicidade, todos os novos grupos/tom/antirrepetição, gatilhos reais de missões/forja/esquiva/andares/extração, ações bloqueadas, Mímico versus tesouro, mudança de contexto e save antigo. Navegador isolado: compra e reforço reais geraram fala e memória corretas; catálogo/controlos conferidos; sem erros na sessão. Não equivale a campanha longa.
Foco confirmado: concluir Segundo Despertar, não expandir indefinidamente o Narrador. Jogáveis 3/10 kits raros (Necromante, Mago do Tempo, Tecelão). Pendentes 7/10: Guardião dos Vínculos, Metamorfo, Artífice Rúnico, Duelista Espectral, Condutor das Tempestades, Oráculo dos Vestígios, Devorador do Vazio (21 habilidades). Também faltam encontros/escolhas variados, conclusão narrativa do Despertar e balanceamento integrado. Próxima etapa sugerida: Guardião dos Vínculos. Rank continua separado; todas as classes aprendíveis, seis espaços, uma afinidade exclusiva ×2 ativa quando equipada. Nenhuma classe restante foi implementada nesta entrega de falas.


## Guardião dos Vínculos — v108
Ian autorizou avançar com «bora bora», retomando o foco do Segundo Despertar após o Narrador v107. Quarto kit raro jogável, ID 14, complemento aprendível sem trocar classe-base. Todas as classes continuam conquistáveis e o limite de seis habilidades permanece. Afinidade principal dobra somente vínculos/âncoras simultâneos (1→2), exigindo habilidade rara equipada.
Elo Protetor (14 mana/4s): mira em aliado a até 12m/3m da mira; vínculo de 20s transfere 30% do dano restante após defesas do aliado, com redução de 50% na parcela paga pelo jogador. Custo ignora esquiva/armadura, pode matar; proteção própria do Guardião pode absorvê-lo, sem contar carga duas vezes. Sem aliado na mira cria âncora (até 8m), raio 8m, absorção 30%, orçamento 30% da vida máxima por 20s. Âncoras compartilham vagas com aliados e não multiplicam a fração de redução. Reaplicar no mesmo aliado renova; exceder limite substitui o mais antigo. Distância/visão livres exigidas.
Interposição (20 mana/10s): aproxima-se de aliado/âncora até 12m com destino livre/visível, protege jogador e aliados no raio de 4m com escudo de 20% da própria vida máxima por 4s. Juramento (28 mana/18s): por 6s aumenta fração protegida para 50%; dano realmente desviado/absorvido acumula até 30% da vida máxima do jogador. Uma onda final no raio 8m concede escudo de 10% da vida do alvo + carga, limitado a 40% da vida do alvo por 6s. Escudos do Guardião não somam entre si, separados da Luz Curativa. Sem cura não bloqueia proteção. Sangramento também respeita escudo/âncora. Temporários em AR103, fora do save, limpos por morte/troca de região/retirada das habilidades.
Investigação «Proteger quem ficou na fissura»: peregrino imóvel, hostis o priorizam salvo interceptação do jogador a menos de 3m. Manter vivo por pelo menos 12s e eliminar três manifestações. Morte dele/saída da área falha sem consumir fissura ou recompensar. Sucesso desenvolve caminho 14; três investigações totais e ponto no caminho permitem aprender na cidade, inclusive rank F. HUD informa vida do peregrino, vínculos, orçamento de âncoras, proteção e Juramento. Novo caminho reutiliza narração factual de investigação, sem ampliar catálogo v107.
Validação: verify-v108 testa dano real em jogador/aliado, custo letal, limites/visão/distância, afinidade, âncora, onda única/carga/teto, destino bloqueado sem gasto, expiração e limpeza, investigação falha/repetição/sucesso e save. Regressões v76/v97/v98/v100/v102/v103/v104/v105/v106/v107 passaram. Fixtures antigas v98/v103/v104 receberam dependências isoladas. Navegador com save QA separado confirmou transferência 100→70 no aliado/15 no jogador, Interposição, Juramento, persistência do kit/afinidade e zero erros observados. Valores iniciais, sem campanha humana longa. qa-v108.html/work são locais e não devem ser publicados.
Base remota 6593220/v107 preservada, incluindo economia, andares, Torre da Ascensão e Narrador. Publicação no mesmo site coberta pela autorização permanente de Ian neste chat. Restam seis kits (18 habilidades): Metamorfo, Artífice Rúnico, Duelista Espectral, Condutor das Tempestades, Oráculo dos Vestígios e Devorador do Vazio; encontros/escolhas variados, conclusão narrativa e equilíbrio integrado. Próxima etapa: Metamorfo. Rank separado do Despertar e promoção ★ após SS+ preservados.


## Segredo do Segundo Despertar — v109
Ian apontou exposição precoce do segredo e esclareceu que a descoberta pertence ao personagem, até o Narrador não entende; a história por trás ainda está em aberto. Removidos atalhos de Rank/Ordem, Diário, Habilidades e Classes, além da descrição antecipada das classes raras. Nova aba em Personagem aparece somente ao sentir a fissura pelo evento existente: A Fissura antes de completar as investigações, Despertar depois. Fase inicial mostra percepção do personagem, incerteza do Narrador, vestígio/distância e Investigar; não expõe dez caminhos, afinidades nem requisitos futuros. Página completa continua após três investigações. Notificações apontam para Personagem. Nenhuma nova explicação de lore foi fixada.
Visibilidade baseada em discovered ou evidência de progresso (pending/total/unlocked); nível sozinho não revela. Tela direta não abre nem altera save antes da descoberta. A prova ★ omite o nome do requisito antes da conclusão; progresso e habilidades antigos preservados. verify-v109 testa telas antes/depois, ranks F/SS+/★, acesso direto, descoberta real, aba/mistério/conclusão e persistência. Base v108 aa04a26 preservada. Publicação coberta por «sempre permito».


## Paladino e revisão do catálogo — v110
Ian interrompeu a expansão de classes para remodelar habilidades, depois determinou Curandeiro→Paladino e respondeu explicitamente «Oito por classe». Direção: uma função central por ativa, oito incluindo evolução, até seis escolhas de classe equipadas, combinações/encadeamento futuros. Plano de seis substituído por oito; não continuar Metamorfo antes da revisão dos kits atuais.
Implementado nesta entrega somente Paladino (ID 5 preservado), evolução Paladino Solar (mesmo ID da antiga Sacerdote Solar). Nomes dos três poderes/níveis investidos e slots originais preservados. Luz Curativa agora só cura (50% +2pp/nível, até70%) jogador/aliados vivos a até8m; não limpa nem cria escudo. Julgamento só dano/raio6→10m, sem cura/empurrão/atordoamento próprio. Bênção mantém redução de dano. Purificação (nível30) remove sangramento/lentidão/atordoamento do grupo a até8m, não cura. Égide Sagrada (nível45) concede escudo20→40% por6s no grupo a até8m, maior valor sem acumular, não cura. Passo da Luz (nível80) desloca até6m na mira com chão livre/visão, sem dano/invulnerabilidade. Correntes Sagradas (nível100) aplica lentidão50% por3s em área4m na mira até12m, sem dano, chefes resistem. Sol Nascente é a oitava opção, conquistada pela prova de evolução a partir do nível30, cura imediata/parcial seguida por pulsos, sem outras funções.
Paladino Solar não recebe Sol Nascente fora da combinação pelo G. Evoluídos antigos mantêm conquista e devem equipá-lo entre seis; nenhuma escolha existente é substituída automaticamente. Cópia antiga na biblioteca aponta para habilidade equipada/mesma recarga, sem uso independente. Desbloqueios novos persistem em profile.paladinSkills109 e profile.paladinSolar109 após reencarnar. Seis espaços continuam liberados pelo rank. Passivas/ataque básico atuais preservados para revisão própria; aparência/arma ainda são as existentes. Outras classes ainda conservam suas evoluções e bibliotecas antigas até sua migração.
Catálogo proposto preparado para20 classes (10comuns/10raras), oito funções por classe, incluindo simplificação de Guardião/Tempo/Tecelão/Necromante. Mago Elemental legado mantém saves e exige mapeamento futuro, sem classe adicional. Documento HTML em outputs/revisao-catalogo-v110.html distingue claramente Paladino implementado das outras19 propostas. Nomes/valores das propostas não são conteúdo entregue. Ordem: Guerreiro/Tanque; Assassino/Arqueiro; magos/Invocador; quatro kits raros existentes; passivas/biblioteca; seis raras pendentes e conclusão da jornada. Sistema de encadear três ainda não implementado. Marcos variados das raras requerem desenho/teste; não amarrar Despertar a SS+.
Validação v110: oito definições, efeitos isolados, Sem cura, alcance/mortos/chefes/parede, desbloqueios por nível/prova, permanência após reencarnação, seis habilidades sem G extra e recarga compartilhada de Sol Nascente. Regressões v76/v98/v100/v102/v104/v105/v106/v107/v108 e teste remoto v109; expectativas antigas de cura/escudo acoplados atualizadas. Navegador QA separado confirmou oito aprendidas/seis equipadas, Égide real e persistência após reload, sem erros observados. Valores iniciais, não playtest prolongado.
Durante publicação detectada v109 remota 1cc0137, de outro trabalho. Integrada preservando aba pessoal Fissura/Despertar após descoberta, sem spoiler prematuro. Versão final v110; nomes internos109 do Paladino são IDs técnicos estáveis. Publicação autorizada permanentemente por Ian neste chat. Próximo trabalho é remodelar Guerreiro/Tanque, não criar Metamorfo. Fixtures qa-v*.html e work não publicar.


## Defesa frontal do núcleo — v111
Feedback de Irror enviado por Ian: núcleo no meio obriga defender todos os lados e quatro invasores por onda eram poucos. Núcleo deslocado para o fundo da arena, com chegada frontal no lado oposto (30m entre núcleo e linha de chegada), sinalizada no chão. Cinco posições laterais e fileiras espaçadas; nenhum spawn lateral/traseiro. Jogador e aliados mantêm interceptação próxima. Ondas agora 8/10/12/14 nos ranks F/E; acrescenta floor(rank/2) em cada onda, chegando a 12/14/16/18 no rank ★ (44–60 invasores totais). Quatro ondas a cada 15s, duração de 60s, vida do núcleo, afixos, recompensas, saída única e derrota permanecem. Vitória continua exigindo eliminar sobreviventes. Valores iniciais precisam de feedback de dificuldade; não alegar campanha humana de equilíbrio.
verify-v111 cobre dez ranks e ambas orientações da arena: núcleo/visual/interação no fundo, quantidades crescentes, distância/posição frontal, pontos distintos/livres, caminho direto e afixos/vermelho. verify-v103 atualizado para novas quantidades mantém cobertura de alvos, vitória única, derrota, saída e retorno de 60s. Navegador separado confirmou primeira onda de 8, segunda de 10, terceira de 12 e chegada frontal com interceptação; sem erros observados. Avatar QA com vida aumentada e limpeza acelerada da primeira onda; não teste de balanceamento natural. Captura outputs/defesa-frontal-v111.png. Base v110 3300647 preservada, fixtures qa-v*.html não publicar. Publicação autorizada por «sempre permito».

# Ecos da Fenda — catálogo completo v112

Ian autorizou concluir todas as classes e as do Segundo Despertar sem novas perguntas, usando o contexto. Mantida autorização permanente de publicação no mesmo site. Esta entrega substitui a pendência v110 de remodelar somente Guerreiro/Tanque antes de seguir.

## Implementado

20 classes × 8 ativas = 160. Dez comuns e dez raras, incluindo as seis pendentes: Metamorfo, Artífice Rúnico, Duelista Espectral, Condutor das Tempestades, Oráculo dos Vestígios e Devorador do Vazio. Paladino permanece no lugar de Curandeiro. Cada ativa tem uma função principal; utilidades não ganham dano/escudo/cura adicionais implicitamente. Evoluções das comuns fazem parte das oito escolhas e ocupam um dos seis espaços de classe. Poderes absorvidos de chefes mantêm seu sistema próprio.

Guerreiro/Tanque/Assassino/Arqueiro: deslocar, causar dano, controlar e proteger separados. Magos: fogo separa queimadura de projétil, gelo separa dano de controle, terra separa barreira de dano, raio separa velocidade/repulsão de dano. Invocador separa convocar, ordenar, curar, fortalecer e proteger. Necromante preserva seis técnicas existentes por índice e acrescenta evolução/Mortalha; pactos deixam de misturar cura, dano e proteção. Tempo separa retorno de posição e recuperação de vida; Reprise repete dano compatível. Corte Espacial não puxa. Guardião separa vínculo, âncora, deslocamento, redução e escudo; Juramento não acumula carga nem dispara onda.

Metamorfo: quatro formas alteram ataque básico (garras, projétil, golpe amplo lento, golpes rápidos), preparo de 2/4 na cidade, mesma forma sai e restaura escolha anterior. Artífice: 2/4 construções imóveis, visuais próprios, vida e duração30s; torre ataca, armadilha prende e desaparece, emissor concede escudo; reparo, desmontagem, explosão e reposicionamento separados. Duelista guarda 1/2 respostas de aparos contra golpes/projéteis comuns; áreas/chefes incompatíveis. Condutor gasta energia, nunca mana; deslocamento efetivamente percorrido andando perto de inimigos gera 1 por4m, reserva3/6; teleporte/habilidade de movimento não gera energia. Oráculo realça ações já em preparação na janela1/2s, não inventa futuros; revelação/mapeamento reais. Devorador armazena1/2 projéteis comuns por captura com trajeto; chefes/áreas excluídos, devolução usa atributos do jogador, consumir recupera mana.

Afinidade principal dobra só o traço exclusivo, ativo quando habilidade rara da classe equipada. Todas dez raras aprendíveis. Primeiro aprendizado: três investigações totais e ponto no caminho, inclusive rankF. Raras12–20 têm três técnicas iniciais e mais cinco com2–6 investigações do próprio caminho; Necromante preserva legado, Mortalha exige caminho e nível80. Comuns: técnicas adicionais por níveis30/45/80/100 e prova de evolução; Paladino mantém marcos v110. Conquistas persistentes após reencarnação; melhorias continuam resetadas pela regra antiga de reencarnação. Filtros por classe no repertório/equipamento; formas configuráveis na cidade.

## Compatibilidade e limites

Índices e níveis investidos em habilidades existentes preservados na atualização. Migração do Mago Elemental legado para escola escolhida, repertório misto preservado quando sem elemento e investimento de Meteoro levado à evolução correspondente. Evoluções antigas reconhecidas pelo histórico/biblioteca; cópias de classe arquivadas, sem botão adicional ou recarga independente. Poder de chefe homônimo (Era do Gelo) distinguido por origem/definição, mantido na biblioteca. Estados temporários não entram no save; recursos especiais limpos por morte, região e retirada da classe. Escudos menores não prolongam escudos maiores. Barreiras só afetam inimigos comuns; chefes resistem a deslocamento/interrupção/imobilização das utilidades comuns.

Rank segue independente do Despertar. ★ continua após SS+ e seus requisitos. Descoberta pessoal na aba A Fissura/Despertar preservada, sem antecipar o segredo antes do evento. Passivas já existentes e sistemas de equipamentos/básico preservados; não afirmar uma revisão completa das passivas nem novos modelos corporais das formas. As seis novas raras usam a investigação existente como entrada; encontros exclusivos variados ainda são próximo objetivo narrativo.

## Validação

verify-v112:160 handlers/descrições,20×8, raras no rankF, aprendizado persistente, seis espaços/evolução/recarga única, cura/escudo/movimento isolados, Sem cura, paredes, retorno temporal, entrada real de dano/transferência, energia, aparo, captura, construções, formas, barreiras, migração, homônimo absorvido e limpeza. Regressões v95/v97/v103/v105/v106/v107/v109/v111 passaram. Navegador com save QA separado executou160 rotas no motor real sem exceções; verificou dano/aparo/captura/forma/escudo/save e recarga do personagem após reload. Filtros e catálogo visíveis conferidos. Não é campanha humana longa nem teste auditivo humano. Valores iniciais de equilíbrio.

Integrada v111 remota1f3fa52 (núcleo ao fundo, ondas frontais8/10/12/14 e escala por rank), preservando o trabalho paralelo. game.html é fonte, index gerado, sw v112. Catálogo consultável em outputs/catalogo-completo-v112.html; fontes canônicas tools/catalog111.py, class-catalog111.json e kit111-runtime.js (nomes111 internos estáveis); sync-kit111.py reinjeta runtime antes de build. QA/work ficam locais, não publicar.

## Pendências fora de habilidades/classes

1. Variar encontros, decisões e consequências das investigações do Segundo Despertar; concluir seus capítulos/revelação sem fixar por conta própria origem ou intenção do Narrador.
2. História de ranks e defesa das vilas; expandir reputação regional com consequências de Fendas, reações/serviços/acesso e reparação. Sistemas locais existentes não equivalem ao arco completo.
3. Variedade da torre infinita e progressão longa de conteúdo; playtest de ritmo/recompensas/dificuldade, inclusive novas ondas do núcleo.
4. Identidade/modelos, câmera próxima/zoom e representação3D individual das cinco peças de equipamento.
5. Multiplayer/save em nuvem continuam etapa futura, não implementados nesta entrega; escalar encontros para grupos de níveis diferentes ainda exige desenho.

Encadear três habilidades permanece expansão futura de combate, não implementada aqui. As2.000 falas em60 contextos do Narrador já foram entregues na v107. Próximo foco recomendado: encontros e história da jornada, não mais classes.


## v113 — pontos por nível, inversão e clareza de extração (30/09/2026)
Ian escolheu explicitamente 1 ponto de habilidade por nível, com compensação retroativa. A regra anterior era 1/5 níveis. Migração única por run acrescenta (nível−1−floor(nível/5)); NV17 recebe +13, preservando saldo/recompensas/melhorias existentes. Reencarnação continua zerando os pontos do ciclo; níveis novos dão +1.
Inversão só entra no sorteio de chefes cujo ataque principal é soulrain. Área fixa de 2,5m, aviso de 1,2s, alcance14m e visibilidade; sair/esquivar evita, morte do chefe cancela. Esquiva usa a direção invertida ao iniciar e mantém a trajetória; morte/troca de região limpa o efeito.
Extração: transmissores visualmente distintos, placa ENVIAR CARGA, círculo real de6m e E no mapa; instruções apontam enviar6 espaços, conclusão explícita. Fluxo real de coleta e envio funcionou em QA; não foi reproduzido bloqueio de lógica. Defensores mortos e tempo avançado por fixture para checar conclusão, não teste de equilíbrio. Pequena marca acima da habilidade no print ainda sem identificação segura.
verify-v113 cobre migração1–500, idempotência, inversão/parede/esquiva/morte, envio/tempo/inimigos/conclusão; verify-v112 preserva160 habilidades. Fixture qa-v113.html local, não publicar. Captura outputs/pontos-habilidade-v113.png no workspace.

# 2026-09-30 — v114: investigações próprias do Segundo Despertar

Dez encontros distintos substituem a prova genérica: memórias/Necromante; pulsos/Tempo; bordas em sequência/Tecelão; proteção do Peregrino/Guardião; alternância de distância/Metamorfo; reparos/Artífice; duelo e resposta/Duelista; percurso de condutores/Condutor; vestígio firme/Oráculo; selos com área limpa/Devorador. Usam andar, ataque básico e F, sem exigir habilidades raras. Área de 8m e mínimo de 12s; concluir objetivos e eliminar ameaças são necessários. Abandono, morte, troca de região e morte do protegido cancelam sem consumir o vestígio. Pontos concedidos uma única vez e somente ao vestígio correto. Interação da próxima fissura acompanha sua nova posição.

Três marcos narrativos após as primeiras investigações; 30 falas específicas (3 por caminho), histórico pessoal com até30 registros salvos e últimos6 visíveis na aba A Fissura/Despertar. Nomes das classes não aparecem nas escolhas antes da terceira investigação. Narrador reconhece fatos, sem definir origem/intenção das fissuras. Aprender todas as raras, afinidade, seis espaços e rank independente preservados.

Validação: verify-v114 cobre dez objetivos sem raras no rankF, pulsos/ordem/interrupções, caminhada, penalidade limitada do Oráculo, cancelamento/limpeza, identidade do vestígio, recompensa única e persistência do histórico. Navegador: dez conclusões executadas no motor real com save QA separado, interface verificada, zero erros de console. Não substitui playtest humano de dificuldade. Regressões v109/v112/v113 passaram. Integrada atualização paralela f27aa90 (pontos de habilidade, inversão evitável e orientação de extração). Fonte game.html, index gerado, sw v114; módulo tools/journey113.js e sincronizador sync-journey113.py mantêm sufixo interno113. QA não publicado.

Próximo objetivo: consequências nas cidades e reputação regional, com respostas às ações do jogador. Permanecem o arco maior da história (origem do Narrador não definida), variedade/progressão da torre, playtest de equilíbrio, modelos/câmera/equipamentos3D e multiplayer/save em nuvem futuro. Classes/habilidades do catálogo v112 seguem concluídas; encadeamento de habilidades continua futuro.


## 2026-09-30 — v115: escolha por sensação
Ian corrigiu a apresentação das investigações: títulos/descrições entregavam o caminho e tornavam a escolha forçada. Tela de escolha agora usa Ecos, Instante, Distância, Presença, Mudança, Fragmentos, Reflexo, Impulso, Sinais e Silêncio, com pistas sensoriais breves e botão Aproximar-se. Não mostra objetivos nem classe/afinidade, inclusive após despertar. Instruções práticas e regra de interrupção aparecem após escolher. Encontros, recompensas e saves preservados. verify-v114 passou com verificações atualizadas de não antecipar os caminhos.

## v116 — revisão do Personagem por disponibilidade (30/09/2026)
Feedback de Ian/Irror em seis prints: habilidades expandidas, catálogo bloqueado, passivas não adquiridas, rank sem aba, maestria fora de contexto, títulos redundantes e Build misturando sistemas. Habilidades agora são detalhes recolhidos; abertura persiste ao melhorar. Ataque básico/equipar são botões compactos. Catálogo futuro duplicado removido; habilidades conquistadas surgem na lista, formas preparadas continuam disponíveis para Metamorfo. Maestria em Habilidades só habilita investimento após todas as ativas de classe aprendidas chegarem a10; maestria antiga permanece visível e preservada.
Passivas: somente classes aprendidas, origem, tomos adquiridos e constelações liberadas/possuídas. Rank tem aba própria após E (ou escolhas legadas), filtra escolhas ainda indisponíveis e permanece na aba ao escolher/redistribuir. Build: somente ficha, regeneração e efeitos de equipamento realmente ativos; removido texto genérico de outras classes. Aparência/renascimento disponível no Status; equipamento e arma viva contextualizada na Bolsa; profissões praticadas em Mundo; bestiário/coleção descoberta no Diário. Títulos mostram uma contagem absoluta coerente com uma barra; sem progresso total+neste nível+próximo duplicados e sem catálogo vazio de títulos não adquiridos.
verify-v115: telas iniciais/avançadas, abertura, maestria/guarda da ação, rank/filtro/retorno, passivas possuídas, Build e progresso único; regressões v102/v106/v109/v112/v113. QA de Paladino inicial e avançado, melhoria real mantém detalhe aberto e debita um ponto; escolha de rank permanece na aba; verificação em390px. Arquivo qa-v114 e scripts update114 são locais, não publicar.

Complemento v116: Ian esclareceu que Julgamento perdeu apenas o visual. Restaurado pilar dourado no conjurador e nos alvos válidos, com anel no raio real. Sem alterar dano, cura (continua ausente), custo, recarga ou alcance. Placas 3D ajustam fonte à largura disponível e preservam margem, corrigindo CHEGADA DOS INVASORES truncado. Base remota v114 (830a596/de51455), jornadas distintas e diário do Despertar, integrada e preservada. Teste remoto verify-v114 mantido; revisão de interface em verify-v115.

Base v115 4d636e5 também preservada: escolhas da fissura por sensações sem antecipar caminhos. Versão final desta entrega: v116.

# 2026-09-30 — v117: confiança e recuperação por cidade

Ian autorizou o próximo passo. Nova memória regional persistente em profile.regions116, independente da reputação da Ordem. Cada cidade guarda confiança 0–100, escassez 0–20, últimas8 causas e dia de suprimentos. Fechamento real de portal normal/especial da região +2 confiança e -2 escassez, uma vez pelos controles existentes. Participação por dano do jogador em invasão vencida +12 e limpa escassez; vitória só de guardas limpa escassez sem atribuir ajuda fictícia. Cerco vencido +15; evolução da cidade +5; reconstrução +20. Falha da invasão causa escassez local, não culpa nem perda automática de confiança; sair para se preparar não provoca punição pessoal. Não foram implementados crimes, portões fechados ou arco completo de escolhas negativas.

Confiança20/50/80 concede desconto5/10/15% nas compras que usam priceMul (armas, armaduras, poções comuns). Escassez aplica acréscimo local até20%; fatores multiplicativos com descontos existentes. Karma global anterior preservado como modificador legado, novos eventos não o alteram. profile.abandon antigo migra para escassez20 sem inventar confiança negativa ou feitos passados; zerar escassez limpa o marcador antigo.

Diário, evolução da cidade e lojas dão acesso a Ver região. Moradores/caçadores comentam ajuda ou recuperação. Entrega de 500*(rank+1) ouro e8 cristais reduz escassez5 e concede confiança3, somente enquanto há prejuízo, dentro de cidade ativa e fora de invasão/cerco. Aos50, abastecimento recuperado libera2 poções/dia por cidade, sem repetir ao recarregar. Não bloqueia serviços essenciais. Reconstrução validada por proximidade, cidade caída, inimigos e recursos antes de consumir.

Validação: verify-v116 (sufixo interno) cobre isolamento, legado, limites, custos, localização/morte, recompensa única em fechamentos reais, participação na defesa, apoio diário/save e memória. Regressões v97/v109/v112/v114/v115 passaram. Navegador com perfil/run de QA separados:48→54 confiança,10→0 escassez,5→10% desconto,1000 ouro e16 cristais consumidos,2 poções recebidas, persistência após recarregar e zero erros de console. Sem playtest prolongado de equilíbrio. Print outputs/regiao-v117.png. Integra remote6988ab9 incluindo organização do personagem, pilares do Julgamento e placas; não sobrescreve v115 sensorial. game.html fonte, index gerado, sw117. tools/regions116.js espelha bloco REGIONS116; fixtures QA não publicar.

Próxima frente recomendada: variedade da torre e progressão longa. Reputação ainda pode ganhar missões/arcos regionais e consequências de decisões específicas (crimes/acesso não implementados). História maior/identidade do Narrador continua aberta; câmera/modelos/equipamentos3D, balanceamento e multiplayer/save em nuvem seguem pendentes.


## v118 — extração somente como missão opcional (30/09/2026)
Ian pediu retirar a extração dos portais avulsos do mundo e reservá-la a missões. Agora aparece somente em Ordem → Missões → Extração · missão opcional; iniciar leva direto à expedição. Progresso enviado e conclusão ficam em run.extractMission117, retomáveis pela Ordem. Ouro/reputação são recebidos uma vez, com guarda de localização; carga enviada permanece nos espólios. Coleta e envio usam a interação do cenário, sem o painel longo nem ações cinzentas. Ao completar6, recolhimento/envio deixam de aparecer e inimigos, projéteis e ameaças pendentes são removidos; instabilidade não continua gerando ataques. A saída permanece disponível sem nova defesa obrigatória.
A antiga fatia de extração no sorteio gera Combate: contador dos inimigos iniciais, guardião liberado após eliminá-los e marcado no mapa. Mantidos baús, recompensas, uma saída e60s após o chefe. Núcleo, andares, Caçada e Ruptura continuam existentes. Estado legado de extração em memória é convertido sem duplicar recursos; portais não fazem parte do save, portanto não alegar migração de portais persistidos.
Validação: verify-v117 cobre classificação, chefe único, escala, morte/quebra, missão explícita, cidade, retomada parcial serializada, recompensa única e término de ameaças. Regressões v103/v106/v111/v112/v113/v114/v115 e v116 regional passaram. Navegador com save separado: seis mapas com caminhos para os alvos; combate vermelho, último inimigo, chefe real por dano/fases, saída destrancada e fechamento; missão iniciada pela Ordem, coleta/envio direto e conclusão após12s reais, recompensa440ouro/6reputação e materiais preservados após recarregar. Automação de posicionamento/dano em fixture privada; não representa playtest humano de ritmo. Retomada parcial2/6 após reload também verificada no navegador; captura outputs/extracao-missao-v118.png. Integrada base remota a0d23db/v117 (confiança regional). sw118; fixtures/intermediários não publicar.

# 2026-09-30 — v119: amostra visual Clã Ferrugem

Ian interrompeu a torre e priorizou identidade visual: modelos próprios, famílias coerentes por dungeon/bioma e invocações distinguíveis. Autorizou testar cinco goblins. A torre não foi alterada nesta etapa. Após primeira prévia, pediu formas mais naturais/suaves e apontou arqueiros disparando magia. Revisão aplicada antes de publicar: volumes arredondados, rostos/orelhas orgânicos, equipamentos com bordas suaves, materiais Standard de iluminação contínua e animação procedural própria. Sem modelos/texturas comprados ou serviço gerador3D. Tratar como amostra em avaliação, não direção final aprovada nem remodelagem de todo o jogo.

Família: Guerreiro com facão, Escudeiro com elmo/escudo de tábuas, Arqueiro com arco/aljava, Xamã com cajado/ossos, Bruto de porte maior. Goblin comum antigo usa modelo próprio. Outros quatro entram na amostra temática. Acesso: Lyra/Ordem → Missões → Testar goblins, dentro de cidade. Dungeon no rank atual F–★, layout de7 salas solicitado (geração pode entregar6), primeiro ciclo de inimigos garante cinco tipos, estandartes próprios e chefe goblin bruto. Sem caçadores misturados, Mímicos ou divisão do chefe em orcs. Continua usando paredes/props base existentes; não é cenário totalmente remodelado. Recompensas/risco e saída seguem dungeon normal; protótipo opcional com progresso real, não sandbox invulnerável.

Arqueiro corrigido no ramo real de ataque ranged: flecha física sem trilha mágica, velocidade18, dano/time inimigo preservados; xamã e magos antigos mantêm orbe12. Modelos compartilham geometrias, animam andar/preparar/atacar/morrer; flash de dano/elite compatível. Código canônico tools/goblins118.js, bloco GOBLINS118 em game.html. Galeria pública goblin-preview.html gerada por tools/build-goblin-preview118.py: girar, andar, atacar, frente/costas. A galeria usa luz de apresentação; dungeon usa iluminação do jogo.

Validação: verify-v118 analisa fonte/gerado/galeria, roteamento de flecha/orbe, entrada nos10 ranks e bloqueios fora de cidade/morto/dungeon, família/mimic/chefes. Regressões v112/v113/v116 passaram. Navegador verificou todos os inimigos com modelos próprios, cinco tipos, animação, projéteis reais arrow/orb, chefe/saída e retorno world sem erros. Conclusão acelerada por controles QA, não campanha humana completa. Galeria revisada visualmente; outputs/goblins-suaves-v118.png. sw119, index gerado. QA permanece local.

Próximo: feedback de Ian sobre esta amostra suave; ajustar estilo antes de expandir modelos para pântano, outras famílias, NPCs, personagem e invocações. Torre/longa progressão fica adiada pela mudança explícita de foco.


Publicação final v119 integra e735728 (extração opcional na Ordem/combate no mundo) preservando seus testes e fluxos. Sufixos118 dos modelos são internos.

## v120 — movimentos próprios dos goblins
Ian apontou caminhada/ataque iguais. Cinco coreografias procedurais distintas por papel: guerreiro ágil/corte lateral, escudeiro passos curtos/proteção, arqueiro postura baixa/puxada e soltura, xamã passos lentos/conjuração, bruto balanço pesado/golpe alto. Mesma função na galeria e jogo, tempos de combate preservados. Validados resets de pose e transformações finitas, regressão v118. Próximo: avaliação visual da amostra antes de expandir famílias.


## 2026-09-30 — v121: retorno dos menus e identidade do Viajante
Feedback de Ian/Irror: telas secundárias pareciam desconectadas, fechar obrigava procurar novamente, Títulos desalinhados e Passivas não explicavam de onde vinham os pontos. Ian ampliou: toda tela que leva a outra deve oferecer retorno. Botão VOLTAR no cabeçalho mantém histórico de telas e rolagem; volta reconstruindo a tela com dados atuais. Fechar encerra o menu. Configurações/Controles/Teclas, Diário/subtelas, Personagem, equipamentos/lojas, mapas/portais e exportação usam renderizadores preservados. Rerender não empilha cópias e retornar cancela remapeamento de teclas pendente.
Personagem reabre a última aba/subtela por menu/P/C/Tab, com rolagem, detalhes e filtros na sessão, inclusive após trocar de região. Não é persistência entre reinícios do navegador. Bolsa continua abrindo itens. Títulos usam cards próprios, com nome/ação alinhados, descrição e progresso abaixo; valores e efeitos preservados. Passivas informa saldo, origem e compartilhamento dos pontos com Habilidades. Ian decidiu manter Maestria escondida até cumprir o requisito (maestria legada continua visível). Pontos próprios de passivas são sugestão, não implementados.
Ian pediu retirar “caçador” da apresentação do jogador e autorizou escolher termo coerente. Viajante é o tratamento na chegada/promoção/aparência; Transmigrador continua o nome narrativo de quem vem de outro mundo. Caçadores nativos/contratados preservados. Sem definir escolhido único nem origem do Narrador.
Dungeon de três andares passa a indicar/desenhar descida para avançar e subida para retornar; defensores, destino, posicionamento e torre preservados. Falas do Narrador ajustadas à direção sem inverter avanço/retorno nem IDs históricos.
Validação: verify-ui118 (stack, retorno regenerado, rerender, scroll, fechamento, criação), verify-stairs118 (quatro escadas/cache de geometria/direção/distância/defensores), v115/v116/v106/v114. Integradas v118 de missões de extração e v119 de goblins/flechas, com v117/v118 passando. Navegador QA separado: retorno de dois níveis Configurações→Controles→Teclas; habilidades expandidas e scroll 1167 preservados ao fechar/reabrir; melhoria de Transmigrador debitou 5→4 e retorno mostrou saldo atualizado; títulos sem overflow em 390px. Não é playtest prolongado. Fixtures qa-ui118 e scripts work não publicar.
Próxima frente maior permanece variedade/progressão longa da torre; esta conversa priorizou os ajustes de feedback antes de iniciar essa frente. Fonte game.html; index.html gerado; cache v121. Checkout isolado: C:/Users/irror/Documents/Codex/2026-09-30/leia-o-registro-de-continuidade-do/work/ecos-interface.

Publicação autorizada diretamente por Ian nesta conversa: “pode aprovar”. Integra 4442b73 (movimentos dos goblins v120); esta entrega usa v121 para não repetir a versão de cache.


## 2026-09-30 — v125: cristais por rank
Publicação autorizada por Ian. Veios existentes usam GLB próprio gerado por TripoSR, reduzido a 8.000 triângulos, com pedra e mineral separados. Mineral, partículas e identificação seguem as dez cores RANKS. Carregamento compartilhado, fallback procedural e proteção contra recompensa repetida após esgotamento. Layout, chances e economia preservados. Fonte tools/crystals125.js sincronizada pelo build. Testes verify-crystals125, ecology124 e v118 aprovados; fixture privada no navegador validou mineração nos dez ranks e aparência na dungeon. Fixture não publicada.

## v126 — colisão dos cristais
Ian identificou goblin sobreposto ao cristal. Base sólida de 1,2m mais raio do ator; movimento respeita veios ativos e atores sobrepostos são deslocados ao espaço livre mais próximo, respeitando paredes e outros veios. Esgotamento libera passagem. Teste verify-crystal-collision126 cobre surgimento central, três portes, travessia, esgotamento e veios vizinhos; regressões crystals125/v118 aprovadas.

## v155 (02/10/2026, Claude na nuvem) — pedidos de Ian
- Chão azul corrigido: o shader do terreno usava `snow154`/`mix154` sem declarar (o `sync-environment128.py` do build tinha apagado os atributos). Agora estão em `tools/environment128.js` e `tools/environment-bridge128.js`. **Atenção:** o build regrava blocos do `game.html` a partir de `tools/` (ecology124, habitat-render124, environment128, goblins, kit111); edite sempre o arquivo de `tools/`.
- Portais: sempre 12 a até 200 m do jogador. Longe (>280 m) só deixam de ser desenhados e continuam contando o tempo; voltando, estão lá.
- Portal que fecha sem ser concluído (mesmo longe) solta monstros + chefe. Vila a até 100 m da muralha → marcham e atacam (`RAID155`, defesa 0–100%); em 0 a cidade cai (`profile.raided155`) e usa a reconstrução existente. Sem vila: vagueiam. Morte em portal vermelho solta o chefe. Aster é protegida (decisão provisória, perguntar a Ian). Monstros soltos ficam no mundo (máx. 80).
- Portais de classe rara (`rollRareGate155`): ao entrar, 2% no F até 50% no ★; 10% para cada uma das 10 classes; viram vermelhos. Temas em `RARE_SETS155` (Metamorfo: lobos/raptores/dragões; Necromante: esqueletos/fantasmas/espectros; etc.).
- Chefe solta 1 das 5 peças ao acaso. Sets das 9 classes novas: +6% dano/vida por peça, +15% completo (só na classe dona). Peças 3D só do Metamorfo.
- Set completo (5 vestidas) → botão "Teste de despertar" em Personagem → Build; duelo com o guardião do tema (×2,5 de vida); vencer ensina a classe rara.
- Masmorras escuras como caverna (luz só em volta do herói, véu `#cave155`).
- UI: selo ESCUDO removido; "Poderes" só mostra linhas com conteúdo; equipamento foi para Personagem → Build; Retirar sempre clicável (avisa bolsa cheia); todo botão tem animação ao apertar.
- Pendente: modelos próprios dos chefes (Tripo), ataques temáticos, bônus específicos dos sets, paredes de caverna/câmera baixa, mecânicas do teste de despertar.

## v156–v159 (02/10/2026)
- **v156** (outra sessão): projéteis do Tripo (`models/proj155/`, `tools/proj155.js`) com efeitos de energia; Chuva de Flechas/Meteoros com flechas e meteoros de verdade; arco em pé na palma; linha da mão ao chão do Viajante removida.
- **v157** (outra sessão): troca de equipamento com bolsa cheia, lista de peças na Build, revisão de textos ("masmorra" em vez de "calabouço", Narrador, caixas sempre abertas).
- **v158** (outra sessão): habilidades em caixas de abrir/fechar e textos longos em balão com ⓘ — **Ian reprovou**, corrigido na v159.
- **v159** (Claude na nuvem): habilidades em linha fixa (nome, melhorias, botão) com descrição e próximo nível no balão ao passar o mouse (`skillUpgradeRow`, `tipText155`); caixas sempre abertas, sem clique; balão sem ⓘ; no celular o balão abre ao tocar e some em 5 s. **Regra do Ian: explicação só no balão (tooltip), nunca abrir/fechar no clique.**
- Criado `VERSAO.md` (versão atual + como começar/publicar); o `tools/build.py` atualiza o número sozinho.

## v160 (02/10/2026, Claude)
- Projéteis do **Mago do Raio** (classe 11) e do **Mago da Terra** (classe 10) refeitos no Tripo e ligados em `tools/proj155.js`: raio = cristal azul com descargas elétricas; terra = pedra incandescente com poeira. Substituem os modelos com defeito em `models/proj155/`.
- Os 9 chefes das classes raras foram baixados do Tripo com esqueleto (Mixamo) e ficam em `Entregas/chefes-raros-tripo/` para a próxima etapa.

- v161 (02/10/2026): chefes das classes raras do Tripo com poderes da classe (tools/boss160.js, models/chefes160/).

## v165 (02/10/2026, Claude na nuvem) — feedback do Irror
- Arqueiro: Flecha Enredante agora deixa chefes 25% mais lentos (comuns 50%) e dá crítico garantido também neles; Armadilha pega chefe (sem imobilizar: 25% mais lento por 3s + crítico). Disparo Rápido virou rajada de 3 flechas que atravessam (45% cada, 135% total). Lentidão de chefe = `e.slow` com fator .75 no movimento.
- Anel embaixo do herói não pisca mais (estava no mesmo nível do chão; agora y .12 + polygonOffset).
- Câmera: no PC, arrastar com o botão direito para baixo desce a câmera até a altura do herói (`pcCam.pitch` 0–1), dá para vê-lo de frente girando; botão do meio restaura. No celular, botão 🎥 alterna vista de cima / de frente.
- Mira: `aimPoint` usa o retângulo real do canvas e, com câmera baixa (mouse acima do horizonte), segue a direção do mouse.
- Pendente: barra de vida sobre a cabeça fica alta na câmera baixa.

## v166 (02–03/10/2026, Claude na nuvem) — feedback do Irror
- Barras de vida do chefe pelo rank (`bossBarsFor166`): F 1, E 2, D 3, C 3, B 4, A 4, S 5, SS 6, SS+ 7, ★ 8 (cerco continua 5). Visual (`bossBars166`): barras sobrepostas coloridas; a da frente esvazia e mostra a de trás; bolinhas em cima e "×N" marcam quantas faltam.
- Pousada: o ponto "F · POUSADA" e a placa ficavam ao lado da fonte; agora ficam na porta do prédio no anel (157,5°, 30,5 m).
- Marquinha escura acima da barra de habilidades era o painel `#rare-status103` vazio; agora some quando não tem texto.
- Dúvida aberta do Irror ("caverninhas dinâmicas… entrei no nível 1… agora nível 15") — perguntar o que ele quis dizer.

## v167 (03/10/2026, Claude na nuvem)
- Build → Peças na bolsa: abas por tipo (Todas, Arma, Armadura, Elmo, Luvas, Botas, com contagem), ordenar por Maior bônus / Raridade / Valor (`GEAR166`), e cada peça mostra "▲ +X / ▼ −X ataque|escudo vs. atual".
- Chefes (Ian: "é pra ser assim"): cada barra é vida de verdade — vida do chefe × barras/3 (F 1 barra = 1/3 da vida antiga; ★ 8 barras); portal vermelho +1 barra.
- Caveira sobre monstros (`threat`) já é recalculada a cada quadro pelo nível atual do jogador; some quando você passa do nível do monstro.

## v168 (03/10/2026, Claude na nuvem) — feedback do Irror
- Arco: tiro com pose por código (`aimPose168` em `tools/warrior-player127.js`): braço esquerdo esticado para o alvo com o arco em pé, mão direita puxada até o rosto. Parado, o arco fica ao lado do corpo (`BOWIDLEPOS155=[.11,0,.04]`), sem atravessar perna/mão. A animação do Tripo do arco continua por baixo (só os braços são sobrepostos).
- Monstro acima do seu nível (`levelGap168`, aplicado no 1º quadro): vida × (nível dele ÷ seu nível), dano × (1 + metade disso). Ex.: nível 223 vs 77 → vida ×2,9, dano ×1,95. XP por morte não mudou (subir fica mais lento por tempo).
- Botão 🎥 (vista de frente) agora aparece também no PC.

## v172 (03/10/2026, Claude na nuvem) — juntado com v169–v171 da outra sessão
- **Modelos refinados no Blender** (headless, `bpy` 4.2): 50 modelos do Tripo (set Metamorfo, armas, projéteis, chefes, vendedores, prédios, árvores, pedras) com normais corrigidas, sombreamento suave, oclusão de ambiente gravada na textura, mais contraste/saturação e brilho próprio nas partes saturadas (set 1,5; projéteis 4; armas 3; chefes 2,5; cenário 0). Viajante e modelos KayKit/Quaternius não foram mexidos. Scripts em `tools/blender169/`.
- **Armadura encaixada no corpo** (`tools/blender169/fit.py`): elmo/peitoral pela caixa da cabeça/tronco do Viajante; braçais (antebraço) e grevas (canela) pelo eixo principal da região; pesos copiados do corpo → `models/set153/metamorfo-rig.glb` (peças `set169_h|a|g_r|g_l|b_r|b_l`, 4,2 MB). No jogo (`attachRig169`) as peças são ligadas aos ossos do herói e dobram junto. Roupa do Viajante não é mais escondida (só a cabeça sob o elmo). Arma continua no método antigo.
- **Equilíbrio** (Irror: nível 211 e 15 mi de ouro em 1 h): monstros ~3× vida e ~2,4× dano (`eHP` /7, `eDMG` /45); XP de monstro acima do nível no máx. ×2 (era ×6), bônus de chefe acima do nível no máx. 0,5 nível (era 1,6); `xpNeed` mais íngreme (60+40L+4L^1,8); ouro dos monstros pela metade e menos ainda quando muito acima do seu nível.
- **Despertar novo** (Ian): fissura antiga desligada (`rareOnPortal103` não cria mais; aba vira "Despertar" informativa). Vestir as 5 peças de um chefe → popup DESPERTAR (Aceitar/Recusar). Aceitar → arena com o chefe da classe (vida ×5, dano ×1,6) → prova de replicar: recebe as 3 habilidades da classe por 60 s e precisa usar 2 com sucesso → aprende a classe. Falhar: mantém as peças, revestir para tentar de novo. Recusar: o popup só volta com um set novo (`profile.awDeclined169`).

## v173 (03/10/2026)
- Torre travava ao matar o último inimigo: o portal dourado de subir usava a forma "gring" que só os portais antigos criavam; agora `geo()` tem forma padrão para esses nomes (`GEO_DEF172`).

## v174 (03/10/2026)
- Cajado/varinha/orbe/tomo somam ataque só no dano mágico; armas físicas só no físico (`weaponIsMagic173`, `atkOf`). Texto da arma diz "de ataque mágico/físico".
- Mago sem cajado ataca com a mão (animação `orb`, `animWep173`); com cajado, animação de cajado. Cajado parado fica em pé na mão (`staff174` em `tools/warrior-player127.js`).

## v176 (03/10/2026, Claude na nuvem)
- Armaduras das 10 classes raras refinadas e encaixadas no corpo do Viajante com esqueleto (`models/set153/<id>-rig.glb`, 4–6 MB cada). Elmo maior para a cabeça caber dentro: a cabeça não é mais escondida (rosto aparece em capuzes). Nenhuma roupa é escondida com armadura encaixada. Arma continua no método antigo.

## v177 (03/10/2026, Claude na nuvem) — áudio do Irror
- **Sem "rubber band"**: vida/dano do monstro dependem só do nível dele (removido o fator pelo nível do jogador da v168). Ouro dos monstros continua pela metade.
- **Poderes por nível do monstro** (`tierSetup177/tierShoot177/tierSwing177`, a cada 25 níveis, máx. 8): à distância +1 projétil no 25, +30% velocidade no 50, +1 no 75 e mais a cada 50 níveis (máx. +4); corpo a corpo: golpe duplo no 25, pisão em área avisado no 50, alcance +40% no 75, golpe 25% mais rápido no 100. (Ricochete na parede ainda não feito.)
- **Talentos de rank**: Disparo dividido = projéteis paralelos com dano inteiro (era leque com 40%); Ricochete mantém dano inteiro; novos **Espelho** (2 níveis: para trás, depois para os lados) e **Eco gratuito** (25% de habilidade sem custo nem recarga).
- **Mana**: custo de habilidade = maior entre o custo base e base/60 da mana máxima (`manaCost177`); regeneração 2 + 1,8%/s (era 3 + 3%/s).
- Pendentes do áudio: passivas corpo a corpo; combinar habilidades/classes em sinergia (ex.: fúria + giro); chefes com mais habilidades (o Irror gostou do chefe SS+ com giro e chuva roxa). Sugestão dele: lançar single player e só depois pensar em multiplayer (arena primeiro); anti-cheat é caro — decisão do Ian.

## v178 (03/10/2026, Claude na nuvem) — pendentes do áudio do Irror
- Projéteis de monstro com nível ≥50 ricocheteiam na parede (1 vez; 2 a partir do nível 125) (`wallBounce177`).
- Talentos de rank corpo a corpo: **Golpe espelhado** (acerta atrás também, dano inteiro) e **Onda de choque** (3º golpe solta onda que atravessa; até 3 ondas).
- **Sinergia**: usar uma habilidade diferente até 3 s depois de outra dá +30% de dano a ela (texto "SINERGIA +30%").
- Todo chefe tem pelo menos 3 tipos de ataque (sorteia os que faltam entre sísmico, fúria, chuva de almas, legião).

## v179 (03/10/2026)
- Efeitos de habilidade menos "luminosos" (Ian): rastro luminoso genérico (`Combat139`) só nas classes corpo a corpo; área de habilidade marcada por contorno discreto no chão (`zoneMark178`) no lugar do disco branco aditivo; Chuva de Flechas e de Meteoros sem anel a cada pulso; flechas levantam poeira ao cair (`dustPuff178`); anéis `fxRing` com metade do brilho.

## v180 (03/10/2026)
- Desempenho: recorte de visão por grupo de instâncias do Tripo (`CULL180`) e LOD das árvores (`tripo-carvalho153-lod.glb` etc., ~3 mil triângulos; completa até 40 m, leve de 40 a 100 m). Cidade: 10,5 mi → ~4 mi de triângulos.
- Revisão geral em `docs/revisao180.md`.

## v181 (03/10/2026, Claude na nuvem) — classes corpo a corpo comuns
- **Assassino — Marcas** (até 5 por inimigo, somem após 5 s): golpe básico marca (+1; +2 no 3º golpe). **Execução** gasta as Marcas (+40% de dano cada, até +200%) e, se matar, recarrega o **Passo Sombrio**. **Passo Sombrio** vai para as costas do inimigo mais perto da mira e deixa os golpes nele críticos por 2 s. **Adaga** em alvo com 3+ Marcas lança 3 adagas.
- **Tanque — Firmeza** (0–100, cai após 5 s parado): +15 ao levar golpe, +25 ao aparar, +5 por golpe básico. **Golpe de Escudo** com 50: atordoa à frente por 1,5 s e cura 8%. **Aparo**: golpe aparado volta com 150% do dano. **Passo Pesado** com 30: tremor que atordoa por 1 s a até 4 m.
- **Guerreiro**: **Fôlego** gasta a Fúria (+1% de cura por ponto); **Varredura** com 40 de Fúria causa dano e atordoa 1 s.
- Código em `tools/kit111-runtime.js` (`cm181*`), ganchos no `hurtEnemy` (`cm154Basic(o,e)`) e no `hurtPlayer` (`cm181Hurt`). Barras de Firmeza e Marcas no mesmo painel da Fúria.
- Armadura substituindo a roupa (corpo base): rascunho em `tools/blender169/fit2.py` e `wip-set-visual181.patch`, **não publicado**, aguardando o Ian.

## v182 (03/10/2026, Claude na nuvem)
- **Armadura substitui a roupa** (aprovado pelo pedido do Ian de corrigir encaixes): mangas, casaco, cachecol e calça somem onde há peça; corpo base justo escuro (`base169_*`) por baixo. Braçais no braço e antebraço presos só ao osso (não cruzam mais), greva na canela dobrando no joelho, elmo com escala uniforme envolvendo a cabeça (`tools/blender169/fit2.py`). Condutor (sem peitoral) mantém a roupa no tronco.
- Efeitos de combate atrasados (golpe duplo, projéteis extras, pisão, ondas, rajada) seguem o relógio do jogo: param na pausa e somem ao trocar de área (`later181`).
- Famílias: aranha prende com teia (lento 1,5 s), esqueletos às vezes arremessam osso, lobo uiva e chama a matilha (`familySwing182`).
- LOD também para muralha, paliçada e casas.

## v183
- Fendas instáveis: afixos vamp/elite/rage, até 3 afixos no rank 6+, +25% XP por afixo.
- Relíquias únicas de chefe (UNIQ183): vamp, thorns, echo, cdr (-12% recarga), swift (-25% esquiva), soul.
- v184: relíquias em espaço próprio (2, no perfil, repetida vira ouro); níveis de ameaça Lobo/Tigre/Demônio/Dragão/Deus em monstros e chefes de masmorra (por rank do portal).
- v185: botas só +15% velocidade; missões (exigência, clone, núcleo) dão Bênção da Fenda (+15% dano, +8% velocidade, 10-15 min) em vez de ponto de habilidade; ameaça: Presságio/Calamidade/Eclipse/Abismo, mults suavizados após teste; chefe guarda o nível no portal e monstros da quebra mantêm ameaça.
- v186: 9 níveis de ameaça (Ameaça, Flagelo, Devastação, Catástrofe, Cataclismo, Apocalipse, Aniquilação, Extinção, Divindade) com aura animada; sorteio em cadeia pelo rank.
- v187: morte verdadeira (newRun; mantém profile: rank, despertar, banco, casa; relíquias somem); Pergaminho de Ressurgimento (run.rez187, 5000 ouro, máx 3, loja de poções); rank ★ na prova da Ordem exige classe rara despertada (starReady187).
- v188: prédios KayKit (doorRot188, +90°) e casa Tripo (+90°) giram para a porta olhar para a praça.
- v189: lua nasce longe (antes ficava no chão da praça até o 1º update); recorte de visão mais largo (árvores não tapam o herói); paredes de masmorra viram rocha facetada (habitat-rock188).
- v190: cofre de relíquias (relicVault190, só na cidade): guardada não se perde na morte e fica sem efeito. docs/ideias-melhorias.md com a lista viva.
- v191: materiais Tripo em DoubleSide (paredes de torres/casas/taverna tinham buracos).
- v192: aviso ao entrar em portal perigoso sem pergaminho; túmulo (profile.grave192) devolve 20% do ouro uma vez.
- v193: 3º espaço de relíquia no rank ★ (relicSlots192); título Matador de Deuses (profile.godKills192, +6% dano).
- v194: avisos em pop-up no topo (popNews194) e depois nas Notícias; despertar abre ao equipar a 5ª peça; Divindade só em portal ★ vermelho (~6% dos chefes, por ascensão).
- v195: arma nas costas ao correr (sheath195 em tools/warrior-player127.js, carregado à parte: subir ?v= no game.html); ao parar saca (braço ao ombro) e segura 3 s; atacar/habilidade/mirar saca na hora.
- v196: relógio do mundo (dayT, vida do portal, bênção) usa tempo real até 1 s/quadro (WDT196); combate segue limitado a .05.
- v197: espada nas costas com o cabo para cima no ombro direito e lâmina para baixo.
- v198: semana de jogo = 7 dias de jogo (weekId por dayT): chefe semanal, Fim do Mundo (1 semana em 3), cidades caindo por dia de jogo; estações de 7 dias de jogo; aviso ao virar a semana (weekTick198).
- v199: arco atravessado nas costas; adaga na cintura (m.kind195); testado espada, adaga, machado, cajado, arco, lança.
- v200: DOOR188 padrão 0 (prédios Tripo já têm porta na frente); loja de armaduras -90°. Taverna, guilda, poções, forja e armaduras conferidas de frente.
- v201: LOD de árvores mais apertado (completa só d<16 com raio*.2); mesh novo começa na versão leve. Medido: 6,7–10,5 mi → 1,6–4,6 mi triângulos.
- v202: ranking da torre por semana de jogo (towerWeek202): 5 rivais por semana, prêmio em ouro por posição na virada.
- v203: diário de caça (profile.hunt203, contado em killEnemy) na aba da guilda; marcos 10/50/200 por nível dão ouro e +0,5% de dano.
- v204: relíquias sobem de nível (100 abates, máx 5, +20%/nível, relicM204); cofre 1 sem casa, 2+móveis/2 (máx 6).
- v205: Fim do Mundo manda uma horda por dia de jogo para a cidade a até 150 m do jogador (hordeTick205, usa raid155; Aster fica fora).
- v206: textos de história curtos (lore206, uma vez cada): peso da ameaça, Divindade = pedaço do Arquiteto, pergaminho da capela, "o mundo esquece quem cai".
- v207: portal com nível fixo (lvl207: rank alto acompanha o nível do jogador, ★ pode passar); dunLvl usa o nível do portal. Torre sem "continuar" e recorde zera na morte. Muralha removida (pontos devolvidos); constelações novas: Caçador, Vento, Sangue, Sombra.
- v208: monstros/chefe do rompimento com o nível do portal (dunScale com lvo); teste de visual cartunesco (toon208, filtro de cor) em Configurações → Tela.
- v209: visual cartunesco ligado por padrão (brilho 1.01 para o deserto não estourar).
- v210: teste de contorno (casca invertida) em jogador, monstros e aliados; Configurações → Tela (pds_outline210, desligado por padrão).
- v211: contorno ligado por padrão; sombra em faixas (MeshToon com 3 tons, celAdd211) em monstros/aliados sem textura; modelos com textura (Tripo, jogador) ficam para a próxima etapa.
- v212: sombra em faixas em todos os materiais iluminados (aomap_fragment, reload para desligar); troca toon pula materiais com shader próprio; contorno de esqueleto aplicado depois da pele (corrige casca roxa no jogador); texto da tela inicial com a morte nova.
- v213: bônus do rank cresce com o nível até o nível do rank; Bênção da Fenda vira velocidade + 1% vida/s (sem dano); diária sem penalidade.
- v214: bônus do rank começa em 50% no nível 1 e chega a 100% no nível do rank; sequência de diárias de 7 dias (profile.streak214): bênção, ouro, pergaminho, ouro x2, bênção longa, pergaminho, relíquia nova.
- v215: cidades a ~0,8–1,5 km (REG 20); perigo esticado (26*REG/6); ataques a cidades só andam/avisam/derrubam com o jogador a até 500 m (RAIDNEAR215); aviso de rompimento longe vai só para as Notícias.
- v216: ataque a cidade longe continua simulado (dano 5x mais lento, sem pop-up); se cair, vai para Notícias e os monstros ficam na cidade para o jogador reconstruir.
- v217: mundo em camadas: REG 30 (cidades 1,6–2,4 km, sorteadas perto do centro da região), capitais a cada 5×5 regiões (~9–10 km, cityL mín. 4, nome "Capital ..."), postos de estrada (outpostAt217: fogueira descansa, mascate = loja de poções), Carroça da Ordem em cada cidade (viagem paga a cidades visitadas, profile.visited217).
- v218: falas dos chefes (BOSSL218: aggro/fúria/poder/morte por família, despertar e Divindade) no balão e nas Notícias; falas das relíquias ao cair; caçadores-monstro do Clã Ferrugem nos postos (FRIENDS217, fora da lista de inimigos, conversam).
- v219: mana regenera 1%/s+1 (era 1,8%+2); habilidade custa no mínimo 10% da barra; recarga com piso de 45%; carroça só por distância (150+220·km^1,35); loja de armaduras volta a ser o prédio de pedra (sem torre de defesa); escolhas de rank novas: Sede de sangue, Toque gélido, Faísca em cadeia, Égide.
- v220: segundo ciclo da história (LORE act8–act12, storyCh220): Clã Ferrugem (1ª conversa), Capitais e Pedras-Âncora (1ª capital), Pedaços de Deus (1ª Divindade), Mão do Arquiteto (Portal Primordial), O Narrador (rank ★ após act10).
- v221: Fenda da Âncora: capital caída abre portal vermelho gigante no centro (anchorTick221, rank+1, nunca expira); reconstrução bloqueada até fechar (profile.anchorShut221, limpo ao reconstruir).
- v222: Fenda da Âncora guarda pedaço do Arquiteto (PIECES222: braços, pernas, tronco, cabeça), nível ???, ameaça Extinção/Divindade, vida x2,5, falas próprias. Proposta do despertar em docs/arquiteto-despertar.md.
- v223: Despertar do Arquiteto: 5 capitais (caps223) guardam os pedaços; aviso global ao romper + HUD k/5; com 5 rompidas ele nasce e marcha a 1,6 m/s para Aster (profile.arch223); se chegar a 55 m de Aster = FIM DO CICLO (apaga perfil e run, conta pds_cycles); se morrer = relíquias, 1 mi de ouro, título Quem Fechou a Porta, Ato XIII.
- v224: Divindade é o nível máximo; pedaços do Arquiteto sempre Divindade; o Arquiteto tem nível próprio "???" (THREAT184[10], acima de tudo), modelo Devorador de 9 m escurecido.
- v225: níveis acima da Divindade: Supremo (pedaços do Arquiteto, THREAT184[11]) e Inefável (o Arquiteto, [10]); Absoluto e Uno reservados para a história.
- v226: níveis de ameaça com nomes dos nove coros celestes: Anjo, Arcanjo, Principado, Potestade, Virtude, Dominação, Trono, Querubim, Serafim; acima: Supremo e Inefável.
- v227: níveis de ameaça renomeados (sem anjos): Sombra, Legião, Praga, Dilúvio, Babel, Leviatã, Behemoth, Apocalipse, Logos; acima: Supremo e Inefável.

- v228: nomes de ameaça voltaram ao original (Ameaça…Divindade), mantendo Supremo e Inefável acima.
- v229: nomes de ameaça originais restaurados de fato (Ameaça…Divindade; v228 saiu sem a troca), Supremo e Inefável acima.
- v230–232: cristais desenhados (prismas translúcidos) no núcleo e veios; centro da cidade = coluna de ponta quadrada com esfera de plasma (selo); cidade caída: fonte quebrada, coluna partida, chão rachado; ruptura com câmera de cinema, explosão da esfera e pulso de 400 m (mata monstros comuns, 20% em chefes, 30% no jogador, arranca árvores Tripo); anel dourado flutuante removido.
- v233: nomes Sombra…Logos de volta; selo da fonte = fenda pequena (Rift131) com anel; todos os portais abrem como o Tecelão (Rift131.open); árvores do pulso carbonizadas (instanceColor) em vez de sumir; juice233 (balanço/inclinação/avanço/tranco) em chefes e elites; docs/arquiteto-visual.md.
- v234: voltou o pilar de ponta quadrada com a esfera de plasma no centro das cidades (a pedido do Ian).
- v235: correntes na esfera do selo (3 anéis girando + 4 correntes do pilar; chains234).
- v236: fonte refeita (basin236): bacia octogonal de pedra escura, borda e runas roxas, água violeta pulsando; pilar escurecido para combinar.
- v237: água da fonte = shader do lago de pesca (Water154) em tom violeta.
- v238: barracas da praça afastadas da fonte (Z+10,5); Ato X real (godCalm237: ★ vermelho 2% por 3 dias de jogo após vencer Logos); página "A Âncora Rompida"; lista de caçadores-monstro limpa ao sair da área; revisão: sintaxe ok, testes geral/postos/Arquiteto/Fenda ok.
- v239: água no mundo: lagos (lakeAt239, 4% dos pedaços, longe de cidade/estrada, pesca, colisão) e rios serpenteando a cada 2 regiões entre cidades (riverCenter239), pontes onde estradas cruzam; árvores/pedras/flores/capim fora da água. Final: Narrador e Clã NÃO entram na batalha. Arte do Arquiteto em docs/arquiteto-conceito.png.
- v240: rios por bioma (neve/cristal = gelo andável, deserto/vulcão = seco), estrada passa por cima do rio com mureta de pedra (água cortada sob a estrada); lagos congelados na neve.
- v241: rio contínuo com congelamento/degelo gradual (aFD por vértice a partir de snowB; riverMat240: geada, rachaduras, brilho), seca perto do deserto; lago congelado usa o mesmo gelo; no gelo o herói desliza (iceMove240).
- v242: Arquiteto modelado no Blender (models/arquiteto242.glb, tools/blender242/arquiteto.py) com animações idle/andar/golpe1/golpe2/morte; substitui o Devorador.
- v243: árvores balançam com vento (rajadas, fase por árvore, folhas tremem); folhas caindo, borboletas de dia e vaga-lumes à noite perto do jogador (life243).
- v244: grama se abre ao passar (ENV_PUSH244), pássaros (bando no alto + grupo no chão que foge), poeira nos passos e respingos na água (life244), personagem inclina nas curvas/olha em volta parado (alive244), sombras de nuvens no chão (tools/environment128.js).
- v245: relevo do mundo (tools/terrain245.js): altura aplicada no vertex shader de todos os materiais (project_vertex/worldpos + acessor em Material.onBeforeCompile); cidades/estradas/lagos planos via uniforms (ter245tick), rios em vales; JS terrH(x,z) para câmera, mira e rótulos. Lógica do jogo segue em y=0.
- v246: Arquiteto = modelo do Ian (Tripo) com esqueleto/pesos/animações feitos no Blender (tools/blender246/rig_arquiteto.py, fonte em tools/blender246/arquiteto-fonte-tripo.glb) → models/arquiteto246.glb (textura 1024). R = punho gigante, L = compasso.
- v247: rig do Arquiteto corrigido: peças inteiras por osso (ilhas soldadas por posição), regras por lado (punho/compasso/pernas), transição suave peito↔braço, corte de triângulos que ligavam punho↔pé e perna↔perna; golpe do punho mais curto.
- v248: Arquiteto no estilo da arte do Ian (archMat247): toon 3 tons + recolor da textura em paleta (pedra azulada, dourado, roxo emissivo, máscara branca) e contorno 3,2x mais grosso.
- v249: Arquiteto com juntas de plasma da fenda (plasmaOrb231) presas aos ossos dos ombros, cotovelos e pulsos.
- v250: peças do Arquiteto como esferas do dragão (piece250): âncora rompida → peça foge 3–12 km; fechar Fenda não prende; achar e derrotar ([Supremo], fragmento real do modelo) tranca; HUD com distância/direção; 5 soltas → junção (joinCine250) na capital da última e marcha para Aster. Juntas com líquido da fenda (goo250) e rachaduras azul-violeta.
- v251: missões (Exigência, clone, histórias) não dão mais pontos: dão Bênção da Fenda (+ouro na Exigência). Junções rosas do Arquiteto viram líquido animado da fenda (shader no archMat247); bolhas das juntas removidas.


## Balanceamento local de classes, XP e economia — 05/10/2026

Ian pediu pesquisa e autorizou a escolha/implementação do balanceamento pela IA. `tools/balance-rpg.js` centraliza crescimento de 21 classes e recompensa por nível próprio, ameaça, papel, espécie e risco. Curva de custo preservada; HUD mostra XP atual/necessário/falta. IDs de ameaça preservados: ordem semântica 0..9, 11 Supremo, 10 Inefável. Rival e chefe recebem XP uma vez; somas legadas de recompensa deixam de definir o pagamento. `tools/economy154.js` usa H=400 como unidade de projeto, IPC local 0,8–1,3, oferta/demanda e impostos com tesouro, sem inflação por riqueza individual. Missões, cidade, cerco, ruínas e caravana recalibrados; juros uma vez/dia e revenda sem arbitragem. Testes 1..2000 e 810 combinações comerciais aprovados; inicialização e abates reais no Edge sem erros. **Alteração local sobre v251, não publicada; não houve campanha longa/FPS ou build Unreal.** Entrega e evidências no cofre: `Projetos/Solo RPG/Entregas/Balanceamento-Classes-Ameaca-XP-2026-10-05/Balanceamento-v3/README.md`.

## v252 — balanceamento, cajado, maldições e relevo — 05/10/2026

Ian autorizou aplicar as correções no jogo principal de navegador. Esta versão integra o balanceamento descrito acima; Guerreiro ganha mais vida/ataque físico e menos mana/ataque mágico que os magos; nível próprio e ameaça definem XP/ouro separadamente. HUD mostra progresso e XP restante. Cajado lança magia pela ponta visível e sem arma os ataques mágicos usam a mão com intervalo 60% maior. Reduzir capacidade por maldição também penaliza a reserva atual; retirar equipamento não recupera vida/mana. Contorno de corpo/equipamento reduzido para 4 mm; GLBs de cenário e Rogue preservam texturas/rig e removem faces degeneradas.

Relevo deforma somente o chão. Personagens, criaturas e equipamentos compartilham a altura da raiz, e objetos de cenário em lote recebem altura pelo ponto de apoio de cada item; instâncias usam a origem individual. Projéteis/rastros preservam a altura visual do lançamento sem aplicar o relevo novamente durante o voo. Atualização do cache para pds-v252 e versões de scripts compatíveis. Nenhum reset de save, novo EXE ou mudança na Unreal.


## v259 - Vida e dano das criaturas - 05/10/2026

Balanceamento integrado sobre main v258, preservando narrativa, relevo e correções anteriores. tools/monster-balance.js usa referência fixa por nível próprio derivada das 20 classes atuais, espécie e ciclo completo do ataque. Ameaças/IDs e regras de geração preservados. Elites contabilizam resistência dentro da vida efetiva, preservam ferimentos e não repetem promoção. Chefes têm orçamento próprio e mantêm barras de vida. Nível mostrado coincide com o nível da curva; removidos +3/+5 artificiais de elite/chefe. Fórmulas de XP/ouro permanecem; recompensas usam o nível coerente. Reaplicar escala ao mesmo nível não acumula bônus; torre usa essa rotina.

Testes e relatório na entrega Vida-Dano-Monstros-2026-10-05 do cofre. Sem reset de save ou alterações da Unreal. Valores de design escolhidos pela IA; equilíbrio de campanha e combinações extremas ainda exigem playtest. A preparação anterior em cópia v251 foi identificada como base incorreta e não publicada.


## XP por desafio e missões — v263, 05/10/2026

Ian pediu que enfrentar inimigos mais fortes compense e autorizou corrigir o sistema, incluindo XP nas missões conforme dificuldade e duração esperada. Vida efetiva e barras agora remuneram o esforço adicional de chefes/especiais, mantendo nível próprio, ameaça e os pisos de XP anteriores. Sem penalizar diferença de nível do jogador. Missões da Ordem, extração, Oráculo, diárias e quatro histórias recebem XP adicional, preservando prêmios existentes; base do contrato salva e sem incentivo a esperar. Diária com recibo de XP por dia no perfil. Corrigido conflito entre marcos narrativos por nível e estados de histórias, com migração dos dados disponíveis. Parâmetros e limites em docs/xp-por-desafio-v263.md. Valores escolhidos pela IA; ritmo real ainda precisa de playtest.

## v267 — portais acessíveis no começo
Pedido do Ian: portais de rank acima do jogador nascem mais longe das cidades (+25 m por rank acima, até +100 m, sempre a menos de 200 m do jogador para não quebrar a reposição). Sempre há ao menos 2 portais do rank do jogador ou abaixo. O sorteio de rank da v153 continua. Teste no navegador (NV 1, rank F): 12 portais estáveis, os F a 96–167 m de Aster, de A até SS+ a ~195 m. Removidos 40 scripts antigos de `tools/verify-*` que não rodavam mais.
Ainda na v267 (pedido do Ian: mais coisas caras do rank C em diante, menos a ideia de cosméticos). Novo `tools/lux267.js`, carregado depois do `economy154.js`. Preços em H do rank (C = 5.600):
- **Relíquias regionais** (aba Cidade da Ordem): uma por cidade, 6 H, exige 50 de confiança. Permanentes, não usam espaço de relíquia e não se perdem na morte. Oito efeitos: dano, vida, XP, ouro, velocidade, mana, escudo, defesa.
- **Investimento na cidade**: 5 níveis por cidade, 2 H × (nível+1)^1,5. Cada nível dá −3% nos preços daquela cidade e +5 de confiança.
- **Cômodos de luxo na casa**: sala de treino (+4% dano, 4 H), biblioteca (+5% XP, 6 H), cofre reforçado (+2 no cofre de relíquias, 5 H), jardim de mana (+8% vida e mana, 4 H).
- **Encantamento** dos equipados: +3% de qualidade por nível, até +20; 0,25 H do rank da peça × 1,3^nível.
- **Mercenários de elite**: 1 (1,5 H) ou 2 (2,5 H) caçadores do seu rank, NV +3, na próxima masmorra.
- **Portal encomendado**: rank de (seu −2) até (seu +1), 1,2 H do rank do portal, aberto perto de você.
Celular (Ian: "travado ou lento"): no toque não há antialias; LEVE vira o padrão até o jogador escolher HD; LEVE usa resolução 0,75 no celular e o HUD em 1x; a resolução cai sozinha até 60% quando o FPS fica abaixo de 30 e volta quando passa de 55. Testado em navegador (PC 1280×720 e celular 390×844 com toque): compras, efeitos, mercenários entrando na masmorra, portal encomendado; sem erros de console. Sem teste em celular real.


## v318 — Dracônico sem armadura — 07/10/2026
Mob dragao usa modelo próprio m_draconico318.glb (18.080 triângulos, textura 2048, 21 ossos e 8 clipes). Mascote dragao mantém modelo anterior. Garra/cauda têm preparação, alcance e acerto único; ataque à distância preservado. Build idempotente e sintaxe passaram; 8 cenários de alcance/morte/congelamento, reação ao dano e preservação do pet passaram em Chromium isolado. Inspeção visual em poses no motor; sem benchmark de FPS ou campanha longa. Textura procedural e pesos automáticos são primeira iteração, não aprovação estética de Ian. Armaduras excluídas: outra sessão cria referências; aguardar para 3D/encaixes. Fontes e validações: https://drive.google.com/drive/folders/149RlfYBoaI6YehqenWGwOAqD-9n4qK30 .

- v319: pose final de morte do Dracônico mantida sem retornar ao primeiro quadro; teste de morte prolongada adicionado.


## v322 — Dracônico: textura da referência aprovada

Substituído models/m_draconico318.glb pelo export Blender v011 da projeção v008 aprovada por Ian. GameUV único em TEXCOORD_0 e sem normal derivada da imagem de cor, compatível com o carregador atual. 21 ossos e oito clipes preservados; corrigidos os eixos de deslocamento da queda para eliminar a suspensão do corpo. Combate e variantes Fendida/Abissal testados em Chromium isolado; mascote continua no modelo dragao. Nenhuma mudança em saves ou balanceamento. Armaduras TripoSG continuam candidatas no Drive: elmo menor requer revisão de cabelo/encaixe e materiais; não publicar o piloto procedural antigo. Fontes e provas: https://drive.google.com/drive/folders/1Tb7vOq-UQGP34xLDPzL3QiNfTajmNbCC .

## v332 — XP de missão sem salto na morte e Conspirar — 08/10/2026

Pedido de Ian (texto colado no chat, pedia v330; a numeração já estava em v331 na main, então saiu como v332).

**XP de missão.** Antes: a morte volta o nível para 1 mas o ranque fica; a missão da Ordem era orçada pelo nível do ranque (`GR[rank].lvl`), então uma entrega de ranque alto pagava 80 a 150 mil de XP no nível 1.
- `RpgBalance.questXpAt(budget, level)`: o XP é recalculado pelo nível atual de quem entrega, toda vez que é mostrado ou pago (`questXpNow332` dentro de `questBudget262` e `storyBudget262`). O orçamento guardado continua com o nível do ranque para alvo mínimo, ouro e reputação.
- `RpgBalance.questXpCap`: em `xpAwardAmount262`, toda fonte `'quest'` (quadro da Ordem, extração, diária, exigência, histórias, campanha v327, fenda corrompida) enche no máximo a barra do nível atual: sobe 1 nível e o excesso é descartado. XP de monstro não muda.
- `clearMissionsOnDeath332()` em `die()`: apaga quadro, extração, exigência e diária. O `newRun()` já zerava; agora é explícito e não depende do que entrar em `keep`. A campanha (`profile.camp327`) não é apagada: é progresso de história e já pagava pelo nível do jogador.
- Texto novo no quadro da Lyra, no Diário e no aviso de recompensa (`QUEST_XP_RULE332`): "O XP concedido pela Ordem é calibrado pelo nível atual do Transmigrador e possui limite de 1 avanço de nível por entrega." O pedido dizia "Associação"; no jogo o nome é Ordem.

**Conspirar (`tools/conspiracy332.js`).** Monstro comum (não chefe, não rival) que dá 3 golpes corpo a corpo seguidos sem tirar vida nem escudo do jogador chama os da mesma facção (mesmo `group`, mesma família de `FAMILIES124` ou mesma espécie) a até 8,5 m dele. Precisa de 2 ou mais. Eles recuam, param de atacar e canalizam 1,8 s com círculo vermelho de 3,2 m onde o jogador estava e fala em balão.
- Dano em dois canais separados: físico = soma dos ataques físicos − (Resistência + metade da Vontade − soma da penetração física); mágico igual com Espírito. Perfis Arcano e Espectral contam como mágicos, o resto como físico. "Metade da Vontade" é o `uni` de `pDefNums296` (que inclui o Tomo da Pele de Ferro). O total entra por `hurtPlayer` com a defesa em número desligada (já foi descontada); esquiva, escudos, guarda e defesa percentual continuam valendo.
- Sair do círculo evita o golpe. Atingir 2 conspiradores em 0,2 s (dano em área) ou um golpe com atordoamento de 0,5 s ou mais quebra a formação ("A formação quebrou!"); sobrar menos de 2 também. Recarga de 8 s depois do golpe e 10 s depois de quebrada.
- Golpes de projétil não contam para o gatilho (não têm atacante no momento do impacto), mas atiradores entram na formação.
- Dica na página "Tática · Conspiração" do Diário (abre na primeira vez), aviso na primeira vez e no texto do Bestiário. O jogo não tem tela de dicas de carregamento, então isso não foi criado.

**Passivas.** Só conferência: 12 passivas do nível 3 ao 50 e 10 do 55 ao 100 estão no código. A lista continua mostrando só as liberadas, sem cadeado, como Ian decidiu em 08/10 (v328); o pedido de mostrar cadeado e nível não foi aplicado por contradizer essa decisão.

Testes: `node tools/verify-v332.cjs` (11 verificações) e jogo local: 5 missões de ranque SS+ entregues no nível 1 deram 1 nível cada; morte apagou as missões; conspiração com 3 Goblins Guerreiros disparou, causou o dano calculado, quebrou por área e por atordoamento, não acertou fora do círculo. `tools/verify-v320.cjs` já falhava antes desta versão (`passiveCrit327` não existe no ambiente de teste dele).

## v333 — Conspirar refeito a pedido de Ian — 08/10/2026

Correções de Ian no chat sobre a v332: sem círculo; os monstros vêm e atacam juntos tentando acertar; só quem acerta entra no cálculo; tiro soma igual a corpo a corpo; sem recarga, porque eles já sabem que sozinhos não ferem. Chefes e rivais continuam fora.
- `tools/conspiracy333.js` substitui `conspiracy332.js`. Fases: `gather` (1,8 s: continuam vindo com o AI normal, mas com o ataque segurado; anel vermelho pulsando em cada um) e `strike` (até 2,4 s: todos soltam o ataque normal ao mesmo tempo).
- Cada golpe de conspirador que acerta entra numa soma (`addHit`); o jogador recebe só a diferença entre a soma nova e o que já recebeu. Um só acertando = 0. Esquiva (invulnerável) não conta como acerto. O tipo (físico/mágico) vem do próprio golpe (`inDType281`), não mais do perfil do monstro.
- Tiro e área de monstro agora têm dono: `shoot` marca `owner333` no projétil e o jogo põe `window.projOwner333` ao aplicar o dano (projétil e `hazard`). Com isso tiro conta para os 3 golpes sem dano e para a soma.
- Depois da primeira conspiração o grupo (`knows333`) volta a conspirar em seguida, sem precisar de mais 3 golpes, enquanto houver 2 ou mais perto (14 m) e em combate. Quebrar a formação (área ou atordoamento, só na fase de preparo) atrasa 2,5 s.
- Entram os da mesma facção a até 8,5 m de quem chamou ou do jogador (atiradores ficam espalhados).
- A página do Diário continua com a chave `conspira332`.

Testes: `node tools/verify-v333.cjs` (12 verificações) e jogo local: 3 goblins acertando = 19 de dano conjunto; 2 acertando = 2; 1 acertando = 0; esquiva = 0; guerreiro + arqueiro somaram; 2 arqueiros dispararam a conspiração só com tiro; área e atordoamento quebraram e o grupo voltou em 2,5 s; monstro sozinho não conspira.

## v335 — Conspirar: a formação não quebra — 08/10/2026

Correção de Ian no chat: a formação não deve ser quebrada, porque o jogador pode atacar os monstros sem parar. Removida de `tools/conspiracy333.js` a quebra por dano em área e por atordoamento (e a fala "A formação quebrou!"). A conspiração só acaba se sobrar menos de 2 conspiradores; quem fica volta a atacar sozinho. Um monstro atordoado só atrasa o próprio golpe, pelas regras normais. Dica do Diário e do Bestiário reescrita sem "interrompa-os". Teste no jogo: 59 golpes em área com atordoamento durante o preparo e o golpe conjunto saiu igual (3 acertaram, 19 de dano); matando 2 de 3 a conspiração acabou.


## v336 — armadura Ferro/Comum nova no corpo do Viajante — 08/10/2026
Ian aprovou o peitoral v025 ("aprovado, pode continuar nessa linha, fazer as outras de ferro comum e publicar"). Peças de rank Ferro e raridade Comum (tier 0, rar 0, sem conjunto) dos slots a/g/b passam a usar models/equipment332/armor-F-common.glb: peitoral em casca do corpo com saiote e ombreiras TripoSG (malhas eq331_a_*), braçais (eq331_g_*) e grevas (eq331_b_*), todos ligados aos ossos do herói pelo nome (tools/set-visual153.js, função armor332; publicado como v336 porque outras sessões publicaram v332–v335 no intervalo; o teste no motor foi feito sobre a v331). O elmo continua o v323. Com o peitoral, além de tripo_part_0/3, somem tripo_part_1/2 (mangas e capinha) e tripo_part_11 (saia da túnica), e entra o braço-base base169_g se não houver braçal. Outras raridades, ranks e conjuntos continuam no caminho antigo (comum-*.glb pintado). O material é clareado no carregador (menos metal, textura sem decodificação sRGB, cor ×1,25) porque o jogo não aplica gama na saída e o ferro saía quase preto.
Teste em Chromium isolado no motor real, zero erros de página: conjunto inteiro, só peitoral, só braçal, só greva, peitoral Raro (modelo antigo), tirar tudo (roupa original volta) e equipar-e-tirar antes de carregar (nada sobra). Poses parado, corrida e ataque conferidas por captura. Limites: braço erguido acima do ombro atravessa a ombreira; sobra pele serrilhada perto do cotovelo; sem medição de FPS nem teste em celular. Só o visual do peitoral v025 foi aprovado por Ian; braçais e grevas seguem o mesmo método e ainda não foram vistos por ele no jogo. Fontes e provas: https://drive.google.com/drive/folders/1Tb7vOq-UQGP34xLDPzL3QiNfTajmNbCC (Claude-armadura-F-comum-v026.*).


## v340 — armadura Ferro/Comum: cor e textura como na referência — 08/10/2026
Ian, vendo a v336 no jogo: "ficou meio feio essa cor; deixar a textura e a cor igual à referência; as grevas não encaixaram direito". Três erros do GLB da v336, todos invisíveis no Blender e visíveis no three r128: (1) o nó Bump saía como mapa normal feito da própria textura de cor — manchas claras/pretas; (2) cor base ~0,2 e metal 0,35 sem reflexo de ambiente — quase preto; (3) o peitoral tinha dois mapas UV e o jogo usava o primeiro — saiote e faixas pretas. GLB reexportado em models/equipment340/armor-F-common.glb (pasta nova para não vir do cache) com material só de cor, um UV por malha e sem cor por vértice; braçais e grevas refeitos centrados na bota e na faixa do antebraço. Carregador (armor332 em tools/set-visual153.js): sem mapa normal, metal 0, cor base branca, textura sem decodificação sRGB; o torso-base não entra mais por baixo do peitoral (atravessava a casca). Conferido no jogo real (cópia local, câmera e luz do jogo, de dia e de noite): conjunto inteiro, só peitoral, braçal+greva, peitoral Raro no caminho antigo, tirar tudo e equipar-e-tirar rápido; zero erros de página. Lição: a cena de prova com luzes próprias da v336 escondeu os três erros; prova de equipamento só vale tirada do quadro do próprio jogo. O elmo v323 continua escuro (mesma causa de gama); não foi mexido.


## v351 — textos, bestiário e correções de jogo — 13/10/2026
Ian autorizou publicar. Textos de atributos, recursos, missões e avisos encurtados; bestiário e mapa ampliados. A ficha compara ameaças reais (Comum a Inefável) no mesmo nível, sem usar o ranque do jogador. Corrigidos persistência/efeitos do Ressurgimento, deslocamento de ataque sobre pedras, alvo urbano das invasões e fuga de moradores. Rios com curvas e largura variável; barcos e rotinas visuais de pescadores, lenhadores e mineradores com retorno à cidade. Mineradores ainda trabalham junto às Fendas, não dentro das instâncias. Bioma marinho adiado a pedido de Ian.
Desempenho: luzes em quantidade fixa e retenção limitada de materiais evitam recompilar efeitos a cada golpe; HUD limitado a 10 atualizações/s. Comparação de 25 s encontrou 79 compilações sem retenção e 2 com retenção; latências variaram, portanto não comprova eliminação de todas as pausas. Portal circular flutuante da captura antiga ainda não reproduzido.
Validação: 13 verificações funcionais no navegador, seletor de ameaça, zero erros de página e zero overflow horizontal em 1365px/390px; teste de ecologia e build repetido estável. Integração preserva v348–v350, incluindo a Gosma Espinhosa.


## v352 — explicações curtas em todos os tooltips revisados — 13/10/2026
Ian reforçou que tooltips e descrições devem dizer o efeito de forma simples, como em RPGs, sem fórmulas internas nem texto desconexo. Reescritos atributos, ficha de combate, recursos, itens/conjuntos, avisos de configuração, recompensas e confiança. Habilidades: efeito, dano, custo e recarga; a próxima melhoria aparece no botão Melhorar. Removidas instruções repetidas da barra de habilidades e o atributo genérico incorreto nos golpes à distância. Encurtadas as 28 técnicas de classes316 e esclarecidos efeitos vagos dos caminhos raros. Não houve alteração das fórmulas de combate.
Validação: auditoria de 443 entradas de habilidades e 51 tooltips de menus, sem undefined/NaN/efeitos desconhecidos; hover de atributo/habilidade, botão de melhoria separado, ficha em 390px sem overflow, zero erros de página. Build repetido idêntico. Referência de linguagem: guia oficial de atributos de Elden Ring (Bandai Namco); mecânicas continuam sendo as do Primeva.


## v353 — saque no corpo, bolsas e poderes de chefes — 13/10/2026
Pedido de Ian: escolher os drops no corpo em vez de receber tudo; bolsa inicial de 25 espaços, melhorias por rank/nível; manter absorção de chefes para todas as classes e colocar botões 1–3 quadrados acima das habilidades.
Ouro, equipamentos, materiais, núcleos, poções e livros soltos por monstros ficam em registros de saque. Aproximar e usar F/Vasculhar abre seleção individual. XP/progresso continuam na morte; baús mantêm sua interação anterior. Bolsa cheia não vende nem remove drops do corpo. Saques do mundo ficam salvos na jornada; os de masmorras valem só para a visita (aviso na janela). Até 32 corpos próximos são reconstruídos visualmente; os registros restantes são preservados. Gravações de mortes são agrupadas a cada 0,5s para evitar uma escrita por monstro.
Bolsas são permanentes no perfil, para equipamentos; materiais/consumíveis continuam separados. Mercado: 30/F/NV5/800; 40/E/8/2000; 50/D/20/4800; 60/C/35/11200; 75/B/55/24000; 90/A/80/56000; 110/S/120/128000; 135/SS/180/304000; 165/SS+/220/480000; 200/★/260/720000 ouro. São preços iniciais de implementação, proporcionais à economia existente, não balanceamento aprovado por Ian. Compra exige rank e nível, cobra preço total e não exige comprar as anteriores.
Validação: 18 verificações em navegador desktop e com toque: coleta escolhida, não duplicação, capacidade, bloqueios de compra, preservação de save, persistência/recriação dos drops e drop real de equipamento de masmorra. Botões quadrados acima da barra e dentro da tela; zero erros de página. Capturas conferidas. Fontes: pedido de Ian e código atual v352.
## v354 — Cavaleiro Escaravelho (13/10/2026)
- Modelo Tripo com frente/costas/lado, carapaça de bronze, seis patas; rig Blender local (15 ossos, oito clipes), sem rig pago. Substitui o cavaleiro humano da espécie escaravelho; monarca preservado.
- Patrulha reta; detecta lâminas metálicas ou brilho de raridade no equipamento de alvos válidos até 10 m. Aviso usa wind existente; investida a 12 m/s, direção fixada no aviso, até 12 m, para em obstáculo/contato. Um dano base por investida; HP/dano/XP/raio/recarga existentes preservados. Reage a dano e provocação. Não é simulação óptica de todo objeto brilhante do cenário.
- 19 verificações no jogo local: modelo, brilho/ausência, patrulha, aviso, trajetória, esquiva, recuperação, dano único, atordoamento, congelamento, morte e obstáculos. Oito clipes x 21 amostras no Three r128, todas as malhas, sem coordenadas inválidas/penetração do chão; reimportação Blender aprovada tecnicamente.
- Alterações v351/v352/v353 da outra conversa incorporadas. Avaliação visual da IA, ainda sem aprovação criativa de Ian; celular não testado.


## v355 — bônus especiais e peças faltantes dos conjuntos — 13/10/2026
Pedido de Ian: preservar a utilidade das relíquias e completar o conjunto próprio de cada chefe raro. Equipamentos comuns deixam de sortear afixos; afixos e passivas gravadas antigos ficam inativos e ocultos fora dos conjuntos de classes raras. A forja só grava passivas nesses conjuntos. Ataque/escudo, aprimoramentos, bônus básicos de conjuntos e relíquias permanecem. Os dados antigos dos itens são preservados no save.
Chefes de classes raras escolhem uma posição ainda ausente do próprio conjunto, contando bolsa, equipado, baú da casa e recompensas ainda no chão. Ao completar as cinco posições, voltam a sortear dentro do mesmo conjunto. A peça fica em um saque junto ao baú, sem conversão em ouro por bolsa cheia; continua valendo o aviso de que saques abandonados somem ao sair da masmorra. Baús comuns mantêm o comportamento anterior.
Validação: geração de 500 itens comuns, itens antigos sem efeitos especiais, exceção rara/forja, relíquias independentes, sequência de cinco peças, posse na casa/bolsa/equipado, conjunto diferente, bolsa cheia e todos os dez conjuntos. Build repetido estável e teste no navegador. Integra a v354 do escaravelho sem alterar seus arquivos.


## v356 — navegação junto ao minimapa e avisos discretos — 13/10/2026
Pedido de Ian: reduzir a faixa de cidades/portais e posicioná-la acima do minimapa; organizar mensagens por relevância e tempo de leitura. Indicador compacto alinhado ao mapa, cidade curta e distâncias em duas linhas. Objetivos de masmorra completos continuam disponíveis no indicador com rolagem se necessário. No celular, mapa e botão de câmera ficam abaixo do indicador; histórico deixa de sobrepor a ficha.
Avisos saem do topo central e aparecem na lateral, um de cada vez. Perigos/desbloqueios conhecidos têm prioridade e ao menos 10 segundos; mensagens ambientais do narrador e afinidade/reputação vão somente ao histórico. Mensagens não reconhecidas continuam aparecendo. Tempo cresce com palavras até 24 segundos; leitura pausa com ponteiro/foco e quando a aba/menu está oculto. Fechar e Reler no histórico ficam disponíveis. Todos os textos seguem no histórico, inclusive avisos que excedem a fila. Mensagens dentro de menus mantêm o retorno no próprio menu.
Validação em Edge desktop e toque 390×844: posicionamento, prioridade, repetição, histórico, texto desconhecido, tempo de leitura e ausência de overflow/erros. Mantidos os demais sistemas e preferências de histórico existentes.


## v357 — ataques em pedras, salto relativo e som de nível — 13/10/2026
Ian ainda não conseguia atacar nas pedras; pediu salto de 1,3 m relativo ao apoio e obstáculos sólidos no chão. Encontrado projétil colidindo com a pedra como se estivesse no solo. worldFree agora aceita a altura absoluta do tiro; colisão e apoio consideram relevo no ponto do obstáculo. Mira automática sem mouse ajusta a inclinação para alvos abaixo/acima; tiros inimigos também usam altura do alvo. Efeito do ataque corpo a corpo acompanha a altura dos pés.
Salto integra gravidade com altura de 1,3 m sobre o ponto de partida. Movimento elevado preserva a altitude absoluta; só pousa em topos alcançados, sem teleporte vertical para rocha alta. Troncos usam uma sequência de colisores conforme dimensões/rotação; tocos, pedras decorativas, barris, caixas grandes e pilhas de madeira/pedra passam a colidir. São obstáculos sólidos, não foi criado sistema de destruição/coleta para esses objetos. Colisão continua aproximada, sem simulação de corpos rígidos.
Novo pedido no mesmo trabalho: subir nível sem pop-up de pontos. Mensagem fica no histórico, pontos e cura preservados; fanfarra própria levelup357 com volume de síntese maior, respeitando volume/mudo do jogador. Toca uma vez por concessão de XP, sem sobrepor sons se ganhar vários níveis juntos. Desbloqueios e provas de rank mantêm avisos próprios.
23 verificações no motor real: flecha/magia/adaga em pedra, acerto real com mira automática e corpo a corpo, salto 1,2 m entre apoios, limite de altura, queda, relevo, tronco real, obstáculos altos e pontos/histórico/som de nível. Sem erros de página. Build repetido estável. Volume percebido no aparelho de Ian ainda depende das configurações dele.


## v358 — família Escaravelho: animações e variantes próprias
- Padrão: preparo com apoio traseiro, recuo no impacto, queda lateral com recolhimento sequencial das patas. Fendido: placas/crista articuladas e colapso frontal. Abissal: duas carapaças e quatro cristais independentes, cristais recolhem e carapaças caem na morte.
- Modelos Tripo próprios de três vistas para escaravelho_f/a, rig Blender local, oito clipes por modelo. Sem adereços genéricos duplicados. Preparo/impacto sincronizados aos tempos existentes; HP/dano/XP preservados. Variantes reagem sem exigir equipamento brilhante.
- Cadáveres dessa família completam o clipe antes de encerrar atualização e retornam na pose final quando o saque é reconstruído. Teste local da família em tools/test_beetle_family358.py.
- Revisão criativa solicitada por Ian; demais cinco famílias anteriores ainda pendentes de revisão e modelos próprios das variantes. Não declarar lote inteiro concluído.


## v360 — família Slime Rosa
- Padrão com sete pétalas controladas separadamente e colapso em sequência. Fendido: membranas tensionadas e abertura dos lóbulos no ataque. Abissal: arco vazado, quatro cristais rígidos, ondulação e fechamento do arco na morte. Dois modelos Tripo próprios, três vistas; rig e animações Blender, sem rig pago.
- Padrão pacífico sozinho, reage a dano, grupo cerca; variantes agressivas sozinhas. Sufocamento dividido em três contatos interrompíveis por distância/visibilidade/atordoamento/congelamento. HP/XP e dano nominal do ciclo preservados.
- Quinze clipes checados no Three r128; 21 verificações de combate, morte e saque no jogo local. Arquivos editáveis e comparação ficam no Drive. Demais quatro famílias ainda pendentes da revisão solicitada.


## v361 — revisão técnica e acampamentos fora da estrada — 13/10/2026
Ian pediu revisão do código e corrigir barracas muito próximas ou sobre estradas. Acampamentos antes eram sorteados por chunk independentemente, com deslocamento fixo +9/+9. Agora procuram a lateral da estrada (centro a 28m), reservam corredor livre, evitam água/ruínas/cidades e só permanecem se vencerem uma seleção determinística de vizinhança com distância mínima de 320m. A posição de limpeza da vegetação, objetos, NPC e interações usa o mesmo ponto. Cache limitado e invalidado por semente; ordem de carregamento não altera os locais. Estradas e progresso do jogador preservados; postos naturais podem mudar de posição ao carregar a atualização.
Outro defeito corrigido: hrem deixava listas vazias no HASH após descarregar obstáculos. Agora elimina a célula quando o último colisor sai, evitando crescimento de chaves vazias durante exploração.
Auditoria: 95 scripts JavaScript e 8 blocos inline sem erro de sintaxe; referências locais de scripts presentes no Git. Ecologia passou. 89 verificações funcionais: 15 de distribuição/limpeza, 18 de saque/bolsas, 16 de conjuntos/relíquias, 17 de HUD e 23 de física/nível. Três sementes, 15.123 células consultadas e 67 postos encontrados, menor separação 324,86m; zero postos na faixa reservada e mesmos resultados com ordem inversa. Sem erros de página nos cenários testados. Build repetido idêntico. Esta revisão cobre esses caminhos executados e a sintaxe dos scripts; não prova ausência de todos os erros possíveis nem substitui teste prolongado no aparelho de Ian. Preservadas v358–v360 das famílias Escaravelho/Slime.


## v362 — clareira de acampamento entre chunks — 13/10/2026
Complemento da revisão v361: a área livre ao redor de um acampamento é respeitada também pelos chunks vizinhos. Como o posto agora fica na lateral da estrada, sua clareira pode atravessar a borda do chunk; sem consultar os vizinhos, árvores poderiam reaparecer junto à barraca. Não altera seleção nem distância entre postos.

## v363 — família Gosma Verde, 13/10/2026
- Padrão, Fendida e Abissal com modelos próprios e sete clipes por forma. Bolsas se comprimem e drenam em sequência; Fendida tensiona pontes cristalinas; Abissal ondula e recolhe quatro cristais. Tripo multivista: 120 créditos nas duas variantes, sem rig pago.
- Três fragmentos por forma, fechados e animados. Fendida mantém ligações rígidas; Abissal mantém fios. Divisão e reunião noturna preservam vida e recompensa únicas.
- 44 verificações de mecânica no jogo local; 84 clipes (inteiros e fragmentos), 21 amostras por clipe no Three r128. Correção individual de chão em fragmento abissal. Celular não testado; aprovação criativa de Ian pendente.

## v366 — família Cogumelinho, 13/10/2026
- Padrão com bordas do chapéu articuladas, tropeço e queda lateral; Fendido abre lado cristalino e tomba para frente; Abissal ondula lamelas, recolhe chapéu e dispersa quatro cristais. Rigs 9/10/13 ossos e cinco clipes por forma.
- Tripo Fendido gerou olho no chapéu: reconstruído no Blender a partir da anatomia válida e cristal texturizado recuperado. Abissal completado de um para quatro cristais. Duas gerações de 60 créditos, sem rig pago.
- Variantes usam modelos próprios, aproximam-se para nuvem sinalizada de dano nominal e sono; Fendido busca alvo com mana. Padrão conserva fuga e esporos defensivos. Congelamento/atordoamento/morte interrompem emissão, sair do raio evita acerto.
- 50 verificações no jogo local, 15 clipes × 21 amostras Three r128, GLBs reimportados. Celular não testado, aprovação criativa pendente.


## v509 — habilidades de Guerreiro, Assassino e Tanque — 21/10/2026
As 27 ativas restantes receberam peças da demo, impactos nos alvos reais e seis movimentos no esqueleto. As 30 dessas três classes estão cobertas com o lote anterior; as 40 dos quatro magos também. Preservados dano, cura, defesa, recursos, recarga e deslocamento. Normal/leve, equivalência, combos, saque, troca gráfica e limpeza verificados. Publicação automática autorizada por Ian nesta conversa. Prévia, fonte incremental e relatório: https://drive.google.com/drive/folders/1Z0-TGo6xs_yj8kfRH9QXOMU09kfvLWdL
Continuam pendentes as outras habilidades de Arqueiro, Paladino, Invocador, Monge, Lâmina Arcana, Lanceiro e Berserker, além das classes raras.

## Diretriz Mestre de World Design e Escala Visual — Skyrim × Primeva (21/10/2026)
- Pedido de Ian: unificação completa da análise do vídeo "Depois de 15 ANOS eu FINALMENTE entendi SKYRIM" (Taozen) com a lore canônica de Primeva (O Manuscrito Completo), o PROMPT-MESTRE-ORIGINAL.md do Estúdio Visual e a Seção 11 de "PRIMEVA — Ideias Futuras".
- Documento Mestre gerado e sincronizado: docs/COMO-TEM-QUE-SER-O-MUNDO-SKYRIM.md e espelhado no Google Drive na pasta Estudio-Visual-Primeva-Skyrim (1pL1iP24kxwmfVIOvDXV2ETjkACQ34qeu) e Registros-da-IA (1DYIYOjJSMZCdh7nZ1epi-KO3lcbj8m4x).
- Pilares integrados ao jogo:
  1. Oclusão e Quebra de Linhas de Visão: relevo em desfiladeiro e garganta fechando a visão a cada 120-150m em terrain245.js para destruir o "efeito maquete" dos 100 km² e valorizar marcos emoldurados (Muralha de Aster, Farol de Thalor, Picos de Ymiria).
  2. Proporção Vertical 3x: coníferas e falésias de 15–25m de altura, diminuindo o Viajante (2,05m) e forçando a câmera de baixo para cima.
  3. Matriz de 7 Categorias de Missões × 8 Gatilhos Orgânicos: Campanha das 5 Âncoras ativa sem punir por desviar; 4 Ordens (Vanguarda, Círculo Alquímico, Artífices de Aço/Ferrugem, Rede de Caravanas); Guerra Civil Guardiões vs Despertadores; Altares dos Primeiros Viajantes (Daédricas) com as Coroas dos 10 Sets Raros.
  4. Nós de Encontros Aleatórios (World Encounter Nodes): 80 a 120 pontos invisíveis nas 6 Rotas Reais sorteando eventos por nível/semente com carroça e a pé (encontros502.js).
  5. Efeito Blackreach: Abóbada Primordial (Cap. 27 do Manuscrito) como subsolo colossal de coral branco sob o continente.
  6. Quadro Técnico dos 5 Especialistas (Arte, Geometria, Shaders/PBR, Biomas e Performance) consolidado como diretriz de execução obrigatória.
