package br.com.regalaya.contact.services.service;

import br.com.regalaya.contact.dto.requests.CreateContactRequest;
import br.com.regalaya.contact.dto.requests.CreateSpecialDateRequest;
import br.com.regalaya.contact.dto.requests.ImportContactEntry;
import br.com.regalaya.contact.dto.requests.UpdateContactRequest;
import br.com.regalaya.contact.dto.requests.UpdateSpecialDateRequest;
import br.com.regalaya.contact.dto.responses.ContactDetailResponse;
import br.com.regalaya.contact.dto.responses.ContactResponse;
import br.com.regalaya.contact.dto.responses.ImportReportResponse;
import br.com.regalaya.contact.dto.responses.SpecialDateResponse;

import java.util.List;
import java.util.UUID;

public interface ContactService {

    ContactResponse create(UUID userId, CreateContactRequest request);

    ContactResponse update(UUID userId, UUID contactId, UpdateContactRequest request);

    void delete(UUID userId, UUID contactId);

    ContactDetailResponse findById(UUID userId, UUID contactId);

    List<ContactResponse> findAllByUser(UUID userId);

    List<ContactResponse> searchByUser(UUID userId, String query);

    ImportReportResponse importContacts(UUID userId, List<ImportContactEntry> entries);

    SpecialDateResponse addSpecialDate(UUID userId, UUID contactId, CreateSpecialDateRequest request);

    SpecialDateResponse updateSpecialDate(UUID userId, UUID contactId, UUID dateId, UpdateSpecialDateRequest request);

    void deleteSpecialDate(UUID userId, UUID contactId, UUID dateId);
}
