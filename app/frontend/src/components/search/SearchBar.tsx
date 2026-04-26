import { useMemo, useRef, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { SearchDropdown } from './SearchDropdown';

const POPULAR_KEYWORDS = ['강아지 사료', '고양이 간식', '프리미엄 사료', '강아지 장난감', '고양이 모래'];
const STORAGE_KEY = 'pawmart.recentSearches';

interface ISearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  size?: 'sm' | 'lg';
}

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(searches: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export function SearchBar({
  initialValue = '',
  onSearch,
  placeholder = '상품을 검색해보세요',
  autoFocus = false,
  size = 'sm',
}: ISearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (value.trim().length < 1) return [];
    return MOCK_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...recentSearches.filter((k) => k !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    saveRecentSearches(updated);

    onSearch(trimmed);
    setIsFocused(false);
  }

  function removeRecent(keyword: string) {
    const updated = recentSearches.filter((k) => k !== keyword);
    setRecentSearches(updated);
    saveRecentSearches(updated);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch(value);
    }
  }

  return (
    <div className='relative w-full' ref={containerRef}>
      <div
        className={`flex items-center border transition-colors ${
          isFocused ? 'border-foreground' : 'border-foreground/20'
        } ${size === 'lg' ? 'h-12' : 'h-9'}`}
      >
        <Search
          className={`shrink-0 text-muted-foreground ${size === 'lg' ? 'w-5 h-5 ml-4' : 'w-4 h-4 ml-3'}`}
        />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`flex-1 bg-transparent outline-none px-3 ${size === 'lg' ? 'text-base' : 'text-sm'}`}
        />
        {value && (
          <button
            onClick={() => setValue('')}
            className='shrink-0 mr-2 p-1 text-muted-foreground hover:text-foreground'
            aria-label='검색어 지우기'
          >
            <X className='w-4 h-4' />
          </button>
        )}
        {size === 'lg' && (
          <button
            onClick={() => handleSearch(value)}
            className='shrink-0 h-full px-5 bg-foreground text-background text-sm font-bold tracking-wide hover:opacity-80'
          >
            검색
          </button>
        )}
      </div>

      {isFocused && (
        <SearchDropdown
          query={value}
          suggestions={suggestions}
          recentSearches={recentSearches}
          popularKeywords={POPULAR_KEYWORDS}
          onSelect={handleSearch}
          onRemoveRecent={removeRecent}
        />
      )}
    </div>
  );
}
