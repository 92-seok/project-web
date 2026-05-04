import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, PackagePlus, Boxes, ShoppingCart, Users, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface INavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: INavItem[] = [
  { label: '대시보드', path: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: '상품관리', path: '/admin/products', icon: <Package size={18} /> },
  { label: '상품등록', path: '/admin/products/new', icon: <PackagePlus size={18} /> },
  { label: '재고관리', path: '/admin/stock', icon: <Boxes size={18} /> },
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
    <div className='min-h-screen flex bg-background'>
      {/* 모바일 오버레이 */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-foreground/50 z-20 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 사이드바 — sticky + h-screen으로 lg에서 화면 100% 채움 */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground z-30 flex flex-col
          transition-transform duration-200
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:top-0 lg:z-auto lg:shrink-0
        `}
      >
        <div className='px-6 py-6 border-b border-sidebar-border'>
          <Link to='/' className='flex items-center gap-2'>
            <span className='inline-flex w-9 h-9 rounded-2xl bg-accent text-accent-foreground items-center justify-center text-base font-black'>P</span>
            <div>
              <p className='font-editorial text-base font-bold leading-tight'>Pawmart</p>
              <p className='text-[10px] tracking-[0.2em] uppercase text-sidebar-foreground/60'>Admin</p>
            </div>
          </Link>
        </div>

        <nav className='flex-1 py-4 px-3'>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='p-3 border-t border-sidebar-border'>
          <div className='flex items-center gap-3 px-3 py-2 mb-2'>
            <span className='w-9 h-9 rounded-full bg-sidebar-accent grid place-items-center text-sm font-bold'>
              {user.name.charAt(0)}
            </span>
            <div className='flex-1 min-w-0'>
              <p className='text-xs font-semibold truncate'>{user.name}</p>
              <p className='text-[10px] text-sidebar-foreground/60 truncate'>{user.loginId}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors'
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 영역 */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* 상단 헤더 */}
        <header className='h-14 bg-card border-b border-border flex items-center px-6 gap-4 shrink-0 lg:hidden'>
          <button
            onClick={() => setIsSidebarOpen((v) => !v)}
            className='text-foreground'
            aria-label='메뉴 열기'
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className='text-xs font-bold tracking-[0.15em] uppercase text-foreground/60'>
            ADMIN PANEL
          </span>
        </header>

        <main className='flex-1 overflow-auto'>
          <div className='max-w-[1440px] mx-auto p-5 md:p-8 lg:p-10'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
