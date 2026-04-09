package br.com.regalaya.notification.exception;

import br.com.regalaya.shared.exception.BusinessException;

public class NotificationOwnershipException extends BusinessException {

    public NotificationOwnershipException() {
        super("Notificação não pertence ao usuário autenticado");
    }
}
