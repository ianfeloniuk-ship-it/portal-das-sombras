# Revisão geral — v180 (03/10/2026, Claude)

Medido numa sessão automática (mundo → masmorra → combate → torre → mundo): **0 erros no console**. Save pequeno (perfil ~2,6 KB, vida ~0,9 KB).

## Corrigido nesta versão
- **Desempenho:** a cidade desenhava **10,5 milhões de triângulos** por quadro, quase tudo carvalhos do Tripo (12,7 mil triângulos cada, centenas na tela). Agora: recorte de visão por grupo (`CULL180`) e LOD das árvores (`tripo-*-lod.glb`, ~3 mil triângulos; completa até 40 m, leve de 40 a 100 m, nada além, onde a névoa já cobre). Resultado medido: **~4 milhões** (−60%).

## Código — o que melhorar (por prioridade)
1. **Duas fontes da verdade.** O build regrava partes do `game.html` a partir de `tools/` (ecologia, ambiente, goblins, kit). Já se perdeu trabalho 3 vezes por editar só o `game.html`. Ideal: o `game.html` carregar esses arquivos com `<script src>` em vez de colar o conteúdo.
2. **`game.html` com 7,7 MB, sendo 6,7 MB de dados embutidos em texto (36 blocos base64).** Atrasa abrir o jogo e o celular sofre para ler. Ideal: mover para arquivos em `models/` (o service worker guarda em cache).
3. **Funções "remendadas" em camadas.** Há 12 funções sobrescritas por cima (ex.: `useSkill` está embrulhada 3 vezes: despertar, sinergia, eco gratuito). Funciona, mas fica frágil. Ideal: um sistema de ganchos (eventos "ao usar habilidade", "ao acertar") num lugar só.
4. **9 `setInterval` e vários `setTimeout` de combate** (golpe duplo e projéteis extras dos monstros, pisão, ondas). Eles continuam correndo com o jogo pausado e não acompanham a câmera lenta. Ideal: tudo dentro do laço de quadros, com `dt`.
5. **Nomes com versão** (617 identificadores tipo `algo153`, `algo168`). Dificulta achar o que está ativo. Uma limpeza aos poucos ajudaria.
6. **Testes automáticos antigos** (55 `verify-*.cjs`, vários desatualizados; o `verify-v98` falha há tempos). Ideal: 5–6 testes de fumaça atuais (abrir, criar personagem, entrar em portal, matar chefe, torre, despertar) rodando antes de publicar.
7. **Texturas acumulam** entre áreas (101 → 160 numa sessão curta). Vazamento pequeno, mas cresce em sessões longas.
8. **Muralha do Tripo** ainda pesa (~750 mil triângulos na cidade) — dá para fazer LOD igual às árvores.
9. **Duas sessões publicando ao mesmo tempo** causaram conflitos de versão (v169, v175). O `VERSAO.md` ajuda; vale combinar quem publica.

## Jogo — o que melhorar
- **Fim de jogo:** o Irror chegou ao nível 400 e "zerou" em ~1 h. Precisa de metas longas: modificadores de masmorra (afixos que mudam regras), corrida de chefes, caça a itens raros com afixos, ranking da torre, temporadas.
- **Builds:** estratégia dominante é só ataque básico + maestria. Sinergia (+30%), mana relevante e talentos novos ajudam; falta testar e dar a cada classe 1–2 combinações fortes (ex.: Fúria + Giro do Guerreiro).
- **Monstros:** poderes a cada 25 níveis e ricochete já entraram. Próximo: avisos visuais claros antes de cada ataque forte e variações por família (aranha que prende, esqueleto que solta ossos).
- **Chefes:** todos têm 3+ tipos de ataque agora; os de classe rara têm modelo próprio. Falta fase 2/3 com mudança de padrão para chefes comuns.
- **Armaduras no corpo** (ver prancha `armaduras-v176`): capuzes deixam um pouco de cabelo para fora (Mago do Tempo, Guardião, Oráculo); grevas do Duelista com discos grandes; Condutor sem peitoral; braçais pequenos. Armas ainda no método antigo (presas na mão, sem ajuste no Blender).
- **Efeitos de habilidade:** v179 limpou brilhos genéricos; falta uma passada classe por classe.
- **Celular:** com o LOD melhora; ainda vale reduzir sombras e resolução no modo LEVE automaticamente quando a taxa de quadros cair.
- **Multiplayer:** recomendação do Irror (e minha): lançar single player; depois arena PvP; mundo aberto online só bem depois.
