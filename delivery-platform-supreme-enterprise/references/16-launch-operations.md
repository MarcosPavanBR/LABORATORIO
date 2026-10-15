# 16 — Go-live operacional de marketplace

## Antes da inauguração
Verificação legal/contábil; contrato PSP; KYC dos recebedores quando exigido; verificações de segurança; suporte e escalonamento; horários lojistas e operadores; treinamento entregadores; caso fraude/incidente humano; calendário de feriados. Plano financeiro de primeira semana e capacidade manual de recuperação de pedido.

## Checklist de prova
1. Infra deployável e rollback testado na versão anterior.
2. Migração realizada em cópia com dados simulados semelhantes em tamanho e lock; backup restaurado e auditado.
3. Fluxo realista pago no sandbox, webhook repetido, erro de PSP e conciliação.
4. Permissões de consumidor/lojista/entregador/admin com testes negativos.
5. Uptime e alerta do sistema medidos em piloto; plantão com dono.
6. Termos/política/consumidor/lojista/entregador revisados por humano habilitado conforme local.
7. Possibilidade de bloquear novas compras, pausar loja, pausar despacho, pausar pagamentos/repasse via kill switch controlado.
8. Roteiro de comunicação quando pagamento foi cobrado mas pedido não entra na cozinha.
9. Feature flag por cidade e percentuais; rollout progressivo; ponto de abortar definido ANTES do deploy.
10. Release decision registrada com owner, hora, evidências e riscos aceitos.

## Piloto supervisionado
Começar com raio e horários pequenos. No início observar manualmente falhas de pedido, suporte e caixa, sem divulgar crescimento maior do que a capacidade. Registrar primeira compra, recompra, cancelamentos, incidentes, tempos reais, margem de contribuição, diferença de conciliação. Proibir ativação automática em outra região apenas por decisão de código.

## Critério GO / NO GO
NO GO se P0/P1 de dinheiro, segurança ou perda de pedido; sem backup testado, sem suporte, sem operação PSP verificada, sem operação jurídica mínima, sem evidência de rollback ou sem aprovação humana. GO não significa sistema sem defeitos: limitações residuais são explícitas e mitigadas.
