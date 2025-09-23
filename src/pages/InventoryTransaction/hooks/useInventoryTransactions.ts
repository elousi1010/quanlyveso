import { useQuery } from '@tanstack/react-query';
import { inventoryTransactionApi } from '../api';
import type { InventoryTransactionSearchParams } from '../types';

export const useInventoryTransactions = (params: InventoryTransactionSearchParams) => {
  return useQuery({
    queryKey: ['inventory-transactions', params],
    queryFn: () => inventoryTransactionApi.getInventoryTransactions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
