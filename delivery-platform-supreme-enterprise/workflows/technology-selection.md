# Workflow C — escolha imparcial de arquitetura (G3)

1. Congelar escala-alvo, picos, geografia, equipe, prazos, orçamento, SLIs e requisitos legais antes do scorecard.
2. Definir critérios e pesos **antes** de pontuar candidatos. Revisar pesos com usuário quando necessário.
3. Gerar opção A incremental, B intermediária e C distribuída; incluir stack frontend/backend/mobile/DB/filas/PSP/mapas/cloud e custo total. Não deixar um item sem alternativa e preço incerto rotulado.
4. Arquitetos pró/concorente trabalham em paralelo sem consultar pontuações um do outro quando possível. Especialistas DBA/SRE/sec/perf desafiam os dois.
5. Executar PoC de maior risco: transação + outbox; checkpoint idempotente; frontend/device; deploy mínimo; medição com perfil definido. Sem runtime, marcar PoC não realizada.
6. Calcular nota ponderada com um indicador de confiança por critério, testar sensitividade: variar pesos ±25% e estimativas de custo ±50%. Se vencedor muda facilmente, a recomendação é frágil.
7. ADR explica opção simples, alternativa, tradeoff, dívida deliberada, gatilho de migrar e rollback. `PASS` só com evidências necessárias ao risco.