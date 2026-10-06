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

# Contexto do projeto Hollow Rank (antes Ecos da Fenda / Portal das Sombras) (para outra conversa/IA continuar)

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
