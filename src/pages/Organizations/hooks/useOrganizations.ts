import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../api';
import type { OrganizationSearchParams } from '../types';

export const useOrganizations = (params: OrganizationSearchParams = {}) => {
  const query = useQuery({
    queryKey: ['organizations', params],
    queryFn: () => organizationApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    organizations: query.data?.data || [],
    total: query.data?.total || 0,
  };
};
