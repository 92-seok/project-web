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
    // 1. 각 상품 조회 및 ON_SALE 확인
    List<Product> products = request.items().stream()
        .map(item -> {
          Product product = productRepository.findById(item.productId())
              .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
          if (product.getStatus() != ProductStatus.ON_SALE) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_AVAILABLE);
          }
          return product;
        })
        .toList();

    // 2. 총금액 계산
    int totalPrice = 0;
    for (int i = 0; i < request.items().size(); i++) {
      totalPrice += products.get(i).getPrice() * request.items().get(i).quantity();
    }

    // 3. Order 생성
    Order order = Order.builder()
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

    // 4. OrderItem 생성
    for (int i = 0; i < request.items().size(); i++) {
      Product product = products.get(i);
      CreateOrderRequest.OrderItemRequest itemReq = request.items().get(i);
      OrderItem orderItem = OrderItem.builder()
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
    Page<Order> orderPage = orderRepository.findByMemberIdOrderByCreatedAtDesc(
        memberId, PageRequest.of(page, size));

    List<OrderSummaryResponse> content = orderPage.getContent().stream()
        .map(this::toSummaryResponse)
        .toList();

    return new OrderPageResponse(
        content,
        orderPage.getNumber(),
        orderPage.getSize(),
        orderPage.getTotalElements(),
        orderPage.getTotalPages(),
        orderPage.isLast()
    );
  }

  public OrderDetailResponse getOrder(Long orderId, Long memberId) {
    Order order = orderRepository.findByIdAndMemberId(orderId, memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
    return toDetailResponse(order);
  }

  @Transactional
  public void cancelOrder(Long orderId, Long memberId) {
    Order order = orderRepository.findByIdAndMemberId(orderId, memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
    order.cancel();
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
        order.getCreatedAt()
    );
  }

  private OrderDetailResponse toDetailResponse(Order order) {
    List<OrderItem> items = order.getOrderItems();
    String firstItemName = items.isEmpty() ? null : items.get(0).getName();
    String firstItemImageUrl = items.isEmpty() ? null : items.get(0).getImageUrl();

    List<OrderItemResponse> itemResponses = items.stream()
        .map(item -> new OrderItemResponse(
            item.getProductId(),
            item.getName(),
            item.getPrice(),
            item.getImageUrl(),
            item.getQuantity(),
            item.getSubtotal()
        ))
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
        itemResponses
    );
  }
}
