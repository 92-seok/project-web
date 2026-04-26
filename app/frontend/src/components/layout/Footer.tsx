import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className='text-sm'>
      {/* 상단: 3컬럼 링크 */}
      <div className='bg-muted'>
        <div className='max-w-screen-xl mx-auto px-4 md:px-8 py-10'>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-8 text-xs'>
            <div className='space-y-3'>
              <p className='font-bold tracking-widest uppercase text-foreground'>쇼핑</p>
              <div className='space-y-2 text-muted-foreground'>
                <p>
                  <Link to='/products?pet=dog' className='hover:text-foreground transition-colors'>
                    강아지
                  </Link>
                </p>
                <p>
                  <Link to='/products?pet=cat' className='hover:text-foreground transition-colors'>
                    고양이
                  </Link>
                </p>
                <p>
                  <Link
                    to='/products?category=food'
                    className='hover:text-foreground transition-colors'
                  >
                    사료
                  </Link>
                </p>
                <p>
                  <Link
                    to='/products?sort=sale'
                    className='hover:text-foreground transition-colors'
                  >
                    특가
                  </Link>
                </p>
              </div>
            </div>

            <div className='space-y-3'>
              <p className='font-bold tracking-widest uppercase text-foreground'>고객지원</p>
              <div className='space-y-2 text-muted-foreground'>
                <p>
                  <Link to='/support' className='hover:text-foreground transition-colors'>
                    고객센터
                  </Link>
                </p>
                <p>
                  <Link to='/orders' className='hover:text-foreground transition-colors'>
                    주문조회
                  </Link>
                </p>
                <p>
                  <Link to='/faq' className='hover:text-foreground transition-colors'>
                    자주 묻는 질문
                  </Link>
                </p>
                <p>
                  <Link to='/returns' className='hover:text-foreground transition-colors'>
                    반품/교환
                  </Link>
                </p>
              </div>
            </div>

            <div className='space-y-3'>
              <p className='font-bold tracking-widest uppercase text-foreground'>회사소개</p>
              <div className='space-y-2 text-muted-foreground'>
                <p>
                  <Link to='/about' className='hover:text-foreground transition-colors'>
                    회사 소개
                  </Link>
                </p>
                <p>
                  <Link to='/terms' className='hover:text-foreground transition-colors'>
                    이용약관
                  </Link>
                </p>
                <p>
                  <Link to='/privacy' className='hover:text-foreground transition-colors'>
                    개인정보처리방침
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 중단: 고객센터 */}
      <div className='border-t bg-muted'>
        <div className='max-w-screen-xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
          <div>
            <p className='text-xs text-muted-foreground mb-1'>고객센터</p>
            <p className='text-2xl font-black tracking-tight'>1588-0000</p>
          </div>
          <div className='text-xs text-muted-foreground space-y-1'>
            <p>평일 09:00 ~ 18:00 (토·일·공휴일 휴무)</p>
            <p>점심시간 12:00 ~ 13:00</p>
          </div>
        </div>
      </div>

      {/* 하단: 사업자정보 + 저작권 */}
      <div className='bg-muted/50 border-t'>
        <div className='max-w-screen-xl mx-auto px-4 md:px-8 py-5'>
          <p className='text-[11px] text-muted-foreground leading-relaxed mb-2'>
            상호: 주식회사 Pawmart&nbsp;&nbsp;|&nbsp;&nbsp;대표자: 홍길동&nbsp;&nbsp;|&nbsp;&nbsp;
            사업자등록번호: 000-00-00000&nbsp;&nbsp;|&nbsp;&nbsp;통신판매업신고: 제2026-서울-0000호
          </p>
          <p className='text-[11px] text-muted-foreground leading-relaxed mb-3'>
            주소: 서울특별시 강남구 테헤란로 000, 00층&nbsp;&nbsp;|&nbsp;&nbsp;
            이메일: help@pawmart.co.kr
          </p>
          <p className='text-[11px] text-muted-foreground'>
            © 2026 Pawmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
