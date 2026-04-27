import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import { toast } from 'sonner';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { OrderCard } from '@/components/mypage/OrderCard';
import { orderApi, type IOrderSummary } from '@/api/orderApi';

type StatusFilter = 'ALL' | 'PAID' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PAID', label: '결제완료' },
  { value: 'PREPARING', label: '상품준비중' },
  { value: 'SHIPPING', label: '배송중' },
  { value: 'DELIVERED', label: '배송완료' },
  { value: 'CANCELLED', label: '취소' },
];

const VALID_FILTERS: StatusFilter[] = ['ALL', 'PAID', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

function OrderCardSkeleton() {
  return (
    <div className='border p-5 space-y-4 animate-pulse'>
      <div className='flex items-start justify-between'>
        <div className='space-y-2'>
          <div className='h-3 w-24 bg-secondary' />
          <div className='h-4 w-40 bg-secondary' />
        </div>
        <div className='h-6 w-16 bg-secondary' />
      </div>
      <div className='h-px bg-border' />
      <div className='flex items-center gap-3'>
        <div className='w-14 h-14 bg-secondary shrink-0' />
        <div className='flex-1 space-y-2'>
          <div className='h-4 w-3/4 bg-secondary' />
          <div className='h-3 w-1/4 bg-secondary' />
        </div>
      </div>
      <div className='h-px bg-border' />
      <div className='flex justify-between'>
        <div className='h-5 w-32 bg-secondary' />
        <div className='h-7 w-20 bg-secondary' />
      </div>
    </div>
  );
}

export function OrderListPage() {
  // URL 쿼리(?status=...)에서 초기 필터 값 읽기 — 마이페이지 안내 카드에서 진입 시 자동 적용
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('status') as StatusFilter) ?? 'ALL';
  const [filter, setFilter] = useState<StatusFilter>(
    VALID_FILTERS.includes(initialFilter) ? initialFilter : 'ALL',
  );
  const [orders, setOrders] = useState<IOrderSummary[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    try {
      const data = await orderApi.getOrders(currentPage, 10);
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch {
      // 에러 시 빈 상태 유지
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(page);
  }, [fetchOrders, page]);

  const handleCancel = async (id: number) => {
    try {
      await orderApi.cancelOrder(id);
      toast.success('주문이 취소되었습니다');
      fetchOrders(page);
    } catch (err) {
      console.error('[OrderList] 주문 취소 실패', err);
      const apiErr = err as { code?: string; message?: string };
      toast.error(
        `주문 취소 실패: ${apiErr?.message ?? apiErr?.code ?? '알 수 없는 오류'}`,
      );
    }
  };

  const filtered =
    filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <MyPageLayout activeMenu='/mypage/orders'>
      <div className='mb-6'>
        <p className='text-[10px] tracking-[0.3em] font-semibold uppercase text-accent mb-1'>
          ORDER HISTORY
        </p>
        <h2 className='font-editorial text-2xl font-bold mb-5'>주문 내역</h2>
        <div className='flex gap-2 overflow-x-auto pb-1'>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.value
                  ? 'bg-accent text-accent-foreground'
                  : 'border border-border hover:border-accent hover:text-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className='py-16 text-center'>
          <Package className='w-12 h-12 text-muted-foreground mx-auto mb-4' strokeWidth={1} />
          <p className='text-sm text-muted-foreground'>해당하는 주문이 없습니다</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={handleCancel} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-3 mt-8'>
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className='px-4 py-2 text-sm font-semibold rounded-full border border-border hover:border-accent hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
          >
            이전
          </button>
          <span className='text-sm text-muted-foreground font-medium'>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
            className='px-4 py-2 text-sm font-semibold rounded-full border border-border hover:border-accent hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
          >
            다음
          </button>
        </div>
      )}
    </MyPageLayout>
  );
}
