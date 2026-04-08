package br.com.regalaya.order.dto.requests;

import br.com.regalaya.order.domain.model.RefundType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record RefundRequest(
    @NotNull(message = "Tipo de reembolso é obrigatório")
    RefundType type,

    @Positive(message = "Valor deve ser maior que zero")
    BigDecimal amount, // Required for PARTIAL, optional for FULL

    @NotBlank(message = "Justificativa é obrigatória")
    @Size(min = 20, message = "Justificativa deve ter no mínimo 20 caracteres")
    String reason
) {}