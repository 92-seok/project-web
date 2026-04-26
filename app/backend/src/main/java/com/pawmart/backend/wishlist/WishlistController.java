package com.pawmart.backend.wishlist;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.config.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

  private final WishlistService wishlistService;

  @GetMapping
  public WishlistResponse getWishlist(@AuthenticationPrincipal JwtPrincipal principal) {
    return wishlistService.getWishlist(principal.memberId());
  }

  @PostMapping("/{productId}")
  public WishlistToggleResponse toggle(
      @AuthenticationPrincipal JwtPrincipal principal,
      @PathVariable Long productId) {
    return wishlistService.toggle(principal.memberId(), productId);
  }

  @GetMapping("/{productId}/status")
  public WishlistToggleResponse status(
      @AuthenticationPrincipal JwtPrincipal principal,
      @PathVariable Long productId) {
    return new WishlistToggleResponse(wishlistService.isWished(principal.memberId(), productId));
  }
}
