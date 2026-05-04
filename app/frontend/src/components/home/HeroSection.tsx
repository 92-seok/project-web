import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { unsplash, UNSPLASH_PHOTOS } from '@/lib/petImage';

interface ISlide {
  imageUrl: string;
  fallbackUrl: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  align: 'left' | 'right';
  objectPosition?: string;
}

const SLIDES: ISlide[] = [
  {
    imageUrl: unsplash(UNSPLASH_PHOTOS.dogWithBowl, 2400),
    fallbackUrl: unsplash(UNSPLASH_PHOTOS.dogWithBowl, 1920),
    eyebrow: 'EVERYDAY WELLNESS',
    title: '오늘도 건강한\n한 끼를 시작해요',
    subtitle: '수의사가 검증한 프리미엄 영양식, 내일 새벽 문 앞으로',
    cta: '둘러보기',
    ctaHref: '/products',
    align: 'left',
    objectPosition: '70% center',
  },
  {
    imageUrl: unsplash(UNSPLASH_PHOTOS.catCloseup, 2400),
    fallbackUrl: unsplash(UNSPLASH_PHOTOS.catCloseup, 1920),
    eyebrow: 'WEEKLY DEALS',
    title: '이번 주만\n최대 30% 할인',
    subtitle: '정기배송 가입 시 -10% 추가 — 언제든 해지 가능',
    cta: '특가 보러가기',
    ctaHref: '/products?sort=sale',
    align: 'right',
    objectPosition: '30% center',
  },
  {
    imageUrl: unsplash(UNSPLASH_PHOTOS.goldenRetriever, 2400),
    fallbackUrl: unsplash(UNSPLASH_PHOTOS.goldenRetriever, 1920),
    eyebrow: 'BREED CARE',
    title: '내 아이에게\n딱 맞는 영양',
    subtitle: '견종·묘종별 라이프스테이지 맞춤 큐레이션',
    cta: '맞춤 추천 받기',
    ctaHref: '/products?sort=breed',
    align: 'left',
    objectPosition: '65% 35%',
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrentIndex((prev) => (prev + 1) % SLIDES.length);

  const slide = SLIDES[currentIndex];
  const isLeft = slide.align === 'left';

  return (
    <div
      className='
        relative overflow-hidden bg-secondary rounded-2xl
        aspect-[4/5] sm:aspect-[16/9]
        lg:aspect-auto lg:h-full lg:min-h-[480px] xl:min-h-[560px] 2xl:min-h-[640px]
      '
    >
      {/* 배경 이미지 — Unsplash 큐레이션, 깨지면 placedog/placekitten으로 폴백 */}
      <img
        key={currentIndex}
        src={slide.imageUrl}
        alt={slide.eyebrow}
        loading={currentIndex === 0 ? 'eager' : 'lazy'}
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src !== slide.fallbackUrl) img.src = slide.fallbackUrl;
        }}
        style={{ objectPosition: slide.objectPosition ?? 'center' }}
        className='absolute inset-0 w-full h-full object-cover animate-in fade-in duration-700 motion-reduce:animate-none'
      />

      {/* 그라데이션 오버레이 — Warm Black 톤 (검정 X, 따뜻함 유지) */}
      <div
        className={`absolute inset-0 ${
          isLeft
            ? 'bg-gradient-to-r from-foreground/80 via-foreground/35 to-transparent'
            : 'bg-gradient-to-l from-foreground/80 via-foreground/35 to-transparent'
        }`}
      />

      {/* 텍스트 콘텐츠 */}
      <div
        key={`text-${currentIndex}`}
        className={`absolute bottom-14 md:bottom-20 ${
          isLeft ? 'left-6 md:left-16' : 'right-6 md:right-16 text-right'
        } animate-in fade-in slide-in-from-bottom-3 duration-700 motion-reduce:animate-none max-w-[90%] md:max-w-md`}
      >
        <p className='text-[11px] tracking-[0.3em] font-semibold text-white/80 uppercase mb-3'>
          {slide.eyebrow}
        </p>
        <h2 className='font-editorial text-[2rem] md:text-[3.25rem] font-bold text-white leading-[1.05] whitespace-pre-line'>
          {slide.title}
        </h2>
        <p className='text-sm md:text-base text-white/85 mt-3 mb-6 max-w-sm leading-relaxed'>
          {slide.subtitle}
        </p>
        <Link
          to={slide.ctaHref}
          className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 hover:shadow-lg hover:-translate-y-0.5 transition-all motion-reduce:transform-none'
        >
          {slide.cta}
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* dot indicator — 하단 중앙 */}
      <div className='absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 items-center'>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`슬라이드 ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 bg-white ${
              i === currentIndex ? 'w-8 opacity-100' : 'w-1.5 opacity-50'
            }`}
          />
        ))}
      </div>

      {/* 화살표 — 우측 하단 */}
      <div className='absolute bottom-4 right-4 flex gap-1.5'>
        <button
          onClick={prev}
          aria-label='이전 슬라이드'
          className='w-9 h-9 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-sm text-white hover:bg-white/30 transition-colors'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>
        <button
          onClick={next}
          aria-label='다음 슬라이드'
          className='w-9 h-9 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-sm text-white hover:bg-white/30 transition-colors'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
