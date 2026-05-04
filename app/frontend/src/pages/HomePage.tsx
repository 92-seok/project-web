import { Link } from 'react-router-dom';
import { Gift, Star, Users, Package, Ticket } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductSection } from '@/components/home/ProductSection';
import { ProductSectionSkeleton } from '@/components/home/ProductSectionSkeleton';
import { CategoryQuickLinks } from '@/components/home/CategoryQuickLinks';
import { TrustStrip } from '@/components/home/TrustStrip';
import { PersonalizeSection } from '@/components/home/PersonalizeSection';
import { useProducts, toIProduct } from '@/hooks/useProducts';
import { CARE_GUIDES } from '@/data/careGuides';

interface IHeroBanner {
  tag: string;
  titleLine1: string;
  titleLine2: string;
  desc: string;
  ctaLabel: string;
  ctaHref: string;
  bg: string; // 카드 배경 + 텍스트 색상 클래스
  decorBg: string; // 우하단 장식 원 색상
  ctaBg: string; // CTA 버튼 배경
  ctaText: string; // CTA 버튼 텍스트 색상
}

const HERO_BANNERS: IHeroBanner[] = [
  {
    tag: 'BEST DEAL',
    titleLine1: '이번 주 베스트,',
    titleLine2: '최대 30% 할인',
    desc: '리뷰 평점 4.5 이상 인기 상품을\n이번 주만 더 저렴하게.',
    ctaLabel: '베스트 보러가기',
    ctaHref: '/products?sort=sale',
    bg: 'bg-primary text-primary-foreground',
    decorBg: 'bg-primary-foreground/10',
    ctaBg: 'bg-primary-foreground',
    ctaText: 'text-primary',
  },
  {
    tag: 'VET CARE',
    titleLine1: '수의사 1:1',
    titleLine2: '무료 채팅 상담',
    desc: '사료·건강·행동 고민까지,\n전문가와 채팅으로 바로 답을.',
    ctaLabel: '상담 시작하기',
    ctaHref: '/care-guides',
    bg: 'bg-[var(--badge-care)] text-white',
    decorBg: 'bg-white/10',
    ctaBg: 'bg-white',
    ctaText: 'text-[var(--badge-care)]',
  },
];

interface IPromoCard {
  Icon: React.ElementType;
  tag: string;
  title: string;
  desc: string;
  ctaLabel: string;
  ctaHref: string;
  // Tailwind 톤 — 디자인 시스템 변수 사용
  iconBg: string;
  iconColor: string;
  ribbonText: string;
}

const PROMO_CARDS: IPromoCard[] = [
  {
    Icon: Gift,
    tag: 'WELCOME',
    title: '신규 회원 첫 주문',
    desc: '5,000원 할인 쿠폰 + 무료배송 즉시 적용',
    ctaLabel: '회원가입하기',
    ctaHref: '/signup',
    iconBg: 'bg-[var(--badge-joint)]/14',
    iconColor: 'text-[var(--badge-joint)]',
    ribbonText: '신규 한정',
  },
  {
    Icon: Star,
    tag: 'REVIEW',
    title: '포토 후기 적립금',
    desc: '구매 상품에 사진 후기 작성 시 1,000원',
    ctaLabel: '후기 쓰러가기',
    ctaHref: '/mypage/orders',
    iconBg: 'bg-[var(--badge-care)]/14',
    iconColor: 'text-[var(--badge-care)]',
    ribbonText: '매번 적립',
  },
  {
    Icon: Users,
    tag: 'REFERRAL',
    title: '친구 초대 보상',
    desc: '초대한 분도, 가입한 분도 5% 적립',
    ctaLabel: '초대 코드 받기',
    ctaHref: '/mypage',
    iconBg: 'bg-[var(--badge-organic)]/14',
    iconColor: 'text-[var(--badge-organic)]',
    ribbonText: '양방향 적립',
  },
];

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
      {/* 1. 히어로 Bento — 메인 슬라이더 + 보조 카드 2개 */}
      <section className='max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-4'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4'>
          {/* 메인 hero — 좌측 2/3 */}
          <div className='lg:col-span-2'>
            <HeroSection />
          </div>

          {/* 보조 카드 — 우측 1/3, 모바일은 가로 2분할 */}
          <div className='grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4'>
            <Link
              to='/signup'
              className='group relative overflow-hidden rounded-2xl bg-[var(--badge-care)] text-white p-5 md:p-6 flex flex-col justify-between aspect-square lg:aspect-auto hover:-translate-y-0.5 hover:shadow-md transition-all motion-reduce:transform-none'
            >
              <div className='relative z-10'>
                <div className='inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 mb-3'>
                  <Ticket className='w-4 h-4' strokeWidth={1.8} />
                </div>
                <p className='text-[10px] tracking-[0.25em] font-bold uppercase opacity-80 mb-1'>WELCOME</p>
                <p className='text-lg md:text-xl font-bold leading-tight'>
                  신규 가입<br />5,000원 할인
                </p>
              </div>
              <span className='relative z-10 text-xs font-semibold opacity-90 group-hover:opacity-100'>
                지금 가입 <span aria-hidden className='inline-block transition-transform group-hover:translate-x-0.5'>→</span>
              </span>
              <div className='absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10' aria-hidden />
            </Link>

            <Link
              to='/products?sort=sale'
              className='group relative overflow-hidden rounded-2xl bg-accent text-accent-foreground p-5 md:p-6 flex flex-col justify-between aspect-square lg:aspect-auto hover:-translate-y-0.5 hover:shadow-md transition-all motion-reduce:transform-none'
            >
              <div className='relative z-10'>
                <div className='inline-flex items-center justify-center w-9 h-9 rounded-xl bg-accent-foreground/15 mb-3'>
                  <Package className='w-4 h-4' strokeWidth={1.8} />
                </div>
                <p className='text-[10px] tracking-[0.25em] font-bold uppercase opacity-80 mb-1'>SUBSCRIBE</p>
                <p className='text-lg md:text-xl font-bold leading-tight'>
                  정기배송<br />상시 -10%
                </p>
              </div>
              <span className='relative z-10 text-xs font-semibold opacity-90 group-hover:opacity-100'>
                자세히 보기 <span aria-hidden className='inline-block transition-transform group-hover:translate-x-0.5'>→</span>
              </span>
              <div className='absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-accent-foreground/10' aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 카테고리 퀵링크 */}
      <section className='py-10 md:py-12 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto'>
        <CategoryQuickLinks />
      </section>

      {/* 3. 신뢰 띠 */}
      <TrustStrip />

      {/* 4. 베스트 상품 */}
      <section className='py-12 md:py-14 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto'>
        <BestSection />
      </section>

      {/* 4.5. 퍼스널라이즈 — 시안 D 차별화 */}
      <PersonalizeSection />

      {/* 5. 정기배송 프로모션 + 추가 혜택 카드 3종 */}
      <section className='px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto pb-10 md:pb-12 space-y-5'>
        {/* 메인 정기배송 카드 — Terracotta (강조) */}
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

        {/* 풀필 배너 2개 — 2x1 그리드 (모바일은 세로 스택) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {HERO_BANNERS.map((b) => (
            <Link
              key={b.tag}
              to={b.ctaHref}
              className={`group relative overflow-hidden rounded-2xl py-10 px-8 md:px-10 md:py-12 hover:-translate-y-0.5 hover:shadow-md transition-all motion-reduce:transform-none ${b.bg}`}
            >
              <div className='relative z-10 max-w-md'>
                <p className='text-[11px] tracking-[0.3em] font-semibold uppercase opacity-80 mb-3'>
                  {b.tag}
                </p>
                <h3 className='font-editorial text-2xl md:text-[2rem] font-bold leading-tight mb-3 whitespace-pre-line'>
                  {b.titleLine1}
                  {'\n'}
                  {b.titleLine2}
                </h3>
                <p className='text-sm md:text-[15px] opacity-90 leading-relaxed mb-6 whitespace-pre-line'>
                  {b.desc}
                </p>
                <span
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all group-hover:opacity-95 ${b.ctaBg} ${b.ctaText}`}
                >
                  {b.ctaLabel}
                  <span aria-hidden className='transition-transform group-hover:translate-x-0.5'>
                    →
                  </span>
                </span>
              </div>

              {/* 장식 원형 */}
              <div
                className={`absolute -right-16 -bottom-16 w-56 h-56 rounded-full ${b.decorBg}`}
                aria-hidden
              />
              <div
                className={`absolute -right-4 top-6 w-20 h-20 rounded-full ${b.decorBg} hidden md:block`}
                aria-hidden
              />
            </Link>
          ))}
        </div>

        {/* 보조 프로모션 카드 — 3개 그리드 */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5'>
          {PROMO_CARDS.map(({ Icon, tag, title, desc, ctaLabel, ctaHref, iconBg, iconColor, ribbonText }) => (
            <Link
              key={tag}
              to={ctaHref}
              className='group relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-7 hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5 transition-all motion-reduce:transform-none'
            >
              {/* 우상단 ribbon */}
              <span className='absolute top-4 right-4 text-[10px] tracking-wider font-bold uppercase text-muted-foreground bg-secondary px-2 py-0.5 rounded-full'>
                {ribbonText}
              </span>

              {/* 아이콘 */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${iconBg} ${iconColor}`}
              >
                <Icon className='w-6 h-6' strokeWidth={1.6} />
              </div>

              {/* 텍스트 */}
              <p className='text-[10px] tracking-[0.3em] font-semibold uppercase text-accent mb-1.5'>
                {tag}
              </p>
              <h4 className='font-editorial text-lg md:text-xl font-bold mb-2 leading-snug group-hover:text-accent transition-colors'>
                {title}
              </h4>
              <p className='text-xs md:text-sm text-muted-foreground leading-relaxed mb-5'>
                {desc}
              </p>

              {/* CTA — 우하단 */}
              <span className='inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-accent transition-colors'>
                {ctaLabel}
                <span aria-hidden className='transition-transform group-hover:translate-x-0.5'>→</span>
              </span>

              {/* 장식 — 우하단 그라데이션 글로우 */}
              <div
                className={`absolute -right-12 -bottom-12 w-32 h-32 rounded-full ${iconBg} opacity-50 blur-2xl pointer-events-none`}
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>

      {/* 6. 신상품 */}
      <section className='py-12 md:py-14 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto'>
        <NewSection />
      </section>

      {/* 7. MD 추천 — Sand 배경 */}
      <section className='py-12 md:py-14 bg-secondary'>
        <div className='px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto'>
          <MdSection />
        </div>
      </section>

      {/* 8. 에디토리얼 콘텐츠 */}
      <section className='py-12 md:py-16 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto'>
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
