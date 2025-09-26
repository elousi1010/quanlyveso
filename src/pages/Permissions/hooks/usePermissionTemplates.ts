import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '../api';
import type { PermissionTemplate } from '../types';

export const usePermissionTemplates = () => {
  return useQuery({
    queryKey: ['permission-templates'],
    queryFn: () => permissionApi.getTemplates(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePermissionTemplate = (id: string) => {
  return useQuery({
    queryKey: ['permission-template', id],
    queryFn: () => permissionApi.getTemplates().then(templates => 
      templates.find(template => template.id === id)
    ),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
