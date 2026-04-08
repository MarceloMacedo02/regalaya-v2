package br.com.regalaya.address.mapper;

import br.com.regalaya.address.domain.model.Address;
import br.com.regalaya.address.dto.requests.CreateAddressRequest;
import br.com.regalaya.address.dto.requests.UpdateAddressRequest;
import br.com.regalaya.address.dto.responses.AddressResponse;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public Address toEntity(CreateAddressRequest request) {
        return Address.builder()
                .label(request.label())
                .zipCode(request.zipCode())
                .street(request.street())
                .number(request.number())
                .complement(request.complement())
                .neighborhood(request.neighborhood())
                .city(request.city())
                .state(request.state().toUpperCase())
                .reference(request.reference())
                .recipientPhone(request.recipientPhone())
                .isDefault(request.isDefault() != null ? request.isDefault() : false)
                .isActive(true)
                .build();
    }

    public void updateEntity(Address address, UpdateAddressRequest request) {
        address.setLabel(request.label());
        address.setZipCode(request.zipCode());
        address.setStreet(request.street());
        address.setNumber(request.number());
        address.setComplement(request.complement());
        address.setNeighborhood(request.neighborhood());
        address.setCity(request.city());
        address.setState(request.state().toUpperCase());
        address.setReference(request.reference());
        address.setRecipientPhone(request.recipientPhone());
        address.setIsDefault(request.isDefault() != null ? request.isDefault() : address.getIsDefault());
        if (request.isActive() != null) {
            address.setIsActive(request.isActive());
        }
    }

    public AddressResponse toResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getLabel(),
                address.getZipCode(),
                address.getStreet(),
                address.getNumber(),
                address.getComplement(),
                address.getNeighborhood(),
                address.getCity(),
                address.getState(),
                address.getReference(),
                address.getRecipientPhone(),
                address.getIsDefault(),
                address.getIsActive()
        );
    }
}
