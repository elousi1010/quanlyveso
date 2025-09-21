import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '../api';
import type { PermissionSearchParams } from '../types';

export const usePermissions = (params: PermissionSearchParams = {}) => {
  return useQuery({
    queryKey: ['permissions', params],
    queryFn: () => permissionApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBasePermissions = () => {
  return useQuery({
    queryKey: ['permissions', 'base'],
    queryFn: () => permissionApi.getBasePermissions(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
