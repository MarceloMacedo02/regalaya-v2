package br.com.regalaya.coupon.service;

import br.com.regalaya.coupon.domain.model.Coupon;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface CouponService {

    List<Coupon> findAll();

    Coupon findById(UUID id);

    Coupon findByCode(String code);

    BigDecimal applyCoupon(String code, BigDecimal orderValue);

    void incrementUsage(String code);
}
