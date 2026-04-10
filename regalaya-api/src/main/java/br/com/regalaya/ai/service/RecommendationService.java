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

            // 3. Montar inventory reduzido para IA - LIMITE DE 10 ITENS PARA TESTE DE CONTEXTO
            StringBuilder inventoryBuilder = new StringBuilder();
            int count = 0;
            for (Product p : productsWithDetails) {
                if (count++ >= 10) break; 
                String desc = p.getShortDescription() != null ? p.getShortDescription() :
                             p.getDescription() != null ? p.getDescription() : "";
                inventoryBuilder.append(p.getId().toString())
                    .append(": ")
                    .append(p.getName())
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
            // Carregar prompt templates
            String systemPromptTemplate = loadTemplate("classpath:prompts/message-system-prompt.pt");
            String userPromptTemplate = loadTemplate("classpath:prompts/message-user-prompt.pt");

            // Determinar instruções de comprimento
            String comprimentoInstrucao = switch (request.getComprimento() != null ? request.getComprimento() : "medio") {
                case "curto" -> "Curto: 50-100 palavras, direto e impactante.";
                case "longo" -> "Longo: 200-400 palavras, detalhado e emocional.";
                default -> "Médio: 100-200 palavras, equilibrado e significativo.";
            };

            String systemPrompt = systemPromptTemplate.trim();
            String userPrompt = userPromptTemplate
                    .replace("{{ocasiao}}", request.getOcasiao())
                    .replace("{{relacionamento}}", request.getRelacionamento())
                    .replace("{{produto}}", request.getProduto() != null ? request.getProduto() : "")
                    .replace("{{comprimento}}", comprimentoInstrucao);

            String mensagem = callAiProvider(systemPrompt, userPrompt);
            return MessageResponse.builder().mensagem(mensagem.trim()).build();
        } catch (Exception e) {
            log.error("Erro ao gerar mensagem com IA", e);
            throw new RuntimeException("Falha ao gerar mensagem com IA: " + e.getMessage(), e);
        }
    }

    private String callAiProvider(String systemPrompt, String userMessage) {
        long startTime = System.currentTimeMillis();
        log.info("Chamando AI Provider ({}) com timeout de 5 minutos...", aiModel);
        
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(300000); // 5 minutos
        factory.setReadTimeout(300000);    // 5 minutos
        
        RestTemplate restTemplate = new RestTemplate(factory);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(aiApiKey);
        
        // Headers adaptáveis conforme o provedor
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
        
        // Parâmetros de controle
        body.put("temperature", 0.1); // Temperatura mínima para evitar divagações
        body.put("max_tokens", 4000); // Aumentado para suportar reasoning se houver, mas o prompt proíbe

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        
        try {
            log.debug("Payload enviado: {}", objectMapper.writeValueAsString(body));
            
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(
                aiBaseUrl + "/chat/completions",
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
            // (Comum em modelos como Kimi/DeepSeek no Ollama)
            if ((content == null || content.trim().isEmpty()) && reasoning != null && !reasoning.trim().isEmpty()) {
                log.info("Content vazio, mas encontrou reasoning. Usando reasoning como fonte.");
                content = reasoning;
            }
            
            if (content == null || content.trim().isEmpty()) {
                String rawBodyStr = (response != null) ? response.toString() : "NULL BODY";
                System.err.println("CRITICAL: AI Content is empty! Raw body: " + rawBodyStr);
                log.error("Conteúdo da mensagem da IA veio vazio. Body completo: {}", rawBodyStr);
                throw new RuntimeException("AI Provider retornou conteúdo vazio. Body: " + rawBodyStr);
            }
            
            long duration = System.currentTimeMillis() - startTime;
            log.info("Sugestão recebida da IA com sucesso em {}ms.", duration);
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
                    .justificativa("")
                    .preco("R$ " + p.getPrice().toString().replace('.', ','))
                    .imagem(firstImage)
                    .build();
        }).toList();

        return RecommendationResult.builder().sugestoes(suggestions).build();
    }
}
