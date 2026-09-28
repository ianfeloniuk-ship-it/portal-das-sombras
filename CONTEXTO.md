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
- Teclas configuráveis no PC (menu ⚙ → Configurar teclas), salvas em `pds_keys`.

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
