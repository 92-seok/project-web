CREATE TABLE review (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    member_id  BIGINT NOT NULL,
    rating     TINYINT NOT NULL COMMENT '1-5점',
    content    TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_review           PRIMARY KEY (id),
    CONSTRAINT uk_review_once      UNIQUE (product_id, member_id),
    CONSTRAINT fk_review_product   FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_member    FOREIGN KEY (member_id)  REFERENCES member(id)  ON DELETE CASCADE,
    CONSTRAINT chk_review_rating   CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품 리뷰';

CREATE INDEX idx_review_product_id ON review(product_id);
