# 05 — Dados, consistência e mensageria

## Banco
Escolher tecnologia conforme consulta, volume, integridade e manutenção; RDBMS é candidato forte para transações, não dogma. Definir esquema normalizado, migrações forward e rollback seguro, lock timeouts, pool, índices por query observada, índices parciais/únicos para idempotência, FKs reais e versionamento otimista. Planejar retenção e particionamento apenas com medições. SQL `NUMERIC/DECIMAL` ou inteiro para moeda; código nunca converte por float. FK do ledger referenciando causa imutável.

## Concorrência real
Casos: última unidade do produto; orçamento do cupom; duas aceitações de motorista; duplicação da request; pedido cancelado simultaneamente ao callback do PSP; estorno parcial repetido. Escrever teste multithread/processo que demonstre resultado estável. `SELECT FOR UPDATE` ou update condicional com versionamento conforme banco; idempotência exige constraint + captura de conflito, não apenas verificação `SELECT` prévia.

## Eventos, outbox e filas
Escrever alteração de agregado e outbox na mesma transação local. Worker faz leasing com visibilidade e retry, publica evento; consumidor mantém inbox/dedupe. At-least-once é premissa, **exactly-once across providers não é promessa**. Registrar poison messages em DLQ com replay auditado; circuit breaker para dependência externa; backpressure; ordenação por agregado quando necessária; jamais usar Redis/pubsub efêmero como única fonte de verdade de movimentação financeira.

## Migração
`expand → deploy compatível → backfill idempotente → verify → cutover → contract`. Testar migração em cópia sintética com perfil realista, incluindo lock de grande tabela, rollback e coexistência de versões. Definir RPO/RTO e exercícios de restauração a partir de backup isolado.

## Segurança de dados
ACL aplicada dentro de todas as rotas e workers; quando RLS aplicável, configurar e testar bypass da conexão com privilégios especiais. Dados PII cifrados em repouso/trânsito quando exigido; segregação de produção/teste; redaction. Evitar data lake de localização nominativa sem finalidade.
