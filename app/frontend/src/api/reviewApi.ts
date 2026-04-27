import { apiClient } from './client';

export interface IReviewItem {
  id: number;
  memberId: number;
  memberName: string;
  rating: number;
  content: string;
  imageUrls: string[] | null;
  createdAt: string;
}

export interface IReviewPage {
  content: IReviewItem[];
  averageRating: number;
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
}

export const reviewApi = {
  getReviews: (productId: number, page = 0, size = 10) =>
    apiClient
      .get<IReviewPage>(`/products/${productId}/reviews`, { params: { page, size } })
      .then((r) => r.data),

  createReview: (productId: number, rating: number, content: string, imageUrls: string[] = []) =>
    apiClient.post(`/products/${productId}/reviews`, { rating, content, imageUrls }),

  deleteReview: (productId: number, reviewId: number) =>
    apiClient.delete(`/products/${productId}/reviews/${reviewId}`),
};
