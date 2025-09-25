import { useInfiniteScroll } from './useInfiniteScroll';
import { userApi } from '@/pages/Users/api';
import type { User } from '@/pages/Users/types';

export interface UseInfiniteUsersParams {
  searchKey?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useInfiniteUsers = (params: UseInfiniteUsersParams = {}) => {
  return useInfiniteScroll<User>({
    queryKey: ['users', 'infinite', params.searchKey || ''],
    queryFn: async (queryParams) => {
      // Chỉ gửi searchKey khi nó có giá trị và không rỗng
      const apiParams: {
        page?: number;
        limit?: number;
        role?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        searchKey?: string;
      } = {
        page: queryParams.page,
        limit: queryParams.limit,
        role: params.role,
        status: params.status,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      };

      // Chỉ thêm searchKey khi nó có giá trị
      if (params.searchKey && params.searchKey.trim() !== '') {
        apiParams.searchKey = params.searchKey;
      }

      const response = await userApi.getUsers(apiParams);
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: queryParams.page || 1,
        limit: queryParams.limit || 5,
      };
    },
    initialParams: params as Record<string, unknown>,
    enabled: true,
  });
};

export default useInfiniteUsers;
