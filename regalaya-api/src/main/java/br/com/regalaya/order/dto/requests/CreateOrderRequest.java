package br.com.regalaya.order.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CreateOrderRequest(
    @NotBlank(message = "Nome do cliente é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    String customerName,

    @NotBlank(message = "Email do cliente é obrigatório")
    @Email(message = "Email inválido")
    String customerEmail,

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    String customerPhone,

    @NotEmpty(message = "Pedido deve ter pelo menos um item")
    List<CreateOrderItemRequest> items,

    UUID addressId,

    String shippingAddress,

    @Size(max = 50, message = "Forma de pagamento deve ter no máximo 50 caracteres")
    String paymentMethod,

    @Size(max = 1000, message = "Observações devem ter no máximo 1000 caracteres")
    String notes,

    @Size(max = 5000, message = "Mensagem deve ter no máximo 5000 caracteres")
    String message,

    LocalDateTime scheduledAt
) {}
