package com.pawmart.backend.review.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
    Long id,
    Long memberId,
    String memberName,
    int rating,
    String content,
    LocalDateTime createdAt
) {}
