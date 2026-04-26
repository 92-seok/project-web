import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-5 px-4 text-center bg-background'>
      {/* 일러스트 영역 */}
      <div className='relative mb-2'>
        <div className='absolute inset-0 rounded-full bg-accent/10 blur-3xl scale-150' aria-hidden />
        <div className='relative w-24 h-24 rounded-full bg-secondary flex items-center justify-center border border-border'>
          <PawPrint className='w-10 h-10 text-accent' strokeWidth={1.5} />
        </div>
      </div>

      <p className='text-[10px] tracking-[0.3em] text-accent uppercase font-semibold'>
        404 NOT FOUND
      </p>
      <h1 className='font-editorial text-3xl md:text-4xl font-bold'>
        페이지를 찾을 수 없어요
      </h1>
      <p className='text-sm text-muted-foreground max-w-xs leading-relaxed'>
        요청하신 페이지가 존재하지 않거나<br />
        다른 곳으로 이동했어요.
      </p>

      <div className='flex flex-col sm:flex-row gap-3 mt-3'>
        <Link
          to='/'
          className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 hover:-translate-y-0.5 transition-all motion-reduce:transform-none'
        >
          홈으로 돌아가기 →
        </Link>
        <Link
          to='/products'
          className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-semibold text-foreground hover:border-accent hover:text-accent transition-colors'
        >
          상품 둘러보기
        </Link>
      </div>
    </div>
  );
}
