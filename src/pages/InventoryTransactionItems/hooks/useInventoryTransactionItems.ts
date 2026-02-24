import { useQuery } from '@tanstack/react-query';
import { inventoryTransactionItemApi } from '../api/inventoryTransactionItemApi';
import type { InventoryTransactionItemSearchParams } from '../types';

export const inventoryTransactionItemKeys = {
    all: ['inventoryTransactionItems'] as const,
    lists: () => [...inventoryTransactionItemKeys.all, 'list'] as const,
    list: (params: InventoryTransactionItemSearchParams) => [...inventoryTransactionItemKeys.lists(), params] as const,
    details: () => [...inventoryTransactionItemKeys.all, 'detail'] as const,
    detail: (id: string) => [...inventoryTransactionItemKeys.details(), id] as const,
};

export const useInventoryTransactionItems = (params: InventoryTransactionItemSearchParams = {}) => {
    return useQuery({
        queryKey: inventoryTransactionItemKeys.list(params),
        queryFn: () => inventoryTransactionItemApi.getAll(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useInventoryTransactionItem = (id: string) => {
    return useQuery({
        queryKey: inventoryTransactionItemKeys.detail(id),
        queryFn: () => inventoryTransactionItemApi.getById(id),
        enabled: !!id,
    });
};
