import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '../api';
import type { Permission } from '../types';

export const useUserPermissions = (userId: string) => {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: () => permissionApi.getUserPermissions(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserPermissionMatrix = (userIds: string[]) => {
  return useQuery({
    queryKey: ['user-permission-matrix', userIds],
    queryFn: async () => {
      const userPermissions = await Promise.all(
        userIds.map(async (userId) => {
          const permissions = await permissionApi.getUserPermissions(userId);
          return { userId, permissions };
        })
      );
      
      return userPermissions.reduce((acc, { userId, permissions }) => {
        acc[userId] = permissions.map(p => p.id);
        return acc;
      }, {} as Record<string, string[]>);
    },
    enabled: userIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });
};
