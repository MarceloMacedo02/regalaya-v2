# Story 10.1: Recomendação por Perfil

Status: ready-for-dev

> **Tech Stack**: LangChain4j (Java) + OpenAI GPT-4 | Redis | Next.js

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como sistema de IA,
Eu quero recomendar presentes baseado no perfil da pessoa,
para que o usuário receba sugestões personalizadas e relevantes.

## Acceptance Criteria

1. [AC1] O sistema deve implementar RecommendationService com LangChain4j + GPT-4
2. [AC2] Input deve aceitar: idade, gênero, interesses, ocasião
3. [AC3] Output deve retornar 3-5 sugestões com justificativa
4. [AC4] Respostas devem ser cacheadas no Redis com TTL 24h
5. [AC5] Deve implementar fallback quando API falhar
6. [AC6] Frontend deve exibir cards de sugestões com justificativa da IA
7. [AC7] Frontend deve permitir feedback (gostei/não gostei)
8. [AC8] Testes devem validar qualidade das recomendações

## Tasks / Subtasks

### Task 1: Backend - Dependências e Configuração LangChain4j (AC: #1)
- [ ] Adicionar dependência langchain4j-open-ai no pom.xml
- [ ] Configurar OpenAiChatModel com API key e modelo GPT-4
- [ ] Criar AiModule.java com @Configuration para injeção de dependência
- [ ] Configurar timeout e retry policies

### Task 2: Backend - Tabela Recommendations (AC: #1)
- [ ] Criar tabela recommendations no banco de dados
- [ ] Implementar entidade Recommendation com campos: user_id, profile_data, suggestions, justification, created_at

### Task 3: Backend - Prompt Template (AC: #1, #2, #3)
- [ ] Criar recommendation-system-prompt.pt (prompt do sistema)
- [ ] Criar recommendation-user-prompt.pt (prompt do usuário com variáveis)
- [ ] Implementar AiMessage userMessage com DynamicVariables

### Task 4: Backend - RecommendationService (AC: #1, #2, #3, AC5)
- [ ] Implementar RecommendationService
- [ ] Injetar ChatLanguageModel via LangChain4j
- [ ] Implementar método que recebe: idade, gênero, interesses, ocasião
- [ ] Implementar método que retorna 3-5 sugestões com justificativa
- [ ] Implementar fallback (retorna recomendações estáticas) se API falhar
- [ ] Implementar JsonOutputParser para parsear resposta

### Task 5: Backend - Cache Redis (AC: #4)
- [ ] Configurar cache Redis para recommendations
- [ ] Implementar chave de cache: recommendation:{hash_perfil}
- [ ] Configurar TTL de 24 horas
- [ ] Implementar CacheService com serialize/deserialize

### Task 6: Backend - Endpoint API (AC: #1)
- [ ] Criar endpoint POST /ai/recommendations
- [ ] Validar input (idade, gênero, interesses, ocasião)
- [ ] Chamar RecommendationService
- [ ] Retornar recomendações cacheadas ou gerar novas

### Task 7: Backend - Logging e Monitoramento (AC: #5)
- [ ] Configurar logging para LangChain4j (request/response)
- [ ] Criar métricas de uso (sucesso, falha, latency)
- [ ] Implementar alert para falhas frequentes

### Task 8: Frontend - Página de Recomendações (AC: #6, #7)
- [ ] Criar página /recomendacoes
- [ ] Implementar formulário de perfil (idade, interesses, ocasião)
- [ ] Exibir cards de sugestões com imagem, nome, preço, justificativa
- [ ] Implementar botões de feedback (gostei/não gostei)
- [ ] Exibir loading states durante chamada API
- [ ] Tratar erros e exibir mensagens adequadas

### Task 9: Frontend - Hook useRecommendations (AC: #6)
- [ ] Criar hook useRecommendations.ts
- [ ] Implementar mutateAsync para feedback
- [ ] Invalidar cache após feedback

### Task 10: Testes (AC: #8)
- [ ] Criar testes unitários para RecommendationService
- [ ] Criar testes de integração para endpoint
- [ ] Testar fallback em caso de falha na API (mock ChatLanguageModel)
- [ ] Testar cache Redis com TestContainers
- [ ] Testar parse de JSON da IA

## Dev Notes

### Arquitetura e Padrões
- **Backend**: Spring Boot 3.x com Java 21
- **AI**: LangChain4j (langchain4j-open-ai) com GPT-4
- **Cache**: Redis (Spring Data Redis)
- **Frontend**: Next.js 14+ com React, TypeScript, Tailwind CSS

### Dependências Maven (pom.xml)
```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-open-ai</artifactId>
    <version>0.35.0</version>
</dependency>
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j</artifactId>
    <version>0.35.0</version>
</dependency>
```

### Prompts LangChain4j

#### recommendation-system-prompt.pt
```
Você é um assistente de presentes especializado.
Seu objetivo é recomendar presentes perfeitos baseados no perfil da pessoa.
Analise as informações fornecidas e sugira 3-5 produtos relevantes.
Para cada produto, inclua: nome, justificativa emocional e faixa de preço estimada.
```

#### recommendation-user-prompt.pt
```
Analise o seguinte perfil e recomende presentes:

- Idade: {{idade}}
- Gênero: {{genero}}
- Interesses: {{interesses}}
- Ocasião: {{ocasiao}}

Retorne em formato JSON:
{
  "sugestoes": [
    {"nome": "...", "justificativa": "...", "preco": "R$XXX"}
  ]
}
```

### Project Structure Notes

#### Backend (regalaya-api)
```
src/main/java/com/regalaya/
├── ai/
│   ├── config/
│   │   └── AiModule.java          # Config LangChain4j
│   ├── service/
│   │   └── RecommendationService.java
│   ├── prompt/
│   │   ├── recommendation-system-prompt.pt
│   │   └── recommendation-user-prompt.pt
│   ├── model/
│   │   ├── RecommendationResult.java  # POJO para JsonOutputParser
│   │   └── ProfileInput.java
│   └── output/
│       └── RecommendationOutputParser.java
├── controller/
│   └── AIController.java
├── repository/
│   └── RecommendationRepository.java
└── config/
    └── RedisConfig.java
```

#### Frontend (regalaya-web)
```
src/app/recomendacoes/
├── page.tsx
├── components/
│   ├── ProfileForm.tsx
│   ├── RecommendationCard.tsx
│   └── FeedbackButtons.tsx
└── hooks/
    └── useRecommendations.ts
```

### Referências

- [Source: CE.md#HU-10.1]
- [Source: docs/PRD.md# funcionalidades-ia]
- [LangChain4j Docs](https://docs.langchain4j.dev/)