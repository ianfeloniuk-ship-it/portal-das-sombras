## Mana e habilidades — v258

**Direção de Ian, 05/10/2026:** “ta errado não é ganahr mana que faz custar mais, deveria ser melhorar as habilidades”. Autorização seguinte: aplicar e publicar na versão mais recente.

### Regras implementadas

- `custo = ceil(custoBase × (1 + 0,10 × melhorias))`, melhorias de 0 a 10. O custo-base é o `mp` já definido para cada habilidade. Não depende de nível do personagem, mana máxima, inteligência ou equipamento. Técnicas gratuitas e recursos especiais continuam distintos.
- Exemplo: Bola de Fogo custa 10/15/20 mana com 0/5/10 melhorias. Uma técnica de base 16 custa 16/24/32. Maior reserva permite mais usos.
- Os aumentos são mostrados antes da compra na lista de Habilidades e no tooltip. Exibir custo real e porcentagem da reserva; se existirem mana e energia juntas, mostrar as duas.
- Rotas atuais, legadas e disparo carregado usam o mesmo cálculo. A validação compara exatamente o que será debitado; energia e mana são cobradas juntas somente quando há ambas.
- Égide só concede escudo depois de uma execução confirmada. Tentativa inválida, jogo pausado, morte, slot vazio ou retorno da âncora não geram escudo.
- Eco gratuito devolve somente a mana efetivamente paga, com chance de 25%. Mantém recarga e energia especial; não permite cadeias de reset. Descrição do talento atualizada.
- Regeneração em combate: `0,008 × (60 + 3L) + 0,002 × manaMáxima` por segundo; L limitado a 1–2000 somente neste cálculo. Recuperação de +6% da reserva/s após seis segundos sem atividade de combate, inimigo engajado próximo, projétil hostil próximo ou sangramento. Entrar em região nova reinicia a espera. Menus não aceleram o tempo do jogo.
- Reserva por classe, inteligência, itens, maldições, XP, ouro, regras de morte/ciclo, história e saves mantidos. Mana inválida negativa é limitada a zero no tick de recuperação.

### Escopo da integração

Esta release implementa a base de custos/recuperação nas 160 habilidades existentes e corrige as falhas de execução. As doze habilidades novas do estudo são um catálogo de propostas; não foram inseridas todas de uma vez. Poção nova, canalização de foco, reserva de auras e revisão de retorno por abate também permanecem propostas. Isso evita apresentar mecânicas não integradas como jogáveis.

### Validação

Build duas vezes sem alteração adicional de game.html; sintaxe dos oito scripts inline; checks no Edge com contexto novo, sem usar save pessoal. Cobertura de custos de 160 habilidades, quatro graus de melhoria, cinco reservas e três níveis: 9.600 combinações. Testes de débito, Égide, Eco gratuito, cast legado, energia, carregamento de arco, recuperação e save/reload. Evidência completa e capturas no pacote da entrega do cofre.

Os testes não substituem campanha completa nem avaliação subjetiva de ritmo. Técnicas iniciais ficarem mais acessíveis em níveis altos é consequência intencional da regra de Ian, não motivo para reintroduzir custo pela reserva.
