package br.com.regalaya.whatsapp.client.dto;

import java.util.Map;

public class WhatsAppSendMessageRequest {
    private String messagingProduct;
    private String to;
    private String type;
    private Template template;

    public WhatsAppSendMessageRequest() {}

    public WhatsAppSendMessageRequest(String messagingProduct, String to, String type, Template template) {
        this.messagingProduct = messagingProduct;
        this.to = to;
        this.type = type;
        this.template = template;
    }

    public static WhatsAppSendMessageRequest forTemplate(String to, String templateName, String language, Map<String, String> parameters) {
        Template t = new Template(templateName, language, parameters);
        return new WhatsAppSendMessageRequest("whatsapp", to, "template", t);
    }

    public String getMessagingProduct() {
        return messagingProduct;
    }

    public void setMessagingProduct(String messagingProduct) {
        this.messagingProduct = messagingProduct;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Template getTemplate() {
        return template;
    }

    public void setTemplate(Template template) {
        this.template = template;
    }

    public static class Template {
        private String name;
        private String language;
        private Map<String, String> components;

        public Template() {}

        public Template(String name, String language, Map<String, String> components) {
            this.name = name;
            this.language = language;
            this.components = components;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }

        public Map<String, String> getComponents() {
            return components;
        }

        public void setComponents(Map<String, String> components) {
            this.components = components;
        }
    }
}