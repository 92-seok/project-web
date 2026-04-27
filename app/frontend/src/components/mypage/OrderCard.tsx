import { Link } from 'react-router-dom';
import type { IOrderSummary } from '@/api/orderApi';

interface IOrderCardProps {
  order: IOrderSummary;
  onCancel?: (id: number) => void;
}

const STATUS_STYLE: Record<string, string> = {
  PAID: 'bg-amber-100 text-amber-800',
  PREPARING: 'bg-sky-100 text-sky-800',
  SHIPPING: 'bg-accent text-accent-foreground',
  DELIVERED: 'bg-[var(--badge-care)]/20 text-[var(--badge-care)]',
  CANCELLED: 'bg-secondary text-muted-foreground',
};

export function OrderCard({ order, onCancel }: IOrderCardProps) {
  const statusStyle = STATUS_STYLE[order.status] ?? 'bg-secondary text-muted-foreground';

  const handleCancel = () => {
    if (window.confirm('주문을 취소하시겠습니까?')) {
      onCancel?.(order.id);
    }
  };

  return (
    <div className='rounded-xl border border-border bg-card p-5 space-y-4 hover:border-accent/40 transition-colors'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-xs text-muted-foreground'>
            {new Date(order.createdAt).toLocaleDateString('ko-KR')}
          </p>
          <p className='text-sm font-semibold mt-0.5 text-foreground'>{order.orderNumber}</p>
        </div>
        <span
          className={`text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full ${statusStyle}`}
        >
          {order.statusLabel}
        </span>
      </div>

      <div className='h-px bg-border/60' />

      <div className='flex items-center gap-3'>
        <div className='w-14 h-14 rounded-lg bg-secondary shrink-0 overflow-hidden'>
          <img
            src={order.firstItemImageUrl}
            alt={order.firstItemName}
            className='w-full h-full object-cover'
            width={56}
            height={56}
          />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium line-clamp-1 text-foreground'>
            {order.firstItemName}
          </p>
          {order.itemCount > 1 && (
            <p className='text-xs text-muted-foreground mt-0.5'>
              외 {order.itemCount - 1}개 상품
            </p>
          )}
        </div>
      </div>

      <div className='h-px bg-border/60' />

      <div className='flex items-center justify-between'>
        <div>
          <span className='text-xs text-muted-foreground'>총 결제금액 </span>
          <span className='font-editorial text-base font-bold text-foreground'>
            {order.totalPrice.toLocaleString('ko-KR')}원
          </span>
        </div>
        <div className='flex gap-2'>
          {order.status === 'DELIVERED' && (
            <button className='px-3 py-1.5 rounded-full text-xs font-semibold border border-border hover:border-accent hover:text-accent transition-colors'>
              리뷰 작성
            </button>
          )}
          {(order.status === 'PAID' || order.status === 'PREPARING') && onCancel && (
            <button
              onClick={handleCancel}
              className='px-3 py-1.5 rounded-full text-xs font-semibold border border-border hover:border-destructive hover:text-destructive transition-colors'
            >
              주문 취소
            </button>
          )}
          <Link
            to={`/mypage/orders/${order.id}`}
            className='px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity'
          >
            상세 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
