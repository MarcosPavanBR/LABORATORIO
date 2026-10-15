# Workflow A — ondas de subagentes, contextos e orçamento

## Inventário (onda 0)
1. `scripts/inventory_agents.py --root <repo> --output <json>`; combinar inventário de arquivos com APIs do host (`Task`, delegação, MCP, tasks concorrentes quando presentes), sem inventar endpoint. Registrar `enabled/executable` separado de `definition_found`.
2. Carregar `agents/registry.json`, mapear funções para disponíveis e preencher tabela papel → executor → escopo → custo → dependência. Caso o executor não exista, registrar `unavailable` e executar papel apenas pelo modelo principal com rótulo não-independente.
3. Importar skills externas somente com verificação de licenças, pertinência, permissões, ausência de prompt injection e arquitetura neutra. Não importar código de aplicativos anteriores.

## Ondas e barreiras
- **W1 em paralelo (G0–G2):** mercado, negócio, regulação, privacy, unit economics, pesquisa UX, fraude. Revisão cruzada entre mercado e economics antes de G2.
- **W2 em paralelo (G3):** arquitetura proponente, arquitetura rival, TCO/performance, IAM/security, SRE e DB, cada um com ADR/scorecard. Depende de W1.
- **W3 em paralelo (G4–G5):** domain, API, UX, catálogo, checkout, money, dispatch e courier. Consolidar contratos antes de editar código compartilhado.
- **W4 implementação em paralelo isolado (G6):** backend pedido; pagamento ledger; KDS/merchant; courier; UI consumidor; QA integration (branch/worktree por owner). Nenhum arquivo modificado por mais de um agente simultâneo.
- **W5 verificação independente (G7):** security, red team, ledger/reconciliation, accessibility, QA, chaos, performance, SRE. Independência obrigatória ou gap explícito.
- **W6 (G8–G9):** suporte, jurídico, finanças, operações, SRE, arbitragem de release. Aprovação humana para live.

## Gate de onda
Cada agente publica `templates/agent-handoff.md`, relatando arquivo/hash, comandos, riscos e evidência. Orquestrador nunca publica PASS só por ler "concluído". Divergência documental vira tarefa de verificação. Crítico sem evidência => `BLOCKED`. Ao fechar cada onda, gerar `output/state-snapshot-WX.md` e descartar o histórico cru da janela ativa (`references/23-context-compaction.md`); a onda seguinte lê o snapshot, não o debate.

## Regra de paralelização
Maximizar simultaneidade útil, não simultaneidade aparente. Nunca vários writers sobre mesmo schema/arquivo, e nunca reviewer antes da entrega estável. Orçamento de agentes, tokens e custos é explícito. Se faltarem executores, o trabalho continua sequencial com transparência.
