# 22 — Anti-padrões que invalidam claims de plataforma premium

1. UI impecável com botão que chama mock e status apenas local.
2. README promete arquitetura escalável sem métricas/SLO/custo.
3. Microserviços distribuídos antes de ter operação que justifique o overhead.
4. Banco não transacional para saldo/money sem invariantes fortes.
5. JSON de cliente decide preço, frete, split ou quem é recebedor.
6. `float`, `Number` ou arredondamento implícito para somar centavos.
7. Webhook marcado como pago apenas porque HTTP chegou.
8. Verifica idempotência via SELECT sem índice único/atomicidade.
9. Usa eventos só via WebSocket e perde mensagens offline.
10. Declara "exactly once" sem delimitar camada e prova.
11. Usa status pedido único para estados PSP/entrega/cozinha.
12. Retenta cobrança em segundo PSP diante de timeout desconhecido.
13. Faz `CREATE wallet` num endpoint GET/replay não autorizado.
14. Logs incluem dados de cartão, CPF, mensagens ou GPS sem redaction.
15. RLS configurada mas conexão privilegiada ignora isolamento.
16. KDS depende exclusivamente de push e não faz catch-up.
17. Courier recebe oferta vencida e ainda consegue atribuir corrida.
18. GPS emitido 24h sem finalidade e retenção clara.
19. Admin tem botão de alterar saldo sem trilha e controle de dupla aprovação.
20. Alerta `health 200` com fila morta e reconciliação travada.
21. "Teste de carga passou" sem cenário, amostra, métricas ou versão.
22. "Zero vulnerabilidades" baseado só em SAST.
23. "LGPD compliant" por incluir checkbox de consentimento.
24. Feature AI executa reembolso sem autorização humana.
25. Uma campanha gera volume com margem negativa e anúncio de "sucesso".
26. Porta de banco pública, .env no repositório ou backup com chaves.
27. Retenção de logs e backup não compatível com exclusão/solicitações de titulares.
28. Lançamento sem exercício de restauração e rollback.
29. Contabilidade trata valor repassado como receita integral.
30. Uma stack escolhida porque veio de um repositório anterior.

**Se detectar um anti-padrão:** registrar `ID`, path/linha, evidência, modo de falha, gravidade, reparação/teste e qual gate bloqueou; nunca ocultar para satisfazer prazo.
