import { api } from '@/utils/api';
import { withDefaultPagination } from '@/utils';
import type {
  InventoryTransactionSearchParams,
  InventoryTransactionListResponse,
} from '../types';

const API_BASE = '/api/v1/inventory-transaction-items';

export const inventoryTransactionApi = {
  // Get list of inventory transaction items
  getInventoryTransactions: async (params: InventoryTransactionSearchParams): Promise<InventoryTransactionListResponse> => {
    const response = await api.get(API_BASE, { params });
    // If API returns {data: [...], total: 2} directly, use it as is
    // If API returns {data: {data: [...], total: 2}}, use response.data.data
    const apiData = response as InventoryTransactionListResponse;
    return apiData;
  },

  // Get single inventory transaction item
  // getInventoryTransaction: async (id: string): Promise<InventoryTransactionItem> => {
  //   const response = await api.get(`${API_BASE}/${id}`);
  //   return (response.data as any).data;
  // },
};
