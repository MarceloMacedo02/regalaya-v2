package br.com.regalaya;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
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
        // Load .env and set as system properties
        try {
            // First try root, then try regalaya-api folder
            Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();
            
            if (dotenv.entries().isEmpty()) {
                System.out.println("Trying to load .env from ./regalaya-api...");
                dotenv = Dotenv.configure()
                    .directory("./regalaya-api")
                    .ignoreIfMissing()
                    .load();
            }
            
            if (!dotenv.entries().isEmpty()) {
                System.out.println("Loaded .env variables:");
                for (DotenvEntry entry : dotenv.entries()) {
                    System.setProperty(entry.getKey(), entry.getValue());
                    if (entry.getKey().contains("AI") || entry.getKey().contains("OPENROUTER")) {
                        System.out.println("  " + entry.getKey() + "=" + entry.getValue());
                    }
                }
            } else {
                System.err.println("CRITICAL: No .env variables found! Check if .env file exists in root or regalaya-api folder.");
            }
        } catch (Exception e) {
            System.err.println("Error loading .env: " + e.getMessage());
        }

        SpringApplication.run(RegalayaApiApplication.class, args);
    }
}
