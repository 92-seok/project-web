import { apiClient } from './client';
import type { UserInfo } from '@/types/auth';

export interface IUpdateProfileRequest {
  name?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  postalCode?: string;
  roadAddress?: string;
  jibunAddress?: string;
  detailAddress?: string;
  smsAgreed?: boolean;
  emailAgreed?: boolean;
}

export const memberApi = {
  updateProfile: async (data: IUpdateProfileRequest): Promise<void> => {
    await apiClient.patch('/members/me', data);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.patch('/members/me/password', { currentPassword, newPassword });
  },

  withdraw: async (): Promise<void> => {
    await apiClient.delete('/members/me');
  },

  getMe: async (): Promise<UserInfo> => {
    const res = await apiClient.get<UserInfo>('/auth/me');
    return res.data;
  },
};
