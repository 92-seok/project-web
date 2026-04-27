package com.pawmart.backend.cart.dto;

public record CartItemResponse(
    Long itemId,
    Long productId,
    String name,
    int price,
    Integer originalPrice,
    String imageUrl,
    int quantity,
    int subtotal) {}
