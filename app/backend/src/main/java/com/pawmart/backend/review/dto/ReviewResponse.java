package com.pawmart.backend.review.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ReviewResponse(
    Long id,
    Long memberId,
    String memberName,
    int rating,
    String content,
    List<String> imageUrls,
    LocalDateTime createdAt) {}
