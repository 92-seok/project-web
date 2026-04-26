import { useState, useEffect } from 'react';
import { adminApi } from '@/api/adminApi';
import type { IStatsResponse, IAdminOrderPage, IProductPage } from '@/api/adminApi';

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

function formatPrice(value: number): string {
  return `₩ ${value.toLocaleString()}`;
}

export function DashboardPage() {
  const [stats, setStats] = useState<IStatsResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<IAdminOrderPage | null>(null);
  const [bestProducts, setBestProducts] = useState<IProductPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      adminApi.getStats(),
      adminApi.getOrders(0, 5),
      adminApi.getProducts(0, 20),
    ])
      .then(([statsData, ordersData, productsData]) => {
        setStats(statsData);
        setRecentOrders(ordersData);
        // 리뷰 수 내림차순 정렬 후 상위 5개
        const sorted = [...productsData.content].sort((a, b) => b.reviewCount - a.reviewCount);
        setBestProducts({ ...productsData, content: sorted.slice(0, 5) });
      })
      .catch((err) => {
        console.error('대시보드 데이터 로드 실패:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const statCards = [
    { label: '총 매출', value: isLoading || !stats ? '—' : formatPrice(stats.totalRevenue) },
    { label: '오늘 주문', value: isLoading || !stats ? '—' : `${stats.todayOrders.toLocaleString()}건` },
    { label: '총 회원수', value: isLoading || !stats ? '—' : `${stats.totalMembers.toLocaleString()}명` },
    { label: '총 상품수', value: isLoading || !stats ? '—' : `${stats.totalProducts.toLocaleString()}개` },
  ];

  return (
    <div className='space-y-8'>
      <h1 className='text-xl font-bold tracking-tight text-primary'>대시보드</h1>

      {/* 통계 카드 */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {statCards.map((card) => (
          <div key={card.label} className='bg-white border border-black/10 p-6'>
            <p className='text-xs text-primary/50 uppercase tracking-widest mb-2'>{card.label}</p>
            <p className='text-2xl font-bold text-primary'>{card.value}</p>
          </div>
        ))}
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>
        {/* 최근 주문 테이블 */}
        <div className='lg:col-span-2 bg-white border border-black/10'>
          <div className='px-6 py-4 border-b border-black/10'>
            <h2 className='text-sm font-bold tracking-wide uppercase text-primary'>최근 주문</h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-black/10 text-xs text-primary/50 uppercase tracking-wider'>
                  <th className='px-6 py-3 text-left font-medium'>주문번호</th>
                  <th className='px-6 py-3 text-left font-medium'>상품</th>
                  <th className='px-6 py-3 text-right font-medium'>금액</th>
                  <th className='px-6 py-3 text-center font-medium'>상태</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={4} className='px-6 py-12 text-center text-sm text-primary/40'>
                      불러오는 중...
                    </td>
                  </tr>
                )}
                {!isLoading && recentOrders?.content.map((order) => (
                  <tr key={order.id} className='border-b border-black/5 hover:bg-secondary/50'>
                    <td className='px-6 py-4 font-mono text-xs'>{order.orderNumber}</td>
                    <td className='px-6 py-4 text-primary/70 max-w-[160px] truncate'>
                      {order.firstItemName}
                      {order.itemCount > 1 && ` 외 ${order.itemCount - 1}건`}
                    </td>
                    <td className='px-6 py-4 text-right font-medium'>
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <span
                        className={`text-xs px-2 py-1 font-medium ${
                          STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
                {!isLoading && recentOrders?.content.length === 0 && (
                  <tr>
                    <td colSpan={4} className='px-6 py-12 text-center text-sm text-primary/40'>
                      최근 주문이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 베스트 상품 */}
        <div className='bg-white border border-black/10'>
          <div className='px-6 py-4 border-b border-black/10'>
            <h2 className='text-sm font-bold tracking-wide uppercase text-primary'>베스트 상품</h2>
          </div>
          {isLoading ? (
            <p className='px-6 py-12 text-center text-sm text-primary/40'>불러오는 중...</p>
          ) : (
            <ul className='divide-y divide-black/5'>
              {bestProducts?.content.map((product, idx) => (
                <li key={product.id} className='flex items-center gap-4 px-6 py-4'>
                  <span className='text-xs font-bold text-primary/30 w-4'>{idx + 1}</span>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    width={40}
                    height={40}
                    className='w-10 h-10 object-cover border border-black/10 shrink-0'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{product.name}</p>
                    <p className='text-xs text-primary/50'>리뷰 {product.reviewCount}건</p>
                  </div>
                </li>
              ))}
              {bestProducts?.content.length === 0 && (
                <li className='px-6 py-12 text-center text-sm text-primary/40'>상품이 없습니다.</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
