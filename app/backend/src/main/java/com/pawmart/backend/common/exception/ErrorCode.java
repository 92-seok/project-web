package com.pawmart.backend.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
  // Member
  DUPLICATE_LOGIN_ID(HttpStatus.CONFLICT, "M001", "이미 사용 중인 아이디입니다."),
  DUPLICATE_EMAIL(HttpStatus.CONFLICT, "M002", "이미 사용 중인 이메일입니다."),
  LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "M003", "아이디 또는 비밀번호가 올바르지 않습니다."),
  INACTIVE_MEMBER(HttpStatus.FORBIDDEN, "M004", "비활성화된 계정입니다."),

  // Common
  INVALID_REQUEST(HttpStatus.BAD_REQUEST, "C001", "입력값이 올바르지 않습니다."),
  NOT_FOUND(HttpStatus.NOT_FOUND, "C002", "요청하신 리소스를 찾을 수 없습니다."),
  METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C003", "허용되지 않은 HTTP 메서드입니다."),
  MISSING_PARAMETER(HttpStatus.BAD_REQUEST, "C004", "필수 요청 파라미터가 누락되었습니다."),
  UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "C005", "인증이 필요합니다."),
  ACCESS_DENIED(HttpStatus.FORBIDDEN, "C006", "접근 권한이 없습니다."),
  INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C999", "서버 내부 오류가 발생했습니다.");

  private final HttpStatus status;
  private final String code;
  private final String message;
}
