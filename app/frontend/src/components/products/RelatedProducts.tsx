import { useProducts, toIProduct } from '@/hooks/useProducts';
import { ProductCard } from '@/components/home/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface IRelatedProductsProps {
  currentId: number;
  category: string;
}

function RelatedSkeleton() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <Skeleton className='aspect-square bg-muted mb-3 rounded-none' />
          <Skeleton className='h-4 w-3/4 mb-2 rounded-none' />
          <Skeleton className='h-3 w-1/2 rounded-none' />
        </div>
      ))}
    </div>
  );
}

export function RelatedProducts({ currentId, category }: IRelatedProductsProps) {
  const { data, isLoading } = useProducts({ petType: category, size: 5 });

  if (isLoading) {
    return (
      <section className='px-4 md:px-8 py-12 border-t'>
        <div className='flex items-center gap-4 mb-8'>
          <div className='h-px flex-1 bg-border' />
          <h2 className='text-sm font-black tracking-[0.2em] uppercase'>Related Products</h2>
          <div className='h-px flex-1 bg-border' />
        </div>
        <RelatedSkeleton />
      </section>
    );
  }

  const related = (data?.content ?? [])
    .map(toIProduct)
    .filter((p) => p.id !== currentId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className='px-4 md:px-8 py-12 border-t'>
      <div className='flex items-center gap-4 mb-8'>
        <div className='h-px flex-1 bg-border' />
        <h2 className='text-sm font-black tracking-[0.2em] uppercase'>Related Products</h2>
        <div className='h-px flex-1 bg-border' />
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8'>
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
