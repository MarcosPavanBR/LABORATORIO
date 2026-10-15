# 21 — 30 cenários adversariais obrigatórios

Para cada cenário gerar teste `Given/When/Then`, camada alvo, expectativa, logs e correção. Nunca apenas recitar a lista: executar cenários correspondentes ao escopo, nomear `NOT_RUN` os demais. O veredito não pode ignorar cenários P0.

01. Dois pagamentos de mesma intenção em alta concorrência; 02. Webhook duplicado/reordenado; 03. PSP timeout após efetuar cobrança; 04. Retentativa em PSP diferente causando potencial dupla captura; 05. Reembolso parcial concorrente maior que saldo capturado; 06. Resto de centavo dividido entre 3 participantes; 07. Reversão de chargeback após repasse; 08. Contas com moedas diferentes; 09. Ledger lançado e pedido falhou; 10. PSP cobrou mas evento nunca chegou.

11. Último item comprado por dois consumidores; 12. Cupom gasto em duas sessões; 13. Preço de adicional alterado pelo frontend; 14. Restaurante aceita duas vezes em tablets offline; 15. Restaurante fecha no meio do checkout; 16. Pedido agendado em fuso/DST; 17. Pedido cancelado no instante do aceite; 18. Evento de status atrasado inverte progresso; 19. Um courier aceita a mesma corrida em dois dispositivos; 20. Dois couriers aceitam simultaneamente.

21. GPS congelado ou falso e ETA inconsistente; 22. Internet cai após pickup; 23. Entrega concluída por ator errado; 24. WebSocket vaza pedido de outro usuário; 25. Admin acessa endereço sem justificação; 26. Token de webhook vazado/revogação; 27. Fila/event bus apagado durante pedido; 28. Backup restaura pedidos sem atualização financeira; 29. Integração de mapas indisponível na hora de pico; 30. Crescimento 10x em pedidos, custo/SLO e staff insuficientes.

## Falsificação deliberada
Para cada escolha, perguntar: "Qual observação mostraria que estamos errados?"; "qual caminho causaria perda de dinheiro?"; "qual ataque de autorização cruza fronteira?"; "como é recuperado após restart?"; "qual evidência prova que opera offline?". Guardar contraevidência no relatório.
