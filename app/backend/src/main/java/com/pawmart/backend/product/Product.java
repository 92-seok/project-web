package com.pawmart.backend.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false)
  private int price;

  @Column(name = "original_price")
  private Integer originalPrice;

  @Column(name = "image_url", nullable = false, length = 500)
  private String imageUrl;

  @Column(length = 50)
  private String badge;

  @Column(nullable = false, length = 50)
  private String category;

  @Column(name = "pet_type", nullable = false, length = 50)
  private String petType;

  @Column(nullable = false)
  private int stock;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ProductStatus status = ProductStatus.ON_SALE;

  @Column(nullable = false, precision = 3, scale = 2)
  private BigDecimal rating = BigDecimal.ZERO;

  @Column(name = "review_count", nullable = false)
  private int reviewCount;

  @Version
  @Column(nullable = false)
  private long version;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  public void updateStats(BigDecimal rating, int reviewCount) {
    this.rating = rating;
    this.reviewCount = reviewCount;
  }

  public static Product create(
      String name,
      String description,
      int price,
      Integer originalPrice,
      String imageUrl,
      String badge,
      String category,
      String petType,
      int stock) {
    Product p = new Product();
    p.name = name;
    p.description = description;
    p.price = price;
    p.originalPrice = originalPrice;
    p.imageUrl = imageUrl;
    p.badge = badge;
    p.category = category;
    p.petType = petType;
    p.stock = stock;
    p.status = ProductStatus.ON_SALE;
    p.rating = BigDecimal.ZERO;
    p.reviewCount = 0;
    return p;
  }

  public void adminUpdate(
      String name,
      String description,
      int price,
      Integer originalPrice,
      String imageUrl,
      String badge,
      String category,
      String petType,
      int stock) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.originalPrice = originalPrice;
    this.imageUrl = imageUrl;
    this.badge = badge;
    this.category = category;
    this.petType = petType;
    this.stock = stock;
  }

  public void hide() {
    this.status = ProductStatus.HIDDEN;
  }

  public void decreaseStock(int quantity) {
    if (quantity <= 0) {
      throw new BusinessException(ErrorCode.INVALID_REQUEST);
    }
    if (this.stock < quantity) {
      throw new BusinessException(ErrorCode.OUT_OF_STOCK);
    }
    this.stock -= quantity;
  }

  public void increaseStock(int quantity) {
    if (quantity <= 0) {
      throw new BusinessException(ErrorCode.INVALID_REQUEST);
    }
    this.stock += quantity;
  }
}
