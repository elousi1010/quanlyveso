import { api } from '@/utils/api';
import type { 
  Organization, 
  CreateOrganizationDto, 
  UpdateMyOrganizationDto, 
  OrganizationResponse, 
  OrganizationSearchParams 
} from '../types';

const API_BASE = 'https://lottery.esimvn.net/api/v1';

export const organizationApi = {
  // Get all organizations with pagination and search
  getAll: async (params: OrganizationSearchParams = {}): Promise<OrganizationResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.searchKey) searchParams.append('searchKey', params.searchKey);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await api.get<OrganizationResponse>(`${API_BASE}/organizations?${searchParams.toString()}`);
    return response;
  },

  // Get organization by ID
  getById: async (id: string): Promise<Organization> => {
    const response = await api.get<Organization>(`${API_BASE}/organizations/${id}`);
    return response;
  },

  // Create new organization
  create: async (data: CreateOrganizationDto): Promise<Organization> => {
    const response = await api.post<Organization>(`${API_BASE}/organizations`, data);
    return response;
  },

  // Update organization
  update: async (id: string, data: UpdateMyOrganizationDto): Promise<Organization> => {
    const response = await api.patch<Organization>(`${API_BASE}/organizations/${id}`, data);
    return response;
  },
};
