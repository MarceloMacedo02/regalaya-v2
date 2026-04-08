package br.com.regalaya.admin.services;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.Specification;

import br.com.regalaya.auth.domain.model.User;
import jakarta.persistence.criteria.Predicate;

/**
 * Specifications para filtros dinâmicos de clientes no painel admin.
 * <p>
 * Implementa o Specification Pattern para permitir combinações flexíveis
 * de filtros com lógica AND, seguindo as melhores práticas do Spring Data JPA.
 * </p>
 * <p>
 * Cada método retorna {@code null} quando o parâmetro é ausente/vazio,
 * permitindo que o Spring ignore o filtro automaticamente.
 * </p>
 *
 * @see org.springframework.data.jpa.domain.Specification
 */
public final class CustomerSpecifications {

    private CustomerSpecifications() {
    }

    /**
     * Filtra clientes por status (ATIVO/INATIVO).
     *
     * @param status o status a filtrar, ou {@code null} para ignorar
     * @return Specification com o filtro de status
     */
    public static Specification<User> hasStatus(String status) {
        return (root, query, cb) ->
                status == null || status.isBlank() ? null : cb.equal(root.get("status"), status);
    }

    /**
     * Filtra clientes com data de registro maior ou igual a.
     *
     * @param dateFrom data inicial (inclusive), ou {@code null} para ignorar
     * @return Specification com o filtro de data inicial
     */
    public static Specification<User> hasRegistrationDateFrom(LocalDateTime dateFrom) {
        return (root, query, cb) ->
                dateFrom == null ? null : cb.greaterThanOrEqualTo(root.get("createdAt"), dateFrom);
    }

    /**
     * Filtra clientes com data de registro menor ou igual a.
     *
     * @param dateTo data final (inclusive), ou {@code null} para ignorar
     * @return Specification com o filtro de data final
     */
    public static Specification<User> hasRegistrationDateTo(LocalDateTime dateTo) {
        return (root, query, cb) ->
                dateTo == null ? null : cb.lessThanOrEqualTo(root.get("createdAt"), dateTo);
    }

    /**
     * Filtra clientes por busca textual em nome, email ou telefone.
     * <p>
     * Utiliza LIKE case-insensitive com fuzzy matching (%term%).
     * </p>
     *
     * @param search termo de busca, ou {@code null}/vazio para ignorar
     * @return Specification com o filtro de busca textual
     */
    public static Specification<User> hasSearchTerm(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) {
                return null;
            }
            String likePattern = "%" + search.toLowerCase() + "%";
            Predicate nameLike = cb.like(cb.lower(root.get("name")), likePattern);
            Predicate emailLike = cb.like(cb.lower(root.get("email")), likePattern);
            Predicate phoneLike = cb.like(cb.lower(root.get("phone")), likePattern);
            return cb.or(nameLike, emailLike, phoneLike);
        };
    }
}
