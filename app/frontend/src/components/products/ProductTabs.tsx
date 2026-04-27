import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { ImageUploader } from '@/components/common/ImageUploader';
import { useAuthStore } from '@/store/authStore';
import { reviewApi, type IReviewItem, type IReviewPage } from '@/api/reviewApi';
import type { IProductDetail } from '@/types/product';

interface IProductTabsProps {
  product: IProductDetail;
}

type TabKey = 'detail' | 'review' | 'shipping';

const SHIPPING_SECTIONS = [
  {
    title: '배송 안내',
    items: [
      '5만원 이상 무료배송',
      '오후 2시 이전 주문 시 당일 출고',
      '도서산간 지역 추가 배송비 발생',
    ],
  },
  {
    title: '반품/교환',
    items: [
      '수령 후 7일 이내 무료 반품',
      '단순 변심 반품 시 왕복 배송비 고객 부담',
      '상품 불량/오배송 시 100% 무료 교환',
    ],
  },
];

// 별점 아이콘 렌더러
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className='flex gap-0.5'>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-border'
          }`}
        />
      ))}
    </span>
  );
}

// 별점 선택 컴포넌트
function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <span className='flex gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star}점`}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-border'
            }`}
          />
        </button>
      ))}
    </span>
  );
}

export function ProductTabs({ product }: IProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('detail');

  // 리뷰 상태
  const [reviewPage, setReviewPage] = useState<IReviewPage | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // 리뷰 작성 폼 상태
  const [formRating, setFormRating] = useState(5);
  const [formContent, setFormContent] = useState('');
  const [formImageUrls, setFormImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMyReview, setHasMyReview] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const fetchReviews = useCallback(
    async (page: number) => {
      setIsReviewLoading(true);
      try {
        const data = await reviewApi.getReviews(product.id, page);
        setReviewPage(data);

        if (isLoggedIn && user) {
          const mine = data.content.some((r) => r.memberId === user.memberId);
          if (mine) setHasMyReview(true);
        }
      } catch {
        toast.error('리뷰를 불러오지 못했습니다.');
      } finally {
        setIsReviewLoading(false);
      }
    },
    [product.id, isLoggedIn, user],
  );

  useEffect(() => {
    if (activeTab === 'review') {
      fetchReviews(currentPage);
    }
  }, [activeTab, currentPage, fetchReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error('로그인이 필요합니다');
      return;
    }
    if (formContent.trim().length < 10) {
      toast.error('리뷰 내용을 10자 이상 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewApi.createReview(product.id, formRating, formContent.trim(), formImageUrls);
      toast.success('리뷰가 등록되었습니다');
      setFormContent('');
      setFormRating(5);
      setFormImageUrls([]);
      setHasMyReview(true);
      setCurrentPage(0);
      await fetchReviews(0);
    } catch (err) {
      const apiErr = err as { code?: string };
      if (apiErr?.code === 'R001') {
        setHasMyReview(true);
        toast.error('이미 리뷰를 작성하셨습니다');
      } else {
        toast.error('리뷰 등록에 실패했습니다');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;

    try {
      await reviewApi.deleteReview(product.id, reviewId);
      toast.success('리뷰가 삭제되었습니다');
      setHasMyReview(false);
      setCurrentPage(0);
      await fetchReviews(0);
    } catch {
      toast.error('리뷰 삭제에 실패했습니다');
    }
  };

  const tabClass = (tab: TabKey) =>
    `pb-3 text-sm transition-colors ${
      activeTab === tab
        ? 'border-b-2 border-foreground font-bold text-foreground'
        : 'text-muted-foreground hover:text-foreground'
    }`;

  const displayAverageRating = reviewPage?.averageRating ?? product.rating;
  const displayTotalCount = reviewPage?.totalCount ?? product.reviewCount;

  return (
    <div>
      {/* 탭 헤더 */}
      <div className='flex border-b gap-6 mb-6'>
        <button className={tabClass('detail')} onClick={() => setActiveTab('detail')}>
          상세정보
        </button>
        <button className={tabClass('review')} onClick={() => setActiveTab('review')}>
          리뷰 ({displayTotalCount.toLocaleString('ko-KR')})
        </button>
        <button className={tabClass('shipping')} onClick={() => setActiveTab('shipping')}>
          배송/반품
        </button>
      </div>

      {/* 상세정보 탭 — 본문 가독성 위해 폭 제한 */}
      {activeTab === 'detail' && (
        <div className='max-w-3xl space-y-6'>
          <p className='text-sm md:text-base leading-relaxed text-muted-foreground'>
            {product.description}
          </p>
          <div>
            <p className='text-[11px] tracking-[0.2em] font-bold uppercase mb-3'>주요 특징</p>
            <ul className='space-y-2'>
              {product.features.map((f, i) => (
                <li key={i} className='flex items-start gap-3 text-sm md:text-base'>
                  <span className='mt-[7px] md:mt-[9px] w-1.5 h-1.5 bg-foreground shrink-0 block' />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 리뷰 탭 */}
      {activeTab === 'review' && (
        <div>
          {/* 별점 요약 */}
          <div className='flex items-center gap-6 p-6 bg-secondary mb-6'>
            <div className='text-center'>
              <p className='text-4xl font-black'>{displayAverageRating.toFixed(1)}</p>
              <div className='flex justify-center mt-1'>
                <StarRating rating={Math.round(displayAverageRating)} />
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                {displayTotalCount.toLocaleString('ko-KR')}개 리뷰
              </p>
            </div>
            <Separator orientation='vertical' className='h-16' />
            <div className='flex-1 space-y-1'>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className='flex items-center gap-2 text-xs'>
                  <span className='w-3'>{star}</span>
                  <div className='flex-1 h-1.5 bg-border'>
                    <div
                      className='h-full bg-foreground'
                      style={{
                        width: star === 5 ? '70%' : star === 4 ? '20%' : '10%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 리뷰 작성 폼 — 로그인 + 미작성 시에만 노출 */}
          {isLoggedIn && !hasMyReview && (
            <form
              onSubmit={handleSubmitReview}
              className='border p-5 mb-6 space-y-4'
            >
              <p className='text-[11px] tracking-[0.2em] font-bold uppercase'>리뷰 작성</p>
              <div className='flex items-center gap-3'>
                <span className='text-sm text-muted-foreground'>별점</span>
                <StarSelector value={formRating} onChange={setFormRating} />
              </div>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder='상품에 대한 솔직한 리뷰를 남겨주세요 (최소 10자)'
                rows={4}
                className='w-full border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground'
              />
              {/* 사진 첨부 — 최대 3장 */}
              <div className='space-y-2'>
                <p className='text-xs text-muted-foreground'>사진 첨부 (선택)</p>
                <ImageUploader
                  value={formImageUrls}
                  onChange={setFormImageUrls}
                  maxCount={3}
                  subDir='review'
                  size='sm'
                />
              </div>
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-foreground text-background text-sm py-2.5 font-bold hover:opacity-80 transition-opacity disabled:opacity-50'
              >
                {isSubmitting ? '등록 중...' : '리뷰 등록'}
              </button>
            </form>
          )}

          {/* 리뷰 목록 */}
          {isReviewLoading ? (
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='py-5 border-b space-y-2'>
                  <div className='h-4 w-24 bg-secondary animate-pulse' />
                  <div className='h-3 w-full bg-secondary animate-pulse' />
                  <div className='h-3 w-3/4 bg-secondary animate-pulse' />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {reviewPage && reviewPage.content.length === 0 && (
                <p className='text-sm text-muted-foreground text-center py-12'>
                  아직 작성된 리뷰가 없습니다
                </p>
              )}

              {reviewPage?.content.map((review: IReviewItem) => (
                <div key={review.id} className='py-5 border-b last:border-0'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold'>{review.memberName}</span>
                        <StarRating rating={review.rating} />
                      </div>
                      <span className='text-xs text-muted-foreground'>
                        {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    {/* 본인 리뷰에만 삭제 버튼 */}
                    {user && review.memberId === user.memberId && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        aria-label='리뷰 삭제'
                        className='text-muted-foreground hover:text-foreground transition-colors'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                  <p className='text-sm leading-relaxed'>{review.content}</p>
                  {/* 첨부 이미지 */}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-3'>
                      {review.imageUrls.map((url, i) => (
                        <a
                          key={url + i}
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='block w-32 h-32 rounded-lg overflow-hidden bg-secondary hover:opacity-80 transition-opacity'
                        >
                          <img
                            src={url}
                            alt={`리뷰 이미지 ${i + 1}`}
                            loading='lazy'
                            className='w-full h-full object-cover'
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {reviewPage && reviewPage.totalPages > 1 && (
            <div className='flex items-center justify-center gap-4 mt-8'>
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                aria-label='이전 페이지'
                className='p-1.5 border disabled:opacity-30 hover:bg-secondary transition-colors'
              >
                <ChevronLeft className='w-4 h-4' />
              </button>
              <span className='text-sm'>
                {currentPage + 1} / {reviewPage.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={reviewPage.last}
                aria-label='다음 페이지'
                className='p-1.5 border disabled:opacity-30 hover:bg-secondary transition-colors'
              >
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 배송/반품 탭 */}
      {activeTab === 'shipping' && (
        <div className='max-w-3xl space-y-5 text-sm md:text-base'>
          {SHIPPING_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className='text-[11px] tracking-[0.2em] font-bold uppercase mb-2'>
                {section.title}
              </p>
              <ul className='space-y-1 text-muted-foreground'>
                {section.items.map((item) => (
                  <li key={item} className='flex gap-2'>
                    <span>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
