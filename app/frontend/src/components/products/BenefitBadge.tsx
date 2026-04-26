/**
 * BenefitBadge — 상품 효능 배지 (서술적 표현, 의약 표현 회피)
 *
 * 표현 원칙:
 * - "강화/예방/치료" → "케어/지원/인증"
 * - 카드당 최대 2개 권장
 */

interface IBenefitBadgeProps {
  type: 'care' | 'dental' | 'organic' | 'joint' | 'vet';
  size?: 'sm' | 'md';
}

const BADGE_MAP = {
  care: { label: '민감 케어', cls: 'bg-[var(--badge-care)]/12 text-[var(--badge-care)]' },
  dental: { label: '덴탈 케어', cls: 'bg-[var(--badge-dental)]/12 text-[var(--badge-dental)]' },
  organic: {
    label: '유기농 인증',
    cls: 'bg-[var(--badge-organic)]/12 text-[var(--badge-organic)]',
  },
  joint: { label: '관절 케어', cls: 'bg-[var(--badge-joint)]/15 text-[var(--badge-joint)]' },
  vet: { label: '수의사 검증', cls: 'bg-[var(--badge-vet)]/12 text-[var(--badge-vet)]' },
} as const;

export function BenefitBadge({ type, size = 'sm' }: IBenefitBadgeProps) {
  const meta = BADGE_MAP[type];
  const sizeCls = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeCls} ${meta.cls}`}
    >
      {meta.label}
    </span>
  );
}

/**
 * 상품 ID 기반 배지 결정 (mock — 백엔드에 효능 데이터 추가되면 교체)
 * - 같은 상품은 항상 같은 배지를 보여주도록 결정적 매핑
 */
export function getBadgesForProduct(
  productId: number,
  category: string,
): IBenefitBadgeProps['type'][] {
  const POOL: IBenefitBadgeProps['type'][] = ['care', 'dental', 'organic', 'joint', 'vet'];
  const seed = productId % 7;

  // 카테고리별 약간 가중치
  if (category === 'cat' && seed < 3) return ['dental', 'organic'];
  if (category === 'dog' && seed < 2) return ['joint', 'vet'];
  if (seed === 5) return ['care'];
  if (seed === 6) return ['vet', 'organic'];
  if (seed % 2 === 0) return [POOL[seed % POOL.length]];
  return [POOL[seed % POOL.length], POOL[(seed + 2) % POOL.length]];
}
