package br.com.regalaya.communication.domain.model;

import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "communication_templates")
@Getter
@Setter
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunicationTemplate extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommunicationType type;

    @Column(length = 200)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String variables;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(length = 100)
    private String category;

    public void incrementVersion() {
        this.version++;
    }
}
