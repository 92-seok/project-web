import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { useCartStore, type ICartItem } from '@/store/cartStore';

interface ICartItemProps {
  item: ICartItem;
}

export function CartItem({ item }: ICartItemProps) {
  const { updateItem, removeItem, isLoading } = useCartStore();

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      removeItem(item.itemId);
    } else {
      updateItem(item.itemId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateItem(item.itemId, item.quantity + 1);
  };

  const discountRate = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : null;

  return (
    <div className='group relative flex gap-4 md:gap-5 p-4 md:p-5 rounded-2xl border border-border bg-card hover:border-accent/40 hover:shadow-sm transition-all mb-3'>
      {/* 우상단 삭제 버튼 — 카드 padding(p-4 md:p-5) 과 정확히 같은 right 값으로 소계와 수직 정렬 */}
      <button
        onClick={() => removeItem(item.itemId)}
        disabled={isLoading}
        aria-label='상품 삭제'
        className='absolute top-4 right-4 md:top-5 md:right-5 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50'
      >
        <X className='w-4 h-4' />
      </button>

      {/* 상품 이미지 */}
      <Link
        to={`/products/${item.productId}`}
        className='shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-secondary'
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transform-none'
          width={112}
          height={112}
        />
      </Link>

      {/* 우측 정보 + 액션 — pr 제거해 소계 우측 끝이 카드 padding 선과 일치 */}
      <div className='flex-1 min-w-0 flex flex-col justify-between'>
        {/* 상단: 상품명 + 가격 */}
        <div>
          {/* 상품명 — X 버튼과 겹치지 않게 우측 padding 만 부분적으로 */}
          <Link
            to={`/products/${item.productId}`}
            className='block text-sm md:text-base font-semibold leading-snug hover:text-accent transition-colors line-clamp-2 mb-1.5 pr-8'
          >
            {item.name}
          </Link>

          {/* 가격 영역 */}
          <div className='flex items-center gap-2 flex-wrap'>
            {discountRate !== null && (
              <span className='text-xs font-bold text-accent'>{discountRate}%</span>
            )}
            <span className='text-sm font-bold text-foreground'>
              {item.price.toLocaleString('ko-KR')}원
            </span>
            {item.originalPrice && (
              <span className='text-xs text-muted-foreground line-through'>
                {item.originalPrice.toLocaleString('ko-KR')}원
              </span>
            )}
          </div>
        </div>

        {/* 하단: 수량 컨트롤 + 소계 */}
        <div className='flex items-end justify-between mt-3 gap-3'>
          <div className='flex items-center rounded-full border border-border overflow-hidden bg-background'>
            <button
              onClick={handleDecrease}
              disabled={isLoading}
              className='w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-secondary disabled:opacity-50 transition-colors'
              aria-label='수량 감소'
            >
              <Minus className='w-3.5 h-3.5' />
            </button>
            <span className='w-9 md:w-10 text-center text-sm font-semibold'>
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={isLoading}
              className='w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-secondary disabled:opacity-50 transition-colors'
              aria-label='수량 증가'
            >
              <Plus className='w-3.5 h-3.5' />
            </button>
          </div>

          <div className='text-right'>
            <p className='text-[10px] text-muted-foreground tracking-wider uppercase mb-0.5'>
              소계
            </p>
            <p className='font-editorial text-base md:text-lg font-bold text-foreground leading-none'>
              {item.subtotal.toLocaleString('ko-KR')}
              <span className='text-xs font-sans font-medium ml-0.5'>원</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
