import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ShoppingBag,
  Users,
  Package,
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { adminApi } from '@/api/adminApi';
import type { IStatsResponse, IAdminOrderPage, IProductPage } from '@/api/adminApi';
import { useAuthStore } from '@/store/authStore';

// ── 목업 데이터 (API 실패 시 폴백) ─────────────────────────────────────
const MOCK_STATS: IStatsResponse = {
  totalMembers: 1284,
  totalProducts: 67,
  totalOrders: 3492,
  todayOrders: 23,
  totalRevenue: 87340000,
};

const MOCK_RECENT_ORDERS: IAdminOrderPage = {
  page: 0,
  size: 6,
  totalElements: 6,
  totalPages: 1,
  last: true,
  content: [
    { id: 1, orderNumber: 'PM-26050401', status: 'PENDING', statusLabel: '결제완료', totalPrice: 45000, itemCount: 1, firstItemName: '프리미엄 그레인프리 연어 사료 2kg', firstItemImageUrl: '', createdAt: '2026-05-04T10:24:00' },
    { id: 2, orderNumber: 'PM-26050402', status: 'PENDING', statusLabel: '결제완료', totalPrice: 28000, itemCount: 2, firstItemName: '노즈워크 스누피 매트', firstItemImageUrl: '', createdAt: '2026-05-04T09:51:00' },
    { id: 3, orderNumber: 'PM-26050403', status: 'CONFIRMED', statusLabel: '확인중', totalPrice: 12800, itemCount: 1, firstItemName: '동결건조 닭가슴살 트릿 80g', firstItemImageUrl: '', createdAt: '2026-05-04T09:18:00' },
    { id: 4, orderNumber: 'PM-26050404', status: 'SHIPPING', statusLabel: '배송중', totalPrice: 148000, itemCount: 1, firstItemName: '원목 캣타워 클래식 4단', firstItemImageUrl: '', createdAt: '2026-05-03T18:42:00' },
    { id: 5, orderNumber: 'PM-26050405', status: 'DELIVERED', statusLabel: '배송완료', totalPrice: 32400, itemCount: 1, firstItemName: '두부 응고 모래 6L (3팩)', firstItemImageUrl: '', createdAt: '2026-05-02T14:08:00' },
    { id: 6, orderNumber: 'PM-26050406', status: 'DELIVERED', statusLabel: '배송완료', totalPrice: 22500, itemCount: 1, firstItemName: '오가닉 비건 샴푸 500ml', firstItemImageUrl: '', createdAt: '2026-05-01T16:30:00' },
  ],
};

const MOCK_BEST_PRODUCTS: IProductPage = {
  page: 0,
  size: 5,
  totalElements: 5,
  totalPages: 1,
  last: true,
  content: [
    { id: 101, name: '프리미엄 그레인프리 연어 사료 2kg', price: 45000, originalPrice: null, imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=80&h=80&fit=crop', badge: 'BEST', category: 'food', petType: 'dog', rating: 4.8, reviewCount: 1283, stock: 42 },
    { id: 102, name: '동결건조 닭가슴살 트릿 80g', price: 12800, originalPrice: 16000, imageUrl: 'https://images.unsplash.com/photo-1574231164645-d6f0e8553590?w=80&h=80&fit=crop', badge: 'SALE', category: 'snack', petType: 'cat', rating: 4.9, reviewCount: 842, stock: 78 },
    { id: 103, name: '두부 응고 모래 6L (3팩)', price: 32400, originalPrice: null, imageUrl: 'https://images.unsplash.com/photo-1600077029991-7b6e021d2c0b?w=80&h=80&fit=crop', badge: null, category: 'supplies', petType: 'cat', rating: 4.6, reviewCount: 2041, stock: 15 },
    { id: 104, name: '노즈워크 스누피 매트 라지', price: 28000, originalPrice: null, imageUrl: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=80&h=80&fit=crop', badge: 'NEW', category: 'toy', petType: 'dog', rating: 4.7, reviewCount: 421, stock: 31 },
    { id: 105, name: '오가닉 비건 샴푸 500ml', price: 22500, originalPrice: null, imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=80&h=80&fit=crop', badge: null, category: 'supplies', petType: 'dog', rating: 4.5, reviewCount: 312, stock: 8 },
  ],
};

const STATUS_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: '결제완료', color: 'text-[var(--badge-joint)]', bg: 'bg-[var(--badge-joint)]/15' },
  CONFIRMED: { label: '확인중', color: 'text-[var(--badge-dental)]', bg: 'bg-[var(--badge-dental)]/15' },
  SHIPPING: { label: '배송중', color: 'text-[var(--badge-care)]', bg: 'bg-[var(--badge-care)]/15' },
  DELIVERED: { label: '배송완료', color: 'text-[var(--badge-organic)]', bg: 'bg-[var(--badge-organic)]/15' },
  CANCELLED: { label: '취소', color: 'text-destructive', bg: 'bg-destructive/15' },
};

function formatPrice(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`;
}

function formatDate(): string {
  const d = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
}

interface IKpi {
  label: string;
  value: string;
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  hint?: string;
}

export function DashboardPage() {
  const adminName = useAuthStore((s) => s.user?.name ?? '관리자');
  const [stats, setStats] = useState<IStatsResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<IAdminOrderPage | null>(null);
  const [bestProducts, setBestProducts] = useState<IProductPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      adminApi.getStats(),
      adminApi.getOrders(0, 10),
      adminApi.getProducts(0, 20),
    ])
      .then(([statsData, ordersData, productsData]) => {
        if (cancelled) return;
        setStats(statsData);
        setRecentOrders(ordersData);
        const sorted = [...productsData.content].sort((a, b) => b.reviewCount - a.reviewCount);
        setBestProducts({ ...productsData, content: sorted.slice(0, 5) });
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn('[Dashboard] API 호출 실패 — 목업 데이터로 폴백합니다.', err);
        setStats(MOCK_STATS);
        setRecentOrders(MOCK_RECENT_ORDERS);
        setBestProducts(MOCK_BEST_PRODUCTS);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 최근 주문에서 상태별 카운팅 (간단 시각화용)
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    recentOrders?.content.forEach((o) => {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    });
    return counts;
  }, [recentOrders]);

  const totalOrdersInRange = recentOrders?.content.length ?? 0;
  const pendingCount = statusCounts.PENDING ?? 0;

  const kpis: IKpi[] = [
    {
      label: '총 매출',
      value: !stats ? '—' : formatPrice(stats.totalRevenue),
      Icon: Wallet,
      iconBg: 'bg-accent/15',
      iconColor: 'text-accent',
      hint: '결제 완료 누적',
    },
    {
      label: '오늘 주문',
      value: !stats ? '—' : `${stats.todayOrders.toLocaleString('ko-KR')}건`,
      Icon: ShoppingBag,
      iconBg: 'bg-[var(--badge-care)]/15',
      iconColor: 'text-[var(--badge-care)]',
      hint: '00시 이후',
    },
    {
      label: '총 회원',
      value: !stats ? '—' : `${stats.totalMembers.toLocaleString('ko-KR')}명`,
      Icon: Users,
      iconBg: 'bg-[var(--badge-dental)]/15',
      iconColor: 'text-[var(--badge-dental)]',
    },
    {
      label: '총 상품',
      value: !stats ? '—' : `${stats.totalProducts.toLocaleString('ko-KR')}개`,
      Icon: Package,
      iconBg: 'bg-[var(--badge-joint)]/15',
      iconColor: 'text-[var(--badge-joint)]',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* 헤더 — 인사 + 처리 필요 알림 */}
      <header className='flex flex-col md:flex-row md:items-end md:justify-between gap-3'>
        <div>
          <p className='text-xs tracking-[0.2em] font-semibold uppercase text-muted-foreground mb-1'>
            {formatDate()}
          </p>
          <h1 className='font-editorial text-2xl md:text-3xl font-bold'>
            안녕하세요, <span className='text-accent'>{adminName}</span>님
          </h1>
        </div>

        {pendingCount > 0 && (
          <Link
            to='/admin/orders'
            className='inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/30 hover:bg-accent/15 transition-colors group'
          >
            <span className='inline-flex w-9 h-9 rounded-full bg-accent text-accent-foreground items-center justify-center'>
              <AlertCircle className='w-4 h-4' />
            </span>
            <div>
              <p className='text-xs text-muted-foreground'>배송 준비 필요</p>
              <p className='text-sm font-semibold'>
                결제완료 <span className='text-accent font-bold'>{pendingCount}건</span> 대기 중
              </p>
            </div>
            <ArrowRight className='w-4 h-4 text-accent transition-transform group-hover:translate-x-1' />
          </Link>
        )}
      </header>

      {/* KPI 카드 4개 */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className='bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow'
          >
            <div className='flex items-start justify-between mb-4'>
              <div className={`inline-flex w-10 h-10 rounded-xl ${kpi.iconBg} ${kpi.iconColor} items-center justify-center`}>
                <kpi.Icon className='w-5 h-5' strokeWidth={1.8} />
              </div>
              {kpi.hint && (
                <span className='text-[10px] text-muted-foreground'>{kpi.hint}</span>
              )}
            </div>
            <p className='text-xs text-muted-foreground mb-1'>{kpi.label}</p>
            <p className='font-editorial text-xl md:text-2xl font-bold tabular-nums'>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* 좌 2/3: 최근 주문 + 상태 분포  /  우 1/3: 베스트 상품 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
        {/* 최근 주문 + 상태 바 */}
        <div className='lg:col-span-2 space-y-4'>
          {/* 주문 상태 분포 */}
          <div className='bg-card border border-border rounded-2xl p-5'>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <p className='text-xs tracking-[0.2em] font-semibold uppercase text-muted-foreground mb-1'>
                  Order Status
                </p>
                <h2 className='font-semibold'>최근 {totalOrdersInRange}건의 상태 분포</h2>
              </div>
              <TrendingUp className='w-4 h-4 text-muted-foreground' />
            </div>

            {totalOrdersInRange === 0 ? (
              <p className='py-6 text-center text-sm text-muted-foreground'>주문 데이터가 없습니다.</p>
            ) : (
              <>
                {/* 분할 바 */}
                <div className='flex h-3 rounded-full overflow-hidden bg-secondary mb-3'>
                  {Object.entries(statusCounts).map(([status, count]) => {
                    const meta = STATUS_META[status];
                    if (!meta) return null;
                    const pct = (count / totalOrdersInRange) * 100;
                    return (
                      <div
                        key={status}
                        className={`${meta.bg.replace('/15', '')} h-full`}
                        style={{ width: `${pct}%` }}
                        title={`${meta.label} ${count}건`}
                      />
                    );
                  })}
                </div>
                {/* 범례 */}
                <div className='flex flex-wrap gap-x-4 gap-y-1.5 text-xs'>
                  {Object.entries(statusCounts).map(([status, count]) => {
                    const meta = STATUS_META[status];
                    if (!meta) return null;
                    return (
                      <span key={status} className='inline-flex items-center gap-1.5'>
                        <span className={`w-2 h-2 rounded-full ${meta.bg.replace('/15', '')}`} />
                        <span className='text-muted-foreground'>{meta.label}</span>
                        <span className='font-semibold tabular-nums'>{count}</span>
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* 최근 주문 테이블 */}
          <div className='bg-card border border-border rounded-2xl overflow-hidden'>
            <div className='flex items-center justify-between px-5 py-4 border-b border-border'>
              <div>
                <p className='text-xs tracking-[0.2em] font-semibold uppercase text-muted-foreground mb-0.5'>
                  Recent Orders
                </p>
                <h2 className='font-semibold'>최근 주문</h2>
              </div>
              <Link
                to='/admin/orders'
                className='inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline'
              >
                전체 보기 <ArrowRight className='w-3 h-3' />
              </Link>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider'>
                    <th className='px-5 py-3 text-left font-medium'>주문번호</th>
                    <th className='px-5 py-3 text-left font-medium'>상품</th>
                    <th className='px-5 py-3 text-right font-medium'>금액</th>
                    <th className='px-5 py-3 text-center font-medium'>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={4} className='px-5 py-12 text-center text-sm text-muted-foreground'>
                        불러오는 중…
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    recentOrders?.content.slice(0, 6).map((order) => {
                      const meta = STATUS_META[order.status];
                      return (
                        <tr key={order.id} className='border-b border-border/60 last:border-0 hover:bg-secondary/40 transition-colors'>
                          <td className='px-5 py-3 font-mono text-xs'>{order.orderNumber}</td>
                          <td className='px-5 py-3 max-w-[200px] truncate'>
                            {order.firstItemName}
                            {order.itemCount > 1 && (
                              <span className='text-muted-foreground ml-1'>외 {order.itemCount - 1}건</span>
                            )}
                          </td>
                          <td className='px-5 py-3 text-right font-semibold tabular-nums'>
                            {formatPrice(order.totalPrice)}
                          </td>
                          <td className='px-5 py-3 text-center'>
                            <span
                              className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                meta?.bg ?? 'bg-secondary'
                              } ${meta?.color ?? 'text-foreground'}`}
                            >
                              {meta?.label ?? order.statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  {!isLoading && recentOrders?.content.length === 0 && (
                    <tr>
                      <td colSpan={4} className='px-5 py-12 text-center text-sm text-muted-foreground'>
                        최근 주문이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 베스트 상품 */}
        <div className='bg-card border border-border rounded-2xl overflow-hidden'>
          <div className='px-5 py-4 border-b border-border flex items-center justify-between'>
            <div>
              <p className='text-xs tracking-[0.2em] font-semibold uppercase text-muted-foreground mb-0.5'>
                Top Products
              </p>
              <h2 className='font-semibold'>베스트 상품</h2>
            </div>
            <Link
              to='/admin/products'
              className='text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1'
            >
              전체 <ArrowRight className='w-3 h-3' />
            </Link>
          </div>
          {isLoading ? (
            <p className='px-5 py-12 text-center text-sm text-muted-foreground'>불러오는 중…</p>
          ) : (
            <ul className='divide-y divide-border/60'>
              {bestProducts?.content.map((product, idx) => (
                <li key={product.id} className='flex items-center gap-3 px-5 py-3 hover:bg-secondary/40 transition-colors'>
                  <span className='w-5 text-xs font-bold text-muted-foreground tabular-nums'>{idx + 1}</span>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    width={40}
                    height={40}
                    className='w-10 h-10 object-cover rounded-lg shrink-0'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{product.name}</p>
                    <p className='text-xs text-muted-foreground'>리뷰 {product.reviewCount.toLocaleString('ko-KR')}건</p>
                  </div>
                </li>
              ))}
              {bestProducts?.content.length === 0 && (
                <li className='px-5 py-12 text-center text-sm text-muted-foreground'>상품이 없습니다.</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* 빠른 액션 — 사이드바에 없는 작업 동선만 노출 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
        <Link
          to='/admin/products/new'
          className='bg-card border border-border rounded-2xl p-5 hover:border-accent transition-colors group flex items-center gap-4'
        >
          <span className='inline-flex w-11 h-11 rounded-xl bg-[var(--badge-joint)]/15 text-[var(--badge-joint)] items-center justify-center'>
            <Plus className='w-5 h-5' strokeWidth={2} />
          </span>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold'>상품 등록</p>
            <p className='text-xs text-muted-foreground'>새 상품 정보를 입력해 카탈로그에 추가</p>
          </div>
          <ArrowRight className='w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent' />
        </Link>
        <Link
          to='/admin/stock'
          className='bg-card border border-border rounded-2xl p-5 hover:border-accent transition-colors group flex items-center gap-4'
        >
          <span className='inline-flex w-11 h-11 rounded-xl bg-[var(--badge-care)]/15 text-[var(--badge-care)] items-center justify-center'>
            <Package className='w-5 h-5' strokeWidth={1.8} />
          </span>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold'>재고 관리</p>
            <p className='text-xs text-muted-foreground'>부족·품절 상품 인라인 수정</p>
          </div>
          <ArrowRight className='w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent' />
        </Link>
      </div>
    </div>
  );
}
