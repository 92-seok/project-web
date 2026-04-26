import { apiClient } from './client';

export interface ICartItem {
  itemId: number;
  productId: number;
  name: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  quantity: number;
  subtotal: number;
}

export interface ICartResponse {
  items: ICartItem[];
  totalPrice: number;
  totalCount: number;
}

export const cartApi = {
  getCart: () => apiClient.get<ICartResponse>('/cart').then((r) => r.data),
  addItem: (productId: number, quantity: number) =>
    apiClient.post('/cart', { productId, quantity }),
  updateItem: (itemId: number, quantity: number) =>
    apiClient.patch(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId: number) => apiClient.delete(`/cart/${itemId}`),
  clearCart: () => apiClient.delete('/cart'),
};
