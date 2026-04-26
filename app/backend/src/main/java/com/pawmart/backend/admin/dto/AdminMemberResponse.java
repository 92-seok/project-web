package com.pawmart.backend.admin.dto;

import java.time.LocalDateTime;

import com.pawmart.backend.member.Member;

public record AdminMemberResponse(
    Long id,
    String loginId,
    String name,
    String email,
    String phone,
    String role,
    String status,
    LocalDateTime createdAt
) {

  public static AdminMemberResponse from(Member m) {
    return new AdminMemberResponse(
        m.getId(),
        m.getLoginId(),
        m.getName(),
        m.getEmail(),
        m.getPhone(),
        m.getRole().name(),
        m.getStatus().name(),
        m.getCreatedAt()
    );
  }
}
