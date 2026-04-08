package br.com.regalaya.communication.controller.admin;

import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.communication.dto.request.TemplateRequest;
import br.com.regalaya.communication.dto.response.TemplateResponse;
import br.com.regalaya.communication.service.TemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/admin/templates")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Communication Templates (Admin)", description = "Gestão de templates de comunicação")
@PreAuthorize("hasRole('ADMIN')")
public class TemplateController {

    private final TemplateService templateService;

    @GetMapping
    @Operation(summary = "Listar templates", description = "Lista todos os templates de comunicação cadastrados")
    public ResponseEntity<List<TemplateResponse>> findAll(
            @RequestParam(required = false) CommunicationType type,
            @RequestParam(required = false) String search) {
        List<TemplateResponse> templates;
        if (type != null) {
            templates = templateService.findByType(type);
        } else if (search != null && !search.isBlank()) {
            templates = templateService.searchByName(search);
        } else {
            templates = templateService.findAll();
        }
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar template por ID")
    public ResponseEntity<TemplateResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(templateService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Criar template")
    public ResponseEntity<TemplateResponse> create(@Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(templateService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar template")
    public ResponseEntity<TemplateResponse> update(@PathVariable UUID id, @Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.ok(templateService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar template")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        templateService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/versions")
    @Operation(summary = "Histórico de versões", description = "Lista as versões de um template")
    public ResponseEntity<List<TemplateResponse>> getVersions(@PathVariable UUID id) {
        return ResponseEntity.ok(templateService.getVersions(id));
    }

    @PostMapping("/import")
    @Operation(summary = "Importar templates", description = "Importa templates a partir de JSON")
    public ResponseEntity<List<TemplateResponse>> importTemplates(@RequestBody Map<String, String> payload) {
        String jsonContent = payload.get("jsonContent");
        return ResponseEntity.status(HttpStatus.CREATED).body(templateService.importTemplates(jsonContent));
    }

    @GetMapping("/export")
    @Operation(summary = "Exportar templates", description = "Exporta todos os templates em formato JSON")
    public ResponseEntity<String> exportTemplates() {
        return ResponseEntity.ok(templateService.exportTemplates());
    }
}
