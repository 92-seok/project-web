package com.pawmart.backend.member;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.member.dto.LoginRequest;
import com.pawmart.backend.member.dto.LoginResponse;
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
}
