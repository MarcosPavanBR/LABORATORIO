# 15 — Pirâmide de qualidade e matriz de evidências

## Estratégia multidimensional
Unitários para cálculo e transitions; property-based para conservação monetária e invariantes; integration tests com banco e PSP sandbox; contract tests para clientes e eventos; E2E de todas as personas; segurança negativa; load/stress/soak; caos e recuperação; acessibilidade automatizada + manual; dispositivos mobile reais para GPS/offline.

## Critérios mínimos de prioridade
P0: dinheiro, acesso cruzado, status impossível, cobrança/repasse duplicado, segredo, irreversibilidade. P1: pedido perdido, desconto abusivo, oferta concorrente, ticket sem suporte, restauração ruim. Não basta 90% de cobertura se casos monetários críticos não têm teste. Mutation testing e contraexemplos garantem qualidade melhor que cobertura simples.

## Matriz principal
- Cliente: endereço/cobertura → cart/quote → checkout → PSP sandbox pago/negado/timeout → acompanhamento → suporte/reembolso.
- Lojista: recebe uma vez, aceita/recusa, prepara, informa indisponibilidade, reimprime, dois tablets simultâneos.
- Courier: oferta, aceita em concorrência, pickup e entrega, rota degradada, offline e crash.
- Admin: acesso privilegiado protegido, dupla aprovação para ações monetárias sensíveis quando política exige, logs, disputa, reconciliação.
- Financeiro: captação única, ledger zerado, split exato, refund parcial, chargeback, cobrança em PSP sem pedido, atraso webhook.

## Testes reais e relatórios
Todo caso reporta comando, versão ambiente, seeds, fixture sintética, expected vs actual, timestamp, commit e log sanitizado. Registro `NOT_RUN` quando indisponível. Não gerar print colorido como substituto de teste. Casos flaky: investigar causa, nunca desabilitar sem issue de risco.

## Escopo ofensivo
Somente em infraestrutura própria, local ou staging autorizado, sem dados reais. Segurança passiva não prova ausência de vulnerabilidade; registrar gap. Teste de desempenho inclui limites negociados e falhas, não percentis sem amostra.
