package br.com.regalaya.banner.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.banner.dto.requests.CreateBannerRequest;
import br.com.regalaya.banner.dto.requests.UpdateBannerRequest;
import br.com.regalaya.banner.dto.responses.BannerResponse;
import br.com.regalaya.banner.services.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/admin/banners")
@Tag(name = "Admin - Banners", description = "Banner management operations")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    @Operation(summary = "List all banners")
    public ResponseEntity<List<BannerResponse>> findAll() {
        return ResponseEntity.ok(bannerService.findAll());
    }

    @GetMapping("/active")
    @Operation(summary = "List active banners")
    public ResponseEntity<List<BannerResponse>> findActive() {
        return ResponseEntity.ok(bannerService.findActive());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get banner by ID")
    public ResponseEntity<BannerResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(bannerService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create new banner")
    public ResponseEntity<BannerResponse> create(@Valid @RequestBody CreateBannerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update banner")
    public ResponseEntity<BannerResponse> update(@PathVariable UUID id,
            @Valid @RequestBody UpdateBannerRequest request) {
        return ResponseEntity.ok(bannerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete banner")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        bannerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Toggle banner active status")
    public ResponseEntity<BannerResponse> toggleActive(@PathVariable UUID id) {
        return ResponseEntity.ok(bannerService.toggleActive(id));
    }
}
