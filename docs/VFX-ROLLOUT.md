# Migração dos VFX e animações — Primeva

Pedido de Ian, 20/10/2026: recriar todos os ataques básicos e habilidades de todas as classes no estilo dos 14 vídeos aprovados, incluindo movimento do personagem. Ian aprovou os lotes mostrados e deu autorização explícita para publicar automaticamente cada próximo lote testado, sem pedir nova aprovação. Prioridade atual: magos, depois demais classes; normais e raras devem ser cobertas. Blender autorizado se alguma peça nova realmente exigir; o motor aprovado é 3D em tempo real e os primeiros movimentos foram feitos nos ossos existentes.

Regras: ler primeva-golpes-vfx e primeva-codigo; usar as peças/código da demo; preservar dano total, alcance, alvos e recargas; não duplicar apresentação antiga; sincronizar movimento/impactos; testar normal/leve, console, limpeza e registrar vídeo no Drive. Colisões legadas são mantidas invisíveis para preservar o orçamento de dano atual. Não ampliar área por cadastrar o novo efeito novamente no Zone475.

## Publicado
- v487 / e886d71: Guerreiro, Assassino, Tanque — básicos e Corte Giratório/Mil Cortes/Golpe de Escudo. Movimento próprio, bloom normal, leve sem bloom. Corrigido erro antigo Surv437.IT → ITEMS.
- v492: quatro magos — básicos e Chuva de Meteoros/Lança de Gelo/Estaca de Pedra/Corrente de Raios. Confirmar commit/site pelo histórico ao retomar.

## Ordem pendente
1. Outras sete habilidades de cada mago: fogo, gelo, terra, raio (28 habilidades no catálogo base). Conferir também acréscimos de expansão no catálogo carregado.
2. Básicos e receita aprovada de Arqueiro, Paladino, Invocador, Monge, Lâmina Arcana, Lanceiro, Berserker.
3. Demais habilidades das classes normais, incluindo Guerreiro/Assassino/Tanque.
4. Básicos e todas as habilidades das classes raras.

## Identidade dos vídeos / ids internos
01 Guerreiro=0; 02 Assassino=1; 03 Tanque=2; 04 Arqueiro=4; 05 Paladino=5; 06 Invocador=6; 07 Mago de Fogo=8; 08 Mago de Gelo=9; 09 Mago da Terra=10; 10 Mago do Raio=11; 11 Monge=21; 12 Lâmina Arcana=22; 13 Lanceiro=23; 14 Berserker=24. Não confundir número do arquivo com id do código.

## Fontes e entregas online
- Referências aprovadas: https://drive.google.com/drive/folders/1AyY_dp2cqYWkFLziuUWPegJxT2oS4b0Y
- v487/R3: https://drive.google.com/drive/folders/1TffooHVxm4BfRkhw2_CyEZNl4GD3j8JA
- v492/magos: https://drive.google.com/drive/folders/1uiUiZP1CByUaSyeOFg8u-0ff54Cp35ne

## Lições de teste
O gravador precisa atribuir ADT antes de update; caso contrário os clipes ficam sem avançar. Use useSkill e habilidade equipada para testar o fluxo real. Pause treino/progressão somente nos controles numéricos, para não comparar personagens que ganharam atributos entre tentativas. O teste de FPS precisa esperar a cena carregar e aquecer a habilidade por tempo de jogo, pois um aquecimento só por tempo real pode terminar antes de compilar os materiais. Todas as limitações devem constar do relatório.
