# Story 10.3: RAG (Retrieval-Augmented Generation)

Status: ready-for-dev

> **Tech Stack**: LangChain4j Embeddings | PostgreSQL pgvector | Redis | Next.js

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como sistema de IA,
Eu quero usar o histórico do usuário para melhorar as recomendações,
para que as sugestões sejam mais relevantes e personalizadas baseadas em preferências anteriores.

## Acceptance Criteria

1. [AC1] Configurar PostgreSQL com extensão pgvector
2. [AC2] Gerar embeddings dos produtos usando LangChain4j Embeddings (Ada-002)
3. [AC3] Armazenar embeddings no pgvector
4. [AC4] Implementar query de similaridade para recomendações
5. [AC5] Combinar resultados com preferences do usuário
6. [AC6] Implementar HNSW index para performance
7. [AC7] Frontend deve indicar "Baseado no seu histórico"
8. [AC8] Frontend deve exibir produtos similares aos comprados

## Tasks / Subtasks

### Task 1: Backend - Migração pgvector (AC: #1)
- [ ] Executar CREATE EXTENSION IF NOT EXISTS vector;
- [ ] Criar migration para tabela product_embeddings
- [ ] Criar coluna embedding VECTOR(1536)
- [ ] Criar índice HNSW com m=16, ef_construction=64

### Task 2: Backend - Config LangChain4j Embeddings (AC: #2)
- [ ] Adicionar dependência langchain4j-embeddings
- [ ] Configurar OpenAiEmbeddingModel com modelo text-embedding-ada-002
- [ ] Criar AiEmbeddingModule.java

### Task 3: Backend - EmbeddingService (AC: #2, AC3)
- [ ] Implementar EmbeddingService
- [ ] Implementar método embedText(String text)
- [ ] Implementar método embedProduct(Product product)
- [ ] Implementar método embedUserPreference(String preferences)
- [ ] Implementar batch embedding para produtos

### Task 4: Backend - ProductEmbeddingRepository (AC: #3)
- [ ] Implementar ProductEmbeddingRepository
- [ ] Implementar método upsertEmbedding(productId, embedding)
- [ ] Implementar método findByProductId(productId)
- [ ] Implementar método deleteByProductId(productId)

### Task 5: Backend - SimilaritySearchService (AC: #4, AC5, AC6)
- [ ] Implementar SimilaritySearchService
- [ ] Implementar busca por cosine similarity no PostgreSQL
- [ ] Implementar método findSimilarProducts(embedding, limit)
- [ ] Implementar método findSimilarToUserHistory(userId, limit)
- [ ] Implementar combinação com preferences (weighted score)

### Task 6: Backend - Embedding Generation Jobs (AC: #3)
- [ ] Criar scheduled job para gerar embeddings de produtos novos
- [ ] Criar scheduled job para reindexar produtos atualizados
- [ ] Implementar batch de 100 produtos por vez

### Task 7: Backend - Endpoint API (AC: #4)
- [ ] Criar endpoint POST /ai/embeddings/products (batch)
- [ ] Criar endpoint GET /ai/similar-products?productId=X
- [ ] Criar endpoint GET /ai/recommendations/history-based

### Task 8: Backend - Integração com RecommendationService (AC: #5)
- [ ] Modificar RecommendationService (10-1) para injetar SimilaritySearchService
- [ ] Adicionar produtos similares à resposta
- [ ] Implementar scoring híbrido (IA + similaridade)

### Task 9: Frontend - Similar Products UI (AC: #7, AC8)
- [ ] Criar seção "Baseado no seu histórico" no frontend
- [ ] Implementar HistoryBadge.tsx
- [ ] Criar SimilarProductsSection.tsx
- [ ] Implementar tracking de produtos visualizados

### Task 10: Frontend - Produto Detail Page (AC: #7)
- [ ] Adicionar "Produtos Similares" na página de detalhes
- [ ] Implementar lazy loading da seção
- [ ] Exibir até 6 produtos similares

### Task 11: Testes
- [ ] Testar geração de embeddings
- [ ] Testar busca de similaridade com dados reais
- [ ] Testar performance com HNSW (1M+ vetores)
- [ ] Testar integração com RecommendationService
- [ ] Testar fallback se pgvector não disponível

## Dev Notes

### Arquitetura e Padrões
- **Backend**: Spring Boot 3.x com Java 21
- **AI**: LangChain4j Embeddings (text-embedding-ada-002)
- **Vector DB**: PostgreSQL 15+ com pgvector
- **Cache**: Redis (para cache de resultados frequentes)
- **Frontend**: Next.js 14+ com React, TypeScript, Tailwind CSS

### Dependências Maven (pom.xml)
```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-embeddings</artifactId>
    <version>0.35.0</version>
</dependency>
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j</artifactId>
    <version>0.35.0</version>
</dependency>
```

### SQL - Criação de Tabela e Índice
```sql
-- Habilitar extensão
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabela de embeddings
CREATE TABLE product_embeddings (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL UNIQUE,
    embedding VECTOR(1536) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice HNSW para busca de similaridade
CREATE INDEX product_embeddings_hnsw_idx 
ON product_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

### Fluxo de RAG
1. Usuário compra/visualiza produtos → tracking no frontend
2. Backend gera embedding do produto (nome + descrição)
3. Embedding armazenado no pgvector com product_id
4. SimilaritySearchService busca produtos similares
5. RecommendationService combina: LLM + similarity

### Project Structure Notes

#### Backend (regalaya-api)
```
src/main/java/com/regalaya/
├── ai/
│   ├── config/
│   │   ├── AiModule.java              # ChatLanguageModel
│   │   └── AiEmbeddingModule.java     # EmbeddingModel
│   ├── service/
│   │   ├── RecommendationService.java    # 10-1
│   │   ├── EmbeddingService.java
│   │   └── SimilaritySearchService.java
│   ├── repository/
│   │   ├── RecommendationRepository.java  # 10-1
│   │   └── ProductEmbeddingRepository.java
│   └── model/
│       └── ProductEmbedding.java
├── controller/
│   ├── AIController.java
│   └── RAGController.java
├── entity/
│   └── ProductEmbedding.java
└── config/
    └── DatabaseConfig.java
```

#### Frontend (regalaya-web)
```
src/app/
├── recomendacoes/
│   ├── page.tsx
│   └── components/
│       ├── SimilarProductsSection.tsx
│       └── HistoryBadge.tsx
├── produto/[slug]/
│   └── page.tsx    # Adicionar "Similares" aqui
└── hooks/
    ├── useSimilarProducts.ts
    └── useProductTracking.ts
```

### Reutilização
- **RecommendationService** (10-1): Injetar SimilaritySearchService
- **AiModule**: Compartilhar ChatLanguageModel
- **ProductService**: Buscar produtos para embeddings

### Referências

- [Source: CE.md#HU-10.3]
- [Source: 10-1-recomendacao-perfil.md]
- [LangChain4j Embeddings](https://docs.langchain4j.dev/category/language-models/embedding-models)
- [pgvector](https://github.com/pgvector/pgvector)