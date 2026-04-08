package br.com.regalaya.order.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.order.domain.model.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    @Query(value = """
            SELECT product_name, SUM(quantity) as units_sold
            FROM order_items
            GROUP BY product_name
            ORDER BY units_sold DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<Object[]> findTopProductsByUnitsSold(@Param("limit") int limit);
}
