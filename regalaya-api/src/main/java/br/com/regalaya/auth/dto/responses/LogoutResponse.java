package br.com.regalaya.auth.dto.responses;

import java.time.LocalDateTime;

public record LogoutResponse(String message, LocalDateTime logoutTime) {
}
