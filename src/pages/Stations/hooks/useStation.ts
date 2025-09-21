import { useQuery } from '@tanstack/react-query';
import { stationApi } from '../api';

export const useStation = (id: string) => {
  return useQuery({
    queryKey: ['station', id],
    queryFn: () => stationApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
