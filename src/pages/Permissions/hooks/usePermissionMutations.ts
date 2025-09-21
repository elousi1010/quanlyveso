import { useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionApi } from '../api';
import type { CreatePermissionDto, UpdatePermissionDto, SetPermissionsForUserDto } from '../types';

export const usePermissionMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreatePermissionDto) => permissionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionDto }) =>
      permissionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => permissionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });

  const setForUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SetPermissionsForUserDto }) =>
      permissionApi.setForUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    setForUserMutation,
  };
};
