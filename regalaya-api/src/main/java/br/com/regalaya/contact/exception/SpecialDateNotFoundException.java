package br.com.regalaya.contact.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class SpecialDateNotFoundException extends BusinessException {

    public SpecialDateNotFoundException(String message) {
        super(message);
    }
}
