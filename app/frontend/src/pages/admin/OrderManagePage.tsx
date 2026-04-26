import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '@/api/adminApi';
import type { IOrderSummary, IOrderDetail } from '@/api/orderApi';

type FilterTab = 'ALL' | 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '결제완료' },
  { key: 'CONFIRMED', label: '확인중' },
  { key: 'SHIPPING', label: '배송중' },
  { key: 'DELIVERED', label: '배송완료' },
  { key: 'CANCELLED', label: '취소' },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'PENDING', label: '결제완료' },
  { value: 'CONFIRMED', label: '확인중' },
  { value: 'SHIPPING', label: '배송중' },
  { value: 'DELIVERED', label: '배송완료' },
  { value: 'CANCELLED', label: '취소' },
];

interface IOrderDetailModalProps {
  orderId: number;
  onClose: () => void;
  onStatusUpdated: () => void;
}

function OrderDetailModal({ orderId, onClose, onStatusUpdated }: IOrderDetailModalProps) {
  const [detail, setDetail] = useState<IOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    adminApi.getOrder(orderId)
      .then((data) => {
        setDetail(data);
        setSelectedStatus(data.status);
      })
      .catch((err) => console.error('주문 상세 로드 실패:', err))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  async function handleStatusUpdate() {
    if (!detail || selectedStatus === detail.status) return;
    setIsUpdating(true);
    setUpdateError('');
    try {
      await adminApi.updateOrderStatus(orderId, selectedStatus);
      onStatusUpdated();
      onClose();
    } catch {
      setUpdateError('상태 변경에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='bg-white w-full max-w-lg border border-black/10 max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-black/10'>
          <h2 className='text-sm font-bold tracking-wide uppercase'>주문 상세</h2>
          <button onClick={onClose} aria-label='닫기' className='text-primary/60 hover:text-primary'>
            <X size={18} />
          </button>
        </div>

        {isLoading && (
          <p className='px-6 py-12 text-center text-sm text-primary/40'>불러오는 중...</p>
        )}

        {!isLoading && detail && (
          <div className='p-6 space-y-5'>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div>
                <p className='text-xs text-primary/50 uppercase tracking-wider mb-1'>주문번호</p>
                <p className='font-mono font-medium'>{detail.orderNumber}</p>
              </div>
              <div>
                <p className='text-xs text-primary/50 uppercase tracking-wider mb-1'>주문일자</p>
                <p>{detail.createdAt.slice(0, 10)}</p>
              </div>
              <div>
                <p className='text-xs text-primary/50 uppercase tracking-wider mb-1'>수령인</p>
                <p>{detail.receiverName}</p>
              </div>
              <div>
                <p className='text-xs text-primary/50 uppercase tracking-wider mb-1'>연락처</p>
                <p>{detail.receiverPhone}</p>
              </div>
              <div className='col-span-2'>
                <p className='text-xs text-primary/50 uppercase tracking-wider mb-1'>배송지</p>
                <p>{detail.roadAddress}{detail.detailAddress ? ` ${detail.detailAddress}` : ''}</p>
              </div>
            </div>

            <div>
              <p className='text-xs text-primary/50 uppercase tracking-wider mb-3'>주문 상품</p>
              <ul className='space-y-3'>
                {detail.items.map((item) => (
                  <li key={item.productId} className='flex items-center gap-3'>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className='w-12 h-12 object-cover border border-black/10 shrink-0'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{item.name}</p>
                      <p className='text-xs text-primary/50'>수량 {item.quantity}개</p>
                    </div>
                    <p className='text-sm font-medium shrink-0'>
                      ₩ {item.subtotal.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className='border-t border-black/10 pt-4'>
              <div className='flex justify-between font-bold text-base'>
                <span>총 결제금액</span>
                <span>₩ {detail.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* 상태 변경 */}
            <div className='border-t border-black/10 pt-4 space-y-2'>
              <p className='text-xs text-primary/50 uppercase tracking-wider'>상태 변경</p>
              {updateError && (
                <p className='text-xs text-red-600'>{updateError}</p>
              )}
              <div className='flex gap-2'>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className='flex-1 border border-black/20 px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary'
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || selectedStatus === detail.status}
                  className='px-4 py-2 text-sm bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
                >
                  {isUpdating ? '변경 중...' : '변경'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function OrderManagePage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [orders, setOrders] = useState<IOrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  function fetchOrders(p: number, tab: FilterTab) {
    setIsLoading(true);
    const status = tab === 'ALL' ? undefined : tab;
    adminApi.getOrders(p, 20, status)
      .then((data) => {
        setOrders(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error('주문 목록 로드 실패:', err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchOrders(page, activeTab);
  }, [page, activeTab]);

  function handleTabChange(tab: FilterTab) {
    setActiveTab(tab);
    setPage(0);
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-bold tracking-tight text-primary'>주문관리</h1>

      {/* 상태 필터 탭 */}
      <div className='flex border-b border-black/10'>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-primary/50 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className='bg-white border border-black/10 overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-black/10 text-xs text-primary/50 uppercase tracking-wider'>
              <th className='px-6 py-3 text-left font-medium'>주문번호</th>
              <th className='px-6 py-3 text-left font-medium'>상품</th>
              <th className='px-6 py-3 text-left font-medium'>날짜</th>
              <th className='px-6 py-3 text-right font-medium'>금액</th>
              <th className='px-6 py-3 text-center font-medium'>상태</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className='px-6 py-12 text-center text-sm text-primary/40'>
                  불러오는 중...
                </td>
              </tr>
            )}
            {!isLoading && orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className='border-b border-black/5 hover:bg-secondary/40 cursor-pointer'
              >
                <td className='px-6 py-4 font-mono text-xs'>{order.orderNumber}</td>
                <td className='px-6 py-4 text-primary/70 max-w-[160px] truncate'>
                  {order.firstItemName}
                  {order.itemCount > 1 && ` 외 ${order.itemCount - 1}건`}
                </td>
                <td className='px-6 py-4 text-primary/70'>{order.createdAt.slice(0, 10)}</td>
                <td className='px-6 py-4 text-right font-medium'>
                  ₩ {order.totalPrice.toLocaleString()}
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
            {!isLoading && orders.length === 0 && (
              <tr>
                <td colSpan={5} className='px-6 py-12 text-center text-sm text-primary/40'>
                  해당 상태의 주문이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className='p-1.5 border border-black/20 text-primary/60 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='이전 페이지'
          >
            <ChevronLeft size={16} />
          </button>
          <span className='text-sm text-primary/60'>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className='p-1.5 border border-black/20 text-primary/60 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='다음 페이지'
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {selectedOrderId !== null && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onStatusUpdated={() => fetchOrders(page, activeTab)}
        />
      )}
    </div>
  );
}
