package br.com.regalaya.auth.exception;

public class InvalidTokenException extends br.com.regalaya.shared.exception.BusinessException {

    public InvalidTokenException(String message) {
        super(message);
    }

    public InvalidTokenException() {
        super("Token inválido ou expirado");
    }
}
