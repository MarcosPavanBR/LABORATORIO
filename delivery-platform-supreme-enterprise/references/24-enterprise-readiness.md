# 24 — Enterprise Readiness Supremo

## Objetivo
Impedir que uma plataforma de delivery seja tratada como enterprise apenas por
ter arquitetura complexa ou muitos agentes. Enterprise exige operação, auditoria,
custo, segurança, privacidade, compliance e capacidade de resposta a incidente.

## Checklist obrigatório

### Identidade e acesso
- [ ] Admin usa MFA.
- [ ] Contas de serviço separadas de contas humanas.
- [ ] Acesso por recurso validado em API, job, websocket, exportação e dashboard.
- [ ] Break-glass existe, é raro, exige justificativa e gera auditoria.
- [ ] Revisão de acesso periódico definida.

### Auditoria
- [ ] Ações financeiras geram evento imutável ou protegido.
- [ ] Acesso a PII gera log com redaction.
- [ ] Alterações administrativas registram autor, motivo quando exigido, antes/depois.
- [ ] Exportações são scoped, limitadas e auditadas.
- [ ] Logs não permitem edição silenciosa sem trilha.

### Dinheiro enterprise
- [ ] Ledger double-entry validado por property tests.
- [ ] PSP sandbox testado com sucesso, falha, timeout, webhook duplicado e evento fora de ordem.
- [ ] Conciliação PSP ↔ ledger ↔ pedido ↔ payout implementada.
- [ ] Reembolso/estorno usa lançamento compensatório.
- [ ] Split comercial separado de obrigação tributária.
- [ ] Ações financeiras sensíveis têm dupla aprovação quando política exigir.

### Segurança
- [ ] Threat model atualizado.
- [ ] Matriz de controle por endpoint, evento, job e webhook.
- [ ] Testes negativos para IDOR, replay, webhook falso, alteração de preço e acesso cruzado.
- [ ] Secrets fora do repositório e com rotação definida.
- [ ] Dependências com SBOM e scan.
- [ ] Pipeline bloqueia segredos e quality gate crítico.

### Privacidade
- [ ] Mapa de dados pessoais por fluxo.
- [ ] Bases legais por finalidade.
- [ ] Retenção e eliminação definidas.
- [ ] GPS coletado apenas enquanto necessário.
- [ ] Suporte acessa PII com controle e justificativa.
- [ ] Incidente de dados possui plano e responsável.

### FinOps
- [ ] Custo estimado por pedido.
- [ ] Budget por ambiente.
- [ ] Alertas de estouro para integrações pagas.
- [ ] Custo de mapas, SMS, push, IA, observabilidade e mensageria separado.
- [ ] Decisão de escala apresenta custo 12/36 meses.

### Resiliência e DR
- [ ] RTO e RPO declarados.
- [ ] Backup restaurado em teste.
- [ ] Rollback testado.
- [ ] Chaos em staging para DB, fila, PSP, mapas e realtime.
- [ ] Plano de degradação sem perda financeira.
- [ ] DR tabletop executado.

### Observabilidade
- [ ] SLIs e SLOs definidos.
- [ ] Alertas para dinheiro órfão, pedido órfão, fila presa, webhook atrasado, ledger imbalance e assignment duplicado.
- [ ] Traces com correlation_id.
- [ ] Dashboards por operação, financeiro, suporte e segurança.
- [ ] Error budget definido.

### Fornecedores
- [ ] PSP avaliado por contrato, webhook, split, custo e suporte.
- [ ] Provedor de mapas avaliado por custo, limite, fallback e privacidade.
- [ ] SMS/push/e-mail avaliados por opt-in, custo e entregabilidade.
- [ ] Fornecedores de IA avaliados por dados, retenção, injection e autorização.
- [ ] Vendor risk register criado.

### Aprovação humana
- [ ] Jurídico/fiscal consultado quando aplicável.
- [ ] Operação financeira revisada.
- [ ] Segurança aprova controles críticos.
- [ ] Suporte treinado para incidente de pagamento, pedido perdido e vazamento.
- [ ] Release decision registrada com owner, data, evidências e riscos aceitos.
