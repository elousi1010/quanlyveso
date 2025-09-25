import { useQuery } from '@tanstack/react-query';
import { partnerApi } from '../api';
import { DEFAULT_PAGINATION } from '@/types/pagination';
import type { PartnerSearchParams } from '../types';

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
  // Ensure default pagination
  const params = {
    page: searchParams?.page || DEFAULT_PAGINATION.page,
    limit: searchParams?.limit || DEFAULT_PAGINATION.limit,
    ...searchParams,
  };

  return useQuery({
    queryKey: partnerKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      const response = await partnerApi.getPartners(params);

      return response;
    },
    enabled: true, // Always enabled, let the API handle empty params
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
