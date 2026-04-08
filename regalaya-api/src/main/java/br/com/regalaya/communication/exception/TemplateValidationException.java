package br.com.regalaya.communication.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class TemplateValidationException extends BusinessException {

    public TemplateValidationException(String message) {
        super(message);
    }
}
