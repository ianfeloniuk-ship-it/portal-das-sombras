# Linguagem do Primeva — como escrever qualquer texto do jogo

Pedido de Ian (20/10/2026): "estude Skyrim e jogos de RPG… desenvolva uma linguagem que sirva para meu jogo com explicações simples e funcionais, que o que for dito realmente aconteça, e não use números quebrados".

Vale para habilidades, passivas, itens, atributos, títulos, dicas do mouse, toasts, janelas e missões. Vale para Claude, Codex e qualquer IA que mexa no jogo.

## O que os RPGs fazem bem (e copiamos)

- **Skyrim** — uma frase, efeito primeiro, número inteiro, unidade clara: "Armas de uma mão causam 20% mais dano." Nada de fórmula na tela.
- **Diablo / Path of Exile** — as mesmas palavras sempre querem dizer a mesma coisa (um glossário fixo). "Atordoar" é sempre atordoar.
- **Dark Souls / Elden Ring** — história e efeito ficam separados: primeiro o que o item faz, depois (se quiser) uma linha de sabor.
- **Zelda / Hades** — o texto ensina jogando: diz o que apertar e o que acontece, sem jargão interno.

## As 8 regras

1. **O texto é um contrato.** Se diz "30%", o código faz 30%. Mudou o código, muda o texto junto (regra das partes ligadas). Mudou o texto, confira o código.
2. **Só números inteiros.** Nada de 0,5 · 1,5s · 2,4 m · ×1,25 · 12,5%. Quando a conta não fecha inteira:
   - arredonde **a própria mecânica** (o valor que o jogo usa) e teste; empate (,5) vai para o lado do jogador;
   - ou escreva como "**N a cada M**": "+1% a cada 2 pontos", "1 ouro a cada 500 guardados";
   - ou use palavra quando o número não ajuda: "por um instante", "metade", "o dobro", "após um breve aviso".
   - Peso e distância: abaixo de 10 kg em gramas ("300 g"), abaixo de 10 km em metros ("4300 m") — funções `wTxt()` e `distTxt()`.
   - Números derivados (contas com vários bônus) são arredondados **no código** antes de valer (ex.: `attrRed281`, `critChance`, `bonusPool`, `naturalRegen`), para a ficha mostrar exatamente o que vale.
3. **Efeito primeiro, condição depois.** "Cura 20% da vida. Precisa de um aliado na mira." — não o contrário.
4. **Uma frase, uma coisa.** Até duas linhas. Detalhe extra vai em rótulo: `<b>Área:</b> 6 m de raio`.
5. **Fale com o jogador.** "Você", verbo no presente: "Você avança 8 m", "Seus ecos causam 60% mais dano".
6. **Palavras do glossário, sempre as mesmas** (tabela abaixo). Sem termos internos: nada de "elegível", "parcela restante", "instância", nomes de variável.
7. **Diga o limite quando ele existir.** "Até 3 vezes", "máximo +25%", "chefes resistem". Limite escondido quebra o contrato.
8. **Sabor separado do efeito.** Se tiver história, fica numa linha à parte, em itálico, depois do efeito.

## Glossário (use exatamente estas palavras)

| Palavra | Quer dizer |
|---|---|
| dano | o que tira vida do alvo |
| vida / vida máxima | pontos de vida atuais / total |
| mana, Estamina, Fúria, Firmeza | recursos gastos por habilidades |
| recarga | segundos até poder usar de novo (sempre inteiros) |
| raio | tamanho de uma área redonda, em metros |
| alcance | até onde algo chega, em metros |
| mira | ponto ou alvo para onde você aponta |
| aliados | você não conta; "você e aliados" quando inclui você |
| lento / lentidão | movimento reduzido em X% por Y segundos |
| atordoar | o alvo não age por Y segundos |
| escudo | absorve dano antes da vida; diga quanto e por quanto tempo |
| cura | devolve vida; diga quanto (pontos ou % da vida máxima) |
| crítico | acerto que causa dano multiplicado |
| chefes resistem | o efeito vale menos ou não vale em chefes (diga qual) |

## Antes e depois (textos reais do jogo, v485)

| Antes | Depois |
|---|---|
| Cada ponto ganho no treino: +0,4% de velocidade de ataque e +0,5% de movimento. | A cada 5 pontos: +2% de velocidade de ataque. A cada 2 pontos: +1% de movimento. |
| Juros de 0,15% por nível, até 20 ouro por nível/dia | Juros diários: 1 ouro a cada 500 guardados, por nível (até 20 ouro por nível) |
| Após 1,2s, quem for atingido tem movimento e esquiva invertidos por 3s. | Após um breve aviso, quem for atingido tem movimento e esquiva invertidos por 3s. |
| Mire em um aliado a até 12 m: por 20s, transfere 30% do dano restante dele para você, reduzindo essa parcela pela metade… | Com um aliado na mira, a até 12 m e à vista: por 20s, você recebe 30% do dano que ele levaria, reduzido pela metade… |
| Recarga 7,65s → 7,27s | Recarga 8s → 7s (a recarga real agora é em segundos inteiros) |

## Checklist antes de publicar um texto

- [ ] Tem algum número com vírgula ou ponto? (`rg "\d[.,]\d"` no texto novo)
- [ ] O número do texto é o mesmo que o código usa? Abri a função?
- [ ] Efeito primeiro? Até duas linhas?
- [ ] Usei palavras do glossário?
- [ ] O limite (máximo, chefes, duração) está dito?
