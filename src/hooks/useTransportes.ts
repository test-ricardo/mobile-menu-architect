
import { useQuery } from '@tanstack/react-query';
import { TransportesIndex } from '@/types/transporte';
import api from '@/hooks/useApi';

export interface TransportesFilters {
  zone?: string | number;
  [key: string]: string | number | undefined;
}

export const useTransportes = (page: number = 1, search: string = "", filters: TransportesFilters = {}) => {
  // Construir query string de filtros
  const filtersQuery = Object.entries(filters)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `&${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join("");

  return useQuery({
    queryKey: ['transportes', page, search, filters],
    queryFn: async (): Promise<TransportesIndex> => {
      const response = await api.get(`/v1/transporte?page=${page}&per_page=10${search ? `&search=${encodeURIComponent(search)}` : ''}${filtersQuery}`);
      return response.data;
    },
  });
};
