import { Bone, Cat, Cookie, Dog, Soup } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { IFilterState } from '@/types/product';

interface IFilterSidebarProps {
  filter: IFilterState;
  onChange: (filter: IFilterState) => void;
  totalCount: number;
}

// 헤더 GNB 카테고리와 일관 — 강아지/고양이만 (그 외 펫타입은 시드/검색에는 존재하나 필터에서 제외)
const PET_OPTIONS = [
  { value: 'dog', label: '강아지', Icon: Dog },
  { value: 'cat', label: '고양이', Icon: Cat },
];

// 헤더 GNB 카테고리와 일관 — 사료/간식/용품 (toy/beauty/health 는 검색으로만 접근)
const CATEGORY_OPTIONS = [
  { value: 'food', label: '사료', Icon: Soup },
  { value: 'snack', label: '간식', Icon: Cookie },
  { value: 'supplies', label: '용품', Icon: Bone },
];

const BADGE_OPTIONS = ['NEW', 'BEST', 'SALE'];

const PRICE_OPTIONS = [
  { label: '전체', value: 0 },
  { label: '1만원 이하', value: 10000 },
  { label: '3만원 이하', value: 30000 },
  { label: '5만원 이하', value: 50000 },
  { label: '10만원 이하', value: 100000 },
];

const SECTION_TITLE_CLASS = 'text-[11px] tracking-[0.2em] font-bold uppercase text-muted-foreground mb-3';
const CHECKBOX_ROW_CLASS = 'flex items-center gap-2 py-1 cursor-pointer';

function toggleArray(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

const DEFAULT_FILTER: IFilterState = {
  pet: [],
  category: [],
  badge: [],
  priceMax: 0,
  sort: 'popular',
};

export function FilterSidebar({ filter, onChange, totalCount: _totalCount }: IFilterSidebarProps) {
  const handlePetToggle = (value: string) => {
    onChange({ ...filter, pet: toggleArray(filter.pet, value) });
  };

  const handleCategoryToggle = (value: string) => {
    onChange({ ...filter, category: toggleArray(filter.category, value) });
  };

  const handleBadgeToggle = (value: string) => {
    onChange({ ...filter, badge: toggleArray(filter.badge, value) });
  };

  const handlePriceMax = (value: number) => {
    onChange({ ...filter, priceMax: value });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_FILTER, sort: filter.sort });
  };

  return (
    <aside className='hidden md:block w-56 lg:w-60 shrink-0'>
      <div className='flex items-center justify-between mb-6'>
        <p className={SECTION_TITLE_CLASS + ' mb-0'}>FILTER</p>
        <button
          onClick={handleReset}
          className='text-[11px] tracking-wide text-muted-foreground underline underline-offset-2'
        >
          초기화
        </button>
      </div>

      {/* 반려동물 종류 */}
      <section className='mb-5'>
        <p className={SECTION_TITLE_CLASS}>반려동물 종류</p>
        {PET_OPTIONS.map(({ value, label, Icon }) => (
          <label key={value} className={CHECKBOX_ROW_CLASS}>
            <input
              type='checkbox'
              checked={filter.pet.includes(value)}
              onChange={() => handlePetToggle(value)}
              className='w-3.5 h-3.5 accent-foreground cursor-pointer'
            />
            <span className='text-sm flex items-center gap-2'>
              <Icon className='w-4 h-4 text-muted-foreground' strokeWidth={1.6} />
              {label}
            </span>
          </label>
        ))}
      </section>

      <Separator className='mb-5' />

      {/* 상품 카테고리 */}
      <section className='mb-5'>
        <p className={SECTION_TITLE_CLASS}>카테고리</p>
        {CATEGORY_OPTIONS.map(({ value, label, Icon }) => (
          <label key={value} className={CHECKBOX_ROW_CLASS}>
            <input
              type='checkbox'
              checked={filter.category.includes(value)}
              onChange={() => handleCategoryToggle(value)}
              className='w-3.5 h-3.5 accent-foreground cursor-pointer'
            />
            <span className='text-sm flex items-center gap-2'>
              <Icon className='w-4 h-4 text-muted-foreground' strokeWidth={1.6} />
              {label}
            </span>
          </label>
        ))}
      </section>

      <Separator className='mb-5' />

      {/* 상품 라벨 */}
      <section className='mb-5'>
        <p className={SECTION_TITLE_CLASS}>상품 라벨</p>
        {BADGE_OPTIONS.map((badge) => (
          <label key={badge} className={CHECKBOX_ROW_CLASS}>
            <input
              type='checkbox'
              checked={filter.badge.includes(badge)}
              onChange={() => handleBadgeToggle(badge)}
              className='w-3.5 h-3.5 accent-foreground cursor-pointer'
            />
            <span className='text-sm tracking-wide'>{badge}</span>
          </label>
        ))}
      </section>

      <Separator className='mb-5' />

      {/* 가격대 */}
      <section className='mb-5'>
        <p className={SECTION_TITLE_CLASS}>가격대</p>
        <div className='flex flex-wrap gap-1.5'>
          {PRICE_OPTIONS.map((opt) => {
            const isActive = filter.priceMax === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handlePriceMax(opt.value)}
                className={`text-xs px-3 py-1.5 border transition-colors ${
                  isActive
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-border hover:border-foreground'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
