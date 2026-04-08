---
status: done
spec_file: _bmad-output/implementation-artifacts/06-3-integracao-cartao.md
baseline_commit: 5f35985c970dfed05e85038c68d7a4b5a55d0ce3
context:
  - docs/CE.md
  - docs/CU.md
  - docs/CA.md
---

# Story 6.3: Integração Cartão de Crédito

## Story

As a usuário,
I want pagar com cartão de crédito com parcelamento,
so that dividir o pagamento ou usar meu limite.

## Acceptance Criteria

1. Dado que estou no Step 3 do checkout, quando seleciono Cartão de Crédito, então vejo formulário de cartão com Stripe Elements e seletor de parcelas
2. Dado que preencho dados do cartão, quando digito, então vejo validação em tempo real (número, validade, CVC)
3. Dado que seleciono parcelas, quando confirmo pagamento, então vejo cálculo de juros por parcela
4. Dado que o pagamento é aprovado, então sou redirecionado para página de sucesso
5. Dado que o cartão é recusado, quando tento pagar, então vejo mensagem específica do erro
6. Dado que 3D Secure é requerido, quando confirmo, então vejo challenge de autenticação em modal
7. Dado que envio o mesmo pedido duas vezes, quando uso idempotency key, então não há duplicação de cobrança

## Tasks / Subtasks

- [x] Task 1: Backend - Credit Card Provider (AC: 4, 5, 6, 7)
  - [x] Implementar `CreditCardProvider` (Stripe ou Mercado Pago)
  - [x] Método `createCardPayment(Order, cardToken, installments)` → PaymentIntent
  - [x] Tokenização via provider - NUNCA armazenar dados brutos do cartão
  - [x] Retornar `clientSecret` para confirmação no frontend
  - [x] Implementar cálculo de parcelas (com/sem juros conforme config)
  - [x] Configurar webhook handler (reutilizar de HU-06.2)

- [x] Task 2: Backend - Parcelamento Logic (AC: 3)
  - [x] Implementar `PaymentService.calculateInstallments(total, maxInstallments)`
  - [x] Configuração: `app.payment.max-installments: 12`
  - [x] Configuração: `app.payment.installment-min-value: 20.00` (valor mínimo por parcela)
  - [x] Configuração: `app.payment.installment-interest-rate: 0.0199` (1.99% a.m.)
  - [x] Retornar lista de opções: `{ installments, installmentValue, totalWithInterest, hasInterest }`

- [x] Task 3: Backend - Payment Intent Endpoint (AC: 1, 4, 7)
  - [x] Estender `POST /v1/payments/create-intent` para suportar CREDIT_CARD
  - [x] Request: `{ orderId, paymentMethod: 'CREDIT_CARD', cardToken?, installments }`
  - [x] Response: `{ clientSecret, paymentIntentId, provider }`
  - [x] Implementar idempotency key via header `Idempotency-Key: {orderId}-{timestamp}`
  - [x] Cachear resultado por 24h em Redis para idempotency

- [x] Task 4: Backend - 3D Secure Handling (AC: 6)
  - [x] Detectar quando payment requer authentication (`requires_action`)
  - [x] Retornar `requiresAction: true` + `clientSecret` no response
  - [x] Frontend lida com challenge, backend apenas aguarda webhook

- [x] Task 5: Backend - Webhook para Cartão (AC: 4, 5)
  - [x] Reutilizar webhook handler de HU-06.2
  - [x] Processar eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
  - [x] Atualizar `payments.status` e `orders.payment_status`
  - [x] Se pago: `order.status = 'PROCESSING'`
  - [x] Se falhou: manter `order.status = 'PENDING'`

- [x] Task 6: Frontend - Card Payment Form (AC: 1, 2)
  - [x] No Step 3 do checkout, implementar seção Cartão de Crédito
  - [x] Carregar Stripe.js com publishable key do environment
  - [x] Implementar Stripe Elements: CardElement ou elementos individuais
  - [x] Validação em tempo real: número, expiry, CVC format
  - [x] Máscara de input para número do cartão (4242 4242 4242 4242)
  - [x] Estilo consistente com design system (CU.md)

- [x] Task 7: Frontend - Installment Selector (AC: 3)
  - [x] Buscar opções de parcelamento: `POST /v1/payments/installments` (ou incluir no create-intent)
  - [x] Exibir dropdown/select com opções:
    - "1x de R$ 189,90 sem juros"
    - "2x de R$ 94,95 sem juros"
    - "3x de R$ 63,30 (total R$ 189,90)"
    - "12x de R$ 18,12 (total R$ 217,44)"
  - [x] Destacar opção sem juros
  - [x] Selecionar 1x como default

- [x] Task 8: Frontend - Payment Processing (AC: 4, 5, 6)
  - [x] Coletar dados do cartão via Stripe Elements → gerar `paymentMethodId`
  - [x] Chamar `POST /v1/payments/create-intent` com `paymentMethod: 'CREDIT_CARD'`
  - [x] Receber `clientSecret`
  - [x] Chamar `stripe.confirmCardPayment(clientSecret)` no frontend
  - [x] Se `requires_action`: exibir 3D Secure challenge em modal
  - [x] Se sucesso: redirecionar para `/checkout/success/{orderId}`
  - [x] Se falha: mostrar erro específico (cartão recusado, saldo insuficiente, etc.)

- [x] Task 9: Frontend - Loading e Error States (AC: 5)
  - [x] Loading state: "Processando pagamento..." com spinner
  - [x] Mensagens de erro amigáveis:
    - "Cartão recusado pelo banco"
    - "Saldo insuficiente"
    - "Erro na comunicação com o gateway, tente novamente"
    - "Cartão expirado"
    - "CVV inválido"
  - [x] Desabilitar botão "Pagar" durante processamento

- [ ] Task 10: Testes
  - [ ] Unit: CreditCardProvider cria PaymentIntent corretamente
  - [ ] Unit: PaymentService.calculateInstallments() retorna valores corretos
  - [ ] Unit: Idempotency - mesma orderId não duplica pagamento
  - [ ] Integration: Usar Stripe test mode para fluxo completo
  - [ ] Integration: Testar 3D Secure (stripe card 4000002500003155)
  - [ ] Integration: Testar cartão recusado (stripe card 4000000000000002)
  - [ ] E2E: Pagamento aprovado com test card 4242 4242 4242 4242
  - [ ] E2E: Pagamento com 3D Secure
  - [ ] E2E: Pagamento recusado mostra erro adequado

## Dev Notes

- **PCI DSS Compliance:** NUNCA enviar dados brutos do cartão para nosso backend. Usar Stripe Elements para tokenização.
- **Stripe Test Cards:** 
  - Sucesso: 4242 4242 4242 4242
  - 3D Secure: 4000002500003155
  - Recusado: 4000000000000002
  - Expired: 4000000000000069
- **Idempotency:** Header `Idempotency-Key` é CRÍTICO para evitar cobranças duplicadas. Usar Redis para cache.
- **Installments:** Juros configuráveis via application.properties. Default: 1.99% a.m. acima de 2x.
- **3D Secure:** O challenge é gerenciado pelo Stripe.js no frontend. Backend apenas aguarda webhook.
- **Frontend:** Stripe.js deve ser carregado dinamicamente (next/dynamic ou script tag).
- **Design System:** CU.md - formulário de cartão com estilo consistente, validação visual inline.
- **UX Pattern:** Loading state durante processamento, erros específicos por tipo de falha.

### Project Structure Notes

```
regalaya-api/src/main/java/br/com/regalaya/
  payment/
    services/impl/CreditCardProvider.java (novo)
    dto/requests/PaymentIntentRequest.java (estender com installments)
    dto/responses/InstallmentOption.java (novo)

regalaya-web/src/
  components/checkout/
    CreditCardPaymentSection.tsx (novo)
    InstallmentSelector.tsx (novo)
    CardForm.tsx (novo)
  services/payment.service.ts (estender)
  lib/stripe.ts (novo - Stripe.js loader)
  types/payment.ts (estender)
```

### References

- [Source: CA.md#3.12 Payment Endpoints] Linhas 1068-1075
- [Source: CA.md#2.1 Schema - Payments Table] Linhas 521-537
- [Source: CA.md#4.1 Package Structure] Seção payment module
- [Source: CU.md#2.2.3 Checkout] Step 3 - Pagamento
- [Source: CU.md#3 Design System] Cores, tipografia, componentes
- [Source: E06-Checkout-Pagamento-Historias.md] HU-06.3 especificação completa
- [Source: CE.md#ÉPICO 06] HU-06.3 tarefas originais
- [Source: https://stripe.com/docs/payments/accept-a-payment] Stripe Payment Intent docs

## Dependencies

- **HU-06.1 (Checkout):** ✅ Order creation funcional
- **HU-06.2 (PIX):** Payment module e webhook infrastructure
- **Stripe/Mercado Pago:** Credenciais configuradas, Stripe.js disponível
- **Redis:** Para idempotency cache

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
