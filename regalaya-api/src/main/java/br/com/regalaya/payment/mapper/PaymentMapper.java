package br.com.regalaya.payment.mapper;

import br.com.regalaya.payment.domain.model.Payment;
import br.com.regalaya.payment.dto.responses.PaymentIntentResponse;
import br.com.regalaya.payment.dto.responses.PaymentStatusResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "paymentIntentId", source = "providerPaymentId")
    @Mapping(target = "paymentMethod", source = "paymentMethodType")
    PaymentIntentResponse toIntentResponse(Payment payment);

    @Mapping(target = "paymentId", source = "id")
    @Mapping(target = "paymentMethod", source = "paymentMethodType")
    PaymentStatusResponse toStatusResponse(Payment payment);
}
