export interface IProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  badge?: 'NEW' | 'SALE' | 'BEST';
  category: string;
}

export interface ICategory {
  id: string;
  label: string;
  emoji: string;
  href: string;
}

export type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface IFilterState {
  pet: string[];
  category: string[];
  badge: string[];
  priceMax: number;
  sort: SortOption;
}

export interface IReview {
  id: number;
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
}

export interface IProductDetail extends IProduct {
  description: string;
  features: string[];
  options?: { label: string; values: string[] }[];
  reviews: IReview[];
  stock: number;
}
