import { useQuery } from '@tanstack/react-query';
import { partnerApi } from '../api';
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
export const usePartners = (searchParams?: PartnerSearchParams) => {
  return useQuery({
    queryKey: partnerKeys.list((searchParams || {}) as Record<string, unknown>),
    queryFn: async () => {
      const response = await partnerApi.getPartners(searchParams);
      console.log('Partners API Response:', response);
      return response;
    },
    enabled: true, // Always enabled, let the API handle empty params
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
