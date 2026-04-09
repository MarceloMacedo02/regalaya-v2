package br.com.regalaya.ai.service;

import br.com.regalaya.ai.domain.model.Recommendation;
import br.com.regalaya.ai.model.MessageRequest;
import br.com.regalaya.ai.model.MessageResponse;
import br.com.regalaya.ai.model.ProfileInput;
import br.com.regalaya.ai.model.RecommendationResult;
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
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final RestTemplate restTemplate = new RestTemplate();

    public RecommendationResult recommend(UUID userId, ProfileInput input) {
        try {
            // Load templates
            String systemPromptStr = loadTemplate("classpath:prompts/recommendation-system-prompt.pt");
            String userPromptStr = loadTemplate("classpath:prompts/recommendation-user-prompt.pt");

            // 1. Extração pragmática usando chamada REST direta - Extraindo termos positivos e negativos
            log.info("Processando pedido: {}", input.getQuery());
            String extractPrompt = "Analise o pedido e extraia: 1) Palavras-chave dos PRODUTOS e TEMAS desejados. 2) Termos que devem ser EXCLUÍDOS (filtros negativos). Responda APENAS os termos positivos separados por vírgula. Frase: " + input.getQuery();
            String keywordsStr = callAiProvider("Você é um especialista em busca semântica. Retorne apenas os termos de busca positivos separados por vírgula.", extractPrompt);
            
            log.info("Palavras-chave extraídas para o banco: {}", keywordsStr);

            // 2. Busca dinâmica no banco (SQL Dinâmico via Repository) em múltiplos campos
            List<Product> products = new ArrayList<>();
            String[] terms = keywordsStr.split(",");
            for (String kw : terms) {
                String cleanKw = kw.trim();
                if(!cleanKw.isBlank() && cleanKw.length() > 2) {
                    log.info("Executando busca SQL para o termo: {}", cleanKw);
                    products.addAll(productRepository.findByKeyword(cleanKw, PageRequest.of(0, 10)));
                }
            }

            // 3. Fallback: Se a busca específica não achar nada, traz gerais para a IA filtrar
            if(products.isEmpty()) {
                log.info("Nenhum produto encontrado na busca por palavras-chave. Usando fallback de ativos.");
                products = productRepository.findByIsActiveTrue(PageRequest.of(0, 40)).getContent();
            } else {
                products = products.stream().distinct().toList();
                log.info("Encontrados {} produtos únicos na base.", products.size());
            }

            // 4. Mapeamento Enriquecido (Enviando Detalhes, Tags e Descrição para a IA decidir melhor)
            List<Map<String, Object>> inventoryList = products.stream()
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", p.getId().toString());
                    map.put("slug", p.getSlug());
                    map.put("name", p.getName());
                    map.put("price", p.getPrice());
                    map.put("description", p.getShortDescription() != null ? p.getShortDescription() : p.getDescription());
                    map.put("tags", p.getTags());
                    map.put("category", p.getCategory() != null ? p.getCategory().getName() : "");
                    
                    String images = p.getImages();
                    String firstImage = "";
                    if (images != null && images.contains("\"")) {
                        firstImage = images.split("\"")[1]; 
                    } else if (images != null) {
                        firstImage = images;
                    }
                    map.put("image", firstImage);
                    return map;
                }).toList();
            
            String inventoryJson = objectMapper.writeValueAsString(inventoryList);

            // Replace values dynamically (LangChain4j syntax fallback)
            String finalUserMessage = userPromptStr
                .replace("{{inventory}}", inventoryJson).replace("{inventory}", inventoryJson)
                .replace("{{query}}", input.getQuery()).replace("{query}", input.getQuery());

            log.info("PROMPT ENVIADO PARA IA:\n{}", finalUserMessage);

            // 5. Chamada de recomendação oficial
            String response = callAiProvider(systemPromptStr, finalUserMessage);
            
            log.info("RESULTADO DO PROMPT (IA):\n{}", response);
            
            response = response.replaceAll("```json", "").replaceAll("```", "").trim();
            RecommendationResult result = objectMapper.readValue(response, RecommendationResult.class);

            // 6. Filtro de Segurança (Last Line of Defense)
            // Mesmo que a IA falhe ou retorne algo errado, filtramos termos proibidos explicitamente
            if (input.getQuery().toLowerCase().contains("não quero") || input.getQuery().toLowerCase().contains("não inclua")) {
                String queryLower = input.getQuery().toLowerCase();
                List<RecommendationResult.Suggestion> filtered = result.getSugestoes().stream()
                    .filter(s -> {
                        boolean forbidden = false;
                        if (queryLower.contains("vinho") && (s.getNome().toLowerCase().contains("vinho") || s.getNome().toLowerCase().contains("champagne"))) forbidden = true;
                        if (queryLower.contains("chocolate") && s.getNome().toLowerCase().contains("chocolate")) forbidden = true;
                        return !forbidden;
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
            log.error("Error generating recommendations via REST, returning fallback", e);
            RecommendationResult fallback = getFallbackRecommendations();
            
            // Aplica filtro de segurança no fallback também!
            if (input.getQuery().toLowerCase().contains("vinho") && (input.getQuery().toLowerCase().contains("não") || input.getQuery().toLowerCase().contains("sem"))) {
                List<RecommendationResult.Suggestion> filtered = fallback.getSugestoes().stream()
                    .filter(s -> !s.getNome().toLowerCase().contains("vinho") && !s.getNome().toLowerCase().contains("champagne"))
                    .toList();
                fallback.setSugestoes(filtered);
            }
            
            return fallback;
        }
    }

    public MessageResponse generateMessage(MessageRequest request) {
        try {
            String systemPrompt = "Você é um assistente criativo e empático da Regalaya, especializado em escrever mensagens de presente memoráveis.";
            String userPrompt = String.format(
                "Escreva uma mensagem de presente curta e carinhosa para uma pessoa que é meu/minha %s, na ocasião de %s. O presente é um %s. O tom deve ser %s.",
                request.getRelacionamento(),
                request.getOcasiao(),
                request.getProduto(),
                request.getTom() != null ? request.getTom() : "sentimental"
            );

            String mensagem = callAiProvider(systemPrompt, userPrompt);
            return MessageResponse.builder().mensagem(mensagem.trim()).build();
        } catch (Exception e) {
            log.error("Erro ao gerar mensagem com IA", e);
            return MessageResponse.builder()
                .mensagem("Parabéns por essa data tão especial! Que este presente traga muita alegria e momentos inesquecíveis.")
                .build();
        }
    }

    private String callAiProvider(String systemPrompt, String userMessage) {
        log.info("Chamando AI Provider (OpenRouter)... URL: {}/chat/completions", aiBaseUrl);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(aiApiKey);
        
        // Headers recomendados e necessários pelo OpenRouter
        headers.set("HTTP-Referer", "https://regalaya.com");
        headers.set("X-Title", "Regalaya Gift Assistant");

        Map<String, Object> body = new HashMap<>();
        body.put("model", aiModel);
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userMessage));
        body.put("messages", messages);
        
        // Habilitar raciocínio conforme solicitado pelo usuário
        body.put("reasoning", Map.of("enabled", true));
        body.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        
        try {
            log.debug("Payload enviado: {}", objectMapper.writeValueAsString(body));
            
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(
                aiBaseUrl + "/chat/completions",
                entity,
                Map.class
            );

            Map response = responseEntity.getBody();
            if (response == null || !response.containsKey("choices")) {
                log.error("Resposta inválida do OpenRouter. Status: {}. Body: {}", 
                    responseEntity.getStatusCode(), response);
                throw new RuntimeException("Resposta inválida do AI Provider");
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");
            
            log.info("Sugestão recebida da IA com sucesso.");
            return content;
        } catch (Exception ex) {
            log.error("Falha na chamada REST para AI Provider: " + ex.getMessage(), ex);
            throw new RuntimeException("AI Provider failure", ex);
        }
    }

    private String loadTemplate(String path) throws IOException {
        Resource resource = resourceLoader.getResource(path);
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    private RecommendationResult getFallbackRecommendations() {
        List<Product> topProducts = productRepository.findByIsActiveTrue(PageRequest.of(0, 3)).getContent();
        List<RecommendationResult.Suggestion> suggestions = topProducts.stream().map(p -> {
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
                    .justificativa("Um dos produtos mais incríveis e amados pelos nossos clientes!")
                    .preco("R$ " + p.getPrice().toString().replace('.', ','))
                    .imagem(firstImage)
                    .build();
        }).toList();

        return RecommendationResult.builder().sugestoes(suggestions).build();
    }
}
