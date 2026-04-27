package com.pawmart.backend.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.order.dto.CreateOrderRequest;
import com.pawmart.backend.order.dto.OrderDetailResponse;
import com.pawmart.backend.product.Product;
import com.pawmart.backend.product.ProductRepository;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("OrderService 통합 테스트")
class OrderServiceTest {

  @Autowired private OrderService orderService;
  @Autowired private ProductRepository productRepository;
  @Autowired private OrderRepository orderRepository;

  private static final Long MEMBER_ID = 1L;

  @BeforeEach
  void cleanUp() {
    orderRepository.deleteAll();
    productRepository.deleteAll();
  }

  @Test
  @DisplayName("정상 주문 시 재고가 차감되고 주문 금액이 계산된다")
  void createOrder_decreasesStock() {
    Product product =
        productRepository.save(
            Product.create("강아지 사료", "설명", 10000, null, "img.jpg", null, "사료", "DOG", 10));

    OrderDetailResponse response =
        orderService.createOrder(MEMBER_ID, sampleRequest(product.getId(), 3));

    assertThat(response.totalPrice()).isEqualTo(30000);
    Product reloaded = productRepository.findById(product.getId()).orElseThrow();
    assertThat(reloaded.getStock()).isEqualTo(7);
  }

  @Test
  @DisplayName("재고보다 많은 수량을 주문하면 OUT_OF_STOCK 예외가 발생하고 재고는 변하지 않는다")
  void createOrder_outOfStock_throws() {
    Product product =
        productRepository.save(
            Product.create("강아지 간식", "설명", 5000, null, "img.jpg", null, "간식", "DOG", 2));

    assertThatThrownBy(() -> orderService.createOrder(MEMBER_ID, sampleRequest(product.getId(), 5)))
        .isInstanceOf(BusinessException.class)
        .extracting(e -> ((BusinessException) e).getErrorCode())
        .isEqualTo(ErrorCode.OUT_OF_STOCK);

    Product reloaded = productRepository.findById(product.getId()).orElseThrow();
    assertThat(reloaded.getStock()).isEqualTo(2);
  }

  @Test
  @DisplayName("주문을 취소하면 재고가 원래대로 복구된다")
  void cancelOrder_restoresStock() {
    Product product =
        productRepository.save(
            Product.create("고양이 모래", "설명", 8000, null, "img.jpg", null, "모래", "CAT", 10));

    OrderDetailResponse order =
        orderService.createOrder(MEMBER_ID, sampleRequest(product.getId(), 4));

    orderService.cancelOrder(order.id(), MEMBER_ID);

    Product reloaded = productRepository.findById(product.getId()).orElseThrow();
    assertThat(reloaded.getStock()).isEqualTo(10);
  }

  @Test
  @DisplayName("동일 상품을 10명이 동시에 1개씩 주문해도 재고(5)만큼만 성공한다")
  void createOrder_concurrent_decreasesStockSafely() throws InterruptedException {
    Product product =
        productRepository.save(
            Product.create("한정수량 펫 옷", "설명", 30000, null, "img.jpg", null, "의류", "DOG", 5));

    int threads = 10;
    ExecutorService executor = Executors.newFixedThreadPool(threads);
    CountDownLatch latch = new CountDownLatch(threads);
    AtomicInteger success = new AtomicInteger(0);
    AtomicInteger outOfStock = new AtomicInteger(0);

    for (int i = 0; i < threads; i++) {
      executor.submit(
          () -> {
            try {
              orderService.createOrder(MEMBER_ID, sampleRequest(product.getId(), 1));
              success.incrementAndGet();
            } catch (BusinessException e) {
              if (e.getErrorCode() == ErrorCode.OUT_OF_STOCK) {
                outOfStock.incrementAndGet();
              }
            } catch (Exception ignored) {
            } finally {
              latch.countDown();
            }
          });
    }

    boolean finished = latch.await(10, TimeUnit.SECONDS);
    executor.shutdown();

    assertThat(finished).as("모든 스레드가 10초 내 종료되어야 함").isTrue();

    Product reloaded = productRepository.findById(product.getId()).orElseThrow();
    assertThat(reloaded.getStock()).as("재고는 정확히 0이어야 함").isZero();
    assertThat(success.get()).as("성공 주문 수").isEqualTo(5);
    assertThat(outOfStock.get()).as("재고 부족 실패 수").isEqualTo(5);
  }

  private CreateOrderRequest sampleRequest(Long productId, int quantity) {
    return new CreateOrderRequest(
        List.of(new CreateOrderRequest.OrderItemRequest(productId, quantity)),
        "수신인",
        "010-0000-0000",
        "12345",
        "도로명 주소 123",
        "101동 202호",
        "문 앞에 두세요");
  }
}
