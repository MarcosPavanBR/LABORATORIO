# Delivery Platform Supreme Enterprise **v2.2**

**Skill para arquitetar, implementar, testar, auditar e lançar uma plataforma independente de delivery/marketplace**, sem herdar stack ou código de produto anterior. 48 perfis especializados, decisões comparativas, money ledger, logística, segurança, privacidade, operações, FinOps e gates com evidências. **Não é um aplicativo pronto.**

## Requisitos

Python 3.10+ (stdlib; nenhum pacote para instalar). Para realmente delegar tarefas, usar host com suporte a agentes/subagentes; definições Markdown não criam executores por si.

## Instalação da skill

Descompactar o ZIP preservando a pasta superior `delivery-platform-supreme-enterprise/`.

**Claude Code:** colocar a pasta em `.claude/skills/` (projeto) ou `~/.claude/skills/` (usuário).

**Codex:** quando a versão/runtime admitir skills locais, colocar a pasta em `.agents/skills/` do projeto. A sintaxe de subagentes depende do host. Não copiar automaticamente perfis Claude como se fossem agentes Codex.

## Primeiros comandos

```bash
cd delivery-platform-supreme-enterprise
python3 scripts/validate_pack.py
python3 -m unittest discover -s scripts/tests -v
python3 scripts/eval_runner.py # valida catálogo, NÃO executa modelos
python3 scripts/build_manifest.py --verify

# Mudar /workspace/novo-delivery para o seu projeto, antes de instalar agentes:
python3 scripts/inventory_agents.py --root /workspace/novo-delivery \
  --extra-agent-dir /workspace/novo-delivery/esquadrao/agents \
  --output /workspace/novo-delivery/output/agents-inventory.json
python3 scripts/install_claude_agents.py --target /workspace/novo-delivery
# Prévia das 48 definições. Para realmente copiar, opt-in:
python3 scripts/install_claude_agents.py --target /workspace/novo-delivery --apply
```

O instalador **não sobrescreve arquivos** existentes e não cria subagentes no servidor. Os agentes tornam-se definições visíveis para um host Claude Code configurado, sujeito a permissões e ferramentas disponíveis.

## Comando sugerido ao agente

> Use a skill `delivery-platform-supreme-enterprise` para conceber uma plataforma de delivery inteiramente NOVA. Descubra os executores reais disponíveis e distribua o trabalho entre especialistas pertinentes; compare ao menos duas arquiteturas concorrentes considerando TCO, operação, segurança e reversibilidade. Produza G0–G3 com documentação e critérios de aceite e construa um vertical slice com pedidos, pagamento em sandbox, despacho, entrega e conciliação. Rode os testes efetivamente possíveis e mostre comandos e evidências, jamais simule sucesso. Nenhuma cobrança, deploy ou alteração financeira real sem minha aprovação. Não reutilize arquitetura de projetos anteriores.

## Ferramentas de verificação

- `scripts/validate_pack.py`: estrutura e links internos;
- `scripts/inventory_agents.py`: perfis/skills presentes e runtime declarado separadamente;
- `scripts/install_claude_agents.py`: dry-run e instalação opt-in;
- `scripts/gate_check.py`: analisa **evidências fornecidas** e bloqueia G9/G11 incompletos (não executa deploy);
- `scripts/eval_runner.py`: catálogo de testes de comportamento/contraprovas e heurísticas, não substitui LLM ou revisão humana;
- `scripts/build_manifest.py`: SHA-256 dos arquivos do pacote;
- `scripts/package_release.py`: testes, validação e ZIP/TXT;
- `scripts/tests/`: testes unitários reais dos componentes da skill.

Para o formato do gate e os critérios por estágio veja `references/25-gate-evidence-contract.md`. A seleção de tecnologia é descrita em `references/03-architecture-choice.md`. O controle de confiança/compatibilidade está em `references/26-skill-supply-chain-and-host.md`.

## O que os testes comprovam

Os testes locais comprovam lógica das ferramentas, estrutura, integridade e rejeição de estados inválidos. **Não comprovam**: suporte a 48 agentes simultâneos, segurança da plataforma futura, conformidade legal, precisão de mercado, capacidade em produção nem operacionalidade dos PSPs. Isso depende da implementação, do ambiente e de provas executadas.

## Evolução e licenciamento

v2.1 → v2.2: corrigido o manifesto, incluídos scripts faltantes, testes automatizados, inventário e instalação, contrato dos gates, avaliações, manifest de integridade e documentação. Fontes técnicas e normas precisam ser revalidadas antes de uso (ver `sources.md`). Arquivos próprios deste pacote podem ser personalizados para o projeto; skills/agents externos precisam de suas respectivas licenças.
