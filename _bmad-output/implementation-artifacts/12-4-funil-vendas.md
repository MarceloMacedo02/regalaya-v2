# Story 12.4: Funil de Vendas

Status: review

## Story

Como admin,
quero visualizar o funil de conversão de vendas,
para identificar em qual etapa os clientes abandonam o processo e otimizar o funil.

## Acceptance Criteria

1. **Dado** que estou no dashboard, **quando** vejo o funil, **então** vejo 4 etapas: visitas → carrinho → checkout → compra
2. **Dado** que vejo o funil, **quando** olho para cada etapa, **então** vejo: número de usuários, taxa de conversão da etapa anterior e taxa de abandono
3. **Dado** que comparo períodos, **quando** seleciono período diferente, **então** vejo variação nas taxas de conversão
4. **Dado** que identifico gargalos, **quando** uma etapa tem conversão baixa (< 30%), **então** a etapa é destacada visualmente (cor warning)

## Tasks / Subtasks

- [ ] Task 1: Backend - Cálculo do Funil (AC: #1, #2, #3)
  - [ ] Criar `SalesFunnelController` com endpoint GET /admin/dashboard/sales-funnel
  - [ ] Criar `SalesFunnelService` com método `getSalesFunnel(startDate, endDate)`:
    - [ ] **Etapa 1 - Visits**: Contagem de sessões únicas (users que acessaram o site)
      - [ ] Se existir tabela `sessions` ou `analytics_events`: SELECT COUNT(DISTINCT session_id)
      - [ ] **Fallback**: Se não existir tabela de analytics, usar COUNT(DISTINCT user_id) de users que criaram conta no período + estimativa de visitantes anônimos (multiplicar por 3 como proxy inicial)
      - [ ] **Nota**: Documentar que esta métrica será aprimorada quando integração com Google Analytics ou similar for implementada
    - [ ] **Etapa 2 - Add to Cart**: Usuários que adicionaram ao carrinho
      - [ ] SELECT COUNT(DISTINCT user_id) FROM cart_items WHERE created_at BETWEEN :start AND :end
    - [ ] **Etapa 3 - Checkout Initiated**: Usuários que iniciaram checkout
      - [ ] Se existir tabela `checkout_sessions`: SELECT COUNT(DISTINCT user_id)
      - [ ] **Fallback**: Usar COUNT(DISTINCT user_id) de orders com status = 'PENDING' (indicam início de checkout)
    - [ ] **Etapa 4 - Purchased**: Usuários que completaram compra
      - [ ] SELECT COUNT(DISTINCT user_id) FROM orders WHERE created_at BETWEEN :start AND :end AND status IN ('PROCESSING', 'SHIPPED', 'DELIVERED')
  - [ ] Calcular taxas de conversão:
    - [ ] Conversion rate (visit → cart): cart / visits * 100
    - [ ] Conversion rate (cart → checkout): checkout / cart * 100
    - [ ] Conversion rate (checkout → purchase): purchase / checkout * 100
    - [ ] Overall conversion: purchase / visits * 100
  - [ ] Calcular taxas de abandono:
    - [ ] Abandonment rate = 100 - conversion rate
  - [ ] Retornar DTO estruturado:
    ```json
    {
      "period": { "start": "2026-03-09", "end": "2026-04-09" },
      "funnel": [
        { "stage": "visits", "label": "Visitas", "count": 5000, "conversionRate": null, "abandonmentRate": null },
        { "stage": "add_to_cart", "label": "Adicionaram ao Carrinho", "count": 1500, "conversionRate": 30.0, "abandonmentRate": 70.0 },
        { "stage": "checkout", "label": "Iniciaram Checkout", "count": 600, "conversionRate": 40.0, "abandonmentRate": 60.0 },
        { "stage": "purchase", "label": "Compraram", "count": 450, "conversionRate": 75.0, "abandonmentRate": 25.0 }
      ],
      "overallConversion": 9.0,
      "bottleneckStage": "add_to_cart"
    }
    ```
  - [ ] Identificar gargalo (etapa com menor conversão):
    - [ ] bottleneckStage = stage com menor conversionRate
  - [ ] Implementar caching Redis:
    - [ ] Key: `dashboard:funnel:{startDate}:{endDate}`
    - [ ] TTL: 10 minutos
  - [ ] **IMPORTANTE**: Documentar no código que métricas de visits/checkout são aproximadas e serão refinadas com analytics real

- [ ] Task 2: Frontend Admin - Visualização de Funil (AC: #1, #2, #4)
  - [ ] Criar componente `SalesFunnel`:
    - [ ] Usar componente de funil customizado (CSS puro ou biblioteca como `recharts` com FunnelChart se disponível)
    - [ ] **Alternativa recomendada**: Implementar funil visual com divs estilizadas (mais simples e controlável):
      - [ ] Cada etapa é uma barra horizontal com width proporcional ao count
      - [ ] Formato de trapézio (barra superior mais larga, inferior mais estreita)
      - [ ] Cores em gradiente decrescente (etapa 1: `--primary`, etapas seguintes: tons mais claros)
  - [ ] Implementar labels em cada etapa:
    - [ ] Nome da etapa (ex: "Visitas")
    - [ ] Contagem grande (ex: "5.000")
    - [ ] Taxa de conversão (ex: "30%")
    - [ ] Taxa de abandono em vermelho se > 70% (ex: "70% abandono")
  - [ ] Destacar gargalo visualmente:
    - [ ] Se conversionRate < 30%, aplicar cor `--warning` (#F59E0B) na etapa
    - [ ] Adicionar badge "⚠️ Gargalo"
  - [ ] Layout responsivo:
    - [ ] Desktop: funil horizontal centralizado
    - [ ] Mobile: funil vertical (stack de etapas)

- [ ] Task 3: Frontend Admin - Integração e Comparação (AC: #3, #4)
  - [ ] Criar hook customizado `useSalesFunnel(period)`:
    - [ ] React Query com cache de 9 minutos
    - [ ] Refetch ao mudar período
  - [ ] Implementar comparativo de períodos:
    - [ ] Toggle para mostrar período anterior
    - [ ] Exibir variação de conversão (ex: "+5% vs período anterior")
    - [ ] Cores: verde para melhoria, vermelho para piora
  - [ ] Estado de loading:
    - [ ] Skeleton para funil (barras cinzas animadas)
  - [ ] Estado vazio:
    - [ ] Mensagem: "Sem dados de funil para o período"
    - [ ] Explicação: "O funil aparecerá quando houver atividade de usuários"
  - [ ] Tooltip explicativo:
    - [ ] Ao passar mouse em cada etapa, mostrar descrição do que significa
    - [ ] Ex: "Visitas: número de usuários únicos que acessaram o site"

- [ ] Task 4: Testes e Validação (AC: #1-#4)
  - [ ] Backend: Testes unitários:
    - [ ] Testar cálculo de taxas de conversão (divisão por zero se visits = 0)
    - [ ] Testar identificação de gargalo
    - [ ] Testar fallbacks se tabelas de analytics não existirem
  - [ ] Backend: Teste de integração:
    - [ ] Verificar schema de response
    - [ ] Testar com dados reais de orders e cart_items
  - [ ] Frontend: Testes de componente:
    - [ ] SalesFunnel renderiza 4 etapas
    - [ ] Gargalo destacado com cor warning
    - [ ] Tooltip aparece com descrição
  - [ ] Frontend: Teste E2E:
    - [ ] Acesso ao dashboard, verificação do funil, mudança de período

## Dev Notes

### Architecture Patterns

- **Clean Architecture**: Controller → Service → Repository
- **Fallback Strategy**: Documentar claramente que métricas de visits/checkout são aproximadas
- **Caching**: TTL 10 min, dados mudam menos frequentemente
- **Transparência**: Indicar no response quais métricas são aproximadas (flag `isEstimated`)

### Database Queries

```sql
-- Etapa 2: Add to cart
SELECT COUNT(DISTINCT user_id) 
FROM cart_items 
WHERE created_at BETWEEN :start AND :end;

-- Etapa 4: Purchased
SELECT COUNT(DISTINCT user_id) 
FROM orders 
WHERE created_at BETWEEN :start AND :end 
  AND status IN ('PROCESSING', 'SHIPPED', 'DELIVERED');

-- Índices necessários:
-- CREATE INDEX idx_cart_items_user_created ON cart_items(user_id, created_at);
-- CREATE INDEX idx_orders_user_created_status ON orders(user_id, created_at, status);
```

### Source Tree Components

**Backend (regalaya-api/):**
- `src/main/java/com/regalaya/api/dashboard/` (expandir)
  - `SalesFunnelController.java` (criar)
  - `SalesFunnelService.java` (criar)
  - `SalesFunnelResponse.java` (DTO, criar)
  - `FunnelStage.java` (DTO aninhado, criar)
- `src/main/java/com/regalaya/api/cart/` (existente)
  - `CartItemRepository.java` - adicionar método de contagem
- `src/main/java/com/regalaya/api/order/` (existente)
  - `OrderRepository.java` - adicionar método de contagem por status

**Frontend Admin (regalaya-admin/):**
- `src/components/dashboard/SalesFunnel.tsx` (criar)
- `src/hooks/useSalesFunnel.ts` (criar)
- `src/lib/api/dashboard.ts` (expandir)

### Testing Standards

- **Backend**: JUnit 5 + Mockito, testar fallbacks explicitamente
- **Frontend**: Vitest + RTL, mock de dados do funil
- **E2E**: Playwright, testar visualização e comparativo

### Performance Requirements

- Query < 200ms (com índices)
- Response < 300ms (com cache)
- Funil renderiza < 500ms

### UX Guidelines

- [Source: CU.md#3.1 Cores](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md)
  - Etapas: gradiente de `--primary` para tons mais claros
  - Gargalo: `--warning` (#F59E0B)
  - Melhorias: `--success` (#10B981), Pioras: `--error` (#EF4444)
- [Source: CU.md#2.3 Admin Dashboard UX](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md)
  - Tooltips explicativos

### Important Notes

⚠️ **Métricas Aproximadas**: As etapas de "visitas" e "checkout iniciado" são aproximadas nesta versão inicial. O funil será aprimorado quando:
1. Integração com Google Analytics ou similar for implementada
2. Tabela de checkout_sessions for criada (Story de checkout futura)
3. Tracking de eventos de navegação for implementado

Documentar isso no código e na UI para admins.

### References

- [Source: CE.md#ÉPICO 12 - HU-12.4](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\implementation-artifacts\CE.md)
- [Source: CA.md#2.2 Database Schema - orders, cart_items tables](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CA.md)
- [Source: CU.md#2.3 Admin Dashboard UX](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
