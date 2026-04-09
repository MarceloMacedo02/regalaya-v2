package br.com.regalaya.ai.service;

import br.com.regalaya.ai.domain.model.Recommendation;
import br.com.regalaya.ai.model.ChatRequest;
import br.com.regalaya.ai.model.ChatResponse;
import br.com.regalaya.ai.model.ChatMessageDto;
import br.com.regalaya.ai.model.MessageRequest;
import br.com.regalaya.ai.model.MessageResponse;
import br.com.regalaya.ai.model.ProfileInput;
import br.com.regalaya.ai.model.RecommendationResult;
import br.com.regalaya.ai.model.RecommendationResult.Suggestion;
import br.com.regalaya.ai.repository.RecommendationRepository;
import br.com.regalaya.product.domain.model.Product;
import br.com.regalaya.product.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService {

    @Value("${app.ai.openrouter.api-key}")
    private String aiApiKey;

    @Value("${app.ai.openrouter.model}")
    private String aiModel;

    @Value("${app.ai.openrouter.base-url}")
    private String aiBaseUrl;

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;
    private final RecommendationRepository recommendationRepository;
    private final ProductRepository productRepository;
    private final br.com.regalaya.product.mapper.ProductMapper productMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public RecommendationResult recommend(UUID userId, ProfileInput input) {
        try {
            log.info("Processando recomendação via Tags: {}", input.getQuery());

            // 1. Extrair palavras-chave da query (tags relevantes)
            List<String> keywords = extractKeywords(input.getQuery());
            log.info("Tags extraídas: {}", keywords);

            // 2. Busca por Tag entity (ManyToMany JPQL) — stock >= 1
            List<Product> candidateProducts = new ArrayList<>();
            for (String keyword : keywords) {
                // Busca pela tabela tags (relacionamento)
                List<Product> byTag = productRepository.findByTagNameWithStock(keyword);
                // Também busca por nome/tags legado para garantir cobertura
                List<Product> byNative = productRepository.findByTagWithStock(keyword, 10);
                for (Product p : byTag) {
                    if (candidateProducts.stream().noneMatch(cp -> cp.getId().equals(p.getId()))) {
                        candidateProducts.add(p);
                    }
                }
                for (Product p : byNative) {
                    if (candidateProducts.stream().noneMatch(cp -> cp.getId().equals(p.getId()))) {
                        candidateProducts.add(p);
                    }
                }
            }
            log.info("Produtos encontrados por tag: {}", candidateProducts.size());

            // 3. Fallback: se tags retornaram poucos, complementa com qualquer produto com estoque
            if (candidateProducts.size() < 5) {
                List<Product> allActive = productRepository.findAllActiveWithStock();
                for (Product p : allActive) {
                    if (candidateProducts.stream().noneMatch(cp -> cp.getId().equals(p.getId()))) {
                        candidateProducts.add(p);
                    }
                    if (candidateProducts.size() >= 15) break;
                }
                log.info("Fallback aplicado. Total candidatos: {}", candidateProducts.size());
            }

            if (candidateProducts.isEmpty()) {
                log.warn("Nenhum produto ativo com estoque encontrado.");
                return getFallbackRecommendations();
            }

            // 4. Montar inventário para IA curar e escrever justificativas (max 15)
            StringBuilder inventoryBuilder = new StringBuilder();
            int count = 0;
            for (Product p : candidateProducts) {
                if (count++ >= 15) break;
                String desc = p.getShortDescription() != null ? p.getShortDescription() :
                             p.getDescription() != null ? p.getDescription() : "";
                String tags = p.getTags() != null ? " [tags: " + p.getTags() + "]" : "";
                inventoryBuilder.append(p.getId().toString())
                    .append(": ")
                    .append(p.getName())
                    .append(tags)
                    .append(" - ")
                    .append(desc.substring(0, Math.min(desc.length(), 100)))
                    .append("\n");
            }

            // 4. Prompt para IA de Curadoria Estratégica, Alta Conversão e RAG (10.1, 10.2, 10.3)
            String userPrompt = String.format(
                "### MISSÃO CORPORATIVA: MAXIMIZAR CONVERSÃO DE VENDAS E TICKET MÉDIO\n" +
                "Analise o pedido sensorial do cliente: \"%s\"\n\n" +
                "### INVENTÁRIO DISPONÍVEL VIA RAG (ID: Nome - Descrição):\n%s\n\n" +
                "### DIRETRIZES DE SELEÇÃO E COPYWRITING:\n" +
                "1. **Curadoria Estratégica e Volume**: Selecione de 6 a 8 produtos de categorias DIVERSIFICADAS. Um volume maior de sugestões diversificadas incentiva o aumento do ticket médio.\n" +
                "2. **Mensagens Persuasivas e Personalizadas**: A justificativa de cada item deve ser altamente persuasiva, despertando o interesse imediato do consumidor.\n" +
                "3. **Gatilhos Mentais**: Utilize explicitamente gatilhos mentais de ESCASSEZ (ex: \"últimas unidades\", \"estoque restrito\") e EXCLUSIVIDADE (ex: \"curadoria exclusiva\", \"peça única\").\n" +
                "4. **Relevância Textual (Algoritmo de Busca/SEO)**: O foco deve ser o ALINHAMENTO RIGOROSO entre o conteúdo da mensagem (justificativa) e as palavras-chave do título do produto, garantindo relevância textual perfeita.\n" +
                "5. **Restrições**: Aplique filtros negativos absolutos se mencionados no pedido.\n" +
                "### SAÍDA (APENAS JSON): { \"selectedIds\": [\"id1\", ...], \"justificativas\": { \"id1\": \"Sua justificativa de alto impacto com gatilhos de conversão e alinhamento de palavras-chave do título aqui...\", ... } }",
                input.getQuery(),
                inventoryBuilder.toString()
            );

            String systemPrompt = "Você é uma API de resposta RÁPIDA e DIRETA que retorna APENAS JSON. " +
                "PROIBIDO: Não use tags <think>, não raciocine, não explique, não use markdown. " +
                "Regra de Ouro: Comece sua resposta IMEDIATAMENTE com '{'. " +
                "Estrutura: { \"selectedIds\": [\"uuid\"], \"justificativas\": { \"uuid\": \"Gatilho + Alinhamento\" } }";

            log.info("Enviando {} produtos para a IA...", count);
            String aiResponse = callAiProvider(systemPrompt, userPrompt);
            log.info("Resposta da IA (seleção de IDs): {}", aiResponse);

            // 5. Parse robusto dos IDs selecionados pela IA
            String cleanedResponse = aiResponse.trim();
            if (cleanedResponse.contains("{") && cleanedResponse.contains("}")) {
                int start = cleanedResponse.indexOf("{");
                int end = cleanedResponse.lastIndexOf("}") + 1;
                cleanedResponse = cleanedResponse.substring(start, end);
            }
            
            log.info("Processando JSON de resposta: {}", cleanedResponse);
            Map<String, Object> selection = objectMapper.readValue(cleanedResponse, Map.class);
            
            @SuppressWarnings("unchecked")
            List<String> selectedIdsStr = (List<String>) selection.get("selectedIds");
            @SuppressWarnings("unchecked")
            Map<String, String> justifications = (Map<String, String>) selection.get("justificativas");

            if (selectedIdsStr == null || selectedIdsStr.isEmpty()) {
                log.warn("IA não retornou IDs selecionados. Usando fallback.");
                return getFallbackRecommendations();
            }

            // Converter IDs string para UUID
            List<UUID> selectedIds = selectedIdsStr.stream()
                .map(id -> {
                    try { return UUID.fromString(id.trim()); }
                    catch (Exception e) { return null; }
                })
                .filter(id -> id != null)
                .toList();

            log.info("IDs selecionados pela IA (normalizados): {}", selectedIds);
            
            // Logar se as justificativas vieram preenchidas
            if (justifications != null) {
                log.info("Justificativas recebidas para {} itens.", justifications.size());
            } else {
                log.warn("ATENÇÃO: A IA não retornou o mapa de 'justificativas'.");
            }

            // 6. Buscar produtos pelo ID com verificação de estoque e ativo (SEGURANÇA)
            List<Product> filteredProducts = productRepository.findByIdInAndActiveWithStock(selectedIds);

            // Se a IA retornou IDs mas nenhum está mais disponível em estoque, sinaliza erro ou loga (evitando fallback de mock)
            if (filteredProducts.isEmpty()) {
                log.warn("Nenhum dos produtos selecionados pela IA está disponível em estoque.");
                throw new RuntimeException("A IA selecionou produtos que não estão disponíveis no momento.");
            }

            // 7. Mapear para RecommendationResult
            List<Suggestion> suggestions = filteredProducts.stream()
                .map(p -> {
                    String justification = justifications.getOrDefault(p.getId().toString(), "");

                    String images = p.getImages();
                    String firstImage = "";
                    if (images != null && images.contains("\"")) {
                        firstImage = images.split("\"")[1];
                    } else if (images != null) {
                        firstImage = images;
                    }

                    return Suggestion.builder()
                        .nome(p.getName())
                        .justificativa(justification)
                        .preco("R$ " + p.getPrice().toString().replace('.', ','))
                        .imagem(firstImage)
                        .slug(p.getSlug())
                        .id(p.getId().toString())
                        .build();
                }).toList();

            log.info("Total de sugestões retornadas: {}", suggestions.size());
            RecommendationResult result = new RecommendationResult(suggestions);

            // 8. Filtro de Segurança adicional (Last Line of Defense)
            if (input.getQuery().toLowerCase().contains("não") || 
                input.getQuery().toLowerCase().contains("sem")) {
                String queryLower = input.getQuery().toLowerCase();
                List<RecommendationResult.Suggestion> filtered = result.getSugestoes().stream()
                    .filter(s -> {
                        String nomeLower = s.getNome().toLowerCase();
                        if (queryLower.contains("vinho") && (nomeLower.contains("vinho") || nomeLower.contains("champagne"))) return false;
                        if (queryLower.contains("chocolate") && nomeLower.contains("chocolate")) return false;
                        if (queryLower.contains("álcool") && nomeLower.contains("álcool")) return false;
                        return true;
                    }).toList();
                result.setSugestoes(filtered);
            }

            // Save to DB
            Recommendation recommendation = Recommendation.builder()
                    .userId(userId)
                    .profileData(objectMapper.writeValueAsString(input))
                    .suggestions(objectMapper.writeValueAsString(result))
                    .build();
            recommendationRepository.save(recommendation);

            return result;

        } catch (Exception e) {
            log.error("Erro crítico na recomendação via IA: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao processar recomendações via IA: " + e.getMessage(), e);
        }
    }

    public MessageResponse generateMessage(MessageRequest request) {
        try {
            String systemPrompt = "Você é um Especialista em Curadoria Emocional e Alta Literatura da Regalaya. " +
                "Sua missão é escrever dedicatórias que combinam sofisticação e elegância absoluta. " +
                "REGRAS DE OURO:\n" +
                "1. ALINHAMENTO: Use o contexto fornecido (profissão, hobbies, etc).\n" +
                "2. FORMATO RESTRITO: Comece com 'Para: [Nome]' e termine com 'De: [Nome]'.\n" +
                "3. PROIBIÇÕES: Não use tags markdown, não explique o que fez, não adicione preâmbulos como 'Aqui está sua mensagem'.\n" +
                "4. IDIOMA: Português do Brasil impecável.\n" +
                "5. SAÍDA: Retorne EXCLUSIVAMENTE o texto da dedicatória.";
            
            String userPrompt = String.format(
                "### DADOS DO PEDIDO:\n" +
                "CONTEXTO: %s\n" +
                "RELACIONAMENTO: %s\n" +
                "OCASIÃO: %s\n" +
                "PRODUTOS: %s\n" +
                "TOM: %s\n\n" +
                "### EXEMPLO DE FORMATO ESPERADO:\n" +
                "Para: Ana\n" +
                "Que o brilho deste champagne ilumine sua nova jornada como arquiteta. Sua visão transforma espaços em poesia.\n" +
                "De: Carlos\n\n" +
                "### TAREFA:\n" +
                "Escreva agora a dedicatória para os dados acima. NÃO adicione nada além do texto final.",
                request.getContexto(),
                request.getRelacionamento(),
                request.getOcasiao(),
                request.getProduto(),
                request.getTom() != null ? request.getTom() : "emocional"
            );

            String mensagem = callAiProvider(systemPrompt, userPrompt);
            return MessageResponse.builder().mensagem(mensagem.trim()).build();
        } catch (Exception e) {
            log.error("Erro ao gerar mensagem com IA: {}. Usando fallback elegante.", e.getMessage());
            String simpleMessage = String.format(
                "Para: %s\n\nQue este presente cure instantes de alegria e celebre a beleza da nossa conexão. Cada item foi escolhido pensando na sofisticação que você merece.\n\nCom carinho, %s",
                request.getContexto().contains("Para:") ? "Você" : "Alguém Especial",
                request.getContexto().contains("De:") ? "" : "Equipe Regalaya"
            );
            return MessageResponse.builder().mensagem(simpleMessage).build();
        }
    }

    public ChatResponse chat(ChatRequest request) {
        try {
            String systemPrompt = "Você é o Concierge Regalaya, um assistente de presentes de alto padrão, educado, prestativo e sofisticado. " +
                "Sua missão é ajudar o cliente a escolher o presente perfeito, tirando dúvidas sobre produtos, ocasiões e etiqueta de presentes. " +
                "REGRAS:\n" +
                "1. TOM: Elegante, caloroso e profissional.\n" +
                "2. FOCO: Presentes, cestas premium, vinhos, joias e bem-estar.\n" +
                "3. SUGESTÕES: Sempre que o cliente pedir ideias, recomende categorias que temos (VinhosPremium, ChocolatesArtesanais, BemEstar, Joias).\n" +
                "4. CONTEXTO: Responda de forma concisa e útil.";

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            
            for (ChatMessageDto msg : request.messages()) {
                messages.add(Map.of("role", msg.role(), "content", msg.content()));
            }

            // Chamada direta para o provedor com o histórico
            String aiResponse = callAiProviderWithHistory(messages);
            
            return new ChatResponse(aiResponse, List.of("Ideias de presente", "Como funciona a entrega?", "Kits de vinho"), null);
        } catch (Exception e) {
            log.error("Erro no chat com IA: {}", e.getMessage());
            return new ChatResponse("Desculpe, estou com uma instabilidade momentânea. Posso te ajudar com algo específico sobre nossos presentes?", List.of("Ver produtos"), null);
        }
    }

    private String callAiProviderWithHistory(List<Map<String, String>> chatMessages) {
        long startTime = System.currentTimeMillis();
        log.info("Iniciando chamada de Chat IA: Provedor={}, Modelo={}", aiBaseUrl, aiModel);
        
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(300000); 
        factory.setReadTimeout(300000);    
        
        RestTemplate restTemplate = new RestTemplate(factory);
        restTemplate.getMessageConverters()
            .add(0, new org.springframework.http.converter.StringHttpMessageConverter(java.nio.charset.StandardCharsets.UTF_8));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(aiApiKey);
        
        Map<String, Object> body = new HashMap<>();
        body.put("model", aiModel);
        body.put("messages", chatMessages);
        body.put("temperature", 0.7); 
        body.put("max_tokens", 1000); 
        body.put("stream", false);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(
                aiBaseUrl + (aiBaseUrl.endsWith("/") ? "chat/completions" : "/chat/completions"),
                entity,
                Map.class
            );

            Map response = responseEntity.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");
            
            // Limpeza básica se houver reasoning
            String reasoning = (String) message.get("reasoning");
            if ((content == null || content.trim().isEmpty()) && reasoning != null) content = reasoning;

            return cleanAiChatResponse(content);
        } catch (Exception ex) {
            log.error("Falha na chamada de Chat: " + ex.getMessage());
            throw new RuntimeException("AI Chat failure");
        }
    }
    
    private String cleanAiChatResponse(String content) {
        if (content == null) return "";
        String cleaned = content.replaceAll("(?s)<thought>.*?</thought>", "");
        cleaned = cleaned.replaceAll("(?s)<reasoning>.*?</reasoning>", "");
        return cleaned.trim();
    }

    private String callAiProvider(String systemPrompt, String userMessage) {
        long startTime = System.currentTimeMillis();
        log.info("Chamando AI Provider ({}) com timeout de 5 minutos...", aiModel);
        
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(300000); // 5 minutos
        factory.setReadTimeout(300000);    // 5 minutos
        
        log.info("Iniciando chamada de IA: Provedor={}, Modelo={}", aiBaseUrl, aiModel);
        
        RestTemplate restTemplate = new RestTemplate(factory);
        // Garante UTF-8 para evitar caracteres corrompidos (Mojibake)
        restTemplate.getMessageConverters()
            .add(0, new org.springframework.http.converter.StringHttpMessageConverter(java.nio.charset.StandardCharsets.UTF_8));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(aiApiKey);
        
        if (aiBaseUrl.contains("openrouter.ai")) {
            headers.set("HTTP-Referer", "https://regalaya.com");
            headers.set("X-Title", "Regalaya Gift Assistant");
        }

        Map<String, Object> body = new HashMap<>();
        body.put("model", aiModel);
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userMessage));
        body.put("messages", messages);
        
        body.put("temperature", 0.5); // Aumentado levemente para fluidez, mas mantendo controle
        body.put("max_tokens", 1000); // Reduzido drasticamente para evitar respostas intermináveis e timeouts
        body.put("stream", false);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        
        try {
            log.debug("Payload enviado: {}", objectMapper.writeValueAsString(body));
            
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(
                aiBaseUrl + (aiBaseUrl.endsWith("/") ? "chat/completions" : "/chat/completions"),
                entity,
                Map.class
            );

            Map response = responseEntity.getBody();
            log.info("Corpo da resposta bruto do Provider: {}", response);

            if (response == null || !response.containsKey("choices")) {
                log.error("Resposta inválida do Provedor de IA. Status: {}. Body: {}", 
                    responseEntity.getStatusCode(), response);
                throw new RuntimeException("Resposta inválida do AI Provider: " + response);
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("AI Provider retornou lista de choices vazia");
            }

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");
            String reasoning = (String) message.get("reasoning");
            
            // Se o content estiver vazio mas houver reasoning, tenta usar o reasoning
            if ((content == null || content.trim().isEmpty()) && reasoning != null && !reasoning.trim().isEmpty()) {
                log.info("Content vazio, mas encontrou reasoning. Usando reasoning como fonte.");
                content = reasoning;
            }
            
            if (content == null || content.trim().isEmpty()) {
                log.error("Conteúdo da mensagem da IA veio vazio.");
                throw new RuntimeException("AI Provider retornou conteúdo vazio.");
            }

            content = cleanAiResponse(content);
            
            if (content.isEmpty()) {
                throw new RuntimeException("Conteúdo da IA ficou vazio após a limpeza.");
            }

            long duration = System.currentTimeMillis() - startTime;
            log.info("Sugestão recebida da IA com sucesso em {}ms.", duration);
            return content;
        } catch (Exception ex) {
            log.error("Falha na chamada REST para AI Provider: " + ex.getMessage(), ex);
            throw new RuntimeException("AI Provider failure", ex);
        }
    }

    private String cleanAiResponse(String content) {
        if (content == null) return "";
        
        // Remove tags de pensamento comuns em modelos locais (DeepSeek, etc)
        String cleaned = content.replaceAll("(?s)<thought>.*?</thought>", "");
        cleaned = cleaned.replaceAll("(?s)<reasoning>.*?</reasoning>", "");
        
        // Remove preâmbulos chatos e JSON residual
        cleaned = cleaned.replaceAll("(?i)^.*?Para:", "Para:");
        
        // Remove rastro de 'reasoning=' que modelos mal-treinados às vezes cospem
        int reasoningIdx = cleaned.indexOf("reasoning=");
        if (reasoningIdx != -1) {
            cleaned = cleaned.substring(0, reasoningIdx);
        }

        return cleaned.trim();
    }

    private String loadTemplate(String path) throws IOException {
        Resource resource = resourceLoader.getResource(path);
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    private RecommendationResult getFallbackRecommendations() {
        // Buscar produtos ativos com estoque para fallback
        List<Product> productsWithStock = productRepository.findAllActiveWithStock();
        
        // Se não tiver produtos com estoque, buscar qualquer ativo
        if (productsWithStock.isEmpty()) {
            productsWithStock = productRepository.findByIsActiveTrue(PageRequest.of(0, 3)).getContent();
        }
        
        List<RecommendationResult.Suggestion> suggestions = productsWithStock.stream().map(p -> {
            String images = p.getImages();
            String firstImage = "";
            if (images != null && images.contains("\"")) {
                firstImage = images.split("\"")[1]; 
            } else if (images != null) {
                firstImage = images;
            }
            return RecommendationResult.Suggestion.builder()
                    .id(p.getId().toString())
                    .slug(p.getSlug())
                    .nome(p.getName())
                    .justificativa("")
                    .preco("R$ " + p.getPrice().toString().replace('.', ','))
                    .imagem(firstImage)
                    .build();
        }).toList();

        return RecommendationResult.builder().sugestoes(suggestions).build();
    }

    /**
     * Busca produtos por tag/nome com estoque >= 1 — sem IA, SQL direto.
     * Usado pelo chat para exibir cards relevantes em toda interação.
     */
    public List<br.com.regalaya.product.dto.responses.ProductResponse> findProductsByTag(String tag, int maxResults) {
        // Busca pela relação Tag entity (ManyToMany) primeiro
        List<br.com.regalaya.product.domain.model.Product> products = productRepository.findByTagNameWithStock(tag);
        // Complementa com busca legada em tags/name se necessário
        if (products.size() < maxResults) {
            List<br.com.regalaya.product.domain.model.Product> native_ = productRepository.findByTagWithStock(tag, maxResults);
            for (var p : native_) {
                if (products.stream().noneMatch(cp -> cp.getId().equals(p.getId()))) {
                    products.add(p);
                }
            }
        }
        return products.stream()
            .limit(maxResults)
            .map(productMapper::toResponse)
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Extrai palavras-chave relevantes da query do usuário para busca no banco de dados.
     * Remove stop words em português e retorna termos com 3+ caracteres.
     */
    private List<String> extractKeywords(String query) {
        if (query == null || query.isBlank()) return List.of();

        Set<String> stopWords = Set.of(
            "de", "da", "do", "das", "dos", "para", "com", "sem", "por", "uma", "um",
            "que", "em", "no", "na", "nos", "nas", "ao", "aos", "às", "quero", "busco",
            "preciso", "gostaria", "presente", "presentes", "ideia", "ideias", "me",
            "seu", "sua", "meu", "minha", "boa", "bom", "ótimo", "ótima", "legal",
            "tenho", "procuro", "tipo", "algo", "algum", "ele", "ela", "eles", "elas",
            "ser", "ter", "vai", "pra", "qua", "qual", "como", "mais", "vou", "the",
            "and", "for", "gift", "ver", "isso", "essa", "este", "esta", "este"
        );

        return Arrays.stream(query.toLowerCase()
                .replaceAll("[^a-záàâãéèêíìîóòôõúùûç0-9 ]", " ")
                .split("\\s+"))
            .filter(word -> word.length() >= 3 && !stopWords.contains(word))
            .distinct()
            .limit(5)
            .collect(java.util.stream.Collectors.toList());
    }
}
