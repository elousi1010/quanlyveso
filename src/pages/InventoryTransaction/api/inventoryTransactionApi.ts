import { api } from '@/utils/api';
import { INVENTORY_TRANSACTION_CONSTANTS } from '../constants';
import type {
  InventoryTransactionSearchParams,
  InventoryTransactionListResponse,
} from '../types';

export const inventoryTransactionApi = {
  /**
   * Get list of inventory transaction items
   * Uses centralized endpoint and clean params handling.
   */
  getInventoryTransactions: async (params: InventoryTransactionSearchParams): Promise<InventoryTransactionListResponse> => {
    const response = await api.get(INVENTORY_TRANSACTION_CONSTANTS.API_ENDPOINTS.BASE, { params });
    return response as InventoryTransactionListResponse;
  },
};
