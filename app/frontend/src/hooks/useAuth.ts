import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/authApi';
import { memberApi } from '@/api/memberApi';
import type { ApiErrorResponse } from '@/types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isLoggedIn, setAuth, clearAuth } = useAuthStore();

  const login = async (loginId: string, password: string): Promise<void> => {
    const res = await authApi.login({ loginId, password });
    setAuth(
      { memberId: res.memberId, loginId: res.loginId, name: res.name, role: res.role },
      res.accessToken,
      res.refreshToken,
    );
    navigate('/');
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // 서버 오류여도 로컬 세션은 반드시 초기화
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return { user, isLoggedIn, login, logout };
}

/**
 * 앱 최상위(AppLayout 등)에서 단 한 번 마운트해 토큰 유효성을 검증합니다.
 * 유효하면 서버의 최신 user 정보로 스토어를 갱신하고,
 * 실패(401 포함)하면 로컬 세션을 초기화합니다.
 */
export function useAuthInitializer() {
  const { accessToken, setAuth, clearAuth, refreshToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    memberApi.getMe().then((userInfo) => {
      // getMe 성공 시 스토어의 user 정보를 최신화
      // accessToken, refreshToken은 기존 값 유지
      setAuth(userInfo, accessToken, refreshToken ?? '');
    }).catch(() => {
      // 401 또는 네트워크 오류: 세션 초기화
      clearAuth();
    });
    // 마운트 시 한 번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// 에러 응답에서 메시지를 꺼내는 헬퍼 (페이지 컴포넌트에서 재사용)
export function extractApiError(err: unknown): ApiErrorResponse {
  const fallback: ApiErrorResponse = {
    code: 'UNKNOWN',
    message: '알 수 없는 오류가 발생했습니다.',
    fieldErrors: [],
  };
  if (err && typeof err === 'object' && 'message' in err) {
    return err as ApiErrorResponse;
  }
  return fallback;
}
