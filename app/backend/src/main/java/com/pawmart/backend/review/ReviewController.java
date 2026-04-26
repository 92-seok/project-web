package com.pawmart.backend.review;

import java.net.URI;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.config.JwtPrincipal;
import com.pawmart.backend.review.dto.CreateReviewRequest;
import com.pawmart.backend.review.dto.ReviewPageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

  private final ReviewService reviewService;

  @GetMapping
  public ReviewPageResponse getReviews(
      @PathVariable Long productId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return reviewService.getReviews(productId, page, size);
  }

  @PostMapping
  public ResponseEntity<Void> createReview(
      @AuthenticationPrincipal JwtPrincipal principal,
      @PathVariable Long productId,
      @Valid @RequestBody CreateReviewRequest request) {
    Long reviewId = reviewService.createReview(principal.memberId(), productId, request);
    URI location = URI.create("/api/products/" + productId + "/reviews/" + reviewId);
    return ResponseEntity.created(location).build();
  }

  @DeleteMapping("/{reviewId}")
  public ResponseEntity<Void> deleteReview(
      @AuthenticationPrincipal JwtPrincipal principal,
      @PathVariable Long productId,
      @PathVariable Long reviewId) {
    reviewService.deleteReview(principal.memberId(), reviewId);
    return ResponseEntity.noContent().build();
  }
}
