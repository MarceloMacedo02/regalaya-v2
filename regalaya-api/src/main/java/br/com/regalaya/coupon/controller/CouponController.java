package br.com.regalaya.coupon.controller;

import br.com.regalaya.coupon.domain.model.Coupon;
import br.com.regalaya.coupon.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/admin/coupons")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Coupons (Admin)", description = "Gestão de cupons de desconto")
@PreAuthorize("hasRole('ADMIN')")
public class CouponController {

    private final CouponService couponService;

    @GetMapping
    @Operation(summary = "Listar cupons", description = "Lista todos os cupons cadastrados")
    public ResponseEntity<List<Coupon>> findAll() {
        return ResponseEntity.ok(couponService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar cupom por ID")
    public ResponseEntity<Coupon> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(couponService.findById(id));
    }
}
