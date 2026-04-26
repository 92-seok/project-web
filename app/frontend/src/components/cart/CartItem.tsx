import { Link } from 'react-router-dom';
import { useCartStore, type ICartItem } from '@/store/cartStore';

interface ICartItemProps {
  item: ICartItem;
}

export function CartItem({ item }: ICartItemProps) {
  const { updateItem, removeItem, isLoading } = useCartStore();

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      removeItem(item.itemId);
    } else {
      updateItem(item.itemId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateItem(item.itemId, item.quantity + 1);
  };

  return (
    <div className='flex items-start gap-4 py-6 border-b last:border-0'>
      <div className='w-20 h-20 shrink-0 bg-secondary overflow-hidden'>
        <img
          src={item.imageUrl}
          alt={item.name}
          className='w-full h-full object-cover'
          width={80}
          height={80}
        />
      </div>

      <div className='flex-1 min-w-0'>
        <Link
          to={`/products/${item.productId}`}
          className='text-sm font-bold leading-snug hover:underline line-clamp-2'
        >
          {item.name}
        </Link>
        {item.originalPrice && (
          <p className='text-xs text-muted-foreground line-through mt-1'>
            {item.originalPrice.toLocaleString('ko-KR')}원
          </p>
        )}
        <p className='text-sm font-bold mt-1'>{item.price.toLocaleString('ko-KR')}원</p>
      </div>

      <div className='flex flex-col items-end gap-3 shrink-0'>
        <div className='flex items-center border border-border'>
          <button
            onClick={handleDecrease}
            disabled={isLoading}
            className='w-8 h-8 flex items-center justify-center hover:bg-secondary text-lg disabled:opacity-50'
            aria-label='수량 감소'
          >
            −
          </button>
          <span className='w-8 text-center text-sm'>{item.quantity}</span>
          <button
            onClick={handleIncrease}
            disabled={isLoading}
            className='w-8 h-8 flex items-center justify-center hover:bg-secondary text-lg disabled:opacity-50'
            aria-label='수량 증가'
          >
            +
          </button>
        </div>

        <p className='text-sm font-bold'>{item.subtotal.toLocaleString('ko-KR')}원</p>

        <button
          onClick={() => removeItem(item.itemId)}
          disabled={isLoading}
          className='text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 disabled:opacity-50'
        >
          삭제
        </button>
      </div>
    </div>
  );
}
