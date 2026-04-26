import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts, toIProduct } from '@/hooks/useProducts';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { FilterSheet } from '@/components/products/FilterSheet';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SortSelect } from '@/components/products/SortSelect';
import type { IFilterState, SortOption } from '@/types/product';

const DEFAULT_FILTER: IFilterState = {
  pet: [],
  badge: [],
  priceMax: 0,
  sort: 'popular',
};

// SortOption → 백엔드 sort 파라미터 매핑
const SORT_MAP: Record<SortOption, string> = {
  popular: 'best',
  newest: 'newest',
  'price-asc': 'price-asc',
  'price-desc': 'price-desc',
  rating: 'rating',
};

const PAGE_SIZE = 16;

export function ProductListPage() {
  const [searchParams] = useSearchParams();

  const [filter, setFilter] = useState<IFilterState>({
    pet: searchParams.get('pet') ? [searchParams.get('pet')!] : [],
    badge: [],
    priceMax: 0,
    sort: (searchParams.get('sort') as SortOption) ?? 'popular',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(0);

  const petType = filter.pet.length === 1 ? filter.pet[0] : undefined;

  const { data, isLoading } = useProducts({
    petType,
    sort: SORT_MAP[filter.sort],
    page,
    size: PAGE_SIZE,
  });

  const products = (data?.content ?? []).map(toIProduct);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const activeFilterCount = filter.pet.length + filter.badge.length + (filter.priceMax > 0 ? 1 : 0);

  const handleResetFilter = () => {
    setFilter({ ...DEFAULT_FILTER, sort: filter.sort });
    setPage(0);
  };

  const handleFilterChange = (newFilter: IFilterState) => {
    setFilter(newFilter);
    setPage(0);
  };

  return (
    <div className='min-h-screen'>
      {/* 페이지 헤더 */}
      <div className='border-b border-border px-4 md:px-8 py-8 bg-secondary/30'>
        <p className='text-[11px] tracking-[0.3em] text-accent uppercase font-semibold mb-2'>
          ALL PRODUCTS
        </p>
        <div className='flex items-end justify-between'>
          <h1 className='font-editorial text-3xl md:text-[2.25rem] font-bold tracking-tight'>
            전체 상품
          </h1>
          <span className='text-sm text-muted-foreground'>
            {isLoading ? '...' : (
              <>
                <span className='font-semibold text-foreground'>{totalElements}</span>개의 상품
              </>
            )}
          </span>
        </div>
      </div>

      <div className='flex gap-8 px-4 md:px-8 py-8'>
        {/* 데스크톱 필터 사이드바 */}
        <FilterSidebar
          filter={filter}
          onChange={handleFilterChange}
          totalCount={totalElements}
        />

        {/* 메인 콘텐츠 */}
        <div className='flex-1 min-w-0'>
          {/* 모바일 필터 + 정렬 툴바 */}
          <div className='flex items-center justify-between mb-6 gap-3'>
            <button
              onClick={() => setIsFilterOpen(true)}
              className='md:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm font-semibold hover:border-accent hover:text-accent transition-colors'
            >
              <SlidersHorizontal className='w-4 h-4' />
              필터
              {activeFilterCount > 0 && (
                <span className='bg-accent text-accent-foreground text-[10px] min-w-[18px] h-[18px] px-1 rounded-full font-bold flex items-center justify-center'>
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className='flex-1 md:flex-none md:ml-auto'>
              <SortSelect
                value={filter.sort}
                onChange={(sort) => {
                  setFilter((prev) => ({ ...prev, sort }));
                  setPage(0);
                }}
              />
            </div>
          </div>

          <ProductGrid
            products={products}
            isLoading={isLoading}
            onResetFilter={handleResetFilter}
          />

          {/* 페이지네이션 */}
          {!isLoading && totalPages > 1 && (
            <div className='flex items-center justify-center gap-2 mt-10'>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label='이전 페이지'
                className='flex items-center gap-1 px-4 py-2 rounded-full border border-border text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-colors'
              >
                <ChevronLeft className='w-4 h-4' />
                이전
              </button>

              <div className='flex gap-1'>
                {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`${i + 1}페이지`}
                    aria-current={page === i ? 'page' : undefined}
                    className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                      page === i
                        ? 'bg-accent text-accent-foreground'
                        : 'border border-border hover:border-accent hover:text-accent'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                aria-label='다음 페이지'
                className='flex items-center gap-1 px-4 py-2 rounded-full border border-border text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent hover:text-accent transition-colors'
              >
                다음
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 모바일 필터 시트 */}
      <FilterSheet
        filter={filter}
        onChange={handleFilterChange}
        totalCount={totalElements}
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
      />
    </div>
  );
}
