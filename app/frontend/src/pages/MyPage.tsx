import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { OrderCard } from '@/components/mypage/OrderCard';
import { useAuth } from '@/hooks/useAuth';
import { orderApi, type IOrderSummary } from '@/api/orderApi';
import { wishlistApi } from '@/api/wishlistApi';

export function MyPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<IOrderSummary[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    orderApi.getOrders(0, 3).then((data) => {
      setRecentOrders(data.content);
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

      {/* 최근 주문 */}
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
          {recentOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {recentOrders.length === 0 && (
            <p className='text-sm text-muted-foreground text-center py-8'>주문 내역이 없습니다</p>
          )}
        </div>
      </div>
    </MyPageLayout>
  );
}
