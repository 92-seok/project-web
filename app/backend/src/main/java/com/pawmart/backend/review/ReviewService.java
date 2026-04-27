package com.pawmart.backend.review;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.member.Member;
import com.pawmart.backend.member.MemberRepository;
import com.pawmart.backend.product.ProductRepository;
import com.pawmart.backend.review.dto.CreateReviewRequest;
import com.pawmart.backend.review.dto.ReviewPageResponse;
import com.pawmart.backend.review.dto.ReviewResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

  private final ReviewRepository reviewRepository;
  private final ProductRepository productRepository;
  private final MemberRepository memberRepository;

  public ReviewPageResponse getReviews(Long productId, int page, int size) {
    if (!productRepository.existsById(productId)) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }

    Pageable pageable = PageRequest.of(page, size);
    Page<Review> reviewPage =
        reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);

    Set<Long> memberIds =
        reviewPage.getContent().stream().map(Review::getMemberId).collect(Collectors.toSet());

    Map<Long, String> memberNameMap =
        memberRepository.findAllById(memberIds).stream()
            .collect(Collectors.toMap(Member::getId, Member::getName));

    List<ReviewResponse> responses =
        reviewPage.getContent().stream()
            .map(
                r ->
                    new ReviewResponse(
                        r.getId(),
                        r.getMemberId(),
                        maskName(memberNameMap.getOrDefault(r.getMemberId(), "알 수 없음")),
                        r.getRating(),
                        r.getContent(),
                        r.getImageUrls(),
                        r.getCreatedAt()))
            .toList();

    double avgRating = reviewRepository.findAvgRatingByProductId(productId).orElse(0.0);
    long totalCount = reviewRepository.countByProductId(productId);

    return new ReviewPageResponse(
        responses,
        avgRating,
        totalCount,
        reviewPage.getNumber(),
        reviewPage.getSize(),
        reviewPage.getTotalPages(),
        reviewPage.isLast());
  }

  @Transactional
  public Long createReview(Long memberId, Long productId, CreateReviewRequest request) {
    if (!productRepository.existsById(productId)) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    if (reviewRepository.existsByProductIdAndMemberId(productId, memberId)) {
      throw new BusinessException(ErrorCode.DUPLICATE_REVIEW);
    }

    Review review =
        Review.builder()
            .productId(productId)
            .memberId(memberId)
            .rating(request.rating())
            .content(request.content())
            .imageUrls(request.imageUrls())
            .build();

    Long reviewId = reviewRepository.save(review).getId();
    updateProductStats(productId);
    return reviewId;
  }

  @Transactional
  public void deleteReview(Long memberId, Long reviewId) {
    Review review =
        reviewRepository
            .findByIdAndMemberId(reviewId, memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));

    Long productId = review.getProductId();
    reviewRepository.delete(review);
    updateProductStats(productId);
  }

  private void updateProductStats(Long productId) {
    double avg = reviewRepository.findAvgRatingByProductId(productId).orElse(0.0);
    long count = reviewRepository.countByProductId(productId);
    productRepository
        .findById(productId)
        .ifPresent(
            p ->
                p.updateStats(
                    BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP), (int) count));
  }

  private String maskName(String name) {
    if (name.length() <= 1) return name;
    if (name.length() == 2) return name.charAt(0) + "*";
    return name.charAt(0) + "*".repeat(name.length() - 2) + name.charAt(name.length() - 1);
  }
}
