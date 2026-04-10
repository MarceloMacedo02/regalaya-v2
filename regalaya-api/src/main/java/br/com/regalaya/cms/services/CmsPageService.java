package br.com.regalaya.cms.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.cms.domain.model.CmsPage;
import br.com.regalaya.cms.dto.requests.CreateCmsPageRequest;
import br.com.regalaya.cms.dto.requests.UpdateCmsPageRequest;
import br.com.regalaya.cms.dto.responses.CmsPageResponse;
import br.com.regalaya.cms.repository.CmsPageRepository;

@Service
public class CmsPageService {

    private final CmsPageRepository cmsPageRepository;

    public CmsPageService(CmsPageRepository cmsPageRepository) {
        this.cmsPageRepository = cmsPageRepository;
    }

    @Transactional(readOnly = true)
    public List<CmsPageResponse> findAll() {
        return cmsPageRepository.findAllByOrderByDisplayOrderAsc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CmsPageResponse> findPublished() {
        return cmsPageRepository.findByIsPublishedTrueOrderByDisplayOrderAsc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CmsPageResponse findBySlug(String slug) {
        return cmsPageRepository.findBySlug(slug)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Página não encontrada: " + slug));
    }

    @Transactional(readOnly = true)
    public CmsPageResponse findPublishedBySlug(String slug) {
        return cmsPageRepository.findBySlugAndIsPublishedTrue(slug)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Página não encontrada ou não publicada: " + slug));
    }

    @Transactional
    public CmsPageResponse create(CreateCmsPageRequest request) {
        if (cmsPageRepository.existsBySlug(request.getSlug())) {
            throw new RuntimeException("Slug já existe: " + request.getSlug());
        }
        CmsPage page = CmsPage.builder()
                .slug(request.getSlug())
                .title(request.getTitle())
                .content(request.getContent())
                .metaDescription(request.getMetaDescription())
                .metaKeywords(request.getMetaKeywords())
                .isPublished(request.getIsPublished())
                .displayOrder(request.getDisplayOrder())
                .build();
        return toResponse(cmsPageRepository.save(page));
    }

    @Transactional
    public CmsPageResponse update(UUID id, UpdateCmsPageRequest request) {
        CmsPage page = cmsPageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Página não encontrada: " + id));
        if (request.getTitle() != null) page.setTitle(request.getTitle());
        if (request.getContent() != null) page.setContent(request.getContent());
        if (request.getMetaDescription() != null) page.setMetaDescription(request.getMetaDescription());
        if (request.getMetaKeywords() != null) page.setMetaKeywords(request.getMetaKeywords());
        if (request.getIsPublished() != null) page.setIsPublished(request.getIsPublished());
        if (request.getDisplayOrder() != null) page.setDisplayOrder(request.getDisplayOrder());
        return toResponse(cmsPageRepository.save(page));
    }

    @Transactional
    public void delete(UUID id) {
        if (!cmsPageRepository.existsById(id)) {
            throw new RuntimeException("Página não encontrada: " + id);
        }
        cmsPageRepository.deleteById(id);
    }

    private CmsPageResponse toResponse(CmsPage page) {
        return new CmsPageResponse(
                page.getId(), page.getSlug(), page.getTitle(), page.getContent(),
                page.getMetaDescription(), page.getMetaKeywords(), page.getIsPublished(),
                page.getDisplayOrder(), page.getCreatedAt(), page.getUpdatedAt());
    }
}
