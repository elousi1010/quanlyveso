export interface Inventory {
  id: string;
  // Note: Swagger shows empty properties for CreateInventoryDto and UpdateInventoryDto
  // This suggests the inventory structure might be defined elsewhere or is minimal
  created_at?: string;
  updated_at?: string;
}

export interface CreateInventoryDto {
  // Empty based on Swagger schema
}

export interface UpdateInventoryDto {
  // Empty based on Swagger schema
}

export interface InventoryResponse {
  data: Inventory[];
  total: number;
  page: number;
  limit: number;
}

export interface InventorySearchParams {
  searchKey?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
