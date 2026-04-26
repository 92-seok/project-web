import type { ICategory, IProduct, IProductDetail } from '@/types/product';
import { getPetImageUrl } from '@/lib/petImage';

export const CATEGORIES: ICategory[] = [
  { id: 'dog', label: '강아지', emoji: '🐕', href: '/products?pet=dog' },
  { id: 'cat', label: '고양이', emoji: '🐈', href: '/products?pet=cat' },
  { id: 'bird', label: '새', emoji: '🦜', href: '/products?pet=bird' },
  { id: 'fish', label: '물고기', emoji: '🐠', href: '/products?pet=fish' },
  { id: 'reptile', label: '파충류', emoji: '🦎', href: '/products?pet=reptile' },
  { id: 'small', label: '소동물', emoji: '🐹', href: '/products?pet=small' },
];

const img = (id: number, category: string) =>
  getPetImageUrl({ productId: id, category, width: 800, height: 800 });

export const MOCK_PRODUCTS: IProduct[] = [
  {
    id: 1,
    name: 'Royal Canin 미디엄 어덜트 습식사료',
    price: 28000,
    imageUrl: img(1, 'dog'),
    rating: 4.8,
    reviewCount: 142,
    badge: 'NEW',
    category: 'dog',
  },
  {
    id: 2,
    name: 'Royal Canin 마더&베이비캣 키튼 파우치',
    price: 9600,
    originalPrice: 12000,
    imageUrl: img(2, 'cat'),
    rating: 4.9,
    reviewCount: 389,
    badge: 'BEST',
    category: 'cat',
  },
  {
    id: 3,
    name: '프리미엄 강아지 노즈워크 장난감',
    price: 14500,
    imageUrl: img(3, 'dog'),
    rating: 4.6,
    reviewCount: 67,
    category: 'dog',
  },
  {
    id: 4,
    name: 'Royal Canin 인스팅크티브 고양이 습식',
    price: 17000,
    originalPrice: 23000,
    imageUrl: img(4, 'cat'),
    rating: 4.7,
    reviewCount: 210,
    badge: 'SALE',
    category: 'cat',
  },
  {
    id: 5,
    name: '비숑프리제 전용 프리미엄 사료',
    price: 35000,
    imageUrl: img(5, 'dog'),
    rating: 4.5,
    reviewCount: 33,
    badge: 'NEW',
    category: 'dog',
  },
  {
    id: 6,
    name: '메인쿤 어덜트 전용 건식사료',
    price: 89000,
    imageUrl: img(6, 'cat'),
    rating: 4.8,
    reviewCount: 156,
    category: 'cat',
  },
  {
    id: 7,
    name: '순수 자연 강아지 동결건조 간식',
    price: 9800,
    imageUrl: img(7, 'dog'),
    rating: 4.9,
    reviewCount: 512,
    badge: 'BEST',
    category: 'dog',
  },
  {
    id: 8,
    name: '다견종 맞춤 영양 프리미엄 사료',
    price: 11000,
    originalPrice: 15000,
    imageUrl: img(8, 'dog'),
    rating: 4.7,
    reviewCount: 98,
    category: 'dog',
  },
  {
    id: 9,
    name: '고양이 자동 급수기',
    price: 42000,
    originalPrice: 55000,
    imageUrl: img(9, 'cat'),
    rating: 4.6,
    reviewCount: 88,
    badge: 'SALE',
    category: 'cat',
  },
  {
    id: 10,
    name: '강아지 천연 샴푸',
    price: 18000,
    imageUrl: img(10, 'dog'),
    rating: 4.4,
    reviewCount: 45,
    badge: 'NEW',
    category: 'dog',
  },
  {
    id: 11,
    name: '반려견 이동장 캐리어',
    price: 67000,
    imageUrl: img(11, 'dog'),
    rating: 4.7,
    reviewCount: 201,
    category: 'dog',
  },
  {
    id: 12,
    name: '고양이 스크래처 타워',
    price: 95000,
    originalPrice: 120000,
    imageUrl: img(12, 'cat'),
    rating: 4.8,
    reviewCount: 134,
    badge: 'SALE',
    category: 'cat',
  },
];

export const MOCK_PRODUCT_DETAILS: Record<number, IProductDetail> = {
  1: {
    ...MOCK_PRODUCTS[0],
    description:
      'Royal Canin 미디엄 어덜트는 체중 11~25kg 성견을 위해 특별히 설계된 영양 균형 사료입니다. 건강한 피부와 윤기 있는 털을 위한 필수 지방산이 풍부하며, 최적의 소화를 돕는 고품질 단백질과 식이섬유가 함유되어 있습니다.',
    features: [
      '체중 11~25kg 성견 전용 설계',
      '건강한 피부·모질을 위한 오메가 3·6 지방산',
      '소화 촉진 프리바이오틱스 함유',
      '치석 방지 특수 키보그 성분',
      '수의사 권장 영양 배합',
    ],
    options: [{ label: '용량', values: ['1kg', '4kg', '10kg', '15kg'] }],
    stock: 48,
    reviews: [
      {
        id: 1,
        author: '김민지',
        rating: 5,
        date: '2026-03-12',
        content:
          '우리 강아지가 정말 잘 먹어요. 이전 사료보다 소화도 잘 되는 것 같고 털도 윤기가 나기 시작했어요!',
        helpful: 24,
      },
      {
        id: 2,
        author: '박서준',
        rating: 4,
        date: '2026-02-28',
        content:
          '품질은 좋은데 가격이 좀 있는 편이에요. 그래도 강아지 건강을 위해서 꾸준히 사고 있습니다.',
        helpful: 11,
      },
      {
        id: 3,
        author: '이하은',
        rating: 5,
        date: '2026-02-15',
        content: '수의사 선생님이 추천해주셔서 구매했는데 확실히 다르네요. 재구매 의사 100%!',
        helpful: 18,
      },
    ],
  },
  2: {
    ...MOCK_PRODUCTS[1],
    description:
      'Royal Canin 마더&베이비캣은 임신/수유 중인 어미 고양이와 생후 4개월까지의 새끼 고양이를 위한 전문 영양식입니다. 부드러운 무스 질감으로 이유식 시작 단계의 새끼 고양이도 쉽게 섭취할 수 있습니다.',
    features: [
      '임신·수유기 어미 고양이 + 생후 4개월 이하 새끼 고양이 적합',
      '이유식 단계에 최적화된 부드러운 무스 질감',
      '면역 발달을 돕는 콜로스트럼 성분',
      '두뇌 발달을 위한 DHA 강화',
      '소화기 발달 초기 단계 맞춤 설계',
    ],
    options: [{ label: '타입', values: ['싱글 파우치 85g', '12개입 박스', '24개입 박스'] }],
    stock: 120,
    reviews: [
      {
        id: 1,
        author: '최유나',
        rating: 5,
        date: '2026-04-01',
        content: '새끼 고양이들이 엄청 잘 먹어요. 이유식으로 딱 좋습니다.',
        helpful: 32,
      },
      {
        id: 2,
        author: '정태현',
        rating: 5,
        date: '2026-03-20',
        content: '어미 고양이 임신 기간부터 먹였는데 새끼들이 건강하게 태어났어요.',
        helpful: 15,
      },
    ],
  },
};

export function getProductDetail(id: number): IProductDetail | null {
  if (MOCK_PRODUCT_DETAILS[id]) return MOCK_PRODUCT_DETAILS[id];
  const base = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!base) return null;
  return {
    ...base,
    description: `${base.name}은 반려동물의 건강과 행복을 위해 엄선된 프리미엄 제품입니다. 전문가가 설계한 최적의 영양 배합으로 우리 아이의 건강한 삶을 지원합니다.`,
    features: [
      '프리미엄 원재료 사용',
      '수의사 검증 성분',
      '국내 GMP 인증 생산',
      '무방부제·무인공색소',
    ],
    options: [{ label: '사이즈', values: ['S', 'M', 'L'] }],
    stock: 30,
    reviews: [
      {
        id: 1,
        author: '익명 구매자',
        rating: 5,
        date: '2026-04-10',
        content: '품질이 정말 좋습니다. 강력 추천!',
        helpful: 8,
      },
    ],
  };
}
