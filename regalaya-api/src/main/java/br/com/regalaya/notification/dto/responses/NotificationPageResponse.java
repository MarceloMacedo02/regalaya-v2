package br.com.regalaya.notification.dto.responses;

import java.util.List;

public record NotificationPageResponse(
        List<NotificationItemResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        boolean empty,
        int numberOfElements
) {
}
