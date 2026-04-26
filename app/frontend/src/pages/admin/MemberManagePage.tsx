import { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '@/api/adminApi';
import type { IAdminMember } from '@/api/adminApi';

const ROLE_LABEL: Record<string, string> = {
  USER: '일반',
  ADMIN: '관리자',
};

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-gray-100 text-gray-600',
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  WITHDRAWN: '탈퇴',
};

export function MemberManagePage() {
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<IAdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function fetchMembers(p: number, keyword: string) {
    setIsLoading(true);
    adminApi.getMembers(p, 20, keyword || undefined)
      .then((data) => {
        setMembers(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error('회원 목록 로드 실패:', err))
      .finally(() => setIsLoading(false));
  }

  // 초기 로드 및 페이지 변경 시
  useEffect(() => {
    fetchMembers(page, query);
  }, [page]);

  // 검색어 debounce
  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPage(0);
      fetchMembers(0, value);
    }, 300);
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-bold tracking-tight text-primary'>회원관리</h1>

      {/* 검색 */}
      <div className='relative w-72'>
        <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-primary/40' />
        <input
          type='text'
          placeholder='이름·이메일·아이디 검색'
          value={query}
          onChange={handleQueryChange}
          className='w-full pl-9 pr-4 py-2 border border-black/20 text-sm bg-white focus:outline-none focus:border-primary'
        />
      </div>

      {/* 테이블 */}
      <div className='bg-white border border-black/10 overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-black/10 text-xs text-primary/50 uppercase tracking-wider'>
              <th className='px-6 py-3 text-left font-medium'>ID</th>
              <th className='px-6 py-3 text-left font-medium'>아이디</th>
              <th className='px-6 py-3 text-left font-medium'>이름</th>
              <th className='px-6 py-3 text-left font-medium'>이메일</th>
              <th className='px-6 py-3 text-left font-medium'>가입일</th>
              <th className='px-6 py-3 text-center font-medium'>권한</th>
              <th className='px-6 py-3 text-center font-medium'>상태</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className='px-6 py-12 text-center text-sm text-primary/40'>
                  불러오는 중...
                </td>
              </tr>
            )}
            {!isLoading && members.map((member) => (
              <tr key={member.id} className='border-b border-black/5 hover:bg-secondary/40'>
                <td className='px-6 py-4 font-mono text-xs text-primary/60'>#{member.id}</td>
                <td className='px-6 py-4 text-primary/70'>{member.loginId}</td>
                <td className='px-6 py-4 font-medium'>{member.name}</td>
                <td className='px-6 py-4 text-primary/70'>{member.email}</td>
                <td className='px-6 py-4 text-primary/70'>{member.createdAt.slice(0, 10)}</td>
                <td className='px-6 py-4 text-center'>
                  <span className='text-xs px-2 py-1 font-medium bg-gray-100 text-gray-700'>
                    {ROLE_LABEL[member.role] ?? member.role}
                  </span>
                </td>
                <td className='px-6 py-4 text-center'>
                  <span
                    className={`text-xs px-2 py-1 font-medium ${
                      STATUS_STYLE[member.status] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {STATUS_LABEL[member.status] ?? member.status}
                  </span>
                </td>
              </tr>
            ))}
            {!isLoading && members.length === 0 && (
              <tr>
                <td colSpan={7} className='px-6 py-12 text-center text-sm text-primary/40'>
                  {query ? '검색 결과가 없습니다.' : '등록된 회원이 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className='p-1.5 border border-black/20 text-primary/60 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='이전 페이지'
          >
            <ChevronLeft size={16} />
          </button>
          <span className='text-sm text-primary/60'>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className='p-1.5 border border-black/20 text-primary/60 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='다음 페이지'
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
