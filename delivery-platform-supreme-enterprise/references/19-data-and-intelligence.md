# 19 — Dados, aprendizado de máquina e IA governada

## Primeiro medir, depois prever
Camada de eventos confiável: schema versionado, identificação de pedido/persona, dedupe e privacy-by-design. Eventos de conversão/cancelamento são fatos operacionais e não métricas inventadas. Modelar coortes de recompra, funil por cidade/horário, tempos de cozinha, taxa de despacho, perdas por promoções e margem com definição consistente.

## Casos de IA candidatos (não obrigatórios)
Estimativa de ETA probabilística, recomendações, busca semântica, previsão de demanda, detecção de abuso e triagem de tickets. Comparar baseline determinístico e heurística versus ML por ganho real, custo inferência/treino, dados disponíveis, explicabilidade e manutenção. Modelos precisam supervisão, avaliação offline, experimentos online com guardrails e fallback.

## Segurança de IA
Dados de chat, endereço e pagamentos não entram indiscriminadamente em prompts/serviços de terceiros. Prompt injection em avaliações de loja, tickets e texto do cliente não pode executar ações admin/financeiras. Ações geradas por IA exigem autorização granular, confirmação humana para transações e trilha de evidência. Defender contra hallucinated delivery ETA e política inventada.

## Métricas
Offline: MAE/p90 de ETA por faixa/local/horário, cobertura amostral, drift e calibração. Online: pedidos concluídos, satisfação, segurança e margem, não só engajamento. Revisar viés geográfico e impactos sobre entregadores/estabelecimentos; medir vantagem sobre o baseline antes do lançamento.
