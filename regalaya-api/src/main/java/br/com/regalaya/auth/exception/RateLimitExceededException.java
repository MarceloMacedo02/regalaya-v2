package br.com.regalaya.auth.exception;

public class RateLimitExceededException extends RuntimeException {

    public RateLimitExceededException(String retryAfterMinutes) {
        super("Limite de tentativas excedido. Tente novamente em " + retryAfterMinutes + " minutos");
    }
}
