package com.pawmart.backend.member;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.config.JwtUtil;
import com.pawmart.backend.member.dto.ChangePasswordRequest;
import com.pawmart.backend.member.dto.LoginRequest;
import com.pawmart.backend.member.dto.LoginResponse;
import com.pawmart.backend.member.dto.RefreshRequest;
import com.pawmart.backend.member.dto.RefreshResponse;
import com.pawmart.backend.member.dto.SignUpRequest;
import com.pawmart.backend.member.dto.UpdateProfileRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  @Transactional
  public Long signUp(SignUpRequest request) {
    // 빠른 실패 경로: 일반 케이스에서 두 번의 exists 쿼리로 친절한 오류 메시지를 반환
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

    try {
      // 최후 방어선: pre-check 와 save 사이에 동시 요청이 유니크 제약을 건드리면
      // saveAndFlush 가 즉시 INSERT 를 시도 → DataIntegrityViolationException 을 여기서 포착
      return memberRepository.saveAndFlush(member).getId();
    } catch (DataIntegrityViolationException e) {
      throw mapDuplicateKey(e);
    }
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

    String accessToken = jwtUtil.generateAccessToken(member.getId(), member.getLoginId(), member.getName(), member.getRole());
    String refreshToken = jwtUtil.generateRefreshToken(member.getId());

    return new LoginResponse(
        member.getId(), member.getLoginId(), member.getName(), member.getRole(),
        accessToken, refreshToken);
  }

  public RefreshResponse refresh(RefreshRequest request) {
    String refreshToken = request.refreshToken();

    if (!jwtUtil.isValid(refreshToken)) {
      throw new BusinessException(ErrorCode.INVALID_TOKEN);
    }
    if (jwtUtil.isExpired(refreshToken)) {
      throw new BusinessException(ErrorCode.EXPIRED_TOKEN);
    }

    Long memberId = jwtUtil.getMemberId(jwtUtil.parseClaims(refreshToken));
    Member member =
        memberRepository
            .findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

    if (member.getStatus() != MemberStatus.ACTIVE) {
      throw new BusinessException(ErrorCode.INACTIVE_MEMBER);
    }

    String accessToken =
        jwtUtil.generateAccessToken(
            member.getId(), member.getLoginId(), member.getName(), member.getRole());
    return new RefreshResponse(accessToken);
  }

  @Transactional
  public void updateProfile(Long memberId, UpdateProfileRequest request) {
    Member member =
        memberRepository
            .findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

    member.updateProfile(
        request.name(),
        request.phone(),
        request.gender(),
        request.birthDate(),
        request.postalCode(),
        request.roadAddress(),
        request.jibunAddress(),
        request.detailAddress(),
        request.smsAgreed(),
        request.emailAgreed());
  }

  @Transactional
  public void changePassword(Long memberId, ChangePasswordRequest request) {
    Member member =
        memberRepository
            .findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

    if (!passwordEncoder.matches(request.currentPassword(), member.getPasswordHash())) {
      throw new BusinessException(ErrorCode.LOGIN_FAILED);
    }
    if (passwordEncoder.matches(request.newPassword(), member.getPasswordHash())) {
      throw new BusinessException(ErrorCode.SAME_PASSWORD);
    }

    member.changePassword(passwordEncoder.encode(request.newPassword()));
  }

  @Transactional
  public void withdraw(Long memberId) {
    Member member =
        memberRepository
            .findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    member.withdraw();
  }

  private BusinessException mapDuplicateKey(DataIntegrityViolationException e) {
    // Hibernate 가 원인 예외로 제약명을 담고 있는 경우 정확한 ErrorCode 로 분기
    if (e.getCause() instanceof ConstraintViolationException hib) {
      String name = hib.getConstraintName();
      if (name != null) {
        String lower = name.toLowerCase();
        if (lower.contains("email")) {
          return new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }
        if (lower.contains("login")) {
          return new BusinessException(ErrorCode.DUPLICATE_LOGIN_ID);
        }
      }
    }
    // 제약명을 특정할 수 없어도 중복 상황인 것은 분명하므로 기본값으로 아이디 중복을 반환
    return new BusinessException(ErrorCode.DUPLICATE_LOGIN_ID);
  }
}
