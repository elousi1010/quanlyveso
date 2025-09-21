import { useMutation, useQueryClient } from '@tanstack/react-query';
import { partnerApi } from '../api';
import { partnerKeys } from './usePartners';
import type {
  CreatePartnerRequest,
  UpdatePartnerRequest
} from '../types';

// Page-specific mutation hooks for Partners
export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartnerRequest) => partnerApi.createPartner(data),
    onSuccess: (response) => {
      console.log('Create partner mutation success:', response);
      // Invalidate all partners queries
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
      console.log('Invalidated all partners queries');
    },
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartnerRequest }) =>
      partnerApi.updatePartner(id, data),
    onSuccess: (response, variables) => {
      console.log('Update partner mutation success:', response);
      // Invalidate all partners queries
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
      // Invalidate specific partner detail
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(variables.id) });
      console.log('Invalidated all partners queries and specific partner detail');
    },
  });
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => partnerApi.deletePartner(id),
    onSuccess: (response) => {
      console.log('Delete partner mutation success:', response);
      // Invalidate all partners queries
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
      console.log('Invalidated all partners queries');
    },
  });
};

export const useTogglePartnerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      partnerApi.togglePartnerStatus(id, is_active),
    onSuccess: (response, variables) => {
      console.log('Toggle partner status mutation success:', response);
      // Invalidate all partners queries
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
      // Invalidate specific partner detail
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(variables.id) });
      console.log('Invalidated all partners queries and specific partner detail');
    },
  });
};

// Combined mutations hook
export const usePartnerMutations = () => {
  const createMutation = useCreatePartner();
  const updateMutation = useUpdatePartner();
  const deleteMutation = useDeletePartner();
  const toggleStatusMutation = useTogglePartnerStatus();

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    toggleStatusMutation,
  };
};
