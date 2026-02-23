import { useQuery } from '@tanstack/react-query';
import { partnerApi } from '../api';
import { DEFAULT_PAGINATION } from '@/types/pagination';
import type { PartnerSearchParams } from '../types';
import { MOCK_PARTNER_LIST_RESPONSE } from '@/data/commonMockData';

// Query keys for Partners
export const partnerKeys = {
  all: ['partners'] as const,
  lists: () => [...partnerKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...partnerKeys.lists(), params] as const,
  details: () => [...partnerKeys.all, 'detail'] as const,
  detail: (id: string) => [...partnerKeys.details(), id] as const,
};

// Page-specific hook for Partners list
export const usePartners = (searchParams?: Partial<PartnerSearchParams>) => {
  const params = {
    page: searchParams?.page || DEFAULT_PAGINATION.page,
    limit: searchParams?.limit || DEFAULT_PAGINATION.limit,
    ...searchParams,
  };

  return useQuery({
    queryKey: partnerKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      try {
        const response = await partnerApi.getPartners(params);
        if (!response?.data?.data?.data || response.data.data.data.length === 0) {
          return MOCK_PARTNER_LIST_RESPONSE;
        }
        return response;
      } catch (error) {
        console.warn('Partners API failed, using mock data');
        return MOCK_PARTNER_LIST_RESPONSE;
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};
