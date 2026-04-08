package br.com.regalaya.contact.controller;

import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
import br.com.regalaya.contact.dto.requests.CreateContactRequest;
import br.com.regalaya.contact.dto.requests.CreateSpecialDateRequest;
import br.com.regalaya.contact.dto.requests.ImportContactsRequest;
import br.com.regalaya.contact.dto.requests.UpdateContactRequest;
import br.com.regalaya.contact.dto.requests.UpdateSpecialDateRequest;
import br.com.regalaya.contact.dto.responses.ContactDetailResponse;
import br.com.regalaya.contact.dto.responses.ContactResponse;
import br.com.regalaya.contact.dto.responses.ImportReportResponse;
import br.com.regalaya.contact.dto.responses.SpecialDateResponse;
import br.com.regalaya.contact.services.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/contacts")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Contacts", description = "Gerenciamento de contatos/pessoas queridas")
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    @Operation(summary = "Criar contato", description = "Cria uma nova pessoa querida para o usuário autenticado")
    public ResponseEntity<ContactResponse> create(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateContactRequest request) {
        ContactResponse response = contactService.create(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar contatos", description = "Lista todos os contatos do usuário autenticado")
    public ResponseEntity<List<ContactResponse>> findAll(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) String search) {
        List<ContactResponse> contacts;
        if (search != null && !search.isBlank()) {
            contacts = contactService.searchByUser(userDetails.getId(), search.trim());
        } else {
            contacts = contactService.findAllByUser(userDetails.getId());
        }
        return ResponseEntity.ok(contacts);
    }

    @PostMapping("/import")
    @Operation(summary = "Importar contatos em lote", description = "Importa até 100 contatos de uma vez. Retorna relatório de sucesso/erro.")
    public ResponseEntity<ImportReportResponse> importContacts(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ImportContactsRequest request) {
        ImportReportResponse report = contactService.importContacts(
                userDetails.getId(), request.contacts());
        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar contato por ID", description = "Retorna os detalhes de um contato específico com suas datas especiais")
    public ResponseEntity<ContactDetailResponse> findById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        return ResponseEntity.ok(contactService.findById(userDetails.getId(), id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar contato", description = "Atualiza um contato existente")
    public ResponseEntity<ContactResponse> update(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateContactRequest request) {
        return ResponseEntity.ok(contactService.update(userDetails.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir contato", description = "Exclui um contato e todas as suas datas especiais")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        contactService.delete(userDetails.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{contactId}/special-dates")
    @Operation(summary = "Adicionar data especial", description = "Adiciona uma data especial (aniversário, etc) a um contato")
    public ResponseEntity<SpecialDateResponse> addSpecialDate(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID contactId,
            @Valid @RequestBody CreateSpecialDateRequest request) {
        SpecialDateResponse response = contactService.addSpecialDate(userDetails.getId(), contactId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{contactId}/special-dates/{dateId}")
    @Operation(summary = "Atualizar data especial", description = "Atualiza uma data especial existente")
    public ResponseEntity<SpecialDateResponse> updateSpecialDate(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID contactId,
            @PathVariable UUID dateId,
            @Valid @RequestBody UpdateSpecialDateRequest request) {
        return ResponseEntity.ok(contactService.updateSpecialDate(userDetails.getId(), contactId, dateId, request));
    }

    @DeleteMapping("/{contactId}/special-dates/{dateId}")
    @Operation(summary = "Excluir data especial", description = "Exclui uma data especial")
    public ResponseEntity<Void> deleteSpecialDate(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID contactId,
            @PathVariable UUID dateId) {
        contactService.deleteSpecialDate(userDetails.getId(), contactId, dateId);
        return ResponseEntity.noContent().build();
    }
}
