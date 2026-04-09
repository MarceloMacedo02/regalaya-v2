package br.com.regalaya.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResult {
    private List<Suggestion> sugestoes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Suggestion {
        private String id;
        private String slug;
        private String nome;
        private String justificativa;
        private String preco;
        private String imagem;
    }
}
