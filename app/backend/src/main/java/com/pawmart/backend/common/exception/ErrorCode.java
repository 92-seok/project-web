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
  SAME_PASSWORD(HttpStatus.BAD_REQUEST, "M005", "현재 비밀번호와 동일합니다."),
  MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "M006", "존재하지 않는 회원입니다."),

  // Order
  CANNOT_CANCEL(HttpStatus.BAD_REQUEST, "O001", "취소할 수 없는 주문입니다."),
  ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "O002", "존재하지 않는 주문입니다."),
  INVALID_ORDER_STATUS_TRANSITION(HttpStatus.BAD_REQUEST, "O003", "올바르지 않은 주문 상태 전이입니다."),

  // Review
  DUPLICATE_REVIEW(HttpStatus.CONFLICT, "R001", "이미 리뷰를 작성하셨습니다."),

  // Product
  PRODUCT_NOT_AVAILABLE(HttpStatus.BAD_REQUEST, "P001", "구매 불가능한 상품입니다."),
  OUT_OF_STOCK(HttpStatus.CONFLICT, "P002", "재고가 부족합니다."),

  // Cart
  CART_ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "C010", "장바구니에 없는 상품입니다."),

  // Payment
  PAYMENT_FAILED(HttpStatus.BAD_GATEWAY, "PAY001", "결제 처리 중 오류가 발생했습니다."),
  DUPLICATE_PAYMENT(HttpStatus.CONFLICT, "PAY002", "이미 처리된 결제입니다."),
  PAYMENT_AMOUNT_MISMATCH(HttpStatus.BAD_REQUEST, "PAY003", "결제 금액이 주문 금액과 다릅니다."),

  // Upload
  EMPTY_FILE(HttpStatus.BAD_REQUEST, "U001", "파일이 비어 있습니다."),
  INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "U002", "허용되지 않는 파일 형식입니다."),
  FILE_TOO_LARGE(HttpStatus.PAYLOAD_TOO_LARGE, "U003", "파일 크기가 너무 큽니다."),
  FILE_STORAGE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "U004", "파일 저장에 실패했습니다."),

  // Pet
  PET_NOT_FOUND(HttpStatus.NOT_FOUND, "PET001", "존재하지 않는 펫입니다."),

  // Common
  INVALID_REQUEST(HttpStatus.BAD_REQUEST, "C001", "입력값이 올바르지 않습니다."),
  NOT_FOUND(HttpStatus.NOT_FOUND, "C002", "요청하신 리소스를 찾을 수 없습니다."),
  METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C003", "허용되지 않은 HTTP 메서드입니다."),
  MISSING_PARAMETER(HttpStatus.BAD_REQUEST, "C004", "필수 요청 파라미터가 누락되었습니다."),
  UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "C005", "인증이 필요합니다."),
  ACCESS_DENIED(HttpStatus.FORBIDDEN, "C006", "접근 권한이 없습니다."),
  INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "C007", "유효하지 않은 토큰입니다."),
  EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "C008", "만료된 토큰입니다."),
  INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C999", "서버 내부 오류가 발생했습니다.");

  private final HttpStatus status;
  private final String code;
  private final String message;
}
