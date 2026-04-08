package br.com.regalaya.shipping.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import br.com.regalaya.shipping.services.provider.impl.CorreiosProvider;
import br.com.regalaya.shipping.services.provider.ShippingProvider;

import java.util.List;

@Configuration
public class ShippingConfig {

    @Bean
    public WebClient shippingWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.correios.com.br/v1") // default, override via application.yml
                .build();
    }

    @Bean
    public ShippingProvider correiosProvider(WebClient shippingWebClient) {
        return new CorreiosProvider(shippingWebClient);
    }

    @Bean
    public List<ShippingProvider> shippingProviders(ShippingProvider correiosProvider) {
        return List.of(correiosProvider);
    }
}
