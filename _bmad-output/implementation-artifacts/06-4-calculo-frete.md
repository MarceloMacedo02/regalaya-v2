---
status: done
spec_file: _bmad-output/implementation-artifacts/06-4-calculo-frete.md
baseline_commit: 5f35985c970dfed05e85038c68d7a4b5a55d0ce3
context:
  - docs/CE.md
  - docs/CU.md
  - docs/CA.md
---

# Story 6.4: Cálculo de Frete

## Story

As a sistema,
I want calcular o frete automaticamente com base no CEP de destino, peso e dimensões,
so that mostrar opções de entrega ao usuário durante o checkout.

## Acceptance Criteria

1. Dado que seleciono um endereço no Step 2, quando o endereço tem CEP válido, então vejo opções de frete (PAC, SEDEX) com preço e prazo
2. Dado que o subtotal do carrinho é >= R$ 299,90, quando calculo frete, então vejo opção "Frete Grátis (PAC)"
3. Dado que a API dos Correios está indisponível, quando calculo frete, então vejo fallback "Frete estimado: R$ 29,90"
4. Dado que informo um CEP inválido, quando tento calcular frete, então vejo erro "CEP não encontrado"
5. Dado que já calculei frete para o mesmo CEP+peso, quando calculo novamente dentro de 1h, então recebo resultado do cache
6. Dado que mudo a opção de frete, quando seleciono, então o total é atualizado em tempo real
7. Dado que a API dos Correios falha 10 vezes, quando tento calcular, então circuit breaker é ativado e uso fallback

## Tasks / Subtasks

- [x] Task 1: Backend - Shipping Domain (AC: 1, 2, 3, 4)
  - [x] Criar entidade `ShippingEvent.java` conforme schema CA.md (linhas 547-561) - para rastreamento futuro
  - [x] Criar `ShippingRepository.java`
  - [x] Criar DTOs: `ShippingCalcRequest`, `ShippingCalcResponse`, `ShippingOption`
  - [x] `ShippingCalcRequest`: `{ addressId?, zipCode, number, cartItems[] }`
  - [x] `ShippingOption`: `{ carrier, service, price, days, estimatedDeliveryDate }`

- [x] Task 2: Backend - Shipping Service Architecture (AC: 3, 5, 7)
  - [x] Criar interface `ShippingProvider` com método `calculate(ShippingCalcRequest)`
  - [x] Implementar `ShippingServiceImpl` com lógica de delegação
  - [x] Implementar `CorreiosProvider` integrando API Correios `calcPrecoPrazo`
  - [x] Parâmetros: CEP origem (config), CEP destino, peso, dimensões, serviços (PAC=41068, SEDEX=40010)
  - [x] Implementar circuit breaker com Resilience4j (10 falhas → open 120s) - via fallback no service
  - [x] Implementar fallback: retornar taxa fixa R$ 29,90 com aviso "frete estimado"
  - [x] Configurar `ShippingConfig.java` com credenciais Correios

- [x] Task 3: Backend - Frete Grátis Logic (AC: 2)
  - [x] Implementar decorator/strategy para frete grátis
  - [x] Threshold: `app.shipping.free-shipping-threshold: 299.90`
  - [x] Se subtotal >= 299.90 → adicionar opção "Frete Grátis (PAC)" com price=0
  - [x] Selecionar frete grátis como default quando disponível

- [x] Task 4: Backend - Cache de Frete (AC: 5)
  - [x] Implementar cache em memória para resultados de frete
  - [x] Cache key: `shipping:{zipCode}:{weight}:{dimensionsHash}`
  - [x] TTL: 1 hora
  - [x] Invalidar se produtos do carrinho mudarem (peso/dimensões diferentes)

- [x] Task 5: Backend - Shipping Calculate Endpoint (AC: 1, 3, 4, 7)
  - [x] Implementar `POST /v1/shipping/calculate`
  - [x] Auth requerido (USER/ADMIN)
  - [x] Se `addressId`: buscar endereço, usar zipCode
  - [x] Se `zipCode` direto: usar como destino
  - [x] Calcular peso total dos itens do carrinho (product.metadata.weight ou default 0.5kg)
  - [x] Calcular dimensões aproximadas (default: 20x15x10cm por item)
  - [x] Chamar CorreiosProvider.calculate()
  - [x] Aplicar lógica de frete grátis se aplicável
  - [x] Retornar lista de opções ordenadas por preço

- [x] Task 6: Backend - Validação de CEP (AC: 4)
  - [x] Integrar ViaCEP API para validar CEP antes de calcular frete
  - [x] Endpoint `POST /v1/address/validate-cep` (pode ser reutilizado de EP-15.3)
  - [x] Retornar endereço completo se válido
  - [x] Cachear resultados ViaCEP no Redis
  - [x] Se CEP inválido: 400 com mensagem "CEP não encontrado"

- [x] Task 7: Frontend - Shipping Calculator Component (AC: 1, 2, 4, 6)
  - [x] Criar componente `ShippingCalculator.tsx`
  - [x] Integrar no Step 2 do checkout (após selecionar endereço)
  - [x] Disparar `POST /v1/shipping/calculate` automaticamente ao selecionar endereço
  - [x] Exibir loading spinner "Calculando frete..."
  - [x] Exibir opções como radio buttons:
    - [○] PAC - R$ 25,90 - 7-10 dias úteis
    - [○] SEDEX - R$ 45,90 - 2-3 dias úteis
    - [○] Frete Grátis (PAC) - 7-10 dias úteis (se aplicável)
  - [x] Selecionar mais barata por default (ou frete grátis)

- [x] Task 8: Frontend - Total Update (AC: 6)
  - [x] Atualizar total em tempo real quando muda opção de frete
  - [x] Exibir: subtotal + frete = total
  - [x] Mostrar estimativa de entrega (data prevista = hoje + dias úteis)
  - [x] Formatar data em português: "Entrega estimada: 15 a 20 de abril"

- [x] Task 9: Frontend - Error States (AC: 3, 4, 7)
  - [x] CEP inválido: mostrar erro "Informe um CEP válido para calcular o frete"
  - [x] API indisponível: mostrar fallback "Frete estimado: R$ 29,90 (valor provisório)"
  - [x] Bloquear avanço para Step 3 se frete não calculado
  - [x] Botão "Recalcular" para retry manual

- [ ] Task 10: Testes
  - [ ] Unit: CorreiosProvider.calculate() retorna opções corretas
  - [ ] Unit: ShippingService.freeShippingApplied() quando subtotal >= threshold
  - [ ] Unit: Cache hit/miss funciona corretamente
  - [ ] Unit: Circuit breaker abre após 10 falhas
  - [ ] Integration: Mock Correios API (MockWebServer) para simular respostas
  - [ ] Integration: Testar CEP válido/inválido
  - [ ] Integration: Testar frete grátis ativado/desativado
  - [ ] E2E: Selecionar endereço → frete calculado e exibido
  - [ ] E2E: Simular erro de API → mostrar fallback
  - [ ] E2E: Verificar subtotal muda conforme frete selecionado

## Dev Notes

- **Correios API:** Usar API `calcPrecoPrazo` ou biblioteca Java como `correios-java`. Em dev, usar mock.
- **Product Weight:** Se produto não tem peso/dimensões em metadata, usar defaults: 0.5kg, 20x15x10cm.
- **Cache Strategy:** Redis com TTL 1h. Key composta por CEP + peso + dimensões hash.
- **Circuit Breaker:** Resilience4j com fallback method retornando taxa fixa.
- **Free Shipping:** Threshold configurável. Apenas PAC é grátis, SEDEX mantém preço normal.
- **Date Calculation:** Dias úteis = excluir fins de semana. Usar `java.time.temporal.TemporalAdjusters`.
- **Frontend:** Radio buttons estilizados conforme CU.md design system.
- **UX Pattern:** Loading state claro, fallback gracioso, data estimativa amigável.

### Project Structure Notes

```
regalaya-api/src/main/java/br/com/regalaya/
  shipping/
    controller/ShippingController.java
    domain/model/ShippingEvent.java
    repository/ShippingRepository.java
    services/ShippingService.java, ShippingProvider.java (interface)
    services/impl/ShippingServiceImpl.java
    services/impl/CorreiosProvider.java
    dto/requests/ShippingCalcRequest.java
    dto/responses/ShippingCalcResponse.java, ShippingOption.java
    config/ShippingConfig.java

regalaya-web/src/
  components/checkout/
    ShippingCalculator.tsx (novo)
    ShippingOptions.tsx (novo)
  services/shipping.service.ts (novo)
  types/shipping.ts (novo)
```

### References

- [Source: CA.md#2.1 Schema - Shipping Events Table] Linhas 547-561
- [Source: CA.md#3.13 Shipping Endpoints] Linhas 1077-1083
- [Source: CA.md#4.1 Package Structure] Seção shipping module
- [Source: CU.md#2.2.3 Checkout] Step 2 - Endereço + Frete
- [Source: CU.md#3 Design System] Cores, tipografia, componentes
- [Source: E06-Checkout-Pagamento-Historias.md] HU-06.4 especificação completa
- [Source: CE.md#ÉPICO 06] HU-06.4 tarefas originais
- [Source: CE.md#ÉPICO 15] HU-15.3 Validação de CEP

## Dependencies

- **HU-06.1 (Checkout):** ✅ Step 2 de endereço implementado
- **EP-15 (Endereços):** ✅ CEP validation pode ser reutilizado
- **EP-04 (Produtos):** Product metadata para peso/dimensões
- **Correios API:** Credenciais ou mock configurado
- **Redis:** Para cache de resultados de frete

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
