package br.com.regalaya.whatsapp.service;

import java.util.Map;

public class WhatsAppTemplateRenderer {

    public String render(String templateName, Map<String, String> variables) {
        return switch (templateName) {
            case "date_reminder_7days" -> render7DayReminder(variables);
            case "date_reminder_1day" -> render1DayReminder(variables);
            case "order_confirmation" -> renderOrderConfirmation(variables);
            case "order_shipped" -> renderOrderShipped(variables);
            case "order_delivered" -> renderOrderDelivered(variables);
            default -> renderGenericReminder(variables);
        };
    }

    private String render7DayReminder(Map<String, String> v) {
        String name = v.getOrDefault("name", "amigo");
        String date = v.getOrDefault("date", "data especial");
        return "Olá " + name + "! Faltam 7 dias para " + date + ". Que taldar um presente especial?";
    }

    private String render1DayReminder(Map<String, String> v) {
        String name = v.getOrDefault("name", "amigo");
        String date = v.getOrDefault("date", "amanhã");
        return "Olá " + name + "! Amanhã é " + date + ". Não esqueça de comprar seu presente!";
    }

    private String renderOrderConfirmation(Map<String, String> v) {
        return "Seu pedido #" + v.getOrDefault("orderId", "") + " foi confirmado! Em breve você receberá mais informações.";
    }

    private String renderOrderShipped(Map<String, String> v) {
        return "Seu pedido #" + v.getOrDefault("orderId", "") + " foi enviado! Acompanhe pelo código: " + v.getOrDefault("trackingCode", "");
    }

    private String renderOrderDelivered(Map<String, String> v) {
        return "Seu pedido #" + v.getOrDefault("orderId", "") + " foi entregue! esperamos que goste do presente.";
    }

    private String renderGenericReminder(Map<String, String> v) {
        return v.getOrDefault("message", "Você tem uma nova mensagem da Regalaya.");
    }
}