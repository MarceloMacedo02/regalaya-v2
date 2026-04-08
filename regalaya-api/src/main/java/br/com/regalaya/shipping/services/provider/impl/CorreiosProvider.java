package br.com.regalaya.shipping.services.provider.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import br.com.regalaya.shipping.dto.requests.ShippingCalcRequest;
import br.com.regalaya.shipping.dto.responses.ShippingOption;
import br.com.regalaya.shipping.exception.ShippingCalculationException;
import br.com.regalaya.shipping.services.provider.ShippingProvider;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class CorreiosProvider implements ShippingProvider {

    private final WebClient webClient;

    @Value("${app.shipping.correios.username:}")
    private String username;

    @Value("${app.shipping.correios.password:}")
    private String password;

    @Value("${app.shipping.correios.origin-cep:00000000}")
    private String originCep;

    public CorreiosProvider(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public List<ShippingOption> calculate(ShippingCalcRequest request) {
        if (request.zipCode() == null || request.zipCode().replaceAll("\\D", "").length() != 8) {
            throw new ShippingCalculationException("CEP inválido: " + request.zipCode());
        }

        try {
            // Correios API: calcPrecoPrazo
            // Parâmetros: nCdEmpresa, sDsSenha, nCdServico, sCepOrigem, sCepDestino, nVlPeso, nCdFormato,
            // nDensidade, sCdMaoPropria, nVlValorDeclarado, sCdAvisoRecebimento

            String cleanZip = request.zipCode().replaceAll("\\D", "");
            String weightStr = String.valueOf(request.weight());

            // Query parameters
            var response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/shipping")
                            .queryParam("nCdServico", "04510,04014") // PAC, SEDEX
                            .queryParam("sCepOrigem", originCep)
                            .queryParam("sCepDestino", cleanZip)
                            .queryParam("nVlPeso", weightStr)
                            .queryParam("nCdFormato", "1") // Caixa
                            .queryParam("nVlComprimento", request.dimensions().length())
                            .queryParam("nVlLargura", request.dimensions().width())
                            .queryParam("nVlAltura", request.dimensions().height())
                            .queryParam("nVlValorDeclarado", "100") // valor default
                            .build())
                    .headers(headers -> {
                        if (username != null && !username.isEmpty()) {
                            headers.setBasicAuth(username, password);
                        }
                    })
                    .retrieve()
                    .bodyToMono(ShippingCalcResponseCorreios.class)
                    .block();

            if (response == null || response.getServices() == null || response.getServices().isEmpty()) {
                throw new ShippingCalculationException("Nenhuma opção de frete disponível para o CEP " + request.zipCode());
            }

            return convertToShippingOptions(response.getServices(), request.zipCode());

        } catch (WebClientResponseException e) {
            log.error("Correios API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ShippingCalculationException("Erro ao consultar Correios: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error calculating shipping with Correios", e);
            throw new ShippingCalculationException("Erro interno ao calcular frete: " + e.getMessage());
        }
    }

    private List<ShippingOption> convertToShippingOptions(List<ShippingServiceCorreios> services, String zipCode) {
        List<ShippingOption> options = new ArrayList<>();

        for (ShippingServiceCorreios service : services) {
            if (service.getError() != null) {
                log.warn("Correios service {} error: {}", service.getCode(), service.getError());
                continue;
            }

            options.add(new ShippingOption(
                    "CORREIOS",
                    service.getCode(),
                    service.getDescription(),
                    service.getPrice(),
                    service.getDeliveryTime(),
                    calculateEstimatedDelivery(zipCode, service.getDeliveryTime()),
                    true
            ));
        }

        return options;
    }

    private LocalDate calculateEstimatedDelivery(String zipCode, int days) {
        // TODO: Considerar dias úteis e feriados
        return LocalDate.now().plusDays(days);
    }

    @Override
    public String getProviderName() {
        return "CORREIOS";
    }

    @Override
    public boolean isAvailable() {
        try {
            // Health check simples
            return true; // TODO: implementar ping na API
        } catch (Exception e) {
            log.error("Correios health check failed", e);
            return false;
        }
    }
}

// DTOs auxiliares para mapear resposta dos Correios
class ShippingCalcResponseCorreios {
    private List<ShippingServiceCorreios> services;

    public List<ShippingServiceCorreios> getServices() {
        return services;
    }

    public void setServices(List<ShippingServiceCorreios> services) {
        this.services = services;
    }
}

class ShippingServiceCorreios {
    private String code;
    private String description;
    private double price;
    private int deliveryTime;
    private String error;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(int deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
