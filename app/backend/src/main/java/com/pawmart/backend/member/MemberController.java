package com.pawmart.backend.member;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.config.JwtPrincipal;
import com.pawmart.backend.member.dto.ChangePasswordRequest;
import com.pawmart.backend.member.dto.UpdateProfileRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

  private final MemberService memberService;

  @PatchMapping("/me")
  public ResponseEntity<Void> updateProfile(
      @AuthenticationPrincipal JwtPrincipal principal,
      @Valid @RequestBody UpdateProfileRequest request) {
    memberService.updateProfile(principal.memberId(), request);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/me/password")
  public ResponseEntity<Void> changePassword(
      @AuthenticationPrincipal JwtPrincipal principal,
      @Valid @RequestBody ChangePasswordRequest request) {
    memberService.changePassword(principal.memberId(), request);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/me")
  public ResponseEntity<Void> withdraw(@AuthenticationPrincipal JwtPrincipal principal) {
    memberService.withdraw(principal.memberId());
    return ResponseEntity.noContent().build();
  }
}
