import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../api';

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: () => organizationApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
