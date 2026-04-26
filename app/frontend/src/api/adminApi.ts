import { apiClient } from './client';
import type { IProductSummary, IProductPage } from './productApi';
import type { IOrderSummary, IOrderDetail } from './orderApi';

export interface IStatsResponse {
  totalMembers: number;
  totalProducts: number;
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
}

export interface IAdminMember {
  id: number;
  loginId: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export interface IAdminMemberPage {
  content: IAdminMember[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ICreateProductRequest {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badge?: string;
  category: string;
  petType: string;
  stock: number;
}

export interface IAdminOrderPage {
  content: IOrderSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export type { IProductSummary, IProductPage, IOrderSummary, IOrderDetail };

export const adminApi = {
  getStats: () =>
    apiClient.get<IStatsResponse>('/admin/stats').then((r) => r.data),

  getProducts: (page = 0, size = 20) =>
    apiClient
      .get<IProductPage>('/admin/products', { params: { page, size } })
      .then((r) => r.data),

  createProduct: (data: ICreateProductRequest) =>
    apiClient.post('/admin/products', data),

  updateProduct: (id: number, data: ICreateProductRequest) =>
    apiClient.put(`/admin/products/${id}`, data),

  deleteProduct: (id: number) =>
    apiClient.delete(`/admin/products/${id}`),

  getOrders: (page = 0, size = 20, status?: string) =>
    apiClient
      .get<IAdminOrderPage>('/admin/orders', {
        params: { page, size, ...(status ? { status } : {}) },
      })
      .then((r) => r.data),

  getOrder: (id: number) =>
    apiClient.get<IOrderDetail>(`/admin/orders/${id}`).then((r) => r.data),

  updateOrderStatus: (id: number, status: string) =>
    apiClient.patch(`/admin/orders/${id}/status`, { status }),

  getMembers: (page = 0, size = 20, keyword?: string) =>
    apiClient
      .get<IAdminMemberPage>('/admin/members', {
        params: { page, size, ...(keyword ? { keyword } : {}) },
      })
      .then((r) => r.data),

  getMember: (id: number) =>
    apiClient.get<IAdminMember>(`/admin/members/${id}`).then((r) => r.data),
};
