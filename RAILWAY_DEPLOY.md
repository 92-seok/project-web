# Railway 백엔드 배포 작업 정리

작업일: 2026-06-29

## 배포 환경

| 항목 | 내용 |
|---|---|
| 플랫폼 | Railway |
| 백엔드 | Spring Boot 4.0.6 / Java 21 |
| DB | Railway MySQL 9.4 |
| 로컬 DB | MariaDB 10.4.32 |
| 배포 URL | https://project-web-production-ef2f.up.railway.app |

---

## 수정한 파일

### 1. `app/backend/src/main/resources/application.yml`

- `server.port` 를 하드코딩 `9000` → `${PORT:9000}` 으로 변경 (Railway PORT 환경변수 주입 대응)
- `MariaDBDialect` 명시 추가 (로컬 MariaDB에서 비관적 락 `FOR UPDATE OF <table>` 오류 방지)

```yaml
server:
  port: ${PORT:9000}

spring:
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MariaDBDialect
```

### 2. `app/backend/src/main/resources/application-prod.yml`

- Railway MySQL 환경변수명으로 datasource 설정
- `MySQLDialect` 명시 (Railway는 MariaDB가 아닌 MySQL 9.4 제공)

```yaml
spring:
  datasource:
    url: jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC&allowPublicKeyRetrieval=true&useSSL=false
    username: ${MYSQLUSER}
    password: ${MYSQLPASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect

logging:
  level:
    root: INFO
    org.hibernate.SQL: WARN
```

---

## Railway 대시보드 설정

### 서비스 구성

- **MySQL 서비스**: Railway MySQL 플러그인 (Online)
- **백엔드 서비스**: GitHub 레포 `92-seok/project-web` 연결

### 백엔드 서비스 Settings

| 항목 | 값 |
|---|---|
| Root Directory | `app/backend` |
| Branch | `master` |
| Start Command | `java -jar build/libs/backend-0.0.1-SNAPSHOT.jar` |
| Public Domain Port | `8080` (Railway가 PORT=8080 주입) |

### 백엔드 서비스 Variables

| 변수명 | 값 |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET` | (랜덤 256비트 이상 문자열) |
| `MYSQLHOST` | `${{MySQL.MYSQLHOST}}` |
| `MYSQLPORT` | `${{MySQL.MYSQLPORT}}` |
| `MYSQLDATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `MYSQLUSER` | `${{MySQL.MYSQLUSER}}` |
| `MYSQLPASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

> `${{MySQL.변수명}}` 형태는 Railway에서 같은 프로젝트의 다른 서비스 변수를 참조하는 문법

---

## 배포 결과

```
The following 1 profile is active: "prod"
HikariPool-1 - Start completed         <- DB 연결 성공
Successfully validated 12 migrations   <- Flyway 검증 완료
Migrating schema 'railway' to version "1 - create member"
Migrating schema 'railway' to version "2 - create product"
...
Tomcat started on port 8080
Started BackendApplication in 8.381 seconds
```

### API 테스트 결과

```
GET https://project-web-production-ef2f.up.railway.app/api/products

응답: 200 OK
totalElements: 45 / totalPages: 3
```

---

## 주의사항

### Dialect 경고 (무시 가능)
```
MySQLDialect does not need to be specified explicitly
```
동작에는 문제 없음. `application-prod.yml`에서 `dialect` 줄 삭제해도 무방.

### 파일 업로드 휘발성
Railway 파일시스템은 재배포 시 초기화됨.
`./uploads` 경로에 저장된 이미지는 재배포 후 삭제됨.
운영 전환 시 S3 등 외부 스토리지로 교체 필요.

### JWT Secret
- 로컬 `.env` 파일에는 Toss 키만 있음
- JWT_SECRET은 Railway Variables에만 설정됨
- `.env` 파일은 `.gitignore`에 포함되어 있어 커밋되지 않음

---

## 트러블슈팅 기록

| 문제 | 원인 | 해결 |
|---|---|---|
| Crashed (java 도움말 출력) | Start Command 미설정으로 `java` 만 실행됨 | Settings > Deploy > Start Command 직접 지정 |
| Application failed to respond | 도메인 포트가 9000, 앱은 8080으로 기동 | Networking에서 포트 8080으로 수정 |
| `SPRING_PROFILES_ACTIVE` 경고 | MySQL 서비스에 잘못 추가됨 | MySQL 서비스에서 삭제 후 백엔드 서비스 Variables에 추가 |
| `openssl` 명령어 없음 (Windows) | Windows 기본 설치 안 됨 | PowerShell로 대체: `[Convert]::ToBase64String(...)` |
| CORS 403 Forbidden (Vercel 연동 시) | Vercel 프리뷰 URL이 배포마다 달라 `allowedOrigins` 에 매칭 안 됨 | `SecurityConfig`에 `allowedOriginPatterns` 추가 → `https://*.vercel.app` 와일드카드 허용 |

---

## CORS 설정 (Vercel 연동)

`app/backend/src/main/java/com/pawmart/backend/config/SecurityConfig.java`

```java
@Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
private String[] allowedOrigins;

@Value("${app.cors.allowed-origin-patterns:https://*.vercel.app}")
private String[] allowedOriginPatterns;
```

```java
CorsConfiguration config = new CorsConfiguration();
config.setAllowedOrigins(Arrays.asList(allowedOrigins));
config.setAllowedOriginPatterns(Arrays.asList(allowedOriginPatterns));
```

> `allowedOrigins` 만 쓰면 Vercel 프리뷰 URL (`xxx-92seok.vercel.app`) 처럼 배포마다
> 달라지는 URL을 모두 등록할 수 없음.
> `allowedOriginPatterns` 로 `https://*.vercel.app` 와일드카드를 추가해 해결.
