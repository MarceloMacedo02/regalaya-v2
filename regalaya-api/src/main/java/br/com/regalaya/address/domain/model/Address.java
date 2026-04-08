package br.com.regalaya.address.domain.model;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@ToString(exclude = "user")
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String label;

    @Column(nullable = false, length = 9)
    private String zipCode;

    @Column(nullable = false, length = 200)
    private String street;

    @Column(nullable = false, length = 20)
    private String number;

    @Column(length = 100)
    private String complement;

    @Column(nullable = false, length = 100)
    private String neighborhood;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 2)
    private String state;

    @Column(length = 50)
    private String reference;

    @Column(length = 20)
    private String recipientPhone;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
