# LABORATORIO — Laboratório de engenharia e skills

Repositório de experimentos, documentação e ferramentas de engenharia de software.

## Delivery Platform Supreme Enterprise v2.2

[**Abrir a Skill completa**](./delivery-platform-supreme-enterprise/)

Skill independente para planejar, implementar, testar e auditar plataformas de delivery com arquitetura avaliada sem viés, regras financeiras, logística, segurança, privacidade, testes e governança de especialistas. **Não é um aplicativo de delivery já implementado**.

- [Instruções principais (SKILL.md)](./delivery-platform-supreme-enterprise/SKILL.md)
- [Instalação e uso](./delivery-platform-supreme-enterprise/README.md)
- [Catálogo de subagentes](./delivery-platform-supreme-enterprise/agents/)
- [Workflows](./delivery-platform-supreme-enterprise/workflows/)
- [Ferramentas e testes](./delivery-platform-supreme-enterprise/scripts/)
- [CI da Skill](./.github/workflows/validate-delivery-platform-skill.yml)

### Verificação local

```bash
cd delivery-platform-supreme-enterprise
python3 scripts/validate_pack.py
python3 -m unittest discover -s scripts/tests -v
python3 scripts/eval_runner.py
python3 scripts/build_manifest.py --verify
```

A CI do GitHub executa essas verificações automaticamente após alterações relevantes e permite execução manual. Os testes verificam a Skill e suas ferramentas, não certificam um aplicativo em produção.
