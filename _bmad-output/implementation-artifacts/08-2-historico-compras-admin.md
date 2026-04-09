# Story 8.2: Histórico de Compras (Admin)

Status: in-progress

<!-- Nota: validação é opcional. Este arquivo foi reconciliado com o código real em 2026-04-08. -->

## Story

Como admin, quero ver o histórico de compras de cada cliente, para entender o comportamento.

## Acceptance Criteria

1. [x] A página de perfil do cliente exibe o histórico de compras.
2. [x] O fluxo permite ver detalhes de pedidos, inclusive via modal de detalhes.
3. [x] O backend calcula métricas como LTV, frequência e última compra.
4. [x] O sistema segmenta clientes automaticamente (VIP, NEW, INACTIVE, REGULAR).
5. [ ] Os gráficos ainda estão parciais: LTV e frequência existem, mas AOV/top categories não estão completos.
6. [x] As tags de segmento são visualmente distintas.
7. [ ] A exportação existe apenas em CSV; Excel/XLSX não foi implementado.
8. [x] A página é responsiva no layout principal.
9. [ ] O carregamento é paginado, mas não há fluxo de "progressive loading" dedicado.
10. [ ] Não há atualização em tempo real; os dados são buscados sob demanda.

## Tasks / Subtasks

- [x] Backend: Criar endpoints do perfil/histórico do cliente
  - [x] `GET /v1/admin/customers/{customerId}`
  - [x] `GET /v1/admin/customers/{customerId}/orders`
  - [x] `GET /v1/admin/customers/{customerId}/orders/export`
  - [x] `GET /v1/admin/customers/{customerId}/analytics`
  - [x] `POST /v1/admin/customers/{customerId}/recalculate-segmentation`

- [x] Backend: Métricas e segmentação
  - [x] Calcular LTV, ticket médio, total de pedidos e frequência
  - [x] Implementar lógica de segmentação automática
  - [x] Permitir recálculo manual da segmentação
  - [ ] Identificar sazonalidade de forma robusta
  - [ ] Persistir segmentação derivada como atributo materializado

- [x] Frontend Admin: Criar página de perfil do cliente
  - [x] Implementar layout com sidebar e abas
  - [x] Exibir resumo do cliente
  - [x] Implementar aba de histórico de pedidos
  - [x] Implementar cards de métricas
  - [x] Implementar gráfico de LTV
  - [x] Implementar gráfico de frequência de compras
  - [x] Implementar tags visuais para segmentos

- [ ] Frontend Admin: Completar analytics e visualizações
  - [ ] Gráfico de distribuição de valor médio por pedido está em placeholder
  - [ ] Top categories depende de dados ainda indisponíveis no backend
  - [ ] Exportação dos gráficos não foi implementada

- [ ] Frontend Admin: Completar experiência de segmentação
  - [x] Exibir tags coloridas para segmentos
  - [ ] Adicionar tooltips com detalhes extras
  - [ ] Permitir clique na tag para filtrar clientes semelhantes
  - [ ] Adicionar animação/mudança visual mais rica ao recalcular

- [ ] Exportação e testes
  - [x] Exportação CSV do histórico implementada
  - [ ] Exportação Excel/XLSX não implementada
  - [x] Há testes backend para analytics e segmentação
  - [ ] Faltam testes de controller/profile export
  - [ ] Faltam testes frontend das abas, gráficos e exportação

## Dev Notes

- O escopo original acabou se dividindo na prática em perfil, histórico de pedidos, métricas/segmentação e gráficos.
- A base funcional existe, mas ainda há pendências claras de analytics avançado e exportação Excel.
- O backend hoje retorna dados reais, mas `favoriteCategory` e `topCategories` ainda caem em fallback vazio porque o modelo atual não fornece relacionamento suficiente para essa agregação.

### Project Structure Notes

- Backend real:
  - `regalaya-api/src/main/java/br/com/regalaya/admin/controller/CustomerProfileController.java`
  - `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerProfileService.java`
  - `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerAnalyticsService.java`
  - `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerSegmentationService.java`
- Frontend real:
  - `regalaya-web/src/app/admin/customers/[id]/page.tsx`
  - `regalaya-web/src/components/admin/customers/profile/TabSummary.tsx`
  - `regalaya-web/src/components/admin/customers/profile/TabOrders.tsx`
  - `regalaya-web/src/components/admin/customers/profile/TabMetrics.tsx`
  - `regalaya-web/src/components/admin/customers/profile/CustomerSidebar.tsx`
  - `regalaya-web/src/components/admin/customers/charts/*`

### References

- [CustomerProfileController.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\admin\controller\CustomerProfileController.java)
- [CustomerProfileService.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\admin\services\CustomerProfileService.java)
- [CustomerAnalyticsService.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\admin\services\CustomerAnalyticsService.java)
- [page.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\app\admin\customers\[id]\page.tsx)
- [TabOrders.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\components\admin\customers\profile\TabOrders.tsx)
- [TabMetrics.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\components\admin\customers\profile\TabMetrics.tsx)
- [CustomerAnalyticsServiceTest.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\test\java\br\com\regalaya\admin\services\CustomerAnalyticsServiceTest.java)
- [CustomerSegmentationServiceTest.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\test\java\br\com\regalaya\admin\services\CustomerSegmentationServiceTest.java)

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- 2026-04-08: documentação reconciliada com perfil de cliente real, histórico paginado, exportação CSV, segmentação e analytics parciais.

### Completion Notes List

- [x] Estado real do backend e frontend verificado
- [x] Endpoints e páginas reais mapeados
- [x] Itens concluídos marcados
- [x] Pendências de analytics/exportação registradas
- [ ] Story ainda não pode ser considerada totalmente concluída

### File List

- `regalaya-api/src/main/java/br/com/regalaya/admin/controller/CustomerProfileController.java`
- `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerProfileService.java`
- `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerAnalyticsService.java`
- `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerSegmentationService.java`
- `regalaya-api/src/test/java/br/com/regalaya/admin/services/CustomerAnalyticsServiceTest.java`
- `regalaya-api/src/test/java/br/com/regalaya/admin/services/CustomerSegmentationServiceTest.java`
- `regalaya-web/src/app/admin/customers/[id]/page.tsx`
- `regalaya-web/src/components/admin/customers/profile/CustomerSidebar.tsx`
- `regalaya-web/src/components/admin/customers/profile/TabSummary.tsx`
- `regalaya-web/src/components/admin/customers/profile/TabOrders.tsx`
- `regalaya-web/src/components/admin/customers/profile/TabMetrics.tsx`
- `regalaya-web/src/components/admin/customers/charts/LTVEvolutionChart.tsx`
- `regalaya-web/src/components/admin/customers/charts/PurchaseFrequencyChart.tsx`
- `regalaya-web/src/components/admin/customers/charts/TopCategoriesChart.tsx`
