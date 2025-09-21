import api from '../../../utils/api';
import type {
  PartnerListResponse,
  PartnerResponse,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  CreatePartnerResponse
} from '../types';

// Partners page-specific API functions
export const partnerApi = {
  // Get all partners
  getPartners: async (params?: {
    searchKey?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PartnerListResponse> => {
    const response = await api.get('/api/v1/partners', { params });
    return response.data as PartnerListResponse;
  },

  // Get partner by ID
  getPartnerById: async (id: string): Promise<PartnerResponse> => {
    const response = await api.get(`/api/v1/partners/${id}`);
    return response.data as PartnerResponse;
  },

  // Create new partner
  createPartner: async (data: CreatePartnerRequest): Promise<CreatePartnerResponse> => {
    const response = await api.post('/api/v1/partners', data);
    return response.data as CreatePartnerResponse;
  },

  // Update partner
  updatePartner: async (id: string, data: UpdatePartnerRequest): Promise<PartnerResponse> => {
    const response = await api.patch(`/api/v1/partners/${id}`, data);
    return response.data as PartnerResponse;
  },

  // Delete partner
  deletePartner: async (id: string): Promise<{ message: string; error: string; statusCode: number }> => {
    const response = await api.delete(`/api/v1/partners/${id}`);
    return response.data as { message: string; error: string; statusCode: number };
  },

  // Toggle partner active status
  togglePartnerStatus: async (id: string, is_active: boolean): Promise<PartnerResponse> => {
    const response = await api.patch(`/api/v1/partners/${id}/status`, { is_active });
    return response.data as PartnerResponse;
  },
};
