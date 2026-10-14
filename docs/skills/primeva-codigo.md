---
name: primeva-codigo
description: Mexer no código do jogo web Primeva (repo ianfeloniuk-ship-it/portal-das-sombras) — mapa das partes, onde fica cada coisa (mecânica, texto, interface, mundo), regra de partes ligadas para um pedido não quebrar outra coisa, teste e publicação. Use antes de qualquer correção ou pedido no jogo web.
---

# Código do Primeva — como mexer sem trazer bug novo

Pedido de Ian (14/10/2026): cada pedido mexe só na parte certa; nada muda por tabela. Mas se uma mecânica muda, os textos que a explicam mudam junto.

## 1. Pegar a versão atual
- Fonte oficial: GitHub `ianfeloniuk-ship-it/portal-das-sombras`, branch `main` (outras sessões publicam em paralelo).
- Clone/pull numa pasta temporária (ex.: `%TEMP%\prim`), nunca nas pastas antigas do cofre. `git fetch` de novo logo antes de publicar.
- Leia o topo do `CONTEXTO.md` (últimas versões) e `src/LEIA-ME.md` (mapa das partes).

## 2. Achar a parte certa
O script principal fica em `src/core/NNN-nome.js` (68 partes, ordem em `manifest.json`). Sistemas novos ficam em `tools/xxxNNN.js` (carregados no fim do `game.html`).

| Pedido sobre… | Onde olhar primeiro |
|---|---|
| Números, regras, classes, habilidades, itens (dados) | `030-dados.js`, blocos `catalog111`, `runtime111`, `tools/classes316.js`, `tools/balance-rpg.js` |
| Jogador, movimento, salto, colisão | `160-jogador.js`, `170-colisao.js`, `400-loop.js`, `tools/witcher377.js`, `tools/climb383.js` |
| Combate, dano, projéteis | `360-combate.js`, `380-acoes.js`, `tools/projectiles253.js`, `tools/combat139.js` |
| Monstros / IA | `390-ia.js`, `300-entidades.js`, `tools/bestiary*.js` |
| Mundo, relevo, clima, dia/noite | `250-mundo-infinito.js`, `540-estacoes.js`, `tools/terrain245.js`, `tools/rain387.js` |
| Masmorras | `270-masmorra-procedural.js`, `440-instancias-especiais.js` |
| HUD, minimapa, barras | `410-overlay-e-hud.js`, `tools/hud356.js` |
| Janelas, menus, lojas, save | `620-janelas.js`, `450-oraculos…`, `640-telas.js` |
| Teclas e controles | `630-controles.js`, `tools/witcher377.js` |
| Textos do narrador, missões, história | `320-missoes.js`, bloco `journey113`, `historia-campanha.js`, `narrativa-campanha.js`, `tools/campaign327.js` |
| Visual 3D, shaders, efeitos | `190-cenario-3d…`, `340-efeitos-visuais…`, `tools/shaders312.js`, `tools/vfx302.js`, `tools/vfx328.js` |

Use `grep` pelo nome da função ou texto que aparece na tela para confirmar. Mexa **só** nas partes do pedido.

## 3. Regra das partes ligadas (obrigatória)
Depois de mudar um número, nome, tecla ou regra:
1. Busque o valor antigo, o nome e as palavras-chave em **todo** o código: `grep -rn` em `src/core/`, `tools/*.js`, `historia-campanha.js`, `narrativa-campanha.js`.
2. Atualize junto: dicas do mouse (`data-tip154`, `tip`), descrições (`d:`, `brief260`), toasts, narrador, janela de status, tela de teclas, `CONTEXTO.md`.
3. Liste para Ian o que foi mudado por estar ligado (ex.: "o texto da loja dizia 14 de Estamina, atualizei para 20").
4. Se a ligação for duvidosa (texto de história, decisão de design), pergunte em vez de mudar.

## 4. Editar e montar
- Edite a parte em `src/core/` (ou o módulo em `tools/`). Não edite o bloco principal do `game.html`.
- Use substituições exatas (Edit ou Python com `assert count==1`). Não reescreva arquivos inteiros. Cuidado: `\n` em Python dentro de heredoc vira quebra de linha real no JS; confira com `node --check`.
- Arquivo novo em `tools/`: inclua `<script src="tools/x.js?v=N">` no `game.html` e use versão nova no `?v=` (o service worker guarda cache).
- Suba a versão em `sw.js` (`pds-vN`) e rode `python tools/build.py` (monta as partes, syncs, `index.html`). `python tools/core_parts.py check` deve dar `ok`.

## 5. Testar antes de publicar
- Sintaxe: extraia os `<script>` inline e rode `node --check`; `node --check` em cada `tools/*.js` mexido.
- Navegador: launch config `primeva-v383` (porta 8783, serve `%TEMP%\prim`). Título → CONTINUAR (ou novo Guerreiro). Painel escondido: troque `requestAnimationFrame` por `setTimeout` e chame `frame(performance.now())`. Veja `read_console_messages` com erros.
- Teste o fluxo pedido **e** um teste rápido do que estava ao lado (andar, atacar, abrir a janela tocada).
- Print quando for visual.

## 6. Publicar e registrar
- Ian deu permissão permanente para publicar correções e pedidos testados no jogo web.
- Nota no topo do `CONTEXTO.md` (pedido, o que mudou, partes ligadas, teste). Commit com `-c user.name=ianfeloniuk-ship-it -c user.email=ianfeloniuk@gmail.com`, `git push origin HEAD:main`. Confira com `curl` o `sw.js` do site.
- Diga a Ian o que entrou, o que foi testado e o que não deu para testar.

## Lições
- Linhas THREE (`Line`, `LineSegments`) não aparecem com o shader do relevo: use malhas finas (`InstancedMesh`).
- Relevo: `terrH(x,z)` no CPU tem que bater com `terrH245` no GLSL (`tools/terrain245.js`); mude os dois juntos.
- O `game.html` local fica em CRLF (autocrlf); o repositório em LF.
