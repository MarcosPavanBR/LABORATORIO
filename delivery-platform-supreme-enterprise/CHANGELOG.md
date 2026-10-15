# Changelog

## Unreleased

- Novo `scripts/evidence_ledger.py`: ledger JSONL append-only com SHA-256 encadeado (`append`, `verify`, `head`), sem dependências.
- `gate_check.py`: bloco `ledger` verificado (cadeia, truncamento, reescrita, casos ancorados); obrigatório em G9/G11 do perfil `enterprise`.
- Testes: +14 casos (adulteração, remoção, reordenação, truncamento, reescrita de cadeia, ledger que cresce, mvp inalterado).
- Limite documentado: tamper-evidence, não assinatura nem não-repúdio (`references/25`).

## 2.2.0 — correção estrutural e execução segura

- Reconstrução dos 98 arquivos originais do TXT v2.1, sem herdar arquitetura de produto existente.
- Corrigido frontmatter de Skill conforme esquema com `metadata.version`.
- Incluídos scripts de validação, instalação segura com dry-run, inventário, gating, avaliação heurística, manifesto de integridade e empacotamento.
- Criado catálogo adversarial, templates bloqueados por padrão e testes automatizados de caminhos positivos e negativos.
- Alinhado gate G11 a perfis de lançamento (`mvp` / `enterprise`) mantendo todos os controles mínimos de dinheiro, segurança, resiliência, privacidade e autorização.
- Atualizadas instruções de compatibilidade Claude Code / Codex, segurança da cadeia de suprimentos e referências oficiais.

A v2.2 valida **o pacote da skill**, não certifica nenhuma implementação comercial construída posteriormente.
