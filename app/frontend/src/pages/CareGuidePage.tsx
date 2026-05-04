import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dog, Cat, type LucideIcon } from 'lucide-react';
import { CARE_GUIDES, type ICareGuide } from '@/data/careGuides';

type TagFilter = '전체' | ICareGuide['tag'];
type PetFilter = 'all' | 'dog' | 'cat';

const TAG_FILTERS: TagFilter[] = ['전체', '영양', '계절', '루틴', '건강', '훈련', '미용'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

interface IGuideCardProps {
  guide: ICareGuide;
  featured?: boolean;
}

function GuideCard({ guide, featured = false }: IGuideCardProps) {
  if (featured) {
    return (
      <Link to={`/care-guides/${guide.id}`} className='col-span-1 md:col-span-3 block'>
        <article className='group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all motion-reduce:transform-none md:flex'>
          <div className='md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden bg-secondary'>
            <img
              src={guide.imageUrl}
              alt={guide.title}
              loading='eager'
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out motion-reduce:transform-none'
            />
          </div>
          <div className='md:w-1/2 p-6 md:p-10 flex flex-col justify-center'>
            <div className='flex items-center gap-2 mb-3'>
              <span className='text-[10px] tracking-widest font-bold text-accent uppercase'>
                {guide.tag}
              </span>
              <span className='text-[10px] text-muted-foreground'>·</span>
              <span className='text-[10px] text-muted-foreground'>{guide.readTime}분 읽기</span>
              <span className='text-[10px] text-muted-foreground'>·</span>
              <span className='text-[10px] text-muted-foreground'>{formatDate(guide.publishedAt)}</span>
            </div>
            <h3 className='font-editorial text-2xl md:text-3xl font-bold mb-3 group-hover:text-accent transition-colors leading-snug'>
              {guide.title}
            </h3>
            <p className='text-sm text-muted-foreground leading-relaxed mb-6'>{guide.desc}</p>
            <div className='flex items-center gap-1 text-sm text-accent font-semibold'>
              자세히 보기 <span aria-hidden>→</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/care-guides/${guide.id}`} className='block'>
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
          <p className='text-sm text-muted-foreground leading-relaxed line-clamp-2'>{guide.desc}</p>
          <div className='flex items-center gap-1 mt-4 text-xs text-accent font-semibold'>
            자세히 보기 <span aria-hidden>→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function CareGuidePage() {
  const [tagFilter, setTagFilter] = useState<TagFilter>('전체');
  const [petFilter, setPetFilter] = useState<PetFilter>('all');

  const filtered = CARE_GUIDES.filter((g) => {
    const matchTag = tagFilter === '전체' || g.tag === tagFilter;
    const matchPet = petFilter === 'all' || g.petType === petFilter || g.petType === 'all';
    return matchTag && matchPet;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className='bg-background min-h-screen'>
      {/* 헤더 섹션 */}
      <section className='pt-14 pb-10 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto text-center'>
        <p className='text-[11px] tracking-[0.3em] font-semibold uppercase text-accent mb-3'>
          EDITORIAL
        </p>
        <h1 className='font-editorial text-4xl md:text-[3rem] font-bold tracking-tight mb-4'>
          오늘의 케어 가이드
        </h1>
        <p className='text-base text-muted-foreground'>전문가가 전하는 반려동물 케어 인사이트</p>
      </section>

      {/* 필터 영역 */}
      <section className='px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto mb-10'>
        {/* 태그 탭 */}
        <div className='flex flex-wrap items-center gap-2 mb-4'>
          {TAG_FILTERS.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                tagFilter === tag
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground/70 border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 강아지/고양이 토글 */}
        <div className='flex items-center gap-2'>
          {(
            [
              { value: 'all', label: '전체', Icon: null },
              { value: 'dog', label: '강아지', Icon: Dog },
              { value: 'cat', label: '고양이', Icon: Cat },
            ] as { value: PetFilter; label: string; Icon: LucideIcon | null }[]
          ).map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setPetFilter(value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                petFilter === value
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-card text-foreground/60 border-border hover:border-accent/40'
              }`}
            >
              {Icon && <Icon className='w-3.5 h-3.5' strokeWidth={1.8} />}
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 가이드 그리드 */}
      <section className='px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto pb-20'>
        {filtered.length === 0 ? (
          <div className='py-20 text-center text-muted-foreground'>
            <p className='text-lg'>해당하는 가이드가 없습니다.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {/* Featured 카드 — 전체 너비 */}
            {featured && <GuideCard guide={featured} featured />}

            {/* 나머지 카드 */}
            {rest.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
