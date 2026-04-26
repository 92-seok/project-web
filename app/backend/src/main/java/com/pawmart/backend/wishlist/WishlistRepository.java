package com.pawmart.backend.wishlist;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

  List<Wishlist> findByMemberId(Long memberId);

  Optional<Wishlist> findByMemberIdAndProductId(Long memberId, Long productId);

  boolean existsByMemberIdAndProductId(Long memberId, Long productId);

  void deleteByMemberIdAndProductId(Long memberId, Long productId);
}
