import { api } from '@/utils/api';
import { INVENTORY_CONSTANTS } from '../constants';
import type {
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryResponse,
  InventorySearchParams
} from '../types';

export const inventoryApi = {
  /**
   * Get all inventory with pagination, search, and sorting
   * Uses axios params for automatic query string building - cleaner and more maintainable.
   */
  getAll: async (params: InventorySearchParams = {}): Promise<InventoryResponse> => {
    const response = await api.get(INVENTORY_CONSTANTS.API_ENDPOINTS.BASE, {
      params: {
        page: params.page,
        limit: params.limit,
        searchKey: params.searchKey,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        ...params // Spread remaining filter params if any
      }
    });
    return (response as any).data;
  },

  /**
   * Get a specific inventory item by its ID
   */
  getById: async (id: string): Promise<Inventory> => {
    const response = await api.get(`${INVENTORY_CONSTANTS.API_ENDPOINTS.BASE}/${id}`);
    return (response as any).data;
  },

  /**
   * Create a new inventory record
   */
  create: async (data: CreateInventoryDto): Promise<Inventory> => {
    const response = await api.post(INVENTORY_CONSTANTS.API_ENDPOINTS.CREATE, data);
    return (response as any).data;
  },

  /**
   * Update an existing inventory record
   * Backend endpoint for update matches the base path
   */
  update: async (data: UpdateInventoryDto): Promise<Inventory> => {
    const response = await api.patch(INVENTORY_CONSTANTS.API_ENDPOINTS.UPDATE, data);
    return (response as any).data;
  },

  /**
   * Delete an inventory record by ID
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`${INVENTORY_CONSTANTS.API_ENDPOINTS.DELETE}/${id}`);
  },
};
