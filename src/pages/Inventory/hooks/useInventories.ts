import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api';
import type { InventorySearchParams } from '../types';

export const useInventories = (params: InventorySearchParams = {}) => {
  return useQuery({
    queryKey: ['inventories', params],
    queryFn: () => inventoryApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
