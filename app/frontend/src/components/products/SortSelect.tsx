import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SortOption } from '@/types/product';

interface ISortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '신상품순' },
  { value: 'price-asc', label: '가격 낮은순' },
  { value: 'price-desc', label: '가격 높은순' },
  { value: 'rating', label: '별점순' },
];

export function SortSelect({ value, onChange }: ISortSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className='rounded-none border-border text-xs tracking-wide h-9 min-w-[120px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='rounded-none'>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className='text-xs'>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
