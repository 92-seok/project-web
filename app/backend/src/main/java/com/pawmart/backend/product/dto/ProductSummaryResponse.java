package com.pawmart.backend.product.dto;

import java.math.BigDecimal;

import com.pawmart.backend.product.Product;

public record ProductSummaryResponse(
    Long id,
    String name,
    int price,
    Integer originalPrice,
    String imageUrl,
    String badge,
    String category,
    String petType,
    BigDecimal rating,
    int reviewCount,
    int stock) {

  public static ProductSummaryResponse from(Product p) {
    return new ProductSummaryResponse(
        p.getId(),
        p.getName(),
        p.getPrice(),
        p.getOriginalPrice(),
        p.getImageUrl(),
        p.getBadge(),
        p.getCategory(),
        p.getPetType(),
        p.getRating(),
        p.getReviewCount(),
        p.getStock());
  }
}
