import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi } from '@/api/paymentApi';
import { useCartStore } from '@/store/cartStore';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey') ?? '';
    const orderId = searchParams.get('orderId') ?? '';
    const amount = Number(searchParams.get('amount') ?? '0');

    if (!paymentKey || !orderId || !amount) {
      navigate('/payment/fail?message=잘못된 접근입니다', { replace: true });
      return;
    }

    paymentApi
      .confirm({ paymentKey, orderId, amount })
      .then(async () => {
        await clearCart();
        navigate(`/orders/complete?orderNumber=${orderId}`, { replace: true });
      })
      .catch(() => {
        setIsError(true);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isError) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center gap-4'>
        <p className='text-lg font-semibold'>결제 승인에 실패했습니다</p>
        <button
          onClick={() => navigate('/cart')}
          className='px-6 py-2 bg-primary text-primary-foreground text-sm'
        >
          장바구니로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-3'>
      <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin' />
      <p className='text-sm text-muted-foreground'>결제를 처리하고 있습니다...</p>
    </div>
  );
}
