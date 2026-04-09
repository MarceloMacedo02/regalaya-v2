# Story 11.4: Agendamento de Mensagem WhatsApp

Status: ready-for-dev

> **Tech Stack**: Spring Boot @Scheduled | WhatsApp Cloud API | PostgreSQL

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como usuário WhatsApp,
Eu quero agendar o envio da mensagem de presente,
para que eu possa surpreender a pessoa na data certa.

## Acceptance Criteria

1. [AC1] Implementar fluxo de 3 passos: selecionar data → selecionar hora → confirmar
2. [AC2] Validar que data é futura (mínimo 1 hora, máximo 1 ano)
3. [AC3] Criar scheduled_message no banco com status PENDING
4. [AC4] Implementar @Scheduled job para verificar a cada 1 minuto
5. [AC5] Enviar mensagem via WhatsApp API na data/hora programada
6. [AC6] Implementar retry (3 tentativas) em caso de falha

## Tasks / Subtasks

### Task 1: Backend - ScheduledMessage Entity (AC: #3)
- [ ] Criar entidade ScheduledMessage
- [ ] Campos: id, userPhone, recipientName, productId, messageText, scheduledAt, status, createdAt, sentAt, failureReason
- [ ] Enum Status: PENDING, SENDING, SENT, FAILED, CANCELLED
- [ ] Criar ScheduledMessageRepository

### Task 2: Backend - SchedulingFlowService (AC: #1)
- [ ] Implementar SchedulingFlowService
- [ ] Step 1: Interactive List com próximas 7 datas disponíveis
- [ ] Step 2: Interactive List com horários (8:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00)
- [ ] Step 3: Confirmation com resumo + "sim"/"não"

### Task 3: Backend - ScheduleValidator (AC: #2)
- [ ] Implementar validateSchedule(scheduledAt): ValidationResult
- [ ] Validar mínimo: scheduledAt > now + 1 hora
- [ ] Validar máximo: scheduledAt < now + 1 ano
- [ ] Validar horário comercial: 8h-22h
- [ ] Validar data não passada

### Task 4: Backend - ScheduledMessageScheduler (AC: #4)
- [ ] Implementar ScheduledMessageScheduler com @Scheduled(fixedRate = 60000)
- [ ] Query: SELECT * FROM scheduled_message WHERE status = 'PENDING' AND scheduledAt <= now
- [ ] Para cada mensagem:
  - Update status → SENDING
  - Chamar WhatsAppApiService.sendMessage()
  - Se sucesso → update status → SENT, sentAt = now
  - Se falha → retry logic

### Task 5: Backend - Retry Logic (AC: #6)
- [ ] Implementar retry com exponential backoff
- [ ] Tentativas: 1 (immediate), 2 (5 min), 3 (15 min)
- [ ] Após 3 falhas → update status → FAILED
- [ ] Enviar notificação ao usuário: "Não foi possível enviar sua mensagem agendada"

### Task 6: Backend - Generate Scheduled Message (AC: #3)
- [ ] Implementar ScheduledMessageGenerator
- [ ] Gerar mensagem automática: "Olá! Aqui é da Regalaya! 🎁\n\n{recipientName}, HOJE é o aniversário da {pessoa}!\n\n{productName} - {productPrice}\n\n{ mensagem personalizada se houver }\n\nParabéns! 🎉"
- [ ] Permite usuário adicionar texto customizado

### Task 7: Backend - Cancellation (AC: #1)
- [ ] Detectar comando "/cancelar" ou callback
- [ ] Verificar se scheduledAt > now + 30 min
- [ ] Update status → CANCELLED
- [ ] Enviar confirmação "Agendamento cancelado"

### Task 8: Backend - List Scheduled Messages (AC: #1)
- [ ] Implementar endpoint GET /whatsapp/scheduled (para o usuário)
- [ ] Listar mensagens pendentes com data/hora
- [ ] Oferecer opção de cancelar cada uma

### Task 9: Backend - ScheduledMessageHandler (AC: #1)
- [ ] Criar ScheduledMessageHandler implements WhatsAppHandler
- [ ] Handle callback ID: menu_schedule ou comando "/agendar"
- [ ] Registrar em WhatsAppHandlerRegistry

### Task 10: Backend - Scheduled Job Config
```java
@Scheduled(fixedRate = 60000)  // A cada minuto
@SchedulerLock(name = "scheduledMessageProcessor", lockAtLeastFor = 10000)
public void processScheduledMessages() { ... }
```

### Task 11: Frontend - N/A (Backend only)

### Task 12: Testes
- [ ] Testar agendamento com data válida
- [ ] Testar validação de data passada (< 1 hora)
- [ ] Testar validação de data muito futura (> 1 ano)
- [ ] Testar envio no horário correto
- [ ] Testar retry em caso de falha
- [ ] Testar cancelamento
- [ ] Testar concorrência (múltiplas mensagens no mesmo minuto)

## Dev Notes

### Arquitetura e Padrões
- **Backend**: Spring Boot 3.x com Java 21
- **Scheduling**: @Scheduled + @SchedulerLock (ShedLock)
- **WhatsApp API**: WhatsApp Cloud API (Meta)
- **Database**: PostgreSQL para persistência

### Fluxo de Agendamento (3 Steps)
```
Step 1: Selecionar Data
Bot: [Interactive List] "Para quando você quer enviar?"
- 📅 Hoje + 1 dia
- 📅 Hoje + 2 dias
- ...
- 📅 Hoje + 7 dias
Usuário: [Seleciona data]

Step 2: Selecionar Horário
Bot: [Interactive List] "Qual horário?"
- ⏰ 08:00
- ⏰ 10:00
- ⏰ 12:00
- ⏰ 14:00
- ⏰ 16:00
- ⏰ 18:00
- ⏰ 20:00
Usuário: [Seleciona horário]

Step 3: Confirmação
Bot: "Agendar mensagem para {produto}
📅 {data} às {horário}

Responda 'sim' para confirmar ou 'não' para cancelar."
Usuário: "sim"
Bot: "✅ Mensagem agendada para {data} às {horário}!"

[No horário programado]
Bot: "Olá! Aqui é da Regalaya! 🎁
João, HOJE é o aniversário da Maria!
Compartilhe esta mensagem especial:
{Kit Aromatizador - R$89,90}
Parabéns! 🎉"
```

### ScheduledMessage Entity
```java
@Entity
public class ScheduledMessage {
    @Id @GeneratedValue
    private Long id;
    
    private String userPhone;
    private String recipientName;
    private UUID productId;
    private String customMessage;  // Opcional
    
    private LocalDateTime scheduledAt;
    
    @Enumerated(EnumType.STRING)
    private Status status;  // PENDING, SENDING, SENT, FAILED, CANCELLED
    
    private LocalDateTime sentAt;
    private String failureReason;
    private int retryCount;
    
    private LocalDateTime createdAt;
}
```

### Scheduler Implementation
```java
@Component
public class ScheduledMessageScheduler {
    
    @Scheduled(fixedRate = 60000)  // A cada minuto
    @SchedulerLock(name = "scheduledMessageProcessor", 
                   lockAtLeastFor = 10000,
                   lockAtMostFor = 55000)
    public void processScheduledMessages() {
        List<ScheduledMessage> pending = repository
            .findByStatusAndScheduledAtLessThanEqual(PENDING, now());
        
        for (message : pending) {
            processMessage(message);
        }
    }
}
```

### Retry Logic
| Tentativa | Delay | Total |
|-----------|-------|-------|
| 1 | Imediato | 0 min |
| 2 | 5 min | 5 min |
| 3 | 15 min | 20 min |

### Project Structure Notes

#### Backend (regalaya-api)
```
src/main/java/com/regalaya/
├── scheduler/
│   └── ScheduledMessageScheduler.java
├── service/
│   ├── SchedulingFlowService.java
│   ├── ScheduleValidator.java
│   ├── ScheduledMessageGenerator.java
│   └── CancellationService.java
├── entity/
│   └── ScheduledMessage.java
├── repository/
│   └── ScheduledMessageRepository.java
├── handler/
│   └── ScheduledMessageHandler.java   # Implements WhatsAppHandler
└── config/
    └── SchedulingConfig.java
```

### Reutilização
- **WhatsAppApiService** (11-1): Enviar mensagens
- **ProductService** (04): Buscar produto para gerar mensagem
- **11-3**: Receber produto selecionado para agendar

### Referências

- [Source: CE.md#HU-11.4]
- [Source: 11-3-sugestoes-whatsapp.md]
- [Source: 11-1-menu-inicial-bot.md]
- [ShedLock](https://github.com/lukas-krecan/shedlock) - para evitar execução dupla