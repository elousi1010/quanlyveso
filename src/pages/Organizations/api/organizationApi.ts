import { api } from '@/utils/api';
import type { 
  CreateOrganizationDto, 
  UpdateOrganizationDto,
  UpdateMyOrganizationDto, 
  OrganizationListResponse,
  OrganizationResponse,
  CreateOrganizationResponse,
  UpdateOrganizationResponse,
  DeleteOrganizationResponse,
  OrganizationSearchParams 
} from '../types';

const API_BASE = 'https://lottery.esimvn.net/api/v1';

export const organizationApi = {
  // Get all organizations with pagination and search
  getAll: async (params: OrganizationSearchParams = {}): Promise<OrganizationListResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.searchKey) searchParams.append('searchKey', params.searchKey);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await api.get<OrganizationListResponse>(`${API_BASE}/organizations?${searchParams.toString()}`);
    return response;
  },

  // Get organization by ID
  getById: async (id: string): Promise<OrganizationResponse> => {
    const response = await api.get<OrganizationResponse>(`${API_BASE}/organizations/${id}`);
    return response;
  },

  // Create new organization
  create: async (data: CreateOrganizationDto): Promise<CreateOrganizationResponse> => {
    // Filter out undefined values to avoid sending owner_id if not provided
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );
    const response = await api.post<CreateOrganizationResponse>(`${API_BASE}/organizations`, filteredData);
    return response;
  },

  // Update organization
  update: async (id: string, data: UpdateOrganizationDto): Promise<UpdateOrganizationResponse> => {
    const response = await api.patch<UpdateOrganizationResponse>(`${API_BASE}/organizations/${id}`, data);
    return response;
  },

  // Update my organization
  updateMy: async (data: UpdateMyOrganizationDto): Promise<UpdateOrganizationResponse> => {
    const response = await api.patch<UpdateOrganizationResponse>(`${API_BASE}/organizations/my`, data);
    return response;
  },

  // Delete organization
  delete: async (id: string): Promise<DeleteOrganizationResponse> => {
    const response = await api.delete<DeleteOrganizationResponse>(`${API_BASE}/organizations/${id}`);
    return response;
  },
};
