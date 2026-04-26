import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  UserInfo,
} from '@/types/auth';

export const authApi = {
  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const res = await apiClient.post<SignUpResponse>('/auth/signup', data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/auth/login', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<UserInfo> => {
    const res = await apiClient.get<UserInfo>('/auth/me');
    return res.data;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const res = await apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
    return res.data;
  },
};
