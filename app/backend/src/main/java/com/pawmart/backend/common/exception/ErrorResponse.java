package com.pawmart.backend.common.exception;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ErrorResponse(
    LocalDateTime timestamp,
    String path,
    String code,
    String message,
    List<FieldError> fieldErrors) {

  public static ErrorResponse of(ErrorCode errorCode, String path) {
    return new ErrorResponse(
        LocalDateTime.now(), path, errorCode.getCode(), errorCode.getMessage(), List.of());
  }

  public static ErrorResponse of(ErrorCode errorCode, String path, List<FieldError> fieldErrors) {
    return new ErrorResponse(
        LocalDateTime.now(), path, errorCode.getCode(), errorCode.getMessage(), fieldErrors);
  }

  public record FieldError(String field, String reason) {}
}
