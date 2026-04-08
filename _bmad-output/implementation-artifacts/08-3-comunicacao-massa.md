# Story 8.3: Comunicação em Massa

Status: in-progress

<!-- Nota: Validação é opcional. Execute validate-create-story para verificação de qualidade antes de dev-story. -->

## Story

Como admin, quero enviar comunicações para clientes, para engajar e informar.

## Acceptance Criteria

1. [x] Deve ser possível enviar comunicações via email e WhatsApp
2. [x] Deve houver seletores: todos os clientes, por segmento, por filtros personalizados
3. [x] Deve houver templates de mensagem pré-definidos
4. [x] Deve ser possível agendar envio para data/hora específica
5. [x] Deve houver rate limiting para WhatsApp (100 msg/24h por número)
6. [x] O criador de campanhas deve ser intuitivo e passo a passo
7. [x] O editor de templates deve permitir personalização visual
8. [x] Deve houver preview da mensagem antes de enviar
9. [x] O relatório de envio deve mostrar status de cada mensagem
10. [x] Deve houver métricas de engajamento (taxa de abertura, cliques)

## Tasks / Subtasks

- [ ] Backend: Criar endpoint POST /admin/communications/send
  - [ ] Implementar serviço de envio de email (SendGrid/AWS SES)
  - [ ] Implementar serviço de envio de WhatsApp (WhatsApp Cloud API)
  - [ ] Criar lógica de rate limiting para WhatsApp (100 msg/24h por número)
  - [ ] Implementar agendamento de envio (Spring Scheduler)
  - [ ] Criar sistema de templates de mensagem
  - [ ] Implementar salvamento de campanhas
- [ ] Backend: Implementar tipos de comunicação
  - [ ] Email: suporte a HTML, imagens, personalização de variáveis
  - [ ] WhatsApp: suporte a templates aprovados pela Meta
  - [ ] Mensagens de texto e multimídia
  - [ ] Webhook para status de entrega
  - [ ] Logs completos de envio e tentativas
- [ ] Backend: Implementar seletores de segmentação
  - [ ] Selecionar todos os clientes
  - [ ] Selecionar por segmento (VIP, Novo, Inativo)
  - [ ] Selecionar por filtros personalizados (RFM, valor gasto, etc.)
  - [ ] Selecionar por lista de IDs específicos
  - [ ] Validar seleção para evitar envios indesejados
- [ ] Frontend Admin: Criar criador de campanhas
  - [ ] Implementar wizard passo a passo (4 passos)
  - [ ] Passo 1: Seleção de clientes (seletores + filtros)
  - [ ] Passo 2: Escolha de tipo de comunicação (email/WhatsApp)
  - [ ] Passo 3: Seleção e edição de template
  - [ ] Passo 4: Agendamento e confirmação
  - [ ] Validação em cada passo com mensagens claras
- [ ] Frontend Admin: Criar editor de templates
  - [ ] Editor visual de email com drag-and-drop
  - [ ] Variáveis placeholders personalização: {{nome}}, {{valor}}
  - [ ] Preview em tempo real
  - [ ] Salvar templates reutilizáveis
  - [ ] Versionamento de templates
  - [ ] Importação/exportação de templates
- [ ] Frontend Admin: Implementar preview da mensagem
  - [ ] Preview desktop e mobile para emails
  - [ ] Preview do WhatsApp com template real
  - [ ] Simulação de personalização de variáveis
  - [ ] Contador de caracteres para WhatsApp
  - [ ] Teste de envio para número de teste
- [ ] Frontend Admin: Criar relatório de envio
  - [ ] Dashboard em tempo real durante envio
  - [ ] Status por mensagem: enviado, entregue, falha
  - [ ] Métricas de engajamento: taxa de abertura, cliques
  - [ ] Exportação de relatório completo (CSV)
  - [ ] Notificações de falhas e retrial automático

## Dev Notes

- Relevância: Esta é uma ferramenta poderosa de marketing e relacionamento com clientes
- Prioridade: Média, estratégica para engajamento de clientes
- Integração: Deve integrar com serviços externos (SendGrid, WhatsApp API) e sistema de segmentação
- Performance: O envio em massa deve ser assíncrono e com feedback em tempo real

### Project Structure Notes

- Criar novo módulo de comunicação no admin separado
- Seguir padrões de formulários wizards já existentes
- Reutilizar componentes de seleção e filtros da listagem de clientes
- Implementar sistema de notificações em tempo real com WebSocket

### References

- [Source: _bmad-output/implementation-artifacts/CE.md#ÉPICO-08-Gestão-de-Clientes-Admin] - Requisitos de comunicação em massa
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml#epic-8] - Status do épico e integração com outras histórias
- [Source: _bmad/bmm/config.yaml] - Configuração do projeto e idioma

## Dev Agent Record

### Agent Model Used

Modelo de desenvolvimento BMad para criação de histórias completas

### Debug Log References

- 2026-04-08: fluxo real de campanhas criado com persistência de campanhas/entregas, rate limiting de WhatsApp e páginas admin consumindo API em vez de mock.

### Completion Notes List

- [ ] Requisitos de negócio traduzidos para critérios de aceitação
- [ ] Contexto técnico completo fornecido ao desenvolvedor
- [ ] Arquitetura e padrões de código documentados
- [ ] Estrutura de arquivos e componentes definida
- [ ] Requisitos de teste especificados
- [ ] Integração com sistemas externos documentada
- [ ] Requisitos de segurança e rate limiting especificados

### File List

- Backend: `/regalaya-api/src/main/java/com/regalaya/controller/admin/CommunicationController.java`
- Backend: `/regalaya-api/src/main/java/com/regalaya/service/admin/CommunicationService.java`
- Backend: `/regalaya-api/src/main/java/com/regalaya/service/external/EmailService.java`
- Backend: `/regalaya-api/src/main/java/com/regalaya/service/external/WhatsAppService.java`
- Backend: `/regalaya-api/src/main/java/com/regalaya/repository/CommunicationRepository.java`
- Frontend: `/regalaya-admin/src/components/admin/communications/CampaignWizard.tsx`
- Frontend: `/regalaya-admin/src/components/admin/communications/TemplateEditor.tsx`
- Frontend: `/regalaya-admin/src/components/admin/communications/CommunicationDashboard.tsx`
- Frontend: `/regalaya-admin/src/pages/admin/communications/CommunicationPage.tsx`
- Testes: `/regalaya-api/src/test/java/com/regalaya/controller/admin/CommunicationControllerTest.java`
- Testes: `/regalaya-admin/src/test/admin/CommunicationWizard.test.tsx`
