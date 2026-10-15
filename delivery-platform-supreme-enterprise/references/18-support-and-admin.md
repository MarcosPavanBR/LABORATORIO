# 18 — Atendimento, backoffice, risco e disputas

## Funções administrativas
Painel de suporte e plataforma com RBAC granular e MFA, trilha de ações e registros de justificativa. Permitir ver problemas de pedido sem expor PII completa por padrão; acesso emergencial `break-glass` auditado; alterações de repasse e estorno exigem aprovação/limites configurados. Gestão de estabelecimentos, couriers, promoções, campanhas, mapas de calor operacionais agregados, indicadores de SLA e auditoria.

## Suporte integrado a pedido e dinheiro
Tickets com motivo, severidade, timeline canônica, responsável, comunicação e política de compensação. Macro de atendimento não cria cobrança ou reembolso por mensagem de IA. Executar mudança sensível apenas via workflow autenticado, com limites financeiros, autorização por recurso e confirmação de risco. Regras de disputa consideram restaurante, cliente, courier e PSP, com provas retidas conforme base legal.

## Antifraude operável
Sinais: velocity, novos dispositivos, abuso cupom, chargeback por coorte, endereço suspeito, divergência GPS, loja com cancelamentos anormais, courier compartilhando conta. Uma flag dispara análise humana conforme criticidade; falsos positivos e recurso têm processo, não bloqueio permanente automático. Explicabilidade sem expor heurísticas de risco sensíveis.

## Relatórios
GMV separado de receita reconhecida; payables, fees PSP, estornos, disputas e reconciliação visíveis; exportações scoped e auditadas. Saber quais pedidos ficaram sem loja, sem courier, sem captura ou sem suporte. Nunca deixar operadores alterar status financeiro diretamente no banco por dashboard arbitrário.
