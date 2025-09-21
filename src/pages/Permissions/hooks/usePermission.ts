import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '../api';

export const usePermission = (id: string) => {
  return useQuery({
    queryKey: ['permission', id],
    queryFn: () => permissionApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
