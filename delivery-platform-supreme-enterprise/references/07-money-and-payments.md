# 07 — Dinheiro, PSP, split comercial, ledger e reconciliação

**Este playbook é bloqueante.** É proibido aprovar fluxo financeiro sem teste de integração sandbox, invariantes, repetição de webhooks, autorização e conciliação.

## Modelo explícito por moeda
Representar unidades mínimas em inteiro sempre que a moeda permitir; `BRL` centavos. Se há divisão proporcional: especificar algoritmo de alocação de resto determinístico (maior resto ou regra contratual auditável), nunca descartar centavo silenciosamente. `sum(allocated) == total_to_allocate`, nenhuma parcela negativa indevida, invariantes mesmo com frete zero ou desconto integral. `gross_order`, `merchant_due`, `courier_due`, `platform_fee`, `psp_fee`, `taxes_or_withholding_if_applicable`, `refunds` e `merchant_net` definidos separadamente. Não prometer que PSP consegue split operacional antes de verificar contrato e recurso.

## Livro razão / ledger
Postagens de dupla entrada com `transaction_id`, `ledger_account_id`, `currency`, `amount_minor`, `direction`, `business_reference`, `idempotency_scope`, `created_at`; balanceamento por transação e moeda. Ledger append-only; correção por reversão e novo lançamento. Extrato de lojista/entregador é projeção do ledger, não uma variável de saldo mutável sem trilha. Valores disponíveis e valores a liquidar podem diferir; gerir reservas, chargebacks, retenções e negativos conforme produto/contrato.

## Máquina de estado de pagamento
`CREATED → REQUIRES_ACTION → PROCESSING → AUTHORIZED → CAPTURED/SETTLED` conforme provedor, terminais `FAILED`, `CANCELLED`, `REFUNDED...`; não forçar mesma máquina para Pix e cartão. PSP é fonte de verdade para eventos externos validados, mas conciliar e contestar divergência. Webhook autenticado (ver método de assinatura real por provedor), evento dedupe dentro de transação, outbox para atualizar pedido e financeiro. Eventos fora de ordem processados via monotonicidade ou consulta ao PSP, não sobrescrita ingênua.

## Casos destrutivos de teste
1) evento pago chega 4 vezes: 1 crédito; 2) dois callbacks opostos: nenhum estado impossível; 3) checkout reapertado: 1 cobrança; 4) timeout com cobrança efetivada: consulta/reconcilia antes de recriar; 5) webhook fake: 0 lançamentos; 6) dois estornos parciais concorrentes: total refund <= captura; 7) disputa após repasse: passivo e tratamento explícitos; 8) split com resto de 1 centavo: soma exata; 9) terceiro tenta consultar repasse: negado; 10) provider cobra taxas diferentes: divergência no job.

## Conciliação sistemática
Comparar periodicamente `PSP statement ↔ payment attempts ↔ ledger ↔ pedidos ↔ payable/payout`. Chaves externas, janela, tolerância **zero em centavos** salvo regra formal de arredondamento/fees; fila `unmatched`, `amount_mismatch`, `duplicate`, `late`, `provider_only`, `internal_only`. Operador consegue investigar com evidência e compensar com aprovação. Testar fechamento diário e trilha contábil.

## Regulação/tributação
Contrato com PSP, titularidade de fundos e eventual regulação de pagamentos dependem da operação concreta; validar com assessoria jurídica/financeira e regras vigentes. `split comercial de recebedores` não é `split payment` de tributos da reforma. Nunca inferir recolhimento fiscal apenas de movimentação no gateway.
