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

      // Invalidate all partners queries
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });

    },
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartnerRequest }) =>
      partnerApi.updatePartner(id, data),
    onSuccess: (response, variables) => {

      // Invalidate all partners queries
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
      // Invalidate specific partner detail
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(variables.id) });

    },
  });
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => partnerApi.deletePartner(id),
    onSuccess: (response) => {

      // Invalidate all partners queries
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });

    },
  });
};

export const useTogglePartnerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      partnerApi.togglePartnerStatus(id, is_active),
    onSuccess: (response, variables) => {

      // Invalidate all partners queries
      queryClient.invalidateQueries({ queryKey: partnerKeys.all });
      // Invalidate specific partner detail
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(variables.id) });

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
