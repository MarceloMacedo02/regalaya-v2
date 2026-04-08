package br.com.regalaya.admin.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.admin.dto.responses.CustomerAdminStatsResponse;
import br.com.regalaya.admin.dto.responses.CustomerListResponse;
import br.com.regalaya.admin.repository.CustomerAdminRepository;
import br.com.regalaya.auth.domain.model.Role;
import br.com.regalaya.auth.domain.model.User;

/**
 * Implementação do serviço administrativo de clientes.
 * <p>
 * Orquestra o repositório de clientes com o Specification Pattern para
 * fornecer listagem paginada com filtros combináveis.
 * </p>
 * <p>
 * Cada cliente retornado inclui estatísticas de pedidos (quantidade e total gasto)
 * calculadas em tempo real via consultas ao módulo de pedidos.
 * </p>
 */
@Service
public class CustomerAdminServiceImpl implements CustomerAdminService {

    private static final Logger log = LoggerFactory.getLogger(CustomerAdminServiceImpl.class);

    private final CustomerAdminRepository customerAdminRepository;

    public CustomerAdminServiceImpl(CustomerAdminRepository customerAdminRepository) {
        this.customerAdminRepository = customerAdminRepository;
    }

    /**
     * {@inheritDoc}
     * <p>
     * Os filtros de data aceitam o formato ISO-8601 (yyyy-MM-dd'T'HH:mm:ss).
     * Quando ausentes ou vazios, são ignorados automaticamente.
     * </p>
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CustomerListResponse> findAll(String status,
                                               String registrationDateFrom,
                                               String registrationDateTo,
                                               Integer minOrders,
                                               Integer maxOrders,
                                               String search,
                                               Pageable pageable) {
        log.debug("Listing customers with filters - status: {}, dateFrom: {}, dateTo: {}, search: {}",
                status, registrationDateFrom, registrationDateTo, search);

        Specification<User> specs = Specification
                .where(CustomerSpecifications.hasStatus(normalizeStatus(status)))
                .and(CustomerSpecifications.hasRegistrationDateFrom(parseDate(registrationDateFrom)))
                .and(CustomerSpecifications.hasRegistrationDateTo(parseDate(registrationDateTo)))
                .and(CustomerSpecifications.hasMinOrders(minOrders))
                .and(CustomerSpecifications.hasMaxOrders(maxOrders))
                .and(CustomerSpecifications.hasSearchTerm(search));

        Page<User> users = customerAdminRepository.findAll(specs, pageable);

        return users.map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerAdminStatsResponse getStats() {
        long totalCustomers = customerAdminRepository.countByRoleIn(List.of(Role.USER, Role.CLIENT));
        long activeCustomers = customerAdminRepository.countActiveCustomers();
        BigDecimal totalRevenue = customerAdminRepository.sumRevenue();
        BigDecimal averageTicket = totalCustomers > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalCustomers), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new CustomerAdminStatsResponse(totalCustomers, activeCustomers, averageTicket, totalRevenue);
    }

    /**
     * Converte uma entidade User em CustomerListResponse com estatísticas.
     */
    private CustomerListResponse toResponse(User user) {
        long orderCount = customerAdminRepository.countOrdersByUserId(user.getId());
        var totalSpent = customerAdminRepository.sumTotalSpentByUserId(user.getId());

        return new CustomerListResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                translateStatus(user.getStatus()),
                user.getCreatedAt(),
                orderCount,
                totalSpent
        );
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        return switch (status.trim().toUpperCase(Locale.ROOT)) {
            case "ATIVO", "ACTIVE" -> "ACTIVE";
            case "INATIVO", "INACTIVE" -> "INACTIVE";
            default -> status.trim().toUpperCase(Locale.ROOT);
        };
    }

    private String translateStatus(String status) {
        if (status == null) {
            return "INATIVO";
        }

        return "ACTIVE".equalsIgnoreCase(status) ? "ATIVO" : "INATIVO";
    }

    /**
     * Faz parse de uma string de data ISO-8601 para LocalDateTime.
     * Retorna {@code null} se a string for vazia ou inválida.
     */
    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) {
            return null;
        }
        try {
            if (dateStr.length() == 10) {
                return LocalDate.parse(dateStr).atStartOfDay();
            }
            return LocalDateTime.parse(dateStr);
        } catch (DateTimeParseException e) {
            log.warn("Invalid date format: '{}'. Expected ISO-8601 (yyyy-MM-dd'T'HH:mm:ss)", dateStr);
            return null;
        }
    }
}
