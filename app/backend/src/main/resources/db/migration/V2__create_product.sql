CREATE TABLE product (
    id             BIGINT          NOT NULL AUTO_INCREMENT,
    name           VARCHAR(200)    NOT NULL,
    description    TEXT,
    price          INT             NOT NULL COMMENT '판매가',
    original_price INT                 NULL COMMENT '정가 (할인 전)',
    image_url      VARCHAR(500)    NOT NULL,
    badge          VARCHAR(50)         NULL COMMENT 'NEW / BEST / SALE 등',
    category       VARCHAR(50)     NOT NULL COMMENT 'food / snack / supplies / etc',
    pet_type       VARCHAR(50)     NOT NULL COMMENT 'dog / cat / all',
    stock          INT             NOT NULL DEFAULT 0,
    status         VARCHAR(20)     NOT NULL DEFAULT 'ON_SALE',
    rating         DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
    review_count   INT             NOT NULL DEFAULT 0,
    created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_product PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='상품';

CREATE INDEX idx_product_category ON product(category);
CREATE INDEX idx_product_pet_type ON product(pet_type);
CREATE INDEX idx_product_status   ON product(status);
