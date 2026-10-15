# 06 — APIs, integrações externas e compatibilidade

## Superfícies de integração
Web/mobile cliente, painel loja, courier, admin, gateway PSP, mapas/geocode/rotas, mensagens push/SMS/email, parceiros ERP/POS, emissão fiscal conforme enquadramento, backoffice contábil. Definir contratos, custódia de tokens, rate-limit, expiração, retries e owner. Preferir APIs explícitas a dependência em banco compartilhado de terceiro.

## API pública e privada
Separar rotas do cliente/lojista/entregador/admin. Role-based NÃO basta: checar propriedade, vínculo de loja, turno, order assignment, escopo da solicitação e state machine. `POST /orders` idempotente; `GET /orders/{id}` scoped ao ator; `POST /merchant/orders/{id}/accept` com esperado version; `POST /courier/offers/{id}/accept` condicional; `POST /webhooks/{provider}` autenticidade antes de JSON processado. Design de rota ilustrativo, não código implementado.

## Realtime Hydration (Túneis e Crashes)
WebSockets e SSE caem. O app do entregador e o KDS da loja devem assumir desconexão constante.
**Protocolo de Reidratação:**
1. Toda mensagem de estado (order.status, courier.location) carrega um `sequence_id` monotônico e `aggregate_version`.
2. Ao reconectar, o cliente envia `Last-Event-ID` ou `last_sequence_id`.
3. O servidor responde com um `snapshot` do estado atual + `delta` de eventos perdidos.
4. Se o delta for muito grande ou o cursor expirar, o servidor força um `full_state_refresh` e invalida a UI local. Nunca confiar em "último estado conhecido" do cliente sem validação de versão.
5. A reidratação reaplica autorização de recurso (ver `references/12-security-and-abuse.md`): reconexão não herda escopo da sessão anterior.

## Falhas de dependência
Timeout com deadline, retry somente para ações idempotentes, jitter, circuit breaker, fallback sem cobrança dupla. Em gateway: um timeout após `charge.create` é **estado desconhecido**, não autorização para cobrar automaticamente em outro PSP. Antes de fallback consultar status da tentativa e/ou reconciliar. Definir chave por operação e PSP. Mapas fora do ar: ETA degradada com aviso e opção manual controlada, não inventar precisão.

## Compatibilidade
Versionar schema/eventos, contrato OpenAPI, erros estáveis. Testes consumer-driven e contract tests em CI. Definir deprecation e migração de apps antigos. Cloud cost por integração medido separadamente de receita; logs com `correlation_id`, sem cartão/CPF/GPS contínuo indevido.
