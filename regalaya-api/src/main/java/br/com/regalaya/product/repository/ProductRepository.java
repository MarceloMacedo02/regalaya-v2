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

    // Buscar produtos ativos com estoque > 0 (para Recommendations)
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stock > 0")
    List<Product> findAllActiveWithStock();

    // Buscar IDs de produtos ativos com estoque
    @Query("SELECT p.id FROM Product p WHERE p.isActive = true AND p.stock > 0")
    List<UUID> findAllActiveWithStockIds();

    // Buscar por IDs com filtro de ativo e estoque
    @Query("SELECT p FROM Product p WHERE p.id IN :ids AND p.isActive = true AND p.stock > 0")
    List<Product> findByIdInAndActiveWithStock(@Param("ids") List<UUID> ids);

    // Buscar por IDs (sem filtro de estoque, para fallback)
    @Query("SELECT p FROM Product p WHERE p.id IN :ids")
    List<Product> findByIdIn(@Param("ids") List<UUID> ids);

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

    // Keyword search with stock filter - for AI-assisted recommendations
    @Query("""
        SELECT p FROM Product p 
        LEFT JOIN p.category c
        WHERE p.isActive = true AND p.stock > 0 AND (
            LOWER(p.name) LIKE LOWER(CONCAT('%', :term, '%')) OR 
            LOWER(p.description) LIKE LOWER(CONCAT('%', :term, '%')) OR 
            LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :term, '%')) OR 
            LOWER(p.tags) LIKE LOWER(CONCAT('%', :term, '%')) OR
            LOWER(c.name) LIKE LOWER(CONCAT('%', :term, '%'))
        )
    """)
    List<Product> findByKeywordWithStock(@Param("term") String term, Pageable pageable);

    // Busca DIRETA por tags com estoque — sem IA, para o chat
    @Query(value = """
        SELECT * FROM products 
        WHERE is_active = true 
          AND COALESCE(stock, 0) >= 1
          AND (
            LOWER(tags) LIKE LOWER(CONCAT('%', :tag, '%')) OR
            LOWER(name) LIKE LOWER(CONCAT('%', :tag, '%'))
          )
        ORDER BY stock DESC
        LIMIT :maxResults
        """, nativeQuery = true)
    List<Product> findByTagWithStock(@Param("tag") String tag, @Param("maxResults") int maxResults);

    // Busca por relacionamento Tag entity (ManyToMany) com stock >= 1
    @Query("""
        SELECT DISTINCT p FROM Product p 
        JOIN p.tagSet t
        WHERE p.isActive = true AND p.stock >= 1
          AND (LOWER(t.name) LIKE LOWER(CONCAT('%', :term, '%'))
            OR LOWER(t.description) LIKE LOWER(CONCAT('%', :term, '%')))
        ORDER BY p.stock DESC
    """)
    List<Product> findByTagNameWithStock(@Param("term") String term);

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
