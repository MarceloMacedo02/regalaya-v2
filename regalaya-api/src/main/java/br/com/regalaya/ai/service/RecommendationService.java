package br.com.regalaya.ai.service;

import br.com.regalaya.ai.domain.model.Recommendation;
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
            log.info("Processando pedido: {}", input.getQuery());

            // 1. Buscar TODOS os IDs de produtos ativos com estoque > 0 (ótimo para a IA filtrar)
            List<UUID> allProductIds = productRepository.findAllActiveWithStockIds();
            log.info("Total de produtos ativos com estoque: {}", allProductIds.size());

            // Se não tiver produtos, retorna fallback
            if (allProductIds.isEmpty()) {
                log.warn("Nenhum produto ativo com estoque encontrado.");
                return getFallbackRecommendations();
            }

            // 2. Buscar detalhes mínimos dos produtos (ID, Name, Description) - só os que têm estoque
            List<Product> productsWithDetails = productRepository.findAllActiveWithStock();

            // 3. Montar inventory reduzido para IA (sem imagens, sem preços - só ID, Name, Description)
            StringBuilder inventoryBuilder = new StringBuilder();
            for (Product p : productsWithDetails) {
                String desc = p.getShortDescription() != null ? p.getShortDescription() :
                             p.getDescription() != null ? p.getDescription() : "";
                inventoryBuilder.append(p.getId().toString())
                    .append(": ")
                    .append(p.getName())
                    .append(" - ")
                    .append(desc.substring(0, Math.min(desc.length(), 100)))
                    .append("\n");
            }

            // 4. Prompt para IA filtrar por ID
            String userPrompt = String.format(
                "Analise o pedido do cliente: \"%s\"\n\n" +
                "Produtos disponíveis (ID: Nome - Descrição):\n%s\n\n" +
                "INSTRUÇÕES:\n" +
                "1. Selecione ATÉ 5 produtos que melhor atende ao pedido.\n" +
                "2. Considere: nome, descrição, palavras-chave do pedido.\n" +
                "3. Se o pedido contém restrições negativas (ex: 'sem vinho', 'não quero chocolate'), RESPECTE-AS.\n" +
                "4. Retorne APENAS JSON: { \"selectedIds\": [\"id1\", \"id2\", ...], \"justificativas\": { \"id1\": \"justificativa\", ... } }",
                input.getQuery(),
                inventoryBuilder.toString()
            );

            String systemPrompt = "Você é um assistente de e-commerce especializado em sugerir presentes perfeitos. " +
                "Analise as preferências do cliente e selecione os melhores produtos do catálogo.";

            log.info("Enviando {} produtos para a IA analisar...", productsWithDetails.size());
            String aiResponse = callAiProvider(systemPrompt, userPrompt);
            log.info("Resposta da IA (seleção de IDs): {}", aiResponse);

            // 5. Parse dos IDs selecionados pela IA
            String cleanedResponse = aiResponse.replaceAll("```json", "").replaceAll("```", "").trim();
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

            log.info("IDs selecionados pela IA: {}", selectedIds);

            // 6. Buscar produtos pelo ID com verificação de estoque e ativo (SEGURANÇA)
            List<Product> filteredProducts = productRepository.findByIdInAndActiveWithStock(selectedIds);

            // Se a IA retornou IDs mas nenhum está mais disponível em estoque, usar fallback
            if (filteredProducts.isEmpty()) {
                log.warn("Nenhum dos produtos selecionados pela IA está disponível em estoque. Usando fallback.");
                return getFallbackRecommendations();
            }

            // 7. Mapear para RecommendationResult
            List<Suggestion> suggestions = filteredProducts.stream()
                .map(p -> {
                    String justification = justifications.getOrDefault(p.getId().toString(), 
                        "Uma excelente escolha baseada no seu pedido!");

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
            log.error("Erro ao gerar recomendações, retornando fallback", e);
            return getFallbackRecommendations();
        }
    }

    public MessageResponse generateMessage(MessageRequest request) {
        try {
            String systemPrompt = "Você é um mestre da escrita criativa e assistente pessoal de elite da Regalaya. " +
                "Sua especialidade é criar dedicatórias e mensagens de presentes que tocam o coração, evitando clichês e generalismos. " +
                "Você deve escrever a mensagem no MESMO IDIOMA em que o pedido foi feito (ex: se o pedido for em inglês, escreva em inglês).";
            
            String userPrompt = String.format(
                "Crie uma mensagem de presente EXTREMAMENTE personalizada.\n" +
                "RELACIONAMENTO: %s\n" +
                "OCASIÃO: %s\n" +
                "PRODUTO: %s\n" +
                "TOM DESEJADO: %s\n" +
                "CONTEXTO ADICIONAL (Use para personalizar): %s\n\n" +
                "REGRAS:\n" +
                "1. Seja específico. Se o contexto diz que ela é arquiteta, use isso.\n" +
                "2. NÃO use frases prontas como 'parabéns por essa data'.\n" +
                "3. A mensagem deve ser curta (máx 3-4 frases) mas impactante.\n" +
                "4. Mantenha o idioma do contexto fornecido.",
                request.getRelacionamento(),
                request.getOcasiao(),
                request.getProduto(),
                request.getTom() != null ? request.getTom() : "sentimental",
                request.getContexto() != null ? request.getContexto() : "Nenhum contexto extra"
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
                    .justificativa("Um dos produtos mais incríveis e amados pelos nossos clientes!")
                    .preco("R$ " + p.getPrice().toString().replace('.', ','))
                    .imagem(firstImage)
                    .build();
        }).toList();

        return RecommendationResult.builder().sugestoes(suggestions).build();
    }
}
