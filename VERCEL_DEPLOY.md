# Vercel 프론트엔드 배포 가이드

React + Vite 프로젝트를 Vercel에 배포하는 방법 및 이슈 정리

작업일: 2026-06-29

---

## 배포 환경

| 항목 | 내용 |
|---|---|
| 플랫폼 | Vercel |
| 프레임워크 | React 19 + Vite 8 + TypeScript |
| 스타일 | Tailwind CSS v4 + shadcn/ui |
| 상태관리 | Zustand |
| 라우터 | react-router-dom v7 |
| 배포 URL | https://paw-mart-beta.vercel.app |
| GitHub 레포 | 92-seok/project-web |

---

## 수정한 파일

### 1. `app/frontend/src/api/client.ts`

로컬 개발 시 Vite proxy를 통해 `/api` 로 요청하던 것을 프로덕션에서는 환경변수로 실제 백엔드 URL을 주입하도록 변경.

```ts
// 수정 전
export const apiClient = axios.create({
  baseURL: '/api',
});

// 수정 후
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
});
```

refresh 직접 호출 부분도 동일하게 수정 (client.ts 79번 줄):

```ts
const { data } = await axios.post<{ accessToken: string }>(
  `${import.meta.env.VITE_API_BASE_URL ?? '/api'}/auth/refresh`,
  { refreshToken }
);
```

### 2. `app/frontend/vercel.json`

React Router 사용 시 새로고침하면 404 발생. Vercel에서 모든 경로를 `index.html`로 리다이렉트해야 함.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 3. `app/frontend/.env.production`

Vite는 프로덕션 빌드 시 `.env.production` 파일을 자동으로 읽음.

```
VITE_API_BASE_URL=https://project-web-production-ef2f.up.railway.app/api
```

> `VITE_` 접두사가 있는 변수만 클라이언트 번들에 포함됨.
> 민감한 값은 절대 `VITE_` 접두사로 노출하면 안 됨.

---

## Vercel 대시보드 설정

### Build and Deployment

| 항목 | 값 |
|---|---|
| Framework Preset | Vite |
| Root Directory | `app/frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

> Framework Preset을 "Vite"로 설정해야 빌드 최적화가 올바르게 적용됨.

---

## 배포 순서

```bash
# 1. client.ts baseURL 환경변수 적용
# 2. vercel.json 생성
# 3. .env.production 생성

git add app/frontend/src/api/client.ts
git add app/frontend/vercel.json
git add app/frontend/.env.production
git commit -m "feat: Vercel 배포 설정 (API URL, SPA 라우팅)"
git push origin master
```

push 후 Vercel 자동 배포 시작.

---

## 트러블슈팅 기록

| 문제 | 원인 | 해결 |
|---|---|---|
| `api/products 404` | `client.ts` 수정은 했으나 커밋 안 함 → Vercel이 구 코드로 빌드 | `git status` 확인 후 누락된 파일 커밋 |
| `VITE_API_BASE_URL` 미적용 | `.env.production` 파일이 커밋에 없었음 | `app/frontend/.env.production` 생성 후 커밋 |
| TypeScript 빌드 오류 `TS2367` | `modalTarget !== 'new'` 비교에서 타입 불일치 | `else if (modalTarget && modalTarget !== 'new')` → `else if (modalTarget)` 로 수정 |
| CORS 403 Forbidden | Vercel 프리뷰 URL이 배포마다 달라 백엔드 허용 목록에 없음 | 백엔드 `SecurityConfig`에 `allowedOriginPatterns("https://*.vercel.app")` 추가 |
| 새로고침 시 404 | SPA 라우팅을 Vercel이 모름 | `vercel.json` 에 rewrites 설정 추가 |

---

## 주의사항

### Vite proxy는 로컬 전용

`vite.config.ts` 의 proxy 설정은 개발 서버에서만 작동함.
Vercel 배포 환경에서는 proxy 없이 직접 백엔드 URL로 요청함.

```ts
// vite.config.ts — 로컬 전용, Vercel에서는 무시됨
proxy: {
  '/api': { target: 'http://localhost:9000' }
}
```

### Vercel 프리뷰 URL

Vercel은 push마다 고유한 프리뷰 URL을 생성함:
- Production: `paw-mart-beta.vercel.app`
- Preview: `paw-mart-{hash}-92seok.vercel.app`

백엔드 CORS에 프리뷰 URL을 일일이 등록하는 건 불가능하므로
백엔드에서 `allowedOriginPatterns("https://*.vercel.app")` 와일드카드를 사용해야 함.

### .env.production 커밋 여부

`VITE_API_BASE_URL` 은 백엔드 URL로 민감하지 않으므로 git에 커밋 가능.
단, DB 비밀번호, JWT 시크릿 등 민감 정보는 절대 커밋 금지.
