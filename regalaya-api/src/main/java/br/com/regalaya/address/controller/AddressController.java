package br.com.regalaya.address.controller;

import br.com.regalaya.address.dto.requests.CreateAddressRequest;
import br.com.regalaya.address.dto.requests.UpdateAddressRequest;
import br.com.regalaya.address.dto.responses.AddressResponse;
import br.com.regalaya.address.services.service.AddressService;
import br.com.regalaya.auth.infrastructure.security.UserDetailsImpl;
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
@RequestMapping("/v1/addresses")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Addresses", description = "Gerenciamento de endereços do cliente")
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    @Operation(summary = "Criar novo endereço", description = "Cria um novo endereço para o usuário autenticado")
    public ResponseEntity<AddressResponse> create(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateAddressRequest request) {
        AddressResponse response = addressService.create(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar endereços", description = "Lista todos os endereços ativos do usuário autenticado")
    public ResponseEntity<List<AddressResponse>> findAll(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(addressService.findAllByUser(userDetails.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar endereço por ID", description = "Retorna os detalhes de um endereço específico")
    public ResponseEntity<AddressResponse> findById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        return ResponseEntity.ok(addressService.findById(userDetails.getId(), id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar endereço", description = "Atualiza um endereço existente")
    public ResponseEntity<AddressResponse> update(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAddressRequest request) {
        return ResponseEntity.ok(addressService.update(userDetails.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir endereço", description = "Exclui um endereço (soft delete)")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        addressService.delete(userDetails.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/default")
    @Operation(summary = "Definir como padrão", description = "Define um endereço como padrão para entrega")
    public ResponseEntity<AddressResponse> setDefault(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        return ResponseEntity.ok(addressService.setDefault(userDetails.getId(), id));
    }
}
