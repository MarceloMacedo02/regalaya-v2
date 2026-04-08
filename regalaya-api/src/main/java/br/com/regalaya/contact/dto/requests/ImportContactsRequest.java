package br.com.regalaya.contact.dto.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ImportContactsRequest(
    @NotEmpty(message = "Lista de contatos não pode estar vazia")
    @Size(max = 100, message = "Máximo de 100 contatos por importação")
    @Valid
    List<ImportContactEntry> contacts
) {}
