package br.com.regalaya.shipping.services.provider;

import br.com.regalaya.shipping.dto.requests.ShippingCalcRequest;
import br.com.regalaya.shipping.dto.responses.ShippingOption;

import java.util.List;

public interface ShippingProvider {

    /**
     * Calculates shipping options for a given request
     * @param request shipping calculation request
     * @return list of available shipping options
     */
    List<ShippingOption> calculate(ShippingCalcRequest request);

    /**
     * Returns the provider name (e.g., "CORREIOS", "LOGGI")
     */
    String getProviderName();

    /**
     * Checks if the provider is available (health check)
     */
    boolean isAvailable();
}
