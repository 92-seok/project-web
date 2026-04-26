package com.pawmart.backend.cart;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawmart.backend.cart.dto.AddCartRequest;
import com.pawmart.backend.cart.dto.CartItemResponse;
import com.pawmart.backend.cart.dto.CartResponse;
import com.pawmart.backend.cart.dto.UpdateCartRequest;
import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.product.Product;
import com.pawmart.backend.product.ProductRepository;
import com.pawmart.backend.product.ProductStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

  private final CartItemRepository cartItemRepository;
  private final ProductRepository productRepository;

  public CartResponse getCart(Long memberId) {
    List<CartItem> cartItems = cartItemRepository.findByMemberId(memberId);
    if (cartItems.isEmpty()) {
      return new CartResponse(List.of(), 0, 0);
    }

    List<Long> productIds = cartItems.stream()
        .map(CartItem::getProductId)
        .toList();

    Map<Long, Product> productMap = productRepository.findAllById(productIds).stream()
        .collect(Collectors.toMap(Product::getId, Function.identity()));

    List<CartItemResponse> items = cartItems.stream()
        .filter(item -> productMap.containsKey(item.getProductId()))
        .map(item -> {
          Product product = productMap.get(item.getProductId());
          return new CartItemResponse(
              item.getId(),
              product.getId(),
              product.getName(),
              product.getPrice(),
              product.getOriginalPrice(),
              product.getImageUrl(),
              item.getQuantity(),
              product.getPrice() * item.getQuantity()
          );
        })
        .toList();

    int totalPrice = items.stream().mapToInt(CartItemResponse::subtotal).sum();
    int totalCount = items.stream().mapToInt(CartItemResponse::quantity).sum();

    return new CartResponse(items, totalPrice, totalCount);
  }

  @Transactional
  public void addItem(Long memberId, AddCartRequest request) {
    Product product = productRepository.findById(request.productId())
        .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));

    if (product.getStatus() != ProductStatus.ON_SALE) {
      throw new BusinessException(ErrorCode.PRODUCT_NOT_AVAILABLE);
    }

    cartItemRepository.findByMemberIdAndProductId(memberId, request.productId())
        .ifPresentOrElse(
            item -> item.increaseQuantity(request.quantity()),
            () -> cartItemRepository.save(
                CartItem.create(memberId, request.productId(), request.quantity()))
        );
  }

  @Transactional
  public void updateItem(Long memberId, Long itemId, UpdateCartRequest request) {
    CartItem item = cartItemRepository.findByIdAndMemberId(itemId, memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND));
    item.changeQuantity(request.quantity());
  }

  @Transactional
  public void removeItem(Long memberId, Long itemId) {
    cartItemRepository.deleteByIdAndMemberId(itemId, memberId);
  }

  @Transactional
  public void clearCart(Long memberId) {
    cartItemRepository.deleteByMemberId(memberId);
  }
}
