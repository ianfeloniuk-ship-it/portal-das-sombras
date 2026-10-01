# Versão 152 — saída de fenda corrigida

- Corrige a paleta do portal de saída: dourado quando aberto e vermelho enquanto bloqueado.
- Corrige o rótulo visual que dizia “SAÍDA” enquanto a superfície ainda usava a cor violeta de uma fenda comum.
- Preserva a entrada de uma fenda comum quando o jogador sai da dungeon sem derrotar o guardião; ela continua reentravel enquanto o cronômetro não zerar.
- Mantém a saída da fenda vermelha trancada até a conclusão. Ao morrer dentro dela, a regra existente rompe a entrada e libera as consequências no mundo.
- Conserva o fechamento com colapso e queda dos fragmentos para a fenda concluída, sem fechar a entrada comum quando o jogador apenas recua.

## Verificação

- `python tools/build.py` gerou `index.html` com a versão 152.
- As verificações locais v144, v145 e estados de combate passaram.
- Checagem direta confirmou as regras de reentrada comum, bloqueio/vermelha na morte e as duas chamadas de paleta da saída.
- `git diff --check` passou.
