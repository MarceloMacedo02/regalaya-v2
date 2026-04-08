package br.com.regalaya.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.servlet.support.RequestContextUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.Locale;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.dto.requests.ForgotPasswordRequest;
import br.com.regalaya.auth.dto.requests.LoginRequest;
import br.com.regalaya.auth.dto.requests.RefreshTokenRequest;
import br.com.regalaya.auth.dto.requests.RegisterRequest;
import br.com.regalaya.auth.dto.requests.ResetPasswordRequest;
import br.com.regalaya.auth.dto.requests.ValidateEmailRequest;
import br.com.regalaya.auth.dto.requests.ValidateUsernameRequest;
import br.com.regalaya.auth.dto.responses.AuthResponse;
import br.com.regalaya.auth.dto.responses.LogoutResponse;
import br.com.regalaya.auth.dto.responses.PasswordResetResponse;
import br.com.regalaya.auth.dto.responses.UserResponse;
import br.com.regalaya.auth.dto.responses.ValidationResponse;
import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import br.com.regalaya.auth.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints para autenticação e gerenciamento de usuários")
@Validated
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Registra um novo usuário", description = "Cria uma nova conta de usuário")
    @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "409", description = "Email já em uso")
    @ApiResponse(responseCode = "429", description = "Limite de tentativas excedido")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                                  ServletWebRequest webRequest,
                                                  HttpServletRequest httpRequest) {
        Locale locale = RequestContextUtils.getLocale(httpRequest);
        AuthResponse response = authService.register(request, webRequest, locale);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Autentica um usuário", description = "Realiza login e retorna tokens JWT")
    @ApiResponse(responseCode = "200", description = "Login bem-sucedido")
    @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    @ApiResponse(responseCode = "429", description = "Limite de tentativas excedido")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                               ServletWebRequest webRequest) {
        AuthResponse response = authService.login(request, webRequest);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Logout do usuário", description = "Revoga tokens e encerra sessão")
    @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso")
    @ApiResponse(responseCode = "401", description = "Não autenticado")
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(@RequestHeader("Authorization") String authorization,
                                                  ServletWebRequest webRequest) {
        String accessToken = authorization.replace("Bearer ", "");
        authService.logout(accessToken, webRequest);
        return ResponseEntity.ok(new LogoutResponse("Logout realizado com sucesso", LocalDateTime.now()));
    }

    @Operation(summary = "Solicita recuperação de senha", description = "Envia token de recuperação por email")
    @ApiResponse(responseCode = "200", description = "Email processado")
    @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    @ApiResponse(responseCode = "429", description = "Limite de tentativas excedido")
    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            ServletWebRequest webRequest,
            HttpServletRequest httpRequest) {
        Locale locale = RequestContextUtils.getLocale(httpRequest);
        PasswordResetResponse response = authService.forgotPassword(request, webRequest, locale);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Redefine senha", description = "Redefine a senha usando token de recuperação")
    @ApiResponse(responseCode = "200", description = "Senha redefinida com sucesso")
    @ApiResponse(responseCode = "400", description = "Token inválido ou expirado")
    @ApiResponse(responseCode = "429", description = "Limite de tentativas excedido")
    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResetResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request,
            ServletWebRequest webRequest) {
        PasswordResetResponse response = authService.resetPassword(request, webRequest);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Valida email", description = "Valida token de verificação de email")
    @ApiResponse(responseCode = "200", description = "Email validado com sucesso")
    @ApiResponse(responseCode = "400", description = "Token inválido")
    @ApiResponse(responseCode = "429", description = "Limite de tentativas excedido")
    @PostMapping("/validate-email")
    public ResponseEntity<ValidationResponse> validateEmail(
            @Valid @RequestBody ValidateEmailRequest request,
            ServletWebRequest webRequest,
            HttpServletRequest httpRequest) {
        Locale locale = RequestContextUtils.getLocale(httpRequest);
        ValidationResponse response = authService.validateEmail(request, webRequest, locale);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Valida username/email", description = "Verifica se email/username está disponível")
    @ApiResponse(responseCode = "200", description = "Validação concluída")
    @PostMapping("/validate-username")
    public ResponseEntity<ValidationResponse> validateUsername(
            @Valid @RequestBody ValidateUsernameRequest request) {
        ValidationResponse response = authService.validateUsername(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Renova token de acesso", description = "Gera novo access token usando refresh token")
    @ApiResponse(responseCode = "200", description = "Token renovado com sucesso")
    @ApiResponse(responseCode = "401", description = "Refresh token inválido")
    @ApiResponse(responseCode = "429", description = "Limite de tentativas excedido")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request,
            ServletWebRequest webRequest) {
        AuthResponse response = authService.refreshToken(request.refreshToken(), webRequest);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Obtém dados do usuário atual", description = "Retorna informações do usuário autenticado")
    @ApiResponse(responseCode = "200", description = "Dados retornados com sucesso")
    @ApiResponse(responseCode = "401", description = "Não autenticado")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        UserResponse response = authService.getCurrentUser(userDetails.getId());
        return ResponseEntity.ok(response);
    }
}
