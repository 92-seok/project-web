import { Link } from 'react-router-dom';
import type { ICategory } from '@/types/product';

interface ICategorySectionProps {
  categories: ICategory[];
}

export function CategorySection({ categories }: ICategorySectionProps) {
  return (
    <div className='grid grid-cols-3 md:grid-cols-6 gap-3'>
      {categories.map((cat) => (
        <Link key={cat.id} to={cat.href} className='group text-center'>
          <div className='aspect-square bg-secondary flex items-center justify-center text-4xl mb-2 group-hover:bg-accent transition-colors'>
            {cat.emoji}
          </div>
          <p className='text-xs font-medium tracking-wide'>{cat.label}</p>
        </Link>
      ))}
    </div>
  );
}
