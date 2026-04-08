package br.com.regalaya.shipping.dto.requests;

public record Dimensions(
    double length,
    double width,
    double height
) {}