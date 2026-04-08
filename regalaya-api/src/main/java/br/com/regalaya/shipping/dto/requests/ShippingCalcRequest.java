package br.com.regalaya.shipping.dto.requests;

import java.util.List;

public record ShippingCalcRequest(
    String zipCode,
    double weight,
    Dimensions dimensions,
    String service // "PAC", "SEDEX", etc (optional - if null, calculate all available)
) {}
