import { Link } from 'react-router-dom';
import { Sparkles, Dog, Calendar, Scale, Heart, Salad } from 'lucide-react';

interface ITag {
  Icon: React.ElementType;
  label: string;
}

const TAGS: ITag[] = [
  { Icon: Dog, label: '종류' },
  { Icon: Calendar, label: '나이' },
  { Icon: Scale, label: '체중' },
  { Icon: Heart, label: '건강 상태' },
  { Icon: Salad, label: '식이 제한' },
];

interface IRecommendation {
  title: string;
  desc: string;
  price: number;
}

const SAMPLE_RECOMMENDATIONS: IRecommendation[] = [
  { title: '소형견 시니어 사료', desc: '관절·체중 관리 포뮬러', price: 38000 },
  { title: '관절 영양제 (오메가3)', desc: '월 1회 정기배송 추천', price: 28500 },
  { title: '노즈워크 매트 (소형)', desc: '두뇌 활동 자극', price: 22000 },
];

export function PersonalizeSection() {
  return (
    <section className='px-4 md:px-8 lg:px-12 py-10 md:py-14 max-w-[1440px] mx-auto'>
      <div className='rounded-2xl bg-gradient-to-br from-[var(--badge-care)]/10 via-secondary to-[var(--badge-joint)]/10 p-6 md:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
        {/* 좌측 텍스트 + CTA */}
        <div className='lg:col-span-7'>
          <p className='inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] font-bold uppercase text-accent mb-3'>
            <Sparkles className='w-3 h-3' strokeWidth={2} />
            Personalized
          </p>
          <h2 className='font-editorial text-2xl md:text-4xl font-bold leading-tight mb-3'>
            우리 아이에게 딱 맞는 추천,<br />30초면 받아보실 수 있어요.
          </h2>
          <p className='text-sm md:text-base text-muted-foreground leading-relaxed mb-5 max-w-lg'>
            반려동물의 종·나이·체중·건강 상태를 알려주시면, 영양·간식·생활용품을 맞춤 큐레이션해 드려요.
          </p>
          <div className='flex flex-wrap gap-2 mb-6'>
            {TAGS.map(({ Icon, label }) => (
              <span
                key={label}
                className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-full text-xs font-semibold border border-border'
              >
                <Icon className='w-3.5 h-3.5 text-foreground/60' strokeWidth={1.8} />
                {label}
              </span>
            ))}
          </div>
          <Link
            to='/mypage/pets'
            className='inline-flex items-center gap-2 h-12 px-7 bg-foreground text-background text-sm font-semibold rounded-full hover:bg-accent transition-colors'
          >
            맞춤 추천 받기 <span aria-hidden>→</span>
          </Link>
        </div>

        {/* 우측 샘플 추천 카드 */}
        <div className='lg:col-span-5'>
          <div className='bg-card rounded-2xl p-5 md:p-6 shadow-sm border border-border'>
            <div className='flex items-center gap-3 mb-4'>
              <span className='w-12 h-12 rounded-full bg-[var(--badge-care)]/14 grid place-items-center text-[var(--badge-care)]'>
                <Dog className='w-6 h-6' strokeWidth={1.6} />
              </span>
              <div>
                <p className='text-xs text-muted-foreground'>샘플 추천</p>
                <p className='text-sm font-semibold'>5살 푸들 · 5.2kg에게</p>
              </div>
            </div>
            <ul className='space-y-3 text-sm'>
              {SAMPLE_RECOMMENDATIONS.map((item) => (
                <li key={item.title} className='flex items-start gap-3'>
                  <span className='w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0' aria-hidden />
                  <div className='flex-1'>
                    <p className='font-semibold'>{item.title}</p>
                    <p className='text-xs text-muted-foreground'>{item.desc}</p>
                  </div>
                  <span className='font-semibold text-sm shrink-0 tabular-nums'>
                    {item.price.toLocaleString('ko-KR')}원
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
