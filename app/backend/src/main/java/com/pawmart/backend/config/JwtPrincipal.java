package com.pawmart.backend.config;

import com.pawmart.backend.member.MemberRole;

public record JwtPrincipal(Long memberId, String loginId, String name, MemberRole role) {}
