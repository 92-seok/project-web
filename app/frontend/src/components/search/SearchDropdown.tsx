import { Clock, Search, X } from 'lucide-react';
import type { IProduct } from '@/types/product';

interface ISearchDropdownProps {
  query: string;
  suggestions: IProduct[];
  recentSearches: string[];
  popularKeywords: string[];
  onSelect: (query: string) => void;
  onRemoveRecent: (keyword: string) => void;
}

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return <span className='text-sm'>{text}</span>;
  return (
    <span className='text-sm'>
      {text.slice(0, idx)}
      <strong className='text-foreground'>{text.slice(idx, idx + highlight.length)}</strong>
      {text.slice(idx + highlight.length)}
    </span>
  );
}

export function SearchDropdown({
  query,
  suggestions,
  recentSearches,
  popularKeywords,
  onSelect,
  onRemoveRecent,
}: ISearchDropdownProps) {
  return (
    <div className='absolute top-full left-0 right-0 z-50 bg-background border border-t-0 border-foreground/10 shadow-lg'>
      {/* 자동완성 결과 (입력값 있을 때) */}
      {query.trim().length > 0 && suggestions.length > 0 && (
        <div className='py-2'>
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelect(product.name)}
              className='w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary text-left'
            >
              <Search className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
              <HighlightText text={product.name} highlight={query} />
            </button>
          ))}
        </div>
      )}

      {/* 입력 없을 때: 최근 검색어 + 인기 검색어 */}
      {query.trim().length === 0 && (
        <div className='py-3'>
          {recentSearches.length > 0 && (
            <div className='mb-3'>
              <p className='text-[10px] tracking-[0.2em] font-bold uppercase text-muted-foreground px-4 mb-2'>
                최근 검색
              </p>
              {recentSearches.map((keyword) => (
                <div
                  key={keyword}
                  className='flex items-center justify-between px-4 py-1.5 hover:bg-secondary'
                >
                  <button
                    onClick={() => onSelect(keyword)}
                    className='flex items-center gap-2 text-sm flex-1 text-left'
                  >
                    <Clock className='w-3.5 h-3.5 text-muted-foreground' />
                    {keyword}
                  </button>
                  <button
                    onClick={() => onRemoveRecent(keyword)}
                    className='text-muted-foreground hover:text-foreground p-1'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <p className='text-[10px] tracking-[0.2em] font-bold uppercase text-muted-foreground px-4 mb-2'>
              인기 검색어
            </p>
            {popularKeywords.map((keyword, i) => (
              <button
                key={keyword}
                onClick={() => onSelect(keyword)}
                className='w-full flex items-center gap-3 px-4 py-1.5 hover:bg-secondary text-left'
              >
                <span className='text-[11px] font-bold text-primary w-4'>{i + 1}</span>
                <span className='text-sm'>{keyword}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 자동완성 결과 없을 때 */}
      {query.trim().length > 0 && suggestions.length === 0 && (
        <div className='px-4 py-4 text-sm text-muted-foreground text-center'>
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
}
