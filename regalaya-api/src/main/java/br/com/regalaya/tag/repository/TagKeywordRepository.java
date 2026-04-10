package br.com.regalaya.tag.repository;

import br.com.regalaya.tag.domain.model.TagKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TagKeywordRepository extends JpaRepository<TagKeyword, UUID> {
}
