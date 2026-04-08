# HU-05-1: Adicionar ao Carrinho

## Contexto
Implementar a funcionalidade de adicionar produtos ao carrinho com persistência no banco de dados e integração frontend-backend.

## Critérios de Aceitação

### Backend
- [x] Entidade `Cart.java` com relacionamento com `User` e `CartItem`
- [x] Entidade `CartItem.java` com `Product`, `quantity`, `unitPrice`
- [x] `CartRepository.java` com `findByUserIdWithItems()`
- [x] `CartItemRepository.java` com `findByCartIdAndProductId()`
- [x] `CartServiceImpl` refatorado para usar JPA (remover `ConcurrentHashMap`)
- [x] `CartController` expõe endpoints: GET `/v1/cart`, POST `/v1/cart/items`
- [x] Validação de estoque antes de adicionar

### Frontend
- [x] `cart.service.ts` com métodos `getCart()`, `addToCart()`
- [x] `useCart` hook atualizado para usar API real (localStorage como fallback)
- [x] `AddToCartButton` conecta à API e mostra toast de confirmação
- [x] Contador do carrinho no header atualizado em tempo real
- [x] `CartDrawer` integrado no header com contador de itens e valor total

## Checklist de Implementação
- [x] Entidade `Cart.java` criada
- [x] Entidade `CartItem.java` criada
- [x] `CartRepository.java` criado
- [x] `CartItemRepository.java` criado
- [x] `CartServiceImpl` refatorado para JPA
- [x] `CartController` atualizado
- [x] `cart.service.ts` criado
- [x] `useCart` hook reescrito
- [x] `AddToCartButton` conectado à API
