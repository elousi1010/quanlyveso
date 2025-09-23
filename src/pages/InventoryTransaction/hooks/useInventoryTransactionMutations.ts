import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryTransactionApi } from '../api';
import type { 
  CreateInventoryTransactionItemDto, 
  UpdateInventoryTransactionItemDto,
  InventoryTransactionSearchParams 
} from '../types';

export const useInventoryTransactionMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: inventoryTransactionApi.createInventoryTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryTransactionItemDto }) =>
      inventoryTransactionApi.updateInventoryTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryTransactionApi.deleteInventoryTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: inventoryTransactionApi.bulkDeleteInventoryTransactions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    bulkDeleteMutation,
  };
};
