# Story 11.2: Cadastro de Pessoa via WhatsApp

Status: ready-for-dev

> **Tech Stack**: Spring Boot | WhatsApp Cloud API | ContactService (Épico 03)

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como usuário WhatsApp,
Eu quero cadastrar uma pessoa pelo WhatsApp,
para que eu possa adicionar contatos e datas especiais de forma rápida e prática.

## Acceptance Criteria

1. [AC1] Implementar fluxo conversacional de 5 passos: nome → telefone → tipo data → data → confirmação
2. [AC2] Suportar encaminhamento de contato (extração automática de nome e telefone)
3. [AC3] Validar cada entrada: nome (2-100 chars), telefone (formato brasileiro), data (DD/MM)
4. [AC4] Confirmar dados antes de salvar com resumo
5. [AC5] Salvar no banco: Contact + SpecialDate (reutilizar Épico 03)

## Tasks / Subtasks

### Task 1: Backend - WhatsAppSession Entity (AC: #1)
- [ ] Criar entidade WhatsAppSession (id, phone, currentStep, stepData JSON, createdAt, expiresAt)
- [ ] Criar enum RegistrationStep (AWAITING_NAME, AWAITING_PHONE, AWAITING_DATE_TYPE, AWAITING_DATE, AWAITING_CONFIRMATION)
- [ ] Criar WhatsAppSessionRepository
- [ ] Implementar timeout de 5 minutos por step

### Task 2: Backend - RegistrationFlowService (AC: #1, AC3)
- [ ] Implementar RegistrationFlowService
- [ ] Step AWAITING_NAME: aceitar nome, validar (2-100 chars), mover para AWAITING_PHONE
- [ ] Step AWAITING_PHONE: aceitar telefone ou contato compartilhado, validar formato, mover para AWAITING_DATE_TYPE
- [ ] Step AWAITING_DATE_TYPE: aceitar opção (1-3), mover para AWAITING_DATE
- [ ] Step AWAITING_DATE: aceitar DD/MM, validar data, mover para AWAITING_CONFIRMATION
- [ ] Step AWAITING_CONFIRMATION: aceitar "sim"/"não", salvar ou reiniciar

### Task 3: Backend - ContactExtractorService (AC: #2)
- [ ] Implementar parse de contato compartilhado via WhatsApp
- [ ] Extrair: name, phones[] do payload
- [ ] Detectar tipo de mensagem: "contact" no entry
- [ ] Validar telefone extraído (formato brasileiro)

### Task 4: Backend - WhatsAppValidationService (AC: #3)
- [ ] Implementar validateName(String name): ValidationResult
- [ ] Implementar validatePhone(String phone): ValidationResult
- [ ] Implementar validateDate(String date): ValidationResult
- [ ] Retornar ValidationResult com isValid() + errorMessage

### Task 5: Backend - Interactive List para Tipos de Data (AC: #1)
- [ ] Implementar sendDateTypeSelector(to): Interactive List
- [ ] Opções: "🎂 Aniversário", "💍 Casamento", "🎄 Natal", "💒 Outro"
- [ ] Mapear selection para SpecialDateType enum

### Task 6: Backend - ConfirmationService (AC: #4, AC5)
- [ ] Implementar confirmAndSave(phone, sessionData)
- [ ] Gerar resumo: "Maria Silva\nTelefone: +5511988887777\nData: 15/03 (Aniversário)"
- [ ] Chamar ContactService.create() (Épico 03)
- [ ] Chamar SpecialDateService.create() (Épico 03)
- [ ] Enviar mensagem de sucesso

### Task 7: Backend - Cancelamento (AC: #1)
- [ ] Detectar comando "cancelar" ou "0" em qualquer step
- [ ] Limpar sessão
- [ ] Enviar mensagem "Cadastro cancelado. Digite /menu para começar novamente."

### Task 8: Backend - Error Handling (AC: #3)
- [ ] Resposta personalizada para cada tipo de erro
- [ ] Exemplo: "Nome muito curto. Por favor, digite pelo menos 2 caracteres."

### Task 9: Backend - Handler Registration (AC: #1)
- [ ] Criar RegistrationHandler implements WhatsAppHandler
- [ ] Registrar em WhatsAppHandlerRegistry (11-1)
- [ ] Handle callback ID: menu_register

### Task 10: Backend - Integração ContactService (AC: #5)
- [ ] Criar WhatsAppContactAdapter
- [ ] Mapear WhatsAppSession data → Contact DTO
- [ ] Mapear → SpecialDate DTO
- [ ] Tratar DuplicateContactException

### Task 11: Frontend - N/A (Backend only)

### Task 12: Testes
- [ ] Testar fluxo completo com mocking
- [ ] Testar extração de contato compartilhado
- [ ] Testar validações com casos de borda
- [ ] Testar timeout de 5 minutos
- [ ] Testar cancelamento
- [ ] Testar integração com ContactService

## Dev Notes

### Arquitetura e Padrões
- **Backend**: Spring Boot 3.x com Java 21
- **WhatsApp API**: WhatsApp Cloud API (Meta)
- **Session**: PostgreSQL com TTL de 5 minutos
- **Reutilização**: ContactService, SpecialDateService (Épico 03)

### Fluxo do Cadastro (5 Steps)
```
Step 1: AWAITING_NAME
Bot: "Para cadastrar uma pessoa, me informe o nome:"
Usuário: "Maria Silva"

Step 2: AWAITING_PHONE
Bot: "Perfeito! Agora me informe o telefone (com DDD)
Ou compartilhe um contato:"
Usuário: [Compartilha contato] ou "+5511988887777"

Step 3: AWAITING_DATE_TYPE
Bot: [Interactive List] "Qual tipo de data especial?"
- 🎂 Aniversário
- 💍 Casamento  
- 🎄 Natal
- 💒 Outro

Step 4: AWAITING_DATE
Bot: "Qual a data? (DD/MM)"
Usuário: "15/03"

Step 5: AWAITING_CONFIRMATION
Bot: "Confirma o cadastro de:
📱 Maria Silva
📞 +5511988887777
🎂 15/03 (Aniversário)

Responda 'sim' para confirmar ou 'não' para cancelar."
Usuário: "sim"
Bot: "✅ Maria Silva foi cadastrada com sucesso!"
```

### Estrutura de Session
```java
// Session stored in PostgreSQL
WhatsAppSession {
    String phone;          // +5511988887777
    RegistrationStep step; // AWAITING_DATE
    String stepData;       // JSON: {"name": "Maria", "phone": "...", "dateType": "BIRTHDAY", "date": "15/03"}
    Instant createdAt;
    Instant expiresAt;     // createdAt + 5 minutes
}
```

### Interactive Message Structure
```json
{
  "type": "interactive",
  "interactive": {
    "type": "list",
    "header": { "type": "text", "text": "Tipo de Data" },
    "body": { "text": "Escolha uma opção:" },
    "action": {
      "button": "Selecionar",
      "sections": [{
        "rows": [
          {"id": "BIRTHDAY", "title": "🎂 Aniversário"},
          {"id": "ANNIVERSARY", "title": "💍 Casamento"},
          {"id": "CHRISTMAS", "title": "🎄 Natal"},
          {"id": "OTHER", "title": "💒 Outro"}
        ]
      }]
    }
  }
}
```

### Project Structure Notes

#### Backend (regalaya-api)
```
src/main/java/com/regalaya/
├── handler/
│   └── RegistrationHandler.java     # Implements WhatsAppHandler
├── service/
│   ├── WhatsAppSessionManager.java
│   ├── RegistrationFlowService.java
│   ├── ContactExtractorService.java
│   ├── WhatsAppValidationService.java
│   └── ConfirmationService.java
├── entity/
│   └── WhatsAppSession.java         # Session entity
├── repository/
│   └── WhatsAppSessionRepository.java
├── dto/
│   ├── RegistrationData.java
│   └── ValidationResult.java
├── adapter/
│   └── WhatsAppContactAdapter.java  # Map to ContactService DTO
└── config/
    └── WhatsAppConfig.java           # Reutilizar de 11-1
```

### Reutilização Épico 03
- **ContactService.create(contactDTO)**: Criar contato no banco
- **SpecialDateService.create(specialDateDTO)**: Criar data especial
- **ContactEntity**: mesma estrutura
- **SpecialDateEntity**: mesma estrutura

### Referências

- [Source: CE.md#HU-11.2]
- [Source: 11-1-menu-inicial-bot.md]
- [Source: 03-1-cadastro-contato.md]
- [WhatsApp Interactive Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages/interactive)