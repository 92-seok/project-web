package com.pawmart.backend.review;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.pawmart.backend.common.converter.StringListJsonConverter;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "review")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "product_id", nullable = false)
  private Long productId;

  @Column(name = "member_id", nullable = false)
  private Long memberId;

  @Column(nullable = false)
  private int rating;

  @Column(columnDefinition = "TEXT")
  private String content;

  // MariaDB 호환을 위해 JdbcTypeCode(JSON) 대신 Converter + LONGTEXT 사용.
  // MariaDB의 JSON 타입은 LONGTEXT 별칭이라 컬럼은 그대로 두고 매핑만 교체.
  @Convert(converter = StringListJsonConverter.class)
  @Column(name = "image_urls", columnDefinition = "LONGTEXT")
  private List<String> imageUrls = new ArrayList<>();

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @Builder
  private Review(
      Long productId, Long memberId, int rating, String content, List<String> imageUrls) {
    this.productId = productId;
    this.memberId = memberId;
    this.rating = rating;
    this.content = content;
    this.imageUrls = imageUrls != null ? imageUrls : new ArrayList<>();
  }

  public void update(int rating, String content, List<String> imageUrls) {
    this.rating = rating;
    this.content = content;
    this.imageUrls = imageUrls != null ? imageUrls : new ArrayList<>();
  }
}
