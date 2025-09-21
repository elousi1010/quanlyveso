import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api';
import type { CreateInventoryDto, UpdateInventoryDto } from '../types';

export const useInventoryMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateInventoryDto) => inventoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryDto }) =>
      inventoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
