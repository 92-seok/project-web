package com.pawmart.backend.order;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.order.dto.CreateOrderRequest;
import com.pawmart.backend.order.dto.OrderDetailResponse;
import com.pawmart.backend.order.dto.OrderItemResponse;
import com.pawmart.backend.order.dto.OrderPageResponse;
import com.pawmart.backend.order.dto.OrderSummaryResponse;
import com.pawmart.backend.product.Product;
import com.pawmart.backend.product.ProductRepository;
import com.pawmart.backend.product.ProductStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

  private final OrderRepository orderRepository;
  private final ProductRepository productRepository;

  @Transactional
  public OrderDetailResponse createOrder(Long memberId, CreateOrderRequest request) {
    // 1. 데드락 회피 — productId 오름차순 정렬로 락 획득 순서 통일
    List<CreateOrderRequest.OrderItemRequest> sortedItems =
        request.items().stream()
            .sorted(java.util.Comparator.comparing(CreateOrderRequest.OrderItemRequest::productId))
            .toList();

    // 2. 비관적 락으로 상품 조회 + 즉시 재고 차감
    int totalPrice = 0;
    java.util.Map<Long, Product> productMap = new java.util.HashMap<>();

    for (CreateOrderRequest.OrderItemRequest item : sortedItems) {
      Product product =
          productRepository
              .findByIdForUpdate(item.productId())
              .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
      if (product.getStatus() != ProductStatus.ON_SALE) {
        throw new BusinessException(ErrorCode.PRODUCT_NOT_AVAILABLE);
      }
      product.decreaseStock(item.quantity()); // 재고 부족 시 OUT_OF_STOCK 예외
      totalPrice += product.getPrice() * item.quantity();
      productMap.put(product.getId(), product);
    }

    // 3. Order 생성 (데모상 즉시 PAID — 결제 목업이므로 의도된 동작)
    Order order =
        Order.builder()
            .orderNumber(Order.generateOrderNumber())
            .memberId(memberId)
            .totalPrice(totalPrice)
            .receiverName(request.receiverName())
            .receiverPhone(request.receiverPhone())
            .postalCode(request.postalCode())
            .roadAddress(request.roadAddress())
            .detailAddress(request.detailAddress())
            .deliveryMemo(request.deliveryMemo())
            .paidAt(LocalDateTime.now())
            .build();

    // 4. OrderItem 생성 — 사용자 표시 순서를 위해 원본 요청 순서 유지
    for (CreateOrderRequest.OrderItemRequest itemReq : request.items()) {
      Product product = productMap.get(itemReq.productId());
      OrderItem orderItem =
          OrderItem.builder()
              .order(order)
              .productId(product.getId())
              .name(product.getName())
              .price(product.getPrice())
              .imageUrl(product.getImageUrl())
              .quantity(itemReq.quantity())
              .build();
      order.getOrderItems().add(orderItem);
    }

    Order saved = orderRepository.save(order);
    return toDetailResponse(saved);
  }

  public OrderPageResponse getMyOrders(Long memberId, int page, int size) {
    Page<Order> orderPage =
        orderRepository.findByMemberIdOrderByCreatedAtDesc(memberId, PageRequest.of(page, size));

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

  public OrderDetailResponse getOrder(Long orderId, Long memberId) {
    Order order =
        orderRepository
            .findByIdAndMemberId(orderId, memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
    return toDetailResponse(order);
  }

  @Transactional
  public void cancelOrder(Long orderId, Long memberId) {
    Order order =
        orderRepository
            .findByIdAndMemberId(orderId, memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

    order.cancel(); // 취소 가능 여부 검증은 Order 도메인 내부

    // 재고 복구 — 데드락 회피 위해 productId 오름차순으로 락 획득
    List<OrderItem> sortedItems =
        order.getOrderItems().stream()
            .sorted(java.util.Comparator.comparing(OrderItem::getProductId))
            .toList();

    for (OrderItem item : sortedItems) {
      productRepository
          .findByIdForUpdate(item.getProductId())
          .ifPresent(p -> p.increaseStock(item.getQuantity()));
      // 상품이 삭제됐을 가능성 → ifPresent로 무시 (취소 자체는 진행)
    }
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
