import { api } from '@/utils/api';
import { withDefaultPagination } from '@/utils';
import type {
  PartnerListResponse,
  PartnerResponse,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  CreatePartnerResponse,
  PartnerSearchParams
} from '../types';

const API_BASE = '/api/v1/partners';

/**
 * Partner API
 * 
 * Standardized API service for managing business partners.
 */
export const partnerApi = {
  // Get all partners
  getPartners: async (searchParams?: Partial<PartnerSearchParams>): Promise<PartnerListResponse> => {
    // Apply default pagination
    const params = withDefaultPagination(searchParams);
    const response = await api.get(API_BASE, { params });
    return response as unknown as PartnerListResponse;
  },

  // Get partner by ID
  getPartnerById: async (id: string): Promise<PartnerResponse> => {
    const response = await api.get(`${API_BASE}/${id}`);
    return response as unknown as PartnerResponse;
  },

  // Create new partner
  createPartner: async (data: CreatePartnerRequest): Promise<CreatePartnerResponse> => {
    const response = await api.post(API_BASE, data);
    return response as unknown as CreatePartnerResponse;
  },

  // Update partner
  updatePartner: async (id: string, data: UpdatePartnerRequest): Promise<PartnerResponse> => {
    const response = await api.patch(`${API_BASE}/${id}`, data);
    return response as unknown as PartnerResponse;
  },

  // Delete partner
  deletePartner: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  // Toggle partner active status
  togglePartnerStatus: async (id: string, is_active: boolean): Promise<PartnerResponse> => {
    const response = await api.patch(`${API_BASE}/${id}/status`, { is_active });
    return (response as any).data;
  },
};
