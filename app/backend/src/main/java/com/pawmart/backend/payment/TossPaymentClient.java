package com.pawmart.backend.payment;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;

@Component
public class TossPaymentClient {

  private static final String TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

  private final RestClient restClient;

  @Value("${toss.secret-key}")
  private String secretKey;

  public TossPaymentClient() {
    this.restClient = RestClient.create();
  }

  public Map<String, Object> confirm(String paymentKey, String orderId, int amount) {
    String encoded =
        Base64.getEncoder()
            .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

    Map<String, Object> body =
        Map.of("paymentKey", paymentKey, "orderId", orderId, "amount", amount);

    try {
      return restClient
          .post()
          .uri(TOSS_CONFIRM_URL)
          .header("Authorization", "Basic " + encoded)
          .header("Content-Type", "application/json")
          .body(body)
          .retrieve()
          .body(new ParameterizedTypeReference<Map<String, Object>>() {});
    } catch (Exception e) {
      throw new BusinessException(ErrorCode.PAYMENT_FAILED);
    }
  }
}
