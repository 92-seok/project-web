-- V7: 초기 시드 데이터 (관리자 계정 + 상품 46개)
-- 비밀번호 'admin1234' BCrypt 해시

-- ─────────────────────────────────────────
-- 1. 관리자 계정
-- ─────────────────────────────────────────
INSERT IGNORE INTO member (login_id, password_hash, name, email, role, status, sms_agreed, email_agreed)
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy2',
  '관리자',
  'admin@pawmart.com',
  'ADMIN',
  'ACTIVE',
  false,
  false
);

-- ─────────────────────────────────────────
-- 2. 상품 데이터
--    컬럼 순서: name, description, price, original_price,
--               image_url, badge, category, pet_type,
--               stock, status, rating, review_count
-- ─────────────────────────────────────────
INSERT IGNORE INTO product
  (name, description, price, original_price, image_url, badge, category, pet_type, stock, status, rating, review_count)
VALUES

-- ── 강아지 사료 (dog / food) 10개 ──────────────────────────────────────────
(
  '로얄캐닌 미디엄 어덜트 15kg',
  '중형견 성견을 위한 맞춤 영양 설계. 소화 건강과 피부·모질 강화.',
  89000, 99000,
  'https://picsum.photos/seed/product1/400/400',
  'BEST', 'food', 'dog', 150, 'ON_SALE', 4.80, 3200
),
(
  '로얄캐닌 미니 어덜트 8kg',
  '소형견 성견 전용 사료. 구강 건강과 체중 관리에 최적화.',
  62000, 69000,
  'https://picsum.photos/seed/product2/400/400',
  'BEST', 'food', 'dog', 200, 'ON_SALE', 4.70, 2800
),
(
  '힐스 사이언스 다이어트 어덜트 16kg',
  '수의사 추천 1위 브랜드. 균형 잡힌 영양으로 건강한 체중 유지.',
  95000, 105000,
  'https://picsum.photos/seed/product3/400/400',
  'SALE', 'food', 'dog', 120, 'ON_SALE', 4.60, 1950
),
(
  '오리젠 오리지널 그레인프리 11.4kg',
  '85% 동물성 재료, 신선 육류 사용. 그레인프리 프리미엄 사료.',
  118000, 128000,
  'https://picsum.photos/seed/product4/400/400',
  'BEST', 'food', 'dog', 80, 'ON_SALE', 4.90, 1420
),
(
  '내추럴발란스 퓨어 오트밀 14kg',
  '단백질 단일 재료 사용. 민감한 피부와 소화 기관을 가진 반려견 전용.',
  87000, NULL,
  'https://picsum.photos/seed/product5/400/400',
  'NEW', 'food', 'dog', 60, 'ON_SALE', 4.30, 340
),
(
  '아카나 프리레인지 11.4kg',
  '방목 사육 닭고기 50% 이상 함유. 고단백·저탄수화물 설계.',
  112000, 125000,
  'https://picsum.photos/seed/product6/400/400',
  'SALE', 'food', 'dog', 90, 'ON_SALE', 4.75, 870
),
(
  '카길 하베스트 시리즈 닭고기 15kg',
  '국내산 닭고기를 주원료로 한 합리적 가격의 프리미엄 사료.',
  55000, 60000,
  'https://picsum.photos/seed/product7/400/400',
  NULL, 'food', 'dog', 250, 'ON_SALE', 4.20, 620
),
(
  '이나바 치킨 어덜트 12kg',
  '소화 흡수율을 높인 치킨 베이스 사료. 면역력 강화 성분 함유.',
  72000, NULL,
  'https://picsum.photos/seed/product8/400/400',
  NULL, 'food', 'dog', 180, 'ON_SALE', 4.10, 480
),
(
  '퍼피아 그레인프리 어덜트 6kg',
  '소형 성견을 위한 그레인프리 포뮬러. 관절·눈 건강 강화 성분 포함.',
  39000, 45000,
  'https://picsum.photos/seed/product9/400/400',
  'SALE', 'food', 'dog', 130, 'ON_SALE', 4.40, 720
),
(
  '로얄캐닌 저먼 셰퍼드 어덜트 12kg',
  '저먼 셰퍼드 견종에 특화된 영양 설계. 관절과 소화 건강 지원.',
  88000, 95000,
  'https://picsum.photos/seed/product10/400/400',
  NULL, 'food', 'dog', 70, 'ON_SALE', 4.65, 980
),

-- ── 강아지 간식 (dog / snack) 8개 ──────────────────────────────────────────
(
  '강아지 닭가슴살 져키 100g',
  '100% 국내산 닭가슴살로 만든 무첨가 져키. 고단백 저지방 간식.',
  8900, 11000,
  'https://picsum.photos/seed/product11/400/400',
  'BEST', 'snack', 'dog', 500, 'ON_SALE', 4.85, 4800
),
(
  '개껌 오리지널 사이즈 10개입',
  '천연 우피로 만든 덴탈 껌. 구강 위생 관리와 스트레스 해소.',
  12000, NULL,
  'https://picsum.photos/seed/product12/400/400',
  NULL, 'snack', 'dog', 400, 'ON_SALE', 4.30, 1560
),
(
  '덴탈 트릿 스몰 140g',
  '수의사 권장 구강 관리 간식. 플라크·치석 제거 효과.',
  9500, 11500,
  'https://picsum.photos/seed/product13/400/400',
  'SALE', 'snack', 'dog', 350, 'ON_SALE', 4.55, 2100
),
(
  '퍼피 밀크크래커 200g',
  '어린 강아지를 위한 우유 크래커. 칼슘 강화 레시피.',
  7500, NULL,
  'https://picsum.photos/seed/product14/400/400',
  'NEW', 'snack', 'dog', 280, 'ON_SALE', 4.20, 430
),
(
  '연어 트릿 소프트 80g',
  '노르웨이산 연어로 만든 소프트 트릿. 오메가3로 피부·모질 개선.',
  11000, 13000,
  'https://picsum.photos/seed/product15/400/400',
  'BEST', 'snack', 'dog', 220, 'ON_SALE', 4.70, 1870
),
(
  '치즈 스틱 강아지간식 20개입',
  '고소한 체다치즈 함유 스틱 간식. 훈련용 리워드로 최적.',
  6500, NULL,
  'https://picsum.photos/seed/product16/400/400',
  NULL, 'snack', 'dog', 450, 'ON_SALE', 4.15, 920
),
(
  '오리고기 슬라이스 져키 150g',
  '단일 단백질 오리고기 슬라이스. 식품 알러지 반려견에게 적합.',
  13500, 16000,
  'https://picsum.photos/seed/product17/400/400',
  'SALE', 'snack', 'dog', 160, 'ON_SALE', 4.60, 740
),
(
  '고구마 말랭이 강아지 간식 200g',
  '100% 국내산 고구마를 건조. 식이섬유 풍부하고 달콤한 자연 간식.',
  9800, NULL,
  'https://picsum.photos/seed/product18/400/400',
  NULL, 'snack', 'dog', 310, 'ON_SALE', 4.45, 1230
),

-- ── 고양이 사료 (cat / food) 8개 ────────────────────────────────────────────
(
  '로얄캐닌 인도어 어덜트 4kg',
  '실내 생활 고양이 전용. 헤어볼 관리·체중 조절 이중 설계.',
  52000, 58000,
  'https://picsum.photos/seed/product19/400/400',
  'BEST', 'food', 'cat', 200, 'ON_SALE', 4.75, 3100
),
(
  '힐스 사이언스 인도어 고양이 7kg',
  '수의사 처방 원칙 기반 영양 설계. 실내 고양이 소화·면역 강화.',
  78000, 88000,
  'https://picsum.photos/seed/product20/400/400',
  'SALE', 'food', 'cat', 110, 'ON_SALE', 4.60, 1680
),
(
  '오리젠 캣 오리지널 5.4kg',
  '85% 이상 신선 동물성 재료. 고양이 본능에 맞는 고단백 식단.',
  98000, 108000,
  'https://picsum.photos/seed/product21/400/400',
  'BEST', 'food', 'cat', 75, 'ON_SALE', 4.85, 960
),
(
  '아이앤러브앤유 오 마이 코드 그레인프리 5kg',
  '곡물 무첨가 고단백 고양이 사료. 헤어볼 케어 성분 포함.',
  72000, NULL,
  'https://picsum.photos/seed/product22/400/400',
  'NEW', 'food', 'cat', 90, 'ON_SALE', 4.35, 280
),
(
  '퓨리나 프로플랜 어덜트 인도어 1.5kg',
  '실내 성묘의 건강한 체중·소화 관리를 위한 과학적 배합.',
  28000, 32000,
  'https://picsum.photos/seed/product23/400/400',
  NULL, 'food', 'cat', 260, 'ON_SALE', 4.25, 1450
),
(
  '블루버팔로 와일드니스 고양이 2.27kg',
  '곡물 무첨가, 실제 닭고기 1순위. 타우린 강화 레시피.',
  45000, 50000,
  'https://picsum.photos/seed/product24/400/400',
  'SALE', 'food', 'cat', 140, 'ON_SALE', 4.50, 820
),
(
  '위스카스 참치 성묘 사료 7kg',
  '참치 풍미가 가득한 일반 건식 사료. 균형 잡힌 기본 영양 제공.',
  35000, NULL,
  'https://picsum.photos/seed/product25/400/400',
  NULL, 'food', 'cat', 300, 'ON_SALE', 3.90, 2200
),
(
  '시저 고양이 건식사료 그레인프리 1.5kg',
  '그레인프리 포뮬러로 민감한 고양이 소화기 배려.',
  26000, 30000,
  'https://picsum.photos/seed/product26/400/400',
  'NEW', 'food', 'cat', 170, 'ON_SALE', 4.10, 390
),

-- ── 고양이 간식 (cat / snack) 6개 ──────────────────────────────────────────
(
  '츄르 닭고기맛 14개입',
  '고양이가 열광하는 국민 간식 츄르. 수분 보충 효과까지.',
  7500, NULL,
  'https://picsum.photos/seed/product27/400/400',
  'BEST', 'snack', 'cat', 500, 'ON_SALE', 4.95, 4950
),
(
  '츄르 참치맛 14개입',
  '참치 풍미의 소프트 스틱 간식. 수분이 적은 고양이 수화 보조.',
  7500, NULL,
  'https://picsum.photos/seed/product28/400/400',
  'BEST', 'snack', 'cat', 480, 'ON_SALE', 4.90, 4500
),
(
  '고양이 연어 트릿 50g',
  '노르웨이산 연어 주원료. 오메가3로 피부·눈 건강 관리.',
  9800, 12000,
  'https://picsum.photos/seed/product29/400/400',
  'SALE', 'snack', 'cat', 230, 'ON_SALE', 4.65, 1100
),
(
  '스티키 캣 치킨 스틱 30개입',
  '닭고기 소프트 스틱. 훈련용 리워드 및 일상 간식으로 활용.',
  11000, NULL,
  'https://picsum.photos/seed/product30/400/400',
  NULL, 'snack', 'cat', 190, 'ON_SALE', 4.40, 670
),
(
  '고양이 동결건조 간식 참치 30g',
  '동결건조 공법으로 영양 손실 최소화. 첨가물 없는 순수 참치 간식.',
  14500, 17000,
  'https://picsum.photos/seed/product31/400/400',
  'NEW', 'snack', 'cat', 120, 'ON_SALE', 4.55, 350
),
(
  '캣닢 스프레이 100ml',
  '유기농 캣닢 추출 스프레이. 장난감·스크래쳐에 뿌려 놀이 유도.',
  8900, NULL,
  'https://picsum.photos/seed/product32/400/400',
  NULL, 'snack', 'cat', 280, 'ON_SALE', 4.20, 540
),

-- ── 용품 / 장난감 (dog·cat / supplies·toy) 8개 ─────────────────────────────
(
  '강아지 하네스 소형견용 S',
  '소프트 메쉬 소재로 피부 자극 없음. 쉬운 착탈 버클 시스템.',
  28000, 35000,
  'https://picsum.photos/seed/product33/400/400',
  'SALE', 'supplies', 'dog', 160, 'ON_SALE', 4.50, 890
),
(
  '고양이 스크래쳐 카드보드 대형',
  '친환경 재생 골판지 소재. 고양이 스트레스 해소와 발톱 관리.',
  18000, NULL,
  'https://picsum.photos/seed/product34/400/400',
  NULL, 'supplies', 'cat', 200, 'ON_SALE', 4.35, 1320
),
(
  '자동 급수기 반려동물용 2.5L',
  '순환 여과 시스템으로 항상 신선한 물 제공. 2.5L 대용량.',
  42000, 52000,
  'https://picsum.photos/seed/product35/400/400',
  'BEST', 'supplies', 'all', 85, 'ON_SALE', 4.70, 2400
),
(
  '강아지 입마개 메쉬 M',
  '통기성 메쉬 소재로 편안한 착용감. 병원·산책 시 안전 사용.',
  12000, NULL,
  'https://picsum.photos/seed/product36/400/400',
  NULL, 'supplies', 'dog', 140, 'ON_SALE', 3.90, 410
),
(
  '고양이 터널 장난감',
  '3방향 접이식 터널. 숨바꼭질과 놀이로 활동량 증가.',
  22000, 28000,
  'https://picsum.photos/seed/product37/400/400',
  'NEW', 'toy', 'cat', 110, 'ON_SALE', 4.60, 760
),
(
  '강아지 공 장난감 3개 세트',
  '천연 고무 재질 삐삐 공. 치아 건강과 놀이를 동시에.',
  14500, NULL,
  'https://picsum.photos/seed/product38/400/400',
  NULL, 'toy', 'dog', 320, 'ON_SALE', 4.25, 1080
),
(
  '반려동물 이동장 소프트 케리어',
  '항공 기내 반입 가능 사이즈. 통기성 메쉬·방수 코팅 처리.',
  65000, 78000,
  'https://picsum.photos/seed/product39/400/400',
  'SALE', 'supplies', 'all', 50, 'ON_SALE', 4.45, 630
),
(
  '슬리커 브러쉬 자동 클리닝',
  '버튼 하나로 털 제거. 스테인리스 핀으로 엉킨 털·죽은 털 제거.',
  19800, 24000,
  'https://picsum.photos/seed/product40/400/400',
  'BEST', 'supplies', 'all', 270, 'ON_SALE', 4.80, 3500
),

-- ── 건강 / 미용 (all / health·beauty) 6개 ──────────────────────────────────
(
  '반려동물 종합 영양제 60정',
  '비타민·미네랄·오메가3 복합 설계. 전 연령·전 견종 급여 가능.',
  32000, 38000,
  'https://picsum.photos/seed/product41/400/400',
  'BEST', 'health', 'all', 300, 'ON_SALE', 4.60, 1750
),
(
  '강아지 관절 영양제 오메가3 90캡슐',
  '글루코사민·콘드로이틴·오메가3 복합. 노령견 관절 건강 집중 케어.',
  48000, 56000,
  'https://picsum.photos/seed/product42/400/400',
  NULL, 'health', 'dog', 130, 'ON_SALE', 4.75, 920
),
(
  '반려동물 귀 세정제 100ml',
  '저자극 성분으로 귀지·악취 제거. 정기적 귀 관리로 외이도염 예방.',
  15000, NULL,
  'https://picsum.photos/seed/product43/400/400',
  'NEW', 'health', 'all', 200, 'ON_SALE', 4.40, 580
),
(
  '강아지 샴푸 오트밀 300ml',
  '오트밀 추출물로 민감한 피부 진정. 저자극·무향 포뮬러.',
  18000, 22000,
  'https://picsum.photos/seed/product44/400/400',
  'SALE', 'beauty', 'dog', 240, 'ON_SALE', 4.55, 1340
),
(
  '고양이 치약 세트 바나나향',
  '고양이가 좋아하는 바나나향 치약 + 핑거 칫솔 세트. 구강 건강 관리.',
  12500, NULL,
  'https://picsum.photos/seed/product45/400/400',
  NULL, 'beauty', 'cat', 0, 'SOLD_OUT', 4.30, 460
),
(
  '발바닥 보호 크림 50ml',
  '건조하고 갈라진 발바닥 집중 보호. 여름 아스팔트·겨울 결빙 방지.',
  14000, 17000,
  'https://picsum.photos/seed/product46/400/400',
  'NEW', 'beauty', 'all', 190, 'ON_SALE', 4.50, 310
);
