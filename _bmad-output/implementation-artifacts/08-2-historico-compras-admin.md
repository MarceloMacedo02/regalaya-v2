# Story 8.2: Histórico de Compras (Admin)

Status: ready-for-dev

<!-- Nota: Validação é opcional. Execute validate-create-story para verificação de qualidade antes de dev-story. -->

## Story

Como admin, quero ver o histórico de compras de cada cliente, para entender o comportamento.

## Acceptance Criteria

1. [x] A página de perfil do cliente deve exibir todas as compras realizadas
2. [x] Deve mostrar detalhes de cada pedido: data, valor, status, produtos
3. [x] Deve agregar métricas como LTV (Lifetime Value) e frequência de compra
4. [x] Deve segmentar automaticamente clientes (VIP, novo, inativo)
5. [x] Os gráficos de comportamento devem mostrar padrões de compra
6. [x] As tags de segmento devem ser visualmente distintas
7. [x] Deve haver opção de exportar histórico para CSV/Excel
8. [x] A página deve ser responsiva e funcionar em diferentes dispositivos
9. [x] Deve haver carregamento progressivo para históricos longos
10. [x] Os dados devem ser atualizados em tempo real

## Tasks / Subtasks

- [ ] Backend: Criar endpoint GET /admin/customers/{id}/orders
  - [ ] Implementar paginação para histórico de pedidos
  - [ ] Retornar todos os campos de pedidos: id, order_date, total, status, items
  - [ ] Calcular métricas agregadas: LTV, frequência, última compra
  - [ ] Implementar lógica de segmentação automática
  - [ ] Criar endpoint para exportação de dados (CSV/Excel)
  - [ ] Adicionar filtros por período de compra
- [ ] Backend: Implementar lógica de segmentação
  - [ ] Definir regras para VIP (LTV > R$1000), Novo (< 3 meses), Inativo (> 6 meses)
  - [ ] Calcular frequência média de compras
  - [ ] Identificar padrões de sazonalidade
  - [ ] Armazenar segmentação no perfil do cliente
- [ ] Frontend Admin: Criar página de perfil do cliente
  - [ ] Implementar layout com sidebar de navegação
  - [ ] Adicionar seção de resumo do cliente (foto, nome, email, segmento)
  - [ ] Criar aba para histórico de pedidos
  - [ ] Implementar cards com métricas principais
  - [ ] Adicionar gráficos de comportamento (Recharts ou similar)
  - [ ] Implementar tags visuais para segmentos
- [ ] Frontend Admin: Implementar gráficos de comportamento
  - [ ] Gráfico de evolução de LTV ao longo do tempo
  - [ ] Gráfico de frequência de compras por mês
  - [ ] Gráfico de distribuição de valor médio por pedido
  - [ ] Gráfico de produtos mais comprados pelo cliente
  - [ ] Todos os gráficos devem ser interativos e exportáveis
- [ ] Frontend Admin: Implementar tags de segmento
  - [ ] Criar sistema de tags coloridas (VIP: ouro, Novo: verde, Inativo: cinza)
  - [ ] Adicionar tooltips com detalhes do segmento
  - [ ] Permitir clicar na tag para filtrar clientes com mesmo perfil
  - [ ] Implementar animação suave ao mudar de segmento

## Dev Notes

- Relevância: Esta funcionalidade permite à equipe de análise entender o comportamento de compra dos clientes e identificar padrões valiosos
- Prioridade: Média-Alta, complementa a listagem básica de clientes
- Integração: Deve integrar com o módulo de pedidos existente e sistema de métricas
- Performance: O carregamento de histórico completo deve ser otimizado com paginação e lazy loading

### Project Structure Notes

- Utilizar mesma estrutura de página de perfil já existente no admin
- Seguir padrões de gráficos e visualização de dados já implementados
- Manter consistência com o design system e cores de segmentação
- Reutilizar componentes de tabela e exportação existentes

### References

- [Source: _bmad-output/implementation-artifacts/CE.md#ÉPICO-08-Gestão-de-Clientes-Admin] - Requisitos de histórico de compras
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml#epic-8] - Status do épico e integração com outras histórias
- [Source: _bmad/bmm/config.yaml] - Configuração do projeto e idioma

## Dev Agent Record

### Agent Model Used

Modelo de desenvolvimento BMad para criação de histórias completas

### Debug Log References

### Completion Notes List

- [ ] Requisitos de negócio traduzidos para critérios de aceitação
- [ ] Contexto técnico completo fornecido ao desenvolvedor
- [ ] Arquitetura e padrões de código documentados
- [ ] Estrutura de arquivos e componentes definida
- [ ] Requisitos de teste especificados
- [ ] Integração com sistemas existente documentada

### File List

- Backend: `/regalaya-api/src/main/java/com/regalaya/controller/admin/CustomerProfileController.java`
- Backend: `/regalaya-api/src/main/java/com/regalaya/service/admin/CustomerAnalyticsService.java`
- Backend: `/regalaya-api/src/main/java/com/regalaya/repository/OrderRepository.java`
- Frontend: `/regalaya-admin/src/components/admin/customers/CustomerProfilePage.tsx`
- Frontend: `/regalaya-admin/src/components/admin/customers/CustomerCharts.tsx`
- Frontend: `/regalaya-admin/src/components/admin/customers/CustomerSegmentTags.tsx`
- Frontend: `/regalaya-admin/src/components/admin/customers/CustomerOrderHistory.tsx`
- Testes: `/regalaya-api/src/test/java/com/regalaya/controller/admin/CustomerProfileControllerTest.java`
- Testes: `/regalaya-admin/src/test/admin/CustomerProfilePage.test.tsx`