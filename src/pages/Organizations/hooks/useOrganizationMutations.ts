import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationApi } from '../api';
import type { CreateOrganizationDto, UpdateOrganizationDto } from '../types';

export const useOrganizationMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateOrganizationDto) => organizationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationDto }) =>
      organizationApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  return {
    createMutation,
    updateMutation,
  };
};
