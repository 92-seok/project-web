import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AuthInput } from '@/components/auth/AuthInput';
import { authApi } from '@/api/authApi';
import { extractApiError } from '@/hooks/useAuth';
import type { SignUpRequest } from '@/types/auth';

type FormState = Pick<SignUpRequest, 'loginId' | 'password' | 'name' | 'email' | 'phone'>;

export function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    loginId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      await authApi.signUp({ ...form, smsAgreed: false, emailAgreed: false });
      navigate('/login', { state: { justSignedUp: true } });
    } catch (err) {
      const apiErr = extractApiError(err);
      setError(apiErr.message ?? '회원가입에 실패했습니다.');
      if (apiErr.fieldErrors?.length) {
        const map: Record<string, string> = {};
        for (const fe of apiErr.fieldErrors) map[fe.field] = fe.reason;
        setFieldErrors(map);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-background px-4 py-8 md:flex md:items-center md:justify-center md:py-12'>
      <div className='w-full max-w-lg'>
        {/* 헤더 */}
        <div className='mb-8 flex items-center gap-3'>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            aria-label='뒤로가기'
            onClick={() => navigate('/login')}
          >
            <ChevronLeft size={18} />
          </Button>
          <div>
            <h1 className='font-editorial text-2xl font-bold text-foreground'>회원가입</h1>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Pawmart에서 우리 아이의 건강한 일상을
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          {/* 필수 정보 섹션 */}
          <section className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-semibold uppercase tracking-wider text-accent'>필수 정보</span>
              <div className='h-px flex-1 bg-border' />
            </div>

            <Field
              id='loginId'
              label='아이디'
              icon={User}
              value={form.loginId}
              onChange={onChange('loginId')}
              hint='영문·숫자·언더스코어 4~20자'
              error={fieldErrors.loginId}
              required
            />
            <Field
              id='password'
              label='비밀번호'
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={onChange('password')}
              hint='8~30자'
              error={fieldErrors.password}
              required
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
            <Field
              id='name'
              label='이름'
              icon={UserCircle}
              value={form.name}
              onChange={onChange('name')}
              error={fieldErrors.name}
              required
            />
            <Field
              id='email'
              label='이메일'
              icon={Mail}
              type='email'
              value={form.email}
              onChange={onChange('email')}
              error={fieldErrors.email}
              required
            />
          </section>

          {/* 선택 정보 섹션 */}
          <section className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>선택 정보</span>
              <div className='h-px flex-1 bg-border' />
            </div>

            <Field
              id='phone'
              label='전화번호'
              icon={Phone}
              value={form.phone ?? ''}
              onChange={onChange('phone')}
              hint='010-1234-5678'
              error={fieldErrors.phone}
              placeholder='010-0000-0000'
            />
          </section>

          {/* 전체 에러 */}
          {error && (
            <div
              className='flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'
              role='alert'
            >
              <AlertCircle size={15} className='shrink-0' />
              <span>{error}</span>
            </div>
          )}

          {/* 약관 동의 */}
          <label className='flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50'>
            <input
              type='checkbox'
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary'
            />
            <span className='text-sm text-muted-foreground leading-relaxed'>
              <span className='text-accent underline underline-offset-2 cursor-pointer hover:opacity-80'>
                이용약관
              </span>{' '}
              및{' '}
              <span className='text-accent underline underline-offset-2 cursor-pointer hover:opacity-80'>
                개인정보 처리방침
              </span>
              에 동의합니다.
            </span>
          </label>

          {/* 가입 버튼 */}
          <Button type='submit' className='w-full' size='lg' disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={15} className='animate-spin' />
                처리 중...
              </>
            ) : (
              '가입하기'
            )}
          </Button>

          <p className='text-center text-sm text-muted-foreground'>
            이미 계정이 있으신가요?{' '}
            <Link
              to='/login'
              className='font-semibold text-accent underline-offset-4 hover:underline'
            >
              로그인
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

// 내부 Field 컴포넌트 — AuthInput 아이콘 래핑
interface FieldProps {
  id: string;
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rightElement?: React.ReactNode;
}

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  type = 'text',
  hint,
  error,
  required,
  placeholder,
  rightElement,
}: FieldProps) {
  return (
    <div className='grid gap-2'>
      <Label htmlFor={id}>
        {label}
        {required && <span className='text-destructive'> *</span>}
      </Label>
      <AuthInput
        id={id}
        icon={icon}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        error={!!error}
        rightElement={rightElement}
      />
      {error ? (
        <p className='text-xs text-destructive'>{error}</p>
      ) : hint ? (
        <p className='text-xs text-muted-foreground'>{hint}</p>
      ) : null}
    </div>
  );
}
