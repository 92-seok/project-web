package com.pawmart.backend.payment;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.config.JwtPrincipal;
import com.pawmart.backend.payment.dto.ConfirmPaymentRequest;
import com.pawmart.backend.payment.dto.ConfirmPaymentResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

  private final PaymentService paymentService;

  @PostMapping("/confirm")
  public ConfirmPaymentResponse confirm(
      @AuthenticationPrincipal JwtPrincipal principal,
      @Valid @RequestBody ConfirmPaymentRequest request) {
    return paymentService.confirm(principal.memberId(), request);
  }
}
