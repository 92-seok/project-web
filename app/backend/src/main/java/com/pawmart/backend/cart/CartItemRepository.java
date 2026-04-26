package com.pawmart.backend.cart;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

  List<CartItem> findByMemberId(Long memberId);

  Optional<CartItem> findByMemberIdAndProductId(Long memberId, Long productId);

  Optional<CartItem> findByIdAndMemberId(Long id, Long memberId);

  void deleteByMemberId(Long memberId);

  void deleteByIdAndMemberId(Long id, Long memberId);
}
