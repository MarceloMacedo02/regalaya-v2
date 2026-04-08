package br.com.regalaya.shared.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name}")
    private String appName;

    @Value("${spring.application.version:1.0.0}")
    private String appVersion;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title(appName + " API")
                        .version(appVersion)
                        .description("API do sistema Regalaya - Backend Enterprise")
                        .contact(new Contact()
                                .name("Regalaya Team")
                                .email("support@regalaya.com")
                                .url("https://regalaya.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://regalaya.com/license"))
                );
    }
}
