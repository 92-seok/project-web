package com.pawmart.backend.payment.dto;

public record ConfirmPaymentResponse(
    String paymentKey,
    String orderId,
    String method,
    int totalAmount,
    String status,
    String approvedAt) {}
