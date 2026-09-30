# Goblins v122

Os cinco papéis usam a base e as armas aprovadas, malha contínua e animação por esqueleto na GPU. Flecha e orbe partem das armas; o dano e os tempos do combate foram mantidos. Efeitos ilustrativos da galeria ficam desligados no jogo.

Na raiz do repositório, `python tools/build.py` sincroniza os dados e o runtime em `game.html`, gera `goblin-preview.html` e monta `index.html`. Não refaz a modelagem.

Fontes canônicas:

- `goblins118.js`: modelo e movimentos legados.
- `goblins122.js`: equipamentos revisados, ataques e esqueleto em tempo real.
- `goblin-data122.js`: geometrias e pesos já preparados e compactados.
- `goblin-bake-source122.js`: fonte procedural aprovada do corpo, rosto e rig, usada somente offline. Alterações anatômicas exigem novo bake; alterações na animação de produção ficam em `goblins122.js`.
- `goblin-preview122.html`: template da comparação visual.

Para regenerar a geometria, forneça um arquivo CommonJS local do Three.js r128 já disponível (a mesma versão usada pelo jogo):

```text
node tools/bake-goblins122.cjs /caminho/three-r128.cjs
python tools/build.py
node tools/verify-v122.cjs /caminho/three-r128.cjs
```

O bake pode levar alguns minutos. Usa a fonte procedural salva neste repositório e chama `pack-goblins122.cjs` automaticamente. Os argumentos seguintes permitem escolher outra fonte JS e outro destino. `THREE_PATH` também pode informar a biblioteca. Não há dependência do HTML de estudo nem das pastas da conversa.

Validação da entrega: cinco papéis e ataques no navegador dentro da dungeon, projéteis do arco/cajado, esqueleto e transformações com escala do chefe; regressões v112, v113, v116, v117, v118, interface e escadas. Não é uma campanha completa nem um teste em aparelhos móveis.
