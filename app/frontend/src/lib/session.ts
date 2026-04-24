import type { LoginResponse } from '@/types/auth'

// JWT 도입 전 임시 세션 저장소. 4단계에서 JWT 기반으로 교체 예정.
const SESSION_KEY = 'pawmart.session'

export const session = {
  save(member: LoginResponse) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(member))
  },
  load(): LoginResponse | null {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as LoginResponse
    } catch {
      return null
    }
  },
  clear() {
    localStorage.removeItem(SESSION_KEY)
  },
}
