package br.com.regalaya.notification.service;

import java.time.LocalDate;

public interface NotificationSchedulingService {

    int checkUpcomingDates();

    int checkUpcomingDates(LocalDate notificationDate);
}
