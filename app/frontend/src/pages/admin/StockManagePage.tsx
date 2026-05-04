import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, PackageX, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '@/api/adminApi';
import { productApi } from '@/api/productApi';
import type { IProductSummary } from '@/api/productApi';

const LOW_STOCK_THRESHOLD = 10;

type FilterKey = 'all' | 'low' | 'out';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'low', label: `재고 부족 (≤${LOW_STOCK_THRESHOLD})` },
  { key: 'out', label: '품절' },
];

export function StockManagePage() {
  const [products, setProducts] = useState<IProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [edits, setEdits] = useState<Record<number, number>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .getProducts(0, 100)
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data.content].sort((a, b) => a.stock - b.stock);
        setProducts(sorted);
      })
      .catch((err) => console.error('재고 목록 로드 실패:', err))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const out = products.filter((p) => p.stock === 0).length;
    const low = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
    return { all: products.length, low, out };
  }, [products]);

  const filtered = useMemo(() => {
    if (filter === 'low') return products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
    if (filter === 'out') return products.filter((p) => p.stock === 0);
    return products;
  }, [products, filter]);

  function getDisplayStock(product: IProductSummary): number {
    return edits[product.id] ?? product.stock;
  }

  function setEditStock(productId: number, value: number) {
    setEdits((prev) => ({ ...prev, [productId]: value }));
  }

  function resetEdit(productId: number) {
    setEdits((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  async function saveStock(product: IProductSummary) {
    const newStock = edits[product.id];
    if (newStock === undefined || newStock === product.stock) return;
    setSavingId(product.id);
    try {
      // 백엔드 업데이트 API가 전체 필드를 요구하므로 detail을 한 번 더 가져온다
      const detail = await productApi.getProduct(product.id);
      await adminApi.updateProduct(product.id, {
        name: detail.name,
        description: detail.description,
        price: detail.price,
        originalPrice: detail.originalPrice ?? undefined,
        imageUrl: detail.imageUrl,
        badge: detail.badge ?? '',
        category: detail.category,
        petType: detail.petType,
        stock: newStock,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p)),
      );
      resetEdit(product.id);
      toast.success(`${product.name} — 재고 ${newStock}개로 저장됨`);
    } catch {
      toast.error('재고 저장에 실패했습니다');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className='space-y-6'>
      <header>
        <p className='text-xs tracking-[0.2em] font-semibold uppercase text-muted-foreground mb-1'>
          Stock Management
        </p>
        <h1 className='font-editorial text-2xl md:text-3xl font-bold mb-1'>재고 관리</h1>
        <p className='text-sm text-muted-foreground'>
          재고 부족·품절 상품을 한눈에 확인하고 인라인으로 수량을 수정하세요.
        </p>
      </header>

      {/* 요약 카드 */}
      <div className='grid grid-cols-3 gap-3'>
        <div className='bg-card border border-border rounded-2xl p-4'>
          <p className='text-xs text-muted-foreground'>전체 상품</p>
          <p className='text-2xl font-bold tabular-nums'>{counts.all}</p>
        </div>
        <div className='bg-[var(--badge-joint)]/10 border border-[var(--badge-joint)]/30 rounded-2xl p-4'>
          <p className='text-xs text-[var(--badge-joint)] flex items-center gap-1.5'>
            <AlertTriangle className='w-3.5 h-3.5' /> 재고 부족
          </p>
          <p className='text-2xl font-bold tabular-nums text-[var(--badge-joint)]'>{counts.low}</p>
        </div>
        <div className='bg-destructive/10 border border-destructive/30 rounded-2xl p-4'>
          <p className='text-xs text-destructive flex items-center gap-1.5'>
            <PackageX className='w-3.5 h-3.5' /> 품절
          </p>
          <p className='text-2xl font-bold tabular-nums text-destructive'>{counts.out}</p>
        </div>
      </div>

      {/* 필터 */}
      <div className='flex flex-wrap gap-2'>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
              filter === f.key
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card text-foreground/70 border-border hover:border-foreground/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className='bg-card border border-border rounded-2xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider'>
                <th className='px-5 py-3 text-left font-medium'>상품</th>
                <th className='px-5 py-3 text-left font-medium hidden md:table-cell'>분류</th>
                <th className='px-5 py-3 text-right font-medium'>현재 재고</th>
                <th className='px-5 py-3 text-center font-medium'>수정</th>
                <th className='px-5 py-3 text-center font-medium'>저장</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className='px-5 py-12 text-center text-muted-foreground'>
                    불러오는 중…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className='px-5 py-12 text-center text-muted-foreground'>
                    해당 조건의 상품이 없습니다.
                  </td>
                </tr>
              )}
              {!isLoading &&
                filtered.map((product) => {
                  const displayStock = getDisplayStock(product);
                  const isEdited = edits[product.id] !== undefined && edits[product.id] !== product.stock;
                  const isOut = product.stock === 0;
                  const isLow = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
                  return (
                    <tr
                      key={product.id}
                      className='border-b border-border/60 last:border-0 hover:bg-secondary/40 transition-colors'
                    >
                      <td className='px-5 py-3'>
                        <div className='flex items-center gap-3 min-w-0'>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            className='w-10 h-10 object-cover rounded-lg shrink-0'
                          />
                          <p className='text-sm font-medium truncate max-w-[280px]'>{product.name}</p>
                        </div>
                      </td>
                      <td className='px-5 py-3 hidden md:table-cell text-xs text-muted-foreground'>
                        {product.petType} · {product.category}
                      </td>
                      <td className='px-5 py-3 text-right'>
                        <span
                          className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-semibold tabular-nums ${
                            isOut
                              ? 'bg-destructive/10 text-destructive'
                              : isLow
                                ? 'bg-[var(--badge-joint)]/15 text-[var(--badge-joint)]'
                                : 'bg-[var(--badge-organic)]/15 text-[var(--badge-organic)]'
                          }`}
                        >
                          {product.stock}개
                        </span>
                      </td>
                      <td className='px-5 py-3 text-center'>
                        <input
                          type='number'
                          min={0}
                          value={displayStock}
                          onChange={(e) => setEditStock(product.id, Number(e.target.value))}
                          className='w-20 h-8 px-2 text-sm text-center rounded-lg border border-border bg-background focus:outline-none focus:border-accent'
                        />
                      </td>
                      <td className='px-5 py-3 text-center'>
                        {isEdited ? (
                          <div className='inline-flex items-center gap-1'>
                            <button
                              onClick={() => saveStock(product)}
                              disabled={savingId === product.id}
                              className='inline-flex items-center gap-1 px-3 h-8 rounded-full text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50'
                            >
                              <Save className='w-3 h-3' />
                              {savingId === product.id ? '저장 중' : '저장'}
                            </button>
                            <button
                              onClick={() => resetEdit(product.id)}
                              className='w-8 h-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground'
                              aria-label='되돌리기'
                            >
                              <RotateCcw className='w-3.5 h-3.5' />
                            </button>
                          </div>
                        ) : (
                          <span className='text-xs text-muted-foreground'>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
