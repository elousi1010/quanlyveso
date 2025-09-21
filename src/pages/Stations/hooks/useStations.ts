import { useQuery } from '@tanstack/react-query';
import { stationApi } from '../api';
import type { StationSearchParams } from '../types';

export const useStations = (params: StationSearchParams = {}) => {
  return useQuery({
    queryKey: ['stations', params],
    queryFn: () => stationApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
