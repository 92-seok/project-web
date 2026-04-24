import axios, { type AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/auth'

/**
 * Vite dev proxy 가 /api 요청을 http://localhost:9000 으로 포워딩한다.
 * 프로덕션에서는 환경변수(VITE_API_BASE_URL) 를 통해 전체 URL 로 바꿀 수 있다.
 */
export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// 응답 인터셉터: 백엔드 ErrorResponse 포맷을 그대로 reject 로 넘겨서
// 페이지에서 err.code / err.message / err.fieldErrors 로 접근 가능하게 한다.
apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiErrorResponse>) => {
    if (err.response?.data) {
      return Promise.reject(err.response.data)
    }
    return Promise.reject({
      code: 'NETWORK',
      message: '네트워크 오류가 발생했습니다.',
      fieldErrors: [],
    } satisfies ApiErrorResponse)
  },
)
