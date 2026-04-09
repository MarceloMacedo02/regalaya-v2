package br.com.regalaya.notification.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.regalaya.auth.domain.model.Role;
import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.contact.domain.model.Contact;
import br.com.regalaya.contact.domain.model.SpecialDate;
import br.com.regalaya.contact.repository.SpecialDateRepository;
import br.com.regalaya.notification.config.NotificationProperties;
import br.com.regalaya.notification.domain.enums.NotificationType;
import br.com.regalaya.notification.domain.model.NotificationQueue;
import br.com.regalaya.notification.repository.NotificationQueueRepository;
import br.com.regalaya.notification.service.impl.NotificationSchedulingServiceImpl;

@ExtendWith(MockitoExtension.class)
class NotificationSchedulingServiceTest {

    @Mock
    private SpecialDateRepository specialDateRepository;

    @Mock
    private NotificationQueueRepository notificationQueueRepository;

    @Mock
    private NotificationTemplateRenderer notificationTemplateRenderer;

    private NotificationProperties notificationProperties;

    @InjectMocks
    private NotificationSchedulingServiceImpl notificationSchedulingService;

    @BeforeEach
    void setUp() {
        notificationProperties = new NotificationProperties();
        notificationProperties.setAccountNotificationsPath("/account/notifications");
        notificationProperties.setDefaultTimezone("America/Fortaleza");
        notificationProperties.setMaxRetries(3);

        notificationSchedulingService = new NotificationSchedulingServiceImpl(
                specialDateRepository,
                notificationQueueRepository,
                notificationTemplateRenderer,
                notificationProperties,
                new ObjectMapper()
        );
    }

    @Test
    void createNotificationsForOffset_CreatesQueueAndUpdatesLastNotified() {
        LocalDate notificationDate = LocalDate.of(2026, 4, 8);
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("cliente@regalaya.com");
        user.setRole(Role.USER);

        Contact contact = Contact.builder()
                .user(user)
                .name("Ana")
                .phone("85999999999")
                .build();

        SpecialDate specialDate = SpecialDate.builder()
                .contact(contact)
                .type("BIRTHDAY")
                .date(LocalDate.of(2020, 4, 15))
                .recurrence("YEARLY")
                .build();
        specialDate.setId(UUID.randomUUID());
        contact.setId(UUID.randomUUID());

        when(specialDateRepository.findEligibleForReminder(notificationDate.plusDays(7), notificationDate))
                .thenReturn(List.of(specialDate));
        when(notificationQueueRepository.existsBySpecialDateIdAndTypeAndScheduledAtBetween(
                eq(specialDate.getId()),
                eq(NotificationType.DATE_REMINDER_7D),
                any(),
                any()
        )).thenReturn(false);
        when(notificationTemplateRenderer.renderMessage(any())).thenReturn("Mensagem de teste");
        when(notificationTemplateRenderer.renderTitle(any())).thenReturn("Lembrete em 7 dias");

        int created = notificationSchedulingService.createNotificationsForOffset(notificationDate, 7);

        ArgumentCaptor<NotificationQueue> queueCaptor = ArgumentCaptor.forClass(NotificationQueue.class);
        verify(notificationQueueRepository).save(queueCaptor.capture());
        verify(specialDateRepository).save(specialDate);

        NotificationQueue saved = queueCaptor.getValue();
        assertEquals(1, created);
        assertEquals(NotificationType.DATE_REMINDER_7D, saved.getType());
        assertEquals(user.getId(), saved.getUserId());
        assertEquals(contact.getId(), saved.getContactId());
        assertEquals(notificationDate, specialDate.getLastNotified());
    }

    @Test
    void createNotificationsForOffset_SkipsAlreadyQueuedNotifications() {
        LocalDate notificationDate = LocalDate.of(2026, 4, 8);
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("cliente@regalaya.com");
        user.setRole(Role.USER);

        Contact contact = Contact.builder().user(user).name("Ana").build();
        SpecialDate specialDate = SpecialDate.builder()
                .contact(contact)
                .type("BIRTHDAY")
                .date(LocalDate.of(2020, 4, 9))
                .recurrence("YEARLY")
                .build();
        specialDate.setId(UUID.randomUUID());

        when(specialDateRepository.findEligibleForReminder(notificationDate.plusDays(1), notificationDate))
                .thenReturn(List.of(specialDate));
        when(notificationQueueRepository.existsBySpecialDateIdAndTypeAndScheduledAtBetween(
                eq(specialDate.getId()),
                eq(NotificationType.DATE_REMINDER_1D),
                any(),
                any()
        )).thenReturn(true);

        int created = notificationSchedulingService.createNotificationsForOffset(notificationDate, 1);

        assertEquals(0, created);
        verify(notificationQueueRepository, never()).save(any(NotificationQueue.class));
        verify(specialDateRepository, never()).save(any(SpecialDate.class));
    }
}
