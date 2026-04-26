import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts, toIProduct } from '@/hooks/useProducts';
import { SearchBar } from '@/components/search/SearchBar';
import { ProductCard } from '@/components/home/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const POPULAR_KEYWORDS = [
  '강아지 사료',
  '고양이 간식',
  '프리미엄 사료',
  '강아지 장난감',
  '고양이 모래',
  '반려견 하네스',
];

function SearchResultSkeleton() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <Skeleton className='aspect-square bg-muted mb-3 rounded-none' />
          <Skeleton className='h-4 w-3/4 mb-2 rounded-none' />
          <Skeleton className='h-3 w-1/2 rounded-none' />
        </div>
      ))}
    </div>
  );
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  // debounce: 300ms 후 실제 API 호출에 사용할 키워드
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    debounceRef.current && clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      debounceRef.current && clearTimeout(debounceRef.current);
    };
  }, [query]);

  const { data, isLoading, error } = useProducts(
    debouncedQuery.trim() ? { keyword: debouncedQuery.trim(), size: 40 } : { size: 0 },
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const results = debouncedQuery.trim() ? (data?.content ?? []).map(toIProduct) : [];
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className='min-h-screen'>
      {/* 검색바 영역 */}
      <div className='border-b border-border px-4 md:px-8 py-8 bg-secondary/30'>
        <p className='text-[10px] tracking-[0.3em] text-accent uppercase font-semibold mb-2'>
          SEARCH
        </p>
        <h1 className='font-editorial text-2xl font-bold mb-4'>무엇을 찾고 계세요?</h1>
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

      {/* 로딩 */}
      {isLoading && debouncedQuery && (
        <div className='px-4 md:px-8 py-8'>
          <SearchResultSkeleton />
        </div>
      )}

      {/* 결과 없음 */}
      {!isLoading && debouncedQuery && results.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 gap-4 text-center px-4'>
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

      {/* 검색어 없음 (초기 상태) */}
      {!debouncedQuery && (
        <div className='px-4 md:px-8 py-10'>
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

      {/* 검색 결과 그리드 */}
      {!isLoading && results.length > 0 && (
        <div className='px-4 md:px-8 py-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10'>
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
