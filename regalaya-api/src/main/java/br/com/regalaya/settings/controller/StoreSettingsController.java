package br.com.regalaya.settings.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.settings.dto.requests.UpdateStoreSettingsRequest;
import br.com.regalaya.settings.dto.responses.StoreSettingResponse;
import br.com.regalaya.settings.services.StoreSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/admin/settings")
@Tag(name = "Admin - Store Settings", description = "Store settings management operations")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class StoreSettingsController {

    private final StoreSettingsService storeSettingsService;

    public StoreSettingsController(StoreSettingsService storeSettingsService) {
        this.storeSettingsService = storeSettingsService;
    }

    @GetMapping
    @Operation(summary = "List all store settings")
    public ResponseEntity<List<StoreSettingResponse>> findAll() {
        return ResponseEntity.ok(storeSettingsService.findAll());
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get settings by category")
    public ResponseEntity<List<StoreSettingResponse>> findByCategory(@PathVariable String category) {
        return ResponseEntity.ok(storeSettingsService.findByCategory(category));
    }

    @GetMapping("/key/{key}")
    @Operation(summary = "Get setting by key")
    public ResponseEntity<StoreSettingResponse> findByKey(@PathVariable String key) {
        return ResponseEntity.ok(storeSettingsService.findByKey(key));
    }

    @PutMapping("/key/{key}")
    @Operation(summary = "Update a setting")
    public ResponseEntity<StoreSettingResponse> update(@PathVariable String key,
            @Valid @RequestBody UpdateStoreSettingsRequest request) {
        return ResponseEntity.ok(storeSettingsService.update(key, request));
    }

    @PutMapping("/bulk")
    @Operation(summary = "Update multiple settings")
    public ResponseEntity<Map<String, String>> updateBulk(@RequestBody Map<String, String> settings) {
        storeSettingsService.updateBulk(settings);
        return ResponseEntity.ok(settings);
    }
}
