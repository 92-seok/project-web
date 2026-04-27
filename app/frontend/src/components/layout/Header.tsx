import { Link, useNavigate } from "react-router-dom";
import { LogIn, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import { SearchBar } from "@/components/search/SearchBar";
import { PetProfileChip } from "@/components/layout/PetProfileChip";

const NAV_CATEGORIES = [
  { label: "강아지", href: "/products?pet=dog" },
  { label: "고양이", href: "/products?pet=cat" },
  { label: "사료", href: "/products?category=food" },
  { label: "간식", href: "/products?category=snack" },
  { label: "용품", href: "/products?category=supplies" },
  { label: "특가", href: "/products?sort=sale" },
  { label: "케어 가이드", href: "/care-guides" },
];

export function Header() {
  const { user, isLoggedIn } = useAuth();
  const totalCount = useCartStore((state) => state.totalCount);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md">
      {/* 유틸리티 바 — 가장 어두운 배경으로 시각적 구분 */}
      <div className="h-9 bg-foreground text-background/75 text-xs flex items-center justify-between px-4 md:px-8">
        <span className="truncate">
          🌿 5만원 이상 무료배송 · 오후 3시 전 주문 시 내일 새벽 도착
        </span>
        <div className="hidden md:flex items-center gap-4">
          <span>1588-0000</span>
          <Link
            to="/orders"
            className="hover:text-background transition-colors"
          >
            주문조회
          </Link>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="h-20 bg-background/80 border-b border-border/60 relative">
        <div className="flex items-center justify-between h-full px-4 md:px-8 max-w-[1440px] mx-auto">
          {/* 좌측: 데스크톱 검색창 */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <SearchBar
              initialValue=""
              onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
              size="sm"
            />
          </div>

          {/* 모바일: 로고 좌측 */}
          <Link
            to="/"
            className="md:hidden font-editorial text-[1.6rem] md:text-[1.75rem] font-bold tracking-tight text-foreground"
          >
            PAWMART
          </Link>

          {/* 로고: 데스크톱 절대 중앙 */}
          <Link
            to="/"
            className="hidden md:block absolute left-1/2 -translate-x-1/2 font-editorial text-[1.6rem] md:text-[1.75rem] font-bold tracking-tight text-foreground"
          >
            PAWMART
          </Link>

          {/* 우측 영역: 펫 프로필 칩 + 아이콘 */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <PetProfileChip />
            {/* 모바일 검색 */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="검색"
              onClick={() => navigate("/search")}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* 장바구니 */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="장바구니"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalCount > 99 ? "99+" : totalCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* 데스크톱 — 로그인 시 마이페이지, 비로그인 시 로그인 버튼 */}
            {isLoggedIn && user ? (
              <Link
                to="/mypage"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                <span className="w-7 h-7 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </span>
                <span>{user.name}님</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인</span>
              </Link>
            )}

            {/* 모바일 — 로그인/마이페이지 아이콘 */}
            <Link
              to={isLoggedIn ? "/mypage" : "/login"}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 hover:text-muted-foreground transition-colors"
              aria-label={isLoggedIn ? "마이페이지" : "로그인"}
            >
              {isLoggedIn ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            </Link>
          </div>
        </div>
      </div>

      {/* GNB 바 */}
      <nav className="h-11 bg-primary w-full hidden md:block">
        <div className="flex items-center justify-center gap-8 lg:gap-12 px-8 h-full max-w-[1440px] mx-auto">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              to={cat.href}
              className="text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors whitespace-nowrap relative group"
            >
              {cat.label}
              <span className="absolute -bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
