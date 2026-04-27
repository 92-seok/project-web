import { useState } from 'react';
import { Bone, Cat, Cookie, Dog, Soup } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import type { IFilterState } from '@/types/product';

interface IFilterSheetProps {
  filter: IFilterState;
  onChange: (filter: IFilterState) => void;
  totalCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PET_OPTIONS = [
  { value: 'dog', label: '강아지', Icon: Dog },
  { value: 'cat', label: '고양이', Icon: Cat },
];

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

export function FilterSheet({ filter, onChange, totalCount, open, onOpenChange }: IFilterSheetProps) {
  const [draft, setDraft] = useState<IFilterState>(filter);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setDraft(filter);
    onOpenChange(isOpen);
  };

  const handleApply = () => {
    onChange(draft);
    onOpenChange(false);
  };

  const handleReset = () => {
    setDraft({ pet: [], category: [], badge: [], priceMax: 0, sort: filter.sort });
  };

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent side='bottom' className='h-[85vh] overflow-y-auto rounded-t-none p-0' showCloseButton={false}>
        <SheetHeader className='px-5 pt-5 pb-4 border-b'>
          <SheetTitle className='text-sm font-bold tracking-[0.1em] uppercase'>Filter</SheetTitle>
        </SheetHeader>

        <div className='px-5 py-5 space-y-5 pb-32'>
          {/* 반려동물 종류 */}
          <section>
            <p className={SECTION_TITLE_CLASS}>반려동물 종류</p>
            {PET_OPTIONS.map(({ value, label, Icon }) => (
              <label key={value} className={CHECKBOX_ROW_CLASS}>
                <input
                  type='checkbox'
                  checked={draft.pet.includes(value)}
                  onChange={() => setDraft((prev) => ({ ...prev, pet: toggleArray(prev.pet, value) }))}
                  className='w-3.5 h-3.5 accent-foreground cursor-pointer'
                />
                <span className='text-sm flex items-center gap-2'>
                  <Icon className='w-4 h-4 text-muted-foreground' strokeWidth={1.6} />
                  {label}
                </span>
              </label>
            ))}
          </section>

          <Separator />

          {/* 카테고리 */}
          <section>
            <p className={SECTION_TITLE_CLASS}>카테고리</p>
            {CATEGORY_OPTIONS.map(({ value, label, Icon }) => (
              <label key={value} className={CHECKBOX_ROW_CLASS}>
                <input
                  type='checkbox'
                  checked={draft.category.includes(value)}
                  onChange={() =>
                    setDraft((prev) => ({ ...prev, category: toggleArray(prev.category, value) }))
                  }
                  className='w-3.5 h-3.5 accent-foreground cursor-pointer'
                />
                <span className='text-sm flex items-center gap-2'>
                  <Icon className='w-4 h-4 text-muted-foreground' strokeWidth={1.6} />
                  {label}
                </span>
              </label>
            ))}
          </section>

          <Separator />

          {/* 상품 라벨 */}
          <section>
            <p className={SECTION_TITLE_CLASS}>상품 라벨</p>
            {BADGE_OPTIONS.map((badge) => (
              <label key={badge} className={CHECKBOX_ROW_CLASS}>
                <input
                  type='checkbox'
                  checked={draft.badge.includes(badge)}
                  onChange={() => setDraft((prev) => ({ ...prev, badge: toggleArray(prev.badge, badge) }))}
                  className='w-3.5 h-3.5 accent-foreground cursor-pointer'
                />
                <span className='text-sm tracking-wide'>{badge}</span>
              </label>
            ))}
          </section>

          <Separator />

          {/* 가격대 */}
          <section>
            <p className={SECTION_TITLE_CLASS}>가격대</p>
            <div className='flex flex-wrap gap-1.5'>
              {PRICE_OPTIONS.map((opt) => {
                const isActive = draft.priceMax === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDraft((prev) => ({ ...prev, priceMax: opt.value }))}
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
        </div>

        {/* 하단 고정 버튼 */}
        <div className='fixed bottom-0 left-0 right-0 flex gap-3 px-5 py-4 bg-background border-t'>
          <button
            onClick={handleReset}
            className='flex-1 py-3 border border-foreground text-sm font-bold tracking-wide'
          >
            초기화
          </button>
          <button
            onClick={handleApply}
            className='flex-[2] py-3 bg-foreground text-background text-sm font-bold tracking-wide'
          >
            적용 ({totalCount}개 상품)
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
