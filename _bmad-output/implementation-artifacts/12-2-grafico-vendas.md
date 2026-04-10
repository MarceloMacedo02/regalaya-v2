# Story 12.2: Gráfico de Vendas

Status: review

## Story

Como admin,
quero visualizar um gráfico de vendas ao longo do tempo,
para identificar tendências e padrões de comportamento.

## Acceptance Criteria

1. **Dado** que estou no dashboard, **quando** vejo o gráfico de vendas, **então** vejo dados agregados por dia/semana/mês dependendo do período selecionado
2. **Dado** que vejo o gráfico, **quando** passo o mouse sobre um ponto, **então** vejo tooltip com: data, receita total e número de pedidos
3. **Dado** que seleciono período de 7 dias, **quando** vejo o gráfico, **então** os dados estão agregados por dia
4. **Dado** que seleciono período de 30-90 dias, **quando** vejo o gráfico, **então** os dados estão agregados por semana
5. **Dado** que quero analisar detalhes, **quando** uso zoom no gráfico, **então** posso focar em um subperíodo específico

## Tasks / Subtasks

- [ ] Task 1: Backend - Endpoint GET /admin/dashboard/sales-chart (AC: #1, #3, #4)
  - [ ] Criar `SalesChartController` com endpoint GET /admin/dashboard/sales-chart
  - [ ] Reutilizar `DashboardService` ou criar `SalesChartService`:
    - [ ] Método `getSalesData(startDate, endDate, granularity)`
    - [ ] Granularidade automática baseada no período:
      - [ ] ≤ 14 dias: agrupar por DIA (`DATE_TRUNC('day', created_at)`)
      - [ ] 15-90 dias: agrupar por SEMANA (`DATE_TRUNC('week', created_at)`)
      - [ ] > 90 dias: agrupar por MÊS (`DATE_TRUNC('month', created_at)`)
  - [ ] Query de agregação:
    - [ ] SELECT DATE_TRUNC(...) as period, SUM(total) as revenue, COUNT(*) as orders
    - [ ] FROM orders
    - [ ] WHERE created_at BETWEEN start AND end AND status NOT IN ('CANCELLED', 'REFUNDED')
    - [ ] GROUP BY period ORDER BY period ASC
  - [ ] Retornar DTO estruturado:
    ```json
    {
      "granularity": "day",
      "data": [
        { "date": "2026-04-01", "revenue": 4500.00, "orders": 15 },
        { "date": "2026-04-02", "revenue": 3200.00, "orders": 12 }
      ],
      "totals": { "revenue": 125000.00, "orders": 450 }
    }
    ```
  - [ ] Implementar caching Redis:
    - [ ] Key: `dashboard:sales:{startDate}:{endDate}:{granularity}`
    - [ ] TTL: 5 minutos
  - [ ] Tratar períodos sem dados (retornar array vazio)

- [ ] Task 2: Frontend Admin - Gráfico de Linha/Área (AC: #1, #2, #5)
  - [ ] Criar componente `SalesChart` no dashboard:
    - [ ] Usar Recharts (`recharts` package)
    - [ ] Tipo: `<AreaChart>` com gradiente (preferência) ou `<LineChart>`
    - [ ] Eixo X: datas formatadas (DD/MM ou MMM/YYYY dependendo da granularidade)
    - [ ] Eixo Y esquerdo: receita (R$)
    - [ ] Eixo Y direito (opcional): número de pedidos (linha secundária)
  - [ ] Implementar dual-axis chart:
    - [ ] Área para receita (cor `--primary` com opacidade)
    - [ ] Linha para pedidos (cor `--secondary`, stroke width 2px)
    - [ ] Legenda clara distinguindo as duas métricas
  - [ ] Implementar tooltip customizado:
    - [ ] Formato: "DD/MM/YYYY"
    - [ ] Receita: "R$ 4.500,00"
    - [ ] Pedidos: "15 pedidos"
    - [ ] Background branco, sombra suave
  - [ ] Implementar zoom/brush:
    - [ ] `<Brush>` component do Recharts na parte inferior
    - [ ] Permitir selecionar subperíodo
    - [ ] Atualizar gráfico principal com dados filtrados
  - [ ] Responsividade:
    - [ ] `ResponsiveContainer` do Recharts
    - [ ] Altura mínima: 300px
    - [ ] Width: 100% do container pai

- [ ] Task 3: Frontend Admin - Integração e Estados (AC: #1-#5)
  - [ ] Criar hook customizado `useSalesChart(period)`:
    - [ ] React Query com cache de 4 minutos
    - [ ] Parâmetros: startDate, endDate (derivados do period)
    - [ ] Refetch automático ao mudar período
  - [ ] Estado de loading:
    - [ ] Skeleton para gráfico (retângulo cinza animado)
    - [ ] Duração mínima: 300ms (evitar flash)
  - [ ] Estado vazio:
    - [ ] Mensagem: "Sem dados de vendas para este período"
    - [ ] Ilustração sutil (ícone de gráfico vazio)
  - [ ] Estado de erro:
    - [ ] Toast com mensagem: "Erro ao carregar gráfico. Tente novamente."
    - [ ] Botão de retry
  - [ ] Formatação de eixos:
    - [ ] Eixo X: dates adaptadas à granularidade (DD/MM para dias, MMM/YYYY para meses)
    - [ ] Eixo Y: Intl.NumberFormat para BRL
    - [ ] Tick formatting: abreviar valores grandes (R$ 4.5k, R$ 125k)

- [ ] Task 4: Testes e Validação (AC: #1-#5)
  - [ ] Backend: Testes unitários para agregação:
    - [ ] Testar agrupamento por dia, semana, mês
    - [ ] Testar exclusão de pedidos cancelados
    - [ ] Testar período sem dados (array vazio)
  - [ ] Backend: Teste de integração:
    - [ ] Verificar response schema com dados reais
    - [ ] Testar granularidade automática
  - [ ] Frontend: Testes de componente:
    - [ ] SalesChart renderiza com dados mock
    - [ ] Tooltip aparece no hover com dados corretos
    - [ ] Brush permite zoom e atualiza gráfico
  - [ ] Frontend: Teste E2E:
    - [ ] Acesso ao dashboard, verificação do gráfico, interação com tooltip

## Dev Notes

### Architecture Patterns

- **Clean Architecture**: Controller → Service → Repository
- **DTO Pattern**: Response DTO com dados já formatados para o frontend
- **Caching**: Redis com Spring Cache, TTL 5 min
- **Reutilização**: Usar `DashboardService` da Story 12.1 se possível

### Database Queries

```sql
-- Agregação por dia
SELECT 
  DATE_TRUNC('day', created_at) as period,
  SUM(total) as revenue,
  COUNT(*) as orders
FROM orders
WHERE created_at BETWEEN :start AND :end 
  AND status NOT IN ('CANCELLED', 'REFUNDED')
GROUP BY period 
ORDER BY period ASC;

-- Índices necessários:
-- CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
-- CREATE INDEX idx_orders_status ON orders(status);
```

### Source Tree Components

**Backend (regalaya-api/):**
- `src/main/java/com/regalaya/api/dashboard/` (expandir)
  - `SalesChartController.java` (criar)
  - `SalesChartService.java` (criar)
  - `SalesChartDataResponse.java` (DTO, criar)
  - `SalesDataPoint.java` (DTO aninhado, criar)
- `src/main/java/com/regalaya/api/order/` (existente)
  - `OrderRepository.java` - adicionar método de agregação temporal

**Frontend Admin (regalaya-admin/):**
- `src/components/dashboard/SalesChart.tsx` (criar)
- `src/hooks/useSalesChart.ts` (criar)
- `src/lib/api/dashboard.ts` (expandir com função de fetch)
- Dependencies: `recharts` (já deve estar instalado)

### Testing Standards

- **Backend**: JUnit 5 + Mockito, testar agregação com dados reais
- **Frontend**: Vitest + React Testing Library, mock de dados do gráfico
- **E2E**: Playwright, testar interação com tooltip e brush

### Performance Requirements

- Query de agregação < 200ms (com índice em created_at)
- Response time < 300ms (com cache)
- Gráfico renderiza < 1s com até 365 pontos de dados
- Brush não degrada performance (debounce 100ms no zoom)

### UX Guidelines

- [Source: CU.md#3.1 Cores](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md)
  - Receita: cor `--primary` (#8B5CF6)
  - Pedidos: cor `--secondary` (#EC4899)
- [Source: CU.md#2.3.2 Padrões de Componentes](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md)
  - Tooltip: background branco, sombra, bordas arredondadas
  - Loading: skeleton screens

### References

- [Source: CE.md#ÉPICO 12 - HU-12.2](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\implementation-artifacts\CE.md)
- [Source: CA.md#2.2 Database Schema - orders table](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CA.md)
- [Source: CU.md#2.3 Admin Dashboard UX](D:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md)
- [Source: Recharts Documentation](https://recharts.org/en-US/api)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
