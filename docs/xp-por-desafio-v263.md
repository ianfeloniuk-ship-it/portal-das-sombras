# XP por desafio e missões — v263

Direção de Ian, 05/10/2026: vencer inimigos mais difíceis precisa compensar; missões também devem dar XP conforme dificuldade e tempo necessário. Números abaixo são calibração inicial da IA, não medições de campanha nem números ditados por Ian.

## Combate

Curva de custo preservada: `round(60 + 40L + 4L^1.8)`. Recompensa continua baseada no nível próprio do inimigo, ameaça, função, espécie e risco. Nenhuma penalização por estar acima do nível do jogador; nenhum ajuste dos atributos do monstro pelo jogador.

O novo fator de esforço compara a vida máxima efetiva do inimigo (incluindo resistência) com a referência da mesma espécie, nível e ameaça. Para chefes, a referência é a criatura de orçamento base 38; a vida de chefe equivale originalmente a oito dessas unidades, multiplicada por barras/3. O fator de papel é o maior entre o valor antigo e o trabalho normalizado, com prêmio de 25% para chefes e 10% para elites. O piso preserva as recompensas anteriores. Ameaça e risco continuam compondo o resultado.

Vida adicional do Semanal, Primordial, cerco, Nêmesis, afixos e barras entra pelo valor efetivo da entidade; multiplicadores legados de `e.xp` não são reativados. Não usa tempo real gasto, dano sofrido ou vida curada pelo jogador. Ouro e XP de treinamento de arma/ecos mantêm o orçamento anterior.

## Missões

`XP-base = round(C(nível do contrato) × 0.04 × minutos esperados × dificuldade)`.

| Atividade | Minutos esperados | Dificuldade |
|---|---:|---:|
| Caça | 0,18 por alvo | 1 |
| Fechar portal | 8 por portal | 1,25 |
| Caçador hostil | 2,5 por alvo | 1,25 |
| Extração | 8 | 1,15 |
| Oráculo: noite | 0,22 por alvo | 1,15 |
| Oráculo: sem poção/esquiva | 0,18 por alvo | 1,25 |
| Diária | 8 | 0,5 |
| Mineiro Desaparecido | 20; referência nível 20 | 1,2 |
| Canção do Lago | 30; referência nível 35 | 1,25 |
| Chamado da Torre | 60; referência nível 80 | 1,4 |
| Cidade que Cresce | 35; referência nível 55 | 1,35 |

O orçamento do contrato é congelado e salvo; subir nível, mudar rank ou esperar antes de receber não aumenta sua base. Histórias possuem referência própria, independente do nível de conclusão. Bônus gerais de XP ativos são previstos na interface e aplicados uma vez no recebimento. Transmigrador/Caçador permanecem bônus de combate.

Caça, caçador hostil e Oráculo exigem nível do contrato ou recompensa-base de desafio equivalente, permitindo ameaça elevada de nível menor. Ignoram aliados, estátuas e entidades sem recompensa. Progresso anterior é preservado ao migrar. Diária mantém objetivos de rotina e paga XP uma vez por dia no perfil, mesmo após reiniciar a jornada. Outros prêmios anteriores continuam existindo.

Ordens são substituídas antes do pagamento; extração é removida; história é marcada concluída e diária recebe recibo antes de conceder XP. Valores e duração estimada aparecem nos respectivos painéis.

## Compatibilidade e verificação

Separados os marcos narrativos de nível (`profile.levelStory262`) e as histórias da Ordem (`profile.story`). O formato antigo usava o mesmo campo como lista e objeto: podia falhar ao subir nível com uma história ativa ou perder propriedades na serialização. Migração preserva dados ainda presentes e não recria progresso já ausente.

Testes de navegador cobrem recebimento, duplicação, missão incompleta, saves antigos, reinício, subida de nível com história ativa, equivalência de ameaça e abate real. As fórmulas são verificadas até nível 2000. Continua necessário medir tempo real, builds e ritmo de campanha; estimativas servem como parâmetros explícitos para ajustar após playtest.
