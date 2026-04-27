package com.pawmart.backend.admin;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.admin.dto.UpdateOrderStatusRequest;
import com.pawmart.backend.order.dto.OrderDetailResponse;
import com.pawmart.backend.order.dto.OrderPageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

  private final AdminOrderService adminOrderService;

  @GetMapping
  public ResponseEntity<OrderPageResponse> getOrders(
      @RequestParam(required = false) String status,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return ResponseEntity.ok(adminOrderService.getOrders(status, page, size));
  }

  @GetMapping("/{id}")
  public ResponseEntity<OrderDetailResponse> getOrder(@PathVariable Long id) {
    return ResponseEntity.ok(adminOrderService.getOrder(id));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<Void> updateStatus(
      @PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) {
    adminOrderService.updateStatus(id, request.status());
    return ResponseEntity.noContent().build();
  }
}
