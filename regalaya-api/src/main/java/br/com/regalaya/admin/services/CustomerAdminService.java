package br.com.regalaya.admin.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.regalaya.admin.dto.responses.CustomerListResponse;

/**
 * Interface do serviço administrativo de clientes.
 * <p>
 * Define os contratos para listagem paginada e filtrada de clientes
 * no painel administrativo.
 * </p>
 */
public interface CustomerAdminService {

    /**
     * Lista clientes com paginação e filtros opcionais.
     * <p>
     * Os filtros são combináveis com lógica AND. Quando um filtro é {@code null}
     * ou vazio, ele é automaticamente ignorado.
     * </p>
     *
     * @param status            filtro por status (ATIVO/INATIVO), opcional
     * @param registrationDateFrom data de registro inicial, opcional
     * @param registrationDateTo   data de registro final, opcional
     * @param search              termo de busca textual (nome, email, telefone), opcional
     * @param pageable            configuração de paginação e ordenação
     * @return página de respostas com dados dos clientes
     */
    Page<CustomerListResponse> findAll(String status,
                                       String registrationDateFrom,
                                       String registrationDateTo,
                                       String search,
                                       Pageable pageable);
}
