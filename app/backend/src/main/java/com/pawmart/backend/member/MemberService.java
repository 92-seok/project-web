package com.pawmart.backend.member;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.member.dto.LoginRequest;
import com.pawmart.backend.member.dto.LoginResponse;
import com.pawmart.backend.member.dto.SignUpRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;

  @Transactional
  public Long signUp(SignUpRequest request) {
    if (memberRepository.existsByLoginId(request.loginId())) {
      throw new BusinessException(ErrorCode.DUPLICATE_LOGIN_ID);
    }
    if (memberRepository.existsByEmail(request.email())) {
      throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
    }

    Member member =
        Member.builder()
            .loginId(request.loginId())
            .passwordHash(passwordEncoder.encode(request.password()))
            .name(request.name())
            .email(request.email())
            .gender(request.gender())
            .birthDate(request.birthDate())
            .phone(request.phone())
            .smsAgreed(Boolean.TRUE.equals(request.smsAgreed()))
            .emailAgreed(Boolean.TRUE.equals(request.emailAgreed()))
            .postalCode(request.postalCode())
            .roadAddress(request.roadAddress())
            .jibunAddress(request.jibunAddress())
            .detailAddress(request.detailAddress())
            .build();

    return memberRepository.save(member).getId();
  }

  public LoginResponse login(LoginRequest request) {
    Member member =
        memberRepository
            .findByLoginId(request.loginId())
            .orElseThrow(() -> new BusinessException(ErrorCode.LOGIN_FAILED));

    if (!passwordEncoder.matches(request.password(), member.getPasswordHash())) {
      throw new BusinessException(ErrorCode.LOGIN_FAILED);
    }
    if (member.getStatus() != MemberStatus.ACTIVE) {
      throw new BusinessException(ErrorCode.INACTIVE_MEMBER);
    }

    return new LoginResponse(
        member.getId(), member.getLoginId(), member.getName(), member.getRole());
  }
}
