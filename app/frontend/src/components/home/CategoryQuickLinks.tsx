import { Link } from 'react-router-dom';
import { Dog, Cat, Soup, Cookie, Bone, Tag } from 'lucide-react';

interface IQuickLink {
  id: string;
  label: string;
  Icon: React.ElementType;
  href: string;
  tone: 'sage' | 'terracotta' | 'honey' | 'mint' | 'olive' | 'sand';
}

const QUICK_LINKS: IQuickLink[] = [
  { id: 'dog', label: '강아지', Icon: Dog, href: '/products?pet=dog', tone: 'sage' },
  { id: 'cat', label: '고양이', Icon: Cat, href: '/products?pet=cat', tone: 'mint' },
  { id: 'food', label: '사료', Icon: Soup, href: '/products?category=food', tone: 'honey' },
  { id: 'snack', label: '간식', Icon: Cookie, href: '/products?category=snack', tone: 'olive' },
  { id: 'supplies', label: '용품', Icon: Bone, href: '/products?category=supplies', tone: 'sand' },
  { id: 'sale', label: '특가', Icon: Tag, href: '/products?sort=sale', tone: 'terracotta' },
];

const TONE_BG: Record<IQuickLink['tone'], string> = {
  sage: 'bg-[var(--badge-care)]/14 text-[var(--badge-care)]',
  mint: 'bg-[var(--badge-dental)]/14 text-[var(--badge-dental)]',
  honey: 'bg-[var(--badge-joint)]/16 text-[var(--badge-joint)]',
  olive: 'bg-[var(--badge-organic)]/14 text-[var(--badge-organic)]',
  sand: 'bg-secondary text-foreground/70',
  terracotta: 'bg-[var(--badge-vet)]/14 text-[var(--badge-vet)]',
};

export function CategoryQuickLinks() {
  return (
    <div className='grid grid-cols-6 gap-3 md:gap-5'>
      {QUICK_LINKS.map(({ id, label, Icon, href, tone }) => (
        <Link
          key={id}
          to={href}
          className='group flex flex-col items-center gap-2 transition-transform hover:-translate-y-0.5 motion-reduce:transform-none'
        >
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all group-hover:shadow-md ${TONE_BG[tone]}`}
          >
            <Icon className='w-7 h-7 md:w-8 md:h-8' strokeWidth={1.6} />
          </div>
          <span className='text-xs md:text-sm font-semibold text-foreground'>{label}</span>
        </Link>
      ))}
    </div>
  );
}
