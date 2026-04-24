// 백엔드 DTO 와 1:1 매칭되는 타입. 백엔드 스키마가 바뀌면 이 파일만 맞추면 전체에 전파됨.

export type MemberRole = 'USER' | 'ADMIN'

export interface SignUpRequest {
  loginId: string
  password: string
  name: string
  email: string
  gender?: string
  birthDate?: string // ISO date: YYYY-MM-DD
  phone?: string
  smsAgreed?: boolean
  emailAgreed?: boolean
  postalCode?: string
  roadAddress?: string
  jibunAddress?: string
  detailAddress?: string
}

export interface SignUpResponse {
  memberId: number
}

export interface LoginRequest {
  loginId: string
  password: string
}

export interface LoginResponse {
  memberId: number
  loginId: string
  name: string
  role: MemberRole
}

export interface ApiErrorResponse {
  code: string
  message: string
  fieldErrors: { field: string; reason: string }[]
}
