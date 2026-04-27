import { Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { ProductManagePage } from '@/pages/admin/ProductManagePage';
import { OrderManagePage } from '@/pages/admin/OrderManagePage';
import { MemberManagePage } from '@/pages/admin/MemberManagePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { HomePage } from '@/pages/HomePage';
import { ProductListPage } from '@/pages/ProductListPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderCompletePage } from '@/pages/OrderCompletePage';
import { MyPage } from '@/pages/MyPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { OrderListPage } from '@/pages/OrderListPage';
import { ProfileEditPage } from '@/pages/ProfileEditPage';
import { PetManagePage } from '@/pages/PetManagePage';
import { SearchPage } from '@/pages/SearchPage';
import { CareGuidePage } from '@/pages/CareGuidePage';
import { CareGuideDetailPage } from '@/pages/CareGuideDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage';
import { PaymentFailPage } from '@/pages/PaymentFailPage';
import { PrivateRoute } from '@/components/PrivateRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ScrollToTop } from '@/components/ScrollToTop';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        {/* 메인 / 상품 / 검색 — 비로그인도 둘러볼 수 있음 */}
        <Route
          path='/'
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path='/products'
          element={
            <AppLayout>
              <ProductListPage />
            </AppLayout>
          }
        />
        <Route
          path='/products/:id'
          element={
            <AppLayout>
              <ProductDetailPage />
            </AppLayout>
          }
        />
        <Route
          path='/cart'
          element={
            <PrivateRoute>
              <AppLayout>
                <CartPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path='/checkout'
          element={
            <PrivateRoute>
              <AppLayout>
                <CheckoutPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path='/orders/complete'
          element={
            <PrivateRoute>
              <AppLayout>
                <OrderCompletePage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path='/mypage'
          element={
            <PrivateRoute>
              <AppLayout>
                <MyPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path='/mypage/orders'
          element={
            <PrivateRoute>
              <AppLayout>
                <OrderListPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path='/mypage/profile'
          element={
            <PrivateRoute>
              <AppLayout>
                <ProfileEditPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path='/mypage/wishlist'
          element={
            <PrivateRoute>
              <AppLayout>
                <WishlistPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path='/mypage/pets'
          element={
            <PrivateRoute>
              <AppLayout>
                <PetManagePage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path='/search'
          element={
            <AppLayout>
              <SearchPage />
            </AppLayout>
          }
        />
        {/* 케어 가이드 — 공개 콘텐츠 (PrivateRoute 불필요) */}
        <Route
          path='/care-guides'
          element={
            <AppLayout>
              <CareGuidePage />
            </AppLayout>
          }
        />
        <Route
          path='/care-guides/:id'
          element={
            <AppLayout>
              <CareGuideDetailPage />
            </AppLayout>
          }
        />
        {/* 토스페이먼츠 리다이렉트 — PrivateRoute 밖에 위치 (비로그인 상태로 돌아올 수 있음) */}
        <Route path='/payment/success' element={<PaymentSuccessPage />} />
        <Route path='/payment/fail' element={<PaymentFailPage />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path='products' element={<ProductManagePage />} />
          <Route path='orders' element={<OrderManagePage />} />
          <Route path='members' element={<MemberManagePage />} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
