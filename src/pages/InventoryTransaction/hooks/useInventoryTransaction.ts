import { useQuery } from '@tanstack/react-query';
import { inventoryTransactionApi } from '../api';

export const useInventoryTransaction = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['inventory-transaction', id],
    queryFn: () => inventoryTransactionApi.getInventoryTransaction(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
