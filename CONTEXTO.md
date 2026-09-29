# Contexto do projeto Portal das Sombras (para outra conversa/IA continuar)

Autor e decisões: **Ian**. Jogo RPG de ação 3D no navegador, do gênero caçadores/portais/sombras (fantasia de 'dungeon' moderna). Nomes, personagens e termos são originais do projeto — não usar nomes, falas ou termos marcantes de obras existentes (ex.: não usar "ARISE"; a ação é **ERGUER SOMBRA**).
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
