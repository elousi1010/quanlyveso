import { useQuery } from '@tanstack/react-query';
import { partnerApi } from '../api';

// Query keys for Partners
export const partnerKeys = {
  all: ['partners'] as const,
  lists: () => [...partnerKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...partnerKeys.lists(), params] as const,
  details: () => [...partnerKeys.all, 'detail'] as const,
  detail: (id: string) => [...partnerKeys.details(), id] as const,
};

// Page-specific hook for Partners list
export const usePartners = (params?: {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: partnerKeys.list(params || {}),
    queryFn: async () => {
      const response = await partnerApi.getPartners(params);
      console.log('Partners API Response:', response);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
