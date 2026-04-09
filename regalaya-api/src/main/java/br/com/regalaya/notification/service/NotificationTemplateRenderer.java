package br.com.regalaya.notification.service;

import br.com.regalaya.notification.service.model.NotificationPayload;

public interface NotificationTemplateRenderer {

    String renderMessage(NotificationPayload payload);

    String renderTitle(NotificationPayload payload);
}
