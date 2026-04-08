package br.com.regalaya.shipping.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.shipping.dto.requests.ShippingCalcRequest;
import br.com.regalaya.shipping.dto.responses.ShippingCalcResponse;
import br.com.regalaya.shipping.services.service.ShippingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/shipping")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Shipping", description = "Shipping calculation endpoints")
public class ShippingController {

    private final ShippingService shippingService;

    @PostMapping("/calculate")
    @PreAuthorize("hasAnyRole('USER', 'CLIENT', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Calculate shipping options", description = "Calculates available shipping options for a given address and cart items")
    public ResponseEntity<ShippingCalcResponse> calculateShipping(
            @Parameter(description = "Shipping calculation request") @RequestBody ShippingCalcRequest request) {

        var options = shippingService.calculateShipping(request);

        boolean freeShippingAvailable = options.stream()
                .anyMatch(opt -> opt.carrier().equals("CORREIOS") && opt.service().equals("PAC") && opt.price() == 0);

        ShippingCalcResponse response = new ShippingCalcResponse(
                request.zipCode(),
                options,
                shippingService.getFreeShippingThreshold(),
                freeShippingAvailable
        );

        return ResponseEntity.ok(response);
    }
}
