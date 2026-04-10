package br.com.regalaya.banner.dto.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBannerRequest {

    private String title;

    private String subtitle;

    private String imageUrl;

    private String link;

    private Boolean isActive;

    private Integer displayOrder;

    private String placement;
}
