import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { ReactNode } from 'react';

interface IPrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: IPrivateRouteProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
}
