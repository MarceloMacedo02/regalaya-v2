package br.com.regalaya.cart.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class ProductNotAvailableException extends BusinessException {

    public ProductNotAvailableException(String message) {
        super(message);
    }
}
