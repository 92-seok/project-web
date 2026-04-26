import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '@/types/auth';

interface IAuthState {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  setAuth: (user: UserInfo, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  updateUserName: (name: string) => void;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isLoggedIn: true }),

      setAccessToken: (accessToken) => set({ accessToken }),

      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false }),

      updateUserName: (name) =>
        set((state) => ({
          user: state.user ? { ...state.user, name } : null,
        })),
    }),
    { name: 'pawmart-auth' },
  ),
);
