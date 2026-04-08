package br.com.regalaya.admin.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import br.com.regalaya.admin.repository.CustomerAdminRepository;
import br.com.regalaya.auth.domain.model.Role;
import br.com.regalaya.auth.domain.model.User;

@ExtendWith(MockitoExtension.class)
class CustomerAdminServiceImplTest {

    @Mock
    private CustomerAdminRepository customerAdminRepository;

    @InjectMocks
    private CustomerAdminServiceImpl customerAdminService;

    @Test
    void findAll_ShouldTranslateStatusAndApplyFilters() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("Cliente Teste");
        user.setEmail("cliente@regalaya.com");
        user.setStatus("ACTIVE");
        user.setRole(Role.CLIENT);

        when(customerAdminRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(user)));
        when(customerAdminRepository.countOrdersByUserId(user.getId())).thenReturn(4L);
        when(customerAdminRepository.sumTotalSpentByUserId(user.getId())).thenReturn(new BigDecimal("320.50"));

        var response = customerAdminService.findAll("ATIVO", "2026-04-01", "2026-04-08", 1, 10, "cliente", PageRequest.of(0, 20));

        assertEquals(1, response.getTotalElements());
        assertEquals("ATIVO", response.getContent().getFirst().status());
        assertEquals(4L, response.getContent().getFirst().orderCount());
    }

    @Test
    void getStats_ShouldAggregateCustomerMetrics() {
        when(customerAdminRepository.countByRoleIn(any())).thenReturn(10L);
        when(customerAdminRepository.countActiveCustomers()).thenReturn(7L);
        when(customerAdminRepository.sumRevenue()).thenReturn(new BigDecimal("1000.00"));

        var stats = customerAdminService.getStats();

        assertEquals(10L, stats.totalCustomers());
        assertEquals(7L, stats.activeCustomers());
        assertEquals(new BigDecimal("100.00"), stats.averageTicket());
        verify(customerAdminRepository).countByRoleIn(any());
    }
}
