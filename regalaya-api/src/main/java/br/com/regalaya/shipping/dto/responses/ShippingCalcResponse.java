package br.com.regalaya.shipping.dto.responses;

import java.util.List;

public record ShippingCalcResponse(
    String zipCode,
    List<ShippingOption> options,
    double freeShippingThreshold,
    boolean freeShippingAvailable
) {}
