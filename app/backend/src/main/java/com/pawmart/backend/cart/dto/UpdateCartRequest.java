package com.pawmart.backend.cart.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record UpdateCartRequest(@Min(1) @Max(99) int quantity) {}
