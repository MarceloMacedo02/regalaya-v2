package br.com.regalaya.coupon.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class CouponNotFoundException extends BusinessException {

    public CouponNotFoundException(String message) {
        super(message);
    }
}
