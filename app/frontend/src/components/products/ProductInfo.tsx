import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Truck, RefreshCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { BenefitBadge, getBadgesForProduct } from '@/components/products/BenefitBadge';
import type { IProductDetail } from '@/types/product';

interface IProductInfoProps {
  product: IProductDetail;
}

export function ProductInfo({ product }: IProductInfoProps) {
  const navigate = useNavigate();
  const { addItem, isLoading } = useCartStore();

  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isWished, setIsWished] = useState(false);

  const checkLogin = (): boolean => {
    if (!useAuthStore.getState().isLoggedIn) {
      toast.error('로그인이 필요합니다');
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!checkLogin()) return;
    await addItem(product.id, qty);
    toast.success('장바구니에 담았습니다');
  };

  const handleBuyNow = async () => {
    if (!checkLogin()) return;
    await addItem(product.id, qty);
    navigate('/cart');
  };

  const filledStars = Math.round(product.rating);
  const benefits = getBadgesForProduct(product.id, product.category);
  const discountRate = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className='space-y-6'>
      {/* 카테고리 + 배지 */}
      <div className='flex items-center gap-2'>
        <span className='text-[11px] tracking-[0.25em] text-accent uppercase font-semibold'>
          {product.category}
        </span>
        {product.badge && (
          <span className='text-[10px] tracking-wider font-bold text-primary-foreground bg-primary px-2.5 py-0.5 rounded-full'>
            {product.badge}
          </span>
        )}
      </div>

      {/* 상품명 */}
      <h1 className='font-editorial text-2xl md:text-[1.75rem] lg:text-[2rem] font-bold tracking-tight leading-snug text-foreground'>
        {product.name}
      </h1>

      {/* 효능 배지 */}
      {benefits.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {benefits.map((b) => (
            <BenefitBadge key={b} type={b} size='md' />
          ))}
        </div>
      )}

      {/* 별점 */}
      <div className='flex items-center gap-2'>
        <div className='text-amber-500 text-sm'>
          {'★'.repeat(filledStars)}
          <span className='text-muted-foreground/40'>{'★'.repeat(5 - filledStars)}</span>
        </div>
        <span className='text-sm font-semibold text-foreground'>{product.rating}</span>
        <span className='text-sm text-muted-foreground'>
          ({product.reviewCount.toLocaleString('ko-KR')}개 리뷰)
        </span>
      </div>

      <Separator />

      {/* 가격 */}
      <div className='space-y-1.5'>
        {product.originalPrice && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground line-through'>
              {product.originalPrice.toLocaleString('ko-KR')}원
            </span>
            <span className='text-sm font-bold text-accent'>{discountRate}% 할인</span>
          </div>
        )}
        <p className='font-editorial text-3xl md:text-[2rem] lg:text-[2.5rem] font-bold tracking-tight text-foreground leading-tight'>
          {product.price.toLocaleString('ko-KR')}
          <span className='text-base lg:text-lg font-sans font-medium text-muted-foreground ml-1'>원</span>
        </p>
      </div>

      {/* 옵션 선택 */}
      {product.options?.map((opt) => (
        <div key={opt.label}>
          <p className='text-xs font-semibold text-foreground/80 mb-2.5'>{opt.label}</p>
          <div className='flex flex-wrap gap-2'>
            {opt.values.map((val) => (
              <button
                key={val}
                onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.label]: val }))}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedOptions[opt.label] === val
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'border-border text-foreground/80 hover:border-accent hover:text-accent'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* 수량 */}
      <div>
        <p className='text-xs font-semibold text-foreground/80 mb-2.5'>수량</p>
        <div className='flex items-center rounded-full border border-border w-fit overflow-hidden'>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className='w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors text-lg'
            aria-label='수량 감소'
          >
            −
          </button>
          <span className='w-12 text-center text-sm font-semibold'>{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className='w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors text-lg'
            aria-label='수량 증가'
          >
            +
          </button>
        </div>
        <p className='text-xs text-muted-foreground mt-2'>
          재고 <span className='font-semibold text-foreground'>{product.stock}</span>개 남음
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className='flex gap-3'>
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className='flex-1 py-3.5 rounded-full border border-border text-foreground text-sm font-semibold hover:border-accent hover:text-accent transition-colors disabled:opacity-50'
        >
          장바구니 담기
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isLoading}
          className='flex-[1.4] py-3.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 transition-opacity disabled:opacity-50'
        >
          바로 구매하기
        </button>
        <button
          onClick={() => setIsWished((p) => !p)}
          aria-label='찜하기'
          className='w-12 rounded-full border border-border flex items-center justify-center hover:border-accent transition-colors'
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWished ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
            }`}
          />
        </button>
      </div>

      {/* 배송 정보 — 카드형 */}
      <div className='rounded-xl bg-secondary/60 border border-border p-4 space-y-2.5 text-sm'>
        <div className='flex gap-3 items-start'>
          <Truck className='w-4 h-4 text-accent shrink-0 mt-0.5' />
          <div>
            <span className='font-semibold text-foreground'>새벽배송 무료</span>
            <span className='text-muted-foreground'> · 5만원 이상 (오후 3시 전 주문)</span>
          </div>
        </div>
        <div className='flex gap-3 items-start'>
          <RefreshCcw className='w-4 h-4 text-accent shrink-0 mt-0.5' />
          <div>
            <span className='font-semibold text-foreground'>정기배송 -10%</span>
            <span className='text-muted-foreground'> · 언제든 해지·변경 자유</span>
          </div>
        </div>
        <div className='flex gap-3 items-start'>
          <ShieldCheck className='w-4 h-4 text-accent shrink-0 mt-0.5' />
          <div>
            <span className='font-semibold text-foreground'>7일 무료 반품</span>
            <span className='text-muted-foreground'> · 맞지 않으면 망설이지 마세요</span>
          </div>
        </div>
      </div>
    </div>
  );
}
