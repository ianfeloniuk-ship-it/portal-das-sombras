# Portal das Sombras

RPG de ação 3D para celular, inspirado na fantasia de caçadores, portais e sombras. Roda no navegador e pode ser instalado como app.

**Jogar:** https://ianfeloniuk-ship-it.github.io/portal-das-sombras/

## Instalar no celular
- **Android (Chrome):** abra o link → menu ⋮ → **Instalar app**.
- **iPhone (Safari):** abra o link → Compartilhar → **Adicionar à Tela de Início**.

## Estrutura
- `game.html` — o jogo (fonte única).
- `index.html` — gerado por `python3 tools/build.py` (acrescenta o cabeçalho do site e o modo offline).
- `models/` — personagens e armas 3D.
- `sw.js`, `manifest.webmanifest`, `icon-*.png` — app instalável e offline.

## Créditos
Personagens, animações e armas 3D: **KayKit Adventurers** e **KayKit Skeletons**, de Kay Lousberg (www.kaylousberg.com), licença CC0. Licenças em `models/`.
