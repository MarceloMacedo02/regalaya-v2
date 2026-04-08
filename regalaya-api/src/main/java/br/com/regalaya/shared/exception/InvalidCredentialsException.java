package br.com.regalaya.shared.exception;

public class InvalidCredentialsException extends BusinessException {

    public InvalidCredentialsException() {
        super("Credenciais inválidas");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
