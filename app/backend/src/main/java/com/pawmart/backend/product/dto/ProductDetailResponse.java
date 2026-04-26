package com.pawmart.backend.product.dto;

import java.math.BigDecimal;

import com.pawmart.backend.product.Product;
import com.pawmart.backend.product.ProductStatus;

public record ProductDetailResponse(
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
    String description,
    int stock,
    ProductStatus status) {

  public static ProductDetailResponse from(Product p) {
    return new ProductDetailResponse(
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
        p.getDescription(),
        p.getStock(),
        p.getStatus());
  }
}
