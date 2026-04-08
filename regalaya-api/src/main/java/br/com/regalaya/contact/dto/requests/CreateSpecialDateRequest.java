package br.com.regalaya.contact.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateSpecialDateRequest(
    @NotBlank(message = "Tipo de data é obrigatório")
    @Pattern(regexp = "BIRTHDAY|ANNIVERSARY|CHRISTMAS|WEDDING|CUSTOM", 
             message = "Tipo deve ser: BIRTHDAY, ANNIVERSARY, CHRISTMAS, WEDDING ou CUSTOM")
    String type,

    @NotNull(message = "Data é obrigatória")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Data deve estar no formato YYYY-MM-DD")
    String date,

    @NotBlank(message = "Recorrência é obrigatória")
    @Pattern(regexp = "YEARLY|MONTHLY|ONCE", 
             message = "Recorrência deve ser: YEARLY, MONTHLY ou ONCE")
    String recurrence
) {}
