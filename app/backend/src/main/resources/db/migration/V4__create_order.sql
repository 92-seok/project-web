CREATE TABLE orders (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    order_number    VARCHAR(30)     NOT NULL COMMENT '주문번호 ORD-YYYYMMDD-XXXXXX',
    member_id       BIGINT          NOT NULL,
    status          VARCHAR(30)     NOT NULL DEFAULT 'PAID',
    total_price     INT             NOT NULL,
    receiver_name   VARCHAR(50)     NOT NULL,
    receiver_phone  VARCHAR(20)     NOT NULL,
    postal_code     VARCHAR(10)     NOT NULL,
    road_address    VARCHAR(255)    NOT NULL,
    detail_address  VARCHAR(255)        NULL,
    delivery_memo   VARCHAR(200)        NULL,
    paid_at         TIMESTAMP           NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_orders        PRIMARY KEY (id),
    CONSTRAINT uk_order_number  UNIQUE (order_number),
    CONSTRAINT fk_order_member  FOREIGN KEY (member_id) REFERENCES member(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주문';

CREATE TABLE order_item (
    id          BIGINT  NOT NULL AUTO_INCREMENT,
    order_id    BIGINT  NOT NULL,
    product_id  BIGINT  NOT NULL,
    name        VARCHAR(200) NOT NULL COMMENT '주문 시점 상품명 스냅샷',
    price       INT     NOT NULL COMMENT '주문 시점 가격 스냅샷',
    image_url   VARCHAR(500) NOT NULL,
    quantity    INT     NOT NULL,
    CONSTRAINT pk_order_item        PRIMARY KEY (id),
    CONSTRAINT fk_order_item_order  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주문 상품';

CREATE INDEX idx_orders_member_id ON orders(member_id);
CREATE INDEX idx_orders_status    ON orders(status);
