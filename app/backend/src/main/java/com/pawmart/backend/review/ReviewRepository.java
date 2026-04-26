package com.pawmart.backend.review;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

  Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

  boolean existsByProductIdAndMemberId(Long productId, Long memberId);

  Optional<Review> findByIdAndMemberId(Long id, Long memberId);

  @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId")
  Optional<Double> findAvgRatingByProductId(@Param("productId") Long productId);

  @Query("SELECT COUNT(r) FROM Review r WHERE r.productId = :productId")
  long countByProductId(@Param("productId") Long productId);
}
