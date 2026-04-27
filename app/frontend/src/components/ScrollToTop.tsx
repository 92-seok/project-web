import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — 라우트(pathname) 전환 시 페이지 최상단으로 스크롤 리셋.
 *
 * React Router는 기본적으로 페이지 이동 시 스크롤 위치를 유지하기 때문에,
 * 긴 페이지(케어가이드 상세 등)에서 다른 페이지로 이동하면 그 위치 그대로 보임.
 * 이 컴포넌트를 라우터 안에 두면 이동 직후 항상 맨 위에서 시작.
 *
 * search/hash 만 바뀐 경우(같은 페이지 내 쿼리 변경)는 스크롤 유지.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
