import { useNavigate, useSearchParams } from 'react-router-dom';

export function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = searchParams.get('message') ?? '결제가 취소되었습니다';

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-6'>
      <div className='text-center space-y-2'>
        <p className='text-xl font-bold'>결제 실패</p>
        <p className='text-sm text-muted-foreground'>{message}</p>
      </div>
      <div className='flex gap-3'>
        <button
          onClick={() => navigate(-1)}
          className='px-6 py-2 border border-primary text-primary text-sm'
        >
          다시 시도
        </button>
        <button
          onClick={() => navigate('/')}
          className='px-6 py-2 bg-primary text-primary-foreground text-sm'
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
