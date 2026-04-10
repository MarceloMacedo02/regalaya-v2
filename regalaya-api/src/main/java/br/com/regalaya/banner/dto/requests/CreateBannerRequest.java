package br.com.regalaya.banner.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBannerRequest {

    @NotBlank(message = "Título é obrigatório")
    private String title;

    private String subtitle;

    @NotBlank(message = "URL da imagem é obrigatória")
    private String imageUrl;

    private String link;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Integer displayOrder = 0;

    private String placement;
}
