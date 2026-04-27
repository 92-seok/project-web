import { Skeleton } from '@/components/ui/skeleton';

interface IProductSectionSkeletonProps {
  title: string;
  count?: number;
}

export function ProductSectionSkeleton({ title, count = 8 }: IProductSectionSkeletonProps) {
  return (
    <section>
      <div className='flex items-center justify-between mb-6 border-b-2 border-primary pb-3'>
        <h2 className='text-lg font-black tracking-tight'>{title}</h2>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8'>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            <Skeleton className='aspect-square bg-muted mb-3 rounded-none' />
            <Skeleton className='h-4 w-3/4 mb-2 rounded-none' />
            <Skeleton className='h-3 w-1/2 rounded-none' />
          </div>
        ))}
      </div>
    </section>
  );
}
