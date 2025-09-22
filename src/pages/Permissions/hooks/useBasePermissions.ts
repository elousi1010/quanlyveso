import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '../api';
import type { BasePermissionsResponse } from '../types';

export const useBasePermissions = () => {
  return useQuery<BasePermissionsResponse>({
    queryKey: ['base-permissions'],
    queryFn: () => permissionApi.getBasePermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
