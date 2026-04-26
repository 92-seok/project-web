import { create } from 'zustand';
import { toast } from 'sonner';
import { cartApi, type ICartItem } from '@/api/cartApi';

export type { ICartItem };

interface ICartState {
  items: ICartItem[];
  totalPrice: number;
  totalCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<ICartState>()((set) => ({
  items: [],
  totalPrice: 0,
  totalCount: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const data = await cartApi.getCart();
      set({
        items: data.items,
        totalPrice: data.totalPrice,
        totalCount: data.items.reduce((sum, i) => sum + i.quantity, 0),
      });
    } catch {
      // 비로그인 등 에러 시 조용히 빈 상태 유지
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true });
    try {
      await cartApi.addItem(productId, quantity);
      const data = await cartApi.getCart();
      set({
        items: data.items,
        totalPrice: data.totalPrice,
        totalCount: data.items.reduce((sum, i) => sum + i.quantity, 0),
      });
    } catch {
      toast.error('장바구니 추가에 실패했습니다');
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      await cartApi.updateItem(itemId, quantity);
      const data = await cartApi.getCart();
      set({
        items: data.items,
        totalPrice: data.totalPrice,
        totalCount: data.items.reduce((sum, i) => sum + i.quantity, 0),
      });
    } catch {
      toast.error('수량 변경에 실패했습니다');
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      await cartApi.removeItem(itemId);
      const data = await cartApi.getCart();
      set({
        items: data.items,
        totalPrice: data.totalPrice,
        totalCount: data.items.reduce((sum, i) => sum + i.quantity, 0),
      });
    } catch {
      toast.error('상품 삭제에 실패했습니다');
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartApi.clearCart();
      set({ items: [], totalPrice: 0, totalCount: 0 });
    } catch {
      toast.error('장바구니 비우기에 실패했습니다');
    } finally {
      set({ isLoading: false });
    }
  },
}));
