package br.com.regalaya.notification.service.impl;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.stereotype.Component;

import br.com.regalaya.notification.service.NotificationTemplateRenderer;
import br.com.regalaya.notification.service.model.NotificationPayload;

@Component
public class DefaultNotificationTemplateRenderer implements NotificationTemplateRenderer {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    public String renderMessage(NotificationPayload payload) {
        return switch (payload.type()) {
            case DATE_REMINDER_7D -> String.format(
                    Locale.forLanguageTag("pt-BR"),
                    "Faltam 7 dias para %s de %s em %s. %s",
                    normalizeDateType(payload.specialDateType()),
                    payload.contactName(),
                    payload.specialDate().format(DATE_FORMATTER),
                    payload.ctaLabel()
            );
            case DATE_REMINDER_1D -> String.format(
                    Locale.forLanguageTag("pt-BR"),
                    "%s de %s acontece amanhã (%s). %s",
                    normalizeDateType(payload.specialDateType()),
                    payload.contactName(),
                    payload.specialDate().format(DATE_FORMATTER),
                    payload.ctaLabel()
            );
            default -> payload.ctaLabel();
        };
    }

    @Override
    public String renderTitle(NotificationPayload payload) {
        return switch (payload.type()) {
            case DATE_REMINDER_7D -> "Lembrete em 7 dias";
            case DATE_REMINDER_1D -> "Lembrete para amanhã";
            default -> "Notificação";
        };
    }

    private String normalizeDateType(String type) {
        if (type == null || type.isBlank()) {
            return "a data especial";
        }
        return switch (type.toUpperCase(Locale.ROOT)) {
            case "BIRTHDAY" -> "o aniversário";
            case "ANNIVERSARY" -> "o aniversário";
            case "WEDDING" -> "o casamento";
            case "CHRISTMAS" -> "o Natal";
            default -> "a data especial";
        };
    }
}
