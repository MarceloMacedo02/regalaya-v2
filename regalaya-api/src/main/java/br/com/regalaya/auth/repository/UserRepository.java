package br.com.regalaya.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.regalaya.auth.domain.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByResetPasswordToken(String token);

    @Query("SELECT u.id, u.name, u.email, u.role FROM User u WHERE u.email = :email")
    Optional<UserInfoProjection> findUserInfoByEmail(String email);

    interface UserInfoProjection {
        UUID getId();
        String getName();
        String getEmail();
        br.com.regalaya.auth.domain.model.Role getRole();
    }
}
