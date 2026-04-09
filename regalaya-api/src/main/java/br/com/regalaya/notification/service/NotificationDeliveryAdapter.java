package br.com.regalaya.notification.service;

import br.com.regalaya.notification.domain.model.NotificationQueue;

public interface NotificationDeliveryAdapter {

    void deliver(NotificationQueue notification);
}
