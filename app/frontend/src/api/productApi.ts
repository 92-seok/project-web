import { apiClient } from './client';

// ── 백엔드 응답 타입 ────────────────────────────────────────────────────────
export interface IProductSummary {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  badge: string | null;
  category: string;
  petType: string;
  rating: number;
  reviewCount: number;
}

export interface IProductDetailResponse extends IProductSummary {
  description: string;
  stock: number;
  status: string;
}

export interface IProductPage {
  content: IProductSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface IGetProductsParams {
  petType?: string;
  category?: string;
  keyword?: string;
  sort?: string;
  page?: number;
  size?: number;
}

// ── API 함수 ────────────────────────────────────────────────────────────────
export const productApi = {
  getProducts: (params: IGetProductsParams) =>
    apiClient
      .get<IProductPage>('/products', { params })
      .then((r) => r.data),

  getProduct: (id: number) =>
    apiClient
      .get<IProductDetailResponse>(`/products/${id}`)
      .then((r) => r.data),
};
