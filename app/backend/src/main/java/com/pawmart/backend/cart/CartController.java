package com.pawmart.backend.cart;

import java.net.URI;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.cart.dto.AddCartRequest;
import com.pawmart.backend.cart.dto.CartResponse;
import com.pawmart.backend.cart.dto.UpdateCartRequest;
import com.pawmart.backend.config.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

  private final CartService cartService;

  @GetMapping
  public CartResponse getCart(@AuthenticationPrincipal JwtPrincipal principal) {
    return cartService.getCart(principal.memberId());
  }

  @PostMapping
  public ResponseEntity<Void> addItem(
      @AuthenticationPrincipal JwtPrincipal principal,
      @Valid @RequestBody AddCartRequest request) {
    cartService.addItem(principal.memberId(), request);
    return ResponseEntity.created(URI.create("/api/cart")).build();
  }

  @PatchMapping("/{itemId}")
  public ResponseEntity<Void> updateItem(
      @AuthenticationPrincipal JwtPrincipal principal,
      @PathVariable Long itemId,
      @Valid @RequestBody UpdateCartRequest request) {
    cartService.updateItem(principal.memberId(), itemId, request);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{itemId}")
  public ResponseEntity<Void> removeItem(
      @AuthenticationPrincipal JwtPrincipal principal,
      @PathVariable Long itemId) {
    cartService.removeItem(principal.memberId(), itemId);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping
  public ResponseEntity<Void> clearCart(@AuthenticationPrincipal JwtPrincipal principal) {
    cartService.clearCart(principal.memberId());
    return ResponseEntity.noContent().build();
  }
}
