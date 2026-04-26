import { Link } from 'react-router-dom';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductSection } from '@/components/home/ProductSection';
import { ProductSectionSkeleton } from '@/components/home/ProductSectionSkeleton';
import { CategoryQuickLinks } from '@/components/home/CategoryQuickLinks';
import { TrustStrip } from '@/components/home/TrustStrip';
import { useProducts, toIProduct } from '@/hooks/useProducts';
import { CARE_GUIDES } from '@/data/careGuides';

function BestSection() {
  const { data, isLoading } = useProducts({ sort: 'best', size: 8 });
  if (isLoading) return <ProductSectionSkeleton title='베스트 상품' />;
  const products = (data?.content ?? []).map(toIProduct);
  return <ProductSection title='베스트 상품' products={products} viewAllHref='/products' />;
}

function NewSection() {
  const { data, isLoading } = useProducts({ sort: 'newest', size: 8 });
  if (isLoading) return <ProductSectionSkeleton title='신상품' />;
  const products = (data?.content ?? []).map(toIProduct);
  return <ProductSection title='신상품' products={products} viewAllHref='/products?sort=new' />;
}

function MdSection() {
  const { data, isLoading } = useProducts({ sort: 'rating', size: 8 });
  if (isLoading) return <ProductSectionSkeleton title='MD 추천' />;
  const products = (data?.content ?? []).map(toIProduct);
  return <ProductSection title='MD 추천' products={products} viewAllHref='/products?sort=sale' />;
}

export function HomePage() {
  return (
    <div className='bg-background'>
      {/* 1. 히어로 — 풀블리드 */}
      <HeroSection />

      {/* 2. 카테고리 퀵링크 */}
      <section className='py-10 md:py-12 px-4 md:px-8 max-w-screen-xl mx-auto'>
        <CategoryQuickLinks />
      </section>

      {/* 3. 신뢰 띠 */}
      <TrustStrip />

      {/* 4. 베스트 상품 */}
      <section className='py-12 md:py-14 px-4 md:px-8 max-w-screen-xl mx-auto'>
        <BestSection />
      </section>

      {/* 5. 정기배송 프로모션 — Terracotta */}
      <section className='px-4 md:px-8 max-w-screen-xl mx-auto pb-10 md:pb-12'>
        <div className='relative overflow-hidden rounded-2xl bg-accent text-accent-foreground py-12 px-8 md:px-14 md:py-16'>
          <div className='relative z-10 max-w-2xl'>
            <p className='text-[11px] tracking-[0.3em] font-semibold uppercase opacity-80 mb-3'>
              SUBSCRIBE & SAVE
            </p>
            <h3 className='font-editorial text-3xl md:text-[2.5rem] font-bold leading-tight mb-4'>
              정기배송으로
              <br />
              매달 -10%, 빠짐없이
            </h3>
            <p className='text-sm md:text-base opacity-90 mb-6 leading-relaxed'>
              사료가 바닥날 일 없이, 매달 같은 날 새벽 문 앞으로.<br />
              언제든 해지·배송일 변경 자유로워요.
            </p>
            <Link
              to='/products'
              className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-foreground text-sm font-semibold hover:opacity-95 hover:-translate-y-0.5 transition-all motion-reduce:transform-none'
            >
              정기배송 둘러보기 <span aria-hidden>→</span>
            </Link>
          </div>
          {/* 장식 원형 — 무드 */}
          <div className='absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-accent-foreground/10' />
          <div className='absolute -right-8 top-8 w-32 h-32 rounded-full bg-accent-foreground/5 hidden md:block' />
        </div>
      </section>

      {/* 6. 신상품 */}
      <section className='py-12 md:py-14 px-4 md:px-8 max-w-screen-xl mx-auto'>
        <NewSection />
      </section>

      {/* 7. MD 추천 — Sand 배경 */}
      <section className='py-12 md:py-14 bg-secondary'>
        <div className='px-4 md:px-8 max-w-screen-xl mx-auto'>
          <MdSection />
        </div>
      </section>

      {/* 8. 에디토리얼 콘텐츠 */}
      <section className='py-12 md:py-16 px-4 md:px-8 max-w-screen-xl mx-auto'>
        <div className='mb-8 text-center'>
          <p className='text-[11px] tracking-[0.3em] font-semibold uppercase text-accent mb-2'>
            EDITORIAL
          </p>
          <h2 className='font-editorial text-3xl md:text-[2.25rem] font-bold tracking-tight'>
            오늘의 케어 가이드
          </h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {CARE_GUIDES.slice(0, 3).map((guide) => (
            <Link key={guide.id} to={`/care-guides/${guide.id}`} className='block'>
              <article className='group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all motion-reduce:transform-none'>
                <div className='aspect-[4/3] overflow-hidden bg-secondary'>
                  <img
                    src={guide.imageUrl}
                    alt={guide.title}
                    loading='lazy'
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out motion-reduce:transform-none'
                  />
                </div>
                <div className='p-5'>
                  <p className='text-[10px] tracking-[0.2em] font-bold text-accent uppercase mb-2'>
                    {guide.tag}
                  </p>
                  <h3 className='font-editorial text-lg font-bold mb-2 group-hover:text-accent transition-colors'>
                    {guide.title}
                  </h3>
                  <p className='text-sm text-muted-foreground leading-relaxed'>{guide.desc}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
        <div className='mt-8 text-center'>
          <Link
            to='/care-guides'
            className='inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors'
          >
            모든 가이드 보기 <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
