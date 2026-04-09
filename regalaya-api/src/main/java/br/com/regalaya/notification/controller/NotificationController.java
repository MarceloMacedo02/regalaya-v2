package br.com.regalaya.notification.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import br.com.regalaya.notification.dto.responses.NotificationPageResponse;
import br.com.regalaya.notification.dto.responses.NotificationReadResponse;
import br.com.regalaya.notification.service.NotificationQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/notifications")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notificações do usuário autenticado")
public class NotificationController {

    private final NotificationQueryService notificationQueryService;

    @GetMapping
    @Operation(summary = "Listar notificações", description = "Lista notificações do usuário autenticado com paginação simples")
    public ResponseEntity<NotificationPageResponse> listNotifications(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(notificationQueryService.listUserNotifications(
                userDetails.getId(), status, type, page, size
        ));
    }

    @PatchMapping("/{notificationId}/read")
    @Operation(summary = "Marcar notificação como lida", description = "Marca a notificação do usuário autenticado como lida")
    public ResponseEntity<NotificationReadResponse> markAsRead(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID notificationId
    ) {
        return ResponseEntity.ok(notificationQueryService.markAsRead(userDetails.getId(), notificationId));
    }
}
