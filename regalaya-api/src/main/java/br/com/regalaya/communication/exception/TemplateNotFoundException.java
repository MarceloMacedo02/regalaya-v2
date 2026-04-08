package br.com.regalaya.communication.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class TemplateNotFoundException extends BusinessException {

    public TemplateNotFoundException(String message) {
        super(message);
    }
}
