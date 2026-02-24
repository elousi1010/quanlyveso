import { useInfiniteScroll } from './useInfiniteScroll';
import { organizationApi } from '@/pages/Organizations/api/organizationApi';
import type { Organization } from '@/pages/Organizations/types';

export interface UseInfiniteOrganizationsParams {
    searchKey?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const useInfiniteOrganizations = (params: UseInfiniteOrganizationsParams = {}) => {
    return useInfiniteScroll<Organization>({
        queryKey: ['organizations', 'infinite', params.searchKey || ''],
        queryFn: async (queryParams) => {
            const apiParams: {
                page?: number;
                limit?: number;
                sortBy?: string;
                sortOrder?: 'asc' | 'desc';
                searchKey?: string;
            } = {
                page: queryParams.page,
                limit: queryParams.limit,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
            };

            if (params.searchKey && params.searchKey.trim() !== '') {
                apiParams.searchKey = params.searchKey;
            }

            const response = await organizationApi.getAll(apiParams);

            return {
                data: response.data?.data || [],
                total: response.data?.total || 0,
                page: queryParams.page || 1,
                limit: queryParams.limit || 5, // Just assuming 5 as standard if limit is not passed like in other hooks
            };
        },
        initialParams: params as Record<string, unknown>,
        enabled: true,
    });
};

export default useInfiniteOrganizations;
