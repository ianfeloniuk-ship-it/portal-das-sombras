# Solo RPG — correções do feedback de Irror, 30/09/2026

Publicação v134 autorizada por Ian em 30/09/2026: “pode colocar”. Envio e disponibilidade pública ainda em verificação.

- Guardião Corrompido: medida anterior ignorava skinning e normalização dos atributos quantizados. Teste com o GLB real encontrou ~170 m de altura renderizada; cálculo da pose deformada corrige para 2 m, 2,3 m na elite. Vermelho/branco coincide com flashes aplicados ao modelo gigante. Causa geométrica reproduzida; sem playtest visual prolongado.
- Passivas de rank: escolhas persistidas continuam intactas; agora aparecem também em Passivas, com acesso à distribuição na aba Rank.
- Escadas: geometria invertida no eixo de aproximação; avançar desce e retornar sobe. Destinos e bloqueio por defensores preservados.
- Caveirinha: qualquer inimigo acima do nível do jogador passa a sinalizar ameaça; faixas laranja/vermelha preservadas. Antes a marca começava apenas em 2× o nível.
- XP: bônus existente preservado, limitado a 6× antes dos demais modificadores. Cálculo agora consulta eLvl diretamente, independente de desenho prévio do HUD. Elite da torre recebe +3 no nível após a transformação.

Validação: GLB real com Three r128, quatro geometrias reais de escadas, passivas persistidas, limiares de ameaça, multiplicador XP, sintaxe de scripts. verify-feedback132, verify-v115, verify-v113, verify-v118 e verify-ui118 passaram. index.html regenerado pelo build. Não testado em celular nem em campanha prolongada. Não altera save do usuário.

Fontes: game.html, tools/monster-bounds132.js; regressão tools/verify-feedback132.cjs. Trabalho de cenários de outra conversa preservado. Novas ideias de materiais ainda não desenvolvidas nesta correção.
