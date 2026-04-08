package br.com.regalaya;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@ComponentScan(basePackages = "br.com.regalaya")
public class RegalayaApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(RegalayaApiApplication.class, args);
    }
}
