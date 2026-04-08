package br.com.regalaya.payment.exception;

public class InvalidWebhookSignatureException extends RuntimeException {

    public InvalidWebhookSignatureException(String message) {
        super(message);
    }
}
