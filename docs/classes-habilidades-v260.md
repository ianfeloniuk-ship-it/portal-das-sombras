# Classes e habilidades — v260

Autoria: IA sob direção de Ian, 05/10/2026. Base: main v259 (`0454ec4`), preservando a revisão de criaturas e a campanha. Ian aprovou duas habilidades por classe e pediu descrições compactas. Os valores abaixo são decisões de implementação da IA, não números ditados por Ian.

## Recursos

- Guerreiro usa Fúria (0–100), sem mana nem um segundo débito oculto. Básicos geram 6; terceiro golpe gera 12. Dano recebido gera 5, no máximo uma vez a cada 0,5s. Grito de Guerra gera 35, com recarga-base de 14s. Investida e Provocação são gratuitas, limitadas pela recarga. Após seis segundos sem ganhar/gastar, Fúria cai 5/s.
- Assassino, Tanque e Arqueiro usam Vigor (100). Recuperam 10/s após 1,5s sem gastar. Marcas e Firmeza mantêm a função própria já existente.
- Magias e classes híbridas místicas mantêm mana. Condutor mantém energia de movimento. Cada habilidade escolhe seu recurso pela origem, mesmo em uma combinação de classes. Poderes sem origem física continuam usando mana.
- Custos-base de mana, Fúria e Vigor crescem 10% por melhoria, até dez melhorias, arredondados para cima. Reserva e nível do personagem não aumentam o preço. Energia especial mantém os custos próprios anteriores.
- A Fúria deixou de ser bônus adicional de dano/cura ou consumo oculto: os antigos reforços automáticos de Corte Giratório, Investida, Golpe Pesado, Varredura e Fôlego foram substituídos pelo custo explícito. Grito agora gera recurso, sem bônus de dano adicional.
- Eco gratuito só restitui mana efetivamente paga. Recarga, Vigor, Fúria e energia não são reembolsados. Falhas, pausa e morte não debitam recursos.

## Expansão e interface

200 habilidades nas vinte classes ativas: 160 preservadas em seus IDs, mais duas por classe (IDs 8 e 9). Mago Elemental legado continua fora do catálogo ativo. Seis espaços de equipamento mantidos. Técnicas novas liberam nos níveis 15 e 60; caminhos raros exigem três e cinco investigações, respectivamente. A lista mostra as bloqueadas com os requisitos.

Descrições curtas ficam visíveis na lista, com custo, próxima melhoria e recarga. Dano aparece no tooltip. A barra principal mostra o recurso da classe; recursos de habilidades de outras classes aparecem como valores secundários. O painel explica como recuperá-los. Novos saldos e esperas são persistidos no save; saves anteriores recebem Vigor cheio e Fúria zero.

As novas técnicas têm um efeito principal: ataque em área/linha, dano atrasado, defesa temporária, controle breve ou apoio. Fratura Glacial ganha 50% de dano contra alvo lento/preso; Instante Fatal ganha 50% somente durante a preparação de um ataque. Não há reset novo de recarga nem geração de recurso por atingir vários alvos.

## Validação e limites

94 verificações no Edge, oito scripts inline com sintaxe válida e 5.400 combinações de custo em 200 habilidades. As quarenta passaram pelo executor de habilidades com alvos controlados; adicionalmente, dano do Corte Crescente e Brasa Latente e cobrança do arco carregado foram verificados no caminho normal contra um inimigo real do motor. Save/load preservou melhorias, IDs e saldos. Nenhum erro de página. Capturas desktop e celular verificadas. Maior descrição no cenário testado: 125 caracteres.

Custos físicos no máximo da melhoria cabem na reserva 100. Duração das novas proteções e controles fica abaixo da recarga mínima de 45%. Os coeficientes novos foram mantidos conservadores em relação às técnicas existentes. Isso não prova equilíbrio perfeito: campanha completa, builds extremas, chefes e preferência de ritmo exigem playtest prolongado. Não confundir teste de invariantes com diversão medida.

## Referências de design

- [WoW — Guerreiro](https://worldofwarcraft.blizzard.com/en-us/game/classes/warrior): recurso Fúria e geração em combate. Página oficial consultada em 05/10/2026.
- [ESO — custos de armas](https://help.elderscrollsonline.com/app/answers/detail/a_id/5206/~/do-bows-and-staves-require-stamina-to-shoot%3F): ataques normais não gastam recursos; técnicas de armas usam stamina, com exceção dos cajados, que usam magicka. Página oficial consultada em 05/10/2026.
- Divisão Fúria/Vigor/mana, números, habilidades e desbloqueios desta entrega são adaptação original para o jogo de Ian, não cópia de regras desses jogos.

## Habilidades novas

| Classe | Técnica | Efeito | Custo-base | Recarga-base |
|---|---|---|---|---|
| Guerreiro | Corte Crescente | Corta os inimigos à frente em um leque de 5 m. | 20 Fúria | 9s |
| Guerreiro | Quebra-Passo | Reduz a velocidade de um alvo por 3s. | 12 Fúria | 10s |
| Assassino | Ferida Profunda | Fere um alvo, causando dano ao longo de 4s. | 18 Vigor | 10s |
| Assassino | Faca de Interrupção | Interrompe o ataque de um inimigo comum a até 10 m. | 16 Vigor | 12s |
| Tanque | Reserva de Guarda | Ganha um escudo de 15% da vida máxima por 4s. | 22 Vigor | 18s |
| Tanque | Rompante | Golpeia em linha os inimigos a até 6 m. | 18 Vigor | 10s |
| Arqueiro | Leque de Flechas | Dispara três flechas que atravessam inimigos em leque. | 20 Vigor | 10s |
| Arqueiro | Olho de Caçador | Marca no mapa os inimigos a até 24 m por 8s. | 12 Vigor | 18s |
| Paladino | Censura | Reduz em 20% o dano de um alvo por 4s. | 18 mana | 12s |
| Paladino | Lança Solar | Uma lança de luz atinge os inimigos em uma linha de 10 m. | 20 mana | 10s |
| Invocador | Uivo Espiritual | Uma onda espiritual atinge os inimigos à frente em 6 m. | 16 mana | 10s |
| Invocador | Instinto de Matilha | Suas invocações próximas recebem 25% menos dano por 5s. | 24 mana | 18s |
| Necromante | Jaula de Ossos | Prende um inimigo comum por 2s. | 20 mana | 14s |
| Necromante | Maldição da Fraqueza | Reduz em 20% o dano dos inimigos em 4 m por 4s. | 24 mana | 16s |
| Mago de Fogo | Brasa Latente | Após 1s, explode na área marcada de 3 m. | 20 mana | 10s |
| Mago de Fogo | Manto de Cinzas | Ganha um escudo de 15% da vida máxima por 4s. | 24 mana | 18s |
| Mago de Gelo | Fratura Glacial | Atinge um alvo; causa 50% mais dano se ele estiver lento ou preso. | 20 mana | 10s |
| Mago de Gelo | Névoa Fria | Reduz em 25% o dano dos inimigos ao seu redor por 3s. | 22 mana | 16s |
| Mago da Terra | Pedra Suspensa | Após 1,2s, uma rocha cai na área marcada de 3 m. | 22 mana | 12s |
| Mago da Terra | Casca de Cristal | Ganha um escudo de 20% da vida máxima por 4s. | 24 mana | 20s |
| Mago do Raio | Agulha Elétrica | Lança um projétil elétrico na direção da mira. | 12 mana | 5s |
| Mago do Raio | Clarão | Reduz em 25% o dano dos inimigos ao seu redor por 3s. | 22 mana | 16s |
| Mago do Tempo | Segundo Perdido | Cria uma área de 3 m que desacelera inimigos comuns por 4s. | 22 mana | 14s |
| Mago do Tempo | Impacto Adiado | Após 1s, um pulso atinge a área marcada de 3 m. | 22 mana | 12s |
| Tecelão de Fendas | Agulha de Fenda | Uma pequena fenda atinge um alvo a até 10 m. | 18 mana | 8s |
| Tecelão de Fendas | Colapso Local | Após 1,2s, uma fenda implode na área marcada de 3 m. | 24 mana | 14s |
| Guardião dos Vínculos | Alívio Compartilhado | Cura 20% da vida máxima de um aliado na mira. | 24 mana | 18s |
| Guardião dos Vínculos | Círculo de Amparo | Remove lentidão, atordoamento e sangramento do grupo próximo. | 22 mana | 18s |
| Metamorfo | Garras em Arco | Golpeia os inimigos à frente em um leque de 4 m. | 18 mana | 9s |
| Metamorfo | Muda de Pele | Remove sua lentidão, atordoamento e sangramento. | 20 mana | 18s |
| Artífice Rúnico | Lança Rúnica | Dispara uma linha de energia que atinge inimigos em 10 m. | 18 mana | 10s |
| Artífice Rúnico | Placas de Emergência | Recebe 25% menos dano por 4s. | 22 mana | 18s |
| Duelista Espectral | Meia-Lua Espectral | Corta os inimigos à frente em um leque de 4 m. | 18 mana | 10s |
| Duelista Espectral | Corpo Etéreo | Fica invulnerável por 0,5s. | 20 mana | 16s |
| Condutor das Tempestades | Raio Retardado | Após 1s, um raio atinge a área marcada de 3 m. | 2 energia | 12s |
| Condutor das Tempestades | Olho da Tempestade | Recebe 25% menos dano por 4s. | 2 energia | 18s |
| Oráculo dos Vestígios | Instante Fatal | Atinge um alvo; causa 50% mais dano durante a preparação do ataque dele. | 20 mana | 10s |
| Oráculo dos Vestígios | Futuro Resguardado | Concede ao grupo em 6 m um escudo de 10% da vida máxima por 4s. | 28 mana | 20s |
| Devorador do Vazio | Fome Silenciosa | Reduz em 20% o dano de um alvo por 4s. | 18 mana | 12s |
| Devorador do Vazio | Estrela Oca | Após 1s, o vazio explode na área marcada de 3 m. | 22 mana | 12s |
