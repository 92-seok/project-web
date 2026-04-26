package com.pawmart.backend.order;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {

  Page<Order> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);

  Optional<Order> findByIdAndMemberId(Long id, Long memberId);

  Optional<Order> findByOrderNumber(String orderNumber);

  Page<Order> findByStatus(OrderStatus status, Pageable pageable);

  @Query("SELECT COUNT(o) FROM Order o WHERE DATE(o.createdAt) = CURRENT_DATE")
  long countTodayOrders();

  @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.status != 'CANCELLED'")
  long sumTotalRevenue();
}
