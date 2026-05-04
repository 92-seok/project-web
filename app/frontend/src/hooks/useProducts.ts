import { useEffect, useRef, useState } from 'react';
import { productApi } from '@/api/productApi';
import type { IProductDetailResponse, IProductPage, IGetProductsParams } from '@/api/productApi';
import type { IProduct, IProductDetail } from '@/types/product';

// ── 매퍼 ─────────────────────────────────────────────────────────────────────

/**
 * 백엔드 IProductSummary → 프론트 IProduct
 * badge 필드: 백엔드는 string | null, 프론트는 'NEW'|'SALE'|'BEST'|undefined
 */
export function toIProduct(src: IProductDetailResponse | ReturnType<typeof Object.assign>): IProduct {
  const VALID_BADGES = ['NEW', 'SALE', 'BEST'] as const;
  type BadgeType = (typeof VALID_BADGES)[number];

  const badge: BadgeType | undefined =
    src.badge && (VALID_BADGES as readonly string[]).includes(src.badge)
      ? (src.badge as BadgeType)
      : undefined;

  return {
    id: src.id,
    name: src.name,
    price: src.price,
    originalPrice: src.originalPrice ?? undefined,
    imageUrl: src.imageUrl,
    rating: src.rating,
    reviewCount: src.reviewCount,
    badge,
    // 백엔드 category(음식·용품 분류)와 petType(dog·cat 등)을 합쳐 표시
    // ProductCard, RelatedProducts 등이 category 기준으로 필터링하므로 petType을 사용
    category: src.petType ?? src.category,
  };
}

/**
 * 백엔드 IProductDetailResponse → 프론트 IProductDetail
 * 백엔드에 없는 features·options·reviews는 기본값으로 채운다.
 */
export function toIProductDetail(src: IProductDetailResponse): IProductDetail {
  return {
    ...toIProduct(src),
    description: src.description,
    features: [],
    options: undefined,
    reviews: [],
    stock: src.stock,
  };
}

// ── 훅 ───────────────────────────────────────────────────────────────────────

export function useProducts(params: IGetProductsParams) {
  const [data, setData] = useState<IProductPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // params 객체가 매 렌더마다 새로 생성되므로 직렬화하여 의존성 비교
  const paramsKey = JSON.stringify(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableParams = useRef(params);
  stableParams.current = params;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    productApi
      .getProducts(stableParams.current)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error('[useProducts] API 호출 실패:', err);
        setError('상품 목록을 불러올 수 없습니다');
        setData(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // paramsKey 변경 시 재요청
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { data, isLoading, error };
}

export function useProduct(id: number) {
  const [data, setData] = useState<IProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setIsNotFound(false);

    productApi
      .getProduct(id)
      .then((res) => {
        if (!cancelled) setData(toIProductDetail(res));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = (err as { status?: number })?.status;
        if (status === 404) {
          setIsNotFound(true);
          return;
        }
        console.error('[useProduct] API 호출 실패. id:', id, err);
        setError('상품 정보를 불러올 수 없습니다');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, isLoading, isNotFound, error };
}
