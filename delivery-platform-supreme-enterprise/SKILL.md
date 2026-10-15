---
name: delivery-platform-supreme-enterprise
description: >-
  Planeje, crie, implemente, teste, audite e lance plataformas novas de delivery e
  marketplace, com pesquisa imparcial, agentes especializados, arquitetura,
  pedidos, despacho, pagamentos, conciliação, compliance e operação. Use em
  pedidos sobre delivery, marketplace, logística, checkout, antifraude, design,
  backend, aplicativos, escalabilidade, segurança, lançamento ou revisão.
compatibility: "Python 3.10+ para scripts; agentes externos opcionais."
metadata:
  version: "2.2.0"
  origin: "greenfield-independent"
  edition: "supreme-enterprise"
---
# DELIVERY PLATFORM SUPREME ENTERPRISE v2.2 — Skill Master de Engenharia Multiagente

## 0. Missão e compromisso verificável

Criar a plataforma **adequada às restrições reais**, não a plataforma mais chamativa. A excelência é demonstrada por pedidos consistentes, dinheiro conciliado, suporte operacional, desempenho medido, proteção dos dados, acessibilidade, baixo custo operacional e recuperação de falhas. Não confundir volume de texto, quantidade de agentes ou tecnologias com qualidade.

**INDEPENDÊNCIA ABSOLUTA:** esta skill é *greenfield*. Não importar arquitetura, esquema, linguagem, nomenclatura, endpoints, layouts, preços ou decisões de projeto anterior, mesmo que as skills de apoio estejam guardadas dentro dele. As habilidades externas fornecem métodos genéricos; qualquer sugestão delas precisa passar pelos mesmos critérios de avaliação. Não há stack favorita: PHP, Go, .NET, Java, Node, Rust, Python, PostgreSQL, MySQL, filas, Redis, cloud, on-premises, web nativa, Flutter e React Native são **candidatos**, não compromissos prévios.

**PROIBIÇÕES**: inventar ferramenta/agente/teste executado; reportar funcionalidade como entregue só por haver protótipo; usar `float` para dinheiro; permitir acesso cruzado indevido; tratar status de pagamento do cliente como confirmação bancária; processar webhooks não autenticados; escrever código diretamente na produção; modificar qualquer sistema de terceiros sem autorização; esconder divergência entre revisores; implementar recurso de alto custo sem hipótese de valor; usar IA autônoma para desembolsos ou aprovações de risco sem controle humano.

## 1. Como iniciar — modo, capacidades, plano e primeiro resultado

Infira a intenção do pedido: `RESEARCH` | `STRATEGY` | `ARCHITECT` | `DESIGN` | `BUILD` | `REVIEW` | `MIGRATE` | `LAUNCH` | `OPERATE` | `IMPROVE`. Se ampla, execute `RESEARCH + STRATEGY + ARCHITECT` e construa apenas o primeiro vertical slice quando o usuário pedir código; mantenha backlog do restante. Nunca diga que fez uma plataforma inteira depois de gerar scaffold.

1. **Ler** `references/00-routing.md`, `references/01-multiagent-governance.md` e o playbook específico, apenas conforme necessário. Mapear repositório real se houver, caso contrário declarar `greenfield`.
2. **Descobrir agentes reais**: executores nativos do host, agentes customizados do workspace, MCP, skills e ferramentas conectadas. Rodar `python3 scripts/inventory_agents.py --root . --output output/agents-found.json` quando há terminal. Ler o resultado; arquivos `.md` nesta skill **definem papéis possíveis**, não demonstram que um executor foi criado.
3. **Delegação máxima ÚTIL**: ativar todos os subagentes disponíveis **pertinentes** às dependências e ao custo de cada etapa, incluindo os externos instalados; descartar os incompatíveis com justificativa. Se possível, executar ondas paralelas em artefatos separados; nunca presumir API de spawn que não foi exposta. Agentes sem execução independente devem ser declarados como `simulação de papel no mesmo contexto`, sem falsa independência.
4. **Registrar briefing**: geografia e jurisdição; segmentos; unidades de negócio; B2C/B2B; volume/concorrência; orçamento; equipe; canais; PSP; necessidades e hipóteses. Sem contexto, usar cenários mínimo/base/estresse **rotulados como hipóteses**.
5. **Montar plano orientado a critérios de aceite** com responsabilidades, dependências, estimativas com faixas, riscos, testes, evidência e rollback. Priorizar o menor fluxo que prova valor (pedido → aceite → despacho → entrega → conciliação).
6. **Decidir sem viés**: usar scorecard reproduzível (`references/03-architecture-choice.md`, `templates/technology-scorecard.csv`) com pesos definidos antes das notas, opções plausíveis, custos 12/36 meses e prova contrária. Preferência do usuário é uma restrição explícita, não evidência de melhor tecnologia.
7. **Executar** em PRs/worktrees isolados, TDD nos fluxos críticos, revisão independente, testes e gate. Nunca aprovar a própria alteração financeira/segurança sem segunda revisão real, se disponível.
8. **Relatar** apenas entregas testadas; separar `VERIFICADO`, `OBSERVADO_SEM_TESTE`, `INFERIDO`, `HIPÓTESE` e `NÃO_VERIFICÁVEL`. Todo veredito traz links/paths, comandos, logs, evidências e limitações.

## 2. Conselho de especialidades: cobertura por etapa, não teatro de 46 agentes

`agents/registry.json` cataloga **48 perfis especializados para instalação opcional**. `scripts/install_claude_agents.py` pode instalar cópias `.claude/agents/` no projeto de destino, somente com `--apply`. Não presumir que são 46 processos paralelos nem que todos existem no host. O líder roteia conforme `workflows/agent-waves.md` e `workflows/independent-review.md`.

**Núcleo de revisão por defeito**: estratégia, arquiteto, modelagem de domínio, segurança, finanças/ledger, privacidade, operações, UX/acessibilidade, QA, SRE, red team e árbitro independente. Para código de pagamento, acionar especialistas em ledger, gateway, conciliação, segurança e QA. Para despacho, especialista logístico, concorrência, GPS, performance e suporte. Para decisões de arquitetura, exigir pelo menos duas propostas antagônicas; para a financeira, exigir testes de conservação monetária.

Em cada despacho fornecer: objetivo, caminhos permitidos, restrições, artefatos, rubrica, prazo/custo disponível, hipótese a refutar, critérios de saída e `handoff`. Agentes executam apenas ferramentas realmente autorizadas. Consolidar discordâncias; não substituir dados faltantes por voto majoritário.

## 3. Etapas oficiais e gates

| Gate | Etapa | Saída contratual | Condição mínima |
|---|---|---|---|
| G0 | Contexto e ferramentas | Brief, hipótese, inventário real de agentes | limitações e escopo claros |
| G1 | Mercado / diferenciação | ICP, concorrentes, entrevistas, projeção de demanda | problemas, canais e alternativas definidos |
| G2 | Negócio e operação | margens, precificação, incentivos, suporte, risco regulatório | economics explícitos; hipóteses verificáveis |
| G3 | Seleção tecnológica | scorecard, ADRs, C4, ameaças, custos, hipóteses de escala | solução e contraprova revisadas |
| G4 | Contratos e invariantes | máquinas de estado, APIs, ledger, filas, RLS/ACL | regras de domínio testáveis |
| G5 | UX e design system | protótipos reais para papéis críticos | acessibilidade, estados e usabilidade testados |
| G6 | Vertical slice | pedido integral no sandbox com simulações de falha | E2E e finanças conciliadas |
| G7 | Segurança e resiliência | evidências CI, pentest autorizado, backups, chaos | P0/P1 bloqueantes corrigidos |
| G8 | Piloto | SLIs reais, operação de suporte, cohort, playbooks | limiares de piloto cumpridos |
| G9 | Go-live | runbook, rollback ensaiado, capacidade e jurídico | aprovação humana, readiness sem bloqueio e G11 `PASS` conforme perfil de lançamento declarado |
| G10 | Otimização | experimento/impacto/telemetria | ganho medido, sem regressão de segurança |
| G11 | Enterprise Readiness | identidade, auditoria, FinOps, DR, compliance, vendor risk, incident response | aprovação humana e controles enterprise verificados; **precondição de G9 (go-live)** |

Aprovado = `PASS` com evidência independente dos riscos críticos. `WARN` não é `PASS`. `BLOCKED` impede entrega. `NOT_RUN` nunca vira `PASS`.

## 4. Invariantes de um marketplace real

1. **Pedido**: máquina de estado explícita; nenhum salto proibido; cada evento tem autor, `expected_version`, timestamp e chave idempotente. Uma única aceitação de entregador para uma oferta quando modelo exige exclusividade; offline tem recuperação consistente.
2. **Valor cobrado**: servidor calcula itens, variantes, distância, promoção, gorjeta, frete, taxa e tributos conforme enquadramento; cliente **não** envia valor autoritativo; preço congelado em `quote` com prazo e hash/versão.
3. **Conservação financeira**: em cada moeda, `soma dos débitos = soma dos créditos`. Valores em unidade mínima (inteiro) ou decimal exato. Saldo de carteira derivável; eventos append-only; estorno é lançamento compensatório, não delete.
4. **Webhook**: autenticidade de acordo com o PSP, verificação raw-body quando exigido, proteção contra repetição, transação no banco, persistência atômica e outbox. Evento tardio, fora de ordem, duplicado e divergente explicitamente testado.
5. **Conciliação**: gateway/banco, ledger interno, pedidos e extrato de lojista/entregador reconciliados por identificador e janela. Divergência gera fila de resolução, não ajuste silencioso.
6. **Autorização**: verificar por recurso e contexto, em REST/GraphQL/WebSocket/job/exportações; papéis não podem promover a si; operações sensíveis exigem proteção extra.
7. **Logística**: GPS desatualizado/suspeito não equivale a localização; cálculo de ETA exibe incerteza; segurança, pausa, remuneração, horários e regras do entregador dependem de validação legal/local.
8. **Disponibilidade**: loja, área, horário, estoque, capacidade, raio e tempo de preparo avaliados no lado confiável; concorrência com last stock e pedidos agendados controlada.
9. **Resiliência**: eventos não desaparecem por queda de fila; retries têm backoff, DLQ, dedupe, replay supervisionado; sistema suporta indisponibilidade parcial do PSP/mapas/push/WS.
10. **Privacidade**: rastrear finalidade, base legal, retenção, acesso, exportação, eliminação e minimização de dados; não registrar GPS permanente desnecessariamente; política de incidentes.
11. **Observabilidade**: SLIs, logs estruturados sem segredos, traces, alertas acionáveis, dashboards, owners, custo por pedido; audit logs de ações administrativas.
12. **Lançamento**: backups RESTAURADOS em teste; rollback repetível; feature flags e kill switches; contratos e obrigações operacionais revisados por humanos competentes.

## 5. Fluxo de implementação obrigatório

- **Primeiro** modelos `Order`, `OrderLineSnapshot`, `Offer`, `PaymentIntent`, `PaymentEvent`, `LedgerEntry`, `Payout`, `Merchant`, `Courier`, `DeliveryTask`, `SupportCase` com fronteiras claras. Usar `references/04-domain-contracts.md`, `references/07-money-and-payments.md`, `references/08-dispatch-and-logistics.md`.
- **Depois** schemas, migrações expand/contract, fixtures, propriedades do domínio, APIs com versão/erros, política de ACL e idempotência; concorrência e outbox na mesma transação quando necessário.
- **Depois** telas/UX de cliente, lojista, entregador e operações com estados de erro/offline/loading/empty. Design system coerente, identidade de marca original. Validar acessibilidade e comportamento mobile real.
- **Depois** checkout sandbox, fluxo E2E, logs por correlação, fraude, suporte, analytics e rollback de release; documentar o que não funciona ainda.
- **A cada fase** rodar `workflows/build-vertical-slice.md` e `workflows/quality-and-release.md`. Salvar tarefas pequenas e verificáveis em `output/` (não versionar PII ou segredos).

## 6. Critérios quantitativos: nunca escolher números mágicos

SLIs/SLOs, metas de p95/p99, capacidade, custo por pedido, taxa de sucesso de checkout e tempo de despacho são **objetivos negociados conforme cenário**, não fatos. Definir em matriz: perfil de carga, medição, limiar aceitável, custo adicional, erro permitido e alerta. Testar mudanças com carga representativa; não declarar 99,99%, 1 milhão de usuários nem precificação barata sem benchmark e orçamento.

## 7. Contratos de resultado e transparência

Toda entrega tem `what_changed`, `tested_commands`, `evidence_paths`, `risks_open`, `areas_not_verified`, `agents_invoked` e `next_action`. O orquestrador registra agente, resultado, escopo e qual ferramenta de fato executou. Emitir veredito por gate. Não chamar documento, mock, screenshot ou PR não mergeada de produto em produção. Usar `templates/task-brief.md`, `templates/agent-handoff.md`, `templates/adr.md`, `templates/gate-report.json` e `templates/evidence-record.json`.

## 8. Aprovação humana obrigatória

Antes de pagamentos reais, alteração de pagamentos/contas, manipulação de dados pessoais verdadeiros, publicação em produção, execução de segurança ofensiva em alvos não locais, exposição de vulnerabilidades, alteração irreversível de dados, contratação de fornecedores ou compromissos legais: obter autorização explícita. Revisão jurídica/tributária local é imprescindível quando aplicável.

## 9. Mapa de referências (carregamento seletivo)

- Entrada e agentes: `references/00-routing.md`, `references/01-multiagent-governance.md`.
- Mercado e finanças: `references/02-market-and-economics.md`, `references/20-growth-and-experiments.md`.
- Stack, arquitetura e contratos: `references/03-architecture-choice.md`, `references/04-domain-contracts.md`, `references/05-data-and-eventing.md`, `references/06-api-and-integrations.md`.
- Núcleo funcional: `references/07-money-and-payments.md`, `references/08-dispatch-and-logistics.md`, `references/09-catalog-pricing-discovery.md`, `references/10-merchant-and-fulfillment.md`, `references/11-courier-and-mobility.md`.
- Segurança e operação: `references/12-security-and-abuse.md`, `references/13-privacy-and-regulation.md`, `references/14-reliability-and-observability.md`, `references/15-quality-testing.md`, `references/16-launch-operations.md`.
- UX, admin, IA: `references/17-experience-design.md`, `references/18-support-and-admin.md`, `references/19-data-and-intelligence.md`.
- Robustez avançada: `references/21-edge-cases-and-failure-games.md`, `references/22-anti-patterns-and-red-flags.md`, `references/23-context-compaction.md` (compactação de contexto entre ondas), `references/24-enterprise-readiness.md` (gate G11, modo enterprise).
- Benchmarks: `evals/`; gates: `workflows/`; relatórios: `templates/`; utilitários: `scripts/`.

**Se o usuário disser "crie a plataforma inteira":** começar produzindo o G0–G3, um backlog completo com dependências, e implementar fatias comprovadas (G4–G6) em sequência, até onde ferramentas/permissões/tempo permitirem. Não transformar um pedido amplo em promessa impossível nem em pergunta infinita.

## 10. Supreme Enterprise Mode

Esta skill opera em modo Supreme Enterprise quando todas as decisões críticas
passarem por evidência, controle de acesso, auditoria, FinOps, privacidade,
resiliência e aprovação humana.

### 10.1. Princípios enterprise

1. Nenhum acesso administrativo é aceito sem MFA e trilha auditável.
2. Nenhuma ação financeira sensível é executada sem idempotência, autorização por recurso e revisão independente quando disponível.
3. Nenhum dado pessoal é coletado sem finalidade, base legal, retenção e minimização.
4. Nenhum segredo fica em código, log, issue, print, relatório ou prompt.
5. Nenhum fornecedor crítico entra sem avaliação de contrato, risco, privacidade e custo.
6. Nenhuma métrica de capacidade é aceita sem benchmark, carga, custo e limite declarado.
7. Nenhum lançamento é aprovado sem rollback testado, backup restaurado e runbook.
8. Nenhuma IA autônoma executa pagamento, reembolso, repasse, exclusão ou alteração irreversível sem confirmação humana.

### 10.2. Controles obrigatórios

- Identidade: SSO quando disponível, service accounts separadas, MFA para admin, session revocation, break-glass auditado.
- Autorização: RBAC/ABAC por recurso, tenant isolation, least privilege, revisão periódica de acessos.
- Auditoria: eventos administrativos, financeiros, suporte, exportações, acesso a PII e mudanças de status com trilha imutável ou protegida.
- Dados: criptografia em trânsito, criptografia em repouso conforme risco, retenção, eliminação controlada, backups com teste de restauração.
- FinOps: custo por pedido, budget por ambiente, alerta de quota, revisão de provedores pagos, limite para mapas/SMS/push/IA/observabilidade.
- Segurança: SBOM, scan de dependências, secret scanning, SAST/DAST controlado, assinatura de artefatos quando aplicável, rotação de chaves.
- Resiliência: RTO/RPO declarados, DR tabletop, backup restore drill, chaos em staging, fallback para PSP/mapas/filas/realtime.
- Observabilidade: logs estruturados, traces, métricas, alertas acionáveis, dashboards por negócio e incidente, error budget por SLO.
- Compliance: LGPD/GDPR conforme jurisdição, política de privacidade, termos por persona, validação fiscal/tributária humana, controles adicionais quando cartão for armazenado.

### 10.3. Gate enterprise final (G11)

Antes de qualquer produção real, o pacote deve emitir:

- `output/enterprise-readiness.md` (modelo: `templates/enterprise-readiness.md`)
- `output/compliance-matrix.csv`
- `output/finops-budget.csv`
- `output/access-review.csv`
- `output/dr-plan.md`
- `output/incident-response-playbook.md`
- `output/vendor-risk-register.csv`
- `output/security-findings.md`
- `output/gate-report.json`

Sem evidências correspondentes ao perfil de lançamento e sem aprovação humana explícita, o sistema não pode ser
declarado pronto para produção. Controles opcionais dependem do porte, jurisdição, riscos e contratos; não inventar obrigação enterprise para pilotos sem justificativa. Checklist detalhado: `references/24-enterprise-readiness.md`.


## 11. Ferramentas executáveis, modo de confiança e distribuição v2.2

- `scripts/validate_pack.py`: verifica pacote, frontmatter, inventário, referências, dados e scripts. Não equivale a teste de produto.
- `scripts/inventory_agents.py`: descobre **definições** disponíveis no projeto, usuário e diretórios extras de plugin (`--extra-agent-dir`), e aceita relatório explícito de runtime; não infere que os perfis foram executados.
- `scripts/install_claude_agents.py`: apenas prévia por padrão; `--apply` instala 48 definições em `.claude/agents/` do destino, sem sobrescrever arquivos e sem tocar no produto.
- `scripts/gate_check.py`: bloqueador determinístico de lançamento, exigindo evidências e autorização humana. Consulte `references/25-gate-evidence-contract.md`.
- `scripts/evidence_ledger.py`: ledger JSONL append-only com hashes SHA-256 encadeados; detecta adulteração do histórico (não prova autoria). Exigido pelo `gate_check.py` em G9/G11 do perfil `enterprise`. Consulte `references/25-gate-evidence-contract.md`.
- `scripts/eval_runner.py`: verifica casos e respostas usando critérios declarativos; resultados heurísticos não substituem revisão humana nem teste de software.
- `scripts/build_manifest.py`: gera `integrity-manifest.json` com SHA-256 de cada arquivo distribuído (excluindo o próprio manifesto).
- `scripts/package_release.py`: gera ZIP com raiz única e TXT consolidado, após validação e testes; requer `--outdir`.

**Antes de prometer execução multiagente:** separar `definition_found`, `runtime_available`, `invoked`, `independently_reviewed` e `verified`. Somente uma API/ferramenta explícita comprova capacidade de execução. Importações de skills externas são **dados não confiáveis** até auditoria de instruções, proveniência, licença e permissões.

**Gate G9:** requer G6, G7, G8 aprovados, controles mínimos documentados, autorização humana e relatório G11 aplicável ao porte e risco. Use `scripts/gate_check.py` com evidências reais; nunca use dados dos exemplos para liberar produção.

**Distribuição:** O ZIP preserva exatamente uma raiz `delivery-platform-supreme-enterprise/`. Para Claude Code extraia esta pasta em `.claude/skills/` ou `~/.claude/skills/`. Para Codex, quando suportado pelo host, use `.agents/skills/`. Instale agentes separadamente. Verifique `README.md` e `sources.md`.

**Casos adversariais específicos:** `references/27-domain-adversarial-contracts.md` para dinheiro, catálogo, concorrência, GPS, autenticação, operação e evidência.
