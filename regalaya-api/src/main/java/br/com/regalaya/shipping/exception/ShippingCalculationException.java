package br.com.regalaya.shipping.exception;

public class ShippingCalculationException extends RuntimeException {

    public ShippingCalculationException(String message) {
        super(message);
    }

    public ShippingCalculationException(String message, Throwable cause) {
        super(message, cause);
    }
}
