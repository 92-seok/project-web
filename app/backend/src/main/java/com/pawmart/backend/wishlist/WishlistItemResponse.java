package com.pawmart.backend.wishlist;

import java.math.BigDecimal;

import com.pawmart.backend.product.Product;

public record WishlistItemResponse(
    Long productId,
    String name,
    int price,
    Integer originalPrice,
    String imageUrl,
    String badge,
    BigDecimal rating,
    int reviewCount) {

  public static WishlistItemResponse from(Product p) {
    return new WishlistItemResponse(
        p.getId(),
        p.getName(),
        p.getPrice(),
        p.getOriginalPrice(),
        p.getImageUrl(),
        p.getBadge(),
        p.getRating(),
        p.getReviewCount());
  }
}
