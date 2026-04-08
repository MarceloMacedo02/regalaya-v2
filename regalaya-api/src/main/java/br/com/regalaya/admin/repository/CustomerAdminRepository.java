package br.com.regalaya.admin.repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.regalaya.auth.domain.model.Role;
import br.com.regalaya.auth.domain.model.User;

/**
 * Repositório para operações administrativas de clientes.
 * <p>
 * Reutiliza a entidade {@link User} do módulo auth, adicionando consultas
 * otimizadas para listagem administrativa com estatísticas de pedidos.
 * </p>
 * <p>
 * Herda {@link JpaSpecificationExecutor} para suporte a filtros dinâmicos
 * via Specification Pattern.
 * </p>
 */
@Repository
public interface CustomerAdminRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    /**
     * Conta a quantidade de pedidos realizados por um cliente.
     *
     * @param userId identificador do cliente
     * @return quantidade total de pedidos
     */
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    long countOrdersByUserId(@Param("userId") UUID userId);

    /**
     * Soma o valor total gasto por um cliente.
     *
     * @param userId identificador do cliente
     * @return valor total gasto (BigDecimal)
     */
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.user.id = :userId")
    BigDecimal sumTotalSpentByUserId(@Param("userId") UUID userId);

    long countByRoleIn(Collection<Role> roles);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role IN (br.com.regalaya.auth.domain.model.Role.USER, br.com.regalaya.auth.domain.model.Role.CLIENT) AND UPPER(u.status) = 'ACTIVE'")
    long countActiveCustomers();

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o")
    BigDecimal sumRevenue();
}
