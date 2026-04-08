package br.com.regalaya.auth.infrastructure.security;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import br.com.regalaya.auth.domain.model.User;

public class UserDetailsImpl implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(UUID id, String email, String password, Set<String> permissions) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    public static UserDetailsImpl build(User user) {
        Set<String> permissions = user.getRole() != null
                ? user.getRole().getPermissions()
                : Set.of();

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                permissions
        );
    }

    public UUID getId() {
        return id;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
