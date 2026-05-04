import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '@/api/adminApi';
import { ImageUploader } from '@/components/common/ImageUploader';
import type { ICreateProductRequest } from '@/api/adminApi';

const PET_OPTIONS = [
  { value: 'dog', label: '강아지' },
  { value: 'cat', label: '고양이' },
  { value: 'bird', label: '새' },
  { value: 'fish', label: '물고기' },
  { value: 'reptile', label: '파충류' },
  { value: 'small', label: '소동물' },
];

const CATEGORY_OPTIONS = [
  { value: 'food', label: '사료' },
  { value: 'snack', label: '간식' },
  { value: 'toy', label: '장난감' },
  { value: 'supplies', label: '용품' },
  { value: 'health', label: '건강·영양제' },
  { value: 'apparel', label: '의류' },
];

const EMPTY_FORM: ICreateProductRequest = {
  name: '',
  description: '',
  price: 0,
  originalPrice: undefined,
  imageUrl: '',
  badge: '',
  category: 'food',
  petType: 'dog',
  stock: 0,
};

export function ProductCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ICreateProductRequest>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'originalPrice' || name === 'stock'
          ? value === '' ? undefined : Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('상품명을 입력해주세요.'); return; }
    if (!form.imageUrl.trim()) { setError('상품 이미지를 등록해주세요.'); return; }
    if (form.price <= 0) { setError('판매가를 올바르게 입력해주세요.'); return; }

    setIsSaving(true);
    setError('');
    try {
      await adminApi.createProduct(form);
      toast.success('상품이 등록되었습니다');
      navigate('/admin/products');
    } catch {
      setError('등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  }

  const inputCls =
    'w-full h-10 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:border-accent transition-colors';
  const labelCls = 'block text-xs font-semibold text-muted-foreground mb-1.5';

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      <header className='flex items-center justify-between'>
        <div>
          <Link
            to='/admin/products'
            className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2'
          >
            <ArrowLeft className='w-3.5 h-3.5' /> 상품 관리로
          </Link>
          <h1 className='font-editorial text-2xl md:text-3xl font-bold'>새 상품 등록</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            상품 정보를 입력하면 즉시 카탈로그에 노출됩니다.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className='bg-card border border-border rounded-2xl p-5 md:p-7 space-y-5'
      >
        {error && (
          <p className='text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2'>
            {error}
          </p>
        )}

        <div>
          <label className={labelCls}>상품명 *</label>
          <input
            name='name'
            value={form.name}
            onChange={handleChange}
            className={inputCls}
            placeholder='예: 프리미엄 그레인프리 연어 사료 2kg'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className={labelCls}>반려동물</label>
            <select name='petType' value={form.petType} onChange={handleChange} className={inputCls}>
              {PET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>카테고리</label>
            <select name='category' value={form.category} onChange={handleChange} className={inputCls}>
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
              placeholder='할인 표시용'
            />
          </div>
          <div>
            <label className={labelCls}>초기 재고</label>
            <input
              name='stock'
              type='number'
              min={0}
              value={form.stock}
              onChange={handleChange}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>상품 이미지 *</label>
          <ImageUploader
            value={form.imageUrl ? [form.imageUrl] : []}
            onChange={(urls) => setForm((prev) => ({ ...prev, imageUrl: urls[0] ?? '' }))}
            maxCount={1}
            subDir='product'
            size='lg'
            helperText='jpg/png/webp/gif · 10MB 이하 · 정사각형 권장'
          />
          <input
            name='imageUrl'
            value={form.imageUrl}
            onChange={handleChange}
            placeholder='또는 외부 이미지 URL 직접 입력'
            className={`${inputCls} mt-2 text-xs`}
          />
        </div>

        <div>
          <label className={labelCls}>뱃지 (선택)</label>
          <input
            name='badge'
            value={form.badge ?? ''}
            onChange={handleChange}
            className={inputCls}
            placeholder='NEW · BEST · SALE 중 하나'
          />
        </div>

        <div>
          <label className={labelCls}>상품 설명 (선택)</label>
          <textarea
            name='description'
            value={form.description ?? ''}
            onChange={handleChange}
            rows={4}
            className='w-full px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:border-accent transition-colors resize-none'
            placeholder='주요 성분, 권장 대상, 보관법 등'
          />
        </div>

        <div className='flex justify-end gap-2 pt-2 border-t border-border'>
          <Link
            to='/admin/products'
            className='px-5 h-10 inline-flex items-center rounded-full text-sm text-muted-foreground hover:text-foreground border border-border hover:bg-secondary transition-colors'
          >
            취소
          </Link>
          <button
            type='submit'
            disabled={isSaving}
            className='px-6 h-10 inline-flex items-center rounded-full text-sm font-semibold bg-foreground text-background hover:bg-accent transition-colors disabled:opacity-50'
          >
            {isSaving ? '등록 중…' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
