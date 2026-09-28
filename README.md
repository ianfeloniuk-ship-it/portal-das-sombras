# Portal das Sombras

RPG de ação 3D para celular, inspirado na fantasia de caçadores, portais e sombras. Roda no navegador e pode ser instalado como app.

**Jogar:** https://ianfeloniuk-ship-it.github.io/portal-das-sombras/

## Instalar no celular
- **Android (Chrome):** abra o link → menu ⋮ → **Instalar app**.
- **iPhone (Safari):** abra o link → Compartilhar → **Adicionar à Tela de Início**.

## Estrutura
- `game.html` — o jogo (fonte única).
- `index.html` — gerado por `python3 tools/build.py` (acrescenta o cabeçalho do site e o modo offline).
- `models/` — personagens, armas e cenário 3D (`env.glb`).
- `sw.js`, `manifest.webmanifest`, `icon-*.png` — app instalável e offline.

## Gráficos
O botão **HD / LEVE** (ao lado de SOM) troca a qualidade: no modo LEVE há menos grama e flores e a resolução cai, bom para celulares mais fracos. A escolha fica salva.

## Créditos
Todos os modelos 3D são de licença CC0 (domínio público). Licenças em `models/`.
- Personagens, animações e armas: **KayKit Adventurers** e **KayKit Skeletons**, de Kay Lousberg (www.kaylousberg.com).
- Cidades (casas, torres, muralhas, poço, props): **KayKit Medieval Hexagon Pack**, de Kay Lousberg.
- Masmorras (pilares, tochas, barris, caixas, estandartes, baús): **KayKit Dungeon Remastered**, de Kay Lousberg.
- Árvores secas, lápides e ossos: **KayKit Halloween Bits**, de Kay Lousberg.
- Árvores, pedras, grama, flores e cogumelos: **Nature Kit**, da Kenney (www.kenney.nl).
- Fonte, barracas e lampiões: **Fantasy Town Kit**, da Kenney.
- Montaria (Lobo de Mana): modelo **Fox** do glTF Sample Assets — modelo de PixelMannen (CC0), rig e animação de tomkranis (CC-BY 4.0), conversão AsoboStudio e scurest (CC-BY 4.0).

O arquivo `models/env.glb` junta os modelos de cenário já convertidos (cores assadas nos vértices, sem texturas) para carregar rápido.
