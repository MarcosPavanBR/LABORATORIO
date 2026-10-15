# 14 — SRE, observabilidade, custos e continuidade

## Catálogo de jornadas críticas
SLIs: sucesso pedido por tentativa; pedido pago mas não criado; tempo de aceite; atraso despacho; falhas de webhook; reconciliação divergente; p95 API e timeouts; pedidos órfãos; entregas pendentes; suporte não resolvido. Selecionar SLOs pelo modelo operacional, orçamento de erro e impacto humano; não usar SLO 99,99% como decoração.

## Sinais operacionais
Logs estruturados (`request_id`, `correlation_id`, `order_id` pseudonimizado conforme política), métricas RED/USE, tracing distribuído, alertas por causa acionável, dashboards por cidade/loja/PSP e incidentes. Dinheiro e pedido têm invariantes monitoradas, não só CPU/HTTP 200. Alertar `payment captured AND no valid order after grace period`, `ledger imbalance`, `assignment_count >1`, `queue_oldest_age`, `unreconciled_amount`.

## Resiliência
Timeout e retry budgets, outbox, dedupe, DLQ, circuit breaker, graceful shutdown, limites de conexões, proteção contra overload, autoscale baseado em fila/latência, backups PITR se aplicável, restauração comprovada, dependências multi-AZ conforme custo e RTO/RPO realistas. Ensaio de caos em staging: desligar DB, perder fila, PSP timeout, mapa down, WS desconecta, processo restart antes da publicação outbox. Verificar que nenhuma captura gera perdido/duplicado.

## Plano econômico
FinOps por pedido e serviço: infra fixa, egress, mensageria, mapas por requisição, SMS/WhatsApp, push, storage, PSP, IA inference, observabilidade, suporte; custo varia por região e picos. Usar alertas de orçamento e cotas para integrações pagas. Sistemas caros por volume de GPS exigem batching e retenção intencional.

## Runbooks
Cada alerta deve mostrar owner, detector, sintomas, `contain`, `diagnose`, `mitigate`, `restore`, `reconcile`, `communicate`, `postmortem`. Nunca apagar fila ou ledger para "liberar" backlog. Restauração deve incluir sanidade financeira e replay controlado.
