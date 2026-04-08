# HU-05-2: Gerenciar Itens do Carrinho

## Contexto
Implementar a gestão completa de itens: atualizar quantidade, remover itens, limpar carrinho.

## Critérios de Aceitação

### Backend
- [x] Endpoint `PATCH /v1/cart/items/{productId}` para atualizar quantidade
- [x] Endpoint `DELETE /v1/cart/items/{productId}` para remover item
- [x] Endpoint `DELETE /v1/cart` para limpar carrinho
- [x] Validação de estoque ao atualizar quantidade
- [x] Recalcular totais após cada operação

### Frontend
- [x] Botões +/- para alterar quantidade na página `/cart`
- [x] Botão de remover item (lixeira) em cada item
- [x] Botão "Limpar carrinho" com confirmação
- [x] Carrinho drawer com gestão rápida de itens
- [x] Atualização visual imediata após operações

## Checklist de Implementação
- [x] Endpoints implementados no `CartController`
- [x] `CartService` atualizado com métodos `updateItem`, `removeFromCart`, `clearCart`
- [x] `cart.service.ts` com todos os métodos
- [x] Página `/cart` reescrita com gestão completa
- [x] Carrinho drawer criado com +/- e remover
- [x] Header mostra total real do carrinho
