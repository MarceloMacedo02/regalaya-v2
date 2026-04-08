package br.com.regalaya.payment.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.payment")
@Getter
@Setter
public class PaymentConfig {

    private StripeConfig stripe = new StripeConfig();
    private MercadoPagoConfig mercadoPago = new MercadoPagoConfig();
    private int maxInstallments = 12;
    private double minInstallmentValue = 20.00;
    private double installmentInterestRate = 0.0199; // 1.99% a.m.
    private int pixExpirationMinutes = 10;

    @Getter
    @Setter
    public static class StripeConfig {
        private String secretKey;
        private String publishableKey;
        private String webhookSecret;
        private boolean enabled = false;
    }

    @Getter
    @Setter
    public static class MercadoPagoConfig {
        private String accessToken;
        private String webhookSecret;
        private boolean enabled = false;
    }
}
