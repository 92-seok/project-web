package com.pawmart.backend.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateProductRequest(
    @NotBlank String name,
    String description,
    @Min(0) int price,
    Integer originalPrice,
    @NotBlank String imageUrl,
    String badge,
    @NotBlank String category,
    @NotBlank String petType,
    @Min(0) int stock) {}
