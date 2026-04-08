package br.com.regalaya.cart.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class CartItemNotFoundException extends BusinessException {

    public CartItemNotFoundException(String message) {
        super(message);
    }
}
