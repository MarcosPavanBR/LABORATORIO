# 10 — Operação do estabelecimento, KDS e fulfillment

## Painel do estabelecimento
Onboarding e verificação de documentos conforme jurisdição/PSP; unidade, horários, cardápio, adicionais, fotos, estoque, indisponibilidade temporária, preços, promoções, equipe com RBAC, impressoras e integração POS. KDS exige fila ordenada por urgência, notificação sonora configurável, estados operacionais, tempo de preparo, aceite/recusa justificados e sincronização com o backend.

## Máquina de estados na cozinha
`RECEIVED → ACCEPTED → PREPARING → READY → HANDED_OFF`; cancelamento com política clara, prazos e não reversibilidade depois de certos estados. Rejeição de pedido causa compensação financeira definida, não deleção. Preparação e pickup podem correr simultaneamente apenas em estados permitidos. Cada mudança persistida no servidor com versão e actor_id, mesmo que tablet caia.

## Tablet/PWA/offline
Reconciliar eventos com `sequence/version`; reconectar faz snapshot + cursor de eventos. Não confiar em último status da UI. Pendente offline não pode confirmar pagamento, mudar saldo ou atribuir courier sem resposta autoritativa. KDS deve ser usável com toque grande, tela suja, baixo desempenho, áudio desativado, impressora offline e cozinha movimentada; não depende somente de notificação push.

## Testes
Pedido duplo; internet cai após loja aceitar; KDS abre em 2 tablets; dois funcionários mudam mesmo status; restaurante pausa enquanto há pedidos; cardápio fecha durante checkout; falha impressora; webhook atrasado; cozinha demora e courier já chegou. Métricas: tempo aceitação, preparo, disponibilidade e taxa de cancelamento com motivo.
