# 23 — Compactação de contexto e prevenção de amnésia multiagente

## O problema da janela
Orquestrar 48 agentes em ondas (W1 a W6) gera centenas de milhares de tokens de debate, handoffs e logs. Sem compactação, o modelo perde o rastro das decisões da W1 quando chega na W4, resultando em alucinação de contratos ou regressão de arquitetura.

## Protocolo de State-Snapshot
Ao final de cada onda (W1, W2, W3...), o `dps-orchestrator` deve gerar um `output/state-snapshot-WX.md` contendo APENAS:
1. Decisões irrevogáveis (ADRs aprovados).
2. Contratos de domínio e schemas congelados.
3. Riscos abertos e donos.
4. Hash dos artefatos gerados.

**Regra de descarte:** O contexto de "como chegamos aqui" (debates, opções rejeitadas, logs de agentes) é sumarizado em 10 linhas no snapshot e descartado da janela ativa antes de invocar a próxima onda. Agentes da W4 leem o snapshot da W3, não o histórico cru.
