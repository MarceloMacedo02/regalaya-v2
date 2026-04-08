package br.com.regalaya.contact.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contacts")
@Getter
@Setter
@ToString(exclude = "user")
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String whatsappId;

    @Builder.Default
    private Boolean consent = false;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SpecialDate> specialDates = new ArrayList<>();
}
