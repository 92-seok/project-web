import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '@/types/auth';
import { useAuthStore } from '@/store/authStore';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// 토큰 갱신 중 플래그 (동시 요청 중복 방지)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

// 요청 인터셉터 — accessToken 헤더 자동 주입
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 — 401 시 refresh 후 재시도
apiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<ApiErrorResponse>) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/');

    // auth 엔드포인트 오류거나 401이 아닌 경우: 에러 그대로 전파
    if (err.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      if (err.response?.data) return Promise.reject(err.response.data);
      return Promise.reject({
        code: 'NETWORK',
        message: '네트워크 오류가 발생했습니다.',
        fieldErrors: [],
      } satisfies ApiErrorResponse);
    }

    // 이미 갱신 중인 경우: 큐에 대기
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((queueErr) => Promise.reject(queueErr));
    }

    // refresh token 갱신 시도
    originalRequest._retry = true;
    isRefreshing = true;

    const { refreshToken, setAccessToken, clearAuth } = useAuthStore.getState();

    if (!refreshToken) {
      isRefreshing = false;
      clearAuth();
      window.location.replace('/login');
      return Promise.reject({
        code: 'UNAUTHORIZED',
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        fieldErrors: [],
      } satisfies ApiErrorResponse);
    }

    try {
      // refresh는 인터셉터 루프를 피하기 위해 직접 axios 호출
      const { data } = await axios.post<{ accessToken: string }>('/api/auth/refresh', {
        refreshToken,
      });
      const newToken = data.accessToken;
      setAccessToken(newToken);
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearAuth();
      window.location.replace('/login');
      return Promise.reject({
        code: 'UNAUTHORIZED',
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        fieldErrors: [],
      } satisfies ApiErrorResponse);
    } finally {
      isRefreshing = false;
    }
  },
);
