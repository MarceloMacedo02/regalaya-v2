# Story 10.2: Geração de Mensagem Personalizada

Status: ready-for-dev

> **Tech Stack**: LangChain4j (Java) + OpenAI GPT-4 | Redis | Next.js

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como sistema de IA,
Eu quero gerar mensagens personalizadas para presente,
para que o usuário possa criar textos emocionais e contextuais para acompanhar seus presentes.

## Acceptance Criteria

1. [AC1] Implementar endpoint POST /ai/generate-message com LangChain4j
2. [AC2] Input deve aceitar: tipo de ocasião, relacionamento, produto
3. [AC3] Output deve retornar texto emocional e contextual
4. [AC4] Deve suportar comprimento configurável (curto/médio/longo)
5. [AC5] Mensagens geradas devem ser cacheadas
6. [AC6] Frontend deve exibir preview da mensagem
7. [AC7] Frontend deve permitir ajustar e editar a mensagem
8. [AC8] Frontend deve permitir copiar para WhatsApp

## Tasks / Subtasks

### Task 1: Backend - Reutilizar Config LangChain4j (AC: #1)
- [ ] Reutilizar AiModule.java de 10-1 (mesmo ChatLanguageModel)
- [ ] Criar MessageGenerationService com injeção de ChatLanguageModel

### Task 2: Backend - Prompt Templates (AC: #1, #2, #3, AC4)
- [ ] Criar message-system-prompt.pt com instruções de tom emocional
- [ ] Criar message-user-prompt.pt com variáveis: {{ocasiao}}, {{relacionamento}}, {{produto}}, {{comprimento}}
- [ ] Implementar dynamic prompts baseados no comprimento

### Task 3: Backend - MessageGenerationService (AC: #1, #2, #3, AC4)
- [ ] Implementar MessageGenerationService
- [ ] Criar método generateMessage(occasion, relationship, product, length)
- [ ] Implementar JsonOutputParser para resposta estruturada
- [ ] Implementar fallback com mensagens predefinidas

### Task 4: Backend - Cache de Mensagens (AC: #5)
- [ ] Configurar cache Redis para mensagens geradas
- [ ] Chave: message:{hash_input}
- [ ] TTL configurável (7 dias)
- [ ] Implementar serialize/deserialize

### Task 5: Backend - Endpoint API (AC: #1)
- [ ] Criar endpoint POST /ai/generate-message
- [ ] Validar input com @Valid
- [ ] Chamar MessageGenerationService

### Task 6: Backend - Tratamento de Erros (AC: #3)
- [ ] Implementar tratamento de falhas da API OpenAI
- [ ] Retornar mensagem de erro amigável
- [ ] Log de erros para monitoramento

### Task 7: Frontend - Página de Geração (AC: #6, #7, #8)
- [ ] Criar página /gerar-mensagem
- [ ] Implementar formulário: ocasião, relacionamento, produto
- [ ] Exibir preview da mensagem gerada
- [ ] Criar editor de texto para ajustar mensagem

### Task 8: Frontend - Componentes UI (AC: #6, #7, AC8)
- [ ] Implementar LengthSelector (curto/médio/longo)
- [ ] Criar botão "Gerar nova" para regenerar
- [ ] Implementar botão "Copiar para WhatsApp" com Clipboard API
- [ ] Exibir toast de sucesso ao copiar

### Task 9: Testes
- [ ] Testar geração de mensagens para diferentes ocasiões
- [ ] Testar diferentes comprimentos
- [ ] Testar fallback em caso de falha (mock ChatLanguageModel)
- [ ] Testar copy to clipboard

## Dev Notes

### Arquitetura e Padrões
- **Backend**: Spring Boot 3.x com Java 21
- **AI**: LangChain4j com GPT-4 (reutilizar config de 10-1)
- **Cache**: Redis (Spring Data Redis)
- **Frontend**: Next.js 14+ com React, TypeScript, Tailwind CSS

### Prompt Templates LangChain4j

#### message-system-prompt.pt
```
Você é um assistente de mensagens para presentes.
Seu objetivo é criar mensagens personalizadas, emocionais e contextuais.
O tom deve ser: afetuoso, personalizado e apropriado para a ocasião.
Evite mensagens genéricas ou робóticas.
```

#### message-user-prompt.pt
```
Crie uma mensagem para presente com as seguintes informações:

- Ocasião: {{ocasiao}}
- Relacionamento: {{relacionamento}}
- Produto: {{produto}}
- Comprimento: {{comprimento}}

Requisitos:
- Tom emocional e sincero
- Mencionar o produto de forma natural
- Adequado para o relacionamento
- Comprimento: {{comprimento}}

Retorne apenas a mensagem pronta para envio.
```

#### Comprimentos
- curto: 50-100 palavras
- médio: 100-200 palavras
- longo: 200-400 palavras

### Project Structure Notes

#### Backend (regalaya-api)
```
src/main/java/com/regalaya/
├── ai/
│   ├── config/
│   │   └── AiModule.java          # Reutilizar de 10-1
│   ├── service/
│   │   ├── RecommendationService.java    # 10-1
│   │   └── MessageGenerationService.java
│   ├── prompt/
│   │   ├── recommendation-system-prompt.pt   # 10-1
│   │   ├── recommendation-user-prompt.pt      # 10-1
│   │   ├── message-system-prompt.pt
│   │   └── message-user-prompt.pt
│   └── model/
│       └── MessageRequest.java
├── controller/
│   └── AIController.java          # Extend de 10-1
└── config/
    └── RedisConfig.java           # Reutilizar
```

#### Frontend (regalaya-web)
```
src/app/gerar-mensagem/
├── page.tsx
├── components/
│   ├── MessageForm.tsx
│   ├── MessagePreview.tsx
│   ├── LengthSelector.tsx
│   ├── CopyButton.tsx
│   └── MessageEditor.tsx
└── hooks/
    └── useMessageGeneration.ts
```

### Reutilização
- **AiModule.java**: Mesmo ChatLanguageModel usado em 10-1
- **RedisConfig**: Mesmo cliente Redis
- **AIController**: Adicionar novo endpoint

### Referências

- [Source: CE.md#HU-10.2]
- [Source: 10-1-recomendacao-perfil.md]
- [LangChain4j Docs](https://docs.langchain4j.dev/)