CREATE TABLE payment (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    order_id        BIGINT          NOT NULL,
    member_id       BIGINT          NOT NULL,
    payment_key     VARCHAR(200)    NOT NULL COMMENT '토스페이먼츠 paymentKey',
    toss_order_id   VARCHAR(64)     NOT NULL COMMENT '토스페이먼츠 orderId',
    amount          INT             NOT NULL,
    method          VARCHAR(50)         NULL COMMENT '카드/계좌이체/가상계좌 등',
    status          VARCHAR(30)     NOT NULL DEFAULT 'DONE',
    approved_at     TIMESTAMP           NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_payment           PRIMARY KEY (id),
    CONSTRAINT uk_payment_key       UNIQUE (payment_key),
    CONSTRAINT uk_toss_order_id     UNIQUE (toss_order_id),
    CONSTRAINT fk_payment_order     FOREIGN KEY (order_id)  REFERENCES orders(id),
    CONSTRAINT fk_payment_member    FOREIGN KEY (member_id) REFERENCES member(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제';
