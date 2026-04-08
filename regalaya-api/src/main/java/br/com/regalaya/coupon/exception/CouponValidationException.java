package br.com.regalaya.coupon.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class CouponValidationException extends BusinessException {

    public CouponValidationException(String message) {
        super(message);
    }
}
