import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { wishlistApi } from '@/api/wishlistApi';
import { BenefitBadge, getBadgesForProduct } from '@/components/products/BenefitBadge';
import type { IProduct } from '@/types/product';

interface IProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: IProductCardProps) {
  const [isWished, setIsWished] = useState(false);
  const [isWishLoading, setIsWishLoading] = useState(false);
  const { addItem, isLoading } = useCartStore();

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    wishlistApi
      .getStatus(product.id)
      .then((res) => setIsWished(res.wished))
      .catch(() => {
        // 상태 조회 실패 시 기본값(false) 유지
      });
  }, [product.id, isLoggedIn]);

  const discountRate =
    product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  const benefits = getBadgesForProduct(product.id, product.category).slice(0, 2);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!useAuthStore.getState().isLoggedIn) {
      toast.error('로그인이 필요합니다');
      return;
    }

    await addItem(product.id, 1);
    toast.success('장바구니에 담았습니다');
  };

  const handleWishToggle = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!useAuthStore.getState().isLoggedIn) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (isWishLoading) return;

    setIsWishLoading(true);
    try {
      const res = await wishlistApi.toggle(product.id);
      setIsWished(res.wished);
      toast.success(res.wished ? '찜 목록에 추가했습니다' : '찜 목록에서 제거했습니다');
    } catch {
      toast.error('요청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsWishLoading(false);
    }
  };

  return (
    <div className='group cursor-pointer'>
      <Link to={`/products/${product.id}`}>
        {/* 이미지 */}
        <div className='relative overflow-hidden bg-secondary aspect-square mb-3 rounded-xl'>
          <img
            src={product.imageUrl}
            alt={product.name}
            loading='lazy'
            className='w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out motion-reduce:transform-none'
          />

          {/* 좌상단 뱃지: 할인 / NEW */}
          <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
            {discountRate !== null && (
              <span className='text-[10px] font-bold text-accent-foreground bg-accent px-2 py-0.5 rounded-full tracking-wide'>
                {discountRate}% OFF
              </span>
            )}
            {product.badge === 'NEW' && (
              <span className='text-[10px] font-bold text-primary-foreground bg-primary px-2 py-0.5 rounded-full tracking-wide'>
                NEW
              </span>
            )}
            {product.badge === 'BEST' && (
              <span className='text-[10px] font-bold text-primary-foreground bg-primary/90 px-2 py-0.5 rounded-full tracking-wide'>
                BEST
              </span>
            )}
          </div>

          {/* 찜 버튼 — 우상단 원형 */}
          <button
            onClick={handleWishToggle}
            disabled={isWishLoading}
            className='absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-50'
            aria-label={isWished ? '찜 해제' : '찜하기'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWished ? 'fill-rose-500 text-rose-500' : 'text-foreground/60'
              }`}
            />
          </button>
        </div>

        {/* 효능 배지 — 이미지 아래 */}
        {benefits.length > 0 && (
          <div className='flex flex-wrap gap-1 mb-2'>
            {benefits.map((b) => (
              <BenefitBadge key={b} type={b} />
            ))}
          </div>
        )}

        {/* 텍스트 정보 */}
        <div className='space-y-1.5 mb-3'>
          <p className='text-[13px] font-medium leading-snug line-clamp-2 text-foreground'>
            {product.name}
          </p>
          <div className='flex items-center gap-1.5'>
            <span className='text-[11px] text-amber-500'>★</span>
            <span className='text-[11px] text-foreground/80 font-semibold'>{product.rating}</span>
            <span className='text-[11px] text-muted-foreground'>
              ({product.reviewCount.toLocaleString('ko-KR')})
            </span>
          </div>
          <div className='flex items-baseline gap-2'>
            {product.originalPrice && (
              <span className='text-[11px] text-muted-foreground line-through'>
                {product.originalPrice.toLocaleString('ko-KR')}원
              </span>
            )}
            <span className='text-base font-bold font-editorial tracking-tight text-foreground'>
              {product.price.toLocaleString('ko-KR')}
              <span className='text-xs font-sans font-normal text-muted-foreground ml-0.5'>원</span>
            </span>
          </div>
        </div>

        {/* 장바구니 버튼 */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className='w-full rounded-full border border-border text-foreground/80 text-xs font-medium py-2.5 flex items-center justify-center gap-1.5 hover:bg-foreground hover:text-background hover:border-foreground transition-colors disabled:opacity-50'
        >
          <ShoppingCart className='w-3.5 h-3.5' />
          담기
        </button>
      </Link>
    </div>
  );
}
