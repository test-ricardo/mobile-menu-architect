
import { useQuery } from '@tanstack/react-query';
import { TransportesIndex } from '@/types/transporte';
import api from '@/hooks/useApi';

export const useTransportes = (page: number = 1) => {
  return useQuery({
    queryKey: ['transportes', page],
    queryFn: async (): Promise<TransportesIndex> => {
      const response = await api.get(`/v1/transporte?page=${page}&per_page=10`);
      return response.data;
    },
  });
};
