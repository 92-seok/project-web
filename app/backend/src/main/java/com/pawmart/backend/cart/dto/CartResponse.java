package com.pawmart.backend.cart.dto;

import java.util.List;

public record CartResponse(List<CartItemResponse> items, int totalPrice, int totalCount) {}
