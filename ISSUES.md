# Pawmart — 현재 이슈 및 개선사항

> 최종 업데이트: 2026-06-29

---

## 해결된 이슈

### [AUTH-01] 관리자 로그인 401 (비밀번호 불일치)

- **원인 1**: `V7__seed_data.sql`의 BCrypt 해시가 `admin1234`에 대한 올바른 해시가 아니었음
- **원인 2**: Railway 프로덕션 DB에 admin 계정이 이미 다른 비밀번호로 존재해 `INSERT IGNORE`로 시드 스킵됨
- **원인 3**: `npx bcryptjs-cli`로 생성한 `$2b$` 해시는 Spring Security `BCryptPasswordEncoder`에서 검증 불가 (`$2a$` 만 지원)
- **해결**: Spring Security 7 jar를 직접 실행해 올바른 `$2a$` 해시 생성 후 Railway DB UPDATE

```sql
-- Railway DB에 적용된 최종 해시 (admin1234)
UPDATE member
SET password_hash = '$2a$10$GeB.ked5CMqwUzin7N6E/eNzh9Gz1150sCKtpI22X3hjSrzDyO10G'
WHERE login_id = 'admin';
```

- **후속 조치 필요**: `V7__seed_data.sql`의 해시값 수정 (아래 미해결 이슈 참고)

---

## 미해결 이슈

### [AUTH-02] V7 시드 데이터 BCrypt 해시 오류

- **위치**: `app/backend/src/main/resources/db/migration/V7__seed_data.sql`
- **문제**: 주석에 `'admin1234'` BCrypt 해시라고 명시되어 있으나 실제로는 다른 비밀번호의 해시
- **영향**: 로컬 DB 초기화 시 admin 계정으로 로그인 불가
- **해결 방법**: V7을 직접 수정하면 Flyway 체크섬 오류 발생 → 아래 [DEPLOY-01] 방법으로 처리

---

### [PAY-01] Toss 결제 클라이언트 키 / 시크릿 키 불일치

- **문제**: 프론트엔드와 백엔드가 서로 다른 Toss 계정 키를 사용 중
- **현재 상태**:

  | 위치 | 키 |
  |------|-----|
  | 프론트 `.env.local` | `test_ck_yL0qZ4G1VOPQQlaN21xOroWb2MQY` |
  | 백엔드 `application.yml` 기본값 | `test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoh` |

- **영향**: 결제창은 열리지만 승인 단계에서 실패
- **해결 방법**: Toss 개발자 대시보드에서 동일 계정의 키 쌍 확인 후 환경변수 통일

```bash
# Vercel 환경변수
VITE_TOSS_CLIENT_KEY=test_ck_[내_클라이언트_키]

# Railway 환경변수
TOSS_SECRET_KEY=test_sk_[내_시크릿_키]
```

---

### [DEPLOY-01] Flyway 체크섬 불일치 위험

- **문제**: 이미 적용된 마이그레이션 파일(`V7__seed_data.sql`)을 수정하면 Flyway가 체크섬 오류로 서버 기동 실패
- **해결 방법**: V7을 수정하지 않고 신규 마이그레이션으로 처리

```sql
-- 신규 파일: app/backend/src/main/resources/db/migration/V13__fix_admin_password.sql
UPDATE member
SET password_hash = '$2a$10$GeB.ked5CMqwUzin7N6E/eNzh9Gz1150sCKtpI22X3hjSrzDyO10G'
WHERE login_id = 'admin'
  AND password_hash != '$2a$10$GeB.ked5CMqwUzin7N6E/eNzh9Gz1150sCKtpI22X3hjSrzDyO10G';
```

---

## 개선사항 (로드맵)

README 로드맵과 동기화된 우선순위 목록입니다.

### 단기 (배포 안정화)

- [ ] **[DEPLOY-01]** `V13__fix_admin_password.sql` 추가로 Flyway 통한 admin 비밀번호 정상화
- [ ] **[PAY-01]** Toss 키 쌍 통일 (Vercel + Railway 환경변수 설정)
- [ ] JWT 토큰 만료 시간 검토 및 조정

### 중기 (기능 완성)

- [ ] E2E 테스트 (Playwright) — 결제 플로우 포함
- [ ] 관리자 기능 — 상품·회원·주문 관리 페이지
- [ ] Docker Compose 로컬 환경 통합 세팅

### 장기 (보안 강화)

- [ ] Refresh Token 블랙리스트 (Redis) — `AuthController.java:49` TODO 참고
- [ ] 결제 금액 서버측 재검증 로직 추가
- [ ] HTTPS 강제 리다이렉트 설정

---

## 환경별 설정 현황

| 항목 | 로컬 | Railway (prod) | Vercel (prod) |
|------|------|----------------|---------------|
| DB | MySQL 로컬 | Railway MySQL | — |
| API URL | `http://localhost:9000` | Railway 서비스 URL | Railway 서비스 URL |
| Toss Client Key | `.env.local` | — | 환경변수 미설정 |
| Toss Secret Key | `application.yml` 기본값 | 환경변수 미설정 | — |
| Admin 비밀번호 | 로컬 DB UPDATE 필요 | Railway DB 수동 UPDATE 완료 | — |
