package br.com.regalaya.address.services.impl;

import br.com.regalaya.address.domain.model.Address;
import br.com.regalaya.address.dto.requests.CreateAddressRequest;
import br.com.regalaya.address.dto.requests.UpdateAddressRequest;
import br.com.regalaya.address.dto.responses.AddressResponse;
import br.com.regalaya.address.exception.AddressNotFoundException;
import br.com.regalaya.address.mapper.AddressMapper;
import br.com.regalaya.address.repository.AddressRepository;
import br.com.regalaya.address.services.service.AddressService;
import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public AddressResponse create(UUID userId, CreateAddressRequest request) {
        log.info("Creating address for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Address address = addressMapper.toEntity(request);
        address.setUser(user);

        if (Boolean.TRUE.equals(request.isDefault())) {
            addressRepository.clearAllDefaultsForUser(userId);
        }

        Address saved = addressRepository.save(address);
        return addressMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AddressResponse update(UUID userId, UUID addressId, UpdateAddressRequest request) {
        log.info("Updating address {} for user: {}", addressId, userId);

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AddressNotFoundException("Endereço não encontrado"));

        if (Boolean.TRUE.equals(request.isDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.clearAllDefaultsForUser(userId);
        }

        addressMapper.updateEntity(address, request);
        Address saved = addressRepository.save(address);
        return addressMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(UUID userId, UUID addressId) {
        log.info("Deleting address {} for user: {}", addressId, userId);

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AddressNotFoundException("Endereço não encontrado"));

        addressRepository.delete(address);
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse findById(UUID userId, UUID addressId) {
        log.debug("Finding address {} for user: {}", addressId, userId);

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AddressNotFoundException("Endereço não encontrado"));

        return addressMapper.toResponse(address);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> findAllByUser(UUID userId) {
        log.debug("Finding all addresses for user: {}", userId);

        return addressRepository.findByUserIdAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AddressResponse setDefault(UUID userId, UUID addressId) {
        log.info("Setting address {} as default for user: {}", addressId, userId);

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AddressNotFoundException("Endereço não encontrado"));

        addressRepository.clearAllDefaultsForUser(userId);
        address.setIsDefault(true);
        Address saved = addressRepository.save(address);
        return addressMapper.toResponse(saved);
    }
}
