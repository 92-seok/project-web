import { apiClient } from './client';

export interface IWishlistItem {
  productId: number;
  name: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  badge: string | null;
  rating: number;
  reviewCount: number;
}

export interface IWishlistResponse {
  items: IWishlistItem[];
  totalCount: number;
}

export interface IWishlistToggle {
  wished: boolean;
}

export const wishlistApi = {
  getWishlist: () =>
    apiClient.get<IWishlistResponse>('/wishlist').then((r) => r.data),

  toggle: (productId: number) =>
    apiClient.post<IWishlistToggle>(`/wishlist/${productId}`).then((r) => r.data),

  getStatus: (productId: number) =>
    apiClient.get<IWishlistToggle>(`/wishlist/${productId}/status`).then((r) => r.data),
};
