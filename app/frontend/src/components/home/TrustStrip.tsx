import { Truck, RefreshCcw, Stethoscope, ShieldCheck } from 'lucide-react';

const ITEMS = [
  {
    Icon: Truck,
    title: '내일 새벽 도착',
    desc: '오후 3시 전 주문 시',
  },
  {
    Icon: RefreshCcw,
    title: '정기배송 -10%',
    desc: '언제든 해지 가능',
  },
  {
    Icon: Stethoscope,
    title: '수의사 검증 큐레이션',
    desc: '전문가가 골랐어요',
  },
  {
    Icon: ShieldCheck,
    title: '7일 무조건 교환',
    desc: '맞지 않으면 반품',
  },
];

export function TrustStrip() {
  return (
    <section className='border-y bg-secondary/50'>
      <div className='max-w-[1440px] mx-auto px-4 md:px-8 py-6'>
        <ul className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
          {ITEMS.map(({ Icon, title, desc }) => (
            <li key={title} className='flex items-center justify-center gap-3'>
              <span className='shrink-0 w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary'>
                <Icon className='w-5 h-5' strokeWidth={1.8} />
              </span>
              <div className='leading-snug'>
                <p className='text-sm font-semibold text-foreground'>{title}</p>
                <p className='text-[11px] text-muted-foreground mt-1'>{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
