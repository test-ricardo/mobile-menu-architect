
import { useQuery } from '@tanstack/react-query';
import { TransportesIndex } from '@/types/transporte';
import api from '@/hooks/useApi';

export const useTransportes = (page: number = 1, search: string = "") => {
  return useQuery({
    queryKey: ['transportes', page, search],
    queryFn: async (): Promise<TransportesIndex> => {
      const response = await api.get(`/v1/transporte?page=${page}&per_page=10${search ? `&search=${encodeURIComponent(search)}` : ''}`);
      return response.data;
    },
  });
};
