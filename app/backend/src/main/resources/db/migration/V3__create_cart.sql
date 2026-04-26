CREATE TABLE cart_item (
    id         BIGINT  NOT NULL AUTO_INCREMENT,
    member_id  BIGINT  NOT NULL,
    product_id BIGINT  NOT NULL,
    quantity   INT     NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_cart_item PRIMARY KEY (id),
    CONSTRAINT uk_cart_member_product UNIQUE (member_id, product_id),
    CONSTRAINT fk_cart_member  FOREIGN KEY (member_id)  REFERENCES member(id)  ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='장바구니';
