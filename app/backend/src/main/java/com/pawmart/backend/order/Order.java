package com.pawmart.backend.order;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "order_number", nullable = false, unique = true, length = 30)
  private String orderNumber;

  @Column(name = "member_id", nullable = false)
  private Long memberId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private OrderStatus status = OrderStatus.PAID;

  @Column(name = "total_price", nullable = false)
  private int totalPrice;

  @Column(name = "receiver_name", nullable = false, length = 50)
  private String receiverName;

  @Column(name = "receiver_phone", nullable = false, length = 20)
  private String receiverPhone;

  @Column(name = "postal_code", nullable = false, length = 10)
  private String postalCode;

  @Column(name = "road_address", nullable = false, length = 255)
  private String roadAddress;

  @Column(name = "detail_address", length = 255)
  private String detailAddress;

  @Column(name = "delivery_memo", length = 200)
  private String deliveryMemo;

  @Column(name = "paid_at")
  private LocalDateTime paidAt;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> orderItems = new ArrayList<>();

  @Builder
  private Order(
      String orderNumber,
      Long memberId,
      int totalPrice,
      String receiverName,
      String receiverPhone,
      String postalCode,
      String roadAddress,
      String detailAddress,
      String deliveryMemo,
      LocalDateTime paidAt) {
    this.orderNumber = orderNumber;
    this.memberId = memberId;
    this.status = OrderStatus.PAID;
    this.totalPrice = totalPrice;
    this.receiverName = receiverName;
    this.receiverPhone = receiverPhone;
    this.postalCode = postalCode;
    this.roadAddress = roadAddress;
    this.detailAddress = detailAddress;
    this.deliveryMemo = deliveryMemo;
    this.paidAt = paidAt;
  }

  public static String generateOrderNumber() {
    String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    int random = ThreadLocalRandom.current().nextInt(100000, 1000000);
    return "ORD-" + date + "-" + random;
  }

  public void cancel() {
    if (this.status != OrderStatus.PAID && this.status != OrderStatus.PREPARING) {
      throw new BusinessException(ErrorCode.CANNOT_CANCEL);
    }
    this.status = OrderStatus.CANCELLED;
  }

  public void updateStatus(OrderStatus newStatus) {
    // CANCELLED는 cancel() 메서드로만 처리
    if (newStatus == OrderStatus.CANCELLED) {
      cancel();
      return;
    }
    // 진행 순서: PAID → PREPARING → SHIPPING → DELIVERED
    OrderStatus[] flow = {
      OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.SHIPPING, OrderStatus.DELIVERED
    };
    int currentIdx = -1;
    int nextIdx = -1;
    for (int i = 0; i < flow.length; i++) {
      if (flow[i] == this.status) currentIdx = i;
      if (flow[i] == newStatus) nextIdx = i;
    }
    if (nextIdx != currentIdx + 1) {
      throw new BusinessException(ErrorCode.INVALID_ORDER_STATUS_TRANSITION);
    }
    this.status = newStatus;
  }
}
