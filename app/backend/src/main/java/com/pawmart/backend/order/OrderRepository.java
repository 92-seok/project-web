package com.pawmart.backend.order;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

  Page<Order> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);

  Optional<Order> findByIdAndMemberId(Long id, Long memberId);

  Optional<Order> findByOrderNumber(String orderNumber);

  Page<Order> findByStatus(OrderStatus status, Pageable pageable);

  // 시간 범위 비교로 H2 + Hibernate 7 호환 (DATE() 함수 회피)
  @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end")
  long countOrdersCreatedBetween(
      @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

  default long countTodayOrders() {
    LocalDateTime start = LocalDate.now().atStartOfDay();
    return countOrdersCreatedBetween(start, start.plusDays(1));
  }

  @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.status != 'CANCELLED'")
  long sumTotalRevenue();
}
