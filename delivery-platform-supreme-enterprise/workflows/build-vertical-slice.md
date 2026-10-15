# Workflow D — construir um pedido REAL de ponta a ponta (G4–G6)

## Fase 0 — baseline
Registrar commit, lockfiles e serviços externos sandbox; mapear recursos disponíveis. Sem repositório, criar esqueleto isolado sob diretório autorizado e documentar inicialização reproduzível.

## Etapa 1 — contracts-first
Escrever máquina de estados de Order, PaymentIntent, DeliveryTask e Offer; definir participantes ledger e beneficiários; API e eventos versionados; validação e RBAC. Obter revisão financeira e segurança antes de migração destrutiva.

## Etapa 2 — TDD por risco
Criar testes vermelhos para pedido duplicado, webhook 3x, centavos, autorização por recurso, cancelamento concorrente, duas ofertas e outbox crash. Executar e confirmar falha pela regra ausente (não erro incidental). Implementar menor código que torna verde, depois refatorar.

## Etapa 3 — full-stack real
Cliente faz quote→checkout sandbox; backend cria Order; PSP retorna e webhook autenticado confirma; loja recebe e aceita em KDS; courier recebe oferta e aceita; pickup, delivery e suporte geram audit; ledger e conciliação batem. UI com empty/loading/error/offline e E2E em browser/dispositivo conforme capacidades. Diferenciar simulação de mapas/PSP de integração sandbox real.

## Etapa 4 — independência e evidência
Revisor não-writer checa paths; QA executa; red/blue desafiam; conciliação mostra débitos=créditos; logs são sanitizados. Emitir gate: `pass` por caso com evidence_path e comando, `blocked` caso contrário. Nunca preencher lacunas com screenshots.

## Escopo incremental recomendado
Slice 1: uma loja e courier simulado; Slice 2: PSP sandbox e refund; Slice 3: courier app real e concorrência; Slice 4: multi-loja e administração; Slice 5: otimização/campanhas. Não apresentar Slice 1 como plataforma concluída.
