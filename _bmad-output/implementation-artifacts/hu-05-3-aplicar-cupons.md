# HU-05-3: Aplicar Cupons de Desconto

## Contexto
Implementar o sistema de cupons de desconto com validação completa (expiração, usos máximos, valor mínimo).

## Critérios de Aceitação

### Backend
- [x] Entidade `Coupon.java` com `code`, `discountType` (PERCENTAGE/FIXED), `discountValue`, `minOrderValue`, `validFrom`, `validUntil`, `maxUsages`, `currentUsages`
- [x] `CouponRepository.java` com `findByCodeIgnoreCaseAndIsActiveTrue()`
- [x] `CouponService` com validação completa de cupom
- [x] Endpoint `POST /v1/cart/apply-coupon` para aplicar cupom
- [x] Endpoint `DELETE /v1/cart/coupon` para remover cupom
- [x] `CartResponse` atualizado com `couponCode` e `couponDiscount`
- [x] Cupom admin controller com CRUD básico

### Frontend
- [x] Input de cupom na página `/cart`
- [x] Validação visual de cupom (erro/sucesso)
- [x] Exibição do cupom aplicado com botão de remover
- [x] Desconto subtraído do total automaticamente
- [x] Toast de confirmação ao aplicar/remover

## Checklist de Implementação
- [x] Entidade `Coupon.java` criada
- [x] `CouponRepository.java` criado
- [x] `CouponService` e `CouponServiceImpl` criados
- [x] Endpoints `apply-coupon` e `coupon` no `CartController`
- [x] `ApplyCouponRequest.java` criado
- [x] `CartResponse` atualizado com campos de cupom
- [x] `CouponController` (admin) criado
- [x] `cart.service.ts` com `applyCoupon()` e `removeCoupon()`
- [x] `useCart` hook com `applyCoupon` e `removeCoupon`
- [x] Página `/cart` com input de cupom e exibição de desconto
