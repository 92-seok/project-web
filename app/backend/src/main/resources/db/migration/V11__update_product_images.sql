-- V11: 상품 이미지를 카테고리×펫타입 큐레이션으로 갱신
--
-- 기존 시드(V7)는 picsum.photos 랜덤 이미지였는데(사료에 풍경 사진 등 어색),
-- 카테고리/펫타입에 어울리는 Unsplash 큐레이션 사진으로 일괄 교체한다.
--
-- 안전장치:
--   image_url 이 'https://picsum.photos/%' 패턴인 상품만 갱신
--   → 어드민이 별도로 업로드/등록한 상품(/uploads/... 등)은 보존
--
-- 매핑 전략:
--   food   × dog → 강아지 + 사료 그릇 사진 풀(2개) 라운드로빈
--   food   × cat → 고양이 + 사료 그릇 사진 풀(2개)
--   snack  × dog → 강아지 일상/간식 풀
--   snack  × cat → 고양이 일상/간식 풀
--   supplies/toy/beauty/health 등 → 펫타입별 일반 큐레이션 풀
--   pet_type='all' → 일반 펫 라이프스타일 풀

UPDATE product
SET image_url = CASE
  -- ── 사료 (food) ──────────────────────────────
  WHEN category = 'food' AND pet_type = 'dog' THEN
    ELT((id MOD 2) + 1,
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&q=80&auto=format&fit=crop')
  WHEN category = 'food' AND pet_type = 'cat' THEN
    ELT((id MOD 2) + 1,
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&q=80&auto=format&fit=crop')

  -- ── 간식 (snack) ─────────────────────────────
  WHEN category = 'snack' AND pet_type = 'dog' THEN
    ELT((id MOD 2) + 1,
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80&auto=format&fit=crop')
  WHEN category = 'snack' AND pet_type = 'cat' THEN
    ELT((id MOD 2) + 1,
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80&auto=format&fit=crop')

  -- ── 용품 / 장난감 / 미용 / 건강 (supplies/toy/beauty/health) ──
  WHEN pet_type = 'dog' THEN
    ELT((id MOD 3) + 1,
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612637968894-660373e23b03?w=400&q=80&auto=format&fit=crop')
  WHEN pet_type = 'cat' THEN
    ELT((id MOD 3) + 1,
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80&auto=format&fit=crop')

  -- ── pet_type = 'all' (양쪽 모두 사용 가능) ─────
  ELSE
    ELT((id MOD 2) + 1,
      'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612637968894-660373e23b03?w=400&q=80&auto=format&fit=crop')
END
WHERE image_url LIKE 'https://picsum.photos/%';
