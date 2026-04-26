import type { IProduct } from '@/types/product';
import { MOCK_PRODUCTS } from './mockProducts';

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface IOrderItem {
  product: Pick<IProduct, 'id' | 'name' | 'price' | 'imageUrl'>;
  quantity: number;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: IOrderItem[];
  totalPrice: number;
  shippingFee: number;
  createdAt: string;
  deliveredAt?: string;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: '결제 완료',
  confirmed: '주문 확인',
  shipping: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소됨',
};

export const MOCK_ORDERS: IOrder[] = [
  {
    id: '1',
    orderNumber: 'PAW-20260412',
    status: 'delivered',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 2 },
      { product: MOCK_PRODUCTS[1], quantity: 1 },
    ],
    totalPrice: 65600,
    shippingFee: 0,
    createdAt: '2026-04-12',
    deliveredAt: '2026-04-14',
  },
  {
    id: '2',
    orderNumber: 'PAW-20260418',
    status: 'shipping',
    items: [
      { product: MOCK_PRODUCTS[3], quantity: 1 },
    ],
    totalPrice: 17000,
    shippingFee: 3000,
    createdAt: '2026-04-18',
  },
  {
    id: '3',
    orderNumber: 'PAW-20260424',
    status: 'confirmed',
    items: [
      { product: MOCK_PRODUCTS[6], quantity: 3 },
    ],
    totalPrice: 29400,
    shippingFee: 0,
    createdAt: '2026-04-24',
  },
];
