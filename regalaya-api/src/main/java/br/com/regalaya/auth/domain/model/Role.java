package br.com.regalaya.auth.domain.model;

import java.util.Set;

public enum Role {
    ADMIN(Set.of(
        "ROLE_ADMIN",
        "ROLE_CREATE_USER",
        "ROLE_READ_USER",
        "ROLE_UPDATE_USER",
        "ROLE_DELETE_USER",
        "ROLE_MANAGE_SYSTEM"
    )),
    USER(Set.of(
        "ROLE_USER",
        "ROLE_READ_OWN_PROFILE",
        "ROLE_UPDATE_OWN_PROFILE"
    )),
    CLIENT(Set.of(
        "ROLE_CLIENT",
        "ROLE_READ_OWN_DATA",
        "ROLE_CREATE_ORDERS",
        "ROLE_READ_OWN_ORDERS"
    ));

    private final Set<String> permissions;

    Role(Set<String> permissions) {
        this.permissions = permissions;
    }

    public Set<String> getPermissions() {
        return permissions;
    }
}
