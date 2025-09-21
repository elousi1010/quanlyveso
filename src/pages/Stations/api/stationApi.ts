import { api } from '@/utils/api';
import type { 
  Station, 
  CreateStationDto, 
  UpdateStationDto, 
  StationListResponse,
  StationResponse,
  CreateStationResponse,
  UpdateStationResponse,
  DeleteStationResponse,
  StationSearchParams
} from '../types';

const API_BASE = 'https://api.ohna12.netlify.app/api/v1';

export const stationApi = {
  // Get all stations with pagination and search
  getAll: async (params: StationSearchParams = {}): Promise<StationListResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.searchKey) searchParams.append('searchKey', params.searchKey);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await api.get<StationListResponse>(`${API_BASE}/stations?${searchParams.toString()}`);
    return response;
  },

  // Get station by ID
  getById: async (id: string): Promise<StationResponse> => {
    const response = await api.get<StationResponse>(`${API_BASE}/stations/${id}`);
    return response;
  },

  // Create new station
  create: async (data: CreateStationDto): Promise<CreateStationResponse> => {
    const response = await api.post<CreateStationResponse>(`${API_BASE}/stations`, data);
    return response;
  },

  // Update station
  update: async (id: string, data: UpdateStationDto): Promise<UpdateStationResponse> => {
    const response = await api.patch<UpdateStationResponse>(`${API_BASE}/stations/${id}`, data);
    return response;
  },

  // Delete station
  delete: async (id: string): Promise<DeleteStationResponse> => {
    const response = await api.delete<DeleteStationResponse>(`${API_BASE}/stations/${id}`);
    return response;
  },
};
