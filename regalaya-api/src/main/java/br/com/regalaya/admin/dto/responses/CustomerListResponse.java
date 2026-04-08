package br.com.regalaya.admin.dto.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de resposta para listagem de clientes no painel admin.
 * <p>
 * Contém os campos essenciais para exibição em tabelas administrativas,
 * incluindo estatísticas de pedidos calculadas em tempo real.
 * </p>
 *
 * @param id                 Identificador único do cliente
 * @param name               Nome completo do cliente
 * @param email              Email cadastrado
 * @param phone              Telefone de contato (pode ser nulo)
 * @param status             Status do cliente (ATIVO/INATIVO)
 * @param registrationDate   Data de cadastro na plataforma
 * @param orderCount         Quantidade total de pedidos realizados
 * @param totalSpent         Valor total gasto na plataforma
 */
public record CustomerListResponse(
        UUID id,
        String name,
        String email,
        String phone,
        String status,
        LocalDateTime registrationDate,
        long orderCount,
        BigDecimal totalSpent
) {}
