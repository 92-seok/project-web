package com.pawmart.backend.wishlist;

import java.util.List;

public record WishlistResponse(List<WishlistItemResponse> items, int totalCount) {}
