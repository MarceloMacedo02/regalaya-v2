# Story 12.3: Produtos Mais Vendidos

Status: review

## Story

Como admin,
quero ver um ranking dos produtos mais vendidos,
para entender quais produtos impulsionam o negócio e tomar decisões de estoque/marketing.

## Acceptance Criteria

1. **Dado** que estou no dashboard, **quando** vejo o ranking de produtos, **então** vejo top 10 produtos ordenados por unidades vendidas
2. **Dado** que vejo o ranking, **quando** olho para um produto, **então** vejo: nome, imagem (thumbnail), unidades vendidas e receita total
3. **Dado** que quero analisar, **quando** vejo o gráfico de barras, **então** a visualização é horizontal para acomodar nomes longos
4. **Dado** que clico em um produto, **quando** interajo com o ranking, **então** sou redirecionado para a página de detalhes do produto no admin

## Tasks / Subtasks

- [ ] Task 1: Backend - Endpoint GET /admin/dashboard/top-products (AC: #1, #2)
  - [ ] Criar `TopProductsController` com endpoint GET /admin/dashboard/top-products
  - [ ] Criar `TopProductsService` com método `getTopProducts(limit, startDate, endDate)`:
    - [ ] Query de agregação unindo orders + order_items:
      - [ ] SELECT oi.product_name, oi.product_sku, oi.image_url, SUM(oi.quantity) as units_sold, SUM(oi.total) as revenue
      - [ ] FROM order_items oi
      - [ ] JOIN orders o ON oi.order_id = o.id
      - [ ] WHERE o.created_at BETWEEN :start AND :end AND o.status NOT IN ('CANCELLED', 'REFUNDED')
      - [ ] GROUP BY oi.product_name, oi.product_sku, oi.image_url
      - [ ] ORDER BY units_sold DESC
      - [ ] LIMIT :limit (default 10)
  - [ ] Retornar DTO estruturado:
    ```json
    {
      "period": { "start": "2026-03-09", "end": "2026-04-09" },
      "products": [
        {
          "rank": 1,
          "productName": "Buquê Premium de Rosas",
          "productSku": "BUQ-001",
          "imageUrl": "https://...",
          "unitsSold": 145,
          "revenue": 27550.00
        }
      ]
    }
    ```
  - [ ] Parâmetros query opcionais:
    - [ ] limit: número de produtos (default 10, max 50)
    - [ ] startDate, endDate: filtro temporal (default 30 dias)
  - [ ] Implementar caching Redis:
    - [ ] Key: `dashboard:top-products:{limit}:{startDate}:{endDate}`
    - [ ] TTL: 10 minutos (muda menos frequentemente)
  - [ ] Tratar produtos sem imagem (imageUrl: null)

- [ ] Task 2: Frontend Admin - Gráfico de Barras Horizontal (AC: #1, #3)
  - [ ] Criar componente `TopProductsChart`:
    - [ ] Usar Recharts `<BarChart>` com layout horizontal (`layout="vertical"`)
    - [ ] Eixo Y: nomes dos produtos (truncate com CSS se > 30 chars)
    - [ ] Eixo X: unidades vendidas
    - [ ] Barras: cor `--primary` com gradiente
    - [ ] Labels nas barras mostrando valor exato
  - [ ] Implementar ranking visual complementar:
    - [ ] Lista vertical abaixo ou ao lado do gráfico
    - [ ] Cada item mostra:
      - [ ] Rank badge (1-10) com cor especial para top 3 (ouro, prata, bronze)
      - [ ] Thumbnail do produto (40x40px, rounded)
      - [ ] Nome do produto (truncate com ellipsis)
      - [ ] Unidades vendidas (bold)
      - [ ] Receita total (cor secundária)
  - [ ] Layout responsivo:
    - [ ] Desktop: gráfico à esquerda (60%), ranking à direita (40%)
    - [ ] Mobile: gráfico em cima, ranking embaixo (stack vertical)

- [ ] Task 3: Frontend Admin - Interação e Navegação (AC: #2, #4)
  - [ ] Implementar click handler em cada produto:
    - [ ] Ao clicar, navegar para `/admin/products/{productSku}` ou `/admin/products?search={productName}`
    - [ ] Usar Next.js `useRouter().push()`
    - [ ] Cursor pointer no hover
    - [ ] Highlight visual no hover (background `--neutral-100`)
  - [ ] Criar hook customizado `useTopProducts(period, limit)`:
    - [ ] React Query com cache de 9 minutos
    - [ ] Refetch ao mudar período
  - [ ] Estado de loading:
    - [ ] Skeleton para 10 itens de ranking
    - [ ] Skeleton para gráfico
  - [ ] Estado vazio:
    - [ ] Mensagem: "Nenhum produto vendido no período"
      - [ ] Ícone de caixa vazia
      - [ ] CTA: "Explore o catálogo de produtos"
  - [ ] Formatação de valores:
    - [ ] Receita: BRL currency
    - [ ] Unidades: número inteiro

- [ ] Task 4: Testes e Validação (AC: #1-#4)
  - [ ] Backend: Testes unitários:
    - [ ] Testar query de agregação com JOIN orders + order_items
    - [ ] Testar exclusão de pedidos cancelados
    - [ ] Testar limit configurável
  - [ ] Backend: Teste de integração:
    - [ ] Verificar schema de response com dados reais
    - [ ] Testar ordenação (units_sold DESC)
  - [ ] Frontend: Testes de componente:
    - [ ] TopProductsChart renderiza 10 produtos mock
    - [ ] Click em produto navega para página correta
    - [ ] Top 3 badges com cores corretas (ouro, prata, bronze)
  - [ ] Frontend: Teste E2E:
    - [ ] Acesso ao dashboard, verificação do ranking, click em produto

## Dev Notes

### Architecture Patterns

- **Clean Architecture**: Controller → Service → Repository
- **Query Complexa**: JOIN entre orders e order_items, agregar por produto
- **Caching**: TTL maior (10 min) pois dados mudam menos frequentemente
- **Navegação**: Link para detalhes do produto (página pode existir em story futura)

### Database Queries

```sql
-- Top products aggregation
SELECT 
  oi.product_name,
  oi.product_sku,
  oi.image_url,
  SUM(oi.quantity) as units_sold,
  SUM(oi.total) as revenue
FROM order_items oi
INNER JOIN orders o ON oi.order_id = o.id
WHERE o.created_at BETWEEN :startDate AND :endDate
  AND o.status NOT IN ('CANCELLED', 'REFUNDED')
GROUP BY oi.product_name, oi.product_sku, oi.image_url
ORDER BY units_sold DESC
LIMIT :limit;

-- Índices necessários:
-- CREATE INDEX idx_order_items_order_id ON order_items(order_id);
-- CREATE INDEX idx_orders_created_status ON orders(created_at, status);
```

### Source Tree Components

**Backend (regalaya-api/):**
- `src/main/java/com/regalaya/api/dashboard/` (expandir)
  - `TopProductsController.java` (criar)
  - `TopProductsService.java` (criar)
  - `TopProductsResponse.java` (DTO, criar)
  - `TopProductItem.java` (DTO aninhado, criar)
- `src/main/java/com/regalaya/api/order/` (existente)
  - `OrderItemRepository.java` (criar se não existir)

**Frontend Admin (regalaya-admin/):**
- `src/components/dashboard/TopProductsChart.tsx` (criar)
- `src/components/dashboard/TopProductsRanking.tsx` (criar)
- `src/hooks/useTopProducts.ts` (criar)
- `src/lib/api/dashboard.ts` (expandir)

### Testing Standards

- **Backend**: JUnit 5 + Mockito, testar query com dados reais
- **Frontend**: Vitest + RTL, mock de produtos
- **E2E**: Playwright, testar navegação

### Performance Requirements

- Query < 300ms (com índices em order_id e created_at)
- Response < 400ms (com cache)
- Gráfico renderiza < 1s com 10-50 produtos

### UX Guidelines

- [Source: CU.md#3.1 Cores](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md)
  - Barras: `--primary` (#8B5CF6)
  - Top 1: ouro (#FFD700), Top 2: prata (#C0C0C0), Top 3: bronze (#CD7F32)
- [Source: CU.md#2.3.2 Padrões de Tabela](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md)
  - Hover states, cursor pointer

### References

- [Source: CE.md#ÉPICO 12 - HU-12.3](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\implementation-artifacts\CE.md)
- [Source: CA.md#2.2 Database Schema - orders, order_items tables](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CA.md)
- [Source: CU.md#2.3 Admin Dashboard UX](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
