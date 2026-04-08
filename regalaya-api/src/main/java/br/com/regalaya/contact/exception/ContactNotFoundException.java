package br.com.regalaya.contact.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class ContactNotFoundException extends BusinessException {

    public ContactNotFoundException(String message) {
        super(message);
    }
}
