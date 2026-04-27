package com.pawmart.backend.wishlist;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.product.Product;
import com.pawmart.backend.product.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WishlistService {

  private final WishlistRepository wishlistRepository;
  private final ProductRepository productRepository;

  public WishlistResponse getWishlist(Long memberId) {
    List<Wishlist> wishlists = wishlistRepository.findByMemberId(memberId);
    List<Long> productIds = wishlists.stream().map(Wishlist::getProductId).toList();
    List<Product> products = productRepository.findAllById(productIds);
    Map<Long, Product> productMap =
        products.stream().collect(Collectors.toMap(Product::getId, p -> p));
    List<WishlistItemResponse> items =
        wishlists.stream()
            .filter(w -> productMap.containsKey(w.getProductId()))
            .map(w -> WishlistItemResponse.from(productMap.get(w.getProductId())))
            .toList();
    return new WishlistResponse(items, items.size());
  }

  @Transactional
  public WishlistToggleResponse toggle(Long memberId, Long productId) {
    if (!productRepository.existsById(productId)) {
      throw new BusinessException(ErrorCode.NOT_FOUND);
    }
    Optional<Wishlist> existing =
        wishlistRepository.findByMemberIdAndProductId(memberId, productId);
    if (existing.isPresent()) {
      wishlistRepository.deleteByMemberIdAndProductId(memberId, productId);
      return new WishlistToggleResponse(false);
    } else {
      wishlistRepository.save(Wishlist.of(memberId, productId));
      return new WishlistToggleResponse(true);
    }
  }

  public boolean isWished(Long memberId, Long productId) {
    return wishlistRepository.existsByMemberIdAndProductId(memberId, productId);
  }
}
