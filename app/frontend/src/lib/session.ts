import type { LoginResponse, UserInfo } from '@/types/auth'

const KEYS = {
  ACCESS_TOKEN: 'pawmart.accessToken',
  REFRESH_TOKEN: 'pawmart.refreshToken',
  USER: 'pawmart.user',
} as const

export const session = {
  save(data: LoginResponse) {
    localStorage.setItem(KEYS.ACCESS_TOKEN, data.accessToken)
    localStorage.setItem(KEYS.REFRESH_TOKEN, data.refreshToken)
    const user: UserInfo = {
      memberId: data.memberId,
      loginId: data.loginId,
      name: data.name,
      role: data.role,
    }
    localStorage.setItem(KEYS.USER, JSON.stringify(user))
  },

  getAccessToken(): string | null {
    return localStorage.getItem(KEYS.ACCESS_TOKEN)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.REFRESH_TOKEN)
  },

  getUser(): UserInfo | null {
    const raw = localStorage.getItem(KEYS.USER)
    if (!raw) return null
    try {
      return JSON.parse(raw) as UserInfo
    } catch {
      return null
    }
  },

  clear() {
    localStorage.removeItem(KEYS.ACCESS_TOKEN)
    localStorage.removeItem(KEYS.REFRESH_TOKEN)
    localStorage.removeItem(KEYS.USER)
  },
}
