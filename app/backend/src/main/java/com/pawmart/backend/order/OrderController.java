package com.pawmart.backend.order;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.config.JwtPrincipal;
import com.pawmart.backend.order.dto.CreateOrderRequest;
import com.pawmart.backend.order.dto.OrderDetailResponse;
import com.pawmart.backend.order.dto.OrderPageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @PostMapping
  public ResponseEntity<OrderDetailResponse> createOrder(
      @AuthenticationPrincipal JwtPrincipal principal,
      @Valid @RequestBody CreateOrderRequest request) {
    OrderDetailResponse response = orderService.createOrder(principal.memberId(), request);
    return ResponseEntity.status(201).body(response);
  }

  @GetMapping
  public ResponseEntity<OrderPageResponse> getMyOrders(
      @AuthenticationPrincipal JwtPrincipal principal,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(orderService.getMyOrders(principal.memberId(), page, size));
  }

  @GetMapping("/{id}")
  public ResponseEntity<OrderDetailResponse> getOrder(
      @AuthenticationPrincipal JwtPrincipal principal, @PathVariable Long id) {
    return ResponseEntity.ok(orderService.getOrder(id, principal.memberId()));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> cancelOrder(
      @AuthenticationPrincipal JwtPrincipal principal, @PathVariable Long id) {
    orderService.cancelOrder(id, principal.memberId());
    return ResponseEntity.noContent().build();
  }
}
