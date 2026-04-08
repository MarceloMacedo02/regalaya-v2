# Story 6.1: Processo de Checkout

---
status: done
spec_file: _bmad-output/implementation-artifacts/06-1-processo-checkout.md
baseline_commit: 5f35985c970dfed05e85038c68d7a4b5a55d0ce3
context:
  - docs/CE.md
  - docs/CU.md
  - docs/CA.md
---

## Story

As a usuário autenticado,
I want finalizar minha compra em um processo de 3 passos com progresso visual claro,
so that completar minha compra de forma rápida e sem confusão.

## Acceptance Criteria

1. Dado que tenho itens no carrinho, quando acesso `/checkout`, então vejo um stepper visual com 3 passos (Revisão → Endereço → Pagamento)
2. Dado que estou no Step 1, quando reviso os itens, então vejo imagem, nome, preço, quantidade e subtotal de cada item
3. Dado que estou no Step 2, quando seleciono um endereço, então o frete é calculado automaticamente via `POST /v1/shipping/calculate`
4. Dado que estou no Step 3, quando seleciono método de pagamento, então vejo opções PIX e Cartão de Crédito
5. Dado que completo o checkout com sucesso, então vejo página de confirmação com order_number, total e estimativa de entrega
6. Dado que o estoque é insuficiente, quando tento criar pedido, então recebo erro 400 com lista de itens problemáticos
7. Dado que o carrinho está vazio, quando acesso `/checkout`, então sou redirecionado para home com toast "Seu carrinho está vazio"
8. Dado que crio um pedido com sucesso, então o carrinho é limpo automaticamente (DELETE /v1/cart)
9. Dado que saio no meio do checkout, quando retorno, então meus dados são restaurados do sessionStorage

## Tasks / Subtasks

- [x] Task 1: Backend - Order Domain (AC: 6, 7, 8)
  - [x] Criar entidade `Order.java` conforme schema CA.md (linhas 381-408)
  - [x] Criar entidade `OrderItem.java` conforme schema CA.md (linhas 421-436)
  - [x] Criar `OrderRepository.java` com `findByUserId()` e `findByIdWithItems()`
  - [x] Criar `OrderItemRepository.java`
  - [x] Criar `OrderMapper.java` (MapStruct) para Order ↔ OrderResponse/OrderDetailResponse
  - [x] Criar enums: `OrderStatus` (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED), `PaymentStatus` (pending, paid, failed, refunded, partially_refunded)

- [x] Task 2: Backend - OrderService (AC: 4, 6, 7, 8)
  - [x] Implementar `OrderServiceImpl.createOrderFromCart(CreateOrderRequest)`
  - [x] Validar carrinho não vazio
  - [x] Validar estoque disponível de todos os produtos (SELECT ... FOR UPDATE ou optimistic locking)
  - [x] Validar contato existe e pertence ao usuário
  - [x] Validar endereço (se fornecido)
  - [x] Calcular subtotal, shipping, discount, total em transação atômica
  - [x] Criar order + order_items atomicamente
  - [x] Limpar carrinho após criação bem-sucedida
  - [x] Retornar OrderDetailResponse com order_number gerado

- [x] Task 3: Backend - Client Order Controller (AC: 4, 6, 7)
  - [x] Implementar `POST /v1/client/orders` com auth USER
  - [x] Implementar `GET /v1/client/orders` com paginação
  - [x] Implementar `GET /v1/client/orders/{id}`
  - [x] Criar DTOs: `CreateOrderRequest`, `OrderResponse`, `OrderDetailResponse`, `OrderItemResponse`
  - [x] Configurar validações com Bean Validation (@Valid, @NotNull, @Min)

- [x] Task 4: Frontend - Checkout Page Structure (AC: 1, 5, 9)
  - [x] Criar página `/checkout` com roteamento protegido (requires auth)
  - [x] Implementar componente `CheckoutStepper` com 3 steps visuais
  - [x] Implementar persistência de estado no sessionStorage
  - [x] Implementar navegação entre steps (avançar/voltar)
  - [x] Implementar progress bar visual

- [x] Task 5: Frontend - Step 1 Revisão do Carrinho (AC: 2, 7)
  - [x] Listar itens do carrinho com imagem, nome, preço, quantidade
  - [x] Mostrar subtotal calculado
  - [x] Botão "Continuar" → Step 2
  - [x] Botão "Voltar ao carrinho" → /cart
  - [x] Validar carrinho não vazio antes de prosseguir
  - [x] Exibir skeleton loading durante fetch do carrinho

- [x] Task 6: Frontend - Step 2 Endereço de Entrega (AC: 3)
  - [x] Buscar endereços do usuário via `GET /v1/addresses`
  - [x] Exibir endereços em cards com radio-select
  - [x] Opção "Adicionar novo endereço" com modal/formulário
  - [x] Integrar com cálculo de frete (callback ao selecionar endereço)
  - [x] Exibir opções de frete com preço e prazo
  - [x] Atualizar total com frete selecionado

- [x] Task 7: Frontend - Step 3 Pagamento Placeholder (AC: 4)
  - [x] Seletor de método de pagamento: [PIX] [Cartão de Crédito]
  - [x] Placeholder para integração PIX (HU-06.2)
  - [x] Placeholder para integração Cartão (HU-06.3)
  - [x] Botão "Finalizar Compra" (desabilitado até HU-06.2/06.3)

- [x] Task 8: Frontend - Página de Sucesso (AC: 5)
  - [x] Criar página `/checkout/success/{orderId}`
  - [x] Exibir order_number, valor total, estimativa de entrega
  - [x] Listar itens comprados com thumbnails
  - [x] Botões: "Ver meus pedidos" e "Continuar comprando"
  - [x] Exibir endereço de entrega formatado

- [x] Task 9: Tratamento de Erros (AC: 6, 7, 9)
  - [x] Backend: GlobalExceptionHandler para Order exceptions
  - [x] Backend: Custom exceptions (InsufficientStockException, EmptyCartException)
  - [x] Frontend: Error boundaries em páginas de checkout
  - [x] Frontend: Toasts de erro claros para cada cenário
  - [x] Frontend: Session expiry handling durante checkout

## Dev Notes

- **Architecture Pattern:** Clean Architecture - Order module segue a mesma estrutura que Contact, Product, Cart modules
- **Package Structure:** `br.com.regalaya.order/` com subpacotes: controller/, domain/model/, repository/, services/, dto/, mapper/, exception/
- **Database:** Tables `orders` e `order_items` já definidas em CA.md (linhas 381-436). NÃO alterar schema sem aprovação.
- **Transaction Management:** `@Transactional` no OrderService.createOrderFromCart() - ordem + itens devem ser atômicos
- **Stock Validation:** Usar optimistic locking (@Version) ou SELECT ... FOR UPDATE para race conditions
- **Order Number Format:** Gerar formato legível, ex: `ORD-20260407-0001`
- **Frontend State:** Zustand para checkout state, sessionStorage para persistência entre refreshes
- **Design System:** Seguir CU.md - cores (--primary: #8B5CF6), tipografia, espaçamento, componentes base
- **UX Pattern:** Stepper visual com 3 passos, skeleton loading, toasts para feedback

### Project Structure Notes

```
regalaya-api/src/main/java/br/com/regalaya/
  order/
    controller/ClientOrderController.java
    domain/model/Order.java, OrderItem.java
    domain/enums/OrderStatus.java, PaymentStatus.java
    repository/OrderRepository.java, OrderItemRepository.java
    services/OrderService.java, impl/OrderServiceImpl.java
    dto/requests/CreateOrderRequest.java
    dto/responses/OrderResponse.java, OrderDetailResponse.java, OrderItemResponse.java
    mapper/OrderMapper.java
    exception/OrderNotFoundException.java, InsufficientStockException.java, EmptyCartException.java

regalaya-web/src/
  app/(store)/checkout/page.tsx
  app/(store)/checkout/success/[orderId]/page.tsx
  components/checkout/
    CheckoutStepper.tsx
    StepCartReview.tsx
    StepAddress.tsx
    StepPayment.tsx
  services/order.service.ts
  types/order.ts
```

### References

- [Source: CA.md#2.1 Schema - Orders Table] Linhas 381-408
- [Source: CA.md#2.1 Schema - Order Items Table] Linhas 421-436
- [Source: CA.md#3.6 Order Endpoints (Client)] Linhas 978-1002
- [Source: CA.md#4.1 Package Structure] Estrutura de módulos
- [Source: CU.md#2.2.3 Checkout] Stepper visual de 3 passos
- [Source: CU.md#3 Design System] Cores, tipografia, espaçamento
- [Source: E06-Checkout-Pagamento-Historias.md] HU-06.1 especificação completa
- [Source: CE.md#ÉPICO 06] HU-06.1 tarefas originais

## Dependencies

- **EP-05 (Carrinho):** ✅ Done - Carrinho funcional com API real
- **EP-15 (Endereços):** ✅ Done - CRUD de endereços implementado
- **EP-04 (Produtos):** ✅ Done - Catálogo ativo

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
