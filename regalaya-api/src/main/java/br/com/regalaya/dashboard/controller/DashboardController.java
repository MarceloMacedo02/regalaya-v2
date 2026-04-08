package br.com.regalaya.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.dashboard.dto.responses.DashboardStatsResponse;
import br.com.regalaya.dashboard.dto.responses.SalesDataResponse;
import br.com.regalaya.dashboard.dto.responses.TopProductResponse;
import br.com.regalaya.dashboard.services.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/v1/dashboard")
@Tag(name = "Dashboard", description = "Dashboard analytics operations")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStatsResponse> getStats(
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(dashboardService.getStats(period));
    }

    @GetMapping("/sales")
    @Operation(summary = "Get sales data for chart")
    public ResponseEntity<List<SalesDataResponse>> getSalesData(
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(dashboardService.getSalesData(period));
    }

    @GetMapping("/top-products")
    @Operation(summary = "Get top selling products")
    public ResponseEntity<List<TopProductResponse>> getTopProducts(
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getTopProducts(period, limit));
    }
}
