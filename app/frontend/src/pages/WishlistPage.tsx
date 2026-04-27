import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { ProductCard } from '@/components/home/ProductCard';
import { wishlistApi, type IWishlistItem } from '@/api/wishlistApi';
import type { IProduct } from '@/types/product';

function toProduct(item: IWishlistItem): IProduct {
  return {
    id: item.productId,
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice ?? undefined,
    imageUrl: item.imageUrl,
    rating: item.rating,
    reviewCount: item.reviewCount,
    badge: (item.badge as IProduct['badge']) ?? undefined,
    // category는 WishlistItemResponse에 없으므로 빈 문자열 처리
    category: '',
  };
}

export function WishlistPage() {
  const [items, setItems] = useState<IWishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    wishlistApi
      .getWishlist()
      .then((data) => setItems(data.items))
      .catch(() => {
        // 에러 시 빈 목록 유지
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <MyPageLayout activeMenu='/mypage/wishlist'>
      <div>
        <div className='flex items-center justify-between mb-6'>
          <p className='text-[11px] tracking-[0.2em] font-bold uppercase'>Wishlist</p>
          <span className='text-sm text-muted-foreground'>{items.length}개</span>
        </div>

        {isLoading && (
          <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='aspect-square bg-secondary animate-pulse' />
            ))}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className='flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground'>
            <Heart className='w-10 h-10' />
            <p className='text-sm'>찜한 상품이 없습니다</p>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8'>
            {items.map((item) => (
              <ProductCard key={item.productId} product={toProduct(item)} />
            ))}
          </div>
        )}
      </div>
    </MyPageLayout>
  );
}
