package br.com.regalaya.whatsapp.client.dto;

import java.util.List;

public class WhatsAppSendMessageResponse {
    private String messagingProduct;
    private String to;
    private String messageId;
    private String messageStatus;
    private List<ErrorDetail> errors;

    public WhatsAppSendMessageResponse() {}

    public boolean isSuccess() {
        return messageId != null && (errors == null || errors.isEmpty());
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

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getMessageStatus() {
        return messageStatus;
    }

    public void setMessageStatus(String messageStatus) {
        this.messageStatus = messageStatus;
    }

    public List<ErrorDetail> getErrors() {
        return errors;
    }

    public void setErrors(List<ErrorDetail> errors) {
        this.errors = errors;
    }

    public static class ErrorDetail {
        private String code;
        private String title;

        public ErrorDetail() {}

        public ErrorDetail(String code, String title) {
            this.code = code;
            this.title = title;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }
    }
}