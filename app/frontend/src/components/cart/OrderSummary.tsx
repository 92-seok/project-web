import type { ICartItem } from '@/store/cartStore';

interface IOrderSummaryProps {
  items: ICartItem[];
  onCheckout: () => void;
  isCheckout?: boolean;
}

export function OrderSummary({ items, onCheckout, isCheckout = false }: IOrderSummaryProps) {
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const shipping = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, 50000 - subtotal);

  return (
    <div className='rounded-2xl bg-secondary/60 border border-border p-6 space-y-5 sticky top-24'>
      <div>
        <p className='text-[10px] tracking-[0.3em] font-semibold uppercase text-accent mb-1'>
          ORDER SUMMARY
        </p>
        <h3 className='font-editorial text-lg font-bold'>결제 금액</h3>
      </div>

      <div className='space-y-2.5 text-sm'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>상품 합계</span>
          <span className='text-foreground font-medium'>
            {subtotal.toLocaleString('ko-KR')}원
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>배송비</span>
          <span>
            {shipping === 0 ? (
              <span className='text-[var(--badge-care)] font-semibold'>무료</span>
            ) : (
              <span className='text-foreground font-medium'>
                {shipping.toLocaleString('ko-KR')}원
              </span>
            )}
          </span>
        </div>

        {/* 무료배송 진행 바 */}
        {shipping > 0 && (
          <div className='pt-1.5'>
            <div className='h-1.5 rounded-full bg-background overflow-hidden'>
              <div
                className='h-full rounded-full bg-accent transition-all'
                style={{ width: `${Math.min(100, (subtotal / 50000) * 100)}%` }}
              />
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              <span className='font-semibold text-accent'>
                {remainingForFreeShipping.toLocaleString('ko-KR')}원
              </span>{' '}
              더 담으면 무료배송! 🌿
            </p>
          </div>
        )}
      </div>

      <div className='h-px bg-border' />

      <div className='flex justify-between items-baseline'>
        <span className='text-sm font-semibold'>총 결제금액</span>
        <span className='font-editorial text-2xl font-bold text-accent'>
          {total.toLocaleString('ko-KR')}
          <span className='text-sm font-sans font-medium text-foreground ml-0.5'>원</span>
        </span>
      </div>

      {!isCheckout && (
        <button
          onClick={onCheckout}
          className='w-full py-3.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 hover:shadow-md transition-all'
        >
          결제하러 가기 →
        </button>
      )}

      <p className='text-[11px] text-muted-foreground text-center leading-relaxed'>
        🚚 5만원 이상 무료배송 · 7일 무료 반품 가능
      </p>
    </div>
  );
}
