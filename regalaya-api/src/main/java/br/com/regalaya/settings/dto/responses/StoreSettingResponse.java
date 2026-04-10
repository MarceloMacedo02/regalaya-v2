package br.com.regalaya.settings.dto.responses;

public record StoreSettingResponse(
    String settingKey,
    String settingValue,
    String category,
    String description
) {}
