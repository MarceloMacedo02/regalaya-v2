package br.com.regalaya.order.dto.requests;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Size;

public record CreateCheckoutRequest(
    UUID addressId,

    @Size(max = 30, message = "Forma de pagamento deve ter no máximo 30 caracteres")
    String paymentMethod,

    LocalDateTime scheduledAt,

    @Size(max = 1000, message = "Observações devem ter no máximo 1000 caracteres")
    String notes,

    @Size(max = 5000, message = "Mensagem deve ter no máximo 5000 caracteres")
    String message
) {}
