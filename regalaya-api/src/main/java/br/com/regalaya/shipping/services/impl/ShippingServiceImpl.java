package br.com.regalaya.shipping.services.impl;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.shipping.dto.requests.ShippingCalcRequest;
import br.com.regalaya.shipping.dto.responses.ShippingOption;
import br.com.regalaya.shipping.services.provider.ShippingProvider;
import br.com.regalaya.shipping.services.service.ShippingService;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ShippingServiceImpl implements ShippingService {

    private final List<ShippingProvider> providers;

    @Value("${app.shipping.free-shipping-threshold:299.90}")
    private double freeShippingThreshold;

    public ShippingServiceImpl(@Qualifier("shippingProviders") List<ShippingProvider> providers) {
        this.providers = providers;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShippingOption> calculateShipping(ShippingCalcRequest request) {
        log.info("Calculating shipping for zip: {}, weight: {}kg, dimensions: {}",
                request.zipCode(), request.weight(), request.dimensions());

        List<ShippingOption> allOptions = new ArrayList<>();

        for (ShippingProvider provider : providers) {
            if (!provider.isAvailable()) {
                log.warn("Provider {} is unavailable, skipping", provider.getProviderName());
                continue;
            }

            try {
                List<ShippingOption> options = provider.calculate(request);
                allOptions.addAll(options);
                log.debug("Provider {} returned {} options", provider.getProviderName(), options.size());
            } catch (Exception e) {
                log.error("Error calculating shipping with provider {}", provider.getProviderName(), e);
                // Continue with other providers
            }
        }

        // Se todos os providers falharam, retornar fallback
        if (allOptions.isEmpty()) {
            log.warn("All shipping providers failed, returning fallback option");
            return getFallbackOptions();
        }

        // Ordernar por preço (mais barato primeiro)
        allOptions.sort((a, b) -> Double.compare(a.price(), b.price()));

        return allOptions;
    }

    @Override
    public boolean isFreeShippingApplicable(double subtotal) {
        return subtotal >= freeShippingThreshold;
    }

    @Override
    public double getFreeShippingThreshold() {
        return freeShippingThreshold;
    }

    private List<ShippingOption> getFallbackOptions() {
        return List.of(
                new ShippingOption(
                    "FRETE_FALLBACK",
                    "FLAT_RATE",
                    "Taxa fixa (estimativa)",
                    29.90,
                    10,
                    LocalDate.now().plusDays(10),
                    true
                )
        );
    }
}
