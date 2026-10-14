# Regras para qualquer IA neste repositório (ChatGPT/Codex, Claude, outras)

Jogo **Primeva** (web). Dono: Ian. Regra decidida por Ian em 14/10/2026 — **obrigatória** para toda IA que for mexer aqui.

## Obrigatório antes de qualquer mudança
1. **Leia e siga `docs/skills/primeva-codigo.md`** (skill "primeva-codigo"). Não comece a editar sem ela.
2. Leia o topo de `CONTEXTO.md` (últimas versões) e `src/LEIA-ME.md` (mapa das partes do código).
3. Pegue a versão mais nova de `main` antes de editar e de novo antes de publicar (outras IAs publicam em paralelo).

## Resumo das regras da skill
- O script principal mora em **`src/core/`** (68 partes). Edite **só a parte do pedido**; nunca o bloco principal do `game.html`. Sistemas novos vão em arquivo próprio em `tools/`.
- **Partes ligadas:** mudou número, nome, tecla ou regra → procure o valor antigo e o nome em todo o código (`src/core/`, `tools/`, textos de campanha) e atualize dicas, descrições, avisos, narrador e janelas que falam disso. Diga a Ian o que mudou por tabela. Em dúvida de história/design, pergunte.
- Monte com `python tools/build.py` (suba `pds-vN` no `sw.js` antes); `python tools/core_parts.py check` tem que dar `ok`.
- Teste o pedido **e** o que está ao lado (andar, atacar, a janela mexida) antes de publicar. Sem teste, não publique.
- Registre no topo do `CONTEXTO.md`: pedido, o que mudou, partes ligadas, teste.
