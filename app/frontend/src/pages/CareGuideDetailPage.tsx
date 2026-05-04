import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { CARE_GUIDES, type ICareGuide, type ICareGuideSection } from '@/data/careGuides';
import { productApi } from '@/api/productApi';
import { toIProduct } from '@/hooks/useProducts';
import type { IProduct } from '@/types/product';
import { ProductCard } from '@/components/home/ProductCard';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function renderSection(section: ICareGuideSection, idx: number) {
  switch (section.type) {
    case 'heading':
      return (
        <h2
          key={idx}
          className='font-editorial text-2xl font-bold mt-10 mb-4 text-foreground'
        >
          {section.text}
        </h2>
      );
    case 'paragraph':
      return (
        <p key={idx} className='text-base text-foreground/80 leading-8 mb-5'>
          {section.text}
        </p>
      );
    case 'tip':
      return (
        <div
          key={idx}
          className='bg-secondary border-l-4 border-accent px-5 py-4 my-6 rounded-r-lg'
        >
          <p className='text-sm font-semibold text-foreground'>💡 {section.text}</p>
        </div>
      );
    case 'checklist':
      return (
        <ul key={idx} className='my-6 space-y-2'>
          {section.items?.map((item, i) => (
            <li key={i} className='flex items-start gap-2 text-sm text-foreground/80'>
              <span className='text-accent font-bold mt-0.5'>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

function RelatedProductsSection({ productIds }: { productIds: number[] }) {
  const [fetched, setFetched] = useState<IProduct[]>([]);

  // productIds 배열은 부모 렌더마다 새로 생성될 수 있어 키로 직렬화하여 의존성 비교
  const idsKey = useMemo(() => productIds.slice(0, 4).join(','), [productIds]);

  // 빈 idsKey면 fetched 결과 무시 — derive로 처리해 effect 내 동기 setState 회피
  const products = idsKey ? fetched : [];

  useEffect(() => {
    if (!idsKey) return;

    let cancelled = false;
    const ids = idsKey.split(',').map(Number).filter((n) => !isNaN(n));

    Promise.allSettled(ids.map((id) => productApi.getProduct(id)))
      .then((results) => {
        if (cancelled) return;
        const fulfilled = results
          .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof productApi.getProduct>>> => r.status === 'fulfilled')
          .map((r) => toIProduct(r.value));
        setFetched(fulfilled);
      });

    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  if (products.length === 0) return null;

  return (
    <section className='py-12 px-4 md:px-8 lg:px-12 bg-secondary'>
      <div className='max-w-[1440px] mx-auto'>
        <h2 className='font-editorial text-2xl font-bold mb-6'>함께 사용하면 좋은 상품</h2>
        <div className='overflow-x-auto'>
          <div className='flex gap-4 pb-2' style={{ minWidth: 'max-content' }}>
            {products.map((product) => (
              <div key={product.id} className='w-52 flex-shrink-0'>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OtherGuidesSection({
  currentGuide,
}: {
  currentGuide: ICareGuide;
}) {
  const others = useMemo(
    () => CARE_GUIDES.filter((g) => g.tag === currentGuide.tag && g.id !== currentGuide.id).slice(0, 3),
    [currentGuide],
  );

  if (others.length === 0) return null;

  return (
    <section className='py-12 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto'>
      <h2 className='font-editorial text-2xl md:text-3xl font-bold mb-6'>다른 케어 가이드</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {others.map((guide) => (
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
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-[10px] tracking-widest font-bold text-accent uppercase'>
                    {guide.tag}
                  </span>
                  <span className='text-[10px] text-muted-foreground'>·</span>
                  <span className='text-[10px] text-muted-foreground'>{guide.readTime}분 읽기</span>
                </div>
                <h3 className='font-editorial text-lg font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2'>
                  {guide.title}
                </h3>
                <p className='text-sm text-muted-foreground leading-relaxed line-clamp-2'>
                  {guide.desc}
                </p>
                <div className='flex items-center gap-1 mt-4 text-xs text-accent font-semibold'>
                  자세히 보기 <span aria-hidden>→</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CareGuideDetailPage() {
  const { id } = useParams<{ id: string }>();
  const guide = CARE_GUIDES.find((g) => g.id === id);

  if (!guide) {
    return <Navigate to='/care-guides' replace />;
  }

  const petLabel =
    guide.petType === 'dog' ? '강아지' : guide.petType === 'cat' ? '고양이' : '강아지 · 고양이';

  return (
    <div className='bg-background'>
      {/* 히어로 이미지 */}
      <div className='relative w-full aspect-[21/9] overflow-hidden bg-secondary'>
        <img
          src={guide.imageUrl}
          alt={guide.title}
          className='w-full h-full object-cover'
          loading='eager'
        />
        {/* 그라디언트 오버레이 */}
        <div className='absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent' />

        {/* 히어로 텍스트 */}
        <div className='absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10 md:pb-14 max-w-[1440px] mx-auto'>
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-[10px] tracking-widest font-bold text-accent bg-card/90 px-3 py-1 rounded-full uppercase'>
              {guide.tag}
            </span>
            <span className='text-[10px] text-white/80 bg-white/20 px-3 py-1 rounded-full'>
              {petLabel}
            </span>
          </div>
          <h1 className='font-editorial text-3xl md:text-5xl font-bold text-white leading-snug mb-3 max-w-3xl'>
            {guide.title}
          </h1>
          <p className='text-sm md:text-base text-white/80 max-w-2xl leading-relaxed mb-4'>
            {guide.desc}
          </p>
          <div className='flex items-center gap-3 text-xs text-white/70'>
            <span>읽기 {guide.readTime}분</span>
            <span>·</span>
            <span>{formatDate(guide.publishedAt)}</span>
          </div>
        </div>
      </div>

      {/* 브레드크럼 */}
      <div className='px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto pt-6 pb-2'>
        <nav className='flex items-center gap-2 text-xs text-muted-foreground' aria-label='breadcrumb'>
          <Link to='/' className='hover:text-accent transition-colors'>홈</Link>
          <span>/</span>
          <Link to='/care-guides' className='hover:text-accent transition-colors'>케어 가이드</Link>
          <span>/</span>
          <span className='text-foreground/70 line-clamp-1 max-w-48'>{guide.title}</span>
        </nav>
      </div>

      {/* 본문 — 가독성 위해 폭 제한 */}
      <article className='max-w-3xl mx-auto px-4 md:px-6 py-10 pb-16'>
        {guide.content.map((section, idx) => renderSection(section, idx))}
      </article>

      {/* 관련 상품 섹션 */}
      <RelatedProductsSection productIds={guide.relatedProductIds} />

      {/* 다른 가이드 */}
      <OtherGuidesSection currentGuide={guide} />

      {/* 전체 목록 CTA */}
      <div className='py-10 px-4 text-center border-t border-border'>
        <Link
          to='/care-guides'
          className='inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors'
        >
          ← 모든 케어 가이드 보기
        </Link>
      </div>
    </div>
  );
}
