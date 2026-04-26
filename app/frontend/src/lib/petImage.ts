/**
 * petImage — 펫 이미지 URL 헬퍼
 *
 * Royal Canin CDN 무단 사용을 제거하고, 무료 placeholder 서비스로 통일.
 * - 강아지: placedog.net (id 1~99 안정 작동)
 * - 고양이: placekitten.com (size 변경으로 다양화)
 * - 키워드: loremflickr.com (사료/장난감 등)
 *
 * 백엔드에서 실제 imageUrl을 내려주면 그대로 사용되고,
 * 비어 있을 때만 이 헬퍼로 fallback.
 */

const DOG_IDS = [12, 18, 23, 31, 42, 56, 67, 75, 88, 91];
const CAT_VARIANTS = [800, 801, 802, 803, 804, 805, 806, 807, 808, 809];

interface IPetImageOptions {
  productId: number;
  category?: string;
  width?: number;
  height?: number;
}

export function getPetImageUrl({
  productId,
  category = 'dog',
  width = 800,
  height = 800,
}: IPetImageOptions): string {
  if (category === 'cat') {
    const v = CAT_VARIANTS[productId % CAT_VARIANTS.length];
    return `https://placekitten.com/${width}/${v}`;
  }
  // dog (default)
  const id = DOG_IDS[productId % DOG_IDS.length];
  return `https://placedog.net/${width}/${height}?id=${id}`;
}

/**
 * Unsplash 큐레이션 이미지 (Hero/에디토리얼용)
 * — 잘 알려진 안정적인 photo ID 모음
 */
export const UNSPLASH_PHOTOS = {
  dogWithBowl: '1450778869180-41d0601e046e', // Sebastian Coman
  dogPuppyField: '1601758228041-f3b2795255f1', // Andriyko Podilnyk
  goldenRetriever: '1543466835-00a7907e9de1', // Marliese Brandsma
  catCloseup: '1583337130417-3346a1be7dee', // Manja Vitolic
  catBlackWhite: '1518791841217-8f162f1e1131', // Mikhail Vasilyev
  petFood: '1568640347023-a616a30bc3bd', // pet food bowl
  vetCare: '1612637968894-660373e23b03', // vet hands holding puppy
  catSeasonal: '1574158622682-e40e69881006', // cat with green eyes
  dailyRoutine: '1535930891776-0c2dfb7fda1a', // pet daily routine
} as const;

export function unsplash(photoId: string, width = 1600): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=80&auto=format&fit=crop`;
}
