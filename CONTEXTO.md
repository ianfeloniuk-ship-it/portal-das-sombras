# Contexto do projeto Ecos da Fenda (antigo Portal das Sombras) (para outra conversa/IA continuar)

Autor e decisões: **Ian**. Jogo RPG de ação 3D no navegador, com foco em PC e suporte a celular, ambientado nas Fendas e ecos de mundos mortos. Nomes, personagens e termos são originais do projeto — não usar nomes, falas ou termos marcantes de obras existentes. A identidade atual é **Ecos da Fenda**, com a ação **ERGUER ECO**; os registros históricos abaixo descrevem versões anteriores.
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
