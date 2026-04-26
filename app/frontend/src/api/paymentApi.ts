import { apiClient } from './client';

export interface IConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface IConfirmPaymentResponse {
  paymentKey: string;
  orderId: string;
  method: string;
  totalAmount: number;
  status: string;
  approvedAt: string;
}

export const paymentApi = {
  confirm: (data: IConfirmPaymentRequest) =>
    apiClient.post<IConfirmPaymentResponse>('/payments/confirm', data).then((r) => r.data),
};
