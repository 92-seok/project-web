package com.pawmart.backend.member;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.config.JwtPrincipal;
import com.pawmart.backend.member.dto.LoginRequest;
import com.pawmart.backend.member.dto.LoginResponse;
import com.pawmart.backend.member.dto.MeResponse;
import com.pawmart.backend.member.dto.RefreshRequest;
import com.pawmart.backend.member.dto.RefreshResponse;
import com.pawmart.backend.member.dto.SignUpRequest;
import com.pawmart.backend.member.dto.SignUpResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final MemberService memberService;

  @PostMapping("/signup")
  public ResponseEntity<SignUpResponse> signUp(@Valid @RequestBody SignUpRequest request) {
    Long memberId = memberService.signUp(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(new SignUpResponse(memberId));
  }

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    return memberService.login(request);
  }

  @PostMapping("/refresh")
  public RefreshResponse refresh(@Valid @RequestBody RefreshRequest request) {
    return memberService.refresh(request);
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout() {
    // stateless JWT — 클라이언트 토큰 삭제로 로그아웃 처리
    // TODO: 추후 토큰 블랙리스트(Redis) 도입 시 여기서 토큰 무효화
    return ResponseEntity.ok().build();
  }

  @GetMapping("/me")
  public MeResponse me(@AuthenticationPrincipal JwtPrincipal principal) {
    return new MeResponse(
        principal.memberId(), principal.loginId(), principal.name(), principal.role());
  }
}
