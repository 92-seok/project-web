import { apiClient } from './client';

export interface IOrderItem {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  subtotal: number;
}

export interface IOrderDetail {
  id: number;
  orderNumber: string;
  status: string;
  statusLabel: string;
  totalPrice: number;
  itemCount: number;
  firstItemName: string;
  firstItemImageUrl: string;
  receiverName: string;
  receiverPhone: string;
  postalCode: string;
  roadAddress: string;
  detailAddress: string | null;
  deliveryMemo: string | null;
  items: IOrderItem[];
  createdAt: string;
}

export interface IOrderSummary {
  id: number;
  orderNumber: string;
  status: string;
  statusLabel: string;
  totalPrice: number;
  itemCount: number;
  firstItemName: string;
  firstItemImageUrl: string;
  createdAt: string;
}

export interface IOrderPage {
  content: IOrderSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ICreateOrderRequest {
  items: { productId: number; quantity: number }[];
  receiverName: string;
  receiverPhone: string;
  postalCode: string;
  roadAddress: string;
  detailAddress?: string;
  deliveryMemo?: string;
}

export const orderApi = {
  createOrder: (data: ICreateOrderRequest) =>
    apiClient.post<IOrderDetail>('/orders', data).then((r) => r.data),
  getOrders: (page = 0, size = 10) =>
    apiClient.get<IOrderPage>('/orders', { params: { page, size } }).then((r) => r.data),
  getOrder: (id: number) =>
    apiClient.get<IOrderDetail>(`/orders/${id}`).then((r) => r.data),
  cancelOrder: (id: number) =>
    apiClient.delete(`/orders/${id}`),
};
