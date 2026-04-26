import { useState } from 'react';
import { ChevronDown, PawPrint, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

/**
 * PetProfileChip — 헤더에 표시되는 펫 프로필 칩 (점진적 프로파일링)
 *
 * 비로그인: 표시 안 함
 * 로그인 + 미입력: "+ 펫 등록" 버튼
 * 로그인 + 입력: "내 강아지: 뽀삐 ▾" 형태
 *
 * 실제 펫 정보는 향후 백엔드 연동 — 현재는 localStorage 기반 mock
 */

interface IPetProfile {
  name: string;
  type: 'dog' | 'cat';
  age?: number;
}

const STORAGE_KEY = 'pawmart_pet_profile';

function loadProfile(): IPetProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as IPetProfile) : null;
  } catch {
    return null;
  }
}

export function PetProfileChip() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [profile, setProfile] = useState<IPetProfile | null>(loadProfile);
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoggedIn) return null;

  const handleAdd = () => {
    const name = window.prompt('아이의 이름을 알려주세요 (예: 뽀삐)');
    if (!name) return;
    const typeAns = window.prompt('강아지(d) / 고양이(c)를 입력해주세요', 'd');
    const type: IPetProfile['type'] = typeAns === 'c' ? 'cat' : 'dog';
    const next = { name, type };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProfile(next);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    setIsOpen(false);
  };

  if (!profile) {
    return (
      <button
        onClick={handleAdd}
        className='hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:text-accent hover:border-accent transition-colors'
        aria-label='펫 프로필 등록'
      >
        <Plus className='w-3.5 h-3.5' />
        펫 등록
      </button>
    );
  }

  const emoji = profile.type === 'cat' ? '🐈' : '🐕';

  return (
    <div className='relative hidden md:block'>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-semibold text-foreground hover:bg-secondary/70 transition-colors'
        aria-expanded={isOpen}
        aria-label={`현재 프로필: ${profile.name}`}
      >
        <PawPrint className='w-3.5 h-3.5 text-accent' />
        <span>
          내 {profile.type === 'cat' ? '고양이' : '강아지'}: {profile.name}
        </span>
        <ChevronDown className='w-3 h-3 text-muted-foreground' />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-56 rounded-xl bg-popover shadow-lg border border-border p-2 text-sm z-50'>
          <div className='px-3 py-2.5 border-b border-border mb-1'>
            <p className='text-2xl mb-1'>{emoji}</p>
            <p className='font-semibold text-foreground'>{profile.name}</p>
            <p className='text-xs text-muted-foreground'>
              {profile.type === 'cat' ? '고양이' : '강아지'} 보호자
            </p>
          </div>
          <button
            onClick={handleAdd}
            className='w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-foreground'
          >
            프로필 수정
          </button>
          <button
            onClick={handleClear}
            className='w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground'
          >
            프로필 삭제
          </button>
        </div>
      )}
    </div>
  );
}
