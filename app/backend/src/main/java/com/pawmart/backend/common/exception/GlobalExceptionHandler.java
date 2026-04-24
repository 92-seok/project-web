package com.pawmart.backend.common.exception;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ErrorResponse> handleBusiness(BusinessException e) {
    ErrorCode errorCode = e.getErrorCode();
    log.warn("BusinessException: code={}, message={}", errorCode.getCode(), e.getMessage());
    return ResponseEntity.status(errorCode.getStatus()).body(ErrorResponse.of(errorCode));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
    List<ErrorResponse.FieldError> fieldErrors =
        e.getBindingResult().getFieldErrors().stream()
            .map(
                err ->
                    new ErrorResponse.FieldError(
                        err.getField(),
                        err.getDefaultMessage() != null ? err.getDefaultMessage() : "invalid"))
            .toList();

    ErrorCode errorCode = ErrorCode.INVALID_REQUEST;
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, fieldErrors));
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleNotReadable(HttpMessageNotReadableException e) {
    log.warn("JSON parse error: {}", e.getMessage());
    ErrorCode errorCode = ErrorCode.INVALID_REQUEST;
    return ResponseEntity.status(errorCode.getStatus()).body(ErrorResponse.of(errorCode));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnknown(Exception e) {
    log.error("Unhandled exception", e);
    ErrorCode errorCode = ErrorCode.INTERNAL_ERROR;
    return ResponseEntity.status(errorCode.getStatus()).body(ErrorResponse.of(errorCode));
  }
}
