package br.com.regalaya.cms.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCmsPageRequest {
    private String title;
    private String content;
    private String metaDescription;
    private String metaKeywords;
    private Boolean isPublished;
    private Integer displayOrder;
}
