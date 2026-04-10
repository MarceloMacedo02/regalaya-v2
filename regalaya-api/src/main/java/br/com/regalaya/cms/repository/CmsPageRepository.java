package br.com.regalaya.cms.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.regalaya.cms.domain.model.CmsPage;

@Repository
public interface CmsPageRepository extends JpaRepository<CmsPage, UUID> {

    Optional<CmsPage> findBySlug(String slug);

    Optional<CmsPage> findBySlugAndIsPublishedTrue(String slug);

    List<CmsPage> findByIsPublishedTrueOrderByDisplayOrderAsc();

    List<CmsPage> findAllByOrderByDisplayOrderAsc();

    boolean existsBySlug(String slug);
}
