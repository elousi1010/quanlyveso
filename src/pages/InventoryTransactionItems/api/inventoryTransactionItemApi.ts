import { api } from '@/utils/api';
import type {
    InventoryTransactionItemSearchParams,
    InventoryTransactionItemListResponse,
    InventoryTransactionItemResponse
} from '../types';

const API_BASE = '/api/v1/inventory-transaction-items';

/**
 * Inventory Transaction Items API
 * 
 * Standardized API service for querying inventory transaction items.
 */
export const inventoryTransactionItemApi = {
    // Get all inventory transaction items with pagination and filters
    getAll: async (params: InventoryTransactionItemSearchParams = {}): Promise<InventoryTransactionItemListResponse> => {
        return api.get<InventoryTransactionItemListResponse>(API_BASE, { params });
    },

    // Get specific inventory transaction item by ID
    getById: async (id: string): Promise<InventoryTransactionItemResponse> => {
        return api.get<InventoryTransactionItemResponse>(`${API_BASE}/${id}`);
    },
};
