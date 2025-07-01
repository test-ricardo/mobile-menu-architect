
import { useQuery } from '@tanstack/react-query';
import { TransportesIndex } from '@/types/transporte';

const API_BASE_URL = 'https://appapi.dev-bc.duckdns.org/api/v1';

export const useTransportes = (page: number = 1) => {
  return useQuery({
    queryKey: ['transportes', page],
    queryFn: async (): Promise<TransportesIndex> => {
      const response = await fetch(`${API_BASE_URL}/transporte?page=${page}`);
      if (!response.ok) {
        throw new Error('Error fetching transportes');
      }
      return response.json();
    },
  });
};
