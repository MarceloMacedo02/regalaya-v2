package br.com.regalaya.notification.service.impl;

import org.springframework.stereotype.Component;

import br.com.regalaya.notification.domain.model.NotificationQueue;
import br.com.regalaya.notification.service.NotificationDeliveryAdapter;

@Component
public class InAppNotificationDeliveryAdapter implements NotificationDeliveryAdapter {

    @Override
    public void deliver(NotificationQueue notification) {
        // Base do épico 9: registrar a notificação como disponível no app/web.
        // Os canais externos reais entram nas histórias 9.2 e 9.3 como adaptadores adicionais.
    }
}
