package br.com.regalaya.contact.domain.model;

import java.time.LocalDate;
import java.util.UUID;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "special_dates")
@Getter
@Setter
@ToString(exclude = "contact")
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialDate extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @Column(nullable = false, length = 30)
    private String type;

    @Column(nullable = false)
    private LocalDate date;

    @Column(length = 20)
    private String recurrence;

    @Column
    private LocalDate lastNotified;
}
