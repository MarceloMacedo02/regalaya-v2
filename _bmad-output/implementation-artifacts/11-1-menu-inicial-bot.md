# Story 11.1: Menu Inicial do Bot

Status: ready-for-dev

> **Tech Stack**: Spring Boot | WhatsApp Cloud API (Meta) | H2/PostgreSQL

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como usuário WhatsApp,
Eu quero receber menu interativo ao iniciar a conversa,
para que eu possa saber todas as opções disponíveis no bot.

## Acceptance Criteria

1. [AC1] Implementar webhook WhatsApp Cloud API com endpoint próprio
2. [AC2] Criar endpoint POST /webhooks/whatsapp para receber eventos
3. [AC3] Verificar assinatura HMAC do webhook para segurança
4. [AC4] Interpretar mensagens (/start, menu, oi, olá)
5. [AC5] Responder com Interactive buttons message
6. [AC6] 4 Opções: Cadastrar pessoa, Ver datas, Presentes, Ajuda

## Tasks / Subtasks

### Task 1: Backend - Dependências e Configuração (AC: #1)
- [ ] Adicionar dependência spring-boot-starter-webflux (para async HTTP)
- [ ] Adicionar dependência Jackson para parse de JSON
- [ ] Criar WhatsAppConfigProperties com @ConfigurationProperties
- [ ] Configurar: phone-number-id, access-token, webhook-secret, business-account-id

### Task 2: Backend - WhatsAppWebhookController (AC: #1, #2)
- [ ] Criar WhatsAppWebhookController
- [ ] Implementar GET /webhooks/whatsapp para verificação (hub.verify)
- [ ] Implementar POST /webhooks/whatsapp para receber eventos
- [ ] Implementar parser de WebhookEntry (messages, changes)
- [ ] Validar payload com @Valid

### Task 3: Backend - HMAC Signature Validator (AC: #3)
- [ ] Criar WhatsAppSignatureValidator
- [ ] Implementar validateSignature(payload, signature, secret)
- [ ] Usar HMAC-SHA256
- [ ] Criar exceção WebhookSignatureInvalidException
- [ ] Log de tentativas inválidas para segurança

### Task 4: Backend - WhatsAppMessageInterpreter (AC: #4)
- [ ] Criar enum WhatsAppMessageType (TEXT, INTERACTIVE, IMAGE, REFERRAL)
- [ ] Implementar WhatsAppMessageInterpreter
- [ ] Detectar comandos: /start, /menu, /ajuda, /help
- [ ] Detectar keywords: "oi", "olá", "ola", "menu", "começar"
- [ ] Implementar parse de Interactive Reply (botão clicado)

### Task 5: Backend - WhatsAppApiService (AC: #5)
- [ ] Criar WhatsAppApiService
- [ ] Implementar sendMessage(to, message) com HttpClient
- [ ] Implementar sendInteractiveButtons(to, buttons)
- [ ] Implementar sendTextMessage(to, text)
- [ ] Configurar retry com exponential backoff (3 tentativas)

### Task 6: Backend - InteractiveButtonService (AC: #5, AC6)
- [ ] Implementar InteractiveButtonService
- [ ] Criar menu principal com 4 botões
- [ ] Estrutura Interactive Buttons Message:
  ```json
  {
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": { "text": "Olá! Como posso ajudar?" },
      "action": {
        "buttons": [
          {"type": "reply", "reply": {"id": "menu_register", "title": "Cadastrar pessoa"}},
          {"type": "reply", "reply": {"id": "menu_dates", "title": "Ver datas"}},
          {"type": "reply", "reply": {"id": "menu_gifts", "title": "Presentes"}},
          {"type": "reply", "reply": {"id": "menu_help", "title": "Ajuda"}}
        ]
      }
    }
  }
  ```
- [ ] Mapear callback IDs para handlers

### Task 7: Backend - Callback Handlers (AC: #6)
- [ ] Criar WhatsAppHandlerRegistry
- [ ] Registrar handlers: menu_register → RegistrationHandler, etc.
- [ ] Implementar interface WhatsAppHandler com handle(callbackId, from)
- [ ] Criar LoggingHandler para debug

### Task 8: Backend - Session State (AC: #4)
- [ ] Criar WhatsAppSession entity (phone, state, metadata, updated_at)
- [ ] Criar WhatsAppSessionRepository
- [ ] Implementar conversation state machine: IDLE → AWAITING_INPUT → FLOW_COMPLETE
- [ ] Timeout de 10 minutos para sessão

### Task 9: Configuração application.yml
```yaml
whatsapp:
  cloud-api:
    phone-number-id: ${WHATSAPP_PHONE_ID}
    access-token: ${WHATSAPP_ACCESS_TOKEN}
    business-account-id: ${WHATSAPP_BUSINESS_ACCOUNT_ID}
  webhook:
    secret: ${WHATSAPP_WEBHOOK_SECRET}
    verify-token: ${WHATSAPP_VERIFY_TOKEN}
  api:
    base-url: https://graph.facebook.com/v18.0
    timeout-seconds: 30
    max-retries: 3
```

### Task 10: Variáveis de Ambiente (.env.example)
```
WHATSAPP_PHONE_ID=1234567890
WHATSAPP_ACCESS_TOKEN=EA...
WHATSAPP_BUSINESS_ACCOUNT_ID=123...
WHATSAPP_WEBHOOK_SECRET=mysecret
WHATSAPP_VERIFY_TOKEN=myverifytoken
```

### Task 11: Meta Developer Portal Setup
- [ ] Criar app no Meta Developer Portal
- [ ] Configurar Webhook com URL HTTPS
- [ ] Selecionar events: messages, messaging_status
- [ ] Obter credentials

### Task 12: Testes
- [ ] Testar verificação de webhook (GET)
- [ ] Testar HMAC com payload real
- [ ] Testar interpretação de comandos
- [ ] Testar envio de interactive buttons
- [ ] Testar retry em falha de API
- [ ] Teste de integração com TestContainers

## Dev Notes

### Arquitetura e Padrões
- **Backend**: Spring Boot 3.x com Java 21
- **WhatsApp API**: WhatsApp Cloud API (Meta)
- **HTTP Client**: Java HttpClient (Java 11+) ou WebClient
- **Database**: PostgreSQL para sessão (reutilizar existente)

### Fluxo do Menu
```
Usuário: "Olá" ou "/start" ou clica no menu
    ↓
WhatsAppWebhookController recebe POST
    ↓
WhatsAppSignatureValidator valida HMAC
    ↓
WhatsAppMessageInterpreter identifica comando
    ↓
InteractiveButtonService.sendInteractiveButtons()
    ↓
Usuário vê 4 botões e clica em um
    ↓
Callback ID mapeado para handler específico
```

### Endpoint Reference
- **Verification (GET)**: `GET /webhooks/whatsapp?hub.mode=subscribe&hub.challenge=XXX&hub.verify_token=YYY`
- **Messages (POST)**: `POST /webhooks/whatsapp`
- **Send Message**: `POST /graph.facebook.com/v18.0/{phone_number_id}/messages`

### Referências da API
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Interactive Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages/interactive)
- [Webhook Security](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/security)

### Project Structure Notes

#### Backend (regalaya-api)
```
src/main/java/com/regalaya/
├── config/
│   └── WhatsAppConfigProperties.java
├── controller/
│   └── WhatsAppWebhookController.java
├── service/
│   ├── WhatsAppMessageInterpreter.java
│   ├── WhatsAppApiService.java
│   ├── InteractiveButtonService.java
│   └── WhatsAppHandlerRegistry.java
├── handler/
│   ├── RegistrationHandler.java
│   ├── ViewDatesHandler.java
│   ├── GiftsHandler.java
│   └── HelpHandler.java
├── dto/
│   ├── WhatsAppWebhookRequest.java
│   ├── WhatsAppMessage.java
│   ├── InteractiveButtonMessage.java
│   └── CallbackPayload.java
├── security/
│   └── WhatsAppSignatureValidator.java
├── exception/
│   └── WebhookSignatureInvalidException.java
├── entity/
│   └── WhatsAppSession.java
└── repository/
    └── WhatsAppSessionRepository.java
```

### Session State Machine
```
IDLE → (usuário envia msg) → AWAITING_INPUT → (completa fluxo) → IDLE
       ↓ (10 min timeout)
       IDLE
```

### Reutilização
- **ContactService**: Para quando usuário seleciona "Cadastrar pessoa"
- **SpecialDateService**: Para "Ver datas"
- **ProductService**: Para "Presentes" (10-1)

### Referências

- [Source: CE.md#HU-11.1]
- [Source: 10-1-recomendacao-perfil.md] (integração com recomendações)
- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)