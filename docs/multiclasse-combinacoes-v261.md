# Recursos de classes combinadas — v261

## Regra vigente

Mana existe em todas as classes. Inteligência aumenta a reserva de mana e o ataque mágico, inclusive no Guerreiro; não aumenta nem enche Fúria/Vigor. A barra de mana permanece visível. As barras extras de Fúria, Vigor e energia acompanham a classe-base e as técnicas equipadas. Saldos não se convertem entre si.

Uma técnica do Guerreiro gasta Fúria; técnica de Assassino, Tanque ou Arqueiro gasta Vigor; magia gasta mana; Condutor mantém energia. A origem da técnica prevalece sobre a classe-base. Um Guerreiro com Corte Giratório, Bola de Fogo e Leque de Flechas vê os três recursos simultaneamente. Técnicas gratuitas mantêm sua recarga.

Equipar ou remover uma técnica não recalcula atributos nem apaga saldos. Trocar a classe-base na cidade segue o sistema existente: os atributos distribuídos são próprios de cada trabalho. Ao voltar ao Guerreiro, sua Inteligência distribuída é restaurada. A troca de trabalho continua recriando o personagem com sua nova reserva, conforme o comportamento anterior; não se confunde com trocar uma habilidade equipada.

## Botão de combinação

Personagem → Habilidades → Combinar técnicas permite escolher 2 ou 3 técnicas compatíveis já equipadas, na cidade. Tecla padrão 6 ou botão COMBO. Não cria espaços adicionais e não altera a fusão permanente existente.

O custo é a soma, por recurso, dos custos atuais das componentes, incluindo melhorias. Exemplo sem melhorias: Bola de Fogo (10 mana) + Leque de Flechas (20 Vigor) + Corte Giratório (16 Fúria). Duas técnicas do mesmo recurso somam seus custos, não escolhem o maior.

Antes de executar, valida presença nos espaços, recargas, alvos/requisitos e todos os saldos. Falta de qualquer recurso, alvo obrigatório, pausa ou morte impede a execução inteira, sem débito parcial. Após validar, debita os totais uma única vez e inicia cada recarga. Os botões individuais e COMBO compartilham as mesmas recargas. Égide e Eco gratuito processam uma vez por combinação; Eco só pode devolver a mana paga. Sem desconto artificial no preço total.

Movimentos, disparo carregado, invocações, formas, âncoras, geração de Fúria e técnicas de reserva especial continuam individuais. A interface informa a restrição; essas técnicas dependem de etapas/limites próprios que não são transações simples. Técnicas comuns de ataque, defesa, controle e apoio constam na seleção. Reequipar uma componente é necessário para usar uma combinação previamente salva.

## Validação

132 verificações no navegador; 5.400 comparações de custos em 200 habilidades; sintaxe dos oito scripts inline, build estável e nenhum erro de página. Inclui distribuição de Inteligência pela ação real de atributos, seis trabalhos equipados pela função usada na interface, magia/invocação/arqueiro em Guerreiro, troca de classe-base ida e volta, três barras simultâneas, composição e cobrança dos três recursos, ausência de cobranças parciais, recargas compartilhadas, IDs da combinação salvos e integração contra inimigo do motor.

Testes de invariantes e exemplos de execução não substituem campanha longa nem avaliação de todos os equipamentos extremos. Números conservadores são implementação da IA sob direção de Ian, não garantia de equilíbrio perfeito.
