import api from '../../../utils/api';
import type {
  PartnerListResponse,
  PartnerResponse,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  CreatePartnerResponse,
  PartnerSearchParams
} from '../types';

// Partners page-specific API functions
export const partnerApi = {
  // Get all partners
  getPartners: async (searchParams?: PartnerSearchParams): Promise<PartnerListResponse> => {
    const response = await api.get<PartnerListResponse>('/api/v1/partners', { params: searchParams });
    return response as unknown as PartnerListResponse;
  },

  // Get partner by ID
  getPartnerById: async (id: string): Promise<PartnerResponse> => {
    const response = await api.get<PartnerResponse>(`/api/v1/partners/${id}`);
    return response as unknown as PartnerResponse;
  },

  // Create new partner
  createPartner: async (data: CreatePartnerRequest): Promise<CreatePartnerResponse> => {
    const response = await api.post<CreatePartnerResponse>('/api/v1/partners', data);
    return response as unknown as CreatePartnerResponse;
  },

  // Update partner
  updatePartner: async (id: string, data: UpdatePartnerRequest): Promise<PartnerResponse> => {
    const response = await api.patch<PartnerResponse>(`/api/v1/partners/${id}`, data);
    return response as unknown as PartnerResponse;
  },

  // Delete partner
  deletePartner: async (id: string): Promise<{ message: string; error: string; statusCode: number }> => {
    const response = await api.delete<{ message: string; error: string; statusCode: number }>(`/api/v1/partners/${id}`);
    return response as unknown as { message: string; error: string; statusCode: number };
  },

  // Toggle partner active status
  togglePartnerStatus: async (id: string, is_active: boolean): Promise<PartnerResponse> => {
    const response = await api.patch<PartnerResponse>(`/api/v1/partners/${id}/status`, { is_active });
    return response as unknown as PartnerResponse;
  },
};
