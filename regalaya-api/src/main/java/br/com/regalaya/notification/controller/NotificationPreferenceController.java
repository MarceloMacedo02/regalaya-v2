package br.com.regalaya.notification.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.regalaya.notification.dto.NotificationPreferenceDto;
import br.com.regalaya.notification.service.NotificationPreferenceService;
import lombok.RequiredArgsConstructor;

// Assuming UserDetails has getId(), using Object and casting or standard way depends on security config
// Let's assume we can get userId from the context or pass it explicitly.
// For now, let's use the exact type from `br.com.regalaya.auth.infrastructure.security.UserDetailsImpl`

@RestController
@RequestMapping("/api/v1/account/preferences/notifications")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private final NotificationPreferenceService service;

    @GetMapping
    public ResponseEntity<NotificationPreferenceDto> getPreferences(@AuthenticationPrincipal br.com.regalaya.auth.infrastructure.security.UserDetailsImpl userDetails) {
        return ResponseEntity.ok(service.getPreferences(userDetails.getId()));
    }

    @PutMapping
    public ResponseEntity<NotificationPreferenceDto> updatePreferences(
            @AuthenticationPrincipal br.com.regalaya.auth.infrastructure.security.UserDetailsImpl userDetails,
            @RequestBody NotificationPreferenceDto dto) {
        return ResponseEntity.ok(service.updatePreferences(userDetails.getId(), dto));
    }

    @GetMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribe(@RequestParam String token) {
        boolean success = service.unsubscribe(token);
        if (success) {
            return ResponseEntity.ok("Unsubscribed successfully. You will no longer receive marketing or general emails.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired unsubscribe token.");
        }
    }
}
