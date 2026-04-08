package br.com.regalaya.contact.services.impl;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.contact.domain.model.Contact;
import br.com.regalaya.contact.domain.model.SpecialDate;
import br.com.regalaya.contact.dto.requests.CreateContactRequest;
import br.com.regalaya.contact.dto.requests.CreateSpecialDateRequest;
import br.com.regalaya.contact.dto.requests.ImportContactEntry;
import br.com.regalaya.contact.dto.requests.UpdateContactRequest;
import br.com.regalaya.contact.dto.requests.UpdateSpecialDateRequest;
import br.com.regalaya.contact.dto.responses.ContactDetailResponse;
import br.com.regalaya.contact.dto.responses.ContactResponse;
import br.com.regalaya.contact.dto.responses.ImportReportResponse;
import br.com.regalaya.contact.dto.responses.ImportReportResponse.ImportErrorDetail;
import br.com.regalaya.contact.dto.responses.SpecialDateResponse;
import br.com.regalaya.contact.exception.ContactNotFoundException;
import br.com.regalaya.contact.exception.SpecialDateNotFoundException;
import br.com.regalaya.contact.mapper.ContactMapper;
import br.com.regalaya.contact.repository.ContactRepository;
import br.com.regalaya.contact.repository.SpecialDateRepository;
import br.com.regalaya.contact.services.service.ContactService;
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
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final SpecialDateRepository specialDateRepository;
    private final ContactMapper contactMapper;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ContactResponse create(UUID userId, CreateContactRequest request) {
        log.info("Creating contact for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Contact contact = contactMapper.toEntity(request, user);
        Contact saved = contactRepository.save(contact);
        return contactMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ContactResponse update(UUID userId, UUID contactId, UpdateContactRequest request) {
        log.info("Updating contact {} for user: {}", contactId, userId);

        Contact contact = contactRepository.findByIdAndUserId(contactId, userId)
                .orElseThrow(() -> new ContactNotFoundException("Contato não encontrado"));

        contactMapper.updateEntity(contact, request);
        Contact saved = contactRepository.save(contact);
        return contactMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(UUID userId, UUID contactId) {
        log.info("Deleting contact {} for user: {}", contactId, userId);

        Contact contact = contactRepository.findByIdAndUserId(contactId, userId)
                .orElseThrow(() -> new ContactNotFoundException("Contato não encontrado"));

        contactRepository.delete(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactDetailResponse findById(UUID userId, UUID contactId) {
        log.debug("Finding contact {} for user: {}", contactId, userId);

        Contact contact = contactRepository.findByIdAndUserIdWithSpecialDates(contactId, userId)
                .orElseThrow(() -> new ContactNotFoundException("Contato não encontrado"));

        return contactMapper.toDetailResponse(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponse> findAllByUser(UUID userId) {
        log.debug("Finding all contacts for user: {}", userId);

        return contactRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(contactMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponse> searchByUser(UUID userId, String query) {
        log.debug("Searching contacts for user: {} with query: {}", userId, query);

        return contactRepository.findByUserIdAndNameContainingIgnoreCaseOrderByCreatedAtDesc(userId, query)
                .stream()
                .map(contactMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ImportReportResponse importContacts(UUID userId, List<ImportContactEntry> entries) {
        log.info("Importing {} contacts for user: {}", entries.size(), userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        int success = 0;
        List<ImportErrorDetail> errorDetails = new java.util.ArrayList<>();

        for (int i = 0; i < entries.size(); i++) {
            ImportContactEntry entry = entries.get(i);
            try {
                if (entry.name() == null || entry.name().isBlank()) {
                    errorDetails.add(new ImportErrorDetail(i + 1, entry.name(), "Nome é obrigatório"));
                    continue;
                }

                Contact contact = contactMapper.toEntity(
                    new br.com.regalaya.contact.dto.requests.CreateContactRequest(
                        entry.name(), entry.phone(), entry.whatsappId(), true
                    ),
                    user
                );
                contactRepository.save(contact);
                success++;
            } catch (Exception e) {
                log.warn("Failed to import contact at row {}: {}", i + 1, e.getMessage());
                errorDetails.add(new ImportErrorDetail(i + 1, entry.name(), e.getMessage()));
            }
        }

        return new ImportReportResponse(entries.size(), success, errorDetails.size(), errorDetails);
    }

    @Override
    @Transactional
    public SpecialDateResponse addSpecialDate(UUID userId, UUID contactId, CreateSpecialDateRequest request) {
        log.info("Adding special date to contact {} for user: {}", contactId, userId);

        Contact contact = contactRepository.findByIdAndUserId(contactId, userId)
                .orElseThrow(() -> new ContactNotFoundException("Contato não encontrado"));

        SpecialDate specialDate = contactMapper.toSpecialDateEntity(request, contact);
        SpecialDate saved = specialDateRepository.save(specialDate);
        return contactMapper.toSpecialDateResponse(saved);
    }

    @Override
    @Transactional
    public SpecialDateResponse updateSpecialDate(UUID userId, UUID contactId, UUID dateId, UpdateSpecialDateRequest request) {
        log.info("Updating special date {} on contact {} for user: {}", dateId, contactId, userId);

        Contact contact = contactRepository.findByIdAndUserId(contactId, userId)
                .orElseThrow(() -> new ContactNotFoundException("Contato não encontrado"));

        SpecialDate specialDate = specialDateRepository.findByIdAndContactId(dateId, contactId)
                .orElseThrow(() -> new SpecialDateNotFoundException("Data especial não encontrada"));

        contactMapper.updateSpecialDateEntity(specialDate, request);
        SpecialDate saved = specialDateRepository.save(specialDate);
        return contactMapper.toSpecialDateResponse(saved);
    }

    @Override
    @Transactional
    public void deleteSpecialDate(UUID userId, UUID contactId, UUID dateId) {
        log.info("Deleting special date {} on contact {} for user: {}", dateId, contactId, userId);

        Contact contact = contactRepository.findByIdAndUserId(contactId, userId)
                .orElseThrow(() -> new ContactNotFoundException("Contato não encontrado"));

        SpecialDate specialDate = specialDateRepository.findByIdAndContactId(dateId, contactId)
                .orElseThrow(() -> new SpecialDateNotFoundException("Data especial não encontrada"));

        specialDateRepository.delete(specialDate);
    }
}
