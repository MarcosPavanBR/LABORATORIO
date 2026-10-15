# Workflow F — quality gate, incident response e lançamento (G7–G9)

1. Compilar/build; lint; testes unit/integration/E2E; SAST + dep review + secret scanner; migrations dry-run; contract tests; stress em perfil-alvo; restore rehearsal e rollback.
2. Verificar segurança negativa por persona, endpoint, WebSocket, jobs, dashboard e webhook; financeiro via ledger/reconciliação e eventos duplicados.
3. Medir SLOs no piloto, filas/delays, pedidos órfãos, incidentes, suporte e unit economics; não declarar p99 sem medição.
4. Preencher `templates/gate-report.json` com evidências dos P0 e P1 e executar `python3 scripts/gate_check.py --report output/gate-report.json`. Fail closed na ausência de prova.
5. Fazer tabletop PSP fora, DB fora, courier offline, vazamento credencial e incidente PII; guardar runbooks com contatos, responsabilidades e planos de comunicação.
6. Exigir aprovação humana registrada antes de operar dinheiro/dados/release reais. Realizar rollout progressivo com `abort_thresholds` definidos; reverter se excedidos; reconciliar transações após rollback.
