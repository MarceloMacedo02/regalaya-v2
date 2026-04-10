package br.com.regalaya.settings.dto.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStoreSettingsRequest {

    @NotBlank(message = "Valor é obrigatório")
    private String settingValue;
}
