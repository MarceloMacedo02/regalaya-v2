package br.com.regalaya.notification.service;

public interface NotificationDispatchService {

    int dispatchPendingMessages();

    int retryFailedMessages();
}
