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
