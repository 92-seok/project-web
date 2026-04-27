package com.pawmart.backend.order.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
    @NotEmpty @Valid List<OrderItemRequest> items,
    @NotBlank String receiverName,
    @NotBlank String receiverPhone,
    @NotBlank String postalCode,
    @NotBlank String roadAddress,
    String detailAddress,
    String deliveryMemo) {
  public record OrderItemRequest(@NotNull Long productId, @Min(1) int quantity) {}
}
