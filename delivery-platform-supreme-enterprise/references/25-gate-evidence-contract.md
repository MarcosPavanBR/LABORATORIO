# Contrato de evidências, gates e perfis de lançamento

## Diferenciar estágio do produto de grau de maturidade

- **Protótipo/demonstração:** somente dados fictícios, PSP sandbox, sem exposição pública. Nenhum relatório deve chamá-lo de produção.
- **Piloto comercial controlado (perfil `mvp`):** já é produção, logo exige autorização humana, LGPD e segurança aplicável, conciliação, suporte, recuperação, SLIs e testes dos fluxos monetários; não presume que SSO, SCIM ou certificação específica sejam universalmente obrigatórios.
- **Operação enterprise (perfil `enterprise`):** soma segregação de acesso por equipes, revisão de fornecedores, auditoria, SLAs, provas de continuidade e controles avançados compatíveis com riscos e contratos.

A norma aplicável é decidida por geografia, serviços, categoria, meio de pagamento e responsabilidade contratual. Não transformar recomendação técnica em obrigação legal. Ajustar o gate aos contratos/jurisdição documentados, sem retirar controles centrais.

## `gate_check.py` (falha fechada)

Entrada é um JSON de alegações, não uma prova independente. Exemplo de estrutura (substituir por evidências reais):

```json
{
  "gate":"G9", "profile":"mvp", "commit":"<git-sha-real>",
  "p0_open":0, "p1_open":0,
  "critical_cases":[
    {"id":"checkout-e2e","status":"NOT_RUN","source":"automated-test",
     "executed_by":"NOT_INVOKED","test_command":"","evidence_path":"","sha256":""}
  ],
  "prerequisite_gates":[],
  "artifacts":[],
  "ledger":{"path":"output/evidence-ledger.jsonl","entries":0,"head":"<hash-de-evidence_ledger.py head>"},
  "human_approval":{"approved":false,"approver":"","timestamp":"","scope":""}
}
```

`G9` precisa de relatórios anteriores `G6`, `G7`, `G8`, `G11`, todos com `PASS` genuíno e hash conferido. Nunca gerar PASS como valor padrão. Exemplos não podem liberar produção. `G11` é uma avaliação de prontidão por perfil, não exigência universal de todos os recursos de corporações multinacionais.

`critical_cases` precisam cobrir: checkout ponta a ponta; prevenção de dupla cobrança; balanço do ledger; replay de webhook; autorização por recurso; máquina de estados; corrida de aceite; conciliação; restauração de backup; rollback; privacidade; runbook; revisão legal; custo por pedido. Perfil enterprise adiciona controle de acesso, vendor risk, simulação DR, integridade de auditoria e rotação de segredo.

Um `PASS` em arquivo JSON é apenas uma **declaração apoiada por um artefato**. O validador confere existência e SHA-256, mas não sabe se o comando de teste foi realmente executado naquele commit. Revisor humano, CI confiável ou atestação assinada devem conferir execução e identidade. Não usar o validador isoladamente como autorização de deploy.

## Ledger de evidências encadeado (`evidence_ledger.py`)

Cada caso crítico aprovado é registrado em um arquivo JSONL append-only. Cada linha guarda `seq`, `timestamp`, `prev_hash`, o `record` e `entry_hash` = SHA-256 do JSON canônico dos demais campos, ligado ao hash da linha anterior.

```bash
# registrar (record: id, gate, status, commit, executed_by, sha256 do artefato)
python3 scripts/evidence_ledger.py append --ledger output/evidence-ledger.jsonl --record output/case-checkout.json
# fixar no relatório do gate os valores de "entries" e "head"
python3 scripts/evidence_ledger.py head --ledger output/evidence-ledger.jsonl
# conferir a cadeia e o ponto fixado
python3 scripts/evidence_ledger.py verify --ledger output/evidence-ledger.jsonl --expect-entries N --expect-head H
```

No `gate_check.py`: perfil `enterprise` em **G9 e G11** exige o bloco `ledger`; em qualquer perfil, se o bloco existir, é verificado. O gate bloqueia se a cadeia estiver quebrada, se o ledger for mais curto que `entries` (truncamento), se o hash na posição `entries` diferir de `head` (histórico reescrito) ou se um caso crítico não estiver registrado com o mesmo `id`, `sha256`, `commit` e status `PASS`. O ledger pode crescer depois do relatório: só o prefixo fixado é conferido.

**Limites (não vender como mais do que é):**
- Dá **evidência de adulteração**, não autoria nem não-repúdio. Quem escreve no ledger *e* no relatório consegue reconstruir a cadeia inteira.
- Para valor de auditoria, ancorar `head` fora do projeto: tag/commit git assinado, artefato de CI confiável ou carimbo de tempo externo; para autoria, assinar com chave assimétrica (ferramenta externa à skill).
- Não prova que o teste foi executado de verdade; continua valendo a conferência por CI confiável ou revisor humano.
- Escritor único: o lock é advisory (POSIX); em outras plataformas, não escrever em paralelo.

## Invariantes da liberação

1. Entrega depende de G6, G7, G8, G11 e autorizações reais (registro de autoria, data, ambiente e escopo).
2. Aprovador de alterações financeiras não é o mesmo responsável que as implementou, sempre que houver separação disponível; sem essa revisão, status é condicional/bloqueado conforme risco.
3. Nenhum P0/P1 aberto. `WARN` ou `NOT_RUN` é bloqueio em fluxo crítico.
4. Logs e anexos sensíveis nunca saem em evidência pública; substituir por hashes/redações seguras.
5. Cenários alternativos (retiro em loja, dinheiro físico, farmácia, mercados) possuem testes adicionais por decisão documentada.
6. Os gates protegem o processo. `G9` jamais deve executar deploy, cobrar cliente ou alterar pagamento por si só.

## Reprodutibilidade

```bash
python3 scripts/gate_check.py --report /workspace/output/release-candidate.json \
  --project-root /workspace --out /workspace/output/g9-decision.json
# Exit 0 = alegações e artefatos consistentes; exit 2 = BLOCKED.
```

## Matriz de rastreabilidade necessária

Requisito -> ameaça/caso de borda -> teste (unitário/integração/E2E/chaos) -> evidência de execução -> revisão independente -> gate -> decisão de lançamento. Registrar versão de dependência, commit, ambiente e dados fictícios usados.
