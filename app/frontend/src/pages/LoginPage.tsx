import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AuthInput } from '@/components/auth/AuthInput';
import { useAuth, extractApiError } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const { login } = useAuth();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginId, password);
    } catch (err) {
      const apiErr = extractApiError(err);
      setError(apiErr.message ?? '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex min-h-screen flex-col md:flex-row'>
      {/* 왼쪽: 브랜드 비주얼 (데스크톱 전용) — Editorial Wellness */}
      <div className='hidden md:flex md:w-1/2 flex-col items-center justify-center gap-8 bg-primary px-10 text-primary-foreground relative overflow-hidden'>
        {/* 장식 원형 */}
        <div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-accent/15' />
        <div className='absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-[var(--badge-care)]/10' />
        <div className='absolute top-1/3 right-12 w-24 h-24 rounded-full bg-[var(--badge-dental)]/15' />

        <div className='relative z-10 text-center'>
          <p className='text-[11px] tracking-[0.4em] uppercase text-primary-foreground/70 mb-4'>
            EVERYDAY WELLNESS
          </p>
          <h1 className='font-editorial text-5xl font-bold tracking-tight'>Pawmart</h1>
          <p className='mt-4 text-lg text-primary-foreground/85'>
            우리 아이의 건강한 한 끼
          </p>
          <p className='mt-5 max-w-xs text-sm text-primary-foreground/70 leading-relaxed'>
            수의사가 검증한 프리미엄 사료부터 데일리 케어용품까지<br />
            반려동물의 일상을 함께합니다.
          </p>
        </div>
      </div>

      {/* 오른쪽: 로그인 폼 */}
      <div className='flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 md:w-1/2'>
        {/* 모바일 브랜드 헤더 */}
        <div className='mb-10 text-center md:hidden'>
          <h1 className='font-editorial text-3xl font-bold text-foreground'>Pawmart</h1>
          <p className='mt-1.5 text-sm text-muted-foreground'>우리 아이의 건강한 한 끼</p>
        </div>

        <div className='w-full max-w-sm lg:max-w-md'>
          <div className='mb-7'>
            <h2 className='font-editorial text-2xl font-bold text-foreground'>로그인</h2>
            <p className='mt-1.5 text-sm text-muted-foreground'>오랜만이에요, 다시 만나서 반가워요</p>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {/* 아이디 */}
            <div className='grid gap-2'>
              <Label htmlFor='loginId'>아이디</Label>
              <AuthInput
                id='loginId'
                icon={User}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                autoFocus
                autoComplete='username'
                placeholder='아이디를 입력하세요'
                error={!!error}
              />
            </div>

            {/* 비밀번호 */}
            <div className='grid gap-2'>
              <Label htmlFor='password'>비밀번호</Label>
              <AuthInput
                id='password'
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='current-password'
                placeholder='비밀번호를 입력하세요'
                error={!!error}
                rightElement={
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </Button>
                }
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div
                className='flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'
                role='alert'
              >
                <AlertCircle size={15} className='shrink-0' />
                <span>{error}</span>
              </div>
            )}

            {/* 로그인 버튼 */}
            <Button type='submit' className='w-full' size='lg' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={15} className='animate-spin' />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>

            {/* 소셜 로그인 */}
            <div className='flex items-center gap-3'>
              <Separator className='flex-1' />
              <span className='text-xs text-muted-foreground'>또는</span>
              <Separator className='flex-1' />
            </div>

            <button
              type='button'
              className='flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 motion-reduce:transform-none'
              style={{ backgroundColor: '#FEE500', color: '#191919' }}
            >
              <span className='text-base leading-none'>💬</span>
              카카오로 계속하기
            </button>

            <button
              type='button'
              className='flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 motion-reduce:transform-none'
              style={{ backgroundColor: '#03C75A' }}
            >
              <span className='text-base leading-none font-bold'>N</span>
              네이버로 계속하기
            </button>

            <p className='text-center text-sm text-muted-foreground pt-1'>
              계정이 없으신가요?{' '}
              <Link
                to='/signup'
                className='font-semibold text-accent underline-offset-4 hover:underline'
              >
                회원가입
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
