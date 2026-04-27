import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { CartItem } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/cart/OrderSummary';

function CartSkeleton() {
  return (
    <div className='max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-10 md:grid md:grid-cols-[minmax(0,1fr)_360px] lg:grid-cols-[minmax(0,1fr)_400px] md:gap-12 lg:gap-16 md:items-start'>
      <div className='space-y-0'>
        {[1, 2, 3].map((n) => (
          <div key={n} className='flex items-start gap-4 py-6 border-b'>
            <Skeleton className='w-20 h-20 shrink-0' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/4' />
            </div>
            <div className='flex flex-col items-end gap-3'>
              <Skeleton className='h-8 w-24' />
              <Skeleton className='h-4 w-16' />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className='h-64 w-full' />
    </div>
  );
}

export function CartPage() {
  const { items, isLoading, fetchCart, clearCart } = useCartStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn, fetchCart]);

  if (isLoading && items.length === 0) {
    return (
      <div className='min-h-screen'>
        <div className='border-b border-border bg-secondary/30'>
          <div className='max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8'>
            <p className='text-[11px] tracking-[0.3em] text-accent uppercase font-semibold mb-2'>
              SHOPPING CART
            </p>
            <h1 className='font-editorial text-3xl md:text-[2.25rem] lg:text-[2.5rem] font-bold tracking-tight'>
              장바구니
            </h1>
          </div>
        </div>
        <CartSkeleton />
      </div>
    );
  }

  if (!isLoggedIn || items.length === 0) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4'>
        <div className='w-20 h-20 rounded-full bg-secondary flex items-center justify-center'>
          <ShoppingCart className='w-9 h-9 text-muted-foreground' strokeWidth={1.4} />
        </div>
        <div className='text-center'>
          <p className='font-editorial text-xl font-bold mb-1.5'>장바구니가 비어 있어요</p>
          <p className='text-sm text-muted-foreground'>우리 아이를 위한 상품을 담아보세요</p>
        </div>
        <Link
          to='/products'
          className='inline-flex items-center gap-2 px-7 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 hover:-translate-y-0.5 transition-all motion-reduce:transform-none'
        >
          상품 둘러보기 <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  const mobileTotal = items.reduce((s, i) => s + i.subtotal, 0);
  const mobileShipping = mobileTotal >= 50000 ? 0 : 3000;

  return (
    <div className='min-h-screen'>
      <div className='border-b border-border bg-secondary/30'>
        <div className='max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8'>
          <p className='text-[11px] tracking-[0.3em] text-accent uppercase font-semibold mb-2'>
            SHOPPING CART
          </p>
          <div className='flex items-end justify-between'>
            <h1 className='font-editorial text-3xl md:text-[2.25rem] lg:text-[2.5rem] font-bold tracking-tight'>
              장바구니
            </h1>
            <button
              onClick={() => clearCart()}
              disabled={isLoading}
              className='text-xs text-muted-foreground hover:text-accent underline underline-offset-2 disabled:opacity-50 transition-colors'
            >
              전체 삭제
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-10 md:grid md:grid-cols-[minmax(0,1fr)_360px] lg:grid-cols-[minmax(0,1fr)_400px] md:gap-12 lg:gap-16 md:items-start'>
        <div>
          {items.map((item) => (
            <CartItem key={item.itemId} item={item} />
          ))}
        </div>

        <div>
          <OrderSummary items={items} onCheckout={() => navigate('/checkout')} />
        </div>
      </div>

      <div className='md:hidden fixed bottom-16 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border p-3'>
        <button
          onClick={() => navigate('/checkout')}
          className='w-full py-3.5 rounded-full bg-accent text-accent-foreground text-sm font-bold hover:opacity-95 transition-opacity'
        >
          결제하기 · {(mobileTotal + mobileShipping).toLocaleString('ko-KR')}원
        </button>
      </div>
    </div>
  );
}
