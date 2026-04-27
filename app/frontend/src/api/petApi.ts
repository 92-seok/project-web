import { apiClient } from './client';

export type PetType = 'DOG' | 'CAT' | 'BIRD' | 'FISH' | 'REPTILE' | 'SMALL';

export interface IPet {
  id: number;
  name: string;
  type: PetType;
  age: number | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface IPetRequest {
  name: string;
  type: PetType;
  age?: number | null;
  imageUrl?: string | null;
}

export const petApi = {
  getMyPets: () => apiClient.get<IPet[]>('/pets').then((r) => r.data),

  create: (data: IPetRequest) =>
    apiClient.post<IPet>('/pets', data).then((r) => r.data),

  update: (id: number, data: IPetRequest) =>
    apiClient.put<IPet>(`/pets/${id}`, data).then((r) => r.data),

  delete: (id: number) => apiClient.delete(`/pets/${id}`),
};
