import { Link, useSearchParams } from 'react-router-dom';
import { Check, Truck } from 'lucide-react';

function getExpectedDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

export function OrderCompletePage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') ?? '';

  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center'>
      {/* 성공 아이콘 */}
      <div className='relative mb-8'>
        <div className='absolute inset-0 rounded-full bg-accent/15 blur-2xl scale-150' aria-hidden />
        <div className='relative w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-lg'>
          <Check className='w-10 h-10 text-accent-foreground' strokeWidth={2.5} />
        </div>
      </div>

      <p className='text-[11px] tracking-[0.3em] text-accent uppercase font-semibold mb-3'>
        ORDER CONFIRMED
      </p>
      <h1 className='font-editorial text-3xl md:text-[2.25rem] font-bold tracking-tight mb-3'>
        주문이 완료되었어요
      </h1>
      <p className='text-sm text-muted-foreground mb-1'>
        주문번호 ·{' '}
        <span className='font-semibold text-foreground'>{orderNumber}</span>
      </p>
      <p className='text-sm text-muted-foreground mb-12'>확인 메일을 보내드렸어요 📧</p>

      {/* 배송 정보 카드 */}
      <div className='rounded-2xl bg-secondary/60 border border-border p-6 w-full max-w-sm text-left mb-8'>
        <div className='flex items-center gap-2 mb-4'>
          <Truck className='w-4 h-4 text-accent' />
          <p className='text-xs font-semibold tracking-wider uppercase text-accent'>
            배송 안내
          </p>
        </div>
        <div className='space-y-2.5 text-sm'>
          <div className='flex justify-between items-center'>
            <span className='text-muted-foreground'>출고 예정</span>
            <span className='font-semibold text-foreground'>오늘 오후</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-muted-foreground'>도착 예정</span>
            <span className='font-semibold text-accent'>
              {getExpectedDeliveryDate()} 새벽
            </span>
          </div>
          <div className='h-px bg-border my-3' />
          <p className='text-xs text-muted-foreground leading-relaxed'>
            🌿 새벽배송 차량으로 안전하게 배송됩니다
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className='flex flex-col sm:flex-row gap-3 w-full max-w-sm'>
        <Link
          to='/mypage/orders'
          className='flex-1 py-3 rounded-full border border-border text-sm font-semibold text-center hover:border-accent hover:text-accent transition-colors'
        >
          주문 내역 보기
        </Link>
        <Link
          to='/'
          className='flex-1 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold text-center hover:opacity-95 transition-opacity'
        >
          계속 쇼핑하기 →
        </Link>
      </div>
    </div>
  );
}
