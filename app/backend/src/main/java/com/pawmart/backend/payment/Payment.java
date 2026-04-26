package com.pawmart.backend.payment;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payment")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "order_id", nullable = false)
  private Long orderId;

  @Column(name = "member_id", nullable = false)
  private Long memberId;

  @Column(name = "payment_key", nullable = false, length = 200)
  private String paymentKey;

  @Column(name = "toss_order_id", nullable = false, length = 64)
  private String tossOrderId;

  @Column(nullable = false)
  private int amount;

  @Column(length = 50)
  private String method;

  @Column(nullable = false, length = 30)
  private String status;

  @Column(name = "approved_at")
  private LocalDateTime approvedAt;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  public static Payment create(
      Long orderId,
      Long memberId,
      String paymentKey,
      String tossOrderId,
      int amount,
      String method,
      LocalDateTime approvedAt) {
    Payment p = new Payment();
    p.orderId = orderId;
    p.memberId = memberId;
    p.paymentKey = paymentKey;
    p.tossOrderId = tossOrderId;
    p.amount = amount;
    p.method = method;
    p.status = "DONE";
    p.approvedAt = approvedAt;
    return p;
  }
}
