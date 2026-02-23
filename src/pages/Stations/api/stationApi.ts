import { api } from '@/utils/api';
import type {
  CreateStationDto,
  UpdateStationDto,
  StationListResponse,
  StationResponse,
  CreateStationResponse,
  UpdateStationResponse,
  DeleteStationResponse,
  StationSearchParams
} from '../types';

const API_BASE = '/stations';

/**
 * Station API
 * 
 * Standardized API service for managing lottery stations.
 */
export const stationApi = {
  // Get all stations with pagination and search
  getAll: async (params: StationSearchParams = {}): Promise<StationListResponse> => {
    const response = await api.get(API_BASE, { params });
    return response as unknown as StationListResponse;
  },

  // Get station by ID
  getById: async (id: string): Promise<StationResponse> => {
    return api.get<StationResponse>(`${API_BASE}/${id}`);
  },

  // Create new station
  create: async (data: CreateStationDto): Promise<CreateStationResponse> => {
    return api.post<CreateStationResponse>(API_BASE, data);
  },

  // Update station
  update: async (id: string, data: UpdateStationDto): Promise<UpdateStationResponse> => {
    return api.patch<UpdateStationResponse>(`${API_BASE}/${id}`, data);
  },

  // Delete station
  delete: async (id: string): Promise<DeleteStationResponse> => {
    return api.delete<DeleteStationResponse>(`${API_BASE}/${id}`);
  },
};
