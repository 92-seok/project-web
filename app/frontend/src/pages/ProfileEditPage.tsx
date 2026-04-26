import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { memberApi } from '@/api/memberApi';
import { extractApiError } from '@/hooks/useAuth';
import { AddressSearch } from '@/components/address/AddressSearch';

interface IFieldProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

function Field({ label, value, onChange, type = 'text', placeholder, required, disabled }: IFieldProps) {
  return (
    <div className='space-y-1.5'>
      <label className='text-xs font-semibold text-foreground/80'>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className='w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed'
      />
    </div>
  );
}

// ─── 섹션 1: 개인정보 수정 ───────────────────────────────────────────────────

function ProfileSection() {
  const { user } = useAuth();
  const updateUserName = useAuthStore((s) => s.updateUserName);

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [jibunAddress, setJibunAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressChange = (newPostalCode: string, newRoadAddress: string, newJibunAddress: string) => {
    setPostalCode(newPostalCode);
    setRoadAddress(newRoadAddress);
    setJibunAddress(newJibunAddress);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await memberApi.updateProfile({
        name,
        phone: phone || undefined,
        postalCode: postalCode || undefined,
        roadAddress: roadAddress || undefined,
        jibunAddress: jibunAddress || undefined,
        detailAddress: detailAddress || undefined,
      });
      updateUserName(name);
      toast.success('정보가 수정되었습니다');
    } catch (err) {
      const { message } = extractApiError(err);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className='max-w-md space-y-6'>
      <div>
        <p className='text-[10px] tracking-[0.3em] font-semibold uppercase text-accent mb-1'>
          PROFILE
        </p>
        <h2 className='font-editorial text-xl font-bold mb-5'>개인정보 수정</h2>
        <div className='space-y-4'>
          <Field
            label='이름'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Field
            label='로그인 아이디'
            value={user?.loginId ?? ''}
            disabled
          />
          <Field
            label='전화번호'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='010-0000-0000'
          />
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-foreground/80'>주소</label>
            <AddressSearch
              postalCode={postalCode}
              roadAddress={roadAddress}
              detailAddress={detailAddress}
              onAddressChange={handleAddressChange}
              onDetailChange={setDetailAddress}
            />
          </div>
        </div>
      </div>

      <div className='flex gap-3 pt-2'>
        <button
          type='submit'
          disabled={isLoading}
          className='flex-1 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
        >
          {isLoading ? '저장 중...' : '저장'}
        </button>
        <Link
          to='/mypage'
          className='flex-1 py-3 rounded-full border border-border text-foreground text-sm font-semibold text-center hover:border-accent hover:text-accent transition-colors'
        >
          취소
        </Link>
      </div>
    </form>
  );
}

// ─── 섹션 2: 비밀번호 변경 ───────────────────────────────────────────────────

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error('새 비밀번호는 최소 8자 이상이어야 합니다');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다');
      return;
    }

    setIsLoading(true);
    try {
      await memberApi.changePassword(currentPassword, newPassword);
      toast.success('비밀번호가 변경되었습니다');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const { code, message } = extractApiError(err);
      if (code === 'M005') {
        toast.error('현재 비밀번호와 동일합니다');
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className='max-w-md space-y-6'>
      <div>
        <p className='text-[10px] tracking-[0.3em] font-semibold uppercase text-accent mb-1'>
          SECURITY
        </p>
        <h2 className='font-editorial text-xl font-bold mb-5'>비밀번호 변경</h2>
        <div className='space-y-4'>
          <Field
            label='현재 비밀번호'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type='password'
            placeholder='현재 비밀번호'
            required
          />
          <Field
            label='새 비밀번호'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type='password'
            placeholder='새 비밀번호 (8~30자)'
            required
          />
          <Field
            label='새 비밀번호 확인'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type='password'
            placeholder='새 비밀번호 재입력'
            required
          />
        </div>
      </div>

      <div className='flex gap-3 pt-2'>
        <button
          type='submit'
          disabled={isLoading}
          className='flex-1 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
        >
          {isLoading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </div>
    </form>
  );
}

// ─── 섹션 3: 회원 탈퇴 ───────────────────────────────────────────────────────

function WithdrawSection() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      '정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.',
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await memberApi.withdraw();
      clearAuth();
      navigate('/login');
    } catch (err) {
      const { message } = extractApiError(err);
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-md'>
      <p className='text-[10px] tracking-[0.3em] font-semibold uppercase text-destructive mb-1'>
        DANGER ZONE
      </p>
      <h2 className='font-editorial text-xl font-bold mb-3'>위험 영역</h2>
      <p className='text-sm text-muted-foreground mb-5 leading-relaxed'>
        탈퇴 시 계정과 관련된 모든 데이터가 영구적으로 삭제되며 복구할 수 없어요.
      </p>
      <button
        type='button'
        onClick={handleWithdraw}
        disabled={isLoading}
        className='px-5 py-2.5 rounded-full border border-destructive/40 text-destructive text-sm font-semibold hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? '처리 중...' : '회원 탈퇴'}
      </button>
    </div>
  );
}

// ─── 페이지 조합 ─────────────────────────────────────────────────────────────

export function ProfileEditPage() {
  return (
    <MyPageLayout activeMenu='/mypage/profile'>
      <div className='space-y-10'>
        <ProfileSection />

        <Separator />

        <PasswordSection />

        <Separator />

        <WithdrawSection />
      </div>
    </MyPageLayout>
  );
}
