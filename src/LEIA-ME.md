# Código do Primeva — mapa das partes

O script principal do jogo foi dividido em partes (v388, 14/10/2026, pedido de Ian: "pra sempre que eu pedir algo outra coisa não mudar").

## Regras (para Claude, Codex e qualquer IA)
1. **Edite a parte certa em `src/core/`**, nunca o bloco principal do `game.html`.
2. Rode `python tools/build.py`: ele junta as partes de volta no `game.html` (byte por byte), roda os syncs e gera o `index.html`.
3. Se alguém editar o `game.html` direto, o build avisa e refaz as partes a partir dele. Se as partes **e** o `game.html` mudarem juntos, ele para com erro (junte à mão).
4. Funções novas e sistemas novos: prefira um arquivo próprio em `tools/` (ex.: `tools/climb383.js`, `tools/rain387.js`) incluído por `<script src>` no fim do `game.html`.
5. A ordem das partes importa (é um script só). Não renomeie nem reordene sem atualizar `manifest.json`.
6. `python tools/core_parts.py check` diz se partes e `game.html` estão iguais.
7. **Textos e números (v485, pedido de Ian):** siga `LINGUAGEM.md` na raiz — só números inteiros, o texto é contrato com o código, efeito primeiro, glossário fixo.

## Partes (em ordem)
| Arquivo | Tamanho | Começo |
|---|---|---|
| `010-inicio.js` | 0 KB | 'use strict'; |
| `020-util.js` | 1 KB | /* ================= UTIL ================= */ |
| `030-dados.js` | 115 KB | /* ================= DADOS ================= */ |
| `040-bloco-catalog111.js` | 49 KB | // BEGIN CATALOG111 |
| `050-bloco-catalog111-cont.js` | 18 KB | const BOSSES=[ |
| `060-perfil.js` | 0 KB | /* ================= PERFIL ================= */ |
| `070-three.js` | 6 KB | /* ================= THREE ================= */ |
| `080-personagens.js` | 1 KB | /* ================= PERSONAGENS ================= */ |
| `090-bloco-goblins118.js` | 10 KB | // BEGIN GOBLINS118 |
| `100-bloco-goblins122.js` | 6556 KB | // BEGIN GOBLINS122 |
| `110-bloco-ecology124.js` | 10 KB | // BEGIN ECOLOGY124 |
| `120-bloco-ecology124-cont.js` | 2 KB | function makeChibi(o){ |
| `130-modelos-3d-animados-kaykit-cc0.js` | 9 KB | /* ================= MODELOS 3D ANIMADOS (KayKit, CC0) ================= */ |
| `140-monstros-animados-quaternius-cc0-carrega.js` | 16 KB | /* ===== Monstros animados (Quaternius, CC0) — carregam em segundo plano; até lá o monstro |
| `150-estado.js` | 5 KB | /* ================= ESTADO ================= */ |
| `160-jogador.js` | 41 KB | /* ================= JOGADOR ================= */ |
| `170-colisao.js` | 8 KB | /* ================= COLISÃO ================= */ |
| `180-nivel-limpeza.js` | 1 KB | /* ================= NÍVEL: LIMPEZA ================= */ |
| `190-cenario-3d-kenney-e-kaykit-cc0.js` | 13 KB | /* ================= CENÁRIO 3D (Kenney e KayKit, CC0) ================= */ |
| `200-bloco-environment128.js` | 18 KB | // BEGIN ENVIRONMENT128 |
| `210-bloco-environment128-cont.js` | 15 KB | /* árvores, pedras e tudo que cobre o chão num pedaço do mundo */ |
| `220-bloco-village129.js` | 16 KB | // BEGIN VILLAGE129 |
| `230-bloco-aster.js` | 0 KB | // BEGIN ASTER MATERIALS130 — only the local Warrior study in Aster. |
| `240-bloco-aster-cont.js` | 8 KB | /* ruína no meio do mapa */ |
| `250-mundo-infinito.js` | 8 KB | /* ================= MUNDO INFINITO ================= */ |
| `260-v341.js` | 29 KB | /* ===== v341 (Ian): PORTÕES DAS CIDADES ===== |
| `270-masmorra-procedural.js` | 60 KB | /* ================= MASMORRA PROCEDURAL ================= */ |
| `280-bloco-crystals125.js` | 2 KB | // BEGIN CRYSTALS125 |
| `290-bloco-crystals125-cont.js` | 8 KB | function addVein(x,z,rank,charges,col){ |
| `300-entidades.js` | 20 KB | /* ================= ENTIDADES ================= */ |
| `310-itens.js` | 12 KB | /* ================= ITENS ================= */ |
| `320-missoes.js` | 4 KB | /* ================= MISSÕES ================= */ |
| `330-efeitos.js` | 8 KB | /* ================= EFEITOS ================= */ |
| `340-efeitos-visuais-por-habilidade.js` | 17 KB | /* ================= EFEITOS VISUAIS POR HABILIDADE ================= */ |
| `350-perigos.js` | 2 KB | /* ================= PERIGOS ================= */ |
| `360-combate.js` | 1 KB | /* ================= COMBATE ================= */ |
| `370-v281.js` | 41 KB | /* ===== v281 (Ian): 9 atributos — Grimório de Atributos e Bestiário (Entregas/Grimorio-At |
| `380-acoes.js` | 33 KB | /* ================= AÇÕES ================= */ |
| `390-ia.js` | 25 KB | /* ================= IA ================= */ |
| `400-loop.js` | 29 KB | /* ================= LOOP ================= */ |
| `410-overlay-e-hud.js` | 19 KB | /* ================= OVERLAY E HUD ================= */ |
| `420-audio-musica-e-efeitos.js` | 7 KB | /* ================= ÁUDIO: MÚSICA E EFEITOS ================= */ |
| `430-classes-avancadas.js` | 1 KB | /* ================= CLASSES AVANÇADAS ================= */ |
| `440-instancias-especiais.js` | 23 KB | /* ================= INSTÂNCIAS ESPECIAIS ================= */ |
| `450-oraculos-status-diaria-ecos-guilda-forja.js` | 81 KB | /* ================= ORÁCULOS: STATUS, DIÁRIA, ECOS, GUILDA, FORJA, MONTARIA, DIA/NOITE, E |
| `460-ideias-afixos-pesca-culinaria-mimic-titu.js` | 20 KB | /* ================= IDEIAS: AFIXOS, PESCA, CULINÁRIA, MIMIC, TÍTULOS, MALDIÇÕES, TORRE, N |
| `470-trabalhos-estilo-jobs-troque-de-classe-n.js` | 7 KB | /* ===== TRABALHOS (estilo "jobs"): troque de classe na cidade; cada trabalho tem seus pró |
| `480-livraria-ideia-do-irror-passivas-que-ser.js` | 2 KB | /* ===== LIVRARIA (ideia do Irror): passivas que servem para qualquer classe. Custam 1 pon |
| `490-casa-propria.js` | 5 KB | /* ===== CASA PRÓPRIA ===== */ |
| `500-moradores-e-festivais.js` | 2 KB | /* ===== MORADORES E FESTIVAIS ===== */ |
| `510-ataque-a-cidade-chefe-de-mundo-marcado.js` | 1 KB | /* ===== ATAQUE À CIDADE (chefe de mundo marcado) ===== */ |
| `520-profissoes.js` | 0 KB | /* ===== PROFISSÕES ===== */ |
| `530-historias-da-ordem.js` | 4 KB | /* ===== HISTÓRIAS DA ORDEM ===== */ |
| `540-estacoes.js` | 25 KB | /* ===== ESTAÇÕES ===== */ |
| `550-completos-torre-100-npcs-cidade-fusao-so.js` | 4 KB | /* ================= COMPLETOS: TORRE 100, NPCs, CIDADE, FUSÃO SOMBRIA, CIDADES CAÍDAS === |
| `560-liberacao-gradual.js` | 1 KB | /* ================= LIBERAÇÃO GRADUAL ================= */ |
| `570-bloco-a-armas-vivas-conjuntos-constelaco.js` | 3 KB | /* ================= BLOCO A: ARMAS VIVAS, CONJUNTOS, CONSTELAÇÕES, REENCARNAÇÃO ========= |
| `580-bloco-b-economia-caravanas-chefes-errant.js` | 18 KB | /* ================= BLOCO B: ECONOMIA, CARAVANAS, CHEFES ERRANTES, RUÍNAS =============== |
| `590-bloco-c-clone-aposentados-sonho-tempo-mo.js` | 5 KB | /* ================= BLOCO C: CLONE, APOSENTADOS, SONHO, TEMPO, MODO DEUS, ESCOLHAS ====== |
| `600-bloco-regions116.js` | 5 KB | // BEGIN REGIONS116 |
| `610-bloco-regions116-cont.js` | 29 KB | /* escolhas: salvar ou abandonar cidades */ |
| `620-janelas.js` | 30 KB | /* ================= JANELAS ================= */ |
| `630-controles.js` | 32 KB | /* ================= CONTROLES ================= */ |
| `640-telas.js` | 17 KB | /* ================= TELAS ================= */ |
| `650-bloco-runtime111.js` | 43 KB | // BEGIN RUNTIME111 |
| `660-bloco-runtime111-cont.js` | 11 KB | // Transient Guardian state never enters the profile or the run save. |
| `670-bloco-journey113.js` | 13 KB | // BEGIN JOURNEY113 |
| `680-bloco-journey113-cont.js` | 32 KB | function rememberVestige103(e){if(!e.noExpLoot&&!e.rival&&!e.statue&&e.kind&&(e.elite//e.i |

## Módulos em `tools/` (carregados depois do script principal)
`anim303.js`, `aster-materials130.js`, `balance-rpg.js`, `beetle352.js`, `bestiary294.js`, `bestiary324.js`, `biome-materials132.js`, `biomes295.js`, `bird349.js`, `boat371.js`, `boss160.js`, `cactoro372.js`, `campaign327.js`, `chest-placement253.js`, `citizens133.js`, `city-layout253.js`, `civic343.js`, `classes316.js`, `climb383.js`, `cogu348.js`, `combat139.js`, `combo261.js`, `conspiracy333.js`, `corrupt299.js`, `crystal310.js`, `crystals125.js`, `dome154.js`, `ecology124.js`, `economy154.js`, `elem300.js`, `environment-bridge128.js`, `environment128.js`, `fendidos307.js`, `firearms372.js`, `goblin-bake-source122.js`, `goblin-data122.js`, `goblins118.js`, `goblins122.js`, `gosma347.js`, `guardian370.js`, `habitat-render124.js`, `hud356.js`, `hunters138.js`, `ineditas309.js`, `journey113.js`, `kit111-runtime.js`, `living372.js`, `look154.js`, `loot353.js`, `lux267.js`, `mana258.js`, `monster-balance.js`, `monster-bounds132.js`, `passives263.js`, `passives327.js`, `performance350.js`, `proj155.js`, `projectiles253.js`, `rain387.js`, `rare298.js`, `reclaim372.js`, `regions116.js`, `resource-balance263.js`, `resources260.js`, `rift-audio131.js`, `rift131.js`, `rocks137.js`, `service-prices265.js`, `set-visual153.js`, `shaders312.js`, `slime360.js`, `spiky350.js`, `sprint373.js`, `terrain153.js`, `terrain245.js`, `variants308.js`, `vfx302.js`, `vfx328.js`, `village-bridge129.js`, `village129.js`, `wagon369.js`, `warrior-equipment127.js`, `warrior-player127.js`, `water154.js`, `witcher377.js`, `workers350.js`
