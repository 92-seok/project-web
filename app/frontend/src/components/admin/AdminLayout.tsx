import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface INavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: INavItem[] = [
  { label: '대시보드', path: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: '상품관리', path: '/admin/products', icon: <Package size={18} /> },
  { label: '주문관리', path: '/admin/orders', icon: <ShoppingCart size={18} /> },
  { label: '회원관리', path: '/admin/members', icon: <Users size={18} /> },
];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <div className='min-h-screen flex bg-secondary'>
      {/* 모바일 오버레이 */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-20 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-primary text-white z-30 flex flex-col
          transition-transform duration-200
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className='p-6 border-b border-white/10'>
          <span className='text-sm font-bold tracking-[0.2em] uppercase'>PAWMART ADMIN</span>
        </div>

        <nav className='flex-1 py-4'>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='p-4 border-t border-white/10'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-2 py-2 text-sm text-white/60 hover:text-white transition-colors'
          >
            <LogOut size={18} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 영역 */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* 상단 헤더 */}
        <header className='h-14 bg-white border-b border-black/10 flex items-center px-6 gap-4 shrink-0'>
          <button
            onClick={() => setIsSidebarOpen((v) => !v)}
            className='lg:hidden text-primary'
            aria-label='메뉴 열기'
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className='text-xs font-bold tracking-[0.15em] uppercase text-primary/40'>
            ADMIN PANEL
          </span>
        </header>

        <main className='flex-1 overflow-auto'>
          <div className='max-w-[1440px] mx-auto p-6 lg:p-8 xl:p-10'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
