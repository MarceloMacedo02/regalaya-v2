package br.com.regalaya.coupon.service;

import br.com.regalaya.coupon.domain.model.Coupon;
import br.com.regalaya.coupon.exception.CouponNotFoundException;
import br.com.regalaya.coupon.exception.CouponValidationException;
import br.com.regalaya.coupon.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    public List<Coupon> findAll() {
        return couponRepository.findAll();
    }

    @Override
    public Coupon findById(UUID id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Cupom não encontrado"));
    }

    @Override
    public Coupon findByCode(String code) {
        return couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(code)
                .orElseThrow(() -> new CouponNotFoundException("Cupom não encontrado ou inativo"));
    }

    @Override
    public BigDecimal applyCoupon(String code, BigDecimal orderValue) {
        log.info("Applying coupon {} for order value {}", code, orderValue);

        Coupon coupon = findByCode(code);

        if (!coupon.isValid()) {
            throw new CouponValidationException("Cupom expirado ou atingiu o limite de usos");
        }

        if (orderValue.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new CouponValidationException(
                    String.format("Valor mínimo do pedido é R$ %.2f", coupon.getMinOrderValue()));
        }

        BigDecimal discount = coupon.calculateDiscount(orderValue);
        log.info("Coupon {} applied, discount: {}", code, discount);

        return discount;
    }

    @Override
    @Transactional
    public void incrementUsage(String code) {
        Coupon coupon = findByCode(code);
        coupon.setCurrentUsages(coupon.getCurrentUsages() + 1);
        couponRepository.save(coupon);
    }
}
