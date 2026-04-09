package br.com.regalaya.notification.channel.email;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.regalaya.notification.domain.enums.NotificationStatus;
import br.com.regalaya.notification.domain.model.NotificationQueue;
import br.com.regalaya.notification.repository.NotificationPreferenceRepository;
import br.com.regalaya.notification.service.NotificationDeliveryAdapter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailNotificationChannel implements NotificationDeliveryAdapter {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationChannel.class);

    private final JavaMailSender mailSender;
    private final EmailTemplateRenderer templateRenderer;
    private final NotificationPreferenceRepository preferenceRepository;
    private final String fromEmail;
    private final String fromName;
    private final ObjectMapper objectMapper;

    public EmailNotificationChannel(
            JavaMailSender mailSender, 
            EmailTemplateRenderer templateRenderer,
            NotificationPreferenceRepository preferenceRepository,
            @Value("${app.email.from:noreply@regalaya.local}") String fromEmail,
            @Value("${app.email.from-name:Regalaya}") String fromName) {
        this.mailSender = mailSender;
        this.templateRenderer = templateRenderer;
        this.preferenceRepository = preferenceRepository;
        this.fromEmail = fromEmail;
        this.fromName = fromName;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void deliver(NotificationQueue notification) {
        if (notification.getRecipientEmail() == null || notification.getRecipientEmail().isBlank()) {
            log.warn("Skipping Email delivery - no email address for notification {}", notification.getId());
            return;
        }

        br.com.regalaya.notification.domain.model.NotificationPreference pref = 
            preferenceRepository.findByUserId(notification.getUserId()).orElse(null);

        if (pref != null && !pref.getEmailEnabled()) {
            if (!pref.getTransactionalEnabled() || !isStrictlyTransactional(notification.getType())) {
                log.info("Skipping Email delivery - email disabled for user {}", notification.getUserId());
                notification.setStatus(NotificationStatus.CANCELLED);
                notification.setErrorMessage("User preferences disabled email");
                return;
            }
        }

        Map<String, String> data = parseMessageData(notification.getMessageData());
        if (pref != null && pref.getUnsubscribeToken() != null) {
            data.put("unsubscribeToken", pref.getUnsubscribeToken());
        }
        
        // TODO: Get locale from User Preferences later, mapping default to pt
        Locale locale = new Locale("pt");
        
        EmailTemplateRenderer.RenderedEmail rendered = templateRenderer.render(notification.getType(), locale, data);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(notification.getRecipientEmail());
            helper.setSubject(rendered.subject());
            helper.setText(rendered.htmlContent(), true);

            mailSender.send(message);

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            log.info("Email notification sent successfully - id={}", notification.getId());

        } catch (MessagingException | java.io.UnsupportedEncodingException | RuntimeException e) {
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(e.getMessage());
            log.error("Failed to send email for notification {}: {}", notification.getId(), e.getMessage());
            throw new RuntimeException("Error sending email", e);
        }
    }

    private Map<String, String> parseMessageData(String messageData) {
        if (messageData == null || messageData.isBlank()) {
            return new HashMap<>();
        }
        try {
            return objectMapper.readValue(messageData, new TypeReference<Map<String, String>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse message data for email: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    private boolean isStrictlyTransactional(br.com.regalaya.notification.domain.enums.NotificationType type) {
        return type == br.com.regalaya.notification.domain.enums.NotificationType.ORDER_CONFIRMATION
            || type == br.com.regalaya.notification.domain.enums.NotificationType.ORDER_SHIPPED
            || type == br.com.regalaya.notification.domain.enums.NotificationType.ORDER_DELIVERED;
    }
}
