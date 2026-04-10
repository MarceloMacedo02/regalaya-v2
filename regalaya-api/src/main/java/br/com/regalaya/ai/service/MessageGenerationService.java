package br.com.regalaya.ai.service;

import br.com.regalaya.ai.model.MessageRequest;
import br.com.regalaya.ai.model.MessageResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Map;

@Slf4j
@Service
public class MessageGenerationService {

    private final RecommendationService recommendationService;
    private final ResourceLoader resourceLoader;

    @Value("${app.ai.openrouter.api-key:}")
    private String aiApiKey;

    @Value("${app.ai.openrouter.model:}")
    private String aiModel;

    @Value("${app.ai.openrouter.base-url:}")
    private String aiBaseUrl;

    public MessageGenerationService(RecommendationService recommendationService, ResourceLoader resourceLoader) {
        this.recommendationService = recommendationService;
        this.resourceLoader = resourceLoader;
    }

    public MessageResponse generateMessage(MessageRequest request) {
        try {
            log.info("Gerando mensagem personalizada - ocasião: {}, relacionamento: {}, produto: {}, comprimento: {}",
                    request.getOcasiao(), request.getRelacionamento(), request.getProduto(), request.getComprimento());

            // Delegar para o serviço existente que já tem a chamada à IA
            MessageResponse response = recommendationService.generateMessage(request);

            if (response != null && response.getMensagem() != null && !response.getMensagem().trim().isEmpty()) {
                return response;
            }

            // Fallback se a IA retornou vazio
            log.warn("IA retornou mensagem vazia, usando fallback");
            return getFallbackMessage(request);

        } catch (Exception e) {
            log.error("Erro ao gerar mensagem personalizada: {}", e.getMessage(), e);
            return getFallbackMessage(request);
        }
    }

    /**
     * Mensagens fallback predefinidas por ocasião.
     */
    private MessageResponse getFallbackMessage(MessageRequest request) {
        String ocasiao = request.getOcasiao().toLowerCase();
        String produto = request.getProduto() != null ? request.getProduto() : "este presente";
        String nome = request.getContexto() != null ? request.getContexto() : "";

        String message = switch (ocasiao) {
            case "aniversário", "aniversario" ->
                String.format("Que a alegria deste dia especial se multiplique em cada momento ao seu lado. %s foi escolhido com todo carinho para celebrar você. %s", produto, nome.isEmpty() ? "" : "Com todo meu amor, " + nome);
            case "dia das mães", "dia das maes" ->
                String.format("Para quem me ensinou o significado do amor incondicional. %s é um pequeno gesto diante de tudo que você representa. %s", produto, nome.isEmpty() ? "" : "Com carinho eterno, " + nome);
            case "dia dos pais" ->
                String.format("Sua força e sabedoria são minha maior inspiração. %s é uma forma de dizer obrigado por tudo. %s", produto, nome.isEmpty() ? "" : "Com admiração, " + nome);
            case "namorados", "dia dos namorados" ->
                String.format("Cada dia ao seu lado é um presente. %s é só uma pequena lembrança do quanto você é especial para mim. %s", produto, nome.isEmpty() ? "" : "Com todo meu amor, " + nome);
            case "natal" ->
                String.format("Que a magia do Natal ilumine seu coração. %s vem carregado de amor e boas energias para este momento tão especial. %s", produto, nome.isEmpty() ? "" : "Feliz Natal, " + nome);
            case "amigo secreto", "amigo oculto" ->
                String.format("Com muito carinho e alegria, escolhi %s pensando em você. Que traga sorrisos e momentos especiais! %s", produto, nome.isEmpty() ? "" : "Um abraço, " + nome);
            default ->
                String.format("Pensei em algo especial para você: %s. Que esta surpresa traga um sorriso ao seu dia! %s", produto, nome.isEmpty() ? "" : "Com carinho, " + nome);
        };

        return MessageResponse.builder().mensagem(message).build();
    }
}
