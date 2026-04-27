import { useEffect, useState } from 'react';
import { Bird, Cat, Dog, Fish, PawPrint, Rabbit, Turtle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { petApi, type IPet, type PetType } from '@/api/petApi';

/**
 * PetProfileChip — 헤더 우측의 펫 프로필 칩 (정적 표시 전용)
 *
 * - 비로그인 또는 펫 미등록: 표시 안 함
 * - 펫 등록: 첫 번째 펫의 종류 아이콘 + 이름만 보여줌 (클릭/상호작용 없음)
 *
 * 등록/수정/삭제는 마이페이지 → 내 반려동물에서만 처리.
 */

const TYPE_ICON: Record<PetType, React.ElementType> = {
  DOG: Dog,
  CAT: Cat,
  BIRD: Bird,
  FISH: Fish,
  REPTILE: Turtle,
  SMALL: Rabbit,
};

const TYPE_LABEL: Record<PetType, string> = {
  DOG: '강아지',
  CAT: '고양이',
  BIRD: '새',
  FISH: '물고기',
  REPTILE: '파충류',
  SMALL: '소동물',
};

export function PetProfileChip() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [pet, setPet] = useState<IPet | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setPet(null);
      setIsLoaded(false);
      return;
    }
    petApi
      .getMyPets()
      .then((pets) => setPet(pets[0] ?? null))
      .catch(() => setPet(null))
      .finally(() => setIsLoaded(true));
  }, [isLoggedIn]);

  // 비로그인 / 첫 로드 전 / 펫 미등록 → 헤더 비표시 (자리 차지 X)
  if (!isLoggedIn || !isLoaded || !pet) return null;

  const Icon = TYPE_ICON[pet.type] ?? PawPrint;
  return (
    <div
      className='hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-semibold text-foreground select-none'
      aria-label={`내 반려동물: ${pet.name}`}
    >
      <Icon className='w-3.5 h-3.5 text-accent' strokeWidth={1.8} />
      <span>
        내 {TYPE_LABEL[pet.type] ?? '반려동물'}: {pet.name}
      </span>
    </div>
  );
}
