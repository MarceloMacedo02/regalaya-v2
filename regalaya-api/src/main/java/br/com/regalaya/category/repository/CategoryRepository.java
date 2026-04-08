package br.com.regalaya.category.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.regalaya.category.domain.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Optional<Category> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Category> findByParentIsNullOrderBySortOrderAsc();

    List<Category> findByIsActiveTrueOrderBySortOrderAsc();

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.children WHERE c.parent IS NULL ORDER BY c.sortOrder ASC")
    List<Category> findAllRootsWithChildren();

    @Query("SELECT COUNT(p) FROM br.com.regalaya.product.domain.model.Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    long countActiveProductsByCategoryId(UUID categoryId);
}
