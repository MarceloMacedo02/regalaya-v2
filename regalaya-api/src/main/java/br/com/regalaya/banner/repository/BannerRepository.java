package br.com.regalaya.banner.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.regalaya.banner.domain.model.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, UUID> {

    List<Banner> findByIsActiveTrueOrderByDisplayOrderAsc();

    List<Banner> findByPlacementAndIsActiveTrueOrderByDisplayOrderAsc(String placement);

    List<Banner> findAllByOrderByDisplayOrderAsc();
}
