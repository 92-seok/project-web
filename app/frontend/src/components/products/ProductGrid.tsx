import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/home/ProductCard';
import type { IProduct } from '@/types/product';

interface IProductGridProps {
  products: IProduct[];
  isLoading?: boolean;
  onResetFilter?: () => void;
}

function SkeletonCard() {
  return (
    <div>
      <Skeleton className='aspect-square bg-muted mb-3 rounded-none' />
      <Skeleton className='h-4 w-3/4 mb-2 rounded-none' />
      <Skeleton className='h-3 w-1/2 rounded-none' />
    </div>
  );
}

export function ProductGrid({ products, isLoading = false, onResetFilter }: IProductGridProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10'>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-24 gap-4'>
        <p className='text-sm text-muted-foreground'>검색 결과가 없습니다</p>
        {onResetFilter && (
          <button
            onClick={onResetFilter}
            className='text-xs px-4 py-2 border border-foreground font-medium tracking-wide'
          >
            필터 초기화
          </button>
        )}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
