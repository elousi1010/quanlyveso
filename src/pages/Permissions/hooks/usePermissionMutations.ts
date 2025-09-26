import { useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionApi } from '../api';
import type { 
  CreatePermissionDto, 
  UpdatePermissionDto, 
  SetPermissionsForUserDto,
  BulkPermissionAssignment,
  CreatePermissionTemplateDto,
  UpdatePermissionTemplateDto
} from '../types';

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
    mutationFn: ({ permissionId, data }: { permissionId: string; data: SetPermissionsForUserDto }) =>
      permissionApi.setForUser(permissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const bulkAssignMutation = useMutation({
    mutationFn: (data: BulkPermissionAssignment) => permissionApi.bulkAssignPermissions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: (data: CreatePermissionTemplateDto) => permissionApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permission-templates'] });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionTemplateDto }) =>
      permissionApi.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permission-templates'] });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => permissionApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permission-templates'] });
    },
  });

  const applyTemplateMutation = useMutation({
    mutationFn: ({ userId, templateId }: { userId: string; templateId: string }) =>
      permissionApi.applyTemplateToUser(userId, templateId),
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
    bulkAssignMutation,
    createTemplateMutation,
    updateTemplateMutation,
    deleteTemplateMutation,
    applyTemplateMutation,
  };
};
