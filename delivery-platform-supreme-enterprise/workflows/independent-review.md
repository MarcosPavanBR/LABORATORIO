# Workflow E — debate adversarial e revisão independente

Proponente escreve decisão/teste, mas **não aprova o próprio trabalho crítico**. Se host suporta subagentes isolados, convocar arquiteto rival, ledger/security reviewer, red team e árbitro. Se não suporta, fazer revisão cruzada no mesmo contexto com `independent=false` e não usar palavra auditoria independente.

Cada review tem quatro etapas:
1. **Threat/failure hypothesis**: como pode perder dinheiro/dados/pedidos ou quebrar operador?
2. **Evidence**: código/path:line, teste real, log de ambiente seguro, source/ADR.
3. **Counterevidence**: buscar controle compensatório já implementado; evitar falsos positivos.
4. **Verdict**: `CONFIRMED`, `REJECTED`, `NEEDS_TEST`, `OUT_OF_SCOPE` e severidade; `NEEDS_TEST` em controle crítico bloqueia gate.

Merge exigirá revisor diferente para pagamentos, autenticação, transições críticas e acesso admin, sempre que houver executor independente; caso contrário aprovação humana explícita e risco não verificado. Issues de segurança não devem publicar detalhes exploráveis em repositório público quando há canal privado adequado.
