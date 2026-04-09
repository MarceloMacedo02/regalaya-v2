# Story 8.1: Listagem de Clientes (Admin)

Status: in-progress

<!-- Nota: validação é opcional. Este arquivo foi reconciliado com o código real em 2026-04-08. -->

## Story

Como admin, quero visualizar todos os clientes, para conhecer minha base.

## Acceptance Criteria

1. [x] A tabela exibe clientes cadastrados via API real.
2. [x] Os campos exibidos incluem `id`, `name`, `email`, `phone`, `status`, `orderCount` e `totalSpent`.
3. [x] É possível filtrar por status do cliente.
4. [x] É possível filtrar por data de cadastro.
5. [x] É possível filtrar por número de pedidos.
6. [x] A tabela é responsiva e adapta colunas por breakpoint.
7. [x] Há busca por nome, email ou telefone.
8. [x] As colunas são customizáveis e persistidas localmente.
9. [x] A paginação funciona com múltiplos tamanhos de página, incluindo 50 registros.
10. [x] Os dados são carregados da API real, sem dependência de mock para esta tela.

## Tasks / Subtasks

- [x] Backend: Criar endpoint `GET /v1/admin/customers`
  - [x] Implementar paginação (`Pageable`)
  - [x] Implementar filtros por `status`, `dateFrom`, `dateTo`, `minOrders`, `maxOrders`
  - [x] Retornar `id`, `name`, `email`, `phone`, `status`, `registrationDate`, `orderCount`, `totalSpent`
  - [x] Implementar busca global (`search`)
  - [x] Expor endpoint de estatísticas em `GET /v1/admin/customers/stats`

- [x] Frontend Admin: Criar tabela de clientes
  - [x] Implementar tabela responsiva
  - [x] Implementar filtros e busca com debounce
  - [ ] Adicionar controle explícito de ordenação na UI
  - [x] Implementar paginação tradicional
  - [x] Adicionar loading state
  - [x] Adicionar skeleton loading

- [x] Frontend Admin: Implementar colunas customizáveis
  - [x] Criar modal de configuração de colunas
  - [x] Permitir mostrar/esconder colunas
  - [x] Salvar preferências do usuário no `localStorage`
  - [x] Restaurar configurações salvas

- [x] Remove Mock: Substituir dados mockados
  - [x] A página `/admin/customers` consome `customersService.getAll`
  - [x] A página `/admin/customers` consome `customersService.getStats`
  - [x] O fluxo desta tela não depende de `mock-data.ts`

- [ ] Testes: consolidar cobertura do fluxo completo
  - [x] Há testes unitários backend para `CustomerAdminServiceImpl`
  - [ ] Faltam testes de controller cobrindo filtros/paginação
  - [ ] Faltam testes frontend para busca, filtros e tabela
  - [ ] Faltam testes de regressão para preferências de colunas

## Dev Notes

- A funcionalidade está implementada no código e consumindo API real.
- O principal gap remanescente está em acabamento de ordenação no frontend e ampliação da cobertura de testes.
- O arquivo anterior citava `regalaya-admin/`, mas a implementação real está em `regalaya-web/src/app/admin/...`.

### Project Structure Notes

- Backend real:
  - `regalaya-api/src/main/java/br/com/regalaya/admin/controller/CustomerAdminController.java`
  - `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerAdminService.java`
  - `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerAdminServiceImpl.java`
  - `regalaya-api/src/main/java/br/com/regalaya/admin/repository/CustomerAdminRepository.java`
- Frontend real:
  - `regalaya-web/src/app/admin/customers/page.tsx`
  - `regalaya-web/src/components/admin/customers/CustomerTable.tsx`
  - `regalaya-web/src/components/admin/customers/CustomerFilters.tsx`
  - `regalaya-web/src/components/admin/customers/ColumnConfigModal.tsx`
  - `regalaya-web/src/hooks/useCustomerPagination.ts`

### References

- [CustomerAdminController.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\admin\controller\CustomerAdminController.java)
- [CustomerAdminServiceImpl.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\admin\services\CustomerAdminServiceImpl.java)
- [page.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\app\admin\customers\page.tsx)
- [customers.service.ts](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\services\customers.service.ts)
- [CustomerTable.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\components\admin\customers\CustomerTable.tsx)
- [CustomerFilters.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\components\admin\customers\CustomerFilters.tsx)
- [CustomerAdminServiceImplTest.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\test\java\br\com\regalaya\admin\services\CustomerAdminServiceImplTest.java)

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- 2026-04-08: documentação reconciliada com backend/frontend reais de clientes admin.

### Completion Notes List

- [x] Estado real do código verificado
- [x] Caminhos corrigidos para `regalaya-web`
- [x] Checklist ajustado para refletir implementação real
- [ ] Cobertura de testes do fluxo completo ainda incompleta

### File List

- `regalaya-api/src/main/java/br/com/regalaya/admin/controller/CustomerAdminController.java`
- `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerAdminService.java`
- `regalaya-api/src/main/java/br/com/regalaya/admin/services/CustomerAdminServiceImpl.java`
- `regalaya-api/src/main/java/br/com/regalaya/admin/repository/CustomerAdminRepository.java`
- `regalaya-api/src/test/java/br/com/regalaya/admin/services/CustomerAdminServiceImplTest.java`
- `regalaya-web/src/app/admin/customers/page.tsx`
- `regalaya-web/src/components/admin/customers/CustomerTable.tsx`
- `regalaya-web/src/components/admin/customers/CustomerFilters.tsx`
- `regalaya-web/src/components/admin/customers/ColumnConfigModal.tsx`
- `regalaya-web/src/hooks/useCustomerPagination.ts`
