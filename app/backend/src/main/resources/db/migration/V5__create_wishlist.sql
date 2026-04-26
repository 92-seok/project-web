CREATE TABLE wishlist (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    member_id  BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_wishlist              PRIMARY KEY (id),
    CONSTRAINT uk_wishlist_member_prod  UNIQUE (member_id, product_id),
    CONSTRAINT fk_wishlist_member       FOREIGN KEY (member_id)  REFERENCES member(id)  ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_product      FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='찜 목록';
