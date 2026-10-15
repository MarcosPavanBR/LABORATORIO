# 09 — Catálogo, busca, disponibilidade e mecanismo de preços

## Oferta real
Modelar estabelecimentos, unidades, horários, exceções/feriados, área atendida, capacidade e status temporário, produtos, categorias, modificadores, alergênicos/informações obrigatórias por localidade, estoque e substituições; versão e publicação de cardápio. Pesquisa deve tolerar erros de digitação, sinônimos e ranking transparente, mas nunca revelar lojas fora de cobertura como entregáveis. Geofence calculado no servidor e recalculado na confirmação.

## Precificação por snapshot
Checkout calcula quantidade, opções extras, preço base, desconto (loja vs plataforma), gorjeta, tarifa serviço, entrega, tributos, taxa de pequeno pedido, valor mínimo e regras de empilhamento promocional. `PriceQuote` contém versão de catálogo, versão de política, currency, breakdown e expires_at; checkout invalida quote vencido/alterado com feedback claro. Cupons têm orçamento, limites por usuário/loja/campanha, concorrência atômica e estorno de utilização em cancelamento conforme regra.

## Estoque e capacidade
Escolher reserva pessimista/otimista por volatilidade. Não prometer disponibilidade sem prova em último item ou confirmação da loja. Pedido agendado usa janela/hora local com DST/timezone e capacidade futura, não hora UTC confundida com local. Bloqueio loja offline deve propagar com orçamento de cache conhecido.

## Falhas adversariais
Cliente altera preço em DevTools; duas cestas esgotam estoque; mesma promoção em duas sessões; restaurante muda preço durante pagamento; busca mostra item esgotado; múltiplos fusos e datas; produto com preço zero indevido; promoções com desconto > total; ranking enviesado para um único estabelecimento sem transparência.
