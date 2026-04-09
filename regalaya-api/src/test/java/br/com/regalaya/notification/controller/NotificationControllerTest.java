package br.com.regalaya.notification.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import br.com.regalaya.notification.dto.responses.NotificationItemResponse;
import br.com.regalaya.notification.dto.responses.NotificationPageResponse;
import br.com.regalaya.notification.dto.responses.NotificationReadResponse;
import br.com.regalaya.notification.service.NotificationQueryService;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationQueryService notificationQueryService;

    @InjectMocks
    private NotificationController notificationController;

    @Test
    void listNotifications_DelegatesToServiceWithAuthenticatedUser() {
        UUID userId = UUID.randomUUID();
        UserDetailsImpl principal = new UserDetailsImpl(userId, "teste@regalaya.com", "secret", Set.of("ROLE_USER"));
        NotificationPageResponse expected = new NotificationPageResponse(
                List.of(new NotificationItemResponse(
                        UUID.randomUUID(),
                        "DATE_REMINDER_7D",
                        "SENT",
                        "Lembrete em 7 dias",
                        "Mensagem",
                        "Ver próximas ações",
                        "/account/notifications",
                        "Ana",
                        "BIRTHDAY",
                        LocalDateTime.of(2026, 4, 15, 0, 0),
                        LocalDateTime.of(2026, 4, 8, 10, 0),
                        LocalDateTime.of(2026, 4, 8, 10, 1),
                        null,
                        false,
                        0
                )),
                0, 20, 1, 1, true, true, false, 1
        );

        when(notificationQueryService.listUserNotifications(userId, null, null, 0, 20)).thenReturn(expected);

        ResponseEntity<NotificationPageResponse> response = notificationController.listNotifications(principal, null, null, 0, 20);

        assertEquals(expected, response.getBody());
        verify(notificationQueryService).listUserNotifications(userId, null, null, 0, 20);
    }

    @Test
    void markAsRead_DelegatesToServiceWithAuthenticatedUser() {
        UUID userId = UUID.randomUUID();
        UUID notificationId = UUID.randomUUID();
        UserDetailsImpl principal = new UserDetailsImpl(userId, "teste@regalaya.com", "secret", Set.of("ROLE_USER"));
        NotificationReadResponse expected = new NotificationReadResponse(notificationId, LocalDateTime.of(2026, 4, 8, 18, 0));

        when(notificationQueryService.markAsRead(userId, notificationId)).thenReturn(expected);

        ResponseEntity<NotificationReadResponse> response = notificationController.markAsRead(principal, notificationId);

        assertEquals(expected, response.getBody());
        verify(notificationQueryService).markAsRead(userId, notificationId);
    }
}
