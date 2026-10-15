# 01 — Orquestração multiagente, independência e prova de execução

## Descoberta antes de distribuir
1. Ler capacidades do host; procurar executores, tarefas paralelas, tools/MCP e limites de sessões; buscar `.claude/agents`, `.agents/`, agentes dos plugins e skills em diretórios suportados. Executar `scripts/inventory_agents.py` para o que está em disco; **não** interpretar isso como prova de executabilidade. Instalar os 46 perfis apenas com autorização explícita de alteração no workspace.
2. Em `output/agent-ledger.jsonl`, registrar `{name, origin, executor, enabled, permission, assigned_work, started_at, completed_at, evidence_path, status}`. `executor=role-play` se só o modelo principal revisou; `independent=true` somente quando houve agente/contexto distinto em execução.
3. Não fabricar `Task/AgentTool/spawn_agent`; usar interfaces realmente disponíveis. Se nenhum executor, aplicar duas revisões sequenciais com hipóteses antagônicas, mas marcar `non-independent`.

## Política de paralelização máxima relevante
Dividir tarefas somente quando tenham **outputs independentes** e interfaces definidas. Paralelizar G1 pesquisa de mercados/regulação/modelo financeiro e G3 opções A/B, custos e segurança. NÃO paralelizar migrations dependentes, edições no mesmo arquivo, mudanças no ledger sem design acordado, deploys concorrentes, ou revisões dependentes do resultado. Filas de trabalho com `ready`, `in-progress`, `review`, `blocked`, `done` e sem dois writers no mesmo path.

## Protocolo de delegação (copie para cada subagente)
`TASK-ID`, `MISSION`, `INPUTS`, `ALLOWED_PATHS`, `READ_ONLY?`, `DEPENDENCIES`, `DON'T ASSUME`, `COUNTEREXAMPLE_TO_FIND`, `ACCEPTANCE_TESTS`, `EXPECTED_ARTIFACT`, `RESOURCE_BUDGET`. Obrigatório: links/linhas, testes rodados, riscos, confiança e `NOT_RUN` quando preciso. Proibir ampliação unilateral de escopo. Revisor nunca reescreve silenciosamente implementação. Áreas financeiras/privacidade exigem revisor distinto.

## Debates adversariais estruturados
- Proponente A defende solução econômica e incremental.
- Proponente B defende alternativa diferenciada e seus limites.
- Red Team ataca suposições/casos-limite; Blue Team propõe controles.
- Árbitro compara **evidências e custo**, não votos; registra desacordos em ADR.
- Se o árbitro foi autor de código, perder independência para aquele gate; obter outro revisor humano/agente distinto ou sinalizar ausência.

## Controle de custo e contexto
Definir limites por fase: agentes ativos simultâneos, tempo, tokens/custo, consultas pagas, orçamento de infra. Escrever entregáveis compactos com referências persistidas, não colar histórico inteiro para todos os agentes. Ao saturar contexto: handoff com decisões, pendências, último hash e artefatos; não "resumir" falhas críticas.

## Agentes externos
Skills do GitHub do usuário só fornecem boas práticas genéricas de TDD, auditoria e gates. Não ativar agente de linguagem incompatível só para aumentar contagem. O objetivo é cobertura técnica, NÃO marketing baseado em número de bots.
