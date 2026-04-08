package br.com.regalaya.shared.exception;

public class ConflictException extends BusinessException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String resourceName, String field, String value) {
        super(String.format("%s já existe com %s: %s", resourceName, field, value));
    }
}
