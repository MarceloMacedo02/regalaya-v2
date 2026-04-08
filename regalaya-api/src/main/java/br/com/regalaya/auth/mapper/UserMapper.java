package br.com.regalaya.auth.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import br.com.regalaya.auth.dto.requests.RegisterRequest;
import br.com.regalaya.auth.dto.responses.UserResponse;
import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.domain.model.Role;

@Component
public class UserMapper {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    // Entity -> Response DTO
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole() != null ? user.getRole().name() : null,
            user.getPhone(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    // Request DTO -> Entity (senha criptografada automaticamente)
    public User toEntity(RegisterRequest request) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setRole(Role.USER); // Padrão: USER
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setStatus("ACTIVE");
        user.setEmailVerified(false);
        return user;
    }

    // Update entity from request (sem alterar email e role)
    public void updateEntity(User user, RegisterRequest request) {
        if (user == null || request == null) {
            return;
        }

        user.setName(request.name());
        // Email e role são imutáveis após criação
    }
}
