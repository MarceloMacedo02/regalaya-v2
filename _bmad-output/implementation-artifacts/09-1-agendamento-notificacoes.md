# Story 9.1: Agendamento de Notificacoes

Status: review

<!-- Nota: Validacao e opcional. Execute validate-create-story para verificacao de qualidade antes de dev-story. -->

## Story

Como sistema, quero enviar notificacoes 7 dias e 1 dia antes das datas especiais, para lembrar o usuario no momento certo e preparar os proximos fluxos de compra.

## Acceptance Criteria

1. [x] O backend deve identificar `special_dates` com disparo em D-7 e D-1, respeitando recorrencia e evitando duplicidade com `last_notified`.
2. [x] O scheduler deve ser timezone-aware por usuario e usar execucao recorrente com tolerancia a reprocessamento idempotente.
3. [x] Cada ocorrencia elegivel deve gerar um registro persistido de fila/notificacao com payload suficiente para WhatsApp, email e futuras CTAs.
4. [x] O processamento deve suportar status de fila, tentativas, retry controlado e marcacao de falha permanente apos o limite.
5. [x] A solucao deve expor endpoints autenticados para listagem das notificacoes do usuario e marcacao como lida.
6. [x] O frontend web deve ter uma pagina de notificacoes no contexto da conta, consumindo API real, com loading, erro e estado vazio.
7. [x] A criacao de notificacoes nao pode quebrar o modulo atual de contatos/datas especiais nem exigir reescrita do `ContactService`.
8. [x] Devem existir testes unitarios e de integracao cobrindo timezone, prevencao de duplicatas, retries e endpoints principais.

## Tasks / Subtasks

- [x] Modelar o dominio de notificacoes base para o epico 9 (AC: 1, 3, 4, 7)
  - [x] Criar pacote `br.com.regalaya.notification` com separacao coerente entre `domain`, `dto`, `repository`, `service`, `controller` e `scheduler`.
  - [x] Implementar entidade persistente alinhada ao desenho de `notification_queue` do `CA.md`, incluindo `userId`, `contactId`, `specialDateId`, `type`, `messageTemplate`, `messageData`, `scheduledAt`, `sentAt`, `status`, `retryCount`, `errorMessage`, `createdAt` e `updatedAt`.
  - [x] Definir enums para tipos e status de notificacao sem introduzir strings soltas em controller/service.
  - [x] Criar migration para tabela de notificacoes/fila caso ainda nao exista no schema real do projeto.
  - [x] Garantir indices para polling por `scheduledAt + status`, busca por `userId` e filtro por tipo.

- [x] Implementar geracao de lembretes a partir de `special_dates` (AC: 1, 2, 3, 7)
  - [x] Estender `SpecialDateRepository` com query especifica para datas elegiveis em D-7 e D-1.
  - [x] Considerar recorrencia `YEARLY`, `MONTHLY` e `ONCE` conforme artefatos de arquitetura/PRD.
  - [x] Resolver timezone do usuario sem assumir UTC puro; como o modelo atual nao armazena timezone, foi introduzido fallback explicito e documentado via `app.notifications.default-timezone`.
  - [x] Gerar payload padronizado com nome da pessoa querida, tipo da data, data formatada, CTA e link para proximos passos.
  - [x] Atualizar `last_notified` somente apos criacao valida da entrada de fila, mantendo idempotencia.

- [x] Implementar scheduler e politica de retry (AC: 2, 4)
  - [x] Criar `NotificationScheduler` com metodos equivalentes a `checkUpcomingDates`, `dispatchPendingMessages` e `retryFailedMessages`.
  - [x] Seguir cron descrito no `CA.md`: verificacao horaria, despacho por minuto, retry a cada 30 minutos.
  - [x] Garantir que a etapa de despacho seja segura contra reprocessamento concorrente.
  - [x] Aplicar limite de tentativas com transicao clara de `PENDING` -> `SENDING` -> `SENT`/`FAILED`.
  - [x] Registrar logs estruturados e metricas minimas para volume processado, falhas e tempo de execucao.

- [x] Expor API de notificacoes do usuario (AC: 5)
  - [x] Criar controller autenticado para listar notificacoes do usuario com paginacao simples e filtros minimos por status/tipo.
  - [x] Criar endpoint para marcar uma notificacao como lida sem permitir acesso cruzado entre usuarios.
  - [x] Padronizar DTOs de resposta para card de notificacao no frontend.
  - [x] Documentar endpoints no OpenAPI seguindo o padrao ja usado em `ContactController`.

- [x] Implementar pagina web de notificacoes com API real (AC: 6, 7)
  - [x] Criar pagina em `regalaya-web/src/app/(web)/account/notifications/page.tsx`.
  - [x] Criar `notification.service.ts` reutilizando o cliente HTTP existente em `src/lib/api.ts`.
  - [x] Definir tipos em `regalaya-web/src/types/notification.ts`.
  - [x] Exibir lista cronologica com estado visual para lida/nao lida, CTA e timestamps formatados.
  - [x] Incluir loading state, empty state, retry manual e feedback via toast para marcacao como lida.
  - [x] Remover qualquer uso de mock para essa funcionalidade; o fluxo consome somente backend real.

- [x] Preparar pontos de extensao para canais futuros (AC: 3, 7)
  - [x] Estruturar o servico de despacho para que WhatsApp e email entrem como adaptadores/estrategias, sem duplicar a logica de polling.
  - [x] Separar criacao da fila de envio efetivo para permitir que as historias 9.2 e 9.3 plugem seus canais.
  - [x] Definir contrato minimo de renderer/template compartilhado.

- [x] Cobrir com testes automatizados (AC: 8)
  - [x] Testes unitarios para calculo de elegibilidade D-7/D-1 e prevencao de duplicatas.
  - [x] Testes de integracao para repository/query com `special_dates`.
  - [x] Testes do scheduler validando criacao de fila e retry.
  - [x] Testes de controller para listagem e marcacao como lida.
  - [x] Testes frontend para rendering da lista, empty state e acao de marcar como lida.

## Dev Notes

- Esta historia e a base estrutural do epico 9. As historias 9.2 e 9.3 devem reutilizar a fila, os status e o scheduler daqui em vez de criar pipelines paralelos.
- O repositorio ja possui `@EnableScheduling` em `RegalayaApiApplication` e um exemplo de job em [PixExpirationScheduler.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\payment\scheduler\PixExpirationScheduler.java). Use esse padrao como referencia para organizacao e ciclo de execucao.
- O dominio de contatos ja existe em [ContactController.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\contact\controller\ContactController.java) e [SpecialDateRepository.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\contact\repository\SpecialDateRepository.java). A implementacao deve estender esse fluxo, nao recria-lo.
- O `CA.md` ja define `notification_queue`, indices, cron jobs e o fluxo `special_dates -> notification_queue -> dispatcher`; a historia respeita esse desenho.
- Como o app web atual ainda tem a pagina de perfil com dados estaticos, a nova area de notificacoes nasceu consumindo API real e serve de referencia para futura remocao de mock do perfil.

### Project Structure Notes

- Backend alvo:
  - `regalaya-api/src/main/java/br/com/regalaya/notification/domain/model/*`
  - `regalaya-api/src/main/java/br/com/regalaya/notification/repository/*`
  - `regalaya-api/src/main/java/br/com/regalaya/notification/service/*`
  - `regalaya-api/src/main/java/br/com/regalaya/notification/controller/*`
  - `regalaya-api/src/main/java/br/com/regalaya/notification/scheduler/*`
  - `regalaya-api/src/test/java/br/com/regalaya/notification/*`
- Frontend alvo:
  - `regalaya-web/src/app/(web)/account/notifications/page.tsx`
  - `regalaya-web/src/services/notification.service.ts`
  - `regalaya-web/src/types/notification.ts`
  - `regalaya-web/src/components/account/notifications/*`
- Evitar criar um app `regalaya-admin`; a estrutura real do workspace concentra telas admin e web dentro de `regalaya-web`.

### References

- [CE.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\implementation-artifacts\CE.md) - Epico 09, HU-09.1 e tarefas base.
- [sprint-status.yaml](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\implementation-artifacts\sprint-status.yaml) - Chave da historia `09-1-agendamento-notificacoes`.
- [CA.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CA.md) - schema `special_dates`, `notification_queue`, scheduler architecture, cron jobs e integracoes.
- [CU.md](C:\projetos\parnaiba\presentes\regalaya01\_bmad-output\planning-artifacts\CU.md) - jornada proativa de notificacao e UX WhatsApp-first.
- [PRD.md](C:\projetos\parnaiba\presentes\regalaya01\docs\PRD.md) - RF-204, RF-301, RF-306 e RNFs de tempo/seguranca.
- [ContactController.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\contact\controller\ContactController.java) - endpoints e padrao REST atual do modulo de contatos.
- [SpecialDateRepository.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\contact\repository\SpecialDateRepository.java) - ponto natural de extensao para queries de datas especiais.
- [page.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\app\(web)\account\profile\page.tsx) - padrao visual atual de paginas da conta.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- 2026-04-08: historia criada a partir de `CE.md`, `sprint-status.yaml`, `CA.md`, `CU.md`, `PRD.md` e inspecao do codigo real do monorepo.
- 2026-04-08: implementado modulo base `notification` com fila persistente, scheduler, dispatch extensivel, API autenticada e pagina web `/account/notifications`.
- 2026-04-08: adicionadas validacoes automatizadas backend/frontend e configuracao minima de Jest no `regalaya-web` para suportar testes TS/TSX da historia.

### Completion Notes List

- [x] Contexto do epico e da historia consolidado
- [x] Dependencias arquiteturais e de codigo apontadas
- [x] Tarefas detalhadas por backend, frontend e testes
- [x] Guardrails para reutilizacao e idempotencia definidos
- [x] Estrutura alvo coerente com o workspace atual
- [x] Backend implementado com `notification_queue`, scheduler recorrente e API autenticada do usuario
- [x] Frontend implementado com pagina real `/account/notifications`, loading/error/empty state e marcacao como lida
- [x] Validacoes executadas: `mvn test`, `mvn -Dtest=NotificationSchedulingServiceTest,NotificationDispatchServiceTest,NotificationControllerTest test`, `npm test -- --runInBand src/services/__tests__/notification.service.test.ts src/components/account/notifications/__tests__/NotificationsPanel.test.tsx`, `npm run build`
- [x] Observacao registrada: a suite completa `npm test -- --runInBand` ainda possui falhas legadas fora do escopo desta historia (`useProducts`, `useErrorHandler`, `button`)

### File List

- `regalaya-api/src/main/java/br/com/regalaya/contact/repository/SpecialDateRepository.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/config/NotificationProperties.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/domain/enums/NotificationStatus.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/domain/enums/NotificationType.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/domain/model/NotificationQueue.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/dto/responses/NotificationItemResponse.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/dto/responses/NotificationPageResponse.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/dto/responses/NotificationReadResponse.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/exception/NotificationOwnershipException.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/repository/NotificationQueueRepository.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/NotificationDeliveryAdapter.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/NotificationDispatchService.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/NotificationQueryService.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/NotificationSchedulingService.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/NotificationTemplateRenderer.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/impl/DefaultNotificationTemplateRenderer.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/impl/InAppNotificationDeliveryAdapter.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/impl/NotificationDispatchServiceImpl.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/impl/NotificationSchedulingServiceImpl.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/service/model/NotificationPayload.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/controller/NotificationController.java`
- `regalaya-api/src/main/java/br/com/regalaya/notification/scheduler/NotificationScheduler.java`
- `regalaya-api/src/main/resources/application.yml`
- `regalaya-api/src/main/resources/db/migration/V1.3__create_notification_queue.sql`
- `regalaya-api/src/test/java/br/com/regalaya/notification/controller/NotificationControllerTest.java`
- `regalaya-api/src/test/java/br/com/regalaya/notification/service/NotificationDispatchServiceTest.java`
- `regalaya-api/src/test/java/br/com/regalaya/notification/service/NotificationSchedulingServiceTest.java`
- `regalaya-web/src/app/(web)/account/notifications/page.tsx`
- `regalaya-web/src/components/account/notifications/NotificationsPanel.tsx`
- `regalaya-web/src/components/account/notifications/__tests__/NotificationsPanel.test.tsx`
- `regalaya-web/src/services/index.ts`
- `regalaya-web/src/services/notification.service.ts`
- `regalaya-web/src/services/__tests__/notification.service.test.ts`
- `regalaya-web/src/types/notification.ts`
- `regalaya-web/jest.config.js`
- `regalaya-web/jest.setup.js`

### Change Log

- 2026-04-08: implementado modulo base de notificacoes do epico 9 com fila persistente, scheduler, retry, API autenticada, tela web e cobertura automatizada principal.
