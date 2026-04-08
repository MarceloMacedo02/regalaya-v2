package br.com.regalaya.admin.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.UUID;

import br.com.regalaya.admin.dto.requests.OrderFilterRequest;
import br.com.regalaya.admin.dto.responses.CustomerChartDataResponse;
import br.com.regalaya.admin.dto.responses.CustomerOrderSummaryResponse;
import br.com.regalaya.admin.dto.responses.CustomerProfileResponse;
import br.com.regalaya.admin.services.CustomerProfileService;
import br.com.regalaya.order.domain.model.OrderStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1/admin/customers")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin Customer Profile", description = "Endpoints para perfil detalhado de clientes")
@RequiredArgsConstructor
@Slf4j
public class CustomerProfileController {

    private final CustomerProfileService customerProfileService;

    @GetMapping("/{customerId}")
    @Operation(summary = "Obter perfil detalhado do cliente", description = "Retorna informações completas incluindo métricas e segmentação")
    public ResponseEntity<CustomerProfileResponse> getCustomerProfile(
            @Parameter(description = "ID do cliente") @PathVariable UUID customerId) {

        log.info("Admin acessou perfil do cliente: {}", customerId);
        CustomerProfileResponse response = customerProfileService.getCustomerProfile(customerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{customerId}/orders")
    @Operation(summary = "Obter histórico de pedidos do cliente", description = "Lista pedidos com filtros e paginação")
    public ResponseEntity<org.springframework.data.domain.Page<CustomerOrderSummaryResponse>> getCustomerOrders(
            @Parameter(description = "ID do cliente") @PathVariable UUID customerId,
            @Parameter(description = "Filtro por status (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)")
            @RequestParam(required = false) String status,
            @Parameter(description = "Data inicial (YYYY-MM-DD)") @RequestParam(required = false) LocalDate startDate,
            @Parameter(description = "Data final (YYYY-MM-DD)") @RequestParam(required = false) LocalDate endDate,
            @Parameter(description = "Buscar por nome do produto") @RequestParam(required = false) String productName,
            @Parameter(description = "Página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamanho da página") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Campo para ordenação (createdAt, total, status)") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Direção da ordenação (asc, desc)") @RequestParam(defaultValue = "desc") String sortDirection
    ) {

        log.info("Admin listando pedidos do cliente {} com filtros: status={}, start={}, end={}, product={}",
                customerId, status, startDate, endDate, productName);

        OrderFilterRequest filter = new OrderFilterRequest(
                status, startDate, endDate, productName, page, size, sortBy, sortDirection
        );

        var ordersPage = customerProfileService.getCustomerOrders(customerId, filter, page, size, sortBy, sortDirection);
        return ResponseEntity.ok(ordersPage);
    }

    @GetMapping("/{customerId}/orders/export")
    @Operation(summary = "Exportar histórico de pedidos para CSV", description = "Exporta até 10.000 registros")
    public void exportCustomerOrdersToCsv(
            @Parameter(description = "ID do cliente") @PathVariable UUID customerId,
            @Parameter(description = "Filtro por status") @RequestParam(required = false) String status,
            @Parameter(description = "Data inicial") @RequestParam(required = false) LocalDate startDate,
            @Parameter(description = "Data final") @RequestParam(required = false) LocalDate endDate,
            @Parameter(description = "Buscar por produto") @RequestParam(required = false) String productName,
            HttpServletResponse response) throws Exception {

        log.info("Admin exportando CSV de pedidos do cliente: {}", customerId);

        OrderFilterRequest filter = new OrderFilterRequest(
                status, startDate, endDate, productName, 0, 10000, "createdAt", "desc"
        );

        String csv = customerProfileService.exportCustomerOrdersToCsv(customerId, filter, 0, 10000, "createdAt", "desc");

        response.setContentType("text/csv; charset=utf-8");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"customer_" + customerId + "_orders_" + System.currentTimeMillis() + ".csv\"");

        try (OutputStream out = response.getOutputStream();
             PrintWriter writer = new PrintWriter(out, true)) {
            writer.write(csv);
        }
    }

    @GetMapping("/{customerId}/analytics")
    @Operation(summary = "Obter dados analíticos para gráficos", description = "Retorna dados agregados por período")
    public ResponseEntity<CustomerChartDataResponse> getCustomerAnalytics(
            @Parameter(description = "ID do cliente") @PathVariable UUID customerId,
            @Parameter(description = "Data inicial (YYYY-MM-DD)") @RequestParam(required = false) LocalDate startDate,
            @Parameter(description = "Data final (YYYY-MM-DD)") @RequestParam(required = false) LocalDate endDate) {

        log.info("Admin solicitando analytics do cliente {}: start={}, end={}", customerId, startDate, endDate);

        // Se não informado, usar últimos 12 meses
        if (startDate == null || endDate == null) {
            YearMonth[] period = customerProfileService.getDefaultPeriod();
            startDate = period[0].atDay(1);
            endDate = period[1].atEndOfMonth();
        }

        CustomerChartDataResponse chartData = customerProfileService.getCustomerChartData(customerId, startDate, endDate);
        return ResponseEntity.ok(chartData);
    }

    @PostMapping("/{customerId}/recalculate-segmentation")
    @Operation(summary = "Recalcular segmentação manualmente", description = "Força recálculo de métricas e segmento")
    public ResponseEntity<Void> recalculateSegmentation(
            @Parameter(description = "ID do cliente") @PathVariable UUID customerId) {

        log.info("Admin solicitando recálculo de segmentação para cliente: {}", customerId);
        customerProfileService.recalculateCustomerSegmentation(customerId);
        return ResponseEntity.ok().build();
    }
}
