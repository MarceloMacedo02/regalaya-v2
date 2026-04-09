package br.com.regalaya.notification.channel.email;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import br.com.regalaya.notification.domain.enums.NotificationStatus;
import br.com.regalaya.notification.domain.enums.NotificationType;
import br.com.regalaya.notification.domain.model.NotificationQueue;
import jakarta.mail.internet.MimeMessage;

@ExtendWith(MockitoExtension.class)
public class EmailNotificationChannelTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private EmailTemplateRenderer templateRenderer;

    @Mock
    private br.com.regalaya.notification.repository.NotificationPreferenceRepository preferenceRepository;

    private EmailNotificationChannel channel;

    @BeforeEach
    void setUp() {
        channel = new EmailNotificationChannel(mailSender, templateRenderer, preferenceRepository, "noreply@regalaya.local", "Regalaya");
    }

    @Test
    void shouldSendEmailSuccessfully() {
        NotificationQueue notification = new NotificationQueue();
  
        notification.setRecipientEmail("test@example.com");
        notification.setType(NotificationType.DATE_REMINDER_7D);
        notification.setMessageData("{\"userName\":\"John\",\"event\":\"Birthday\"}");

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateRenderer.render(any(), any(), any())).thenReturn(new EmailTemplateRenderer.RenderedEmail("Subject", "<html></html>"));

        channel.deliver(notification);

        verify(mailSender).send(mimeMessage);
        assertEquals(NotificationStatus.SENT, notification.getStatus());
    }
}
