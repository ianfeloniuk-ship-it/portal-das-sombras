# v137 — Pedras dos biomas

Pedras pequenas, grandes e altas usam modelos locais com fraturas, variação mineral, musgo na base e cobertura de neve. A largura e altura do modelo original são mantidas; posições e colisões continuam existentes. Integração nos lotes de cenário, incluindo as pedras decorativas das dungeons que passam por EW.

O acabamento mineral usa uma máscara por vértice no material existente, sem textura externa e sem desenho separado por pedra. Modelos em cache, 144 triângulos cada. Testes: 384 combinações de bioma, estação, variante e proporção; sintaxe do jogo; renderização WebGL; 32 combinações de cenário e descarregamento do chunk. Sem erros no console. Não foi realizado benchmark de FPS em celulares.

Próximas etapas: caçadores e classes com corpo/rig compartilhado; inimigos por família com animações reutilizadas. Selene está preservada na branch codex/warrior-attack e ainda requer integração sobre a versão atual. Não foi incluída nesta entrega.
