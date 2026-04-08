package br.com.regalaya.address.services.service;

import br.com.regalaya.address.dto.requests.CreateAddressRequest;
import br.com.regalaya.address.dto.requests.UpdateAddressRequest;
import br.com.regalaya.address.dto.responses.AddressResponse;

import java.util.List;
import java.util.UUID;

public interface AddressService {

    AddressResponse create(UUID userId, CreateAddressRequest request);

    AddressResponse update(UUID userId, UUID addressId, UpdateAddressRequest request);

    void delete(UUID userId, UUID addressId);

    AddressResponse findById(UUID userId, UUID addressId);

    List<AddressResponse> findAllByUser(UUID userId);

    AddressResponse setDefault(UUID userId, UUID addressId);
}
