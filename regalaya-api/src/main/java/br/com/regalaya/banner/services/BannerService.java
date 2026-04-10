package br.com.regalaya.banner.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.banner.domain.model.Banner;
import br.com.regalaya.banner.dto.requests.CreateBannerRequest;
import br.com.regalaya.banner.dto.requests.UpdateBannerRequest;
import br.com.regalaya.banner.dto.responses.BannerResponse;
import br.com.regalaya.banner.repository.BannerRepository;

@Service
public class BannerService {

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> findAll() {
        return bannerRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> findActive() {
        return bannerRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> findByPlacement(String placement) {
        return bannerRepository.findByPlacementAndIsActiveTrueOrderByDisplayOrderAsc(placement)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BannerResponse findById(UUID id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner não encontrado: " + id));
        return toResponse(banner);
    }

    @Transactional
    public BannerResponse create(CreateBannerRequest request) {
        Banner banner = Banner.builder()
                .title(request.getTitle())
                .subtitle(request.getSubtitle())
                .imageUrl(request.getImageUrl())
                .link(request.getLink())
                .isActive(request.getIsActive())
                .displayOrder(request.getDisplayOrder())
                .placement(request.getPlacement())
                .build();
        return toResponse(bannerRepository.save(banner));
    }

    @Transactional
    public BannerResponse update(UUID id, UpdateBannerRequest request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner não encontrado: " + id));

        if (request.getTitle() != null) banner.setTitle(request.getTitle());
        if (request.getSubtitle() != null) banner.setSubtitle(request.getSubtitle());
        if (request.getImageUrl() != null) banner.setImageUrl(request.getImageUrl());
        if (request.getLink() != null) banner.setLink(request.getLink());
        if (request.getIsActive() != null) banner.setIsActive(request.getIsActive());
        if (request.getDisplayOrder() != null) banner.setDisplayOrder(request.getDisplayOrder());
        if (request.getPlacement() != null) banner.setPlacement(request.getPlacement());

        return toResponse(bannerRepository.save(banner));
    }

    @Transactional
    public void delete(UUID id) {
        if (!bannerRepository.existsById(id)) {
            throw new RuntimeException("Banner não encontrado: " + id);
        }
        bannerRepository.deleteById(id);
    }

    @Transactional
    public BannerResponse toggleActive(UUID id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner não encontrado: " + id));
        banner.setIsActive(!banner.getIsActive());
        return toResponse(bannerRepository.save(banner));
    }

    private BannerResponse toResponse(Banner banner) {
        return new BannerResponse(
                banner.getId(),
                banner.getTitle(),
                banner.getSubtitle(),
                banner.getImageUrl(),
                banner.getLink(),
                banner.getIsActive(),
                banner.getDisplayOrder(),
                banner.getPlacement(),
                banner.getCreatedAt(),
                banner.getUpdatedAt()
        );
    }
}
