package br.com.regalaya.contact.mapper;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.contact.domain.model.Contact;
import br.com.regalaya.contact.domain.model.SpecialDate;
import br.com.regalaya.contact.dto.requests.CreateContactRequest;
import br.com.regalaya.contact.dto.requests.CreateSpecialDateRequest;
import br.com.regalaya.contact.dto.requests.UpdateContactRequest;
import br.com.regalaya.contact.dto.requests.UpdateSpecialDateRequest;
import br.com.regalaya.contact.dto.responses.ContactDetailResponse;
import br.com.regalaya.contact.dto.responses.ContactResponse;
import br.com.regalaya.contact.dto.responses.SpecialDateResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class ContactMapper {

    public Contact toEntity(CreateContactRequest request, User user) {
        return Contact.builder()
                .name(request.name())
                .phone(request.phone())
                .whatsappId(request.whatsappId())
                .consent(request.consent())
                .user(user)
                .build();
    }

    public void updateEntity(Contact contact, UpdateContactRequest request) {
        contact.setName(request.name());
        if (request.phone() != null) {
            contact.setPhone(request.phone());
        }
        if (request.whatsappId() != null) {
            contact.setWhatsappId(request.whatsappId());
        }
        if (request.consent() != null) {
            contact.setConsent(request.consent());
        }
    }

    public ContactResponse toResponse(Contact contact) {
        return new ContactResponse(
                contact.getId(),
                contact.getName(),
                contact.getPhone(),
                contact.getWhatsappId(),
                contact.getConsent(),
                contact.getCreatedAt(),
                contact.getUpdatedAt()
        );
    }

    public ContactDetailResponse toDetailResponse(Contact contact) {
        List<SpecialDateResponse> dates = contact.getSpecialDates() != null
                ? contact.getSpecialDates().stream()
                    .map(this::toSpecialDateResponse)
                    .toList()
                : List.of();

        return new ContactDetailResponse(
                contact.getId(),
                contact.getName(),
                contact.getPhone(),
                contact.getWhatsappId(),
                contact.getConsent(),
                contact.getCreatedAt(),
                contact.getUpdatedAt(),
                dates
        );
    }

    public SpecialDate toSpecialDateEntity(CreateSpecialDateRequest request, Contact contact) {
        return SpecialDate.builder()
                .type(request.type())
                .date(LocalDate.parse(request.date()))
                .recurrence(request.recurrence())
                .contact(contact)
                .build();
    }

    public void updateSpecialDateEntity(SpecialDate specialDate, UpdateSpecialDateRequest request) {
        specialDate.setType(request.type());
        specialDate.setDate(LocalDate.parse(request.date()));
        specialDate.setRecurrence(request.recurrence());
    }

    public SpecialDateResponse toSpecialDateResponse(SpecialDate specialDate) {
        return new SpecialDateResponse(
                specialDate.getId(),
                specialDate.getContact().getId(),
                specialDate.getType(),
                specialDate.getDate(),
                specialDate.getRecurrence(),
                specialDate.getLastNotified(),
                specialDate.getCreatedAt()
        );
    }
}
