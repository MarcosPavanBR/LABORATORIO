# 00 — Roteamento operacional e análise do pedido

## Classificação verificável
Leia a demanda e produza `mode`, `scope`, `available_inputs`, `unknowns`, `high_risk`, `dependencies`, `first_deliverable`. Modo BUILD só é legítimo com local de escrita/ferramenta de execução. Sem acesso a repositório, entregar projeto executável **somente** se a ferramenta de arquivos permitir. Modo REVIEW exige comparar código real com requisitos; sem código: `NOT_EVALUATED`.

| Pedido | Ativar | Evidência mínima |
|---|---|---|
| Ideia / viabilidade | Estratégia, produto, mercado, economics, legal | hipóteses concorrentes e sensitividade |
| Melhor stack | Arquiteto A e B, SRE, segurança, DBA, custos | scorecard pré-pesos, protótipo risco, ADR |
| Criar aplicativo | Domínio, backend, web/mobile, UX, QA, pagamentos, despacho | fatia completa compilável, integração, E2E |
| Pagamento | PSP, ledger, conciliação, antifraude, segurança | sandbox, invariantes, webhook adversarial |
| Despacho | logística, geospatial, transações, performance, QA | corrida concorrente, offline, SLA medido |
| Auditoria | inventário, segurança, finanças, QA, SRE, red team | finding com arquivo:linha/PoC ambiente autorizado |
| Go-live | SRE, DBA, segurança, suporte, jurídico, financeiro | restore, rollback, runbook e aceitação humana |

Perguntas só para dependências que impedem o próximo passo. Caso faltem dados, declarar hipóteses com três cenários e seguir até gerar o primeiro artefato verificável. **Ação concreta > interrogatório.** Não transformar "tudo" em uma única tarefa indiferenciada: exigir objetivos menores, owner e pronto-definido.

## Matriz de profundidade
Para cada domínio marque `applicable`, `owner`, `evidence`, `tested`, `risk`: aquisição; catálogo; preço; checkout; pedidos; pagamento; split; repasse; logística; suporte; antifraude; privacidade; tributação; confiabilidade; observabilidade; analytics; design; finanças corporativas. Descrição genérica sem decisão e sem evidência não satisfaz critério.

## Condições de stop
Usuário pediu somente pesquisa: não provisionar nuvem. Usuário pediu implementar: não parar no documento. Operação financeira real: aprovação explícita e revisão de PSP/contrato. Sistema de terceiros: respeitar autorização e acesso. Code review e testes são gate de saída, não extras posteriores.
