package com.pawmart.backend.common.exception;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ErrorResponse> handleBusiness(
      BusinessException e, HttpServletRequest request) {
    ErrorCode errorCode = e.getErrorCode();
    log.warn(
        "BusinessException: code={}, path={}, message={}",
        errorCode.getCode(),
        request.getRequestURI(),
        e.getMessage());
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, request.getRequestURI()));
  }

  // @RequestBody(@Valid) 검증 실패 + @ModelAttribute 바인딩 실패를 함께 처리
  // MethodArgumentNotValidException extends BindException 이므로 상위 타입으로 수신
  @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
  public ResponseEntity<ErrorResponse> handleBindValidation(
      BindException e, HttpServletRequest request) {
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
        .body(ErrorResponse.of(errorCode, request.getRequestURI(), fieldErrors));
  }

  // @Validated 가 붙은 @PathVariable / @RequestParam 검증 실패
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorResponse> handleConstraintViolation(
      ConstraintViolationException e, HttpServletRequest request) {
    List<ErrorResponse.FieldError> fieldErrors =
        e.getConstraintViolations().stream()
            .map(v -> new ErrorResponse.FieldError(v.getPropertyPath().toString(), v.getMessage()))
            .toList();
    ErrorCode errorCode = ErrorCode.INVALID_REQUEST;
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, request.getRequestURI(), fieldErrors));
  }

  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<ErrorResponse> handleMissingParameter(
      MissingServletRequestParameterException e, HttpServletRequest request) {
    log.warn(
        "Missing request parameter: name={}, path={}",
        e.getParameterName(),
        request.getRequestURI());
    ErrorCode errorCode = ErrorCode.MISSING_PARAMETER;
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, request.getRequestURI()));
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleNotReadable(
      HttpMessageNotReadableException e, HttpServletRequest request) {
    // e.getMessage()는 내부 파서 정보를 노출할 수 있어 응답에는 포함하지 않고 로그에만 남김
    log.warn("JSON parse error: path={}", request.getRequestURI());
    ErrorCode errorCode = ErrorCode.INVALID_REQUEST;
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, request.getRequestURI()));
  }

  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ErrorResponse> handleMethodNotSupported(
      HttpRequestMethodNotSupportedException e, HttpServletRequest request) {
    log.warn("Method not supported: method={}, path={}", e.getMethod(), request.getRequestURI());
    ErrorCode errorCode = ErrorCode.METHOD_NOT_ALLOWED;
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, request.getRequestURI()));
  }

  @ExceptionHandler(NoResourceFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(
      NoResourceFoundException e, HttpServletRequest request) {
    log.warn("Resource not found: path={}", request.getRequestURI());
    ErrorCode errorCode = ErrorCode.NOT_FOUND;
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, request.getRequestURI()));
  }

  // Spring Security 의 인증 실패가 @PreAuthorize 등을 통해 컨트롤러 경계까지 전파된 경우
  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ErrorResponse> handleAuthentication(
      AuthenticationException e, HttpServletRequest request) {
    log.warn("Authentication failure: path={}, reason={}", request.getRequestURI(), e.getMessage());
    ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, request.getRequestURI()));
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDenied(
      AccessDeniedException e, HttpServletRequest request) {
    log.warn("Access denied: path={}", request.getRequestURI());
    ErrorCode errorCode = ErrorCode.ACCESS_DENIED;
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, request.getRequestURI()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnknown(Exception e, HttpServletRequest request) {
    log.error("Unhandled exception at path={}", request.getRequestURI(), e);
    ErrorCode errorCode = ErrorCode.INTERNAL_ERROR;
    return ResponseEntity.status(errorCode.getStatus())
        .body(ErrorResponse.of(errorCode, request.getRequestURI()));
  }
}
