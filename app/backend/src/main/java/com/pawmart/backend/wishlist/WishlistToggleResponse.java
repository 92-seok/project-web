package com.pawmart.backend.wishlist;

// wished=true: 찜 추가됨, wished=false: 찜 해제됨
public record WishlistToggleResponse(boolean wished) {}
