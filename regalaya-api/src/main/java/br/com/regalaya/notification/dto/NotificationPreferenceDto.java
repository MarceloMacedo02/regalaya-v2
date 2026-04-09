package br.com.regalaya.notification.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceDto {
    private Boolean emailEnabled;
    private Boolean whatsappEnabled;
    private Boolean marketingEnabled;
    private Boolean transactionalEnabled;
}
