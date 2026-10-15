# Catálogo de testes negativos

| Caso | Request | Expectativa | Evidência |
|---|---|---|---|
| Acesso order alheio | GET order B com sessão A | 403/404, sem PII | integração HTTP |
| Webhook unsigned | POST callback sem assinatura | 4xx, nenhum lançamento | sandbox/testes |
| Replay callback | Evento válido 3x | 1 alteração monetária | query ledger |
| Dois couriers | Aceites concorrentes | 1 assignment | transação DB |
| Quote stale | Finalizar checkout com versão antiga | rejeita e recalcula | integração |
| Refund excess | Reembolsar acima do capturado | nenhuma postagem | teste financeiro |
| Support admin | Ver PII sem permissão/justificação | negar e auditar | RBAC |
