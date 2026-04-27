import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ImageGallery } from '@/components/products/ImageGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ProductTabs } from '@/components/products/ProductTabs';
import { RelatedProducts } from '@/components/products/RelatedProducts';

function ProductDetailSkeleton() {
  return (
    <div className='max-w-[1440px] mx-auto'>
      <div className='px-4 md:px-8 lg:px-12 py-4 border-b'>
        <Skeleton className='h-3 w-48 rounded-none' />
      </div>
      <div className='px-4 md:px-8 lg:px-12 py-10 md:grid md:grid-cols-[minmax(0,1fr)_440px] lg:grid-cols-[minmax(0,1fr)_520px] md:gap-10 lg:gap-16'>
        <Skeleton className='aspect-square rounded-none' />
        <div className='space-y-4 mt-6 md:mt-0'>
          <Skeleton className='h-4 w-24 rounded-none' />
          <Skeleton className='h-10 w-3/4 rounded-none' />
          <Skeleton className='h-4 w-32 rounded-none' />
          <Skeleton className='h-px w-full rounded-none' />
          <Skeleton className='h-10 w-1/3 rounded-none' />
          <div className='flex gap-3 pt-4'>
            <Skeleton className='flex-1 h-12 rounded-none' />
            <Skeleton className='flex-1 h-12 rounded-none' />
            <Skeleton className='w-14 h-12 rounded-none' />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);

  const { data: product, isLoading, isNotFound, error } = useProduct(numericId);
  const { addItem, isLoading: isCartLoading } = useCartStore();

  useEffect(() => {
    if (isNotFound) {
      navigate('/not-found', { replace: true });
    }
  }, [isNotFound, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
        <p className='text-lg font-bold'>상품을 찾을 수 없습니다</p>
        <Link to='/products' className='text-sm underline underline-offset-4'>
          전체 상품 보기
        </Link>
      </div>
    );
  }

  const checkLogin = (): boolean => {
    if (!useAuthStore.getState().isLoggedIn) {
      toast.error('로그인이 필요합니다');
      return false;
    }
    return true;
  };

  const handleMobileAddToCart = async () => {
    if (!checkLogin()) return;
    await addItem(product.id, 1);
    toast.success('장바구니에 담았습니다');
  };

  const handleMobileBuyNow = async () => {
    if (!checkLogin()) return;
    await addItem(product.id, 1);
    navigate('/cart');
  };

  return (
    <div className='max-w-[1440px] mx-auto'>
      {/* 브레드크럼 */}
      <div className='px-4 md:px-8 lg:px-12 py-4 border-b border-border text-xs text-muted-foreground flex gap-2 items-center bg-secondary/30'>
        <Link to='/' className='hover:text-accent transition-colors'>
          홈
        </Link>
        <span aria-hidden>›</span>
        <Link to='/products' className='hover:text-accent transition-colors'>
          전체상품
        </Link>
        <span aria-hidden>›</span>
        <span className='text-foreground font-medium truncate'>{product.name}</span>
      </div>

      {/* 메인 콘텐츠: 이미지 + 정보 */}
      <div className='px-4 md:px-8 lg:px-12 py-10 md:grid md:grid-cols-[minmax(0,1fr)_440px] lg:grid-cols-[minmax(0,1fr)_520px] md:gap-10 lg:gap-16'>
        <ImageGallery imageUrl={product.imageUrl} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* 상세정보/리뷰 탭 */}
      <div className='px-4 md:px-8 lg:px-12 py-10 border-t'>
        <ProductTabs product={product} />
      </div>

      {/* 연관 상품 */}
      <RelatedProducts currentId={product.id} category={product.category} />

      {/* 모바일 하단 고정 구매 버튼 — Thumb Zone */}
      <div className='md:hidden fixed bottom-16 left-0 right-0 z-30 flex gap-2 px-4 py-3 border-t border-border bg-background/95 backdrop-blur-md'>
        <button
          onClick={handleMobileAddToCart}
          disabled={isCartLoading}
          className='flex-1 py-3.5 rounded-full border border-border text-foreground text-sm font-semibold disabled:opacity-50 hover:border-accent hover:text-accent transition-colors'
        >
          장바구니
        </button>
        <button
          onClick={handleMobileBuyNow}
          disabled={isCartLoading}
          className='flex-[1.4] py-3.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold disabled:opacity-50 hover:opacity-95 transition-opacity'
        >
          바로 구매
        </button>
      </div>
    </div>
  );
}
