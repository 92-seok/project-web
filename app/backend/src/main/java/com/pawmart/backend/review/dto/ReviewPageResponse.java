package com.pawmart.backend.review.dto;

import java.util.List;

public record ReviewPageResponse(
    List<ReviewResponse> content,
    double averageRating,
    long totalCount,
    int page,
    int size,
    int totalPages,
    boolean last) {}
