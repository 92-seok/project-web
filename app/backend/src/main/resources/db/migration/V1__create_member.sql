-- 회원(member) 테이블: 레거시 t_shopping_member 재설계
-- BCrypt 해시 저장 / 정규화 단순화 / 표준 타임스탬프 도입
CREATE TABLE member (
    id              BIGINT          NOT NULL AUTO_INCREMENT COMMENT '내부 PK',
    login_id        VARCHAR(50)     NOT NULL                COMMENT '로그인 아이디',
    password_hash   VARCHAR(60)     NOT NULL                COMMENT 'BCrypt 해시 (60자 고정)',
    name            VARCHAR(50)     NOT NULL,
    gender          CHAR(1)             NULL                COMMENT 'M/F',
    birth_date      DATE                NULL,
    phone           VARCHAR(20)         NULL,
    email           VARCHAR(100)    NOT NULL,
    sms_agreed      BOOLEAN         NOT NULL DEFAULT FALSE,
    email_agreed    BOOLEAN         NOT NULL DEFAULT FALSE,
    postal_code     VARCHAR(10)         NULL,
    road_address    VARCHAR(255)        NULL,
    jibun_address   VARCHAR(255)        NULL,
    detail_address  VARCHAR(255)        NULL                COMMENT '상세 주소(나머지)',
    role            VARCHAR(20)     NOT NULL DEFAULT 'USER' COMMENT 'USER/ADMIN',
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE/WITHDRAWN',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_member             PRIMARY KEY (id),
    CONSTRAINT uk_member_login_id    UNIQUE (login_id),
    CONSTRAINT uk_member_email       UNIQUE (email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '회원';
