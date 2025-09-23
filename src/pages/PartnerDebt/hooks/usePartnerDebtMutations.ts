import { useMutation, useQueryClient } from '@tanstack/react-query';
import { partnerDebtApi } from '../api';
import type { 
  CreatePartnerDebtRequest, 
  UpdatePartnerDebtRequest 
} from '../types';

export const usePartnerDebtMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreatePartnerDebtRequest) => partnerDebtApi.createPartnerDebt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerDebts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartnerDebtRequest }) => 
      partnerDebtApi.updatePartnerDebt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerDebts'] });
      queryClient.invalidateQueries({ queryKey: ['partnerDebt'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => partnerDebtApi.deletePartnerDebt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerDebts'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => 
      partnerDebtApi.togglePartnerDebtStatus(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerDebts'] });
      queryClient.invalidateQueries({ queryKey: ['partnerDebt'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    toggleStatusMutation,
  };
};
