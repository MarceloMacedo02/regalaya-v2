package br.com.regalaya.payment.controller;

import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import br.com.regalaya.payment.dto.requests.PaymentIntentRequest;
import br.com.regalaya.payment.dto.responses.InstallmentOption;
import br.com.regalaya.payment.dto.responses.PaymentIntentResponse;
import br.com.regalaya.payment.dto.responses.PaymentStatusResponse;
import br.com.regalaya.payment.services.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/payments")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment processing endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    @Operation(summary = "Create payment intent", description = "Creates a payment intent for the given order")
    public ResponseEntity<PaymentIntentResponse> createIntent(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody PaymentIntentRequest request) {

        PaymentIntentResponse response = paymentService.createPaymentIntent(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Get payment status", description = "Gets the payment status for an order")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID orderId) {

        PaymentStatusResponse response = paymentService.getPaymentStatus(orderId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/installments")
    @Operation(summary = "Calculate installments", description = "Calculates installment options for a given total")
    public ResponseEntity<List<InstallmentOption>> calculateInstallments(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam BigDecimal total,
            @RequestParam(required = false, defaultValue = "12") Integer maxInstallments) {

        List<InstallmentOption> options = paymentService.calculateInstallments(total);
        return ResponseEntity.ok(options);
    }
}
