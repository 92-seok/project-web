package com.pawmart.backend.payment;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;

@Component
public class TossPaymentClient {

  private static final Logger log = LoggerFactory.getLogger(TossPaymentClient.class);
  private static final String TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

  private final RestClient restClient;

  @Value("${toss.secret-key}")
  private String secretKey;

  public TossPaymentClient() {
    this.restClient = RestClient.create();
  }

  public Map<String, Object> confirm(String paymentKey, String orderId, int amount) {
    String encoded =
        Base64.getEncoder().encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

    Map<String, Object> body =
        Map.of("paymentKey", paymentKey, "orderId", orderId, "amount", amount);

    // 디버깅용 — 시크릿 키 앞 10자리만 로그 (전체는 보안상 X)
    String secretKeyPreview =
        secretKey != null && secretKey.length() > 10
            ? secretKey.substring(0, 10) + "..."
            : "(empty)";
    log.info(
        "[Toss] confirm 호출 — paymentKey={}, orderId={}, amount={}, secretKey={}",
        paymentKey,
        orderId,
        amount,
        secretKeyPreview);

    try {
      return restClient
          .post()
          .uri(TOSS_CONFIRM_URL)
          .header("Authorization", "Basic " + encoded)
          .header("Content-Type", "application/json")
          .body(body)
          .retrieve()
          .body(new ParameterizedTypeReference<Map<String, Object>>() {});
    } catch (RestClientResponseException e) {
      // 토스 응답 본문에 에러 코드/메시지가 포함됨 — 그대로 로그
      log.error(
          "[Toss] confirm 거부 — status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
      throw new BusinessException(ErrorCode.PAYMENT_FAILED);
    } catch (Exception e) {
      log.error("[Toss] confirm 호출 중 예외", e);
      throw new BusinessException(ErrorCode.PAYMENT_FAILED);
    }
  }
}
