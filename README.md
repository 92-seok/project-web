# Pawmart — 반려동물 용품 쇼핑몰 리뉴얼

레거시 Spring 4.1 + JSP/Tiles + Oracle 기반 쇼핑몰을 **Spring Boot 4 + React 19** 스택으로 재구축하는 리뉴얼 프로젝트입니다. 원본 프로젝트는 `원본/` 폴더에 보존되어 있으며, 신규 작업은 `app/` 하위에서 이루어집니다.

## 주요 개선 포인트

- 🔐 **보안**: 평문 비밀번호 저장 → **BCrypt 해시**, 세션 기반 인증 → **JWT (도입 예정)**
- 🏗️ **아키텍처**: JSP 서버 렌더링 → **REST API + SPA 분리**
- 🧱 **스키마 관리**: 수동 DDL → **Flyway 버전 관리** 마이그레이션
- 🧪 **테스트 가능성**: DAO 직접 의존 → **JPA + 도메인 서비스 레이어**

## 기술 스택

### 백엔드 (`app/backend`)

| 항목 | 버전 / 선택 |
|---|---|
| Java | 21 |
| Spring Boot | 4.0.6 |
| ORM | Spring Data JPA / Hibernate 7 |
| DB | MySQL 8 |
| 마이그레이션 | Flyway 11 |
| 보안 | Spring Security 7 + BCrypt |
| 빌드 | Gradle (wrapper 포함) |
| 포맷 | Spotless + Google Java Format (2-space) |

### 프론트엔드 (`app/frontend`)

| 항목 | 버전 / 선택 |
|---|---|
| 런타임 | Node 20+ |
| 빌드 | Vite 8 |
| 프레임워크 | React 19 + TypeScript |
| 스타일 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui (Nova preset, Neutral base) |
| HTTP | axios |
| 라우팅 | React Router |

## 사전 요구사항

- Java 21 (JDK)
- Node.js 20 이상
- MySQL 8 이상 (로컬 설치 또는 Docker)

## 로컬 개발 환경 세팅

### 1. 데이터베이스 준비

MySQL에 접속해 데이터베이스와 계정을 생성합니다.

```sql
CREATE DATABASE product_web
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'pawmart_user'@'%' IDENTIFIED BY '원하는_비밀번호';
GRANT ALL PRIVILEGES ON product_web.* TO 'pawmart_user'@'%';
FLUSH PRIVILEGES;
```

### 2. 백엔드 설정 파일 생성

`app/backend/src/main/resources/application-local.yml.example` 파일을 복사하여 `application-local.yml` 로 이름을 바꾼 뒤, 실제 DB 계정 정보를 채웁니다. (이 파일은 `.gitignore` 로 커밋되지 않습니다.)

```bash
cp app/backend/src/main/resources/application-local.yml.example \
   app/backend/src/main/resources/application-local.yml
```

### 3. 백엔드 실행

```bash
cd app/backend

# Windows
./gradlew.bat bootRun

# macOS / Linux
./gradlew bootRun
```

기동 시 Flyway가 자동으로 `V1__create_member.sql` 을 적용해 `member` 테이블을 생성합니다. 기본 포트는 **9000** 입니다.

### 4. 프론트엔드 실행

새 터미널을 열고:

```bash
cd app/frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속. Vite dev proxy 덕분에 프론트의 `/api/*` 요청은 자동으로 `localhost:9000` 으로 포워딩되므로 별도 CORS 설정이 필요하지 않습니다.

## 빌드 / 기타 명령어

### 백엔드

```bash
# 테스트 제외하고 빌드
./gradlew clean build -x test

# 테스트 실행
./gradlew test

# 코드 포맷 자동 정리 (커밋 전 권장)
./gradlew spotlessApply

# 의존성 최신화(잠긴 것들 갱신)
./gradlew --refresh-dependencies build
```

### 프론트엔드

```bash
# 타입 체크
npx tsc -b --noEmit

# 프로덕션 빌드
npm run build

# 프로덕션 프리뷰
npm run preview

# 린트
npm run lint
```

## 프로젝트 구조

```
product-web/
├─ app/
│  ├─ backend/          # Spring Boot 4 백엔드
│  │  ├─ src/main/java/com/pawmart/backend/
│  │  │  ├─ common/exception/      # ErrorCode, GlobalExceptionHandler
│  │  │  ├─ config/SecurityConfig  # BCrypt, SecurityFilterChain
│  │  │  └─ member/                # 회원 도메인 (Entity/Service/Controller/DTO)
│  │  └─ src/main/resources/
│  │     ├─ application.yml
│  │     └─ db/migration/          # Flyway V1, V2, ...
│  │
│  ├─ frontend/         # Vite + React + TS 프론트엔드
│  │  └─ src/
│  │     ├─ api/        # axios 클라이언트 + auth API
│  │     ├─ pages/      # Login, SignUp, Home
│  │     ├─ components/ # shadcn/ui
│  │     ├─ lib/        # session, cn() 헬퍼
│  │     └─ types/      # 백엔드 DTO 와 1:1 타입
│  │
│  └─ _legacy/          # 레거시 Spring 4.1 소스 (참고용 아카이브)
│
└─ 원본/                 # 리뉴얼 전 원본 스냅샷 (불변 보존)
```

## 현재 구현된 기능

- [x] 회원 테이블 스키마 (Flyway V1, BCrypt 해시 전제)
- [x] 회원가입 API `POST /api/auth/signup`
- [x] 로그인 API `POST /api/auth/login`
- [x] 공통 예외 처리 (`ErrorCode` + `GlobalExceptionHandler`)
- [x] React 로그인 / 회원가입 / 홈 화면 + 라우팅
- [x] localStorage 기반 임시 세션

## 로드맵

- [ ] **JWT 인증** — `localStorage` 임시 세션 제거, `Authorization: Bearer <token>` 기반으로 교체
- [ ] 상품(goods) 도메인 — 카탈로그·상세 페이지
- [ ] 장바구니 / 주문 / 결제 (결제 게이트웨이 연동은 마지막 단계)
- [ ] 관리자 기능 (상품·회원·주문 관리)
- [ ] E2E 테스트 (Playwright)
- [ ] Docker Compose 로 한 번에 띄우기

## 라이선스

본 저장소는 학습·포트폴리오 용도이며 별도 라이선스를 명시하지 않습니다.
