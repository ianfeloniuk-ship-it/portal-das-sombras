# Despertar pelas masmorras e material das armaduras (v165)

Registro do Claude, 02/10/2026. Descreve o que está no jogo hoje (v165) e prepara a próxima etapa (armaduras 3D das classes raras). Não é aprovação do Ian.

---

## 1. Como o despertar funciona agora

O caminho até uma classe rara passa pelas masmorras:

1. **Portal de classe rara.** Toda vez que você entra num portal, o jogo sorteia se ele é o rastro de uma das 10 classes raras.
   - Chance: **2% no rank F**, subindo em linha reta até **50% no ★** (S ≈ 34%).
   - Dentro do sorteio, cada classe tem 10%: Necromante, Mago do Tempo, Tecelão de Fendas, Guardião dos Vínculos, Metamorfo, Artífice Rúnico, Duelista Espectral, Condutor das Tempestades, Oráculo dos Vestígios, Devorador do Vazio.
   - Aviso na entrada: "PORTAL DE CLASSE RARA" + qual classe deixou o rastro.
2. **O portal vira vermelho.** Não há saída até o guardião cair ou você morrer. Morrer ali solta o guardião no mundo, e ele marcha para a vila mais próxima (até 100 m).
3. **Criaturas do tema.** Só monstros ligados à classe (ex.: Metamorfo = lobos, raptores, dragões; Necromante = esqueletos, fantasmas, espectros; Devorador = lula do vazio, invasores, demônios).
4. **Guardião da classe.** Desde a v161 o chefe é o modelo da própria classe (Tripo, `models/chefes160/`) e usa o poder dela.
5. **Peça do set.** O guardião solta **1 das 5 peças ao acaso** (elmo, peito, braços, pernas, arma). Baús da masmorra têm 30% de chance de soltar outra. A primeira peça acorda a afinidade com a classe.
6. **Bônus das peças.** Só valem na classe dona do set. Metamorfo tem bônus próprios das formas; as outras 9: +6% de dano e +6% de vida por peça, +15% de cada com o set completo.
7. **Teste de despertar.** Com as 5 peças **vestidas**, aparece em Personagem → Build o botão **Teste de despertar**. É um duelo numa arena contra o guardião do tema, um rank acima do seu, com 2,5× de vida.
8. **Vitória.** Você aprende a classe rara (entra nas suas classes; monte as habilidades em Personagem → Habilidades). Perder não gasta as peças: dá para tentar de novo.

Esse caminho convive com o Segundo Despertar antigo (investigar fissuras, 3 investigações). Os dois liberam classes raras.

---

## 2. O que precisa mudar (análise)

**Despertar**
- O teste é só um duelo. Falta a parte "replicar mecânicas" que o Ian pediu: cada classe deveria ter uma prova própria (ex.: Necromante erguer 3 ecos durante a luta; Mago do Tempo voltar com a Âncora antes de um golpe fatal; Duelista aparar 5 golpes).
- Bônus das 9 classes novas são genéricos (+6%/+15%). Cada peça deveria ter um efeito ligado à mecânica da classe, como o Metamorfo tem.
- Dois caminhos para classe rara (fissuras e set) podem confundir. Decidir com o Ian se as fissuras continuam.
- Sorteio 100% aleatório da peça pode prender o jogador repetindo peça. Sugestão: proteção contra repetição (após 2 repetidas, a próxima é uma que falta).

**Combate e interface (feedback do Irror)**
- Feito na v165: lentidão e armadilha valem contra chefes, Disparo Rápido virou rajada, câmera baixa de frente, anel sem piscar, mira pelo canvas.
- Falta: barra de vida sobre a cabeça fica alta na câmera baixa; revisar as outras classes atrás de habilidades "que não fazem nada" contra chefe (Correntes Sagradas do Paladino diz "Chefes resistem").

**Visual**
- Só o Metamorfo tem peças 3D no corpo. As outras 9 classes têm as peças só como item. A seção 3 prepara isso.

---

## 3. Material para criar as armaduras no Tripo

### 3.1 Regras técnicas (valem para todas as peças)
- **Uma peça por geração**, sem corpo, sem manequim, sem suporte, fundo neutro. Peça "vazia por dentro" (vai por cima do Viajante).
- **Estilo:** o mesmo dos chefes e do Viajante aprovado — pintado à mão, animado tipo Arcane, cores saturadas, contornos legíveis de cima. Usar como referência visual o chefe da classe (`models/chefes160/<id>.glb` / imagens em `Entregas/Tripo-Referencias-Classes-2026-10-01/Personagens`).
- **Orientação:** frente da peça para +Z (de frente para a câmera), em pé (Y para cima). Braçal e greva **na vertical**, abertura para cima/baixo.
- **Depois de baixar:** reduzir para ~11 mil triângulos e textura 1024 WebP (mesmo processo do Metamorfo):
  ```
  npx @gltf-transform/cli weld in.glb a.glb
  npx @gltf-transform/cli simplify a.glb b.glb --ratio 0.01 --error 0.001
  npx @gltf-transform/cli resize b.glb c.glb --width 1024 --height 1024
  npx @gltf-transform/cli webp c.glb <id>-<peça>.glb
  ```
- **Nomes dos arquivos** (pasta `models/set153/`): `<id>-elmo.glb`, `<id>-peitoral.glb`, `<id>-bracal.glb`, `<id>-greva.glb`, `<id>-arma.glb`.
  ids: `necromante`, `tempo`, `tecelao`, `guardiao`, `artifice`, `duelista`, `condutor`, `oraculo`, `devorador` (o `metamorfo` já existe).
- **Ligar no jogo:** colocar os 5 arquivos e acrescentar o id em `window.SET_MODELS165` (hoje `['metamorfo']`, em `tools/set-visual153.js`). O encaixe nos ossos é automático, pelas mesmas medidas do Metamorfo:
  - elmo: 0,40 m de largura, preso na cabeça (esconde cabelo e cabeça);
  - peitoral: 0,80 m de largura, no peito (esconde tronco e cachecol);
  - braçal: 95% do antebraço e do braço (um modelo, usado nos dois lados e nos dois segmentos);
  - greva: 95% da canela e da coxa (idem);
  - arma: na mão direita (esconde a espada padrão).
- **Erro a evitar (Metamorfo v1):** peça grande demais e sem cor. Pedir cores fortes no prompt e conferir a escala na prévia.

### 3.2 Prompts (texto, em inglês, que o Tripo entende melhor)

Prefixo comum para colar antes de cada prompt:
> `Single stylized hand-painted game armor piece, Arcane animated style, saturated colors, clean readable silhouette, no character, no mannequin, no stand, hollow inside, front facing camera, neutral background,`

**Necromante — Mortalha do Necromante** (roxo `#b98cff`, osso, tecido rasgado)
- Elmo — Capuz da Cripta: `hooded skull-mask helm, tattered dark violet cloth hood over a bone face mask, glowing purple eye slits`
- Peitoral — Manto Fúnebre: `necromancer chest armor, ribcage-shaped bone breastplate over torn violet funeral robe, small purple soul gems`
- Braçal — Luvas do Ossuário: `single vertical bracer, bone plates tied with dark leather straps, purple runes`
- Greva — Botas do Sepulcro: `single vertical greaves, dark iron shin guard with bone spikes and violet tattered cloth`
- Arma — Cajado de Ossos: `long bone staff topped with a horned skull and a floating purple soul flame`

**Mago do Tempo — Relógio do Mago do Tempo** (ciano `#8fe8ff`, latão, engrenagens)
- Elmo — Coroa da Hora: `circlet helm with a small brass clock face on the forehead, cyan glowing hands, floating gear halo`
- Peitoral — Túnica Suspensa: `mage chest piece, deep blue robe with brass clockwork plates and an hourglass emblem glowing cyan`
- Braçal — Luvas do Ponteiro: `single vertical bracer, brass bracer with rotating clock dial and cyan glow`
- Greva — Sandálias do Atraso: `single vertical greaves, blue cloth wraps with brass gear knee guard`
- Arma — Astrolábio Partido: `broken brass astrolabe staff, concentric rings frozen mid-spin, cyan time sparks`

**Tecelão de Fendas — Fios do Tecelão** (lilás `#c2a2ff`, fios brilhantes)
- Elmo — Véu do Tecelão: `light hood with a sheer veil stitched by glowing lilac threads, needle ornament`
- Peitoral — Manto Costurado: `patchwork chest armor sewn together with glowing lilac threads and small rift tears`
- Braçal — Luvas do Fio: `single vertical bracer wrapped in spools of glowing thread`
- Greva — Botas da Passagem: `single vertical greaves, dark fabric stitched with glowing lilac seams`
- Arma — Lâmina de Linha: `slim curved blade made of a giant sewing needle with trailing glowing thread`

**Guardião dos Vínculos — Juramento do Guardião** (dourado `#ffdb86`, pedra e corrente)
- Elmo — Elmo do Juramento: `heavy closed guardian helm, gold trim, chain links hanging, warm golden visor glow`
- Peitoral — Couraça do Bastião: `massive stone-and-gold breastplate with a broken chain emblem`
- Braçal — Manoplas do Vínculo: `single vertical bracer, thick gold-plated gauntlet with chain wrapped around`
- Greva — Grevas da Âncora: `single vertical greaves, heavy plated greave with an anchor motif`
- Arma — Escudo Juramentado: `large tower shield with golden oath runes and chains on the rim`

**Artífice Rúnico — Engrenagens do Artífice** (laranja `#ffb36b`, couro, runas de forja)
- Elmo — Óculos Rúnicos: `leather cap with big brass goggles, glowing orange rune lenses`
- Peitoral — Avental Blindado: `blacksmith armored apron, riveted plates, orange glowing rune lines, tool pouches`
- Braçal — Luvas de Forja: `single vertical bracer, heavy forge glove with copper rivets and rune glow`
- Greva — Botas de Engrenagem: `single vertical greaves, iron boot guard with small gears and pistons`
- Arma — Martelo Rúnico: `rune hammer with a square head, glowing orange runes, copper bands`

**Duelista Espectral — Lâmina do Duelista** (azul-claro `#9fc8ff`, fantasmagórico, elegante)
- Elmo — Máscara Espectral: `elegant fencing mask, half-face, pale blue ghostly glow, feather plume`
- Peitoral — Gibão do Duelo: `fitted duelist doublet with spectral blue trims and a light shoulder cape`
- Braçal — Luvas da Guarda: `single vertical bracer, fencing glove cuff with a small round parry guard`
- Greva — Botas do Passo: `single vertical greaves, tall slim duelist boot with spectral blue mist at the heel`
- Arma — Florete Espectral: `thin rapier with ornate swept hilt, translucent glowing blue blade`

**Condutor das Tempestades — Para-raios do Condutor** (azul elétrico `#7ad7ff`, cobre)
- Elmo — Elmo Condutor: `copper helm with a lightning rod crest, crackling blue electricity`
- Peitoral — Peitoral de Cobre: `copper chest plate with coiled wires and a glowing storm core`
- Braçal — Manoplas do Raio: `single vertical bracer, copper coil gauntlet with blue sparks`
- Greva — Grevas do Vento: `single vertical greaves, light armor with wind-swept fins and copper rivets`
- Arma — Lança da Tempestade: `spear with a forked lightning-shaped copper tip, blue electric arcs`

**Oráculo dos Vestígios — Vestes do Oráculo** (dourado claro `#e7d48a`, máscaras, tecido)
- Elmo — Máscara do Presságio: `oracle mask with three eyes, gold and ivory, hanging beads`
- Peitoral — Vestes do Vestígio: `layered seer robes with golden eye embroidery and talismans`
- Braçal — Luvas da Leitura: `single vertical bracer wrapped with prayer beads and small gold charms`
- Greva — Sandálias do Caminho: `single vertical greaves, cloth leg wraps with gold anklet and charms`
- Arma — Relicário do Oráculo: `hanging reliquary lantern on a short staff, glowing pale gold eye inside`

**Devorador do Vazio — Carapaça do Devorador** (roxo profundo `#a070ff`, quitina, vazio)
- Elmo — Elmo Oco: `chitin helm shaped like a hollow mouth, dark purple, void glow inside`
- Peitoral — Carapaça do Vazio: `insectoid chitin chest carapace, black-violet, glowing void cracks`
- Braçal — Manoplas Famintas: `single vertical bracer, chitin plates with small teeth along the edge`
- Greva — Grevas do Abismo: `single vertical greaves, spiky black chitin greave with violet glow`
- Arma — Manopla Devoradora: `large clawed gauntlet with a toothed maw in the palm, void energy`

### 3.3 Ordem sugerida
Necromante (chefe já refeito na v163) → Duelista → Guardião → as demais. Uma classe por vez: gerar as 5 peças, reduzir, colocar em `models/set153/`, ligar em `SET_MODELS165`, conferir no jogo (prévia frente/lado como no Metamorfo v2) e mostrar ao Ian.
