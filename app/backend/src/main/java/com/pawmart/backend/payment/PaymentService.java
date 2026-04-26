package com.pawmart.backend.payment;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.order.Order;
import com.pawmart.backend.order.OrderRepository;
import com.pawmart.backend.payment.dto.ConfirmPaymentRequest;
import com.pawmart.backend.payment.dto.ConfirmPaymentResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

  private final PaymentRepository paymentRepository;
  private final OrderRepository orderRepository;
  private final TossPaymentClient tossPaymentClient;

  @Transactional
  public ConfirmPaymentResponse confirm(Long memberId, ConfirmPaymentRequest request) {
    // 1. 중복 결제 방지
    if (paymentRepository.findByTossOrderId(request.orderId()).isPresent()) {
      throw new BusinessException(ErrorCode.DUPLICATE_PAYMENT);
    }

    // 2. 주문 조회 (orderNumber = 토스페이먼츠 orderId)
    Order order =
        orderRepository
            .findByOrderNumber(request.orderId())
            .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

    // 3. 본인 주문 확인
    if (!order.getMemberId().equals(memberId)) {
      throw new BusinessException(ErrorCode.ACCESS_DENIED);
    }

    // 4. 금액 검증
    if (order.getTotalPrice() != request.amount()) {
      throw new BusinessException(ErrorCode.PAYMENT_AMOUNT_MISMATCH);
    }

    // 5. 토스페이먼츠 승인 API 호출
    Map<String, Object> tossResponse =
        tossPaymentClient.confirm(request.paymentKey(), request.orderId(), request.amount());

    // 6. 응답 파싱
    String method = (String) tossResponse.getOrDefault("method", "카드");
    String approvedAtStr =
        (String) tossResponse.getOrDefault("approvedAt", LocalDateTime.now().toString());

    // ISO-8601 오프셋 포함 문자열에서 앞 19자리만 파싱 (예: "2024-01-01T12:00:00+09:00" → "2024-01-01T12:00:00")
    LocalDateTime approvedAt = LocalDateTime.parse(approvedAtStr.substring(0, 19));

    // 7. Payment 저장
    Payment payment =
        Payment.create(
            order.getId(),
            memberId,
            request.paymentKey(),
            request.orderId(),
            request.amount(),
            method,
            approvedAt);
    paymentRepository.save(payment);

    return new ConfirmPaymentResponse(
        request.paymentKey(), request.orderId(), method, request.amount(), "DONE", approvedAtStr);
  }
}
