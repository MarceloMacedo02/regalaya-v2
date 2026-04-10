package br.com.regalaya.ai.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    @NotBlank(message = "Ocasião é obrigatória")
    private String ocasiao;

    @NotBlank(message = "Relacionamento é obrigatório")
    private String relacionamento;

    @NotBlank(message = "Produto é obrigatório")
    private String produto;

    private String tom; // sentimental, formal, engraçado

    private String contexto; // A query original do usuário para mais personalização

    @Builder.Default
    private String comprimento = "medio"; // curto, medio, longo
}
