package br.com.regalaya.communication.dto.request;

import br.com.regalaya.communication.domain.enums.CommunicationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TemplateRequest(

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String name,

        @NotNull(message = "O tipo de comunicação é obrigatório")
        CommunicationType type,

        @Size(max = 200, message = "O assunto deve ter no máximo 200 caracteres")
        String subject,

        @NotBlank(message = "O conteúdo é obrigatório")
        String content,

        String variables,

        @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
        String description,

        Boolean isActive,

        @Size(max = 100, message = "A categoria deve ter no máximo 100 caracteres")
        String category
) {
}
