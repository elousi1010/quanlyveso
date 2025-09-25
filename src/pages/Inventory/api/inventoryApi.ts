import { api } from '@/utils/api';
import { withDefaultPagination } from '@/utils';
import type { 
  Inventory, 
  CreateInventoryDto, 
  UpdateInventoryDto, 
  InventoryResponse, 
  InventorySearchParams 
} from '../types';

const API_BASE = 'https://lottery.esimvn.net/api/v1';

export const inventoryApi = {
  // Get all inventory with pagination and search
  getAll: async (params: InventorySearchParams = {}): Promise<InventoryResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.searchKey) searchParams.append('searchKey', params.searchKey);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await api.get(`${API_BASE}/inventory?${searchParams.toString()}`);
    return (response as any).data;
  },

  // Get inventory by ID
  getById: async (id: string): Promise<Inventory> => {
    const response = await api.get(`${API_BASE}/inventory/${id}`);
    return (response as any).data;
  },

  // Create new inventory
  create: async (data: CreateInventoryDto): Promise<Inventory> => {
    const response = await api.post(`${API_BASE}/inventory`, data);
    return (response as any).data;
  },

  // Update inventory
  update: async (data: UpdateInventoryDto): Promise<Inventory> => {
    const response = await api.patch(`${API_BASE}/inventory`, data);
    return (response as any).data;
  },

  // Delete inventory
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/inventory/${id}`);
  },
};
