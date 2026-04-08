# Story 8.1: Listagem de Clientes (Admin)

Status: ready-for-dev

<!-- Nota: Validação é opcional. Execute validate-create-story para verificação de qualidade antes de dev-story. -->

## Story

Como admin, quero visualizar todos os clientes, para conhecer minha base.

## Acceptance Criteria

1. [x] A tabela deve exibir todos os clientes cadastrados no sistema
2. [x] Os campos exibidos devem incluir: id, name, email, phone, total_orders, total_spent
3. [x] Deve ser possível filtrar por status do cliente
4. [x] Deve ser possível filtrar por data de cadastro
5. [x] Deve ser possível filtrar por número de pedidos
6. [x] A tabela deve ser responsiva e funcionar em diferentes tamanhos de tela
7. [x] Deve houver busca por nome, email ou telefone
8. [x] As colunas devem ser customizáveis (mostrar/esconder)
9. [x] A paginação deve funcionar corretamente com pelo menos 50 registros por página
10. [x] Os dados devem ser carregados em tempo real da API real (não mock)

## Tasks / Subtasks

- [ ] Backend: Criar endpoint GET /admin/customers
  - [ ] Implementar paginação (page, size)
  - [ ] Implementar filtros: status, registration_date, orders_count
  - [ ] Retornar campos: id, name, email, phone, total_orders, total_spent, created_at
  - [ ] Implementar busca global (search parameter)
  - [ ] Adicionar ordenação (por nome, data de cadastro, total gasto)
- [ ] Frontend Admin: Criar tabela de clientes
  - [ ] Implementar tabela responsiva com Tailwind CSS
  - [ ] Adicionar filtros laterais (sidebar)
  - [ ] Implementar campo de busca global
  - [ ] Adicionar dropdown de ordenação
  - [ ] Implementar paginação infinita ou tradicional
  - [ ] Adicionar loading states durante carregamento
  - [ ] Implementar skeleton loading
- [ ] Frontend Admin: Implementar colunas customizáveis
  - [ ] Criar modal de configuração de colunas
  - [ ] Permitir mostrar/esconder colunas via checkboxes
  - [ ] Salvar preferências do usuário no localStorage
  - [ ] Restaurar configurações salvas
- [ ] Remove Mock: Substituir dados mockados
  - [ ] Remover todos os dados mock de clientes
  - [ ] Garantir que todos os dados venham da API real
  - [ Atualizar componentes existentes para usar dados reais
- [ ] Testes: Implementar testes de busca e filtros
  - [ ] Testar busca por nome, email, telefone
  - [ ] Testar filtros por status, data, pedidos
  - [ ] Testar paginação com diferentes quantidades
  - [ ] Testar ordenação por diferentes campos
  - [ ] Testar responsividade em mobile/tablet

## Dev Notes

- Relevância: Esta é uma funcionalidade crítica do backoffice administrativo que permite à equipe de gestão conhecer a base de clientes
- Prioridade: Alta, pois é a primeira funcionalidade do módulo de gestão de clientes
- Integração: Deve integrar com o módulo de autenticação para garantir que apenas admin acesse
- Performance: A listagem deve ser rápida mesmo com milhares de clientes

### Project Structure Notes

- Alinhamento com estrutura de projeto existente (admin pages em regalaya-admin/)
- Seguir padrões de tabelas e filtros já implementados no admin
- Usar componentes reutilizáveis de tabela e formulários
- Manter consistência com o design system da aplicação

### References

- [Source: _bmad-output/implementation-artifacts/CE.md#ÉPICO-08-Gestão-de-Clientes-Admin] - Requisitos completos da funcionalidade
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml#epic-8] - Status do épico e histórias relacionadas
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

- Backend: `/regalaya-api/src/main/java/com/regalaya/controller/admin/CustomerAdminController.java`
- Backend: `/regalaya-api/src/main/java/com/regalaya/service/admin/CustomerAdminService.java`
- Backend: `/regalaya-api/src/main/java/com/regalaya/repository/CustomerRepository.java`
- Frontend: `/regalaya-admin/src/components/admin/customers/CustomerTable.tsx`
- Frontend: `/regalaya-admin/src/components/admin/customers/CustomerFilters.tsx`
- Frontend: `/regalaya-admin/src/pages/admin/customers/CustomerListPage.tsx`
- Testes: `/regalaya-api/src/test/java/com/regalaya/controller/admin/CustomerAdminControllerTest.java`
- Testes: `/regalaya-admin/src/test/admin/CustomerListPage.test.tsx`