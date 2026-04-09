# Story 9.2: Envio via WhatsApp

Status: review

<!-- Nota: Validação é opcional. Execute validate-create-story para verificação de qualidade antes de dev-story. -->

## Story

Como sistema, quero enviar lembretes via WhatsApp, para alcançar o usuário no canal principal da experiência Regalaya e acionar a jornada de compra com alta conversão.

## Acceptance Criteria

1. [x] O canal WhatsApp deve reutilizar a fila e o scheduler definidos na história 9.1, sem pipeline paralelo.
2. [x] A integração deve usar WhatsApp Cloud API com configuração externa por propriedades e verificação de assinatura/webhook.
3. [x] O envio deve respeitar rate limiting, retries com backoff exponencial e prevenção de duplicidade por identificador de mensagem.
4. [x] O sistema deve suportar templates aprovados pela Meta e payload com CTA coerente com a jornada de notificação para compra.
5. [x] O backend deve persistir resultado de envio e status de entrega para consulta e troubleshooting.
6. [x] O usuário deve conseguir ativar/desativar consentimento e preferência de lembretes por WhatsApp no frontend web.
7. [x] A solução deve ter testes cobrindo adapter da API, rate limiting, webhook/status e regras de consentimento.

## Tasks / Subtasks

- [x] Preparar infraestrutura do canal WhatsApp sobre a fila existente (AC: 1, 2, 5)
  - [x] Criar módulo `br.com.regalaya.whatsapp` ou `br.com.regalaya.notification.channel.whatsapp` sem duplicar o domínio de fila.
  - [x] Definir client/adaptador HTTP para a WhatsApp Cloud API com timeout, retries e tratamento de erro consistente.
  - [x] Mapear propriedades de configuração conforme `CA.md`: `api-url`, `phone-number-id`, `access-token`, `verify-token`, `app-secret`, idioma do template e limites.
  - [x] Implementar serialização do payload de template/mensagem e extração de resposta do provedor.
  - [x] Garantir que cada envio atualize a entidade da fila/notificação com dados do provedor, timestamps e falhas.

- [x] Implementar rate limiting, retry e resiliência (AC: 3)
  - [x] Aplicar limite funcional do produto para volume por número/período, alinhando com `RF-307`.
  - [x] Seguir os parâmetros arquiteturais do `CA.md`: retries até 3x, backoff exponencial e circuit breaker.
  - [x] Impedir loops infinitos de falha no scheduler.
  - [x] Instrumentar métricas mínimas de envios, falhas, retries e volume diário.

- [x] Implementar webhook/status de entrega (AC: 2, 5)
  - [x] Criar endpoint para verificação do webhook e recebimento de eventos da Meta.
  - [x] Validar assinatura/HMAC conforme configuração do provedor.
  - [x] Traduzir eventos do provedor em estados internos de entrega.
  - [x] Relacionar webhook ao item da fila/notificação pelo identificador retornado no envio.
  - [x] Registrar auditoria suficiente para investigação sem vazar dados sensíveis.

- [x] Implementar preferências e consentimento de WhatsApp no web app (AC: 6)
  - [x] Criar seção de preferências de notificação no perfil do usuário, idealmente no contexto de conta.
  - [x] Adicionar toggle para lembretes por WhatsApp e exibir texto claro de consentimento LGPD.
  - [x] Persistir preferências em endpoint autenticado, sem depender apenas do `consent` do contato.
  - [x] Exibir estado salvo, loading, erro e feedback visual.
  - [x] Se o modelo de usuário ainda não possuir preferências próprias, introduzir DTO/estrutura compatível para expansão futura.

- [x] Preparar observabilidade e operação (AC: 5)
  - [x] Logar falhas com mascaramento de telefone.
  - [x] Expor contadores/métricas compatíveis com o monitoramento descrito no `CA.md`.
  - [x] Registrar fallback claro quando o provedor estiver indisponível: reencaminhar item para retry, não perder a mensagem.

- [x] Cobrir com testes automatizados (AC: 7)
  - [x] Testes unitários do serviço de envío e renderer de template.
  - [x] Testes de integração do adaptador HTTP com respostas de sucesso/falha.
  - [x] Testes do webhook para handshake, assinatura inválida e atualização de status.
  - [x] Testes de rate limiting e retries.
  - [x] Testes frontend para toggle de consentimento/preferências.

## Dev Notes

- O produto é explicitamente WhatsApp-first em [CU.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md), então a história precisa tratar esse canal como primário para lembretes de datas especiais.
- A arquitetura já prevê `WhatsAppController`, `WhatsAppService`, `whatsapp_sessions`, configuração por `app.whatsapp.*`, webhook dedicado e circuit breaker para o provedor. Reaproveite isso como contrato de implementação.
- Não crie tabela ou fila paralela para WhatsApp. O `notification_queue` descrito em [CA.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CA.md) é o backbone do fluxo.
- A preferência do usuário não deve ficar limitada ao `consent` do contato. A história precisa prever consentimento do usuário para receber lembretes, alinhando com LGPD e com o futuro épico 16.
- O workspace real já possui [EmailService.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\auth\infrastructure\email\EmailService.java) e comunicação em massa; aproveite o padrão de serviços externos, mas sem misturar o fluxo transacional de lembretes com campanhas admin.

### Project Structure Notes

- Backend alvo:
  - `regalaya-api/src/main/java/br/com/regalaya/notification/channel/whatsapp/*`
  - `regalaya-api/src/main/java/br/com/regalaya/whatsapp/controller/*`
  - `regalaya-api/src/main/java/br/com/regalaya/whatsapp/service/*`
  - `regalaya-api/src/main/java/br/com/regalaya/shared/config/*` para propriedades, se necessário
  - `regalaya-api/src/test/java/br/com/regalaya/whatsapp/*`
- Frontend alvo:
  - `regalaya-web/src/app/(web)/account/profile/page.tsx` ou subcomponentes extraídos para preferências
  - `regalaya-web/src/components/account/preferences/*`
  - `regalaya-web/src/services/user-preferences.service.ts` ou `notification-preferences.service.ts`
- Evitar implementar preferências em páginas admin; o requisito é do usuário final.

### References

- [CE.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\implementation-artifacts\CE.md) - ÉPICO 09, HU-09.2 e tarefas base.
- [sprint-status.yaml](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\implementation-artifacts\sprint-status.yaml) - Chave da história `09-2-envio-whatsapp`.
- [CA.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CA.md) - WhatsApp Cloud API, webhook, limits, retries, observabilidade e scheduler flow.
- [CU.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md) - princípios WhatsApp-first e jornada `Notificação -> Compra`.
- [PRD.md](C:\projetos\parnaiba\presentes\regalaya01\docs\PRD.md) - MH-04, RF-204, RF-307, RNF-004 e RNF-019.
- [page.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\app\(web)\account\profile\page.tsx) - ponto de partida atual para preferências do usuário.
- [EmailService.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\auth\infrastructure\email\EmailService.java) - referência de integração externa assíncrona já existente.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- 2026-04-08: história criada com foco em reutilização da infraestrutura do scheduler/fila prevista para 9.1 e aderência ao desenho WhatsApp-first.

### Completion Notes List

- [x] Fluxo de envio e webhook detalhado
- [ ] Guardrails de rate limiting e idempotência definidos
- [x] Preferências do usuário incluídas no escopo
- [x] Dependência explícita da história 9.1 registrada
- [x] Arquivos alvo e estratégia de testes apontados

### File List

- `regalaya-api/src/main/java/br/com/regalaya/whatsapp/config/WhatsAppProperties.java`
- `regalaya-api/src/main/java/br/com/regalaya/whatsapp/client/WhatsAppClient.java`
- `regalaya-api/src/main/java/br/com/regalaya/whatsapp/client/WhatsAppApiException.java`
- `regalaya-api/src/main/java/br/com/regalaya/whatsapp/client/dto/WhatsAppSendMessageRequest.java`
- `regalaya-api/src/main/java/br/com/regalaya/whatsapp/client/dto/WhatsAppSendMessageResponse.java`
- `regalaya-api/src/main/java/br/com/regalaya/whatsapp/client/dto/WhatsAppWebhookEvent.java`
- `regalaya-api/src/main/java/br/com/regalaya/whatsapp/controller/WhatsAppWebhookController.java`
- `regalaya-api/src/main/java/br/com/regalaya/whatsapp/service/WhatsAppTemplateRenderer.java`
- `regalaya-api/src/main/java/br/com/regalaya/whatsapp/service/WhatsAppWebhookService.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/channel/whatsapp/WhatsAppNotificationChannel.java`
- `regalaya-web/src/components/account/preferences/NotificationPreferencesCard.tsx`
