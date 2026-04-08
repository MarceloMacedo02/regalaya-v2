package br.com.regalaya.admin.services;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class CustomerSegmentationService {

    // Thresholds configuráveis via application.yml
    public static final BigDecimal VIP_LTV_THRESHOLD = BigDecimal.valueOf(1000);
    private static final int VIP_ORDERS_THRESHOLD = 10;
    public static final int NEW_MONTHS_THRESHOLD = 3;
    private static final int INACTIVE_MONTHS_THRESHOLD = 6;

    public enum Segment {
        VIP("VIP", "Cliente VIP", "#FFD700", "Valor excepcional ou alta fidelidade"),
        NEW("Novo", "Cliente Novo", "#22C55E", "Primeira compra recente"),
        INACTIVE("Inativo", "Cliente Inativo", "#6B7280", "Sem compras recentes"),
        REGULAR("Regular", "Cliente Regular", "#3B82F6", "Cliente ativo");

        private final String code;
        private final String label;
        private final String color;
        private final String description;

        Segment(String code, String label, String color, String description) {
            this.code = code;
            this.label = label;
            this.color = color;
            this.description = description;
        }

        public String code() { return code; }
        public String label() { return label; }
        public String color() { return color; }
        public String description() { return description; }
    }

    public Segment calculateSegment(
            BigDecimal ltv,
            Integer totalOrders,
            LocalDate firstPurchaseDate,
            LocalDate lastPurchaseDate
    ) {
        // Regra 1: VIP (LTV > R$1000 OU > 10 pedidos)
        if ((ltv != null && ltv.compareTo(VIP_LTV_THRESHOLD) >= 0) ||
            (totalOrders != null && totalOrders >= VIP_ORDERS_THRESHOLD)) {
            return Segment.VIP;
        }

        // Regra 2: Inativo (> 6 meses sem compra)
        if (lastPurchaseDate != null) {
            long monthsSinceLast = ChronoUnit.MONTHS.between(lastPurchaseDate, LocalDate.now());
            if (monthsSinceLast >= INACTIVE_MONTHS_THRESHOLD) {
                return Segment.INACTIVE;
            }
        }

        // Regra 3: Novo (primeira compra nos últimos 3 meses)
        if (firstPurchaseDate != null) {
            long monthsSinceFirst = ChronoUnit.MONTHS.between(firstPurchaseDate, LocalDate.now());
            if (monthsSinceFirst <= NEW_MONTHS_THRESHOLD) {
                return Segment.NEW;
            }
        }

        // Default: Regular
        return Segment.REGULAR;
    }

    public boolean isVip(BigDecimal ltv, Integer totalOrders) {
        return (ltv != null && ltv.compareTo(VIP_LTV_THRESHOLD) >= 0) ||
               (totalOrders != null && totalOrders >= VIP_ORDERS_THRESHOLD);
    }

    public boolean isNew(LocalDate firstPurchaseDate) {
        if (firstPurchaseDate == null) return false;
        long monthsSinceFirst = ChronoUnit.MONTHS.between(firstPurchaseDate, LocalDate.now());
        return monthsSinceFirst <= NEW_MONTHS_THRESHOLD;
    }

    public boolean isInactive(LocalDate lastPurchaseDate) {
        if (lastPurchaseDate == null) return true; // nunca comprou = inativo
        long monthsSinceLast = ChronoUnit.MONTHS.between(lastPurchaseDate, LocalDate.now());
        return monthsSinceLast >= INACTIVE_MONTHS_THRESHOLD;
    }
}