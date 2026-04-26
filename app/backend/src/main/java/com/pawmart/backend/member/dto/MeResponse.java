package com.pawmart.backend.member.dto;

import com.pawmart.backend.member.MemberRole;

public record MeResponse(Long memberId, String loginId, String name, MemberRole role) {}
