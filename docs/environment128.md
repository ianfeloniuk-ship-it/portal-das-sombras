# Árvores e terrenos — 30/09/2026

Pedido de Ian: aplicar a direção visual aprovada de Solo RPG às árvores e terrenos, considerando neve, estações e biomas. Publicação explicitamente autorizada nesta conversa após testes.

Produção original local por malhas e materiais procedurais, sem serviços pagos. Não usa TRELLIS/TripoSR e não representa equivalência ao detalhamento do Guerreiro aprovado. Troncos curvos com raízes e galhos, copas com folhas geométricas, coníferas nevadas, árvores desfolhadas e mortas. Três variações determinísticas por combinação; oito biomas e quatro estações. O deserto mantém os cactos existentes. Casas não foram remodeladas nesta entrega.

Árvores substituem os modelos `tree_*` nos lotes existentes do mundo, cidades e habitats naturais. Preserva posições, RNG de geração, colisores, sombra de contato, vento e recorte de oclusão do personagem. Neve colore superfícies superiores, não o tronco inteiro. Inverno desfolha árvores de folhas largas; coníferas conservam copa. O ciclo de estação existente recarrega os chunks.

Chão: paletas por bioma/estação, granulação de solo e superfície de pedra restrita às cidades/estradas. Shader usa coordenadas mundiais; não desloca a altura da navegação. Pisos naturais de masmorras compartilham o acabamento, mantendo a paleta do habitat. Terreno continua plano para preservar movimento e colisão: não são montanhas/colinas navegáveis.

Fontes: tools/environment128.js e environment-bridge128.js. `python tools/build.py` sincroniza o bloco em game.html e gera index.html. Modelos são compartilhados no cache e incorporados ao EnvBatch existente; sem novas luzes por árvore.

Validação: 192 combinações com geometria finita, índices válidos, normais unitárias, cache compartilhado e diferenças sazonais; máximo 3.319 vértices/4.172 triângulos por árvore. No navegador: 32 combinações bioma/estação, construção/descarregamento de chunk e ENV carregado. Chunk amostrado: 13 malhas, 29.832 vértices e 31 colisores; tempo observado 4 ms nessa amostra, não benchmark geral. Floresta real e neve revisadas visualmente. Regressões ecology124, crystals125 e crystal-collision126 passaram. Desempenho móvel e campanha longa não testados.

Checkout compartilhado contém integração do Guerreiro em andamento por outra conversa; os trechos dessa integração foram preservados localmente e excluídos da publicação dos cenários. v128 preparada a partir de HEAD 107995e. Antes de publicar outra frente, confira HEAD e incremente a versão atual; não retroceder para v127.

Referência consultada: cofre Solo RPG / Entregas / Identidade-Visual-Aprovada / ecos-da-fenda-identidade-visual.png e direção visual. Prévia local desta entrega: C:/Users/irror/Documents/Codex/2026-09-30/sol/outputs/cenarios-solo-rpg.html. Sincronização do cofre/Drive não realizada nesta conversa.
