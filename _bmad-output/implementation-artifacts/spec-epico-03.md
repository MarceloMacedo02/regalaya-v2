---
title: 'EPICO 03 - Gestão de Pessoas Queridas (Contatos)'
type: 'feature'
created: '2026-04-07'
status: 'done'
context:
  - docs/PRD.md
  - docs/EPICS.md
  - _bmad-output/bmm/3-solutioning/01-CA-ARQUITETURA-TECNICA.md
baseline_commit: HEAD
---

## Intent

**Problem:** Usuários precisam cadastrar pessoas queridas (contatos) com datas especiais para receber lembretes e sugestões de presentes.

**Approach:** CRUD completo de contatos com datas especiais, busca/filtragem e importação em lote.

## Boundaries & Constraints

**Always:**
- Seguir padrões existentes do projeto (package structure, naming conventions)
- Usar UserDetailsImpl para ownership validation
- Soft delete via cascade (JPA orphanRemoval)
- Consentimento LGPD obrigatório
- Frontend reutilizar componentes UI existentes (Dialog, Card, Button, etc.)

**Ask First:**
- Formato de importação (vCard vs CSV vs JSON)
- Limite de contatos por importação

**Never:**
- Não expor contatos de outros usuários (ownership validation)
- Não incluir credenciais ou dados sensíveis nos logs
- Não usar mock data - sempre usar API real

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| CREATE_CONTACT | name, phone, consent=true | Contact created, 201 | 400 se name vazio ou consent=false |
| UPDATE_CONTACT | id, new name | Contact updated, 200 | 404 se não existe ou não pertence ao user |
| DELETE_CONTACT | id | Contact + specialDates deleted, 204 | 404 se não existe |
| FIND_ALL | authenticated user | List<ContactResponse> ordered by createdAt desc | Empty list se nenhum contato |
| FIND_BY_ID | id | ContactDetailResponse com specialDates | 404 se não existe |
| ADD_SPECIAL_DATE | contactId, type, date, recurrence | SpecialDate created, 201 | 404 se contact não existe |
| UPDATE_SPECIAL_DATE | contactId, dateId, new data | SpecialDate updated, 200 | 404 se não existe |
| DELETE_SPECIAL_DATE | contactId, dateId | SpecialDate deleted, 204 | 404 se não existe |
| IMPORT_CONTACTS | CSV/JSON array (max 100) | ImportReport (success, errors) | 400 se formato inválido ou > 100 |
| SEARCH_CONTACTS | query string | Filtered contacts by name/phone | Empty list se nenhum match |

## Code Map

### Backend (já existente)
- `regalaya-api/src/main/java/br/com/regalaya/contact/domain/model/Contact.java` -- Entity ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/domain/model/SpecialDate.java` -- Entity ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/controller/ContactController.java` -- REST Controller ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/services/service/ContactService.java` -- Interface ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/services/impl/ContactServiceImpl.java` -- Implementation ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/mapper/ContactMapper.java` -- Manual Mapper ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/repository/ContactRepository.java` -- JPA Repository ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/repository/SpecialDateRepository.java` -- JPA Repository ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/dto/requests/` -- All request DTOs ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/dto/responses/` -- All response DTOs ✅
- `regalaya-api/src/main/java/br/com/regalaya/contact/exception/` -- Custom exceptions ✅

### Frontend (já existente)
- `regalaya-web/src/services/contact.service.ts` -- API client ✅
- `regalaya-web/src/app/(web)/account/contacts/page.tsx` -- Página completa ✅
- `regalaya-web/src/types/user.ts` -- TypeScript types ✅

### Backend (NOVO - a implementar)
- `regalaya-api/src/main/java/br/com/regalaya/contact/dto/requests/ImportContactsRequest.java` -- DTO importação
- `regalaya-api/src/main/java/br/com/regalaya/contact/dto/responses/ImportReportResponse.java` -- Report de importação
- `regalaya-api/src/main/java/br/com/regalaya/contact/services/ContactImportService.java` -- Serviço de importação
- `regalaya-api/src/main/java/br/com/regalaya/contact/controller/ContactController.java` -- Adicionar endpoint POST /import

### Frontend (NOVO - a implementar)
- `regalaya-web/src/app/(web)/account/contacts/page.tsx` -- Adicionar busca + importação
- `regalaya-web/src/services/contact.service.ts` -- Adicionar método importContacts

## Tasks & Acceptance

### HU-03.1: Cadastro de Contato ✅ (já implementado)
- [x] POST /contacts -- Backend ✅
- [x] GET /contacts -- Backend ✅
- [x] GET /contacts/{id} -- Backend ✅
- [x] Validação de consentimento LGPD -- Backend ✅
- [x] Página /account/contacts -- Frontend ✅
- [x] Modal de cadastro -- Frontend ✅
- [ ] Busca/filtragem por nome -- Frontend (NOVO)
- [ ] Endpoint GET /contacts?search= -- Backend (NOVO)

### HU-03.2: Edição e Exclusão de Contato ✅ (já implementado)
- [x] PUT /contacts/{id} -- Backend ✅
- [x] DELETE /contacts/{id} -- Backend ✅
- [x] Validação de ownership -- Backend ✅
- [x] Cascade em special_dates -- Backend ✅
- [x] Modal de edição -- Frontend ✅
- [x] Confirmação de exclusão -- Frontend ✅

### HU-03.3: Cadastro de Datas Especiais ✅ (parcialmente implementado)
- [x] POST /contacts/{id}/special-dates -- Backend ✅
- [x] GET /contacts/{id}/special-dates (via detail) -- Backend ✅
- [x] PUT /contacts/{id}/special-dates/{dateId} -- Backend ✅
- [x] DELETE /contacts/{id}/special-dates/{dateId} -- Backend ✅
- [x] Tipos: BIRTHDAY, ANNIVERSARY, CHRISTMAS, WEDDING, CUSTOM -- Backend ✅
- [x] Recorrência: YEARLY, MONTHLY, ONCE -- Backend ✅
- [x] UI para adicionar data -- Frontend ✅
- [x] Countdown para próximas datas -- Frontend ✅
- [ ] UI para editar data especial -- Frontend (NOVO)

### HU-03.4: Importação de Contatos (NOVO)
- [ ] POST /contacts/import -- Backend (NOVO)
- [ ] Validação de formato (CSV/JSON) -- Backend (NOVO)
- [ ] Limite de 100 contatos -- Backend (NOVO)
- [ ] Report de sucesso/erro -- Backend (NOVO)
- [ ] Upload de arquivo -- Frontend (NOVO)
- [ ] Preview antes de confirmar -- Frontend (NOVO)
- [ ] Exibir progresso -- Frontend (NOVO)

## Verification

```bash
# Backend tests
cd regalaya-api && mvn test -Dtest=ContactServiceImplTest

# Frontend
cd regalaya-web && npm run build

# E2E
cd regalaya-web && npx playwright test
```

## Design Notes

### Gap Analysis

O módulo contact já está **~80% implementado**. O que falta:

1. **Busca de contatos** - Adicionar query param `?search=` no GET /contacts
2. **Edição de data especial no frontend** - O backend já suporta PUT, mas o frontend só tem add/delete
3. **Importação em lote** - Novo endpoint + UI de upload

### Import Strategy
- Usar CSV como formato principal (mais universal que vCard)
- Colunas esperadas: name, phone, whatsappId
- Máximo 100 contatos por importação
- Retornar relatório detalhado: { total, success, errors: [{row, reason}] }
