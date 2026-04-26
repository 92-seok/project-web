import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '@/api/adminApi';
import type { ICreateProductRequest } from '@/api/adminApi';
import type { IProductSummary } from '@/api/productApi';

const CATEGORY_LABEL: Record<string, string> = {
  dog: '강아지',
  cat: '고양이',
  bird: '새',
  fish: '물고기',
  reptile: '파충류',
  small: '소동물',
};

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABEL);
const PET_TYPE_OPTIONS = [
  { value: 'dog', label: '강아지' },
  { value: 'cat', label: '고양이' },
  { value: 'bird', label: '새' },
  { value: 'fish', label: '물고기' },
  { value: 'reptile', label: '파충류' },
  { value: 'small', label: '소동물' },
];

const EMPTY_FORM: ICreateProductRequest = {
  name: '',
  description: '',
  price: 0,
  originalPrice: undefined,
  imageUrl: '',
  badge: '',
  category: 'dog',
  petType: 'dog',
  stock: 0,
};

interface IProductModalProps {
  initial: ICreateProductRequest | null;
  onClose: () => void;
  onSave: (data: ICreateProductRequest) => Promise<void>;
}

function ProductModal({ initial, onClose, onSave }: IProductModalProps) {
  const [form, setForm] = useState<ICreateProductRequest>(initial ?? EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' || name === 'stock'
        ? value === '' ? undefined : Number(value)
        : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('상품명을 입력해주세요.'); return; }
    if (!form.imageUrl.trim()) { setError('이미지 URL을 입력해주세요.'); return; }
    if (form.price <= 0) { setError('가격을 올바르게 입력해주세요.'); return; }
    setIsSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  }

  const inputCls = 'w-full border border-black/20 px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary';
  const labelCls = 'block text-xs text-primary/50 uppercase tracking-wider mb-1';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='bg-white w-full max-w-lg border border-black/10 max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-black/10'>
          <h2 className='text-sm font-bold tracking-wide uppercase'>
            {initial ? '상품 수정' : '상품 추가'}
          </h2>
          <button onClick={onClose} aria-label='닫기' className='text-primary/60 hover:text-primary'>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {error && (
            <p className='text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2'>{error}</p>
          )}

          <div>
            <label className={labelCls}>상품명 *</label>
            <input name='name' value={form.name} onChange={handleChange} className={inputCls} />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className={labelCls}>카테고리</label>
              <select name='category' value={form.category} onChange={handleChange} className={inputCls}>
                {CATEGORY_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>펫 타입</label>
              <select name='petType' value={form.petType} onChange={handleChange} className={inputCls}>
                {PET_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className={labelCls}>판매가 *</label>
              <input
                name='price'
                type='number'
                min={0}
                value={form.price}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>정가 (선택)</label>
              <input
                name='originalPrice'
                type='number'
                min={0}
                value={form.originalPrice ?? ''}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>재고</label>
            <input
              name='stock'
              type='number'
              min={0}
              value={form.stock}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>이미지 URL *</label>
            <input name='imageUrl' value={form.imageUrl} onChange={handleChange} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>뱃지 (선택)</label>
            <input name='badge' value={form.badge ?? ''} onChange={handleChange} className={inputCls} placeholder='예: NEW, BEST' />
          </div>

          <div>
            <label className={labelCls}>설명 (선택)</label>
            <textarea
              name='description'
              value={form.description ?? ''}
              onChange={handleChange}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm border border-black/20 text-primary/70 hover:bg-secondary transition-colors'
            >
              취소
            </button>
            <button
              type='submit'
              disabled={isSaving}
              className='px-4 py-2 text-sm bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-50'
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProductManagePage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<IProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalTarget, setModalTarget] = useState<IProductSummary | null | 'new'>(null);

  function fetchProducts(p: number) {
    setIsLoading(true);
    adminApi.getProducts(p, 20)
      .then((data) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error('상품 목록 로드 실패:', err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  async function handleDelete(id: number) {
    if (!confirm('상품을 삭제하시겠습니까?')) return;
    try {
      await adminApi.deleteProduct(id);
      fetchProducts(page);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  }

  async function handleSave(data: ICreateProductRequest) {
    if (modalTarget === 'new') {
      await adminApi.createProduct(data);
    } else if (modalTarget && modalTarget !== 'new') {
      await adminApi.updateProduct(modalTarget.id, data);
    }
    fetchProducts(page);
  }

  function toFormData(product: IProductSummary): ICreateProductRequest {
    return {
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      imageUrl: product.imageUrl,
      badge: product.badge ?? undefined,
      category: product.category,
      petType: product.petType,
      stock: 0, // summary에 stock 없음 — 수정 시 서버 값으로 초기화 필요
    };
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight text-primary'>상품관리</h1>
        <button
          onClick={() => setModalTarget('new')}
          className='flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 hover:bg-primary/80 transition-colors'
        >
          <Plus size={16} />
          상품 추가
        </button>
      </div>

      {/* 검색 */}
      <div className='relative w-72'>
        <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-primary/40' />
        <input
          type='text'
          placeholder='상품명 검색'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full pl-9 pr-4 py-2 border border-black/20 text-sm bg-white focus:outline-none focus:border-primary'
        />
      </div>

      {/* 테이블 */}
      <div className='bg-white border border-black/10 overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-black/10 text-xs text-primary/50 uppercase tracking-wider'>
              <th className='px-6 py-3 text-left font-medium'>상품</th>
              <th className='px-6 py-3 text-left font-medium'>카테고리</th>
              <th className='px-6 py-3 text-right font-medium'>가격</th>
              <th className='px-6 py-3 text-center font-medium'>관리</th>
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
            {!isLoading && filtered.map((product) => (
              <tr key={product.id} className='border-b border-black/5 hover:bg-secondary/40'>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      width={40}
                      height={40}
                      className='w-10 h-10 object-cover border border-black/10 shrink-0'
                    />
                    <span className='font-medium max-w-[200px] truncate'>{product.name}</span>
                  </div>
                </td>
                <td className='px-6 py-4 text-primary/70'>
                  {CATEGORY_LABEL[product.category] ?? product.category}
                </td>
                <td className='px-6 py-4 text-right'>₩ {product.price.toLocaleString()}</td>
                <td className='px-6 py-4'>
                  <div className='flex items-center justify-center gap-2'>
                    <button
                      onClick={() => setModalTarget(product)}
                      className='p-1.5 hover:bg-secondary transition-colors text-primary/60 hover:text-primary'
                      aria-label='수정'
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className='p-1.5 hover:bg-red-50 transition-colors text-primary/60 hover:text-red-600'
                      aria-label='삭제'
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className='px-6 py-12 text-center text-sm text-primary/40'>
                  {query ? '검색 결과가 없습니다.' : '상품이 없습니다.'}
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

      {modalTarget !== null && (
        <ProductModal
          initial={modalTarget === 'new' ? null : toFormData(modalTarget)}
          onClose={() => setModalTarget(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
