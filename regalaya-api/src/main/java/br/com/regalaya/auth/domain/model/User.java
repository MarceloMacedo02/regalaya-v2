package br.com.regalaya.auth.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_status_name", columnList = "status, name"),
        @Index(name = "idx_user_created_at_name", columnList = "createdAt, name"),
        @Index(name = "idx_user_status_created_at", columnList = "status, createdAt")
})
@Getter
@Setter
@ToString(exclude = {"password"})
@EqualsAndHashCode(of = "id", callSuper = false)
public class User extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserPlan plan = UserPlan.FREE;

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_password_expires_at")
    private LocalDateTime resetPasswordExpiresAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(updatable = false)
    private LocalDateTime deletedAt;

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }
}
