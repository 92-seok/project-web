package com.pawmart.backend.member.dto;

import com.pawmart.backend.member.MemberRole;

public record LoginResponse(
    Long memberId,
    String loginId,
    String name,
    MemberRole role,
    String accessToken,
    String refreshToken) {}
