# Railway 백엔드 배포 가이드

Spring Boot + MySQL 프로젝트를 Railway에 배포하는 방법

---

## 사전 준비

- GitHub 레포지토리에 코드 push 완료
- Railway 계정 가입

---

## Step 1 — Railway 프로젝트 및 DB 생성

1. Railway 대시보드 접속
2. **New Project** 클릭
3. 프로젝트 생성 후 **+ Add** 클릭 → **Database** → **MySQL** 선택
4. MySQL 서비스가 Online 상태가 될 때까지 대기

---

## Step 2 — 백엔드 서비스 추가

1. 프로젝트 화면에서 **+ Add** 클릭 → **GitHub Repo** 선택
2. 배포할 레포지토리 선택
3. 서비스 생성 완료

---

## Step 3 — 백엔드 서비스 Settings 설정

백엔드 서비스 클릭 → **Settings** 탭

### Source
```
Root Directory: app/backend   (본인 백엔드 경로에 맞게 입력)
Branch: master
```

### Deploy
```
Start Command: java -jar build/libs/백엔드모듈명-0.0.1-SNAPSHOT.jar
```

> jar 파일명은 `build.gradle` 의 `group`, `version` 기준으로 결정됨.
> 예) `group = 'com.pawmart'`, `version = '0.0.1-SNAPSHOT'` → `backend-0.0.1-SNAPSHOT.jar`

---

## Step 4 — 환경변수 설정

백엔드 서비스 → **Variables** 탭 → **New Variable**

```
SPRING_PROFILES_ACTIVE = prod
JWT_SECRET             = (아래 명령어로 생성)
MYSQLHOST              = ${{MySQL.MYSQLHOST}}
MYSQLPORT              = ${{MySQL.MYSQLPORT}}
MYSQLDATABASE          = ${{MySQL.MYSQLDATABASE}}
MYSQLUSER              = ${{MySQL.MYSQLUSER}}
MYSQLPASSWORD          = ${{MySQL.MYSQLPASSWORD}}
```

### JWT_SECRET 생성 방법

**Mac / Linux:**
```bash
openssl rand -base64 64
```

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

> `${{MySQL.변수명}}` 은 Railway에서 같은 프로젝트 내 다른 서비스 변수를 참조하는 문법

---

## Step 5 — application-prod.yml 설정

Railway MySQL 환경변수명을 그대로 참조하도록 작성

```yaml
spring:
  datasource:
    url: jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC&allowPublicKeyRetrieval=true&useSSL=false
    username: ${MYSQLUSER}
    password: ${MYSQLPASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    show-sql: false

logging:
  level:
    root: INFO
    org.hibernate.SQL: WARN
```

> 로컬에서 MariaDB를 사용한다면 `application.yml` 에 `MariaDBDialect` 유지,
> `application-prod.yml` 에는 별도 dialect 설정 불필요 (MySQL 자동 감지)

---

## Step 6 — application.yml PORT 설정

Railway는 `PORT` 환경변수를 자동 주입함. 하드코딩 대신 환경변수로 받아야 함.

```yaml
server:
  port: ${PORT:9000}   # Railway가 PORT 주입, 없으면 9000 사용
```

---

## Step 7 — Git Push

```bash
git add app/backend/src/main/resources/application.yml
git add app/backend/src/main/resources/application-prod.yml
git commit -m "feat: Railway 배포 설정"
git push origin master
```

push 하면 Railway가 자동으로 빌드 시작

---

## Step 8 — 배포 확인

백엔드 서비스 → **Deployments** 탭 → **View logs**

아래 순서로 로그 확인:

```
The following 1 profile is active: "prod"   <- prod 프로필 활성화
HikariPool-1 - Start completed              <- DB 연결 성공
Successfully validated N migrations         <- Flyway 마이그레이션 완료
Tomcat started on port 8080                 <- 서버 기동
Started BackendApplication                  <- 최종 완료
```

---

## Step 9 — 도메인 발급

백엔드 서비스 → **Settings** → **Networking** → **Generate Domain**

포트 입력란: **`8080`** 입력 후 Generate Domain 클릭

> Railway가 `PORT=8080` 을 주입하므로 앱은 8080으로 기동됨.
> 도메인 포트도 반드시 8080으로 맞춰야 외부 접근 가능.

---

## Step 10 — API 테스트

브라우저 또는 터미널에서 확인:

```bash
curl https://발급된도메인.up.railway.app/api/products
```

JSON 응답이 오면 배포 완료.

---

## 자주 발생하는 오류

| 오류 | 원인 | 해결 |
|---|---|---|
| Crashed — java 도움말 출력 | Start Command 미설정 | Settings > Deploy > Start Command 입력 |
| Application failed to respond | 도메인 포트 불일치 | Networking에서 포트 8080으로 수정 |
| DB 연결 실패 | 환경변수 누락 또는 이름 오타 | Variables 탭에서 MYSQL* 변수 확인 |
| prod 프로필 미적용 | SPRING_PROFILES_ACTIVE 누락 | Variables에 `SPRING_PROFILES_ACTIVE=prod` 추가 |
| CORS 403 Forbidden | Vercel 프리뷰 URL이 배포마다 달라 등록 불가 | `SecurityConfig`에 `allowedOriginPatterns("https://*.vercel.app")` 추가 |

---

## Vercel 연동 시 CORS 설정 방법

`SecurityConfig.java` 에 아래 내용 추가:

```java
// 필드 추가
@Value("${app.cors.allowed-origin-patterns:https://*.vercel.app}")
private String[] allowedOriginPatterns;

// corsConfigurationSource() 메서드 내부에 추가
config.setAllowedOriginPatterns(Arrays.asList(allowedOriginPatterns));
```

> Vercel은 배포마다 고유한 프리뷰 URL을 생성함 (`xxx-hash-user.vercel.app`).
> `allowedOrigins` 에 일일이 등록하는 건 불가능하므로 `allowedOriginPatterns` 와일드카드 사용.

---

## .gitignore 필수 항목

```
.env
.env.local
src/main/resources/application-local.yml
uploads/
```
