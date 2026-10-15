# Avaliações da skill — regras de honestidade

`scenarios.json` contém casos adversariais de negócio, arquitetura, integridade monetária, logística, segurança, UX, incidentes e go-live. A avaliação de termos do `eval_runner.py` é **apenas um filtro heurístico**; palavras corretas numa resposta não demonstram raciocínio, código funcionando nem aprovação de um humano.

Para avaliação real:

1. Criar ou acessar projeto novo em sandbox isolada, sem dados pessoais, com permissão de teste.
2. Para cada `id`, pedir a um modelo/agente para responder o prompt sob a Skill instalada (registrar versão do modelo, host, commit, data, capacidades, tool logs).
3. Guardar JSON com chaves `id` e valores `{"response":"...", "evidence_paths":["..."]}`.
4. Executar `python3 scripts/eval_runner.py --responses-json respostas.json --output resultado.json`.
5. Revisão HUMANA amostral ou de todos os casos críticos: verificar preservação de dados, contratos, rotas, logs, ameaças, artefatos reais, falsos positivos e origem do `PASS`.
6. Comparar antes e depois da alteração com mesmo conjunto de casos e contexto equivalente, incluir custo/tokens/latência.

**Não publicar placar numérico de performance de LLM sem ter rodado os modelos.** `NEEDS_HUMAN_REVIEW` não significa PASS.
