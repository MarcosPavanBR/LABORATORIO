# 03 — Escolha imparcial de stack e arquitetura

## Contrato de comparação
Especificar workloads: pedidos/dia e pico por minuto, write patterns, GPS por minuto, nível de consistência, concorrência de estoque, regiões, apps, experiência da equipe, prazo MVP, disponibilidade e orçamento. Incluir 12 e 36 meses. Usar `templates/technology-scorecard.csv` e ADR.

Compare pelo menos três desenhos viáveis para o mesmo problema: (A) monólito modular com banco relacional, eventos internos/outbox; (B) monólito + workers separados; (C) serviços por domínio com orquestração e mensageria. Os casos A/B/C são **arquiteturas hipotéticas** e não têm linguagens pré-selecionadas. Trocar candidatos de frameworks mediante experiência/custo. Não pressupor que microserviços = escala, nem que serverless = barato.

## Critérios e pesos definidos antes da avaliação
Exemplo para discutir (não default universal): integridade 20, produtividade 15, disponibilidade 15, TCO 15, segurança 15, operação 10, portabilidade 5, performance 5. Trocar pesos após registrar motivo, nunca após ver vencedor. Notas (0–5) exigem prova: benchmark, documentação atual, custos estimados com premissas, POC, competência verificável, restrições legais; sem prova `unknown` e penalidade de incerteza. Não ponderar alternativas incomparáveis com dados inventados.

## Escolhas concretas a justificar
Linguagem e suporte LTS; modelo de deploy; Postgres/MySQL/outro; fila transacional, Redis/sem Redis; storage/CDN; busca full-text/engine dedicado; cache e invalidação; geoespacial e mapas; realtime WebSocket/SSE/polling; framework mobile e compatibilidade offline; observabilidade; identidade; PSP; provedores de push; custos de API por pedido; lock-in reversível.

## Decisões estruturais
Bounded contexts claros: identidade, catálogo, pricing, pedido, pagamento, ledger, despacho, comunicação e suporte. Chaves idempotentes e máquina de estados são contratos transversais. Definir sincronismo por consistência do fluxo, não preferência. Dados financeiros exigem transação forte local, saga/outbox para efeitos remotos; não apoiar atomicidade em duas bases independentes sem um protocolo real. Escrever diagrama C4, diagrama de sequência normal e falhas PSP/loja/entregador.

## ADR de 1 página
`context`, `drivers`, `options A/B/C`, `objective scores`, `security concerns`, `operational implications`, `decision`, `rejected alternatives`, `migration/rollback`, `reversal triggers`, `evidence links`. Uma escolha só pode ser dita final após revisão A/B, risco e orçamento. Dividir em entregas reversíveis quando houver grande incerteza.
