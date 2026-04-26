import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { orderApi } from '@/api/orderApi';
import { AddressSearch } from '@/components/address/AddressSearch';

const TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoh';

type Step = 1 | 2 | 3;

interface IShippingForm {
  name: string;
  phone: string;
  postalCode: string;
  address: string;
  jibunAddress: string;
  detailAddress: string;
  memo: string;
}

type PaymentType = 'card' | 'kakao' | 'naver' | 'transfer';

interface IPaymentMethod {
  type: PaymentType;
  label: string;
}

const PAYMENT_METHODS: IPaymentMethod[] = [
  { type: 'card', label: '신용/체크카드' },
  { type: 'kakao', label: '카카오페이' },
  { type: 'naver', label: '네이버페이' },
  { type: 'transfer', label: '계좌이체' },
];

const STEP_LABELS = ['배송정보', '결제수단', '최종확인'] as const;

interface IFieldProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
}

function Field({ label, value, onChange, placeholder, required = false, readOnly = false }: IFieldProps) {
  return (
    <div>
      <label className='text-[11px] tracking-widest uppercase text-muted-foreground font-bold block mb-1.5'>
        {label}{required && ' *'}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className='w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all disabled:bg-secondary'
      />
    </div>
  );
}

interface IStep1Props {
  form: IShippingForm;
  onChange: (form: IShippingForm) => void;
}

function Step1({ form, onChange }: IStep1Props) {
  const update = (key: keyof IShippingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...form, [key]: e.target.value });

  return (
    <div className='space-y-4'>
      <h2 className='font-editorial text-2xl font-bold mb-1'>배송 정보</h2>
      <p className='text-sm text-muted-foreground mb-6'>어디로 보내드릴까요?</p>
      <div className='grid grid-cols-2 gap-4'>
        <Field label='수령인' value={form.name} onChange={update('name')} required />
        <Field
          label='연락처'
          value={form.phone}
          onChange={update('phone')}
          placeholder='010-0000-0000'
          required
        />
      </div>
      <AddressSearch
        postalCode={form.postalCode}
        roadAddress={form.address}
        detailAddress={form.detailAddress}
        onAddressChange={(postalCode, roadAddress, jibunAddress) =>
          onChange({ ...form, postalCode, address: roadAddress, jibunAddress })
        }
        onDetailChange={(detail) => onChange({ ...form, detailAddress: detail })}
      />
      <select
        value={form.memo}
        onChange={update('memo')}
        className='w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-background'
      >
        <option value=''>배송 메모 선택</option>
        <option>문 앞에 놓아주세요</option>
        <option>경비실에 맡겨주세요</option>
        <option>부재 시 연락 부탁드립니다</option>
      </select>
    </div>
  );
}

interface IStep2Props {
  payment: PaymentType;
  onChange: (type: PaymentType) => void;
}

function Step2({ payment, onChange }: IStep2Props) {
  return (
    <div className='space-y-4'>
      <h2 className='font-editorial text-2xl font-bold mb-1'>결제 수단</h2>
      <p className='text-sm text-muted-foreground mb-6'>편한 방법으로 결제해주세요</p>
      <div className='grid grid-cols-2 gap-3'>
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.type}
            onClick={() => onChange(method.type)}
            className={`py-4 rounded-xl border text-sm font-semibold transition-all ${
              payment === method.type
                ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                : 'border-border hover:border-accent hover:text-accent'
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface IStep3Props {
  form: IShippingForm;
  payment: PaymentType;
}

function Step3({ form, payment }: IStep3Props) {
  const { items } = useCartStore();
  const paymentLabel = PAYMENT_METHODS.find((m) => m.type === payment)?.label ?? '';

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='font-editorial text-2xl font-bold mb-1'>최종 확인</h2>
        <p className='text-sm text-muted-foreground'>주문 내용을 한번 더 확인해주세요</p>
      </div>

      <div className='rounded-xl border border-border p-5 space-y-3'>
        <p className='text-xs font-semibold text-accent uppercase tracking-wider'>배송지</p>
        <div className='text-sm space-y-1 text-muted-foreground'>
          <p className='text-foreground font-semibold'>{form.name} · {form.phone}</p>
          <p>{form.address} {form.detailAddress}</p>
          {form.memo && <p className='text-xs'>📝 {form.memo}</p>}
        </div>
      </div>

      <div className='rounded-xl border border-border p-5 space-y-3'>
        <p className='text-xs font-semibold text-accent uppercase tracking-wider'>결제 수단</p>
        <p className='text-sm font-semibold text-foreground'>{paymentLabel}</p>
      </div>

      <div className='rounded-xl border border-border p-5 space-y-4'>
        <p className='text-xs font-semibold text-accent uppercase tracking-wider'>주문 상품</p>
        <div className='space-y-3'>
          {items.map((item) => (
            <div key={item.itemId} className='flex items-center gap-3'>
              <div className='w-14 h-14 shrink-0 rounded-lg bg-secondary overflow-hidden'>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className='w-full h-full object-cover'
                  width={56}
                  height={56}
                />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium line-clamp-1 text-foreground'>{item.name}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>수량 {item.quantity}</p>
              </div>
              <p className='text-sm font-bold shrink-0 text-foreground'>
                {(item.price * item.quantity).toLocaleString('ko-KR')}원
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { items } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingForm, setShippingForm] = useState<IShippingForm>({
    name: user?.name ?? '',
    phone: '',
    postalCode: '',
    address: '',
    jibunAddress: '',
    detailAddress: '',
    memo: '',
  });
  const [payment, setPayment] = useState<PaymentType>('card');

  // 장바구니가 비어있으면 cart로 redirect
  if (items.length === 0) {
    navigate('/cart', { replace: true });
    return null;
  }

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      // 1. 백엔드에 주문 생성
      const order = await orderApi.createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        receiverName: shippingForm.name,
        receiverPhone: shippingForm.phone,
        postalCode: shippingForm.postalCode,
        roadAddress: shippingForm.address,
        detailAddress: shippingForm.detailAddress || undefined,
        deliveryMemo: shippingForm.memo || undefined,
      });

      // 2. 토스페이먼츠 결제창 호출 (성공 시 리다이렉트되므로 이후 코드 실행 안 됨)
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const tossPayment = tossPayments.payment({
        customerKey: `customer-${user?.memberId ?? 'guest'}`,
      });

      await tossPayment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: order.totalPrice },
        orderId: order.orderNumber,
        orderName:
          order.items.length > 1
            ? `${order.items[0].name} 외 ${order.items.length - 1}건`
            : (order.items[0]?.name ?? '주문'),
        customerName: user?.name ?? '고객',
        customerEmail: '',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch {
      toast.error('결제를 시작할 수 없습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen'>
      {/* 스텝 인디케이터 */}
      <div className='flex items-center px-4 md:px-8 py-6 border-b border-border bg-secondary/30 gap-0'>
        {STEP_LABELS.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <React.Fragment key={label}>
              <div className='flex items-center gap-2'>
                <span
                  className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full transition-colors ${
                    isDone
                      ? 'bg-accent text-accent-foreground'
                      : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border text-muted-foreground'
                  }`}
                >
                  {isDone ? '✓' : stepNum}
                </span>
                <span
                  className={`text-xs font-semibold hidden md:block ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors ${
                    step > stepNum ? 'bg-accent' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className='px-4 md:px-8 py-8 md:grid md:grid-cols-[1fr_320px] md:gap-12 md:items-start'>
        <div>
          {step === 1 && <Step1 form={shippingForm} onChange={setShippingForm} />}
          {step === 2 && <Step2 payment={payment} onChange={setPayment} />}
          {step === 3 && <Step3 form={shippingForm} payment={payment} />}

          <div className='flex gap-3 mt-8'>
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as Step)}
                disabled={isSubmitting}
                className='flex-1 py-3.5 rounded-full border border-border text-foreground text-sm font-semibold hover:border-accent hover:text-accent transition-colors disabled:opacity-50'
              >
                이전
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as Step)}
                className='flex-[1.4] py-3.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 transition-opacity'
              >
                다음 단계로 →
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={isSubmitting}
                className='flex-[1.4] py-3.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 transition-opacity disabled:opacity-50'
              >
                {isSubmitting ? '처리 중...' : '결제하기 ✨'}
              </button>
            )}
          </div>
        </div>

        <div>
          <OrderSummary items={items} onCheckout={() => {}} isCheckout />
        </div>
      </div>
    </div>
  );
}
