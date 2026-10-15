# 04 — DDD pragmático, contratos e estados

## Modelagem e fronteiras
Entidades: User/Identity, Merchant/Branch, Menu/CatalogItem/Modifier, Availability, Cart, PriceQuote, Order/OrderLineSnapshot, PaymentIntent/Attempt, LedgerPosting, DeliveryTask, CourierOffer, CourierAssignment, Dispute/SupportCase, PromoBudget. Não unir todos os domínios em uma única entidade mutável. Snapshot de nome/preço/opções/frete/desconto no pedido: cardápio posterior não muda histórico. Pedido multi-loja exige separar subpedidos e settle por merchant, caso contrário fora do MVP.

## Máquina de estados de pedido (exemplo a refinar)
`DRAFT → QUOTED → AWAITING_PAYMENT/PLACED → ACCEPTED → PREPARING → READY → PICKED_UP → DELIVERED` e terminais `CANCELLED`, `EXPIRED`, `REFUNDED_PARTIAL`, `REFUNDED_FULL` *quando compatíveis*. Pagamento e entrega são máquinas separadas (não confundir `PAID` com `DELIVERED`). Regras por ação/ator: lojista aceita, courier confirma retirada com prova, sistema expira, operador cancela com trilha. Transições devem produzir evento somente com `version == expected_version` (CAS/lock), e resultar em no-op idempotente para repetição real.

## Invariantes essenciais
Pedido confirmado referencia preço assinado não expirado; nenhuma ação de usuário altera `merchant_id`, `customer_id` ou `subtotal` por JSON arbitrário; retirada não ocorre antes de pronto; entrega não pode ser recebida por courier errado; oferta aceita exclusivamente dentro da janela e com courier elegível; cancelamento concorrente versus captura de pagamento gera compensação inequívoca; todos os IDs sensíveis autorizados no servidor.

## Contrato de API
`request_id`, autenticação, `resource authorization`, `Idempotency-Key` e TTL/escopo, versionamento, códigos de erro estáveis, paginação, orçamento de consulta, versão de recurso/ETag. Erros não devem revelar existência de recurso de outro tenant. OpenAPI validado contra implementação, validação de schema com limites e recusa de propriedades inesperadas.

## Eventos de domínio
Envelope `{event_id, aggregate_id, aggregate_version, event_type, occurred_at, correlation_id, causation_id, schema_version, payload}`. Consumidor por chave idempotente + versão, ordenação quando for indispensável. Event-sourcing integral não é obrigatório: `outbox` normalmente suficiente para publicação segura após transação. Eventos contendo PII exigem minimização, retenção e acesso.
