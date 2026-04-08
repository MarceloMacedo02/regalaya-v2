package br.com.regalaya.shipping.services.service;

import br.com.regalaya.shipping.dto.requests.ShippingCalcRequest;
import br.com.regalaya.shipping.dto.responses.ShippingOption;

import java.util.List;

public interface ShippingService {

    /**
     * Calculates all available shipping options for a given request
     * @param request shipping calculation request
     * @return list of shipping options sorted by price (cheapest first)
     */
    List<ShippingOption> calculateShipping(ShippingCalcRequest request);

    /**
     * Checks if free shipping threshold is met
     * @param subtotal order subtotal value
     * @return true if free shipping applies
     */
    boolean isFreeShippingApplicable(double subtotal);

    /**
     * Gets the free shipping threshold from configuration
     */
    double getFreeShippingThreshold();
}
