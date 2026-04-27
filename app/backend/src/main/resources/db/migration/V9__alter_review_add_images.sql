-- 리뷰에 이미지 URL 배열 컬럼 추가 (최대 3장 권장, 검증은 애플리케이션 레벨)
ALTER TABLE review
    ADD COLUMN image_urls JSON DEFAULT NULL COMMENT '리뷰 이미지 URL 배열';
