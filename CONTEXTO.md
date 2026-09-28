# Contexto do projeto Portal das Sombras (para outra conversa/IA continuar)

Autor e decisões: **Ian**. Jogo RPG de ação 3D no navegador, inspirado em Solo Leveling (caçadores, portais, sombras).
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
- Save do PC fica no navegador do PC; levar progresso via Exportar/Importar save.

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
