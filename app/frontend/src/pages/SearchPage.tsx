import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchX, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts, toIProduct } from '@/hooks/useProducts';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { FilterSheet } from '@/components/products/FilterSheet';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SortSelect } from '@/components/products/SortSelect';
import type { IFilterState, SortOption } from '@/types/product';

const POPULAR_KEYWORDS = [
  '강아지 사료',
  '고양이 간식',
  '프리미엄 사료',
  '강아지 장난감',
  '고양이 모래',
  '반려견 하네스',
];

const DEFAULT_FILTER: IFilterState = {
  pet: [],
  category: [],
  badge: [],
  priceMax: 0,
  sort: 'popular',
};

const SORT_MAP: Record<SortOption, string> = {
  popular: 'best',
  newest: 'newest',
  'price-asc': 'price-asc',
  'price-desc': 'price-desc',
  rating: 'rating',
};

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  // debounce: 300ms 후 실제 API 호출에 사용할 키워드
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 필터 상태 — 검색 결과 위에 추가 적용
  const [filter, setFilter] = useState<IFilterState>(DEFAULT_FILTER);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    debounceRef.current && clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      debounceRef.current && clearTimeout(debounceRef.current);
    };
  }, [query]);

  // 백엔드 API 는 단일 값만 받음 → 1개 선택일 때만 적용
  const petType = filter.pet.length === 1 ? filter.pet[0] : undefined;
  const category = filter.category.length === 1 ? filter.category[0] : undefined;
  const badge = filter.badge.length === 1 ? filter.badge[0] : undefined;

  const { data, isLoading, error } = useProducts(
    debouncedQuery.trim()
      ? {
          keyword: debouncedQuery.trim(),
          petType,
          category,
          badge,
          sort: SORT_MAP[filter.sort],
          size: 40,
        }
      : { size: 0 },
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const results = debouncedQuery.trim() ? (data?.content ?? []).map(toIProduct) : [];
  const totalElements = data?.totalElements ?? 0;

  const activeFilterCount =
    filter.pet.length +
    filter.category.length +
    filter.badge.length +
    (filter.priceMax > 0 ? 1 : 0);

  const handleResetFilter = () => {
    setFilter({ ...DEFAULT_FILTER, sort: filter.sort });
  };

  return (
    <div className='min-h-screen'>
      {/* 검색바 영역 */}
      <div className='border-b border-border bg-secondary/30'>
        <div className='max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8'>
          <p className='text-[10px] tracking-[0.3em] text-accent uppercase font-semibold mb-2'>
            SEARCH
          </p>
          <h1 className='font-editorial text-2xl md:text-[2rem] lg:text-[2.25rem] font-bold mb-4'>
            무엇을 찾고 계세요?
          </h1>
          <SearchBar
            initialValue={query}
            onSearch={(q) => setSearchParams({ q })}
            size='lg'
            autoFocus={!query}
          />
          {debouncedQuery && !isLoading && (
            <p className='mt-3 text-sm text-muted-foreground'>
              <span className='font-semibold text-foreground'>"{debouncedQuery}"</span> 검색 결과{' '}
              <span className='font-semibold text-foreground'>{totalElements}</span>개
            </p>
          )}
        </div>
      </div>

      {/* 검색어 없음 (초기 상태) */}
      {!debouncedQuery && (
        <div className='max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-10'>
          <p className='text-[10px] tracking-[0.3em] font-semibold uppercase text-accent mb-1'>
            POPULAR KEYWORDS
          </p>
          <h2 className='font-editorial text-lg font-bold mb-5'>요즘 많이 찾고 있어요</h2>
          <div className='flex flex-wrap gap-2'>
            {POPULAR_KEYWORDS.map((kw) => (
              <button
                key={kw}
                onClick={() => setSearchParams({ q: kw })}
                className='px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground/80 hover:border-accent hover:text-accent transition-colors'
              >
                #{kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 검색어 있음 → 필터 + 결과 영역 */}
      {debouncedQuery && (
        <div className='max-w-[1440px] mx-auto flex gap-8 lg:gap-10 px-4 md:px-8 lg:px-12 py-10'>
          {/* 데스크톱 필터 사이드바 */}
          <FilterSidebar filter={filter} onChange={setFilter} totalCount={totalElements} />

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
                  onChange={(sort) => setFilter((prev) => ({ ...prev, sort }))}
                />
              </div>
            </div>

            <ProductGrid
              products={results}
              isLoading={isLoading}
              onResetFilter={handleResetFilter}
            />

            {/* 결과 없음 (필터 변경 안내) — ProductGrid 가 빈 배열 처리하지만, 검색 키워드 자체에 결과 없을 때는 별도 안내 */}
            {!isLoading && results.length === 0 && activeFilterCount === 0 && (
              <div className='flex flex-col items-center justify-center py-20 gap-4 text-center'>
                <div className='w-16 h-16 rounded-full bg-secondary flex items-center justify-center'>
                  <SearchX className='w-8 h-8 text-muted-foreground' strokeWidth={1.4} />
                </div>
                <p className='font-editorial text-xl font-bold'>
                  "{debouncedQuery}" 결과가 없어요
                </p>
                <p className='text-sm text-muted-foreground'>
                  다른 검색어를 입력하거나 카테고리를 탐색해보세요
                </p>
                <Link
                  to='/products'
                  className='inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 hover:-translate-y-0.5 transition-all motion-reduce:transform-none'
                >
                  전체 상품 보기 →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 모바일 필터 시트 */}
      <FilterSheet
        filter={filter}
        onChange={setFilter}
        totalCount={totalElements}
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
      />
    </div>
  );
}
