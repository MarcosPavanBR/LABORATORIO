# Contratos adversariais com exemplos concretos de falsificação

Este playbook complementa referências de domínio e não define stack. Deve orientar testes de propriedade, teste concorrente e E2E em sandbox; dados fictícios exclusivamente.

## Dinheiro: conservação e eventos

- `sum(debits, moeda, journal_id) == sum(credits, moeda, journal_id)`: verificar para todos os journals, inclusive estorno parcial, taxas, gorjeta, chargeback e liquidação.
- `provider_event_id` único em escopo do provedor+conta; executar mesma notificação 2/10/100 vezes e garantir um único lançamento.
- Webhook chegou antes de pedido persistir? Retentar/colocar em quarentena com observabilidade, jamais inventar transação paga.
- Split soma exata do total congelado, inclusive arredondamento e valores pequenos (R$ 0,01; R$ 0,02).
- Falha entre `commit` no banco e publicação do evento: outbox recupera e não repete efeito econômico.
- Cenário multi-provedor: falha/fallback não deve capturar duas vezes a mesma obrigação.
- Verificar que reembolso solicitado por suporte exige permissão por pedido, trilha e confirmação financeira externa.

## Pedido e cardápio

- Vendedor muda preço enquanto checkout está em andamento: snapshot/TTL/versão evita cobrança divergente.
- Duas sessões compram última unidade do estoque: no máximo quantidade disponível é reservada.
- Restaurante recusa pedido pago: reembolso com estado de compensação e fila de suporte; sem perder o pedido.
- Cancelamento após expedição: regras de ressarcimento e atribuição de responsabilidade com consistência.
- Cupom não pode gerar saldo negativo, dupla aplicação ou desconto fora de elegibilidade.
- Pedido multi-loja só é suportado se segregação fiscal/financeira e fulfillment estão modelados; caso contrário restringir explicitamente.

## Despacho e GPS

- Dois entregadores recebem a mesma oferta e aceitam no mesmo milissegundo: apenas um fica com a atribuição vencedora; o outro recebe resposta estável.
- Offline no aceite e replay de comando: operação idempotente e status convergente.
- GPS antigo, sem precisão ou incompatível com velocidade: não tratar como verdade e não expor localização indevida.
- Falha do provedor de mapas não deve paralisar pedidos já confirmados; usar fallback manual/operacional documentado.
- Entrega contestada (código, imagem ou assinatura): respeitar privacidade, retenção e auditoria; nunca usar prova do próprio entregador como garantia absoluta.

## Segurança, privacidade e administração

- Usuário troca `order_id`, `tenant_id`, `merchant_id`, `courier_id`, `socket_room` e tenta recurso alheio: exigir autorização contextual.
- Trocar ID no histórico, exportação, WebSocket, relatórios agregados, upload e job assíncrono: a mesma proteção vale fora da API REST.
- Administrador comprometido ou operador com privilégio excessivo: proteção extra para exportação, reembolso, ajuste de carteira e configuração de PSP.
- Retenção de GPS e documentos não é indefinida por default; eliminar/anonimizar com base legal e evidência de execução.

## Experiência, inclusividade e operações

- Cliente em 2G, leitor de tela, modo escuro, fonte grande, localização desativada; o pedido deve ser viável ou apresentar erro legível.
- Restaurante com tablet desligado: pedido preservado, alerta e procedimento de escalonamento sem venda fantasma.
- Entregador perde conectividade na retirada: reconciliar comandos pendentes sem mudar transição irreversível duas vezes.
- Sistema em pico: medir pedidos/min, p95/p99, tempo de despacho, custo por pedido, consumo de mapa/SMS/PSP, não apenas requests por segundo.

## Evidência

Para cada cenário: requisitos, entrada/fixture, ação reproduzível, saída esperada, resultado real, comando, commit, ambiente, hash do log, classificação e revisão. Um teste definido mas não executado = `NOT_RUN`.
