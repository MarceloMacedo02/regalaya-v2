package br.com.regalaya.notification.channel.email;

import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import br.com.regalaya.notification.domain.enums.NotificationType;

@Component
public class EmailTemplateRenderer {

    private final String baseUrl;

    public EmailTemplateRenderer(@Value("${app.base-url:https://regalaya.com}") String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public record RenderedEmail(String subject, String htmlContent) {}

    public RenderedEmail render(NotificationType type, Locale locale, Map<String, String> data) {
        String userName = data.getOrDefault("userName", "Cliente");
        
        switch (type) {
            case DATE_REMINDER_7D:
                String eventName7d = data.getOrDefault("eventName", "seu evento");
                String subject7d = "Falta 7 dias para " + eventName7d + "!";
                String body7d = "Olá " + userName + ", viemos lembrar que o evento <strong>" + eventName7d + "</strong> " +
                                "acontecerá em " + data.getOrDefault("eventDate", "7 dias") + ". O que acha de escolher um presente especial?";
                String html7d = buildHtml(subject7d, body7d, "Ver Sugestões de Presentes", baseUrl + "/suggestions", data);
                return new RenderedEmail(subject7d, html7d);
                
            case DATE_REMINDER_1D:
                String eventName1d = data.getOrDefault("eventName", "seu evento");
                String subject1d = "É amanhã: " + eventName1d + "!";
                String body1d = "Olá " + userName + ", é amanhã! O evento <strong>" + eventName1d + "</strong> " +
                                "acontece dia " + data.getOrDefault("eventDate", "amanhã") + ". Ainda dá tempo de algo rápido!";
                String html1d = buildHtml(subject1d, body1d, "Comprar Presente de Última Hora", baseUrl + "/suggestions/last-minute", data);
                return new RenderedEmail(subject1d, html1d);

            case ORDER_CONFIRMATION:
                String orderNumber = data.getOrDefault("orderNumber", "");
                String subjectOrder = "Pedido Confirmado: #" + orderNumber;
                String bodyOrder = "Olá " + userName + ", recebemos seu pedido <strong>#" + orderNumber + "</strong> " +
                                   "e o pagamento foi aprovado. Em breve ele será enviado!";
                String htmlOrder = buildHtml(subjectOrder, bodyOrder, "Acompanhar Pedido", baseUrl + "/account/orders", data);
                return new RenderedEmail(subjectOrder, htmlOrder);

            case ORDER_SHIPPED:
                String orderNumberS = data.getOrDefault("orderNumber", "");
                String subjectShipped = "Pedido Enviado: #" + orderNumberS;
                String bodyShipped = "Olá " + userName + ", ótimo negócio! Seu pedido <strong>#" + orderNumberS + "</strong> " +
                                     "foi enviado e está a caminho.";
                String htmlShipped = buildHtml(subjectShipped, bodyShipped, "Rastrear Pedido", baseUrl + "/account/orders/" + orderNumberS, data);
                return new RenderedEmail(subjectShipped, htmlShipped);

            case ORDER_DELIVERED:
                String orderNumberD = data.getOrDefault("orderNumber", "");
                String subjectDelivered = "Pedido Entregue: #" + orderNumberD;
                String bodyDelivered = "Olá " + userName + ", seu pedido <strong>#" + orderNumberD + "</strong> foi entregue! " +
                                       "Esperamos que seja um grande sucesso.";
                String htmlDelivered = buildHtml(subjectDelivered, bodyDelivered, "Ver Detalhes", baseUrl + "/account/orders/" + orderNumberD, data);
                return new RenderedEmail(subjectDelivered, htmlDelivered);

            default:
                String defaultSubject = "Notificação Regalaya";
                String defaultBody = "Olá " + userName + ", você tem uma nova atualização em sua conta.";
                String defaultHtml = buildHtml(defaultSubject, defaultBody, "Acessar Conta", baseUrl, data);
                return new RenderedEmail(defaultSubject, defaultHtml);
        }
    }

    private String buildHtml(String heading, String bodyContent, String buttonText, String buttonLink, Map<String, String> data) {
        String unsubscribeToken = data.get("unsubscribeToken");
        String unsubscribeLink = unsubscribeToken != null 
            ? baseUrl + "/account/preferences/unsubscribe?token=" + unsubscribeToken
            : baseUrl + "/account/preferences/notifications";
        
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'Manrope', sans-serif; background: #fcf9f8; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px;">
                    <h1 style="color: #775a19; font-family: 'Noto Serif', serif;">%s</h1>
                    <p style="color: #788090; font-size: 16px; line-height: 1.5;">%s</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="%s" style="background: #be7374; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 14px; display: inline-block;">
                            %s
                        </a>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;">
                    <p style="text-align: center; color: #a0a5b1; font-size: 12px;">
                        Para não receber mais este tipo de email, você pode 
                        <a href="%s" style="color: #be7374; text-decoration: underline;">atualizar suas preferências</a>.
                    </p>
                </div>
            </body>
            </html>
            """.formatted(heading, bodyContent, buttonLink, buttonText, unsubscribeLink);
    }
}
