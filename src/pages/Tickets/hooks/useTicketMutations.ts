import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../api';
import type { CreateTicketDto, UpdateTicketDto } from '../types';

export const useTicketMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateTicketDto) => ticketApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketDto }) =>
      ticketApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ticketApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
