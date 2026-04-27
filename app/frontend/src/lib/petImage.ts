/**
 * petImage — 펫 이미지 URL 헬퍼
 *
 * 외부 placeholder(placedog.net / placekitten.com)는 Cloudflare 521 등으로 자주 다운되어
 * 안정적인 Unsplash 큐레이션 풀로 교체. 백엔드 imageUrl 이 비어 있을 때만 폴백으로 사용.
 */

// Unsplash 검증된 photo ID 풀 (전수 검증 완료, w/q/auto 옵션 공통)
const DOG_PHOTOS = [
  '1450778869180-41d0601e046e', // dogWithBowl
  '1543466835-00a7907e9de1', // goldenRetriever
  '1601758228041-f3b2795255f1', // dogPuppyField
  '1612637968894-660373e23b03', // vetCare
];

const CAT_PHOTOS = [
  '1583337130417-3346a1be7dee', // catCloseup
  '1518791841217-8f162f1e1131', // catBlackWhite
  '1574158622682-e40e69881006', // catSeasonal
];

const GENERIC_PETS = [
  '1535930891776-0c2dfb7fda1a', // dailyRoutine
  '1568640347023-a616a30bc3bd', // petFood
];

interface IPetImageOptions {
  productId: number;
  category?: string;
  width?: number;
  height?: number;
}

function unsplashUrl(photoId: string, width: number): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=80&auto=format&fit=crop`;
}

export function getPetImageUrl({
  productId,
  category = 'dog',
  width = 800,
}: IPetImageOptions): string {
  if (category === 'cat') {
    const id = CAT_PHOTOS[productId % CAT_PHOTOS.length];
    return unsplashUrl(id, width);
  }
  if (category === 'dog') {
    const id = DOG_PHOTOS[productId % DOG_PHOTOS.length];
    return unsplashUrl(id, width);
  }
  // 그 외(all/bird/fish 등) → 일반 펫 풀
  const id = GENERIC_PETS[productId % GENERIC_PETS.length];
  return unsplashUrl(id, width);
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
