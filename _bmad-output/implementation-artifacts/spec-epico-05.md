# SPEC: Épico 05 - Carrinho de Compras

**Status:** gap-analysis  
**Criado:** 2026-04-07  
**Epic:** HU-05.1, HU-05.2, HU-05.3

---

## Objetivo

Implementar o Épico 05 — Carrinho de Compras — conectando o frontend à API real do backend. O backend existe mas tem problemas críticos (sem persistência em banco, sem cupons).

---

## GAP ANALYSIS

### Backend — O que existe vs. o que falta

| Componente | Status | Gap |
|---|---|---|
| `CartController.java` | ✅ Completo | Endpoint `POST /cart/apply-coupon` **NÃO existe** |
| `CartService.java` (interface) | ✅ Completo | Método `applyCoupon()` **NÃO existe** |
| `CartServiceImpl.java` | ⚠️ Parcial | **Usa ConcurrentHashMap em memória** — não persiste no banco. Deve ser refatorado para JPA |
| `AddToCartRequest.java` | ✅ Completo | — |
| `UpdateCartItemRequest.java` | ✅ Completo | — |
| `CartResponse.java` | ⚠️ Parcial | Não retorna `couponCode`, `couponDiscount` — precisa extender |
| `CartItemResponse.java` | ✅ Completo | — |
| **Entidade Cart/CartItem** | ❌ Ausente | **NÃO EXISTE** — não há tabela no banco para carrinho |
| **Coupon entity/repo/service/controller** | ❌ Ausente | **NÃO EXISTE** — módulo de cupons precisa ser criado do zero |

### Frontend — O que existe vs. o que falta

| Componente | Status | Gap |
|---|---|---|
| `useCart.tsx` (hook) | ⚠️ Parcial | **Usa localStorage apenas** — não conecta à API. Precisa ser reescrito |
| `cart-provider.tsx` | ⚠️ Parcial | Só wrappeia o hook — precisa de provider que sincronize com API |
| `add-to-cart-button.tsx` | ⚠️ Parcial | Chama `useCart().addItem()` (local) — precisa chamar API |
| **cart.service.ts** | ❌ Ausente | **NÃO EXISTE** — criar `src/services/cart.service.ts` |
| **Carrinho drawer/slide** | ❌ Ausente | **NÃO EXISTE** — componente visual do carrinho |
| **Página /cart** | ❌ Ausente | **NÃO EXISTE** — página completa de gestão do carrinho |
| **Componente aplicar cupom** | ❌ Ausente | **NÃO EXISTE** — input + validação de cupom |

---

## IMPLEMENTAÇÃO ORDENADA

### FASE 1 — Backend: Persistência de Carrinho

1. **Criar `Cart.java`** — entidade com `userId`, `couponCode`, `couponDiscount`
2. **Criar `CartItem.java`** — entidade com `cartId`, `productId`, `quantity`
3. **Criar `CartRepository.java`** — `findByUserId()`, `findByUserIdWithItems()`
4. **Refatorar `CartServiceImpl.java`** — substituir `ConcurrentHashMap` por `CartRepository` JPA
5. **Atualizar `CartResponse.java`** — adicionar `couponCode`, `couponDiscount` nos campos

### FASE 2 — Backend: Módulo de Cupons

6. **Criar `Coupon.java`** — entidade com `code`, `discountType` (PERCENTAGE/FIXED), `discountValue`, `minOrderValue`, `validFrom`, `validUntil`, `maxUsages`, `currentUsages`, `isActive`
7. **Criar `CouponRepository.java`** — `findByCodeAndIsActiveTrue()`
8. **Criar `CouponService.java`** + `CouponServiceImpl.java` — validar e calcular desconto
9. **Criar `ApplyCouponRequest.java`** — `{ code: string }`
10. **Criar `CouponController.java`** — `POST /cart/apply-coupon`
11. **Atualizar `CartService`** — adicionar `applyCoupon()` e `removeCoupon()`
12. **Atualizar `CartResponse`** — incluir campos de cupom no response

### FASE 3 — Frontend: Services e Hooks

13. **Criar `src/services/cart.service.ts`** — wrapper sobre `http.get/post/patch/delete` apontando para `/v1/cart`
14. **Reescrever `useCart.tsx`** — integrar com `cart.service.ts`, manter localStorage como fallback, sincronizar contador no header

### FASE 4 — Frontend: UI do Carrinho

15. **Criar `src/components/web/cart-drawer.tsx`** — slide-over com lista de itens, incremento/decremento, remover, subtotal
16. **Atualizar `add-to-cart-button.tsx`** — chamar `cartService.addToCart()` em vez de `useCart().addItem()`
17. **Criar `src/app/(web)/cart/page.tsx`** — página dedicada com gestão completa + input de cupom
18. **Criar `src/components/web/coupon-input.tsx`** — input de cupom com validação visual

### FASE 5 — Documentação

19. Criar `hu-05-1-adicionar-carrinho.md`
20. Criar `hu-05-2-gerenciar-carrinho.md`
21. Criar `hu-05-3-aplicar-cupons.md`
22. Atualizar `sprint-status.yaml`

---

## CONSTRAINTS

- Reutilizar a estrutura existente: `BaseEntity`, `http` client, DTO pattern
- Não modificar a interface pública do `useCart` (compatibility)
- Cupom: validar expiração, usos máximos, valor mínimo
- Carrinho: validar estoque disponível antes de adicionar
- API: manter JWT auth em todos os endpoints
