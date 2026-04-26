package com.pawmart.backend.order.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailResponse(
    Long id,
    String orderNumber,
    String status,
    String statusLabel,
    int totalPrice,
    int itemCount,
    String firstItemName,
    String firstItemImageUrl,
    LocalDateTime createdAt,
    // 배송지 정보
    String receiverName,
    String receiverPhone,
    String postalCode,
    String roadAddress,
    String detailAddress,
    String deliveryMemo,
    LocalDateTime paidAt,
    List<OrderItemResponse> items
) {}
