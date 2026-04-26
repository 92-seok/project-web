import { useKakaoPostcode } from '@/hooks/useKakaoPostcode';

interface IAddressSearchProps {
  postalCode: string;
  roadAddress: string;
  detailAddress: string;
  onAddressChange: (postalCode: string, roadAddress: string, jibunAddress: string) => void;
  onDetailChange: (detail: string) => void;
}

export function AddressSearch({
  postalCode,
  roadAddress,
  detailAddress,
  onAddressChange,
  onDetailChange,
}: IAddressSearchProps) {
  const { openPostcode } = useKakaoPostcode(({ zonecode, roadAddress: road, jibunAddress }) => {
    onAddressChange(zonecode, road, jibunAddress);
  });

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <input
          value={postalCode}
          readOnly
          placeholder='우편번호'
          className='w-28 border border-border px-3 py-2.5 text-sm outline-none bg-secondary text-muted-foreground'
        />
        <button
          type='button'
          onClick={openPostcode}
          className='px-4 py-2.5 border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors'
        >
          주소 검색
        </button>
      </div>
      <input
        value={roadAddress}
        readOnly
        placeholder='도로명 주소'
        className='w-full border border-border px-3 py-2.5 text-sm outline-none bg-secondary text-muted-foreground'
      />
      <input
        value={detailAddress}
        onChange={(e) => onDetailChange(e.target.value)}
        placeholder='상세 주소 (동, 호수 등)'
        className='w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors'
      />
    </div>
  );
}
