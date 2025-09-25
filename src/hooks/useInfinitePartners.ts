import { useInfiniteScroll } from './useInfiniteScroll';
import { partnerApi } from '@/pages/Partners/api';
import type { Partner } from '@/pages/Partners/types';

export interface UseInfinitePartnersParams {
  searchKey?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useInfinitePartners = (params: UseInfinitePartnersParams = {}) => {
  return useInfiniteScroll<Partner>({
    queryKey: ['partners', 'infinite', params.searchKey || ''],
    queryFn: async (queryParams) => {
      // Chỉ gửi searchKey khi nó có giá trị và không rỗng
      const apiParams: {
        page?: number;
        limit?: number;
        type?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        searchKey?: string;
      } = {
        page: queryParams.page,
        limit: queryParams.limit,
        type: params.type,
        status: params.status,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      };

      // Chỉ thêm searchKey khi nó có giá trị
      if (params.searchKey && params.searchKey.trim() !== '') {
        apiParams.searchKey = params.searchKey;
      }

      const response = await partnerApi.getPartners(apiParams);
      
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

export default useInfinitePartners;
