import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi } from '@/api/paymentApi';
import { useCartStore } from '@/store/cartStore';

interface IConfirmError {
  code?: string;
  message?: string;
}

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const [error, setError] = useState<IConfirmError | null>(null);

  // StrictMode dev 환경에서 useEffect가 2번 실행되어 confirm이 중복 호출되는 것을 방지.
  // confirm은 멱등이 아니므로 (토스가 ALREADY_PROCESSING_REQUEST 로 거부) ref 가드 필수.
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;

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
      .catch((err: IConfirmError) => {
        console.error('[PaymentSuccess] 결제 승인 실패', err);
        setError(err ?? { message: '알 수 없는 오류' });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center'>
        <p className='text-lg font-semibold'>결제 승인에 실패했습니다</p>
        <div className='max-w-md text-xs text-muted-foreground space-y-1'>
          {error.code && <p>코드: <span className='font-mono'>{error.code}</span></p>}
          {error.message && <p>{error.message}</p>}
        </div>
        <button
          onClick={() => navigate('/cart')}
          className='px-6 py-2 bg-primary text-primary-foreground text-sm rounded-full mt-2'
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
