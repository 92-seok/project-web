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
import { session } from '@/lib/session'
import type { ApiErrorResponse } from '@/types/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await authApi.login({ loginId, password })
      session.save(res)
      navigate('/home')
    } catch (err) {
      const apiErr = err as ApiErrorResponse
      setError(apiErr.message ?? '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>Pawmart 계정으로 로그인하세요.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="loginId">아이디</Label>
              <Input
                id="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="underline underline-offset-4">
                회원가입
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
