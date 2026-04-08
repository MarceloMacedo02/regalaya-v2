package br.com.regalaya.admin.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.regalaya.admin.dto.responses.CustomerAdminStatsResponse;
import br.com.regalaya.admin.dto.responses.CustomerListResponse;
import br.com.regalaya.admin.services.CustomerAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller administrativo para gestão de clientes.
 * <p>
 * Fornece endpoints para listagem paginada e filtrada de clientes
 * no painel administrativo, com estatísticas de pedidos em tempo real.
 * </p>
 * <p>
 * Todos os endpoints exigem autenticação e autorização com roles
 * {@code ADMIN} ou {@code MANAGER}.
 * </p>
 */
@RestController
@RequestMapping("/v1/admin/customers")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin - Customers", description = "Admin customer management operations")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class CustomerAdminController {

    private final CustomerAdminService customerAdminService;

    public CustomerAdminController(CustomerAdminService customerAdminService) {
        this.customerAdminService = customerAdminService;
    }

    /**
     * Lista clientes com paginação e filtros opcionais.
     * <p>
     * Filtros disponíveis:
     * <ul>
     *   <li>{@code status} - Filtra por status (ATIVO/INATIVO)</li>
     *   <li>{@code registrationDateFrom} - Data de registro inicial (ISO-8601)</li>
     *   <li>{@code registrationDateTo} - Data de registro final (ISO-8601)</li>
     *   <li>{@code search} - Busca textual em nome, email ou telefone</li>
     * </ul>
     * Todos os filtros são combináveis com lógica AND e opcionais.
     * </p>
     *
     * @param status             filtro por status (ATIVO/INATIVO), opcional
     * @param registrationDateFrom data de registro inicial, opcional
     * @param registrationDateTo   data de registro final, opcional
     * @param search              termo de busca textual, opcional
     * @param pageable            configuração de paginação (padrão: page=0, size=50, sort=name,asc)
     * @return página de clientes com estatísticas de pedidos
     */
    @GetMapping
    @Operation(
            summary = "List all customers",
            description = "Returns a paginated list of customers with optional filters (status, date range, search). "
                    + "All filters are combinable with AND logic. Default page size is 50."
    )
    public ResponseEntity<Page<CustomerListResponse>> findAll(
            @Parameter(description = "Filter by status (ATIVO/INATIVO)")
            @RequestParam(required = false) String status,

            @Parameter(description = "Registration date from (ISO-8601 format: yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam(required = false) String dateFrom,

            @Parameter(description = "Registration date to (ISO-8601 format: yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam(required = false) String dateTo,

            @Parameter(description = "Minimum number of orders")
            @RequestParam(required = false) Integer minOrders,

            @Parameter(description = "Maximum number of orders")
            @RequestParam(required = false) Integer maxOrders,

            @Parameter(description = "Search term for name, email or phone (case-insensitive fuzzy match)")
            @RequestParam(required = false) String search,

            @Parameter(description = "Pagination parameters. Default: size=50, sort=name,asc")
            @PageableDefault(size = 50, sort = "name") Pageable pageable) {

        return ResponseEntity.ok(customerAdminService.findAll(status, dateFrom, dateTo, minOrders, maxOrders, search, pageable));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get customer dashboard stats")
    public ResponseEntity<CustomerAdminStatsResponse> getStats() {
        return ResponseEntity.ok(customerAdminService.getStats());
    }
}
