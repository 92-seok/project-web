import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';

interface IMyPageLayoutProps {
  children: ReactNode;
  activeMenu: string;
}

const MENU_ITEMS = [
  { href: '/mypage', label: '마이페이지', icon: User },
  { href: '/mypage/orders', label: '주문 내역', icon: Package },
  { href: '/mypage/wishlist', label: '찜 목록', icon: Heart },
  { href: '/mypage/profile', label: '프로필 수정', icon: Settings },
];

function LogoutButton() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className='flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors'
    >
      <LogOut className='w-4 h-4' />
      로그아웃
    </button>
  );
}

export function MyPageLayout({ children, activeMenu }: IMyPageLayoutProps) {
  return (
    <div className='min-h-screen'>
      <div className='border-b border-border px-4 md:px-8 py-8 bg-secondary/30'>
        <p className='text-[10px] tracking-[0.3em] text-accent uppercase font-semibold mb-2'>
          MY ACCOUNT
        </p>
        <h1 className='font-editorial text-3xl md:text-[2.25rem] font-bold tracking-tight'>
          마이페이지
        </h1>
      </div>

      <div className='flex max-w-screen-xl mx-auto'>
        {/* 사이드 메뉴 (데스크톱) */}
        <aside className='hidden md:block w-56 shrink-0 py-8 px-4 border-r border-border'>
          <nav className='space-y-1'>
            {MENU_ITEMS.map((item) => {
              const isActive = activeMenu === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${isActive ? 'text-accent' : ''}`}
                    strokeWidth={isActive ? 2.4 : 1.8}
                  />
                  {item.label}
                </Link>
              );
            })}
            <LogoutButton />
          </nav>
        </aside>

        {/* 모바일 탭 메뉴 */}
        <div className='md:hidden w-full'>
          <div className='border-b border-border overflow-x-auto'>
            <div className='flex'>
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex-none px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeMenu === item.href
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 콘텐츠 */}
          <main className='px-4 py-8'>{children}</main>
        </div>

        {/* 데스크톱 콘텐츠 */}
        <main className='hidden md:block flex-1 min-w-0 px-8 py-10'>{children}</main>
      </div>
    </div>
  );
}
