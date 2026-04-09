package br.com.regalaya.product.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.product.domain.model.Product;
import jakarta.persistence.LockModeType;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByCategoryId(UUID categoryId, Pageable pageable);

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    long countByIsActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchActive(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Product> findSuggestions(@Param("search") String search, Pageable pageable);

    @Query("""
        SELECT p FROM Product p 
        LEFT JOIN p.category c
        WHERE p.isActive = true AND (
            LOWER(p.name) LIKE LOWER(CONCAT('%', :term, '%')) OR 
            LOWER(p.description) LIKE LOWER(CONCAT('%', :term, '%')) OR 
            LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :term, '%')) OR 
            LOWER(p.tags) LIKE LOWER(CONCAT('%', :term, '%')) OR
            LOWER(c.name) LIKE LOWER(CONCAT('%', :term, '%'))
        )
    """)
    List<Product> findByKeyword(@Param("term") String term, Pageable pageable);

    @Query(value = """
        SELECT p.id, p.name, p.sku, SUM(oi.quantity) as units_sold, SUM(oi.total) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_name = p.name
        WHERE p.is_active = true
        GROUP BY p.id, p.name, p.sku
        ORDER BY units_sold DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopProductsByUnitsSold(@Param("limit") int limit);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithLock(@Param("id") UUID id);
}
