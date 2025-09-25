import { useInfiniteScroll } from './useInfiniteScroll';
import { stationApi } from '@/pages/Stations/api';
import type { Station } from '@/pages/Stations/types';

export interface UseInfiniteStationsParams {
  searchKey?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useInfiniteStations = (params: UseInfiniteStationsParams = {}) => {
  return useInfiniteScroll<Station>({
    queryKey: ['stations', 'infinite', params.searchKey || ''],
    queryFn: async (queryParams) => {
      // Chỉ gửi searchKey khi nó có giá trị và không rỗng
      const apiParams: {
        page?: number;
        limit?: number;
        status?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        searchKey?: string;
      } = {
        page: queryParams.page,
        limit: queryParams.limit,
        status: params.status,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      };

      // Chỉ thêm searchKey khi nó có giá trị
      if (params.searchKey && params.searchKey.trim() !== '') {
        apiParams.searchKey = params.searchKey;
      }

      const response = await stationApi.getAll(apiParams);
      
      return {
        data: response.data?.data || [],
        total: response.data?.total || 0,
        page: queryParams.page || 1,
        limit: queryParams.limit || 5,
      };
    },
    initialParams: params as Record<string, unknown>,
    enabled: true,
  });
};

export default useInfiniteStations;
