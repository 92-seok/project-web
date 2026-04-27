import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { OrderCard } from '@/components/mypage/OrderCard';
import { useAuth } from '@/hooks/useAuth';
import { orderApi, type IOrderSummary } from '@/api/orderApi';
import { wishlistApi } from '@/api/wishlistApi';

const RECENT_FETCH_SIZE = 10;
const RECENT_VISIBLE_COUNT = 3;

export function MyPage() {
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState<IOrderSummary[]>([]);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    orderApi.getOrders(0, RECENT_FETCH_SIZE).then((data) => {
      const all = data.content;
      // 진행중(PAID/PREPARING/SHIPPING/DELIVERED) 만 최근 주문에 노출
      const active = all
        .filter((o) => o.status !== 'CANCELLED')
        .slice(0, RECENT_VISIBLE_COUNT);
      const cancelled = all.filter((o) => o.status === 'CANCELLED').length;

      setActiveOrders(active);
      setCancelledCount(cancelled);
      setOrderCount(data.totalElements);
    }).catch(() => {
      // 에러 시 빈 상태 유지
    });

    wishlistApi.getWishlist().then((data) => {
      setWishlistCount(data.totalCount);
    }).catch(() => {
      // 에러 시 0 유지
    });
  }, []);

  return (
    <MyPageLayout activeMenu='/mypage'>
      {/* 프로필 카드 */}
      <div className='relative overflow-hidden flex items-center gap-5 p-6 rounded-2xl bg-gradient-to-br from-secondary via-secondary to-[var(--badge-care)]/15 mb-8 border border-border'>
        <Avatar className='w-16 h-16 ring-2 ring-background'>
          <AvatarFallback className='text-xl font-bold bg-accent text-accent-foreground'>
            {user?.name?.[0] ?? 'P'}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className='font-editorial text-xl font-bold'>{user?.name}님 안녕하세요</p>
          <p className='text-sm text-muted-foreground mt-0.5'>{user?.loginId}</p>
          <span
            className={`inline-block mt-2 text-[10px] tracking-wider font-bold px-2 py-0.5 rounded-full ${
              user?.role === 'ADMIN'
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {user?.role === 'ADMIN' ? '관리자' : '일반회원'}
          </span>
        </div>
        <Link
          to='/mypage/profile'
          className='ml-auto text-xs font-semibold text-muted-foreground hover:text-accent underline underline-offset-2 transition-colors'
        >
          수정
        </Link>
      </div>

      {/* 통계 3칸 */}
      <div className='grid grid-cols-3 gap-3 mb-10'>
        {[
          { label: '주문', value: orderCount, href: '/mypage/orders' },
          { label: '찜 목록', value: wishlistCount, href: '/mypage/wishlist' },
          { label: '리뷰', value: 0, href: null },
        ].map((stat) => (
          <div
            key={stat.label}
            className='rounded-xl border border-border bg-card text-center py-5 hover:border-accent transition-colors'
          >
            {stat.href ? (
              <Link to={stat.href} className='block'>
                <p className='font-editorial text-2xl font-bold text-foreground'>
                  {stat.value}
                </p>
                <p className='text-xs text-muted-foreground mt-1.5 font-medium'>
                  {stat.label}
                </p>
              </Link>
            ) : (
              <>
                <p className='font-editorial text-2xl font-bold text-foreground'>
                  {stat.value}
                </p>
                <p className='text-xs text-muted-foreground mt-1.5 font-medium'>
                  {stat.label}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 최근 주문 — 진행중인 주문만 */}
      <div>
        <div className='flex items-end justify-between mb-5'>
          <div>
            <p className='text-[10px] tracking-[0.3em] font-semibold uppercase text-accent mb-1'>
              RECENT ORDERS
            </p>
            <h2 className='font-editorial text-xl font-bold'>최근 주문</h2>
          </div>
          <Link
            to='/mypage/orders'
            className='text-xs font-semibold text-muted-foreground hover:text-accent underline underline-offset-2 transition-colors'
          >
            전체보기 →
          </Link>
        </div>
        <div className='space-y-4'>
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {activeOrders.length === 0 && (
            <p className='text-sm text-muted-foreground text-center py-8'>
              진행 중인 주문이 없습니다
            </p>
          )}
        </div>

        {/* 취소된 주문 안내 — 최근 10건 중 취소건이 있을 때만 표시 */}
        {cancelledCount > 0 && (
          <Link
            to='/mypage/orders?status=CANCELLED'
            className='mt-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-secondary/30 px-5 py-3.5 hover:border-accent/40 hover:bg-secondary/50 transition-colors group'
          >
            <div className='flex items-center gap-3'>
              <span className='shrink-0 w-9 h-9 rounded-full bg-background flex items-center justify-center text-muted-foreground'>
                <XCircle className='w-4 h-4' strokeWidth={1.8} />
              </span>
              <div>
                <p className='text-sm font-semibold text-foreground'>
                  최근 취소된 주문 {cancelledCount}건
                </p>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  주문 내역에서 자세히 볼 수 있어요
                </p>
              </div>
            </div>
            <span className='text-xs text-muted-foreground group-hover:text-accent transition-colors'>
              보기 →
            </span>
          </Link>
        )}
      </div>
    </MyPageLayout>
  );
}
