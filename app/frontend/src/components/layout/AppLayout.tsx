import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthInitializer } from '@/hooks/useAuth';
import { Header } from './Header';
import { BottomNavBar } from './BottomNavBar';
import { Footer } from './Footer';

interface IAppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: IAppLayoutProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const fetchCart = useCartStore((state) => state.fetchCart);

  // 앱 시작 시 토큰 유효성 검증 및 user 정보 최신화 (한 번만 실행)
  useAuthInitializer();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn, fetchCart]);

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 pb-16 md:pb-0'>{children}</main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
