package br.com.regalaya.cms.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.cms.dto.requests.CreateCmsPageRequest;
import br.com.regalaya.cms.dto.requests.UpdateCmsPageRequest;
import br.com.regalaya.cms.dto.responses.CmsPageResponse;
import br.com.regalaya.cms.services.CmsPageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/admin/cms/pages")
@Tag(name = "Admin - CMS Pages", description = "CMS page management operations")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class CmsPageController {

    private final CmsPageService cmsPageService;

    public CmsPageController(CmsPageService cmsPageService) {
        this.cmsPageService = cmsPageService;
    }

    @GetMapping
    @Operation(summary = "List all CMS pages")
    public ResponseEntity<List<CmsPageResponse>> findAll() {
        return ResponseEntity.ok(cmsPageService.findAll());
    }

    @GetMapping("/published")
    @Operation(summary = "List published CMS pages")
    public ResponseEntity<List<CmsPageResponse>> findPublished() {
        return ResponseEntity.ok(cmsPageService.findPublished());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get CMS page by ID")
    public ResponseEntity<CmsPageResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(cmsPageService.findBySlug(
                cmsPageService.findAll().stream()
                        .filter(p -> p.id().equals(id))
                        .findFirst()
                        .map(CmsPageResponse::slug)
                        .orElseThrow(() -> new RuntimeException("Página não encontrada"))));
    }

    @PostMapping
    @Operation(summary = "Create CMS page")
    public ResponseEntity<CmsPageResponse> create(@Valid @RequestBody CreateCmsPageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cmsPageService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update CMS page")
    public ResponseEntity<CmsPageResponse> update(@PathVariable UUID id,
            @Valid @RequestBody UpdateCmsPageRequest request) {
        return ResponseEntity.ok(cmsPageService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete CMS page")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        cmsPageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
