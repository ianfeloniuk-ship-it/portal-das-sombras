# Versão 151 — pacote consolidado

Esta atualização consolida no pacote as melhorias registradas da v137 à v146 e o fechamento de fenda acrescentado depois do snapshot v146. A v145 é a versão oficial de navegador confirmada por Ian. O snapshot local v146 já contém o Necromante do Tripo e as melhorias de leitura do combate. Não há commits, notas ou snapshots separados da v147 à v150 neste checkout ou no histórico do repositório; não atribuo mudanças a esses números sem evidência. A v151 só passa a ser considerada disponível no navegador depois da publicação e da verificação do site.

## Conteúdo incluído

- Pedras minerais por bioma, caçadores veteranos distintos, Selene e efeitos fluidos para habilidades.
- Ataques corpo a corpo orientados pela mira e identidade visual para ataques e habilidades das 21 classes; o golpe e a espada aprovados do Guerreiro permanecem preservados.
- Ressonância visual ao encadear três habilidades diferentes; sem bônus de combate.
- Leitura de estados, críticos, bloqueios, cura, escudo e defesa com sinais curtos no combate.
- Modelo 3D animado do Necromante do Tripo, com a animação `chop.001` e sem recoloração automática do material original.
- Fechamento visual das fendas com queda e desaparecimento dos fragmentos. A cicatriz persistente só acompanha a fissura ativa do Despertar e desaparece quando a etapa é concluída.
- Cache do aplicativo marcado como `pds-v151`.

## Verificação local

- `python tools/build.py` gerou `index.html` a partir do jogo e sincronizou as partes geradas.
- `node tools/verify-v145.cjs`, `node tools/verify-v144.cjs` e `node tools/verify-feedback132.cjs` passaram.
- `git diff --check` passou.
- O botão de revisão do fechamento fica disponível apenas com o parâmetro `?riftReview`; não aparece no jogo normal.
- Comparação do snapshot local v146 com o código atual: o acréscimo identificável é a animação de fechamento da fenda e a cicatriz persistente vinculada ao Despertar.

## Ainda não integrado

O modelo de arco de pedra `portal-arch-tripo.glb` continua como referência recebida, fora da cena e do pacote oficial. A fenda consolidada usa o modelo visual procedural aprovado; a malha do Tripo deve ser avaliada junto da cena antes de substituir essa composição.
