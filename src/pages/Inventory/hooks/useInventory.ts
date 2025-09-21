import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api';

export const useInventory = (id: string) => {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: () => inventoryApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
