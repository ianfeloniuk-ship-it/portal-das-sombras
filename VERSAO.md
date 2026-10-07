# Hollow Rank — versão atual do jogo

**Versão do código: <!--v-->v315<!--/v-->** · site: https://ianfeloniuk-ship-it.github.io/portal-das-sombras/
(este número é atualizado sozinho pelo `python3 tools/build.py`, a partir do `sw.js`)

## Antes de mexer no jogo (qualquer IA, PC ou nuvem)
1. **Parta sempre da branch `main` do GitHub** (`git pull origin main`). Ela é a única versão oficial.
   Cópias locais antigas (ex.: `Entregas/Remodelagem-Web-Tripo-2026-10-01/jogo`, pastas do Codex, `release-*`)
   podem estar atrasadas — não edite nem publique a partir delas sem antes trazer a `main`.
2. Confira a versão: o número em `sw.js` (`pds-vN`) tem que ser igual ao desta página.
3. Leia o `CONTEXTO.md` (decisões do Ian e o que cada versão fez).

## Como publicar
1. Edite `game.html`. Partes que vêm de `tools/` (blocos ECOLOGY124, ENVIRONMENT128, GOBLINS, KIT111) são
   **regravadas pelo build**: edite o arquivo de `tools/` correspondente, senão a mudança some.
2. Suba a versão no `sw.js` (`pds-vN` → `pds-vN+1`).
3. `python3 tools/build.py` (gera `index.html` e atualiza esta página). Rode duas vezes: o `game.html` não pode mudar
   na segunda — se mudar, algum texto foi editado só no `game.html` e não no `tools/`.
4. Commit e push na `main`. Ian autorizou publicar sempre na `main` ao terminar.
5. Registre o que mudou no `CONTEXTO.md`.
