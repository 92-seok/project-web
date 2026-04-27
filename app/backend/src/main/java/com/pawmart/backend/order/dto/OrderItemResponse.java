package com.pawmart.backend.order.dto;

public record OrderItemResponse(
    Long productId, String name, int price, String imageUrl, int quantity, int subtotal) {}
