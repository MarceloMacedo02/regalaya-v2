package br.com.regalaya.cms.dto.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCmsPageRequest {

    @NotBlank(message = "Slug é obrigatório")
    private String slug;

    @NotBlank(message = "Título é obrigatório")
    private String title;

    private String content;
    private String metaDescription;
    private String metaKeywords;

    @Builder.Default
    private Boolean isPublished = false;

    @Builder.Default
    private Integer displayOrder = 0;
}
