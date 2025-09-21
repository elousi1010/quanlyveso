import { api } from '@/utils/api';
import type { 
  Station, 
  CreateStationDto, 
  UpdateStationDto, 
  StationResponse, 
  StationSearchParams,
  ApiResponse
} from '../types';

const API_BASE = 'https://lottery.esimvn.net/api/v1';

export const stationApi = {
  // Get all stations with pagination and search
  getAll: async (params: StationSearchParams = {}): Promise<StationResponse> => {
    const searchParams = new URLSearchParams();
    
    // Add search parameters
    if (params.searchKey) searchParams.append('searchKey', params.searchKey);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await api.get<StationResponse>(`${API_BASE}/stations?${searchParams.toString()}`);
    
    // Handle different response structures
    if (response.data && Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.total || response.data.length,
        page: response.page || 1,
        limit: response.limit || 10,
        success: response.success || true,
        message: response.message
      };
    }
    
    return response;
  },

  // Get station by ID
  getById: async (id: string): Promise<Station> => {
    const response = await api.get<ApiResponse<Station>>(`${API_BASE}/stations/${id}`);
    
    // Handle different response structures
    if (response.data) {
      return response.data;
    }
    
    return response as unknown as Station;
  },

  // Create new station
  create: async (data: CreateStationDto): Promise<Station> => {
    const response = await api.post<ApiResponse<Station>>(`${API_BASE}/stations`, data);
    
    // Handle different response structures
    if (response.data) {
      return response.data;
    }
    
    return response as unknown as Station;
  },

  // Update station
  update: async (id: string, data: UpdateStationDto): Promise<Station> => {
    const response = await api.patch<ApiResponse<Station>>(`${API_BASE}/stations/${id}`, data);
    
    // Handle different response structures
    if (response.data) {
      return response.data;
    }
    
    return response as unknown as Station;
  },

  // Delete station
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/stations/${id}`);
  },
};
