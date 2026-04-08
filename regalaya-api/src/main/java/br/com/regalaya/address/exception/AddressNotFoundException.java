package br.com.regalaya.address.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class AddressNotFoundException extends BusinessException {

    public AddressNotFoundException(String message) {
        super(message);
    }
}
