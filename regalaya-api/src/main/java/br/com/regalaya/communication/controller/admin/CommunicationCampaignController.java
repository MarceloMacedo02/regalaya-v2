package br.com.regalaya.communication.controller.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.regalaya.communication.dto.request.CommunicationCampaignRequest;
import br.com.regalaya.communication.dto.response.CommunicationCampaignResponse;
import br.com.regalaya.communication.service.CommunicationCampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/admin/communications")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Communication Campaigns (Admin)", description = "Gestão e disparo de campanhas")
@PreAuthorize("hasRole('ADMIN')")
public class CommunicationCampaignController {

    private final CommunicationCampaignService communicationCampaignService;

    @PostMapping("/send")
    @Operation(summary = "Criar e disparar campanha")
    public ResponseEntity<CommunicationCampaignResponse> send(@Valid @RequestBody CommunicationCampaignRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(communicationCampaignService.sendCampaign(request));
    }

    @GetMapping("/campaigns")
    @Operation(summary = "Listar campanhas")
    public ResponseEntity<List<CommunicationCampaignResponse>> findAll() {
        return ResponseEntity.ok(communicationCampaignService.findAll());
    }

    @GetMapping("/campaigns/{id}")
    @Operation(summary = "Detalhar campanha")
    public ResponseEntity<CommunicationCampaignResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(communicationCampaignService.findById(id));
    }

    @DeleteMapping("/campaigns/{id}")
    @Operation(summary = "Excluir campanha")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        communicationCampaignService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
