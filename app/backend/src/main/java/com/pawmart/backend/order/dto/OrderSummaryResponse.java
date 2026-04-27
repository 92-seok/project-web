package com.pawmart.backend.order.dto;

import java.time.LocalDateTime;

public record OrderSummaryResponse(
    Long id,
    String orderNumber,
    String status,
    String statusLabel,
    int totalPrice,
    int itemCount,
    String firstItemName,
    String firstItemImageUrl,
    LocalDateTime createdAt) {}
