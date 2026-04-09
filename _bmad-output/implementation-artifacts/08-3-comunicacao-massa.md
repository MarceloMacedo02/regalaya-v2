# Story 8.3: Comunicação em Massa

Status: in-progress

<!-- Nota: validação é opcional. Este arquivo foi reconciliado com o código real em 2026-04-08. -->

## Story

Como admin, quero enviar comunicações para clientes, para engajar e informar.

## Acceptance Criteria

1. [ ] O sistema já registra campanhas de email e WhatsApp, mas ainda não integra provedores reais de envio.
2. [x] Há seleção por segmento e por filtros/customização de destinatários.
3. [x] Há templates de mensagem pré-definidos com CRUD e versionamento básico.
4. [x] É possível registrar campanha para envio imediato ou agendado.
5. [x] Existe regra de rate limiting para WhatsApp no backend da campanha.
6. [x] O criador de campanhas é wizard passo a passo.
7. [ ] O editor existe, mas não é um editor visual drag-and-drop.
8. [x] Há preview da mensagem/campanha antes de registrar.
9. [x] Há relatório por mensagem com status persistido das entregas da campanha.
10. [ ] Métricas de engajamento existem no modelo/resposta, mas ainda não há tracking real de abertura/clique.

## Tasks / Subtasks

- [x] Backend: Criar endpoints de campanha
  - [x] `POST /v1/admin/communications/send`
  - [x] `GET /v1/admin/communications/campaigns`
  - [x] `GET /v1/admin/communications/campaigns/{id}`
  - [x] `DELETE /v1/admin/communications/campaigns/{id}`

- [ ] Backend: Implementar envio real por canal
  - [ ] Serviço real de envio de email (SES/SendGrid)
  - [ ] Serviço real de envio de WhatsApp Cloud API
  - [x] Regra de rate limiting por número para campanhas WhatsApp
  - [ ] Scheduler de despacho assíncrono para campanhas agendadas
  - [x] Persistência de campanhas e entregas

- [ ] Backend: Implementar capacidades avançadas de canal
  - [ ] Email com integração externa de HTML/imagens enviada de fato
  - [ ] WhatsApp com templates aprovados pela Meta
  - [ ] Mensagens multimídia reais
  - [ ] Webhook de status de entrega
  - [ ] Logs operacionais completos de tentativa/reenvio

- [x] Backend: Seletores de segmentação
  - [x] Selecionar todos os clientes
  - [x] Selecionar por segmento (`ALL`, `VIP`, `NEW`, `INACTIVE`)
  - [x] Selecionar por filtros personalizados
  - [x] Selecionar por lista de IDs específicos
  - [x] Validar segmento/template antes de registrar campanha

- [x] Frontend Admin: Criar criador de campanhas
  - [x] Wizard com 4 passos
  - [x] Passo 1: seleção de clientes
  - [x] Passo 2: tipo de comunicação
  - [x] Passo 3: seleção de template
  - [x] Passo 4: agendamento e confirmação
  - [x] Validação por etapa
  - [x] Salvar rascunho no `localStorage`

- [ ] Frontend Admin: Editor de templates
  - [ ] Editor visual drag-and-drop
  - [x] Variáveis/placeholders editáveis
  - [x] Preview em tempo real
  - [x] Salvar templates reutilizáveis
  - [x] Versionamento básico via incremento no backend
  - [x] Importação/exportação de templates em JSON

- [ ] Frontend Admin: Preview avançado da mensagem
  - [ ] Preview desktop/mobile específico para email
  - [ ] Preview de WhatsApp fiel ao template real do provedor
  - [x] Simulação de personalização de variáveis
  - [ ] Contador de caracteres específico para WhatsApp
  - [ ] Envio de teste para número/email de teste

- [ ] Frontend Admin: Relatório e operação
  - [ ] Dashboard em tempo real durante envio
  - [x] Status por mensagem persistido
  - [ ] Métricas reais de abertura/clique
  - [ ] Exportação CSV do relatório
  - [ ] Notificações automáticas de falha/retry

## Dev Notes

- O módulo está funcional como cadastro/orquestração de campanhas e templates, mas ainda não como plataforma completa de disparo externo.
- O backend cria campanhas, resolve destinatários, persiste entregas e calcula `openRate`/`clickRate` a partir do estado persistido, porém sem webhook/tracking real esses valores ficam essencialmente estáticos.
- O wizard está integrado com API real, mas usa contagens estimadas fixas em alguns passos do frontend em vez de consultar volume real de clientes elegíveis.
- O arquivo anterior também referenciava `regalaya-admin/`, mas a implementação real está toda em `regalaya-web`.

### Project Structure Notes

- Backend real:
  - `regalaya-api/src/main/java/br/com/regalaya/communication/controller/admin/CommunicationCampaignController.java`
  - `regalaya-api/src/main/java/br/com/regalaya/communication/controller/admin/TemplateController.java`
  - `regalaya-api/src/main/java/br/com/regalaya/communication/service/impl/CommunicationCampaignServiceImpl.java`
  - `regalaya-api/src/main/java/br/com/regalaya/communication/service/impl/TemplateServiceImpl.java`
  - `regalaya-api/src/main/java/br/com/regalaya/communication/domain/model/*`
- Frontend real:
  - `regalaya-web/src/app/admin/communications/campaigns/page.tsx`
  - `regalaya-web/src/app/admin/communications/campaigns/new/page.tsx`
  - `regalaya-web/src/app/admin/communications/campaigns/[id]/page.tsx`
  - `regalaya-web/src/app/admin/communications/templates/page.tsx`
  - `regalaya-web/src/components/admin/communications/*`
  - `regalaya-web/src/hooks/useCampaignWizard.ts`

### References

- [CommunicationCampaignController.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\communication\controller\admin\CommunicationCampaignController.java)
- [CommunicationCampaignServiceImpl.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\communication\service\impl\CommunicationCampaignServiceImpl.java)
- [TemplateController.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\communication\controller\admin\TemplateController.java)
- [TemplateServiceImpl.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\main\java\br\com\regalaya\communication\service\impl\TemplateServiceImpl.java)
- [CampaignWizard.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\components\admin\communications\CampaignWizard.tsx)
- [TemplateStep.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\components\admin\communications\TemplateStep.tsx)
- [page.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\app\admin\communications\campaigns\page.tsx)
- [page.tsx](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\app\admin\communications\templates\page.tsx)
- [useCampaignWizard.ts](C:\projetos\parnaiba\presentes\regalaya01\regalaya-web\src\hooks\useCampaignWizard.ts)
- [CommunicationCampaignServiceImplTest.java](C:\projetos\parnaiba\presentes\regalaya01\regalaya-api\src\test\java\br\com\regalaya\communication\service\impl\CommunicationCampaignServiceImplTest.java)

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- 2026-04-08: documentação reconciliada com wizard real, CRUD de templates/campanhas e backend de persistência, mantendo em aberto integrações externas e tracking operacional.

### Completion Notes List

- [x] Estado real do módulo de campanhas verificado
- [x] Diferença entre "registrar campanha" e "enviar via provedor real" documentada
- [x] Caminhos corrigidos para `regalaya-web`
- [ ] Integrações externas, scheduler e tracking ainda pendentes

### File List

- `regalaya-api/src/main/java/br/com/regalaya/communication/controller/admin/CommunicationCampaignController.java`
- `regalaya-api/src/main/java/br/com/regalaya/communication/controller/admin/TemplateController.java`
- `regalaya-api/src/main/java/br/com/regalaya/communication/service/impl/CommunicationCampaignServiceImpl.java`
- `regalaya-api/src/main/java/br/com/regalaya/communication/service/impl/TemplateServiceImpl.java`
- `regalaya-api/src/main/java/br/com/regalaya/communication/domain/model/CommunicationCampaign.java`
- `regalaya-api/src/main/java/br/com/regalaya/communication/domain/model/CommunicationDelivery.java`
- `regalaya-api/src/main/java/br/com/regalaya/communication/domain/model/CommunicationTemplate.java`
- `regalaya-api/src/test/java/br/com/regalaya/communication/service/impl/CommunicationCampaignServiceImplTest.java`
- `regalaya-web/src/app/admin/communications/campaigns/page.tsx`
- `regalaya-web/src/app/admin/communications/campaigns/new/page.tsx`
- `regalaya-web/src/app/admin/communications/campaigns/[id]/page.tsx`
- `regalaya-web/src/app/admin/communications/templates/page.tsx`
- `regalaya-web/src/components/admin/communications/CampaignWizard.tsx`
- `regalaya-web/src/components/admin/communications/TemplateEditor.tsx`
- `regalaya-web/src/components/admin/communications/TemplateStep.tsx`
- `regalaya-web/src/hooks/useCampaignWizard.ts`
