import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/home/ProductCard';
import type { IProduct } from '@/types/product';

interface IProductSectionProps {
  title: string;
  products: IProduct[];
  viewAllHref?: string;
}

export function ProductSection({ title, products, viewAllHref }: IProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section>
      {/* 섹션 헤더 */}
      <div className='flex items-end justify-between mb-6'>
        <div>
          <h2 className='font-editorial text-2xl md:text-[1.75rem] font-bold tracking-tight text-foreground'>
            {title}
          </h2>
          <div className='mt-2 h-px w-12 bg-accent' />
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className='text-xs font-semibold text-foreground/70 hover:text-accent transition-colors inline-flex items-center gap-1'
          >
            전체보기 <span aria-hidden>→</span>
          </Link>
        )}
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
