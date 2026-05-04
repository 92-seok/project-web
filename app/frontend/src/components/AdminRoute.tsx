import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { ReactNode } from 'react';

interface IAdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: IAdminRouteProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const role = useAuthStore((s) => s.user?.role);

  if (!isLoggedIn) {
    return <Navigate to='/login' replace />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
}
