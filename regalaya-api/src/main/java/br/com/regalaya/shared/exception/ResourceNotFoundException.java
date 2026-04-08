package br.com.regalaya.shared.exception;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Object identifier) {
        super(String.format("%s não encontrado com identificador: %s", resourceName, identifier));
    }
}
