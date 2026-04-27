package com.pawmart.backend.review.dto;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record CreateReviewRequest(
    @Min(1) @Max(5) int rating,
    @Size(max = 1000) String content,
    @Size(max = 3, message = "이미지는 최대 3장까지 첨부할 수 있습니다") List<String> imageUrls) {}
