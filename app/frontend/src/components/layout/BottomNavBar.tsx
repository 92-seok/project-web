import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';

interface INavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NAV_ITEMS: INavItem[] = [
  { to: '/', icon: Home, label: '홈' },
  { to: '/search', icon: Search, label: '검색' },
  { to: '/cart', icon: ShoppingCart, label: '장바구니' },
  { to: '/wishlist', icon: Heart, label: '찜' },
  { to: '/mypage', icon: User, label: '마이' },
];

export function BottomNavBar() {
  const { pathname } = useLocation();

  return (
    <nav
      className='md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/95 backdrop-blur-md border-t border-border'
      aria-label='주요 탐색'
    >
      <ul className='flex h-full'>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to;
          return (
            <li key={to} className='flex-1'>
              <Link
                to={to}
                className={`flex flex-col items-center justify-center h-full gap-1 transition-colors ${
                  isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className='w-5 h-5' strokeWidth={isActive ? 2.4 : 1.8} />
                <span className='text-[10px] font-semibold'>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
