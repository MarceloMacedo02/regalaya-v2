# Story 11.3: Sugestões via WhatsApp

Status: ready-for-dev

> **Tech Stack**: Spring Boot | WhatsApp Cloud API | LangChain4j (10-1) | ProductService (04)

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como usuário WhatsApp,
Eu quero receber sugestões de presentes pelo WhatsApp,
para que eu descubra opções de presentes sem precisar acessar o site.

## Acceptance Criteria

1. [AC1] Suportar comando "/presentes" ou callback "menu_gifts"
2. [AC2] Listar 3-5 opções usando LangChain4j RecommendationService (10-1)
3. [AC3] Enviar mensagem com imagem do produto + preço + nome
4. [AC4] Criar Interactive List com 5 opções numeradas para seleção
5. [AC5] Processar seleção e oferecer: comprar agora, agendar mensagem, ver mais

## Tasks / Subtasks

### Task 1: Backend - GiftCommandHandler (AC: #1)
- [ ] Criar GiftCommandHandler implements WhatsAppHandler
- [ ] Handle callback ID: menu_gifts
- [ ] Handle comando: "/presentes"
- [ ] Verificar se usuário está logado (identificar por telefone)

### Task 2: Backend - Gather Profile Context (AC: #2)
- [ ] Se usuário logado → buscar preferências do usuário
- [ ] Se não logado → pedir idade da pessoa para quem é o presente
- [ ] Armazenar contexto na sessão

### Task 3: Backend - RecommendationService Integration (AC: #2)
- [ ] Injetar RecommendationService (10-1)
- [ ] Chamar recommendationService.getRecommendations(profileContext)
- [ ] Obter 3-5 sugestões de produtos
- [ ] Cachear resposta por 1 hora

### Task 4: Backend - WhatsAppProductService (AC: #3)
- [ ] Injetar ProductService (04)
- [ ] Implementar getProductDetailsForWhatsApp(productId)
- [ ] Buscar: nome, preço, imagem principal, URL
- [ ] Formatar mensagem: "📦 {nome}\n💰 {preço}\n{imagem}"

### Task 5: Backend - Interactive List com Imagens (AC: #3, AC4)
- [ ] Implementar sendGiftSuggestions(to, products)
- [ ] Criar Interactive List com até 5 produtos
- [ ] Incluir imagem do produto no header (URL)
- [ ] Estrutura:
  ```json
  {
    "type": "interactive",
    "interactive": {
      "type": "list",
      "header": {"type": "text", "text": "🎁 Sugestões de Presentes"},
      "body": {"text": "Escolha um produto:"},
      "action": {
        "button": "Ver Opções",
        "sections": [{
          "rows": [
            {"id": "prod_1", "title": "Kit Aromatizador", "description": "R$89,90"},
            {"id": "prod_2", "title": "Caixa Chocolates", "description": "R$59,90"},
            ...
          ]
        }]
      }
    }
  }
  ```

### Task 6: Backend - SelectionProcessor (AC: #5)
- [ ] Criar SelectionProcessor
- [ ] Processar callback com productId
- [ ] Buscar detalhes completos do produto
- [ ] Oferecer opções via Interactive Buttons:
  - "💳 Comprar agora" → iniciar checkout
  - "📅 Agendar mensagem" → iniciar agendamento (11-4)
  - "🔙 Ver mais" → mostrar mais opções

### Task 7: Backend - Add to Cart Integration (AC: #5)
- [ ] Se "Comprar agora" → chamar CartService.addItem()
- [ ] Redirecionar usuário para checkout URL
- [ ] Enviar link via WhatsApp

### Task 8: Backend - Fallback for Unavailable Products (AC: #2)
- [ ] Se produto indisponível → marcar como "Indisponível"
- [ ] Oferecer alternativa similar

### Task 9: Frontend - N/A (Backend only)

### Task 10: Testes
- [ ] Testar comando /presentes
- [ ] Testar integração com RecommendationService
- [ ] Testar formatação de mensagens com imagens
- [ ] Testar seleção e processamento
- [ ] Testar add to cart

## Dev Notes

### Arquitetura e Padrões
- **Backend**: Spring Boot 3.x com Java 21
- **WhatsApp API**: WhatsApp Cloud API (Meta)
- **AI**: LangChain4j RecommendationService (10-1)
- **Products**: ProductService (Épico 04)
- **Cart**: CartService (Épico 05)

### Fluxo de Sugestões
```
Usuário: "/presentes" ou clica "Presentes" no menu (menu_gifts)
    ↓
GiftCommandHandler recebe callback
    ↓
Verificar se usuário está logado?
    ↓ Se não → pedir idade da pessoa
    ↓ Se sim → buscar preferências
    ↓
Chamar RecommendationService (LangChain4j)
    ↓
Obter 3-5 produtos recomendados
    ↓
WhatsAppProductService buscar detalhes
    ↓
Interactive List com produtos
    ↓
Usuário seleciona produto (callback)
    ↓
SelectionProcessor processa
    ↓
Interactive Buttons:
- Comprar agora → CartService → Link checkout
- Agendar mensagem → 11-4
- Ver mais → mais opções
```

### Reutilização de Serviços
- **RecommendationService** (10-1): Recomendações de IA
- **ProductService** (04): Buscar produtos do catálogo
- **CartService** (05): Adicionar ao carrinho
- **WhatsAppApiService** (11-1): Enviar mensagens

### Image Handling
- WhatsApp suporta imagens até 5MB em formato JPG/PNG
- Usar CDN para imagens de produtos (Cloudinary/S3)
- Gerar thumbnails para performance

### Project Structure Notes

#### Backend (regalaya-api)
```
src/main/java/com/regalaya/
├── handler/
│   └── GiftCommandHandler.java       # Implements WhatsAppHandler
├── service/
│   ├── WhatsAppProductService.java   # Buscar produtos p/ WhatsApp
│   ├── GiftSelectionService.java     # Interactive List
│   └── SelectionProcessor.java       # Processar seleção
├── integration/
│   ├── RecommendationServiceWrapper.java  # 10-1
│   ├── ProductServiceAdapter.java    # 04
│   └── CartServiceAdapter.java       # 05
└── config/
    └── WhatsAppConfig.java           # Reutilizar de 11-1
```

### Referências

- [Source: CE.md#HU-11.3]
- [Source: 10-1-recomendacao-perfil.md]
- [Source: 04-1-listagem-produtos.md]
- [Source: 11-1-menu-inicial-bot.md]
- [WhatsApp List Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages/interactive)