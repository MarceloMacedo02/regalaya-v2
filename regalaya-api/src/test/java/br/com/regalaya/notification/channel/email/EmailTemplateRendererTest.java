package br.com.regalaya.notification.channel.email;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Locale;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import br.com.regalaya.notification.domain.enums.NotificationType;

public class EmailTemplateRendererTest {

    private EmailTemplateRenderer renderer;

    @BeforeEach
    void setUp() {
        renderer = new EmailTemplateRenderer("https://regalaya.com");
    }

    @Test
    void shouldRenderDateReminder7DTemplate() {
        Map<String, String> data = Map.of(
            "userName", "Carlos",
            "eventName", "Aniversário da Ana",
            "eventDate", "15/04/2026"
        );

        EmailTemplateRenderer.RenderedEmail result = renderer.render(NotificationType.DATE_REMINDER_7D, new Locale("pt"), data);

        assertNotNull(result);
        assertEquals("Falta 7 dias para Aniversário da Ana!", result.subject());
        assertTrue(result.htmlContent().contains("Carlos"));
        assertTrue(result.htmlContent().contains("Aniversário da Ana"));
        assertTrue(result.htmlContent().contains("15/04/2026"));
    }
}
