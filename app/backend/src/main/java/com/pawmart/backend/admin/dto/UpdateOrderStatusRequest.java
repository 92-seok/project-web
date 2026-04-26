package com.pawmart.backend.admin.dto;

import jakarta.validation.constraints.NotNull;

import com.pawmart.backend.order.OrderStatus;

public record UpdateOrderStatusRequest(@NotNull OrderStatus status) {}
