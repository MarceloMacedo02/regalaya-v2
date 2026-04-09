package br.com.regalaya.notification.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.notifications")
public class NotificationProperties {

    private String defaultTimezone = "America/Fortaleza";
    private int maxRetries = 3;
    private int pollingBatchSize = 50;
    private String accountNotificationsPath = "/account/notifications";

    public String getDefaultTimezone() {
        return defaultTimezone;
    }

    public void setDefaultTimezone(String defaultTimezone) {
        this.defaultTimezone = defaultTimezone;
    }

    public int getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(int maxRetries) {
        this.maxRetries = maxRetries;
    }

    public int getPollingBatchSize() {
        return pollingBatchSize;
    }

    public void setPollingBatchSize(int pollingBatchSize) {
        this.pollingBatchSize = pollingBatchSize;
    }

    public String getAccountNotificationsPath() {
        return accountNotificationsPath;
    }

    public void setAccountNotificationsPath(String accountNotificationsPath) {
        this.accountNotificationsPath = accountNotificationsPath;
    }
}
