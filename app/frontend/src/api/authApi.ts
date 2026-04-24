import { apiClient } from './client'
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from '@/types/auth'

export const authApi = {
  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const res = await apiClient.post<SignUpResponse>('/auth/signup', data)
    return res.data
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/auth/login', data)
    return res.data
  },
}
