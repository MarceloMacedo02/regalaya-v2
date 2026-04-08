package br.com.regalaya.contact.dto.responses;

import java.util.List;

public record ImportReportResponse(
    int total,
    int success,
    int errors,
    List<ImportErrorDetail> errorDetails
) {
    public record ImportErrorDetail(
        int row,
        String name,
        String reason
    ) {}
}
