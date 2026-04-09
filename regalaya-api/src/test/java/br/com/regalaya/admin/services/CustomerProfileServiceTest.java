package br.com.regalaya.admin.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.regalaya.admin.dto.requests.OrderFilterRequest;
import br.com.regalaya.admin.dto.responses.CustomerOrderSummaryResponse;
import br.com.regalaya.admin.repository.CustomerProfileRepository;
import br.com.regalaya.auth.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CustomerProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerProfileRepository customerProfileRepository;

    @Mock
    private CustomerAnalyticsService analyticsService;

    @InjectMocks
    private CustomerProfileService customerProfileService;

    @Test
    void getCustomerOrders_UsesInclusiveDateRangeForSelectedDays() {
        UUID customerId = UUID.randomUUID();
        OrderFilterRequest filter = new OrderFilterRequest(
                null,
                LocalDate.of(2026, 4, 1),
                LocalDate.of(2026, 4, 8),
                null,
                0,
                20,
                "createdAt",
                "desc"
        );

        when(userRepository.existsById(customerId)).thenReturn(true);
        when(customerProfileRepository.findCustomerOrders(
                eq(customerId),
                eq(null),
                any(LocalDateTime.class),
                any(LocalDateTime.class),
                eq(null),
                eq("createdAt"),
                eq("desc"),
                any()
        )).thenReturn(org.springframework.data.domain.Page.empty());

        customerProfileService.getCustomerOrders(customerId, filter, 0, 20, "createdAt", "desc");

        ArgumentCaptor<LocalDateTime> startCaptor = ArgumentCaptor.forClass(LocalDateTime.class);
        ArgumentCaptor<LocalDateTime> endCaptor = ArgumentCaptor.forClass(LocalDateTime.class);

        verify(customerProfileRepository).findCustomerOrders(
                eq(customerId),
                eq(null),
                startCaptor.capture(),
                endCaptor.capture(),
                eq(null),
                eq("createdAt"),
                eq("desc"),
                any()
        );

        assertEquals(LocalDateTime.of(2026, 4, 1, 0, 0), startCaptor.getValue());
        assertEquals(LocalDateTime.of(2026, 4, 8, 23, 59, 59, 999999999), endCaptor.getValue());
    }

    @Test
    void exportCustomerOrdersToCsv_ProducesHeaderMatchingExportedColumns() {
        UUID customerId = UUID.randomUUID();
        OrderFilterRequest filter = new OrderFilterRequest(null, null, null, null, 0, 20, "createdAt", "desc");
        CustomerOrderSummaryResponse order = new CustomerOrderSummaryResponse(
                UUID.randomUUID(),
                "ORD-001",
                new BigDecimal("199.90"),
                "PAID",
                "PIX",
                LocalDateTime.of(2026, 4, 8, 10, 30),
                3
        );

        when(userRepository.existsById(customerId)).thenReturn(true);
        when(customerProfileRepository.findCustomerOrders(
                eq(customerId),
                eq(null),
                eq(null),
                eq(null),
                eq(null),
                eq("createdAt"),
                eq("desc"),
                any()
        )).thenReturn(new org.springframework.data.domain.PageImpl<>(List.of(order)));

        String csv = customerProfileService.exportCustomerOrdersToCsv(customerId, filter, 0, 10000, "createdAt", "desc");
        String[] lines = csv.strip().split("\\R");

        assertEquals("ID,Order Number,Valor Total,Status,Metodo Pagamento,Criado em,Itens", lines[0]);
        assertEquals(2, lines.length);
        assertEquals(7, lines[0].split(",", -1).length);
        assertEquals(7, lines[1].split(",", -1).length);
        assertTrue(lines[1].contains("ORD-001"));
    }
}
