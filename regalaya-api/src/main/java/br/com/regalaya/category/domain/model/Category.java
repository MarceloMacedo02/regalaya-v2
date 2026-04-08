package br.com.regalaya.category.domain.model;

import java.util.ArrayList;
import java.util.List;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@ToString(exclude = {"parent", "children"})
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(length = 500)
    private String description;

    @Column(length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Category> children = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
