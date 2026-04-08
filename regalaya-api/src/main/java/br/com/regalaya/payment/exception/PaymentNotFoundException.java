package br.com.regalaya.payment.exception;

import java.util.UUID;

public class PaymentNotFoundException extends RuntimeException {

    public PaymentNotFoundException(UUID orderId) {
        super("Pagamento não encontrado para o pedido: " + orderId);
    }

    public PaymentNotFoundException(String message) {
        super(message);
    }
}
