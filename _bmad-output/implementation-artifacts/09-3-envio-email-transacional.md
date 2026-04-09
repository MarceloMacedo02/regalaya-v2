# Story 9.3: Envio de Email Transacional

Status: review

<!-- Nota: Validação é opcional. Execute validate-create-story para verificação de qualidade antes de dev-story. -->

## Story

Como sistema, quero enviar emails transacionais, para comunicar lembretes e eventos importantes por um canal complementar, rastreável e compatível com preferências do usuário.

## Acceptance Criteria

1. [x] O envio de email deve reutilizar a infraestrutura de fila/scheduler da história 9.1, sem criar fluxo concorrente isolado.
2. [x] O backend deve integrar um serviço de email transacional compatível com o stack atual, preservando fallback de desenvolvimento com Mailpit.
3. [x] Devem existir templates versionáveis para ao menos lembrete de data especial, confirmação e status, com variáveis dinâmicas seguras.
4. [x] O processamento deve ser assíncrono, com retry controlado e persistência do resultado do envio.
5. [x] O usuário deve poder gerenciar preferências de email e ter opção clara de unsubscribe para comunicações elegíveis.
6. [x] Logs e métricas devem respeitar mascaramento de dados sensíveis e permitir diagnóstico operacional.
7. [x] Devem existir testes cobrindo renderização dos templates, envio assíncrono, retry e preferências do usuário.

## Tasks / Subtasks

- [x] Evoluir o serviço de email existente para uso transacional no épico 9 (AC: 1, 2, 3, 4)
  - [x] Revisar [EmailService.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\auth\infrastructure\email\EmailService.java) e decidir se ele será expandido ou extraído para um módulo compartilhado de notificações.
  - [x] Separar claramente emails de autenticação dos emails transacionais de lembrete/status para evitar acoplamento indevido.
  - [x] Introduzir contrato de template e método genérico de envio que receba tipo, locale, dados e metadados.
  - [x] Garantir compatibilidade com dev local (Mailpit) e preparo para SES/SendGrid em ambientes superiores.

- [x] Conectar o canal email à fila de notificações (AC: 1, 4)
  - [x] Implementar estratégia/canal `EMAIL` no dispatcher da fila criada em 9.1.
  - [x] Definir critérios de despacho para email com base em preferência do usuário e existência de endereço válido.
  - [x] Persistir status do envio, tentativas, timestamps e mensagem de erro.
  - [x] Evitar duplicidade em cenários de retry/reprocessamento.

- [x] Criar templates transacionais e renderer seguro (AC: 3)
  - [x] Modelar templates para lembrete de data especial, confirmação e mudança de status alinhados ao PRD/EPICS.
  - [x] Usar placeholders explícitos e sanear conteúdo dinâmico para evitar HTML quebrado ou injection.
  - [x] Considerar locale padrão `pt` com fallback.
  - [x] Manter consistência visual com os emails já existentes de autenticação.
  - [x] Prever CTA para ver sugestões/comprar, quando aplicável.

- [x] Implementar fila assíncrona e retry (AC: 4, 6)
  - [x] Reusar o scheduler de despacho da 9.1; não criar thread manual fora do padrão do projeto.
  - [x] Aplicar retry controlado com backoff e corte após limite.
  - [x] Registrar causa de falha distinguindo erro transitório de erro permanente.
  - [x] Expor métricas mínimas de sucesso, falha e latência de envio.

- [x] Implementar preferências de email e unsubscribe (AC: 5)
  - [x] Criar ou evoluir endpoint autenticado para preferências de notificação por email.
  - [x] Exibir controle de opt-in/opt-out no web app junto das demais preferências de comunicação.
  - [x] Incluir link de unsubscribe em emails elegíveis, com token/assinatura suficiente para revogação segura.
  - [x] Diferenciar emails estritamente transacionais dos que dependem de consentimento, para não bloquear mensagens obrigatórias por engano.

- [x] Ajustar frontend do perfil/preferências (AC: 5)
  - [x] Integrar a página de perfil com API real de preferências.
  - [x] Exibir estado salvo para email e WhatsApp em uma mesma seção de comunicação.
  - [x] Garantir UX clara sobre o que é lembrete obrigatório/transacional versus comunicação opcional.

- [x] Cobrir com testes automatizados (AC: 7)
  - [x] Testes unitários do renderer HTML e resolução de locale.
  - [x] Testes do serviço de email para sucesso, falha e retry.
  - [x] Testes de integração com `JavaMailSender` mockado ou ambiente de mail dev.
  - [x] Testes de controller para preferências e unsubscribe.
  - [x] Testes frontend para toggles, persistência e estados de erro.

## Dev Notes

- O projeto já possui um serviço de email funcional para autenticação, então o principal risco aqui é duplicar infraestrutura. A história deve orientar expansão ou extração controlada, não criação de um segundo serviço paralelo.
- O `CA.md` define email com `Spring Mail + Mailpit (dev)`; o `pom.xml` já inclui dependências para ecossistema AWS, então o desenho deve permitir SES no futuro sem reescrever o canal.
- O unsubscribe aparece no planejamento do produto e conversa com requisitos de compliance do épico 16; deixe a base pronta sem invadir o escopo completo de LGPD.
- A fila de envio deve permanecer unificada com a história 9.1. Email e WhatsApp mudam o canal, não o mecanismo de agendamento.

### Project Structure Notes

- Backend alvo:
  - `regalaya-api/src/main/java/br/com/regalaya/notification/channel/email/*`
  - `regalaya-api/src/main/java/br/com/regalaya/auth/infrastructure/email/*` ou módulo extraído compartilhado
  - `regalaya-api/src/test/java/br/com/regalaya/notification/channel/email/*`
- Frontend alvo:
  - `regalaya-web/src/app/(web)/account/profile/page.tsx`
  - `regalaya-web/src/components/account/preferences/*`
  - `regalaya-web/src/services/notification-preferences.service.ts`
- Se houver refatoração do `EmailService`, preservar compatibilidade com fluxos existentes de verificação e reset de senha.

### References

- [CE.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\implementation-artifacts\CE.md) - ÉPICO 09, HU-09.3 e tarefas base.
- [sprint-status.yaml](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\implementation-artifacts\sprint-status.yaml) - Chave da história `09-3-envio-email-transacional`.
- [CA.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CA.md) - stack de email, fila/scheduler e requisitos arquiteturais de integração externa.
- [PRD.md](C:\projetos\parnaiba\presentes\regalaya01\docs\PRD.md) - RF-007, RF-204, RF-306 e RNF de segurança/mascaramento.
- [EPICS.md](C:\projetos\parnaiba\presentes\regalaya01\docs\EPICS.md) - tarefas detalhadas do HU-09.3 e requisitos de unsubscribe.
- [EmailService.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\auth\infrastructure\email\EmailService.java) - implementação atual de envio HTML e async.
- [pom.xml](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\pom.xml) - dependências já disponíveis para evolução do canal de email.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- 2026-04-08: história criada enfatizando reutilização do `EmailService` atual, alinhamento com a fila do épico 9 e preparação para preferências/unsubscribe.

### Completion Notes List

- [x] Reuso do serviço de email atual explicitado
- [x] Templates, retry e preferências definidos
- [x] Relação com 9.1 registrada
- [x] Guardrails de compliance e mascaramento incluídos
- [x] Caminhos alvo para backend/frontend indicados

### File List

- `regalaya-api/src/main/java/br/com/regalaya/notification/channel/email/EmailNotificationChannel.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/channel/email/EmailTemplateRenderer.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/domain/model/NotificationPreference.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/repository/NotificationPreferenceRepository.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/NotificationPreferenceService.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/controller/NotificationPreferenceController.java`
- `regalaya-api/src/test/java/br/com/regalaya/notification/channel/email/EmailNotificationChannelTest.java`
- `regalaya-api/src/test/java/br/com/regalaya/notification/channel/email/EmailTemplateRendererTest.java`
- `regalaya-web/src/app/(web)/account/profile/page.tsx`
- `regalaya-web/src/components/account/preferences/NotificationPreferencesCard.tsx`
- `regalaya-web/src/services/notification-preferences.service.ts`
