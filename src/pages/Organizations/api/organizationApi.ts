import { api } from '@/utils/api';
import type {
    CreateOrganizationDto,
    UpdateMyOrganizationDto,
    OrganizationListResponse,
    OrganizationResponse,
    OrganizationSearchParams
} from '../types';

const API_BASE = '/api/v1/organizations';

/**
 * Organization API
 * 
 * Standardized API service for managing organizations.
 */
export const organizationApi = {
    // Get all organizations with pagination and search
    getAll: async (params: OrganizationSearchParams = {}): Promise<OrganizationListResponse> => {
        return api.get<OrganizationListResponse>(API_BASE, { params });
    },

    // Get specific organization (findMe based on ID)
    getById: async (id: string): Promise<OrganizationResponse> => {
        return api.get<OrganizationResponse>(`${API_BASE}/${id}`);
    },

    // Create new organization
    create: async (data: CreateOrganizationDto): Promise<OrganizationResponse> => {
        return api.post<OrganizationResponse>(API_BASE, data);
    },

    // Update specific organization (updateMe based on ID)
    update: async (id: string, data: UpdateMyOrganizationDto): Promise<OrganizationResponse> => {
        return api.patch<OrganizationResponse>(`${API_BASE}/${id}`, data);
    },
};
