import { useState } from 'react';

interface IImageGalleryProps {
  imageUrl: string;
  name: string;
}

// 외부 이미지 로드 실패 시 폴백 — 안정적인 Unsplash 큐레이션
const FALLBACK = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80&auto=format&fit=crop';

export function ImageGallery({ imageUrl, name }: IImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  // 백엔드에서 다중 이미지 내려주기 전까지는 동일 이미지 4장
  const thumbnails = [imageUrl, imageUrl, imageUrl, imageUrl];

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK) img.src = FALLBACK;
  };

  return (
    <>
      {/* 모바일 */}
      <div className='md:hidden aspect-square rounded-2xl bg-secondary overflow-hidden'>
        <img
          src={imageUrl}
          alt={name}
          loading='eager'
          onError={handleError}
          className='w-full h-full object-cover'
        />
      </div>

      {/* 데스크톱 */}
      <div className='hidden md:flex gap-3'>
        {/* 썸네일 열 */}
        <div className='flex flex-col gap-2 w-20'>
          {thumbnails.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                selected === i ? 'border-accent' : 'border-transparent hover:border-border'
              }`}
              aria-label={`이미지 ${i + 1} 선택`}
            >
              <img
                src={url}
                alt={`${name} 썸네일 ${i + 1}`}
                loading='lazy'
                onError={handleError}
                className='w-full h-full object-cover'
              />
            </button>
          ))}
        </div>

        {/* 메인 이미지 */}
        <div className='flex-1 aspect-square rounded-2xl overflow-hidden bg-secondary'>
          <img
            src={thumbnails[selected]}
            alt={name}
            loading='eager'
            onError={handleError}
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </>
  );
}
