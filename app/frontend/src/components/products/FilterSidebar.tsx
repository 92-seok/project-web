import { Separator } from '@/components/ui/separator';
import type { IFilterState } from '@/types/product';

interface IFilterSidebarProps {
  filter: IFilterState;
  onChange: (filter: IFilterState) => void;
  totalCount: number;
}

const PET_OPTIONS = [
  { value: 'dog', label: '강아지', emoji: '🐕' },
  { value: 'cat', label: '고양이', emoji: '🐈' },
  { value: 'bird', label: '새', emoji: '🦜' },
  { value: 'fish', label: '물고기', emoji: '🐠' },
  { value: 'reptile', label: '파충류', emoji: '🦎' },
  { value: 'small', label: '소동물', emoji: '🐹' },
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
  badge: [],
  priceMax: 0,
  sort: 'popular',
};

export function FilterSidebar({ filter, onChange, totalCount: _totalCount }: IFilterSidebarProps) {
  const handlePetToggle = (value: string) => {
    onChange({ ...filter, pet: toggleArray(filter.pet, value) });
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
    <aside className='hidden md:block w-56 shrink-0'>
      <div className='flex items-center justify-between mb-6'>
        <p className={SECTION_TITLE_CLASS + ' mb-0'}>FILTER</p>
        <button
          onClick={handleReset}
          className='text-[11px] tracking-wide text-muted-foreground underline underline-offset-2'
        >
          초기화
        </button>
      </div>

      {/* 반려동물 타입 */}
      <section className='mb-5'>
        <p className={SECTION_TITLE_CLASS}>반려동물</p>
        {PET_OPTIONS.map((opt) => (
          <label key={opt.value} className={CHECKBOX_ROW_CLASS}>
            <input
              type='checkbox'
              checked={filter.pet.includes(opt.value)}
              onChange={() => handlePetToggle(opt.value)}
              className='w-3.5 h-3.5 accent-foreground cursor-pointer'
            />
            <span className='text-sm'>
              {opt.emoji} {opt.label}
            </span>
          </label>
        ))}
      </section>

      <Separator className='mb-5' />

      {/* 상태 */}
      <section className='mb-5'>
        <p className={SECTION_TITLE_CLASS}>상태</p>
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

      {/* 최대 가격 */}
      <section className='mb-5'>
        <p className={SECTION_TITLE_CLASS}>최대 가격</p>
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
