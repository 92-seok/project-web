package com.pawmart.backend.order;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_item")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;

  @Column(name = "product_id", nullable = false)
  private Long productId;

  @Column(nullable = false, length = 200)
  private String name;

  @Column(nullable = false)
  private int price;

  @Column(name = "image_url", nullable = false, length = 500)
  private String imageUrl;

  @Column(nullable = false)
  private int quantity;

  @Builder
  private OrderItem(Order order, Long productId, String name, int price, String imageUrl, int quantity) {
    this.order = order;
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.quantity = quantity;
  }

  public int getSubtotal() {
    return price * quantity;
  }
}
