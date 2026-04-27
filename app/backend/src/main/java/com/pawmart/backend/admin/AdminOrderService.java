package com.pawmart.backend.admin;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.order.Order;
import com.pawmart.backend.order.OrderItem;
import com.pawmart.backend.order.OrderRepository;
import com.pawmart.backend.order.OrderStatus;
import com.pawmart.backend.order.dto.OrderDetailResponse;
import com.pawmart.backend.order.dto.OrderItemResponse;
import com.pawmart.backend.order.dto.OrderPageResponse;
import com.pawmart.backend.order.dto.OrderSummaryResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminOrderService {

  private final OrderRepository orderRepository;

  public OrderPageResponse getOrders(String status, int page, int size) {
    PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    Page<Order> orderPage;
    if (StringUtils.hasText(status)) {
      OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
      orderPage = orderRepository.findByStatus(orderStatus, pageable);
    } else {
      orderPage = orderRepository.findAll(pageable);
    }

    List<OrderSummaryResponse> content =
        orderPage.getContent().stream().map(this::toSummaryResponse).toList();

    return new OrderPageResponse(
        content,
        orderPage.getNumber(),
        orderPage.getSize(),
        orderPage.getTotalElements(),
        orderPage.getTotalPages(),
        orderPage.isLast());
  }

  public OrderDetailResponse getOrder(Long id) {
    Order order =
        orderRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));
    return toDetailResponse(order);
  }

  @Transactional
  public void updateStatus(Long id, OrderStatus newStatus) {
    Order order =
        orderRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));
    order.updateStatus(newStatus);
  }

  // ---- 매핑 헬퍼 ----

  private String resolveStatusLabel(OrderStatus status) {
    return switch (status) {
      case PAID -> "결제완료";
      case PREPARING -> "상품준비중";
      case SHIPPING -> "배송중";
      case DELIVERED -> "배송완료";
      case CANCELLED -> "취소";
    };
  }

  private OrderSummaryResponse toSummaryResponse(Order order) {
    List<OrderItem> items = order.getOrderItems();
    String firstItemName = items.isEmpty() ? null : items.get(0).getName();
    String firstItemImageUrl = items.isEmpty() ? null : items.get(0).getImageUrl();

    return new OrderSummaryResponse(
        order.getId(),
        order.getOrderNumber(),
        order.getStatus().name(),
        resolveStatusLabel(order.getStatus()),
        order.getTotalPrice(),
        items.size(),
        firstItemName,
        firstItemImageUrl,
        order.getCreatedAt());
  }

  private OrderDetailResponse toDetailResponse(Order order) {
    List<OrderItem> items = order.getOrderItems();
    String firstItemName = items.isEmpty() ? null : items.get(0).getName();
    String firstItemImageUrl = items.isEmpty() ? null : items.get(0).getImageUrl();

    List<OrderItemResponse> itemResponses =
        items.stream()
            .map(
                item ->
                    new OrderItemResponse(
                        item.getProductId(),
                        item.getName(),
                        item.getPrice(),
                        item.getImageUrl(),
                        item.getQuantity(),
                        item.getSubtotal()))
            .toList();

    return new OrderDetailResponse(
        order.getId(),
        order.getOrderNumber(),
        order.getStatus().name(),
        resolveStatusLabel(order.getStatus()),
        order.getTotalPrice(),
        items.size(),
        firstItemName,
        firstItemImageUrl,
        order.getCreatedAt(),
        order.getReceiverName(),
        order.getReceiverPhone(),
        order.getPostalCode(),
        order.getRoadAddress(),
        order.getDetailAddress(),
        order.getDeliveryMemo(),
        order.getPaidAt(),
        itemResponses);
  }
}
