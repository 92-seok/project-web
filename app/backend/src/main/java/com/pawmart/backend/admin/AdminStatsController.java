package com.pawmart.backend.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.admin.dto.StatsResponse;
import com.pawmart.backend.member.MemberRepository;
import com.pawmart.backend.order.OrderRepository;
import com.pawmart.backend.product.ProductRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

  private final MemberRepository memberRepository;
  private final ProductRepository productRepository;
  private final OrderRepository orderRepository;

  @GetMapping
  public ResponseEntity<StatsResponse> getStats() {
    StatsResponse stats =
        new StatsResponse(
            memberRepository.count(),
            productRepository.count(),
            orderRepository.count(),
            orderRepository.countTodayOrders(),
            orderRepository.sumTotalRevenue());
    return ResponseEntity.ok(stats);
  }
}
