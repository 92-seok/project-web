import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadApi } from '@/api/uploadApi';

interface IImageUploaderProps {
  value: string[]; // 업로드 완료된 URL 배열 (제어 컴포넌트)
  onChange: (urls: string[]) => void;
  maxCount?: number; // 최대 업로드 개수
  subDir?: string; // 백엔드 저장 분류 (예: 'pet', 'review')
  size?: 'sm' | 'md' | 'lg' | 'xl'; // 썸네일 사이즈
  helperText?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (백엔드와 동일 — application.yml max-file-size)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const SIZE_CLASSES = {
  sm: 'w-24 h-24',   // 96px — 다중 첨부(리뷰 등)
  md: 'w-32 h-32',   // 128px — 기본
  lg: 'w-40 h-40',   // 160px — 단일 프로필 사진
  xl: 'w-48 h-48',   // 192px — 큼직한 프로필
};

/**
 * 이미지 업로더 — 다중 이미지 업로드 + 미리보기 + 개별 삭제
 *
 * - 백엔드 `/api/uploads/image` 호출 → URL 반환받아 onChange 로 부모에 전달
 * - maxCount 도달 시 추가 버튼 숨김
 * - 파일 검증(타입/크기)는 클라+서버 양쪽에서
 */
export function ImageUploader({
  value,
  onChange,
  maxCount = 3,
  subDir,
  size = 'md',
  helperText,
}: IImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const sizeClass = SIZE_CLASSES[size];
  const canAddMore = value.length < maxCount;

  const handlePickFiles = () => inputRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxCount - value.length;
    const selected = Array.from(files).slice(0, remainingSlots);

    // 클라이언트 사전 검증
    for (const file of selected) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error('지원하지 않는 파일 형식입니다 (jpg/png/webp/gif)');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`파일이 너무 큽니다 (10MB 이하): ${file.name}`);
        return;
      }
    }

    setIsUploading(true);
    try {
      // 병렬 업로드
      const results = await Promise.all(selected.map((f) => uploadApi.uploadImage(f, subDir)));
      onChange([...value, ...results.map((r) => r.url)]);
    } catch (err) {
      console.error('[ImageUploader] 업로드 실패', err);
      const apiErr = err as { code?: string; message?: string };
      toast.error(`업로드 실패: ${apiErr?.message ?? '알 수 없는 오류'}`);
    } finally {
      setIsUploading(false);
      // 같은 파일 다시 선택할 수 있도록 input value 리셋
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap gap-2 items-start'>
        {/* 업로드된 이미지 미리보기 */}
        {value.map((url, i) => (
          <div
            key={url + i}
            className={`relative ${sizeClass} rounded-lg overflow-hidden border border-border bg-secondary group`}
          >
            <img src={url} alt={`업로드 이미지 ${i + 1}`} className='w-full h-full object-cover' />
            <button
              type='button'
              onClick={() => handleRemove(i)}
              aria-label={`이미지 ${i + 1} 삭제`}
              className='absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground/70 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground'
            >
              <X className='w-3 h-3' />
            </button>
          </div>
        ))}

        {/* 추가 버튼 */}
        {canAddMore && (
          <button
            type='button'
            onClick={handlePickFiles}
            disabled={isUploading}
            aria-label='이미지 추가'
            className={`${sizeClass} rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-accent hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUploading ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              <>
                <ImagePlus className='w-5 h-5' strokeWidth={1.5} />
                <span className='text-[10px] font-semibold'>
                  {value.length}/{maxCount}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {helperText && (
        <p className='text-xs text-muted-foreground'>{helperText}</p>
      )}

      <input
        ref={inputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp,image/gif'
        multiple={maxCount > 1}
        className='hidden'
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
