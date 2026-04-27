import { useState, useEffect, useCallback } from 'react';
import { Bird, Cat, Dog, Fish, PawPrint, Pencil, Plus, Rabbit, Trash2, Turtle, X } from 'lucide-react';
import { toast } from 'sonner';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { ImageUploader } from '@/components/common/ImageUploader';
import { petApi, type IPet, type IPetRequest, type PetType } from '@/api/petApi';

const PET_TYPE_OPTIONS: { value: PetType; label: string; Icon: React.ElementType }[] = [
  { value: 'DOG', label: '강아지', Icon: Dog },
  { value: 'CAT', label: '고양이', Icon: Cat },
  { value: 'BIRD', label: '새', Icon: Bird },
  { value: 'FISH', label: '물고기', Icon: Fish },
  { value: 'REPTILE', label: '파충류', Icon: Turtle },
  { value: 'SMALL', label: '소동물', Icon: Rabbit },
];

const TYPE_LABEL: Record<PetType, string> = PET_TYPE_OPTIONS.reduce(
  (acc, o) => ({ ...acc, [o.value]: o.label }),
  {} as Record<PetType, string>,
);

const TYPE_ICON: Record<PetType, React.ElementType> = PET_TYPE_OPTIONS.reduce(
  (acc, o) => ({ ...acc, [o.value]: o.Icon }),
  {} as Record<PetType, React.ElementType>,
);

interface IPetFormProps {
  initial: IPet | null;
  onClose: () => void;
  onSaved: () => void;
}

function PetForm({ initial, onClose, onSaved }: IPetFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState<PetType>(initial?.type ?? 'DOG');
  const [age, setAge] = useState<string>(initial?.age != null ? String(initial.age) : '');
  const [imageUrls, setImageUrls] = useState<string[]>(initial?.imageUrl ? [initial.imageUrl] : []);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('이름을 입력해주세요');
      return;
    }
    setIsSaving(true);
    const body: IPetRequest = {
      name: name.trim(),
      type,
      age: age.trim() ? Number(age) : null,
      imageUrl: imageUrls[0] ?? null,
    };
    try {
      if (initial) {
        await petApi.update(initial.id, body);
        toast.success('펫 정보가 수정되었습니다');
      } else {
        await petApi.create(body);
        toast.success('펫이 등록되었습니다');
      }
      onSaved();
      onClose();
    } catch (err) {
      const apiErr = err as { message?: string };
      toast.error(apiErr?.message ?? '저장에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4'>
      <div className='bg-background w-full max-w-md rounded-2xl border border-border max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-border'>
          <h2 className='font-editorial text-xl font-bold'>
            {initial ? '펫 정보 수정' : '펫 등록'}
          </h2>
          <button onClick={onClose} aria-label='닫기' className='text-muted-foreground hover:text-foreground'>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-5'>
          {/* 이미지 */}
          <div>
            <p className='text-xs font-semibold text-foreground/80 mb-2'>프로필 사진</p>
            <ImageUploader
              value={imageUrls}
              onChange={setImageUrls}
              maxCount={1}
              subDir='pet'
              size='xl'
              helperText='jpg/png/webp/gif · 10MB 이하'
            />
          </div>

          {/* 이름 */}
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-foreground/80'>이름 *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='예: 뽀삐'
              maxLength={50}
              className='w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all'
            />
          </div>

          {/* 종류 */}
          <div className='space-y-2'>
            <label className='text-xs font-semibold text-foreground/80'>종류 *</label>
            <div className='grid grid-cols-3 gap-2'>
              {PET_TYPE_OPTIONS.map(({ value, label, Icon }) => {
                const isActive = type === value;
                return (
                  <button
                    key={value}
                    type='button'
                    onClick={() => setType(value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                        : 'border-border text-foreground/70 hover:border-accent hover:text-accent'
                    }`}
                  >
                    <Icon className='w-5 h-5' strokeWidth={1.6} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 나이 */}
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-foreground/80'>
              나이 (선택)
            </label>
            <input
              type='number'
              min={0}
              max={50}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder='몇 살이에요?'
              className='w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all'
            />
          </div>

          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-3 rounded-full border border-border text-sm font-semibold hover:border-accent hover:text-accent transition-colors'
            >
              취소
            </button>
            <button
              type='submit'
              disabled={isSaving}
              className='flex-[1.4] py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition-opacity'
            >
              {isSaving ? '저장 중...' : initial ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface IPetCardProps {
  pet: IPet;
  onEdit: () => void;
  onDelete: () => void;
}

function PetCard({ pet, onEdit, onDelete }: IPetCardProps) {
  const Icon = TYPE_ICON[pet.type] ?? PawPrint;

  return (
    <div className='group relative rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition-colors'>
      <div className='flex items-center gap-5'>
        {/* 프로필 이미지 또는 종류 아이콘 */}
        <div className='shrink-0 w-24 h-24 rounded-2xl bg-secondary overflow-hidden flex items-center justify-center'>
          {pet.imageUrl ? (
            <img src={pet.imageUrl} alt={pet.name} className='w-full h-full object-cover' />
          ) : (
            <Icon className='w-10 h-10 text-muted-foreground' strokeWidth={1.4} />
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <p className='font-editorial text-xl font-bold text-foreground'>{pet.name}</p>
          <p className='text-sm text-muted-foreground mt-1'>
            {TYPE_LABEL[pet.type] ?? pet.type}
            {pet.age != null && ` · ${pet.age}살`}
          </p>
        </div>

        <div className='flex flex-col gap-1.5'>
          <button
            onClick={onEdit}
            aria-label='수정'
            className='p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors'
          >
            <Pencil className='w-4 h-4' />
          </button>
          <button
            onClick={onDelete}
            aria-label='삭제'
            className='p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
}

export function PetManagePage() {
  const [pets, setPets] = useState<IPet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<IPet | null | 'new'>(null);

  const fetchPets = useCallback(() => {
    setIsLoading(true);
    petApi
      .getMyPets()
      .then(setPets)
      .catch(() => {
        // 에러 시 빈 상태 유지
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 펫을 삭제하시겠습니까?')) return;
    try {
      await petApi.delete(id);
      toast.success('삭제되었습니다');
      fetchPets();
    } catch (err) {
      const apiErr = err as { message?: string };
      toast.error(apiErr?.message ?? '삭제에 실패했습니다');
    }
  };

  return (
    <MyPageLayout activeMenu='/mypage/pets'>
      <div>
        <div className='flex items-end justify-between mb-6'>
          <div>
            <p className='text-[10px] tracking-[0.3em] font-semibold uppercase text-accent mb-1'>
              MY PETS
            </p>
            <h2 className='font-editorial text-2xl font-bold'>내 반려동물</h2>
          </div>
          <button
            onClick={() => setEditing('new')}
            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-95 transition-opacity'
          >
            <Plus className='w-4 h-4' />
            펫 등록
          </button>
        </div>

        {isLoading && (
          <div className='space-y-3'>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className='rounded-2xl border border-border bg-card p-5 animate-pulse'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-2xl bg-secondary' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-5 w-32 bg-secondary rounded' />
                    <div className='h-3 w-24 bg-secondary rounded' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && pets.length === 0 && (
          <div className='py-16 text-center'>
            <PawPrint className='w-12 h-12 text-muted-foreground mx-auto mb-4' strokeWidth={1} />
            <p className='text-sm text-muted-foreground mb-4'>등록된 반려동물이 없어요</p>
            <button
              onClick={() => setEditing('new')}
              className='inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border text-sm font-semibold hover:border-accent hover:text-accent transition-colors'
            >
              <Plus className='w-4 h-4' />
              첫 반려동물 등록하기
            </button>
          </div>
        )}

        {!isLoading && pets.length > 0 && (
          <div className='space-y-3'>
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={() => setEditing(pet)}
                onDelete={() => handleDelete(pet.id)}
              />
            ))}
          </div>
        )}
      </div>

      {editing !== null && (
        <PetForm
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={fetchPets}
        />
      )}
    </MyPageLayout>
  );
}
