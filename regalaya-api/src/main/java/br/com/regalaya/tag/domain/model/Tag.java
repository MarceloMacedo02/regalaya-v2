package br.com.regalaya.tag.domain.model;

import br.com.regalaya.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tags")
@Getter
@Setter
@EqualsAndHashCode(of = "id", callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @OneToMany(mappedBy = "tag", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TagKeyword> keywords = new ArrayList<>();

    public void addKeyword(String keyword) {
        TagKeyword tagKeyword = new TagKeyword();
        tagKeyword.setKeyword(keyword);
        tagKeyword.setTag(this);
        this.keywords.add(tagKeyword);
    }
}
