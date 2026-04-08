package br.com.regalaya.address.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateAddressRequest(
    @NotBlank(message = "Label é obrigatório")
    @Size(max = 200, message = "Label deve ter no máximo 200 caracteres")
    String label,

    @NotBlank(message = "CEP é obrigatório")
    @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP deve estar no formato XXXXX-XXX")
    String zipCode,

    @NotBlank(message = "Logradouro é obrigatório")
    @Size(max = 200, message = "Logradouro deve ter no máximo 200 caracteres")
    String street,

    @NotBlank(message = "Número é obrigatório")
    @Size(max = 20, message = "Número deve ter no máximo 20 caracteres")
    String number,

    @Size(max = 100, message = "Complemento deve ter no máximo 100 caracteres")
    String complement,

    @NotBlank(message = "Bairro é obrigatório")
    @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres")
    String neighborhood,

    @NotBlank(message = "Cidade é obrigatória")
    @Size(max = 100, message = "Cidade deve ter no máximo 100 caracteres")
    String city,

    @NotBlank(message = "Estado é obrigatório")
    @Size(min = 2, max = 2, message = "Estado deve ter 2 caracteres (UF)")
    String state,

    @Size(max = 50, message = "Referência deve ter no máximo 50 caracteres")
    String reference,

    @Pattern(regexp = "\\d{10,11}", message = "Telefone deve ter 10 ou 11 dígitos")
    String recipientPhone,

    Boolean isDefault
) {}
