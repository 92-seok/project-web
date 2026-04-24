import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/api/authApi'
import type { ApiErrorResponse, SignUpRequest } from '@/types/auth'

type FormState = Pick<
  SignUpRequest,
  'loginId' | 'password' | 'name' | 'email' | 'phone'
>

export function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    loginId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)
    try {
      await authApi.signUp({ ...form, smsAgreed: false, emailAgreed: false })
      // 가입 성공 → 로그인 페이지로 이동
      navigate('/login', { state: { justSignedUp: true } })
    } catch (err) {
      const apiErr = err as ApiErrorResponse
      setError(apiErr.message ?? '회원가입에 실패했습니다.')
      if (apiErr.fieldErrors?.length) {
        const map: Record<string, string> = {}
        for (const fe of apiErr.fieldErrors) map[fe.field] = fe.reason
        setFieldErrors(map)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>아이디·비밀번호·이름·이메일만 입력하면 가입됩니다.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Field
              id="loginId"
              label="아이디"
              value={form.loginId}
              onChange={onChange('loginId')}
              hint="영문·숫자·언더스코어 4~20자"
              error={fieldErrors.loginId}
              required
            />
            <Field
              id="password"
              label="비밀번호"
              type="password"
              value={form.password}
              onChange={onChange('password')}
              hint="8~30자"
              error={fieldErrors.password}
              required
            />
            <Field
              id="name"
              label="이름"
              value={form.name}
              onChange={onChange('name')}
              error={fieldErrors.name}
              required
            />
            <Field
              id="email"
              label="이메일"
              type="email"
              value={form.email}
              onChange={onChange('email')}
              error={fieldErrors.email}
              required
            />
            <Field
              id="phone"
              label="전화번호"
              value={form.phone ?? ''}
              onChange={onChange('phone')}
              hint="010-1234-5678"
              error={fieldErrors.phone}
            />
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '처리 중...' : '가입하기'}
            </Button>
            <p className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="underline underline-offset-4">
                로그인
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

// 재사용 최소 Field: label + input + 에러/힌트
interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  hint?: string
  error?: string
  required?: boolean
}

function Field({ id, label, value, onChange, type = 'text', hint, error, required }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input id={id} type={type} value={value} onChange={onChange} required={required} />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
