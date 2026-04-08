package br.com.regalaya.order.dto.requests;

import br.com.regalaya.order.domain.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
    @NotNull(message = "Status é obrigatório")
    OrderStatus status,

    String notes,

    String trackingCode,

    @NotNull(message = "Informar se deve enviar notificação")
    Boolean sendNotification
) {}
