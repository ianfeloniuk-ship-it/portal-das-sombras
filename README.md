# Hollow Rank

RPG de ação 3D para PC, com suporte a celular. Explore as Fendas, enfrente guardiões e descubra os ecos de mundos mortos. Roda no navegador e pode ser instalado como app.

**Jogar:** https://ianfeloniuk-ship-it.github.io/portal-das-sombras/

**Para desenvolver:** veja [`VERSAO.md`](VERSAO.md) (versão atual e de onde partir) e [`CONTEXTO.md`](CONTEXTO.md).

## Jogar no PC
- Abra o site no navegador. A tela ocupa a janela disponível; maximize para jogar em tela larga.
- WASD/setas movem. O botão esquerdo do mouse mira e ataca; segure para atacar continuamente.
- Arraste com o botão direito para girar a câmera (puxe para baixo para vê-la na altura do herói, até de frente), use a roda para aproximar e o botão do meio para restaurar.
- **DIÁRIO** (L) reúne objetivos, histórias e descobertas. Escolha **Acompanhar** para mostrar um objetivo no painel.
- Em **⚙ → Ver atalhos do teclado**, consulte todos os controles. **Configurar teclas** permite trocar os atalhos e atualiza a barra de habilidades.
- Para usar a cópia local deste repositório no Windows, execute `JOGAR-PC.bat` com Python disponível.

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

O Escaravelho e o Monarca usam variantes articuladas do cavaleiro KayKit: caminhada, repouso, ataque e queda. Coroa, chifre e carapaça são peças locais presas às articulações. Os arquivos antigos de duas poses foram preservados, mas não são carregados pelo jogo.

## Créditos
Créditos e licenças dos modelos 3D ficam em `models/`. Os pacotes abaixo usam CC0, com atribuições adicionais indicadas na montaria.
- Personagens, animações e armas: **KayKit Adventurers** e **KayKit Skeletons**, de Kay Lousberg (www.kaylousberg.com).
- Cidades (casas, torres, muralhas, poço, props): **KayKit Medieval Hexagon Pack**, de Kay Lousberg.
- Masmorras (pilares, tochas, barris, caixas, estandartes, baús): **KayKit Dungeon Remastered**, de Kay Lousberg.
- Árvores secas, lápides e ossos: **KayKit Halloween Bits**, de Kay Lousberg.
- Árvores, pedras, grama, flores e cogumelos: **Nature Kit**, da Kenney (www.kenney.nl).
- Fonte, barracas e lampiões: **Fantasy Town Kit**, da Kenney.
- Monstros (goblin, orc, aranha, lobo, demônio, raptor, dracônico, gigante, yeti, vespa): **Quaternius** (quaternius.com), via Poly Pizza. Detalhes em `models/LICENSE-Quaternius-Monstros.md`.
- Montaria (Lobo de Mana): modelo **Fox** do glTF Sample Assets — modelo de PixelMannen (CC0), rig e animação de tomkranis (CC-BY 4.0), conversão AsoboStudio e scurest (CC-BY 4.0).

O arquivo `models/env.glb` junta os modelos de cenário já convertidos (cores assadas nos vértices, sem texturas) para carregar rápido.


### Atualização v71 — personalização
- Aprenda classes comuns na Ordem e combine seis habilidades em Personagem → Combinação.
- Passivas de todas as classes aprendidas se somam; consulte Personagem → Ver passivas.
- Equipe quantos títulos conquistados quiser.
- Depois de aprender uma classe mágica, X alterna o ataque básico físico/arcano, mesmo começando como guerreiro. As habilidades equipadas funcionam em ambos os estilos.
- Combinações e recargas persistem no save. Necromantes existentes são preservados; a jornada para novas classes raras será uma etapa posterior.
